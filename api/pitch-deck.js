// Vercel Serverless Function: /api/pitch-deck
// Redirects leads/prospects to the Pitch Deck HTML presentation with a unique request token for Brevo automation

export default function handler(req, res) {
  const query = req.query || {};
  const email = query.email || query.lead || query.id || '';
  let token = query.token || query.ref || query.code || '';

  // If no token was provided, generate a unique random 10-character token + timestamp
  if (!token) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randStr = '';
    for (let i = 0; i < 10; i++) {
      randStr += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const timestamp = Date.now().toString(36);
    token = `${randStr}_${timestamp}`;
  }

  // Construct target URL with unique query parameter
  let redirectUrl = `/Pitch_B2B_Age_Friend_Seal_t7Y2pM.html?token=${encodeURIComponent(token)}`;
  if (email) {
    redirectUrl += `&ref=${encodeURIComponent(email)}`;
  }

  // Perform 302 temporary redirect to the pitch deck
  res.writeHead(302, { Location: redirectUrl });
  res.end();
}
