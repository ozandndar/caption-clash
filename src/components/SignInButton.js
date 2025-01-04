"use client"
import { signIn } from "next-auth/react"
import Image from "next/image"

export default function SignInButton() {
  return (
    <button
      onClick={() => signIn("google", { callbackUrl: "/" })}
      className="w-full flex items-center justify-center gap-3 bg-white px-4 py-3 text-gray-700 rounded-lg border hover:bg-gray-50 transition-colors"
    >
      <Image 
        src="/google.svg" 
        alt="Google logo" 
        width={20} 
        height={20}
      />
      <span>Continue with Google</span>
    </button>
  )
} 