import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Constants } from '../constants';
import { TokenExtractor } from './extractor';

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = TokenExtractor.fromRequest(request, 'token');

    if (!token) {
      throw new UnauthorizedException('No refresh token found');
    }

    try {
      const payload: {
        id: string;
      } = await this.jwtService.verifyAsync(token, {
        secret: Constants.JWT_TOKEN_SECRET,
      });

      request['token'] = token;
      request['tokenData'] = payload;

      return true;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
