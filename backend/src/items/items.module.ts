import { Module } from '@nestjs/common';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { ItemImagesController } from './item-images.controller';
import { ItemImagesService } from './item-images.service';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [StorageModule],
  controllers: [ItemsController, ItemImagesController],
  providers: [ItemsService, ItemImagesService],
  exports: [ItemsService],
})
export class ItemsModule {}
