/*
 * Qué hace este archivo: muestra la pantalla de cierre con un resumen rápido y
 * un botón para volver al inicio. Cierra el flujo de navegación del simulacro.
 * Qué debe mirar el estudiante: cómo se lee el state que llega desde navigate y
 * cómo se ofrece un fallback cuando alguien entra directo escribiendo la URL.
 * Puntos clave (anchors): // PASO 1 (reconstruir state) y // PASO 2 (volver a /).
 */

import { useLocation, useNavigate } from 'react-router-dom';
import { initState, safeState } from './Game';

function End() {
  // PASO 1: recuperar el state enviado por Country.jsx. safeState protege contra
  // recargas o accesos directos sin pasar por Start.jsx.
  const location = useLocation();
  const estadoSeguro = safeState(location.state);

  const navigate = useNavigate();

  const visitados = estadoSeguro.visited.length > 0
    ? estadoSeguro.visited
    : ['Sin datos: llegaste directo o se perdió el estado en la navegación.'];

  function manejarVolver() {
    // PASO 2: al volver, reiniciamos usando initState para que Start.jsx reciba
    // valores limpios. navigate('/') reemplaza la vista actual por la inicial.
    navigate('/', { state: initState(estadoSeguro.level) });
  }

  return (
    <section>
      <h2>Fin del recorrido</h2>
      <p>Gracias por jugar este simulacro.</p>
      <p>Visitados: {visitados.join(', ')}</p>
      <p>Nivel jugado: {estadoSeguro.level}</p>
      <button type="button" onClick={manejarVolver}>
        Volver al inicio
      </button>
    </section>
  );
}

export default End;
