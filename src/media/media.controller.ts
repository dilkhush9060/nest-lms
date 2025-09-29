import { Body, Controller, Post } from '@nestjs/common';
import { MediaService } from './media.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MediaDto, MediaResponseDto } from './media.dto';
import { BadRequestDto } from 'src/common/dto/response.dto';

@ApiTags('Media')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  // get presigned url for upload
  @ApiOperation({ summary: 'Get presigned URL for upload' })
  @ApiResponse({
    status: 201,
    type: MediaResponseDto,
  })
  @ApiResponse({ status: 400, type: BadRequestDto })
  @Post('presigned')
  async getPresignedUrl(@Body() body: MediaDto) {
    const result = await this.mediaService.getPresignedUrl({
      folder: body.folder,
      Key: body.key,
    });
    return {
      statusCode: 201,
      message: 'Presigned URL generated successful',
      data: { ...result },
    };
  }
}
