import "./SelfDiagnosticSection.scss";
import { useMemo, useRef, useState, useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { questions as defaultQuestions } from "../../data/diagnostic.js";
import { QUESTIONS_BY_SECTOR } from "../../data/questionsBySector.js";
import { downloadTextFile } from "../../utils/downloads.js";
import { signUpUser, getQuestionsForClient } from "../../utils/firebaseHelpers.js";

const pilarNames = [
  { es: "Pilar 1: Eje Laboral", en: "Pillar 1: Labor Axis", pt: "Pilar 1: Eixo Trabalhista" },
  { es: "Pilar 2: Eje Conciliación", en: "Pillar 2: Work-Life Balance", pt: "Pilar 2: Eixo de Conciliação" },
  { es: "Pilar 3: Eje Consumidor", en: "Pillar 3: Consumer Axis", pt: "Pilar 3: Eixo do Consumidor" },
  { es: "Pilar 4: Eje Salud", en: "Pillar 4: Health Axis", pt: "Pilar 4: Eixo de Saúde" },
  { es: "Pilar 5: Eje Comunitario", en: "Pillar 5: Community Axis", pt: "Pilar 5: Eixo Comunitário" }
];

const getTranslation = (obj, lang) => {
  if (!obj) return "";
  if (typeof obj === "string") return obj;
  if (typeof obj === "object") {
    if (obj.$$typeof) return obj; // React element
    if (obj[lang]) return obj[lang];
    if (obj['es']) return obj['es'];
    if (obj['en']) return obj['en'];
    const keys = Object.keys(obj);
    for (const key of keys) {
      if (typeof obj[key] === 'string') return obj[key];
    }
  }
  return String(obj);
};

const mapSectorKey = (subsector) => {
  if (!subsector) return "Comercio y Distribución";
  const normalized = subsector.toLowerCase();
  if (normalized.includes("finanz")) return "Finanzas y Seguro";
  if (normalized.includes("salud") || normalized.includes("farmac")) return "Salud y Farmacia";
  if (normalized.includes("tecnolog") || normalized.includes("software")) return "Tecnologia e Software";
  if (normalized.includes("comercio") || normalized.includes("retail")) return "Comercio y Distribución";
  if (normalized.includes("manufactura") || normalized.includes("industria")) return "Manufactura e Industria";
  if (normalized.includes("educac")) return "Educación";
  if (normalized.includes("bienes") || normalized.includes("urbanismo") || normalized.includes("vivienda") || normalized.includes("living")) return "Bienes Raíces, Urbanismo y Vivienda (Senior Living)";
  if (normalized.includes("energia") || normalized.includes("agua") || normalized.includes("recursos")) return "Energía y Recursos Naturales";
  if (normalized.includes("ocio") || normalized.includes("entretenimiento") || normalized.includes("turismo")) return "Entretenimiento, Medios y Turismo";
  if (normalized.includes("público") || normalized.includes("publico")) return "PÚBLICO";
  return "Comercio y Distribución";
};

export const getAgeLimitForCountry = (country) => {
  if (!country) return 50; // default
  const normalized = country.toLowerCase();
  
  // EE.UU. (ADEA +40)
  if (normalized.includes("ee.uu") || normalized.includes("estados unidos") || normalized.includes("usa") || normalized.includes("united states")) {
    return 40;
  }
  // Latinoamérica (+60)
  const latamCountries = ["argentina", "chile", "uruguay", "brasil", "colombia", "méxico", "mexico", "ecuador", "peru", "perú", "venezuela", "bolivia", "paraguay", "costa rica", "panamá", "panama"];
  if (latamCountries.some(c => normalized.includes(c))) {
    return 60;
  }
  // España / Europa / default (+50)
  return 50;
};

export const localizeAgeInText = (textStr, country) => {
  if (!textStr) return "";
  const age = getAgeLimitForCountry(country);
  return textStr
    .replace(/\b50\b/g, age)
    .replace(/\bcinquenta\b/gi, age === 40 ? "cuarenta" : age === 60 ? "sesenta" : "cincuenta")
    .replace(/\bcinquenta\b/gi, age === 40 ? "quarenta" : age === 60 ? "sessenta" : "cincuenta") // Portuguese
    .replace(/\bfifty\b/gi, age === 40 ? "forty" : age === 60 ? "sixty" : "fifty"); // English
};

function SelfDiagnosticSection({ language, currentUser, onUserChange, onOpenPayment, onDiagnosticComplete }) {
  const intl = useIntl();
  const sectionRef = useRef(null);
  
  const [currentQuestions, setCurrentQuestions] = useState(defaultQuestions);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(Array(defaultQuestions.length).fill(null));
  const [showResults, setShowResults] = useState(false);
  const [registrationType, setRegistrationType] = useState('personal');
  const [sectorType, setSectorType] = useState('');
  const [registrationForm, setRegistrationForm] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    name: '',
    email: '',
    username: '',
    password: '',
    country: '',
    publicLevel: '',
    privateVertical: '',
    role: '',
    website: '',
    companySize: ''
  });

  useEffect(() => {
    const loadQuestions = async () => {
      let qList = [];
      const userSector = currentUser?.sector || sectorType;
      const userSubsector = currentUser?.subsector || (registrationForm.privateVertical || registrationForm.publicLevel);
      
      if (userSector) {
        const isPub = userSector === 'publico' || userSector === 'public';
        const sectorVal = isPub ? 'public' : 'private';
        const verticalVal = isPub ? 'PÚBLICO' : mapSectorKey(userSubsector);
        qList = await getQuestionsForClient(sectorVal, verticalVal);
      } else {
        qList = await getQuestionsForClient('both', 'All');
      }

      // Convertir formato base de datos al formato { es, en, pt } para mantener compatibilidad
      const mappedList = qList.map(q => ({
        id: q.id,
        pilar: q.pilar,
        text: { es: q.text_es, en: q.text_en, pt: q.text_pt },
        options: (q.options || []).map(o => ({
          score: o.score,
          text: { es: o.text_es, en: o.text_en, pt: o.text_pt }
        })),
        recommendation: { es: q.recommendation_es, en: q.recommendation_en, pt: q.recommendation_pt }
      }));

      if (mappedList.length > 0) {
        setCurrentQuestions(mappedList);
        setAnswers(Array(mappedList.length).fill(null));
        setStep(0);
        setShowResults(false);
      }
    };
    loadQuestions();
  }, [currentUser, sectorType, registrationForm.privateVertical, registrationForm.publicLevel]);

  const question = currentQuestions[step];
  const progress = ((step + 1) / currentQuestions.length) * 100;

  const results = useMemo(() => calculateResults(answers, language, currentQuestions, currentUser?.country || registrationForm.country), [answers, language, currentQuestions, currentUser?.country, registrationForm.country]);

  useEffect(() => {
    if (showResults && onDiagnosticComplete) {
      onDiagnosticComplete({
        respuestas: currentQuestions.map((item, index) => {
          const scoreVal = answers[index]?.score ?? 0;
          let rec = "";
          if (scoreVal === 3) {
            rec = language === 'es' 
              ? "Práctica en nivel de excelencia. Mantener el estándar." 
              : language === 'pt'
                ? "Prática em nível de excelência. Manter o padrão."
                : "Excellence level practice. Maintain the standard.";
          } else {
            const bestOption = item.options ? item.options.find(o => o.score === 3) : null;
            const bestOptionText = bestOption ? getTranslation(bestOption.text, language) : '';
            if (bestOptionText) {
              rec = language === 'es'
                ? `Mejora recomendada: Implementar "${bestOptionText}"`
                : language === 'pt'
                  ? `Melhoria recomendada: Implementar "${bestOptionText}"`
                  : `Recommended improvement: Implement "${bestOptionText}"`;
            } else {
              rec = getTranslation(item.recommendation, language) || "N/A";
            }
          }
          return {
            pilar: Math.min(5, Math.floor(index / 3) + 1),
            pregunta: item.question || getTranslation(item.text, language),
            opcion_seleccionada: getTranslation(answers[index]?.text, language),
            puntuacion: scoreVal,
            recomendacion: rec
          };
        }),
        score: results.globalPercent,
        scores: {
          pilar1: results.pillarPercents[0] || 0,
          pilar2: results.pillarPercents[1] || 0,
          pilar3: results.pillarPercents[2] || 0,
          pilar4: results.pillarPercents[3] || 0,
          pilar5: results.pillarPercents[4] || 0
        },
        criticalPillar: results.criticalPillar
      });
    }
  }, [showResults, answers, results.globalPercent, results.pillarPercents, results.criticalPillar, currentQuestions, language]);

  const selectOption = (option) => {
    setAnswers((current) => {
      const next = [...current];
      next[step] = option;
      return next;
    });
  };

  const goNext = () => {
    if (!answers[step]) return;
    if (step === currentQuestions.length - 1) {
      setShowResults(true);
      requestAnimationFrame(() => sectionRef.current?.scrollIntoView({ behavior: 'smooth' }));
    } else {
      setStep((value) => value + 1);
    }
  };

  const restart = () => {
    setStep(0);
    setAnswers(Array(currentQuestions.length).fill(null));
    setShowResults(false);
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    const sector = sectorType || '';
    const subsector = sector === 'publico' ? 'PÚBLICO' : registrationForm.privateVertical;
    
    // Website Validation
    // Website Validation
    const website = registrationForm.website || '';
    const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;
    if (!urlPattern.test(website)) {
      alert(language === 'es' 
        ? 'Por favor, ingrese una dirección web válida (ej. miempresa.com o https://miempresa.com).' 
        : language === 'pt'
          ? 'Por favor, insira um endereço web válido (ex. minhaempresa.com).'
          : 'Please enter a valid website address (e.g. mycompany.com or https://mycompany.com).');
      return;
    }

    try {
      const fullName = `${registrationForm.firstName || ''} ${registrationForm.lastName || ''}`.trim() || registrationForm.name || 'Usuario';
      const profileData = {
        type: registrationType,
        firstName: registrationForm.firstName,
        lastName: registrationForm.lastName,
        companyName: registrationForm.companyName || registrationForm.name || '',
        name: fullName,
        email: registrationForm.email,
        username: registrationForm.username || registrationForm.email.split('@')[0],
        country: registrationForm.country,
        sector,
        subsector: subsector || '',
        role: registrationForm.role || '',
        website: registrationForm.website || '',
        companySize: registrationForm.companySize || ''
      };
      
      const user = await signUpUser(registrationForm.email, registrationForm.password, profileData);
      onUserChange(user);
      alert(language === 'es' ? '¡Cuenta creada exitosamente!' : (language === 'pt' ? 'Conta criada com sucesso!' : 'Account created successfully!'));
    } catch (error) {
      console.error("Registration error:", error);
      alert(language === 'es' 
        ? `Error al crear la cuenta: ${error.message}` 
        : `Error creating account: ${error.message}`);
    }
  };

  const updateRegistrationField = (field, value) => {
    setRegistrationForm((current) => ({ ...current, [field]: value }));
  };

  const downloadCsv = () => {
    const rows = [
      ['Question', 'Score', 'Recommendation'],
      ...currentQuestions.map((item, index) => [
        `"${(item.question || getTranslation(item.text, language)).replace(/"/g, '""')}"`,
        answers[index]?.score ?? '',
        `""`
      ])
    ];
    rows.push(['Global score', `${results.globalPercent}%`, '']);
    downloadTextFile(rows.map((row) => row.join(',')).join('\n'), 'AgeFriendSeal_ActionPlan.csv', 'text/csv;charset=utf-8');
  };

  return (
    <section id="autodiagnostico" className="diagnostico-section" ref={sectionRef}>
      <div className="container container-narrow">
        <div className="section-title text-center">
          <h2><FormattedMessage id="SelfDiagnosticSection.001" /></h2>
          <p className="subtitle"><FormattedMessage id="SelfDiagnosticSection.002" /></p>
        </div>

        {!showResults && (
          <div className="glass-card quiz-container" id="quiz-card">
            {currentUser && currentUser.type === 'empresa' && (
              <div id="quiz-sector-header" className="text-center" style={{marginBottom: '25px', fontWeight: 600, fontSize: '1.1rem', background: 'rgba(59, 130, 246, 0.1)', padding: '10px 20px', borderRadius: '8px', border: '1px solid rgba(59, 130, 246, 0.2)'}}>
                <span style={{color: 'var(--accent-color)'}}>{language === 'es' ? 'Sector de la Economía:' : language === 'pt' ? 'Setor da Economia:' : 'Economic Sector:'}</span> {currentUser.sector === 'privado' ? (language === 'es' || language === 'pt' ? 'Privado' : 'Private') : (language === 'es' || language === 'pt' ? 'Público' : 'Public')} <span style={{margin: '0 10px', color: 'var(--border-color)'}}>|</span> <span style={{color: 'var(--accent-color)'}}>{language === 'es' ? 'Vertical de negocio:' : language === 'pt' ? 'Vertical de negócios:' : 'Business Vertical:'}</span> {currentUser.subsector || 'N/A'}
              </div>
            )}
            <div className="stepper-header-title">
              <FormattedMessage id="SelfDiagnosticSection.pillars" defaultMessage="PILARES" />
            </div>
            <div className="wizard-progress-stepper">
              <div className="stepper-track-bar">
                <div 
                  className="stepper-track-fill" 
                  style={{ width: `${Math.min(100, (Math.floor(step / 3) / 4) * 100)}%` }} 
                />
              </div>
              {pilarNames.map((pilar, idx) => {
                const currentPilarIndex = Math.min(4, Math.floor(step / 3));
                const isCompleted = currentPilarIndex > idx;
                const isActive = currentPilarIndex === idx;
                return (
                  <div key={idx} className={`stepper-node ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
                    <div className="step-circle">{idx + 1}</div>
                    <span className="step-label">{getTranslation(pilar, language).replace(/^Pilar \d+: /, '')}</span>
                  </div>
                );
              })}
            </div>
            
            <div className="quiz-progress-subinfo text-center" style={{ marginBottom: '24px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              {language === 'es' 
                ? `Pregunta ${step + 1} de ${currentQuestions.length} (Progreso del pilar: ${Math.floor(step % 3) + 1}/3)` 
                : language === 'pt'
                  ? `Pergunta ${step + 1} de ${currentQuestions.length} (Progresso do pilar: ${Math.floor(step % 3) + 1}/3)`
                  : `Question ${step + 1} of ${currentQuestions.length} (Pillar progress: ${Math.floor(step % 3) + 1}/3)`}
            </div>

            <div className="quiz-question-box" id="question-box">
              <h3 id="question-title">{localizeAgeInText(question.question ? question.question : getTranslation(question.text, language), currentUser?.country || registrationForm.country)}</h3>
              <div className="quiz-options" id="quiz-options">
                {question.options.map((option) => {
                  const optionText = localizeAgeInText(getTranslation(option.text, language), currentUser?.country || registrationForm.country);
                  const selected = answers[step] === option;
                  return (
                    <button
                      type="button"
                      className={`option-card ${selected ? 'selected' : ''}`}
                      key={optionText}
                      onClick={() => selectOption(option)}
                      style={{ display: 'flex', alignItems: 'center', textAlign: 'left', gap: '15px' }}
                    >
                      <div style={{
                        minWidth: '20px', height: '20px', borderRadius: '50%', 
                        border: selected ? '6px solid var(--accent-color)' : '2px solid var(--border-color)', 
                        transition: 'all 0.2s', backgroundColor: selected ? 'var(--background-color)' : 'transparent'
                      }}></div>
                      <span>{optionText}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {!currentUser && step === 0 && answers[0] !== null && (
              <div className="quiz-register-container" id="quiz-register-view">
                <div className="register-header text-center">
                  <span className="register-badge"><FormattedMessage id="SelfDiagnosticSection.006" /></span>
                  <h3><FormattedMessage id="SelfDiagnosticSection.007" /></h3>
                  <p><FormattedMessage id="SelfDiagnosticSection.008" /></p>
                </div>
                <form id="quiz-register-form" className="register-form" onSubmit={handleRegister} autoComplete="off">
                  <div className="form-group">
                    <label htmlFor="quiz-reg-user-type"><FormattedMessage id="SelfDiagnosticSection.009" /></label>
                    <select id="quiz-reg-user-type" name="type" required value={registrationType} onChange={(event) => setRegistrationType(event.target.value)}>
                      <option value="personal"><FormattedMessage id="SelfDiagnosticSection.010" /></option>
                      <option value="empresa"><FormattedMessage id="SelfDiagnosticSection.011" /></option>
                    </select>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="quiz-reg-firstname"><FormattedMessage id="SelfDiagnosticSection.012" /></label>
                      <input
                        type="text"
                        id="quiz-reg-firstname"
                        name="quiz-demo-firstname"
                        required
                        autoComplete="off"
                        value={registrationForm.firstName}
                        onChange={(event) => updateRegistrationField('firstName', event.target.value)}
                        placeholder={intl.formatMessage({ id: "SelfDiagnosticSection.013" })}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="quiz-reg-lastname"><FormattedMessage id="SelfDiagnosticSection.012a" /></label>
                      <input
                        type="text"
                        id="quiz-reg-lastname"
                        name="quiz-demo-lastname"
                        required
                        autoComplete="off"
                        value={registrationForm.lastName}
                        onChange={(event) => updateRegistrationField('lastName', event.target.value)}
                        placeholder={intl.formatMessage({ id: "SelfDiagnosticSection.013a" })}
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="quiz-reg-companyname"><FormattedMessage id="SelfDiagnosticSection.012b" /></label>
                      <input
                        type="text"
                        id="quiz-reg-companyname"
                        name="quiz-demo-companyname"
                        required
                        autoComplete="off"
                        value={registrationForm.companyName}
                        onChange={(event) => updateRegistrationField('companyName', event.target.value)}
                        placeholder={intl.formatMessage({ id: "SelfDiagnosticSection.013b" })}
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="quiz-reg-website">
                        {language === 'es' ? 'Sitio Web de la Empresa *' : language === 'pt' ? 'Site da Empresa *' : 'Company Website *'}
                      </label>
                      <input
                        type="text"
                        id="quiz-reg-website"
                        name="quiz-demo-website"
                        required
                        autoComplete="off"
                        value={registrationForm.website || ''}
                        onChange={(event) => updateRegistrationField('website', event.target.value)}
                        placeholder="ej. https://miempresa.com"
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="quiz-reg-country"><FormattedMessage id="SelfDiagnosticSection.020" /></label>
                      <select
                        id="quiz-reg-country"
                        name="quiz-demo-country"
                        required
                        value={registrationForm.country}
                        onChange={(event) => updateRegistrationField('country', event.target.value)}
                      >
                        <option value="" disabled><FormattedMessage id="SelfDiagnosticSection.021" /></option>
                        <option value="España">España</option>
                        <option value="Argentina">Argentina</option>
                        <option value="Chile">Chile</option>
                        <option value="Uruguay">Uruguay</option>
                        <option value="Brasil">Brasil</option>
                        <option value="Colombia">Colombia</option>
                        <option value="México">México</option>
                        <option value="Ecuador">Ecuador</option>
                        <option value="Australia">Australia</option>
                        <option value="Resto de Europa">Resto de Europa</option>
                        <option value="Otros">Otros</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="quiz-reg-email"><FormattedMessage id="SelfDiagnosticSection.014" /></label>
                      <input
                        type="email"
                        id="quiz-reg-email"
                        name="quiz-demo-email"
                        required
                        autoComplete="off"
                        value={registrationForm.email}
                        onChange={(event) => updateRegistrationField('email', event.target.value)}
                        placeholder={intl.formatMessage({ id: "SelfDiagnosticSection.015" })}
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group" style={{ flex: '0 0 calc(50% - 10px)' }}>
                      <label htmlFor="quiz-reg-password"><FormattedMessage id="SelfDiagnosticSection.018" /></label>
                      <input
                        type="password"
                        id="quiz-reg-password"
                        name="quiz-demo-passcode"
                        required
                        minLength={6}
                        autoComplete="new-password"
                        value={registrationForm.password}
                        onChange={(event) => updateRegistrationField('password', event.target.value)}
                        placeholder={intl.formatMessage({ id: "SelfDiagnosticSection.019" })}
                      />
                    </div>
                  </div>
                  {registrationType === 'empresa' && (
                    <>
                      <div className="form-group" id="quiz-field-company-size">
                        <label htmlFor="quiz-reg-company-size">
                          {language === 'es' ? 'Tamaño de la Empresa *' : language === 'pt' ? 'Tamanho da Empresa *' : 'Company Size *'}
                        </label>
                        <select
                          id="quiz-reg-company-size"
                          required
                          value={registrationForm.companySize || ''}
                          onChange={(event) => updateRegistrationField('companySize', event.target.value)}
                        >
                          <option value="">{language === 'es' ? 'Seleccionar tamaño...' : language === 'pt' ? 'Selecionar tamanho...' : 'Select size...'}</option>
                          <option value="Micro (1-9 empleados)">Micro (1-9 empleados)</option>
                          <option value="Pequeña (10-49 empleados)">Pequeña (10-49 empleados)</option>
                          <option value="Mediana (50-249 empleados)">Mediana (50-249 empleados)</option>
                          <option value="Grande (250+ empleados)">Grande (250+ empleados)</option>
                        </select>
                      </div>
                      <div className="form-group" id="quiz-field-company-sector">
                        <label htmlFor="quiz-reg-sector-type"><FormattedMessage id="SelfDiagnosticSection.022" /></label>
                        <select id="quiz-reg-sector-type" name="sectorType" value={sectorType} onChange={(event) => setSectorType(event.target.value)} required>
                          <option value=""><FormattedMessage id="SelfDiagnosticSection.023" /></option>
                          <option value="privado"><FormattedMessage id="SelfDiagnosticSection.024" /></option>
                          <option value="publico"><FormattedMessage id="SelfDiagnosticSection.025" /></option>
                        </select>
                      </div>
                      {sectorType === 'publico' && (
                        <div className="form-group" id="quiz-field-public-level">
                          <label htmlFor="quiz-reg-public-level">
                            {language === 'es' ? 'Vertical de negocio' : language === 'pt' ? 'Vertical de negócios' : 'Business Vertical'}
                          </label>
                          <select
                            id="quiz-reg-public-level"
                            name="publicLevel"
                            required
                            value={registrationForm.publicLevel || 'PÚBLICO'}
                            onChange={(event) => updateRegistrationField('publicLevel', event.target.value)}
                          >
                            <option value="PÚBLICO">
                              {language === 'es' || language === 'pt'
                                ? "Relacionado con el desarrollo de 'Ciudades Amigables con las Personas Mayores', la creación de Sistemas Nacionales de Cuidados y la inclusión digital ciudadana (e-Government)"
                                : "Related to the development of 'Age-Friendly Cities', the creation of National Care Systems, and citizen digital inclusion (e-Government)"}
                            </option>
                          </select>
                        </div>
                      )}
                      {sectorType === 'privado' && (
                        <div className="form-group" id="quiz-field-private-vertical">
                          <label htmlFor="quiz-reg-private-vertical">
                            {language === 'es' ? 'Vertical de negocio' : language === 'pt' ? 'Vertical de negócios' : 'Business Vertical'}
                          </label>
                          <select
                            id="quiz-reg-private-vertical"
                            name="privateVertical"
                            required
                            value={registrationForm.privateVertical}
                            onChange={(event) => updateRegistrationField('privateVertical', event.target.value)}
                          >
                            <option value="">
                              {language === 'es' ? 'Seleccionar vertical...' : language === 'pt' ? 'Selecionar vertical...' : 'Select vertical...'}
                            </option>
                            <option value="Finanzas y Seguro">
                              {language === 'es' ? 'Finanzas y Seguros' : language === 'pt' ? 'Finanças e Seguros' : 'Finance and Insurance'}
                            </option>
                            <option value="Salud y Farmacia">
                              {language === 'es' ? 'Salud, Farmacia y Sociosanitario' : language === 'pt' ? 'Saúde, Farmácia e Sociossanitário' : 'Health, Pharmacy, and Social Care'}
                            </option>
                            <option value="Tecnologia e Software">
                              {language === 'es' ? 'Tecnología y Software (AgeTech)' : language === 'pt' ? 'Tecnologia e Software (AgeTech)' : 'Technology and Software (AgeTech)'}
                            </option>
                            <option value="Comercio y Distribución">
                              {language === 'es' ? 'Comercio y Distribución (Retail)' : language === 'pt' ? 'Comércio e Distribuição (Retail)' : 'Retail and Distribution'}
                            </option>
                            <option value="Manufactura e Industria">
                              {language === 'es' ? 'Manufactura e Industria' : language === 'pt' ? 'Manufatura e Indústria' : 'Manufacturing and Industry'}
                            </option>
                            <option value="Educación">
                              {language === 'es' ? 'Educación y Formación Continua' : language === 'pt' ? 'Educação e Formação Contínua' : 'Education and Continuing Education'}
                            </option>
                            <option value="Bienes Raíces, Urbanismo y Vivienda (Senior Living)">
                              {language === 'es' ? 'Bienes Raíces, Urbanismo y Vivienda (Senior Living)' : language === 'pt' ? 'Bens Raízes, Urbanismo e Habitação (Senior Living)' : 'Real Estate, Urbanism, and Housing (Senior Living)'}
                            </option>
                            <option value="Energía y Recursos Naturales">
                              {language === 'es' ? 'Energía, Agua y Servicios Básicos' : language === 'pt' ? 'Energia, Água e Serviços Básicos' : 'Energy, Water, and Basic Services'}
                            </option>
                            <option value="Entretenimiento, Medios y Turismo">
                              {language === 'es' ? 'Ocio, Entretenimiento, Medios y Turismo Silver' : language === 'pt' ? 'Lazer, Entretenimento, Mídia e Turismo Silver' : 'Leisure, Entertainment, Media, and Silver Tourism'}
                            </option>
                          </select>
                        </div>
                      )}
                      <div className="form-group" id="quiz-field-company-role">
                        <label htmlFor="quiz-reg-role"><FormattedMessage id="SelfDiagnosticSection.042" /></label>
                        <input
                          type="text"
                          id="quiz-reg-role"
                          name="quiz-demo-role"
                          autoComplete="off"
                          value={registrationForm.role}
                          onChange={(event) => updateRegistrationField('role', event.target.value)}
                          placeholder={intl.formatMessage({ id: "SelfDiagnosticSection.043" })}
                        />
                      </div>
                    </>
                  )}
                  <button type="submit" className="btn btn-gradient btn-block"><FormattedMessage id="SelfDiagnosticSection.044" /></button>
                </form>
              </div>
            )}

            <div className="quiz-controls" id="quiz-controls">
              <button className="btn btn-outline" id="btn-quiz-prev" disabled={step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))}>
                <FormattedMessage id="SelfDiagnosticSection.045" />
              </button>
              <button className="btn btn-primary" id="btn-quiz-next" disabled={!answers[step] || (step === 0 && !currentUser)} onClick={goNext}>
                {step === currentQuestions.length - 1 
                  ? (language === 'es' || language === 'pt' ? 'Finalizar' : 'Finish') 
                  : <FormattedMessage id="SelfDiagnosticSection.046" />}
              </button>
            </div>
          </div>
        )}

        {showResults && (
          <div className="glass-card results-container" id="results-card">
            <div className="results-header text-center">
              <div className="results-badge"><FormattedMessage id="SelfDiagnosticSection.047" /></div>
              <h2>{language === 'es' ? 'Analisis de Amigabilidad' : (language === 'pt' ? 'Análise de Amigabilidade' : 'Friendliness Analysis')}</h2>
              <div className="score-circle-container">
                <svg className="score-ring" width={160} height={160}>
                  <circle className="score-ring-bg" stroke="#1e293b" strokeWidth={12} fill="transparent" r={70} cx={80} cy={80} />
                  <circle className="score-ring-fill" id="score-fill" stroke="url(#silver-gold-gradient)" strokeWidth={12} strokeLinecap="round" fill="transparent" r={70} cx={80} cy={80} strokeDasharray={440} strokeDashoffset={440 - (440 * results.globalPercent) / 100} />
                  <defs>
                    <linearGradient id="silver-gold-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#94a3b8" />
                      <stop offset="100%" stopColor="#fbbf24" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="score-text">
                  <span id="score-percentage">{results.globalPercent}%</span>
                  <span className="score-label"><FormattedMessage id="SelfDiagnosticSection.050" /></span>
                </div>
              </div>
              <h3 id="results-status-title" className="results-status">{results.statusTitle}</h3>
              <p id="results-status-desc" className="results-desc">{results.statusDesc}</p>
            </div>

            <div className="pillar-charts">
              <h4><FormattedMessage id="SelfDiagnosticSection.053" /></h4>
              {results.pillarPercents.map((percent, index) => (
                <div className="pillar-row" key={index}>
                  <div className="pillar-label">
                    <span>{getTranslation(pilarNames[index], language)}</span>
                    <span>{percent}%</span>
                  </div>
                  <div className="pillar-bar-track">
                    <div className={`pillar-bar-fill fill-p${index + 1}`} style={{ width: `${percent}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="recommendations-box">
              <h4><FormattedMessage id="SelfDiagnosticSection.060" /></h4>
              <ul className="rec-list" id="recommendations-list">
                {results.recommendations.map((recommendation) => (
                  <li key={recommendation}>{recommendation}</li>
                ))}
              </ul>
            </div>

            <div className="results-actions">
              <button className="btn btn-gradient btn-lg btn-block" id="btn-claim-sello" onClick={onOpenPayment}>
                <FormattedMessage id="SelfDiagnosticSection.061" />
              </button>
              <div className="results-sub-actions">
                <button className="btn btn-outline" id="btn-download-excel" onClick={downloadCsv}><FormattedMessage id="SelfDiagnosticSection.062" /></button>
                <button className="btn btn-outline" id="btn-restart-quiz" onClick={restart}><FormattedMessage id="SelfDiagnosticSection.063" /></button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function calculateResults(answers, language, currentQuestions, country) {
  const safeAnswers = answers.map((answer) => answer || { score: 0 });
  const isOldGeneric = currentQuestions === defaultQuestions;

  // Determinar pesos según el geofencing del país
  const normalizedCountry = (country || "").toLowerCase();
  const isEurope = normalizedCountry.includes("españa") || normalizedCountry.includes("europa") || normalizedCountry.includes("spain");
  const isUSA = normalizedCountry.includes("usa") || normalizedCountry.includes("ee.uu") || normalizedCountry.includes("estados unidos") || normalizedCountry.includes("united states");

  let totalWeightedScore = 0;
  let maxWeightedScore = 0;

  const pillarScores = [0, 0, 0, 0, 0];
  const pillarCounts = [0, 0, 0, 0, 0];

  safeAnswers.forEach((answer, index) => {
    const question = currentQuestions[index];
    if (!question) return;

    // Obtener índice de pilar del cuestionario (0 a 4)
    const pilarIndex = Math.min(4, Math.floor(index / 3));

    // Ponderación según la regulación de cada país
    let weight = 1.0;
    if (isEurope && (pilarIndex === 0 || pilarIndex === 3)) {
      weight = 1.2; // +20% de peso a accesibilidad física y ergonomía/salud en Europa/España
    } else if (isUSA && (pilarIndex === 0 || pilarIndex === 4)) {
      weight = 1.2; // +20% de peso a inclusión laboral en EE.UU. (ADEA)
    }

    const questionMaxScore = isOldGeneric ? 100 : 3;

    totalWeightedScore += answer.score * weight;
    maxWeightedScore += questionMaxScore * weight;

    pillarScores[pilarIndex] += answer.score * weight;
    pillarCounts[pilarIndex] += questionMaxScore * weight;
  });

  const globalPercent = maxWeightedScore > 0 ? Math.round((totalWeightedScore / maxWeightedScore) * 100) : 0;

  const pillarPercents = pillarScores.map((score, idx) => {
    const maxPillarScore = pillarCounts[idx] || (isOldGeneric ? 3 * 100 : 3 * 3);
    return maxPillarScore > 0 ? Math.round((score / maxPillarScore) * 100) : 0;
  });

  // Determine critical pillar (lowest percentage score)
  const pillarNamesList = ["Eje Laboral", "Eje Conciliación", "Eje Consumidor", "Eje Salud", "Eje Comunitario"];
  let minScore = 101;
  let minIndex = 0;
  pillarPercents.forEach((pct, idx) => {
    if (pct < minScore) {
      minScore = pct;
      minIndex = idx;
    }
  });
  const criticalPillar = pillarNamesList[minIndex];

  const recommendations = currentQuestions
    .filter((item, index) => isOldGeneric ? ((answers[index]?.score ?? 0) < 100) : ((answers[index]?.score ?? 0) < 3))
    .slice(0, 6)
    .map((item) => {
      if (isOldGeneric) return getTranslation(item.recommendation, language);
      const bestOption = item.options ? item.options.find(o => o.score === 3) : null;
      const bestOptionText = bestOption ? getTranslation(bestOption.text, language) : '';
      if (!bestOptionText) return '';
      if (language === 'es') return `Mejora recomendada: Implementar "${bestOptionText}"`;
      if (language === 'pt') return `Melhoria recomendada: Implementar "${bestOptionText}"`;
      return `Recommended improvement: Implement "${bestOptionText}"`;
    });

  const copy = {
    es: {
      basic: ["Camino Iniciado", "Tu organización ya tiene una base para avanzar hacia la certificación total."],
      medium: ["Certificación Condicional", "Hay avances significativos y algunas brechas concretas por cerrar."],
      premium: ["Empresa Certificada", "Excelente desempeño. La organización cumple con el estándar esperado."]
    },
    en: {
      basic: ["Path Started", "Your organization has a base to advance toward full certification."],
      medium: ["Conditional Certification", "There is meaningful progress and a few concrete gaps to close."],
      premium: ["Certified Company", "Excellent performance. The organization meets the expected standard."]
    },
    pt: {
      basic: ["Caminho Iniciado", "Sua organização já tem uma base para avançar rumo à certificação total."],
      medium: ["Certificación Condicional", "Há avanços significativos y algumas lacunas concretas para fechar."],
      premium: ["Empresa Certificada", "Excelente desempenho. A organização cumpre com o padrão esperado."]
    }
  };

  const langKey = copy[language] ? language : 'es';
  const level = globalPercent >= 90 ? 'premium' : globalPercent >= 65 ? 'medium' : 'basic';
  return {
    globalPercent,
    pillarPercents,
    criticalPillar,
    recommendations: recommendations.length ? recommendations : [langKey === 'es' ? 'Excelente puntuación! Su negocio cumple con todos los parámetros. Le sugerimos proceder con la Certificación.' : (langKey === 'pt' ? 'Excelente pontuação! Seu negócio atende a todos os parâmetros. Sugerimos proceder com a Certificação.' : 'Excellent score! Your business meets all parameters. Proceed with Certification.')],
    statusTitle: copy[langKey][level][0],
    statusDesc: copy[langKey][level][1]
  };
}

export default SelfDiagnosticSection;
