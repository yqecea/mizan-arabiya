import type { Metadata } from 'next';
import { Montserrat, Playfair_Display, Amiri } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/Sidebar';
import { GuidedTour } from '@/components/GuidedTour';

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '700', '900'],
  variable: '--font-sans',
  display: 'swap',
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

const amiri = Amiri({
  weight: ['400', '700'],
  subsets: ['arabic'],
  variable: '--font-arabic',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Mizan Arabiya — Тренажёр арабского языка',
    template: '%s | Mizan Arabiya',
  },
  description: 'Интерактивная платформа для изучения арабского языка: словарь из 43+ глаголов, спряжения, притяжательные местоимения, квизы и домашние задания.',
  keywords: ['mizan arabiya', 'арабский язык', 'изучение арабского', 'глаголы арабского языка', 'спряжение арабских глаголов'],
  openGraph: {
    title: 'Mizan Arabiya — Тренажёр арабского языка',
    description: 'Изучай арабскую грамматику и лексику интерактивно',
    type: 'website',
    locale: 'ru_RU',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body
        className={`${montserrat.variable} ${playfairDisplay.variable} ${amiri.variable} antialiased`}
        style={{
          fontFamily: 'var(--font-sans)',
          fontWeight: 300,
          backgroundColor: 'var(--bg-primary)',
          color: 'var(--text-primary)',
        }}
        suppressHydrationWarning
      >
        <div className="flex flex-col lg:flex-row min-h-screen">
          <Sidebar />
          <main
            className="flex-1 overflow-x-hidden"
            style={{
              padding: '24px 32px 96px',
              paddingBottom: 'max(6rem, env(safe-area-inset-bottom, 6rem))',
            }}
          >
            {children}
          </main>
        </div>
        <GuidedTour />
      </body>
    </html>
  );
}
