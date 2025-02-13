import { Injectable, BadRequestException } from '@nestjs/common';
import { writeFile } from 'fs/promises';
import { join, extname } from 'path';
import * as sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { ImageTransformOptions, SavedAssetData } from './types/asset';

@Injectable()
export class AssetService {
  private readonly uploadDir = join(__dirname, '../../static'); // Save files in /static

  private generateFilename(originalName: string, format: string): string {
    const uuid = uuidv4();
    const ext = format ? `.${format}` : extname(originalName);
    return `${uuid}${ext}`;
  }

  private async saveFile(
    fileBuffer: Buffer,
    filename: string,
  ): Promise<string> {
    const filePath = join(this.uploadDir, filename);
    await writeFile(filePath, fileBuffer);
    return filePath;
  }

  private async processImage(
    fileBuffer: Buffer,
    options?: {
      width?: number;
      height?: number;
      format?: 'jpg' | 'png' | 'webp';
    },
  ): Promise<{ buffer: Buffer; metadata: sharp.Metadata }> {
    let image = sharp(fileBuffer);

    const metadata = await image.metadata();

    if (metadata.size && metadata.size > 10 * 1024 * 1024) {
      const scaleFactor = Math.sqrt((10 * 1024 * 1024) / metadata.size);
      const newWidth = Math.floor((metadata.width || 1920) * scaleFactor);
      const newHeight = Math.floor((metadata.height || 1080) * scaleFactor);
      image = image.resize(newWidth, newHeight);
    }

    const processedBuffer = await image
      .toFormat(options?.format || 'webp', { quality: 80 })
      .toBuffer();
    const newMetadata = await sharp(processedBuffer).metadata(); // Get updated metadata

    return { buffer: processedBuffer, metadata: newMetadata };
  }

  async saveImage(
    file: Express.Multer.File,
    options?: ImageTransformOptions,
  ): Promise<SavedAssetData> {
    if (!file) throw new BadRequestException('No file provided');

    const filename = this.generateFilename(
      file.originalname,
      options?.format || 'webp',
    );
    const { buffer, metadata } = await this.processImage(file.buffer, options);
    const path = await this.saveFile(buffer, filename);

    return {
      path,
      filename,
      mimeType: `image/${options?.format || 'webp'}`,
      size: metadata.size || 0,
      metadata: {
        width: metadata.width?.toString() ?? '',
        height: metadata.height?.toString() ?? '',
      },
    };
  }
}
