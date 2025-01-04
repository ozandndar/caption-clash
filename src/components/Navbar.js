"use client"
import Link from 'next/link';
import { signIn, signOut, useSession } from "next-auth/react";
import Image from 'next/image';

export function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-gray-800 text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold">CC</span>
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-center space-x-4">
                <Link
                  href="/"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Home
                </Link>
                <Link
                  href="/leaderboard"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                >
                  Leaderboard
                </Link>
                {session && (
                  <Link 
                    href="/profile" 
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Profile
                  </Link>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center">
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
                  Sign out
                </button>
              </div>
            ) : (
              <Link
                href="/signin"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 