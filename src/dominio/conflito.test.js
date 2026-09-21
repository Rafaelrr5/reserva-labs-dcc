import { describe, it, expect } from 'vitest';
import { haSobreposicao, disputamMesmoRecurso, encontrarConflito } from './conflito.js';
import { paraMinutos, intervaloDaReserva } from './horario.js';

const reserva = (inicio, duracaoHoras, extras = {}) => ({
  id: 'x',
  laboratorioId: 'lab-101',
  dia: '2026-09-21',
  inicio,
  duracaoHoras,
  ...extras,
});

describe('paraMinutos', () => {
  it('converte horario valido', () => {
    expect(paraMinutos('00:00')).toBe(0);
    expect(paraMinutos('08:30')).toBe(510);
    expect(paraMinutos('23:59')).toBe(1439);
  });

  // Rejeitar em vez de devolver NaN: um NaN atravessaria toda a comparacao
  // de conflito sem erro, fazendo o sistema aprovar reservas sobrepostas.
  it('rejeita formato invalido em vez de produzir NaN', () => {
    expect(() => paraMinutos('8:00')).toThrow(TypeError);
    expect(() => paraMinutos('oito horas')).toThrow(TypeError);
    expect(() => paraMinutos(800)).toThrow(TypeError);
    expect(() => paraMinutos(undefined)).toThrow(TypeError);
  });

  it('rejeita horario fora do dia', () => {
    expect(() => paraMinutos('25:00')).toThrow(RangeError);
    expect(() => paraMinutos('10:75')).toThrow(RangeError);
  });
});

describe('intervaloDaReserva', () => {
  it('calcula o fim a partir da duracao', () => {
    expect(intervaloDaReserva(reserva('08:00', 2))).toEqual({ inicio: 480, fim: 600 });
  });

  it('rejeita duracao nao positiva ou nao numerica', () => {
    expect(() => intervaloDaReserva(reserva('08:00', 0))).toThrow(RangeError);
    expect(() => intervaloDaReserva(reserva('08:00', -1))).toThrow(RangeError);
    expect(() => intervaloDaReserva(reserva('08:00', 'duas'))).toThrow(RangeError);
  });
});

describe('haSobreposicao', () => {
  // O caso que a copia divergente da v1 erra: intervalo semiaberto.
  it('nao considera conflito quando uma termina onde a outra comeca', () => {
    expect(haSobreposicao(reserva('08:00', 2), reserva('10:00', 2))).toBe(false);
    expect(haSobreposicao(reserva('10:00', 2), reserva('08:00', 2))).toBe(false);
  });

  it('detecta sobreposicao parcial nos dois sentidos', () => {
    expect(haSobreposicao(reserva('08:00', 3), reserva('10:00', 2))).toBe(true);
    expect(haSobreposicao(reserva('10:00', 2), reserva('08:00', 3))).toBe(true);
  });

  it('detecta reserva contida em outra', () => {
    expect(haSobreposicao(reserva('08:00', 6), reserva('10:00', 1))).toBe(true);
    expect(haSobreposicao(reserva('10:00', 1), reserva('08:00', 6))).toBe(true);
  });

  it('detecta horario identico', () => {
    expect(haSobreposicao(reserva('13:00', 2), reserva('13:00', 2))).toBe(true);
  });

  it('nao considera conflito quando nao ha interseccao', () => {
    expect(haSobreposicao(reserva('08:00', 1), reserva('15:00', 2))).toBe(false);
  });
});

describe('disputamMesmoRecurso', () => {
  it('exige mesmo laboratorio e mesmo dia', () => {
    const base = reserva('08:00', 2);
    expect(disputamMesmoRecurso(base, reserva('08:00', 2))).toBe(true);
    expect(disputamMesmoRecurso(base, reserva('08:00', 2, { laboratorioId: 'lab-205' }))).toBe(false);
    expect(disputamMesmoRecurso(base, reserva('08:00', 2, { dia: '2026-09-22' }))).toBe(false);
  });
});

describe('encontrarConflito', () => {
  const existentes = [
    reserva('08:00', 2, { id: 'r-1' }),
    reserva('13:00', 4, { id: 'r-2', laboratorioId: 'lab-205' }),
  ];

  it('devolve a reserva conflitante, nao apenas um booleano', () => {
    const achado = encontrarConflito(reserva('09:00', 1), existentes);
    expect(achado?.id).toBe('r-1');
  });

  it('devolve null quando o horario esta livre', () => {
    expect(encontrarConflito(reserva('15:00', 2), existentes)).toBeNull();
  });

  it('ignora conflito em outro laboratorio', () => {
    const outroLab = reserva('08:00', 2, { laboratorioId: 'lab-lapic' });
    expect(encontrarConflito(outroLab, existentes)).toBeNull();
  });

  it('ignora a propria reserva ao editar', () => {
    const editada = reserva('08:00', 2, { id: 'r-1' });
    expect(encontrarConflito(editada, existentes)).not.toBeNull();
    expect(encontrarConflito(editada, existentes, { ignorarId: 'r-1' })).toBeNull();
  });

  it('funciona com lista vazia', () => {
    expect(encontrarConflito(reserva('08:00', 2), [])).toBeNull();
  });
});
