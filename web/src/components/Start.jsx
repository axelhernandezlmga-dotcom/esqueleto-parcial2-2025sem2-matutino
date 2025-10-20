/*
 * Qué hace este archivo: presenta la pantalla inicial donde se elige la
 * dificultad y se inicia el recorrido. Actúa como menú principal del simulacro.
 * Qué debe mirar el estudiante: cómo se usa useState para formularios simples,
 * por qué validamos antes de navegar y cómo disparamos la primera llamada a la
 * API. La navegación guarda estado para las siguientes pantallas.
 * Puntos clave (anchors): // PASO 1 (manejo de dificultad), // PASO 2 (fetch de
 * códigos) y // PASO 3 (navegación con state).
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { initState, LEVEL_CONFIG, pickRandom } from './Game';

function Start() {
  // PASO 1: preparar los estados locales para recordar qué eligió la persona.
  const [nivelSeleccionado, setNivelSeleccionado] = useState('');
  const [erroresPermitidos, setErroresPermitidos] = useState(0);
  const [estaCargando, setEstaCargando] = useState(false);
  const [mensajeError, setMensajeError] = useState('');

  // useNavigate permite cambiar de ruta manualmente. Pasamos estado porque
  // las otras pantallas necesitan saber cuántos errores quedan y qué nivel está
  // activo. Sin este state, el usuario perdería el contexto al actualizar.
  const navigate = useNavigate();

  function manejarSeleccionDificultad(levelKey) {
    const configuracion = LEVEL_CONFIG[levelKey];

    if (!configuracion) {
      setNivelSeleccionado('');
      setErroresPermitidos(0);
      return;
    }

    setNivelSeleccionado(levelKey);
    setErroresPermitidos(configuracion.erroresPermitidos);
    setMensajeError('');
  }

  async function manejarComienzo() {
    // PASO 2: verificamos que exista dificultad antes de continuar. Así evitamos
    // navegar sin datos, algo muy común en los parciales.
    if (!nivelSeleccionado) {
      setMensajeError('Elegí una dificultad para continuar.');
      return;
    }

    setEstaCargando(true);
    setMensajeError('');

    try {
      // PASO 2: pedimos la lista completa de países para elegir el primero.
      const respuesta = await fetch('/api/countries');

      if (!respuesta.ok) {
        throw new Error('No pudimos leer la lista de países.');
      }

      const codigos = await respuesta.json();

      const primerCodigo = pickRandom(codigos);

      if (!primerCodigo) {
        throw new Error('La API devolvió una lista vacía.');
      }

      // PASO 3: construimos el estado inicial reutilizando initState para
      // garantizar que los valores coincidan con el resto del flujo.
      const estadoInicial = initState(nivelSeleccionado);
      estadoInicial.errorsLeft = erroresPermitidos;

      // Explicación docente: usamos navigate con state para que Country.jsx
      // reciba errorsLeft, visited y level sin depender de un store global.
      navigate(`/country/${primerCodigo}`, {
        state: estadoInicial,
      });
    } catch (error) {
      setMensajeError(error.message ?? 'Ocurrió un error desconocido.');
    } finally {
      setEstaCargando(false);
    }
  }

  return (
    <section>
      <h1>Simulacro – Esqueleto</h1>
      <p>1) Elegí la dificultad. 2) Presioná comenzar. 3) Seguimos en Country.jsx.</p>

      <div>
        {Object.entries(LEVEL_CONFIG).map(([clave, info]) => (
          <button
            key={clave}
            type="button"
            onClick={() => manejarSeleccionDificultad(clave)}
            disabled={estaCargando}
          >
            {info.etiqueta}
          </button>
        ))}
      </div>

      <p>Dificultad seleccionada: {nivelSeleccionado || 'ninguna'}</p>
      <p>Errores permitidos: {erroresPermitidos}</p>

      <button
        type="button"
        onClick={manejarComienzo}
        disabled={!nivelSeleccionado || estaCargando}
      >
        {estaCargando ? 'Cargando…' : 'Comenzar'}
      </button>

      {mensajeError && <p style={{ color: 'crimson' }}>{mensajeError}</p>}
    </section>
  );
}

export default Start;
