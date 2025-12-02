import { Module } from '@nestjs/common';
import { ScheduledPublishingService } from './scheduled-publishing.service';
import { ScheduledPublishingController } from './scheduled-publishing.controller';
import { ShopifyModule } from '../shopify/shopify.module';
import { WoocommerceModule } from '../woocommerce/woocommerce.module';

@Module({
  imports: [ShopifyModule, WoocommerceModule],
  controllers: [ScheduledPublishingController],
  providers: [ScheduledPublishingService],
  exports: [ScheduledPublishingService],
})
export class ScheduledPublishingModule {}
