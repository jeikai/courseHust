const validation = require('../../middlewares/validation');
const { mockReq, mockRes } = require('../helpers/mockExpress');

function run(middleware, body) {
  const req = mockReq({ body });
  const res = mockRes();
  const next = jest.fn();
  middleware(req, res, next);
  return { res, next };
}

describe('resetPasswordValidate', () => {
  it('passes when password and confirmation match', () => {
    const { next, res } = run(validation.resetPasswordValidate, {
      email: 'a@b.com',
      resetToken: 'token',
      newPassword: 'secret123',
      confirmPassword: 'secret123',
    });
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('rejects when confirmation does not match', () => {
    const { next, res } = run(validation.resetPasswordValidate, {
      email: 'a@b.com',
      resetToken: 'token',
      newPassword: 'secret123',
      confirmPassword: 'different',
    });
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('rejects a password shorter than the policy minimum', () => {
    const { next, res } = run(validation.resetPasswordValidate, {
      email: 'a@b.com',
      resetToken: 'token',
      newPassword: '123',
      confirmPassword: '123',
    });
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe('verifyResetCodeValidate', () => {
  it('passes for a 6-digit numeric code', () => {
    const { next } = run(validation.verifyResetCodeValidate, {
      email: 'a@b.com',
      code: '123456',
    });
    expect(next).toHaveBeenCalled();
  });

  it('rejects a non-numeric code', () => {
    const { next, res } = run(validation.verifyResetCodeValidate, {
      email: 'a@b.com',
      code: 'abcdef',
    });
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('rejects a code of the wrong length', () => {
    const { next, res } = run(validation.verifyResetCodeValidate, {
      email: 'a@b.com',
      code: '123',
    });
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe('forgotPasswordValidate', () => {
  it('rejects an invalid email', () => {
    const { next, res } = run(validation.forgotPasswordValidate, { email: 'not-an-email' });
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('passes a valid email', () => {
    const { next } = run(validation.forgotPasswordValidate, { email: 'a@b.com' });
    expect(next).toHaveBeenCalled();
  });
});
