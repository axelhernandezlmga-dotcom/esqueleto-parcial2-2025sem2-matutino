/*
 * Qué hace este archivo: define la estructura general de la aplicación y las
 * rutas principales usando React Router. Es el punto donde se decide qué
 * componente aparece según la URL.
 * Qué debe mirar el estudiante: cómo se arma un layout sencillo con enlaces y
 * cómo se mapean las rutas con <Routes> y <Route> sin sintaxis abreviada.
 * Puntos clave (anchors): // PASO 1 (layout) y // PASO 2 (definición de rutas).
 */

import { Link, Route, Routes } from 'react-router-dom';
import Start from './Start';
import Country from './Country';
import End from './End';

function App() {
  return (
    <div>
      {/* PASO 1: layout básico con enlaces de navegación permanentes. */}
      <header>
        <nav>
          <ul>
            <li>
              <Link to="/">Inicio</Link>
            </li>
            <li>
              <Link to="/country/URY">Ejemplo fijo (Uruguay)</Link>
            </li>
          </ul>
        </nav>
      </header>

      <main>
        {/* PASO 2: definición de rutas. Cada ruta carga un componente distinto. */}
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="/country/:cca3" element={<Country />} />
          <Route path="/end" element={<End />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
