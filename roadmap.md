# Andamento do projeto

Cada etapa é um commit (ou poucos). Marque ao concluir.

## Etapa 0 — Contrato (conjunto) ✅

- [x] Repositório e estrutura Vite + React
- [x] Dados congelados: laboratórios, horários, reservas iniciais
- [x] Marcadores de teste acordados entre as duas versões
- [x] Divisão de responsabilidades escrita

A partir daqui as duas trilhas correm em paralelo e não se cruzam.

---

## Trilha B — Qualidade e Verificação

### Etapa B1 — Domínio puro + testes de unidade ✅
- [x] `src/dominio/horario.js` — conversão e intervalo de uma reserva
- [x] `src/dominio/conflito.js` — regra única de sobreposição
- [x] `src/dominio/conflito.test.js` — 16 testes cobrindo encostar sem
      sobrepor, conter, cruzar, recurso e dia distintos, edição da própria
      reserva e entradas inválidas

Verificado por mutação: trocar `<` por `<=` na regra faz o teste de intervalo
semiaberto falhar. Os testes não passam por ausência.

### Etapa B2 — Auditoria automatizada
- [ ] `auditoria/auditar.mjs` — axe-core nas duas rotas via Playwright
- [ ] Lighthouse nas duas rotas, mesma sessão de navegador
- [ ] Tabela comparativa impressa no terminal
- [ ] Saída com código de erro se a v2 regredir

### Etapa B3 — Capítulo de Qualidade
- [ ] `docs/qualidade.md` — níveis de teste e o que cada um alcança
- [ ] Os três limites do instrumento (ver abaixo)

---

## Trilha A — Produto e Manutenção

### Etapa A1 — Casca do app
- [ ] `src/main.jsx`, `src/App.jsx` com as rotas `/v1` e `/v2`

### Etapa A2 — Versão 1 (dívida técnica deliberada)
- [ ] `src/v1/ReservaV1.jsx` — componente único, regra duplicada em três
      pontos, uma das cópias divergente
- [ ] `docs/smells-planejados.md` — catálogo do que foi plantado e por quê

### Etapa A3 — Versão 2 (refatorada)
- [ ] Componentes extraídos
- [ ] Consome `src/dominio/` em vez de reimplementar a regra
- [ ] HTML semântico e rótulos associados

### Etapa A4 — Capítulo de Manutenção
- [ ] `docs/manutencao.md` — cada *smell* da v1 e a técnica aplicada na v2

---

## Etapa Final — Apresentação (conjunto)

- [ ] Roteiro cronometrado, 15 a 20 minutos
- [ ] Ensaio com a auditoria rodando ao vivo
- [ ] Plano B: relatório salvo em arquivo, caso a rede ou o navegador falhem

---

## Os três limites do instrumento

Precisam aparecer no documento e na apresentação. São eles que separam "rodei
uma ferramenta" de "entendi o que a ferramenta mede".

1. **Lighthouse usa axe-core, mas os números não batem.** O Lighthouse roda um
   subconjunto das regras, converte cada regra em aprovado/reprovado com peso
   (doze elementos quebrados custam o mesmo que um) e audita em viewport móvel
   emulado. A auditoria direta roda em viewport de desktop. A divergência é
   estrutural, não é erro.

2. **Nota 100 não significa acessível.** O estudo da Deque sobre mais de duas
   mil auditorias mediu 57,38% do volume de problemas detectável por automação,
   cobrindo 16 dos 50 critérios WCAG 2.1 AA. Operação por teclado, ordem de
   foco e sentido para leitor de tela ficam fora — o próprio Lighthouse os
   classifica como verificação manual.

3. **Contraste de cor não é verificável fora do navegador.** Teste de
   componente em ambiente simulado não tem layout nem cor computada: ele
   detecta rótulo e nome acessível, mas silencia sobre contraste. Só a
   auditoria em navegador real enxerga esse defeito.
