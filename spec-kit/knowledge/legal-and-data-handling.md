# Legal And Data Handling

## Estado

`implemented`

## Reglas legales detectadas

Desde `info/terminos.html` y `info/privacidad.html` se desprenden estas reglas operativas:

- el portal incluye autodiagnostico, reportes, sello inicial y solicitud de auditorias avanzadas;
- para avanzar en el cuestionario se pide cuenta con datos corporativos y de contacto;
- el material, metodologia, cuestionario y distintivos se consideran propiedad intelectual del proyecto;
- los niveles medio y premium no se emiten de forma automatica;
- la politica de privacidad declara marcos como GDPR, CCPA/CPRA y referencias latinoamericanas;
- se recaban datos corporativos, datos del contacto, respuestas del cuestionario y datos tecnicos de navegacion.

## Implicancias para producto

- la descarga de materiales premium puede estar condicionada a autenticacion o registro;
- los formularios deben pedir solo la informacion necesaria para el flujo;
- no hay que prometer certificacion automatica cuando el flujo real es de contacto o auditoria;
- cualquier cambio en el onboarding o captura de datos debe revisar consistencia con estos textos legales.

## Implicancias para frontend

- formularios y modales deben seguir una logica clara de consentimiento y finalidad;
- si se agrega un paso nuevo de captura, conviene reflejarlo luego en textos legales;
- los enlaces a terminos y privacidad deben mantenerse visibles y vigentes.

