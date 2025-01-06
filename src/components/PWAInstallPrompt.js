'use client';
import { useState, useEffect } from 'react';

export default function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    // Check if the app is already installed
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
    
    if (!isInstalled) {
      // Listen for the beforeinstallprompt event
      window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later
        setDeferredPrompt(e);
        // Show our custom prompt
        setShowPrompt(true);
      });
    }
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();
    
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    // Clear the deferredPrompt for the next time
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-700 z-50">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <img
              src="/icons/icon-192x192.png"
              alt="Caption Clash"
              className="w-12 h-12 rounded-lg"
            />
          </div>
          <div>
            <h3 className="text-white font-medium">Install Caption Clash</h3>
            <p className="text-sm text-gray-300 mt-1">
              Install our app for a better experience and quick access!
            </p>
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
      <div className="mt-4 flex space-x-3">
        <button
          onClick={handleInstallClick}
          className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Install App
        </button>
        <button
          onClick={handleDismiss}
          className="flex-1 bg-gray-700 text-gray-300 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-600"
        >
          Maybe Later
        </button>
      </div>
    </div>
  );
} 