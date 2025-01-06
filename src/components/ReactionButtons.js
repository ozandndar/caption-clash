'use client';
import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';

const REACTIONS = {
  FUNNY: { emoji: '😂', label: 'Funny', description: 'This is hilarious!' },
  SHOCKED: { emoji: '😱', label: 'Shocked', description: "I can't believe it!" },
  DISLIKE: { emoji: '👎', label: 'Dislike', description: 'Not cool' },
  HOT: { emoji: '🔥', label: 'Hot', description: "That's fire!" },
  CLEVER: { emoji: '🧠', label: 'Clever', description: 'Big brain moment' },
  WHOLESOME: { emoji: '🥰', label: 'Wholesome', description: 'This made my day' },
};

export default function ReactionButtons({ screenshotId }) {
  const { data: session } = useSession();
  const [reactions, setReactions] = useState({});
  const [userReactions, setUserReactions] = useState(new Set());
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReactions();
  }, [screenshotId]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const fetchReactions = async () => {
    try {
      const response = await fetch(`/api/screenshots/${screenshotId}/react`);
      const data = await response.json();
      const reactionCounts = {};
      data.reactions.forEach(r => {
        reactionCounts[r.type] = r._count;
      });
      setReactions(reactionCounts);
      if (session) {
        setUserReactions(new Set(data.userReactions));
      }
    } catch (error) {
      console.error('Error fetching reactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReaction = async (type) => {
    if (!session) {
      setShowSignInPrompt(true);
      setTimeout(() => setShowSignInPrompt(false), 3000);
      return;
    }

    try {
      const response = await fetch(`/api/screenshots/${screenshotId}/react`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.error || 'Failed to add reaction');
        return;
      }

      if (data.added) {
        setUserReactions(new Set([type]));
      } else if (data.removed) {
        setUserReactions(new Set());
      }
      fetchReactions();
    } catch (error) {
      console.error('Error handling reaction:', error);
    }
  };

  if (isLoading) return <div>Loading reactions...</div>;

  return (
    <div className="relative">
      {showSignInPrompt && (
        <div className="absolute -top-12 left-0 right-0 text-center animate-fade-in-down">
          <div className="inline-block bg-blue-500 text-white px-4 py-2 rounded-lg text-sm">
            <span className="mr-2">Sign in to react!</span>
            <button
              onClick={() => signIn()}
              className="underline font-medium hover:text-blue-100"
            >
              Sign in
            </button>
          </div>
        </div>
      )}
      {errorMessage && (
        <div className="absolute -top-12 left-0 right-0 text-center animate-fade-in-down">
          <div className="inline-block bg-red-500 text-white px-4 py-2 rounded-lg text-sm">
            {errorMessage}
          </div>
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {Object.entries(REACTIONS).map(([type, { emoji, label, description }]) => (
          <button
            key={type}
            onClick={() => handleReaction(type)}
            title={session ? description : 'Sign in to react!'}
            disabled={session && userReactions.size > 0 && !userReactions.has(type)}
            className={`flex flex-col items-center justify-center p-3 rounded-lg text-sm transition-all
              w-full h-full min-h-[90px] ${
                !session 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:scale-105'
                  : userReactions.has(type)
                    ? 'bg-blue-500 text-white scale-110'
                    : userReactions.size > 0
                      ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                      : 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:scale-105'
              }`}
          >
            <span className="text-3xl mb-2">{emoji}</span>
            <span className="text-xs font-medium">{label}</span>
            <span className="text-xs opacity-75">{reactions[type] || 0}</span>
          </button>
        ))}
      </div>
    </div>
  );
} 