import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { ProfileCharts } from "@/components/User/ProfileCharts";
import { BeltProgress } from "@/components/User/BeltCollection";
import { UserDetails } from "@/components/User/UserDetails";
import { QuestionStatusType } from "@/generated/prisma/client";
import { ProfileActivityTabs } from "@/components/User/ProfileActivityTabs";
import DeleteProgress from "@/components/User/DeleteProgress";

export const dynamic = "force-dynamic";

export default async function ProfilePage(params: { params: Promise<{ username: string }> }) {
  const { username } = await params.params;
  const curr = await currentUser();
  if (!curr) return null;
  const user = await prisma.user.findFirst({
    where: { name: username },
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
  });

  if (!user) {
    return notFound();
  }
  const isOwn = curr.id === user.id;
  const [
    userProgress,
    solvedQuestions,
    discussions,
    comments,
    discussionsCount,
    commentsCount,
    categories,
    companies,
  ] = await Promise.all([
    prisma.userProgress.findMany({
      where: { userId: user.id, status: QuestionStatusType.completed },
      select: { questionId: true, updatedAt: true },
    }),

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

    prisma.discussion.findMany({
      where: { authorId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { comments: true } },
        // IMPORTANT: Include likeCount/dislikeCount if your updated tabs component relies on them
      },
    }),

    prisma.comment.findMany({
      where: { authorId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        discussion: { select: { id: true, title: true } },
      },
    }),
    prisma.discussion.count({
      where: { authorId: user.id },
    }),

    prisma.comment.count({
      where: { authorId: user.id },
    }),

    prisma.category.findMany({ include: { questions: { select: { id: true } } } }),
    prisma.company.findMany({ include: { questions: { select: { id: true } } } }),
  ]);

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

  const currUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      name: true,
      firstName: true,
      lastName: true,
      bio: true,
      profileUrl: true,
      email: true,
      createdAt: true,
      socialLinks: true,
    },
  });
  if (!currUser) return null;

  return (
    // UPDATED: Adjusted vertical padding (py) for responsiveness
    <div className="min-h-screen bg-[#0f0b0a] text-[#eaddcf] py-8 md:py-12">
      {/* UPDATED: Adjusted vertical spacing (space-y) for responsiveness */}
      <div className="container mx-auto px-4 max-w-6xl space-y-8 md:space-y-16">
        <UserDetails
          user={currUser}
          stats={{
            solved: totalSolved,
            discussions: discussionsCount,
            comments: commentsCount,
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
