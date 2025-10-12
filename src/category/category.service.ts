import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './category.schema';
import { CategoryDto } from './category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {}

  // create new category
  async create(slug: string, categoryDto: CategoryDto) {
    const exist = await this.categoryModel.findOne({
      slug,
    });

    // if already exists
    if (exist) {
      throw new BadRequestException('Category already exists');
    }

    // create new one
    const category = await this.categoryModel.create({
      name: categoryDto.name,
      slug: categoryDto.name.toLowerCase(),
    });

    return {
      category,
    };
  }

  // update category
  async update(slug: string, updatedData: Partial<Category>) {
    const category = await this.categoryModel.findOne({
      slug,
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    category.name = updatedData.name || category.name;
    category.slug = updatedData.name?.toLowerCase() || category.slug;

    // update
    await category.save();

    return {
      category,
    };
  }

  // get All
  async getAll() {
    const categories = await this.categoryModel.find({});

    if (categories.length === 0) {
      throw new NotFoundException('Categories not found');
    }

    return {
      categories,
    };
  }

  // get by slug
  async getBySlug(slug: string) {
    const category = await this.categoryModel.findOne({
      slug,
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return {
      category,
    };
  }

  // delete category
  async delete(slug: string) {
    const category = await this.categoryModel.findOne({
      slug,
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    await this.categoryModel.findOneAndDelete({
      _id: category._id,
    });

    return true;
  }
}
