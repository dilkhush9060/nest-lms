import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

import { TokenExtractor } from './extractor';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/user/user.types';
import { ROLES_KEY } from './role.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  private JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET || '';

  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = TokenExtractor.fromRequest(request, 'accessToken');

    if (!token) {
      throw new UnauthorizedException('No access token found');
    }

    try {
      const payload: Express.User = await this.jwtService.verifyAsync(token, {
        secret: this.JWT_ACCESS_TOKEN_SECRET,
      });

      request['user'] = payload;
      return true;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}

@Injectable()
export class RefreshGuard implements CanActivate {
  private JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET || '';

  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = TokenExtractor.fromRequest(request, 'refreshToken');

    if (!token) {
      throw new UnauthorizedException('No refresh token found');
    }

    try {
      const payload: {
        id: string;
      } = await this.jwtService.verifyAsync(token, {
        secret: this.JWT_REFRESH_TOKEN_SECRET,
      });

      request['token'] = token;
      request['tokenData'] = payload;

      return true;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user }: { user: Express.User } = context
      .switchToHttp()
      .getRequest();
    return requiredRoles.some((role) => user?.role === role);
  }
}

@Injectable()
export class TokenGuard implements CanActivate {
  private JWT_TOKEN_SECRET = process.env.JWT_TOKEN_SECRET || '';

  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = TokenExtractor.fromRequest(request, 'token');

    if (!token) {
      throw new UnauthorizedException('No token found');
    }

    try {
      const payload: {
        id: string;
      } = await this.jwtService.verifyAsync(token, {
        secret: this.JWT_TOKEN_SECRET,
      });

      request['token'] = token;
      request['tokenData'] = payload;

      return true;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
