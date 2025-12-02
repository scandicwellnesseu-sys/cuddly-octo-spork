import { Module } from '@nestjs/common';
import { ZalandoService } from './zalando.service';
import { ZalandoController } from './zalando.controller';

@Module({
  controllers: [ZalandoController],
  providers: [ZalandoService],
  exports: [ZalandoService],
})
export class ZalandoModule {}
