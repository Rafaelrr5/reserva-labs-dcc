# Defeitos plantados na v1

Especificação do que a Pessoa A implementa na `v1`. Cada item existe para ser
detectado por um instrumento diferente e corrigido por uma técnica nomeável na
`v2`. Nada aqui é descuido: é material de demonstração.

## 1. Regra de negócio duplicada em três pontos

A verificação de conflito de horário aparece copiada em:

- na validação ao enviar o formulário;
- na marcação visual de horário ocupado na grade;
- no aviso exibido ao trocar o laboratório selecionado.

**A terceira cópia diverge**: usa comparação `<=` em vez de `<`, tratando o
intervalo como fechado. O efeito visível é que uma reserva das 10:00 é marcada
como ocupada quando existe outra terminando exatamente às 10:00 — aulas
consecutivas ficam bloqueadas em um lugar da tela e permitidas em outro.

Detectado por: leitura do código e teste de unidade quando a regra é extraída.
Corrigido na v2 por: extração para `src/dominio/conflito.js` (Extract Function
+ fonte única da verdade).

## 2. Botão que não é botão

A confirmação da reserva é um `<div onClick>` estilizado. Funciona no mouse e
falha no teclado: não recebe foco por Tab, não responde a Enter nem Espaço, e
não é anunciado como controle acionável.

Detectado por: `button-name` / `nested-interactive` na auditoria em navegador.
Não detectado por: teste funcional que clica por coordenada ou por `testid` —
esse passa normalmente.

## 3. Campos sem rótulo associado

Os campos do formulário usam texto solto acima do `<input>`, sem `<label for>`
nem `aria-label`. Visualmente parece rotulado; programaticamente o campo não
tem nome.

Detectado por: `label` na auditoria, e também em teste de componente.

## 4. Contraste insuficiente

Texto auxiliar e mensagem de erro em cinza claro sobre branco, abaixo da razão
mínima de 4,5:1.

Detectado por: apenas a auditoria em navegador real. Teste de componente em
ambiente simulado não computa cor nem layout e permanece silencioso — este é o
item que demonstra o terceiro limite do instrumento.

## 5. Hierarquia de títulos quebrada

A página salta de `<h1>` para `<h4>` e usa `<div class="titulo">` no lugar de
um cabeçalho real, quebrando a navegação por estrutura.

## 6. Componente monolítico

Toda a versão em um único arquivo, com estado, formatação, validação e
apresentação misturados. É o que torna as correções acima custosas — e é
justamente esse custo que o capítulo de Manutenção precisa argumentar.

---

## Regra inegociável

A `v1` precisa **funcionar** para quem usa mouse e enxerga bem. Um sistema
visivelmente quebrado não demonstra nada: o ponto do trabalho é que a versão
com dívida técnica parece pronta e passa no teste funcional, enquanto a
auditoria de qualidade revela o que a aparência esconde.
