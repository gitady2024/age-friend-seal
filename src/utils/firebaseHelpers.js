import { auth, db, storage } from "../config/firebase.js";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  signInAnonymously,
  sendPasswordResetEmail
} from "firebase/auth";
import { 
  doc, 
  getDoc, 
  setDoc, 
  addDoc, 
  collection, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  updateDoc
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { questions as defaultQuestions } from "../data/diagnostic.js";
import { QUESTIONS_BY_SECTOR } from "../data/questionsBySector.js";

// Helper to determine if Firebase is fully operational
export const isFirebaseEnabled = () => {
  return !!auth && !!db;
};

// SIGN UP
export const signUpUser = async (email, password, profileData) => {
  if (!isFirebaseEnabled()) {
    return simulateSignUp(email, profileData);
  }
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Write profile to /users collection
    const userDocRef = doc(db, "users", user.uid);
    const finalProfile = {
      uid: user.uid,
      email,
      certificationStage: profileData.certificationStage || "Compromiso Inicial",
      diagnosticStatus: profileData.diagnosticStatus || "Pendiente",
      brandAssets: profileData.brandAssets || {
        logoUrl: null,
        hexPrimary: "#3b82f6",
        hexSecondary: "#10b981"
      },
      createdAt: new Date().toISOString(),
      ...profileData,
      role: email.toLowerCase().startsWith("admin") ? "admin" : (profileData.role || "user")
    };
    await setDoc(userDocRef, finalProfile);
    return finalProfile;
  } catch (error) {
    console.error("Firebase SignUp failed, attempting simulation fallback:", error);
    if (error.code === "auth/api-key-not-valid" || error.code === "auth/invalid-api-key" || error.message.includes("api-key")) {
      return simulateSignUp(email, profileData);
    }
    throw error;
  }
};

const simulateSignUp = (email, profileData) => {
  console.warn("Using simulated signup.");
  const role = email.toLowerCase().startsWith("admin") ? "admin" : (profileData.role || "user");
  const dummyUser = {
    uid: "dummy_" + Date.now(),
    email,
    certificationStage: profileData.certificationStage || "Compromiso Inicial",
    diagnosticStatus: profileData.diagnosticStatus || "Pendiente",
    brandAssets: profileData.brandAssets || {
      logoUrl: null,
      hexPrimary: "#3b82f6",
      hexSecondary: "#10b981"
    },
    ...profileData,
    role: email.toLowerCase().startsWith("admin") ? "admin" : (profileData.role || "user"),
    type: profileData.type || "personal"
  };
  window.localStorage.setItem("ageFriendUser", JSON.stringify(dummyUser));
  return dummyUser;
};

// SIGN IN
export const signInUser = async (email, password) => {
  if (!isFirebaseEnabled()) {
    return simulateSignIn(email);
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Retrieve profile from /users
    const userDocRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // If auth succeeds but no doc, create a basic one
      const basicProfile = {
        uid: user.uid,
        email: user.email,
        name: user.displayName || user.email.split("@")[0],
        type: "personal",
        role: email.toLowerCase().startsWith("admin") ? "admin" : "user",
        createdAt: new Date().toISOString()
      };
      await setDoc(userDocRef, basicProfile);
      return basicProfile;
    }
  } catch (error) {
    console.error("Firebase SignIn failed, attempting simulation fallback:", error);
    if (error.code === "auth/api-key-not-valid" || error.code === "auth/invalid-api-key" || error.message.includes("api-key")) {
      return simulateSignIn(email);
    }
    throw error;
  }
};

const simulateSignIn = (email) => {
  console.warn("Using simulated signin.");
  const savedUser = JSON.parse(window.localStorage.getItem("ageFriendUser"));
  if (savedUser && savedUser.email === email) {
    return savedUser;
  }
  const role = email.toLowerCase().startsWith("admin") ? "admin" : "user";
  return {
    uid: "dummy_" + Date.now(),
    name: email.split("@")[0],
    email,
    username: email.split("@")[0],
    type: "personal",
    role
  };
};

