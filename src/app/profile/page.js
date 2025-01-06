"use client"
import { useSession } from 'next-auth/react'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import ImageDialog from '@/components/ImageDialog'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const [userStats, setUserStats] = useState(null)
  const [userCaptions, setUserCaptions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)
  const [sortBy, setSortBy] = useState('likes') // Default to most liked

  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user) return

      try {
        // Fetch user stats
        const statsResponse = await fetch(`/api/users/${session.user.id}/stats`)
        const stats = await statsResponse.json()
        setUserStats(stats)

        // Fetch user captions with sort parameter
        const captionsResponse = await fetch(`/api/users/${session.user.id}/captions?sortBy=${sortBy}`)
        const captions = await captionsResponse.json()
        setUserCaptions(captions)
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [session, sortBy]) // Add sortBy to dependencies

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-4 text-gray-300">Loading profile...</div>
        </div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-4 text-gray-300">Please sign in to view your profile</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* User Profile Header */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8 flex items-center gap-6">
          {session.user.image && (
            <Image
              src={session.user.image}
              alt={session.user.name || "User"}
              width={96}
              height={96}
              className="rounded-full ring-4 ring-gray-700"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold">{session.user.name}</h1>
            <p className="text-gray-400">{session.user.email}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <h3 className="text-lg text-gray-400">Total Points</h3>
            <p className="text-3xl font-bold text-yellow-500">
              {userStats?.points?.total || 0}
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <h3 className="text-lg text-gray-400">Points This Week</h3>
            <p className="text-3xl font-bold text-blue-500">
              {userStats?.points?.weekly || 0}
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <h3 className="text-lg text-gray-400">Points Today</h3>
            <p className="text-3xl font-bold text-green-500">
              {userStats?.points?.daily || 0}
            </p>
          </div>
        </div>

        {/* Activity Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <h3 className="text-sm text-gray-400">Total Captions</h3>
            <p className="text-xl font-bold">{userStats?.totalCaptions || 0}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <h3 className="text-sm text-gray-400">Total Likes</h3>
            <p className="text-xl font-bold">{userStats?.totalLikesReceived || 0}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <h3 className="text-sm text-gray-400">Screenshots Seen</h3>
            <p className="text-xl font-bold">{userStats?.totalViews || 0}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <h3 className="text-sm text-gray-400">Reactions Left</h3>
            <p className="text-xl font-bold">{userStats?.totalReactions || 0}</p>
          </div>
        </div>

        {/* Recent Captions */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Your Captions</h2>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-700 text-gray-100 px-3 py-1 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="likes">Most Liked</option>
              <option value="createdAt">Most Recent</option>
            </select>
          </div>

          {userCaptions.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No captions yet</p>
          ) : (
            <div className="space-y-4">
              {userCaptions.map((caption) => (
                <div key={caption.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex gap-4">
                    {/* Screenshot thumbnail */}
                    <div className="flex-shrink-0">
                      <div 
                        className="relative w-24 h-16 rounded-lg overflow-hidden bg-gray-800 cursor-pointer transition-transform hover:scale-105"
                        onClick={() => caption.screenshot?.url && setSelectedImage(caption.screenshot.url)}
                      >
                        {caption.screenshot?.url ? (
                          <Image
                            src={caption.screenshot.url}
                            alt="Screenshot"
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-600">
                            No image
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Caption content */}
                    <div className="flex-1">
                      <p className="text-gray-100 mb-2">{caption.text}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <span>👍</span> {caption.likeCount}
                        </span>
                        <span>•</span>
                        <span>{new Date(caption.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Image Dialog */}
      <ImageDialog
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        imageUrl={selectedImage}
      />
    </div>
  )
} 