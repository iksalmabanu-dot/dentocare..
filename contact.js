/**
 * /api/contact.js
 * Vercel Serverless Function — D Care Dental contact form handler
 *
 * POST /api/contact
 * Body: { name, phone, email, service, message }
 *
 * To send real emails, uncomment the nodemailer section and
 * set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CLINIC_EMAIL
 * in your Vercel Environment Variables.
 */

// Uncomment to enable real email sending via nodemailer:
// const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
  // ── CORS headers (allow same-origin; adjust as needed) ──
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed.' });
  }

  // ── Parse body ──
  const { name, phone, email, service, message } = req.body || {};

  // ── Server-side validation ──
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push('Full name must be at least 2 characters.');
  }

  const digits = (phone || '').replace(/\D/g, '');
  if (!/^[6-9]\d{9}$/.test(digits)) {
    errors.push('Phone must be a valid 10-digit Indian mobile number.');
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('A valid email address is required.');
  }

  if (!message || message.trim().length < 10) {
    errors.push('Message must be at least 10 characters.');
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors.join(' '), errors });
  }

  // ── Sanitise ──
  const submission = {
    name:      name.trim(),
    phone:     digits,
    email:     email.trim().toLowerCase(),
    service:   service || 'Not specified',
    message:   message.trim(),
    submittedAt: new Date().toISOString(),
    ip:        req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown',
  };

  // ── Log submission (replace with DB write, email, or webhook in production) ──
  console.log('[D Care Dental] New appointment request:', JSON.stringify(submission, null, 2));

  // ── [OPTIONAL] Send email notification via Nodemailer ──
  // Uncomment and configure the block below to enable:
  /*
  try {
    const transporter = nodemailer.createTransport({
      host:   process.env.SMTP_HOST,
      port:   Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from:    `"D Care Dental Website" <${process.env.SMTP_USER}>`,
      to:      process.env.CLINIC_EMAIL,           // e.g. info@dcaredental.in
      replyTo: submission.email,
      subject: `New Appointment Request — ${submission.name}`,
      html: `
        <h2 style="color:#0ea5a4;">New Appointment Request</h2>
        <table cellpadding="8" style="border-collapse:collapse; width:100%; max-width:500px;">
          <tr><td><strong>Name</strong></td><td>${submission.name}</td></tr>
          <tr><td><strong>Phone</strong></td><td>${submission.phone}</td></tr>
          <tr><td><strong>Email</strong></td><td>${submission.email}</td></tr>
          <tr><td><strong>Service</strong></td><td>${submission.service}</td></tr>
          <tr><td><strong>Message</strong></td><td>${submission.message}</td></tr>
          <tr><td><strong>Submitted At</strong></td><td>${submission.submittedAt}</td></tr>
        </table>
      `,
    });
  } catch (emailErr) {
    console.error('[D Care Dental] Email send failed:', emailErr);
    // Don't block success response on email failure
  }
  */

  // ── [OPTIONAL] Webhook to Slack / WhatsApp ──
  /*
  if (process.env.SLACK_WEBHOOK_URL) {
    await fetch(process.env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `🦷 *New appointment request*\n*Name:* ${submission.name}\n*Phone:* ${submission.phone}\n*Email:* ${submission.email}\n*Service:* ${submission.service}\n*Message:* ${submission.message}`,
      }),
    });
  }
  */

  return res.status(200).json({
    success: true,
    message: 'Your appointment request has been received. We will contact you shortly.',
  });
};
