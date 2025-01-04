'use client';
import { useSession, signIn } from 'next-auth/react';
import { useState } from 'react';
import Screenshot from '@/components/Screenshot';
import CaptionInput from '@/components/CaptionInput';
import CaptionList from '@/components/CaptionList';
import SlideOver from '@/components/SlideOver';

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
      <main className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-8">
          Welcome to Caption Contest
        </h1>
        <div className="max-w-2xl mx-auto bg-gray-800 rounded-lg p-8">
          <p className="text-xl text-gray-300 mb-6">
            Sign in to start captioning random screenshots and compete with others!
          </p>
          <button
            onClick={() => signIn()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Sign in to Get Started
          </button>
        </div>
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
