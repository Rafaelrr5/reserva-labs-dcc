// Auditoria comparativa das duas versoes.
//
// Mede a MESMA pagina com dois instrumentos diferentes e imprime os dois lado
// a lado, porque os numeros nao batem — e nao baterem e informacao, nao erro.
// A explicacao esta em docs/qualidade.md.
//
// Uso:  npm run auditoria
// Sai com codigo 1 se a v2 nao for melhor que a v1 em ambos os instrumentos.

import { chromium } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';
import lighthouse from 'lighthouse';
import { writeFileSync, mkdirSync } from 'node:fs';

const BASE = process.env.BASE_URL ?? 'http://localhost:4173';
const VERSOES = ['v1', 'v2'];
const PORTA_DEBUG = 9222;

async function medirAxe(contexto, versao) {
  const pagina = await contexto.newPage();
  await pagina.goto(`${BASE}/#/${versao}`, { waitUntil: 'load' });
  await pagina.waitForSelector('[data-testid="form-reserva"]');

  const resultado = await new AxeBuilder({ page: pagina })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();

  await pagina.close();

  return {
    versaoAxe: resultado.testEngine.version,
    violacoes: resultado.violations.map((v) => ({
      regra: v.id,
      impacto: v.impact,
      nos: v.nodes.length,
      descricao: v.help,
    })),
    totalNos: resultado.violations.reduce((s, v) => s + v.nodes.length, 0),
    incompletos: resultado.incomplete.length,
  };
}

// Verificacao por teclado: o que nenhuma das duas ferramentas detecta.
//
// Na v1 o acionador da reserva e uma <div onClick>. Nao existe regra violada:
// para o motor de acessibilidade aquilo e uma div comum, e div nao precisa ser
// focavel. A falha so aparece quando alguem tenta usar o teclado.
async function medirTeclado(contexto, versao) {
  const pagina = await contexto.newPage();
  await pagina.goto(`${BASE}/#/${versao}`, { waitUntil: 'load' });
  await pagina.waitForSelector('[data-testid="form-reserva"]');

  const acionador = pagina.locator('[data-testid="botao-reservar"]');
  await acionador.focus().catch(() => {});

  const recebeFoco = await acionador.evaluate((el) => el === document.activeElement);

  // Tenta chegar la so com Tab, a partir do inicio do documento.
  await pagina.evaluate(() => document.body.focus());
  let alcancavelPorTab = false;
  for (let i = 0; i < 40 && !alcancavelPorTab; i++) {
    await pagina.keyboard.press('Tab');
    alcancavelPorTab = await acionador.evaluate((el) => el === document.activeElement);
  }

  await pagina.close();
  return { recebeFoco, alcancavelPorTab };
}

async function medirLighthouse(versao) {
  const { lhr } = await lighthouse(`${BASE}/#/${versao}`, {
    port: PORTA_DEBUG,
    output: 'json',
    logLevel: 'error',
    onlyCategories: ['accessibility'],
  });

  const auditorias = lhr.categories.accessibility.auditRefs
    .filter((ref) => ref.weight > 0)
    .map((ref) => ({ ...ref, audit: lhr.audits[ref.id] }))
    .filter(({ audit }) => audit.score !== null);

  const pesoAplicavel = auditorias.reduce((s, a) => s + a.weight, 0);

  return {
    versaoLighthouse: lhr.lighthouseVersion,
    nota: Math.round(lhr.categories.accessibility.score * 100),
    pesoAplicavel,
    reprovadas: auditorias
      .filter(({ audit }) => audit.score === 0)
      .map((a) => ({
        regra: a.id,
        peso: a.weight,
        pontosPerdidos: Number(((a.weight / pesoAplicavel) * 100).toFixed(1)),
        nos: a.audit.details?.items?.length ?? 0,
      }))
      .sort((a, b) => b.pontosPerdidos - a.pontosPerdidos),
  };
}

