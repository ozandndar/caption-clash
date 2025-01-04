"use client"
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'

export default function CaptionList({ screenshotId, refreshTrigger }) {
  const [captions, setCaptions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [likingCaptions, setLikingCaptions] = useState(new Set())
  const [sortBy, setSortBy] = useState('likes') // Changed default to 'likes'
  const { data: session } = useSession()

  const fetchCaptions = async () => {
    try {
      const response = await fetch(`/api/screenshots/${screenshotId}/captions?sortBy=${sortBy}`)
      if (!response.ok) {
        throw new Error('Failed to fetch captions')
      }
      const data = await response.json()
      setCaptions(data)
    } catch (error) {
      console.error('Error fetching captions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLike = async (captionId) => {
    if (!session || likingCaptions.has(captionId)) return

    try {
      setLikingCaptions(prev => new Set(prev).add(captionId))
      
      const response = await fetch(`/api/captions/${captionId}/like`, {
        method: 'POST',
      })
      
      if (response.ok) {
        fetchCaptions()
      }
    } catch (error) {
      console.error('Error liking caption:', error)
    } finally {
      setLikingCaptions(prev => {
        const newSet = new Set(prev)
        newSet.delete(captionId)
        return newSet
      })
    }
  }

  useEffect(() => {
    if (screenshotId) {
      fetchCaptions()
    }
  }, [screenshotId, refreshTrigger, sortBy]) // Added sortBy to dependencies

  if (isLoading) {
    return <div className="text-center py-4 text-gray-300">Loading captions...</div>
  }

  return (
    <div className="space-y-4">
      {/* Sorting controls */}
      <div className="flex justify-end mb-4">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-gray-700 text-gray-100 px-3 py-1 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="likes">Most Liked</option>
          <option value="createdAt">Most Recent</option>
        </select>
      </div>

      {captions.length === 0 ? (
        <p className="text-center text-gray-400">No captions yet. Be the first to add one!</p>
      ) : (
        <ul className="space-y-4">
          {captions.map((caption) => (
            <li key={caption.id} className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                {caption.author.image && (
                  <Image
                    src={caption.author.image}
                    alt={caption.author.name || "User"}
                    width={24}
                    height={24}
                    className="rounded-full ring-2 ring-gray-700"
                  />
                )}
                <span className="font-medium text-gray-200">{caption.author.name}</span>
              </div>
              <p className="text-gray-100">{caption.text}</p>
              <div className="flex items-center gap-4 mt-2">
                <button
                  onClick={() => handleLike(caption.id)}
                  disabled={!session || likingCaptions.has(caption.id)}
                  className={`flex items-center space-x-1 text-sm transition-opacity duration-200 ${
                    !session 
                      ? 'text-gray-500 cursor-not-allowed' 
                      : likingCaptions.has(caption.id)
                      ? 'opacity-50 cursor-wait text-gray-300'
                      : 'text-gray-300 hover:text-gray-100'
                  }`}
                >
                  <span>👍</span>
                  <span>{caption.likeCount}</span>
                </button>
                <span className="text-sm text-gray-400">•</span>
                <span className="text-sm text-gray-400">
                  {new Date(caption.createdAt).toLocaleString()}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
} 