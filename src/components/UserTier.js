export function UserTier() {
  // This would normally fetch from your API
  const user = {
    name: 'John Doe',
    points: 1500,
    tier: 'Gold',
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="flex-1">
        <h3 className="text-lg font-semibold">{user.name}</h3>
        <p className="text-gray-600">Points: {user.points}</p>
        <p className="text-gray-600">Tier: {user.tier}</p>
      </div>
      <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
        <span className="text-white font-bold">{user.tier}</span>
      </div>
    </div>
  );
} 