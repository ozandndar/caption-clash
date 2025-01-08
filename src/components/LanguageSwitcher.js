'use client';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { SUPPORTED_LANGUAGES, LANGUAGE_METADATA } from '@/contexts/LanguageContext';

export default function LanguageSwitcher() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { locale, changeLocale } = useLanguage();

  const handleChange = (e) => {
    const newLocale = e.target.value;
    
    startTransition(() => {
      changeLocale(newLocale);
      router.refresh();
    });
  };

  return (
    <select
      className="bg-gray-700 text-white rounded px-2 py-1"
      value={locale}
      onChange={handleChange}
      disabled={isPending}
    >
      {SUPPORTED_LANGUAGES.map((lang) => (
        <option key={lang} value={lang}>
          {LANGUAGE_METADATA[lang].flag} {LANGUAGE_METADATA[lang].name}
        </option>
      ))}
    </select>
  );
}