# Roteiro da apresentação

Alvo: 17 minutos, com folga para os 15–20 exigidos. Dois apresentadores
alternando. Os tempos são de ensaio, não de improviso.

## Antes de entrar na sala

```bash
npm install
npm run build
npm run preview        # deixar rodando em outra aba do terminal
npm run auditoria      # conferir que sai APROVADO
```

Deixe `relatorios/auditoria.json` e uma captura da saída salvos. Se o navegador
ou a máquina falharem na hora, você apresenta o relatório salvo em vez de
cancelar a demonstração.

---

## 1. Problema e escopo — 2 min

Reserva de laboratórios do DCC. Duas implementações da mesma funcionalidade:
uma com dívida técnica, outra refatorada.

Diga já no início que **os defeitos da v1 são plantados de propósito**. Quem
ouve isso no começo entende a demonstração; quem descobre no fim acha que foi
manipulação.

## 2. A v1 funcionando — 2 min

Abra `#/v1` e faça uma reserva com o mouse. Funciona. Parece pronta.

Este é o ponto da apresentação inteira: **a versão ruim não parece ruim.**

## 3. O defeito que o olho não vê — 3 min

Com a reserva das 08:00 às 10:00 na tela, selecione 10:00 como início.

- O contador diz que o horário está indisponível.
- O envio aceita a reserva.

Mostre as três cópias da regra em `ReservaV1.jsx` e aponte o `<=` da terceira.
Rode `npm test` e mostre `divergencia.test.js` fixando o comportamento.

Frase que resume: *trocar `<=` por `<` corrige o sintoma; a causa é existirem
três cópias.*

## 4. A v2 e a refatoração — 3 min

Abra `ReservaV2.jsx`. A regra não está lá — está em `src/dominio/conflito.js`,
com 16 testes.

Mostre que as três perguntas da tela chamam a mesma função. Divergir deixou de
ser possível, não por disciplina, mas por estrutura.

Mencione o ganho colateral: a regra da v1 era intestável sem renderizar a tela;
extraída, virou função pura testada em 41 ms.

## 5. Auditoria ao vivo — 4 min

```bash
npm run auditoria
```

Leia a saída em voz alta, na ordem em que aparece:

- Lighthouse: **78 → 100**
- axe-core: **3 violações / 8 elementos → 0**
- Teclado: **v1 não alcançável → v2 alcançável**

Depois explique por que os dois primeiros números não batem entre si:
o Lighthouse embute o axe, mas reprova `heading-order` (que é
`best-practice`, fora do nosso filtro WCAG), converte cada regra em
aprovado/reprovado sem crédito parcial, e usa denominador diferente por página
— **139 na v1 contra 170 na v2**.

## 6. O que nenhuma ferramenta pegou — 2 min

O momento mais forte. Tente acionar o botão da v1 só com Tab. Não chega.

Nenhum dos dois motores reportou violação. Não existe regra violada: a regra
`button-name` exige que botões tenham nome — ali não há botão, há uma `div`.
É um falso negativo por ausência.

Vinte linhas de verificação pegaram o que dois motores maduros não pegam.

Complete com o dado da Deque: automação cobre 57,38% do volume de problemas e
16 dos 50 critérios WCAG 2.1 AA.

## 7. Fechamento — 1 min

Três afirmações, sem exagerar o alcance:

1. A duplicação é o defeito, não o operador errado.
2. Nota 100 é ausência de violação automatizada, não prova de qualidade.
3. A cobertura de uma ferramenta é definida pelas perguntas que ela faz.

Reconheça os limites: dois casos, defeitos plantados, sem revisão por
terceiros. O método se generaliza; os números não.

---

## Perguntas prováveis

**"Vocês não forçaram o resultado plantando os defeitos?"**
Sim, e está declarado no início e no README. A demonstração é do método de
avaliação, não uma medição empírica de qualidade de software.

**"Por que o Lighthouse e o axe não dão o mesmo número?"**
O Lighthouse embute o axe, mas roda um subconjunto de regras, agrega de forma
binária com pesos e usa denominador variável por página. Três transformações
entre o resultado bruto e a nota.

**"Nota 100 significa acessível?"**
Não. Significa que as verificações automatizadas aplicáveis passaram. Operação
por teclado, ordem de foco e sentido para leitor de tela ficam de fora — e
nossa própria auditoria provou isso ao não detectar o falso botão.

**"Por que não usaram integração contínua?"**
A porta de qualidade é o código de saída de `npm run auditoria` — mesma função,
executável em sala sem depender de rede. Em projeto real ela rodaria no
servidor de integração.

**"Isso não é só acessibilidade em vez de qualidade?"**
Acessibilidade é o atributo que escolhemos por ser mensurável em sala. O
defeito da regra duplicada não é de acessibilidade, e nenhuma dessas
ferramentas o detecta — ele exigiu um teste que conhece a regra de negócio.
