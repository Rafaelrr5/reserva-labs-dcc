# Reserva de Laboratórios — DCC

Trabalho de Engenharia de Software. Um mesmo sistema de reserva de laboratórios
implementado em **duas versões**, para tornar mensurável o efeito de decisões de
projeto sobre a qualidade e a manutenibilidade do código.

| Rota | O que é |
|---|---|
| `/v1` | Versão com dívida técnica deliberada: componente monolítico, regra de negócio duplicada, HTML não semântico |
| `/v2` | Mesma funcionalidade após refatoração: domínio isolado e testado, componentes extraídos, HTML semântico |

As duas versões rodam no mesmo aplicativo, lado a lado, para que a comparação
seja feita sobre o mesmo dado e o mesmo navegador.

## Como rodar

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # testes de unidade do domínio
```

## Aviso metodológico

Os defeitos da `v1` são **plantados de propósito**. Este repositório é uma
demonstração didática de técnicas de avaliação de qualidade, não um estudo
empírico: os números medidos descrevem estas duas implementações específicas e
não se generalizam.

## Escopo funcional

Reservar um laboratório do DCC em um horário, impedindo conflito com reservas já
existentes. Sem backend e sem banco — os dados vivem em memória, porque o objeto
de estudo é o código, não a infraestrutura.

## Autores

Trabalho em dupla. A divisão de responsabilidades está em
[`docs/divisao-do-trabalho.md`](docs/divisao-do-trabalho.md).
