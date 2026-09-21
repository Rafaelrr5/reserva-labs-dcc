# Reserva de Laboratórios — DCC

Trabalho de Engenharia de Software: **Interação Homem-Computador** e
**Qualidade de Software**.

Um mesmo sistema de reserva de laboratórios implementado em **duas versões**,
para tornar mensurável o efeito de decisões de projeto sobre a experiência de
quem usa e sobre a qualidade do código.

| Rota | O que é |
|---|---|
| `#/v1` | Dívida técnica deliberada: regra duplicada, `div` no lugar de botão, campos sem rótulo, contraste baixo |
| `#/v2` | Mesma funcionalidade refatorada: domínio isolado e testado, componentes extraídos, HTML semântico |

As duas versões rodam no mesmo aplicativo, lado a lado, para que a comparação
seja feita sobre o mesmo dado e o mesmo navegador.

## Resultado medido

| Instrumento | v1 | v2 |
|---|---|---|
| Nota Lighthouse (acessibilidade) | 78/100 | 100/100 |
| Violações axe-core | 3 regras, 8 elementos | 0 |
| **Tarefa concluída só com teclado** | **impossível** (22 paradas de foco) | concluída (6 paradas) |
| Testes de unidade | — | 19 passando |

O achado central: **o defeito mais grave da v1 — a reserva impossível de
concluir pelo teclado — não foi detectado por nenhuma das duas ferramentas.**
Não existe regra violada quando o elemento que seria verificado nem existe.
Explicado em [`docs/qualidade.md`](docs/qualidade.md).

## Como rodar

```bash
npm install
npm run dev          # http://localhost:5173

npm test             # 19 testes de unidade
npm run build && npm run preview
npm run auditoria    # compara as duas versões; falha se a v2 regredir
```

A auditoria precisa do `preview` rodando em outra aba.

## Documentação

Comece pela visão geral; os outros aprofundam cada frente.

| Arquivo | Conteúdo |
|---|---|
| [`docs/visao-geral.md`](docs/visao-geral.md) | **Comece aqui.** O que cada parte faz e por que existe |
| [`apresentacao/conceitos.html`](apresentacao/conceitos.html) | Slides de abertura: os conceitos, em 12 telas |
| [`docs/ihc.md`](docs/ihc.md) | Interação: tarefa, affordance, rótulo, retorno, consistência |
| [`docs/qualidade.md`](docs/qualidade.md) | Instrumentos: o que cada um mede, por que discordam, onde falham |
| [`docs/manutencao.md`](docs/manutencao.md) | Cada defeito da v1 e a técnica de refatoração aplicada |
| [`docs/apresentacao.md`](docs/apresentacao.md) | Roteiro cronometrado de 18 min com perguntas prováveis |
| [`docs/smells-planejados.md`](docs/smells-planejados.md) | Catálogo dos defeitos plantados |

## Aviso metodológico

Os defeitos da `v1` são **plantados de propósito**. Este repositório é uma
demonstração didática de técnicas de avaliação, não um estudo empírico: os
números descrevem estas duas implementações específicas e não se generalizam.
O que se generaliza é o método.

Não houve teste com usuários reais. A auditoria mede eficácia e um proxy de
esforço; satisfação e carga cognitiva ficam fora do que podemos afirmar.

## Escopo funcional

Reservar um laboratório do DCC em um horário, impedindo conflito com reservas já
existentes. Sem backend e sem banco — os dados vivem em memória, porque o objeto
de estudo é o código, não a infraestrutura.
