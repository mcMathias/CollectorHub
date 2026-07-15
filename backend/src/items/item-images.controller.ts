import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UploadedFiles,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { ItemImagesService } from './item-images.service';
import { UpdateImageDto } from './dto/update-image.dto';
import { CurrentUser } from '../common/decorators';

@ApiTags('Item Images')
@ApiBearerAuth()
@Controller('items/:itemId/images')
export class ItemImagesController {
  constructor(private readonly imagesService: ItemImagesService) {}

  @Post()
  @ApiOperation({ summary: 'Upload images to an item' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: { type: 'string', format: 'binary' },
        },
      },
    },
  })
  @UseInterceptors(FilesInterceptor('files', 10))
  async upload(
    @Param('itemId') itemId: string,
    @CurrentUser('id') userId: string,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 10 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /^image\/(jpeg|png|webp|gif)$/ }),
        ],
      }),
    )
    files: Express.Multer.File[],
  ) {
    return this.imagesService.uploadImages(itemId, userId, files);
  }

  @Get()
  @ApiOperation({ summary: 'Get all images for an item' })
  async findAll(
    @Param('itemId') itemId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.imagesService.findAll(itemId, userId);
  }

  @Patch(':imageId')
  @ApiOperation({ summary: 'Update image metadata (label, sortOrder, isPrimary)' })
  async update(
    @Param('itemId') itemId: string,
    @Param('imageId') imageId: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateImageDto,
  ) {
    return this.imagesService.update(itemId, imageId, userId, dto);
  }

  @Delete(':imageId')
  @ApiOperation({ summary: 'Delete an image' })
  async remove(
    @Param('itemId') itemId: string,
    @Param('imageId') imageId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.imagesService.remove(itemId, imageId, userId);
  }
}
