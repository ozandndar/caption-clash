'use client';
import { useSession, signIn } from 'next-auth/react';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Screenshot from '@/components/Screenshot';
import CaptionInput from '@/components/CaptionInput';
import CaptionList from '@/components/CaptionList';
import SlideOver from '@/components/SlideOver';
import ReactionButtons from '@/components/ReactionButtons';
import WelcomeDialog from '@/components/WelcomeDialog';

export default function Home() {
  const { data: session } = useSession();
  const [currentScreenshotId, setCurrentScreenshotId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showCaptions, setShowCaptions] = useState(false);
  const t = useTranslations('home');

  const handleImageLoad = (screenshotId) => {
    setCurrentScreenshotId(screenshotId);
  };

  const handleCaptionAdded = () => {
    setRefreshKey(prev => prev + 1);
    setShowCaptions(true);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <WelcomeDialog />
      <h1 className="text-3xl font-bold text-center mb-8">
        {t('title')}
      </h1>

      <div className="max-w-3xl mx-auto">
        <Screenshot onImageLoad={handleImageLoad} />

        {currentScreenshotId && (
          <div className="mt-6 space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-base font-medium text-gray-300 mb-4">
                {t('captionSection.title')}
              </h3>
              <ReactionButtons screenshotId={currentScreenshotId} />
            </div>

            {!session && (
              <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4 mb-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="text-sm text-gray-300">
                    <p className="font-medium text-blue-400">{t('signInPrompt.title')}</p>
                    <p>{t('signInPrompt.description')}</p>
                    <button
                      onClick={() => signIn()}
                      className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
                    >
                      {t('signInPrompt.button')}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {session && (
              <>
                <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4 mb-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="text-sm text-gray-300">
                      <p className="font-medium text-blue-400">{t('captionSection.addYours')}</p>
                      <p>{t('captionSection.noCaptions')}</p>
                    </div>
                  </div>
                </div>
                <CaptionInput
                  screenshotId={currentScreenshotId}
                  onCaptionAdded={handleCaptionAdded}
                />
              </>
            )}
          </div>
        )}
      </div>

      <SlideOver
        open={showCaptions}
        setOpen={setShowCaptions}
        title={t('captionSection.title')}
      >
        <CaptionList
          screenshotId={currentScreenshotId}
          refreshTrigger={refreshKey}
        />
      </SlideOver>
    </main>
  );
}
