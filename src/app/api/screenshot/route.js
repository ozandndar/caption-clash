import { lightshotImageExtractor, generateLightshotUrl } from '@/utils/lightshotExtractor';
import { NextResponse } from 'next/server';

export async function GET() {
  async function getValidScreenshot(maxAttempts = 10) {
    const attemptedUrls = new Set();

    for (let i = 0; i < maxAttempts; i++) {
      let lightshotUrl;
      
      do {
        lightshotUrl = generateLightshotUrl();
      } while (attemptedUrls.has(lightshotUrl));
      
      attemptedUrls.add(lightshotUrl);
      console.log(`Attempt ${i + 1}/${maxAttempts}: Trying ${lightshotUrl}`);
      
      const imageUrl = await lightshotImageExtractor(lightshotUrl);
      if (imageUrl) {
        console.log(`Success! Found valid image at ${imageUrl}`);
        return {
          id: lightshotUrl.split('/').pop(),
          url: imageUrl,
          lightshotUrl
        };
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    return {
      id: 'fallback',
      url: 'https://via.placeholder.com/800x600',
      lightshotUrl: null
    };
  }

  try {
    const screenshot = await getValidScreenshot();
    return NextResponse.json(screenshot);
  } catch (error) {
    console.error('Error generating screenshot:', error);
    return NextResponse.json(
      { error: 'Failed to generate screenshot' },
      { status: 500 }
    );
  }
} 