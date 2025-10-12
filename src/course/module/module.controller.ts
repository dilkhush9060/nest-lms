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
import { AuthGuard, RolesGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/role.decorator';
import {
  BadRequestDto,
  ForbiddenDto,
  UnauthorizedDto,
} from 'src/common/dto/response.dto';
import { Role } from 'src/user/user.types';
import {
  CreateModuleDto,
  CreateModuleResponseDto,
  DeleteModuleResponseDto,
  UpdateModuleResponseDto,
} from './module.dto';
import { ModuleService } from './module.service';

@ApiTags('Course')
@Controller('courses/:courseId/modules')
export class ModuleController {
  constructor(private readonly moduleService: ModuleService) {}

  //create module
  @ApiOperation({ summary: 'Create a new module' })
  @ApiBearerAuth()
  @ApiResponse({ status: 201, type: CreateModuleResponseDto })
  @ApiResponse({ status: 400, type: BadRequestDto })
  @ApiResponse({ status: 401, type: UnauthorizedDto })
  @ApiResponse({ status: 403, type: ForbiddenDto })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Post()
  async createModule(@Body() createModuleDto: CreateModuleDto) {
    const result = await this.moduleService.createModule(createModuleDto);
    return {
      statusCode: 201,
      message: 'Module created successfully',
      data: result.newModule,
    };
  }

  // get all modules
  @ApiOperation({ summary: 'Get all modules' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: CreateModuleResponseDto, isArray: true })
  @ApiResponse({ status: 400, type: BadRequestDto })
  @UseGuards(AuthGuard)
  @Get('/')
  async getAllModules(@Param('courseId') courseId: string) {
    const result = await this.moduleService.getAllModules(courseId);
    return {
      statusCode: 200,
      message: 'Modules fetched successfully',
      data: result.modules,
    };
  }

  //get single module by id
  @ApiOperation({ summary: 'Get single module by id' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: CreateModuleResponseDto })
  @ApiResponse({ status: 400, type: BadRequestDto })
  @UseGuards(AuthGuard)
  @Get('/:id')
  async getModuleById(@Param('id') id: string) {
    const result = await this.moduleService.getModuleById(id);
    return {
      statusCode: 200,
      message: 'Module fetched successfully',
      data: result.module,
    };
  }

  //update module by id
  @ApiOperation({ summary: 'Update module by id' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: UpdateModuleResponseDto })
  @ApiResponse({ status: 400, type: BadRequestDto })
  @ApiResponse({ status: 401, type: UnauthorizedDto })
  @ApiResponse({ status: 403, type: ForbiddenDto })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Patch('/:id')
  async updateModuleById(
    @Param('id') id: string,
    @Body() updateModuleDto: CreateModuleDto,
  ) {
    const result = await this.moduleService.updateModule(id, updateModuleDto);
    return {
      statusCode: 200,
      message: 'Module updated successfully',
      data: result.updatedModule,
    };
  }

  // delete module by id
  @ApiOperation({ summary: 'Delete module by id' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, type: DeleteModuleResponseDto })
  @ApiResponse({ status: 400, type: BadRequestDto })
  @ApiResponse({ status: 401, type: UnauthorizedDto })
  @ApiResponse({ status: 403, type: ForbiddenDto })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Delete('/:id')
  async deleteModuleById(@Param('id') id: string) {
    const result = await this.moduleService.deleteModule(id);
    return {
      statusCode: 200,
      message: 'Module deleted successfully',
      data: result.module,
    };
  }
}
