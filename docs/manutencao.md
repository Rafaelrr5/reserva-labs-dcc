# Manutenção: da v1 para a v2

Cada defeito da v1, a técnica aplicada na v2 e o efeito medido.

## Quadro geral

| Defeito na v1 | Técnica na v2 | Detectado por |
|---|---|---|
| Regra de conflito em 3 cópias, uma divergente | Extração de função + fonte única | Teste de unidade (após extrair) |
| `<div onClick>` no lugar de botão | Elemento semântico | **Nenhuma ferramenta** — só teclado |
| Campos sem rótulo associado | `<label for>` via componente `Campo` | axe `label`, `select-name` |
| Contraste 2,2:1 | Cores com 6:1 e 7:1 | axe `color-contrast` |
| Salto de `h1` para `h4` | Hierarquia contínua | Lighthouse `heading-order` |
| Arquivo único com tudo | Componentes extraídos | Revisão de código |

## 1. Regra duplicada — o defeito central

Na v1 a verificação de conflito aparece três vezes: na validação do envio, na
marcação de horário ocupado e no contador de indisponíveis. As duas primeiras
usam `<`, a terceira usa `<=`.

O efeito é observável. Com uma reserva das 08:00 às 10:00 já registrada, um
pedido para as 10:00:

```
10:00 dur=2 -> envio: aceita     contador: BLOQUEIA     <<< DIVERGE
```

A mesma tela dá duas respostas para a mesma pergunta. Isso está fixado em
`src/v1/divergencia.test.js`.

**Por que a duplicação é o problema, e não o `<=`.** Trocar `<=` por `<` na
terceira cópia corrigiria o sintoma e deixaria a causa intacta: na próxima
mudança de regra ainda haveria três lugares para alterar e a mesma chance de
esquecer um. A correção é estrutural — uma implementação só.

Na v2, `encontrarConflito` vive em `src/dominio/conflito.js` e as três
perguntas da tela a consultam. Divergir deixou de ser possível.

**Ganho colateral: testabilidade.** A regra da v1 é inalcançável por teste de
unidade — está presa dentro de um componente React, misturada com estado e
apresentação. Testá-la exigiria renderizar a tela, preencher campos e ler o
resultado: lento, frágil e indireto. Extraída, virou função pura com 16 casos
que rodam em 41 ms, cobrindo bordas que ninguém testaria pela interface.

Isto é um argumento de manutenção, não de teste: **código difícil de testar é
código difícil de mudar com segurança**. A extração não foi feita para permitir
o teste; o teste ficou possível porque a estrutura melhorou.

## 2. O botão que não era botão

```jsx
// v1
<div className="v1-botao" data-testid="botao-reservar" onClick={confirmar}>

// v2
<button type="submit" data-testid="botao-reservar">
```

Funcionalmente idênticos no mouse. Medido:

```
v1: recebe foco=false   alcancavel por Tab=false
v2: recebe foco=true    alcancavel por Tab=true
```

O elemento nativo traz foco, resposta a Enter e Espaço, papel anunciado e
participação no envio do formulário. A alternativa seria reconstruir tudo isso
à mão com `tabIndex`, `role` e tratadores de tecla — mais código para reproduzir
pior o que o navegador já faz.

Este é o item que expõe o limite das ferramentas: **nenhuma das duas detectou**.
Detalhado em [`qualidade.md`](qualidade.md).

## 3. Rótulos: o componente que torna o erro impossível

Na v1, cada campo repete o par `<div class="rotulo">` + `<input>`. Parece
rotulado e não está: o texto não tem vínculo com o campo. Seis campos, seis
oportunidades de errar — e o padrão errado é o mais curto de escrever.

Na v2 existe o componente `Campo`, que recebe `id` e `rotulo` e emite o
`<label for>` correto. Não é abstração especulativa: é a remoção de um erro
repetido seis vezes. O caminho fácil passou a ser o caminho certo.

Efeito medido: `label` e `select-name` custavam 7,2 pontos cada na v1; zeraram
na v2.

## 4. Contraste

Texto auxiliar e mensagem de erro em `#b0b0b0` sobre branco: razão ~2,2:1,
abaixo do mínimo de 4,5:1. Na v2, `#595959` (7:1) e `#a62617` (6,2:1).

Detectado apenas pela auditoria em navegador. Teste de componente em ambiente
simulado não computa cor nem layout e permaneceria em silêncio.

## 5. Componente monolítico

A v1 tem ~230 linhas em um arquivo: estado, validação, formatação e
apresentação juntos. A v2 divide em `ReservaV2.jsx`, `Campo.jsx`,
`TabelaReservas.jsx` e `formatacao.js`.

O argumento não é estético. Em arquivo único, uma alteração na tabela exige ler
o formulário; corrigir a formatação de data significa achá-la duplicada em dois
pontos (`dia.split('-').reverse().join('/')` aparece duas vezes na v1). A
divisão reduz o que é preciso entender para mudar uma coisa.

**Ressalva.** Este é o item mais fraco do conjunto. Os outros cinco têm efeito
medido; este tem apenas argumento. Contagem de linhas não mede
manutenibilidade, e sistemas pequenos toleram bem um arquivo único. O ganho
real aparece quando o sistema cresce — e isso nós não medimos, então não
afirmamos.

## Sobre gerência de configuração

O histórico do repositório acompanha as etapas: contrato congelado, domínio com
testes, v1, v2, auditoria. Cada commit tem uma mudança com sua justificativa.

Uma observação honesta sobre este ponto: o histórico foi construído de forma
linear, sem ramos nem revisão por terceiros, porque o trabalho é pequeno. Não
demonstramos fluxo de integração com revisão — apenas rastreabilidade de
mudanças.
