export const Constants = {
  JWT_TOKEN_EXPIRATION: '1h',
  JWT_ACCESS_TOKEN_EXPIRATION: '1d',
  JWT_REFRESH_TOKEN_EXPIRATION: '7d',

  COOKIE_SECURE: false,
  COOKIE_HTTP_ONLY: true,
  COOKIE_SAME_SITE: 'lax' as const,
  COOKIE_MAX_AGE: 24 * 60 * 60 * 1000,
  COOKIE_DOMAIN: 'localhost',
};
