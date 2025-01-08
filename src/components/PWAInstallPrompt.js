'use client';
import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';

const PROMPT_INTERVAL = 4 * 60 * 60 * 1000; // 4 hours in milliseconds

export default function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const t = useTranslations();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if desktop
    const isDesktopDevice = !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    setIsDesktop(isDesktopDevice);

    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(isIOSDevice);

    // Check if we should show the prompt based on time
    const canShowPrompt = () => {
      const lastPromptTime = localStorage.getItem('lastPWAPromptTime');
      if (!lastPromptTime) return true;

      const timeSinceLastPrompt = Date.now() - parseInt(lastPromptTime);
      return timeSinceLastPrompt > PROMPT_INTERVAL;
    };

    // Check if the app is already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches 
      || window.navigator.standalone;

    if (isStandalone || !canShowPrompt()) {
      return;
    }

    // Define the event handler function
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
      localStorage.setItem('lastPWAPromptTime', Date.now().toString());
    };

    // Show iOS instructions immediately, handle beforeinstallprompt for others
    if (isIOSDevice) {
      setShowPrompt(true);
      localStorage.setItem('lastPWAPromptTime', Date.now().toString());
    } else {
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }

    window.addEventListener('appinstalled', () => {
      setShowPrompt(false);
      setDeferredPrompt(null);
      localStorage.removeItem('lastPWAPromptTime');
    });

    return () => {
      if (!isIOSDevice) {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      }
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) return;
    if (!deferredPrompt) return;

    try {
      const result = await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('PWA: User accepted the install prompt');
        // Clear the timestamp when app is installed
        localStorage.removeItem('lastPWAPromptTime');
      } else {
        // Update timestamp even when user dismisses
        localStorage.setItem('lastPWAPromptTime', Date.now().toString());
      }
    } catch (error) {
      console.error('PWA: Error during installation:', error);
    } finally {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Update timestamp when user dismisses
    localStorage.setItem('lastPWAPromptTime', Date.now().toString());
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-700 z-50">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <img
              src="/icons/icon-192x192.png"
              alt={t('common.appName')}
              className="w-12 h-12 rounded-lg"
            />
          </div>
          <div>
            <h3 className="text-white font-medium">{t('pwaInstall.title')}</h3>
            {isIOS ? (
              <p className="text-sm text-gray-300 mt-1">
                {t('pwaInstall.description.ios')}
              </p>
            ) : isDesktop ? (
              <p className="text-sm text-gray-300 mt-1">
                {t('pwaInstall.description.desktop')}
              </p>
            ) : (
              <p className="text-sm text-gray-300 mt-1">
                {t('pwaInstall.description.android')}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-gray-400 hover:text-gray-300"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      {!isIOS && !isDesktop && (
        <div className="mt-4 flex space-x-3">
          <button
            onClick={handleInstallClick}
            className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {t('pwaInstall.install')}
          </button>
          <button
            onClick={handleDismiss}
            className="flex-1 bg-gray-700 text-gray-300 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-600"
          >
            {t('pwaInstall.later')}
          </button>
        </div>
      )}
    </div>
  );
} 