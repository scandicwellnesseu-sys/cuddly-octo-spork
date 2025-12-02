import { IsString, IsArray, IsOptional, IsEnum, ArrayMinSize } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Language } from '@prisma/client';

export class GenerateProductDto {
  @ApiPropertyOptional({ description: 'Produkttitel' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: 'URLs till produktbilder', type: [String] })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  imageUrls: string[];

  @ApiPropertyOptional({ description: 'Nyckelord att inkludera', type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keywords?: string[];

  @ApiPropertyOptional({ enum: Language, default: 'SV' })
  @IsOptional()
  @IsEnum(Language)
  language?: Language = Language.SV;

  @ApiPropertyOptional({ description: 'ID för varumärkesröst att använda' })
  @IsOptional()
  @IsString()
  brandVoiceId?: string;
}

export class RewriteTextDto {
  @ApiProperty({ description: 'Befintlig text att förbättra' })
  @IsString()
  existingText: string;

  @ApiProperty({ description: 'Lista med förbättringar', type: [String] })
  @IsArray()
  @IsString({ each: true })
  improvements: string[];

  @ApiPropertyOptional({ enum: Language, default: 'SV' })
  @IsOptional()
  @IsEnum(Language)
  language?: Language = Language.SV;
}

export class TranslateDto {
  @ApiProperty({ description: 'ID för generering att översätta' })
  @IsString()
  generationId: string;

  @ApiProperty({ enum: Language, description: 'Målspråk' })
  @IsEnum(Language)
  targetLanguage: Language;
}

export class BulkGenerateDto {
  @ApiProperty({ description: 'Lista med produkter att generera', type: [GenerateProductDto] })
  @IsArray()
  products: GenerateProductDto[];
}
