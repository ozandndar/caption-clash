import { prisma } from "@/lib/prisma"
import { generateLightshotUrl, extractImageUrl, verifyImageUrl } from "@/utils/lightshotExtractor"

const BATCH_SIZE = 1
const TOTAL_ATTEMPTS = 30000       // 20 attempts per run
const DELAY_BETWEEN_BATCHES = 1000  // 5 seconds between batches

async function processSingleScreenshot() {
  try {
    const lightshotUrl = generateLightshotUrl();
    console.log(`Processing: ${lightshotUrl}`);
    
    const imageUrl = await extractImageUrl(lightshotUrl);
    if (!imageUrl) {
      console.log('❌ No valid image URL found');
      return null;
    }

    // Verify the image URL before saving
    const isValid = await verifyImageUrl(imageUrl);
    if (!isValid) {
      console.log('❌ Image verification failed');
      return null;
    }

    const screenshot = await prisma.screenshot.create({
      data: {
        url: imageUrl,
        lightshotUrl,
        isVerified: true,
        status: 'VERIFIED',
        lastShownAt: new Date(),
        viewCount: 0,
      },
    });

    console.log(`✅ Saved screenshot: ${screenshot.id}`);
    return screenshot;
  } catch (error) {
    console.error('Error processing screenshot:', error);
    return null;
  }
}

export async function GET(request) {
  // Verify the request is coming from Vercel Cron
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.log('❌ Unauthorized cron job attempt');
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const startTime = new Date();
  console.log(`🕒 Cron job started at: ${startTime.toISOString()}`);

  try {
    // Add timeout safety
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Job timeout')), 240000); // 4 minutes safety limit
    });

    const jobPromise = async () => {
      console.log(`Starting screenshot population (${TOTAL_ATTEMPTS} attempts)...`);
      let successCount = 0;
      let failureCount = 0;

      for (let i = 0; i < TOTAL_ATTEMPTS; i += BATCH_SIZE) {
        console.log(`\nProcessing batch ${Math.floor(i/BATCH_SIZE) + 1}...`);
        
        const batch = Array(Math.min(BATCH_SIZE, TOTAL_ATTEMPTS - i))
          .fill(null)
          .map(() => processSingleScreenshot());

        const results = await Promise.all(batch);
        
        const batchSuccesses = results.filter(Boolean).length;
        successCount += batchSuccesses;
        failureCount += BATCH_SIZE - batchSuccesses;

        console.log(`Batch complete: ${batchSuccesses}/${BATCH_SIZE} successful`);
        console.log(`Total progress: ${successCount} saved, ${failureCount} failed`);
        
        if (i + BATCH_SIZE < TOTAL_ATTEMPTS) {
          console.log(`Waiting ${DELAY_BETWEEN_BATCHES/1000} seconds before next batch...`);
          await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
        }
      }

      const endTime = new Date();
      const duration = (endTime - startTime) / 1000; // in seconds

      return {
        success: true,
        stats: {
          successful: successCount,
          failed: failureCount,
          successRate: `${((successCount/TOTAL_ATTEMPTS) * 100).toFixed(1)}%`,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          duration: `${duration.toFixed(1)} seconds`
        }
      };
    };

    // Race between job and timeout
    const result = await Promise.race([jobPromise(), timeoutPromise]);

    return result;
  } catch (error) {
    if (error.message === 'Job timeout') {
      console.error('❌ Job timed out - exceeded 4 minute limit');
    }
    return Response.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
} 