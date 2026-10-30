/**
 * VERCEL SERVERLESS FUNCTION: /api/contact
 * Handles contact form submissions for Aman Gupt's Portfolio.
 * Validates data, sanitizes inputs, applies honeypot spam protection,
 * and delivers email via Resend, Nodemailer SMTP, or EmailJS.
 */

// HTML sanitization helper to prevent HTML injection in emails
function sanitize(str) {
    if (typeof str !== 'string') return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function isValidEmail(email) {
    return typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

module.exports = async function handler(req, res) {
    // CORS & Method Handling
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            error: 'Method Not Allowed. Please send a POST request.'
        });
    }

    try {
        let body = req.body;
        if (typeof body === 'string') {
            try {
                body = JSON.parse(body);
            } catch (e) {
                return res.status(400).json({ success: false, error: 'Malformed JSON payload.' });
            }
        }
        body = body || {};

        const { name, email, subject, message, _gotcha } = body;

        // 1. Spam honeypot detection
        if (_gotcha && String(_gotcha).trim().length > 0) {
            // Silently return success to mislead spambots without sending email
            return res.status(200).json({
                success: true,
                message: "Thank you for reaching out! Your message has been sent successfully. I'll get back to you soon."
            });
        }

        // 2. Server-side validation
        const trimmedName = typeof name === 'string' ? name.trim() : '';
        const trimmedEmail = typeof email === 'string' ? email.trim() : '';
        const trimmedSubject = typeof subject === 'string' ? subject.trim() : '';
        const trimmedMessage = typeof message === 'string' ? message.trim() : '';

        if (!trimmedName || trimmedName.length < 2 || trimmedName.length > 100) {
            return res.status(400).json({
                success: false,
                error: 'Please provide a valid full name (2–100 characters).'
            });
        }

        if (!isValidEmail(trimmedEmail)) {
            return res.status(400).json({
                success: false,
                error: 'Please provide a valid email address.'
            });
        }

        if (!trimmedSubject || trimmedSubject.length < 2 || trimmedSubject.length > 150) {
            return res.status(400).json({
                success: false,
                error: 'Please provide a valid subject (2–150 characters).'
            });
        }

        if (!trimmedMessage || trimmedMessage.length < 5 || trimmedMessage.length > 5000) {
            return res.status(400).json({
                success: false,
                error: 'Please provide a message between 5 and 5000 characters.'
            });
        }

        // 3. Prepare formatted data
        const safeName = sanitize(trimmedName);
        const safeEmail = sanitize(trimmedEmail);
        const safeSubject = sanitize(trimmedSubject);
        const safeMessage = sanitize(trimmedMessage).replace(/\n/g, '<br/>');

        const submissionDate = new Date().toLocaleString('en-US', {
            timeZone: 'Asia/Kolkata',
            dateStyle: 'full',
            timeStyle: 'medium'
        });

        const targetEmail = process.env.CONTACT_RECEIVER_EMAIL || 'amangupt7373@gmail.com';
        const emailSubject = `New Portfolio Contact: ${trimmedSubject}`;

        const textContent = `
NEW PORTFOLIO CONTACT MESSAGE
====================================
Date/Time: ${submissionDate} (IST)

Visitor Name:    ${trimmedName}
Visitor Email:   ${trimmedEmail}
Subject:         ${trimmedSubject}

Message:
------------------------------------
${trimmedMessage}
------------------------------------
Reply directly to this email to respond to ${trimmedName} (${trimmedEmail}).
`;

        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FAF8F6; margin: 0; padding: 24px; color: #1C1917; }
    .card { background: #FFFFFF; max-width: 600px; margin: 0 auto; border-radius: 12px; border: 1px solid rgba(123, 23, 52, 0.18); overflow: hidden; box-shadow: 0 4px 16px rgba(123, 23, 52, 0.08); }
    .header { background: #4A1024; color: #FFFFFF; padding: 24px; border-bottom: 3px solid #FF6A00; }
    .header h2 { margin: 0; font-size: 20px; font-weight: 700; }
    .header p { margin: 6px 0 0; font-size: 13px; color: #E295A8; }
    .content { padding: 24px; }
    .field { margin-bottom: 16px; }
    .label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #78716C; font-weight: 700; margin-bottom: 4px; }
    .value { font-size: 15px; color: #1C1917; font-weight: 600; }
    .message-box { background: #FAF8F6; padding: 16px; border-radius: 8px; border-left: 4px solid #FF6A00; font-size: 15px; line-height: 1.6; color: #292524; margin-top: 6px; }
    .footer { padding: 16px 24px; background: #FAF8F6; border-top: 1px solid #EAE5E0; font-size: 12px; color: #78716C; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h2>New Portfolio Contact Submission</h2>
      <p>Submitted via Aman Gupt's Portfolio Website on ${submissionDate}</p>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">From</div>
        <div class="value">${safeName} &lt;<a href="mailto:${safeEmail}">${safeEmail}</a>&gt;</div>
      </div>
      <div class="field">
        <div class="label">Subject</div>
        <div class="value">${safeSubject}</div>
      </div>
      <div class="field">
        <div class="label">Message</div>
        <div class="message-box">${safeMessage}</div>
      </div>
    </div>
    <div class="footer">
      Hit 'Reply' in your email client to respond directly to ${safeName} (${safeEmail}).
    </div>
  </div>
</body>
</html>
`;

        // 4. Send Email via Available Service

        // Provider A: Resend API
        if (process.env.RESEND_API_KEY) {
            const resendFrom = process.env.RESEND_FROM || 'Portfolio Contact <onboarding@resend.dev>';
            const resendResponse = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    from: resendFrom,
                    to: [targetEmail],
                    reply_to: trimmedEmail,
                    subject: emailSubject,
                    html: htmlContent,
                    text: textContent
                })
            });

            if (!resendResponse.ok) {
                const errData = await resendResponse.text();
                console.error('Resend delivery error:', errData);
                return res.status(502).json({
                    success: false,
                    error: "Sorry, your message couldn't be sent. Please try again or contact me directly by email."
                });
            }

            return res.status(200).json({
                success: true,
                message: "Thank you for reaching out! Your message has been sent successfully. I'll get back to you soon."
            });
        }

        // Provider B: Nodemailer SMTP
        const smtpHost = process.env.SMTP_HOST;
        const smtpUser = process.env.SMTP_USER;
        const smtpPass = process.env.SMTP_PASS;

        if (smtpHost && smtpUser && smtpPass) {
            let nodemailer;
            try {
                nodemailer = require('nodemailer');
            } catch (err) {
                console.error('Nodemailer package not installed:', err);
            }

            if (nodemailer) {
                const transporter = nodemailer.createTransport({
                    host: smtpHost,
                    port: parseInt(process.env.SMTP_PORT || '465', 10),
                    secure: process.env.SMTP_SECURE !== 'false',
                    auth: {
                        user: smtpUser,
                        pass: smtpPass
                    }
                });

                await transporter.sendMail({
                    from: `"Portfolio Contact" <${smtpUser}>`,
                    to: targetEmail,
                    replyTo: trimmedEmail,
                    subject: emailSubject,
                    text: textContent,
                    html: htmlContent
                });

                return res.status(200).json({
                    success: true,
                    message: "Thank you for reaching out! Your message has been sent successfully. I'll get back to you soon."
                });
            }
        }

        // Provider C: EmailJS REST API
        if (process.env.EMAILJS_PRIVATE_KEY && process.env.EMAILJS_SERVICE_ID && process.env.EMAILJS_TEMPLATE_ID) {
            const emailjsResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    service_id: process.env.EMAILJS_SERVICE_ID,
                    template_id: process.env.EMAILJS_TEMPLATE_ID,
                    user_id: process.env.EMAILJS_PUBLIC_KEY || '',
                    accessToken: process.env.EMAILJS_PRIVATE_KEY,
                    template_params: {
                        from_name: trimmedName,
                        from_email: trimmedEmail,
                        reply_to: trimmedEmail,
                        to_email: targetEmail,
                        subject: emailSubject,
                        message: trimmedMessage,
                        submission_date: submissionDate
                    }
                })
            });

            if (!emailjsResponse.ok) {
                const errData = await emailjsResponse.text();
                console.error('EmailJS delivery error:', errData);
                return res.status(502).json({
                    success: false,
                    error: "Sorry, your message couldn't be sent. Please try again or contact me directly by email."
                });
            }

            return res.status(200).json({
                success: true,
                message: "Thank you for reaching out! Your message has been sent successfully. I'll get back to you soon."
            });
        }

        // If no credentials configured in environment
        console.warn('No email provider credentials found in environment variables.');
        return res.status(503).json({
            success: false,
            error: "Email service is not yet configured. Please configure your environment variables (e.g. RESEND_API_KEY or SMTP credentials) or email amangupt7373@gmail.com directly."
        });

    } catch (error) {
        console.error('Server error handling contact form:', error);
        return res.status(500).json({
            success: false,
            error: "Sorry, your message couldn't be sent. Please try again or contact me directly by email."
        });
    }
};

