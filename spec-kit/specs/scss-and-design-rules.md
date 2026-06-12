# SCSS And Design Rules

## Capas actuales

`src/styles/index.scss` compone:

- `base`
- `shared`
- `legal`
- `overrides`

## Regla de estilos

- lo global va en `src/styles/`
- lo especifico de un componente va en su `Component.scss`
- evitar mover estilos de una seccion al archivo global salvo que sean realmente reutilizables

## SCSS obligatorio

- seguir usando SCSS, no CSS-in-JS
- preferir nesting moderado y selectores legibles
- no depender de selectores fragiles o demasiado profundos

## Criterios de UI

- respetar la estetica oscura actual del producto
- componentes centrados en lectura y conversion, no estilo dashboard recargado
- evitar cambios bruscos de layout entre desktop y mobile
- cuando haya slider o cards, cuidar alturas, paddings y alineacion de texto

## PDF y pantalla

- si una vista sirve para exportar PDF, separar criterios de impresion de los de pantalla
- no reutilizar fondos o overlays de pantalla en la salida PDF sin verificar contraste y legibilidad

