// Reservas que ja existem quando o sistema abre. Servem para que o conflito
// de horario seja demonstravel sem o usuario precisar criar duas reservas.
// Contrato congelado: identico para v1 e v2.

export const RESERVAS_INICIAIS = [
  {
    id: 'r-1',
    laboratorioId: 'lab-101',
    dia: '2026-09-21',
    inicio: '08:00',
    duracaoHoras: 2,
    responsavel: 'Prof. Andrade',
    disciplina: 'Estrutura de Dados',
  },
  {
    id: 'r-2',
    laboratorioId: 'lab-205',
    dia: '2026-09-21',
    inicio: '13:00',
    duracaoHoras: 4,
    responsavel: 'Prof. Nogueira',
    disciplina: 'Engenharia de Software',
  },
  {
    id: 'r-3',
    laboratorioId: 'lab-lapic',
    dia: '2026-09-23',
    inicio: '15:00',
    duracaoHoras: 2,
    responsavel: 'Prof. Sato',
    disciplina: 'Iniciacao Cientifica',
  },
];
