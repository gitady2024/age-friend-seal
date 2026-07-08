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
