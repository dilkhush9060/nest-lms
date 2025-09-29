import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from './course.schema';
import { ModuleModule } from './module/module.module';
import { LessonModule } from './lesson/lesson.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
    ModuleModule,
    LessonModule,
  ],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
