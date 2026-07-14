import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ItemsService } from './items.service';
import { CreateItemDto, UpdateItemDto } from './dto';
import { CurrentUser } from '../common/decorators';

@ApiTags('Items')
@ApiBearerAuth()
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new item' })
  async create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateItemDto,
  ) {
    return this.itemsService.create(userId, dto);
  }

  @Get('collection/:collectionId')
  @ApiOperation({ summary: 'Get all items in a collection' })
  async findAllByCollection(
    @Param('collectionId') collectionId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.itemsService.findAllByCollection(collectionId, userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get item by ID' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.itemsService.findById(id, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update item' })
  async update(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateItemDto,
  ) {
    return this.itemsService.update(id, userId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete item' })
  async remove(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.itemsService.remove(id, userId);
  }
}
