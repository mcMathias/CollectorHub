import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCollectionDto, UpdateCollectionDto } from './dto';

@Injectable()
export class CollectionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateCollectionDto) {
    // Verify collection type exists
    const collectionType = await this.prisma.collectionType.findUnique({
      where: { id: dto.collectionTypeId },
    });

    if (!collectionType) {
      throw new NotFoundException('Collection type not found');
    }

    return this.prisma.collection.create({
      data: {
        ...dto,
        userId,
      },
      include: {
        collectionType: {
          select: { id: true, name: true, slug: true, icon: true, color: true },
        },
        _count: { select: { items: true } },
      },
    });
  }

  async findAllByUser(userId: string) {
    return this.prisma.collection.findMany({
      where: { userId },
      include: {
        collectionType: {
          select: { id: true, name: true, slug: true, icon: true, color: true },
        },
        _count: { select: { items: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findById(id: string, userId: string) {
    const collection = await this.prisma.collection.findUnique({
      where: { id },
      include: {
        collectionType: {
          include: {
            fieldDefinitions: { orderBy: { sortOrder: 'asc' } },
          },
        },
        _count: { select: { items: true } },
      },
    });

    if (!collection) {
      throw new NotFoundException('Collection not found');
    }

    // Check ownership or public visibility
    if (collection.userId !== userId && collection.visibility !== 'PUBLIC') {
      throw new ForbiddenException('Access denied');
    }

    return collection;
  }

  async update(id: string, userId: string, dto: UpdateCollectionDto) {
    const collection = await this.prisma.collection.findUnique({ where: { id } });

    if (!collection) {
      throw new NotFoundException('Collection not found');
    }

    if (collection.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.collection.update({
      where: { id },
      data: dto,
      include: {
        collectionType: {
          select: { id: true, name: true, slug: true, icon: true, color: true },
        },
        _count: { select: { items: true } },
      },
    });
  }

  async remove(id: string, userId: string) {
    const collection = await this.prisma.collection.findUnique({ where: { id } });

    if (!collection) {
      throw new NotFoundException('Collection not found');
    }

    if (collection.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    await this.prisma.collection.delete({ where: { id } });

    return { message: 'Collection deleted successfully' };
  }
}
