import { useState, useEffect } from 'react';
import ReservaV1 from './v1/ReservaV1.jsx';
import ReservaV2 from './v2/ReservaV2.jsx';

// ponytail: roteamento por hash em vez de react-router. Sao duas rotas fixas
// e sem parametros; uma dependencia inteira nao se paga aqui.
export default function App() {
  const [rota, setRota] = useState(() => window.location.hash || '#/v1');

  useEffect(() => {
    const aoTrocar = () => setRota(window.location.hash || '#/v1');
    window.addEventListener('hashchange', aoTrocar);
    return () => window.removeEventListener('hashchange', aoTrocar);
  }, []);

  const versao = rota.startsWith('#/v2') ? 'v2' : 'v1';

  return (
    <>
      <nav className="troca-versao" aria-label="Versao do sistema">
        <a href="#/v1" aria-current={versao === 'v1' ? 'page' : undefined}>
          Versao 1
        </a>
        <a href="#/v2" aria-current={versao === 'v2' ? 'page' : undefined}>
          Versao 2
        </a>
      </nav>
      {versao === 'v2' ? <ReservaV2 /> : <ReservaV1 />}
    </>
  );
}
