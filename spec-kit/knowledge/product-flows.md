# Product Flows

## 1. Navegacion principal

El sitio esta compuesto como una landing operativa con secciones encadenadas:

- header,
- hero,
- demografia,
- oportunidad,
- certificacion,
- normativas,
- comparativa,
- radar de noticias,
- autodiagnostico,
- alianzas y pitch,
- footer,
- widgets y modales.

## 2. Idioma

- idiomas activos: `es` y `en`
- la seleccion inicial puede venir por query string, `localStorage` o pathname
- los mensajes viven en `src/i18n/`

## 3. Autodiagnostico

- fuente principal: `src/data/diagnostic.js`
- formato actual: 15 preguntas
- estructura: `pilar`, `pilarName`, `text`, `options`, `recommendation`
- cada bloque ya contempla espanol e ingles

## 4. Cuenta y desbloqueo

- el usuario se guarda localmente en `localStorage` bajo `ageFriendUser`
- el idioma se guarda bajo `ageFriendLanguage`
- hay modales para autenticacion, cuenta y otros flujos de contacto

## 5. Pitch y descarga

- el flujo de pitch corporativo esta ligado a autenticacion previa
- la descarga no debe tratarse como una accion totalmente anonima si el producto define gating por cuenta

## 6. Radar de noticias

- implementado con `Swiper`
- usa autoplay y paginacion
- obtiene fuentes RSS y cae en `fallback` si falla la carga remota

