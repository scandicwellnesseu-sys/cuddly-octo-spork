import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { Providers } from './providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({
  weight: ['500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'AI Product Description Generator PRO | SaaS för E-handel',
  description:
    'Generera SEO-optimerade produkttexter med AI. Perfekt för e-handlare, byråer och återförsäljare. Svensk/nordisk SaaS-plattform.',
  keywords: [
    'AI produkttexter',
    'SEO produktbeskrivning',
    'e-handel AI',
    'produkttext generator',
    'nordisk SaaS',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              className: 'text-sm',
              duration: 4000,
              style: {
                background: '#1E3A8A',
                color: '#fff',
                borderRadius: '10px',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
