# AI Working Rules

Estas reglas existen para que futuras intervenciones de IA sigan el mismo criterio del proyecto.

## Antes de editar

La IA debe revisar, en este orden:

1. `spec-kit/constitution/constitution.md`
2. `spec-kit/knowledge/` relevante
3. `spec-kit/specs/` relevantes
4. codigo en `src/`

## Cuando entra un archivo nuevo

- la IA debe inventariarlo;
- no debe asumir automaticamente en que capa documental impacta si eso no es evidente;
- primero debe ofrecer al usuario estas opciones para elegir:
  - `Constitution`: define las reglas mas importantes del proyecto y como se trabaja.
  - `Knowledge`: guarda contexto, fuentes y explicaciones de negocio, producto o legal.
  - `Business Model`: explica que se vende, a quien, y como se ordena la propuesta de valor.
  - `Specs`: fija como debe implementarse tecnicamente en codigo y diseño.
- despues de esa confirmacion, debe actualizar el documento correcto y recien luego proponer o aplicar cambios de codigo.

## Regla de decision

- si el usuario pide algo que contradice el kit, primero hay que actualizar el kit;
- si el usuario pide algo chico que no cambia la estrategia, se puede editar codigo directo respetando estas reglas;
- si aparece una nueva libreria, documentar por que entra y donde debe usarse.

## Mantenimiento esperado

La persona responsable puede operar asi:

- subir archivos fuente,
- pedir cambios de producto,
- validar una nueva regla.

La IA debe encargarse de:

- leer el estado actual,
- proponer la implementacion coherente,
- ejecutar el cambio,
- y dejar documentada cualquier nueva convencion importante.

## Regla anti-caos

No crear una segunda arquitectura adentro del repo. Este proyecto ya tiene una linea clara:

- React para UI,
- SCSS por componente,
- i18n centralizado,
- datos reutilizables fuera del markup cuando corresponde.
