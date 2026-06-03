// Configuración de EmailJS para envío de correos reales (Preservada)
const EMAILJS_CONFIG = {
    publicKey: "L14V6L0j7yEspc91H",      // Reemplazar por tu clave pública de EmailJS
    serviceId: "service_iwhulyi",      // Reemplazar por tu ID de servicio (ej. gmail)
    templateId: "template_wlejnde"     // Reemplazar por tu ID de plantilla
};

// Detectar Idioma Actual
const currentLang = document.documentElement.lang || 'es';

// Configuración de Feeds RSS del Radar de Longevidad
const RSS_FEEDS_ES = [
    {
        name: "Google News (Economía & Generación Plateada)",
        url: "https://news.google.com/rss/search?q=%22economia+plateada%22+OR+%22generacion+plateada%22+OR+%22silver+economy%22+OR+%22silver+generation%22&hl=es-419&gl=CL&ceid=CL:es-419",
        category: "Mercado"
    },
    {
        name: "Google News (Equipos & Mentoría Inversa)",
        url: "https://news.google.com/rss/search?q=%22equipos+intergeneracionales%22+OR+%22mentoria+inversa%22+OR+%22diversidad+generacional%22+OR+%22talento+senior%22&hl=es-419&gl=CL&ceid=CL:es-419",
        category: "Talento"
    },
    {
        name: "Google News (Edadismo & Sector Privado)",
        url: "https://news.google.com/rss/search?q=(edadismo+OR+ageism)+(empresas+OR+corporativo+OR+empleo)&hl=es-419&gl=CL&ceid=CL:es-419",
        category: "Políticas"
    },
    {
        name: "Google News (Gobiernos & Leyes Senior)",
        url: "https://news.google.com/rss/search?q=(gobierno+OR+municipio+OR+ayuntamiento+OR+ministerio+OR+%22politica+publica%22)+(%22talento+senior%22+OR+edadismo+OR+%22envejecimiento+activo%22)&hl=es-419&gl=CL&ceid=CL:es-419",
        category: "Gobierno"
    },
    {
        name: "SilverEco Internacional (Negocios & Innovación)",
        url: "https://www.silvereco.org/en/feed/",
        category: "Innovación"
    }
];

const RSS_FEEDS_EN = [
    {
        name: "Google News (Silver Economy & Longevity)",
        url: "https://news.google.com/rss/search?q=%22silver+economy%22+OR+%22longevity+economy%22+OR+%22silver+generation%22+OR+%22age-friendly%22&hl=en-US&gl=US&ceid=US:en",
        category: "Market"
    },
    {
        name: "Google News (Intergenerational Teams & Mentoring)",
        url: "https://news.google.com/rss/search?q=%22intergenerational+teams%22+OR+%22reverse+mentoring%22+OR+%22age+diversity%22+OR+%22senior+talent%22&hl=en-US&gl=US&ceid=US:en",
        category: "Talent"
    },
    {
        name: "Google News (Ageism & Corporate Sector)",
        url: "https://news.google.com/rss/search?q=ageism+AND+(companies+OR+corporate+OR+employment)&hl=en-US&gl=US&ceid=US:en",
        category: "Policies"
    },
    {
        name: "Google News (Governments & Senior Laws)",
        url: "https://news.google.com/rss/search?q=(government+OR+municipality+OR+council)+(%22senior+talent%22+OR+ageism+OR+%22active+ageing%22)&hl=en-US&gl=US&ceid=US:en",
        category: "Government"
    },
    {
        name: "SilverEco International (B2B & Innovation)",
        url: "https://www.silvereco.org/en/feed/",
        category: "Innovation"
    }
];

// Diccionario de Traducciones
const TRANSLATIONS = {
    es: {
        pilar1Name: "Pilar 1: Accesibilidad Física",
        pilar2Name: "Pilar 2: Atención y Servicio",
        pilar3Name: "Pilar 3: Inclusión y Comunicación",
        questionStep: "Pregunta {index} de {total}",
        btnNext: "Siguiente",
        btnFinish: "Finalizar",
        otpSentReal: "Se ha enviado un correo electrónico de confirmación con tu código real a {email}. Por favor, revisa tu bandeja de entrada.",
        otpFallbackTitle: "🔑 Simulación de Correo",
        otpFallbackDesc: "Se ha enviado un código temporal a su casilla. Ingrese el siguiente PIN:",
        otpSentRealConsole: "Enviando correo real vía EmailJS...",
        otpSuccessAlert: "¡Cuenta verificada con éxito! Ahora puede completar el resto del cuestionario.",
        otpErrorMsg: "⚠️ El código ingresado es incorrecto. Intente nuevamente.",
        paymentSuccessAlert: "¡Simulación de pago exitosa! Se ha completado la transacción por $99 USD. Se iniciará la descarga de la Calcomanía de Vitrina personalizada para \"{companyName}\" en formato SVG. Válido por 1 año.",
        pdfAlert: "Generando informe analítico PDF con sus puntuaciones y planes de acción recomendados...",
        contactSuccessAlert: "¡Solicitud enviada con éxito! Nos comunicaremos con usted en un plazo máximo de 24 horas hábiles.",
        axisTalentoTitle: "👥 Eje Talento Interno (ISO 25550 / ISO 25551 / OIT)",
        axisClienteTitle: "🛍️ Eje Cliente Senior & Canales (ISO 25556 / OMS)",
        perfectScoreText: "<strong>¡Excelente puntuación!</strong> Su negocio cumple con todos los parámetros de nuestra evaluación básica. Le sugerimos proceder con la solicitud para la Certificación Condicional o Total.",
        resultsTitle: "Análisis de Amigabilidad - {companyName}",
        statusBasicTitle: "Camino Iniciado (Sello de Compromiso Inicial)",
        statusBasicDesc: "Usted ha completado el autodiagnóstico automático. Esto demuestra que su empresa ha iniciado formalmente el camino hacia la certificación total. Este distintivo digital tiene validez de 1 año y deberá renovarse anualmente.",
        statusMedioTitle: "Certificación Condicional (Nivel Medio)",
        statusMedioDesc: "¡Felicitaciones! Su empresa ha logrado avances significativos en el cumplimiento de la normativa del instituto. Está en la etapa de Certificación Condicional/Previa. Válido por 1 año.",
        statusPremiumTitle: "Empresa Certificada (Nivel Premium)",
        statusPremiumDesc: "Excelente desempeño. Su organización ha cumplimentado el 100% de la normativa exigida para la inclusión de la Economía Plateada. Sello oficial de Empresa Certificada válido por 1 año.",
        decalTitle: "SOMOS AMIGABLES",
        decalSubtitle: "CON LA GENERACIÓN PLATEADA",
        decalBadge: "COMPROMISO INICIAL",
        decalFooter: "VALIDADO INTERNACIONALMENTE • 2026",
        decalNorms: "Norma ISO 25550 / ISO 25551 / ISO 25556",
        newsLoading: "Obteniendo últimas noticias de las fuentes seleccionadas...",
        newsError: "⚠️ No se pudieron cargar las noticias en este momento. Por favor, verifica tu conexión o las URLs de los feeds.",
        newsSourceLabel: "Fuente: {source}",
        newsReadMore: "Leer más ↗",
        pitchSuccessAlert: "¡Formulario enviado con éxito! Se ha notificado a qdoblea@gmail.com y se iniciará la descarga del dossier corporativo de inmediato.",
        pitchToastTitle: "🎯 Nuevo Lead de Alianza",
        pitchToastDesc: "Se ha simulado el envío de un correo a qdoblea@gmail.com con la información del prospecto:"
    },
    en: {
        pilar1Name: "Pillar 1: Physical Accessibility",
        pilar2Name: "Pillar 2: Customer Service",
        pilar3Name: "Pillar 3: Inclusion & Communication",
        questionStep: "Question {index} of {total}",
        btnNext: "Next",
        btnFinish: "Finish",
        otpSentReal: "A confirmation email with your real code has been sent to {email}. Please check your inbox.",
        otpFallbackTitle: "🔑 Email Simulation",
        otpFallbackDesc: "A temporary code has been sent to your inbox. Enter the following PIN:",
        otpSentRealConsole: "Sending real email via EmailJS...",
        otpSuccessAlert: "Account verified successfully! You can now complete the rest of the questionnaire.",
        otpErrorMsg: "⚠️ The code entered is incorrect. Try again.",
        paymentSuccessAlert: "Payment simulation successful! The transaction of $99 USD has been completed. The download of the personalized storefront window decal for \"{companyName}\" in SVG format will begin. Valid for 1 year.",
        pdfAlert: "Generating PDF analytical report with your scores and recommended action plans...",
        contactSuccessAlert: "Request sent successfully! We will contact you within a maximum of 24 business hours.",
        axisTalentoTitle: "👥 Internal Talent Axis (ISO 25550 / ISO 25551 / ILO)",
        axisClienteTitle: "🛍️ Senior Customer & Channels Axis (ISO 25556 / WHO)",
        perfectScoreText: "<strong>Excellent score!</strong> Your business complies with all parameters of our basic evaluation. We suggest proceeding with the request for Conditional or Full Certification.",
        resultsTitle: "Friendliness Analysis - {companyName}",
        statusBasicTitle: "Path Started (Initial Commitment Seal)",
        statusBasicDesc: "You have completed the automated self-diagnostic. This shows that your company has formally started the path towards full certification. This digital badge is valid for 1 year and must be renewed annually.",
        statusMedioTitle: "Conditional Certification (Medium Level)",
        statusMedioDesc: "Congratulations! Your company has made significant progress in complying with the institute's regulations. You are in the Conditional/Prior Certification stage. Valid for 1 year.",
        statusPremiumTitle: "Certified Company (Premium Level)",
        statusPremiumDesc: "Excellent performance. Your organization has met 100% of the required regulations for Silver Economy inclusion. Official Certified Company seal valid for 1 year.",
        decalTitle: "WE ARE AGE-FRIENDLY",
        decalSubtitle: "WITH THE SILVER GENERATION",
        decalBadge: "INITIAL COMMITMENT",
        decalFooter: "VALIDATED INTERNATIONALLY • 2026",
        decalNorms: "ISO 25550 / ISO 25551 / ISO 25556 Standard",
        newsLoading: "Fetching latest news from the selected sources...",
        newsError: "⚠️ Could not load news at this time. Please check your connection or feed URLs.",
        newsSourceLabel: "Source: {source}",
        newsReadMore: "Read more ↗",
        pitchSuccessAlert: "Form submitted successfully! A notification was sent to qdoblea@gmail.com and the corporate dossier download will start immediately.",
        pitchToastTitle: "🎯 New Alliance Lead",
        pitchToastDesc: "A notification email to qdoblea@gmail.com has been simulated with the lead's contact information:"
    }
};

