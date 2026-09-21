import { nomeDoLaboratorio, formatarDia } from './formatacao.js';

export default function TabelaReservas({ reservas }) {
  return (
    <table data-testid="lista-reservas">
      <caption>Reservas ja registradas</caption>
      <thead>
        <tr>
          <th scope="col">Laboratorio</th>
          <th scope="col">Dia</th>
          <th scope="col">Inicio</th>
          <th scope="col">Horas</th>
          <th scope="col">Responsavel</th>
          <th scope="col">Disciplina</th>
        </tr>
      </thead>
      <tbody>
        {reservas.map((r) => (
          <tr key={r.id}>
            <td>{nomeDoLaboratorio(r.laboratorioId)}</td>
            <td>{formatarDia(r.dia)}</td>
            <td>{r.inicio}</td>
            <td>{r.duracaoHoras}</td>
            <td>{r.responsavel}</td>
            <td>{r.disciplina}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
