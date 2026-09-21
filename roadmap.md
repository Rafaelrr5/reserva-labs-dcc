# Andamento do projeto

Todas as etapas concluídas. Números verificados por execução real.

## Etapa 0 — Contrato ✅
- [x] Repositório e estrutura Vite + React
- [x] Dados congelados: laboratórios, horários, reservas iniciais
- [x] Marcadores de teste comuns às duas versões

## Etapa 1 — Domínio + testes ✅
- [x] `src/dominio/horario.js` — conversão e intervalo de uma reserva
- [x] `src/dominio/conflito.js` — regra única de sobreposição
- [x] `src/dominio/conflito.test.js` — 16 testes

Verificado por mutação: trocar `<` por `<=` na regra faz o teste de intervalo
semiaberto falhar. Os testes não passam por ausência.

## Etapa 2 — Versão 1 ✅
- [x] `src/v1/ReservaV1.jsx` — monolítico, regra em 3 cópias, a terceira com `<=`
- [x] `src/v1/divergencia.test.js` — prova que envio e contador discordam às 10:00
- [x] `docs/smells-planejados.md`

## Etapa 3 — Versão 2 ✅
- [x] Componentes extraídos: `Campo`, `TabelaReservas`, `formatacao`
- [x] Consome `src/dominio/` em vez de reimplementar a regra
- [x] HTML semântico, rótulos associados, contraste corrigido

## Etapa 4 — Auditoria ✅
- [x] `auditoria/auditar.mjs` — axe-core, Lighthouse e teclado nas duas rotas
- [x] Tabela comparativa e reconciliação entre os instrumentos
- [x] Porta de qualidade: sai com erro se a v2 não superar a v1

## Etapa 5 — Documento ✅
- [x] `docs/qualidade.md`
- [x] `docs/manutencao.md`

## Etapa 6 — Apresentação ✅
- [x] `docs/apresentacao.md` — roteiro de 17 min com perguntas prováveis
- [ ] **Ensaio cronometrado** — pendente, depende de vocês

---

## Medições registradas

Execução em 21/09/2026, build de produção, axe-core 4.13.0, Lighthouse 13.5.0.

```
Lighthouse:  v1 78/100          v2 100/100
             peso aplicável: v1=139  v2=170

axe-core:    v1 3 violações / 8 elementos     v2 0
             color-contrast  2 elem  [serious]
             label           3 elem  [critical]
             select-name     3 elem  [critical]

Teclado:     v1 recebe foco=false, Tab=false
             v2 recebe foco=true,  Tab=true

Custo na v1: label -7,2 pts | select-name -7,2 | color-contrast -5
             heading-order -2,2 (só o Lighthouse reprova: é best-practice)
```

---

## Os três limites do instrumento

São eles que separam "rodei uma ferramenta" de "entendi o que a ferramenta
mede". Os três foram confirmados por medição própria, não apenas citados.

1. **Lighthouse usa axe-core e mesmo assim diverge.** Subconjunto de regras,
   agregação binária com pesos, denominador variável por página. Medido aqui:
   `heading-order` reprovado só pelo Lighthouse (é `best-practice`, fora do
   filtro WCAG da nossa execução); base de peso 139 na v1 contra 170 na v2.

2. **Nota 100 não significa acessível.** A Deque mediu 57,38% do volume de
   problemas detectável por automação, cobrindo 16 dos 50 critérios WCAG 2.1
   AA. Operação por teclado, ordem de foco e sentido para leitor de tela ficam
   fora.

3. **O defeito mais grave escapou dos dois motores.** O falso botão da v1 não
   gera violação porque não existe regra para uma `div` que deveria ser botão.
   Falso negativo por ausência — só a verificação de teclado o encontra. Este
   substituiu o limite que havíamos previsto (contraste em ambiente simulado),
   por ser mais forte e ter sido observado na prática.
