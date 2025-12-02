import { Module } from '@nestjs/common';
import { AmazonService } from './amazon.service';
import { AmazonController } from './amazon.controller';

@Module({
  controllers: [AmazonController],
  providers: [AmazonService],
  exports: [AmazonService],
})
export class AmazonModule {}
