# Update Workflow

## Flujo recomendado

1. `Ingresar fuente`
   - Agregar o reemplazar archivos en `info/` o `public/assets/`.
   - No editar binarios directamente desde este kit.

1.5. `Clasificar la fuente con el usuario`
   - Cuando entre un archivo nuevo, la IA no debe asumir sola su destino documental final si el tema no es obvio.
   - Primero debe ofrecer opciones claras para que el usuario elija donde quiere que impacte ese material.
   - Las opciones base para ofrecer son:
     - `Constitution`: define las reglas mas importantes del proyecto y como se trabaja.
     - `Knowledge`: guarda contexto, fuentes y explicaciones de negocio, producto o legal.
     - `Business Model`: explica que se vende, a quien, y como se ordena la propuesta de valor.
     - `Specs`: fija como debe implementarse tecnicamente en codigo y diseño.
   - Una vez que el usuario elige una opcion, la IA actualiza la documentacion correspondiente.

2. `Registrar la fuente`
   - Actualizar `knowledge/source-manifest.md`.
   - Indicar tipo de archivo, tema y uso esperado.

3. `Actualizar sintesis`
   - Si cambia el negocio: `knowledge/business-model.md`.
   - Si cambia lo legal: `knowledge/legal-and-data-handling.md`.
   - Si cambia el producto: `knowledge/product-flows.md`.

4. `Actualizar reglas tecnicas`
   - Si cambia arquitectura o criterio de implementacion, ajustar `specs/`.

5. `Implementar en codigo`
   - Aplicar el cambio en `src/`.
   - Mantener la estructura y convenciones del proyecto.

## Que puede hacer la persona que administra

- Subir nuevas fuentes.
- Corregir datos de negocio.
- Marcar que una regla ya no aplica.
- Pedir una implementacion nueva basada en este kit.

## Que debe hacer la IA

- Leer primero este kit antes de tocar codigo.
- Detectar conflictos entre codigo y reglas.
- Proponer o aplicar cambios coherentes con el stack actual.
- Dejar rastreable cualquier nueva decision importante.
