function passwordResetCodeEmail(name, code, expiresInMinutes) {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
      <h2 style="color: #754FFE;">FunCourse</h2>
      <h3>Password reset code</h3>
      <p>Hi ${escapeHtml(name || '')},</p>
      <p>We received a request to reset your FunCourse password. Use the verification code below to continue:</p>
      <p style="font-size: 28px; font-weight: bold; letter-spacing: 6px; text-align: center; margin: 24px 0;">${escapeHtml(code)}</p>
      <p>This code expires in ${escapeHtml(expiresInMinutes)} minutes.</p>
      <p><strong>Do not share this code with anyone</strong> - FunCourse staff will never ask you for it.</p>
      <p>If you did not request a password reset, you can safely ignore this email - your password will not be changed.</p>
      <p>Thanks,<br/>The FunCourse Team</p>
    </div>
  `;
}

function passwordResetCodeEmailText(name, code, expiresInMinutes) {
    return [
        `Hi ${name || ''},`,
        '',
        'We received a request to reset your FunCourse password.',
        `Your verification code is: ${code}`,
        `This code expires in ${expiresInMinutes} minutes.`,
        '',
        'Do not share this code with anyone - FunCourse staff will never ask you for it.',
        'If you did not request a password reset, you can safely ignore this email.',
        '',
        'Thanks,',
        'The FunCourse Team',
    ].join('\n');
}

function passwordChangedEmail(name) {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
      <h2 style="color: #754FFE;">FunCourse</h2>
      <p>Hi ${escapeHtml(name || '')},</p>
      <p>Your FunCourse account password was just changed. If you made this change, no further action is needed.</p>
      <p>If you did not change your password, please contact support immediately.</p>
      <p>Thanks,<br/>The FunCourse Team</p>
    </div>
  `;
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

module.exports = { passwordResetCodeEmail, passwordResetCodeEmailText, passwordChangedEmail };
