import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Lesson } from './lesson.schema';
import { Module } from '../module/module.schema';
import { CreateLessonDto } from './lesson.dto';
import { Model, Types } from 'mongoose';

@Injectable()
export class LessonService {
  constructor(
    @InjectModel(Lesson.name)
    private lessonModel: Model<Lesson>,
    @InjectModel(Module.name)
    private moduleModel: Model<Module>,
  ) {}

  // create new lesson
  async createLesson(moduleId: string, createLessonDto: CreateLessonDto) {
    const module = await this.moduleModel.findById(
      new Types.ObjectId(moduleId),
    );

    if (!module) {
      throw new BadRequestException('Module not found');
    }

    const newLesson = await this.lessonModel.create({
      name: createLessonDto.name,
      module: module._id,
    });

    if (!newLesson) {
      throw new BadRequestException('Failed to create lesson');
    }

    // push lesson to module
    module.lessons.push(newLesson._id);
    await module.save();

    return {
      newLesson,
    };
  }
}
