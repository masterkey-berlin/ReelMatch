export function isMatch(likes, userA, userB) {
  if (userA === userB) return false;
  const aLikesB = likes.some(l => l.from === userA && l.to === userB);
  const bLikesA = likes.some(l => l.from === userB && l.to === userA);
  return aLikesB && bLikesA;
}