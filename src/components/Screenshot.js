"use client"
import { useState, useEffect } from 'react';
import Loading from '@/app/loading';
import { useTranslations } from 'next-intl';

export default function Screenshot({ onImageLoad }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFromDb, setIsFromDb] = useState(false);
  const t = useTranslations('');

  const fetchRandomImage = async (signal) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/lightshot/random', { signal });
      const data = await response.json();
      
      if (data.success && data.imageUrl) {
        console.log('Attempting to load image:', data.imageUrl);
        setImageUrl(data.imageUrl);
        setIsFromDb(data.isFromDb);
        onImageLoad?.(data.screenshotId);
      } else {
        setError('Could not load image. Try again!');
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Fetch aborted');
        return;
      }
      setError('Error loading image');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    fetchRandomImage(abortController.signal);

    return () => {
      abortController.abort();
    };
  }, []);

  const handleGetAnotherClick = () => {
    const abortController = new AbortController();
    fetchRandomImage(abortController.signal);
  };

  const getProxiedImageUrl = (originalUrl) => {
    const encodedUrl = encodeURIComponent(originalUrl);
    return `/api/proxy?url=${encodedUrl}`;
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {!loading && (
        <button
          onClick={handleGetAnotherClick}
          className="px-20 py-5 bg-gray-700 text-white rounded hover:bg-gray-700 transition-colors border border-gray-700"
        >
          {t('home.getAnother')}
        </button>
      )}
      
      {loading ? (
        <Loading />
      ) : (
        <>
          {error && <div className="text-red-500">{t('error')}</div>}
          {imageUrl && (
            <>
              <div className="relative w-full max-w-2xl">
                <img
                  src={getProxiedImageUrl(imageUrl)}
                  alt={t('common.screenshot.alt')}
                  className="w-full h-auto rounded-lg shadow-lg"
                  onError={(e) => {
                    console.error('Image load error:', e);
                    setError(`Failed to load image: ${imageUrl}`);
                  }}
                />
              </div>
              <div className="text-sm text-gray-500">
                {isFromDb ? t('home.imageSource.fromDb') : t('home.imageSource.new')}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
} 