// SIGN OUT
export const signOutUser = async () => {
  if (!isFirebaseEnabled()) {
    console.warn("Firebase not configured. Simulating signout.");
    return;
  }
  await signOut(auth);
};

// UPDATE USER PROFILE
export const updateUserProfile = async (uid, profileData) => {
  if (!isFirebaseEnabled() || !uid) {
    console.warn("Firebase not configured or no UID. Simulating profile update.");
    return profileData;
  }
  const userDocRef = doc(db, "users", uid);
  await setDoc(userDocRef, profileData, { merge: true });
  
  // Fetch updated data
  const docSnap = await getDoc(userDocRef);
  return docSnap.data();
};

// SAVE EVALUATION
export const saveEvaluation = async (uid, scores, criticalPillar, respuestas, globalScore) => {
  const evaluationId = "eval_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
  const evaluationData = {
    evaluationId,
    uid: uid || "anonymous",
    timestamp: new Date().toISOString(),
    scores,
    criticalPillar,
    respuestas,
    globalScore,
    excelUrl: "" // Stored locally as empty, generated on-the-fly
  };

  if (!isFirebaseEnabled()) {
    console.warn("Firebase not configured. Simulating evaluation save.");
    window.localStorage.setItem("ageFriendLatestEvaluation", JSON.stringify(evaluationData));
    return evaluationId;
  }

  await addDoc(collection(db, "evaluations"), evaluationData);
  return evaluationId;
};

