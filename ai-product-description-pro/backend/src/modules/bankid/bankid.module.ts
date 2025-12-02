import { Module } from '@nestjs/common';
import { BankIdService } from './bankid.service';
import { BankIdController } from './bankid.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [BankIdController],
  providers: [BankIdService],
  exports: [BankIdService],
})
export class BankIdModule {}
