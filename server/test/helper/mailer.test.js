jest.mock('nodemailer');
const nodemailer = require('nodemailer');

const ORIGINAL_ENV = process.env;

function loadMailer() {
  let mod;
  jest.isolateModules(() => {
    mod = require('../../helper/mailer');
  });
  return mod;
}

function setConfiguredEnv() {
  process.env = {
    ...ORIGINAL_ENV,
    EMAIL_HOST: 'smtp.example.com',
    EMAIL_PORT: '587',
    EMAIL_USER: 'user@example.com',
    EMAIL_PASS: 'super-secret-password',
    EMAIL_FROM: 'no-reply@example.com',
    EMAIL_DEV_PREVIEW: undefined,
    NODE_ENV: 'test',
  };
}

function setUnconfiguredEnv(extra = {}) {
  process.env = {
    ...ORIGINAL_ENV,
    EMAIL_HOST: undefined,
    EMAIL_PORT: undefined,
    EMAIL_USER: undefined,
    EMAIL_PASS: undefined,
    EMAIL_FROM: undefined,
    EMAIL_DEV_PREVIEW: undefined,
    NODE_ENV: 'test',
    ...extra,
  };
}

afterEach(() => {
  process.env = ORIGINAL_ENV;
  jest.clearAllMocks();
});

describe('mailer.sendMail - configured provider', () => {
  it('sends through nodemailer and returns accepted recipients (real delivery attempted)', async () => {
    setConfiguredEnv();
    const sendMailMock = jest.fn().mockResolvedValue({
      messageId: '<abc@example.com>',
      accepted: ['student@example.com'],
      rejected: [],
    });
    nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });

    const { sendMail } = loadMailer();
    const result = await sendMail({ to: 'student@example.com', subject: 'Hi', html: '<p>hi</p>' });

    expect(sendMailMock).toHaveBeenCalledTimes(1);
    const call = sendMailMock.mock.calls[0][0];
    expect(call.to).toBe('student@example.com');
    expect(result.accepted).toEqual(['student@example.com']);
    expect(result.simulated).toBe(false);
  });

  it('builds the transport from EMAIL_* config with the right host/port/auth', async () => {
    setConfiguredEnv();
    nodemailer.createTransport.mockReturnValue({
      sendMail: jest.fn().mockResolvedValue({ accepted: ['x@example.com'], rejected: [] }),
    });

    const { sendMail } = loadMailer();
    await sendMail({ to: 'x@example.com', subject: 's', html: '<p>h</p>' });

    expect(nodemailer.createTransport).toHaveBeenCalledWith(
      expect.objectContaining({
        host: 'smtp.example.com',
        port: 587,
        auth: { user: 'user@example.com', pass: 'super-secret-password' },
      })
    );
  });

  it('rejects with MailAuthError when the provider rejects credentials (EAUTH)', async () => {
    setConfiguredEnv();
    const authError = new Error('Invalid login');
    authError.code = 'EAUTH';
    nodemailer.createTransport.mockReturnValue({
      sendMail: jest.fn().mockRejectedValue(authError),
    });

    const { sendMail, MailAuthError } = loadMailer();
    await expect(
      sendMail({ to: 'x@example.com', subject: 's', html: '<p>h</p>' })
    ).rejects.toBeInstanceOf(MailAuthError);
  });

  it('rejects with MailRejectedError when the provider accepts the SMTP call but rejects the recipient', async () => {
    setConfiguredEnv();
    nodemailer.createTransport.mockReturnValue({
      sendMail: jest.fn().mockResolvedValue({ accepted: [], rejected: ['x@example.com'] }),
    });

    const { sendMail, MailRejectedError } = loadMailer();
    await expect(
      sendMail({ to: 'x@example.com', subject: 's', html: '<p>h</p>' })
    ).rejects.toBeInstanceOf(MailRejectedError);
  });

  it('never includes the SMTP password in a thrown error message', async () => {
    setConfiguredEnv();
    const authError = new Error(
      'Invalid login: 535-5.7.8 Username and Password not accepted, contains super-secret-password'
    );
    authError.code = 'EAUTH';
    nodemailer.createTransport.mockReturnValue({
      sendMail: jest.fn().mockRejectedValue(authError),
    });

    const { sendMail } = loadMailer();
    let thrown;
    try {
      await sendMail({ to: 'x@example.com', subject: 's', html: '<p>h</p>' });
    } catch (err) {
      thrown = err;
    }
    expect(thrown.message).not.toContain('super-secret-password');
    expect(JSON.stringify(thrown.meta || {})).not.toContain('super-secret-password');
  });
});

describe('mailer.sendMail - unconfigured provider', () => {
  it('throws MailConfigError instead of silently succeeding when nothing is configured', async () => {
    setUnconfiguredEnv();
    const { sendMail, MailConfigError } = loadMailer();

    await expect(
      sendMail({ to: 'student@example.com', subject: 's', html: '<p>h</p>' })
    ).rejects.toBeInstanceOf(MailConfigError);
    expect(nodemailer.createTransport).not.toHaveBeenCalled();
  });

  it('does not fall back to a fake transport in production even with EMAIL_DEV_PREVIEW=true', async () => {
    setUnconfiguredEnv({ EMAIL_DEV_PREVIEW: 'true', NODE_ENV: 'production' });
    const { sendMail, MailConfigError } = loadMailer();

    await expect(
      sendMail({ to: 'student@example.com', subject: 's', html: '<p>h</p>' })
    ).rejects.toBeInstanceOf(MailConfigError);
  });

  it('only uses the Ethereal dev-preview transport when explicitly opted in outside production', async () => {
    setUnconfiguredEnv({ EMAIL_DEV_PREVIEW: 'true', NODE_ENV: 'development' });
    nodemailer.createTestAccount.mockResolvedValue({ user: 'ethereal-user', pass: 'ethereal-pass' });
    nodemailer.createTransport.mockReturnValue({
      sendMail: jest.fn().mockResolvedValue({ accepted: ['x@example.com'], rejected: [], messageId: '<id>' }),
    });
    nodemailer.getTestMessageUrl.mockReturnValue('https://ethereal.email/message/xyz');

    const { sendMail } = loadMailer();
    const result = await sendMail({ to: 'x@example.com', subject: 's', html: '<p>h</p>' });

    expect(result.simulated).toBe(true);
    expect(result.previewUrl).toBe('https://ethereal.email/message/xyz');
  });
});

describe('mailer.assertEmailConfig', () => {
  it('returns false and warns (does not throw) when unconfigured', () => {
    setUnconfiguredEnv();
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const { assertEmailConfig } = loadMailer();

    expect(() => assertEmailConfig()).not.toThrow();
    expect(assertEmailConfig()).toBe(false);
    warnSpy.mockRestore();
  });

  it('returns true when fully configured', () => {
    setConfiguredEnv();
    const { assertEmailConfig } = loadMailer();
    expect(assertEmailConfig()).toBe(true);
  });
});
