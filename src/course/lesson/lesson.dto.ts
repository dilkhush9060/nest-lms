import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateLessonDto {
  @ApiProperty({ description: 'Name of the lesson' })
  @IsString()
  name: string;
}

export class CreateLessonResponseDto {
  @ApiProperty({ description: 'Status code of the response' })
  statusCode: number;

  @ApiProperty({ description: 'Message of the response' })
  message: string;

  @ApiProperty({
    example: {
      name: 'Module 1',
      slug: 'module-1',
      desc: 'module description',
      module: '68d9136b69186756756dac1c',
      _id: '68d9136b69186756756dac1c',
      createdAt: '2023-12-10T10:00:00.000Z',
      updatedAt: '2023-12-10T10:00:00.000Z',
    },
  })
  data: CreateLessonDto & {
    _id: string;
    createdAt: string;
    updatedAt: string;
  };
}