function imprimirComparativo(medidas) {
  const [v1, v2] = VERSOES.map((v) => medidas[v]);

  console.log('\n=== Nota do Lighthouse (acessibilidade) ===\n');
  console.log(`  v1: ${v1.lh.nota}/100      v2: ${v2.lh.nota}/100`);
  console.log(`  Peso aplicavel: v1=${v1.lh.pesoAplicavel}  v2=${v2.lh.pesoAplicavel}`);
  console.log('  (o denominador e por pagina: auditorias nao aplicaveis saem da conta)');

  console.log('\n=== Violacoes do axe-core (viewport desktop) ===\n');
  for (const versao of VERSOES) {
    const a = medidas[versao].axe;
    console.log(`  ${versao}: ${a.violacoes.length} violacoes, ${a.totalNos} elementos`);
    for (const v of a.violacoes) {
      console.log(`      ${v.regra.padEnd(28)} ${String(v.nos).padStart(2)} elem  [${v.impacto}]`);
    }
    if (!a.violacoes.length) console.log('      nenhuma');
  }

  console.log('\n=== Operacao por teclado (nenhuma ferramenta detecta) ===\n');
  for (const versao of VERSOES) {
    const t = medidas[versao].teclado;
    console.log(
      `  ${versao}: recebe foco=${t.recebeFoco}   alcancavel por Tab=${t.alcancavelPorTab}`
    );
  }
  console.log('  O acionador da v1 e uma <div>: nao ha regra violada, so funcao ausente.');

  console.log('\n=== Por que os dois numeros nao batem ===\n');
  const regrasAxe = new Set(v1.axe.violacoes.map((v) => v.regra));
  const regrasLh = new Set(v1.lh.reprovadas.map((r) => r.regra));
  const soAxe = [...regrasAxe].filter((r) => !regrasLh.has(r));
  const soLh = [...regrasLh].filter((r) => !regrasAxe.has(r));

  console.log(`  axe-core ${v1.axe.versaoAxe}  x  Lighthouse ${v1.lh.versaoLighthouse}`);
  console.log(`  Detectado so pelo axe:        ${soAxe.join(', ') || '(nenhum)'}`);
  console.log(`  Reprovado so pelo Lighthouse: ${soLh.join(', ') || '(nenhum)'}`);
  console.log(`  Indecisos do axe na v1 (exigem verificacao humana): ${v1.axe.incompletos}`);

  console.log('\n  Custo em pontos na v1 (a mesma regra pesa diferente):');
  for (const r of v1.lh.reprovadas) {
    console.log(
      `      ${r.regra.padEnd(28)} ${String(r.nos).padStart(2)} elem  -${r.pontosPerdidos} pts`
    );
  }
}

const navegador = await chromium.launch({ args: [`--remote-debugging-port=${PORTA_DEBUG}`] });
const contexto = await navegador.newContext();
const medidas = {};

try {
  for (const versao of VERSOES) {
    medidas[versao] = {
      axe: await medirAxe(contexto, versao),
      teclado: await medirTeclado(contexto, versao),
      lh: await medirLighthouse(versao),
    };
  }
} finally {
  await navegador.close();
}

imprimirComparativo(medidas);

mkdirSync('relatorios', { recursive: true });
writeFileSync('relatorios/auditoria.json', JSON.stringify(medidas, null, 2));
console.log('\n  Dados completos em relatorios/auditoria.json');

// Porta de qualidade: a v2 precisa ser melhor nos dois instrumentos.
const notaSubiu = medidas.v2.lh.nota > medidas.v1.lh.nota;
const violacoesCairam = medidas.v2.axe.totalNos < medidas.v1.axe.totalNos;

console.log(
  `\n  Porta de qualidade: nota subiu=${notaSubiu}, elementos com violacao cairam=${violacoesCairam}`
);

if (!notaSubiu || !violacoesCairam) {
  console.error('\n  REPROVADO: a v2 nao superou a v1 nos dois instrumentos.\n');
  process.exit(1);
}
console.log('  APROVADO\n');
