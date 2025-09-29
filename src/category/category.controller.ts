import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import {
  CategoryDto,
  CreateCategoryResponseDto,
  DeleteCategoryResponseDto,
  GetCategoriesResponseDto,
  GetCategoryResponseDto,
  UpdateCategoryResponseDto,
} from './category.dto';
import {
  BadRequestDto,
  ForbiddenDto,
  NotFoundDto,
  UnauthorizedDto,
} from 'src/common/dto/response.dto';
import { CategoryService } from './category.service';
import { Roles } from 'src/auth/role.decorator';
import { Role } from 'src/user/user.types';
import { AuthGuard, RolesGuard } from 'src/auth/auth.guard';

@ApiTags('Category')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // create  new category
  @ApiOperation({ summary: 'Create a new category' })
  @ApiBearerAuth()
  @ApiResponse({ status: 201, type: CreateCategoryResponseDto })
  @ApiResponse({ status: 400, type: BadRequestDto })
  @ApiResponse({ status: 401, type: UnauthorizedDto })
  @ApiResponse({ status: 403, type: ForbiddenDto })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post('/')
  async create(@Body() categoryDto: CategoryDto) {
    const result = await this.categoryService.create(
      categoryDto.name.toLocaleLowerCase(),
      categoryDto,
    );

    return {
      statusCode: 201,
      message: 'Category created successful',
      data: {
        category: result.category,
      },
    };
  }

  // get all
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, type: GetCategoriesResponseDto })
  @ApiResponse({ status: 404, type: NotFoundDto })
  @Get('/')
  async getAll() {
    const result = await this.categoryService.getAll();

    return {
      statusCode: 200,
      message: 'categories fetched successful',
      data: {
        categories: result.categories,
      },
    };
  }

  // get all
  @ApiOperation({ summary: 'Get categories by slug' })
  @ApiResponse({ status: 200, type: GetCategoryResponseDto })
  @ApiResponse({ status: 404, type: NotFoundDto })
  @Get('/:slug')
  async getBySlug(@Param('slug') slug: string) {
    const result = await this.categoryService.getBySlug(slug);

    return {
      statusCode: 200,
      message: 'Category fetched successful',
      data: {
        category: result.category,
      },
    };
  }

  // update category
  @ApiOperation({ summary: 'Update category by slug' })
  @ApiBearerAuth()
  @ApiResponse({ status: 201, type: UpdateCategoryResponseDto })
  @ApiResponse({ status: 400, type: BadRequestDto })
  @ApiResponse({ status: 401, type: UnauthorizedDto })
  @ApiResponse({ status: 403, type: ForbiddenDto })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Patch('/:slug')
  async update(@Body() categoryDto: CategoryDto, @Param('slug') slug: string) {
    const result = await this.categoryService.update(slug, categoryDto);

    return {
      statusCode: 200,
      message: 'Category updated successful',
      data: {
        category: result.category,
      },
    };
  }

  // delete category
  @ApiOperation({ summary: 'Delete category by slug' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: DeleteCategoryResponseDto })
  @ApiResponse({ status: 400, type: BadRequestDto })
  @ApiResponse({ status: 401, type: UnauthorizedDto })
  @ApiResponse({ status: 403, type: ForbiddenDto })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Delete('/:slug')
  async delete(@Param('slug') slug: string) {
    await this.categoryService.delete(slug);

    return {
      statusCode: 200,
      message: 'Category deleted successful',
      data: null,
    };
  }
}
