# Spec Kit

Este directorio concentra la verdad operativa del proyecto. Su objetivo es que el mantenimiento del sitio y de sus flujos no dependa de memoria informal ni de decisiones sueltas en el chat.

## Estructura

- `constitution/`
  - Reglas madre del proyecto.
  - Criterios para decidir entre codigo, contenido y fuentes.
- `knowledge/`
  - Sintesis del negocio, legal, producto y fuentes disponibles.
- `specs/`
  - Instrucciones concretas de implementacion para React, SCSS, i18n, datos y UX.

## Como usar este Spec Kit

1. Actualizar primero las fuentes crudas en `info/` o `public/assets/`.
2. Reflejar el cambio en `knowledge/source-manifest.md`.
3. Actualizar la sintesis correspondiente en `knowledge/`.
4. Si el cambio afecta implementacion, ajustar la regla concreta en `specs/`.
5. Recien despues tocar codigo en `src/`.

## Regla de oro

Cuando haya diferencia entre lo que hace hoy el codigo y lo que define este kit:

- Si el codigo cambio por accidente, se corrige el codigo.
- Si el negocio cambio a proposito, se corrige primero este kit y luego el codigo.

