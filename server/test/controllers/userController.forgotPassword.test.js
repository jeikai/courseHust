jest.mock('../../models/User');
jest.mock('../../models/PasswordReset');
jest.mock('../../models/Token');
jest.mock('../../helper/mailer');

const bcrypt = require('bcryptjs');
const userModel = require('../../models/User');
const passwordResetModel = require('../../models/PasswordReset');
const tokenModel = require('../../models/Token');
const {
  sendMail,
  MailConfigError,
  MailAuthError,
  MailRejectedError,
} = require('../../helper/mailer');
const userController = require('../../controllers/userController');
const { mockReq, mockRes } = require('../helpers/mockExpress');

const user = {
  _id: 'user-1',
  email: 'student@example.com',
  name: 'Student One',
  password: 'hashed-current-password',
};

beforeEach(() => {
  // Sane default so tests that don't care about the mail result don't have
  // to restate it; tests exercising failure paths override this per-case.
  sendMail.mockResolvedValue({ accepted: [user.email], rejected: [], simulated: false, messageId: '<test>' });
});

afterEach(() => jest.clearAllMocks());

describe('userController.forgotPassword', () => {
  it('returns the same generic message whether or not the account exists (no enumeration)', async () => {
    userModel.get.mockResolvedValue(null);
    const req = mockReq({ body: { email: 'unknown@example.com' } });
    const res = mockRes();

    await userController.forgotPassword(req, res);

    const unknownBody = res.body;
    expect(res.status).toHaveBeenCalledWith(200);
    expect(sendMail).not.toHaveBeenCalled();

    jest.clearAllMocks();
    userModel.get.mockResolvedValue(user);
    passwordResetModel.getByUserId.mockResolvedValue(null);
    passwordResetModel.create.mockResolvedValue({});
    const req2 = mockReq({ body: { email: user.email } });
    const res2 = mockRes();

    await userController.forgotPassword(req2, res2);

    expect(res2.status).toHaveBeenCalledWith(200);
    expect(res2.body).toEqual(unknownBody);
  });

  it('sends a code and never returns it in the response body when the account exists', async () => {
    userModel.get.mockResolvedValue(user);
    passwordResetModel.getByUserId.mockResolvedValue(null);
    passwordResetModel.create.mockResolvedValue({});
    const req = mockReq({ body: { email: user.email } });
    const res = mockRes();

    await userController.forgotPassword(req, res);

    expect(sendMail).toHaveBeenCalledTimes(1);
    expect(passwordResetModel.create).toHaveBeenCalledWith(
      user._id,
      expect.objectContaining({ codeHash: expect.any(String), codeExpires: expect.any(Date) })
    );
    expect(JSON.stringify(res.body)).not.toMatch(/\d{6}/); // no 6-digit code leaked
  });

  it('enforces the resend cooldown', async () => {
    userModel.get.mockResolvedValue(user);
    passwordResetModel.getByUserId.mockResolvedValue({ date_created: new Date() });
    const req = mockReq({ body: { email: user.email } });
    const res = mockRes();

    await userController.forgotPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(429);
    expect(passwordResetModel.create).not.toHaveBeenCalled();
  });

  it('awaits the send before responding, in the correct order (record created, then mail sent, then 200)', async () => {
    userModel.get.mockResolvedValue(user);
    passwordResetModel.getByUserId.mockResolvedValue(null);
    passwordResetModel.create.mockResolvedValue({});
    const order = [];
    passwordResetModel.create.mockImplementation(async () => {
      order.push('record-created');
      return {};
    });
    sendMail.mockImplementation(async () => {
      order.push('mail-sent');
      return { accepted: [user.email], rejected: [], simulated: false };
    });
    const req = mockReq({ body: { email: user.email } });
    const res = mockRes();
    res.status.mockImplementation((code) => {
      order.push(`status-${code}`);
      return res;
    });

    await userController.forgotPassword(req, res);

    expect(order).toEqual(['record-created', 'mail-sent', 'status-200']);
  });

  it('does NOT return 200 when the mail service is unconfigured - returns a controlled 500 instead', async () => {
    userModel.get.mockResolvedValue(user);
    passwordResetModel.getByUserId.mockResolvedValue(null);
    passwordResetModel.create.mockResolvedValue({});
    sendMail.mockRejectedValue(new MailConfigError('Email is not configured on this server'));
    const req = mockReq({ body: { email: user.email } });
    const res = mockRes();

    await userController.forgotPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.status).not.toHaveBeenCalledWith(200);
    // The unsendable record must not linger and block a retry via the cooldown.
    expect(passwordResetModel.deleteByUserId).toHaveBeenCalledWith(user._id);
  });

  it('does NOT return 200 when the provider rejects authentication - returns 502 instead', async () => {
    userModel.get.mockResolvedValue(user);
    passwordResetModel.getByUserId.mockResolvedValue(null);
    passwordResetModel.create.mockResolvedValue({});
    sendMail.mockRejectedValue(new MailAuthError('Mail provider authentication failed'));
    const req = mockReq({ body: { email: user.email } });
    const res = mockRes();

    await userController.forgotPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(502);
    expect(res.status).not.toHaveBeenCalledWith(200);
    expect(passwordResetModel.deleteByUserId).toHaveBeenCalledWith(user._id);
  });

  it('does NOT return 200 when the provider rejects the recipient', async () => {
    userModel.get.mockResolvedValue(user);
    passwordResetModel.getByUserId.mockResolvedValue(null);
    passwordResetModel.create.mockResolvedValue({});
    sendMail.mockRejectedValue(new MailRejectedError('Mail provider rejected the recipient'));
    const req = mockReq({ body: { email: user.email } });
    const res = mockRes();

    await userController.forgotPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(502);
    expect(passwordResetModel.deleteByUserId).toHaveBeenCalledWith(user._id);
  });

  it('never logs the verification code, even when the send fails', async () => {
    userModel.get.mockResolvedValue(user);
    passwordResetModel.getByUserId.mockResolvedValue(null);
    passwordResetModel.create.mockResolvedValue({});
    sendMail.mockRejectedValue(new MailAuthError('Mail provider authentication failed'));
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const req = mockReq({ body: { email: user.email } });
    const res = mockRes();

    await userController.forgotPassword(req, res);

    const allLoggedText = [...logSpy.mock.calls, ...errorSpy.mock.calls].flat().join(' ');
    expect(allLoggedText).not.toMatch(/\b\d{6}\b/);
    logSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it('includes the code expiry in the response so the frontend never hardcodes a stale value', async () => {
    userModel.get.mockResolvedValue(user);
    passwordResetModel.getByUserId.mockResolvedValue(null);
    passwordResetModel.create.mockResolvedValue({});
    sendMail.mockResolvedValue({ accepted: [user.email], rejected: [], simulated: false });
    const req = mockReq({ body: { email: user.email } });
    const res = mockRes();

    await userController.forgotPassword(req, res);

    expect(res.body.expiresInMinutes).toBe(10);
  });
});

describe('userController.verifyResetCode', () => {
  it('accepts a correct, unexpired code and issues a reset token', async () => {
    const codeHash = await bcrypt.hash('123456', 10);
    userModel.get.mockResolvedValue(user);
    passwordResetModel.getByUserId.mockResolvedValue({
      codeHash,
      codeExpires: new Date(Date.now() + 60000),
      attempts: 0,
    });
    passwordResetModel.markVerified.mockResolvedValue({});
    const req = mockReq({ body: { email: user.email, code: '123456' } });
    const res = mockRes();

    await userController.verifyResetCode(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.body.resetToken).toEqual(expect.any(String));
    expect(res.body.resetToken.length).toBeGreaterThan(20);
  });

  it('rejects an incorrect code and records the attempt', async () => {
    const codeHash = await bcrypt.hash('123456', 10);
    userModel.get.mockResolvedValue(user);
    passwordResetModel.getByUserId.mockResolvedValue({
      codeHash,
      codeExpires: new Date(Date.now() + 60000),
      attempts: 0,
    });
    const req = mockReq({ body: { email: user.email, code: '000000' } });
    const res = mockRes();

    await userController.verifyResetCode(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(passwordResetModel.incrementAttempts).toHaveBeenCalledWith(user._id);
  });

  it('rejects an expired code', async () => {
    const codeHash = await bcrypt.hash('123456', 10);
    userModel.get.mockResolvedValue(user);
    passwordResetModel.getByUserId.mockResolvedValue({
      codeHash,
      codeExpires: new Date(Date.now() - 1000),
      attempts: 0,
    });
    const req = mockReq({ body: { email: user.email, code: '123456' } });
    const res = mockRes();

    await userController.verifyResetCode(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('rejects once the attempt limit is reached', async () => {
    userModel.get.mockResolvedValue(user);
    passwordResetModel.getByUserId.mockResolvedValue({
      codeHash: 'irrelevant',
      codeExpires: new Date(Date.now() + 60000),
      attempts: 5,
    });
    const req = mockReq({ body: { email: user.email, code: '123456' } });
    const res = mockRes();

    await userController.verifyResetCode(req, res);

    expect(res.status).toHaveBeenCalledWith(429);
  });

  it('rejects when there is no active reset flow (superseded/never requested)', async () => {
    userModel.get.mockResolvedValue(user);
    passwordResetModel.getByUserId.mockResolvedValue(null);
    const req = mockReq({ body: { email: user.email, code: '123456' } });
    const res = mockRes();

    await userController.verifyResetCode(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe('userController.resetPassword', () => {
  it('resets the password, consumes the token, and invalidates sessions', async () => {
    const resetToken = 'a'.repeat(64);
    const resetTokenHash = await bcrypt.hash(resetToken, 10);
    userModel.get.mockResolvedValue(user);
    passwordResetModel.getByUserId.mockResolvedValue({
      resetTokenHash,
      resetTokenExpires: new Date(Date.now() + 60000),
    });
    userModel.update.mockResolvedValue({ ...user, password: 'new-hash' });
    const req = mockReq({
      body: { email: user.email, resetToken, newPassword: 'newSecurePass123' },
    });
    const res = mockRes();

    await userController.resetPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(userModel.update).toHaveBeenCalledWith(
      user._id,
      expect.objectContaining({ password: expect.any(String) })
    );
    expect(passwordResetModel.deleteByUserId).toHaveBeenCalledWith(user._id);
    expect(tokenModel.delete).toHaveBeenCalledWith(user._id); // existing sessions invalidated
  });

  it('rejects reusing the current password', async () => {
    const resetToken = 'a'.repeat(64);
    const resetTokenHash = await bcrypt.hash(resetToken, 10);
    const currentPasswordHash = await bcrypt.hash('CurrentPass1', 10);
    userModel.get.mockResolvedValue({ ...user, password: currentPasswordHash });
    passwordResetModel.getByUserId.mockResolvedValue({
      resetTokenHash,
      resetTokenExpires: new Date(Date.now() + 60000),
    });
    const req = mockReq({
      body: { email: user.email, resetToken, newPassword: 'CurrentPass1' },
    });
    const res = mockRes();

    await userController.resetPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(userModel.update).not.toHaveBeenCalled();
  });

  it('rejects an invalid reset token', async () => {
    const resetTokenHash = await bcrypt.hash('correct-token', 10);
    userModel.get.mockResolvedValue(user);
    passwordResetModel.getByUserId.mockResolvedValue({
      resetTokenHash,
      resetTokenExpires: new Date(Date.now() + 60000),
    });
    const req = mockReq({
      body: { email: user.email, resetToken: 'wrong-token', newPassword: 'newSecurePass123' },
    });
    const res = mockRes();

    await userController.resetPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(userModel.update).not.toHaveBeenCalled();
  });

  it('rejects a reused/consumed reset token (already deleted after first use)', async () => {
    userModel.get.mockResolvedValue(user);
    passwordResetModel.getByUserId.mockResolvedValue(null); // already consumed/deleted
    const req = mockReq({
      body: { email: user.email, resetToken: 'a'.repeat(64), newPassword: 'newSecurePass123' },
    });
    const res = mockRes();

    await userController.resetPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(userModel.update).not.toHaveBeenCalled();
  });

  it('rejects an expired reset token', async () => {
    const resetToken = 'a'.repeat(64);
    const resetTokenHash = await bcrypt.hash(resetToken, 10);
    userModel.get.mockResolvedValue(user);
    passwordResetModel.getByUserId.mockResolvedValue({
      resetTokenHash,
      resetTokenExpires: new Date(Date.now() - 1000),
    });
    const req = mockReq({
      body: { email: user.email, resetToken, newPassword: 'newSecurePass123' },
    });
    const res = mockRes();

    await userController.resetPassword(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(userModel.update).not.toHaveBeenCalled();
  });
});
