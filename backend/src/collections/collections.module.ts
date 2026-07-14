import { Module } from '@nestjs/common';
import { CollectionsController } from './collections.controller';
import { CollectionTypesController } from './collection-types.controller';
import { CollectionsService } from './collections.service';

@Module({
  controllers: [CollectionsController, CollectionTypesController],
  providers: [CollectionsService],
  exports: [CollectionsService],
})
export class CollectionsModule {}
