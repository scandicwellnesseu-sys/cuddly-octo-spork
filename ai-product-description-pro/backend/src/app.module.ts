import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
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
// Advanced Features
import { AbTestingModule } from './modules/ab-testing/ab-testing.module';
import { ImageGenerationModule } from './modules/image-generation/image-generation.module';
import { PlagiarismModule } from './modules/plagiarism/plagiarism.module';
import { CompetitorAnalysisModule } from './modules/competitor-analysis/competitor-analysis.module';
import { ScheduledPublishingModule } from './modules/scheduled-publishing/scheduled-publishing.module';
import { WebhooksModule } from './modules/webhooks/webhooks.module';
import { WhiteLabelModule } from './modules/white-label/white-label.module';
import { AmazonModule } from './modules/amazon/amazon.module';
import { ZalandoModule } from './modules/zalando/zalando.module';
import { BankIdModule } from './modules/bankid/bankid.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    ScheduleModule.forRoot(),
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
    // Advanced Features
    AbTestingModule,
    ImageGenerationModule,
    PlagiarismModule,
    CompetitorAnalysisModule,
    ScheduledPublishingModule,
    WebhooksModule,
    WhiteLabelModule,
    AmazonModule,
    ZalandoModule,
    BankIdModule,
  ],
})
export class AppModule {}
