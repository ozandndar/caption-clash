"use client"
import { Fragment } from 'react'
import Image from 'next/image'

export default function ImageDialog({ isOpen, onClose, imageUrl }) {
  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75"
      onClick={onClose}
    >
      <div className="relative w-full max-w-4xl h-[80vh] m-4">
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-gray-300"
        >
          Close
        </button>
        <div className="relative w-full h-full rounded-lg overflow-hidden bg-gray-800">
          <Image
            src={imageUrl}
            alt="Screenshot"
            fill
            className="object-contain"
          />
        </div>
      </div>
    </div>
  )
} 