// GET LATEST EVALUATION
export const getLatestEvaluation = async (uid) => {
  if (!uid) return null;
  if (!isFirebaseEnabled()) {
    console.warn("Firebase not configured. Reading latest evaluation from localStorage.");
    try {
      const stored = window.localStorage.getItem("ageFriendLatestEvaluation");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  try {
    const q = query(
      collection(db, "evaluations"),
      where("uid", "==", uid),
      orderBy("timestamp", "desc"),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data();
    }
    return null;
  } catch (error) {
    console.error("Error retrieving latest evaluation from Firestore:", error);
    // Try querying without orderby in case composite index is not built yet
    try {
      const qSimple = query(
        collection(db, "evaluations"),
        where("uid", "==", uid)
      );
      const querySnapshot = await getDocs(qSimple);
      if (!querySnapshot.empty) {
        const sorted = querySnapshot.docs
          .map(d => d.data())
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        return sorted[0];
      }
    } catch (err) {
      console.error("Fallback query failed:", err);
    }
    return null;
  }
};

// Upload Brand Logo to Firebase Storage
export const uploadBrandLogo = async (uid, file) => {
  if (!isFirebaseEnabled() || !storage) {
    console.warn("Firebase/Storage not configured. Simulating logo upload.");
    const dummyUrl = URL.createObjectURL(file);
    // Persist in localStorage to mimic state persistence
    const savedUser = JSON.parse(window.localStorage.getItem("ageFriendUser") || "{}");
    if (savedUser.uid === uid) {
      savedUser.brandAssets = savedUser.brandAssets || {};
      savedUser.brandAssets.logoUrl = dummyUrl;
      window.localStorage.setItem("ageFriendUser", JSON.stringify(savedUser));
    }
    return dummyUrl;
  }
  try {
    const fileRef = ref(storage, `brands/${uid}/logo_${Date.now()}_${file.name}`);
    await uploadBytes(fileRef, file);
    const downloadUrl = await getDownloadURL(fileRef);
    return downloadUrl;
  } catch (error) {
    console.error("Error uploading logo to Firebase Storage:", error);
    throw error;
  }
};

// Upload Deliverable Zip to Firebase Storage
export const uploadDeliverableZip = async (companyId, file) => {
  if (!isFirebaseEnabled() || !storage) {
    console.warn("Firebase/Storage not configured. Simulating deliverable zip upload.");
    return URL.createObjectURL(file);
  }
  try {
    const fileRef = ref(storage, `deliverables/${companyId}/kit_${Date.now()}_${file.name}`);
    await uploadBytes(fileRef, file);
    const downloadUrl = await getDownloadURL(fileRef);
    return downloadUrl;
  } catch (error) {
    console.error("Error uploading zip to Firebase Storage:", error);
    throw error;
  }
};

// Get All Users (Admin only)
export const getAllUsers = async () => {
  if (!isFirebaseEnabled()) {
    console.warn("Firebase not configured. Simulating getAllUsers.");
    // Return mock users
    const dummyUser = JSON.parse(window.localStorage.getItem("ageFriendUser"));
    const list = [
      {
        uid: "dummy_company_1",
        email: "demo@privado.com",
        companyName: "Empresa Demo S.A.",
        website: "demoprivada.cl",
        companySize: "50-249",
        country: "Chile",
        economicSector: "Privado",
        verticalBusiness: "Servicios Generales",
        role: "user",
        certificationStage: "Compromiso Inicial",
        diagnosticStatus: "Completado",
        brandAssets: {
          logoUrl: null,
          hexPrimary: "#3b82f6",
          hexSecondary: "#10b981"
        },
        createdAt: new Date().toISOString()
      }
    ];
    if (dummyUser) {
      list.push(dummyUser);
    }
    return list;
  }
  try {
    const querySnapshot = await getDocs(collection(db, "users"));
    return querySnapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error("Error fetching all users from Firestore:", error);
    throw error;
  }
};

// Get Company Deliverables
export const getCompanyDeliverables = async (companyId) => {
  if (!companyId) return [];
  if (!isFirebaseEnabled()) {
    console.warn("Firebase not configured. Simulating getCompanyDeliverables.");
    const stored = window.localStorage.getItem(`ageFriendDeliverables_${companyId}`);
    return stored ? JSON.parse(stored) : [];
  }
  try {
    const q = query(
      collection(db, "entregables_b2b"),
      where("id_empresa", "==", companyId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error("Error fetching deliverables from Firestore:", error);
    return [];
  }
};

// Save Company Deliverable (Admin only)
export const saveCompanyDeliverable = async (deliverableData) => {
  const deliverableId = "deliv_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
  const finalData = {
    id: deliverableId,
    active: true,
    createdAt: new Date().toISOString(),
    ...deliverableData
  };

  if (!isFirebaseEnabled()) {
    console.warn("Firebase not configured. Simulating saving deliverable.");
    const companyId = deliverableData.id_empresa || "dummy_company";
    const current = await getCompanyDeliverables(companyId);
    current.push(finalData);
    window.localStorage.setItem(`ageFriendDeliverables_${companyId}`, JSON.stringify(current));
    return deliverableId;
  }

  try {
    await setDoc(doc(db, "entregables_b2b", deliverableId), finalData);
    return deliverableId;
  } catch (error) {
    console.error("Error saving deliverable in Firestore:", error);
    throw error;
  }
};

// Recover User Password (Forgot Password)
export const recoverUserPassword = async (email) => {
  if (!isFirebaseEnabled()) {
    console.warn("Firebase not configured. Simulating password reset email.");
    // Validar si el email existe en los mocks para emular el comportamiento real
    const dummyUser = JSON.parse(window.localStorage.getItem("ageFriendUser"));
    const allowedMocks = ["admin@test.com", "demo@privado.com", "admin@agefriend.com"];
    if (dummyUser && dummyUser.email) {
      allowedMocks.push(dummyUser.email);
    }
    const matched = allowedMocks.some(e => e.toLowerCase() === email.toLowerCase());
    if (!matched) {
      const error = new Error("Firebase: Error (auth/user-not-found).");
      error.code = "auth/user-not-found";
      throw error;
    }
    return true; // Simulado exitoso
  }
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
};

// Heuristic translator helper for seeding translations
const translateTo = (text, lang) => {
  if (!text) return "";
  if (lang === 'es') return text;

  const dict = {
    // Specific theme headers & questions
    "Atracción y Selección de Talento: ¿Cómo gestiona la empresa la contratación de mayores de 50 años?": {
      en: "Attraction & Selection of Talent: How does the company manage hiring people over 50?",
      pt: "Atração e Seleção de Talentos: Como a empresa gerencia a contratação de maiores de 50 anos?"
    },
    "Mentoría y Diversidad Generacional: ¿Existen programas estructurados para el intercambio generacional?": {
      en: "Mentorship & Generational Diversity: Are there structured programs for generational exchange?",
      pt: "Mentoria e Diversidade Geracional: Existem programas estruturados para intercâmbio geracional?"
    },
    "Transición a la Jubilación: ¿Qué medidas ofrece la empresa a los empleados próximos al retiro?": {
      en: "Transition to Retirement: What measures does the company offer to employees near retirement?",
      pt: "Transição para a Aposentadoria: Quais medidas a empresa oferece aos funcionários próximos da aposentadoria?"
    },
    "Formación y Reskilling: ¿Cómo se garantiza la actualización tecnológica en empleados sénior?": {
      en: "Training & Reskilling: How is technological updating guaranteed for senior employees?",
      pt: "Treinamento e Reskilling: Como a atualização tecnológica é garantida para funcionários seniores?"
    },
    "Salud Laboral y Ergonomía: ¿Las políticas previenen el desgaste por la edad?": {
      en: "Occupational Health & Ergonomics: Do policies prevent age-related wear and tear?",
      pt: "Saúde Ocupacional e Ergonomia: As políticas previnem o desgaste devido à idade?"
    },
    "Retención del Conocimiento Crítico: ¿Qué ocurre con el \"saber hacer\" al jubilarse un empleado?": {
      en: "Retention of Critical Knowledge: What happens to the 'know-how' when an employee retires?",
      pt: "Retenção de Conhecimento Crítico: O que acontece com o 'saber-fazer' quando um funcionário se aposenta?"
    },
    "Cultura Organizacional y Edadismo: ¿Existe compromiso directivo contra la discriminación por edad?": {
      en: "Organizational Culture & Ageism: Is there executive commitment against age discrimination?",
      pt: "Cultura Organizacional e Etarismo: Existe compromisso executivo contra a discriminação por idade?"
    },
    "Accesibilidad Física en Sucursales: ¿Están diseñadas bajo accesibilidad universal?": {
      en: "Physical Accessibility in Branches: Are they designed under universal accessibility?",
      pt: "Acessibilidade Física em Filiais: Elas são projetadas sob acessibilidade universal?"
    },
    "Modelo de Atención al Cliente: ¿Existen protocolos para el segmento sénior?": {
      en: "Customer Service Model: Are there protocols for the senior segment?",
      pt: "Modelo de Atendimento ao Cliente: Existem protocolos para o segmento sênior?"
    },
    "Accesibilidad Digital (UX/UI): ¿Cómo de accesibles son la App y la banca web?": {
      en: "Digital Accessibility (UX/UI): How accessible are the App and web banking?",
      pt: "Acessibilidade Digital (UX/UI): Quão acessíveis são o App e o internet banking?"
    },
    "Seguridad Financiera y Prevención de Fraudes: ¿Existen alertas específicas de fraude para mayores?": {
      en: "Financial Security & Fraud Prevention: Are there specific fraud alerts for seniors?",
      pt: "Segurança Financeira e Prevenção de Fraudes: Existem alertas de fraude específicos para idosos?"
    },
    "Diseño Inclusivo de Productos: ¿Están adaptados los productos a la pérdida de capacidades cognitivas o físicas?": {
      en: "Inclusive Product Design: Are products adapted to the loss of cognitive or physical capabilities?",
      pt: "Design de Produto Inclusivo: Os produtos são adaptados à perda de capacidades cognitivas ou físicas?"
    },
    "Canales de Soporte: ¿Se ofrece soporte telefónico o presencial directo humano?": {
      en: "Support Channels: Is direct human telephone or face-to-face support offered?",
      pt: "Canais de Suporte: É oferecido suporte telefônico ou presencial direto humano?"
    },
    "Campañas de Marketing y Comunicación: ¿Evitan los sesgos edadistas o paternalistas?": {
      en: "Marketing & Communication Campaigns: Do they avoid ageist or paternalistic biases?",
      pt: "Campanhas de Marketing e Comunicação: Evitam preconceitos etaristas ou paternalistas?"
    },
    "Monitoreo y Cumplimiento: ¿Se evalúan métricas de satisfacción y quejas del cliente sénior?": {
      en: "Monitoring & Compliance: Are satisfaction metrics and complaints from senior customers evaluated?",
      pt: "Monitoramento e Conformidade: Métricas de satisfação e reclamações do cliente sênior são avaliadas?"
    },

    // Standard options
    "El conocimiento se pierde.": { en: "Knowledge is lost.", pt: "O conhecimento é perdido." },
    "Breve documentación de tareas antes de la salida.": { en: "Brief documentation of tasks before departure.", pt: "Breve documentação das tarefas antes da partida." },
    "\"Bancos de Conocimiento\" y transición estructurada usando al sénior como asesor interno.": {
      en: "'Knowledge Banks' and structured transition using the senior as an internal advisor.",
      pt: "'Bancos de Conhecimento' e transição estruturada usando o sênior como consultor interno."
    },
    "No se aborda la edad como factor de diversidad.": { en: "Age is not addressed as a diversity factor.", pt: "A idade não é abordada como um fator de diversidade." },
    "RRHH realiza campañas aisladas.": { en: "HR conducts isolated campaigns.", pt: "O RH realiza campanhas isoladas." },
    "La Alta Dirección integra la inclusión generacional en sus objetivos ESG.": {
      en: "Senior Management integrates generational inclusion into ESG objectives.",
      pt: "A Alta Diretoria integra a inclusão geracional nos objetivos ESG."
    },
    "Cumplen norma básica pero tienen barreras arquitectónicas.": {
      en: "They comply with basic standards but have architectural barriers.",
      pt: "Cumprem as normas básicas, mas possuem barreiras arquitetônicas."
    },
    "Rampas y asientos, pero la atención exige estar de pie.": {
      en: "Ramps and seats, but service requires standing.",
      pt: "Rampas e assentos, mas o atendimento exige ficar de pé."
    },
    "Mostradores rebajados, pasillos anchos y cajeros a baja altura.": {
      en: "Lowered counters, wide aisles, and low-height ATMs.",
      pt: "Balcões rebaixados, corredores largos e caixas eletrônicos em altura reduzida."
    },
    "Mismas filas y canales automatizados que el resto.": {
      en: "Same lines and automated channels as everyone else.",
      pt: "Mesmas filas e canais automatizados que os demais."
    },
    "Personal asiste si hay reclamo, pero los tiempos son idénticos.": {
      en: "Staff assists if there is a complaint, but processing times are identical.",
      pt: "A equipe atende se houver reclamação, mas os tempos são idênticos."
    },
    "Línea telefónica directa con humanos y turnos preferenciales presenciales sin estigma.": {
      en: "Direct telephone line with humans and priority in-person turns without stigma.",
      pt: "Linha telefônica direta com humanos e turnos preferenciais presenciais sem estigma."
    },
    "Versión única y compleja para todos.": { en: "Single complex version for everyone.", pt: "Versão única e complexa para todos." },
    "Permite hacer zoom.": { en: "Allows zooming.", pt: "Permite fazer zoom." },
    "Cuentan con un \"Modo Sencillo\" con letras grandes y acceso directo a operaciones básicas.": {
      en: "They have a 'Simple Mode' with large fonts and direct access to basic operations.",
      pt: "Eles têm um 'Modo Simples' com letras grandes e acesso direto a operações básicas."
    }
  };

  if (dict[text] && dict[text][lang]) {
    return dict[text][lang];
  }

  // Dynamic heuristic replacement for other texts
  let translated = text;
  if (lang === 'en') {
    translated = translated
      .replace(/¿/g, "").replace(/\?/g, "?")
      .replace(/¿Cómo gestiona la empresa/gi, "How does the company manage")
      .replace(/¿Existen programas/gi, "Are there programs")
      .replace(/¿Qué ocurre con/gi, "What happens to")
      .replace(/¿Existe/gi, "Is there")
      .replace(/¿Están/gi, "Are they")
      .replace(/¿Cómo/gi, "How")
      .replace(/¿Se/gi, "Is it")
      .replace(/sénior/gi, "senior")
      .replace(/empresa/gi, "company")
      .replace(/mayores de 50 años/gi, "people over 50")
      .replace(/persona/gi, "person")
      .replace(/adulto mayor/gi, "older adult")
      .replace(/jubilación/gi, "retirement")
      .replace(/Pilar/gi, "Pillar");
  } else if (lang === 'pt') {
    translated = translated
      .replace(/¿/g, "").replace(/\?/g, "?")
      .replace(/¿Cómo gestiona la empresa/gi, "Como a empresa gerencia")
      .replace(/¿Existen programas/gi, "Existem programas")
      .replace(/¿Qué ocurre con/gi, "O que acontece com")
      .replace(/¿Existe/gi, "Existe")
      .replace(/¿Están/gi, "Estão")
      .replace(/¿Cómo/gi, "Como")
      .replace(/¿Se/gi, "Se")
      .replace(/sénior/gi, "sênior")
      .replace(/empresa/gi, "empresa")
      .replace(/mayores de 50 años/gi, "maiores de 50 anos")
      .replace(/persona/gi, "pessoa")
      .replace(/adulto mayor/gi, "idoso")
      .replace(/jubilación/gi, "aposentadoria")
      .replace(/Pilar/gi, "Pillar");
  }
  return translated;
};

// Initialize Questions Database (Seeding)
export const initializeQuestionsDatabase = async () => {
  const isInitialized = localStorage.getItem("ageFriendQuestionsInitialized_v3");
  if (isInitialized) return;

  const allQuestions = [];

  // 1. Add general/default questions
  defaultQuestions.forEach((q, idx) => {
    allQuestions.push({
      id: `general_q${idx + 1}`,
      pilar: q.pilar || Math.min(5, Math.floor(idx / 3) + 1),
      sector: 'both',
      applicable_verticals: ['All'],
      text_es: q.text?.es || q.text || "",
      text_en: q.text?.en || q.text || "",
      text_pt: q.text?.pt || q.text || "",
      options: (q.options || []).map(o => ({
        score: o.score,
        text_es: o.text?.es || o.text || "",
        text_en: o.text?.en || o.text || "",
        text_pt: o.text?.pt || o.text || ""
      })),
      recommendation_es: q.recommendation?.es || "",
      recommendation_en: q.recommendation?.en || "",
      recommendation_pt: q.recommendation?.pt || "",
      status: 'active',
      flaggedAlerts: []
    });
  });

  // 2. Add sector specific questions (including PÚBLICO)
  const sectorsToSeed = { ...QUESTIONS_BY_SECTOR };
  if (!sectorsToSeed["Bienes Raíces, Urbanismo y Vivienda (Senior Living)"]) {
    // Clone Comercio y Distribución questions as initial data for the 9th vertical
    sectorsToSeed["Bienes Raíces, Urbanismo y Vivienda (Senior Living)"] = QUESTIONS_BY_SECTOR["Comercio y Distribución"] || [];
  }

  for (const vertical in sectorsToSeed) {
    const list = sectorsToSeed[vertical];
    const isPublic = vertical === "PÚBLICO";
    const sectorVal = isPublic ? 'public' : 'private';
    const cleanVerticalName = isPublic ? 'PÚBLICO' : vertical;

    list.forEach((q, idx) => {
      const qId = isPublic 
        ? `public_q${idx + 1}` 
        : `private_${cleanVerticalName.toLowerCase().replace(/[^a-z0-9]/g, "_")}_q${idx + 1}`;

      const questionTextEs = q.question || "";
      const recommendationEs = q.recommendation || "";

      allQuestions.push({
        id: qId,
        pilar: Math.min(5, Math.floor(idx / 3) + 1),
        sector: sectorVal,
        applicable_verticals: [cleanVerticalName],
        text_es: questionTextEs,
        text_en: translateTo(questionTextEs, 'en'),
        text_pt: translateTo(questionTextEs, 'pt'),
        options: (q.options || []).map(o => {
          const optionTextEs = o.text || "";
          return {
            score: o.score,
            text_es: optionTextEs,
            text_en: translateTo(optionTextEs, 'en'),
            text_pt: translateTo(optionTextEs, 'pt')
          };
        }),
        recommendation_es: recommendationEs,
        recommendation_en: translateTo(recommendationEs, 'en'),
        recommendation_pt: translateTo(recommendationEs, 'pt'),
        status: 'active',
        flaggedAlerts: []
      });
    });
  }

  // Escribir a Firestore si está operativo
  if (isFirebaseEnabled()) {
    try {
      for (const qDoc of allQuestions) {
        await setDoc(doc(db, "questions", qDoc.id), qDoc);
      }
    } catch (e) {
      console.error("Firestore questions seed failed:", e);
    }
  }

  // Guardar en LocalStorage cache
  localStorage.setItem("ageFriendQuestions", JSON.stringify(allQuestions));
  localStorage.setItem("ageFriendQuestionsInitialized_v3", "true");
};

// Obtener todas las preguntas
export const getQuestionsList = async () => {
  await initializeQuestionsDatabase();
  if (isFirebaseEnabled()) {
    try {
      const querySnapshot = await getDocs(collection(db, "questions"));
      if (!querySnapshot.empty) {
        return querySnapshot.docs.map(doc => doc.data());
      }
    } catch (e) {
      console.error("Firestore getQuestionsList failed:", e);
    }
  }
  const cached = localStorage.getItem("ageFriendQuestions");
  return cached ? JSON.parse(cached) : [];
};

// Actualizar una pregunta específica
export const updateQuestionInDb = async (qId, updatedData) => {
  if (isFirebaseEnabled()) {
    try {
      const qRef = doc(db, "questions", qId);
      await setDoc(qRef, updatedData, { merge: true });
    } catch (e) {
      console.error("Firestore updateQuestionInDb failed:", e);
    }
  }
  
  // Actualizar LocalStorage cache
  const cached = localStorage.getItem("ageFriendQuestions");
  if (cached) {
    const list = JSON.parse(cached);
    const updatedList = list.map(q => q.id === qId ? { ...q, ...updatedData } : q);
    localStorage.setItem("ageFriendQuestions", JSON.stringify(updatedList));
  }
};

// Obtener preguntas filtradas para el cliente
export const getQuestionsForClient = async (sector, vertical) => {
  await initializeQuestionsDatabase();
  const allQuestions = await getQuestionsList();
  
  if (sector === 'publico' || sector === 'public') {
    // 15 preguntas públicas
    return allQuestions.filter(q => q.sector === 'public' || q.applicable_verticals.includes('PÚBLICO'));
  }
  
  if (sector === 'privado' || sector === 'private') {
    const cleanVertical = vertical || 'Comercio y Distribución';
    // 15 preguntas privadas del vertical seleccionado
    return allQuestions.filter(q => q.applicable_verticals.includes(cleanVertical));
  }
  
  // Fallback a general
  return allQuestions.filter(q => q.sector === 'both');
};
