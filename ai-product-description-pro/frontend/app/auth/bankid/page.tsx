'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function BankIdAuthPage() {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [authStatus, setAuthStatus] = useState<'idle' | 'pending' | 'signing' | 'complete'>('idle');
  const [orderRef, setOrderRef] = useState<string | null>(null);

  const providers = [
    { id: 'BANKID_SE', name: 'BankID', country: 'Sverige', icon: '🇸🇪' },
    { id: 'MITID_DK', name: 'MitID', country: 'Danmark', icon: '🇩🇰' },
    { id: 'BANKID_NO', name: 'BankID', country: 'Norge', icon: '🇳🇴' },
    { id: 'FTNMT_FI', name: 'Mobiilivarmenne', country: 'Finland', icon: '🇫🇮' },
  ];

  const handleSelectProvider = (providerId: string) => {
    setSelectedProvider(providerId);
  };

  const handleInitiateAuth = async () => {
    if (!selectedProvider) return;

    setAuthStatus('pending');
    // Simulera API-anrop
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setOrderRef('simulated-order-ref');
    setAuthStatus('signing');

    // Simulera att användaren signerar
    await new Promise((resolve) => setTimeout(resolve, 5000));
    setAuthStatus('complete');
  };

  const getStatusMessage = () => {
    const provider = providers.find((p) => p.id === selectedProvider);
    switch (authStatus) {
      case 'pending':
        return 'Startar autentisering...';
      case 'signing':
        return `Öppna ${provider?.name}-appen och legitimera dig`;
      case 'complete':
        return 'Autentisering lyckades!';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Nordisk inloggning</h1>
          <p className="text-gray-600 mt-2">
            Logga in säkert med ditt lands e-legitimation
          </p>
        </div>

        {authStatus === 'idle' && (
          <>
            <div className="space-y-3 mb-6">
              {providers.map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => handleSelectProvider(provider.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    selectedProvider === provider.id
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-3xl">{provider.icon}</span>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">{provider.name}</p>
                    <p className="text-sm text-gray-500">{provider.country}</p>
                  </div>
                  {selectedProvider === provider.id && (
                    <span className="ml-auto text-primary">✓</span>
                  )}
                </button>
              ))}
            </div>

            <button
              onClick={handleInitiateAuth}
              disabled={!selectedProvider}
              className="w-full py-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Fortsätt
            </button>
          </>
        )}

        {authStatus !== 'idle' && authStatus !== 'complete' && (
          <div className="text-center py-8">
            <div className="mb-6">
              <div className="w-20 h-20 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-lg font-medium text-gray-900">{getStatusMessage()}</p>
            {authStatus === 'signing' && (
              <>
                <p className="text-sm text-gray-500 mt-2">
                  Vi väntar på att du ska godkänna i appen
                </p>
                <button
                  onClick={() => setAuthStatus('idle')}
                  className="mt-6 text-sm text-gray-500 hover:text-gray-700"
                >
                  Avbryt
                </button>
              </>
            )}
          </div>
        )}

        {authStatus === 'complete' && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-8"
          >
            <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">
              <span className="text-4xl">✓</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Välkommen!</h2>
            <p className="text-gray-600">
              Du har loggat in framgångsrikt med{' '}
              {providers.find((p) => p.id === selectedProvider)?.name}
            </p>
            <button className="mt-6 px-8 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors">
              Gå till dashboard →
            </button>
          </motion.div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            Säker autentisering med krypterad anslutning.
            <br />
            Dina uppgifter behandlas enligt GDPR.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
