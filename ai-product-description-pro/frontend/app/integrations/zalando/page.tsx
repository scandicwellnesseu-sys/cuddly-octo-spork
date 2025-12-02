'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/layout/Sidebar';

export default function ZalandoIntegrationPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);

  const salesChannels = [
    { code: 'SE', name: 'Sverige', flag: '🇸🇪' },
    { code: 'NO', name: 'Norge', flag: '🇳🇴' },
    { code: 'DK', name: 'Danmark', flag: '🇩🇰' },
    { code: 'FI', name: 'Finland', flag: '🇫🇮' },
    { code: 'DE', name: 'Tyskland', flag: '🇩🇪' },
    { code: 'NL', name: 'Nederländerna', flag: '🇳🇱' },
  ];

  const toggleChannel = (code: string) => {
    setSelectedChannels((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const connectedStore = {
    merchantId: 'ZP-1234567',
    channels: ['SE', 'NO', 'DK'],
    productCount: 89,
    lastSync: '2024-01-20 15:45',
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
              <span className="text-3xl">🛍️</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Zalando</h1>
              <p className="text-gray-600">
                Publicera produkttexter på Zalando Partner Program
              </p>
            </div>
          </div>

          {!isConnected ? (
            /* Connect Flow */
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h2 className="text-xl font-semibold mb-6">
                Anslut din Zalando Partner-butik
              </h2>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Merchant ID
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="ZP-1234567"
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Välj marknader
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {salesChannels.map((channel) => (
                    <button
                      key={channel.code}
                      onClick={() => toggleChannel(channel.code)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        selectedChannels.includes(channel.code)
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className="text-2xl">{channel.flag}</span>
                      <p className="font-medium mt-1">{channel.name}</p>
                      {selectedChannels.includes(channel.code) && (
                        <span className="text-orange-500 text-sm">✓ Vald</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="font-medium mb-3">Krav för Zalando</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span>📏</span>
                    Beskrivningar måste vara 50-2000 tecken
                  </li>
                  <li className="flex items-start gap-2">
                    <span>📸</span>
                    Minst 3 produktbilder krävs per artikel
                  </li>
                  <li className="flex items-start gap-2">
                    <span>🏷️</span>
                    EAN-koder måste anges för alla produkter
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setIsConnected(true)}
                disabled={selectedChannels.length === 0}
                className="w-full py-4 bg-[#FF6900] text-white rounded-lg font-semibold hover:bg-[#e55f00] transition-colors disabled:opacity-50"
              >
                Anslut till Zalando
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
                      <span className="text-xl">🛍️</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Zalando Partner</h3>
                      <p className="text-sm text-gray-500">
                        Merchant: {connectedStore.merchantId}
                      </p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                    Ansluten
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {connectedStore.channels.map((channel) => {
                    const info = salesChannels.find((c) => c.code === channel);
                    return (
                      <span
                        key={channel}
                        className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-1"
                      >
                        {info?.flag} {info?.name}
                      </span>
                    );
                  })}
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
                  <button className="px-4 py-2 bg-[#FF6900] text-white rounded-lg text-sm hover:bg-[#e55f00] transition-colors">
                    🔄 Synka produkter
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                    ➕ Lägg till marknad
                  </button>
                  <button className="px-4 py-2 text-red-600 hover:text-red-700 text-sm">
                    Koppla bort
                  </button>
                </div>
              </div>

              {/* Products List */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="font-semibold">Dina produkter på Zalando</h3>
                  <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm">
                    <option>Alla marknader</option>
                    {connectedStore.channels.map((channel) => (
                      <option key={channel} value={channel}>
                        {salesChannels.find((c) => c.code === channel)?.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="divide-y divide-gray-200">
                  {[
                    {
                      ean: '4012345678901',
                      title: 'Stilren klänning svart',
                      brand: 'Nordic Fashion',
                      status: 'live',
                    },
                    {
                      ean: '4012345678902',
                      title: 'Premium sneakers vit',
                      brand: 'Nordic Fashion',
                      status: 'review',
                    },
                    {
                      ean: '4012345678903',
                      title: 'Minimalistisk väska läder',
                      brand: 'Nordic Fashion',
                      status: 'draft',
                    },
                  ].map((product) => (
                    <div
                      key={product.ean}
                      className="px-6 py-4 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium text-gray-900">{product.title}</p>
                        <p className="text-sm text-gray-500">
                          {product.brand} • EAN: {product.ean}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            product.status === 'live'
                              ? 'bg-green-100 text-green-800'
                              : product.status === 'review'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {product.status === 'live'
                            ? 'Live'
                            : product.status === 'review'
                            ? 'Under granskning'
                            : 'Utkast'}
                        </span>
                        <button className="px-3 py-1 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 transition-colors">
                          Redigera text
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
              ℹ️ Om Zalando-integrationen
            </h3>
            <p className="text-sm text-orange-800">
              Zalando har strikta kvalitetskrav på produkttexter. Vi säkerställer
              att alla texter uppfyller deras riktlinjer och är optimerade för
              sökning på plattformen. Texter kan ta 24-48 timmar att godkännas.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
