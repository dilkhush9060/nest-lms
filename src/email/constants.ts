export const Constants = {
  SMTP_HOST: process.env.SMTP_HOST || 'localhost',
  SMTP_PORT: process.env.SMTP_PORT || '1025',
  SMTP_SECURE: process.env.SMTP_SECURE === 'true',
  SMTP_USER: process.env.SMTP_USER || 'test',
  SMTP_PASS: process.env.SMTP_PASS || 'test',
  MAIL_FROM: process.env.MAILER_FROM || 'lms@test.com',
};
