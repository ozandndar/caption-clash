import { generateLightshotUrl, extractImageUrl } from '@/utils/lightshotExtractor';
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    let imageUrl = null;
    let lightshotUrl = null;
    let attempts = 0;
    const maxAttempts = 20; // Increased attempts for better chance of finding valid image

    console.log('\n🎲 Starting new random image search...');

    // Try to get a new image from Lightshot
    while (!imageUrl && attempts < maxAttempts) {
      attempts++;
      console.log(`\n📍 Attempt ${attempts}/${maxAttempts}`);
      
      lightshotUrl = generateLightshotUrl();
      imageUrl = await extractImageUrl(lightshotUrl);
      
      if (imageUrl) {
        // Verify the image is accessible via proxy
        try {
          const proxyResponse = await fetch(imageUrl, {
            method: 'HEAD',
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            },
          });

          if (!proxyResponse.ok) {
            console.log('❌ Image verification failed, trying next...');
            imageUrl = null;
            continue;
          }

          console.log('✨ Valid image found and verified!');
        } catch (error) {
          console.log('❌ Image verification failed:', error.message);
          imageUrl = null;
          continue;
        }
      } else {
        console.log('↪️ Trying next URL...');
      }
    }

    // If we found a valid image, save it to database
    if (imageUrl) {
      console.log('💾 Saving to database...');
      const screenshot = await prisma.screenshot.create({
        data: {
          url: imageUrl,
          lightshotUrl,
          isVerified: true,
          status: 'VERIFIED',
          lastShownAt: new Date(),
          viewCount: 1,
        },
      });

      return new Response(JSON.stringify({
        imageUrl: screenshot.url,
        success: true,
        isFromDb: false,
        screenshotId: screenshot.id
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    console.log('📚 No new valid image found, fetching from database...');
    
    // If no valid image found after max attempts, get one from database
    const randomScreenshot = await prisma.screenshot.findFirst({
      where: {
        isVerified: true,
        status: 'VERIFIED',
      },
      orderBy: {
        lastShownAt: 'asc', // Get least recently shown image
      },
    });

    if (!randomScreenshot) {
      console.log('❌ No screenshots available in database');
      return Response.json({
        error: 'No screenshots available',
        success: false
      }, { status: 404 });
    }

    console.log('✅ Found image from database:', randomScreenshot.id);

    // Update the view count and last shown time
    await prisma.screenshot.update({
      where: {
        id: randomScreenshot.id
      },
      data: {
        viewCount: {
          increment: 1
        },
        lastShownAt: new Date()
      }
    });

    return new Response(JSON.stringify({
      imageUrl: randomScreenshot.url,
      success: true,
      isFromDb: true,
      screenshotId: randomScreenshot.id
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('🚨 Error:', error);
    return Response.json({ 
      error: error.message, 
      success: false 
    }, { status: 500 });
  }
} 