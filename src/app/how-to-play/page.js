export default function HowToPlay() {
  return (
    <main className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto space-y-12">
        <h1 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          How to Play Screenshot Roulette
        </h1>
        
        <div className="space-y-6 text-gray-300">
          <p className="text-xl text-center mb-8">
            Every click is a gamble - discover random screenshots from around the world and compete with others!
          </p>
          
          {/* Core Gameplay */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-blue-400 mb-4">🎲 The Game</h2>
            <div className="space-y-4">
              <p>
                Screenshot Roulette gives you access to a vast collection of random screenshots taken by people worldwide. 
                Each click reveals a new mystery - you might find anything from private conversations to secret documents, 
                from funny moments to surprising discoveries.
              </p>
            </div>
          </div>

          {/* Scoring System */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-blue-400 mb-4">🏆 Earning Points</h2>
            <div className="space-y-4">
              <p>Climb the leaderboard through various interactions:</p>
              <ul className="list-none space-y-3">
                <li className="flex items-center gap-3">
                  <span className="text-green-400 font-bold">+1</span>
                  <span>View a new screenshot</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-400 font-bold">+3</span>
                  <span>React to a screenshot (funny, shocked, etc.)</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-400 font-bold">+10</span>
                  <span>Add a witty caption to a screenshot</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="text-green-400 font-bold">+30</span>
                  <span>Get a like on your caption</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-blue-400 mb-4">💡 Pro Tips</h2>
            <ul className="list-disc list-inside space-y-3">
              <li>
                Keep clicking - you never know what you'll discover next!
              </li>
              <li>
                React quickly to what you find - share your emotions
              </li>
              <li>
                Be creative with your captions - funnier captions get more likes
              </li>
              <li>
                Check the leaderboard daily - new champions are crowned every day
              </li>
            </ul>
          </div>

          <div className="text-center">
            <p className="text-lg">
              Ready to start discovering secrets? Join the hunt and see what you'll find! 🎯
            </p>
          </div>
        </div>
      </div>
    </main>
  );
} 