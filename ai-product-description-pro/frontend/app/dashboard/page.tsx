'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  FileText,
  TrendingUp,
  CreditCard,
  Settings,
  Users,
  ShoppingBag,
  Zap,
  Plus,
  BarChart3,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/Sidebar';
import { SeoGauge } from '@/components/charts/SeoGauge';
import { GenerationsChart } from '@/components/charts/GenerationsChart';

// Mock data
const stats = {
  totalGenerations: 1247,
  generationsThisMonth: 89,
  avgSeoScore: 87,
  creditsBalance: 412,
};

const recentGenerations = [
  {
    id: '1',
    title: 'Ekologisk T-shirt Premium',
    seoScore: 94,
    createdAt: '2024-01-15T10:30:00Z',
    status: 'completed',
  },
  {
    id: '2',
    title: 'Nordisk Keramikvas',
    seoScore: 88,
    createdAt: '2024-01-15T09:15:00Z',
    status: 'completed',
  },
  {
    id: '3',
    title: 'Hållbar Ryggsäck',
    seoScore: 91,
    createdAt: '2024-01-14T16:45:00Z',
    status: 'completed',
  },
];

const trendingKeywords = [
  { keyword: 'hållbart mode', trendScore: 95, change: 'up' },
  { keyword: 'ekologisk hudvård', trendScore: 88, change: 'up' },
  { keyword: 'minimalistisk inredning', trendScore: 82, change: 'stable' },
  { keyword: 'vegansk kosttillskott', trendScore: 79, change: 'up' },
  { keyword: 'smart hem', trendScore: 76, change: 'up' },
];

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-surface-light dark:bg-surface-dark">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">
                Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Välkommen tillbaka! Här är din översikt.
              </p>
            </div>
            <Link href="/generate/single" className="btn-primary">
              <Plus className="w-4 h-4 mr-2" />
              Ny generering
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Totala genereringar</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                    {stats.totalGenerations.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-green-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                +12% denna månad
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Denna månad</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                    {stats.generationsThisMonth}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                Uppdateras i realtid
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Snitt SEO-poäng</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                    {stats.avgSeoScore}
                  </p>
                </div>
                <SeoGauge score={stats.avgSeoScore} size="small" />
              </div>
              <div className="mt-4 flex items-center text-sm text-green-600">
                <ArrowUpRight className="w-4 h-4 mr-1" />
                +3 poäng från förra månaden
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Krediter kvar</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                    {stats.creditsBalance}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <CreditCard className="w-6 h-6 text-accent-600" />
                </div>
              </div>
              <Link
                href="/billing"
                className="mt-4 flex items-center text-sm text-primary hover:underline"
              >
                Köp fler krediter
                <ArrowUpRight className="w-4 h-4 ml-1" />
              </Link>
            </motion.div>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="lg:col-span-2 card"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-semibold text-lg text-gray-900 dark:text-white">
                  Genereringar över tid
                </h2>
                <select className="input w-auto text-sm">
                  <option>Senaste 30 dagarna</option>
                  <option>Senaste 7 dagarna</option>
                  <option>Denna månad</option>
                </select>
              </div>
              <GenerationsChart />
            </motion.div>

            {/* Trending Keywords */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="card"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-semibold text-lg text-gray-900 dark:text-white">
                  Trendande nyckelord
                </h2>
                <Link href="/trends" className="text-sm text-primary hover:underline">
                  Visa alla
                </Link>
              </div>
              <div className="space-y-4">
                {trendingKeywords.map((item, index) => (
                  <div key={item.keyword} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-500 w-6">{index + 1}</span>
                      <span className="text-sm text-gray-900 dark:text-white">{item.keyword}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="badge-primary text-xs">{item.trendScore}</span>
                      {item.change === 'up' && (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Recent Generations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="card mt-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-semibold text-lg text-gray-900 dark:text-white">
                Senaste genereringarna
              </h2>
              <Link href="/generate/single" className="btn-secondary text-sm">
                Visa alla
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Produkt</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">SEO-poäng</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Datum</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Åtgärder</th>
                  </tr>
                </thead>
                <tbody>
                  {recentGenerations.map((gen) => (
                    <tr key={gen.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="py-4 px-4">
                        <span className="font-medium text-gray-900 dark:text-white">{gen.title}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${gen.seoScore}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {gen.seoScore}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-500">
                        {new Date(gen.createdAt).toLocaleDateString('sv-SE')}
                      </td>
                      <td className="py-4 px-4">
                        <span className="badge-success">Klar</span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button className="text-sm text-primary hover:underline">Visa</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <Link href="/generate/single" className="card hover:shadow-lg transition-shadow group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                  <Sparkles className="w-6 h-6 text-primary group-hover:text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Enkel generering</h3>
                  <p className="text-sm text-gray-500">Skapa en produkttext</p>
                </div>
              </div>
            </Link>

            <Link href="/generate/bulk" className="card hover:shadow-lg transition-shadow group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center group-hover:bg-green-600 transition-colors">
                  <Zap className="w-6 h-6 text-green-600 group-hover:text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Bulkgenerering</h3>
                  <p className="text-sm text-gray-500">Massuppladdning av produkter</p>
                </div>
              </div>
            </Link>

            <Link href="/brand-voice" className="card hover:shadow-lg transition-shadow group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent transition-colors">
                  <FileText className="w-6 h-6 text-accent-600 group-hover:text-gray-900" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Brand Voice</h3>
                  <p className="text-sm text-gray-500">Träna din varumärkesröst</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
