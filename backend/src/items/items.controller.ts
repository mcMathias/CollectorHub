import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { ItemsService } from './items.service';
import { CreateItemDto, UpdateItemDto, QueryItemsDto } from './dto';
import { CurrentUser } from '../common/decorators';

@ApiTags('Items')
@ApiBearerAuth()
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new item' })
  @ApiResponse({ status: 201, description: 'Item created successfully' })
  @ApiResponse({ status: 404, description: 'Collection not found' })
  @ApiResponse({ status: 403, description: 'Access denied' })
  async create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateItemDto,
  ) {
    return this.itemsService.create(userId, dto);
  }

  @Get('collection/:collectionId')
  @ApiOperation({ summary: 'Get all items in a collection (paginated)' })
  @ApiResponse({ status: 200, description: 'Paginated list of items' })
  async findAllByCollection(
    @Param('collectionId') collectionId: string,
    @CurrentUser('id') userId: string,
    @Query() query: QueryItemsDto,
  ) {
    return this.itemsService.findAllByCollection(collectionId, userId, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get item by ID' })
  @ApiResponse({ status: 200, description: 'Item details' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.itemsService.findById(id, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update item' })
  @ApiResponse({ status: 200, description: 'Item updated successfully' })
  async update(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateItemDto,
  ) {
    return this.itemsService.update(id, userId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete item' })
  @ApiResponse({ status: 200, description: 'Item deleted successfully' })
  async remove(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.itemsService.remove(id, userId);
  }
}
