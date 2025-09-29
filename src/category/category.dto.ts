import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CategoryDto {
  @ApiProperty({
    example: 'Web dev',
    description: '',
    required: true,
  })
  @IsString()
  name: string;
}

export class CreateCategoryResponseDto {
  @ApiProperty({ example: 201 })
  status: number;

  @ApiProperty({ example: 'Category created successful' })
  message: string;

  @ApiProperty({
    example: {
      name: 'category',
      slug: 'category_slug',
    },
  })
  data: {
    name: string;
    slug: string;
    createAt: Date;
  };
}

export class UpdateCategoryResponseDto {
  @ApiProperty({ example: 200 })
  status: number;

  @ApiProperty({ example: 'Category updated successful' })
  message: string;

  @ApiProperty({
    example: {
      name: 'category',
      slug: 'category_slug',
    },
  })
  data: {
    name: string;
    slug: string;
    createAt: Date;
  };
}

export class GetCategoryResponseDto {
  @ApiProperty({ example: 200 })
  status: number;

  @ApiProperty({ example: 'Category fetched Successful' })
  message: string;

  @ApiProperty({
    example: {
      name: 'category',
      slug: 'category_slug',
    },
  })
  data: {
    name: string;
    slug: string;
    createAt: Date;
  };
}

export class GetCategoriesResponseDto {
  @ApiProperty({ example: 200 })
  status: number;

  @ApiProperty({ example: 'Category fetched Successful' })
  message: string;

  @ApiProperty({
    example: Array<{
      name: 'category';
      slug: 'category_slug';
    }>,
  })
  data: Array<{
    name: string;
    slug: string;
    createAt: Date;
  }>;
}

export class DeleteCategoryResponseDto {
  @ApiProperty({ example: 200 })
  status: number;

  @ApiProperty({ example: 'Category deleted successful' })
  message: string;
}
