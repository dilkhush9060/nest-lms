import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Course } from './course.schema';
import { Model } from 'mongoose';
import { CourseDto } from './course.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { FilterDto } from 'src/common/dto/filter.dto';
import { buildMongoFilter } from 'src/common/utils/filter.utils';
import { generateSlug } from 'src/common/utils/slug.utils';

@Injectable()
export class CourseService {
  constructor(
    @InjectModel(Course.name)
    private courseModel: Model<Course>,
  ) {}

  // create a new course
  async create(userID: string, courseDto: CourseDto) {
    const slug = generateSlug(courseDto.name);

    const exists = await this.courseModel.findOne({
      slug,
    });

    if (exists) {
      throw new BadRequestException('Course already exists');
    }

    const course = await this.courseModel.create({
      name: courseDto.name,
      slug: slug,
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
  async getAll(paginationDto: PaginationDto, filterDto: FilterDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const filter = buildMongoFilter(filterDto);

    const [courses, total] = await Promise.all([
      this.courseModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .populate('author', 'name picture')
        .populate('author', 'name picture')
        .populate({
          path: 'modules',
          populate: { path: 'lessons' },
        }),
      this.courseModel.countDocuments(),
    ]);

    if (courses.length === 0) {
      throw new NotFoundException('Courses not found');
    }

    return {
      courses,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  // get by slug
  async getBySlug(slug: string) {
    const course = await this.courseModel
      .findOne({ slug })
      .populate('author', 'name picture')
      .populate('author', 'name picture')
      .populate({
        path: 'modules',
        populate: { path: 'lessons' },
      });

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

    // if updated slug already exists
    if (courseData.name) {
      const newSlug = generateSlug(courseData.name);

      if (newSlug !== slug) {
        const exists = await this.courseModel.findOne({ slug: newSlug });
        if (exists) {
          throw new BadRequestException('Course with this name already exists');
        }
        courseData.slug = newSlug;
      }
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
