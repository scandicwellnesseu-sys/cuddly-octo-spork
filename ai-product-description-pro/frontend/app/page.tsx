'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Zap,
  Globe,
  TrendingUp,
  Shield,
  CreditCard,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'AI-Driven Textgenerering',
    description: 'GPT-4o och Claude 3.5 analyserar bilder och skapar SEO-optimerade texter automatiskt.',
  },
  {
    icon: Zap,
    title: 'Snabb Bulkgenerering',
    description: 'Generera hundratals produkttexter på minuter med vår kraftfulla bulk-motor.',
  },
  {
    icon: Globe,
    title: 'Flerspråkig Support',
    description: 'Svenska, engelska, norska, finska och tyska med lokaliserad SEO.',
  },
  {
    icon: TrendingUp,
    title: 'Trend-detektor',
    description: 'Analyserar TikTok, Instagram och Google Trends för att hitta populära nyckelord.',
  },
  {
    icon: Shield,
    title: 'Brand Voice',
    description: 'Lär AI din unika ton och stil genom att analysera dina tidigare texter.',
  },
  {
    icon: CreditCard,
    title: 'Shopify & WooCommerce',
    description: 'Direktintegration för att synka produkter och texter till din webshop.',
  },
];

const pricing = [
  {
    name: 'Starter',
    price: '0',
    period: 'för alltid',
    description: 'Perfekt för att testa',
    credits: '10 gratis krediter',
    features: [
      'AI-textgenerering',
      'SEO-poänganalys',
      'Bilduppladdning',
      'Export till CSV',
    ],
    cta: 'Kom igång gratis',
    popular: false,
  },
  {
    name: 'Pro',
    price: '490',
    period: '/månad',
    description: 'För seriösa e-handlare',
    credits: '500 krediter/månad',
    features: [
      'Allt i Starter',
      'Brand Voice Trainer',
      'Bulkgenerering',
      'Flerspråksstöd',
      'Trend-detektor',
      'Prioriterad support',
    ],
    cta: 'Starta Pro',
    popular: true,
  },
  {
    name: 'Agency',
    price: '2 990',
    period: '/månad',
    description: 'För byråer och team',
    credits: 'Obegränsade krediter',
    features: [
      'Allt i Pro',
      'Obegränsat API-access',
      'Teamkonton',
      'Shopify & WooCommerce',
      'Dedikerad support',
      'Anpassad onboarding',
    ],
    cta: 'Kontakta oss',
    popular: false,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-surface-light to-white dark:from-surface-dark dark:to-gray-900">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-xl text-primary">
                AI Product Pro
              </span>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-gray-600 hover:text-primary transition">
                Funktioner
              </a>
              <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-primary transition">
                Priser
              </a>
              <Link href="/dashboard" className="btn-secondary">
                Logga in
              </Link>
              <Link href="/dashboard" className="btn-primary">
                Kom igång
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="badge-accent text-sm mb-6 inline-block">
              🚀 Nordens mest avancerade AI-textgenerator
            </span>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Generera{' '}
              <span className="text-primary">SEO-optimerade</span>
              <br />
              produkttexter med AI
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10">
              Ladda upp en produktbild, välj nyckelord och få professionella texter på sekunder.
              Perfekt för e-handlare, byråer och återförsäljare.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard" className="btn-primary text-lg px-8 py-3">
                Starta gratis <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <a href="#features" className="btn-outline text-lg px-8 py-3">
                Se hur det fungerar
              </a>
            </div>
          </motion.div>

          {/* Demo Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16 relative"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 md:p-8 max-w-5xl mx-auto border border-gray-100 dark:border-gray-700">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Input */}
                <div className="space-y-4">
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <Sparkles className="w-12 h-12 text-primary mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Ladda upp produktbild</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-10 bg-gray-100 dark:bg-gray-700 rounded-lg"></div>
                    <div className="flex gap-2">
                      <div className="h-8 bg-primary/10 rounded-full px-3 flex items-center text-xs text-primary">
                        ekologisk
                      </div>
                      <div className="h-8 bg-primary/10 rounded-full px-3 flex items-center text-xs text-primary">
                        bomull
                      </div>
                      <div className="h-8 bg-primary/10 rounded-full px-3 flex items-center text-xs text-primary">
                        minimalistisk
                      </div>
                    </div>
                  </div>
                </div>
                {/* Output */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="badge-success">SEO-poäng: 94</span>
                    <span className="badge-primary">Läsbarhet: A</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Ekologisk T-shirt i Premium Bomull</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                      Upptäck vår mjuka ekologiska bomullströja i nordisk minimalism. 
                      Tillverkad av 100% GOTS-certifierad bomull med fokus på hållbarhet 
                      och tidlös skandinavisk design...
                    </p>
                  </div>
                  <div className="flex gap-2 text-xs">
                    <span className="bg-accent/20 text-accent-600 px-2 py-1 rounded">
                      meta_title ✓
                    </span>
                    <span className="bg-accent/20 text-accent-600 px-2 py-1 rounded">
                      meta_desc ✓
                    </span>
                    <span className="bg-accent/20 text-accent-600 px-2 py-1 rounded">
                      alt_text ✓
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Kraftfulla funktioner för e-handel
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Allt du behöver för att skapa professionella produkttexter som konverterar.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-gradient-to-b from-primary-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Enkla och transparenta priser
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Välj den plan som passar din verksamhet bäst.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricing.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`card relative ${
                  plan.popular
                    ? 'border-2 border-primary ring-4 ring-primary/10 scale-105'
                    : ''
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 badge-accent px-4 py-1">
                    Populärast
                  </span>
                )}
                <div className="text-center mb-6">
                  <h3 className="font-display font-semibold text-xl text-gray-900 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                    {plan.description}
                  </p>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-primary">{plan.price}</span>
                    <span className="text-gray-500">{plan.period}</span>
                  </div>
                  <p className="text-sm text-accent-600 font-medium mt-2">
                    {plan.credits}
                  </p>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/dashboard"
                  className={`w-full ${plan.popular ? 'btn-primary' : 'btn-outline'}`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="premium-gradient rounded-3xl p-12 text-white">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Redo att revolutionera dina produkttexter?
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Starta gratis idag och se hur AI kan förbättra din e-handel.
              Ingen kreditkort krävs.
            </p>
            <Link href="/dashboard" className="btn bg-accent text-gray-900 hover:bg-accent-400 text-lg px-8 py-3">
              Kom igång gratis <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-display font-bold text-lg text-primary">
                AI Product Pro
              </span>
            </div>
            <p className="text-sm text-gray-500">
              © 2024 AI Product Description Generator PRO. Skapad i Sverige 🇸🇪
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
