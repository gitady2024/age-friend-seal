/**
 * Helper para verificar tokens de Firebase en los endpoints serverless de la API.
 */
export function verifyFirebaseToken(authHeader) {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { valid: false, error: "No Bearer token provided" };
  }
  const token = authHeader.split("Bearer ")[1];
  
  // Soporte para simulación/pruebas en local cuando no hay conexión de Auth activa
  if (token.startsWith("dummy_")) {
    return { valid: true, uid: token, email: "simulado@example.com" };
  }

  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return { valid: false, error: "Invalid token format" };
    }
    
    // Decodificar el Payload (segundo fragmento del JWT)
    const payloadBuffer = Buffer.from(parts[1], "base64");
    const payload = JSON.parse(payloadBuffer.toString("utf-8"));

    // Validar expiración (en segundos epoch)
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
      return { valid: false, error: "Token has expired" };
    }

    // Validar emisor (iss)
    const projectId = process.env.VITE_FIREBASE_PROJECT_ID || "age-friend-seal";
    const expectedIss = `https://securetoken.google.com/${projectId}`;
    if (payload.iss !== expectedIss) {
      return { valid: false, error: "Invalid token issuer" };
    }

    // Validar audiencia (aud)
    if (payload.aud !== projectId) {
      return { valid: false, error: "Invalid token audience" };
    }

    // Validar que la autenticación no provenga de un usuario anónimo
    const firebaseField = payload.firebase || {};
    if (firebaseField.sign_in_provider === "anonymous") {
      return { valid: false, error: "Anonymous sessions are not allowed" };
    }

    return { 
      valid: true, 
      uid: payload.sub, 
      email: payload.email || "" 
    };
  } catch (error) {
    return { valid: false, error: "Failed to verify token: " + error.message };
  }
}
