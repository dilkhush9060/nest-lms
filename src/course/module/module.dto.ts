import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateModuleDto {
  @ApiProperty({ example: 'Module 1' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'module description' })
  @IsString()
  desc: string;
}

export class CreateModuleResponseDto {
  @ApiProperty({ example: 201 })
  status: number;

  @ApiProperty({ example: 'Module created successfully' })
  message: string;

  @ApiProperty({
    example: {
      name: 'Module 1',
      desc: 'module description',
      course: '68d9136b69186756756dac1c',
      lessons: [],
      _id: '68d9136b69186756756dac1c',
      createdAt: '2023-12-10T10:00:00.000Z',
      updatedAt: '2023-12-10T10:00:00.000Z',
    },
  })
  data: CreateModuleDto & {
    _id: string;
    lessons: string[];
    createdAt: string;
    updatedAt: string;
  };
}

export class GetAllModulesResponseDto {
  @ApiProperty({ example: 200 })
  status: number;

  @ApiProperty({ example: 'Modules fetched successfully' })
  message: string;

  @ApiProperty({
    example: {
      modules: [
        {
          name: 'Module 1',
          desc: 'module description',
          course: '68d9136b69186756756dac1c',
          lessons: [],
          _id: '68d9136b69186756756dac1c',
          createdAt: '2023-12-10T10:00:00.000Z',
          updatedAt: '2023-12-10T10:00:00.000Z',
        },
      ],
    },
  })
  data: {
    modules: (CreateModuleDto & {
      _id: string;
      lessons: string[];
      createdAt: string;
      updatedAt: string;
    })[];
  };
}

export class GetModuleResponseDto {
  @ApiProperty({ example: 200 })
  status: number;

  @ApiProperty({ example: 'Module fetched successfully' })
  message: string;

  @ApiProperty({
    example: {
      module: {
        name: 'Module 1',
        desc: 'module description',
        course: '68d9136b69186756756dac1c',
        lessons: [
          {
            _id: '68d9136b69186756756dac1c',
            name: 'Lesson 1',
            content: 'lesson content',
            module: '68d9136b69186756756dac1c',
            createdAt: '2023-12-10T10:00:00.000Z',
            updatedAt: '2023-12-10T10:00:00.000Z',
          },
        ],
        _id: '68d9136b69186756756dac1c',
        createdAt: '2023-12-10T10:00:00.000Z',
        updatedAt: '2023-12-10T10:00:00.000Z',
      },
    },
  })
  data: {
    module: CreateModuleDto & {
      _id: string;
      lessons: any[];
      createdAt: string;
      updatedAt: string;
    };
  };
}

export class UpdateModuleResponseDto {
  @ApiProperty({ example: 200 })
  status: number;

  @ApiProperty({ example: 'Module updated successfully' })
  message: string;

  @ApiProperty({
    example: {
      name: 'Updated Module Name',
      desc: 'Updated module description',
      course: '68d9136b69186756756dac1c',
      lessons: [],
      _id: '68d9136b69186756756dac1c',
      createdAt: '2023-12-10T10:00:00.000Z',
      updatedAt: '2023-12-10T11:00:00.000Z  ',
    },
  })
  data: CreateModuleDto & {
    _id: string;
    lessons: string[];
    createdAt: string;
    updatedAt: string;
  };
}

export class DeleteModuleResponseDto {
  @ApiProperty({ example: 200 })
  status: number;

  @ApiProperty({ example: 'Module deleted successfully' })
  message: string;
}
