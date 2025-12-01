'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Check,
  Zap,
  Star,
  Building,
  ArrowRight,
  Download,
} from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import toast from 'react-hot-toast';

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    price: 0,
    period: 'för alltid',
    credits: 10,
    description: 'Perfekt för att testa',
    features: [
      'AI-textgenerering',
      'SEO-poänganalys',
      'Bilduppladdning',
      'Export till CSV',
    ],
    icon: Star,
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 490,
    period: '/månad',
    credits: 500,
    description: 'För seriösa e-handlare',
    features: [
      'Allt i Starter',
      'Brand Voice Trainer',
      'Bulkgenerering',
      'Flerspråksstöd (5 språk)',
      'Trend-detektor',
      'Prioriterad support',
    ],
    icon: Zap,
    popular: true,
  },
  {
    id: 'agency',
    name: 'Agency',
    price: 2990,
    period: '/månad',
    credits: -1,
    description: 'För byråer och team',
    features: [
      'Allt i Pro',
      'Obegränsat API-access',
      'Teamkonton (10 användare)',
      'Shopify & WooCommerce',
      'Dedikerad support',
      'Anpassad onboarding',
    ],
    icon: Building,
    popular: false,
  },
];

const creditPackages = [
  { credits: 100, price: 99 },
  { credits: 250, price: 199 },
  { credits: 500, price: 349 },
  { credits: 1000, price: 599 },
];

const invoices = [
  { id: 'INV-001', date: '2024-01-01', amount: 490, status: 'paid' },
  { id: 'INV-002', date: '2023-12-01', amount: 490, status: 'paid' },
  { id: 'INV-003', date: '2023-11-01', amount: 490, status: 'paid' },
];

export default function BillingPage() {
  const [currentPlan] = useState('pro');
  const [creditsBalance] = useState(412);

  const handleUpgrade = (planId: string) => {
    toast.success(`Uppgradering till ${planId} påbörjad`);
  };

  const handleBuyCredits = (credits: number) => {
    toast.success(`Köper ${credits} krediter...`);
  };

  return (
    <div className="flex min-h-screen bg-surface-light dark:bg-surface-dark">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold text-gray-900 dark:text-white">
              Betalning & Prenumeration
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Hantera din plan och köp krediter
            </p>
          </div>

          {/* Current Plan Overview */}
          <div className="card mb-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Aktuell plan</p>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Pro-plan
                </h2>
                <p className="text-gray-500">490 kr/månad • Förnyas 1 februari</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Krediter kvar</p>
                <p className="text-3xl font-bold text-primary">{creditsBalance}</p>
                <p className="text-gray-500">av 500 denna månad</p>
              </div>
            </div>
            <div className="mt-4 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full"
                style={{ width: `${(creditsBalance / 500) * 100}%` }}
              />
            </div>
          </div>

          {/* Plans */}
          <div className="mb-12">
            <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-6">
              Byt plan
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {plans.map((plan) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`card relative ${
                    plan.popular ? 'border-2 border-primary ring-4 ring-primary/10' : ''
                  } ${currentPlan === plan.id ? 'bg-primary/5' : ''}`}
                >
                  {plan.popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 badge-accent px-4 py-1">
                      Populärast
                    </span>
                  )}
                  {currentPlan === plan.id && (
                    <span className="absolute top-4 right-4 badge-success">
                      Aktiv
                    </span>
                  )}
                  <div className="text-center mb-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <plan.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-display font-semibold text-xl">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-primary">
                        {plan.price}
                      </span>
                      <span className="text-gray-500">{plan.period}</span>
                    </div>
                    <p className="text-sm text-accent-600 font-medium mt-2">
                      {plan.credits === -1 ? 'Obegränsade' : plan.credits} krediter
                    </p>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={currentPlan === plan.id}
                    className={`w-full ${
                      currentPlan === plan.id
                        ? 'btn-secondary opacity-50 cursor-not-allowed'
                        : plan.popular
                        ? 'btn-primary'
                        : 'btn-outline'
                    }`}
                  >
                    {currentPlan === plan.id ? 'Aktiv plan' : 'Välj plan'}
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Buy Credits */}
          <div className="mb-12">
            <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-6">
              Köp extra krediter
            </h2>
            <div className="grid md:grid-cols-4 gap-4">
              {creditPackages.map((pkg) => (
                <button
                  key={pkg.credits}
                  onClick={() => handleBuyCredits(pkg.credits)}
                  className="card hover:shadow-lg transition-shadow text-left"
                >
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {pkg.credits}
                  </p>
                  <p className="text-sm text-gray-500">krediter</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-lg font-semibold text-primary">
                      {pkg.price} kr
                    </span>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Invoice History */}
          <div>
            <h2 className="font-display text-xl font-bold text-gray-900 dark:text-white mb-6">
              Fakturor
            </h2>
            <div className="card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-700">
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">
                      Fakturanummer
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">
                      Datum
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">
                      Belopp
                    </th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">
                      Status
                    </th>
                    <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">
                      Åtgärd
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr
                      key={invoice.id}
                      className="border-b border-gray-50 dark:border-gray-800"
                    >
                      <td className="py-4 px-6 font-medium">{invoice.id}</td>
                      <td className="py-4 px-6 text-gray-500">{invoice.date}</td>
                      <td className="py-4 px-6">{invoice.amount} kr</td>
                      <td className="py-4 px-6">
                        <span className="badge-success">Betald</span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button className="text-primary hover:underline text-sm flex items-center gap-1 ml-auto">
                          <Download className="w-4 h-4" />
                          Ladda ner
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