// Cuestionario de 15 Preguntas del Autodiagnóstico Age-Friendly (Localizado)
const QUESTIONS = [
    // Pilar 1: Accesibilidad Física (1-5)
    {
        id: 1,
        pilar: 1,
        pilarName: { es: "Pilar 1: Accesibilidad Física", en: "Pillar 1: Physical Accessibility" },
        text: {
            es: "¿El establecimiento dispone de accesos sin escalones o con rampas antideslizantes adecuadas para personas con movilidad reducida?",
            en: "Does the establishment have step-free access or suitable non-slip ramps for people with reduced mobility?"
        },
        options: [
            { text: { es: "Sí, contamos con accesos totalmente planos o rampas adecuadas.", en: "Yes, we have completely flat access or suitable ramps." }, score: 100 },
            { text: { es: "Parcialmente (hay rampa pero no cumple todos los estándares).", en: "Partially (there is a ramp but it does not meet all standards)." }, score: 50 },
            { text: { es: "No, existen escalones obligatorios para ingresar.", en: "No, there are mandatory steps to enter." }, score: 0 }
        ],
        failRecommendation: {
            es: "Instalar una rampa antideslizante con pasamanos en el acceso principal.",
            en: "Install a non-slip ramp with handrails at the main entrance."
        },
        normative: "OMS (Entornos)"
    },
    {
        id: 2,
        pilar: 1,
        pilarName: { es: "Pilar 1: Accesibilidad Física", en: "Pillar 1: Physical Accessibility" },
        text: {
            es: "¿Existen asientos de descanso cómodos (con reposabrazos) en las zonas de recepción o espera?",
            en: "Are there comfortable rest seats (with armrests) in reception or waiting areas?"
        },
        options: [
            { text: { es: "Sí, hay asientos suficientes y adecuados.", en: "Yes, there are sufficient and suitable seats." }, score: 100 },
            { text: { es: "Hay asientos pero son bajos o no tienen apoyabrazos.", en: "There are seats but they are low or do not have armrests." }, score: 50 },
            { text: { es: "No disponemos de asientos de descanso en las áreas de espera.", en: "We do not have rest seats in the waiting areas." }, score: 0 }
        ],
        failRecommendation: {
            es: "Colocar al menos dos sillas firmes con apoyabrazos y altura adecuada en la recepción para facilitar el descanso y levantamiento.",
            en: "Place at least two firm chairs with armrests and suitable height in reception to facilitate resting and standing up."
        },
        normative: "OMS (Entornos)"
    },
    {
        id: 3,
        pilar: 1,
        pilarName: { es: "Pilar 1: Accesibilidad Física", en: "Pillar 1: Physical Accessibility" },
        text: {
            es: "¿La iluminación en los pasillos principales, zonas de paso y baños es uniforme y evita zonas de sombra?",
            en: "Is lighting in main hallways, passages, and bathrooms uniform and free of shadow zones?"
        },
        options: [
            { text: { es: "Sí, la iluminación es excelente y sin sombras molestas.", en: "Yes, the lighting is excellent and without annoying shadows." }, score: 100 },
            { text: { es: "Es aceptable, pero hay zonas algo oscuras.", en: "It is acceptable, but some areas are somewhat dark." }, score: 50 },
            { text: { es: "No, la iluminación es deficiente en pasillos o baños.", en: "No, the lighting is deficient in hallways or bathrooms." }, score: 0 }
        ],
        failRecommendation: {
            es: "Reemplazar luminarias antiguas por luces LED de alta potencia neutra para eliminar reflejos y zonas de sombra en pasillos.",
            en: "Replace old light fixtures with high-power neutral LED lights to eliminate reflections and shadow zones in hallways."
        },
        normative: "ISO 25550"
    },
    {
        id: 4,
        pilar: 1,
        pilarName: { es: "Pilar 1: Accesibilidad Física", en: "Pillar 1: Physical Accessibility" },
        text: {
            es: "¿Los carteles, letreros e indicaciones dentro del local utilizan letras grandes (mínimo 24px) y colores de alto contraste?",
            en: "Do signs, posters, and directions inside the premises use large letters (minimum 24px) and high-contrast colors?"
        },
        options: [
            { text: { es: "Sí, toda la señalización es grande y legible.", en: "Yes, all signage is large and legible." }, score: 100 },
            { text: { es: "Algunos carteles, pero otros tienen letra pequeña o poco contraste.", en: "Some signs do, but others have small print or little contrast." }, score: 50 },
            { text: { es: "No, la señalización es pequeña o puramente decorativa.", en: "No, signage is small or purely decorative." }, score: 0 }
        ],
        failRecommendation: {
            es: "Rediseñar la señalización de baños y salidas de emergencia usando fuentes grandes, legibles (sans-serif) y alto contraste (ej. texto negro sobre fondo amarillo o blanco).",
            en: "Redesign bathroom and emergency exit signs using large, legible fonts (sans-serif) and high contrast (e.g., black text on a yellow or white background)."
        },
        normative: "OMS (Entornos)"
    },
    {
        id: 5,
        pilar: 1,
        pilarName: { es: "Pilar 1: Accesibilidad Física", en: "Pillar 1: Physical Accessibility" },
        text: {
            es: "¿Los aseos/baños públicos cuentan con barras de apoyo y pisos antideslizantes?",
            en: "Do public restrooms feature grab bars and non-slip floors?"
        },
        options: [
            { text: { es: "Sí, están completamente equipados.", en: "Yes, they are fully equipped." }, score: 100 },
            { text: { es: "Solo piso antideslizante o solo una barra de apoyo.", en: "Only non-slip floor or only a grab bar." }, score: 50 },
            { text: { es: "No, son baños estándar sin adaptaciones.", en: "No, they are standard restrooms without adaptations." }, score: 0 }
        ],
        failRecommendation: {
            es: "Instalar barras de soporte metálicas de seguridad junto al inodoro y colocar tapetes antideslizantes adhesivos.",
            en: "Install metal safety support bars next to the toilet and place adhesive non-slip mats."
        },
        normative: "OMS (Entornos)"
    },

    // Pilar 2: Atención y Servicio (6-10)
    {
        id: 6,
        pilar: 2,
        pilarName: { es: "Pilar 2: Atención y Servicio", en: "Pillar 2: Customer Service" },
        text: {
            es: "¿El personal recibe capacitación específica sobre empatía, paciencia y lenguaje claro para la atención de clientes mayores?",
            en: "Does staff receive specific training on empathy, patience, and plain language for serving older customers?"
        },
        options: [
            { text: { es: "Sí, capacitamos al personal formalmente una vez al año.", en: "Yes, we train staff formally once a year." }, score: 100 },
            { text: { es: "Se les da breves consejos al ingresar, pero no capacitación formal.", en: "They are given brief tips upon hiring, but no formal training." }, score: 50 },
            { text: { es: "No se realiza capacitación enfocada en este segmento.", en: "No training focused on this segment is conducted." }, score: 0 }
        ],
        failRecommendation: {
            es: "Realizar un taller corto de sensibilización (30-60 minutos) sobre sesgos de edad y pautas de comunicación empática para el personal de primera línea.",
            en: "Conduct a short awareness workshop (30-60 minutes) on age bias and empathetic communication guidelines for front-line staff."
        },
        normative: "ISO 25550"
    },
    {
        id: 7,
        pilar: 2,
        pilarName: { es: "Pilar 2: Atención y Servicio", en: "Pillar 2: Customer Service" },
        text: {
            es: "Si dispone de canal telefónico, ¿los clientes pueden hablar directamente con un agente humano con facilidad (sin menús interactivos complejos)?",
            en: "If you have a phone channel, can customers easily speak directly to a human agent (without complex interactive menus)?"
        },
        options: [
            { text: { es: "Sí, la atención humana es directa o el menú es de un solo paso.", en: "Yes, human support is direct or the menu is a single step." }, score: 100 },
            { text: { es: "Hay menú automático interactivo pero da la opción de hablar con un agente.", en: "There is an automated menu but it offers the option to speak to an agent." }, score: 50 },
            { text: { es: "No, es muy difícil hablar con un humano o solo atendemos por chatbot.", en: "No, it is very difficult to speak to a human or we only support via chatbot." }, score: 0 }
        ],
        failRecommendation: {
            es: "Simplificar la centralita telefónica permitiendo marcar un dígito simple (ej. 'Marque 0') para hablar directamente con una persona.",
            en: "Simplify the phone system by allowing dialing a simple digit (e.g., 'Press 0') to speak directly to a person."
        },
        normative: "ISO 25556"
    },
    {
        id: 8,
        pilar: 2,
        pilarName: { es: "Pilar 2: Atención y Servicio", en: "Pillar 2: Customer Service" },
        text: {
            es: "¿Cuenta con protocolos para flexibilizar la velocidad de atención si el cliente lo requiere (ej. cajas de pago lentas, tiempos de espera flexibles)?",
            en: "Do you have protocols to adapt service speed if requested by the customer (e.g., slow checkout lines, flexible waiting times)?"
        },
        options: [
            { text: { es: "Sí, el personal está instruido para priorizar la paciencia y no apurar.", en: "Yes, staff is instructed to prioritize patience and not rush." }, score: 100 },
            { text: { es: "Se hace de manera informal, pero no hay directriz clara.", en: "It is done informally, but there is no clear guideline." }, score: 50 },
            { text: { es: "No, se prioriza la velocidad de atención para todos por igual.", en: "No, service speed is prioritized for everyone equally." }, score: 0 }
        ],
        failRecommendation: {
            es: "Implementar la política informal de 'Atención Sin Prisas' para clientes seniors que requieran soporte adicional al pagar o realizar trámites.",
            en: "Implement an informal 'Unhurried Service' policy for senior customers who require additional support during checkouts or procedures."
        },
        normative: "OMS (Entornos)"
    },
    {
        id: 9,
        pilar: 2,
        pilarName: { es: "Pilar 2: Atención y Servicio", en: "Pillar 2: Customer Service" },
        text: {
            es: "¿Ofrece alternativas impresas o asistencia guiada presencial para procesos digitales complejos (ej. check-in digital, compras por app)?",
            en: "Do you offer printed alternatives or guided in-person assistance for complex digital processes (e.g., digital check-in, app purchases)?"
        },
        options: [
            { text: { es: "Sí, siempre hay asistencia física o material impreso alternativo.", en: "Yes, there is always physical assistance or alternative printed material." }, score: 100 },
            { text: { es: "Solo si el cliente lo solicita de forma muy insistente.", en: "Only if the customer requests it very insistently." }, score: 50 },
            { text: { es: "No, todo el proceso es estrictamente digital y auto-gestionable.", en: "No, the entire process is strictly digital and self-managed." }, score: 0 }
        ],
        failRecommendation: {
            es: "Disponer de formularios impresos legibles en recepción para quienes no deseen o no puedan usar la tablet/app de auto-registro.",
            en: "Provide legible printed forms at reception for those who do not wish or are unable to use the self-registration tablet/app."
        },
        normative: "ISO 25556"
    },
    {
        id: 10,
        pilar: 2,
        pilarName: { es: "Pilar 2: Atención y Servicio", en: "Pillar 2: Customer Service" },
        text: {
            es: "¿Existen protocolos de seguridad/emergencia específicos adaptados para asistir a personas con dificultades de movilidad o audición?",
            en: "Are there specific safety/emergency protocols adapted to assist people with mobility or hearing difficulties?"
        },
        options: [
            { text: { es: "Sí, el protocolo incluye asistencia personalizada obligatoria.", en: "Yes, the protocol includes mandatory personalized assistance." }, score: 100 },
            { text: { es: "Tenemos un plan general, pero no detalla la atención por edad/movilidad.", en: "We have a general plan, but it does not detail age/mobility care." }, score: 50 },
            { text: { es: "No contamos con este tipo de protocolos.", en: "We do not have these types of protocols." }, score: 0 }
        ],
        failRecommendation: {
            es: "Actualizar el plan de evacuación de sismos/incendios asignando un miembro del personal para asistir directamente a clientes con movilidad reducida.",
            en: "Update the fire/earthquake evacuation plan by assigning a staff member to directly assist customers with reduced mobility."
        },
        normative: "OMS (ICOPE)"
    },

    // Pilar 3: Inclusión y Comunicación (11-15)
    {
        id: 11,
        pilar: 3,
        pilarName: { es: "Pilar 3: Inclusión y Comunicación", en: "Pillar 3: Inclusion & Communication" },
        text: {
            es: "¿Su página web o activos digitales tienen un diseño accesible (ej. contraste alto, fuentes ampliables de forma nativa, botones grandes)?",
            en: "Do your website or digital assets have an accessible design (e.g., high contrast, natively expandable fonts, large buttons)?"
        },
        options: [
            { text: { es: "Sí, cumple con pautas de accesibilidad web (WCAG).", en: "Yes, it complies with web accessibility guidelines (WCAG)." }, score: 100 },
            { text: { es: "Es legible, pero no tiene herramientas específicas de accesibilidad.", en: "It is legible, but lacks specific accessibility tools." }, score: 50 },
            { text: { es: "No, la letra es pequeña y el diseño es complejo para personas mayores.", en: "No, font size is small and layout is complex for older people." }, score: 0 }
        ],
        failRecommendation: {
            es: "Instalar un plugin gratuito de accesibilidad web en su sitio (como UserWay) que permita agrandar letras y cambiar contrastes en un clic.",
            en: "Install a free web accessibility widget on your site (such as UserWay) that allows resizing fonts and changing contrast with a click."
        },
        normative: "ISO 25556"
    },
    {
        id: 12,
        pilar: 3,
        pilarName: { es: "Pilar 3: Inclusión y Comunicación", en: "Pillar 3: Inclusion & Communication" },
        text: {
            es: "¿En sus publicidades y redes sociales se utilizan imágenes realistas de adultos mayores activos en lugar de estereotipos de fragilidad o infantilización?",
            en: "Do your advertisements and social networks use realistic images of active older adults instead of stereotypes of fragility or infantilization?"
        },
        options: [
            { text: { es: "Sí, representamos la longevidad activa y respetuosa.", en: "Yes, we represent active and respectful longevity." }, score: 100 },
            { text: { es: "A veces, pero la mayoría del marketing muestra solo público joven.", en: "Sometimes, but most marketing shows only young audiences." }, score: 50 },
            { text: { es: "No utilizamos imágenes de personas mayores en nuestra publicidad.", en: "We do not use images of older people in our advertising." }, score: 0 }
        ],
        failRecommendation: {
            es: "Incorporar en sus folletos y redes imágenes de adultos mayores participando activamente de sus servicios para mejorar la empatía de marca.",
            en: "Incorporate images of older adults actively participating in your services in your brochures and social networks to improve brand empathy."
        },
        normative: "OMS (Entornos)"
    },
    {
        id: 13,
        pilar: 3,
        pilarName: { es: "Pilar 3: Inclusión y Comunicación", en: "Pillar 3: Inclusion & Communication" },
        text: {
            es: "¿La información de precios, términos de contratos o folletos comerciales utiliza un tamaño de letra adecuado (mínimo 12-14pt impreso) y lenguaje sencillo?",
            en: "Does pricing information, contract terms, or sales brochures use an adequate font size (minimum 12-14pt printed) and simple language?"
        },
        options: [
            { text: { es: "Sí, todo el material comercial es claro y fácil de leer.", en: "Yes, all sales material is clear and easy to read." }, score: 100 },
            { text: { es: "El precio se ve bien, pero la 'letra pequeña' de términos es muy pequeña.", en: "Price is clearly visible, but the 'fine print' of terms is very small." }, score: 50 },
            { text: { es: "No, usamos folletos estándar con tipografías compactas.", en: "No, we use standard brochures with compact typography." }, score: 0 }
        ],
        failRecommendation: {
            es: "Eliminar el texto compacto de los folletos informativos y adaptarlos a un tamaño mínimo de letra 14 con interlineado holgado.",
            en: "Eliminate compact text in brochures and adapt them to a minimum font size of 14 with generous spacing."
        },
        normative: "ISO 25556"
    },
    {
        id: 14,
        pilar: 3,
        pilarName: { es: "Pilar 3: Inclusión y Comunicación", en: "Pillar 3: Inclusion & Communication" },
        text: {
            es: "¿Ofrece políticas de flexibilidad horaria o apoyo para empleados que cuidan de familiares mayores dependientes (generación sándwich)?",
            en: "Do you offer flexible working hours or support policies for employees who care for dependent elderly relatives (sandwich generation)?"
        },
        options: [
            { text: { es: "Sí, contamos con licencias de cuidados y flexibilidad horaria formal.", en: "Yes, we have formal care leaves and flexible hours." }, score: 100 },
            { text: { es: "Se evalúa caso a caso de forma informal por jefaturas.", en: "It is evaluated on a case-by-case basis informally by managers." }, score: 50 },
            { text: { es: "No, el personal debe ajustarse a las jornadas estándar sin excepciones.", en: "No, staff must adjust to standard working hours without exceptions." }, score: 0 }
        ],
        failRecommendation: {
            es: "Implementar un protocolo de flexibilidad horaria y teletrabajo para empleados cuidadores de personas mayores.",
            en: "Implement a flexible hours and telecommuting protocol for employees who are caregivers of older persons."
        },
        normative: "ISO 25551"
    },
    {
        id: 15,
        pilar: 3,
        pilarName: { es: "Pilar 3: Inclusión y Comunicación", en: "Pillar 3: Inclusion & Communication" },
        text: {
            es: "¿Cuenta con políticas de contratación inclusiva que activamente valoren y promuevan la incorporación de personal mayor de 50 años?",
            en: "Do you have inclusive hiring policies that actively value and promote hiring staff over 50 years old?"
        },
        options: [
            { text: { es: "Sí, tenemos políticas de contratación sin sesgos de edad y CV anónimos.", en: "Yes, we have age-unbiased hiring policies and anonymous CVs." }, score: 100 },
            { text: { es: "No discriminamos por edad, pero no lo fomentamos activamente.", en: "We do not discriminate by age, but we do not actively promote it." }, score: 50 },
            { text: { es: "No contamos con políticas enfocadas en reclutamiento de talento senior.", en: "We do not have policies focused on recruiting senior talent." }, score: 0 }
        ],
        failRecommendation: {
            es: "Implementar la revisión de currículums en formato ciego (eliminando fecha de nacimiento y foto) para evitar sesgos de edad involuntarios en el reclutamiento.",
            en: "Implement blind resume reviews (removing birth date and photo) to prevent involuntary age bias in recruitment."
        },
        normative: "OIT 162"
    }
];

