import * as express from 'express';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
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
  GetAllCourseResponseDto,
  GetBySlugCourseResponseDto,
} from './course.dto';
import { AuthGuard, RolesGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/role.decorator';
import { Role } from 'src/user/user.types';
import { CourseService } from './course.service';

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
  @ApiOperation({ summary: 'Get All Courses' })
  @ApiResponse({ status: 200, type: GetAllCourseResponseDto })
  @ApiResponse({ status: 404, type: NotFoundDto })
  @Get('/')
  async getAll() {
    const result = await this.courseService.getAll();

    return {
      statusCode: 200,
      message: 'Courses fetched successful',
      data: {
        courses: result.courses,
      },
    };
  }

  // get courses
  @ApiOperation({ summary: 'Get All Courses' })
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
}
