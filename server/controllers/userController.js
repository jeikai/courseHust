const crypto = require('crypto');
const userModel = require('../models/User');
const tokenModel = require('../models/Token');
const passwordResetModel = require('../models/PasswordReset');
const utility = require('../helper/utility');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { refresh } = require('./tokenController');
const {
  sendMail,
  MailConfigError,
  MailAuthError,
  MailRejectedError,
  MailSendError,
} = require('../helper/mailer');
const {
  passwordResetCodeEmail,
  passwordResetCodeEmailText,
  passwordChangedEmail,
} = require('../helper/emailTemplates');

const RESET_CODE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const RESET_TOKEN_TTL_MS = 10 * 60 * 1000; // 10 minutes
const RESET_CODE_MAX_ATTEMPTS = 5;
const RESET_RESEND_COOLDOWN_MS = 60 * 1000; // 60 seconds

// Generic, enumeration-safe response - never reveals whether the email
// actually maps to an account. expiresInMinutes is static config (not
// account-derived) so including it here keeps the frontend's countdown copy
// synced with the real backend TTL instead of a separately hardcoded value.
const GENERIC_FORGOT_PASSWORD_RESPONSE = {
  message: 'If an account with that email exists, a verification code has been sent to it.',
  expiresInMinutes: RESET_CODE_TTL_MS / 60000,
};
const GENERIC_INVALID_CODE_RESPONSE = { message: 'Invalid or expired verification code' };
const GENERIC_INVALID_SESSION_RESPONSE = { message: 'Invalid or expired reset session. Please start over.' };

exports.register = async function (req, res) {
  try {
    const data = req.body;
    // utility.validate(data, ['email', 'password', 'name'])
    console.log(data);
    const checkEmail = await userModel.get(data);
    if (checkEmail)
      return res.status(400).json({
        message: 'Account existed! Please try with a different email',
      });
    console.log('check done');
    const newUser = await userModel.create(data);
    if (newUser.error)
      return res.status(500).json({ message: 'Failed to register' });
    console.log('create done');
    const { JWT_SECRET_ACCESS_TOKEN, JWT_EXPRIRE_ACCESS_TOKEN } = process.env;
    console.log(JWT_SECRET_ACCESS_TOKEN, JWT_EXPRIRE_ACCESS_TOKEN);
    const token = jwt.sign(
      {
        _id: newUser._id,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role,
      },
      JWT_SECRET_ACCESS_TOKEN,
      { expiresIn: JWT_EXPRIRE_ACCESS_TOKEN }
    );
    await tokenModel.create(newUser._id, token);
    return res.status(200).json({
      message: 'Register successfully',
      account: newUser,
      authenticated: token,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: e.message });
  }
};

