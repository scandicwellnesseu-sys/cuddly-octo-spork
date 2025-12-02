'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/layout/Sidebar';

export default function PlagiarismPage() {
  const [text, setText] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<{
    uniquenessScore: number;
    matches: { source: string; similarity: number; snippet: string }[];
    recommendations: string[];
  } | null>(null);

  const handleCheck = async () => {
    setIsChecking(true);
    // Simulera API-anrop
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setResult({
      uniquenessScore: 94,
      matches: [],
      recommendations: [
        'Texten är unik och redo att publiceras',
        'Överväg att lägga till fler specifika produktdetaljer',
      ],
    });
    setIsChecking(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBg = (score: number) => {
    if (score >= 90) return 'bg-green-100';
    if (score >= 70) return 'bg-yellow-100';
    return 'bg-red-100';
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Plagiatkontroll</h1>
            <p className="text-gray-600 mt-1">
              Verifiera att dina produkttexter är unika och fria från plagiat
            </p>
          </div>

          {/* Input Form */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Text att kontrollera
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-48 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              placeholder="Klistra in din produkttext här..."
            />
            <div className="mt-4 flex justify-between items-center">
              <p className="text-sm text-gray-500">
                {text.length} tecken • {text.split(/\s+/).filter((w) => w).length} ord
              </p>
              <button
                onClick={handleCheck}
                disabled={!text || isChecking}
                className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isChecking ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Kontrollerar...
                  </span>
                ) : (
                  '🔍 Kontrollera text'
                )}
              </button>
            </div>
          </div>

          {/* Result */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Score Card */}
              <div
                className={`${getScoreBg(result.uniquenessScore)} rounded-xl p-8 text-center`}
              >
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Unikhetspoäng
                </p>
                <p
                  className={`text-6xl font-bold ${getScoreColor(result.uniquenessScore)}`}
                >
                  {result.uniquenessScore}%
                </p>
                <p className="mt-2 text-gray-600">
                  {result.uniquenessScore >= 90
                    ? '✅ Texten är unik och redo att publiceras'
                    : result.uniquenessScore >= 70
                    ? '⚠️ Texten kan förbättras'
                    : '❌ Texten behöver skrivas om'}
                </p>
              </div>

              {/* Matches */}
              {result.matches.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold mb-4">
                    Hittade likheter ({result.matches.length})
                  </h3>
                  <div className="space-y-4">
                    {result.matches.map((match, index) => (
                      <div
                        key={index}
                        className="p-4 bg-red-50 border border-red-200 rounded-lg"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <a
                            href={match.source}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm"
                          >
                            {match.source}
                          </a>
                          <span className="text-red-600 font-medium">
                            {match.similarity}% likhet
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 italic">
                          "{match.snippet}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold mb-4">Rekommendationer</h3>
                <ul className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span className="text-gray-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}

          {/* Info Box */}
          <div className="mt-8 bg-blue-50 rounded-xl p-6">
            <h3 className="font-semibold text-blue-900 mb-2">
              ℹ️ Om plagiatkontroll
            </h3>
            <p className="text-blue-800 text-sm">
              Vår plagiatkontroll analyserar texten mot miljontals webbsidor och
              dokument för att säkerställa originalitet. En unikhetspoäng över 90%
              anses vara bra för SEO och undviker problem med duplicerat innehåll.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
