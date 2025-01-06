const POINTS = {
  VIEW: 1,        // 1 point per screenshot view
  REACTION: 3,    // 3 points per reaction
  CAPTION: 10,    // 10 points per caption
  LIKE: 30,       // 30 points per like received
};

export function calculatePoints({
  likes = 0,
  captions = 0,
  views = 0,
  reactions = 0
} = {}) {
  return (
    likes * POINTS.LIKE +
    captions * POINTS.CAPTION +
    views * POINTS.VIEW +
    reactions * POINTS.REACTION
  );
}

export { POINTS }; 