const crypto = require('crypto');

const REQUIRED_ENV_VARS = [
    'VNPAY_TMNCODE',
    'VNPAY_SECRETKEY',
    'VNPAY_URL',
    'VNPAY_RETURNURL',
];

// Fails fast at boot instead of silently generating a broken/unsigned
// payment URL the first time a customer tries to pay.
function assertVnpayConfig() {
    const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
    if (missing.length) {
        throw new Error(
            `Missing required VNPAY environment variable(s): ${missing.join(', ')}`
        );
    }
    if (!process.env.VNPAY_IPNURL) {
        console.warn(
            'VNPAY_IPNURL is not set - VNPAY will not be able to reach an IPN endpoint ' +
            '(expected on a public HTTPS backend, e.g. https://<backend-domain>/api/vnpay/ipn). ' +
            'Payment confirmation will only happen via the browser return URL, which VNPAY does ' +
            'not treat as authoritative.'
        );
    }
}

function getConfig() {
    return {
        tmnCode: process.env.VNPAY_TMNCODE,
        secretKey: process.env.VNPAY_SECRETKEY,
        paymentUrl: process.env.VNPAY_URL,
        returnUrl: process.env.VNPAY_RETURNURL,
        ipnUrl: process.env.VNPAY_IPNURL || null,
    };
}

// Never log the real value - only enough to eyeball "is this the TMN code I think it is".
function maskTmnCode(tmnCode) {
    if (!tmnCode) return '(missing)';
    if (tmnCode.length <= 4) return '*'.repeat(tmnCode.length);
    return tmnCode.slice(0, 2) + '*'.repeat(tmnCode.length - 4) + tmnCode.slice(-2);
}

// VNPAY's signing spec (per VNPAY's own reference implementation): keys
// sorted ascending, values percent-encoded with spaces as "+" (the older
// application/x-www-form-urlencoded convention, not plain encodeURIComponent),
// joined as key=value&key=value, THEN HMAC-SHA512'd. Empty/undefined/null
// optional fields (e.g. vnp_BankCode when the user didn't pick a bank) must
// be omitted entirely rather than signed as the literal string "undefined".
function sortObject(obj) {
    const sorted = {};
    const keys = Object.keys(obj)
        .filter((key) => obj[key] !== undefined && obj[key] !== null && obj[key] !== '')
        .sort();
    for (const key of keys) {
        sorted[key] = encodeURIComponent(obj[key].toString()).replace(/%20/g, '+');
    }
    return sorted;
}

function buildSignData(params) {
    // vnp_SecureHash / vnp_SecureHashType must never be part of the signed data.
    const { vnp_SecureHash, vnp_SecureHashType, ...rest } = params;
    const sorted = sortObject(rest);
    return Object.entries(sorted)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');
}

// Builds the final query string for the outgoing VNPAY URL, including
// vnp_SecureHash. Same key sort + encoding rules as buildSignData so the
// URL VNPAY receives is byte-consistent with what was signed.
function buildQueryString(paramsWithHash) {
    const sorted = sortObject(paramsWithHash);
    return Object.entries(sorted)
        .map(([key, value]) => `${key}=${value}`)
        .join('&');
}

function signParams(params, secretKey) {
    const signData = buildSignData(params);
    const hmac = crypto.createHmac('sha512', secretKey);
    return hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
}

function verifySignature(params, secretKey) {
    const receivedHash = params.vnp_SecureHash;
    if (!receivedHash) return false;
    const expectedHash = signParams(params, secretKey);
    // Constant-time comparison - a signature check is a textbook timing-attack target.
    const a = Buffer.from(receivedHash, 'hex');
    const b = Buffer.from(expectedHash, 'hex');
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
}

// VNPAY expects amounts multiplied by 100 (no decimal subunit for VND).
function toVnpAmount(vndAmount) {
    return Math.round(vndAmount) * 100;
}

function fromVnpAmount(vnpAmount) {
    return Math.round(Number(vnpAmount) / 100);
}

// VNPAY timestamps are always Vietnam local time (UTC+7), regardless of the
// server/container's own timezone (Docker/Render often run UTC).
function formatVnpDate(date) {
    const vnTime = new Date(date.getTime() + 7 * 60 * 60 * 1000);
    const pad = (n) => String(n).padStart(2, '0');
    return (
        vnTime.getUTCFullYear().toString() +
        pad(vnTime.getUTCMonth() + 1) +
        pad(vnTime.getUTCDate()) +
        pad(vnTime.getUTCHours()) +
        pad(vnTime.getUTCMinutes()) +
        pad(vnTime.getUTCSeconds())
    );
}

module.exports = {
    assertVnpayConfig,
    getConfig,
    maskTmnCode,
    sortObject,
    buildSignData,
    buildQueryString,
    signParams,
    verifySignature,
    toVnpAmount,
    fromVnpAmount,
    formatVnpDate,
};
