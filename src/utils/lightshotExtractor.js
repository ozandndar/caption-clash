import { load } from 'cheerio';

function generateRandomString(length = 6) {
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export function generateLightshotUrl() {
  return `https://prnt.sc/${generateRandomString()}`;
}

async function verifyImageUrl(url) {
  try {
    console.log(`🔍 Verifying image URL: ${url}`);
    const response = await fetch(url, {
      method: 'HEAD', // Only fetch headers, not the full image
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
      redirect: 'manual' // Don't follow redirects, give us the redirect response instead
    });

    // If we get a redirect status code (3xx), skip the image
    if (response.status >= 300 && response.status < 400) {
      console.log(`❌ Image has redirect (${response.status}), skipping`);
      return false;
    }

    if (!response.ok) {
      console.log(`❌ Image verification failed: ${response.status} ${response.statusText}`);
      return false;
    }

    const contentType = response.headers.get('content-type');
    if (!contentType?.startsWith('image/')) {
      console.log(`❌ Invalid content type: ${contentType}`);
      return false;
    }

    console.log('✅ Image verified successfully');
    return true;
  } catch (error) {
    console.log(`❌ Image verification error: ${error.message}`);
    return false;
  }
}

export async function extractImageUrl(url) {
  try {
    console.log(`\n🔍 Attempting to fetch: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      },
    });
    
    console.log(`📥 Response status: ${response.status}`);
    
    const html = await response.text();
    console.log(`📄 HTML length: ${html.length} characters`);
    
    // Use cheerio to parse HTML
    const $ = load(html);
    
    // Find the screenshot image using the class selector
    const imgElement = $('img[class*="screenshot-image"]:not([attempt])');
    console.log(`🖼️ Found image elements: ${imgElement.length}`);
    
    if (imgElement.length > 0) {
      const imageUrl = imgElement.attr('src');
      console.log(`📸 Raw image URL: ${imageUrl}`);
      
      if (imageUrl) {
        // Handle different URL formats
        const finalUrl = imageUrl.startsWith('//') ? 'https:' + imageUrl : imageUrl;
        
        // Skip default/placeholder images
        if (!finalUrl.includes('//st.prntscr.com')) {
          // Verify that the image exists and is accessible
          const isValid = await verifyImageUrl(finalUrl);
          
          if (isValid) {
            console.log(`✅ Valid image found and verified: ${finalUrl}`);
            return finalUrl;
          } else {
            console.log(`❌ Image verification failed: ${finalUrl}`);
            return null;
          }
        } else {
          console.log(`❌ Skipping placeholder image: ${finalUrl}`);
        }
      } else {
        console.log('❌ Image element found but no src attribute');
      }
    } else {
      console.log('❌ No image element found with screenshot-image class');
    }
    return null;
  } catch (error) {
    console.error('❌ Error extracting image URL:', error);
    return null;
  }
}
