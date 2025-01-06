"use client"
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useSession, signIn } from 'next-auth/react'

const TABS = [
  { id: 'overall', label: 'Overall' },
  { id: 'weekly', label: 'This Week' },
  { id: 'daily', label: 'Today' },
]

const MEDALS = {
  0: { emoji: '🥇', color: 'text-yellow-500' },
  1: { emoji: '🥈', color: 'text-gray-400' },
  2: { emoji: '🥉', color: 'text-amber-600' },
};

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overall')
  const { data: session } = useSession()

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

        {!session && (
          <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4 mb-8">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-sm text-gray-300">
                <p className="font-medium text-blue-400">Want to join the competition?</p>
                <p>Sign in to start earning points! Here's how you can climb the leaderboard:</p>
                <ul className="mt-2 space-y-1 list-disc list-inside text-gray-400">
                  <li>View a screenshot: <span className="text-green-400">1 point</span></li>
                  <li>React to a screenshot: <span className="text-green-400">3 points</span></li>
                  <li>Add a caption: <span className="text-green-400">10 points</span></li>
                  <li>Get likes on your captions: <span className="text-green-400">30 points each</span></li>
                </ul>
                <p className="mt-2 text-xs text-gray-500">The more you interact, the higher you climb! 🚀</p>
                <button
                  onClick={() => signIn()}
                  className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
                >
                  Sign in to Participate
                </button>
              </div>
            </div>
          </div>
        )}

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
              className={`flex flex-col md:flex-row md:items-center p-4 ${
                index !== leaderboard.length - 1 ? 'border-b border-gray-700' : ''
              }`}
            >
              {/* First Row: Rank, User Info, and Points */}
              <div className="flex items-center justify-between w-full md:flex-1">
                <div className="flex items-center">
                  <div className="text-2xl font-bold mr-4 w-8 text-right">
                    {index < 3 ? (
                      <span className={MEDALS[index].color} title={`${index + 1}st Place`}>
                        {MEDALS[index].emoji}
                      </span>
                    ) : (
                      <span className="text-gray-400">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex items-center">
                    {user.image && (
                      <Image
                        src={user.image}
                        alt={user.name || 'User'}
                        width={40}
                        height={40}
                        className={`rounded-full mr-3 ${index < 3 ? 'ring-2 ring-offset-2 ring-offset-gray-800 ' + 
                          (index === 0 ? 'ring-yellow-500' : 
                           index === 1 ? 'ring-gray-400' : 
                           'ring-amber-600')
                           : ''
                        }`}
                      />
                    )}
                    <span className={`font-medium ${index < 3 ? 'text-lg' : ''}`}>
                      {user.name}
                    </span>
                  </div>
                </div>
                {/* Points - Show on both rows for mobile */}
                <div className="md:hidden flex items-center">
                  <span className="font-bold">{user.points}</span>
                  <span className="text-gray-400 ml-1">pts</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between md:justify-end mt-2 md:mt-0 w-full md:w-auto">
                <div className="flex items-center space-x-4 md:space-x-6">
                  <div className="flex items-center space-x-1" title="Screenshots Seen">
                    <span className="text-gray-400">👀</span>
                    <span>{user.totalViews || 0}</span>
                  </div>
                  <div className="flex items-center space-x-1" title="Reactions Left">
                    <span className="text-gray-400">💭</span>
                    <span>{user.totalReactions || 0}</span>
                  </div>
                  <div className="flex items-center space-x-1" title="Captions">
                    <span className="text-gray-400">✍️</span>
                    <span>{user.captionsCount || 0}</span>
                  </div>
                  <div className="flex items-center space-x-1" title="Likes Received">
                    <span className="text-gray-400">❤️</span>
                    <span>{user.likesReceived || 0}</span>
                  </div>
                  <div className="hidden md:block w-24 text-right">
                    <span className="font-bold">{user.points}</span>
                    <span className="text-gray-400 ml-1">pts</span>
                  </div>
                </div>
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