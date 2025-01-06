"use client"
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

export default function CaptionInput({ screenshotId, onCaptionAdded }) {
  const [text, setText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const { data: session } = useSession()

  // Check if user has already submitted a caption for this screenshot
  useEffect(() => {
    const checkExistingCaption = async () => {
      if (!session?.user || !screenshotId) return;

      try {
        const response = await fetch(`/api/screenshots/${screenshotId}/captions/check-user`);
        const data = await response.json();
        setHasSubmitted(data.hasSubmitted);
      } catch (error) {
        console.error('Error checking caption:', error);
      }
    };

    checkExistingCaption();
  }, [screenshotId, session?.user]);

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!text.trim() || !session?.user) return

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/screenshots/${screenshotId}/captions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text.trim(),
          userId: session.user.id,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to add caption')
      }

      setText('')
      setHasSubmitted(true)
      onCaptionAdded?.()
    } catch (error) {
      console.error('Error adding caption:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!session) {
    return (
      <div className="text-center p-4 bg-gray-800 rounded-lg">
        <p className="text-gray-300">Sign in to add a caption!</p>
      </div>
    )
  }

  if (hasSubmitted) {
    return (
      <div className="text-center p-4 bg-gray-800 rounded-lg">
        <p className="text-gray-300">You've already submitted a caption for this screenshot!</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's your caption for this screenshot?"
          className="flex-1 px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
          disabled={isSubmitting || hasSubmitted}
        />
        <button
          type="submit"
          disabled={isSubmitting || !text.trim() || hasSubmitted}
          className="w-full sm:w-auto px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Adding...' : 'Submit'}
        </button>
      </div>
    </form>
  )
} 