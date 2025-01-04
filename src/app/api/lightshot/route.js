import { NextResponse } from 'next/server';
import axios from 'axios';
import { load } from 'cheerio';

async function isValidImage(imageUrl) {
  try {
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      validateStatus: status => status === 200
    });

    const contentType = response.headers['content-type'];
    if (!contentType.startsWith('image/')) {
      return false;
    }

    const contentLength = response.data.length;
    if (contentLength < 1024) {
      return false;
    }

    return true;
  } catch (err) {
    return false;
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
    }

    const { data } = await axios.get(url);
    const $ = load(data);
    const rows = $('.screenshot-image');

    if (rows.length > 0 && rows[0].attribs && rows[0].attribs.src) {
      const imageUrl = rows[0].attribs.src;
      if (await isValidImage(imageUrl)) {
        return NextResponse.json({ imageUrl });
      }
    }

    return NextResponse.json({ imageUrl: null });
  } catch (error) {
    console.error('Lightshot proxy error:', error);
    return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 });
  }
} 