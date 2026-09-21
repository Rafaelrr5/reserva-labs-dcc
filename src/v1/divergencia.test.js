import { describe, it, expect } from 'vitest';
import { encontrarConflito } from '../dominio/conflito.js';

// Reproduz as tres copias da regra tal como estao escritas em
// src/v1/ReservaV1.jsx, para provar que a terceira responde diferente das
// outras duas. Nenhuma ferramenta de acessibilidade detecta este defeito:
// ele nao esta na interface, esta na duplicacao.

const minutos = (h) => Number(h.split(':')[0]) * 60 + Number(h.split(':')[1]);

// Copia 1 e 2 da v1 (validacao do envio e marcacao na grade): usam <
const copiaDoEnvio = (candidata, existentes) => {
  const ini = minutos(candidata.inicio);
  const fim = ini + candidata.duracaoHoras * 60;
  return existentes.some((r) => {
    if (r.laboratorioId !== candidata.laboratorioId || r.dia !== candidata.dia) return false;
    const rIni = minutos(r.inicio);
    return ini < rIni + r.duracaoHoras * 60 && rIni < fim;
  });
};

// Copia 3 da v1 (contador de indisponiveis): usa <=
const copiaDoContador = (candidata, existentes) => {
  const ini = minutos(candidata.inicio);
  const fim = ini + candidata.duracaoHoras * 60;
  return existentes.some((r) => {
    if (r.laboratorioId !== candidata.laboratorioId || r.dia !== candidata.dia) return false;
    const rIni = minutos(r.inicio);
    return ini <= rIni + r.duracaoHoras * 60 && rIni <= fim;
  });
};

const existentes = [
  { id: 'r-1', laboratorioId: 'lab-101', dia: '2026-09-21', inicio: '08:00', duracaoHoras: 2 },
];

const candidata = {
  laboratorioId: 'lab-101',
  dia: '2026-09-21',
  inicio: '10:00', // encosta no fim da reserva existente, nao sobrepoe
  duracaoHoras: 2,
};

describe('v1: a regra duplicada responde duas coisas diferentes', () => {
  it('as 10:00 o envio aceita e o contador marca como indisponivel', () => {
    expect(copiaDoEnvio(candidata, existentes)).toBe(false);
    expect(copiaDoContador(candidata, existentes)).toBe(true);
  });

  it('a v2 nao tem como divergir: ha uma unica implementacao', () => {
    expect(encontrarConflito(candidata, existentes)).toBeNull();
  });

  it('a copia correta da v1 concorda com o dominio da v2', () => {
    const casos = ['08:00', '09:00', '10:00', '13:00', '15:00'];
    for (const inicio of casos) {
      const c = { ...candidata, inicio };
      expect(copiaDoEnvio(c, existentes)).toBe(encontrarConflito(c, existentes) !== null);
    }
  });
});
