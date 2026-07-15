import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { UpdateImageDto } from './dto/update-image.dto';

@Injectable()
export class ItemImagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
  ) {}

  private async verifyItemOwnership(itemId: string, userId: string) {
    const item = await this.prisma.item.findUnique({
      where: { id: itemId },
      include: { collection: { select: { userId: true } } },
    });

    if (!item || item.deletedAt) {
      throw new NotFoundException('Item not found');
    }

    if (item.collection.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return item;
  }

  async uploadImages(
    itemId: string,
    userId: string,
    files: Express.Multer.File[],
  ) {
    await this.verifyItemOwnership(itemId, userId);

    const existingCount = await this.prisma.itemImage.count({
      where: { itemId, deletedAt: null },
    });

    const results: Awaited<ReturnType<typeof this.prisma.itemImage.create>>[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const uploaded = await this.storage.upload(file, `items/${itemId}`);

      const image = await this.prisma.itemImage.create({
        data: {
          itemId,
          url: uploaded.url,
          key: uploaded.key,
          size: uploaded.size,
          mimeType: uploaded.mimeType,
          hash: uploaded.hash,
          isPrimary: existingCount === 0 && i === 0,
          sortOrder: existingCount + i,
        },
      });

      results.push(image);
    }

    return results;
  }

  async findAll(itemId: string, userId: string) {
    await this.verifyItemOwnership(itemId, userId);

    return this.prisma.itemImage.findMany({
      where: { itemId, deletedAt: null },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async update(
    itemId: string,
    imageId: string,
    userId: string,
    dto: UpdateImageDto,
  ) {
    await this.verifyItemOwnership(itemId, userId);

    const image = await this.prisma.itemImage.findUnique({
      where: { id: imageId },
    });

    if (!image || image.deletedAt || image.itemId !== itemId) {
      throw new NotFoundException('Image not found');
    }

    if (dto.isPrimary === true) {
      await this.prisma.itemImage.updateMany({
        where: { itemId, id: { not: imageId }, deletedAt: null },
        data: { isPrimary: false },
      });
    }

    return this.prisma.itemImage.update({
      where: { id: imageId },
      data: {
        ...(dto.label !== undefined && { label: dto.label }),
        ...(dto.sortOrder !== undefined && { sortOrder: dto.sortOrder }),
        ...(dto.isPrimary !== undefined && { isPrimary: dto.isPrimary }),
      },
    });
  }

  async remove(itemId: string, imageId: string, userId: string) {
    await this.verifyItemOwnership(itemId, userId);

    const image = await this.prisma.itemImage.findUnique({
      where: { id: imageId },
    });

    if (!image || image.deletedAt || image.itemId !== itemId) {
      throw new NotFoundException('Image not found');
    }

    await this.storage.delete(image.key);

    await this.prisma.itemImage.update({
      where: { id: imageId },
      data: { deletedAt: new Date() },
    });

    if (image.isPrimary) {
      const nextImage = await this.prisma.itemImage.findFirst({
        where: { itemId, deletedAt: null, id: { not: imageId } },
        orderBy: { sortOrder: 'asc' },
      });
      if (nextImage) {
        await this.prisma.itemImage.update({
          where: { id: nextImage.id },
          data: { isPrimary: true },
        });
      }
    }

    return { message: 'Image deleted successfully' };
  }
}
