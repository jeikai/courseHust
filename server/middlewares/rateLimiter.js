const rateLimit = require('express-rate-limit');

// IP-based throttle for the forgot-password flow. Per-email throttling is
// handled separately in userController (resend cooldown + code attempt cap).
exports.forgotPasswordLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many requests. Please try again later.' },
});

exports.verifyResetCodeLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many requests. Please try again later.' },
});
