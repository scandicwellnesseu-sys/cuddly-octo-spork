export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  organizationId: string;
  role: 'OWNER' | 'EDITOR' | 'VIEWER';
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  plan: 'STARTER' | 'PRO' | 'AGENCY';
  creditsBalance: number;
  creditsResetAt: string | null;
}

export interface Generation {
  id: string;
  title: string | null;
  keywords: string[];
  imageUrls: string[];
  language: Language;
  description: string | null;
  shortDescription: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  slug: string | null;
  altTexts: string[];
  attributes: ProductAttributes | null;
  confidenceScore: number | null;
  seoScore: number | null;
  readabilityGrade: string | null;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
  creditsUsed: number;
  createdAt: string;
}

export interface ProductAttributes {
  color?: string;
  material?: string;
  category?: string;
  tags: string[];
}

export type Language = 'SV' | 'EN' | 'NO' | 'DA' | 'FI' | 'DE';

export interface BrandVoice {
  id: string;
  name: string;
  description: string | null;
  toneProfile: ToneProfile | null;
  vocabularyStyle: VocabularyStyle | null;
  sentenceStructure: SentenceStructure | null;
  isDefault: boolean;
  createdAt: string;
}

export interface ToneProfile {
  formal: number;
  friendly: number;
  technical: number;
  playful: number;
  professional: number;
}

export interface VocabularyStyle {
  preferredWords: string[];
  avoidWords: string[];
  industryTerms: string[];
}

export interface SentenceStructure {
  avgLength: number;
  complexity: 'simple' | 'medium' | 'complex';
  usesBulletPoints: boolean;
  usesQuestions: boolean;
}

export interface TrendingKeyword {
  keyword: string;
  trendScore: number;
  searchVolume?: number;
  source: string;
  category?: string;
  change: 'up' | 'down' | 'stable';
}

export interface SeoAnalysisResult {
  score: number;
  breakdown: {
    titleScore: number;
    descriptionScore: number;
    metaScore: number;
    keywordDensity: number;
    readability: number;
  };
  suggestions: string[];
}

export interface DashboardStats {
  totalGenerations: number;
  generationsThisMonth: number;
  avgSeoScore: number;
  creditsUsed: number;
  topCategories: { category: string; count: number }[];
  generationsByDay: { date: string; count: number }[];
}

export interface Invoice {
  id: string;
  stripeInvoiceId: string | null;
  amount: number;
  currency: string;
  status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';
  paidAt: string | null;
  description: string | null;
  createdAt: string;
}

export interface CreditLog {
  id: string;
  amount: number;
  balanceAfter: number;
  reason: string;
  referenceId: string | null;
  referenceType: string | null;
  createdAt: string;
}

export interface ShopifyStore {
  id: string;
  shopDomain: string;
  isActive: boolean;
  lastSyncAt: string | null;
  createdAt: string;
}

export interface WooCommerceStore {
  id: string;
  storeUrl: string;
  isActive: boolean;
  lastSyncAt: string | null;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  user: {
    id: string;
    email: string;
    name: string | null;
    avatar: string | null;
  };
  role: 'OWNER' | 'EDITOR' | 'VIEWER';
  createdAt: string;
}

export interface SubscriptionStatus {
  plan: 'STARTER' | 'PRO' | 'AGENCY';
  planName: string;
  price: number;
  creditsBalance: number;
  creditsIncluded: number;
  nextReset: string | null;
  hasActiveSubscription: boolean;
}
