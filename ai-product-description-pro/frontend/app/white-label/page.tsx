'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/layout/Sidebar';

export default function WhiteLabelPage() {
  const [config, setConfig] = useState({
    companyName: '',
    logo: '',
    primaryColor: '#1E3A8A',
    secondaryColor: '#FFD700',
    customDomain: '',
    hidePoweredBy: false,
  });

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
            <h1 className="text-3xl font-bold text-gray-900">White-Label</h1>
            <p className="text-gray-600 mt-1">
              Anpassa plattformen med ditt varumärke (Agency-plan)
            </p>
          </div>

          {/* Plan Check */}
          <div className="bg-gradient-to-r from-secondary/20 to-primary/20 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-4">
              <span className="text-4xl">🏷️</span>
              <div>
                <h3 className="font-semibold text-gray-900">White-Label är tillgängligt</h3>
                <p className="text-sm text-gray-600">
                  Du har Agency-planen och kan aktivera white-label-funktioner
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Settings Form */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-6">Varumärkesinställningar</h2>
              <form className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Företagsnamn
                  </label>
                  <input
                    type="text"
                    value={config.companyName}
                    onChange={(e) =>
                      setConfig({ ...config, companyName: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Ditt Företag AB"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Logotyp URL
                  </label>
                  <input
                    type="url"
                    value={config.logo}
                    onChange={(e) => setConfig({ ...config, logo: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="https://example.com/logo.png"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Primärfärg
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={config.primaryColor}
                        onChange={(e) =>
                          setConfig({ ...config, primaryColor: e.target.value })
                        }
                        className="w-12 h-10 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={config.primaryColor}
                        onChange={(e) =>
                          setConfig({ ...config, primaryColor: e.target.value })
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sekundärfärg
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={config.secondaryColor}
                        onChange={(e) =>
                          setConfig({ ...config, secondaryColor: e.target.value })
                        }
                        className="w-12 h-10 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={config.secondaryColor}
                        onChange={(e) =>
                          setConfig({ ...config, secondaryColor: e.target.value })
                        }
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Egen domän
                  </label>
                  <input
                    type="text"
                    value={config.customDomain}
                    onChange={(e) =>
                      setConfig({ ...config, customDomain: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="ai.dittforetag.se"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Lägg till en CNAME som pekar på app.ai-product-description.pro
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="hidePoweredBy"
                    checked={config.hidePoweredBy}
                    onChange={(e) =>
                      setConfig({ ...config, hidePoweredBy: e.target.checked })
                    }
                    className="rounded text-primary"
                  />
                  <label htmlFor="hidePoweredBy" className="text-sm text-gray-700">
                    Dölj "Powered by AI Product Description Generator PRO"
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full px-4 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Spara inställningar
                </button>
              </form>
            </div>

            {/* Preview */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-6">Förhandsvisning</h2>
              <div
                className="border rounded-lg overflow-hidden"
                style={{
                  '--preview-primary': config.primaryColor,
                  '--preview-secondary': config.secondaryColor,
                } as React.CSSProperties}
              >
                <div
                  className="p-4"
                  style={{ backgroundColor: config.primaryColor }}
                >
                  {config.logo ? (
                    <img src={config.logo} alt="Logo" className="h-8" />
                  ) : (
                    <span className="text-white font-semibold">
                      {config.companyName || 'Ditt Företag'}
                    </span>
                  )}
                </div>
                <div className="p-6 bg-gray-50">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-medium mb-2">Dashboard</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div
                        className="h-16 rounded"
                        style={{ backgroundColor: `${config.primaryColor}20` }}
                      />
                      <div
                        className="h-16 rounded"
                        style={{ backgroundColor: `${config.secondaryColor}40` }}
                      />
                    </div>
                    <button
                      className="mt-4 w-full py-2 rounded text-white text-sm"
                      style={{ backgroundColor: config.primaryColor }}
                    >
                      Exempelknapp
                    </button>
                  </div>
                </div>
                {!config.hidePoweredBy && (
                  <div className="p-3 text-center text-xs text-gray-500 border-t">
                    Powered by AI Product Description Generator PRO
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: '🎨',
                title: 'Anpassat utseende',
                description: 'Dina färger, din logotyp, din stil',
              },
              {
                icon: '🌐',
                title: 'Egen domän',
                description: 'Kör på din egen webbadress',
              },
              {
                icon: '📧',
                title: 'Anpassade mail',
                description: 'Skicka från din egen e-postadress',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-xl p-6 shadow-sm text-center"
              >
                <span className="text-3xl">{feature.icon}</span>
                <h3 className="font-semibold mt-3">{feature.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
