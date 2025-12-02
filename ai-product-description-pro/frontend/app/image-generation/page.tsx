'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/layout/Sidebar';

interface GeneratedImage {
  id: string;
  prompt: string;
  imageUrl: string;
  style: string;
  createdAt: string;
}

export default function ImageGenerationPage() {
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('product');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([
    {
      id: '1',
      prompt: 'Vit ekologisk t-shirt på vit bakgrund',
      imageUrl: 'https://via.placeholder.com/512x512?text=AI+Generated+Image',
      style: 'product',
      createdAt: '2024-01-20',
    },
  ]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulera API-anrop
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setGeneratedImages([
      {
        id: Date.now().toString(),
        prompt,
        imageUrl: 'https://via.placeholder.com/512x512?text=New+Generated+Image',
        style,
        createdAt: new Date().toISOString().split('T')[0],
      },
      ...generatedImages,
    ]);
    setIsGenerating(false);
    setPrompt('');
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">AI-bildgenerering</h1>
            <p className="text-gray-600 mt-1">
              Skapa professionella produktbilder med DALL-E 3
            </p>
          </div>

          {/* Generator Form */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Beskriv din produktbild
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  placeholder="T.ex. En vit ekologisk bomullströja fotograferad på vit bakgrund med mjukt studioljus..."
                />
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bildstil
                  </label>
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="product">🛍️ Produktfoto</option>
                    <option value="lifestyle">🏡 Lifestyle</option>
                    <option value="minimalist">✨ Minimalistisk</option>
                    <option value="luxury">💎 Lyxig</option>
                    <option value="natural">🌿 Naturlig</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bildformat
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['1:1', '16:9', '4:3', '9:16'].map((ratio) => (
                      <button
                        key={ratio}
                        onClick={() => setAspectRatio(ratio)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          aspectRatio === ratio
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-between items-center">
              <p className="text-sm text-gray-500">
                💰 2 krediter per generering
              </p>
              <button
                onClick={handleGenerate}
                disabled={!prompt || isGenerating}
                className="px-8 py-3 bg-gradient-to-r from-primary to-blue-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
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
                    Genererar...
                  </span>
                ) : (
                  '🎨 Generera bild'
                )}
              </button>
            </div>
          </div>

          {/* Generated Images Gallery */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">Genererade bilder</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {generatedImages.map((image) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="group relative rounded-xl overflow-hidden bg-gray-100"
                >
                  <img
                    src={image.imageUrl}
                    alt={image.prompt}
                    className="w-full aspect-square object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white text-sm line-clamp-2 mb-2">
                        {image.prompt}
                      </p>
                      <div className="flex gap-2">
                        <button className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white text-sm rounded-lg backdrop-blur-sm transition-colors">
                          📥 Ladda ner
                        </button>
                        <button className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white text-sm rounded-lg backdrop-blur-sm transition-colors">
                          🔄 Varianter
                        </button>
                      </div>
                    </div>
                  </div>
                  <span className="absolute top-3 right-3 px-2 py-1 bg-black/50 text-white text-xs rounded-lg backdrop-blur-sm">
                    {image.style}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="mt-8 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-3">💡 Tips för bättre bilder</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span>✓</span>
                Beskriv bakgrund, ljussättning och vinkel
              </li>
              <li className="flex items-start gap-2">
                <span>✓</span>
                Ange material, färg och textur
              </li>
              <li className="flex items-start gap-2">
                <span>✓</span>
                Använd termer som "studio lighting" och "product photography"
              </li>
              <li className="flex items-start gap-2">
                <span>✓</span>
                Specificera önskad stämning eller känsla
              </li>
            </ul>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
