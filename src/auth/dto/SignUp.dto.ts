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
    example: 'strongPassword123',
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
