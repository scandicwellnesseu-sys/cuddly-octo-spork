'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '@/components/layout/Sidebar';

export default function WebhooksPage() {
  const [webhooks] = useState([
    {
      id: '1',
      name: 'Produktnotis till Slack',
      url: 'https://hooks.slack.com/services/xxx',
      events: ['generation.completed'],
      isActive: true,
      lastTriggeredAt: '2024-01-20 14:32',
    },
    {
      id: '2',
      name: 'Zapier Integration',
      url: 'https://hooks.zapier.com/xxx',
      events: ['generation.completed', 'ab_test.completed'],
      isActive: true,
      lastTriggeredAt: '2024-01-19 09:15',
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);

  const availableEvents = [
    { event: 'generation.completed', description: 'Produkttext genererad' },
    { event: 'generation.failed', description: 'Generering misslyckades' },
    { event: 'ab_test.completed', description: 'A/B-test avslutat' },
    { event: 'publish.completed', description: 'Publicering klar' },
    { event: 'credits.low', description: 'Låg kreditbalans' },
  ];

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
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Webhooks</h1>
              <p className="text-gray-600 mt-1">
                Anslut dina arbetsflöden med Zapier, Slack, och andra tjänster
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              + Skapa webhook
            </button>
          </div>

          {/* Webhooks List */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-200">
              {webhooks.map((webhook) => (
                <div key={webhook.id} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-gray-900">{webhook.name}</h3>
                        <span
                          className={`px-2 py-0.5 text-xs rounded-full ${
                            webhook.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {webhook.isActive ? 'Aktiv' : 'Inaktiv'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{webhook.url}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                        ⚙️
                      </button>
                      <button className="p-2 text-gray-500 hover:text-red-600 transition-colors">
                        🗑️
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {webhook.events.map((event) => (
                      <span
                        key={event}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-lg"
                      >
                        {event}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-500">
                    Senast triggad: {webhook.lastTriggeredAt}
                  </p>
                  <button className="mt-3 text-sm text-primary hover:underline">
                    Testa webhook →
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Available Events */}
          <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Tillgängliga events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableEvents.map((event) => (
                <div
                  key={event.event}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <code className="text-sm text-primary">{event.event}</code>
                    <p className="text-sm text-gray-600">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Integration Tips */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: '⚡',
                title: 'Zapier',
                description: 'Anslut till 5000+ appar',
              },
              {
                icon: '💬',
                title: 'Slack',
                description: 'Få notiser i kanaler',
              },
              {
                icon: '📧',
                title: 'E-post',
                description: 'Skicka automatiska mail',
              },
            ].map((tip) => (
              <div
                key={tip.title}
                className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-6 text-center"
              >
                <span className="text-3xl">{tip.icon}</span>
                <h3 className="font-semibold mt-2">{tip.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{tip.description}</p>
              </div>
            ))}
          </div>

          {/* Create Modal */}
          {showCreateModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl p-8 max-w-lg w-full mx-4"
              >
                <h2 className="text-2xl font-bold mb-6">Skapa ny webhook</h2>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Namn
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="T.ex. Slack-notis"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL
                    </label>
                    <input
                      type="url"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Events
                    </label>
                    <div className="space-y-2">
                      {availableEvents.map((event) => (
                        <label key={event.event} className="flex items-center gap-2">
                          <input type="checkbox" className="rounded text-primary" />
                          <span className="text-sm">{event.description}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowCreateModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Avbryt
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Skapa
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
