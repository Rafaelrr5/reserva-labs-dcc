# Roteiro da apresentação

**Temas: Interação Homem-Computador e Qualidade de Software.**

Alvo: 19 minutos, dentro dos 15–20 exigidos. Os tempos são de ensaio,
não de improviso. Se o ensaio passar de 20, encurte a Parte 1 (slides 6, 7 e 9
podem ser lidos em 20 segundos cada).

Slides: `apresentacao/slides.html` (20 telas; PDF para o Classroom em
`apresentacao/slides.pdf`). O enunciado pede uma parte sobre o documento-texto
e outra sobre o código: a Parte 1 cobre o documento, o restante cobre o código.

O fio condutor: *a versão ruim não parece ruim, e as ferramentas que deveriam
denunciá-la deixam passar justamente o pior defeito.*

---

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

Abra também `apresentacao/slides.html` em tela cheia.

## 0. Parte 1 — os temas do documento-texto — 5 min

*Slides 1 a 10.* Uma pessoa apresenta; a outra prepara a demonstração.

- **Slides 3 e 4 (IHC, 1,5 min):** definição pela ISO 9241-11 e linha do tempo.
  Feche com a NBR 17225 (2025) e a Lei Brasileira de Inclusão: acessibilidade
  deixou de ser opcional.
- **Slides 5 e 6 (Qualidade, 1,5 min):** as 9 características da ISO/IEC
  25010:2023. Aponte a troca de "usabilidade" por "capacidade de interação":
  é a ponte entre os dois temas.
- **Slide 7 (normas, 30 s):** só leia as duas colunas.
- **Slide 8 (limite das ferramentas, 30 s):** os 57% da Deque. Esse número
  volta na demonstração.
- **Slide 9 (mercado, 30 s):** profissões e certificações; nenhuma é exigida
  por lei.
- **Slide 10 (IA, 50 s):** três números e uma frase: a IA produz mais rápido,
  medir ficou mais importante. O dado da GitClear (mais código copiado) prepara
  o defeito de manutenção do slide 17.

---

## 1. Problema e enquadramento — 1 min

*Slides 11 e 12.*

Reserva de laboratórios do DCC. Duas implementações da mesma funcionalidade:
uma com dívida técnica, outra refatorada.

Diga já no início que **os defeitos da v1 são plantados de propósito**. Quem
ouve isso no começo entende a demonstração; quem descobre no fim acha que foi
manipulação.

Enuncie a articulação entre os dois temas: os mesmos defeitos degradam a
experiência de uso (IHC) e testam a capacidade dos instrumentos de detectá-los
(Qualidade). Um tema fornece o problema, o outro fornece a régua.

## 1b. Conceitos — 1,5 min

*Sem slide próprio: fale por cima do slide 12.* Affordance e significante, os dois golfos de Norman, a tarefa
como unidade de medida, conformidade, níveis de verificação, falso negativo por
ausência e o alcance da automação.

Passe rápido: cada conceito reaparece na demonstração, e é lá que ele fixa.
O objetivo aqui é só dar nome às coisas antes de mostrá-las.

## 2. A v1 funcionando — 1 min

*Slides 13 e 14 mostram as telas e o código, caso a demonstração ao vivo falhe.*

Abra `#/v1` e faça uma reserva com o mouse. Funciona. Parece pronta.

Este é o ponto da apresentação inteira: **a versão ruim não parece ruim.**

## 3. IHC — a tarefa que não se conclui — 3 min

*Esta é a parte de Interação Homem-Computador.*

Tente fazer a mesma reserva **só com o teclado**. Tab, Tab, Tab... o foco
percorre os campos e nunca chega ao botão. O ciclo recomeça.

Mostre o código:

```jsx
<div className="v1-botao" onClick={confirmar}>Reservar</div>
```

Três pontos, nesta ordem:

**Affordance falsa.** O elemento parece botão — fundo azul, cursor de mão — e
promete uma ação que não oferece a todos. O significante visual não corresponde
à ação disponível.

**Rótulo que não rotula.** Os campos têm texto acima, mas sem vínculo: um leitor
de tela anuncia "campo de edição" sem dizer de quê, e clicar no texto não move o
foco. Rótulo visual não é rótulo programático.

**Retorno ausente.** A mensagem de erro está em cinza 2,2:1 e não é anunciada.
A pessoa aciona e não recebe resposta — golfo de avaliação aberto.

Abra `#/v2` e repita a tarefa pelo teclado. Conclui.

## 4. Qualidade — a auditoria ao vivo — 3 min

*Slide 15 tem a tabela, caso a auditoria não rode na máquina da sala.*

*Esta é a parte de Qualidade de Software.*

```bash
npm run auditoria
```

Leia os números na ordem em que saem:

