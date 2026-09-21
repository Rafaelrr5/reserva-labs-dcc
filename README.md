# Reserva de Laboratórios — DCC

Trabalho de Engenharia de Software: **Qualidade** e **Manutenção**.

Um mesmo sistema de reserva de laboratórios implementado em **duas versões**,
para tornar mensurável o efeito de decisões de projeto sobre a qualidade e a
manutenibilidade do código.

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
| Acionador alcançável por teclado | não | sim |
| Testes de unidade do domínio | — | 16 passando |

O achado mais interessante: **o defeito mais grave da v1 — o botão inoperável
por teclado — não foi detectado por nenhuma das duas ferramentas.** Não existe
regra violada quando o elemento que seria verificado nem existe. Explicado em
[`docs/qualidade.md`](docs/qualidade.md).

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

| Arquivo | Conteúdo |
|---|---|
| [`docs/qualidade.md`](docs/qualidade.md) | Níveis de teste, o que cada instrumento alcança e o que não alcança |
| [`docs/manutencao.md`](docs/manutencao.md) | Cada defeito da v1 e a técnica aplicada na v2 |
| [`docs/apresentacao.md`](docs/apresentacao.md) | Roteiro cronometrado de 17 min |
| [`docs/smells-planejados.md`](docs/smells-planejados.md) | Catálogo dos defeitos plantados |

## Aviso metodológico

Os defeitos da `v1` são **plantados de propósito**. Este repositório é uma
demonstração didática de técnicas de avaliação de qualidade, não um estudo
empírico: os números medidos descrevem estas duas implementações específicas e
não se generalizam. O que se generaliza é o método.

## Escopo funcional

Reservar um laboratório do DCC em um horário, impedindo conflito com reservas já
existentes. Sem backend e sem banco — os dados vivem em memória, porque o objeto
de estudo é o código, não a infraestrutura.
