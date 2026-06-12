# Content And I18n Spec

## Idiomas activos

- `es`
- `en`

## Ubicacion

- `src/i18n/es.js`
- `src/i18n/en.js`
- `src/i18n/messages.js`

## Regla de copy

- todo texto estructural, CTA, encabezado, subtitulo o mensaje reusable debe vivir en i18n
- el contenido de datos que ya es bilingue, como `src/data/diagnostic.js`, puede mantenerse en estructuras por idioma

## Regla de consistencia

- si se agrega un mensaje nuevo en espanol, crear su espejo en ingles
- si una experiencia es solo para un idioma por decision comercial, dejarlo anotado en `knowledge/` o en esta spec

## Regla para fuentes externas

Cuando una fuente nueva agregue copy de producto:

1. resumirla en `knowledge/`,
2. decidir que parte va a UI,
3. pasar solo el copy final a i18n o a `data/`.

