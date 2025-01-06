'use client';
import { useSession, signIn } from 'next-auth/react';
import { useState } from 'react';
import Screenshot from '@/components/Screenshot';
import CaptionInput from '@/components/CaptionInput';
import CaptionList from '@/components/CaptionList';
import SlideOver from '@/components/SlideOver';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';

export default function Home() {
  const { data: session } = useSession();
  const [currentScreenshotId, setCurrentScreenshotId] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showCaptions, setShowCaptions] = useState(false);

  const handleImageLoad = (screenshotId) => {
    setCurrentScreenshotId(screenshotId);
  };

  const handleCaptionAdded = () => {
    setRefreshKey(prev => prev + 1);
    setShowCaptions(true);
  };

  if (!session) {
    return (
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <h1 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            Welcome to Caption Clash
          </h1>

          <div className="space-y-6 text-gray-300">
            <p className="text-xl">
              Join the ultimate screenshot captioning competition! We collect random screenshots from Lightshot users and turn them into a hilarious caption contest.
            </p>

            <div className="bg-gray-800 p-6 rounded-lg">
              <p className="mb-4">
                🎯 <span className="text-white">How it works:</span>
              </p>
              <ul className="space-y-3 text-left list-none">
                <li className="flex items-start">
                  <span className="mr-2">👀</span>
                  <span>Discover random screenshots from around the web</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">💭</span>
                  <span>Add your witty, funny, or clever captions</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">👍</span>
                  <span>Vote for the most hilarious captions</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">🏆</span>
                  <span>Compete for the top spot on our leaderboard</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-800/50 p-6 rounded-lg text-left">
              <h2 className="text-2xl font-bold mb-4 text-white text-center">About the Screenshots</h2>
              <p className="mb-4">
                Lightshot is one of the most popular screenshot tools in the world, with over 5 billion screenshots taken by users globally. These screenshots capture moments from everyday internet browsing, gaming sessions, funny conversations, and more.
              </p>
              <p>
                In Caption Clash, we randomly access these public screenshots, giving you a unique window into what people around the world are capturing on their screens. Each screenshot is a mystery waiting for your witty interpretation!
              </p>
            </div>

            <p className="text-lg">
              The most liked captions are usually the most hilarious ones. Join our community and show off your humor!
            </p>
          </div>

          <button
            onClick={() => signIn()}
            className="mt-8 px-8 py-4 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transform hover:scale-105 transition-all duration-200"
          >
            Sign in to Start Captioning
          </button>
        </div>
        <PWAInstallPrompt />
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Random Lightshot Screenshots
      </h1>

      <div className="max-w-3xl mx-auto">
        <Screenshot onImageLoad={handleImageLoad} />

        {currentScreenshotId && (
          <div className="mt-6">
            <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4 mb-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-sm text-gray-300">
                  <p className="font-medium text-blue-400">Add your caption first!</p>
                  <p>You'll be able to see other users' captions after submitting your own. This keeps the contest fun and ensures original ideas!</p>
                </div>
              </div>
            </div>
            <CaptionInput
              screenshotId={currentScreenshotId}
              onCaptionAdded={handleCaptionAdded}
            />
          </div>
        )}
      </div>

      <SlideOver
        open={showCaptions}
        setOpen={setShowCaptions}
        title="Captions"
      >
        <CaptionList
          screenshotId={currentScreenshotId}
          refreshTrigger={refreshKey}
        />
      </SlideOver>
    </main>
  );
}
