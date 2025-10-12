import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Module } from './module.schema';
import { Model, Types } from 'mongoose';
import { CreateModuleDto } from './module.dto';
import { Course } from '../course.schema';

@Injectable()
export class ModuleService {
  constructor(
    @InjectModel(Module.name)
    private moduleModel: Model<Module>,
    @InjectModel(Course.name)
    private courseModel: Model<Course>,
  ) {}

  // create module
  async createModule(courseId: string, createModuleDto: CreateModuleDto) {
    const course = await this.courseModel.findById(
      new Types.ObjectId(courseId),
    );

    if (!course) {
      throw new BadRequestException('Course not found');
    }

    const newModule = await this.moduleModel.create({
      name: createModuleDto.name,
      desc: createModuleDto.desc,
      course: course._id,
    });

    if (!newModule) {
      throw new BadRequestException('Failed to create module');
    }

    // push module to course

    course.modules.push(newModule._id);
    await course.save();

    return {
      newModule,
    };
  }

  // get all modules
  async getAllModules(courseId: string) {
    const modules = await this.moduleModel
      .find({
        course: courseId,
      })
      .populate('lessons', '-module')
      .exec();

    if (modules.length === 0) {
      throw new BadRequestException('No modules found');
    }

    return { modules };
  }

  // get module by id
  async getModuleById(id: string) {
    const module = await this.moduleModel
      .findOne({
        _id: new Types.ObjectId(id),
      })
      .populate('lessons', '-module')
      .exec();

    if (!module) {
      throw new BadRequestException('Module not found');
    }
    return { module };
  }

  // update module
  async updateModule(id: string, createModuleDto: CreateModuleDto) {
    const module = await this.moduleModel.findOne({
      _id: new Types.ObjectId(id),
    });

    if (!module) {
      throw new BadRequestException('Module not found');
    }

    module.name = createModuleDto.name;
    module.desc = createModuleDto.desc;

    const updatedModule = await module.save();

    return { updatedModule };
  }

  // delete module
  async deleteModule(id: string) {
    const module = await this.moduleModel.findOne({ _id: id });

    if (!module) {
      throw new BadRequestException('Module not found');
    }

    await this.moduleModel.deleteOne({ _id: module._id });

    // remove module from course
    const course = await this.courseModel.findById(module.course);

    if (course) {
      course.modules = course.modules.filter(
        (modId) => modId.toString() !== module._id.toString(),
      );
      await course.save();
    }

    return { module };
  }
}
