"use client"
import { useState, useEffect } from 'react';
import { Screenshot } from './Screenshot';

export function ScreenshotLoader() {
  const [screenshot, setScreenshot] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchScreenshot = async () => {
      try {
        const response = await fetch('/api/screenshot');
        if (!response.ok) throw new Error('Failed to fetch screenshot');
        const data = await response.json();
        setScreenshot(data);
      } catch (error) {
        console.error('Error fetching screenshot:', error);
        // Set fallback screenshot
        setScreenshot({
          id: 'fallback',
          url: 'https://via.placeholder.com/800x600',
          lightshotUrl: null
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchScreenshot();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-gray-100 rounded-lg">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="text-gray-600">Finding a random screenshot...</p>
          <p className="text-sm text-gray-500">This might take a few seconds</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-4">
        {screenshot?.lightshotUrl ? (
          <p className="text-sm text-gray-500">
            Source: <a href={screenshot.lightshotUrl} target="_blank" rel="noopener noreferrer" 
              className="underline hover:text-gray-700">
              {screenshot.lightshotUrl}
            </a>
          </p>
        ) : (
          <p className="text-sm text-red-500">
            Could not find a valid image. Showing fallback.
          </p>
        )}
      </div>
      <Screenshot url={screenshot?.url} id={screenshot?.id} />
    </>
  );
} 