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
                pitchToastDesc: "Se ha simulado el envío de un correo a qdoblea@gmail.com con la información del prospecto:",
        authBtnNav: "Acceso / Registro",
        authBtnNavLoggedIn: "Mi Cuenta 👤",
        authAlertTitle: "Acceso Exclusivo Corporativo",
        authAlertText: "Esta función (descargar el dossier corporativo o agendar reuniones de consultoría) está reservada para cuentas de tipo **Empresa**.",
        authUpgradeSuccess: "¡Tu cuenta ha sido actualizada a Cuenta de Empresa con éxito! Ya puedes acceder a todas las funciones corporativas.",
        authEmailExists: "Este correo electrónico ya está registrado. Por favor, inicia sesión.",
        authEmailNotExists: "Este correo electrónico no está registrado. Por favor, crea una cuenta.",
        authLoginSuccess: "¡Inicio de sesión exitoso!",
        authRegisterSuccess: "¡Registro exitoso!",
        authLogoutSuccess: "¡Sesión cerrada con éxito!"
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
                pitchToastDesc: "A notification email to qdoblea@gmail.com has been simulated with the lead's contact information:",
        authBtnNav: "Login / Register",
        authBtnNavLoggedIn: "My Account 👤",
        authAlertTitle: "Exclusive Corporate Access",
        authAlertText: "This feature (downloading the corporate dossier or scheduling consultancy meetings) is reserved for **Company** accounts.",
        authUpgradeSuccess: "Your account has been successfully upgraded to a Company Account! You can now access all corporate features.",
        authEmailExists: "This email is already registered. Please log in.",
        authEmailNotExists: "This email is not registered. Please create an account.",
        authLoginSuccess: "Login successful!",
        authRegisterSuccess: "Registration successful!",
        authLogoutSuccess: "Logged out successfully!"
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

