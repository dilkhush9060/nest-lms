import * as express from 'express';
import { Types } from 'mongoose';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import {
  BadRequestDto,
  ForbiddenDto,
  NotFoundDto,
  UnauthorizedDto,
} from 'src/common/dto/response.dto';
import {
  CourseDto,
  CourseResponseDto,
  DeleteCourseResponseDto,
  GetAllCourseResponseDto,
  GetBySlugCourseResponseDto,
  UpdateCourseDto,
  UpdateCourseResponseDto,
} from './course.dto';
import { AuthGuard, RolesGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/role.decorator';
import { Role } from 'src/user/user.types';
import { CourseService } from './course.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { FilterDto } from 'src/common/dto/filter.dto';

@ApiTags('Course')
@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}
  // create course
  @ApiOperation({ summary: 'Create a new course' })
  @ApiBearerAuth()
  @ApiResponse({ status: 201, type: CourseResponseDto })
  @ApiResponse({ status: 400, type: BadRequestDto })
  @ApiResponse({ status: 401, type: UnauthorizedDto })
  @ApiResponse({ status: 403, type: ForbiddenDto })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post('/')
  async create(
    @Body() courseDto: CourseDto,
    @Request() request: express.Request,
  ) {
    const userId = request['user']?.id;

    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    const result = await this.courseService.create(userId, courseDto);

    return {
      statusCode: 201,
      message: 'Course created successful',
      data: {
        course: result.course,
      },
    };
  }

  // get courses
  @ApiOperation({ summary: 'Get all courses' })
  @ApiResponse({ status: 200, type: GetAllCourseResponseDto })
  @ApiResponse({ status: 404, type: NotFoundDto })
  @Get('/')
  async getAll(
    @Query() paginationDto: PaginationDto,
    @Query() filterDto: FilterDto,
  ) {
    const result = await this.courseService.getAll(paginationDto, filterDto);

    return {
      statusCode: 200,
      message: 'Courses fetched successful',
      data: result.courses,
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages,
    };
  }

  // get courses
  @ApiOperation({ summary: 'Get course by slug' })
  @ApiResponse({ status: 200, type: GetBySlugCourseResponseDto })
  @ApiResponse({ status: 404, type: NotFoundDto })
  @Get('/:slug')
  async getBySlug(@Param('slug') slug: string) {
    const result = await this.courseService.getBySlug(slug);

    return {
      statusCode: 200,
      message: 'Course fetched successful',
      data: {
        course: result.course,
      },
    };
  }

  // update course
  @ApiOperation({ summary: 'Update a course by slug' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: UpdateCourseResponseDto })
  @ApiResponse({ status: 400, type: BadRequestDto })
  @ApiResponse({ status: 401, type: UnauthorizedDto })
  @ApiResponse({ status: 403, type: ForbiddenDto })
  @ApiResponse({ status: 404, type: NotFoundDto })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Patch('/:slug')
  async update(
    @Param('slug') slug: string,
    @Body() courseDto: UpdateCourseDto,
  ) {
    const updateData = {
      ...courseDto,
      category: courseDto.category
        ? new Types.ObjectId(courseDto.category)
        : undefined,
    };
    const result = await this.courseService.update(slug, updateData);

    return {
      statusCode: 200,
      message: 'Course updated successful',
      data: {
        course: result.updatedCourse,
      },
    };
  }

  // delete course
  @ApiOperation({ summary: 'Delete a course by slug' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: DeleteCourseResponseDto })
  @ApiResponse({ status: 400, type: BadRequestDto })
  @ApiResponse({ status: 401, type: UnauthorizedDto })
  @ApiResponse({ status: 403, type: ForbiddenDto })
  @ApiResponse({ status: 404, type: NotFoundDto })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Delete('/:slug')
  async delete(@Param('slug') slug: string) {
    const result = await this.courseService.delete(slug);

    return {
      statusCode: 200,
      message: 'Course deleted successful',
      data: {
        course: result.course,
      },
    };
  }
}
