// Contrato congelado: as duas versoes (v1 e v2) consomem exatamente este dado.
// Alterar somente com acordo da dupla — a comparacao perde sentido se as
// versoes medirem entradas diferentes.

export const LABORATORIOS = [
  { id: 'lab-101', nome: 'Laboratorio 101', predio: 'ICE', capacidade: 30, temProjetor: true },
  { id: 'lab-102', nome: 'Laboratorio 102', predio: 'ICE', capacidade: 24, temProjetor: false },
  { id: 'lab-205', nome: 'Laboratorio 205', predio: 'ICE', capacidade: 40, temProjetor: true },
  { id: 'lab-lapic', nome: 'LAPIC', predio: 'DCC', capacidade: 18, temProjetor: true },
];

export const HORARIOS = [
  '08:00', '10:00', '13:00', '15:00', '17:00', '19:00',
];

export const DIAS = [
  '2026-09-21', '2026-09-22', '2026-09-23', '2026-09-24', '2026-09-25',
];
