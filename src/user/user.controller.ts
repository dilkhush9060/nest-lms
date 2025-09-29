import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { UserService } from './user.service';
import { Roles } from 'src/auth/role.decorator';
import { Role } from './user.types';
import { AuthGuard, RolesGuard } from 'src/auth/auth.guard';

@ApiTags('User')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({
    summary: 'Get All Users',
    description: 'Fetch a list of all users (Admin only)',
  })
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @Get()
  async getAllUsers() {
    const result = await this.userService.getAllUsers();

    return {
      statusCode: 200,
      message: 'Users fetched successfully',
      data: result,
    };
  }
}
