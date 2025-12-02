'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Globe,
  Link2,
  Check,
  RefreshCw,
  ExternalLink,
  Trash2,
  Key,
} from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import toast from 'react-hot-toast';

interface WooStore {
  id: string;
  storeUrl: string;
  isActive: boolean;
  lastSyncAt: string | null;
  productCount: number;
}

const mockStores: WooStore[] = [];

export default function WooCommerceIntegrationPage() {
  const [stores, setStores] = useState<WooStore[]>(mockStores);
  const [isConnecting, setIsConnecting] = useState(false);
  const [storeUrl, setStoreUrl] = useState('');
  const [consumerKey, setConsumerKey] = useState('');
  const [consumerSecret, setConsumerSecret] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleConnect = async () => {
    if (!storeUrl.trim() || !consumerKey.trim() || !consumerSecret.trim()) {
      toast.error('Fyll i alla fält');
      return;
    }

    setIsConnecting(true);

    // Simulera anslutning
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const newStore: WooStore = {
      id: Date.now().toString(),
      storeUrl: storeUrl.startsWith('http') ? storeUrl : `https://${storeUrl}`,
      isActive: true,
      lastSyncAt: new Date().toISOString(),
      productCount: Math.floor(Math.random() * 200) + 50,
    };

    setStores((prev) => [...prev, newStore]);
    setStoreUrl('');
    setConsumerKey('');
    setConsumerSecret('');
    setShowForm(false);
    setIsConnecting(false);
    toast.success('WooCommerce-butik kopplad!');
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
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Globe className="w-6 h-6 text-purple-600" />
              </div>
              <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">
                WooCommerce-integration
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Koppla din WooCommerce-butik för att synka produkter och texter
            </p>
          </div>

          {/* Connect New Store */}
          <div className="card mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg">Koppla ny butik</h2>
              {!showForm && (
                <button onClick={() => setShowForm(true)} className="btn-primary">
                  <Link2 className="w-4 h-4 mr-2" />
                  Lägg till butik
                </button>
              )}
            </div>

            {showForm && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div>
                  <label className="label">Butikens URL</label>
                  <input
                    type="text"
                    value={storeUrl}
                    onChange={(e) => setStoreUrl(e.target.value)}
                    placeholder="https://din-butik.se"
                    className="input"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Consumer Key</label>
                    <input
                      type="text"
                      value={consumerKey}
                      onChange={(e) => setConsumerKey(e.target.value)}
                      placeholder="ck_..."
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label">Consumer Secret</label>
                    <input
                      type="password"
                      value={consumerSecret}
                      onChange={(e) => setConsumerSecret(e.target.value)}
                      placeholder="cs_..."
                      className="input"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setShowForm(false)} className="btn-secondary">
                    Avbryt
                  </button>
                  <button
                    onClick={handleConnect}
                    disabled={isConnecting}
                    className="btn-primary"
                  >
                    {isConnecting ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Ansluter...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Anslut
                      </>
                    )}
                  </button>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Key className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                        Så hittar du dina API-nycklar
                      </p>
                      <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                        Gå till WooCommerce → Inställningar → Avancerat → REST API →
                        Lägg till nyckel. Välj "Läs/skriv" behörigheter.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Connected Stores */}
          <div className="space-y-4">
            <h2 className="font-semibold text-lg">Kopplade butiker</h2>

            {stores.length === 0 ? (
              <div className="card text-center py-12">
                <Globe className="w-12 h-12 text-gray-300 mx-auto mb-4" />
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
                      <div className="w-12 h-12 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                        <Globe className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {store.storeUrl}
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
                        href={`${store.storeUrl}/wp-admin/admin.php?page=wc-admin`}
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
                <span>Hämta produkter automatiskt från din WooCommerce-butik</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Generera SEO-optimerade texter för alla produkter</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Synka till Yoast SEO meta-fält automatiskt</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Stödjer alla WooCommerce-produkttyper</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
