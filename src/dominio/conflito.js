import { intervaloDaReserva } from './horario.js';

/**
 * Fonte unica da verdade sobre sobreposicao de reservas.
 *
 * Esta funcao existe exatamente uma vez no projeto. Na v1 a mesma regra
 * aparece copiada em tres lugares e uma das copias diverge — esse contraste
 * e o objeto de estudo do trabalho.
 */
export function haSobreposicao(a, b) {
  const ia = intervaloDaReserva(a);
  const ib = intervaloDaReserva(b);
  // Intervalos semiabertos: encostar nao e sobrepor.
  return ia.inicio < ib.fim && ib.inicio < ia.fim;
}

/**
 * Duas reservas competem pelo mesmo recurso quando sao no mesmo laboratorio
 * e no mesmo dia. Em recursos ou dias diferentes nao ha disputa, independente
 * do horario.
 */
export function disputamMesmoRecurso(a, b) {
  return a.laboratorioId === b.laboratorioId && a.dia === b.dia;
}

/**
 * Procura a primeira reserva existente que conflita com a candidata.
 * Devolve a reserva conflitante, ou null quando o horario esta livre.
 *
 * Devolver o objeto em vez de um booleano permite a interface dizer COM QUEM
 * o conflito ocorreu, sem reabrir a regra.
 */
export function encontrarConflito(candidata, existentes, { ignorarId = null } = {}) {
  for (const existente of existentes) {
    if (ignorarId !== null && existente.id === ignorarId) continue;
    if (!disputamMesmoRecurso(candidata, existente)) continue;
    if (haSobreposicao(candidata, existente)) return existente;
  }
  return null;
}
