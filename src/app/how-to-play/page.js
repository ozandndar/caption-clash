export default function HowToPlay() {
  return (
    <main className="container mx-auto px-4 py-16">
      <div className="max-w-3xl mx-auto space-y-12">
        <h1 className="text-4xl font-bold text-center mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          How to Play Caption Clash
        </h1>
        
        <div className="space-y-6 text-gray-300">
          <p className="text-xl text-center">
            Join the ultimate screenshot captioning competition! We collect random screenshots from Lightshot users and turn them into a hilarious caption contest.
          </p>

          {/* About Lightshot */}
          <div className="bg-gray-800/50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-white">About the Screenshots</h2>
            <p className="mb-4">
              Lightshot is one of the most popular screenshot tools in the world, with over 5 billion screenshots taken by users globally. These screenshots capture moments from everyday internet browsing, gaming sessions, funny conversations, and more.
            </p>
            <p>
              In Caption Clash, we randomly access these public screenshots, giving you a unique window into what people around the world are capturing on their screens. Each screenshot is a mystery waiting for your witty interpretation!
            </p>
          </div>
          
          {/* How it Works */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-white">How it Works</h2>
            <ul className="space-y-4 list-none">
              <li className="flex items-start">
                <span className="mr-2">👀</span>
                <span>Discover random screenshots from around the world</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">💭</span>
                <span>Add your witty, funny, or clever captions</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">👍</span>
                <span>Vote for the most hilarious captions</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">🏆</span>
                <span>Compete for the top spot on our leaderboard</span>
              </li>
            </ul>
          </div>

          {/* Rules & Scoring */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-white">Rules & Scoring</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-2">Participation Rules</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>You must submit your own caption before seeing others' captions</li>
                  <li>Each user can submit one caption per screenshot</li>
                  <li>Keep it fun and respectful - inappropriate content will be removed</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-blue-400 mb-2">Scoring System</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Creating a caption: <span className="text-green-400">5 points</span></li>
                  <li>Receiving a like on your caption: <span className="text-green-400">10 points</span></li>
                  <li>Points contribute to your daily, weekly, and overall rankings</li>
                  <li>Leaderboards reset daily and weekly, but overall points are permanent</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Community Guidelines */}
          <div className="bg-gray-800/50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-white">Tips for Success</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Be creative - the most unexpected captions often get the most likes</li>
              <li>Check the leaderboard regularly to see the top captioners</li>
              <li>Participate daily to increase your ranking</li>
              <li>Share your best captions with friends to get more likes</li>
            </ul>
          </div>

          <div className="text-center">
            <p className="text-lg">
              Ready to show off your humor? Join our community and start captioning!
            </p>
          </div>
        </div>
      </div>
    </main>
  );
} 