# Reglas del Proyecto: Compliance de Edadismo y Economía Plateada

1.  **Monitoreo Periódico**: El agente debe ejecutar periódicamente una auditoría de scraping de las novedades de edadismo y economía plateada en la Unión Europea, América Latina y Australia.
2.  **Clasificación de Normas**: Toda norma detectada debe estructurarse obligatoriamente bajo los 9 vectores y los 2 sectores (Público/Privado).
3.  **Alertas Automatizadas**: Ante la detección de una norma relevante, se debe enviar una alerta por correo electrónico a `noved_autodiag@agefriendseal.com` utilizando la plantilla de Ficha Técnica y Matriz de Impacto.
4.  **Inyección en Firestore**: Se debe formatear el JSON correspondiente de la norma con soporte para `critical_block`, `score_multiplier` o `question_footnote` para inyectar en la colección `/countries/`.
