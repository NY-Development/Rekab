import nodemailer, { Transporter } from 'nodemailer';
import { env } from '../configs/env';

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

let cachedTransporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, SENDER_EMAIL } = env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !SENDER_EMAIL) {
    return null;
  }
  if (!cachedTransporter) {
    cachedTransporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465,
      requireTLS: Number(SMTP_PORT) !== 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
  }
  return cachedTransporter;
}

function wrapHtml(subject: string, bodyLines: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>${escapeHtml(subject)}</title></head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:#f8fafc;color:#0f172a;">
  <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 10px 25px rgba(0,0,0,0.03);">
    <div style="background:linear-gradient(135deg,#3b1fd6 0%,#6366f1 100%);padding:28px 20px;text-align:center;">
      <h1 style="margin:0;font-size:26px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">NYDEV Learning</h1>
      <p style="margin:5px 0 0;color:rgba(255,255,255,0.85);font-size:13px;font-weight:500;">Learning Management Platform</p>
    </div>
    <div style="padding:36px 30px;">
      <h2 style="font-size:20px;font-weight:700;margin:0 0 20px;color:#0f172a;">${escapeHtml(subject)}</h2>
      <div style="font-size:15px;line-height:1.6;color:#334155;">${bodyLines}</div>
    </div>
    <div style="padding:18px 30px;background:#f1f5f9;border-top:1px solid #e2e8f0;text-align:center;font-size:12px;color:#64748b;">
      NYDEV Learning · nydevofficial@gmail.com · 0902142767
    </div>
  </div>
</body>
</html>`;
}

/**
 * Sends an HTML email via Brevo SMTP. When SMTP is not configured, it logs the
 * message and returns false so callers can degrade gracefully (notifications
 * never block the request that triggered them).
 */
export async function sendEmail(to: string | string[], subject: string, text: string): Promise<boolean> {
  const transporter = getTransporter();
  const recipients = Array.isArray(to) ? to.join(', ') : to;

  if (!transporter) {
    // eslint-disable-next-line no-console
    console.warn(`[email] SMTP not configured — would send to ${recipients}: ${subject}`);
    return false;
  }

  const bodyHtml = escapeHtml(text)
    .split('\n')
    .map((line) => (line.trim() ? `<p style="margin:0 0 12px;">${line}</p>` : '<br/>'))
    .join('');

  try {
    await transporter.sendMail({
      from: `"NYDEV Learning" <${env.SENDER_EMAIL}>`,
      to: recipients,
      subject,
      text,
      html: wrapHtml(subject, bodyHtml),
    });
    return true;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[email] send failed:', (err as Error).message);
    return false;
  }
}

export async function sendHtmlEmail(to: string | string[], subject: string, htmlContent: string): Promise<boolean> {
  const transporter = getTransporter();
  const recipients = Array.isArray(to) ? to.join(', ') : to;

  if (!transporter) {
    // eslint-disable-next-line no-console
    console.warn(`[email] SMTP not configured — would send HTML to ${recipients}: ${subject}`);
    return false;
  }

  const emailBody = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>${escapeHtml(subject)}</title></head>
<body style="margin:0;padding:0;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;background-color:#f8fafc;color:#0f172a;">
  <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 10px 25px rgba(0,0,0,0.03);">
    <div style="background:linear-gradient(135deg,#3b1fd6 0%,#6366f1 100%);padding:28px 20px;text-align:center;">
      <img src="cid:nydev-logo" alt="NYDEV Logo" style="height:50px;margin-bottom:10px;vertical-align:middle;border-radius:50%" />
      <h1 style="margin:0;font-size:26px;font-weight:800;color:#ffffff;letter-spacing:-0.5px;">NYDEV Learning</h1>
      <p style="margin:5px 0 0;color:rgba(255,255,255,0.85);font-size:13px;font-weight:500;">Learning Management Platform</p>
    </div>
    <div style="padding:36px 30px;">
      <h2 style="font-size:20px;font-weight:700;margin:0 0 20px;color:#0f172a;">${escapeHtml(subject)}</h2>
      <div style="font-size:15px;line-height:1.6;color:#334155;">${htmlContent}</div>
    </div>
    <div style="padding:18px 30px;background:#f1f5f9;border-top:1px solid #e2e8f0;text-align:center;font-size:12px;color:#64748b;">
      NYDEV Learning · nydevofficial@gmail.com · 0902142767 | 0945774044
    </div>
  </div>
</body>
</html>`;

  const fs = require('fs');
  const path = require('path');
  
  // Try __dirname-relative path first, then project root-relative path
  const logoPathDev = path.join(__dirname, '../assets/logo.png');
  const logoPathProd = path.join(process.cwd(), 'src/assets/logo.png');
  
  let finalLogoPath: string | null = null;
  if (fs.existsSync(logoPathDev)) {
    finalLogoPath = logoPathDev;
  } else if (fs.existsSync(logoPathProd)) {
    finalLogoPath = logoPathProd;
  }

  const attachments: any[] = [];
  if (finalLogoPath) {
    attachments.push({
      filename: 'logo.png',
      path: finalLogoPath,
      cid: 'nydev-logo'
    });
  }

  try {
    await transporter.sendMail({
      from: `"NYDEV Learning" <${env.SENDER_EMAIL}>`,
      to: recipients,
      subject,
      html: emailBody,
      attachments,
    });
    return true;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[email] sendHtml failed:', (err as Error).message);
    return false;
  }
}
