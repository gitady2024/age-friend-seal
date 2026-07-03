---
name: monitoreo_edadismo
description: "Rutina autónoma mensual de scraping, filtrado multidimensional, alerta de correo y generación de esquemas de Firestore para novedades legales y de edadismo en la UE, Sudamérica y Australia, incorporando umbrales de edad y directrices de la Convención Interamericana."
---

# Rutina de Monitoreo Crítico y Alertas de Inclusión Laboral Sénior (Advanced Compliance)

Esta directiva establece el comportamiento y los parámetros técnicos del agente de compliance para ejecutar la auditoría de edadismo en la UE, América Latina y Australia de forma periódica, basándose en la base de conocimiento de *Leyes de protección a la edad.docx*.

## 1. Scraping y Auditoría Temporal
*   **Frecuencia**: Cada 30 días.
*   **Alcance Geográfico y Umbrales de Edad Legal**:
    *   **Europa (UE)**: Estados miembros (prioridad en España, Francia, Alemania e Italia). Umbral de protección activa y retención: **50+ años** (Directiva 2000/78/CE).
    *   **Sudamérica/Latinoamérica**: Desde México hasta Argentina (prioridad en Brasil, Chile, Colombia y Argentina). Umbral de protección laboral y de derechos humanos: **60+ años** (según la *Convención Interamericana sobre la Protección de los Derechos Humanos de las Personas Mayores*).
    *   **Oceanía (Australia)**: Umbral de retención activa y Age Management: **50+ años** (Age Discrimination Act 2004).
*   **Fuentes Oficiales a Monitorear (Scrape Targets)**:
    *   `eur-lex.europa.eu` (Directivas europeas y planes de envejecimiento activo).
    *   `legislation.gov.au` (Acts del parlamento federal y programas de retención de trabajadores maduros).
    *   `ilo.org/normlex` (Discusiones, convenios y recomendaciones de la OIT, ej. Recomendación 162).
    *   `repositorio.cepal.org` (Estudios y políticas de empleabilidad sénior para América Latina).
    *   Bases nacionales: InfoLEG (Argentina), Ley Chile, Diario Oficial de la Unión (Brasil).
*   **Palabras Clave de Búsqueda (Keywords)**:
    *   *Globales*: `"Silver Economy"`, `"Active Ageing"`, `"Longevity Economy"`, `"Senior Employability"`, `"Age Management"`.
    *   *Latinoamérica*: `"Economía Plateada"`, `"Adulto Mayor"`, `"Trabajador Maduro"`, `"Envejecimiento Activo"`, `"Discriminación por Edad"`.

## 2. Filtrado Multidimensional y Enfoque Normativo
Cada hallazgo debe ser clasificado en:
1.  **País**: Nombre del territorio nacional.
2.  **Sector**: `Público`, `Privado` o `Ambos`.
3.  **Tipo de Enfoque Normativo**:
    *   *Cumplimiento Negativo* (Típico en EE.UU. y LatAm): Enfocado en "no discriminar", "no despedir" y multas por exclusión.
    *   *Prácticas Positivas* (Típico en UE y Australia): Enfocado en "fomento", "adaptabilidad del puesto", "AgeTech" e incentivos fiscales.
4.  **Vector de Negocio**: Uno de los 9 vectores de la plataforma:
    *   *Finanzas y Seguro*
    *   *Salud y Farmacia*
    *   *Tecnología y Software*
    *   *Comercio y Distribución*
    *   *Manufactura e Industria*
    *   *Educación*
    *   *Bienes Raíces y Construcción*
    *   *Energía y Recursos Naturales*
    *   *Entretenimiento, Medios y Turismo*

## 3. Estructura de Alertas de Correo (SMTP / Brevo API)
*   **Destinatario**: `noved_autodiag@agefriendseal.com`
*   **Asunto**: `[ALERTA DE ACTUALIZACIÓN] - Novedad Normativa Detectada - [País]`
*   **Cuerpo (HTML/Texto)**:
    *   **Ficha de Clasificación Técnica** (País, Norma, Tipo, Sector, Vector, Enfoque, Umbral de Edad Afectado).
    *   **Matriz de Impacto en Autodiagnóstico** (Explicación del cambio, justificación del vector y afección a las 15 preguntas).

## 4. Estructura JSON para Firestore
La actualización debe reflejarse en la colección `/countries/` con el siguiente contrato JSON:
```json
{
  "country_code": "ISO-CODE",
  "last_updated": "ISO-TIMESTAMP",
  "regulations": [
    {
      "id": "REG-ID",
      "name": "Nombre oficial de la norma",
      "type": "hard_law | soft_law",
      "sector": "public | private | both",
      "vector": "Nombre del vector asignado",
      "impact": {
        "critical_block": {
          "enabled": true,
          "target_pillar": 2,
          "trigger_question_idx": 5,
          "trigger_score_threshold": 1,
          "max_pillar_score_allowed": 50
        },
        "score_multiplier": {
          "enabled": false,
          "target_question_idx": 1,
          "multiplier": 1.2
        },
        "question_footnote": {
          "enabled": true,
          "target_question_idx": 5,
          "text": "Aclaración de cumplimiento legal local para el usuario"
        }
      }
    }
  ]
}
```
