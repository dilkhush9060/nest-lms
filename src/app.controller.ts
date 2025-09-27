import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Health Check')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({
    summary: 'Health Check',
    description: 'Check if the service is running',
  })
  @ApiResponse({
    status: 200,
    description: 'Service is up and running.',
    schema: {
      example: { statusCode: 200, message: 'Service is up and running' },
    },
  })
  @Get()
  getHello() {
    return this.appService.getHello();
  }
}
