export const questions = [
  {
    pilar: 1,
    pilarName: { es: "Pilar 1: Accesibilidad Fisica", en: "Pillar 1: Physical Accessibility", pt: "Pilar 1: Acessibilidade Física" },
    text: {
      es: "El establecimiento dispone de accesos sin escalones o rampas antideslizantes adecuadas?",
      en: "Does the location have step-free access or suitable non-slip ramps?",
      pt: "O estabelecimento possui acesso sem degraus ou rampas antiderrapantes adequadas?"
    },
    options: [
      { score: 100, text: { es: "Si, el acceso es plano o cuenta con rampas adecuadas.", en: "Yes, access is flat or has suitable ramps.", pt: "Sim, o acesso é plano ou possui rampas adequadas." } },
      { score: 50, text: { es: "Parcialmente, hay rampa pero puede mejorar.", en: "Partially, there is a ramp but it can improve.", pt: "Parcialmente existe uma rampa mas pode melhorar." } },
      { score: 0, text: { es: "No, hay escalones obligatorios.", en: "No, there are mandatory steps.", pt: "Não, existem etapas obrigatórias." } }
    ],
    recommendation: {
      es: "Instalar una rampa antideslizante con pasamanos en el acceso principal.",
      en: "Install a non-slip ramp with handrails at the main entrance.",
      pt: "Instalar rampa antiderrapante com corrimão na entrada principal."
    }
  },
  {
    pilar: 1,
    pilarName: { es: "Pilar 1: Accesibilidad Fisica", en: "Pillar 1: Physical Accessibility", pt: "Pilar 1: Acessibilidade Física" },
    text: { es: "Hay asientos de descanso comodos en zonas de espera?", en: "Are comfortable rest seats available in waiting areas?", pt: "Há assentos de descanso confortáveis em áreas de espera?" },
    options: [
      { score: 100, text: { es: "Si, suficientes y adecuados.", en: "Yes, enough and suitable.", pt: "Sim, suficiente e adequado." } },
      { score: 50, text: { es: "Hay algunos, pero no son ideales.", en: "There are some, but they are not ideal.", pt: "Existem alguns, mas não são ideais." } },
      { score: 0, text: { es: "No hay asientos de descanso.", en: "There are no rest seats.", pt: "Não há assentos de descanso." } }
    ],
    recommendation: { es: "Agregar sillas firmes con apoyabrazos y altura adecuada.", en: "Add firm chairs with armrests and suitable height.", pt: "Adicione cadeiras firmes com apoios de braços e altura adequada." }
  },
  {
    pilar: 1,
    pilarName: { es: "Pilar 1: Accesibilidad Fisica", en: "Pillar 1: Physical Accessibility", pt: "Pilar 1: Acessibilidade Física" },
    text: { es: "La iluminacion evita zonas oscuras en pasillos y banos?", en: "Does lighting avoid dark areas in hallways and bathrooms?", pt: "A iluminação evita áreas escuras em corredores e banheiros?" },
    options: [
      { score: 100, text: { es: "Si, es uniforme y clara.", en: "Yes, it is uniform and clear.", pt: "Sim, é uniforme e claro." } },
      { score: 50, text: { es: "Es aceptable, con algunos puntos debiles.", en: "Acceptable, with some weak spots.", pt: "É aceitável, com alguns pontos fracos." } },
      { score: 0, text: { es: "No, la iluminacion es deficiente.", en: "No, lighting is poor.", pt: "Não, a iluminação é fraca." } }
    ],
    recommendation: { es: "Reforzar luminarias LED neutras en pasillos, accesos y banos.", en: "Improve neutral LED lighting in hallways, entrances, and bathrooms.", pt: "Reforce a iluminação LED neutra em corredores, entradas e banheiros." }
  },
  {
    pilar: 1,
    pilarName: { es: "Pilar 1: Accesibilidad Fisica", en: "Pillar 1: Physical Accessibility", pt: "Pilar 1: Acessibilidade Física" },
    text: { es: "La senaletica usa letra grande y alto contraste?", en: "Does signage use large type and high contrast?", pt: "A sinalização usa fonte grande e alto contraste?" },
    options: [
      { score: 100, text: { es: "Si, toda es legible.", en: "Yes, all signage is legible.", pt: "Sim, tudo é legível." } },
      { score: 50, text: { es: "Algunos carteles cumplen.", en: "Some signs comply.", pt: "Alguns cartazes obedecem." } },
      { score: 0, text: { es: "No, es pequena o decorativa.", en: "No, it is small or decorative.", pt: "Não, é pequeno ou decorativo." } }
    ],
    recommendation: { es: "Redisenar carteles criticos con tipografia grande y contraste alto.", en: "Redesign critical signs with large type and high contrast.", pt: "Redesenhe pôsteres críticos com tipografia grande e alto contraste." }
  },
  {
    pilar: 1,
    pilarName: { es: "Pilar 1: Accesibilidad Fisica", en: "Pillar 1: Physical Accessibility", pt: "Pilar 1: Acessibilidade Física" },
    text: { es: "Los banos y circulaciones contemplan movilidad reducida?", en: "Do bathrooms and circulation areas support reduced mobility?", pt: "As casas de banho e circulações contemplam mobilidade reduzida?" },
    options: [
      { score: 100, text: { es: "Si, estan adaptados.", en: "Yes, they are adapted.", pt: "Sim, eles estão adaptados." } },
      { score: 50, text: { es: "Parcialmente.", en: "Partially.", pt: "Parcialmente." } },
      { score: 0, text: { es: "No.", en: "No.", pt: "Não." } }
    ],
    recommendation: { es: "Revisar ancho de paso, barras de apoyo y espacios de giro.", en: "Review passage width, support bars, and turning space.", pt: "Verifique a largura do degrau, as barras de apoio e os espaços de viragem." }
  },
  {
    pilar: 2,
    pilarName: { es: "Pilar 2: Atencion y Servicio", en: "Pillar 2: Customer Service", pt: "Pilar 2: Atenção e Serviço" },
    text: { es: "El personal recibe formacion para atender sin edadismo?", en: "Is staff trained to serve customers without ageism?", pt: "A equipe recebe treinamento para servir sem preconceito de idade?" },
    options: [
      { score: 100, text: { es: "Si, hay capacitacion formal.", en: "Yes, there is formal training.", pt: "Sim, existe treinamento formal." } },
      { score: 50, text: { es: "Solo de manera informal.", en: "Only informally.", pt: "Apenas informalmente." } },
      { score: 0, text: { es: "No.", en: "No.", pt: "Não." } }
    ],
    recommendation: { es: "Implementar capacitacion breve sobre trato respetuoso y diversidad generacional.", en: "Run short training on respectful service and generational diversity.", pt: "Implementar treinamento breve sobre tratamento respeitoso e diversidade geracional." }
  },
  {
    pilar: 2,
    pilarName: { es: "Pilar 2: Atencion y Servicio", en: "Pillar 2: Customer Service", pt: "Pilar 2: Atenção e Serviço" },
    text: { es: "Existe atencion humana disponible cuando el canal digital falla?", en: "Is human assistance available when digital channels fail?", pt: "Existe atenção humana disponível quando o canal digital falha?" },
    options: [
      { score: 100, text: { es: "Si, siempre.", en: "Yes, always.", pt: "Sim, sempre." } },
      { score: 50, text: { es: "A veces.", en: "Sometimes.", pt: "Às vezes." } },
      { score: 0, text: { es: "No.", en: "No.", pt: "Não." } }
    ],
    recommendation: { es: "Crear una ruta visible para hablar con una persona real.", en: "Create a visible path to reach a real person.", pt: "Crie uma rota visível para falar com uma pessoa real." }
  },
  {
    pilar: 2,
    pilarName: { es: "Pilar 2: Atencion y Servicio", en: "Pillar 2: Customer Service", pt: "Pilar 2: Atenção e Serviço" },
    text: { es: "Los tiempos de atencion consideran personas que requieren mas apoyo?", en: "Do service times account for people who need extra support?", pt: "Os tempos de atenção consideram as pessoas que necessitam de mais apoio?" },
    options: [
      { score: 100, text: { es: "Si.", en: "Yes.", pt: "Sim." } },
      { score: 50, text: { es: "Depende del equipo.", en: "It depends on the team.", pt: "Depende da equipe." } },
      { score: 0, text: { es: "No.", en: "No.", pt: "Não." } }
    ],
    recommendation: { es: "Definir protocolo para atencion pausada, clara y sin presion.", en: "Define a protocol for slower, clear, pressure-free service.", pt: "Defina protocolo para atenção lenta, clara e sem pressão." }
  },
  {
    pilar: 2,
    pilarName: { es: "Pilar 2: Atencion y Servicio", en: "Pillar 2: Customer Service", pt: "Pilar 2: Atenção e Serviço" },
    text: { es: "Se recogen reclamos o sugerencias de clientes mayores?", en: "Are complaints or suggestions from older customers collected?", pt: "São recolhidas reclamações ou sugestões de clientes mais antigos?" },
    options: [
      { score: 100, text: { es: "Si, de forma sistematica.", en: "Yes, systematically.", pt: "Sim, sistematicamente." } },
      { score: 50, text: { es: "Ocasionalmente.", en: "Occasionally.", pt: "Ocasionalmente." } },
      { score: 0, text: { es: "No.", en: "No.", pt: "Não." } }
    ],
    recommendation: { es: "Agregar una pregunta simple sobre accesibilidad y claridad del servicio.", en: "Add a simple question about accessibility and service clarity.", pt: "Adicione uma pergunta simples sobre acessibilidade e clareza do serviço." }
  },
  {
    pilar: 2,
    pilarName: { es: "Pilar 2: Atencion y Servicio", en: "Pillar 2: Customer Service", pt: "Pilar 2: Atenção e Serviço" },
    text: { es: "La comunicacion del personal evita diminutivos o trato infantilizante?", en: "Does staff communication avoid patronizing language?", pt: "A comunicação da equipe evita diminutivos ou tratamento infantilizante?" },
    options: [
      { score: 100, text: { es: "Si.", en: "Yes.", pt: "Sim." } },
      { score: 50, text: { es: "No siempre.", en: "Not always.", pt: "Nem sempre." } },
      { score: 0, text: { es: "No hay criterio definido.", en: "There is no defined standard.", pt: "Não há critério definido." } }
    ],
    recommendation: { es: "Establecer guias de lenguaje respetuoso para clientes senior.", en: "Set respectful language guidelines for senior customers.", pt: "Estabeleça diretrizes de linguagem respeitosas para clientes seniores." }
  },
  {
    pilar: 3,
    pilarName: { es: "Pilar 3: Inclusion y Comunicacion", en: "Pillar 3: Inclusion & Communication", pt: "Pilar 3: Inclusão e Comunicação" },
    text: { es: "La web o app tiene contraste, tamanos legibles y botones claros?", en: "Does the website or app have contrast, readable type, and clear buttons?", pt: "O site ou aplicativo possui contraste, tamanhos legíveis e botões claros?" },
    options: [
      { score: 100, text: { es: "Si.", en: "Yes.", pt: "Sim." } },
      { score: 50, text: { es: "Parcialmente.", en: "Partially.", pt: "Parcialmente." } },
      { score: 0, text: { es: "No.", en: "No.", pt: "Não." } }
    ],
    recommendation: { es: "Auditar contraste, tamano de texto y jerarquia de botones.", en: "Audit contrast, text size, and button hierarchy.", pt: "Contraste de auditoria, tamanho do texto e hierarquia de botões." }
  },
  {
    pilar: 3,
    pilarName: { es: "Pilar 3: Inclusion y Comunicacion", en: "Pillar 3: Inclusion & Communication", pt: "Pilar 3: Inclusão e Comunicação" },
    text: { es: "La publicidad muestra diversidad de edades sin estereotipos?", en: "Does advertising show age diversity without stereotypes?", pt: "A publicidade mostra a diversidade etária sem estereótipos?" },
    options: [
      { score: 100, text: { es: "Si.", en: "Yes.", pt: "Sim." } },
      { score: 50, text: { es: "A veces.", en: "Sometimes.", pt: "Às vezes." } },
      { score: 0, text: { es: "No.", en: "No.", pt: "Não." } }
    ],
    recommendation: { es: "Actualizar piezas visuales para representar personas mayores activas y diversas.", en: "Update visuals to represent active and diverse older adults.", pt: "Atualize peças visuais para representar idosos ativos e diversificados." }
  },
  {
    pilar: 3,
    pilarName: { es: "Pilar 3: Inclusion y Comunicacion", en: "Pillar 3: Inclusion & Communication", pt: "Pilar 3: Inclusão e Comunicação" },
    text: { es: "Existen alternativas no digitales para tramites importantes?", en: "Are non-digital alternatives available for important procedures?", pt: "Existem alternativas não digitais para procedimentos importantes?" },
    options: [
      { score: 100, text: { es: "Si.", en: "Yes.", pt: "Sim." } },
      { score: 50, text: { es: "Solo algunas.", en: "Only some.", pt: "Apenas alguns." } },
      { score: 0, text: { es: "No.", en: "No.", pt: "Não." } }
    ],
    recommendation: { es: "Mantener telefono, mostrador o asistencia guiada para tramites clave.", en: "Keep phone, desk, or guided assistance for key procedures.", pt: "Manter atendimento telefônico, balcão ou guiado para procedimentos chave." }
  },
  {
    pilar: 3,
    pilarName: { es: "Pilar 3: Inclusion y Comunicacion", en: "Pillar 3: Inclusion & Communication", pt: "Pilar 3: Inclusão e Comunicação" },
    text: { es: "Se mide la experiencia del publico mayor de 50?", en: "Is the experience of the 50+ audience measured?", pt: "A experiência do público com mais de 50 anos é medida?" },
    options: [
      { score: 100, text: { es: "Si.", en: "Yes.", pt: "Sim." } },
      { score: 50, text: { es: "De manera indirecta.", en: "Indirectly.", pt: "Indiretamente." } },
      { score: 0, text: { es: "No.", en: "No.", pt: "Não." } }
    ],
    recommendation: { es: "Segmentar encuestas de satisfaccion por rango etario.", en: "Segment satisfaction surveys by age range.", pt: "Segmentar pesquisas de satisfação por faixa etária." }
  },
  {
    pilar: 3,
    pilarName: { es: "Pilar 3: Inclusion y Comunicacion", en: "Pillar 3: Inclusion & Communication", pt: "Pilar 3: Inclusão e Comunicação" },
    text: { es: "La empresa promueve equipos intergeneracionales?", en: "Does the company promote intergenerational teams?", pt: "A empresa promove equipas intergeracionais?" },
    options: [
      { score: 100, text: { es: "Si, activamente.", en: "Yes, actively.", pt: "Sim, ativamente." } },
      { score: 50, text: { es: "Ocurre, pero sin programa.", en: "It happens, but without a program.", pt: "Acontece, mas sem programa." } },
      { score: 0, text: { es: "No.", en: "No.", pt: "Não." } }
    ],
    recommendation: { es: "Crear mentorias cruzadas y equipos con diversidad generacional.", en: "Create cross-mentoring and age-diverse teams.", pt: "Crie mentorias cruzadas e equipes com diversidade geracional." }
  }
];
