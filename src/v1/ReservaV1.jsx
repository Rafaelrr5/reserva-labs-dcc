import { useState } from 'react';
import { LABORATORIOS, HORARIOS, DIAS } from '../dados/laboratorios.js';
import { RESERVAS_INICIAIS } from '../dados/reservas-iniciais.js';

// =============================================================================
// VERSAO 1 — DIVIDA TECNICA DELIBERADA
//
// Os defeitos deste arquivo sao plantados de proposito e estao catalogados em
// docs/smells-planejados.md. Nao corrigir aqui: a comparacao com a v2 e o
// objeto de estudo do trabalho.
//
// Tudo em um arquivo so: estado, validacao, formatacao e apresentacao.
// =============================================================================

export default function ReservaV1() {
  const [reservas, setReservas] = useState(RESERVAS_INICIAIS);
  const [laboratorioId, setLaboratorioId] = useState(LABORATORIOS[0].id);
  const [dia, setDia] = useState(DIAS[0]);
  const [inicio, setInicio] = useState(HORARIOS[0]);
  const [duracaoHoras, setDuracaoHoras] = useState(2);
  const [responsavel, setResponsavel] = useState('');
  const [disciplina, setDisciplina] = useState('');
  const [erro, setErro] = useState('');

  // ---------------------------------------------------------------------------
  // COPIA 1 da regra de conflito — validacao do envio.
  // ---------------------------------------------------------------------------
  function confirmar() {
    if (!responsavel.trim()) {
      setErro('Informe o responsavel.');
      return;
    }

    const ini = Number(inicio.split(':')[0]) * 60 + Number(inicio.split(':')[1]);
    const fim = ini + duracaoHoras * 60;

    let conflito = null;
    for (let i = 0; i < reservas.length; i++) {
      const r = reservas[i];
      if (r.laboratorioId !== laboratorioId) continue;
      if (r.dia !== dia) continue;
      const rIni = Number(r.inicio.split(':')[0]) * 60 + Number(r.inicio.split(':')[1]);
      const rFim = rIni + r.duracaoHoras * 60;
      if (ini < rFim && rIni < fim) {
        conflito = r;
        break;
      }
    }

    if (conflito) {
      setErro(
        'Conflito com a reserva de ' + conflito.responsavel + ' as ' + conflito.inicio + '.'
      );
      return;
    }

    setReservas([
      ...reservas,
      {
        id: 'r-' + (reservas.length + 1) + '-' + Date.now(),
        laboratorioId,
        dia,
        inicio,
        duracaoHoras,
        responsavel,
        disciplina,
      },
    ]);
    setErro('');
    setResponsavel('');
    setDisciplina('');
  }

  // ---------------------------------------------------------------------------
  // COPIA 2 da regra — marcacao de horario ocupado na grade.
  // ---------------------------------------------------------------------------
  function horarioEstaOcupado(h) {
    const ini = Number(h.split(':')[0]) * 60 + Number(h.split(':')[1]);
    const fim = ini + duracaoHoras * 60;
    for (let i = 0; i < reservas.length; i++) {
      const r = reservas[i];
      if (r.laboratorioId !== laboratorioId) continue;
      if (r.dia !== dia) continue;
      const rIni = Number(r.inicio.split(':')[0]) * 60 + Number(r.inicio.split(':')[1]);
      const rFim = rIni + r.duracaoHoras * 60;
      if (ini < rFim && rIni < fim) return true;
    }
    return false;
  }

  // ---------------------------------------------------------------------------
  // COPIA 3 da regra — aviso ao trocar de laboratorio.
  //
  // ESTA COPIA DIVERGE: usa <= no lugar de <, tratando o intervalo como
  // fechado. Resultado: um horario que apenas encosta no fim de outra reserva
  // e anunciado como indisponivel aqui, enquanto a copia 1 aceita a mesma
  // reserva. A mesma tela responde duas coisas diferentes.
  // ---------------------------------------------------------------------------
  function contarIndisponiveis() {
    let total = 0;
    for (let h = 0; h < HORARIOS.length; h++) {
      const ini = Number(HORARIOS[h].split(':')[0]) * 60 + Number(HORARIOS[h].split(':')[1]);
      const fim = ini + duracaoHoras * 60;
      for (let i = 0; i < reservas.length; i++) {
        const r = reservas[i];
        if (r.laboratorioId !== laboratorioId) continue;
        if (r.dia !== dia) continue;
        const rIni = Number(r.inicio.split(':')[0]) * 60 + Number(r.inicio.split(':')[1]);
        const rFim = rIni + r.duracaoHoras * 60;
        if (ini <= rFim && rIni <= fim) {
          total++;
          break;
        }
      }
    }
    return total;
  }

  const nomeDoLab = (id) => {
    for (let i = 0; i < LABORATORIOS.length; i++) {
      if (LABORATORIOS[i].id === id) return LABORATORIOS[i].nome;
    }
    return id;
  };

  return (
    <main>
      <h1>Reserva de Laboratorios do DCC</h1>
      <p className="v1-auxiliar">
        Versao 1. Selecione o laboratorio, o dia e o horario desejado.
      </p>

      {/* Cabecalho falso: parece titulo, nao e cabecalho */}
      <div className="v1-titulo-falso">Nova reserva</div>

      <div data-testid="form-reserva">
        {/* Campos sem <label for>: o texto acima nao esta associado ao campo */}
        <div className="v1-rotulo">Laboratorio</div>
        <select
          data-testid="campo-laboratorio"
          value={laboratorioId}
          onChange={(e) => setLaboratorioId(e.target.value)}
        >
          {LABORATORIOS.map((l) => (
            <option key={l.id} value={l.id}>
              {l.nome} ({l.predio}, {l.capacidade} lugares)
            </option>
          ))}
        </select>

        <div className="v1-rotulo">Dia</div>
        <select data-testid="campo-dia" value={dia} onChange={(e) => setDia(e.target.value)}>
          {DIAS.map((d) => (
            <option key={d} value={d}>
              {d.split('-').reverse().join('/')}
            </option>
          ))}
        </select>

        <div className="v1-rotulo">Horario de inicio</div>
        <select
          data-testid="campo-horario"
          value={inicio}
          onChange={(e) => setInicio(e.target.value)}
        >
          {HORARIOS.map((h) => (
            <option key={h} value={h}>
              {h}
              {horarioEstaOcupado(h) ? ' - ocupado' : ''}
            </option>
          ))}
        </select>

        <div className="v1-rotulo">Duracao (horas)</div>
        <input
          data-testid="campo-duracao"
          type="number"
          min="1"
          max="8"
          value={duracaoHoras}
          onChange={(e) => setDuracaoHoras(Number(e.target.value))}
        />

        <div className="v1-rotulo">Responsavel</div>
        <input
          data-testid="campo-responsavel"
          type="text"
          value={responsavel}
          onChange={(e) => setResponsavel(e.target.value)}
        />

        <div className="v1-rotulo">Disciplina</div>
        <input type="text" value={disciplina} onChange={(e) => setDisciplina(e.target.value)} />

        <p className="v1-auxiliar">
          {contarIndisponiveis()} de {HORARIOS.length} horarios indisponiveis neste dia.
        </p>

        {/* Nao e botao: sem foco, sem papel, sem teclado */}
        <div className="v1-botao" data-testid="botao-reservar" onClick={confirmar}>
          Reservar
        </div>

        {erro ? (
          <p className="v1-erro" data-testid="mensagem-erro">
            {erro}
          </p>
        ) : null}
      </div>

      {/* Salto de h1 para h4 */}
      <h4>Reservas existentes</h4>
      <table data-testid="lista-reservas">
        <thead>
          <tr>
            <th>Laboratorio</th>
            <th>Dia</th>
            <th>Inicio</th>
            <th>Horas</th>
            <th>Responsavel</th>
            <th>Disciplina</th>
          </tr>
        </thead>
        <tbody>
          {reservas.map((r) => (
            <tr key={r.id}>
              <td>{nomeDoLab(r.laboratorioId)}</td>
              <td>{r.dia.split('-').reverse().join('/')}</td>
              <td>{r.inicio}</td>
              <td>{r.duracaoHoras}</td>
              <td>{r.responsavel}</td>
              <td>{r.disciplina}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
