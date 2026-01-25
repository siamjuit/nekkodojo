import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fetchItems } from "@/lib/actions/caching";
import { calculateReputation } from "@/utils/repCalc";
import { QuestionStatusType } from "@/generated/prisma/client";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sortType = searchParams.get("sort") || "reputation";
    const cacheKey = `leaderboard:${sortType}`;

    const leaderboardData = await fetchItems({
      key: cacheKey,
      expires: 300,
      fetcher: async () => {
        const companies = await prisma.company.findMany({
          select: {
            id: true,
            questions: { select: { id: true } },
          },
        });
        const users = await prisma.user.findMany({
          where: {
            OR: [{ isOnboarded: true }, { noOfQuestionsSolved: { gt: 0 } }],
            isBanned: false,
          },
          take: 100,
          include: {
            userProgresses: {
              where: { status: QuestionStatusType.completed },
              select: {
                questionId: true,
                question: { select: { difficulty: true } },
              },
            },
            discussions: { select: { likeCount: true, dislikeCount: true } },
            comments: { select: { likeCount: true, dislikeCount: true } },
          },
        });

        const rankedUsers = users.map((u) => {
          const solvedQuestionIds = new Set(u.userProgresses.map((p) => p.questionId));
          let companySheetsCompleted = 0;

          for (const company of companies) {
            const totalQ = company.questions.length;
            if (totalQ === 0) continue;
            const isComplete = company.questions.every((q) => solvedQuestionIds.has(q.id));

            if (isComplete) {
              companySheetsCompleted++;
            }
          }
          const questionScore = u.userProgresses.length;

          const easy = u.userProgresses.filter((p) => p.question.difficulty === "Easy").length;
          const medium = u.userProgresses.filter((p) => p.question.difficulty === "Medium").length;
          const hard = u.userProgresses.filter((p) => p.question.difficulty === "Hard").length;

          const discLikes = u.discussions.reduce((acc, d) => acc + (d.likeCount || 0), 0);
          const discDislikes = u.discussions.reduce((acc, d) => acc + (d.dislikeCount || 0), 0);
          const commLikes = u.comments.reduce((acc, c) => acc + (c.likeCount || 0), 0);
          const commDislikes = u.comments.reduce((acc, c) => acc + (c.dislikeCount || 0), 0);

          const reputationScore = calculateReputation({
            solvedEasy: easy,
            solvedMedium: medium,
            solvedHard: hard,
            discussionUpvotes: discLikes,
            discussionDownvotes: discDislikes,
            commentUpvotes: commLikes,
            commentDownvotes: commDislikes,
            acceptedAnswers: u.noOfQuestionsSolved || 0,
          });

          return {
            id: u.id,
            name: u.name || "Ninja",
            profileUrl: u.profileUrl,
            beltRank: u.beltRank,
            stats: {
              reputation: reputationScore,
              companies: companySheetsCompleted,
              questions: questionScore,
            },
          };
        });
        const sortedUsers = rankedUsers.sort((a, b) => {
          if (sortType === "companies") return b.stats.companies - a.stats.companies;
          if (sortType === "questions") return b.stats.questions - a.stats.questions;
          return b.stats.reputation - a.stats.reputation;
        });

        return sortedUsers.slice(0, 20);
      },
    });

    return NextResponse.json(leaderboardData);
  } catch (error) {
    console.error("Leaderboard Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
