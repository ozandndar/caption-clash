'use client';
import { useTranslations } from 'next-intl';

export default function Loading() {
  const t = useTranslations('loading');
  
  return (
    <main className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Caption Clash</h1>
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-gray-100 rounded-lg">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="text-gray-600">{t('findingScreenshot')}</p>
          <p className="text-sm text-gray-500">{t('takingTime')}</p>
        </div>
      </div>
    </main>
  );
} 