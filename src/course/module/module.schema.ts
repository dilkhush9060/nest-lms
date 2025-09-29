import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ModuleDocument = HydratedDocument<Module>;

@Schema({ timestamps: true })
export class Module {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, trim: true, lowercase: true, unique: true })
  slug: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'Course',
  })
  course: Types.ObjectId;
}

export const ModuleSchema = SchemaFactory.createForClass(Module);