// Estado del Cuestionario y Registro
let currentQuestionIndex = 0;
const userAnswers = new Array(QUESTIONS.length).fill(null);
let isRegistered = false;
let isConfirmed = false;
let userRegistrationData = null;
let currentVerificationCode = "123456";

// Elementos del DOM
const quizCard = document.getElementById('quiz-card');
const resultsCard = document.getElementById('results-card');

const pilarNameEl = document.getElementById('quiz-pilar-name');
const stepTextEl = document.getElementById('quiz-step-text');
const progressFillEl = document.getElementById('quiz-progress-fill');
const questionTitleEl = document.getElementById('question-title');
const optionsContainer = document.getElementById('quiz-options');

const btnPrev = document.getElementById('btn-quiz-prev');
const btnNext = document.getElementById('btn-quiz-next');

const scorePercentageEl = document.getElementById('score-percentage');
const scoreFillEl = document.getElementById('score-fill');
const resultsStatusTitle = document.getElementById('results-status-title');
const resultsStatusDesc = document.getElementById('results-status-desc');

const pillarScore1 = document.getElementById('pillar-score-1');
const pillarScore2 = document.getElementById('pillar-score-2');
const pillarScore3 = document.getElementById('pillar-score-3');

const pillarFill1 = document.getElementById('pillar-fill-1');
const pillarFill2 = document.getElementById('pillar-fill-2');
const pillarFill3 = document.getElementById('pillar-fill-3');

const recommendationsList = document.getElementById('recommendations-list');

// Modales
const contactModal = document.getElementById('contact-modal');
const paymentModal = document.getElementById('payment-modal');

// Inicializar Aplicación
function init() {
    loadQuestion(currentQuestionIndex);
    setupEventListeners();
    loadRadarNews(); // Cargar noticias del radar RSS
    
    // Inicializar EmailJS si está configurado
    if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG.publicKey && EMAILJS_CONFIG.publicKey !== "TU_PUBLIC_KEY") {
        emailjs.init({
            publicKey: EMAILJS_CONFIG.publicKey,
        });
        console.log("EmailJS inicializado correctamente.");
    }
}

