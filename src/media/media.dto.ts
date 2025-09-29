import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class MediaDto {
  @ApiProperty({
    example: 'test',
    required: true,
  })
  @IsString()
  folder: string;

  @ApiProperty({
    example: 'test.png',
    required: true,
  })
  @IsString()
  key: string;
}

export class MediaResponseDto {
  @ApiProperty({ example: 201 })
  status: number;

  @ApiProperty({ example: 'Presigned url generated' })
  message: string;

  @IsString()
  @ApiProperty({
    example: {
      url: 'https://example.com/presigned-url',
      key: 'test/test.png',
    },
  })
  data: {
    url: string;
    key: string;
  };
}
