export const questions = [
  {
    pilar: 1,
    pilarName: { es: "Pilar 1: Accesibilidad Fisica", en: "Pillar 1: Physical Accessibility" },
    text: {
      es: "El establecimiento dispone de accesos sin escalones o rampas antideslizantes adecuadas?",
      en: "Does the location have step-free access or suitable non-slip ramps?"
    },
    options: [
      { score: 100, text: { es: "Si, el acceso es plano o cuenta con rampas adecuadas.", en: "Yes, access is flat or has suitable ramps." } },
      { score: 50, text: { es: "Parcialmente, hay rampa pero puede mejorar.", en: "Partially, there is a ramp but it can improve." } },
      { score: 0, text: { es: "No, hay escalones obligatorios.", en: "No, there are mandatory steps." } }
    ],
    recommendation: {
      es: "Instalar una rampa antideslizante con pasamanos en el acceso principal.",
      en: "Install a non-slip ramp with handrails at the main entrance."
    }
  },
  {
    pilar: 1,
    pilarName: { es: "Pilar 1: Accesibilidad Fisica", en: "Pillar 1: Physical Accessibility" },
    text: { es: "Hay asientos de descanso comodos en zonas de espera?", en: "Are comfortable rest seats available in waiting areas?" },
    options: [
      { score: 100, text: { es: "Si, suficientes y adecuados.", en: "Yes, enough and suitable." } },
      { score: 50, text: { es: "Hay algunos, pero no son ideales.", en: "There are some, but they are not ideal." } },
      { score: 0, text: { es: "No hay asientos de descanso.", en: "There are no rest seats." } }
    ],
    recommendation: { es: "Agregar sillas firmes con apoyabrazos y altura adecuada.", en: "Add firm chairs with armrests and suitable height." }
  },
  {
    pilar: 1,
    pilarName: { es: "Pilar 1: Accesibilidad Fisica", en: "Pillar 1: Physical Accessibility" },
    text: { es: "La iluminacion evita zonas oscuras en pasillos y banos?", en: "Does lighting avoid dark areas in hallways and bathrooms?" },
    options: [
      { score: 100, text: { es: "Si, es uniforme y clara.", en: "Yes, it is uniform and clear." } },
      { score: 50, text: { es: "Es aceptable, con algunos puntos debiles.", en: "Acceptable, with some weak spots." } },
      { score: 0, text: { es: "No, la iluminacion es deficiente.", en: "No, lighting is poor." } }
    ],
    recommendation: { es: "Reforzar luminarias LED neutras en pasillos, accesos y banos.", en: "Improve neutral LED lighting in hallways, entrances, and bathrooms." }
  },
  {
    pilar: 1,
    pilarName: { es: "Pilar 1: Accesibilidad Fisica", en: "Pillar 1: Physical Accessibility" },
    text: { es: "La senaletica usa letra grande y alto contraste?", en: "Does signage use large type and high contrast?" },
    options: [
      { score: 100, text: { es: "Si, toda es legible.", en: "Yes, all signage is legible." } },
      { score: 50, text: { es: "Algunos carteles cumplen.", en: "Some signs comply." } },
      { score: 0, text: { es: "No, es pequena o decorativa.", en: "No, it is small or decorative." } }
    ],
    recommendation: { es: "Redisenar carteles criticos con tipografia grande y contraste alto.", en: "Redesign critical signs with large type and high contrast." }
  },
  {
    pilar: 1,
    pilarName: { es: "Pilar 1: Accesibilidad Fisica", en: "Pillar 1: Physical Accessibility" },
    text: { es: "Los banos y circulaciones contemplan movilidad reducida?", en: "Do bathrooms and circulation areas support reduced mobility?" },
    options: [
      { score: 100, text: { es: "Si, estan adaptados.", en: "Yes, they are adapted." } },
      { score: 50, text: { es: "Parcialmente.", en: "Partially." } },
      { score: 0, text: { es: "No.", en: "No." } }
    ],
    recommendation: { es: "Revisar ancho de paso, barras de apoyo y espacios de giro.", en: "Review passage width, support bars, and turning space." }
  },
  {
    pilar: 2,
    pilarName: { es: "Pilar 2: Atencion y Servicio", en: "Pillar 2: Customer Service" },
    text: { es: "El personal recibe formacion para atender sin edadismo?", en: "Is staff trained to serve customers without ageism?" },
    options: [
      { score: 100, text: { es: "Si, hay capacitacion formal.", en: "Yes, there is formal training." } },
      { score: 50, text: { es: "Solo de manera informal.", en: "Only informally." } },
      { score: 0, text: { es: "No.", en: "No." } }
    ],
    recommendation: { es: "Implementar capacitacion breve sobre trato respetuoso y diversidad generacional.", en: "Run short training on respectful service and generational diversity." }
  },
  {
    pilar: 2,
    pilarName: { es: "Pilar 2: Atencion y Servicio", en: "Pillar 2: Customer Service" },
    text: { es: "Existe atencion humana disponible cuando el canal digital falla?", en: "Is human assistance available when digital channels fail?" },
    options: [
      { score: 100, text: { es: "Si, siempre.", en: "Yes, always." } },
      { score: 50, text: { es: "A veces.", en: "Sometimes." } },
      { score: 0, text: { es: "No.", en: "No." } }
    ],
    recommendation: { es: "Crear una ruta visible para hablar con una persona real.", en: "Create a visible path to reach a real person." }
  },
  {
    pilar: 2,
    pilarName: { es: "Pilar 2: Atencion y Servicio", en: "Pillar 2: Customer Service" },
    text: { es: "Los tiempos de atencion consideran personas que requieren mas apoyo?", en: "Do service times account for people who need extra support?" },
    options: [
      { score: 100, text: { es: "Si.", en: "Yes." } },
      { score: 50, text: { es: "Depende del equipo.", en: "It depends on the team." } },
      { score: 0, text: { es: "No.", en: "No." } }
    ],
    recommendation: { es: "Definir protocolo para atencion pausada, clara y sin presion.", en: "Define a protocol for slower, clear, pressure-free service." }
  },
  {
    pilar: 2,
    pilarName: { es: "Pilar 2: Atencion y Servicio", en: "Pillar 2: Customer Service" },
    text: { es: "Se recogen reclamos o sugerencias de clientes mayores?", en: "Are complaints or suggestions from older customers collected?" },
    options: [
      { score: 100, text: { es: "Si, de forma sistematica.", en: "Yes, systematically." } },
      { score: 50, text: { es: "Ocasionalmente.", en: "Occasionally." } },
      { score: 0, text: { es: "No.", en: "No." } }
    ],
    recommendation: { es: "Agregar una pregunta simple sobre accesibilidad y claridad del servicio.", en: "Add a simple question about accessibility and service clarity." }
  },
  {
    pilar: 2,
    pilarName: { es: "Pilar 2: Atencion y Servicio", en: "Pillar 2: Customer Service" },
    text: { es: "La comunicacion del personal evita diminutivos o trato infantilizante?", en: "Does staff communication avoid patronizing language?" },
    options: [
      { score: 100, text: { es: "Si.", en: "Yes." } },
      { score: 50, text: { es: "No siempre.", en: "Not always." } },
      { score: 0, text: { es: "No hay criterio definido.", en: "There is no defined standard." } }
    ],
    recommendation: { es: "Establecer guias de lenguaje respetuoso para clientes senior.", en: "Set respectful language guidelines for senior customers." }
  },
  {
    pilar: 3,
    pilarName: { es: "Pilar 3: Inclusion y Comunicacion", en: "Pillar 3: Inclusion & Communication" },
    text: { es: "La web o app tiene contraste, tamanos legibles y botones claros?", en: "Does the website or app have contrast, readable type, and clear buttons?" },
    options: [
      { score: 100, text: { es: "Si.", en: "Yes." } },
      { score: 50, text: { es: "Parcialmente.", en: "Partially." } },
      { score: 0, text: { es: "No.", en: "No." } }
    ],
    recommendation: { es: "Auditar contraste, tamano de texto y jerarquia de botones.", en: "Audit contrast, text size, and button hierarchy." }
  },
  {
    pilar: 3,
    pilarName: { es: "Pilar 3: Inclusion y Comunicacion", en: "Pillar 3: Inclusion & Communication" },
    text: { es: "La publicidad muestra diversidad de edades sin estereotipos?", en: "Does advertising show age diversity without stereotypes?" },
    options: [
      { score: 100, text: { es: "Si.", en: "Yes." } },
      { score: 50, text: { es: "A veces.", en: "Sometimes." } },
      { score: 0, text: { es: "No.", en: "No." } }
    ],
    recommendation: { es: "Actualizar piezas visuales para representar personas mayores activas y diversas.", en: "Update visuals to represent active and diverse older adults." }
  },
  {
    pilar: 3,
    pilarName: { es: "Pilar 3: Inclusion y Comunicacion", en: "Pillar 3: Inclusion & Communication" },
    text: { es: "Existen alternativas no digitales para tramites importantes?", en: "Are non-digital alternatives available for important procedures?" },
    options: [
      { score: 100, text: { es: "Si.", en: "Yes." } },
      { score: 50, text: { es: "Solo algunas.", en: "Only some." } },
      { score: 0, text: { es: "No.", en: "No." } }
    ],
    recommendation: { es: "Mantener telefono, mostrador o asistencia guiada para tramites clave.", en: "Keep phone, desk, or guided assistance for key procedures." }
  },
  {
    pilar: 3,
    pilarName: { es: "Pilar 3: Inclusion y Comunicacion", en: "Pillar 3: Inclusion & Communication" },
    text: { es: "Se mide la experiencia del publico mayor de 50?", en: "Is the experience of the 50+ audience measured?" },
    options: [
      { score: 100, text: { es: "Si.", en: "Yes." } },
      { score: 50, text: { es: "De manera indirecta.", en: "Indirectly." } },
      { score: 0, text: { es: "No.", en: "No." } }
    ],
    recommendation: { es: "Segmentar encuestas de satisfaccion por rango etario.", en: "Segment satisfaction surveys by age range." }
  },
  {
    pilar: 3,
    pilarName: { es: "Pilar 3: Inclusion y Comunicacion", en: "Pillar 3: Inclusion & Communication" },
    text: { es: "La empresa promueve equipos intergeneracionales?", en: "Does the company promote intergenerational teams?" },
    options: [
      { score: 100, text: { es: "Si, activamente.", en: "Yes, actively." } },
      { score: 50, text: { es: "Ocurre, pero sin programa.", en: "It happens, but without a program." } },
      { score: 0, text: { es: "No.", en: "No." } }
    ],
    recommendation: { es: "Crear mentorias cruzadas y equipos con diversidad generacional.", en: "Create cross-mentoring and age-diverse teams." }
  }
];
