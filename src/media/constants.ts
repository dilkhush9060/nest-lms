export const Constants = {
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME || 'lms',
  AWS_S3_REGION: process.env.AWS_S3_REGION || 'global',
  AWS_S3_ACCESS_KEY_ID: process.env.AWS_S3_ACCESS_KEY_ID || '',
  AWS_S3_SECRET_ACCESS_KEY: process.env.AWS_S3_SECRET_ACCESS_KEY || '',
  AWS_S3_ENDPOINT: process.env.AWS_S3_ENDPOINT || undefined,
};
