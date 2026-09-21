# Divisão do trabalho

Dupla. A regra que evita conflito de merge: **depois do contrato congelado,
cada pessoa só escreve nos seus próprios arquivos.**

## Contrato congelado (feito em conjunto, antes de qualquer código)

Estes três itens não mudam sem acordo dos dois:

1. **Rotas**: `/v1` e `/v2`, mesma funcionalidade, mesmo dado.
2. **Dados**: `src/dados/laboratorios.js` e `src/dados/reservas-iniciais.js`.
3. **Marcadores de teste**: atributos `data-testid` usados pela auditoria,
   idênticos nas duas versões, listados em `docs/contrato-testid.md`.

## Pessoa A — Produto e Manutenção

Arquivos: `src/v1/**`, `src/v2/**`, `src/App.jsx`, `src/main.jsx`

- Implementa a `v1` com os defeitos combinados (ver `docs/smells-planejados.md`).
- Refatora para a `v2`, consumindo o módulo de domínio da Pessoa B.
- Escreve o capítulo de **Manutenção** do documento: catálogo de *code smells*
  da v1 e a refatoração correspondente na v2.
- Na apresentação (~7 min): mostra o código lado a lado e demonstra a navegação
  por teclado falhando na v1.

## Pessoa B — Qualidade e Verificação

Arquivos: `src/dominio/**`, `auditoria/**`, `docs/qualidade.md`

- Escreve o módulo de domínio puro (conflito de horário) com seus testes de
  unidade — **não depende da interface existir**, começa no dia 1.
- Escreve o script de auditoria que roda axe-core e Lighthouse nas duas rotas,
  imprime a tabela comparativa e falha se a v2 regredir.
- Escreve o capítulo de **Qualidade**: níveis de teste, o que cada instrumento
  detecta e — principalmente — o que ele não detecta.
- Na apresentação (~8 min): roda a auditoria ao vivo e explica a divergência
  entre os números do axe e do Lighthouse.

## Por que esta ordem destrava as duas frentes

A Pessoa B **não espera** a interface ficar pronta: o domínio é código puro.
A Pessoa A **não espera** o domínio: a v1 precisa justamente da regra duplicada
e errada, escrita à mão, que é o defeito a ser demonstrado. Só a v2 importa o
módulo da B — e quando chega nesse ponto, o módulo já existe e já está testado.

Isso também torna a história de manutenção literal em vez de teórica: na v1 a
mesma regra está copiada em três lugares e uma das cópias diverge; na v2 há uma
única fonte da verdade, coberta por testes.

## Andamento

O acompanhamento por etapas está em [`roadmap.md`](roadmap.md).
