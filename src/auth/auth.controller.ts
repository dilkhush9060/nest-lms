import {
  Body,
  Controller,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import * as express from 'express';
import { Constants } from './constants';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  BadRequestDto,
  NotFoundDto,
  UnauthorizedDto,
} from 'src/common/dto/response.dto';
import {
  SendOtpDto,
  SendOtpResponseDto,
  SignInDto,
  SignInResponseDto,
  SignUpDto,
  SignUpResponseDto,
  VerifyEmailDto,
  VerifyEmailResponseDto,
} from './auth.dto';
import { RefreshGuard, TokenGuard } from './auth.guard';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // sign up
  @ApiOperation({ summary: 'User Sign Up' })
  @ApiResponse({
    status: 201,
    type: SignUpResponseDto,
  })
  @ApiResponse({
    status: 400,
    type: BadRequestDto,
  })
  @Post('signup')
  async SignUp(
    @Body() signUpDto: SignUpDto,
    @Res({ passthrough: true }) response: express.Response,
  ) {
    const result = await this.authService.SignUp(signUpDto);

    response.cookie('token', result.token, {
      httpOnly: Constants.COOKIE_HTTP_ONLY,
      secure: Constants.COOKIE_SECURE,
      maxAge: Constants.COOKIE_MAX_AGE,
      sameSite: Constants.COOKIE_SAME_SITE,
      domain: Constants.COOKIE_DOMAIN,
    });
    return {
      statusCode: 201,
      message: 'User created successfully',
      data: {
        user: {
          id: result.user._id,
          email: result.user.email,
          name: result.user.name,
          role: result.user.role,
        },
        token: result.token,
      },
    };
  }

  // send otp
  @ApiOperation({ summary: 'Send OTP ' })
  @ApiResponse({
    status: 200,
    type: SendOtpResponseDto,
  })
  @ApiResponse({
    status: 404,

    type: NotFoundDto,
  })
  @ApiResponse({
    status: 400,
    type: BadRequestDto,
  })
  @Post('send-otp')
  async sendOtp(
    @Body() sendOtpDto: SendOtpDto,
    @Res({ passthrough: true }) response: express.Response,
  ) {
    const result = await this.authService.sendOtpEmail(sendOtpDto.email);

    response.cookie('token', result.token, {
      httpOnly: Constants.COOKIE_HTTP_ONLY,
      secure: Constants.COOKIE_SECURE,
      maxAge: Constants.COOKIE_MAX_AGE,
      sameSite: Constants.COOKIE_SAME_SITE,
    });
    return {
      statusCode: 200,
      message: 'Please check your email!',
    };
  }

  // verify otp
  @ApiOperation({ summary: 'Verify Email' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    type: VerifyEmailResponseDto,
  })
  @ApiResponse({
    status: 401,
    type: UnauthorizedDto,
  })
  @ApiResponse({
    status: 400,
    type: BadRequestDto,
  })
  @ApiResponse({
    status: 404,
    type: NotFoundDto,
  })
  @UseGuards(TokenGuard)
  @Post('verify-email')
  async verifyOtp(
    @Body() verifyEmailDto: VerifyEmailDto,
    @Req() request: express.Request,
  ) {
    const token = request.token;
    const tokenData = request.tokenData as {
      id: string;
    };

    if (!token || !tokenData) {
      throw new UnauthorizedException('Invalid or missing token');
    }

    await this.authService.verifyEmail(token, tokenData, verifyEmailDto.otp);
    return {
      statusCode: 200,
      message: 'OTP verified successfully!',
    };
  }

  // sign in
  @ApiOperation({ summary: 'User Sign In' })
  @ApiResponse({
    status: 200,
    type: SignInResponseDto,
  })
  @ApiResponse({
    status: 400,
    type: BadRequestDto,
  })
  @ApiResponse({
    status: 404,
    type: NotFoundDto,
  })
  @Post('signin')
  async SignIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const result = await this.authService.SignIn(signInDto);

    res.cookie('accessToken', result.accessToken, {
      httpOnly: Constants.COOKIE_HTTP_ONLY,
      secure: Constants.COOKIE_SECURE,
      sameSite: Constants.COOKIE_SAME_SITE,
      maxAge: Constants.COOKIE_MAX_AGE,
      domain: Constants.COOKIE_DOMAIN,
    });

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: Constants.COOKIE_HTTP_ONLY,
      secure: Constants.COOKIE_SECURE,
      sameSite: Constants.COOKIE_SAME_SITE,
      maxAge: Constants.COOKIE_MAX_AGE * 7,
      domain: Constants.COOKIE_DOMAIN,
    });

    return {
      statusCode: 200,
      message: 'User signed in successfully',
      data: {
        user: {
          id: result.user._id,
          email: result.user.email,
          name: result.user.name,
          role: result.user.role,
        },
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
    };
  }

  // refresh token
  @ApiOperation({ summary: 'Refresh Access Token' })
  @ApiResponse({
    status: 200,
    description: 'Access token refreshed successfully',
  })
  @ApiResponse({
    status: 401,
    type: UnauthorizedDto,
  })
  @ApiResponse({
    status: 400,
    type: BadRequestDto,
  })
  @UseGuards(RefreshGuard)
  @Post('refresh')
  async refreshToken(
    @Req() req: express.Request,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const token = req.token;
    const tokenData = req.tokenData as { id: string };

    if (!token || !tokenData) {
      throw new UnauthorizedException('Invalid or missing token');
    }

    const result = await this.authService.refreshToken(token, tokenData.id);

    res.cookie('accessToken', result.accessToken, {
      httpOnly: Constants.COOKIE_HTTP_ONLY,
      secure: Constants.COOKIE_SECURE,
      sameSite: Constants.COOKIE_SAME_SITE,
      maxAge: Constants.COOKIE_MAX_AGE,
      domain: Constants.COOKIE_DOMAIN,
    });

    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: Constants.COOKIE_HTTP_ONLY,
      secure: Constants.COOKIE_SECURE,
      sameSite: Constants.COOKIE_SAME_SITE,
      maxAge: Constants.COOKIE_MAX_AGE * 7,
      domain: Constants.COOKIE_DOMAIN,
    });

    return {
      statusCode: 200,
      message: 'Access token refreshed successfully',
      data: {
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
    };
  }

  // sign out
  @ApiOperation({ summary: 'User Sign Out' })
  @ApiResponse({
    status: 200,
    description: 'User signed out successfully',
  })
  @ApiResponse({
    status: 400,
    type: BadRequestDto,
  })
  @Post('signout')
  @UseGuards(TokenGuard)
  async signOut(
    @Req() req: express.Request,
    @Res({ passthrough: true }) res: express.Response,
  ) {
    const userId = req.user?.id;

    await this.authService.signOut(userId);
    res.clearCookie('accessToken', {
      httpOnly: Constants.COOKIE_HTTP_ONLY,
      secure: Constants.COOKIE_SECURE,
      sameSite: Constants.COOKIE_SAME_SITE,
      domain: Constants.COOKIE_DOMAIN,
    });
    res.clearCookie('refreshToken', {
      httpOnly: Constants.COOKIE_HTTP_ONLY,
      secure: Constants.COOKIE_SECURE,
      sameSite: Constants.COOKIE_SAME_SITE,
      domain: Constants.COOKIE_DOMAIN,
    });
    return {
      statusCode: 200,
      message: 'User signed out successfully',
    };
  }
}
