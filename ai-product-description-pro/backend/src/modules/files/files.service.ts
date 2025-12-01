import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

export interface UploadResult {
  key: string;
  url: string;
  signedUrl: string;
}

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);
  private s3Client: S3Client | null = null;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    const endpoint = this.configService.get<string>('S3_ENDPOINT');
    const accessKeyId = this.configService.get<string>('S3_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>('S3_SECRET_ACCESS_KEY');
    const region = this.configService.get<string>('S3_REGION') || 'auto';
    this.bucketName = this.configService.get<string>('S3_BUCKET_NAME') || 'ai-product-pro-files';

    if (endpoint && accessKeyId && secretAccessKey) {
      this.s3Client = new S3Client({
        endpoint,
        region,
        credentials: { accessKeyId, secretAccessKey },
      });
    }
  }

  /**
   * Ladda upp fil till S3/R2
   */
  async uploadFile(
    file: Buffer,
    originalName: string,
    mimeType: string,
    organizationId: string,
  ): Promise<UploadResult> {
    const extension = originalName.split('.').pop() || 'bin';
    const key = `${organizationId}/${uuidv4()}.${extension}`;

    if (this.s3Client) {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          Body: file,
          ContentType: mimeType,
        }),
      );

      const signedUrl = await this.getSignedUrl(key);

      return {
        key,
        url: `${this.configService.get<string>('S3_ENDPOINT')}/${this.bucketName}/${key}`,
        signedUrl,
      };
    }

    // Fallback för utveckling utan S3
    this.logger.warn('S3 ej konfigurerat, returnerar dummy-URL');
    return {
      key,
      url: `https://placeholder.example.com/${key}`,
      signedUrl: `https://placeholder.example.com/${key}?signed=true`,
    };
  }

  /**
   * Generera presigned URL för uppladdning
   */
  async getPresignedUploadUrl(
    filename: string,
    mimeType: string,
    organizationId: string,
  ): Promise<{ key: string; uploadUrl: string }> {
    const extension = filename.split('.').pop() || 'bin';
    const key = `${organizationId}/${uuidv4()}.${extension}`;

    if (this.s3Client) {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        ContentType: mimeType,
      });

      const uploadUrl = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });

      return { key, uploadUrl };
    }

    return { key, uploadUrl: `https://placeholder.example.com/upload/${key}` };
  }

  /**
   * Hämta signerad URL för nedladdning
   */
  async getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
    if (this.s3Client) {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      return getSignedUrl(this.s3Client, command, { expiresIn });
    }

    return `https://placeholder.example.com/${key}?expires=${expiresIn}`;
  }

  /**
   * Ta bort fil
   */
  async deleteFile(key: string): Promise<boolean> {
    if (this.s3Client) {
      await this.s3Client.send(
        new DeleteObjectCommand({
          Bucket: this.bucketName,
          Key: key,
        }),
      );
      return true;
    }

    return false;
  }

  /**
   * Validera filtyp för bilder
   */
  isValidImageType(mimeType: string): boolean {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    return validTypes.includes(mimeType);
  }

  /**
   * Validera filstorlek (max 10MB)
   */
  isValidFileSize(size: number, maxSizeMB = 10): boolean {
    return size <= maxSizeMB * 1024 * 1024;
  }
}
