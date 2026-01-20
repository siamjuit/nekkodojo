// utils/repCalc.ts

export function calculateReputation(stats: {
  solvedEasy: number;
  solvedMedium: number;
  solvedHard: number;
  discussionUpvotes: number;
  discussionDownvotes: number; // New Input
  commentUpvotes: number;
  commentDownvotes: number; // New Input
  acceptedAnswers: number;
}) {
  // 1. Skill Score (Coding is immutable skill)
  const skillScore = stats.solvedEasy * 5 + stats.solvedMedium * 15 + stats.solvedHard * 30;

  // 2. Community Score (Net Positive Impact)
  // We calculate Net Score (Likes - Dislikes)
  const discussionNet = stats.discussionUpvotes - stats.discussionDownvotes;
  const commentNet = stats.commentUpvotes - stats.commentDownvotes;

  // We use Math.max(0, ...) to ensure we don't try to square root a negative number.
  // This means if you are heavily disliked, your contribution from that area is simply 0.
  const repSkill = Math.floor(10 * Math.log10(skillScore + 1));
  const repDisc = Math.floor(5 * Math.sqrt(Math.max(0, discussionNet)));
  const repComm = Math.floor(2 * Math.sqrt(Math.max(0, commentNet)));

  // Optional: Add small bonus for accepted answers
  const bonus = stats.acceptedAnswers * 2;

  return repSkill + repDisc + repComm + bonus;
}