// Estado de Autenticación y Cuentas
let currentUser = null;
let ageFriendAccounts = [];
let tempAuthData = null;

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
    initAuthSession();
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
    if (btnNext) {
        btnNext.addEventListener('click', () => {
            // Verificamos si estamos en la última pregunta
            if (currentQuestionIndex === QUESTIONS.length - 1) {
                // Si llega al final y no está registrado, forzamos la vista de registro
                if (!isConfirmed) {
                    showRegistrationView();
                } else {
                    // Si ya está registrado, calculamos y mostramos resultados
                    calculateResults();
                }
            } else {
                // Flujo normal: avanza a la siguiente pregunta sin interrupciones
                currentQuestionIndex++;
                loadQuestion(currentQuestionIndex);
            }
        });
    }
    
    if (btnPrev) {
        btnPrev.addEventListener('click', () => {
            if (currentQuestionIndex > 0) {
                currentQuestionIndex--;
                loadQuestion(currentQuestionIndex);
            }
        });
    }
    
    // Botón repetir autodiagnóstico
    const btnRestartQuiz = document.getElementById('btn-restart-quiz');
    if (btnRestartQuiz) {
        btnRestartQuiz.addEventListener('click', () => {
            currentQuestionIndex = 0;
            userAnswers.fill(null);
            resultsCard.classList.add('hidden');
            quizCard.classList.remove('hidden');
            loadQuestion(currentQuestionIndex);
            
            // Hacer scroll suave al inicio del cuestionario
            document.getElementById('autodiagnostico').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Botón para simular compra del Sello
    const btnClaimSello = document.getElementById('btn-claim-sello');
    if (btnClaimSello) {
        btnClaimSello.addEventListener('click', () => {
            const defaultCompany = currentLang === 'es' ? 'Su Empresa' : 'Your Company';
            const companyName = userRegistrationData ? userRegistrationData.company : defaultCompany;
            const decalContainer = document.getElementById('decal-preview-container');
            if (decalContainer) {
                decalContainer.innerHTML = generateDecalSVG(companyName);
            }
            openModal(paymentModal);
        });
    }
    
    // Cierres de Modales
    const btnModalClose = document.getElementById('btn-modal-close');
    if (btnModalClose) {
        btnModalClose.addEventListener('click', () => closeModal(contactModal));
    }
    const btnPayModalClose = document.getElementById('btn-pay-modal-close');
    if (btnPayModalClose) {
        btnPayModalClose.addEventListener('click', () => closeModal(paymentModal));
    }
    
    // Pitch Modal & Download Logic (B2B Adaptable)
    const pitchModal = document.getElementById('pitch-modal');
    const btnOpenPitch = document.getElementById('btn-open-pitch');
    const btnPitchModalClose = document.getElementById('btn-pitch-modal-close');
    const pitchForm = document.getElementById('pitch-form');

    if (btnOpenPitch) {
        btnOpenPitch.addEventListener('click', (e) => {
            e.preventDefault();
            
            // 1. Si no hay usuario o no es cuenta Empresa -> Bloqueo
            if (!currentUser || currentUser.type !== 'empresa') {
                showAuthAlert();
                return;
            }
            
            // 2. Es empresa: Preparamos el modal para que SOLO elija el formato
            // Ocultamos los campos y ELIMINAMOS el 'required' para que no bloqueen el submit
            const inputName = document.getElementById('pitch-name');
            const inputPhone = document.getElementById('pitch-phone');
            const inputEmail = document.getElementById('pitch-corp-email');

            if (inputName) {
                inputName.parentElement.style.display = 'none';
                inputName.required = false;
            }
            if (inputPhone) {
                inputPhone.parentElement.style.display = 'none';
                inputPhone.required = false;
            }
            if (inputEmail) {
                inputEmail.parentElement.style.display = 'none';
                inputEmail.required = false;
            }
            
            // Adaptamos los textos del modal
            const modalTitle = pitchModal.querySelector('h3');
            const modalDesc = pitchModal.querySelector('p');
            if (modalTitle) modalTitle.textContent = currentLang === 'es' ? 'Formato de Descarga' : 'Download Format';
            if (modalDesc) modalDesc.textContent = currentLang === 'es' ? 
                'Como usuario corporativo validado, simplemente elija el formato en el que desea descargar su Dossier.' : 
                'As a validated corporate user, please select your preferred download format.';
            
            // Cambiamos el texto del botón
            const submitBtn = pitchForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.textContent = currentLang === 'es' ? 'Descargar' : 'Download';
            }

            openModal(pitchModal);
        });
    }

    if (btnPitchModalClose) {
        btnPitchModalClose.addEventListener('click', () => {
            closeModal(pitchModal);
        });
    }

    if (pitchForm) {
        pitchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const format = document.getElementById('pitch-format').value;
            const PITCH_RECIPIENT_EMAIL = "qdoblea@gmail.com";

            // Iniciar la descarga del PDF o HTML inmediatamente
            downloadPitchDossier(currentLang, format);

            // Enviar notificación al administrador usando LA MISMA plantilla que ya funciona
            if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG.publicKey && EMAILJS_CONFIG.publicKey !== "TU_PUBLIC_KEY") {
                const nameStr = currentUser ? currentUser.name : "Invitado B2B";
                const emailStr = currentUser ? currentUser.email : "N/A";
                const leadParams = {
                    to_email: PITCH_RECIPIENT_EMAIL, // Va a qdoblea@gmail.com
                    to_name: "Equipo Age Friend Seal",
                    company_name: "NUEVO LEAD: " + nameStr + " (" + emailStr + ")",
                    verification_code: "N/A" // Llenamos la variable para que la plantilla no falle
                };
                
                emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, leadParams)
                    .then(() => console.log("Aviso de descarga enviado a tu correo."))
                    .catch((err) => console.error("Error enviando aviso:", err));
            } else {
                // Simulación local si no hay EmailJS
                const leadData = {
                    name: currentUser ? currentUser.name : "Invitado B2B",
                    phone: "N/A (Usuario Corporativo)",
                    corpEmail: currentUser ? currentUser.email : "N/A"
                };
                triggerFallbackPitchLead(leadData, PITCH_RECIPIENT_EMAIL);
            }

            closeModal(pitchModal);
        });
    }
    
    // Botones de Solicitar Info en Planes
    const reqSilverBtn = document.getElementById('btn-request-silver');
    if (reqSilverBtn) {
        reqSilverBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (!currentUser || currentUser.type !== 'empresa') {
                showAuthAlert();
                return;
            }
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
            if (!currentUser || currentUser.type !== 'empresa') {
                showAuthAlert();
                return;
            }
            document.getElementById('modal-title').textContent = currentLang === 'es' ? 
                "Solicitar Certificación Total (Nivel Premium)" : "Request Full Certification (Premium Level)";
            document.getElementById('modal-subtitle').textContent = currentLang === 'es' ? 
                "Cumpla con el 100% de la normativa exigida para obtener el sello oficial de Empresa Certificada." :
                "Comply with 100% of the required regulations to obtain the official Certified Company seal.";
            openModal(contactModal);
        });
    }
    
    // Envío de Formulario de Contacto
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert(TRANSLATIONS[currentLang].contactSuccessAlert);
            closeModal(contactModal);
            contactForm.reset();
        });
    }
    
    // Simulación de Pago y Descarga
    const btnPaySubmit = document.getElementById('btn-pay-submit');
    if (btnPaySubmit) {
        btnPaySubmit.addEventListener('click', () => {
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
    }
    
    // Descarga de PDF de Reporte / Plan de Acción
    const btnDownloadPdf = document.getElementById('btn-download-pdf') || document.getElementById('btn-download-excel');
    if (btnDownloadPdf) {
        btnDownloadPdf.addEventListener('click', () => {
            alert(TRANSLATIONS[currentLang].pdfAlert);
            window.print(); // Solución elegante y nativa que permite guardar como PDF en cualquier navegador
        });
    }
    
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
    
    // ==========================================================================
    // Gestión de Eventos de Autenticación y Perfil
    // ==========================================================================
    
    // 1. Botón Navbar Acceso/Registro
    const btnNavAuth = document.getElementById('btn-nav-auth');
    if (btnNavAuth) {
        btnNavAuth.addEventListener('click', (e) => {
            e.preventDefault();
            if (currentUser) {
                updateAuthUI();
                openModal(document.getElementById('account-modal'));
            } else {
                const authModal = document.getElementById('auth-modal');
                const viewLogin = document.getElementById('view-login');
                const viewRegister = document.getElementById('view-register');
                const viewOtp = document.getElementById('view-otp');
                const tabLogin = document.getElementById('tab-login');
                const tabRegister = document.getElementById('tab-register');

                if (viewLogin) viewLogin.classList.remove('hidden');
                if (viewRegister) viewRegister.classList.add('hidden');
                if (viewOtp) viewOtp.classList.add('hidden');
                if (tabLogin) tabLogin.classList.add('active');
                if (tabRegister) tabRegister.classList.remove('active');

                openModal(authModal);
            }
        });
    }

    // 2. Cierre de Modales Auth
    const btnAuthModalClose = document.getElementById('btn-auth-modal-close');
    if (btnAuthModalClose) {
        btnAuthModalClose.addEventListener('click', () => {
            closeModal(document.getElementById('auth-modal'));
        });
    }
    const btnAccountModalClose = document.getElementById('btn-account-modal-close');
    if (btnAccountModalClose) {
        btnAccountModalClose.addEventListener('click', () => {
            closeModal(document.getElementById('account-modal'));
        });
    }
    const btnAuthAlertClose = document.getElementById('btn-auth-alert-close');
    if (btnAuthAlertClose) {
        btnAuthAlertClose.addEventListener('click', () => {
            closeModal(document.getElementById('auth-alert-modal'));
        });
    }

    // 3. Conmutación de Pestañas Iniciar Sesión / Registrarse
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const viewLogin = document.getElementById('view-login');
    const viewRegister = document.getElementById('view-register');
    const viewOtp = document.getElementById('view-otp');

    if (tabLogin && tabRegister) {
        tabLogin.addEventListener('click', () => {
            tabLogin.classList.add('active');
            tabRegister.classList.remove('active');
            if (viewLogin) viewLogin.classList.remove('hidden');
            if (viewRegister) viewRegister.classList.add('hidden');
            if (viewOtp) viewOtp.classList.add('hidden');
        });

        tabRegister.addEventListener('click', () => {
            tabRegister.classList.add('active');
            tabLogin.classList.remove('active');
            if (viewLogin) viewLogin.classList.add('hidden');
            if (viewRegister) viewRegister.classList.remove('hidden');
            if (viewOtp) viewOtp.classList.add('hidden');
            handleUserTypeChange(document.getElementById('auth-reg-user-type').value, 'auth-reg-');
        });
    }

    // 4. Listeners para Selects de Registro (Tipo de cuenta y sector)
    const authRegUserType = document.getElementById('auth-reg-user-type');
    if (authRegUserType) {
        authRegUserType.addEventListener('change', (e) => {
            handleUserTypeChange(e.target.value, 'auth-reg-');
        });
    }
    const authRegSectorType = document.getElementById('auth-reg-sector-type');
    if (authRegSectorType) {
        authRegSectorType.addEventListener('change', (e) => {
            handleSectorTypeChange(e.target.value, 'auth-reg-');
        });
    }

    const quizRegUserType = document.getElementById('quiz-reg-user-type');
    if (quizRegUserType) {
        quizRegUserType.addEventListener('change', (e) => {
            handleUserTypeChange(e.target.value, 'quiz-reg-');
        });
    }
    const quizRegSectorType = document.getElementById('quiz-reg-sector-type');
    if (quizRegSectorType) {
        quizRegSectorType.addEventListener('change', (e) => {
            handleSectorTypeChange(e.target.value, 'quiz-reg-');
        });
    }

    // 5. Envío de Formulario Login
    const formLogin = document.getElementById('form-login');
    if (formLogin) {
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value.trim();
            const account = ageFriendAccounts.find(acc => acc.email.toLowerCase() === email.toLowerCase());

            if (account) {
                tempAuthData = {
                    user: account,
                    isNew: false
                };
                // Mostrar vista OTP en el modal
                if (viewLogin) viewLogin.classList.add('hidden');
                if (viewOtp) {
                    viewOtp.classList.remove('hidden');
                    const emailDisp = document.getElementById('auth-otp-email-display');
                    if (emailDisp) emailDisp.textContent = email;
                }
                // Limpiar inputs OTP
                document.querySelectorAll('#view-otp .otp-digit').forEach(input => input.value = '');
                // Enviar correo
                sendAuthVerificationEmail(account.name, account.company || '', email, 'modal');
            } else {
                alert(TRANSLATIONS[currentLang].authEmailNotExists);
            }
        });
    }

    // 6. Envío de Formulario Registro
    const formRegister = document.getElementById('form-register');
    if (formRegister) {
        formRegister.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('auth-reg-email').value.trim();
            const name = document.getElementById('auth-reg-name').value.trim();
            const type = document.getElementById('auth-reg-user-type').value;

            const exists = ageFriendAccounts.some(acc => acc.email.toLowerCase() === email.toLowerCase());
            if (exists) {
                alert(TRANSLATIONS[currentLang].authEmailExists);
                return;
            }

            let user = { name, email, type };
            if (type === 'personal') {
                user.country = document.getElementById('auth-reg-country').value.trim();
            } else {
                const sector = document.getElementById('auth-reg-sector-type').value;
                user.sector = sector;
                user.role = document.getElementById('auth-reg-role').value.trim();
                if (sector === 'publico') {
                    user.subsector = document.getElementById('auth-reg-public-level').value;
                    user.company = document.getElementById('auth-reg-public-level').options[document.getElementById('auth-reg-public-level').selectedIndex].text;
                } else {
                    user.subsector = document.getElementById('auth-reg-private-vertical').value;
                    user.company = document.getElementById('auth-reg-private-vertical').options[document.getElementById('auth-reg-private-vertical').selectedIndex].text;
                }
            }

            tempAuthData = {
                user,
                isNew: true
            };

            // Mostrar vista OTP
            if (viewRegister) viewRegister.classList.add('hidden');
            if (viewOtp) {
                viewOtp.classList.remove('hidden');
                const emailDisp = document.getElementById('auth-otp-email-display');
                if (emailDisp) emailDisp.textContent = email;
            }
            // Limpiar inputs OTP
            document.querySelectorAll('#view-otp .otp-digit').forEach(input => input.value = '');
            // Enviar correo
            sendAuthVerificationEmail(name, user.company || '', email, 'modal');
        });
    }

    // 7. Configuración de Entrada de OTP con salto automático
    setupOtpInputsAutoJump('view-otp');
    setupOtpInputsAutoJump('quiz-confirm-view');

    // 8. Botón Confirmar OTP en Modal
    const btnAuthConfirmOtp = document.getElementById('btn-auth-confirm-otp');
    if (btnAuthConfirmOtp) {
        btnAuthConfirmOtp.addEventListener('click', () => {
            let code = "";
            document.querySelectorAll('#view-otp .otp-digit').forEach(input => code += input.value);
            const errorMsg = document.getElementById('auth-otp-error-msg');
            if (code === currentVerificationCode) {
                confirmAuthSuccess();
            } else {
                if (errorMsg) {
                    errorMsg.textContent = TRANSLATIONS[currentLang].otpErrorMsg;
                    errorMsg.classList.remove('hidden');
                }
            }
        });
    }

    // 9. Botón Confirmar OTP en Cuestionario
    const btnConfirmOtp = document.getElementById('btn-confirm-otp');
    if (btnConfirmOtp) {
        btnConfirmOtp.addEventListener('click', () => {
            let code = "";
            document.querySelectorAll('#quiz-confirm-view .otp-digit').forEach(input => code += input.value);
            const errorMsg = document.getElementById('otp-error-msg');
            if (code === currentVerificationCode) {
                confirmAuthSuccess();
            } else {
                if (errorMsg) {
                    errorMsg.textContent = TRANSLATIONS[currentLang].otpErrorMsg;
                    errorMsg.classList.remove('hidden');
                }
            }
        });
    }

    // 10. Reenvío de OTP
    const btnAuthOtpResend = document.getElementById('btn-auth-otp-resend');
    if (btnAuthOtpResend) {
        btnAuthOtpResend.addEventListener('click', (e) => {
            e.preventDefault();
            if (tempAuthData && tempAuthData.user) {
                sendAuthVerificationEmail(tempAuthData.user.name, tempAuthData.user.company || '', tempAuthData.user.email, 'modal');
            }
        });
    }
    const btnOtpResend = document.getElementById('btn-otp-resend');
    if (btnOtpResend) {
        btnOtpResend.addEventListener('click', (e) => {
            e.preventDefault();
            if (tempAuthData && tempAuthData.user) {
                sendAuthVerificationEmail(tempAuthData.user.name, tempAuthData.user.company || '', tempAuthData.user.email, 'quiz');
            }
        });
    }

    // 11. Cerrar Sesión
    const btnAuthLogout = document.getElementById('btn-auth-logout');
    if (btnAuthLogout) {
        btnAuthLogout.addEventListener('click', () => {
            currentUser = null;
            localStorage.removeItem('age_friend_user');
            isConfirmed = false;
            userRegistrationData = null;
            updateAuthUI();
            closeModal(document.getElementById('account-modal'));
            alert(TRANSLATIONS[currentLang].authLogoutSuccess);
        });
    }

    // 12. Envío de Formulario Upgrade
    const formUpgrade = document.getElementById('form-upgrade');
    if (formUpgrade) {
        formUpgrade.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!currentUser) return;

            const sector = document.getElementById('upg-sector-type').value;
            const role = document.getElementById('upg-role').value.trim();
            
            currentUser.type = 'empresa';
            currentUser.sector = sector;
            currentUser.role = role;

            if (sector === 'publico') {
                currentUser.subsector = document.getElementById('upg-public-level').value;
                currentUser.company = document.getElementById('upg-public-level').options[document.getElementById('upg-public-level').selectedIndex].text;
            } else {
                currentUser.subsector = document.getElementById('upg-private-vertical').value;
                currentUser.company = document.getElementById('upg-private-vertical').options[document.getElementById('upg-private-vertical').selectedIndex].text;
            }

            const idx = ageFriendAccounts.findIndex(acc => acc.email.toLowerCase() === currentUser.email.toLowerCase());
            if (idx !== -1) {
                ageFriendAccounts[idx] = currentUser;
            } else {
                ageFriendAccounts.push(currentUser);
            }
            localStorage.setItem('age_friend_accounts', JSON.stringify(ageFriendAccounts));
            localStorage.setItem('age_friend_user', JSON.stringify(currentUser));
            
            isConfirmed = true;
            userRegistrationData = currentUser;

            updateAuthUI();
            
            closeModal(document.getElementById('account-modal'));
            alert(TRANSLATIONS[currentLang].authUpgradeSuccess);
        });
    }

    // 13. Conmutador de sector en formulario de upgrade
    const upgSectorType = document.getElementById('upg-sector-type');
    if (upgSectorType) {
        upgSectorType.addEventListener('change', (e) => {
            const sector = e.target.value;
            const publicField = document.getElementById('field-upg-public-level');
            const privateField = document.getElementById('field-upg-private-vertical');
            if (sector === 'publico') {
                if (publicField) publicField.classList.remove('hidden-field');
                if (privateField) privateField.classList.add('hidden-field');
                toggleRequiredFields(true, 'upg-public-level');
                toggleRequiredFields(false, 'upg-private-vertical');
            } else if (sector === 'privado') {
                if (publicField) publicField.classList.add('hidden-field');
                if (privateField) privateField.classList.remove('hidden-field');
                toggleRequiredFields(false, 'upg-public-level');
                toggleRequiredFields(true, 'upg-private-vertical');
            } else {
                if (publicField) publicField.classList.add('hidden-field');
                if (privateField) privateField.classList.add('hidden-field');
                toggleRequiredFields(false, 'upg-public-level', 'upg-private-vertical');
            }
        });
    }

    // 14. Botones de Modal de Alerta
    const btnAuthAlertUpgrade = document.getElementById('btn-auth-alert-upgrade');
    if (btnAuthAlertUpgrade) {
        btnAuthAlertUpgrade.addEventListener('click', () => {
            closeModal(document.getElementById('auth-alert-modal'));
            openModal(document.getElementById('account-modal'));
        });
    }
    const btnAuthAlertLogin = document.getElementById('btn-auth-alert-login');
    if (btnAuthAlertLogin) {
        btnAuthAlertLogin.addEventListener('click', () => {
            closeModal(document.getElementById('auth-alert-modal'));
            const authModal = document.getElementById('auth-modal');
            const viewLogin = document.getElementById('view-login');
            const viewRegister = document.getElementById('view-register');
            const viewOtp = document.getElementById('view-otp');
            const tabLogin = document.getElementById('tab-login');
            const tabRegister = document.getElementById('tab-register');

            if (viewLogin) viewLogin.classList.remove('hidden');
            if (viewRegister) viewRegister.classList.add('hidden');
            if (viewOtp) viewOtp.classList.add('hidden');
            if (tabLogin) tabLogin.classList.add('active');
            if (tabRegister) tabRegister.classList.remove('active');

            openModal(authModal);
        });
    }

    // 15. Formulario de Registro en el Cuestionario
    const quizRegisterForm = document.getElementById('quiz-register-form');
    if (quizRegisterForm) {
        quizRegisterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('quiz-reg-email').value.trim();
            const name = document.getElementById('quiz-reg-name').value.trim();
            const type = document.getElementById('quiz-reg-user-type').value;

            const exists = ageFriendAccounts.some(acc => acc.email.toLowerCase() === email.toLowerCase());
            if (exists) {
                alert(TRANSLATIONS[currentLang].authEmailExists);
                return;
            }

            let user = { name, email, type };
            if (type === 'personal') {
                user.country = document.getElementById('quiz-reg-country').value.trim();
            } else {
                const sector = document.getElementById('quiz-reg-sector-type').value;
                user.sector = sector;
                user.role = document.getElementById('quiz-reg-role').value.trim();
                if (sector === 'publico') {
                    user.subsector = document.getElementById('quiz-reg-public-level').value;
                    user.company = document.getElementById('quiz-reg-public-level').options[document.getElementById('quiz-reg-public-level').selectedIndex].text;
                } else {
                    user.subsector = document.getElementById('quiz-reg-private-vertical').value;
                    user.company = document.getElementById('quiz-reg-private-vertical').options[document.getElementById('quiz-reg-private-vertical').selectedIndex].text;
                }
            }

            tempAuthData = {
                user,
                isNew: true
            };

            hideRegistrationView();
            showVerificationView(email);
            sendAuthVerificationEmail(name, user.company || '', email, 'quiz');
        });
    }
}

