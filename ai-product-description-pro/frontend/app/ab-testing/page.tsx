'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/layout/Sidebar';

interface AbTest {
  id: string;
  name: string;
  status: 'DRAFT' | 'RUNNING' | 'PAUSED' | 'COMPLETED';
  variants: {
    id: string;
    name: string;
    impressions: number;
    clicks: number;
    conversions: number;
    isWinner: boolean;
  }[];
  goalType: string;
  startedAt?: string;
}

const mockTests: AbTest[] = [
  {
    id: '1',
    name: 'Produktbeskrivning - Längd',
    status: 'RUNNING',
    goalType: 'conversions',
    startedAt: '2024-01-15',
    variants: [
      { id: 'a', name: 'A - Kort', impressions: 1234, clicks: 89, conversions: 23, isWinner: false },
      { id: 'b', name: 'B - Lång', impressions: 1256, clicks: 112, conversions: 31, isWinner: true },
    ],
  },
  {
    id: '2',
    name: 'SEO-fokus vs Storytelling',
    status: 'COMPLETED',
    goalType: 'clicks',
    variants: [
      { id: 'a', name: 'A - SEO', impressions: 3421, clicks: 234, conversions: 45, isWinner: true },
      { id: 'b', name: 'B - Story', impressions: 3398, clicks: 198, conversions: 38, isWinner: false },
    ],
  },
];

export default function AbTestingPage() {
  const [tests] = useState<AbTest[]>(mockTests);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RUNNING':
        return 'bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      case 'PAUSED':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateConversionRate = (conversions: number, impressions: number) => {
    return impressions > 0 ? ((conversions / impressions) * 100).toFixed(2) : '0.00';
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">A/B-testning</h1>
              <p className="text-gray-600 mt-1">
                Testa olika produkttexter och se vilka som konverterar bäst
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              + Skapa nytt test
            </button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Aktiva tester', value: '3', icon: '🧪' },
              { label: 'Genomsnittlig förbättring', value: '+18%', icon: '📈' },
              { label: 'Totala impressions', value: '45.2K', icon: '👁️' },
              { label: 'Hittade vinnare', value: '12', icon: '🏆' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{stat.icon}</span>
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Tests List */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold">Dina A/B-tester</h2>
            </div>
            <div className="divide-y divide-gray-200">
              {tests.map((test) => (
                <motion.div
                  key={test.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{test.name}</h3>
                      <p className="text-sm text-gray-500">
                        Mål: {test.goalType} • Startad: {test.startedAt || 'Ej startad'}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(test.status)}`}
                    >
                      {test.status === 'RUNNING' ? 'Pågående' : test.status === 'COMPLETED' ? 'Avslutad' : test.status}
                    </span>
                  </div>

                  {/* Variants */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {test.variants.map((variant) => (
                      <div
                        key={variant.id}
                        className={`p-4 rounded-lg border-2 ${
                          variant.isWinner
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-gray-900">
                            {variant.name}
                            {variant.isWinner && (
                              <span className="ml-2 text-green-600">🏆 Vinnare</span>
                            )}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Impressions</p>
                            <p className="font-semibold">{variant.impressions.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Klick</p>
                            <p className="font-semibold">{variant.clicks.toLocaleString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Konvertering</p>
                            <p className="font-semibold text-green-600">
                              {calculateConversionRate(variant.conversions, variant.impressions)}%
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex gap-3">
                    {test.status === 'RUNNING' && (
                      <>
                        <button className="px-4 py-2 text-sm bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors">
                          Pausa
                        </button>
                        <button className="px-4 py-2 text-sm bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors">
                          Avsluta & analysera
                        </button>
                      </>
                    )}
                    <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                      Visa detaljer →
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Create Modal */}
          {showCreateModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl p-8 max-w-lg w-full mx-4"
              >
                <h2 className="text-2xl font-bold mb-6">Skapa nytt A/B-test</h2>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Testnamn
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="T.ex. Produktbeskrivning - Ton"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mål
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                      <option value="conversions">Konverteringar</option>
                      <option value="clicks">Klick</option>
                      <option value="revenue">Intäkter</option>
                    </select>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Avbryt
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Skapa test
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
