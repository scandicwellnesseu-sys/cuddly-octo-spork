'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mic,
  Plus,
  Trash2,
  Star,
  Check,
  Sparkles,
  FileText,
} from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import toast from 'react-hot-toast';

interface BrandVoice {
  id: string;
  name: string;
  description: string;
  isDefault: boolean;
  toneProfile: {
    formal: number;
    friendly: number;
    technical: number;
    playful: number;
    professional: number;
  };
  createdAt: string;
}

const mockBrandVoices: BrandVoice[] = [
  {
    id: '1',
    name: 'Lyx & Premium',
    description: 'Elegant och sofistikerad ton för lyxprodukter',
    isDefault: true,
    toneProfile: {
      formal: 0.8,
      friendly: 0.6,
      technical: 0.4,
      playful: 0.2,
      professional: 0.9,
    },
    createdAt: '2024-01-10',
  },
  {
    id: '2',
    name: 'Lekfullt & Ungdomligt',
    description: 'Energisk och modern ton för yngre målgrupp',
    isDefault: false,
    toneProfile: {
      formal: 0.2,
      friendly: 0.9,
      technical: 0.3,
      playful: 0.9,
      professional: 0.5,
    },
    createdAt: '2024-01-08',
  },
];

export default function BrandVoicePage() {
  const [brandVoices, setBrandVoices] = useState<BrandVoice[]>(mockBrandVoices);
  const [isCreating, setIsCreating] = useState(false);
  const [newVoiceName, setNewVoiceName] = useState('');
  const [newVoiceDescription, setNewVoiceDescription] = useState('');
  const [exampleTexts, setExampleTexts] = useState<string[]>(['', '', '']);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleCreateVoice = async () => {
    if (!newVoiceName.trim()) {
      toast.error('Ange ett namn för varumärkesrösten');
      return;
    }

    const filledTexts = exampleTexts.filter((t) => t.trim());
    if (filledTexts.length < 2) {
      toast.error('Lägg till minst 2 exempeltexter');
      return;
    }

    setIsAnalyzing(true);

    // Simulera AI-analys
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const newVoice: BrandVoice = {
      id: Date.now().toString(),
      name: newVoiceName,
      description: newVoiceDescription,
      isDefault: false,
      toneProfile: {
        formal: Math.random() * 0.5 + 0.3,
        friendly: Math.random() * 0.5 + 0.4,
        technical: Math.random() * 0.5 + 0.2,
        playful: Math.random() * 0.5 + 0.2,
        professional: Math.random() * 0.5 + 0.4,
      },
      createdAt: new Date().toISOString().split('T')[0],
    };

    setBrandVoices((prev) => [...prev, newVoice]);
    setIsCreating(false);
    setNewVoiceName('');
    setNewVoiceDescription('');
    setExampleTexts(['', '', '']);
    setIsAnalyzing(false);
    toast.success('Brand Voice skapad!');
  };

  const setAsDefault = (id: string) => {
    setBrandVoices((prev) =>
      prev.map((v) => ({ ...v, isDefault: v.id === id }))
    );
    toast.success('Brand Voice satt som standard');
  };

  const deleteVoice = (id: string) => {
    setBrandVoices((prev) => prev.filter((v) => v.id !== id));
    toast.success('Brand Voice borttagen');
  };

  const ToneBar = ({ label, value }: { label: string; value: number }) => (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-500 w-24">{label}</span>
      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full"
          style={{ width: `${value * 100}%` }}
        />
      </div>
      <span className="text-sm font-medium w-10">{Math.round(value * 100)}%</span>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-surface-light dark:bg-surface-dark">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">
                Brand Voice
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Träna AI att skriva i din unika ton och stil
              </p>
            </div>
            <button
              onClick={() => setIsCreating(true)}
              className="btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Skapa ny
            </button>
          </div>

          {/* Create New Brand Voice */}
          {isCreating && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card mb-8"
            >
              <h2 className="font-display text-xl font-bold mb-6">
                Skapa ny Brand Voice
              </h2>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Namn</label>
                    <input
                      type="text"
                      value={newVoiceName}
                      onChange={(e) => setNewVoiceName(e.target.value)}
                      placeholder="T.ex. Lyx & Premium"
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label">Beskrivning</label>
                    <input
                      type="text"
                      value={newVoiceDescription}
                      onChange={(e) => setNewVoiceDescription(e.target.value)}
                      placeholder="Kort beskrivning av tonen"
                      className="input"
                    />
                  </div>
                </div>

                <div>
                  <label className="label">
                    Exempeltexter (minst 2)
                    <span className="text-gray-400 font-normal ml-2">
                      Klistra in tidigare produkttexter du skrivit
                    </span>
                  </label>
                  <div className="space-y-3">
                    {exampleTexts.map((text, index) => (
                      <textarea
                        key={index}
                        value={text}
                        onChange={(e) => {
                          const newTexts = [...exampleTexts];
                          newTexts[index] = e.target.value;
                          setExampleTexts(newTexts);
                        }}
                        placeholder={`Exempeltext ${index + 1}...`}
                        className="input min-h-[100px]"
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => setExampleTexts((prev) => [...prev, ''])}
                    className="btn-secondary mt-3"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Lägg till fler
                  </button>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setIsCreating(false)}
                    className="btn-secondary"
                  >
                    Avbryt
                  </button>
                  <button
                    onClick={handleCreateVoice}
                    disabled={isAnalyzing}
                    className="btn-primary"
                  >
                    {isAnalyzing ? (
                      <>
                        <Sparkles className="w-4 h-4 mr-2 animate-spin" />
                        Analyserar...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Analysera och skapa
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Brand Voices List */}
          <div className="grid md:grid-cols-2 gap-6">
            {brandVoices.map((voice) => (
              <motion.div
                key={voice.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Mic className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {voice.name}
                      </h3>
                      <p className="text-sm text-gray-500">{voice.description}</p>
                    </div>
                  </div>
                  {voice.isDefault && (
                    <span className="badge-accent flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Standard
                    </span>
                  )}
                </div>

                <div className="space-y-2 mb-4">
                  <ToneBar label="Formell" value={voice.toneProfile.formal} />
                  <ToneBar label="Vänlig" value={voice.toneProfile.friendly} />
                  <ToneBar label="Teknisk" value={voice.toneProfile.technical} />
                  <ToneBar label="Lekfull" value={voice.toneProfile.playful} />
                  <ToneBar label="Professionell" value={voice.toneProfile.professional} />
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-100 dark:border-gray-700">
                  {!voice.isDefault && (
                    <button
                      onClick={() => setAsDefault(voice.id)}
                      className="btn-secondary flex-1"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Sätt som standard
                    </button>
                  )}
                  <button
                    onClick={() => deleteVoice(voice.id)}
                    className="btn-secondary text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {brandVoices.length === 0 && !isCreating && (
            <div className="card text-center py-16">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Inga Brand Voices ännu
              </h3>
              <p className="text-gray-500 mb-6">
                Skapa din första varumärkesröst för att börja
              </p>
              <button
                onClick={() => setIsCreating(true)}
                className="btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Skapa din första
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
