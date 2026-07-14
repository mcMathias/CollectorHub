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
import { CollectionsService } from './collections.service';
import { CreateCollectionDto, UpdateCollectionDto } from './dto';
import { CurrentUser } from '../common/decorators';

@ApiTags('Collections')
@ApiBearerAuth()
@Controller('collections')
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new collection' })
  async create(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateCollectionDto,
  ) {
    return this.collectionsService.create(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all collections for current user' })
  async findAll(@CurrentUser('id') userId: string) {
    return this.collectionsService.findAllByUser(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get collection by ID' })
  async findOne(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.collectionsService.findById(id, userId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update collection' })
  async update(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateCollectionDto,
  ) {
    return this.collectionsService.update(id, userId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete collection' })
  async remove(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.collectionsService.remove(id, userId);
  }
}
