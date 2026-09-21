# Contrato de marcadores de teste

A auditoria automatizada navega nas duas versões com o **mesmo roteiro**. Para
que isso seja possível, os marcadores abaixo precisam existir, com o mesmo
nome, na `v1` e na `v2`.

Se um marcador mudar de nome em uma versão e não na outra, a comparação deixa
de ser válida — a ferramenta estaria medindo percursos diferentes e atribuindo
a diferença ao código.

| `data-testid` | Onde fica | Papel no roteiro |
|---|---|---|
| `form-reserva` | Formulário de nova reserva | Raiz do fluxo principal |
| `campo-laboratorio` | Seleção de laboratório | Preenchimento |
| `campo-dia` | Seleção de dia | Preenchimento |
| `campo-horario` | Seleção de horário de início | Preenchimento |
| `campo-duracao` | Duração em horas | Preenchimento |
| `campo-responsavel` | Nome do responsável | Preenchimento |
| `botao-reservar` | Confirmação da reserva | Acionamento |
| `mensagem-erro` | Retorno de conflito ou dado inválido | Verificação do caminho de falha |
| `lista-reservas` | Lista de reservas existentes | Verificação do caminho de sucesso |

## Observação deliberada

Na `v1`, vários desses marcadores estarão em elementos **não semânticos**
(`<div>` com `onClick`, campo sem `<label>` associado). Isso é intencional: o
marcador permite que o roteiro encontre o elemento, enquanto as ferramentas de
acessibilidade reportam que ele não é operável por teclado nem nomeável por
leitor de tela.

Ou seja: o teste funcional **passa** e a auditoria de qualidade **falha** — e é
exatamente esse contraste que o trabalho pretende evidenciar.
