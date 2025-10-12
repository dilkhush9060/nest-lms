import { Module } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Lesson, LessonSchema } from './lesson.schema';
import { Module as ModelDoc, ModuleSchema } from '../module/module.schema';
import { LessonController } from './lesson.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Lesson.name, schema: LessonSchema }]),
    MongooseModule.forFeature([{ name: ModelDoc.name, schema: ModuleSchema }]),
  ],
  providers: [LessonService],
  exports: [LessonService],
  controllers: [LessonController],
})
export class LessonModule {}