function setupOtpInputsAutoJump(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const inputs = container.querySelectorAll('.otp-digit');
    inputs.forEach((input, index) => {
        input.addEventListener('keyup', (e) => {
            const val = input.value;
            if (val.length === 1 && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
        });
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && input.value.length === 0 && index > 0) {
                inputs[index - 1].focus();
            }
        });
    });
}// ==========================================================================
// Vistas y Lógica de Autenticación, OTP y Upgrade (Restaurado e Implementado)
// ==========================================================================

function initAuthSession() {
    try {
        const savedAccounts = localStorage.getItem('age_friend_accounts');
        ageFriendAccounts = savedAccounts ? JSON.parse(savedAccounts) : [];
    } catch (e) {
        console.error("Error al cargar cuentas:", e);
        ageFriendAccounts = [];
    }

    try {
        const savedUser = localStorage.getItem('age_friend_user');
        currentUser = savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
        console.error("Error al cargar usuario activo:", e);
        currentUser = null;
    }

    if (currentUser) {
        isConfirmed = true;
        userRegistrationData = currentUser;
    } else {
        isConfirmed = false;
        userRegistrationData = null;
    }

    updateAuthUI();
}

function updateAuthUI() {
    const t = TRANSLATIONS[currentLang];
    const btnNavAuth = document.getElementById('btn-nav-auth');

    if (btnNavAuth) {
        if (currentUser) {
            btnNavAuth.textContent = t.authBtnNavLoggedIn;
            btnNavAuth.classList.add('logged-in');
        } else {
            btnNavAuth.textContent = t.authBtnNav;
            btnNavAuth.classList.remove('logged-in');
        }
    }

    if (currentUser) {
        const accountTitleName = document.getElementById('account-title-name');
        const accountUserBadge = document.getElementById('account-user-badge');
        const accountDetailEmail = document.getElementById('account-detail-email');
        const accountDetailCountry = document.getElementById('account-detail-country');
        const accountDetailSector = document.getElementById('account-detail-sector');
        const accountDetailSubsector = document.getElementById('account-detail-subsector');
        const accountDetailRole = document.getElementById('account-detail-role');
        const upgradeSection = document.getElementById('upgrade-section');

        const detailItemCountry = document.getElementById('detail-item-country');
        const detailItemSector = document.getElementById('detail-item-sector');
        const detailItemSubsector = document.getElementById('detail-item-subsector');
        const detailItemRole = document.getElementById('detail-item-role');

        if (accountTitleName) accountTitleName.textContent = currentUser.name;
        if (accountDetailEmail) accountDetailEmail.textContent = currentUser.email;

        if (accountUserBadge) {
            accountUserBadge.textContent = currentUser.type === 'empresa' ? (currentLang === 'es' ? 'Empresa' : 'Company') : (currentLang === 'es' ? 'Personal' : 'Personal');
            accountUserBadge.className = 'user-badge-type ' + currentUser.type;
        }

        if (currentUser.type === 'personal') {
            if (detailItemCountry) detailItemCountry.classList.remove('hidden-field');
            if (accountDetailCountry) accountDetailCountry.textContent = currentUser.country || '';
            if (detailItemSector) detailItemSector.classList.add('hidden-field');
            if (detailItemSubsector) detailItemSubsector.classList.add('hidden-field');
            if (detailItemRole) detailItemRole.classList.add('hidden-field');
            if (upgradeSection) upgradeSection.classList.remove('hidden-field');
        } else {
            if (detailItemCountry) detailItemCountry.classList.add('hidden-field');
            if (detailItemSector) detailItemSector.classList.remove('hidden-field');
            if (accountDetailSector) accountDetailSector.textContent = currentUser.sector === 'privado' ? (currentLang === 'es' ? 'Privado' : 'Private') : (currentLang === 'es' ? 'Público' : 'Public');
            if (detailItemSubsector) detailItemSubsector.classList.remove('hidden-field');
            if (accountDetailSubsector) accountDetailSubsector.textContent = currentUser.subsector || '';
            if (detailItemRole) detailItemRole.classList.remove('hidden-field');
            if (accountDetailRole) accountDetailRole.textContent = currentUser.role || '';
            if (upgradeSection) upgradeSection.classList.add('hidden-field');
        }
    }
}

