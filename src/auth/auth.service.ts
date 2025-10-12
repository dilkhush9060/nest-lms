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
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {
  private JWT_TOKEN_SECRET = process.env.JWT_TOKEN_SECRET || '';
  private JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET || '';
  private JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET || '';

  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  // sign up
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
        secret: this.JWT_TOKEN_SECRET,
        expiresIn: Constants.JWT_TOKEN_EXPIRATION,
      },
    );

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
      digits: true,
    });

    await this.userService.updateByEmail(user.email, { otp, token });

    //Todo: send email
    await this.emailService.sendOtpToVerification(user.name, user.email, otp);

    return {
      user,
      token,
    };
  }

  // send otp email
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
        secret: this.JWT_TOKEN_SECRET,
        expiresIn: Constants.JWT_TOKEN_EXPIRATION,
      },
    );

    user.otp = otp;
    user.token = token;

    await user.save();

    // send email
    await this.emailService.sendOtpToVerification(user.name, user.email, otp);

    return {
      token,
    };
  }

  // verify email
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

    const accessToken = this.jwtService.sign(
      { id: user._id, email: user.email, name: user.name, role: user.role },
      {
        secret: this.JWT_ACCESS_TOKEN_SECRET,
        expiresIn: Constants.JWT_ACCESS_TOKEN_EXPIRATION,
      },
    );

    const refreshToken = this.jwtService.sign(
      { id: user._id },
      {
        secret: this.JWT_REFRESH_TOKEN_SECRET,
        expiresIn: Constants.JWT_REFRESH_TOKEN_EXPIRATION,
      },
    );

    user.token = refreshToken;
    await user.save();

    return {
      message: 'Email verified successfully',
      data: {
        user,
        accessToken,
        refreshToken,
      },
    };
  }

  // sign in
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
        secret: this.JWT_ACCESS_TOKEN_SECRET,
        expiresIn: Constants.JWT_ACCESS_TOKEN_EXPIRATION,
      },
    );

    const refreshToken = this.jwtService.sign(
      { id: user._id },
      {
        secret: this.JWT_REFRESH_TOKEN_SECRET,
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

  // refresh token
  async refreshToken(token: string, userId: string) {
    const user = await this.userService.findById(userId);

    console.log(token, user?.token);

    if (!user || user.token != token) {
      throw new BadRequestException('Invalid token');
    }

    const newAccessToken = this.jwtService.sign(
      { id: user._id, email: user.email, name: user.name, role: user.role },
      {
        secret: this.JWT_ACCESS_TOKEN_SECRET,
        expiresIn: Constants.JWT_ACCESS_TOKEN_EXPIRATION,
      },
    );

    const newRefreshToken = this.jwtService.sign(
      { id: user._id },
      {
        secret: this.JWT_REFRESH_TOKEN_SECRET,
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

  // sign out
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

  // forget password
  async forgetPassword(email: string) {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
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
        secret: this.JWT_TOKEN_SECRET,
        expiresIn: Constants.JWT_TOKEN_EXPIRATION,
      },
    );

    user.otp = otp;
    user.token = token;

    await user.save();

    // Todo: send email

    return {
      token,
    };
  }

  // reset password
  async resetPassword(
    token: string,
    tokenData: { id: string },
    otp: string,
    newPassword: string,
  ) {
    const user = await this.userService.findById(tokenData.id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user || user.token != token) {
      throw new BadRequestException('Invalid token');
    }

    if (user.otp != otp) {
      throw new BadRequestException('Invalid OTP');
    }

    const saltRounds = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    user.password = hashedPassword;
    user.otp = '';
    user.token = '';

    await user.save();

    return true;
  }

  // change password
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.userService.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      throw new BadRequestException(
        'Try a different password than the current one',
      );
    }

    const saltRounds = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    user.password = hashedPassword;

    await user.save();

    return true;
  }
}
