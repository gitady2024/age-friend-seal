# Age Friend Seal Constitution

## 1. Proposito

Este proyecto existe para presentar, explicar y operar la propuesta `Age Friend Seal`: posicionamiento comercial, autodiagnostico inicial, captura de leads, contenido legal y materiales de certificacion vinculados a economia plateada, accesibilidad y longevidad.

## 2. Fuentes de verdad

El orden de autoridad del proyecto es:

1. `spec-kit/constitution/`
2. `spec-kit/knowledge/`
3. `spec-kit/specs/`
4. fuentes crudas en `info/` y `public/assets/`
5. implementacion en `src/`

El codigo no define por si solo la verdad del producto. El codigo implementa la verdad ya acordada en este kit.

## 3. Modo de trabajo

- La persona responsable puede agregar o reemplazar documentos fuente.
- La IA normaliza, resume, especifica e implementa.
- Antes de cambiar comportamiento, la IA debe revisar si la regla ya existe en este kit.
- Si la regla no existe, la IA debe crearla o actualizarla en este kit junto con el cambio de codigo.

## 4. Principios de cambio

- Cambios pequenos y trazables.
- Toda decision funcional importante debe quedar escrita.
- Las fuentes binarias se interpretan, pero no se alteran.
- Las paginas visibles al usuario deben mantener consistencia bilingue cuando aplique.
- Las decisiones de UI deben respetar el stack actual: React, SCSS modular por componente, Vite e i18n con `react-intl`.

## 5. Estados permitidos

Cada regla, flujo o iniciativa relevante debe poder clasificarse como:

- `implemented`: ya esta reflejada en el codigo actual.
- `intended`: ya fue decidida pero todavia no esta completa.
- `proposed`: idea valida pero aun no consolidada.
- `deprecated`: existio, pero ya no debe usarse.

## 6. Restricciones para futuras implementaciones

- No reintroducir HTML legacy o scripts globales si React ya cubre el flujo.
- No agregar librerias nuevas sin una razon clara y documentada.
- No romper la estructura de una carpeta por componente salvo necesidad real.
- No mover logica de contenido al JSX si puede vivir mejor en `src/data/` o `src/i18n/`.

## 7. Criterio de exito

El proyecto esta bien mantenido cuando:

- las fuentes crudas estan inventariadas,
- las decisiones de negocio estan explicitas,
- el stack frontend tiene reglas claras,
- y cualquier nueva IA puede continuar el trabajo sin reconstruir el contexto desde cero.

