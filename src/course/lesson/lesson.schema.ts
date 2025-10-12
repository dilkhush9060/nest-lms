import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type LessonDocument = HydratedDocument<Lesson>;

@Schema({ timestamps: true })
export class Lesson {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, trim: true, lowercase: true, unique: true })
  slug: string;

  @Prop({ type: Types.ObjectId, ref: 'Module', required: true })
  module: Types.ObjectId;
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);
