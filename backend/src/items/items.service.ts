import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateItemDto, UpdateItemDto, QueryItemsDto } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ItemsService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly itemIncludes = {
    images: { orderBy: { sortOrder: 'asc' as const }, where: { deletedAt: null } },
    tags: { include: { tag: true } },
    category: true,
    location: true,
    purchaseCurrency: true,
    estimatedCurrency: true,
    customAttributes: {
      include: { fieldDefinition: true },
    },
  };

  private readonly itemListIncludes = {
    images: { orderBy: { sortOrder: 'asc' as const }, where: { deletedAt: null }, take: 1 },
    tags: { include: { tag: true } },
    category: true,
    location: true,
    purchaseCurrency: true,
    estimatedCurrency: true,
    _count: { select: { images: true } },
  };

  async create(userId: string, dto: CreateItemDto) {
    const collection = await this.prisma.collection.findUnique({
      where: { id: dto.collectionId },
    });

    if (!collection || collection.deletedAt) {
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

    let tagConnections: { tagId: string }[] | undefined;
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
      tagConnections = tagRecords.map((t) => ({ tagId: t.id }));
    }

    const item = await this.prisma.item.create({
      data: {
        ...itemData,
        collection: { connect: { id: collectionId } },
        purchasePrice: purchasePrice != null ? new Prisma.Decimal(purchasePrice) : null,
        estimatedValue: estimatedValue != null ? new Prisma.Decimal(estimatedValue) : null,
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
                data: tagConnections,
              },
            }
          : undefined,
      },
      include: this.itemIncludes,
    });

    return item;
  }

  async findAllByCollection(collectionId: string, userId: string, query: QueryItemsDto) {
    const collection = await this.prisma.collection.findUnique({
      where: { id: collectionId },
    });

    if (!collection || collection.deletedAt) {
      throw new NotFoundException('Collection not found');
    }

    if (collection.userId !== userId && collection.visibility !== 'PUBLIC') {
      throw new ForbiddenException('Access denied');
    }

    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: Prisma.ItemWhereInput = {
      collectionId,
      deletedAt: null,
      ...(query.search && {
        title: { contains: query.search, mode: 'insensitive' as const },
      }),
      ...(query.condition && { condition: query.condition }),
      ...(query.ownership && { ownership: query.ownership }),
      ...(query.categoryId && { categoryId: query.categoryId }),
      ...(query.locationId && { locationId: query.locationId }),
    };

    const allowedSortFields = ['title', 'createdAt', 'purchasePrice', 'estimatedValue', 'condition', 'updatedAt'];
    const sortBy = allowedSortFields.includes(query.sortBy || '') ? query.sortBy! : 'createdAt';
    const sortOrder = query.sortOrder || 'desc';

    const [data, total] = await Promise.all([
      this.prisma.item.findMany({
        where,
        include: this.itemListIncludes,
        orderBy: { [sortBy]: sortOrder },
        skip,
        take: limit,
      }),
      this.prisma.item.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  }

  async findById(id: string, userId: string) {
    const item = await this.prisma.item.findUnique({
      where: { id },
      include: {
        collection: { select: { id: true, name: true, userId: true, visibility: true } },
        ...this.itemIncludes,
      },
    });

    if (!item || item.deletedAt) {
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

    if (!item || item.deletedAt) {
      throw new NotFoundException('Item not found');
    }

    if (item.collection.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    const { customAttributes, purchasePrice, estimatedValue, purchaseDate, tags, purchaseCurrencyCode, estimatedCurrencyCode, categoryId, locationId, ...itemData } = dto;

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
      include: this.itemIncludes,
    });

    if (tags !== undefined) {
      await this.prisma.itemTag.deleteMany({ where: { itemId: id } });

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

    return this.findById(id, userId);
  }

  async remove(id: string, userId: string) {
    const item = await this.prisma.item.findUnique({
      where: { id },
      include: { collection: { select: { userId: true } } },
    });

    if (!item || item.deletedAt) {
      throw new NotFoundException('Item not found');
    }

    if (item.collection.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    await this.prisma.item.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return { message: 'Item deleted successfully' };
  }
}
