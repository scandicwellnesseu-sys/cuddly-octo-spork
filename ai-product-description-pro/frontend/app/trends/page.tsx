'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  Filter,
  Search,
} from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';

const trendingKeywords = [
  { keyword: 'hållbart mode', trendScore: 95, searchVolume: 12000, source: 'google', category: 'kläder', change: 'up' },
  { keyword: 'ekologisk hudvård', trendScore: 88, searchVolume: 8500, source: 'instagram', category: 'kosmetika', change: 'up' },
  { keyword: 'minimalistisk inredning', trendScore: 82, searchVolume: 6200, source: 'pinterest', category: 'hem', change: 'stable' },
  { keyword: 'vegansk kosttillskott', trendScore: 79, searchVolume: 5400, source: 'google', category: 'hälsa', change: 'up' },
  { keyword: 'smart hem', trendScore: 76, searchVolume: 9800, source: 'tiktok', category: 'elektronik', change: 'up' },
  { keyword: 'secondhand kläder', trendScore: 74, searchVolume: 7200, source: 'instagram', category: 'kläder', change: 'up' },
  { keyword: 'nordisk design', trendScore: 71, searchVolume: 4300, source: 'pinterest', category: 'hem', change: 'stable' },
  { keyword: 'wellness retreat', trendScore: 68, searchVolume: 3100, source: 'google', category: 'hälsa', change: 'down' },
  { keyword: 'återvunnet material', trendScore: 65, searchVolume: 2800, source: 'instagram', category: 'kläder', change: 'up' },
  { keyword: 'naturlig parfym', trendScore: 62, searchVolume: 2400, source: 'tiktok', category: 'kosmetika', change: 'up' },
];

const categories = ['alla', 'kläder', 'kosmetika', 'hem', 'hälsa', 'elektronik'];
const sources = ['alla', 'google', 'instagram', 'pinterest', 'tiktok'];

export default function TrendsPage() {
  const [selectedCategory, setSelectedCategory] = useState('alla');
  const [selectedSource, setSelectedSource] = useState('alla');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredKeywords = trendingKeywords.filter((kw) => {
    if (selectedCategory !== 'alla' && kw.category !== selectedCategory) return false;
    if (selectedSource !== 'alla' && kw.source !== selectedSource) return false;
    if (searchQuery && !kw.keyword.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getChangeIcon = (change: string) => {
    switch (change) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'google':
        return 'bg-blue-100 text-blue-700';
      case 'instagram':
        return 'bg-pink-100 text-pink-700';
      case 'pinterest':
        return 'bg-red-100 text-red-700';
      case 'tiktok':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="flex min-h-screen bg-surface-light dark:bg-surface-dark">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">
                Trendande nyckelord
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Upptäck populära sökord från sociala medier och Google
              </p>
            </div>
            <button className="btn-secondary">
              <RefreshCw className="w-4 h-4 mr-2" />
              Uppdatera
            </button>
          </div>

          {/* Filters */}
          <div className="card mb-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Sök nyckelord..."
                    className="input pl-10"
                  />
                </div>
              </div>
              <div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="input"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === 'alla' ? 'Alla kategorier' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <select
                  value={selectedSource}
                  onChange={(e) => setSelectedSource(e.target.value)}
                  className="input"
                >
                  {sources.map((src) => (
                    <option key={src} value={src}>
                      {src === 'alla' ? 'Alla källor' : src.charAt(0).toUpperCase() + src.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Trends Table */}
          <div className="card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">#</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Nyckelord</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Trend</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Sökvolym</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Källa</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Kategori</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Ändring</th>
                </tr>
              </thead>
              <tbody>
                {filteredKeywords.map((item, index) => (
                  <motion.tr
                    key={item.keyword}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                  >
                    <td className="py-4 px-6 text-sm font-medium text-gray-400">
                      {index + 1}
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {item.keyword}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${item.trendScore}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{item.trendScore}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-300">
                      {item.searchVolume.toLocaleString()}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`badge ${getSourceColor(item.source)}`}>
                        {item.source}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="badge-primary">{item.category}</span>
                    </td>
                    <td className="py-4 px-6">{getChangeIcon(item.change)}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
