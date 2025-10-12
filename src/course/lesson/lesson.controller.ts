import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LessonService } from './lesson.service';
import { Roles } from 'src/auth/role.decorator';
import { Role } from 'src/user/user.types';
import {
  BadRequestDto,
  ForbiddenDto,
  UnauthorizedDto,
} from 'src/common/dto/response.dto';
import { AuthGuard, RolesGuard } from 'src/auth/auth.guard';
import { CreateLessonDto } from './lesson.dto';

@ApiTags('Course')
@Controller('courses/:courseId/modules/:moduleId/lessons')
export class LessonController {
  constructor(private readonly lessonService: LessonService) {}

  // create new lesson
  @ApiOperation({ summary: 'Create a new lesson' })
  @ApiBearerAuth()
  @ApiResponse({ status: 201 })
  @ApiResponse({ status: 400, type: BadRequestDto })
  @ApiResponse({ status: 401, type: UnauthorizedDto })
  @ApiResponse({ status: 403, type: ForbiddenDto })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post()
  async createLesson(
    @Param('moduleId') moduleId: string,
    @Body() createLessonDto: CreateLessonDto,
  ) {
    const result = await this.lessonService.createLesson(
      moduleId,
      createLessonDto,
    );
    return {
      statusCode: 201,
      message: 'Create lesson',
      data: result,
    };
  }
}
