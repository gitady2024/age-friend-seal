# Frontend Architecture Spec

## Stack obligatorio

- `React 19`
- `Vite`
- `SCSS` compilado con `sass`
- `react-intl` para textos bilingues
- `Swiper` para sliders o carruseles
- `html2pdf.js` solo cuando realmente haga falta generar PDF del lado cliente

## Punto de entrada

- `src/main.jsx` monta `App`
- `src/App.jsx` orquesta idioma, usuario, modales y orden de secciones

## Regla de composicion

- una carpeta por componente en `src/components/`
- dentro de cada carpeta:
  - `ComponentName.jsx`
  - `ComponentName.scss`

## Regla de responsabilidad

- `App.jsx` coordina estado global liviano y composicion
- los componentes de seccion renderizan UI y comportamiento local
- los datos estaticos o reutilizables deben vivir fuera del JSX cuando sea razonable

## Estado y persistencia

- usar `useState` y `useEffect` para estado local y persistencia simple
- `localStorage` es aceptable para idioma, usuario y progreso liviano
- no introducir una capa de estado global pesada sin necesidad demostrada

## Librerias

### `react-intl`

- todos los textos compartidos o visibles de producto deben poder internacionalizarse
- evitar strings grandes hardcodeados en multiples componentes

### `Swiper`

- usarlo para experiencias tipo slider, carrusel o listado movil horizontal
- priorizar autoplay, paginacion y breakpoints antes que controles recargados

### `html2pdf.js`

- usarlo de forma encapsulada
- no mezclar estilos visuales de pantalla con necesidades de impresion sin una capa explicita

## Regla de evolucion

No reintroducir un `app.js` global ni comportamiento imperativo fuera de React salvo una necesidad tecnica muy puntual y documentada.

