# Apresentação

`conceitos.html` é o bloco de abertura: 12 slides que introduzem os conceitos
de IHC e Qualidade antes da demonstração ao vivo. Cerca de 5 minutos.

Abra o arquivo em qualquer navegador. Não precisa de instalação nem de rede.

| Tecla | Ação |
|---|---|
| Seta direita, Espaço, PageDown | avançar |
| Seta esquerda, PageUp | voltar |
| Home, End | primeiro e último slide |

Clicar no terço esquerdo da tela volta; no resto, avança.

Para gerar PDF: imprima pelo navegador em paisagem, com "gráficos de plano de
fundo" ativado. O CSS já traz uma quebra de página por slide.

## Onde isto entra

A sequência completa está em [`../docs/apresentacao.md`](../docs/apresentacao.md).
Estes slides cobrem só a introdução conceitual. O resto da apresentação é feito
no navegador e no terminal, com o sistema rodando, porque mostrar a tarefa
falhando convence mais do que descrevê-la.

## Capturas

```bash
node apresentacao/capturar.mjs
```

Salva um PNG por slide em `relatorios/slides/`. Serve para conferir o visual e
para ter um plano B caso a máquina da sala não abra o arquivo.
