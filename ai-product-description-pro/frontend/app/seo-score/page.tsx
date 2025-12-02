'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Search, RefreshCw, Check, AlertTriangle } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { SeoGauge } from '@/components/charts/SeoGauge';

interface SeoResult {
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

export default function SeoScorePage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<SeoResult | null>(null);

  const handleAnalyze = async () => {
    if (!title && !description) {
      return;
    }

    setIsAnalyzing(true);

    // Simulera API-anrop
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Beräkna mock-resultat baserat på input
    const titleLength = title.length;
    const descLength = description.length;
    const metaLength = metaDescription.length;

    const titleScore = titleLength >= 30 && titleLength <= 60 ? 100 : Math.max(0, 100 - Math.abs(45 - titleLength) * 2);
    const descScore = descLength >= 300 ? Math.min(100, descLength / 10) : (descLength / 300) * 100;
    const metaScore = metaLength >= 120 && metaLength <= 160 ? 100 : Math.max(0, 100 - Math.abs(140 - metaLength));
    const keywordDensity = keywords ? Math.random() * 2 + 1 : 0;
    const readability = Math.random() * 30 + 60;

    const score = Math.round((titleScore + descScore + metaScore + (keywordDensity > 0 ? 80 : 40) + readability) / 5);

    const suggestions: string[] = [];
    if (titleLength < 30) suggestions.push('Utöka titeln till minst 30 tecken');
    if (titleLength > 60) suggestions.push('Korta ner titeln till max 60 tecken');
    if (descLength < 300) suggestions.push('Beskrivningen bör vara minst 300 tecken');
    if (metaLength < 120) suggestions.push('Meta-beskrivningen bör vara minst 120 tecken');
    if (metaLength > 160) suggestions.push('Meta-beskrivningen bör vara max 160 tecken');
    if (!keywords) suggestions.push('Lägg till nyckelord för bättre SEO');

    setResult({
      score,
      breakdown: {
        titleScore: Math.round(titleScore),
        descriptionScore: Math.round(descScore),
        metaScore: Math.round(metaScore),
        keywordDensity,
        readability: Math.round(readability),
      },
      suggestions,
    });

    setIsAnalyzing(false);
  };

  const ScoreBar = ({ label, score }: { label: string; score: number }) => (
    <div className="flex items-center gap-4">
      <span className="text-sm text-gray-500 w-32">{label}</span>
      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${
            score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
          }`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-sm font-medium w-10">{score}</span>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-surface-light dark:bg-surface-dark">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">
              SEO-analys
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Analysera och förbättra din produkttexts SEO-prestanda
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input */}
            <div className="space-y-6">
              <div className="card">
                <label className="label">Produkttitel / Meta-titel</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="T.ex. Ekologisk T-shirt | Premium Bomull"
                  className="input"
                />
                <p className="text-xs text-gray-400 mt-1">
                  {title.length}/60 tecken (rekommenderat: 30-60)
                </p>
              </div>

              <div className="card">
                <label className="label">Produktbeskrivning</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Skriv din produktbeskrivning här..."
                  className="input min-h-[200px]"
                />
                <p className="text-xs text-gray-400 mt-1">
                  {description.length} tecken (rekommenderat: 300+)
                </p>
              </div>

              <div className="card">
                <label className="label">Meta-beskrivning</label>
                <textarea
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  placeholder="Kort beskrivning för sökresultat..."
                  className="input min-h-[80px]"
                />
                <p className="text-xs text-gray-400 mt-1">
                  {metaDescription.length}/160 tecken (rekommenderat: 120-160)
                </p>
              </div>

              <div className="card">
                <label className="label">Målnyckelord</label>
                <input
                  type="text"
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="T.ex. ekologisk, t-shirt, bomull"
                  className="input"
                />
              </div>

              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || (!title && !description)}
                className="btn-primary w-full py-4"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Analyserar...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    Analysera SEO
                  </>
                )}
              </button>
            </div>

            {/* Result */}
            <div>
              {result ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Main Score */}
                  <div className="card text-center">
                    <h3 className="font-semibold text-gray-500 mb-4">Total SEO-poäng</h3>
                    <div className="flex justify-center">
                      <SeoGauge score={result.score} size="large" />
                    </div>
                  </div>

                  {/* Breakdown */}
                  <div className="card">
                    <h3 className="font-semibold mb-4">Detaljerad analys</h3>
                    <div className="space-y-4">
                      <ScoreBar label="Titel" score={result.breakdown.titleScore} />
                      <ScoreBar label="Beskrivning" score={result.breakdown.descriptionScore} />
                      <ScoreBar label="Meta-beskrivning" score={result.breakdown.metaScore} />
                      <ScoreBar label="Läsbarhet" score={result.breakdown.readability} />
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500 w-32">Keyword density</span>
                        <span className="text-sm font-medium">
                          {result.breakdown.keywordDensity.toFixed(1)}%
                        </span>
                        {result.breakdown.keywordDensity >= 1 && result.breakdown.keywordDensity <= 3 ? (
                          <span className="badge-success">Optimal</span>
                        ) : (
                          <span className="badge-warning">Justera</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Suggestions */}
                  {result.suggestions.length > 0 && (
                    <div className="card">
                      <h3 className="font-semibold mb-4">Förbättringsförslag</h3>
                      <ul className="space-y-3">
                        {result.suggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-start gap-3 text-sm">
                            <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-600 dark:text-gray-300">{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.suggestions.length === 0 && (
                    <div className="card bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                      <div className="flex items-center gap-3">
                        <Check className="w-6 h-6 text-green-500" />
                        <p className="text-green-700 dark:text-green-300">
                          Utmärkt! Din text är väl optimerad för sökmotorer.
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : (
                <div className="card h-96 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Fyll i fälten och klicka "Analysera SEO"</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
