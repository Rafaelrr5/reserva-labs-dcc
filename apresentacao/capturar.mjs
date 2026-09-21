// Captura cada slide como PNG, para conferir o visual sem abrir navegador.
// Uso: node apresentacao/capturar.mjs
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

const destino = 'relatorios/slides';
mkdirSync(destino, { recursive: true });

const navegador = await chromium.launch();
const pagina = await navegador.newPage({ viewport: { width: 1280, height: 720 } });
await pagina.goto(pathToFileURL(resolve('apresentacao/conceitos.html')).href);

const total = await pagina.locator('.slide').count();
for (let i = 0; i < total; i++) {
  const n = String(i + 1).padStart(2, '0');
  await pagina.screenshot({ path: `${destino}/slide-${n}.png` });
  await pagina.keyboard.press('ArrowRight');
  await pagina.waitForTimeout(120);
}

await navegador.close();
console.log(`${total} slides em ${destino}/`);
