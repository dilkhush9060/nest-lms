import { ApiProperty } from '@nestjs/swagger';

export class BadRequestDto {
  @ApiProperty({ example: 400 })
  status: number;

  @ApiProperty({ example: 'Bad Request' })
  message: string;
}

export class UnauthorizedDto {
  @ApiProperty({ example: 401 })
  status: number;

  @ApiProperty({ example: 'Unauthorized' })
  message: string;
}

export class ForbiddenDto {
  @ApiProperty({ example: 403 })
  status: number;

  @ApiProperty({ example: 'Forbidden' })
  message: string;
}

export class NotFoundDto {
  @ApiProperty({ example: 404 })
  status: number;

  @ApiProperty({ example: 'Not Found' })
  message: string;
}

export class InternalServerErrorDto {
  @ApiProperty({ example: 500 })
  status: number;

  @ApiProperty({ example: 'Internal Server Error' })
  message: string;
}
