import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateItemDto, UpdateItemDto } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ItemsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateItemDto) {
    // Verify collection belongs to user
    const collection = await this.prisma.collection.findUnique({
      where: { id: dto.collectionId },
    });

    if (!collection) {
      throw new NotFoundException('Collection not found');
    }

    if (collection.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const {
      customAttributes,
      collectionId,
      purchasePrice,
      estimatedValue,
      purchaseDate,
      tags,
      purchaseCurrencyCode,
      estimatedCurrencyCode,
      categoryId,
      locationId,
      ...itemData
    } = dto;

    // Handle tags — create if not exist, connect
    let tagConnections: { tagId: string; itemId: string }[] | undefined;
    if (tags?.length) {
      const tagRecords = await Promise.all(
        tags.map((name) =>
          this.prisma.tag.upsert({
            where: { userId_name: { userId, name } },
            update: {},
            create: { name, userId },
          }),
        ),
      );
      tagConnections = tagRecords.map((t) => ({ tagId: t.id, itemId: '' }));
    }

    const item = await this.prisma.item.create({
      data: {
        ...itemData,
        collection: { connect: { id: collectionId } },
        purchasePrice: purchasePrice ? new Prisma.Decimal(purchasePrice) : null,
        estimatedValue: estimatedValue ? new Prisma.Decimal(estimatedValue) : null,
        purchaseDate: purchaseDate ? new Date(purchaseDate) : null,
        purchaseCurrency: { connect: { code: purchaseCurrencyCode || 'DKK' } },
        estimatedCurrency: { connect: { code: estimatedCurrencyCode || 'DKK' } },
        category: categoryId ? { connect: { id: categoryId } } : undefined,
        location: locationId ? { connect: { id: locationId } } : undefined,
        customAttributes: customAttributes?.length
          ? {
              createMany: {
                data: customAttributes.map((attr) => ({
                  fieldDefinitionId: attr.fieldDefinitionId,
                  value: attr.value,
                })),
              },
            }
          : undefined,
        tags: tagConnections
          ? {
              createMany: {
                data: tagConnections.map((t) => ({ tagId: t.tagId })),
              },
            }
          : undefined,
      },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        tags: { include: { tag: true } },
        category: true,
        location: true,
        customAttributes: {
          include: { fieldDefinition: true },
        },
      },
    });

    return item;
  }

  async findAllByCollection(collectionId: string, userId: string) {
    const collection = await this.prisma.collection.findUnique({
      where: { id: collectionId },
    });

    if (!collection) {
      throw new NotFoundException('Collection not found');
    }

    if (collection.userId !== userId && collection.visibility !== 'PUBLIC') {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.item.findMany({
      where: { collectionId },
      include: {
        images: { orderBy: { sortOrder: 'asc' }, take: 1 },
        tags: { include: { tag: true } },
        category: true,
        location: true,
        _count: { select: { images: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string, userId: string) {
    const item = await this.prisma.item.findUnique({
      where: { id },
      include: {
        collection: { select: { id: true, name: true, userId: true, visibility: true } },
        images: { orderBy: { sortOrder: 'asc' } },
        tags: { include: { tag: true } },
        category: true,
        location: true,
        customAttributes: {
          include: { fieldDefinition: true },
          orderBy: { fieldDefinition: { sortOrder: 'asc' } },
        },
      },
    });

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    if (item.collection.userId !== userId && item.collection.visibility !== 'PUBLIC') {
      throw new ForbiddenException('Access denied');
    }

    return item;
  }

  async update(id: string, userId: string, dto: UpdateItemDto) {
    const item = await this.prisma.item.findUnique({
      where: { id },
      include: { collection: { select: { userId: true } } },
    });

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    if (item.collection.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const { customAttributes, purchasePrice, estimatedValue, purchaseDate, tags, purchaseCurrencyCode, estimatedCurrencyCode, categoryId, locationId, ...itemData } = dto;

    // Update item
    const updated = await this.prisma.item.update({
      where: { id },
      data: {
        ...itemData,
        purchasePrice: purchasePrice !== undefined ? new Prisma.Decimal(purchasePrice) : undefined,
        estimatedValue: estimatedValue !== undefined ? new Prisma.Decimal(estimatedValue) : undefined,
        purchaseDate: purchaseDate !== undefined ? new Date(purchaseDate) : undefined,
        purchaseCurrencyCode: purchaseCurrencyCode || undefined,
        estimatedCurrencyCode: estimatedCurrencyCode || undefined,
        categoryId: categoryId !== undefined ? categoryId : undefined,
        locationId: locationId !== undefined ? locationId : undefined,
      },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        tags: { include: { tag: true } },
        category: true,
        location: true,
        customAttributes: {
          include: { fieldDefinition: true },
        },
      },
    });

    // Update tags if provided
    if (tags !== undefined) {
      // Remove existing tags
      await this.prisma.itemTag.deleteMany({ where: { itemId: id } });

      // Create/connect new tags
      if (tags.length) {
        const tagRecords = await Promise.all(
          tags.map((name) =>
            this.prisma.tag.upsert({
              where: { userId_name: { userId, name } },
              update: {},
              create: { name, userId },
            }),
          ),
        );

        await this.prisma.itemTag.createMany({
          data: tagRecords.map((t) => ({ itemId: id, tagId: t.id })),
        });
      }
    }

    // Update custom attributes if provided
    if (customAttributes?.length) {
      for (const attr of customAttributes) {
        await this.prisma.customAttribute.upsert({
          where: {
            itemId_fieldDefinitionId: {
              itemId: id,
              fieldDefinitionId: attr.fieldDefinitionId,
            },
          },
          update: { value: attr.value },
          create: {
            itemId: id,
            fieldDefinitionId: attr.fieldDefinitionId,
            value: attr.value,
          },
        });
      }
    }

    return updated;
  }

  async remove(id: string, userId: string) {
    const item = await this.prisma.item.findUnique({
      where: { id },
      include: { collection: { select: { userId: true } } },
    });

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    if (item.collection.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    await this.prisma.item.delete({ where: { id } });

    return { message: 'Item deleted successfully' };
  }
}
