/*
 * Qué hace este archivo: es el punto de entrada de React. Monta la aplicación en
 * el div #root y envuelve todo con BrowserRouter para habilitar las rutas.
 * Qué debe mirar el estudiante: cómo se combina createRoot con el árbol de
 * componentes y por qué BrowserRouter debe estar lo más arriba posible.
 * Puntos clave (anchors): // PASO 1 (buscar el nodo root) y // PASO 2 (renderizar).
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './components/App';
import './index.css';

// PASO 1: obtener el elemento del DOM donde React se montará.
const contenedor = document.getElementById('root');

if (!contenedor) {
  throw new Error('No encontramos el elemento #root en index.html.');
}

// PASO 2: crear la raíz y renderizar la aplicación completa dentro de BrowserRouter.
const root = ReactDOM.createRoot(contenedor);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
