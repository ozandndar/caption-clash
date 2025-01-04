"use client"
import { useEffect } from 'react'

export default function SlideOver({ open, setOpen, children, title }) {
  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener('keydown', handleEscape)
      // Prevent scrolling on the main content when slide-over is open
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [open, setOpen])

  if (!open) return null

  return (
    <div className="relative z-50">
      {/* Background overlay */}
      <div 
        className="fixed inset-0 bg-black/80 transition-opacity duration-300 ease-in-out"
        onClick={() => setOpen(false)}
      />

      {/* Slide-over panel */}
      <div className={`fixed inset-y-0 right-0 flex max-w-full pl-10 transform transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="w-screen max-w-md">
          <div className="flex h-full flex-col overflow-y-scroll bg-gray-900 shadow-xl">
            {/* Header */}
            <div className="px-4 sm:px-6 py-6 bg-gray-800/50 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">
                  {title}
                </h2>
                <button
                  type="button"
                  className="rounded-md text-gray-400 hover:text-gray-200 focus:outline-none"
                  onClick={() => setOpen(false)}
                >
                  <span className="sr-only">Close panel</span>
                  <svg 
                    className="h-6 w-6" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth="1.5" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      d="M6 18L18 6M6 6l12 12" 
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="relative flex-1 px-4 sm:px-6 py-6 text-gray-100">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 