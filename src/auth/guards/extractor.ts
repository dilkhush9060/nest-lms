import * as express from 'express';

export class TokenExtractor {
  static fromRequest(
    request: express.Request,
    cookieName: string = 'token',
  ): string | null {
    const authHeader = request.headers.authorization;
    if (authHeader) {
      const [type, token] = authHeader.split(' ');
      if (type === 'Bearer' && token) {
        return token;
      }
    }

    const tokenFromCookie = (request.cookies as Record<string, string>)?.[
      cookieName
    ];

    if (tokenFromCookie) {
      return tokenFromCookie;
    }

    return null;
  }
}
