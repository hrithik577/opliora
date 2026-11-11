/**
 * OPLIORA PRIVATE LIMITED — Server-Side Contact Delivery API
 * Compatible with Vercel Serverless Functions and local Node.js server.
 *
 * Implements:
 * - Nodemailer with Gmail SMTP
 * - Input sanitization & validation
 * - Anti-spam honeypot verification
 * - Sliding window in-memory rate limiting
 * - Reply-To configured to sender's validated corporate email
 * - Environment variable authentication (GMAIL_USER, GMAIL_APP_PASSWORD, CONTACT_RECIPIENT)
 */

const nodemailer = require("nodemailer");

// Simple in-memory rate limiting (IP-based, 5 submissions per 15 minutes)
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 5;
const ipSubmissions = new Map();

function cleanOldRateLimits() {
  const now = Date.now();
  for (const [ip, data] of ipSubmissions.entries()) {
    if (now - data.firstRequest > RATE_LIMIT_WINDOW_MS) {
      ipSubmissions.delete(ip);
    }
  }
}

// Sanitize user inputs to prevent HTML/script injection
function sanitizeText(str) {
  if (typeof str !== "string") return "";
  return str
    .replace(/[<>]/g, "") // strip angle brackets
    .trim();
}

module.exports = async function handler(req, res) {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ success: false, error: "Method not allowed. Use POST." }));
    return;
  }

  // Parse body if not already parsed (for pure Node.js environments)
  let body = req.body;
  if (!body || typeof body === "string") {
    try {
      body = JSON.parse(body || "{}");
    } catch {
      res.statusCode = 400;
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ success: false, error: "Invalid JSON payload." }));
      return;
    }
  }

  // Rate Limiting
  cleanOldRateLimits();
  const clientIp =
    req.headers["x-forwarded-for"] ||
    req.headers["x-real-ip"] ||
    req.socket?.remoteAddress ||
    "unknown";

  const clientData = ipSubmissions.get(clientIp) || { count: 0, firstRequest: Date.now() };
  if (clientData.count >= MAX_REQUESTS_PER_WINDOW) {
    res.statusCode = 429;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        success: false,
        error: "Too many submissions from this connection. Please try again in a few minutes or email oplioraprivatelimited@gmail.com directly.",
      })
    );
    return;
  }
  clientData.count++;
  ipSubmissions.set(clientIp, clientData);

  // 1. Anti-Spam Honeypot Verification
  if (body._gotcha_company_trap) {
    // Silently drop spam bot
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ success: true, message: "Enquiry registered." }));
    return;
  }

  // 2. Extract and Sanitize Fields
  const name = sanitizeText(body.name);
  const email = sanitizeText(body.email).toLowerCase();
  const subjectCategory = sanitizeText(body.subject);
  const message = sanitizeText(body.message);

  // 3. Server-Side Validation
  if (!name || name.length < 2) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ success: false, error: "Please provide a valid full name (minimum 2 characters)." }));
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!email || !emailRegex.test(email)) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ success: false, error: "Please provide a valid corporate email address." }));
    return;
  }

  if (!message || message.length < 10) {
    res.statusCode = 400;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ success: false, error: "Message must contain at least 10 characters." }));
    return;
  }

  // Subject line mapping
  const subjectMap = {
    corporate: "Corporate Enquiry — Opliora Private Limited",
    partnership: "Business Partnership Proposal — Opliora Ecosystem",
    proposal: "Business Proposal — Opliora Private Limited",
    career: "Career & Leadership Enquiry — Opliora Ecosystem",
    general: "General Corporate Inquiries — Opliora Private Limited",
  };
  const emailSubject = subjectMap[subjectCategory] || "Corporate Communication — Opliora Private Limited";

  // 4. Check Environment Variables for Gmail SMTP
  const gmailUser = process.env.GMAIL_USER || "oplioraprivatelimited@gmail.com";
  const gmailPass = process.env.GMAIL_APP_PASSWORD;
  const recipient = process.env.CONTACT_RECIPIENT || "oplioraprivatelimited@gmail.com";

  const fallbackMailto = `mailto:${recipient}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(
    `From: ${name} (${email})\n\nMessage:\n${message}`
  )}`;

  if (!gmailPass) {
    console.warn("✦ GMAIL_APP_PASSWORD is not set in environment variables. Email cannot be delivered automatically.");
    res.statusCode = 503;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        success: false,
        configured: false,
        error:
          "SMTP delivery credentials (GMAIL_APP_PASSWORD) are not yet configured on this server. Please use the direct mailto channel or configure your Gmail App Password.",
        fallbackMailto,
        recipient,
      })
    );
    return;
  }

  // 5. Send via Gmail SMTP with Nodemailer
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // SSL
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });

    const mailOptions = {
      from: `"Opliora Inquiries Portal" <${gmailUser}>`,
      to: recipient,
      replyTo: `${name} <${email}>`,
      subject: `[Opliora Portal] ${emailSubject} from ${name}`,
      text: `OPLIORA PRIVATE LIMITED — INCOMING ENQUIRY\n` +
            `==================================================\n\n` +
            `Sender Name:     ${name}\n` +
            `Sender Email:    ${email}\n` +
            `Enquiry Type:    ${emailSubject}\n` +
            `Submitted At:    ${new Date().toUTCString()}\n` +
            `IP Connection:   ${clientIp}\n\n` +
            `MESSAGE / PROPOSAL:\n` +
            `--------------------------------------------------\n` +
            `${message}\n\n` +
            `==================================================\n` +
            `To reply directly to ${name}, simply click 'Reply' in your email client.`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
          <div style="background: #0A1628; padding: 24px; text-align: center;">
            <h2 style="color: #ffffff; margin: 0; font-size: 20px; letter-spacing: 2px;">OPLIORA PRIVATE LIMITED</h2>
            <p style="color: #20C4E4; margin: 6px 0 0; font-size: 12px; letter-spacing: 1px; text-transform: uppercase;">A Group of Businesses. One Vision.</p>
          </div>
          <div style="padding: 28px;">
            <div style="background: #f8fafc; border-left: 4px solid #20C4E4; padding: 14px 18px; margin-bottom: 24px;">
              <p style="margin: 0; color: #475569; font-size: 13px;">New Enquiry via Website Portal</p>
              <h3 style="margin: 4px 0 0; color: #0A1628; font-size: 16px;">${emailSubject}</h3>
            </div>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-size: 14px; width: 140px;"><strong>Sender Name:</strong></td>
                <td style="padding: 8px 0; color: #0f172a; font-size: 14px;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-size: 14px;"><strong>Corporate Email:</strong></td>
                <td style="padding: 8px 0; color: #0f172a; font-size: 14px;"><a href="mailto:${email}" style="color: #0284c7; text-decoration: none;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-size: 14px;"><strong>Date / Time:</strong></td>
                <td style="padding: 8px 0; color: #0f172a; font-size: 14px;">${new Date().toUTCString()}</td>
              </tr>
            </table>
            <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 18px;">
              <h4 style="margin: 0 0 10px; color: #0A1628; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Message / Proposal:</h4>
              <p style="margin: 0; color: #334155; font-size: 15px; line-height: 1.7; white-space: pre-wrap;">${message}</p>
            </div>
          </div>
          <div style="background: #f1f5f9; padding: 16px 24px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0; color: #64748b; font-size: 12px;">Reply directly to this email to contact <strong>${name}</strong> (${email}).</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        success: true,
        configured: true,
        message: "Your enquiry has been successfully transmitted to Opliora Private Limited executive leadership.",
      })
    );
  } catch (err) {
    console.error("✦ Nodemailer SMTP transmission error:", err);
    res.statusCode = 500;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        success: false,
        error: "Failed to transmit message through Gmail SMTP. Please contact oplioraprivatelimited@gmail.com directly.",
        details: process.env.NODE_ENV === "development" ? err.message : undefined,
        fallbackMailto,
      })
    );
  }
};

