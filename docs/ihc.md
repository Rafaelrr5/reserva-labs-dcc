# IHC: o que foi medido do lado do usuário

Enquanto o capítulo de Qualidade trata de *conformidade* — que regras foram
violadas —, este trata de *interação*: a pessoa consegue fazer o que veio
fazer, e a que custo.

São perguntas diferentes, e a auditoria mostra que uma não responde a outra.

## Resultado

| Medida de IHC | v1 | v2 |
|---|---|---|
| Concluir uma reserva só com teclado | **impossível** | concluída |
| Paradas de foco até o acionador | 22 (e nunca chega) | 6 |
| Acionador recebe foco | não | sim |
| Campos com nome programático | 0 de 6 | 6 de 6 |
| Erro anunciado por leitor de tela | não | sim (`role="alert"`) |
| Texto auxiliar legível (contraste) | 2,2:1 | 7:1 |

## 1. A tarefa como unidade de medida

A auditoria não pergunta "quantas regras a página viola". Ela executa a tarefa
real — escolher laboratório, dia e horário, informar o responsável, confirmar —
usando **apenas o teclado**, e verifica se a reserva apareceu na lista.

```
v1: tarefa completa so com teclado: IMPOSSIVEL   (paradas de foco: 22)
v2: tarefa completa so com teclado: CONCLUIDA    (paradas de foco: 6)
```

Os dois números dizem coisas distintas.

**"Impossível" é um resultado binário de eficácia.** Na v1 a pessoa que não usa
mouse simplesmente não reserva. Não é lentidão, é barreira: o acionador é uma
`<div>`, nunca recebe foco, e não há caminho de teclado até a ação.

**As 22 paradas são um custo de interação.** O foco percorre 22 elementos sem
nunca chegar ao destino — a pessoa navega, navega, e o ciclo recomeça. Na v2,
seis paradas cobrem os seis campos e chegam ao botão.

Isto se conecta com a **teoria da ação de Norman**: a v1 quebra o estágio de
execução (não há como acionar) e, no golfo de avaliação, ainda dá sinal
contraditório — o contador anuncia um horário como ocupado que o envio aceita.

## 2. Affordance falsa

O elemento da v1 *parece* botão: fundo azul, texto branco, cursor de mão. A
aparência promete uma ação que a implementação não oferece a todos.

```jsx
<div className="v1-botao" onClick={confirmar}>Reservar</div>   // v1
<button type="submit">Reservar</button>                         // v2
```

Para quem usa mouse, a promessa se cumpre. Para quem usa teclado ou leitor de
tela, o elemento não existe como controle. É o caso clássico de **significante
enganoso**: o sinal visual não corresponde à ação disponível.

O elemento nativo traz foco, resposta a Enter e Espaço, papel anunciado e
participação no envio do formulário — tudo que a `div` teria de reconstruir à
mão com `tabIndex`, `role` e tratadores de tecla.

## 3. Rótulo visual não é rótulo

Na v1, cada campo tem um texto acima:

```jsx
<div className="v1-rotulo">Responsavel</div>
<input type="text" />
```

Visualmente rotulado; programaticamente anônimo. Um leitor de tela anuncia
"campo de edição" sem dizer de quê. Clicar no texto não move o foco para o
campo — um alvo de clique que a Lei de Fitts previa e que simplesmente não
existe.

A v2 usa `<label for>` através do componente `Campo`. O nome passa a existir
para todo mundo, e a área clicável do rótulo passa a funcionar.

Medido: `label` e `select-name` falhavam em 3 elementos cada na v1; zeraram na
v2.

## 4. Retorno de erro

Na v1 a mensagem de erro aparece em cinza claro (2,2:1) e **não é anunciada**:
quem usa leitor de tela aciona o botão e não recebe retorno nenhum.

Na v2 a mensagem tem `role="alert"` — o leitor a anuncia assim que aparece — e
contraste de 6,2:1. O retorno também ficou mais informativo: em vez de "conflito
de horário", diz com quem e a que hora.

Retorno imediato e específico é princípio básico de IHC; aqui ele é também o
que fecha o golfo de avaliação aberto no item 1.

## 5. Consistência interna

A v1 responde duas coisas diferentes para a mesma pergunta: com uma reserva das
08:00 às 10:00, o contador anuncia as 10:00 como indisponível e o envio aceita
a reserva.

Do ponto de vista de IHC isso é pior que um erro honesto. O sistema ensina um
modelo mental ("10:00 está ocupado") e depois contradiz esse modelo. A pessoa
não sabe em qual das duas informações confiar — e a que ela mais provavelmente
acredita é a que a impede de agir.

A causa é de manutenção, não de interface: a regra está copiada em três lugares
e uma cópia diverge. Detalhado em [`manutencao.md`](manutencao.md).

## 6. O que a automação de IHC não alcança

Esta auditoria mede **eficácia** (a tarefa se conclui?) e um proxy de
**esforço** (quantas paradas de foco). Não mede:

- satisfação, confiança ou frustração;
- se os rótulos fazem sentido no vocabulário de quem reserva laboratório;
- se a ordem dos campos corresponde à ordem em que a pessoa pensa;
- carga cognitiva.

Para isso seria preciso teste com usuários reais, que não fizemos. Quando a
tarefa por teclado for concluída na v2, isso significa que **a barreira caiu** —
não que a experiência seja boa.

Vale registrar a assimetria: a automação é boa para provar que algo é
impossível, e fraca para provar que algo é bom.
