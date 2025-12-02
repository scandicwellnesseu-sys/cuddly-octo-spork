import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiController } from './ai.controller';
import { SeoModule } from '../seo/seo.module';
import { KeywordsModule } from '../keywords/keywords.module';
import { BrandVoiceModule } from '../brand-voice/brand-voice.module';

@Module({
  imports: [SeoModule, KeywordsModule, BrandVoiceModule],
  controllers: [AiController],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
