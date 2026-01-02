import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ProfileCharts } from "@/components/User/ProfileCharts";
import { BeltProgress } from "@/components/User/BeltCollection";
import { UserDetails } from "@/components/User/UserDetails";
import { QuestionStatusType } from "@/generated/prisma/client";
import { ProfileActivityTabs } from "@/components/User/ProfileActivityTabs";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await currentUser();
  if (!user) return redirect("/sign-in");

  // 1. FETCH DATA
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
    // A. Solved Questions
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
      include: { _count: { select: { comments: true } } },
    }),

    // D. Comments List
    prisma.comment.findMany({
      where: { authorId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        discussion: { select: { id: true, title: true } },
      },
    }),
    // B. Discussion Count
    prisma.discussion.count({
      where: { authorId: user.id },
    }),

    // C. Comment Count
    prisma.comment.count({
      where: { authorId: user.id },
    }),

    // D. Metadata
    prisma.category.findMany({ include: { questions: { select: { id: true } } } }),
    prisma.company.findMany({ include: { questions: { select: { id: true } } } }),
  ]);

  // 2. PREPARE DATA
  const solvedSet = new Set(userProgress.map((p) => p.questionId));
  const totalSolved = solvedSet.size;

  // Prepare Chart Data (Same logic as before)
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
    },
  });
  if (!currUser) return null;
  return (
    <div className="min-h-screen bg-[#0f0b0a] text-[#eaddcf] py-12">
      <div className="container mx-auto px-4 max-w-6xl space-y-16">
        {/* --- SECTION 0: USER DETAILS (NEW) --- */}
        <UserDetails
          user={currUser}
          stats={{
            solved: totalSolved,
            discussions: discussionsCount,
            comments: commentsCount,
          }}
        />

        {/* --- SECTION 1: BELT PROGRESS --- */}
        <BeltProgress totalSolved={totalSolved} />

        {/* --- SECTION 2: CHARTS --- */}
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
      </div>
    </div>
  );
}
