import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import otpGenerator from 'otp-generator';

import { UserService } from 'src/user/user.service';
import { Constants } from './constants';
import { SignInDto, SignUpDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async SignUp(signUpDto: SignUpDto) {
    // check if user with the email already exists
    const existingUser = await this.userService.findByEmail(signUpDto.email);

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const saltRounds = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(signUpDto.password, saltRounds);
    signUpDto.password = hashedPassword;

    // create the user
    const user = await this.userService.createUser(signUpDto);

    // just a safety check
    if (!user) {
      throw new BadRequestException('Error creating user');
    }

    const token = this.jwtService.sign(
      { id: user._id, email: user.email },
      {
        secret: Constants.JWT_TOKEN_SECRET,
        expiresIn: Constants.JWT_TOKEN_EXPIRATION,
      },
    );

    return {
      user,
      token,
    };
  }

  async sendOtpEmail(email: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.isVerified) {
      throw new BadRequestException('Email already verified');
    }

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
      digits: true,
    });

    const token = this.jwtService.sign(
      { id: user._id, email: user.email },
      {
        secret: Constants.JWT_TOKEN_SECRET,
        expiresIn: Constants.JWT_TOKEN_EXPIRATION,
      },
    );

    user.otp = otp;
    user.token = token;

    await user.save();

    return {
      token,
    };
  }

  async verifyEmail(token: string, tokenData: { id: string }, otp: string) {
    const user = await this.userService.findById(tokenData.id);

    if (!user || user.token != token) {
      throw new BadRequestException('Invalid token');
    }

    if (user.isVerified) {
      throw new BadRequestException('Email already verified');
    }

    if (user.otp != otp) {
      throw new BadRequestException('Invalid OTP');
    }

    user.isVerified = true;
    user.otp = '';
    user.token = '';
    await user.save();

    return {
      message: 'Email verified successfully',
    };
  }

  async SignIn(signInDto: SignInDto) {
    // check if user with the email exists
    const user = await this.userService.findByEmail(signInDto.email);

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    // check user verified
    if (!user.isVerified) {
      throw new BadRequestException('Please verify your email to continue');
    }

    // compare the password
    const isPasswordValid = await bcrypt.compare(
      signInDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }

    const accessToken = this.jwtService.sign(
      { id: user._id, email: user.email, name: user.name, role: user.role },
      {
        secret: Constants.JWT_ACCESS_TOKEN_SECRET,
        expiresIn: Constants.JWT_ACCESS_TOKEN_EXPIRATION,
      },
    );

    const refreshToken = this.jwtService.sign(
      { id: user._id },
      {
        secret: Constants.JWT_REFRESH_TOKEN_SECRET,
        expiresIn: Constants.JWT_REFRESH_TOKEN_EXPIRATION,
      },
    );

    user.token = refreshToken;
    await user.save();

    return {
      user,
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(token: string, userId: string) {
    const user = await this.userService.findById(userId);

    console.log(token, user?.token);

    if (!user || user.token != token) {
      throw new BadRequestException('Invalid token');
    }

    const newAccessToken = this.jwtService.sign(
      { id: user._id, email: user.email, name: user.name, role: user.role },
      {
        secret: Constants.JWT_ACCESS_TOKEN_SECRET,
        expiresIn: Constants.JWT_ACCESS_TOKEN_EXPIRATION,
      },
    );

    const newRefreshToken = this.jwtService.sign(
      { id: user._id },
      {
        secret: Constants.JWT_REFRESH_TOKEN_SECRET,
        expiresIn: Constants.JWT_REFRESH_TOKEN_EXPIRATION,
      },
    );

    user.token = newRefreshToken;
    await user.save();

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async signOut(userId: string | undefined) {
    if (userId) {
      const user = await this.userService.findById(userId);
      if (!user) {
        throw new NotFoundException('User not found');
      }

      user.token = '';
      await user.save();
    }

    return true;
  }
}
