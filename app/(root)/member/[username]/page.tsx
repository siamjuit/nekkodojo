import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { BeltProgress } from "@/components/User/BeltCollection";
import { UserDetails } from "@/components/User/UserDetails";
import { QuestionStatusType } from "@/generated/prisma/client";
import { ProfileActivityTabs } from "@/components/User/ProfileActivityTabs";
import DeleteProgress from "@/components/User/DeleteProgress";
import { calculateReputation } from "@/utils/repCalc";
import ProfileCharts from "@/components/User/ProfileCharts";

export const dynamic = "force-dynamic";

export default async function ProfilePage(params: { params: Promise<{ username: string }> }) {
  const { username } = await params.params;
  const curr = await currentUser();

  const user = await prisma.user.findFirst({
    where: { name: username },
    select: { id: true },
  });

  if (!user) return notFound();

  const isOwn = curr?.id === user.id;

  const [
    userProgress,
    solvedQuestions,
    discussions,
    comments,
    discussionsCount,
    commentsCount,
    categories, // ✅ Added categories back
    companies,
    currUser,
  ] = await Promise.all([
    // A. Progress
    prisma.userProgress.findMany({
      where: { userId: user.id, status: QuestionStatusType.completed },
      select: { questionId: true, updatedAt: true },
    }),

    // B. Solved Questions
    prisma.userProgress.findMany({
      where: { userId: user.id, status: QuestionStatusType.completed },
      orderBy: { updatedAt: "desc" },
      include: {
        question: {
          select: { id: true, title: true, difficulty: true, externalPlatformUrl: true },
        },
      },
    }),

    // C. Discussions
    prisma.discussion.findMany({
      where: { authorId: user.id },
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { comments: true } } },
    }),

    // D. Comments
    prisma.comment.findMany({
      where: { authorId: user.id },
      orderBy: { createdAt: "desc" },
      include: { discussion: { select: { id: true, title: true } } },
    }),

    prisma.discussion.count({ where: { authorId: user.id } }),
    prisma.comment.count({ where: { authorId: user.id } }),

    // ✅ Categories
    prisma.category.findMany({ include: { questions: { select: { id: true } } } }),

    // Companies
    prisma.company.findMany({ include: { questions: { select: { id: true } } } }),

    prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        firstName: true,
        lastName: true,
        bio: true,
        profileUrl: true,
        email: true,
        createdAt: true,
        socialLinks: true,
      },
    }),
  ]);

  if (!currUser) return notFound();

  // --- DATA PROCESSING ---

  // 1. Total Solved Count
  const solvedSet = new Set(userProgress.map((p) => p.questionId));
  const totalSolved = solvedSet.size;

  // 2. Activity Heatmap
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

  // 3. Difficulty Stats
  const easySolved = solvedQuestions.filter((q) => q.question.difficulty === "Easy").length;
  const medSolved = solvedQuestions.filter((q) => q.question.difficulty === "Medium").length;
  const hardSolved = solvedQuestions.filter((q) => q.question.difficulty === "Hard").length;

  const difficultyStats = [
    { name: "Easy", value: easySolved, color: "#22c55e" },
    { name: "Medium", value: medSolved, color: "#eab308" },
    { name: "Hard", value: hardSolved, color: "#ef4444" },
  ];

  // 4. ✅ Category Stats (Restored Logic)
  const categoryStats = categories
    .map((cat) => {
      const total = cat.questions.length;
      const solved = cat.questions.filter((q) => solvedSet.has(q.id)).length;
      return {
        name: cat.name,
        total,
        solved,
      };
    })
    .filter((c) => c.total > 0);

  // 5. Company Stats
  const companyStats = companies
    .map((comp) => {
      const total = comp.questions.length;
      const solved = comp.questions.filter((q) => solvedSet.has(q.id)).length;
      return {
        id: comp.id,
        name: comp.name,
        logo: comp.logo!,
        total,
        solved,
      };
    })
    .filter((c) => c.solved > 0)
    .sort((a, b) => b.solved - a.solved);

  // 6. Reputation
  const discussionLikes = discussions.reduce((acc, d) => acc + (d.likeCount || 0), 0);
  const discussionDislikes = discussions.reduce((acc, d) => acc + (d.dislikeCount || 0), 0);
  const commentLikes = comments.reduce((acc, c) => acc + (c.likeCount || 0), 0);
  const commentDislikes = comments.reduce((acc, c) => acc + (c.dislikeCount || 0), 0);

  const reputation = calculateReputation({
    solvedEasy: easySolved,
    solvedMedium: medSolved,
    solvedHard: hardSolved,
    discussionUpvotes: discussionLikes,
    discussionDownvotes: discussionDislikes,
    commentUpvotes: commentLikes,
    commentDownvotes: commentDislikes,
    acceptedAnswers: totalSolved,
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
            reputation: reputation,
          }}
          isOwnProfile={isOwn}
        />

        <BeltProgress totalSolved={totalSolved} />

        <ProfileCharts
          difficultyStats={difficultyStats}
          categoryStats={categoryStats} // ✅ Passed prop
          totalSolved={totalSolved}
          companyStats={companyStats}
          activityData={activityData}
          isCurrentUser={isOwn}
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
