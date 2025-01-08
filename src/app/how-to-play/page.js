"use client"
import { useTranslations } from 'next-intl';

export default function HowToPlay() {
  const t = useTranslations('howToPlay');

  return (
    <main className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto space-y-12">
        <h1 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          {t('title')}
        </h1>
        
        <div className="space-y-6 text-gray-300">
          <p className="text-xl text-center mb-8">
            {t('description')}
          </p>
          
          {/* Core Gameplay */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-blue-400 mb-4">🎲 {t('game.title')}</h2>
            <div className="space-y-4">
              <p>{t('game.description')}</p>
            </div>
          </div>

          {/* Scoring System */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-blue-400 mb-4">🏆 {t('scoring.title')}</h2>
            <div className="space-y-4">
              <p>{t('scoring.description')}</p>
              <ul className="list-none space-y-3">
                <li className="flex items-center gap-3">
                  <span className="text-green-400 font-bold">+1</span>
                  <span>{t('scoring.points.view')}</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-400 font-bold">+3</span>
                  <span>{t('scoring.points.react')}</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-400 font-bold">+10</span>
                  <span>{t('scoring.points.caption')}</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-400 font-bold">+30</span>
                  <span>{t('scoring.points.like')}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-blue-400 mb-4">💡 {t('tips.title')}</h2>
            <ul className="list-disc list-inside space-y-3">
              {[1, 2, 3, 4].map((num) => (
                <li key={num}>{t(`tips.tip${num}`)}</li>
              ))}
            </ul>
          </div>

          <div className="text-center">
            <p className="text-lg">{t('callToAction')}</p>
          </div>
        </div>
      </div>
    </main>
  );
} 