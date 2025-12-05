// backend/lib/emailClient.js
import nodemailer from "nodemailer";

function requireEnv(name, fallback = null) {
  const v = process.env[name];
  if (!v && !fallback) {
    throw new Error(`Missing env var: ${name}`);
  }
  return (v || fallback).trim();
}

const SMTP_HOST = requireEnv("SMTP_HOST", "smtp.gmail.com");
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_USER = requireEnv("SMTP_USER");
const SMTP_PASS = requireEnv("SMTP_PASS");
const SMTP_FROM = process.env.SMTP_FROM || SMTP_USER;

// create transporter
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465, // false for 587 / TLS
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

/**
 * Low-level send
 */
export async function sendEmail({ to, subject, text, html }) {
  if (!to) throw new Error("sendEmail: 'to' is required");
  if (!subject) throw new Error("sendEmail: 'subject' is required");

  const mailOptions = {
    from: SMTP_FROM,
    to,
    subject,
    text: text || "",
    html: html || undefined,
  };

  // In staging we log but don't crash the app if sending fails
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("[email] sent:", subject, "→", to, "id:", info.messageId);
    return info;
  } catch (err) {
    console.error("[email] send failed:", subject, "→", to, err);
    throw err;
  }
}

/* ============================================
   Boutique-specific helpers
============================================ */

function formatItems(items) {
  if (!Array.isArray(items) || items.length === 0) return "None specified";
  return items.join(", ");
}

export async function sendBoutiqueRequestSubmittedEmail(request) {
  if (!request?.requester_email) return;

  const {
    requester_name,
    requester_email,
    delivery_method,
    for_whom,
    items,
    city,
    postal_code,
    id,
  } = request;

  const delivery =
    delivery_method === "clinic_pickup"
      ? "Clinic pick-up"
      : "Home delivery";

  const subject = "HopeSpring – Boutique request received";

  const text = `
Hi ${requester_name || "there"},

We have received your boutique request (#${id}) for:
Items: ${formatItems(items)}
For: ${for_whom === "relative_or_friend" ? "Relative or friend" : "Yourself"}
Delivery method: ${delivery}
Location: ${city || "-"}, ${postal_code || "-"}

Our team will review your request and contact you if we need any additional information.
You can also contact HopeSpring if you have questions about this request.

Thank you,
HopeSpring Cancer Support Centre
`;

  const html = `
<p>Hi ${requester_name || "there"},</p>
<p>We have received your boutique request <strong>#${id}</strong>.</p>
<ul>
  <li><strong>Items:</strong> ${formatItems(items)}</li>
  <li><strong>For:</strong> ${
    for_whom === "relative_or_friend" ? "Relative or friend" : "Yourself"
  }</li>
  <li><strong>Delivery method:</strong> ${delivery}</li>
  <li><strong>Location:</strong> ${city || "-"}, ${postal_code || "-"}</li>
</ul>
<p>Our team will review your request and contact you if we need any additional information.</p>
<p>Thank you,<br/>HopeSpring Cancer Support Centre</p>
`;

  // best-effort – if this throws, caller will catch & log
  await sendEmail({
    to: requester_email,
    subject,
    text,
    html,
  });
}

export async function sendBoutiqueStatusUpdateEmail(request) {
  if (!request?.requester_email) return;

  const { requester_name, requester_email, status, id } = request;

  let friendlyStatus = status;
  if (status === "in_progress") friendlyStatus = "In progress";
  if (status === "completed") friendlyStatus = "Completed";
  if (status === "cancelled") friendlyStatus = "Cancelled";

  const subject = `HopeSpring – Boutique request #${id} status: ${friendlyStatus}`;

  const text = `
Hi ${requester_name || "there"},

The status of your HopeSpring boutique request (#${id}) has been updated to:

Status: ${friendlyStatus}

If you have any questions about this request, please contact HopeSpring.

Thank you,
HopeSpring Cancer Support Centre
`;

  const html = `
<p>Hi ${requester_name || "there"},</p>
<p>The status of your HopeSpring boutique request <strong>#${id}</strong> has been updated.</p>
<p><strong>Status:</strong> ${friendlyStatus}</p>
<p>If you have any questions about this request, please contact HopeSpring.</p>
<p>Thank you,<br/>HopeSpring Cancer Support Centre</p>
`;

  await sendEmail({
    to: requester_email,
    subject,
    text,
    html,
  });
}
