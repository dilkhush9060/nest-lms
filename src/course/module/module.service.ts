import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Module } from './module.schema';
import { Model, Types } from 'mongoose';
import { CreateModuleDto } from './module.dto';
import { generateSlug } from 'src/common/utils/slug.utils';
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
  async createModule(createModuleDto: CreateModuleDto) {
    const slug = generateSlug(createModuleDto.name);

    const module = await this.moduleModel.findOne({ slug });

    if (module) {
      throw new BadRequestException('Module already exists');
    }

    const newModule = await this.moduleModel.create({
      name: createModuleDto.name,
      slug: slug,
      desc: createModuleDto.desc,
      course: createModuleDto.course,
    });

    if (!newModule) {
      throw new BadRequestException('Failed to create module');
    }

    // push module to course
    const course = await this.courseModel.findById(createModuleDto.course);
    if (!course) {
      throw new BadRequestException('Course not found');
    }
    course.modules.push(newModule._id);
    await course.save();

    return {
      newModule,
    };
  }

  // get all modules
  async getAllModules(courseId) {
    const modules = await this.moduleModel
      .find({
        course: courseId,
      })
      .populate('lessons')
      .exec();

    if (modules.length === 0) {
      throw new BadRequestException('No modules found');
    }

    return { modules };
  }

  // get module by slug
  async getModuleById(id: string) {
    const module = await this.moduleModel
      .findOne({
        _id: new Types.ObjectId(id),
      })
      .populate('lessons')
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

    const newSlug = generateSlug(createModuleDto.name);

    // check if new slug already exists
    const moduleWithNewSlug = await this.moduleModel.findOne({ slug: newSlug });

    if (
      moduleWithNewSlug &&
      moduleWithNewSlug._id.toString() !== module._id.toString()
    ) {
      throw new BadRequestException('Module with this name already exists');
    }

    module.name = createModuleDto.name;
    module.slug = newSlug;
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
