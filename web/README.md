# Simulacro – Esqueleto (React + React Router)

## Requisitos

- Node.js 18 o superior.

## Puesta en marcha

1. Instalar dependencias: `npm install`
2. Ejecutar el modo desarrollo: `npm run dev`
3. Abrir el enlace indicado por Vite (generalmente http://localhost:5173)

## Cómo probar el flujo

1. Ir a `/` y elegir una dificultad.
2. Presionar **Comenzar** para ir a `/country/XXX` con un país inicial al azar.
3. Leer los datos del país, elegir opciones y observar cómo se actualiza el estado.
4. Cuando se agoten los errores o decidas terminar, llegarás a `/end` con el resumen.

## Mapa de archivos

- `src/main.jsx`: punto de entrada que monta React y configura el router.
- `src/components/App.jsx`: layout general y definición de rutas.
- `src/components/Start.jsx`: menú inicial y disparador del juego.
- `src/components/Country.jsx`: pantalla principal con lógica de avance.
- `src/components/End.jsx`: cierre y reinicio.
- `src/components/Game.jsx`: helpers de estado compartido y utilidades.
- `src/common.js`: funciones de apoyo genéricas (arrays, sleep, unique).
- `src/index.css`: estilos mínimos compartidos (enfocado en la lógica).
