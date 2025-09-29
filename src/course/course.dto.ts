import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean } from 'class-validator';

export class CourseDto {
  @ApiProperty({
    example: 'React',
    required: true,
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'React Description',
    required: true,
  })
  @IsString()
  desc: string;

  @ApiProperty({
    example: '68d9136b69186756756dac1c',
    description: 'Category Id',
    required: true,
  })
  @IsString()
  category: string;

  @ApiProperty({
    example: true,
    required: false,
  })
  @IsBoolean()
  isPaid: boolean;

  @ApiProperty({
    example: '1000',
    required: true,
  })
  @IsString()
  price: string;

  @ApiProperty({
    example: '900',
    required: true,
  })
  @IsString()
  discountedPrice: string;
}

export class CourseResponseDto {
  @ApiProperty({ example: 201 })
  status: number;

  @ApiProperty({ example: 'Course created successful' })
  message: string;

  @ApiProperty({
    example: {
      name: 'React',
      slug: 'react',
      desc: 'course description',
      price: '1000',
      discountedPrice: '900',
      category: {
        name: 'Frontend',
      },
    },
  })
  data: CourseDto;
}

export class GetAllCourseResponseDto {
  @ApiProperty({ example: 200 })
  status: number;

  @ApiProperty({ example: 'Courses fetched successful' })
  message: string;

  @ApiProperty({
    example: [
      {
        name: 'React',
        slug: 'react',
        desc: 'course description',
        price: '1000',
        discountedPrice: '900',
        category: {
          name: 'Frontend',
        },
      },
    ],
  })
  data: CourseDto[];
}

export class GetBySlugCourseResponseDto {
  @ApiProperty({ example: 200 })
  status: number;

  @ApiProperty({ example: 'Courses fetched successful' })
  message: string;

  @ApiProperty({
    example: {
      name: 'React',
      slug: 'react',
      desc: 'course description',
      price: '1000',
      discountedPrice: '900',
      category: {
        name: 'Frontend',
      },
    },
  })
  data: CourseDto;
}
