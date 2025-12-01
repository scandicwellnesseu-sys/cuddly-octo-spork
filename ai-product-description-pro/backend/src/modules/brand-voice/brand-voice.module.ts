import { Module } from '@nestjs/common';
import { BrandVoiceService } from './brand-voice.service';
import { BrandVoiceController } from './brand-voice.controller';

@Module({
  controllers: [BrandVoiceController],
  providers: [BrandVoiceService],
  exports: [BrandVoiceService],
})
export class BrandVoiceModule {}
