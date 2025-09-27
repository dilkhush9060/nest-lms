import * as express from 'express';
import {
  Controller,
  Get,
  UseGuards,
  Request,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ProfileService } from './profile.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Profile')
@ApiBearerAuth()
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile fetched successfully.',
  })
  @UseGuards(AuthGuard)
  @Get('/')
  async getProfile(@Request() request: express.Request) {
    const userId = request['user']?.id;

    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }
    const result = await this.profileService.getProfile(userId);

    if (!result) {
      throw new NotFoundException('Profile not found');
    }

    return {
      statusCode: 200,
      message: 'User profile fetched successfully',
      data: {
        _id: result._id,
        name: result.name,
        email: result.email,
        role: result.role,
      },
    };
  }
}
