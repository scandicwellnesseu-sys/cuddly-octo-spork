'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/layout/Sidebar';

export default function AmazonIntegrationPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [selectedMarketplace, setSelectedMarketplace] = useState('');

  const marketplaces = {
    EU: [
      { id: 'A1PA6795UKMFR9', name: 'Amazon.de', flag: '🇩🇪' },
      { id: 'A2NODRKZP88ZB9', name: 'Amazon.se', flag: '🇸🇪' },
      { id: 'A1F83G8C2ARO7P', name: 'Amazon.co.uk', flag: '🇬🇧' },
      { id: 'A13V1IB3VIYBER', name: 'Amazon.fr', flag: '🇫🇷' },
      { id: 'APJ6JRA9NG5V4', name: 'Amazon.it', flag: '🇮🇹' },
      { id: 'A1RKKUPIHCS9HS', name: 'Amazon.es', flag: '🇪🇸' },
    ],
  };

  const connectedStore = {
    sellerId: 'A1EXAMPLE123',
    marketplace: 'Amazon.se',
    productCount: 156,
    lastSync: '2024-01-20 14:30',
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center">
              <span className="text-3xl">📦</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Amazon</h1>
              <p className="text-gray-600">
                Synka produkttexter till Amazon Seller Central
              </p>
            </div>
          </div>

          {!isConnected ? (
            /* Connect Flow */
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-xl font-semibold mb-6">Anslut din Amazon-butik</h2>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Välj marknadsplats
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {marketplaces.EU.map((mp) => (
                    <button
                      key={mp.id}
                      onClick={() => setSelectedMarketplace(mp.id)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        selectedMarketplace === mp.id
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-2xl">{mp.flag}</span>
                      <p className="font-medium mt-1">{mp.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="font-medium mb-3">Vad händer när du ansluter?</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    Du omdirigeras till Amazon för att godkänna åtkomst
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    Vi importerar dina produktlistningar
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    Du kan börja uppdatera produkttexter direkt
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setIsConnected(true)}
                disabled={!selectedMarketplace}
                className="w-full py-4 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50"
              >
                Anslut till Amazon
              </button>
            </div>
          ) : (
            /* Connected State */
            <div className="space-y-6">
              {/* Store Info */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl">🇸🇪</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {connectedStore.marketplace}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Seller ID: {connectedStore.sellerId}
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                    Ansluten
                  </span>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500">Produkter</p>
                    <p className="text-2xl font-bold">{connectedStore.productCount}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-500">Senast synkad</p>
                    <p className="text-lg font-medium">{connectedStore.lastSync}</p>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 transition-colors">
                    🔄 Synka produkter
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                    ⚙️ Inställningar
                  </button>
                  <button className="px-4 py-2 text-red-600 hover:text-red-700 text-sm">
                    Koppla bort
                  </button>
                </div>
              </div>

              {/* Products List */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="font-semibold">Produkter att uppdatera</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {[
                    { asin: 'B09ABC123', title: 'Ekologisk bomullströja', status: 'pending' },
                    { asin: 'B09DEF456', title: 'Naturlig hudkräm 50ml', status: 'synced' },
                    { asin: 'B09GHI789', title: 'Bambumassageborste', status: 'pending' },
                  ].map((product) => (
                    <div
                      key={product.asin}
                      className="px-6 py-4 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{product.title}</p>
                        <p className="text-sm text-gray-500">ASIN: {product.asin}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            product.status === 'synced'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {product.status === 'synced' ? 'Synkad' : 'Väntar'}
                        </span>
                        <button className="px-3 py-1 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 transition-colors">
                          Generera text
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="mt-8 bg-orange-50 rounded-xl p-6">
            <h3 className="font-semibold text-orange-900 mb-2">
              💡 Om Amazon-integrationen
            </h3>
            <p className="text-sm text-orange-800">
              Produkttexter på Amazon har speciella krav. Vi optimerar automatiskt
              texterna för Amazons sökalgoritm och formaterar bullet points enligt
              deras riktlinjer. Ändringar granskas av Amazon innan de publiceras.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