function showAuthAlert() {
    const modal = document.getElementById('auth-alert-modal');
    if (modal) {
        const alertTitle = modal.querySelector('h3');
        const alertText = document.getElementById('auth-alert-text');
        const upgradeBtn = document.getElementById('btn-auth-alert-upgrade');
        const loginBtn = document.getElementById('btn-auth-alert-login');
        const t = TRANSLATIONS[currentLang];

        if (alertTitle) alertTitle.textContent = t.authAlertTitle;
        if (alertText) alertText.innerHTML = t.authAlertText;

        if (currentUser) {
            if (upgradeBtn) upgradeBtn.classList.remove('hidden-field');
            if (loginBtn) loginBtn.classList.add('hidden-field');
        } else {
            if (upgradeBtn) upgradeBtn.classList.add('hidden-field');
            if (loginBtn) loginBtn.classList.remove('hidden-field');
        }

        openModal(modal);
    }
}

function toggleRequiredFields(required, ...ids) {
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            if (required) {
                el.setAttribute('required', 'true');
            } else {
                el.removeAttribute('required');
            }
        }
    });
}

function handleUserTypeChange(type, prefix = 'auth-reg-') {
    const countryField = document.getElementById(prefix === 'auth-reg-' ? 'field-personal-country' : 'quiz-field-personal-country');
    const sectorField = document.getElementById(prefix === 'auth-reg-' ? 'field-company-sector' : 'quiz-field-company-sector');
    const roleField = document.getElementById(prefix === 'auth-reg-' ? 'field-company-role' : 'quiz-field-company-role');
    
    const publicField = document.getElementById(prefix === 'auth-reg-' ? 'field-public-level' : 'quiz-field-public-level');
    const privateField = document.getElementById(prefix === 'auth-reg-' ? 'field-private-vertical' : 'quiz-field-private-vertical');

    if (type === 'personal') {
        if (countryField) countryField.classList.remove('hidden-field');
        if (sectorField) sectorField.classList.add('hidden-field');
        if (roleField) roleField.classList.add('hidden-field');
        if (publicField) publicField.classList.add('hidden-field');
        if (privateField) privateField.classList.add('hidden-field');

        toggleRequiredFields(true, prefix + 'country');
        toggleRequiredFields(false, prefix + 'sector-type', prefix + 'public-level', prefix + 'private-vertical', prefix + 'role');
    } else {
        if (countryField) countryField.classList.add('hidden-field');
        if (sectorField) sectorField.classList.remove('hidden-field');
        if (roleField) roleField.classList.remove('hidden-field');

        toggleRequiredFields(false, prefix + 'country');
        toggleRequiredFields(true, prefix + 'sector-type', prefix + 'role');
        
        const sectorVal = document.getElementById(prefix + 'sector-type').value;
        handleSectorTypeChange(sectorVal, prefix);
    }
}

function handleSectorTypeChange(sector, prefix = 'auth-reg-') {
    const publicField = document.getElementById(prefix === 'auth-reg-' ? 'field-public-level' : 'quiz-field-public-level');
    const privateField = document.getElementById(prefix === 'auth-reg-' ? 'field-private-vertical' : 'quiz-field-private-vertical');

    if (sector === 'publico') {
        if (publicField) publicField.classList.remove('hidden-field');
        if (privateField) privateField.classList.add('hidden-field');
        toggleRequiredFields(true, prefix + 'public-level');
        toggleRequiredFields(false, prefix + 'private-vertical');
    } else if (sector === 'privado') {
        if (publicField) publicField.classList.add('hidden-field');
        if (privateField) privateField.classList.remove('hidden-field');
        toggleRequiredFields(false, prefix + 'public-level');
        toggleRequiredFields(true, prefix + 'private-vertical');
    } else {
        if (publicField) publicField.classList.add('hidden-field');
        if (privateField) privateField.classList.add('hidden-field');
        toggleRequiredFields(false, prefix + 'public-level', prefix + 'private-vertical');
    }
}

function sendAuthVerificationEmail(name, company, email, target) {
    const randomPIN = Math.floor(100000 + Math.random() * 900000).toString();
    tempAuthData = tempAuthData || {};
    tempAuthData.verificationCode = randomPIN;
    tempAuthData.target = target;
    
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
                triggerAuthFallbackVerification(randomPIN, email, target, "Fallo al enviar el correo real (límite superado o claves incorrectas).");
            });
    } else {
        triggerAuthFallbackVerification("123456", email, target);
    }
}

function triggerAuthFallbackVerification(pin, email, target, reason = "") {
    currentVerificationCode = pin;
    tempAuthData = tempAuthData || {};
    tempAuthData.verificationCode = pin;
    tempAuthData.target = target;
    if (reason) {
        console.warn(`${reason} Activando simulación local de contingencia.`);
    }
    showToastOTP(pin);
}

function confirmAuthSuccess() {
    currentUser = tempAuthData.user;
    
    if (tempAuthData.isNew) {
        ageFriendAccounts.push(currentUser);
        localStorage.setItem('age_friend_accounts', JSON.stringify(ageFriendAccounts));
    } else {
        const idx = ageFriendAccounts.findIndex(acc => acc.email.toLowerCase() === currentUser.email.toLowerCase());
        if (idx !== -1) {
            ageFriendAccounts[idx] = currentUser;
            localStorage.setItem('age_friend_accounts', JSON.stringify(ageFriendAccounts));
        }
    }
    localStorage.setItem('age_friend_user', JSON.stringify(currentUser));
    isConfirmed = true;
    userRegistrationData = currentUser;

    updateAuthUI();

    const errorMsg = document.getElementById('auth-otp-error-msg');
    if (errorMsg) errorMsg.classList.add('hidden');
    
    const errorMsgQuiz = document.getElementById('otp-error-msg');
    if (errorMsgQuiz) errorMsgQuiz.classList.add('hidden');

    const toast = document.querySelector('.toast-notification');
    if (toast) toast.remove();

    if (tempAuthData.target === 'quiz') {
        hideVerificationView();
        calculateResults();
    } else {
        const authModal = document.getElementById('auth-modal');
        if (authModal) closeModal(authModal);
        
        const formLogin = document.getElementById('form-login');
        if (formLogin) formLogin.reset();
        const formRegister = document.getElementById('form-register');
        if (formRegister) formRegister.reset();
        
        const viewLogin = document.getElementById('view-login');
        const viewRegister = document.getElementById('view-register');
        const viewOtp = document.getElementById('view-otp');
        
        if (viewLogin) viewLogin.classList.remove('hidden');
        if (viewRegister) viewRegister.classList.add('hidden');
        if (viewOtp) viewOtp.classList.add('hidden');
        
        const tabLogin = document.getElementById('tab-login');
        const tabRegister = document.getElementById('tab-register');
        if (tabLogin) tabLogin.classList.add('active');
        if (tabRegister) tabRegister.classList.remove('active');

        alert(tempAuthData.isNew ? TRANSLATIONS[currentLang].authRegisterSuccess : TRANSLATIONS[currentLang].authLoginSuccess);
    }
}

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