```
Lighthouse    v1  78/100                    v2  100/100
axe-core      v1  3 violações / 8 elem      v2  0
Tarefa        v1  IMPOSSÍVEL (22 paradas)   v2  CONCLUÍDA (6 paradas)
```

Depois explique por que os dois primeiros não batem entre si: o Lighthouse
**embute o axe-core** e mesmo assim diverge. Reprova `heading-order`, que é
`best-practice` e fica fora do nosso filtro WCAG; converte cada regra em
aprovado/reprovado sem crédito parcial; e usa denominador diferente por página
— **139 na v1 contra 170 na v2**. As duas notas são frações de bases
diferentes.

Encerre com a porta de qualidade: o script sai com erro se a v2 não superar a
v1 nos três instrumentos. Mesma função de um portão de integração contínua.

## 5. O encontro dos dois temas — 2 min

*Slide 16.*

**O momento mais forte da apresentação.**

O defeito mais grave da v1 — a tarefa impossível pelo teclado — **não foi
detectado por nenhuma das duas ferramentas.**

Por quê: não existe regra violada. `button-name` exige que botões tenham nome
acessível; ali não há botão, há uma `div`, e `div` não precisa ser focável.
Para o motor, é conteúdo estático comum. **Falso negativo por ausência**: a
verificação passou porque o elemento que seria verificado não existe.

Foi isso que motivou a quarta medição — que não pergunta "que regra foi
violada" e sim "a pessoa conclui a tarefa?". Cerca de cinquenta linhas pegaram
o que dois motores maduros não pegam.

Complete com o dado da Deque: automação detecta 57,38% do volume de problemas e
cobre 16 dos 50 critérios WCAG 2.1 AA.

A frase que amarra o trabalho: **a cobertura de uma ferramenta é definida pelas
perguntas que ela faz.**

## 6. O defeito que nem é de interface — 1,5 min

*Slide 17.*

Com a reserva das 08:00 às 10:00 na tela, selecione 10:00 como início.

- O contador diz que o horário está indisponível.
- O envio aceita a reserva.

Mostre as três cópias da regra em `ReservaV1.jsx` e aponte o `<=` da terceira.
Rode `npm test` e mostre `divergencia.test.js` fixando o comportamento.

Em IHC: o sistema ensina um modelo mental e depois o contradiz — a pessoa não
sabe em qual informação confiar.

Em Qualidade: nenhuma auditoria de acessibilidade tem como ver isso. Só um
teste que conheça a regra de negócio — e ele só foi possível porque a v2
extraiu a regra para um módulo isolado.

Frase que resume: *trocar `<=` por `<` corrige o sintoma; a causa é existirem
três cópias.*

## 7. Fechamento — 1 min

*Slides 18 a 20.*

Três afirmações, sem exagerar o alcance:

1. Conformidade e eficácia são perguntas diferentes: nota 100 não diz que a
   pessoa consegue usar.
2. A duplicação é o defeito, não o operador errado.
3. A cobertura de uma ferramenta é definida pelas perguntas que ela faz.

Reconheça os limites: dois casos, defeitos plantados, sem teste com usuários
reais. O método se generaliza; os números não.

---

## Perguntas prováveis

**"Vocês não forçaram o resultado plantando os defeitos?"**
Sim, e está declarado no início, no README e no documento. A demonstração é do
método de avaliação, não uma medição empírica de qualidade de software.

**"Por que o Lighthouse e o axe não dão o mesmo número?"**
O Lighthouse embute o axe, mas roda um subconjunto de regras, agrega de forma
binária com pesos e usa denominador variável por página. Três transformações
entre o resultado bruto e a nota.

**"Nota 100 significa acessível?"**
Não. Significa que as verificações automatizadas aplicáveis passaram. Operação
por teclado, ordem de foco e sentido para leitor de tela ficam de fora — e
nossa própria auditoria provou isso ao não detectar o falso botão.

**"Isso é IHC ou é acessibilidade?"**
Acessibilidade é o recorte de IHC que conseguimos medir em sala. As medidas são
de interação: a tarefa se conclui, a que custo de navegação, com que retorno. O
que não medimos — satisfação, carga cognitiva, vocabulário — exigiria teste com
usuários, e dizemos isso no documento.

**"Por que 22 paradas de foco na v1 e 6 na v2?"**
Na v2 são seis paradas: os seis campos, terminando no botão. Na v1 o foco
percorre 22 elementos sem nunca chegar ao acionador — o ciclo recomeça. O
número não é só esforço, é evidência de que não há caminho.

**"Por que não usaram integração contínua?"**
A porta de qualidade é o código de saída de `npm run auditoria` — mesma função,
executável em sala sem depender de rede. Em projeto real ela rodaria no
servidor de integração.

**"Testaram com usuários reais?"**
Não. A automação é boa para provar que algo é impossível e fraca para provar
que algo é bom. Concluir a tarefa na v2 significa que a barreira caiu, não que
a experiência seja boa.
