import { Module } from '@nestjs/common';
import { ModuleService } from './module.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Module as ModelDoc, ModuleSchema } from './module.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ModelDoc.name, schema: ModuleSchema }]),
  ],
  providers: [ModuleService],
  exports: [ModuleService],
})
export class ModuleModule {}
