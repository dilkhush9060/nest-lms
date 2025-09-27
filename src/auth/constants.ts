export const Constants = {
  JWT_TOKEN_SECRET: 'your_jwt_secret_key',
  JWT_REFRESH_TOKEN_SECRET: 'your_refresh_token_secret_key',
  JWT_ACCESS_TOKEN_SECRET: 'your_access_token_secret_key',
  JWT_TOKEN_EXPIRATION: '1h',
  JWT_ACCESS_TOKEN_EXPIRATION: '6h',
  JWT_REFRESH_TOKEN_EXPIRATION: '7d',

  COOKIE_SECURE: false,
  COOKIE_HTTP_ONLY: true,
  COOKIE_SAME_SITE: 'lax' as const,
  COOKIE_MAX_AGE: 24 * 60 * 60 * 1000,
};
