# Qualidade: o que cada instrumento mede

Todos os números abaixo vieram de `npm run auditoria` sobre a build de
produção, no mesmo navegador, na mesma execução. Os dados brutos ficam em
`relatorios/auditoria.json`.

## Resultado

| Instrumento | v1 | v2 |
|---|---|---|
| Nota Lighthouse (acessibilidade) | 78/100 | 100/100 |
| Violações axe-core | 3 regras, 8 elementos | 0 |
| Acionador alcançável por teclado | não | sim |
| Testes de unidade do domínio | — | 16 passando |

## Os quatro níveis e o que cada um alcança

**Unidade** (`src/dominio/conflito.test.js`, 16 casos). Roda sem navegador, em
milissegundos. Alcança a regra de negócio: sobreposição, intervalos que apenas
encostam, reserva contida em outra, recurso e dia distintos, entradas
inválidas. Não alcança nada da interface.

**Regressão por duplicação** (`src/v1/divergencia.test.js`). Reproduz as três
cópias da regra tal como escritas na v1 e demonstra que a terceira responde
diferente. É o único nível que pega esse defeito — voltamos a ele adiante.

**Auditoria em navegador** (axe-core 4.13.0 via Playwright, viewport desktop).
Alcança contraste de cor, nome acessível de campo, rótulo associado. Precisa
de layout e de cor computada, então exige navegador real.

**Relatório de nota** (Lighthouse 13.5.0, viewport móvel emulado). Mesma
família de verificações, agregadas em um número comparável ao longo do tempo.

## Primeiro limite: Lighthouse usa axe-core e mesmo assim diverge

O Lighthouse não tem motor próprio de acessibilidade: ele embute uma versão
fixada do axe-core. A expectativa natural é que os dois concordem. Não
concordam, e a auditoria mostra por quê.

Na v1 o Lighthouse reprovou `heading-order` (o salto de `h1` para `h4`) e a
execução direta do axe não. O motivo não é bug: `heading-order` está marcada
como `best-practice` no axe-core, não como critério WCAG. Nossa execução filtra
por `wcag2a`, `wcag2aa`, `wcag21a` e `wcag21aa`, então a regra fica de fora. O
Lighthouse a inclui na categoria mesmo assim.

Há ainda três diferenças estruturais:

1. **Agregação.** O axe conta violações e elementos; o Lighthouse converte cada
   regra em aprovado ou reprovado, sem crédito parcial. Na v1, `label` falhou em
   3 elementos e custou 7,2 pontos; se falhasse em 30, custaria os mesmos 7,2.
2. **Peso desigual.** `label` e `select-name` custaram 7,2 pontos cada;
   `color-contrast`, 5; `heading-order`, 2,2. Corrigir a regra certa move mais
   a nota que corrigir três erradas.
3. **Denominador variável.** O peso aplicável foi **139 na v1 e 170 na v2**.
   Auditorias que não se aplicam saem da conta, e a v2 tem mais elementos
   verificáveis justamente por ser mais semântica. As duas notas são frações de
   bases diferentes.

Conclusão prática: a nota serve para acompanhar tendência. Para dizer o que
precisa ser corrigido, use a lista de regras e elementos do axe.

## Segundo limite: 100 não significa acessível

A v2 tirou 100 e zero violações. Isso não prova conformidade.

O estudo da Deque sobre mais de 2.000 auditorias e 13.000 páginas mediu que a
automação detecta **57,38% do volume de problemas**, cobrindo **16 dos 50
critérios** do WCAG 2.1 AA. O próprio Lighthouse lista auditorias manuais que
nenhum motor executa.

Nossa própria medição confirma isso de forma mais direta do que esperávamos —
é o terceiro limite.

## Terceiro limite: o defeito mais grave da v1 não foi detectado por ferramenta nenhuma

O acionador da reserva na v1 é uma `<div onClick>`. Ele não recebe foco e não é
alcançável por Tab: **quem usa apenas teclado não consegue reservar**. É a
falha mais severa da versão.

Nem o axe nem o Lighthouse reportaram qualquer violação por causa dele.

A razão é instrutiva: não existe regra violada. A regra `button-name` exige que
botões tenham nome acessível — ali não há botão, há uma `div`, e `div` não
precisa ser focável. A regra `nested-interactive` trata de controles aninhados,
que também não é o caso. Para o motor, aquilo é conteúdo estático comum.

Isto é um **falso negativo por ausência**: a verificação passou porque o
elemento que seria verificado não existe. Foi por isso que a auditoria ganhou
uma terceira medição — tentar chegar ao acionador com Tab e registrar o
resultado:

```
v1: recebe foco=false   alcancavel por Tab=false
v2: recebe foco=true    alcancavel por Tab=true
```

Vinte linhas de verificação capturaram o que dois motores maduros não capturam.
A lição não é que as ferramentas são ruins — elas acertaram tudo que se
propõem a verificar. É que a cobertura de uma ferramenta é definida pelas
perguntas que ela faz, e nenhuma delas pergunta "isto funciona sem mouse?".

## Quarto ponto: há defeito que acessibilidade nunca veria

A regra de conflito duplicada em três pontos da v1, com a terceira cópia
divergente, não é um problema de interface. Com uma reserva das 08:00 às 10:00
já existente, o contador anuncia as 10:00 como indisponível enquanto o envio
aceita a mesma reserva. A tela responde duas coisas diferentes para a mesma
pergunta.

Nenhuma auditoria de acessibilidade tem como detectar isso. Só um teste que
conheça a regra de negócio — e ele só pôde ser escrito porque a regra foi
extraída para um módulo isolado na v2.

## Porta de qualidade

O comando `npm run auditoria` termina com erro se a v2 não superar a v1 nos dois
instrumentos. É a mesma função de um gate de integração contínua, executável em
sala sem depender de rede.

Uma ressalva honesta: uma porta que compara duas versões conhecidas prova
pouco. O valor está em rodá-la a cada alteração, quando a comparação passa a
ser contra o estado anterior do próprio código.

## Aviso metodológico

Os defeitos da v1 foram plantados de propósito. Os números descrevem estas duas
implementações e não se generalizam: com outros defeitos, a diferença seria
outra. O que se generaliza é o método — medir com mais de um instrumento,
conhecer o que cada um não alcança, e verificar à mão o que nenhum alcança.
