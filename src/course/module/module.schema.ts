import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types, Model, Query } from 'mongoose';
import { Lesson } from '../lesson/lesson.schema';

// Define the document type for the Module
export type ModuleDocument = HydratedDocument<Module>;

@Schema({ timestamps: true })
export class Module {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, trim: true, lowercase: true, unique: true })
  slug: string;

  @Prop({ required: true })
  desc: string;

  @Prop({ type: Types.ObjectId, ref: 'Course', required: true })
  course: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Lesson' }], default: [] })
  lessons: Types.ObjectId[];
}

export const ModuleSchema = SchemaFactory.createForClass(Module);

// Cascade delete lessons when a module is deleted (document middleware)
ModuleSchema.pre(
  'deleteOne',
  { document: true, query: false },
  async function (next) {
    try {
      const moduleId = this._id;
      if (!moduleId) {
        throw new Error('Module ID is undefined');
      }
      // Explicitly type the model method
      const LessonModel: Model<Lesson> = this.model('Lesson');
      await LessonModel.deleteMany({ module: moduleId }).exec();
      next();
    } catch (error) {
      next(
        error instanceof Error
          ? error
          : new Error('Error in deleteOne middleware'),
      );
    }
  },
);

// Cascade delete lessons when using findOneAndDelete / findByIdAndDelete (query middleware)
ModuleSchema.pre(
  'findOneAndDelete',
  async function (this: Query<unknown, ModuleDocument>, next) {
    try {
      const doc = (await this.model
        .findOne(this.getFilter())
        .exec()) as ModuleDocument | null;
      if (doc) {
        const LessonModel = new this.model('Lesson') as Model<Lesson>;
        await LessonModel.deleteMany({ module: doc._id }).exec();
      }
      next();
    } catch (error) {
      next(
        error instanceof Error
          ? error
          : new Error('Error in findOneAndDelete middleware'),
      );
    }
  },
);

// Cascade delete lessons when using deleteMany (query middleware)
ModuleSchema.pre(
  'deleteMany',
  async function (this: Query<unknown, ModuleDocument>, next) {
    try {
      const docs = (await this.model
        .find(this.getFilter())
        .exec()) as ModuleDocument[];
      if (docs.length > 0) {
        const LessonModel: Model<Lesson> = new this.model(
          'Lesson',
        ) as Model<Lesson>;
        const moduleIds = docs.map((doc: ModuleDocument) => doc._id);
        await LessonModel.deleteMany({ module: { $in: moduleIds } }).exec();
      }
      next();
    } catch (error) {
      next(
        error instanceof Error
          ? error
          : new Error('Error in deleteMany middleware'),
      );
    }
  },
);
