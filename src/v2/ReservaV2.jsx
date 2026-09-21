import { useState } from 'react';
import { encontrarConflito } from '../dominio/conflito.js';
import { RESERVAS_INICIAIS } from '../dados/reservas-iniciais.js';
import { LABORATORIOS, HORARIOS, DIAS, formatarDia } from './formatacao.js';
import Campo from './Campo.jsx';
import TabelaReservas from './TabelaReservas.jsx';

// =============================================================================
// VERSAO 2 — mesma funcionalidade da v1 apos refatoracao.
//
// A regra de conflito nao existe aqui: vem de src/dominio/conflito.js, onde
// esta coberta por testes. As tres respostas da tela consultam a mesma funcao,
// entao nao ha como divergirem.
// =============================================================================

export default function ReservaV2() {
  const [reservas, setReservas] = useState(RESERVAS_INICIAIS);
  const [formulario, setFormulario] = useState({
    laboratorioId: LABORATORIOS[0].id,
    dia: DIAS[0],
    inicio: HORARIOS[0],
    duracaoHoras: 2,
    responsavel: '',
    disciplina: '',
  });
  const [erro, setErro] = useState('');

  const atualizar = (campo) => (evento) =>
    setFormulario((atual) => ({ ...atual, [campo]: evento.target.value }));

  const candidataEm = (inicio) => ({ ...formulario, inicio });

  // Uma unica fonte para as tres perguntas da tela.
  const conflitoEm = (inicio) => encontrarConflito(candidataEm(inicio), reservas);
  const indisponiveis = HORARIOS.filter((h) => conflitoEm(h)).length;

  function confirmar(evento) {
    evento.preventDefault();

    if (!formulario.responsavel.trim()) {
      setErro('Informe o responsavel pela reserva.');
      return;
    }

    const conflito = conflitoEm(formulario.inicio);
    if (conflito) {
      setErro(
        `Conflito com a reserva de ${conflito.responsavel} as ${conflito.inicio} ` +
          `(${conflito.duracaoHoras}h).`
      );
      return;
    }

    setReservas((atuais) => [
      ...atuais,
      { ...formulario, id: `r-${crypto.randomUUID()}`, duracaoHoras: Number(formulario.duracaoHoras) },
    ]);
    setErro('');
    setFormulario((atual) => ({ ...atual, responsavel: '', disciplina: '' }));
  }

  return (
    <main>
      <h1>Reserva de Laboratorios do DCC</h1>
      <p className="v2-auxiliar">
        Versao 2. Selecione o laboratorio, o dia e o horario desejado.
      </p>

      <form onSubmit={confirmar} data-testid="form-reserva">
        <fieldset>
          <legend>
            <h2>Nova reserva</h2>
          </legend>

          <Campo id="v2-laboratorio" rotulo="Laboratorio">
            <select
              id="v2-laboratorio"
              data-testid="campo-laboratorio"
              value={formulario.laboratorioId}
              onChange={atualizar('laboratorioId')}
            >
              {LABORATORIOS.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.nome} ({l.predio}, {l.capacidade} lugares)
                </option>
              ))}
            </select>
          </Campo>

          <Campo id="v2-dia" rotulo="Dia">
            <select
              id="v2-dia"
              data-testid="campo-dia"
              value={formulario.dia}
              onChange={atualizar('dia')}
            >
              {DIAS.map((d) => (
                <option key={d} value={d}>
                  {formatarDia(d)}
                </option>
              ))}
            </select>
          </Campo>

          <Campo id="v2-horario" rotulo="Horario de inicio">
            <select
              id="v2-horario"
              data-testid="campo-horario"
              value={formulario.inicio}
              onChange={atualizar('inicio')}
            >
              {HORARIOS.map((h) => (
                <option key={h} value={h}>
                  {h}
                  {conflitoEm(h) ? ' - ocupado' : ''}
                </option>
              ))}
            </select>
          </Campo>

          <Campo id="v2-duracao" rotulo="Duracao (horas)">
            <input
              id="v2-duracao"
              data-testid="campo-duracao"
              type="number"
              min="1"
              max="8"
              value={formulario.duracaoHoras}
              onChange={atualizar('duracaoHoras')}
            />
          </Campo>

          <Campo id="v2-responsavel" rotulo="Responsavel">
            <input
              id="v2-responsavel"
              data-testid="campo-responsavel"
              type="text"
              required
              value={formulario.responsavel}
              onChange={atualizar('responsavel')}
            />
          </Campo>

          <Campo id="v2-disciplina" rotulo="Disciplina">
            <input
              id="v2-disciplina"
              type="text"
              value={formulario.disciplina}
              onChange={atualizar('disciplina')}
            />
          </Campo>

          <p className="v2-auxiliar">
            {indisponiveis} de {HORARIOS.length} horarios indisponiveis neste dia.
          </p>

          <button type="submit" data-testid="botao-reservar">
            Reservar
          </button>

          {/* role=alert: o erro e anunciado por leitor de tela ao aparecer */}
          <p className="v2-erro" data-testid="mensagem-erro" role="alert">
            {erro}
          </p>
        </fieldset>
      </form>

      <h2>Reservas existentes</h2>
      <TabelaReservas reservas={reservas} />
    </main>
  );
}
