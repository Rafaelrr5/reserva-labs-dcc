# Visão geral do projeto

Documento de orientação: o que existe no repositório, o que cada parte faz e
por que está ali.

## A ideia em um parágrafo

O mesmo sistema de reserva de laboratórios foi implementado duas vezes. A `v1`
tem defeitos plantados de propósito; a `v2` tem a mesma funcionalidade depois
de refatorada. As duas rodam lado a lado no mesmo aplicativo, e um script mede
as duas com os mesmos instrumentos. A comparação é o trabalho.

Temas: **Interação Homem-Computador** e **Qualidade de Software**. Um mesmo
conjunto de defeitos serve aos dois: eles degradam a experiência de quem usa
(IHC) e são detectáveis — ou não — por instrumentos de verificação (Qualidade).

## Mapa do repositório

```
src/
  dados/            Contrato comum: laboratórios, horários, reservas iniciais
                    As duas versões leem daqui, para medirem a mesma entrada.

  dominio/          A regra de negócio isolada da interface.
    horario.js      Converte "HH:MM" em minutos; calcula o intervalo da reserva.
    conflito.js     Decide se duas reservas se sobrepõem. Fonte única da verdade.
    conflito.test.js  16 testes: encostar sem sobrepor, conter, cruzar,
                      recurso e dia distintos, editar a própria, entrada inválida.

  v1/               A versão com dívida técnica.
    ReservaV1.jsx   Arquivo único com tudo. A regra de conflito aparece
                    copiada três vezes; a terceira usa <= e diverge.
    divergencia.test.js  Prova que as cópias discordam entre si.

  v2/               A versão refatorada.
    ReservaV2.jsx   Orquestra o formulário. Não contém a regra: importa do domínio.
    Campo.jsx       Rótulo associado ao campo. Torna o erro da v1 impossível de repetir.
    TabelaReservas.jsx  Lista das reservas.
    formatacao.js   Nome do laboratório e data em formato legível.

  App.jsx           Alterna entre #/v1 e #/v2.
  estilos.css       Aparência das duas; inclui as cores propositalmente ruins da v1.

auditoria/
  auditar.mjs       Mede as duas versões e compara. Detalhado abaixo.

docs/               Os capítulos do documento-texto.
relatorios/         Saída da auditoria em JSON (não versionado).
```

## O que a auditoria faz

Um script, quatro medições, sobre a build de produção e no mesmo navegador.

**1. axe-core, viewport desktop.** Motor de regras de acessibilidade. Devolve
violações com a lista de elementos afetados. Filtramos pelas etiquetas WCAG 2.0
e 2.1, níveis A e AA.

**2. Lighthouse, viewport móvel emulado.** Produz a nota de 0 a 100. Usa
axe-core internamente, mas agrega de outro jeito — e é justamente por isso que
os dois números não batem, o que vira conteúdo do documento.

**3. Foco no acionador.** O botão de reservar recebe foco? É alcançável por Tab?

**4. Tarefa completa por teclado.** Percorre o formulário com Tab, preenche,
aciona com Enter e confere se a reserva apareceu na lista. É a única medição
que responde "a pessoa consegue fazer o que veio fazer".

No fim o script imprime a comparação e **sai com erro** se a v2 não superar a
v1 nos três instrumentos. Funciona como um portão de integração contínua, mas
roda na sala de aula sem depender de rede.

## Os defeitos da v1 e quem os detecta

| Defeito | Detectado por |
|---|---|
| Campos sem rótulo associado | axe (`label`, `select-name`) |
| Contraste 2,2:1 | axe (`color-contrast`) |
| Salto de `h1` para `h4` | só Lighthouse (`heading-order`) |
| `<div onClick>` no lugar de botão | **nenhuma ferramenta** — só a tarefa por teclado |
| Regra duplicada, uma cópia divergente | **nenhuma ferramenta** — só teste de unidade |

As duas últimas linhas são o achado do trabalho. Os defeitos mais graves são
justamente os que nenhum motor de acessibilidade encontra: um porque não existe
regra para verificar um elemento ausente, outro porque não é problema de
interface.

## Resultados medidos

Execução de 21/09/2026, axe-core 4.13.0, Lighthouse 13.5.0.

```
Lighthouse    v1  78/100                      v2  100/100
axe-core      v1  3 violações / 8 elementos   v2  0
Tarefa por    v1  IMPOSSÍVEL (22 paradas)     v2  CONCLUÍDA (6 paradas)
  teclado
Testes        19 passando
```

## Decisões de projeto e o que ficou de fora

**Sem backend e sem banco.** Os dados vivem em memória. O objeto de estudo é o
código da aplicação; infraestrutura consumiria o tempo do trabalho sem
contribuir para o argumento.

**Duas rotas, não dois aplicativos.** Garante que a comparação use a mesma
entrada, o mesmo navegador e a mesma build.

**Roteamento por hash, não uma biblioteca.** São duas rotas fixas, sem
parâmetros.

**Sem integração contínua.** O portão de qualidade é o código de saída do
script, que roda ao vivo na apresentação. Um servidor de integração faria a
mesma verificação onde ninguém a veria acontecer.

**Sem teste com usuários.** A auditoria mede eficácia e um proxy de esforço.
Satisfação, carga cognitiva e adequação do vocabulário exigiriam pessoas reais.
Não afirmamos nada sobre isso.

## Limites do que foi demonstrado

Os defeitos da v1 são plantados. Duas implementações não são amostra. A porta
de qualidade compara duas versões já conhecidas, o que prova pouco — seu valor
apareceria ao rodar a cada alteração.

O que se generaliza é o método: medir com mais de um instrumento, saber o que
cada um não alcança, e verificar à mão o que nenhum alcança.
