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
import { QUESTIONS_BY_SECTOR_TRANSLATED } from "../data/questionsBySectorTranslated.js";

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
    
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = Date.now() + 15 * 60 * 1000; // 15 mins

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
      isVerified: false,
      otpCode,
      otpExpiresAt,
      role: email.toLowerCase().startsWith("admin") ? "admin" : (profileData.role || "user")
    };
    await setDoc(userDocRef, finalProfile);

    // Call /api/send-otp to deliver verification code
    try {
      await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name: profileData.name || profileData.companyName || email,
          otpCode,
          action: "send"
        })
      });
    } catch (err) {
      console.error("Error sending OTP email:", err);
    }

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
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiresAt = Date.now() + 15 * 60 * 1000;

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
    isVerified: false,
    otpCode,
    otpExpiresAt,
    role: email.toLowerCase().startsWith("admin") ? "admin" : (profileData.role || "user"),
    type: profileData.type || "personal"
  };
  window.localStorage.setItem("ageFriendUser", JSON.stringify(dummyUser));

  // Trigger send-otp
  fetch("/api/send-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      name: profileData.name || profileData.companyName || email,
      otpCode,
      action: "send"
    })
  }).catch(err => console.error("Simulated OTP email send failed:", err));

  return dummyUser;
};

export const verifyUserOtp = async (user, enteredCode) => {
  if (!user) return { success: false, error: "Usuario no autenticado." };
  
  const storedCode = user.otpCode;
  const expiresAt = user.otpExpiresAt;
  
  if (expiresAt && Date.now() > expiresAt) {
    return { success: false, error: "El código de 6 dígitos ha expirado. Solicite uno nuevo." };
  }
  
  if (String(storedCode).trim() !== String(enteredCode).trim()) {
    return { success: false, error: "El código de 6 dígitos introducido es incorrecto." };
  }
  
  const updatedData = {
    isVerified: true,
    otpCode: null,
    otpExpiresAt: null
  };
  
  if (isFirebaseEnabled() && user.uid && !user.uid.startsWith("dummy_")) {
    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, updatedData);
    } catch (err) {
      console.warn("Firestore updateDoc for OTP failed, applying local state:", err);
    }
  }
  
  const updatedProfile = { ...user, ...updatedData };
  window.localStorage.setItem("ageFriendUser", JSON.stringify(updatedProfile));
  return { success: true, updatedProfile };
};

export const resendUserOtp = async (user) => {
  if (!user) return { success: false, error: "Usuario no encontrado." };
  const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
  const newExpiresAt = Date.now() + 15 * 60 * 1000;
  
  const updatedData = {
    otpCode: newOtp,
    otpExpiresAt: newExpiresAt,
    isVerified: false
  };
  
  if (isFirebaseEnabled() && user.uid && !user.uid.startsWith("dummy_")) {
    try {
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, updatedData);
    } catch (err) {
      console.warn("Firestore updateDoc for OTP resend failed, applying local state:", err);
    }
  }
  
  const updatedProfile = { ...user, ...updatedData };
  window.localStorage.setItem("ageFriendUser", JSON.stringify(updatedProfile));
  
  try {
    await fetch("/api/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user.email,
        name: user.name || user.companyName || user.email,
        otpCode: newOtp,
        action: "send"
      })
    });
  } catch (err) {
    console.error("Error al enviar OTP:", err);
  }
  
  return { success: true, updatedProfile };
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

// Initialize Questions Database (Seeding)
export const initializeQuestionsDatabase = async () => {
  const isInitialized = localStorage.getItem("ageFriendQuestionsInitialized_v6");
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
  const sectorsToSeed = { ...QUESTIONS_BY_SECTOR_TRANSLATED };
  if (!sectorsToSeed["Bienes Raíces, Urbanismo y Vivienda (Senior Living)"]) {
    // Clone Comercio y Distribución questions as initial data for the 9th vertical
    sectorsToSeed["Bienes Raíces, Urbanismo y Vivienda (Senior Living)"] = QUESTIONS_BY_SECTOR_TRANSLATED["Comercio y Distribución"] || [];
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
      const questionTextEn = q.question_en || "";
      const questionTextPt = q.question_pt || "";

      const recommendationEs = q.recommendation || "";
      const recommendationEn = q.recommendation_en || "";
      const recommendationPt = q.recommendation_pt || "";

      // Strict validation to avoid identical English/Spanish translations (prevents silent failures)
      if (qId.startsWith("private_") || qId.startsWith("public_")) {
        if (questionTextEs && questionTextEn === questionTextEs) {
          console.error(`DATABASE_SEED_INTEGRITY_ERROR: English question text is identical to Spanish for question ${qId}: "${questionTextEs}"`);
          throw new Error(`DATABASE_SEED_INTEGRITY_ERROR: Question ${qId} lacks English translation.`);
        }
      }

      allQuestions.push({
        id: qId,
        pilar: Math.min(5, Math.floor(idx / 3) + 1),
        sector: sectorVal,
        applicable_verticals: [cleanVerticalName],
        text_es: questionTextEs,
        text_en: questionTextEn,
        text_pt: questionTextPt,
        options: (q.options || []).map(o => {
          const optionTextEs = o.text || "";
          const optionTextEn = o.text_en || "";
          const optionTextPt = o.text_pt || "";
          return {
            score: o.score,
            text_es: optionTextEs,
            text_en: optionTextEn,
            text_pt: optionTextPt
          };
        }),
        recommendation_es: recommendationEs,
        recommendation_en: recommendationEn,
        recommendation_pt: recommendationPt,
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
  localStorage.setItem("ageFriendQuestionsInitialized_v6", "true");
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