// Generar la Calcomanía SVG para Vitrina dinámicamente
function generateDecalSVG(companyName) {
    const defaultCompany = currentLang === 'es' ? 'Su Empresa' : 'Your Company';
    const escapedName = (companyName || defaultCompany)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
        
    const t = TRANSLATIONS[currentLang];
        
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>
    <!-- Gold Border Gradient -->
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fbbf24" />
      <stop offset="50%" stop-color="#f59e0b" />
      <stop offset="100%" stop-color="#b45309" />
    </linearGradient>
    <!-- Glass reflection effect -->
    <linearGradient id="glassReflect" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.15" />
      <stop offset="40%" stop-color="#ffffff" stop-opacity="0.05" />
      <stop offset="40.1%" stop-color="#ffffff" stop-opacity="0" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0" />
    </linearGradient>
  </defs>

  <!-- Outer Cutline (sticker border) -->
  <rect x="10" y="10" width="380" height="380" rx="30" ry="30" fill="url(#bgGrad)" stroke="url(#goldGrad)" stroke-width="8" />
  
  <!-- Inner Border Line -->
  <rect x="25" y="25" width="350" height="350" rx="20" ry="20" fill="none" stroke="#fbbf24" stroke-width="2" stroke-dasharray="8,6" />

  <!-- Top Title -->
  <text x="200" y="75" fill="#fbbf24" font-family="'Outfit', 'Inter', sans-serif" font-weight="800" font-size="16" letter-spacing="3" text-anchor="middle">${t.decalTitle}</text>
  
  <!-- Subtitle -->
  <text x="200" y="100" fill="#94a3b8" font-family="'Inter', sans-serif" font-weight="600" font-size="10" letter-spacing="4" text-anchor="middle">${t.decalSubtitle}</text>

  <!-- Divider Line -->
  <line x1="120" y1="120" x2="280" y2="120" stroke="url(#goldGrad)" stroke-width="2" />

  <!-- Company Name (Dynamic) -->
  <text x="200" y="165" fill="#f8fafc" font-family="'Outfit', 'Inter', sans-serif" font-weight="700" font-size="22" text-anchor="middle">${escapedName}</text>

  <!-- Certification Level Badge -->
  <rect x="90" y="190" width="220" height="35" rx="8" ry="8" fill="rgba(251, 191, 36, 0.1)" stroke="url(#goldGrad)" stroke-width="1.5" />
  <text x="200" y="213" fill="#fbbf24" font-family="'Outfit', 'Inter', sans-serif" font-weight="800" font-size="13" letter-spacing="2" text-anchor="middle">${t.decalBadge}</text>

  <!-- Official Logo Mark -->
  <circle cx="200" cy="275" r="30" fill="#1e293b" stroke="#fbbf24" stroke-width="2" />
  <path d="M 200 257 L 205 268 L 217 268 L 208 276 L 211 288 L 200 280 L 189 288 L 192 276 L 183 268 L 195 268 Z" fill="#fbbf24" />
  
  <!-- Outer Ring Text (Age Friend Seal) -->
  <text x="200" y="335" fill="#ffffff" font-family="'Outfit', 'Inter', sans-serif" font-weight="800" font-size="18" letter-spacing="1" text-anchor="middle">Age Friend Seal</text>
  
  <!-- Footer Info -->
  <text x="200" y="360" fill="#94a3b8" font-family="'Inter', sans-serif" font-weight="500" font-size="10" text-anchor="middle">${t.decalNorms}</text>
  <text x="200" y="375" fill="#fbbf24" font-family="'Inter', sans-serif" font-weight="700" font-size="9" letter-spacing="1" text-anchor="middle">${t.decalFooter}</text>

  <!-- Glossy Glass reflection effect overlay -->
  <path d="M 10 10 L 390 10 L 390 180 L 10 260 Z" fill="url(#glassReflect)" pointer-events="none" />
</svg>`;
}

// Cargar una pregunta
function loadQuestion(index) {
    const q = QUESTIONS[index];
    const t = TRANSLATIONS[currentLang];
    
    // Actualizar Textos
    pilarNameEl.textContent = typeof q.pilarName === 'object' ? q.pilarName[currentLang] : q.pilarName;
    stepTextEl.textContent = t.questionStep.replace('{index}', index + 1).replace('{total}', QUESTIONS.length);
    questionTitleEl.textContent = typeof q.text === 'object' ? q.text[currentLang] : q.text;
    
    // Actualizar Barra de Progreso
    const progressPercent = ((index + 1) / QUESTIONS.length) * 100;
    progressFillEl.style.width = `${progressPercent}%`;
    
    // Renderizar Opciones
    optionsContainer.innerHTML = '';
    q.options.forEach((opt, optIndex) => {
        const optCard = document.createElement('div');
        optCard.className = 'option-card';
        if (userAnswers[index] !== null && userAnswers[index].score === opt.score) {
            optCard.classList.add('selected');
        }
        
        const optionText = typeof opt.text === 'object' ? opt.text[currentLang] : opt.text;
        optCard.innerHTML = `
            <div class="radio-indicator"></div>
            <span>${optionText}</span>
        `;
        
        optCard.addEventListener('click', () => selectOption(index, opt));
        optionsContainer.appendChild(optCard);
    });
    
    // Habilitar/Deshabilitar botones
    btnPrev.disabled = index === 0;
    
    // Si no ha respondido a la pregunta actual, deshabilitar Siguiente
    btnNext.textContent = index === QUESTIONS.length - 1 ? t.btnFinish : t.btnNext;
    btnNext.disabled = userAnswers[index] === null;
}

// Seleccionar una opción
function selectOption(qIndex, option) {
    userAnswers[qIndex] = {
        score: option.score,
        failRecommendation: option.score < 100 ? QUESTIONS[qIndex].failRecommendation : null
    };
    
    // Volver a renderizar opciones para actualizar el seleccionado visual
    const cards = optionsContainer.querySelectorAll('.option-card');
    cards.forEach((card, index) => {
        if (QUESTIONS[qIndex].options[index].score === option.score) {
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
        }
    });
    
    // Habilitar botón de continuar
    btnNext.disabled = false;
}

// Event Listeners del Cuestionario
function setupEventListeners() {
    btnNext.addEventListener('click', () => {
        // Interceptar después de la pregunta 3 (índice 2) para requerir registro
        if (currentQuestionIndex === 2 && !isConfirmed) {
            showRegistrationView();
            return;
        }

        if (currentQuestionIndex < QUESTIONS.length - 1) {
            currentQuestionIndex++;
            loadQuestion(currentQuestionIndex);
        } else {
            calculateResults();
        }
    });
    
    btnPrev.addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            loadQuestion(currentQuestionIndex);
        }
    });
    
    // Botón repetir autodiagnóstico
    document.getElementById('btn-restart-quiz').addEventListener('click', () => {
        currentQuestionIndex = 0;
        userAnswers.fill(null);
        resultsCard.classList.add('hidden');
        quizCard.classList.remove('hidden');
        loadQuestion(currentQuestionIndex);
        
        // Hacer scroll suave al inicio del cuestionario
        document.getElementById('autodiagnostico').scrollIntoView({ behavior: 'smooth' });
    });
    
    // Botón para simular compra del Sello
    document.getElementById('btn-claim-sello').addEventListener('click', () => {
        const defaultCompany = currentLang === 'es' ? 'Su Empresa' : 'Your Company';
        const companyName = userRegistrationData ? userRegistrationData.company : defaultCompany;
        const decalContainer = document.getElementById('decal-preview-container');
        if (decalContainer) {
            decalContainer.innerHTML = generateDecalSVG(companyName);
        }
        openModal(paymentModal);
    });
    
    // Cierres de Modales
    document.getElementById('btn-modal-close').addEventListener('click', () => closeModal(contactModal));
    document.getElementById('btn-pay-modal-close').addEventListener('click', () => closeModal(paymentModal));
    
    // Pitch Modal Logic
    const pitchModal = document.getElementById('pitch-modal');
    const btnOpenPitch = document.getElementById('btn-open-pitch');
    const btnPitchModalClose = document.getElementById('btn-pitch-modal-close');
    const pitchForm = document.getElementById('pitch-form');

    if (btnOpenPitch && pitchModal) {
        btnOpenPitch.addEventListener('click', () => openModal(pitchModal));
    }
    if (btnPitchModalClose && pitchModal) {
        btnPitchModalClose.addEventListener('click', () => closeModal(pitchModal));
    }
    if (pitchForm && pitchModal) {
        pitchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('pitch-name').value;
            const phone = document.getElementById('pitch-phone').value;
            const corpEmail = document.getElementById('pitch-corp-email').value;
            const format = document.getElementById('pitch-format').value;
            
            const leadData = { name, phone, corpEmail };
            const PITCH_RECIPIENT_EMAIL = "qdoblea@gmail.com";
            
            // Envío vía EmailJS si está configurado
            if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG.publicKey && EMAILJS_CONFIG.publicKey !== "TU_PUBLIC_KEY") {
                const leadParams = {
                    lead_name: name,
                    lead_email: corpEmail, // Usamos el correo corporativo como principal
                    lead_phone: phone,
                    lead_corp_email: corpEmail,
                    lead_lang: currentLang,
                    to_email: PITCH_RECIPIENT_EMAIL
                };
                
                emailjs.send(EMAILJS_CONFIG.serviceId, "template_pitch_lead", leadParams)
                    .then((response) => {
                        console.log("Lead de Pitch enviado con éxito vía EmailJS!", response.status, response.text);
                        alert(TRANSLATIONS[currentLang].pitchSuccessAlert);
                    }, (error) => {
                        console.error("Fallo al enviar lead vía EmailJS:", error);
                        triggerFallbackPitchLead(leadData, PITCH_RECIPIENT_EMAIL);
                    });
            } else {
                triggerFallbackPitchLead(leadData, PITCH_RECIPIENT_EMAIL);
            }
            
            // Descargar el dossier de inmediato
            downloadPitchDossier(currentLang, format);
            
            // Limpiar y cerrar modal
            closeModal(pitchModal);
            pitchForm.reset();
        });
    }
    
    // Botones de Solicitar Info en Planes
    const reqSilverBtn = document.getElementById('btn-request-silver');
    if (reqSilverBtn) {
        reqSilverBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('modal-title').textContent = currentLang === 'es' ? 
                "Solicitar Certificación Condicional (Nivel Medio)" : "Request Conditional Certification (Medium Level)";
            document.getElementById('modal-subtitle').textContent = currentLang === 'es' ? 
                "Deje sus datos y nuestro equipo le contactará para coordinar el plan y la revisión de avances." :
                "Leave your details and our team will contact you to coordinate the action plan and progress review.";
            openModal(contactModal);
        });
    }
    
    const reqGoldBtn = document.getElementById('btn-request-gold');
    if (reqGoldBtn) {
        reqGoldBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('modal-title').textContent = currentLang === 'es' ? 
                "Solicitar Certificación Total (Nivel Premium)" : "Request Full Certification (Premium Level)";
            document.getElementById('modal-subtitle').textContent = currentLang === 'es' ? 
                "Cumpla con el 100% de la normativa exigida para obtener el sello oficial de Empresa Certificada." :
                "Comply with 100% of the required regulations to obtain the official Certified Company seal.";
            openModal(contactModal);
        });
    }
    
    // Envío de Formulario de Contacto
    document.getElementById('contact-form').addEventListener('submit', (e) => {
        e.preventDefault();
        alert(TRANSLATIONS[currentLang].contactSuccessAlert);
        closeModal(contactModal);
        document.getElementById('contact-form').reset();
    });
    
    // Simulación de Pago y Descarga
    document.getElementById('btn-pay-submit').addEventListener('click', () => {
        const defaultCompany = currentLang === 'es' ? 'Su Empresa' : 'Your Company';
        const companyName = userRegistrationData ? userRegistrationData.company : defaultCompany;
        alert(TRANSLATIONS[currentLang].paymentSuccessAlert.replace('{companyName}', companyName));
        closeModal(paymentModal);
        
        // Simular descarga de archivo creando un link temporal
        const link = document.createElement('a');
        link.href = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(generateDecalSVG(companyName));
        link.download = `Calcomania_Vitrina_AgeFriendSeal_${companyName.replace(/[^a-z0-9]/gi, '_')}.svg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
    
    // Descarga de PDF de Reporte
    document.getElementById('btn-download-pdf').addEventListener('click', () => {
        alert(TRANSLATIONS[currentLang].pdfAlert);
        window.print(); // Solución elegante y nativa que permite guardar como PDF en cualquier navegador
    });
    
    // Botones de inicio de navegación
    const navStartBtn = document.getElementById('btn-nav-start');
    if (navStartBtn) {
        navStartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('autodiagnostico').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    const heroStartBtn = document.getElementById('btn-hero-start');
    if (heroStartBtn) {
        heroStartBtn.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('autodiagnostico').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Formulario de Registro en el Cuestionario
    const registerForm = document.getElementById('quiz-register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const company = document.getElementById('reg-company').value;
            const sector = document.getElementById('reg-sector').value;
            const name = document.getElementById('reg-name').value;
            const role = document.getElementById('reg-role').value;
            const email = document.getElementById('reg-email').value;
            
            userRegistrationData = { company, sector, name, role, email };
            isRegistered = true;
            
            hideRegistrationView();
            showVerificationView(email);
            sendVerificationEmail(name, company, email);
        });
    }
    
    // Comportamiento del teclado en casilleros OTP (auto focus secuencial)
    const otpInputs = document.querySelectorAll('.otp-digit');
    otpInputs.forEach((input, index) => {
        input.addEventListener('keyup', (e) => {
            const val = input.value;
            
            // Si escribe un dígito, salta al siguiente
            if (val.length === 1 && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
        });
        
        input.addEventListener('keydown', (e) => {
            // Si borra con Backspace y está vacío, vuelve al anterior
            if (e.key === 'Backspace' && input.value.length === 0 && index > 0) {
                otpInputs[index - 1].focus();
            }
        });
    });
    
    // Botón Confirmar OTP
    const btnConfirmOtp = document.getElementById('btn-confirm-otp');
    if (btnConfirmOtp) {
        btnConfirmOtp.addEventListener('click', () => {
            let code = "";
            otpInputs.forEach(input => code += input.value);
            
            const errorMsg = document.getElementById('otp-error-msg');
            
            if (code === currentVerificationCode) {
                isConfirmed = true;
                if (errorMsg) errorMsg.classList.add('hidden');
                
                // Quitar toast si sigue visible
                const toast = document.querySelector('.toast-notification');
                if (toast) toast.remove();
                
                // Ocultar verificación y volver al cuestionario
                hideVerificationView();
                alert(TRANSLATIONS[currentLang].otpSuccessAlert);
                resumeQuestionnaire();
            } else {
                if (errorMsg) {
                    errorMsg.textContent = TRANSLATIONS[currentLang].otpErrorMsg;
                    errorMsg.classList.remove('hidden');
                }
                // Limpiar casilleros y enfocar el primero
                otpInputs.forEach(input => input.value = "");
                otpInputs[0].focus();
            }
        });
    }
    
    // Botón Reenviar OTP
    const btnOtpResend = document.getElementById('btn-otp-resend');
    if (btnOtpResend) {
        btnOtpResend.addEventListener('click', (e) => {
            e.preventDefault();
            const defaultCompany = currentLang === 'es' ? 'Su Empresa' : 'Your Company';
            if (userRegistrationData) {
                sendVerificationEmail(userRegistrationData.name, userRegistrationData.company, userRegistrationData.email);
            } else {
                sendVerificationEmail("Guest", defaultCompany, "user@company.com");
            }
        });
    }
}

// Calcular y Renderizar Resultados
function calculateResults() {
    const t = TRANSLATIONS[currentLang];
    
    // 1. Calcular puntuación global
    const totalScore = userAnswers.reduce((sum, ans) => sum + ans.score, 0);
    const globalPercent = Math.round(totalScore / QUESTIONS.length);
    
    // 2. Calcular puntuaciones por pilar (5 preguntas por pilar)
    const pilarScores = [0, 0, 0];
    userAnswers.forEach((ans, index) => {
        const pilarIndex = QUESTIONS[index].pilar - 1;
        pilarScores[pilarIndex] += ans.score;
    });
    
    const pilarPercents = pilarScores.map(score => Math.round(score / 5));
    
    // 3. Renderizar Puntuaciones en el DOM
    scorePercentageEl.textContent = `${globalPercent}%`;
    
    // Animación del anillo de porcentaje (Perímetro = 2 * PI * r = 2 * 3.1416 * 70 = ~440)
    const dashOffset = 440 - (440 * globalPercent) / 100;
    scoreFillEl.style.strokeDashoffset = dashOffset;
    
    // Puntuaciones de Pilares
    pillarScore1.textContent = `${pilarPercents[0]}%`;
    pillarScore2.textContent = `${pilarPercents[1]}%`;
    pillarScore3.textContent = `${pilarPercents[2]}%`;
    
    pillarFill1.style.width = `${pilarPercents[0]}%`;
    pillarFill2.style.width = `${pilarPercents[1]}%`;
    pillarFill3.style.width = `${pilarPercents[2]}%`;
    
    // 4. Determinar estado y textos (Básico, Medio y Premium)
    let statusTitle = "";
    let statusDesc = "";
    
    if (globalPercent < 50) {
        statusTitle = t.statusBasicTitle;
        statusDesc = t.statusBasicDesc;
    } else if (globalPercent < 80) {
        statusTitle = t.statusMedioTitle;
        statusDesc = t.statusMedioDesc;
    } else {
        statusTitle = t.statusPremiumTitle;
        statusDesc = t.statusPremiumDesc;
    }
    
    resultsStatusTitle.textContent = statusTitle;
    resultsStatusDesc.textContent = statusDesc;
    
    // 5. Filtrar y Renderizar Recomendaciones (Quick Wins)
    recommendationsList.innerHTML = '';
    
    // Extraer todas las recomendaciones de respuestas que no fueron perfectas (score < 100)
    const activeRecommendations = [];
    userAnswers.forEach((ans, index) => {
        if (ans && ans.failRecommendation) {
            activeRecommendations.push({
                text: typeof ans.failRecommendation === 'object' ? ans.failRecommendation[currentLang] : ans.failRecommendation,
                normative: QUESTIONS[index].normative
            });
        }
    });
    
    // Si la puntuación fue del 100%, agregar una recomendación de felicitación
    if (activeRecommendations.length === 0) {
        recommendationsList.innerHTML = `
            <div class="rec-axis-group">
                <ul class="rec-list">
                    <li class="rec-item">
                        ${t.perfectScoreText}
                    </li>
                </ul>
            </div>
        `;
    } else {
        // Clasificar recomendaciones en dos grupos
        const talentoRecs = [];
        const clienteRecs = [];
        
        // Agrupar
        activeRecommendations.forEach(rec => {
            if (rec.normative === "ISO 25550" || rec.normative === "ISO 25551" || rec.normative === "OIT 162") {
                talentoRecs.push(rec);
            } else {
                clienteRecs.push(rec);
            }
        });
        
        let htmlContent = "";
        
        // Renderizar Eje Talento (máximo 2 recomendaciones para no abrumar)
        if (talentoRecs.length > 0) {
            htmlContent += `
                <div class="rec-axis-group">
                    <h5 class="rec-axis-title">${t.axisTalentoTitle}</h5>
                    <ul class="rec-list">
            `;
            talentoRecs.slice(0, 2).forEach(rec => {
                htmlContent += `
                    <li class="rec-item">
                        <span class="rec-normative-badge">${rec.normative}</span> ${rec.text}
                    </li>
                `;
            });
            htmlContent += `
                    </ul>
                </div>
            `;
        }
        
        // Renderizar Eje Cliente y Canales (máximo 2 recomendaciones)
        if (clienteRecs.length > 0) {
            htmlContent += `
                <div class="rec-axis-group" style="margin-top: 24px;">
                    <h5 class="rec-axis-title">${t.axisClienteTitle}</h5>
                    <ul class="rec-list">
            `;
            clienteRecs.slice(0, 2).forEach(rec => {
                htmlContent += `
                    <li class="rec-item">
                        <span class="rec-normative-badge">${rec.normative}</span> ${rec.text}
                    </li>
                `;
            });
            htmlContent += `
                    </ul>
                </div>
            `;
        }
        
        recommendationsList.innerHTML = htmlContent;
    }
    
    // Personalizar título con nombre de empresa
    const resultsHeaderTitle = document.querySelector('#results-card h2');
    if (resultsHeaderTitle) {
        resultsHeaderTitle.textContent = t.resultsTitle.replace('{companyName}', userRegistrationData ? userRegistrationData.company : (currentLang === 'es' ? 'Su Empresa' : 'Your Company'));
    }

    // Ocultar Cuestionario y Mostrar Resultados
    quizCard.classList.add('hidden');
    resultsCard.classList.remove('hidden');
    
    // Hacer scroll al inicio de los resultados
    document.getElementById('autodiagnostico').scrollIntoView({ behavior: 'smooth' });
}

// Helper: Abrir Modal
function openModal(modalEl) {
    modalEl.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Evita scroll de fondo
}

// Helper: Cerrar Modal
function closeModal(modalEl) {
    modalEl.classList.add('hidden');
    document.body.style.overflow = ''; // Habilita scroll de fondo
}

// ==========================================================================
// Vistas y Simulación de Registro / OTP
// ==========================================================================

function showRegistrationView() {
    document.getElementById('question-box').classList.add('hidden');
    document.getElementById('quiz-progress-bar').classList.add('hidden');
    document.getElementById('quiz-controls').classList.add('hidden');
    
    document.getElementById('quiz-register-view').classList.remove('hidden');
}

function hideRegistrationView() {
    document.getElementById('quiz-register-view').classList.add('hidden');
}

function showVerificationView(email) {
    document.getElementById('sent-email-display').textContent = email;
    document.getElementById('quiz-confirm-view').classList.remove('hidden');
    
    // Auto focus en el primer input OTP
    const firstOtpInput = document.querySelector('.otp-digit');
    if (firstOtpInput) firstOtpInput.focus();
}

function hideVerificationView() {
    document.getElementById('quiz-confirm-view').classList.add('hidden');
}

function resumeQuestionnaire() {
    document.getElementById('question-box').classList.remove('hidden');
    document.getElementById('quiz-progress-bar').classList.remove('hidden');
    document.getElementById('quiz-controls').classList.remove('hidden');
    
    currentQuestionIndex = 3; // Pregunta 4 (índice 3)
    loadQuestion(currentQuestionIndex);
}

function showToastOTP(pin = "123456") {
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) existingToast.remove();
    
    const t = TRANSLATIONS[currentLang];
    
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `
        <span class="toast-title">${t.otpFallbackTitle}</span>
        <span class="toast-desc">${t.otpFallbackDesc}</span>
        <span class="toast-code">${pin}</span>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        if (toast.parentNode) toast.remove();
    }, 15000);
}

// Envío de correo real o local
function sendVerificationEmail(name, company, email) {
    const randomPIN = Math.floor(100000 + Math.random() * 900000).toString();
    
    if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG.publicKey && EMAILJS_CONFIG.publicKey !== "TU_PUBLIC_KEY") {
        console.log(TRANSLATIONS[currentLang].otpSentRealConsole);
        
        const templateParams = {
            to_name: name,
            to_email: email,
            company_name: company,
            verification_code: randomPIN
        };
        
        emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, templateParams)
            .then((response) => {
                console.log("Correo enviado con éxito!", response.status, response.text);
                currentVerificationCode = randomPIN;
                alert(TRANSLATIONS[currentLang].otpSentReal.replace('{email}', email));
            }, (error) => {
                console.error("Fallo al enviar correo vía EmailJS:", error);
                triggerFallbackVerification(randomPIN, email, "Fallo al enviar el correo real (límite superado o claves incorrectas).");
            });
    } else {
        triggerFallbackVerification("123456", email);
    }
}

function triggerFallbackVerification(pin, email, reason = "") {
    currentVerificationCode = pin;
    if (reason) {
        console.warn(`${reason} Activando simulación local de contingencia.`);
    }
    showToastOTP(pin);
}

function triggerFallbackPitchLead(leadData, recipientEmail) {
    console.warn("Fallo o ausencia de configuración EmailJS para Leads. Activando simulación local.");
    
    const existingToast = document.querySelector('.toast-notification');
    if (existingToast) existingToast.remove();
    
    const t = TRANSLATIONS[currentLang];
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.style.maxWidth = '360px';
    toast.innerHTML = `
        <span class="toast-title">${t.pitchToastTitle}</span>
        <span class="toast-desc">${t.pitchToastDesc}</span>
        <div style="font-size: 0.8rem; margin-top: 8px; text-align: left; border-top: 1px solid rgba(251,191,36,0.3); padding-top: 6px; line-height: 1.4;">
            <strong>${currentLang === 'es' ? 'Nombre' : 'Name'}:</strong> ${leadData.name}<br>
            <strong>${currentLang === 'es' ? 'Teléfono' : 'Phone'}:</strong> ${leadData.phone}<br>
            <strong>Corp Email:</strong> ${leadData.corpEmail}<br>
            <strong>${currentLang === 'es' ? 'Destinatario' : 'Recipient'}:</strong> ${recipientEmail}
        </div>
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        if (toast.parentNode) toast.remove();
    }, 15000);
    
    alert(t.pitchSuccessAlert);
}

