'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Upload,
  Zap,
  FileText,
  Download,
  Play,
  Pause,
  CheckCircle,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import toast from 'react-hot-toast';

interface BulkProduct {
  id: string;
  name: string;
  image: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  seoScore?: number;
}

export default function BulkGenerationPage() {
  const [products, setProducts] = useState<BulkProduct[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newProducts: BulkProduct[] = Array.from(files).map((file, index) => ({
      id: `${Date.now()}-${index}`,
      name: file.name.replace(/\.[^/.]+$/, ''),
      image: URL.createObjectURL(file),
      status: 'pending',
    }));

    setProducts((prev) => [...prev, ...newProducts]);
    toast.success(`${files.length} produkter tillagda`);
  };

  const startBulkGeneration = async () => {
    setIsProcessing(true);
    setProgress(0);

    for (let i = 0; i < products.length; i++) {
      setProducts((prev) =>
        prev.map((p, idx) =>
          idx === i ? { ...p, status: 'processing' } : p
        )
      );

      // Simulera generering
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setProducts((prev) =>
        prev.map((p, idx) =>
          idx === i
            ? {
                ...p,
                status: 'completed',
                seoScore: Math.floor(Math.random() * 20) + 80,
              }
            : p
        )
      );

      setProgress(((i + 1) / products.length) * 100);
    }

    setIsProcessing(false);
    toast.success('Bulkgenerering klar!');
  };

  const getStatusIcon = (status: BulkProduct['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'processing':
        return <Clock className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const completedCount = products.filter((p) => p.status === 'completed').length;
  const avgScore =
    completedCount > 0
      ? Math.round(
          products
            .filter((p) => p.seoScore)
            .reduce((sum, p) => sum + (p.seoScore || 0), 0) / completedCount
        )
      : 0;

  return (
    <div className="flex min-h-screen bg-surface-light dark:bg-surface-dark">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">
              Bulkgenerering
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Generera produkttexter för flera produkter samtidigt
            </p>
          </div>

          {/* Upload Section */}
          {products.length === 0 ? (
            <div className="card">
              <label className="cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-xl p-16 text-center hover:border-primary transition-colors">
                  <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ladda upp produktbilder
                  </p>
                  <p className="text-gray-500">
                    Dra och släpp eller klicka för att välja flera bilder
                  </p>
                  <p className="text-sm text-gray-400 mt-4">
                    Stödjer JPEG, PNG, WebP • Max 100 bilder per batch
                  </p>
                </div>
              </label>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Stats Bar */}
              <div className="card">
                <div className="flex items-center justify-between">
                  <div className="flex gap-8">
                    <div>
                      <p className="text-sm text-gray-500">Totalt</p>
                      <p className="text-2xl font-bold">{products.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Klara</p>
                      <p className="text-2xl font-bold text-green-600">
                        {completedCount}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Snitt SEO</p>
                      <p className="text-2xl font-bold text-primary">
                        {avgScore || '-'}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <label className="btn-secondary cursor-pointer">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Upload className="w-4 h-4 mr-2" />
                      Lägg till fler
                    </label>
                    <button
                      onClick={startBulkGeneration}
                      disabled={isProcessing || products.length === 0}
                      className="btn-primary"
                    >
                      {isProcessing ? (
                        <>
                          <Pause className="w-4 h-4 mr-2" />
                          Pausar...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Starta generering
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Progress Bar */}
                {isProcessing && (
                  <div className="mt-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-500">Genererar...</span>
                      <span className="font-medium">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-primary rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Products Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="card p-4"
                  >
                    <div className="flex gap-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 dark:text-white truncate">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-2">
                          {getStatusIcon(product.status)}
                          <span className="text-sm text-gray-500 capitalize">
                            {product.status === 'pending' && 'Väntar'}
                            {product.status === 'processing' && 'Genererar...'}
                            {product.status === 'completed' && 'Klar'}
                            {product.status === 'failed' && 'Misslyckades'}
                          </span>
                        </div>
                        {product.seoScore && (
                          <div className="mt-2">
                            <span className="badge-success">
                              SEO: {product.seoScore}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Export */}
              {completedCount > 0 && (
                <div className="card flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      Exportera resultat
                    </h3>
                    <p className="text-sm text-gray-500">
                      Ladda ner alla genererade texter
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <button className="btn-secondary">
                      <Download className="w-4 h-4 mr-2" />
                      CSV
                    </button>
                    <button className="btn-secondary">
                      <Download className="w-4 h-4 mr-2" />
                      JSON
                    </button>
                    <button className="btn-primary">
                      <Zap className="w-4 h-4 mr-2" />
                      Synka till butik
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