async function downloadPitchDossier(lang, format = 'pdf') {
    const rawContent = lang === 'es' ? ES_DOSSIER_TEMPLATE : EN_DOSSIER_TEMPLATE;
    
    // Reemplazamos imágenes por emoji para evitar problemas CORS
    const safeContent = rawContent.replace(/<img[^>]*>/g, '<span style="font-size: 3rem; margin-right: 10px;">🏅</span>');
    
    if (format === 'pdf' && typeof html2pdf !== 'undefined') {
        // 1. Crear contenedor temporal - LO HACEMOS VISIBLE pero no interactivo
        //    usando opacity:0 en lugar de posicionarlo fuera de pantalla
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = safeContent;
        tempDiv.id = 'temp-pdf-container';
        tempDiv.style.cssText = `
            position: absolute;
            top: -9999px;
            left: 0;
            width: 1200px;
            opacity: 1;
            visibility: visible;
            pointer-events: none;
            z-index: 1;
            background-color: #ffffff;
            overflow: visible;
        `;
        
        document.body.appendChild(tempDiv);

        try {
            // 2. Esperar a que TODO esté listo para renderizar
            //    Fuentes web + layout + imágenes
            await document.fonts.ready;
            await new Promise(resolve => requestAnimationFrame(resolve));
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // Forzar reflow para asegurar que el navegador ha calculado todos los estilos
            void tempDiv.offsetHeight;

            const opt = {
                margin:       15,
                filename:     lang === 'es' ? 'Dossier_AgeFriendSeal.pdf' : 'Dossier_AgeFriendSeal_EN.pdf',
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { 
                    scale: 2,
                    useCORS: true,
                    allowTaint: false,
                    logging: false,
                    backgroundColor: '#ffffff',
                    windowWidth: 1200,
                    scrollX: 0,
                    scrollY: 0,
                    // Esta función se ejecuta en el documento clonado internamente
                    onclone: (clonedDoc) => {
                        const clonedEl = clonedDoc.getElementById('temp-pdf-container');
                        if (clonedEl) {
                            clonedEl.style.position = 'relative';
                            clonedEl.style.top = '0';
                            clonedEl.style.left = '0';
                            clonedEl.style.opacity = '1';
                            clonedEl.style.visibility = 'visible';
                            clonedEl.style.zIndex = '1';
                            clonedEl.style.overflow = 'visible';
                            clonedDoc.body.style.backgroundColor = '#ffffff';
                        }
                    }
                },
                jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
                pagebreak:    { mode: 'css', before: '.dossier-page-break' }
            };
            
            // 3. Generar el PDF desde el elemento
            await html2pdf().set(opt).from(tempDiv).save();
            
        } catch (err) {
            console.error("Error generando PDF:", err);
            // Fallback: si html2pdf falla, ofrecer impresión del navegador
            alert('Hubo un problema generando el PDF automático. Se abrirá la ventana de impresión.');
            window.print();
        } finally {
            // 4. SIEMPRE limpiar el DOM
            if (tempDiv.parentNode) {
                tempDiv.parentNode.removeChild(tempDiv);
            }
        }
        
    } else {
        // Flujo para descarga en HTML (sin cambios)
        const blob = new Blob([safeContent], { type: 'text/html;charset=utf-8' });
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
        .dossier-logo-img {
            width: 48px !important;
            height: 48px !important;
            border-radius: 50% !important;
            border: 2px solid #2563eb !important;
            object-fit: cover !important;
        }
        .dossier-logo-text {
            font-family: system-ui, sans-serif !important;
            font-weight: 800 !important;
            font-size: 2.2rem !important;
            color: #0f172a !important;
        }
        .dossier-logo-accent { color: #2563eb !important; }
        .dossier-h1 {
            font-family: system-ui, sans-serif !important;
            font-size: 2.5rem !important;
            font-weight: 800 !important;
            margin-bottom: 12px !important;
            color: #0f172a !important;
            letter-spacing: -0.02em !important;
        }
        .dossier-subtitle {
            font-size: 1.1rem !important;
            color: #2563eb !important;
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
        
        .dossier-section { margin-bottom: 48px !important; }
        .dossier-section-title {
            font-family: system-ui, sans-serif !important;
            font-size: 1.5rem !important;
            font-weight: 700 !important;
            color: #1e293b !important;
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
            margin-bottom: 12px !important;
            font-size: 1rem !important;
            display: list-item !important;
            list-style-type: none !important;
            position: relative !important;
        }
        .dossier-li::before {
            content: "▪" !important;
            color: #2563eb !important;
            position: absolute !important;
            left: -16px !important;
            font-weight: bold !important;
        }
        .dossier-highlight-box {
            background: #eff6ff !important;
            border-left: 4px solid #2563eb !important;
            padding: 24px !important;
            border-radius: 0 12px 12px 0 !important;
            margin: 24px 0 !important;
        }
        .dossier-highlight-box-p {
            margin-bottom: 0 !important;
            font-weight: 600 !important;
            color: #1e3a8a !important;
            display: block !important;
            font-size: 1.1rem !important;
        }
        
        /* Grid de Ejes */
        .ejes-grid {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 20px !important;
            margin-top: 24px !important;
        }
        .eje-card {
            background: #f8fafc !important;
            border: 1px solid #e2e8f0 !important;
            padding: 20px !important;
            border-radius: 12px !important;
        }
        .eje-card h4 {
            margin-top: 0 !important;
            margin-bottom: 8px !important;
            color: #0f172a !important;
            font-size: 1.1rem !important;
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
        }
        .eje-card p {
            margin: 0 !important;
            font-size: 0.9rem !important;
            color: #475569 !important;
        }
        .eje-norma {
            display: inline-block !important;
            font-size: 0.75rem !important;
            background: #e2e8f0 !important;
            padding: 2px 8px !important;
            border-radius: 4px !important;
            margin-top: 12px !important;
            font-weight: 600 !important;
            color: #475569 !important;
        }

        /* Grid de Certificaciones */
        .cert-grid {
            display: grid !important;
            grid-template-columns: 1fr 1fr 1fr !important;
            gap: 16px !important;
            margin-top: 24px !important;
        }
        .cert-card {
            background: #ffffff !important;
            border: 1px solid #cbd5e1 !important;
            padding: 24px 16px !important;
            border-radius: 12px !important;
            text-align: center !important;
            box-shadow: 0 4px 6px rgba(0,0,0,0.02) !important;
        }
        .cert-badge {
            display: inline-block !important;
            font-size: 0.75rem !important;
            font-weight: 800 !important;
            padding: 4px 12px !important;
            border-radius: 50px !important;
            margin-bottom: 16px !important;
            letter-spacing: 0.05em !important;
        }
        .badge-basic { background: #fef3c7 !important; color: #b45309 !important; }
        .badge-medium { background: #f1f5f9 !important; color: #475569 !important; }
        .badge-premium { background: #fef08a !important; color: #854d0e !important; }

        .dossier-cta-box {
            text-align: center !important;
            background: #0f172a !important;
            border-radius: 20px !important;
            padding: 40px 32px !important;
            margin-top: 48px !important;
        }
        .dossier-cta-box-h3 {
            font-family: system-ui, sans-serif !important;
            font-size: 1.5rem !important;
            margin-bottom: 12px !important;
            color: #ffffff !important;
            font-weight: 700 !important;
        }
        .dossier-cta-box-p {
            color: #94a3b8 !important;
            margin-bottom: 24px !important;
            display: block !important;
        }
        .dossier-contact-info {
            background: rgba(255,255,255,0.05) !important;
            border: 1px solid rgba(255,255,255,0.1) !important;
            border-radius: 12px !important;
            padding: 20px !important;
            max-width: 400px !important;
            margin: 0 auto 24px auto !important;
            text-align: left !important;
        }
        .dossier-cta-btn {
            display: inline-block !important;
            background: #2563eb !important;
            color: #ffffff !important;
            font-family: system-ui, sans-serif !important;
            font-weight: 700 !important;
            text-decoration: none !important;
            padding: 14px 36px !important;
            border-radius: 8px !important;
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
            background: #f1f5f9 !important;
            color: #475569 !important;
            font-weight: 600 !important;
            text-decoration: none !important;
            padding: 8px 20px !important;
            border-radius: 6px !important;
            border: 1px solid #cbd5e1 !important;
            cursor: pointer !important;
            margin-bottom: 16px !important;
            font-size: 0.9rem !important;
        }
        .dossier-page-break { page-break-before: always !important; }
        
        @media print {
            .dossier-container {
                max-width: 100% !important;
                margin: 0 !important;
                padding: 20px !important;
                border: none !important;
                box-shadow: none !important;
            }
            .dossier-cta-btn, .dossier-print-btn { display: none !important; }
            .ejes-grid { grid-template-columns: 1fr !important; }
            .cert-grid { grid-template-columns: 1fr !important; }
        }
    </style>

    <div class="dossier-container">
        <div class="dossier-header">
            <div class="dossier-logo-container">
                <img src="logo_age_friend_seal.png" alt="Age Friend Seal Logo" class="dossier-logo-img">
                <span class="dossier-logo-text"><span class="dossier-logo-accent">Age</span> Friend Seal</span>
            </div>
            <div class="dossier-h1">DOSSIER DE ALIANZAS Y CERTIFICACIÓN</div>
            <div class="dossier-subtitle">Propuesta Estratégica Corporativa e Institucional</div>
            <div class="dossier-meta-info">
                <div class="dossier-meta-item">Documento: <strong>Resumen Ejecutivo B2B</strong></div>
                <div class="dossier-meta-item">Fecha de emisión: <strong>Junio de 2026</strong></div>
                <div class="dossier-meta-item">Emisor: <strong>Age Friend Seal</strong></div>
            </div>
        </div>

        <div class="dossier-section">
            <div class="dossier-section-title"><span>📉</span> 1. El Tsunami Silencioso y el Retorno de Inversión</div>
            <div class="dossier-p">El mundo enfrenta un cambio demográfico sin precedentes históricos. Con la tasa global de fecundidad cayendo a 2.3 y el drástico aumento de la esperanza de vida, la Generación Plateada (mayores de 50 años) concentra hoy más del <strong>50% del poder adquisitivo global</strong>.</div>
            
            <div class="dossier-highlight-box">
                <div class="dossier-highlight-box-p">"La Economía Plateada ha dejado de ser una política de beneficencia para consolidarse como el motor definitivo de rentabilidad corporativa, reducción de costos y lealtad de mercado."</div>
            </div>
            
            <div class="dossier-p"><strong>Impacto Financiero Comprobado (ROI):</strong></div>
            <ul class="dossier-ul">
                <li class="dossier-li"><strong>Ahorro en Rotación (4%):</strong> Los empleados mayores de 50 años presentan una retención 3 veces superior frente a generaciones jóvenes, reduciendo drásticamente los costos de contratación y curva de aprendizaje.</li>
                <li class="dossier-li"><strong>Aumento de Productividad (1.1%):</strong> Estimaciones de la OCDE demuestran que por cada aumento del 10% en la plantilla senior, la productividad total de la empresa se eleva sostenidamente.</li>
                <li class="dossier-li"><strong>Ganancia en Innovación (19%):</strong> Los equipos intergeneracionales integran la frescura digital con la resiliencia y el pensamiento crítico, elevando la facturación derivada de la innovación.</li>
            </ul>
        </div>

        <div class="dossier-section">
            <div class="dossier-section-title"><span>🏛️</span> 2. Los 5 Fundamentos Globales del Sello</div>
            <div class="dossier-p">Age Friend Seal provee una normativa técnica propia y unificada que integra los mejores estándares mundiales para erradicar el edadismo y capitalizar la Economía Plateada.</div>
            
            <div class="ejes-grid">
                <div class="eje-card">
                    <h4><span>🌐</span> Eje Laboral y Talento</h4>
                    <p>Fomento de la empleabilidad sénior, currículum ciego y estructuración de mentorías inversas para retener el capital intelectual.</p>
                    <span class="eje-norma">ISO 25550 / OIT</span>
                </div>
                <div class="eje-card">
                    <h4><span>🤝</span> Eje Conciliación</h4>
                    <p>Soporte integral y flexibilidad asincrónica para empleados cuidadores de familiares dependientes (Generación Sándwich).</p>
                    <span class="eje-norma">ISO 25551 / OPS</span>
                </div>
                <div class="eje-card">
                    <h4><span>💻</span> Eje Mercado Digital</h4>
                    <p>Accesibilidad AgeTech, auditoría de sesgos en algoritmos (IA) y protocolos de rescate humano directo en plataformas.</p>
                    <span class="eje-norma">ISO 25556</span>
                </div>
                <div class="eje-card">
                    <h4><span>🏥</span> Salud y Entorno</h4>
                    <p>Adaptación de infraestructuras libres de barreras físicas y tamizaje de capacidades funcionales en el servicio al cliente.</p>
                    <span class="eje-norma">OMS (Age-Friendly)</span>
                </div>
                <div class="eje-card" style="grid-column: 1 / -1;">
                    <h4><span>⚖️</span> Tratado Internacional</h4>
                    <p>Políticas organizacionales que protegen la igualdad de trato, prohíben el despido por edadismo y fomentan esquemas de transición gradual.</p>
                    <span class="eje-norma">OIT Recomendación 162</span>
                </div>
            </div>
        </div>

        <div class="dossier-page-break"></div>

        <div class="dossier-section">
            <div class="dossier-section-title"><span>📈</span> 3. La Escalera de Certificación</div>
            <div class="dossier-p">Adaptamos el proceso a la madurez y presupuesto de cada organización mediante tres niveles progresivos:</div>
            
            <div class="cert-grid">
                <div class="cert-card">
                    <span class="cert-badge badge-basic">BÁSICO</span>
                    <h4 style="margin:0 0 8px 0; color:#0f172a; font-size:1.15rem;">Compromiso Inicial</h4>
                    <p style="margin:0; font-size:0.9rem; color:#475569;">Autodiagnóstico online con informe analítico de Quick Wins y distintivo de entrada.</p>
                </div>
                <div class="cert-card">
                    <span class="cert-badge badge-medium">MEDIO</span>
                    <h4 style="margin:0 0 8px 0; color:#0f172a; font-size:1.15rem;">Certificación Previa</h4>
                    <p style="margin:0; font-size:0.9rem; color:#475569;">Auditoría virtual, revisión de avances normativos y estructuración del plan de acción formal.</p>
                </div>
                <div class="cert-card">
                    <span class="cert-badge badge-premium">PREMIUM</span>
                    <h4 style="margin:0 0 8px 0; color:#0f172a; font-size:1.15rem;">Empresa Certificada</h4>
                    <p style="margin:0; font-size:0.9rem; color:#475569;">Auditoría física exhaustiva, Mystery Shopper Senior y validación total del Sello.</p>
                </div>
            </div>
        </div>

        <div class="dossier-section">
            <div class="dossier-section-title"><span>🚀</span> 4. Alianzas Estratégicas Disponibles</div>
            <ul class="dossier-ul">
                <li class="dossier-li"><strong>B2B & Empleadores:</strong> Certifique su marca empleadora, estructure equipos multigeneracionales y asegure su competitividad.</li>
                <li class="dossier-li"><strong>B2C & Retail:</strong> Adapte la usabilidad de sus canales de venta para eliminar fricciones y capturar la lealtad del público sénior.</li>
                <li class="dossier-li"><strong>Proveedores AgeTech:</strong> Integre sus soluciones de software o telemedicina a nuestro ecosistema de recommendations.</li>
                <li class="dossier-li"><strong>Sector Público:</strong> Colaboremos en el diseño de ciudades amigables y validación para subsidios de contratación.</li>
            </ul>
        </div>

        <div class="dossier-cta-box">
            <div class="dossier-cta-box-h3">Inicie el Camino Hacia la Certificación</div>
            <div class="dossier-cta-box-p">El autodiagnóstico es el primer paso. Agende una auditoría virtual y convierta la diversidad generacional en su mayor ventaja competitiva.</div>
            
            <div class="dossier-contact-info">
                <div style="color: #ffffff !important; font-weight: 700 !important; margin-bottom: 12px !important; font-size: 1.1rem !important;">📞 Contacto Directo:</div>
                <div style="color: #cbd5e1 !important; font-size: 1rem !important; margin-bottom: 8px !important;">✉️ <strong>Email:</strong> qdoblea@gmail.com</div>
                <div style="color: #cbd5e1 !important; font-size: 1rem !important;">🌐 <strong>Web:</strong> www.agefriendseal.com</div>
            </div>

            <a href="mailto:qdoblea@gmail.com" target="_blank" rel="noopener noreferrer" class="dossier-cta-btn">Escríbanos Ahora</a>
        </div>

        <div class="dossier-footer">
            <button onclick="window.print()" class="dossier-print-btn">🖨️ Imprimir / Guardar como PDF</button>
            <div class="dossier-p" style="margin-top: 12px; font-size: 0.85rem !important;">&copy; 2026 Instituto Certificador Age-Friendly Internacional. Todos los derechos reservados.</div>
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
        .dossier-logo-img {
            width: 48px !important;
            height: 48px !important;
            border-radius: 50% !important;
            border: 2px solid #2563eb !important;
            object-fit: cover !important;
        }
        .dossier-logo-text {
            font-family: system-ui, sans-serif !important;
            font-weight: 800 !important;
            font-size: 2.2rem !important;
            color: #0f172a !important;
        }
        .dossier-logo-accent { color: #2563eb !important; }
        .dossier-h1 {
            font-family: system-ui, sans-serif !important;
            font-size: 2.5rem !important;
            font-weight: 800 !important;
            margin-bottom: 12px !important;
            color: #0f172a !important;
            letter-spacing: -0.02em !important;
        }
        .dossier-subtitle {
            font-size: 1.1rem !important;
            color: #2563eb !important;
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
        
        .dossier-section { margin-bottom: 48px !important; }
        .dossier-section-title {
            font-family: system-ui, sans-serif !important;
            font-size: 1.5rem !important;
            font-weight: 700 !important;
            color: #1e293b !important;
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
            margin-bottom: 12px !important;
            font-size: 1rem !important;
            display: list-item !important;
            list-style-type: none !important;
            position: relative !important;
        }
        .dossier-li::before {
            content: "▪" !important;
            color: #2563eb !important;
            position: absolute !important;
            left: -16px !important;
            font-weight: bold !important;
        }
        .dossier-highlight-box {
            background: #eff6ff !important;
            border-left: 4px solid #2563eb !important;
            padding: 24px !important;
            border-radius: 0 12px 12px 0 !important;
            margin: 24px 0 !important;
        }
        .dossier-highlight-box-p {
            margin-bottom: 0 !important;
            font-weight: 600 !important;
            color: #1e3a8a !important;
            display: block !important;
            font-size: 1.1rem !important;
        }
        
        .ejes-grid {
            display: grid !important;
            grid-template-columns: 1fr 1fr !important;
            gap: 20px !important;
            margin-top: 24px !important;
        }
        .eje-card {
            background: #f8fafc !important;
            border: 1px solid #e2e8f0 !important;
            padding: 20px !important;
            border-radius: 12px !important;
        }
        .eje-card h4 {
            margin-top: 0 !important;
            margin-bottom: 8px !important;
            color: #0f172a !important;
            font-size: 1.1rem !important;
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
        }
        .eje-card p {
            margin: 0 !important;
            font-size: 0.9rem !important;
            color: #475569 !important;
        }
        .eje-norma {
            display: inline-block !important;
            font-size: 0.75rem !important;
            background: #e2e8f0 !important;
            padding: 2px 8px !important;
            border-radius: 4px !important;
            margin-top: 12px !important;
            font-weight: 600 !important;
            color: #475569 !important;
        }

        .cert-grid {
            display: grid !important;
            grid-template-columns: 1fr 1fr 1fr !important;
            gap: 16px !important;
            margin-top: 24px !important;
        }
        .cert-card {
            background: #ffffff !important;
            border: 1px solid #cbd5e1 !important;
            padding: 24px 16px !important;
            border-radius: 12px !important;
            text-align: center !important;
            box-shadow: 0 4px 6px rgba(0,0,0,0.02) !important;
        }
        .cert-badge {
            display: inline-block !important;
            font-size: 0.75rem !important;
            font-weight: 800 !important;
            padding: 4px 12px !important;
            border-radius: 50px !important;
            margin-bottom: 16px !important;
            letter-spacing: 0.05em !important;
        }
        .badge-basic { background: #fef3c7 !important; color: #b45309 !important; }
        .badge-medium { background: #f1f5f9 !important; color: #475569 !important; }
        .badge-premium { background: #fef08a !important; color: #854d0e !important; }

        .dossier-cta-box {
            text-align: center !important;
            background: #0f172a !important;
            border-radius: 20px !important;
            padding: 40px 32px !important;
            margin-top: 48px !important;
        }
        .dossier-cta-box-h3 {
            font-family: system-ui, sans-serif !important;
            font-size: 1.5rem !important;
            margin-bottom: 12px !important;
            color: #ffffff !important;
            font-weight: 700 !important;
        }
        .dossier-cta-box-p {
            color: #94a3b8 !important;
            margin-bottom: 24px !important;
            display: block !important;
        }
        .dossier-contact-info {
            background: rgba(255,255,255,0.05) !important;
            border: 1px solid rgba(255,255,255,0.1) !important;
            border-radius: 12px !important;
            padding: 20px !important;
            max-width: 400px !important;
            margin: 0 auto 24px auto !important;
            text-align: left !important;
        }
        .dossier-cta-btn {
            display: inline-block !important;
            background: #2563eb !important;
            color: #ffffff !important;
            font-family: system-ui, sans-serif !important;
            font-weight: 700 !important;
            text-decoration: none !important;
            padding: 14px 36px !important;
            border-radius: 8px !important;
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
            background: #f1f5f9 !important;
            color: #475569 !important;
            font-weight: 600 !important;
            text-decoration: none !important;
            padding: 8px 20px !important;
            border-radius: 6px !important;
            border: 1px solid #cbd5e1 !important;
            cursor: pointer !important;
            margin-bottom: 16px !important;
            font-size: 0.9rem !important;
        }
        .dossier-page-break { page-break-before: always !important; }
        
        @media print {
            .dossier-container {
                max-width: 100% !important;
                margin: 0 !important;
                padding: 20px !important;
                border: none !important;
                box-shadow: none !important;
            }
            .dossier-cta-btn, .dossier-print-btn { display: none !important; }
            .ejes-grid { grid-template-columns: 1fr !important; }
            .cert-grid { grid-template-columns: 1fr !important; }
        }
    </style>

    <div class="dossier-container">
        <div class="dossier-header">
            <div class="dossier-logo-container">
                <img src="logo_age_friend_seal.png" alt="Age Friend Seal Logo" class="dossier-logo-img">
                <span class="dossier-logo-text"><span class="dossier-logo-accent">Age</span> Friend Seal</span>
            </div>
            <div class="dossier-h1">CORPORATE ALLIANCE DOSSIER</div>
            <div class="dossier-subtitle">Strategic Proposal for Certification</div>
            <div class="dossier-meta-info">
                <div class="dossier-meta-item">Document: <strong>B2B Executive Summary</strong></div>
                <div class="dossier-meta-item">Date of Issue: <strong>June 2026</strong></div>
                <div class="dossier-meta-item">Issuer: <strong>Age Friend Seal</strong></div>
            </div>
        </div>

        <div class="dossier-section">
            <div class="dossier-section-title"><span>📉</span> 1. The Silent Tsunami & Return on Investment</div>
            <div class="dossier-p">The world is facing an unprecedented demographic shift. With the global fertility rate dropping to 2.3 and life expectancy rising drastically, the Silver Generation (over 50 years old) now holds more than <strong>50% of global purchasing power</strong>.</div>
            
            <div class="dossier-highlight-box">
                <div class="dossier-highlight-box-p">"The Silver Economy is no longer a welfare policy but the definitive engine for corporate profitability, cost reduction, and market loyalty."</div>
            </div>
            
            <div class="dossier-p"><strong>Proven Financial Impact (ROI):</strong></div>
            <ul class="dossier-ul">
                <li class="dossier-li"><strong>Turnover Savings (4%):</strong> Employees over 50 demonstrate a retention rate 3 times higher than younger generations, drastically reducing hiring costs.</li>
                <li class="dossier-li"><strong>Productivity Increase (1.1%):</strong> OECD estimates show that for every 10% increase in the senior workforce, total productivity rises steadily.</li>
                <li class="dossier-li"><strong>Innovation Gains (19%):</strong> Intergenerational teams integrate digital freshness with resilience, elevating revenue derived from innovation.</li>
            </ul>
        </div>

        <div class="dossier-section">
            <div class="dossier-section-title"><span>🏛️</span> 2. The 5 Global Foundations of the Seal</div>
            <div class="dossier-p">Age Friend Seal provides a unified, proprietary technical framework that integrates the world's best standards to eradicate ageism and capitalize on the Silver Economy.</div>
            
            <div class="ejes-grid">
                <div class="eje-card">
                    <h4><span>🌐</span> Talent & Workplace Axis</h4>
                    <p>Fostering senior employability, blind resumes, and structuring reverse mentoring to retain intellectual capital.</p>
                    <span class="eje-norma">ISO 25550 / ILO</span>
                </div>
                <div class="eje-card">
                    <h4><span>🤝</span> Support Axis</h4>
                    <p>Comprehensive support and asynchronous flexibility for employees caring for dependent relatives.</p>
                    <span class="eje-norma">ISO 25551 / PAHO</span>
                </div>
                <div class="eje-card">
                    <h4><span>💻</span> Digital Market Axis</h4>
                    <p>AgeTech accessibility, bias auditing in AI algorithms, and mandatory direct human escape protocols.</p>
                    <span class="eje-norma">ISO 25556</span>
                </div>
                <div class="eje-card">
                    <h4><span>🏥</span> Health & Environment</h4>
                    <p>Adapting physical infrastructure free of barriers and screening functional capacities.</p>
                    <span class="eje-norma">WHO (Age-Friendly)</span>
                </div>
                <div class="eje-card" style="grid-column: 1 / -1;">
                    <h4><span>⚖️</span> International Treaty</h4>
                    <p>Organizational policies protecting equal treatment, prohibiting ageist dismissal, and promoting gradual retirement schemes.</p>
                    <span class="eje-norma">ILO Recommendation 162</span>
                </div>
            </div>
        </div>

        <div class="dossier-page-break"></div>

        <div class="dossier-section">
            <div class="dossier-section-title"><span>📈</span> 3. The Certification Ladder</div>
            <div class="dossier-p">We adapt the process to the maturity and budget of each organization through three progressive levels:</div>
            
            <div class="cert-grid">
                <div class="cert-card">
                    <span class="cert-badge badge-basic">BASIC</span>
                    <h4 style="margin:0 0 8px 0; color:#0f172a; font-size:1.15rem;">Initial Commitment</h4>
                    <p style="margin:0; font-size:0.9rem; color:#475569;">Online self-diagnostic with a Quick Wins analytical report and entry-level badge.</p>
                </div>
                <div class="cert-card">
                    <span class="cert-badge badge-medium">MEDIUM</span>
                    <h4 style="margin:0 0 8px 0; color:#0f172a; font-size:1.15rem;">Prior Certification</h4>
                    <p style="margin:0; font-size:0.9rem; color:#475569;">Virtual audit, review of regulatory progress, and structuring of a formal action plan.</p>
                </div>
                <div class="cert-card">
                    <span class="cert-badge badge-premium">PREMIUM</span>
                    <h4 style="margin:0 0 8px 0; color:#0f172a; font-size:1.15rem;">Certified Company</h4>
                    <p style="margin:0; font-size:0.9rem; color:#475569;">Exhaustive physical audit, Senior Mystery Shopper, and full validation of the Seal.</p>
                </div>
            </div>
        </div>

        <div class="dossier-section">
            <div class="dossier-section-title"><span>🚀</span> 4. Strategic Alliances Available</div>
            <ul class="dossier-ul">
                <li class="dossier-li"><strong>B2B & Employers:</strong> Certify your employer brand, structure multigenerational teams, and ensure competitiveness.</li>
                <li class="dossier-li"><strong>B2C & Retail:</strong> Adapt the usability of your sales channels to capture loyalty from the senior demographic.</li>
                <li class="dossier-li"><strong>AgeTech Suppliers:</strong> Integrate your software or telemedicine solutions into our recommendation ecosystem.</li>
                <li class="dossier-li"><strong>Public Sector:</strong> Collaborate on designing age-friendly cities and validation for hiring subsidies.</li>
            </ul>
        </div>

        <div class="dossier-cta-box">
            <div class="dossier-cta-box-h3">Start Your Certification Journey</div>
            <div class="dossier-cta-box-p">The self-diagnostic is the first step. Schedule a virtual audit and turn generational diversity into your greatest competitive advantage.</div>
            
            <div class="dossier-contact-info">
                <div style="color: #ffffff !important; font-weight: 700 !important; margin-bottom: 12px !important; font-size: 1.1rem !important;">📞 Direct Contact:</div>
                <div style="color: #cbd5e1 !important; font-size: 1rem !important; margin-bottom: 8px !important;">✉️ <strong>Email:</strong> qdoblea@gmail.com</div>
                <div style="color: #cbd5e1 !important; font-size: 1rem !important;">🌐 <strong>Web:</strong> www.agefriendseal.com</div>
            </div>

            <a href="mailto:qdoblea@gmail.com" target="_blank" rel="noopener noreferrer" class="dossier-cta-btn">Contact Us Now</a>
        </div>

        <div class="dossier-footer">
            <button onclick="window.print()" class="dossier-print-btn">🖨️ Print / Save as PDF</button>
            <div class="dossier-p" style="margin-top: 12px; font-size: 0.85rem !important;">&copy; 2026 Age-Friendly International Certification Institute. All rights reserved.</div>
        </div>
    </div>
</div>`;;

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

// ==========================================================================
// Funciones Adicionales de Interactividad (Accesibilidad, ROI, Mobile, Accordion)
// ==========================================================================

function initAccessibilityWidget() {
    const toggleBtn = document.querySelector('.a11y-toggle');
    const panel = document.querySelector('.a11y-panel');
    const closeBtn = document.getElementById('a11y-close');
    const btnDecrease = document.getElementById('btn-text-decrease');
    const btnReset = document.getElementById('btn-text-reset');
    const btnIncrease = document.getElementById('btn-text-increase');
    const toggleContrast = document.getElementById('toggle-contrast');

    if (toggleBtn && panel) {
        toggleBtn.addEventListener('click', (e) => {
            e.preventDefault();
            panel.classList.toggle('hidden');
        });
    }

    if (closeBtn && panel) {
        closeBtn.addEventListener('click', () => {
            panel.classList.add('hidden');
        });
    }

    let currentFontSize = 100; // percent
    
    try {
        const savedContrast = localStorage.getItem('high-contrast');
        if (savedContrast === 'true') {
            if (toggleContrast) toggleContrast.checked = true;
            document.body.classList.add('high-contrast');
        }
        
        const savedFontSize = localStorage.getItem('font-size-percent');
        if (savedFontSize) {
            currentFontSize = parseInt(savedFontSize);
            document.documentElement.style.fontSize = currentFontSize + '%';
        }
    } catch (e) {
        console.error("Error loading a11y settings:", e);
    }

    if (btnIncrease) {
        btnIncrease.addEventListener('click', () => {
            currentFontSize += 10;
            if (currentFontSize > 150) currentFontSize = 150;
            document.documentElement.style.fontSize = currentFontSize + '%';
            localStorage.setItem('font-size-percent', currentFontSize);
        });
    }

    if (btnDecrease) {
        btnDecrease.addEventListener('click', () => {
            currentFontSize -= 10;
            if (currentFontSize < 80) currentFontSize = 80;
            document.documentElement.style.fontSize = currentFontSize + '%';
            localStorage.setItem('font-size-percent', currentFontSize);
        });
    }

    if (btnReset) {
        btnReset.addEventListener('click', () => {
            currentFontSize = 100;
            document.documentElement.style.fontSize = '100%';
            localStorage.setItem('font-size-percent', currentFontSize);
        });
    }

    if (toggleContrast) {
        toggleContrast.addEventListener('change', (e) => {
            if (e.target.checked) {
                document.body.classList.add('high-contrast');
                localStorage.setItem('high-contrast', 'true');
            } else {
                document.body.classList.remove('high-contrast');
                localStorage.setItem('high-contrast', 'false');
            }
        });
    }
}

function initROISimulator() {
    const inputEmployees = document.getElementById('roi-employees');
    const inputSalary = document.getElementById('roi-salary');
    const inputRevenue = document.getElementById('roi-revenue');

    if (!inputEmployees || !inputSalary || !inputRevenue) return;

    const valEmployees = document.getElementById('val-employees');
    const valSalary = document.getElementById('val-salary');
    const valRevenue = document.getElementById('val-revenue');

    const resTurnover = document.getElementById('res-turnover');
    const resProductivity = document.getElementById('res-productivity');
    const resTotal = document.getElementById('res-total');

    function formatCurrency(val) {
        return '$' + new Intl.NumberFormat('en-US').format(val);
    }

    function calculate() {
        const employees = parseInt(inputEmployees.value);
        const salary = parseInt(inputSalary.value);
        const revenue = parseInt(inputRevenue.value);

        if (valEmployees) valEmployees.textContent = new Intl.NumberFormat('en-US').format(employees);
        if (valSalary) valSalary.textContent = formatCurrency(salary);
        if (valRevenue) valRevenue.textContent = formatCurrency(revenue);

        const turnoverSavings = Math.round((employees * 0.04) * (salary * 0.5));
        const productivityGains = Math.round(revenue * 0.011);
        const totalImpact = turnoverSavings + productivityGains;

        if (resTurnover) resTurnover.textContent = '+' + formatCurrency(turnoverSavings);
        if (resProductivity) resProductivity.textContent = '+' + formatCurrency(productivityGains);
        if (resTotal) resTotal.textContent = '+' + formatCurrency(totalImpact);
    }

    inputEmployees.addEventListener('input', calculate);
    inputSalary.addEventListener('input', calculate);
    inputRevenue.addEventListener('input', calculate);

    calculate();
}

function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
        
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }
}

function initAccordion() {
    const accordions = document.querySelectorAll('.accordion-header');
    
    accordions.forEach(header => {
        header.addEventListener('click', function() {
            const currentItem = this.parentElement;
            const isActive = currentItem.classList.contains('active');
            
            document.querySelectorAll('.accordion-item').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
            });
            
            if (!isActive) {
                currentItem.classList.add('active');
                this.setAttribute('aria-expanded', 'true');
            }
        });
    });
}

// Inicializar todos los componentes interactivos adicionales al cargar
window.addEventListener('DOMContentLoaded', () => {
    init();
    initAccessibilityWidget();
    initROISimulator();
    initMobileMenu();
    initAccordion();
});
