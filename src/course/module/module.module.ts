import { Module } from '@nestjs/common';
import { ModuleService } from './module.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Module as ModelDoc, ModuleSchema } from './module.schema';
import { ModuleController } from './module.controller';
import { Course, CourseSchema } from '../course.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ModelDoc.name, schema: ModuleSchema }]),
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
  ],
  providers: [ModuleService],
  exports: [ModuleService],
  controllers: [ModuleController],
})
export class ModuleModule {}
