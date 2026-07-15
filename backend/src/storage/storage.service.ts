import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';
import { createHash } from 'crypto';

@Injectable()
export class StorageService implements OnModuleInit {
  private client: Minio.Client;
  private bucket: string;

  constructor(private readonly config: ConfigService) {
    const endpoint = new URL(this.config.get<string>('S3_ENDPOINT')!);
    this.bucket = this.config.get<string>('S3_BUCKET')!;

    this.client = new Minio.Client({
      endPoint: endpoint.hostname,
      port: parseInt(endpoint.port) || 9000,
      useSSL: endpoint.protocol === 'https:',
      accessKey: this.config.get<string>('S3_ACCESS_KEY')!,
      secretKey: this.config.get<string>('S3_SECRET_KEY')!,
    });
  }

  async onModuleInit() {
    const exists = await this.client.bucketExists(this.bucket);
    if (!exists) {
      await this.client.makeBucket(this.bucket);
    }
  }

  async upload(
    file: Express.Multer.File,
    folder: string,
  ): Promise<{
    key: string;
    url: string;
    size: number;
    mimeType: string;
    hash: string;
  }> {
    const hash = createHash('md5').update(file.buffer).digest('hex');
    const ext = file.originalname.split('.').pop() || 'bin';
    const key = `${folder}/${hash}-${Date.now()}.${ext}`;

    await this.client.putObject(this.bucket, key, file.buffer, file.size, {
      'Content-Type': file.mimetype,
    });

    const url = `${this.config.get<string>('S3_ENDPOINT')}/${this.bucket}/${key}`;

    return { key, url, size: file.size, mimeType: file.mimetype, hash };
  }

  async delete(key: string): Promise<void> {
    await this.client.removeObject(this.bucket, key);
  }

  getPublicUrl(key: string): string {
    return `${this.config.get<string>('S3_ENDPOINT')}/${this.bucket}/${key}`;
  }
}
