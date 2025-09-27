import 'express';

declare module 'express' {
  export interface Request {
    user?: Express.User;
    token?: string;
    tokenData?: {
      id?: string;
    };
  }
}

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      name?: string;
      role?: string;
    }
  }
}
