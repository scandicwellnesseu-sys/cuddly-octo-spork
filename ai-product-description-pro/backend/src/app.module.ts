import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { OrgsModule } from './modules/orgs/orgs.module';
import { AiModule } from './modules/ai/ai.module';
import { SeoModule } from './modules/seo/seo.module';
import { KeywordsModule } from './modules/keywords/keywords.module';
import { BrandVoiceModule } from './modules/brand-voice/brand-voice.module';
import { BillingModule } from './modules/billing/billing.module';
import { ShopifyModule } from './modules/shopify/shopify.module';
import { WoocommerceModule } from './modules/woocommerce/woocommerce.module';
import { TrendsModule } from './modules/trends/trends.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { FilesModule } from './modules/files/files.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    OrgsModule,
    AiModule,
    SeoModule,
    KeywordsModule,
    BrandVoiceModule,
    BillingModule,
    ShopifyModule,
    WoocommerceModule,
    TrendsModule,
    AnalyticsModule,
    FilesModule,
  ],
})
export class AppModule {}
