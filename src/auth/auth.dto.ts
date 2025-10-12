import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class SignUpDto {
  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the user',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'example@gmail.com',
    description: 'The email of the user',
    required: true,
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Password123',
    description: 'The password of the user',
    required: true,
  })
  @IsString()
  password: string;
}

export class SignUpResponseDto {
  @ApiProperty({ example: 201 })
  status: number;

  @ApiProperty({ example: 'Sign up Successful' })
  message: string;

  @ApiProperty({
    example: {
      user: {
        id: '64a7b2f5e1b0c8a1d2e3f4g5',
        email: 'test@gmail.com',
        name: 'John Doe',
        role: 'student',
      },
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZDgzZDE0NDYwMGJkOWRlN',
    },
  })
  data: {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
    };
    token: string;
  };
}

export class SendOtpDto {
  @ApiProperty({
    example: 'example@gmail.com',
    description: 'The email of the user',
    required: true,
  })
  @IsEmail()
  email: string;
}

export class SendOtpResponseDto {
  @ApiProperty({ example: 200 })
  status: number;

  @ApiProperty({ example: 'Please Check your email' })
  message: string;

  @ApiProperty({
    example: {
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZDgzZDE0NDYwMGJkOWRlN',
    },
  })
  data: {
    token: string;
  };
}

export class VerifyEmailDto {
  @ApiProperty({
    example: '123456',
    description: 'OTP sent to the email',
    required: true,
  })
  @IsString()
  otp: string;
}

export class VerifyEmailResponseDto {
  @ApiProperty({ example: 200 })
  statusCode: number;

  @ApiProperty({ example: 'Email verified successfully' })
  message: string;

  @ApiProperty({
    example: {
      user: {
        id: '64a7b2f5e1b0c8a1d2e3f4g5',
        email: 'test@gmail.com',
        name: 'John Doe',
        role: 'student',
      },
      accessToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZDgzZDE0NDYwMGJkOWRlN',
      refreshToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZDgzZDE0NDYwMGJkOWRlN',
    },
  })
  data: {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
    };
    accessToken: string;
    refreshToken: string;
  };
}

export class SignInDto {
  @ApiProperty({ example: 'example@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'Password123' })
  @IsString()
  password: string;
}

export class SignInResponseDto {
  @ApiProperty({ example: 200 })
  status: number;

  @ApiProperty({ example: 'Sign in Successful' })
  message: string;

  @ApiProperty({
    example: {
      user: {
        id: '64a7b2f5e1b0c8a1d2e3f4g5',
        email: 'test@gmail.com',
        name: 'John Doe',
        role: 'student',
      },
      accessToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZDgzZDE0NDYwMGJkOWRlN',
      refreshToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZDgzZDE0NDYwMGJkOWRlN',
    },
  })
  data: {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
    };
    accessToken: string;
    refreshToken: string;
  };
}

export class RefreshTokenResponseDto {
  @ApiProperty({ example: 200 })
  status: number;

  @ApiProperty({ example: 'Token refreshed successfully' })
  message: string;

  @ApiProperty({
    example: {
      accessToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZDgzZDE0NDYwMGJkOWRlN',
      refreshToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZDgzZDE0NDYwMGJkOWRlN',
    },
  })
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

export class ResetPasswordDto {
  @ApiProperty({ example: '123456', required: true })
  @IsString()
  otp: string;

  @ApiProperty({ example: 'newPassword123', required: true })
  @IsString()
  password: string;
}
export class ResetPasswordResponseDto {
  @ApiProperty({ example: 200 })
  status: number;

  @ApiProperty({ example: 'Password reset successful' })
  message: string;
}

export class ChangePasswordDto {
  @ApiProperty({ example: 'oldPassword123', required: true })
  @IsString()
  oldPassword: string;

  @ApiProperty({ example: 'newPassword123', required: true })
  @IsString()
  newPassword: string;
}

export class ChangePasswordResponseDto {
  @ApiProperty({ example: 200 })
  status: number;

  @ApiProperty({ example: 'Password change successful' })
  message: string;
}
