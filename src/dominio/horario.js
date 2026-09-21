// Conversao de horario para minutos e calculo do intervalo de uma reserva.
// Funcoes puras: sem estado, sem interface, sem data do sistema.

/**
 * Converte "HH:MM" para minutos desde a meia-noite.
 * Lanca em formato invalido em vez de devolver NaN silenciosamente —
 * um NaN se propagaria por toda a comparacao de conflito sem erro visivel.
 */
export function paraMinutos(horario) {
  if (typeof horario !== 'string' || !/^\d{2}:\d{2}$/.test(horario)) {
    throw new TypeError(`Horario invalido: ${JSON.stringify(horario)}`);
  }
  const [horas, minutos] = horario.split(':').map(Number);
  if (horas > 23 || minutos > 59) {
    throw new RangeError(`Horario fora do intervalo do dia: ${horario}`);
  }
  return horas * 60 + minutos;
}

/**
 * Intervalo semiaberto [inicio, fim) de uma reserva, em minutos.
 *
 * Semiaberto por decisao de projeto: uma reserva que termina as 10:00 e outra
 * que comeca as 10:00 nao conflitam. Se o intervalo fosse fechado dos dois
 * lados, aulas consecutivas seriam rejeitadas.
 */
export function intervaloDaReserva(reserva) {
  const inicio = paraMinutos(reserva.inicio);
  const duracao = Number(reserva.duracaoHoras);
  if (!Number.isFinite(duracao) || duracao <= 0) {
    throw new RangeError(`Duracao invalida: ${JSON.stringify(reserva.duracaoHoras)}`);
  }
  return { inicio, fim: inicio + duracao * 60 };
}
