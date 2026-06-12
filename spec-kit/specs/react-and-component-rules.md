# React And Component Rules

## Convenciones de componentes

- nombrar componentes en PascalCase
- export default por componente de carpeta, como hoy hace el repo
- importar el SCSS del propio componente desde el JSX
- mantener componentes enfocados; si una seccion crece demasiado, extraer subcomponentes dentro de la misma carpeta o una subcarpeta clara

## Como decidir donde poner algo

- `src/components/`: UI y comportamiento de presentacion
- `src/data/`: preguntas, opciones, estructuras de contenido parametrico
- `src/i18n/`: mensajes traducibles
- `src/utils/`: helpers puros o de infraestructura chica
- `src/styles/`: base global, shared tokens, overrides y estilos legales

## Regla para nuevos flujos

Si agregamos una experiencia nueva:

1. crear componente o grupo de componentes,
2. definir textos en i18n si es copy de producto,
3. mover datos repetibles a `data/` si aplica,
4. agregar solo el CSS necesario en SCSS del componente.

## Regla para modales

- los modales siguen centralizados en `src/components/Modals/`
- si aparece un modal nuevo del mismo dominio, integrarlo ahi antes de crear un sistema paralelo

## Regla para formularios

- labels y campos deben quedar visualmente unidos
- mantener espaciados consistentes entre bloque, label e input
- los valores persistidos deben ser deliberados; no dejar basura en refresh salvo que sea parte del flujo

