import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Custom event for auth errors - components can listen to this
const AUTH_ERROR_EVENT = 'auth:error';

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        // Emit event instead of direct navigation - components can handle appropriately
        window.dispatchEvent(new CustomEvent(AUTH_ERROR_EVENT, { detail: { url: '/' } }));
      }
    }
    return Promise.reject(error);
  }
);

export { AUTH_ERROR_EVENT };

// Auth API
export const authApi = {
  login: (email: string, password: string) =>
    api.post('/api/auth/login', { email, password }),

  register: (data: { email: string; password: string; name?: string; organizationName?: string }) =>
    api.post('/api/auth/register', data),

  me: () => api.get('/api/auth/me'),
};

// AI Generation API
export const aiApi = {
  generate: (data: {
    imageUrls: string[];
    title?: string;
    keywords?: string[];
    language?: string;
    brandVoiceId?: string;
  }) => api.post('/api/ai/generate', data),

  bulkGenerate: (products: Array<{
    imageUrls: string[];
    title?: string;
    keywords?: string[];
  }>) => api.post('/api/ai/generate/bulk', { products }),

  rewrite: (data: { existingText: string; improvements: string[]; language?: string }) =>
    api.post('/api/ai/rewrite', data),

  translate: (generationId: string, targetLanguage: string) =>
    api.post('/api/ai/translate', { generationId, targetLanguage }),
};

// SEO API
export const seoApi = {
  analyze: (data: {
    title: string;
    description: string;
    metaDescription: string;
    keywords: string[];
  }) => api.post('/api/seo/analyze', data),

  getScore: (params: { title: string; description: string; metaDescription: string; keywords: string }) =>
    api.get('/api/seo/score', { params }),
};

// Keywords API
export const keywordsApi = {
  getSuggestions: (keywords?: string, language?: string) =>
    api.get('/api/keywords/suggestions', { params: { keywords, language } }),

  getLongTail: (keyword: string, language?: string) =>
    api.get('/api/keywords/long-tail', { params: { keyword, language } }),

  getCompetition: (keyword: string) =>
    api.get('/api/keywords/competition', { params: { keyword } }),
};

// Brand Voice API
export const brandVoiceApi = {
  list: () => api.get('/api/brand-voice'),

  get: (id: string) => api.get(`/api/brand-voice/${id}`),

  create: (data: { name: string; description?: string; exampleTexts: string[] }) =>
    api.post('/api/brand-voice', data),

  setDefault: (id: string) => api.post(`/api/brand-voice/${id}/default`),

  delete: (id: string) => api.delete(`/api/brand-voice/${id}`),
};

// Billing API
export const billingApi = {
  getStatus: () => api.get('/api/billing/status'),

  createSubscriptionCheckout: (data: { plan: string; successUrl: string; cancelUrl: string }) =>
    api.post('/api/billing/checkout/subscription', data),

  createCreditsCheckout: (data: { credits: number; successUrl: string; cancelUrl: string }) =>
    api.post('/api/billing/checkout/credits', data),

  getInvoices: () => api.get('/api/billing/invoices'),

  getCreditLogs: () => api.get('/api/billing/credits/logs'),
};

// Organizations API
export const orgsApi = {
  getCurrent: () => api.get('/api/organizations/current'),

  update: (data: { name?: string; logo?: string }) =>
    api.put('/api/organizations/current', data),

  getMembers: () => api.get('/api/organizations/members'),

  inviteMember: (data: { email: string; role: string }) =>
    api.post('/api/organizations/members/invite', data),

  updateMemberRole: (memberId: string, role: string) =>
    api.put(`/api/organizations/members/${memberId}/role`, { role }),

  removeMember: (memberId: string) =>
    api.delete(`/api/organizations/members/${memberId}`),

  getCredits: () => api.get('/api/organizations/credits'),
};

// Trends API
export const trendsApi = {
  getTrending: (language?: string, limit?: number) =>
    api.get('/api/trends', { params: { language, limit } }),

  getByCategory: (category: string, language?: string) =>
    api.get('/api/trends/category', { params: { category, language } }),

  getBySource: (source: string, language?: string) =>
    api.get('/api/trends/source', { params: { source, language } }),

  getStats: (language?: string) =>
    api.get('/api/trends/stats', { params: { language } }),
};

// Analytics API
export const analyticsApi = {
  getDashboard: () => api.get('/api/analytics/dashboard'),

  getEvents: (eventType?: string, limit?: number) =>
    api.get('/api/analytics/events', { params: { eventType, limit } }),

  getUserStats: () => api.get('/api/analytics/users'),
};

// Files API
export const filesApi = {
  getPresignedUpload: (filename: string, mimeType: string) =>
    api.post('/api/files/presigned-upload', { filename, mimeType }),

  getSignedUrl: (key: string) =>
    api.get(`/api/files/${encodeURIComponent(key)}/signed-url`),

  delete: (key: string) =>
    api.delete(`/api/files/${encodeURIComponent(key)}`),
};

// Shopify API
export const shopifyApi = {
  getOAuthUrl: (shopDomain: string, redirectUri: string) =>
    api.get('/api/integrations/shopify/oauth/url', { params: { shopDomain, redirectUri } }),

  handleCallback: (shopDomain: string, code: string) =>
    api.post('/api/integrations/shopify/oauth/callback', { shopDomain, code }),

  getStores: () => api.get('/api/integrations/shopify/stores'),

  getProducts: (shopDomain: string, limit?: number) =>
    api.get('/api/integrations/shopify/products', { params: { shopDomain, limit } }),

  syncProduct: (data: {
    shopDomain: string;
    productId: string;
    description: string;
    shortDescription: string;
    metaTitle: string;
    metaDescription: string;
  }) => api.post('/api/integrations/shopify/sync', data),

  disconnectStore: (shopDomain: string) =>
    api.delete(`/api/integrations/shopify/stores/${encodeURIComponent(shopDomain)}`),
};

// WooCommerce API
export const woocommerceApi = {
  connect: (data: { storeUrl: string; consumerKey: string; consumerSecret: string }) =>
    api.post('/api/integrations/woocommerce/connect', data),

  getStores: () => api.get('/api/integrations/woocommerce/stores'),

  getProducts: (storeId: string, page?: number, limit?: number) =>
    api.get('/api/integrations/woocommerce/products', { params: { storeId, page, limit } }),

  syncProduct: (data: {
    storeId: string;
    productId: number;
    description: string;
    shortDescription: string;
    metaTitle: string;
    metaDescription: string;
  }) => api.post('/api/integrations/woocommerce/sync', data),

  disconnectStore: (storeId: string) =>
    api.delete(`/api/integrations/woocommerce/stores/${storeId}`),
};
