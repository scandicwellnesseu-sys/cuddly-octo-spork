import { Injectable, Logger, BadRequestException } from '@nestjs/common';
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
  private isConfigured: boolean;

  constructor(private configService: ConfigService) {
    const endpoint = this.configService.get<string>('S3_ENDPOINT');
    const accessKeyId = this.configService.get<string>('S3_ACCESS_KEY_ID');
    const secretAccessKey = this.configService.get<string>('S3_SECRET_ACCESS_KEY');
    const region = this.configService.get<string>('S3_REGION') || 'auto';
    this.bucketName = this.configService.get<string>('S3_BUCKET_NAME') || 'ai-product-pro-files';

    this.isConfigured = !!(endpoint && accessKeyId && secretAccessKey);

    if (this.isConfigured) {
      this.s3Client = new S3Client({
        endpoint,
        region,
        credentials: { accessKeyId, secretAccessKey },
      });
    } else {
      this.logger.warn('S3/R2 ej konfigurerat. Filuppladdning kommer inte att fungera.');
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
    if (!this.s3Client) {
      throw new BadRequestException('Fillagring ej konfigurerat. Kontakta administratör.');
    }

    const extension = originalName.split('.').pop() || 'bin';
    const key = `${organizationId}/${uuidv4()}.${extension}`;

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

  /**
   * Generera presigned URL för uppladdning
   */
  async getPresignedUploadUrl(
    filename: string,
    mimeType: string,
    organizationId: string,
  ): Promise<{ key: string; uploadUrl: string }> {
    if (!this.s3Client) {
      throw new BadRequestException('Fillagring ej konfigurerat. Kontakta administratör.');
    }

    const extension = filename.split('.').pop() || 'bin';
    const key = `${organizationId}/${uuidv4()}.${extension}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      ContentType: mimeType,
    });

    const uploadUrl = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });

    return { key, uploadUrl };
  }

  /**
   * Hämta signerad URL för nedladdning
   */
  async getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
    if (!this.s3Client) {
      throw new BadRequestException('Fillagring ej konfigurerat. Kontakta administratör.');
    }

    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    return getSignedUrl(this.s3Client, command, { expiresIn });
  }

  /**
   * Ta bort fil
   */
  async deleteFile(key: string): Promise<boolean> {
    if (!this.s3Client) {
      throw new BadRequestException('Fillagring ej konfigurerat. Kontakta administratör.');
    }

    await this.s3Client.send(
      new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      }),
    );
    return true;
  }

  /**
   * Kontrollera om fillagring är konfigurerad
   */
  isStorageConfigured(): boolean {
    return this.isConfigured;
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
