"use client"
import Link from 'next/link';
import { signIn, signOut, useSession } from "next-auth/react";
import Image from 'next/image';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';

export function Navbar() {
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const t = useTranslations('nav');

  return (
    <nav className="bg-gray-800 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <img src="/caption_clash_logo.png" alt="Caption Clash" className="h-12" />
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-center space-x-4">
                <Link
                  href="/"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  {t('home')}
                </Link>
                <Link
                  href="/how-to-play"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  {t('howToPlay')}
                </Link>
                <Link
                  href="/leaderboard"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  {t('leaderboard')}
                </Link>
                {session && (
                  <Link 
                    href="/profile" 
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    {t('profile')}
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <LanguageSwitcher />
            {session ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {session.user.image && (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || ""}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  )}
                  <span>{session.user.name}</span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {t('signOut')}
                </button>
              </div>
            ) : (
              <button
                onClick={() => signIn()}
                className="text-gray-300 hover:text-white transition-colors"
              >
                {t('signIn')}
              </button>
            )}
          </div>

          <div className="md:hidden flex items-center space-x-4">
            <LanguageSwitcher />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div 
        className={`
          fixed top-0 right-0 h-full w-64 bg-gray-800 transform transition-transform duration-300 ease-in-out z-50
          ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
          md:hidden
        `}
      >
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <svg
            className="h-6 w-6"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="px-2 pt-16 pb-3 space-y-1">
          <Link
            href="/"
            className="block text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {t('home')}
          </Link>
          <Link
            href="/how-to-play"
            className="block text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {t('howToPlay')}
          </Link>
          <Link
            href="/leaderboard"
            className="block text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {t('leaderboard')}
          </Link>
          {session && (
            <Link
              href="/profile"
              className="block text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t('profile')}
            </Link>
          )}
          <div className="border-t border-gray-700 mt-4 pt-4">
            {session ? (
              <div className="px-3 space-y-3">
                <div className="flex items-center">
                  {session.user.image && (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || ""}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  )}
                  <span className="ml-3">{session.user.name}</span>
                </div>
                <button
                  onClick={() => {
                    signOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium w-full text-left"
                >
                  {t('signOut')}
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  signIn();
                  setIsMobileMenuOpen(false);
                }}
                className="block text-gray-300 hover:text-white px-3 py-2 rounded-md text-base font-medium w-full text-left"
              >
                {t('signIn')}
              </button>
            )}
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </nav>
  );
} 