function downloadPitchDossier(lang, format = 'pdf') {
    const htmlContent = lang === 'es' ? ES_DOSSIER_TEMPLATE : EN_DOSSIER_TEMPLATE;
    
    if (format === 'pdf' && typeof html2pdf !== 'undefined') {
        // Crear un div temporal en el DOM visible para asegurar la correcta interpretación de estilos
        const tempDiv = document.createElement('div');
        tempDiv.id = 'dossier-temp-container';
        tempDiv.innerHTML = htmlContent;
        
        // Posicionamiento invisible para el usuario pero detectable para html2canvas
        tempDiv.style.position = 'fixed';
        tempDiv.style.top = '0';
        tempDiv.style.left = '0';
        tempDiv.style.width = '800px';
        tempDiv.style.zIndex = '-9999';
        tempDiv.style.opacity = '1';
        tempDiv.style.pointerEvents = 'none';
        tempDiv.style.backgroundColor = '#ffffff';
        
        document.body.appendChild(tempDiv);

        const opt = {
            margin:       15,
            filename:     lang === 'es' ? 'Dossier_AgeFriendSeal.pdf' : 'Dossier_AgeFriendSeal_EN.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true, logging: false, backgroundColor: '#ffffff' },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        
        // Renderizar el PDF a partir del elemento DOM activo
        html2pdf().from(tempDiv).set(opt).save().then(() => {
            document.body.removeChild(tempDiv);
        }).catch(err => {
            console.error("Error al generar PDF:", err);
            document.body.removeChild(tempDiv);
        });
    } else {
        const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = lang === 'es' ? 'Dossier_AgeFriendSeal.html' : 'Dossier_AgeFriendSeal_EN.html';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}

// Iniciar aplicación al cargar
window.addEventListener('DOMContentLoaded', init);

// ==========================================================================
// Lógica de Radar de Longevidad (Feeds RSS)
// ==========================================================================

async function loadRadarNews() {
    const loadingEl = document.getElementById('news-loading');
    const errorEl = document.getElementById('news-error');
    const gridEl = document.getElementById('news-grid');
    
    if (!loadingEl || !gridEl || !errorEl) return;
    
    const t = TRANSLATIONS[currentLang];
    
    loadingEl.classList.remove('hidden');
    gridEl.classList.add('hidden');
    errorEl.classList.add('hidden');
    
    let allArticles = [];
    let fetchErrors = 0;
    
    const feeds = currentLang === 'es' ? RSS_FEEDS_ES : RSS_FEEDS_EN;
    
    const fetchPromises = feeds.map(async (feed) => {
        try {
            const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}`;
            const response = await fetch(apiUrl);
            
            if (!response.ok) throw new Error('Error de red');
            
            const data = await response.json();
            
            if (data.status === 'ok' && data.items && data.items.length > 0) {
                return data.items.map(item => ({
                    title: item.title,
                    pubDate: item.pubDate || new Date().toISOString(),
                    link: item.link,
                    description: cleanHTMLDescription(item.description || item.content),
                    source: feed.name,
                    category: feed.category
                }));
            } else {
                throw new Error('Datos de feed inválidos');
            }
        } catch (error) {
            console.warn(`Error cargando feed "${feed.name}":`, error);
            throw error;
        }
    });
    
    const results = await Promise.allSettled(fetchPromises);
    
    results.forEach(result => {
        if (result.status === 'fulfilled') {
            allArticles = allArticles.concat(result.value);
        } else {
            fetchErrors++;
        }
    });
    
    if (allArticles.length === 0) {
        console.log('Usando noticias locales de respaldo...');
        allArticles = currentLang === 'es' ? FALLBACK_NEWS_ES : FALLBACK_NEWS_EN;
    }
    
    allArticles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
    
    const recentArticles = allArticles.slice(0, 6);
    
    gridEl.innerHTML = '';
    
    recentArticles.forEach(article => {
        const card = document.createElement('div');
        card.className = 'glass-card news-card';
        
        const catClass = getCategoryClass(article.category);
        const formattedDate = formatDate(article.pubDate);
        
        card.innerHTML = `
            <div class="news-meta">
                <span class="news-tag ${catClass}">${article.category}</span>
                <span class="news-date">${formattedDate}</span>
            </div>
            <h3>${article.title}</h3>
            <p>${article.description}</p>
            <div class="news-footer">
                <span class="news-source">${t.newsSourceLabel.replace('{source}', article.source)}</span>
                <a href="${article.link}" target="_blank" class="news-link">${t.newsReadMore}</a>
            </div>
        `;
        gridEl.appendChild(card);
    });
    
    loadingEl.classList.add('hidden');
    gridEl.classList.remove('hidden');
}

function cleanHTMLDescription(htmlText) {
    if (!htmlText) return '';
    let temp = document.createElement('div');
    temp.innerHTML = htmlText;
    let text = temp.textContent || temp.innerText || '';
    if (text.length > 160) {
        text = text.substring(0, 157) + '...';
    }
    return text;
}

function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString(currentLang === 'es' ? 'es-ES' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch (e) {
        return dateString;
    }
}

function getCategoryClass(category) {
    const cat = (category || 'general').toLowerCase();
    if (cat.includes('política') || cat.includes('politica') || cat.includes('gobierno') || cat.includes('policy') || cat.includes('policies') || cat.includes('gov')) return 'tag-salud';
    if (cat.includes('innovación') || cat.includes('innovacion') || cat.includes('desarrollo') || cat.includes('innovation') || cat.includes('development')) return 'tag-desarrollo';
    if (cat.includes('mercado') || cat.includes('economía') || cat.includes('economia') || cat.includes('market') || cat.includes('economy')) return 'tag-mercado';
    if (cat.includes('talento') || cat.includes('equipo') || cat.includes('mentor') || cat.includes('talent') || cat.includes('team')) return 'tag-tecnologia';
    return 'tag-general';
}

const FALLBACK_NEWS_ES = [
    {
        title: "Informe BID Lab: La Oportunidad de la Economía Plateada para Empresas y Pymes de Latam",
        pubDate: new Date().toISOString(),
        link: "https://bidlab.org/es/productos/conocimiento-y-conexiones/economia-plateada",
        description: "El estudio detalla cómo las empresas en la región están perdiendo competitividad al no adaptar sus servicios físicos y digitales para la generación plateada.",
        source: "BID Lab",
        category: "Mercado"
    },
    {
        title: "Mentoría Inversa: Cómo las empresas líderes conectan talentos de más de 50 años y jóvenes",
        pubDate: new Date(Date.now() - 86400000).toISOString(),
        link: "https://www.iso.org/standard/76420.html",
        description: "La integración de equipos intergeneracionales y mentoría cruzada rompe barreras de aprendizaje digital y potencia la retención de conocimiento crítico en las organizaciones.",
        source: "Age Friend Seal HR",
        category: "Talento"
    },
    {
        title: "Combatir el Edadismo en el Sector Público: Nuevos marcos normativos para gobiernos",
        pubDate: new Date(Date.now() - 172800000).toISOString(),
        link: "https://www.who.int/es/news-room/questions-and-answers/item/ageing-ageism",
        description: "Gobiernos de la región promueven nuevas normativas y subsidios de contratación para combatir el edadismo laboral e impulsar la inclusión laboral activa en los municipios.",
        source: "OMS / Políticas Públicas",
        category: "Políticas"
    },
    {
        title: "Innovación en Ciudades Age-Ready: El auge del diseño de servicios universales",
        pubDate: new Date(Date.now() - 259200000).toISOString(),
        link: "https://www.worldbank.org/en/topic/urbandevelopment/publication/age-ready-cities",
        description: "La escasez futura de mano de obra y el envejecimiento poblacional obligan a reestructurar infraestructuras comerciales adaptando la accesibilidad física y operativa.",
        source: "Banco Mundial",
        category: "Innovación"
    }
];

const FALLBACK_NEWS_EN = [
    {
        title: "IDB Lab Report: The Opportunity of the Silver Economy for Businesses and SMEs",
        pubDate: new Date().toISOString(),
        link: "https://bidlab.org/es/productos/conocimiento-y-conexiones/economia-plateada",
        description: "The study details how companies are losing competitiveness by not adapting their physical and digital services for the silver generation.",
        source: "IDB Lab",
        category: "Market"
    },
    {
        title: "Reverse Mentoring: How leading companies connect over-50 talents and youth",
        pubDate: new Date(Date.now() - 86400000).toISOString(),
        link: "https://www.iso.org/standard/76420.html",
        description: "The integration of intergenerational teams and cross-mentorship breaks down barriers in digital learning and boosts the retention of critical knowledge in organizations.",
        source: "Age Friend Seal HR",
        category: "Talent"
    },
    {
        title: "Combating Ageism in the Public Sector: New regulatory frameworks for governments",
        pubDate: new Date(Date.now() - 172800000).toISOString(),
        link: "https://www.who.int/es/news-room/questions-and-answers/item/ageing-ageism",
        description: "Governments promote new regulations and hiring subsidies to fight ageism in employment and foster active inclusion in municipalities.",
        source: "WHO / Public Policies",
        category: "Policies"
    },
    {
        title: "Innovation in Age-Ready Cities: The rise of universal service design",
        pubDate: new Date(Date.now() - 259200000).toISOString(),
        link: "https://www.worldbank.org/en/topic/urbandevelopment/publication/age-ready-cities",
        description: "Future labor shortages and population aging force the restructuring of commercial infrastructures by adapting physical and operational accessibility.",
        source: "World Bank",
        category: "Innovation"
    }
];

const ES_DOSSIER_TEMPLATE = `<div class="dossier-main-wrapper">
    <style>
        .dossier-main-wrapper {
            background-color: #ffffff !important;
            color: #0f172a !important;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
            line-height: 1.6 !important;
            padding: 40px 20px !important;
            width: 100% !important;
            max-width: 900px !important;
            margin: 0 auto !important;
            box-sizing: border-box !important;
        }
        .dossier-container {
            background: #ffffff !important;
            border: 1px solid #e2e8f0 !important;
            border-radius: 24px !important;
            padding: 48px !important;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05) !important;
            box-sizing: border-box !important;
        }
        .dossier-header {
            text-align: center !important;
            border-bottom: 1px solid #e2e8f0 !important;
            padding-bottom: 32px !important;
            margin-bottom: 40px !important;
        }
        .dossier-logo-container {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 12px !important;
            margin-bottom: 20px !important;
        }
        .dossier-logo-icon {
            font-size: 2.5rem !important;
        }
        .dossier-logo-text {
            font-family: system-ui, sans-serif !important;
            font-weight: 800 !important;
            font-size: 2.2rem !important;
            color: #0f172a !important;
        }
        .dossier-logo-accent {
            color: #d97706 !important;
        }
        .dossier-h1 {
            font-family: system-ui, sans-serif !important;
            font-size: 2.5rem !important;
            font-weight: 800 !important;
            margin-bottom: 12px !important;
            color: #0f172a !important;
        }
        .dossier-subtitle {
            font-size: 1.1rem !important;
            color: #d97706 !important;
            font-weight: 700 !important;
            margin-bottom: 24px !important;
            letter-spacing: 1px !important;
            text-transform: uppercase !important;
        }
        .dossier-meta-info {
            display: flex !important;
            justify-content: center !important;
            gap: 24px !important;
            font-size: 0.9rem !important;
            color: #64748b !important;
        }
        .dossier-meta-item strong { color: #334155 !important; }
        
        .dossier-section {
            margin-bottom: 48px !important;
        }
        .dossier-section-title {
            font-family: system-ui, sans-serif !important;
            font-size: 1.6rem !important;
            font-weight: 700 !important;
            color: #d97706 !important;
            margin-bottom: 20px !important;
            border-bottom: 2px solid #e2e8f0 !important;
            padding-bottom: 8px !important;
            display: flex !important;
            align-items: center !important;
            gap: 12px !important;
        }
        .dossier-p {
            color: #334155 !important;
            margin-bottom: 16px !important;
            font-size: 1.05rem !important;
            display: block !important;
        }
        .dossier-ul {
            margin-left: 24px !important;
            margin-bottom: 20px !important;
            display: block !important;
        }
        .dossier-li {
            color: #334155 !important;
            margin-bottom: 8px !important;
            font-size: 1rem !important;
            display: list-item !important;
            list-style-type: disc !important;
        }
        .dossier-highlight-box {
            background: #fffbeb !important;
            border-left: 4px solid #d97706 !important;
            padding: 20px !important;
            border-radius: 0 12px 12px 0 !important;
            margin-top: 24px !important;
            margin-bottom: 24px !important;
        }
        .dossier-highlight-box-p {
            margin-bottom: 0 !important;
            font-style: italic !important;
            color: #b45309 !important;
            display: block !important;
        }
        .dossier-cta-box {
            text-align: center !important;
            background: #f0fdf4 !important;
            border: 1px solid #bbf7d0 !important;
            border-radius: 20px !important;
            padding: 32px !important;
            margin-top: 48px !important;
        }
        .dossier-cta-box-h3 {
            font-family: system-ui, sans-serif !important;
            font-size: 1.5rem !important;
            margin-bottom: 12px !important;
            color: #166534 !important;
        }
        .dossier-cta-box-p {
            color: #1e293b !important;
            margin-bottom: 0 !important;
            display: block !important;
        }
        .dossier-cta-btn {
            display: inline-block !important;
            background: #166534 !important;
            color: #ffffff !important;
            font-family: system-ui, sans-serif !important;
            font-weight: 700 !important;
            text-decoration: none !important;
            padding: 12px 32px !important;
            border-radius: 8px !important;
            margin-top: 16px !important;
        }
        .dossier-footer {
            text-align: center !important;
            margin-top: 48px !important;
            padding-top: 24px !important;
            border-top: 1px solid #e2e8f0 !important;
            color: #64748b !important;
        }
        .dossier-print-btn {
            display: inline-block !important;
            background: #d97706 !important;
            color: #ffffff !important;
            font-family: system-ui, sans-serif !important;
            font-weight: 700 !important;
            text-decoration: none !important;
            padding: 10px 24px !important;
            border-radius: 8px !important;
            border: none !important;
            cursor: pointer !important;
            margin-bottom: 16px !important;
            font-size: 0.95rem !important;
            transition: background 0.2s !important;
        }
        .dossier-print-btn:hover {
            background: #b45309 !important;
        }
        .dossier-page-break {
            page-break-before: always !important;
        }
        @media print {
            .dossier-container {
                max-width: 100% !important;
                margin: 0 !important;
                padding: 20px !important;
                border: none !important;
                box-shadow: none !important;
            }
            .dossier-cta-btn, .dossier-print-btn {
                display: none !important;
            }
        }
    </style>

    <div class="dossier-container">
        <div class="dossier-header">
            <div class="dossier-logo-container">
                <span class="dossier-logo-icon">🏅</span>
                <span class="dossier-logo-text"><span class="dossier-logo-accent">Age</span> Friend Seal</span>
            </div>
            <div class="dossier-h1">DOSSIER DE ALIANZAS CORPORATIVAS</div>
            <div class="dossier-subtitle">Propuesta Estratégica B2B, B2C, Proveedores e Instituciones</div>
            <div class="dossier-meta-info">
                <div class="dossier-meta-item">Documento: <strong>Pitch de Alianzas</strong></div>
                <div class="dossier-meta-item">Año: <strong>2026</strong></div>
                <div class="dossier-meta-item">Instituto: <strong>Certificador Internacional</strong></div>
            </div>
        </div>

        <div class="dossier-section">
            <div class="dossier-section-title"><span>📉</span> 1. El Invierno Demográfico y la Oportunidad Plateada</div>
            <div class="dossier-p">El mundo enfrenta un cambio demográfico sin precedentes históricos. El ritmo al que nacen las personas se desacelera rápidamente a nivel mundial: en 1990 la tasa global de fecundidad era de 3.3 hijos por mujer, mientras que hoy promedia apenas los 2.3. Con el nivel de reemplazo en 2.1, casi dos tercios de la población mundial vive hoy en países con tasas decrecientes. Esto se suma a los avances en longevidad, haciendo que el segmento de más de 50 años sea el de mayor crecimiento global.</div>
            <div class="dossier-highlight-box">
                <div class="dossier-highlight-box-p">"La Economía Plateada (Silver Economy) deja de ser un riesgo fiscal o una política de beneficencia, y se consolida como el motor definitivo de consumo e innovación empresarial."</div>
            </div>
            <div class="dossier-p">Frente a este escenario, <strong>Age Friend Seal</strong> provee una normativa técnica propia estructurada en tres ejes de certificación, que integra los mejores estándares y directrices globales de organizaciones como la ISO, OMS, OPS, BID Lab, OIT, ONU y Banco Mundial.</div>
        </div>

        <div class="dossier-page-break"></div>

        <div class="dossier-section">
            <div class="dossier-section-title"><span>💼</span> 2. Clientes B2B & Gestión de Talento (Ejes Laboral y Conciliación)</div>
            <div class="dossier-p">La escasez futura de fuerza laboral activa exige a las organizaciones retener y potenciar su capital intelectual senior, erradicar el edadismo y apoyar a los empleados cuidadores. La mentoría cruzada intergeneracional es la clave para sincronizar la frescura digital de los jóvenes y la experiencia estratégica de los profesionales senior.</div>
            <div class="dossier-p"><strong>Ejes Fundamentales e Impacto:</strong></div>
            <div class="dossier-ul">
                <div class="dossier-li"><strong>Eje Laboral (Talento y Empleabilidad):</strong> Procesos de reclutamiento sin sesgos, fomento de la empleabilidad senior y mentoría inversa. Integra directrices de <strong>ISO 25550</strong>, convenios de la <strong>OIT</strong> y políticas pro-edad de la <strong>ONU</strong>.</div>
                <div class="dossier-li"><strong>Eje Conciliación (Bienestar Familiar):</strong> Apoyo a empleados de la "Generación Sándwich" que cuidan a familiares dependientes mayores, mediante flexibilidad asincrónica y licencias especiales. Basado en <strong>ISO 25551</strong> y guías de cuidado integrado de la <strong>OPS/OMS</strong>.</div>
                <div class="dossier-li"><strong>Productividad e Innovación:</strong> Equipos multigeneracionales incrementan un 19% los ingresos por innovación y elevan la productividad total en un 1.1% por cada 10% de aumento en la proporción senior (OCDE).</div>
            </div>
        </div>

        <div class="dossier-section">
            <div class="dossier-section-title"><span>🛍️</span> 3. Clientes B2C & Eje Mercado Digital (Consumo e Inclusión)</div>
            <div class="dossier-p">Las personas mayores de 50 años concentran más del 50% del gasto global. Sin embargo, muchos de los canales de venta físicos y digitales los excluyen involuntariamente por barreras de accesibilidad y edadismo.</div>
            <div class="dossier-p"><strong>Eje de Certificación e Inclusión:</strong></div>
            <div class="dossier-ul">
                <div class="dossier-li"><strong>Eje Mercado Digital (Diseño e interfaces):</strong> Certificación de accesibilidad digital en interfaces táctiles (AgeTech), mitigación de sesgos de edad en IA y botones de asistencia humana obligatorios. Basado en <strong>ISO 25556</strong>, la red de ciudades amigables de la <strong>OMS</strong> y principios del <strong>BID Lab</strong>.</div>
                <div class="dossier-li"><strong>Servicio Silver y Lealtad:</strong> Protocolos de atención prioritarios y canales asistidos que incrementan la lealtad y el ticket de compra del segmento plateado.</div>
                <div class="dossier-li"><strong>Certificación y Confianza:</strong> El sello visible valida el compromiso y atrae activamente al público senior con mayor poder adquisitivo.</div>
            </div>
        </div>

        <div class="dossier-page-break"></div>

        <div class="dossier-section">
            <div class="dossier-section-title"><span>🤝</span> 4. Proveedores & Innovación AgeTech</div>
            <div class="dossier-p">La tecnología es el gran habilitador de la longevidad activa. Buscamos integrar y certificar soluciones tecnológicas y servicios que fomenten la autonomía e inclusión de los adultos mayores.</div>
            <div class="dossier-p"><strong>Ejes de Integración:</strong></div>
            <div class="dossier-ul">
                <div class="dossier-li"><strong>Dispositivos de Asistencia:</strong> IoT y sensores en el hogar respaldados por Inteligencia Artificial.</div>
                <div class="dossier-li"><strong>Telemedicina:</strong> Plataformas de monitoreo y cuidado preventivo especializadas.</div>
                <div class="dossier-li"><strong>Finanzas Plateadas:</strong> Soluciones crediticias y de seguros diseñadas sin barreras de edad.</div>
            </div>
        </div>

        <div class="dossier-section">
            <div class="dossier-section-title"><span>🏛️</span> 5. Instituciones & Alianzas del Ecosistema</div>
            <div class="dossier-p">Impulsamos alianzas públicas y privadas con el objetivo de fomentar subsidios de contratación activa, entornos urbanos amigables con el envejecimiento y redes de capacitación formal para la economía del cuidado.</div>
            <div class="dossier-p"><strong>Mapeo de Alianzas:</strong></div>
            <div class="dossier-ul">
                <div class="dossier-li"><strong>Municipios y Ciudades Amigables:</strong> Programas de adaptación de espacios públicos con base en lineamientos de la OMS.</div>
                <div class="dossier-li"><strong>Fomento Laboral:</strong> Redes de mentoría cruzada que conectan pymes locales con consultores seniors.</div>
                <div class="dossier-li"><strong>Formación en Cuidados:</strong> Alianzas formativas para profesionalizar el ecosistema del cuidado senior.</div>
            </div>
        </div>

        <div class="dossier-cta-box">
            <div class="dossier-cta-box-h3">¿Listo para certificar su negocio o iniciar una alianza?</div>
            <div class="dossier-cta-box-p">Contacte directamente a nuestro equipo de alianzas para agendar una sesión estratégica personalizada.</div>
            <a href="mailto:qdoblea@gmail.com" class="dossier-cta-btn">Contactar a Alianzas</a>
        </div>

        <div class="dossier-footer">
            <button onclick="window.print()" class="dossier-print-btn">Imprimir / Guardar como PDF</button>
            <div class="dossier-p" style="margin-top: 12px;">&copy; 2026 Instituto Certificador Age-Friendly Internacional. Todos los derechos reservados.</div>
        </div>
    </div>
</div>`;

const EN_DOSSIER_TEMPLATE = `<div class="dossier-main-wrapper">
    <style>
        .dossier-main-wrapper {
            background-color: #ffffff !important;
            color: #0f172a !important;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
            line-height: 1.6 !important;
            padding: 40px 20px !important;
            width: 100% !important;
            max-width: 900px !important;
            margin: 0 auto !important;
            box-sizing: border-box !important;
        }
        .dossier-container {
            background: #ffffff !important;
            border: 1px solid #e2e8f0 !important;
            border-radius: 24px !important;
            padding: 48px !important;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05) !important;
            box-sizing: border-box !important;
        }
        .dossier-header {
            text-align: center !important;
            border-bottom: 1px solid #e2e8f0 !important;
            padding-bottom: 32px !important;
            margin-bottom: 40px !important;
        }
        .dossier-logo-container {
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 12px !important;
            margin-bottom: 20px !important;
        }
        .dossier-logo-icon {
            font-size: 2.5rem !important;
        }
        .dossier-logo-text {
            font-family: system-ui, sans-serif !important;
            font-weight: 800 !important;
            font-size: 2.2rem !important;
            color: #0f172a !important;
        }
        .dossier-logo-accent {
            color: #d97706 !important;
        }
        .dossier-h1 {
            font-family: system-ui, sans-serif !important;
            font-size: 2.5rem !important;
            font-weight: 800 !important;
            margin-bottom: 12px !important;
            color: #0f172a !important;
        }
        .dossier-subtitle {
            font-size: 1.1rem !important;
            color: #d97706 !important;
            font-weight: 700 !important;
            margin-bottom: 24px !important;
            letter-spacing: 1px !important;
            text-transform: uppercase !important;
        }
        .dossier-meta-info {
            display: flex !important;
            justify-content: center !important;
            gap: 24px !important;
            font-size: 0.9rem !important;
            color: #64748b !important;
        }
        .dossier-meta-item strong { color: #334155 !important; }
        
        .dossier-section {
            margin-bottom: 48px !important;
        }
        .dossier-section-title {
            font-family: system-ui, sans-serif !important;
            font-size: 1.6rem !important;
            font-weight: 700 !important;
            color: #d97706 !important;
            margin-bottom: 20px !important;
            border-bottom: 2px solid #e2e8f0 !important;
            padding-bottom: 8px !important;
            display: flex !important;
            align-items: center !important;
            gap: 12px !important;
        }
        .dossier-p {
            color: #334155 !important;
            margin-bottom: 16px !important;
            font-size: 1.05rem !important;
            display: block !important;
        }
        .dossier-ul {
            margin-left: 24px !important;
            margin-bottom: 20px !important;
            display: block !important;
        }
        .dossier-li {
            color: #334155 !important;
            margin-bottom: 8px !important;
            font-size: 1rem !important;
            display: list-item !important;
            list-style-type: disc !important;
        }
        .dossier-highlight-box {
            background: #fffbeb !important;
            border-left: 4px solid #d97706 !important;
            padding: 20px !important;
            border-radius: 0 12px 12px 0 !important;
            margin-top: 24px !important;
            margin-bottom: 24px !important;
        }
        .dossier-highlight-box-p {
            margin-bottom: 0 !important;
            font-style: italic !important;
            color: #b45309 !important;
            display: block !important;
        }
        .dossier-cta-box {
            text-align: center !important;
            background: #f0fdf4 !important;
            border: 1px solid #bbf7d0 !important;
            border-radius: 20px !important;
            padding: 32px !important;
            margin-top: 48px !important;
        }
        .dossier-cta-box-h3 {
            font-family: system-ui, sans-serif !important;
            font-size: 1.5rem !important;
            margin-bottom: 12px !important;
            color: #166534 !important;
        }
        .dossier-cta-box-p {
            color: #1e293b !important;
            margin-bottom: 0 !important;
            display: block !important;
        }
        .dossier-cta-btn {
            display: inline-block !important;
            background: #166534 !important;
            color: #ffffff !important;
            font-family: system-ui, sans-serif !important;
            font-weight: 700 !important;
            text-decoration: none !important;
            padding: 12px 32px !important;
            border-radius: 8px !important;
            margin-top: 16px !important;
        }
        .dossier-footer {
            text-align: center !important;
            margin-top: 48px !important;
            padding-top: 24px !important;
            border-top: 1px solid #e2e8f0 !important;
            color: #64748b !important;
        }
        .dossier-print-btn {
            display: inline-block !important;
            background: #d97706 !important;
            color: #ffffff !important;
            font-family: system-ui, sans-serif !important;
            font-weight: 700 !important;
            text-decoration: none !important;
            padding: 10px 24px !important;
            border-radius: 8px !important;
            border: none !important;
            cursor: pointer !important;
            margin-bottom: 16px !important;
            font-size: 0.95rem !important;
            transition: background 0.2s !important;
        }
        .dossier-print-btn:hover {
            background: #b45309 !important;
        }
        .dossier-page-break {
            page-break-before: always !important;
        }
        @media print {
            .dossier-container {
                max-width: 100% !important;
                margin: 0 !important;
                padding: 20px !important;
                border: none !important;
                box-shadow: none !important;
            }
            .dossier-cta-btn, .dossier-print-btn {
                display: none !important;
            }
        }
    </style>

    <div class="dossier-container">
        <div class="dossier-header">
            <div class="dossier-logo-container">
                <span class="dossier-logo-icon">🏅</span>
                <span class="dossier-logo-text"><span class="dossier-logo-accent">Age</span> Friend Seal</span>
            </div>
            <div class="dossier-h1">CORPORATE ALLIANCES DOSSIER</div>
            <div class="dossier-subtitle">Strategic Proposal for B2B, B2C, Suppliers & Institutions</div>
            <div class="dossier-meta-info">
                <div class="dossier-meta-item">Document: <strong>Partnership Pitch</strong></div>
                <div class="dossier-meta-item">Year: <strong>2026</strong></div>
                <div class="dossier-meta-item">Institute: <strong>International Certification Institute</strong></div>
            </div>
        </div>

        <div class="dossier-section">
            <div class="dossier-section-title"><span>📉</span> 1. The Demographic Winter & The Silver Opportunity</div>
            <div class="dossier-p">The world is experiencing a demographic shift without historical precedent. The rate at which babies are born is rapidly decelerating globally: in 1990 the global fertility rate was 3.3 births per woman, whereas today it averages just 2.3. With the replacement rate at 2.1, nearly two-thirds of the global population now lives in countries with declining rates. Combined with advancements in longevity, the over-50 age bracket is the fastest-growing globally.</div>
            <div class="dossier-highlight-box">
                <div class="dossier-highlight-box-p">"The Silver Economy is no longer a fiscal risk or a welfare policy, but the definitive engine for consumer spending and business innovation."</div>
            </div>
            <div class="dossier-p">Given this scenario, <strong>Age Friend Seal</strong> provides its own proprietary technical framework structured in three certification pillars, integrating global standards and guidelines from organizations such as ISO, WHO, PAHO, IDB Lab, ILO, UN, and the World Bank.</div>
        </div>

        <div class="dossier-page-break"></div>

        <div class="dossier-section">
            <div class="dossier-section-title"><span>💼</span> 2. B2B Clients & Talent Management (Workplace & Conciliation Pillars)</div>
            <div class="dossier-p">The future shortage of an active workforce requires organizations to retain and empower their senior intellectual capital, eradicate ageism, and support caregiving employees. Intergenerational cross-mentorship is the key to synchronizing the digital freshness of younger workers with the strategic experience of senior professionals.</div>
            <div class="dossier-p"><strong>Core Pillars & Impact:</strong></div>
            <div class="dossier-ul">
                <div class="dossier-li"><strong>Workplace Pillar (Talent & Employability):</strong> Unbiased recruitment, active senior retention, and reverse mentoring. Integrates guidelines from <strong>ISO 25550</strong>, <strong>ILO</strong> conventions, and <strong>UN</strong> pro-age policies.</div>
                <div class="dossier-li"><strong>Conciliation Pillar (Family Support):</strong> Support for "sandwich generation" employees caring for elder relatives, through asynchronous schedules and caregiving leaves. Based on <strong>ISO 25551</strong> and <strong>PAHO/WHO</strong> integrated care guidelines.</div>
                <div class="dossier-li"><strong>Productivity & Innovation:</strong> Multigenerational teams boost innovation revenue by 19% and increase total productivity by 1.1% for every 10% increase in the proportion of senior employees (OECD data).</div>
            </div>
        </div>

        <div class="dossier-section">
            <div class="dossier-section-title"><span>🛍️</span> 3. B2C Clients & Digital Market Pillar (Consumer & Inclusion)</div>
            <div class="dossier-p">People over 50 command over 50% of global consumer spending. However, many current physical and digital channels unintentionally exclude them due to accessibility barriers.</div>
            <div class="dossier-p"><strong>Certification Pillar & Inclusion:</strong></div>
            <div class="dossier-ul">
                <div class="dossier-li"><strong>Digital Market Pillar (Design & Channels):</strong> Certified accessibility for touchscreens (AgeTech), age bias audits in AI algorithms, and mandatory human assistance buttons. Based on <strong>ISO 25556</strong>, the <strong>WHO</strong> age-friendly cities network, and <strong>IDB Lab</strong> principles.</div>
                <div class="dossier-li"><strong>Silver Service & Loyalty:</strong> Priority care protocols and assisted channels that increase brand loyalty and transaction size in the silver segment.</div>
                <div class="dossier-li"><strong>Certification & Trust:</strong> A visible, trusted seal that validates your commitment and actively attracts high-purchasing-power seniors.</div>
            </div>
        </div>

        <div class="dossier-page-break"></div>

        <div class="dossier-section">
            <div class="dossier-section-title"><span>🤝</span> 4. Suppliers & AgeTech Innovation</div>
            <div class="dossier-p">Technology is the great enabler for active longevity. We aim to integrate and certify technological solutions and services that foster senior autonomy and inclusion.</div>
            <div class="dossier-p"><strong>Integration Pillars:</strong></div>
            <div class="dossier-ul">
                <div class="dossier-li"><strong>Assistive Devices:</strong> Smart home IoT and sensors powered by Artificial Intelligence.</div>
                <div class="dossier-li"><strong>Telemedicine:</strong> Specialized monitoring and preventive care platforms.</div>
                <div class="dossier-li"><strong>Silver Finance:</strong> Unbiased loan and insurance products designed without age barriers.</div>
            </div>
        </div>

        <div class="dossier-section">
            <div class="dossier-section-title"><span>🏛️</span> 5. Institutions & Ecosystem Partnerships</div>
            <div class="dossier-p">We drive public-private partnerships to promote active hiring subsidies, age-friendly urban environments, and formal training networks for the caregiving economy.</div>
            <div class="dossier-p"><strong>Partnership Mapping:</strong></div>
            <div class="dossier-ul">
                <div class="dossier-li"><strong>Age-Friendly Cities & Municipalities:</strong> Public space adaptation programs based on WHO frameworks.</div>
                <div class="dossier-li"><strong>Labor Promotion:</strong> Cross-mentorship networks linking local SMEs with senior consultants.</div>
                <div class="dossier-li"><strong>Caregiver Training:</strong> Educational alliances to professionalize the senior care ecosystem.</div>
            </div>
        </div>

        <div class="dossier-cta-box">
            <div class="dossier-cta-box-h3">Ready to certify your business or start a partnership?</div>
            <div class="dossier-cta-box-p">Contact our alliances team directly to schedule a personalized strategic session.</div>
            <a href="mailto:qdoblea@gmail.com" class="dossier-cta-btn">Contact Partnerships</a>
        </div>

        <div class="dossier-footer">
            <button onclick="window.print()" class="dossier-print-btn">Print / Save as PDF</button>
            <div class="dossier-p" style="margin-top: 12px;">&copy; 2026 Age-Friendly International Certification Institute. All rights reserved.</div>
        </div>
    </div>
</div>`;

// Función para colapsar y expandir los detalles de las normas de manera animada
function toggleCardDetails(id, btn) {
    const el = document.getElementById(id);
    if (!el) return;
    
    const isOpen = el.classList.contains('open');
    const isEn = document.documentElement.lang === 'en' || window.location.pathname.includes('en.html');
    
    // Cerrar todas las demás tarjetas primero para mantener orden
    document.querySelectorAll('.expanded-details').forEach(card => {
        card.classList.remove('open');
        card.style.maxHeight = null;
    });
    
    document.querySelectorAll('.toggle-details-btn').forEach(button => {
        button.innerHTML = isEn ? 'More details ▾' : 'Más detalle ▾';
    });
    
    if (!isOpen) {
        el.classList.add('open');
        // Calcular la altura real del contenido para una animación fluida
        el.style.maxHeight = el.scrollHeight + 'px';
        btn.innerHTML = isEn ? 'Less details ▴' : 'Menos detalle ▴';
    }
}