exports.login = async function (req, res) {
  try {
    const data = req.body;
    utility.validate(data, ['email', 'password']);

    const checkUser = await userModel.get(data);
    if (!checkUser)
      return res.status(500).json({ message: 'Account not exist' });

    const checkPassword = await bcrypt.compare(
      data.password,
      checkUser.password
    );
    if (!checkPassword)
      return res.status(400).json({ message: 'Incorrect email or password' });
    const {
      JWT_SECRET_ACCESS_TOKEN,
      JWT_EXPRIRE_ACCESS_TOKEN,
      JWT_SECRET_REFRESH_TOKEN,
    } = process.env;
    // Create refresh token
    const refreshTokenPayload = {
      _id: checkUser._id,
      iat: Math.floor(Date.now() / 1000),
    };
    const refreshToken = jwt.sign(
      refreshTokenPayload,
      JWT_SECRET_REFRESH_TOKEN,
      {
        expiresIn: JWT_EXPRIRE_ACCESS_TOKEN,
      }
    );
    // Create access token

    const token = jwt.sign(
      {
        _id: checkUser._id,
        email: checkUser.email,
        password: checkUser.password,
        role: checkUser.role,
      },
      JWT_SECRET_ACCESS_TOKEN,
      { expiresIn: JWT_EXPRIRE_ACCESS_TOKEN }
    );
    const checkToken = await tokenModel.get(checkUser._id);
    if (!checkToken) {
      await tokenModel.create(checkUser._id, token);
    } else {
      const data = {
        token: token,
        date_created: new Date(),
      };
      await tokenModel.update(checkUser._id, data);
    }

    return res.status(200).json({
      message: 'Login successfully',
      account: checkUser,
      authenticated: token,
      permission: checkUser.role,
      verified: checkUser.is_verified,
      refreshToken: refreshToken,
    });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

exports.get = async function (req, res) {
  try {
    const userId = req.params.userId;
    const data = { id: userId };

    const result = await userModel.get(data);
    if (result.error)
      return res.status(500).json({ message: 'Failed to find' });
    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

exports.getAll = async function (req, res) {
  try {
    const result = await userModel.getAll();
    if (result.error)
      return res.status(500).json({ message: 'Failed to find' });
    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

exports.update = async function (req, res) {
  try {
    const userId = req.params.userId;
    const { password, newpassword, ...rest } = req.body;
    const query = { id: userId };
    const checkUser = await userModel.get(query);
    if (!checkUser)
      return res.status(500).json({ message: 'Account not exist' });

    if (password) {
      const passwordMatch = await bcrypt.compare(password, checkUser.password);
      if (!passwordMatch)
        return res
          .status(400)
          .json({ message: 'Current password is incorrect' });

      if (newpassword) {
        rest.password = await bcrypt.hash(newpassword, 10);
      }
    }

    const result = await userModel.update(userId, rest);
    if (result.error)
      return res.status(500).json({ message: 'Failed to update' });

    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

exports.delete = async function (req, res) {
  try {
    const userId = req.params.userId;
    const result = await userModel.delete(userId);
    if (!result) return res.status(400).json({ message: 'Failed to delete' });
    return res.status(200).json(result);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

exports.updateVerify = async function (req, res) {
  try {
    const userId = req.params.userId;
    const result = await userModel.update(userId, { is_verified: true });
    if (result.error)
      return res.status(500).json({ message: 'Failed to verify user' });
    return res
      .status(200)
      .json({ message: 'User verified successfully', user: result });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

// Step 1+2 of the forgot-password flow: validate the email, and if an
// account exists for it, generate + email a single-use verification code.
// Always returns the same generic response regardless of whether the
// account exists, to avoid leaking which emails are registered.
exports.forgotPassword = async function (req, res) {
  try {
    const data = req.body;
    utility.validate(data, ['email']);
    const email = data.email.trim().toLowerCase();

    const user = await userModel.get({ email });
    if (!user || user.error) {
      return res.status(200).json(GENERIC_FORGOT_PASSWORD_RESPONSE);
    }

    const existing = await passwordResetModel.getByUserId(user._id);
    if (existing && Date.now() - existing.date_created.getTime() < RESET_RESEND_COOLDOWN_MS) {
      return res.status(429).json({
        message: 'A code was already sent recently. Please wait a bit before requesting another.',
      });
    }

    const code = crypto.randomInt(100000, 1000000).toString();
    const codeHash = await bcrypt.hash(code, 10);
    const codeExpires = new Date(Date.now() + RESET_CODE_TTL_MS);

    await passwordResetModel.create(user._id, { codeHash, codeExpires });

    const correlationId = crypto.randomUUID();
    try {
      const result = await sendMail({
        to: user.email,
        subject: 'FunCourse - Your password reset code',
        html: passwordResetCodeEmail(user.name, code, RESET_CODE_TTL_MS / 60000),
        text: passwordResetCodeEmailText(user.name, code, RESET_CODE_TTL_MS / 60000),
      });
      // Sanitized diagnostic only - never the code, hash, or provider secrets.
      console.log(
        `[mail][${correlationId}] forgot-password code accepted - provider=smtp accepted=${result.accepted.length} ` +
        `simulated=${result.simulated} messageId=${result.messageId || 'n/a'}`
      );
    } catch (mailError) {
      // The code/record must not survive a send we know failed - otherwise a
      // legitimate retry gets blocked by the resend cooldown for a code the
      // user can never receive.
      await passwordResetModel.deleteByUserId(user._id);

      console.error(
        `[mail][${correlationId}] forgot-password send failed - type=${mailError.name} ` +
        `meta=${JSON.stringify(mailError.meta || {})}`
      );

      if (mailError instanceof MailConfigError) {
        return res.status(500).json({
          message: 'Email delivery is not configured on this server. Please contact support.',
        });
      }
      if (mailError instanceof MailAuthError || mailError instanceof MailRejectedError || mailError instanceof MailSendError) {
        return res.status(502).json({
          message: 'We could not send the verification email right now. Please try again in a few minutes.',
        });
      }
      throw mailError;
    }

    return res.status(200).json(GENERIC_FORGOT_PASSWORD_RESPONSE);
  } catch (e) {
    return res.status(e.status || 500).json({ message: e.message });
  }
};

// Step 3: verify the submitted code and, on success, issue a short-lived
// single-purpose reset token (not the code itself) authorizing step 4.
exports.verifyResetCode = async function (req, res) {
  try {
    const data = req.body;
    utility.validate(data, ['email', 'code']);
    const email = data.email.trim().toLowerCase();

    const user = await userModel.get({ email });
    if (!user || user.error) {
      return res.status(400).json(GENERIC_INVALID_CODE_RESPONSE);
    }

    const record = await passwordResetModel.getByUserId(user._id);
    if (!record) return res.status(400).json(GENERIC_INVALID_CODE_RESPONSE);

    if (record.attempts >= RESET_CODE_MAX_ATTEMPTS) {
      return res.status(429).json({
        message: 'Too many incorrect attempts. Please request a new code.',
      });
    }

    if (record.codeExpires.getTime() < Date.now()) {
      return res.status(400).json(GENERIC_INVALID_CODE_RESPONSE);
    }

    const isMatch = await bcrypt.compare(data.code, record.codeHash);
    if (!isMatch) {
      await passwordResetModel.incrementAttempts(user._id);
      return res.status(400).json(GENERIC_INVALID_CODE_RESPONSE);
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = await bcrypt.hash(resetToken, 10);
    const resetTokenExpires = new Date(Date.now() + RESET_TOKEN_TTL_MS);

    await passwordResetModel.markVerified(user._id, { resetTokenHash, resetTokenExpires });

    return res.status(200).json({
      message: 'Code verified successfully',
      resetToken,
    });
  } catch (e) {
    return res.status(e.status || 500).json({ message: e.message });
  }
};

// Step 4: consume the reset token issued by verifyResetCode and set the new
// password. The code itself is never accepted here - only the short-lived
// token minted after it was verified.
exports.resetPassword = async function (req, res) {
  try {
    const data = req.body;
    utility.validate(data, ['email', 'resetToken', 'newPassword']);
    const email = data.email.trim().toLowerCase();

    const user = await userModel.get({ email });
    if (!user || user.error) {
      return res.status(400).json(GENERIC_INVALID_SESSION_RESPONSE);
    }

    const record = await passwordResetModel.getByUserId(user._id);
    if (!record || !record.resetTokenHash || !record.resetTokenExpires) {
      return res.status(400).json(GENERIC_INVALID_SESSION_RESPONSE);
    }

    if (record.resetTokenExpires.getTime() < Date.now()) {
      return res.status(400).json(GENERIC_INVALID_SESSION_RESPONSE);
    }

    const tokenMatches = await bcrypt.compare(data.resetToken, record.resetTokenHash);
    if (!tokenMatches) {
      return res.status(400).json(GENERIC_INVALID_SESSION_RESPONSE);
    }

    const reusesCurrentPassword = await bcrypt.compare(data.newPassword, user.password);
    if (reusesCurrentPassword) {
      return res.status(400).json({
        message: 'New password must be different from your current password',
      });
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);
    const updated = await userModel.update(user._id, { password: hashedPassword });
    if (updated.error) {
      return res.status(500).json({ message: 'Failed to reset password' });
    }

    // Consume this reset flow and sign the user out everywhere.
    await passwordResetModel.deleteByUserId(user._id);
    await tokenModel.delete(user._id);

    // Best-effort only: the password was already changed successfully above,
    // so a failure here must not fail the reset itself - just log it.
    try {
      await sendMail({
        to: user.email,
        subject: 'FunCourse - Your password was changed',
        html: passwordChangedEmail(user.name),
      });
    } catch (mailError) {
      console.error(
        `[mail] password-changed confirmation send failed - type=${mailError.name} ` +
        `meta=${JSON.stringify(mailError.meta || {})}`
      );
    }

    return res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (e) {
    return res.status(e.status || 500).json({ message: e.message });
  }
};
