'use client';
import { useState, useEffect } from 'react';

export default function WelcomeDialog() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user has seen the dialog before
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem('hasSeenWelcome', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Dialog */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-gray-800 rounded-xl max-w-lg w-full p-6 shadow-2xl">
          <div className="absolute top-4 right-4">
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <h2 className="text-2xl font-bold text-white mb-4">
            🎲 Ready for Screenshot Roulette?
          </h2>

          <div className="space-y-4 text-gray-300">
            <div className="bg-gray-700/50 rounded-lg p-4 space-y-3">
              <p>
                <span className="text-lg">🎯 Every click reveals a random screenshot from someone's computer somewhere in the world.</span>
              </p>
            </div>

            <p>
              <span className="text-yellow-400 text-lg">What will you discover?</span>
              <br />
              <span className="text-sm opacity-75">Private messages? Secret documents? Funny conversations? Only one way to find out!</span>
            </p>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleClose}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transform hover:scale-105 transition-all duration-200 text-lg"
            >
              Start the Hunt! 🎯
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 