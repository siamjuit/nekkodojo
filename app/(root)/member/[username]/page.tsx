import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { ProfileCharts } from "@/components/User/ProfileCharts";
import { BeltProgress } from "@/components/User/BeltCollection";
import { UserDetails } from "@/components/User/UserDetails";
import { QuestionStatusType } from "@/generated/prisma/client";
import { ProfileActivityTabs } from "@/components/User/ProfileActivityTabs";
import DeleteProgress from "@/components/User/DeleteProgress";
import { calculateReputation } from "@/utils/repCalc";

export const dynamic = "force-dynamic";

export default async function ProfilePage(params: { params: Promise<{ username: string }> }) {
  const { username } = await params.params;
  const curr = await currentUser();

  // 1. Quick check for user existence
  const user = await prisma.user.findFirst({
    where: { name: username },
    select: { id: true }, // Minimal select
  });

  if (!user) {
    return notFound();
  }

  const isOwn = curr?.id === user.id;

  // 2. Fetch ALL data in parallel for performance
  const [
    userProgress,
    solvedQuestions,
    discussions,
    comments,
    discussionsCount,
    commentsCount,
    categories,
    companies,
    currUser, // Fetch full profile details here
  ] = await Promise.all([
    // A. Progress for Activity Graph
    prisma.userProgress.findMany({
      where: { userId: user.id, status: QuestionStatusType.completed },
      select: { questionId: true, updatedAt: true },
    }),

    // B. Solved Questions (for Difficulty Stats)
    prisma.userProgress.findMany({
      where: {
        userId: user.id,
        status: QuestionStatusType.completed,
      },
      orderBy: { updatedAt: "desc" },
      include: {
        question: {
          select: { id: true, title: true, difficulty: true, externalPlatformUrl: true },
        },
      },
    }),

    // C. Discussions (for Reputation: Likes & Dislikes)
    prisma.discussion.findMany({
      where: { authorId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { comments: true } },
      },
    }),

    // D. Comments (for Reputation: Likes & Dislikes)
    prisma.comment.findMany({
      where: { authorId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        discussion: { select: { id: true, title: true } },
      },
    }),

    // E. Counts
    prisma.discussion.count({ where: { authorId: user.id } }),
    prisma.comment.count({ where: { authorId: user.id } }),

    // F. Global Data
    prisma.category.findMany({ include: { questions: { select: { id: true } } } }),
    prisma.company.findMany({ include: { questions: { select: { id: true } } } }),

    // G. Full User Profile (CRITICAL: Include Social Links)
    prisma.user.findUnique({
      where: { id: user.id },
      select: {
        name: true,
        firstName: true,
        lastName: true,
        bio: true,
        profileUrl: true,
        email: true,
        createdAt: true,
        socialLinks: true, // This enables SocialsManager for visitors
      },
    }),
  ]);

  if (!currUser) return notFound();

  // --- 3. DATA PROCESSING ---

  // A. Activity Heatmap Data
  const solvedSet = new Set(userProgress.map((p) => p.questionId));
  const totalSolved = solvedSet.size;

  const activityMap = new Map<string, number>();
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    activityMap.set(dateStr, 0);
  }
  userProgress.forEach((p) => {
    const dateStr = p.updatedAt.toISOString().split("T")[0];
    if (activityMap.has(dateStr)) {
      activityMap.set(dateStr, (activityMap.get(dateStr) || 0) + 1);
    }
  });
  const activityData = Array.from(activityMap.entries()).map(([date, count]) => ({
    date: date.slice(5),
    count,
  }));

  // B. Category & Company Stats
  const categoryStats = categories
    .map((cat) => {
      const total = cat.questions.length;
      const solved = cat.questions.filter((q) => solvedSet.has(q.id)).length;
      return {
        name: cat.name,
        total,
        solved,
        percent: total > 0 ? Math.round((solved / total) * 100) : 0,
      };
    })
    .filter((c) => c.total > 0);

  const companyStats = companies
    .map((comp) => {
      const total = comp.questions.length;
      const solved = comp.questions.filter((q) => solvedSet.has(q.id)).length;
      return {
        name: comp.name,
        total,
        solved,
        percent: total > 0 ? Math.round((solved / total) * 100) : 0,
      };
    })
    .filter((c) => c.solved > 0);

  // --- 4. REPUTATION CALCULATION ---
  const easySolved = solvedQuestions.filter((q) => q.question.difficulty === "Easy").length;
  const medSolved = solvedQuestions.filter((q) => q.question.difficulty === "Medium").length;
  const hardSolved = solvedQuestions.filter((q) => q.question.difficulty === "Hard").length;

  // Calculate Community Impact (Likes vs Dislikes)
  // Ensure your Prisma schema has likeCount/dislikeCount fields on Discussion/Comment
  const discussionLikes = discussions.reduce((acc, d) => acc + (d.likeCount || 0), 0);
  const discussionDislikes = discussions.reduce((acc, d) => acc + (d.dislikeCount || 0), 0);

  const commentLikes = comments.reduce((acc, c) => acc + (c.likeCount || 0), 0);
  const commentDislikes = comments.reduce((acc, c) => acc + (c.dislikeCount || 0), 0);

  // Using total solved as proxy for accepted answers (or calculate separately if tracked)
  const accepted = totalSolved;

  const reputation = calculateReputation({
    solvedEasy: easySolved,
    solvedMedium: medSolved,
    solvedHard: hardSolved,
    discussionUpvotes: discussionLikes,
    discussionDownvotes: discussionDislikes,
    commentUpvotes: commentLikes,
    commentDownvotes: commentDislikes,
    acceptedAnswers: accepted,
  });

  return (
    <div className="min-h-screen bg-[#0f0b0a] text-[#eaddcf] py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-6xl space-y-8 md:space-y-16">
        <UserDetails
          user={currUser}
          stats={{
            solved: totalSolved,
            discussions: discussionsCount,
            comments: commentsCount,
            reputation: reputation, // Pass calculated reputation
          }}
          isOwnProfile={isOwn}
        />

        <BeltProgress totalSolved={totalSolved} />

        <ProfileCharts
          activityData={activityData}
          categoryStats={categoryStats}
          companyStats={companyStats}
        />

        <ProfileActivityTabs
          solvedQuestions={solvedQuestions}
          discussions={discussions}
          comments={comments}
        />

        {isOwn && <DeleteProgress />}
      </div>
    </div>
  );
}
