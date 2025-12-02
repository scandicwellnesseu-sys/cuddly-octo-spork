'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/layout/Sidebar';

export default function CompetitorAnalysisPage() {
  const [competitorUrl, setCompetitorUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    // Simulera API-anrop
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setIsAnalyzing(false);
  };

  const mockAnalyses = [
    {
      id: '1',
      competitorName: 'Scandinavian Design AB',
      url: 'https://example-competitor.com',
      analyzedAt: '2024-01-18',
      summary: {
        productCount: 342,
        avgDescLength: 287,
        avgSeoScore: 78,
        topKeywords: ['skandinavisk', 'minimalistisk', 'hållbar', 'design', 'kvalitet'],
      },
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Konkurrentanalys</h1>
            <p className="text-gray-600 mt-1">
              Analysera konkurrenters produkttexter och hitta förbättringsmöjligheter
            </p>
          </div>

          {/* New Analysis Form */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Analysera ny konkurrent</h2>
            <div className="flex gap-4">
              <input
                type="url"
                value={competitorUrl}
                onChange={(e) => setCompetitorUrl(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="https://konkurrent-butik.se"
              />
              <button
                onClick={handleAnalyze}
                disabled={!competitorUrl || isAnalyzing}
                className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isAnalyzing ? 'Analyserar...' : '🔍 Analysera'}
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Analysen tar 1-2 minuter beroende på butikens storlek
            </p>
          </div>

          {/* Analysis Results */}
          <div className="space-y-6">
            {mockAnalyses.map((analysis) => (
              <motion.div
                key={analysis.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {analysis.competitorName}
                      </h3>
                      <p className="text-sm text-gray-500">{analysis.url}</p>
                    </div>
                    <span className="text-sm text-gray-500">
                      Analyserad: {analysis.analyzedAt}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                    {[
                      { label: 'Produkter', value: analysis.summary.productCount, icon: '📦' },
                      { label: 'Snitt beskrivning', value: `${analysis.summary.avgDescLength} tecken`, icon: '📝' },
                      { label: 'Snitt SEO-poäng', value: analysis.summary.avgSeoScore, icon: '📊' },
                      { label: 'Nyckelord', value: analysis.summary.topKeywords.length, icon: '🔑' },
                    ].map((stat) => (
                      <div key={stat.label} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span>{stat.icon}</span>
                          <span className="text-sm text-gray-600">{stat.label}</span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Top Keywords */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">Toppnyckelord</h4>
                    <div className="flex flex-wrap gap-2">
                      {analysis.summary.topKeywords.map((keyword) => (
                        <span
                          key={keyword}
                          className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Comparison */}
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6">
                    <h4 className="font-medium text-gray-900 mb-4">
                      🎯 Möjligheter att differentiera dig
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <span className="text-green-500">✓</span>
                        <span>Skriv längre beskrivningar (+50 tecken) för bättre SEO</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500">✓</span>
                        <span>Använd emotionellt språk - konkurrenten är teknisk</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500">✓</span>
                        <span>Fokusera på hållbarhet - saknas i deras texter</span>
                      </li>
                    </ul>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 transition-colors">
                      📊 Fullständig rapport
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 transition-colors">
                      🔄 Uppdatera analys
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
