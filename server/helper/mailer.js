const nodemailer = require('nodemailer');

const REQUIRED_ENV_VARS = ['EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_USER', 'EMAIL_PASS', 'EMAIL_FROM'];

// Typed errors so callers (userController) can decide the right HTTP status
// and public-facing message per failure class, instead of collapsing every
// failure into a swallowed console.error + fake "200 sent" response.
class MailError extends Error {
    constructor(message, meta = {}) {
        super(message);
        this.name = this.constructor.name;
        this.meta = meta; // sanitized only - never put secrets here
    }
}
class MailConfigError extends MailError {}
class MailAuthError extends MailError {}
class MailRejectedError extends MailError {}
class MailSendError extends MailError {}

let transporter = null;
let transporterIsDevPreview = false;
let cachedHasConfig = null;

function hasEmailConfig() {
    if (cachedHasConfig === null) {
        cachedHasConfig = REQUIRED_ENV_VARS.every((key) => !!process.env[key]);
    }
    return cachedHasConfig;
}

// Called once at boot. Warns (rather than throwing, unlike VNPAY) since a
// missing SMTP config shouldn't take down the whole app - only the
// forgot-password/email-notification flows fail (loudly, per-request) until
// it's set. See sendMail(), which now throws instead of silently no-op'ing.
function assertEmailConfig() {
    if (hasEmailConfig()) return true;
    const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
    console.warn(
        `Missing email environment variable(s): ${missing.join(', ')}. ` +
        'Password-reset and other transactional emails will fail until these are set ' +
        '(or EMAIL_DEV_PREVIEW=true is set for local-only preview - see .env.example).'
    );
    return false;
}

// Only reachable when EMAIL_DEV_PREVIEW=true and real config is absent. Uses
// nodemailer's Ethereal test-account service: a *real* SMTP endpoint that
// accepts the message and gives back a preview URL, but it is NOT the
// recipient's real inbox - nothing reaches `to` this way. This must never be
// used to satisfy "the user checked their real inbox" - only for local
// development when no real provider is configured yet.
async function createDevPreviewTransport() {
    const testAccount = await nodemailer.createTestAccount();
    const devTransport = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: { user: testAccount.user, pass: testAccount.pass },
    });
    console.warn(
        '[mailer] EMAIL_DEV_PREVIEW is active: emails are sent to a throwaway Ethereal ' +
        'inbox, NOT the real recipient. Set EMAIL_HOST/EMAIL_USER/EMAIL_PASS/etc. and unset ' +
        'EMAIL_DEV_PREVIEW to actually deliver to real addresses.'
    );
    return devTransport;
}

async function getTransporter() {
    if (transporter) return transporter;

    if (hasEmailConfig()) {
        const port = Number(process.env.EMAIL_PORT);
        const secure = process.env.EMAIL_SECURE != null
            ? process.env.EMAIL_SECURE === 'true'
            : port === 465;
        transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port,
            secure,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
        transporterIsDevPreview = false;
        return transporter;
    }

    if (process.env.EMAIL_DEV_PREVIEW === 'true' && process.env.NODE_ENV !== 'production') {
        transporter = await createDevPreviewTransport();
        transporterIsDevPreview = true;
        return transporter;
    }

    throw new MailConfigError(
        'Email is not configured on this server (missing EMAIL_HOST/EMAIL_PORT/EMAIL_USER/EMAIL_PASS/EMAIL_FROM).'
    );
}

// Maps a raw nodemailer/SMTP error onto our typed error classes so the
// controller can choose the right HTTP status without inspecting provider
// internals itself. Only pulls a small, non-secret whitelist of fields onto
// the error - never the raw error (which can otherwise carry connection
// strings/auth details in `err.message` for some transports).
function classifyMailError(err) {
    const meta = { code: err.code, responseCode: err.responseCode, command: err.command };
    if (err instanceof MailError) return err;
    if (err.code === 'EAUTH') {
        return new MailAuthError('Mail provider authentication failed', meta);
    }
    if (err.code === 'EENVELOPE') {
        return new MailRejectedError('Mail provider rejected the sender or recipient', meta);
    }
    return new MailSendError(err.message || 'Failed to send email', meta);
}

function buildFromHeader() {
    const address = process.env.EMAIL_FROM || 'no-reply@funcourse.local';
    const name = process.env.EMAIL_FROM_NAME;
    return name ? `"${name}" <${address}>` : address;
}

function htmlToPlainText(html) {
    return String(html || '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/(p|div|h[1-6])>/gi, '\n\n')
        .replace(/<[^>]+>/g, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

// Sends an email and only resolves once the provider has actually accepted
// it. Throws a typed MailError (never a bare success) on any failure -
// including a "successful" SMTP round-trip that rejected the recipient - so
// callers can never mistake "we tried" for "it was delivered to the inbox".
async function sendMail({ to, subject, html, text }) {
    const client = await getTransporter();

    let info;
    try {
        info = await client.sendMail({
            from: buildFromHeader(),
            to,
            subject,
            html,
            text: text || htmlToPlainText(html),
        });
    } catch (err) {
        throw classifyMailError(err);
    }

    if (info.rejected && info.rejected.length > 0) {
        throw new MailRejectedError('Mail provider rejected the recipient', {
            rejectedCount: info.rejected.length,
        });
    }

    return {
        messageId: info.messageId,
        accepted: info.accepted || [],
        rejected: info.rejected || [],
        simulated: transporterIsDevPreview,
        previewUrl: transporterIsDevPreview ? nodemailer.getTestMessageUrl(info) : null,
    };
}

// On-demand diagnostic (not run automatically at boot - a bad network path
// shouldn't crash every server start). Verifies auth/connectivity against
// the configured provider without sending anything. Never logs secrets.
async function verifyMailTransport() {
    if (!hasEmailConfig()) {
        return { ok: false, reason: 'not-configured' };
    }
    try {
        const client = await getTransporter();
        await client.verify();
        return { ok: true };
    } catch (err) {
        const classified = classifyMailError(err);
        return { ok: false, reason: classified.name, meta: classified.meta };
    }
}

module.exports = {
    sendMail,
    assertEmailConfig,
    verifyMailTransport,
    hasEmailConfig,
    MailError,
    MailConfigError,
    MailAuthError,
    MailRejectedError,
    MailSendError,
};
