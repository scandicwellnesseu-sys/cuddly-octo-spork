'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  Link2,
  Check,
  RefreshCw,
  ExternalLink,
  Trash2,
} from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import toast from 'react-hot-toast';

interface ShopifyStore {
  id: string;
  shopDomain: string;
  isActive: boolean;
  lastSyncAt: string | null;
  productCount: number;
}

const mockStores: ShopifyStore[] = [
  {
    id: '1',
    shopDomain: 'min-butik.myshopify.com',
    isActive: true,
    lastSyncAt: '2024-01-15T10:30:00Z',
    productCount: 156,
  },
];

export default function ShopifyIntegrationPage() {
  const [stores, setStores] = useState<ShopifyStore[]>(mockStores);
  const [isConnecting, setIsConnecting] = useState(false);
  const [shopDomain, setShopDomain] = useState('');

  const handleConnect = async () => {
    if (!shopDomain.trim()) {
      toast.error('Ange din Shopify-domän');
      return;
    }

    setIsConnecting(true);

    // Validera Shopify-domän med stricter pattern
    const sanitizedDomain = shopDomain.trim().toLowerCase();
    // Only allow valid Shopify store names (alphanumeric and hyphens)
    const shopifyDomainPattern = /^[a-z0-9][a-z0-9-]*[a-z0-9]\.myshopify\.com$/;
    const storeNamePattern = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;
    
    let finalDomain: string;
    if (shopifyDomainPattern.test(sanitizedDomain)) {
      finalDomain = sanitizedDomain;
    } else if (storeNamePattern.test(sanitizedDomain)) {
      finalDomain = `${sanitizedDomain}.myshopify.com`;
    } else {
      toast.error('Ogiltig Shopify-domän. Ange butiksnamnet eller fullständig .myshopify.com-adress.');
      setIsConnecting(false);
      return;
    }

    // Simulera OAuth-flöde
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const newStore: ShopifyStore = {
      id: Date.now().toString(),
      shopDomain: finalDomain,
      isActive: true,
      lastSyncAt: new Date().toISOString(),
      productCount: Math.floor(Math.random() * 200) + 50,
    };

    setStores((prev) => [...prev, newStore]);
    setShopDomain('');
    setIsConnecting(false);
    toast.success('Shopify-butik kopplad!');
  };

  const disconnectStore = (id: string) => {
    setStores((prev) => prev.filter((s) => s.id !== id));
    toast.success('Butik bortkopplad');
  };

  const syncStore = async (id: string) => {
    toast.success('Synkronisering startad...');
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setStores((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, lastSyncAt: new Date().toISOString() } : s
      )
    );
    toast.success('Synkronisering klar!');
  };

  return (
    <div className="flex min-h-screen bg-surface-light dark:bg-surface-dark">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-green-600" />
              </div>
              <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">
                Shopify-integration
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Koppla din Shopify-butik för att synka produkter och texter automatiskt
            </p>
          </div>

          {/* Connect New Store */}
          <div className="card mb-8">
            <h2 className="font-semibold text-lg mb-4">Koppla ny butik</h2>
            <div className="flex gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={shopDomain}
                  onChange={(e) => setShopDomain(e.target.value)}
                  placeholder="din-butik.myshopify.com"
                  className="input"
                />
              </div>
              <button
                onClick={handleConnect}
                disabled={isConnecting}
                className="btn-primary"
              >
                {isConnecting ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Kopplar...
                  </>
                ) : (
                  <>
                    <Link2 className="w-4 h-4 mr-2" />
                    Koppla butik
                  </>
                )}
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Du kommer att omdirigeras till Shopify för att godkänna appen.
            </p>
          </div>

          {/* Connected Stores */}
          <div className="space-y-4">
            <h2 className="font-semibold text-lg">Kopplade butiker</h2>

            {stores.length === 0 ? (
              <div className="card text-center py-12">
                <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Inga butiker kopplade ännu</p>
              </div>
            ) : (
              stores.map((store) => (
                <motion.div
                  key={store.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <ShoppingBag className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {store.shopDomain}
                          </h3>
                          {store.isActive && (
                            <span className="badge-success flex items-center gap-1">
                              <Check className="w-3 h-3" />
                              Aktiv
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          {store.productCount} produkter •{' '}
                          {store.lastSyncAt
                            ? `Senast synkad ${new Date(store.lastSyncAt).toLocaleDateString('sv-SE')}`
                            : 'Aldrig synkad'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`https://${store.shopDomain}/admin`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Öppna admin
                      </a>
                      <button
                        onClick={() => syncStore(store.id)}
                        className="btn-secondary"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Synka
                      </button>
                      <button
                        onClick={() => disconnectStore(store.id)}
                        className="btn-secondary text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Features */}
          <div className="card mt-8">
            <h2 className="font-semibold text-lg mb-4">Vad du kan göra</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Hämta produkter automatiskt från din Shopify-butik</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Generera SEO-optimerade texter för alla produkter</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Synka beskrivningar, meta-titlar och meta-beskrivningar</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Automatisk uppdatering vid nya produkter</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
