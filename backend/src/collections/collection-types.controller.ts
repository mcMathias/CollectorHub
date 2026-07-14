import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from '../common/decorators';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('Collection Types')
@Controller('collection-types')
export class CollectionTypesController {
  constructor(private readonly prisma: PrismaService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all available collection types' })
  async findAll() {
    return this.prisma.collectionType.findMany({
      include: {
        fieldDefinitions: { orderBy: { sortOrder: 'asc' } },
        _count: { select: { collections: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  @Public()
  @Get(':slug')
  @ApiOperation({ summary: 'Get collection type by slug' })
  async findBySlug(@Param('slug') slug: string) {
    return this.prisma.collectionType.findUnique({
      where: { slug },
      include: {
        fieldDefinitions: { orderBy: { sortOrder: 'asc' } },
      },
    });
  }
}
