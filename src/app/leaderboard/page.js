"use client"
import { useState, useEffect } from 'react'
import Image from 'next/image'

const TABS = [
  { id: 'overall', label: 'Overall' },
  { id: 'weekly', label: 'This Week' },
  { id: 'daily', label: 'Today' },
]

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overall')

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/leaderboard?type=${activeTab}`)
        const data = await response.json()
        setLeaderboard(data)
      } catch (error) {
        console.error('Error fetching leaderboard:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLeaderboard()
  }, [activeTab])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-4xl mx-auto text-center">
          Loading leaderboard...
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Leaderboard</h1>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-800 p-1 rounded-lg mb-6">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors
                ${activeTab === tab.id 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-gray-800 rounded-lg overflow-hidden">
          {leaderboard.map((user, index) => (
            <div 
              key={user.userId}
              className={`flex items-center gap-4 p-4 ${
                index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'
              }`}
            >
              {/* Rank Medal for top 3 */}
              <div className="text-2xl font-bold w-8 flex justify-center">
                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : 
                  <span className="text-gray-400">{index + 1}</span>
                }
              </div>

              <div className="flex items-center gap-3 flex-1">
                {user.image && (
                  <Image
                    src={user.image}
                    alt={user.name || "User"}
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                )}
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-gray-400">
                    {user.captionsCount} captions • {user.likesReceived} likes
                  </div>
                </div>
              </div>

              <div className="text-2xl font-bold text-yellow-500">
                {user.points}
              </div>
            </div>
          ))}

          {leaderboard.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No scores yet for this time period
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 