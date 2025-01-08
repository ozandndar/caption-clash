import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';

const SUPPORTED_LANGUAGES = ['en', 'tr'];

function parseAcceptLanguage(acceptLanguage = '') {
  // Get first language from Accept-Language header
  const preferredLanguage = acceptLanguage
    .split(',')[0]
    ?.split('-')[0] // Get primary language tag
    ?.toLowerCase();

  return SUPPORTED_LANGUAGES.includes(preferredLanguage) ? preferredLanguage : 'en';
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const headersList = await headers();
  
  // Priority: Cookie > Accept-Language header > default
  const locale = 
    cookieStore.get('locale')?.value || 
    parseAcceptLanguage(headersList.get('Accept-Language')) ||
    'en';

  try {
    const messages = (await import(`../../messages/${locale}.json`)).default;
    return {
      locale,
      messages,
      timeZone: 'Europe/Istanbul'
    };
  } catch (error) {
    console.error(`Failed to load messages for locale: ${locale}`, error);
    const defaultMessages = (await import('../../messages/en.json')).default;
    return {
      locale: 'en',
      messages: defaultMessages,
      timeZone: 'Europe/Istanbul'
    };
  }
}); 