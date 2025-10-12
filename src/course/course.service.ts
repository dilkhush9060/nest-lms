import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Course } from './course.schema';
import { Model } from 'mongoose';
import { ModuleService } from './module/module.service';
import { CourseDto } from './course.dto';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name)
    private courseModel: Model<Course>,
    private readonly moduleService: ModuleService,
  ) {}

  // create a new course
  async create(userID: string, courseDto: CourseDto) {
    const exists = await this.courseModel.findOne({
      slug: courseDto.name.toLowerCase(),
    });

    if (exists) {
      throw new BadRequestException('Course already exists');
    }

    const course = await this.courseModel.create({
      name: courseDto.name,
      slug: courseDto.name.toLowerCase(),
      author: userID,
      category: courseDto.category,
      desc: courseDto.desc,
      isPaid: courseDto.isPaid,
      price: courseDto.price,
      discountedPrice: courseDto.discountedPrice,
    });

    if (!course) {
      throw new BadRequestException('Failed to create course');
    }

    return {
      course,
    };
  }

  // get all course
  async getAll() {
    const courses = await this.courseModel
      .find({})
      .populate('author', 'name')
      .populate('category', 'name');

    if (courses.length === 0) {
      throw new NotFoundException('Courses not found');
    }

    return {
      courses,
    };
  }

  // get by slug
  async getBySlug(slug: string) {
    const course = await this.courseModel
      .findOne({ slug })
      .populate('author', 'name')
      .populate('category', 'name');

    if (!course) {
      throw new NotFoundException('Courses not found');
    }

    return {
      course,
    };
  }

  // update course
  async update(slug: string, courseData: Partial<Course>) {
    const course = await this.courseModel.findOne({ slug });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // update logic here
    const updatedCourse = await this.courseModel
      .findOneAndUpdate(
        {
          slug,
        },
        {
          ...courseData,
        },
        { new: true },
      )
      .populate('category', 'name');

    return {
      updatedCourse,
    };
  }

  // delete course
  async delete(slug: string) {
    const course = await this.courseModel.findOne({ slug });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    // delete the course
    await this.courseModel.deleteOne({ slug });

    return {
      course,
    };
  }
}
