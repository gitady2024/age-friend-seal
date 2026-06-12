import "./SelfDiagnosticSection.scss";
import { useMemo, useRef, useState, useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { questions as defaultQuestions } from "../../data/diagnostic.js";
import { QUESTIONS_BY_SECTOR } from "../../data/questionsBySector.js";
import { downloadTextFile } from "../../utils/downloads.js";

const pilarNames = [
  { es: "Pilar 1: Prácticas Internas", en: "Pillar 1: Internal Practices" },
  { es: "Pilar 2: Prácticas Externas", en: "Pillar 2: External Practices" },
  { es: "Pilar 3: Ecosistema y Entorno", en: "Pillar 3: Ecosystem and Environment" }
];

function SelfDiagnosticSection({ language, currentUser, onUserChange, onOpenPayment }) {
  const intl = useIntl();
  const sectionRef = useRef(null);
  
  const [currentQuestions, setCurrentQuestions] = useState(defaultQuestions);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(Array(defaultQuestions.length).fill(null));
  const [showResults, setShowResults] = useState(false);
  const [registrationType, setRegistrationType] = useState('personal');
  const [sectorType, setSectorType] = useState('');
  const [registrationForm, setRegistrationForm] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    country: '',
    publicLevel: '',
    privateVertical: '',
    role: ''
  });

  useEffect(() => {
    let newQuestions = defaultQuestions;
    if (currentUser && currentUser.type === 'empresa') {
      let sector = currentUser.sector === 'publico' ? 'Sector Público' : (currentUser.subsector || "Finanzas y Seguro");
      if (sector === 'Sector Público') {
        sector = Object.keys(QUESTIONS_BY_SECTOR).find(k => k.includes('BLICO')) || "Comercio y Distribución";
      } else if (!QUESTIONS_BY_SECTOR[sector]) {
        sector = Object.keys(QUESTIONS_BY_SECTOR).find(k => k.includes(currentUser.subsector)) || "Comercio y Distribución";
      }
      newQuestions = QUESTIONS_BY_SECTOR[sector] || defaultQuestions;
    }
    
    if (newQuestions !== currentQuestions) {
      setCurrentQuestions(newQuestions);
      setStep(0);
      setAnswers(Array(newQuestions.length).fill(null));
      setShowResults(false);
    }
  }, [currentUser, currentQuestions]);

  const question = currentQuestions[step];
  const progress = ((step + 1) / currentQuestions.length) * 100;

  const results = useMemo(() => calculateResults(answers, language, currentQuestions), [answers, language, currentQuestions]);

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

  const handleRegister = (event) => {
    event.preventDefault();
    const sector = sectorType || '';
    const subsector = sector === 'publico' ? registrationForm.publicLevel : registrationForm.privateVertical;
    onUserChange({
      type: registrationType,
      name: registrationForm.name,
      email: registrationForm.email,
      username: registrationForm.username,
      country: registrationForm.country,
      sector,
      subsector: subsector || '',
      role: registrationForm.role
    });
    alert(language === 'es' ? 'Cuenta guardada localmente para la demo.' : 'Account saved locally for the demo.');
  };

  const updateRegistrationField = (field, value) => {
    setRegistrationForm((current) => ({ ...current, [field]: value }));
  };

  const downloadCsv = () => {
    const rows = [
      ['Question', 'Score', 'Recommendation'],
      ...currentQuestions.map((item, index) => [
        `"${(item.question || item.text[language]).replace(/"/g, '""')}"`,
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
                <span style={{color: 'var(--accent-color)'}}>Sector:</span> {currentUser.sector === 'privado' ? (language === 'es' || language === 'pt' ? 'Privado' : 'Private') : (language === 'es' || language === 'pt' ? 'Público' : 'Public')} <span style={{margin: '0 10px', color: 'var(--border-color)'}}>|</span> <span style={{color: 'var(--accent-color)'}}>Vertical:</span> {currentUser.subsector || 'N/A'}
              </div>
            )}
            <div className="quiz-progress-bar" id="quiz-progress-bar">
              <div className="progress-info">
                <span id="quiz-pilar-name">{question.pilarName ? question.pilarName[language] : pilarNames[Math.min(2, Math.floor(step / Math.ceil(currentQuestions.length / 3)))][language]}</span>
                <span id="quiz-step-text">
                  {language === 'es' ? `Pregunta ${step + 1} de ${currentQuestions.length}` : `Question ${step + 1} of ${currentQuestions.length}`}
                </span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" id="quiz-progress-fill" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="quiz-question-box" id="question-box">
              <h3 id="question-title">{question.question ? question.question : question.text[language]}</h3>
              <div className="quiz-options" id="quiz-options">
                {question.options.map((option) => {
                  const optionText = option.text[language] || option.text;
                  const selected = answers[step]?.score === option.score && (answers[step]?.text?.language === optionText || answers[step]?.text === optionText || (answers[step]?.text && answers[step]?.text[language] === optionText));
                  return (
                    <button
                      type="button"
                      className={`option-card ${selected ? 'selected' : ''}`}
                      key={optionText}
                      onClick={() => selectOption(option)}
                    >
                      {optionText}
                    </button>
                  );
                })}
              </div>
            </div>

            {!currentUser && (
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
                      <label htmlFor="quiz-reg-name"><FormattedMessage id="SelfDiagnosticSection.012" /></label>
                      <input
                        type="text"
                        id="quiz-reg-name"
                        name="quiz-demo-name"
                        required
                        autoComplete="off"
                        value={registrationForm.name}
                        onChange={(event) => updateRegistrationField('name', event.target.value)}
                        placeholder={intl.formatMessage({ id: "SelfDiagnosticSection.013" })}
                      />
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
                    <div className="form-group">
                      <label htmlFor="quiz-reg-username"><FormattedMessage id="SelfDiagnosticSection.016" /></label>
                      <input
                        type="text"
                        id="quiz-reg-username"
                        name="quiz-demo-username"
                        required
                        autoComplete="off"
                        value={registrationForm.username}
                        onChange={(event) => updateRegistrationField('username', event.target.value)}
                        placeholder={intl.formatMessage({ id: "SelfDiagnosticSection.017" })}
                      />
                    </div>
                    <div className="form-group">
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

                  {registrationType === 'personal' ? (
                    <div className="form-group" id="quiz-field-personal-country">
                      <label htmlFor="quiz-reg-country"><FormattedMessage id="SelfDiagnosticSection.020" /></label>
                      <input
                        type="text"
                        id="quiz-reg-country"
                        name="quiz-demo-country"
                        autoComplete="off"
                        value={registrationForm.country}
                        onChange={(event) => updateRegistrationField('country', event.target.value)}
                        placeholder={intl.formatMessage({ id: "SelfDiagnosticSection.021" })}
                      />
                    </div>
                  ) : (
                    <>
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
                          <label htmlFor="quiz-reg-public-level"><FormattedMessage id="SelfDiagnosticSection.026" /></label>
                          <select
                            id="quiz-reg-public-level"
                            name="publicLevel"
                            required
                            value={registrationForm.publicLevel}
                            onChange={(event) => updateRegistrationField('publicLevel', event.target.value)}
                          >
                            <option value=""><FormattedMessage id="SelfDiagnosticSection.027" /></option>
                            <option value="municipal"><FormattedMessage id="SelfDiagnosticSection.028" /></option>
                            <option value="provincial"><FormattedMessage id="SelfDiagnosticSection.029" /></option>
                            <option value="nacional"><FormattedMessage id="SelfDiagnosticSection.030" /></option>
                          </select>
                        </div>
                      )}
                      {sectorType === 'privado' && (
                        <div className="form-group" id="quiz-field-private-vertical">
                          <label htmlFor="quiz-reg-private-vertical"><FormattedMessage id="SelfDiagnosticSection.031" /></label>
                          <select
                            id="quiz-reg-private-vertical"
                            name="privateVertical"
                            required
                            value={registrationForm.privateVertical}
                            onChange={(event) => updateRegistrationField('privateVertical', event.target.value)}
                          >
                            <option value=""><FormattedMessage id="SelfDiagnosticSection.032" /></option>
                            <option value="Finanzas y Seguro"><FormattedMessage id="SelfDiagnosticSection.033" /></option>
                            <option value="Salud y Farmacia"><FormattedMessage id="SelfDiagnosticSection.034" /></option>
                            <option value="Tecnologia y Software"><FormattedMessage id="SelfDiagnosticSection.035" /></option>
                            <option value="Comercio y Distribucion"><FormattedMessage id="SelfDiagnosticSection.036" /></option>
                            <option value="Manufactura e Industria">Manufactura e Industria</option>
                            <option value="Educacion">Educación</option>
                            <option value="Bienes Raices y Construccion">Bienes Raíces y Construcción</option>
                            <option value="Energia y Recursos Naturales">Energía y Recursos Naturales</option>
                            <option value="Entretenimiento, Medios y Turismo">Entretenimiento, Medios y Turismo</option>
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
              <button className="btn btn-primary" id="btn-quiz-next" disabled={!answers[step]} onClick={goNext}>
                {step === currentQuestions.length - 1 ? (language === 'es' ? 'Finalizar' : 'Finish') : <FormattedMessage id="SelfDiagnosticSection.046" />}
              </button>
            </div>
          </div>
        )}

        {showResults && (
          <div className="glass-card results-container" id="results-card">
            <div className="results-header text-center">
              <div className="results-badge"><FormattedMessage id="SelfDiagnosticSection.047" /></div>
              <h2>{language === 'es' ? 'Analisis de Amigabilidad' : 'Friendliness Analysis'}</h2>
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
                    <span>{pilarNames[index][language]}</span>
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

function calculateResults(answers, language, currentQuestions) {
  const safeAnswers = answers.map((answer) => answer || { score: 0 });
  const totalScore = safeAnswers.reduce((sum, answer) => sum + answer.score, 0);
  
  // Novedad: cálculo de maxScore (45 para las 15 preguntas, o 100 por defecto para el viejo)
  const isOldGeneric = currentQuestions === defaultQuestions;
  const maxScore = isOldGeneric ? currentQuestions.length * 100 : currentQuestions.length * 3; 
  const globalPercent = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
  
  const pillarScores = [0, 0, 0];
  const questionsPerPilar = Math.ceil(currentQuestions.length / 3);

  safeAnswers.forEach((answer, index) => {
    let pilarIndex = currentQuestions[index].pilar ? currentQuestions[index].pilar - 1 : Math.min(2, Math.floor(index / questionsPerPilar));
    pillarScores[pilarIndex] += answer.score;
  });

  const pillarPercents = pillarScores.map((score, idx) => {
    const questionsInThisPilar = idx === 2 ? currentQuestions.length - (2 * questionsPerPilar) : questionsPerPilar;
    const maxPillarScore = isOldGeneric ? questionsInThisPilar * 100 : questionsInThisPilar * 3;
    return maxPillarScore > 0 ? Math.round((score / maxPillarScore) * 100) : 0;
  });

  const recommendations = currentQuestions
    .filter((item, index) => isOldGeneric ? ((answers[index]?.score ?? 0) < 100) : ((answers[index]?.score ?? 0) < 3))
    .slice(0, 6)
    .map((item) => {
      if (isOldGeneric) return item.recommendation[language];
      const bestOption = item.options ? item.options.find(o => o.score === 3) : null;
      return bestOption ? `Mejora recomendada: Implementar "${bestOption.text}"` : '';
    });

  const copy = {
    es: {
      basic: ["Camino Iniciado", "Tu organizacion ya tiene una base para avanzar hacia la certificacion total."],
      medium: ["Certificacion Condicional", "Hay avances significativos y algunas brechas concretas por cerrar."],
      premium: ["Empresa Certificada", "Excelente desempeno. La organizacion cumple con el estandar esperado."]
    },
    en: {
      basic: ["Path Started", "Your organization has a base to advance toward full certification."],
      medium: ["Conditional Certification", "There is meaningful progress and a few concrete gaps to close."],
      premium: ["Certified Company", "Excellent performance. The organization meets the expected standard."]
    }
  };

  const level = globalPercent >= 90 ? 'premium' : globalPercent >= 65 ? 'medium' : 'basic';
  return {
    globalPercent,
    pillarPercents,
    recommendations: recommendations.length ? recommendations : [language === 'es' ? 'Excelente puntuacion! Su negocio cumple con todos los parametros. Le sugerimos proceder con la Certificacion.' : 'Excellent score! Your business meets all parameters. Proceed with Certification.'],
    statusTitle: copy[language][level][0],
    statusDesc: copy[language][level][1]
  };
}

export default SelfDiagnosticSection;
