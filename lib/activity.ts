import { format, startOfDay, subDays } from "date-fns";
import { prisma } from "./prisma";

export const getWeeklyStats = async () => {
  try {
    const startDate = subDays(new Date(), 6);

    const [newUsers, newScrolls] = await prisma.$transaction([
      prisma.user.findMany({
        where: {
          createdAt: { gte: startOfDay(startDate) },
        },
        select: { createdAt: true },
      }),

      prisma.discussions.findMany({
        where: { createdAt: { gte: startOfDay(startDate) } },
        select: { createdAt: true },
      }),
    ]);

    const chartData = [];

    for (let i = 0; i < 7; i++) {
      const date = subDays(new Date(), 6 - i);
      const dayLabel = format(date, "EEE");

      const userCount = newUsers.filter(
        (user) => format(user.createdAt!, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
      ).length;

      const scrollCount = newScrolls.filter(
        (scroll) => format(scroll.createdAt, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
      ).length;

      chartData.push({
        day: dayLabel,
        users: userCount,
        scrolls: scrollCount,
      });
    }

    return chartData;
  } catch (error: any) {
    throw new Error("Error occured in getting weekly data", error);
  }
};
