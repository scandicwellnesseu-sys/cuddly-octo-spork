'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import {
  Upload,
  Sparkles,
  X,
  Plus,
  Copy,
  Download,
  RefreshCw,
  Check,
} from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { SeoGauge } from '@/components/charts/SeoGauge';
import toast from 'react-hot-toast';

const languages = [
  { code: 'SV', name: 'Svenska' },
  { code: 'EN', name: 'English' },
  { code: 'NO', name: 'Norska' },
  { code: 'DA', name: 'Danska' },
  { code: 'FI', name: 'Finska' },
  { code: 'DE', name: 'Tyska' },
];

interface GenerationResult {
  description: string;
  shortDescription: string;
  seo: {
    metaTitle: string;
    metaDescription: string;
    slug: string;
  };
  altTexts: string[];
  attributes: {
    color?: string;
    material?: string;
    category?: string;
    tags: string[];
  };
  confidenceScore: number;
  seoScore: number;
  readabilityGrade: string;
}

export default function SingleGenerationPage() {
  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [language, setLanguage] = useState('SV');
  const [brandVoice, setBrandVoice] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setImages((prev) => [...prev, reader.result as string].slice(0, 5));
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
    },
    maxFiles: 5,
  });

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      setKeywords((prev) => [...prev, keywordInput.trim()]);
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setKeywords((prev) => prev.filter((k) => k !== keyword));
  };

  const handleGenerate = async () => {
    if (images.length === 0) {
      toast.error('Ladda upp minst en bild');
      return;
    }

    setIsGenerating(true);

    // Simulera API-anrop
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Mock-resultat
    setResult({
      description:
        'Upptäck vår exklusiva ekologiska bomullströja, designad med nordisk minimalism i åtanke. Tillverkad av 100% GOTS-certifierad bomull, erbjuder denna tidlösa plagg en perfekt kombination av komfort och hållbarhet. Den mjuka tyget ger en lyxig känsla mot huden, medan den klassiska snittet passar alla kroppstyper. Idealisk för vardagsbruk eller avslappnade tillfällen.',
      shortDescription:
        'Ekologisk bomullströja i skandinavisk design. GOTS-certifierad, mjuk och bekväm.',
      seo: {
        metaTitle: 'Ekologisk T-shirt | Premium Bomull | Skandinavisk Design',
        metaDescription:
          'Handla vår GOTS-certifierade ekologiska t-shirt i premium bomull. Nordisk minimalism möter hållbar mode. Fri frakt över 499 kr.',
        slug: 'ekologisk-tshirt-premium-bomull',
      },
      altTexts: [
        'Vit ekologisk bomullströja på neutral bakgrund',
        'Närbild på tyget visar mjuk bomullskvalitet',
      ],
      attributes: {
        color: 'vit',
        material: 'ekologisk bomull',
        category: 't-shirts',
        tags: ['ekologisk', 'hållbar', 'skandinavisk', 'unisex', 'premium'],
      },
      confidenceScore: 0.94,
      seoScore: 91,
      readabilityGrade: 'A',
    });

    setIsGenerating(false);
    toast.success('Produkttext genererad!');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Kopierat till urklipp!');
  };

  return (
    <div className="flex min-h-screen bg-surface-light dark:bg-surface-dark">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">
              Generera produkttext
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Ladda upp en bild och få AI-genererad SEO-optimerad text
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              {/* Image Upload */}
              <div className="card">
                <label className="label">Produktbilder</label>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                    isDragActive
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 dark:border-gray-600 hover:border-primary'
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-300">
                    Dra och släpp bilder här, eller klicka för att välja
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Max 5 bilder (JPEG, PNG, WebP)
                  </p>
                </div>

                {images.length > 0 && (
                  <div className="flex gap-2 mt-4 flex-wrap">
                    {images.map((img, index) => (
                      <div key={index} className="relative">
                        <img
                          src={img}
                          alt={`Uploaded ${index + 1}`}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Title */}
              <div className="card">
                <label className="label">Produkttitel (valfritt)</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="T.ex. Ekologisk T-shirt Premium"
                  className="input"
                />
              </div>

              {/* Keywords */}
              <div className="card">
                <label className="label">Nyckelord</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addKeyword()}
                    placeholder="Lägg till nyckelord"
                    className="input flex-1"
                  />
                  <button onClick={addKeyword} className="btn-secondary">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {keywords.length > 0 && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {keywords.map((kw) => (
                      <span
                        key={kw}
                        className="badge-primary flex items-center gap-1"
                      >
                        {kw}
                        <button onClick={() => removeKeyword(kw)}>
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Language & Brand Voice */}
              <div className="card grid md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Språk</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="input"
                  >
                    {languages.map((lang) => (
                      <option key={lang.code} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Brand Voice</label>
                  <select
                    value={brandVoice}
                    onChange={(e) => setBrandVoice(e.target.value)}
                    className="input"
                  >
                    <option value="">Standard</option>
                    <option value="1">Lyx & Premium</option>
                    <option value="2">Lekfullt & Ungdomligt</option>
                  </select>
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating || images.length === 0}
                className="btn-primary w-full py-4 text-lg"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Genererar...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generera produkttext
                  </>
                )}
              </button>
            </div>

            {/* Result Section */}
            <div className="space-y-6">
              {result ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  {/* Scores */}
                  <div className="card">
                    <div className="flex items-center justify-between">
                      <div className="text-center">
                        <SeoGauge score={result.seoScore} size="medium" />
                        <p className="text-sm text-gray-500 mt-2">SEO-poäng</p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                          <span className="text-2xl font-bold text-green-600">
                            {result.readabilityGrade}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Läsbarhet</p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-2xl font-bold text-primary">
                            {Math.round(result.confidenceScore * 100)}%
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">Konfidensgrad</p>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="card">
                    <div className="flex items-center justify-between mb-2">
                      <label className="label mb-0">Produktbeskrivning</label>
                      <button
                        onClick={() => copyToClipboard(result.description)}
                        className="text-primary hover:text-primary-600"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {result.description}
                    </p>
                  </div>

                  {/* Short Description */}
                  <div className="card">
                    <div className="flex items-center justify-between mb-2">
                      <label className="label mb-0">Kort beskrivning</label>
                      <button
                        onClick={() => copyToClipboard(result.shortDescription)}
                        className="text-primary hover:text-primary-600"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">
                      {result.shortDescription}
                    </p>
                  </div>

                  {/* SEO */}
                  <div className="card">
                    <label className="label">SEO-metadata</label>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Meta-titel</p>
                        <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded">
                          <span className="text-sm">{result.seo.metaTitle}</span>
                          <button onClick={() => copyToClipboard(result.seo.metaTitle)}>
                            <Copy className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Meta-beskrivning</p>
                        <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded">
                          <span className="text-sm">{result.seo.metaDescription}</span>
                          <button onClick={() => copyToClipboard(result.seo.metaDescription)}>
                            <Copy className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">URL-slug</p>
                        <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded">
                          <span className="text-sm">/{result.seo.slug}</span>
                          <button onClick={() => copyToClipboard(result.seo.slug)}>
                            <Copy className="w-4 h-4 text-gray-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Attributes */}
                  <div className="card">
                    <label className="label">Produktattribut</label>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {result.attributes.color && (
                        <div>
                          <p className="text-xs text-gray-400">Färg</p>
                          <p className="font-medium">{result.attributes.color}</p>
                        </div>
                      )}
                      {result.attributes.material && (
                        <div>
                          <p className="text-xs text-gray-400">Material</p>
                          <p className="font-medium">{result.attributes.material}</p>
                        </div>
                      )}
                      {result.attributes.category && (
                        <div>
                          <p className="text-xs text-gray-400">Kategori</p>
                          <p className="font-medium">{result.attributes.category}</p>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-2">Taggar</p>
                      <div className="flex flex-wrap gap-2">
                        {result.attributes.tags.map((tag) => (
                          <span key={tag} className="badge-primary">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-4">
                    <button className="btn-secondary flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Exportera
                    </button>
                    <button className="btn-primary flex-1">
                      <Check className="w-4 h-4 mr-2" />
                      Synka till butik
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="card h-96 flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Din genererade text visas här</p>
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
