/**
 * Campo de formulario com rotulo associado.
 *
 * Substitui o par <div class="rotulo"> + <input> da v1: aqui o <label for>
 * liga o texto ao campo, entao o campo tem nome programatico e clicar no
 * rotulo move o foco.
 */
export default function Campo({ id, rotulo, ajuda, children }) {
  return (
    <p>
      <label htmlFor={id}>{rotulo}</label>
      {children}
      {ajuda ? (
        <span className="v2-auxiliar" id={`${id}-ajuda`}>
          {ajuda}
        </span>
      ) : null}
    </p>
  );
}
