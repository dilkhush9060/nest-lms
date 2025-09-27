import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

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
}
