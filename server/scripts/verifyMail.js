// Local diagnostic - checks the configured mail provider without exposing
// secrets. Usage:
//   node scripts/verifyMail.js                  # verify auth/connection only
//   node scripts/verifyMail.js you@example.com   # also send one real test email
require('dotenv').config();
const { verifyMailTransport, sendMail, hasEmailConfig } = require('../helper/mailer');

async function main() {
  if (!hasEmailConfig()) {
    console.log('NOT CONFIGURED: EMAIL_HOST/EMAIL_PORT/EMAIL_USER/EMAIL_PASS/EMAIL_FROM are not all set.');
    console.log('Set them in server/.env (see server/.env.example), then re-run this script.');
    process.exitCode = 1;
    return;
  }

  console.log(`Checking provider connection (host=${process.env.EMAIL_HOST}, port=${process.env.EMAIL_PORT})...`);
  const verify = await verifyMailTransport();
  if (!verify.ok) {
    console.log(`CONNECTION/AUTH FAILED: ${verify.reason}`, verify.meta || '');
    process.exitCode = 1;
    return;
  }
  console.log('Connection + authentication OK.');

  const to = process.argv[2];
  if (!to) {
    console.log('No recipient given - skipping a real send. Pass an email address to send a real test message.');
    return;
  }

  try {
    const result = await sendMail({
      to,
      subject: 'FunCourse mail diagnostic - test message',
      html: '<p>This is a diagnostic test email from the FunCourse backend. If you received this, real delivery is working.</p>',
      text: 'This is a diagnostic test email from the FunCourse backend. If you received this, real delivery is working.',
    });
    console.log(`SENT: accepted=${JSON.stringify(result.accepted)} messageId=${result.messageId || 'n/a'} simulated=${result.simulated}`);
    if (result.simulated) {
      console.log(`Preview URL (Ethereal, NOT the real inbox): ${result.previewUrl}`);
    } else {
      console.log(`Provider accepted the message for ${to}. Check that inbox (and Spam/Junk) to confirm arrival.`);
    }
  } catch (err) {
    console.log(`SEND FAILED: type=${err.name} meta=${JSON.stringify(err.meta || {})}`);
    process.exitCode = 1;
  }
}

main();
