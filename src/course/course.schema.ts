import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from 'src/user/user.schema';

export type CourseDocument = HydratedDocument<Course>;

@Schema({ timestamps: true })
export class Course {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, trim: true, lowercase: true, unique: true })
  slug: string;

  @Prop({ required: true })
  desc: string;

  @Prop({ type: Types.ObjectId, ref: 'Category' })
  category: Types.ObjectId;

  @Prop({ default: true })
  isPaid: boolean;

  @Prop({ required: true })
  price: string;

  @Prop({ required: true })
  discountedPrice: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Module' }], default: [] })
  modules: Types.ObjectId[];

  @Prop({
    type: Types.ObjectId,
    ref: User.name,
  })
  author: User;

  @Prop({ default: null })
  image: string;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
