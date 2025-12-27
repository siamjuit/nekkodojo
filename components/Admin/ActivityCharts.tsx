"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface ChartDataPoint {
  day: string;
  users: number;
  scrolls: number;
}

const chartConfig = {
  users: {
    label: "New Disciples",
    color: "#3b82f6",
  },
  scrolls: {
    label: "New Scrolls",
    color: "#d4af37",
  },
} satisfies ChartConfig;

export function ActivityChart({ chartData }: { chartData: ChartDataPoint[] }) {
  return (
    <Card className="border border-[#3e2723] bg-[#1a110d] text-[#eaddcf]">
      <CardHeader>
        <CardTitle className="text-[#d4af37]">Weekly Activity</CardTitle>
        <CardDescription className="text-[#a1887f]">
          New disciples and scrolls over the last 7 days.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} stroke="#3e2723" strokeDasharray="3 3" />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tick={{ fill: "#a1887f" }}
            />
            <ChartTooltip
              cursor={{ fill: "#3e2723", opacity: 0.4 }}
              content={
                <ChartTooltipContent
                  className="bg-[#1a110d] border-[#3e2723] shadow-xl"
                  labelClassName="text-[#d4af37] font-bold mb-1"
                  formatter={(value, name) => (
                    <div className="flex min-w-[120px] items-center gap-2 text-xs text-[#eaddcf]">
                      <div
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: name === "users" ? "#3b82f6" : "#d4af37" }}
                      />
                      <span className="text-[#a1887f] capitalize">
                        {name === "users" ? "Disciples" : "Scrolls"}:
                      </span>
                      <span className="ml-auto font-mono font-bold text-[#eaddcf]">{value}</span>
                    </div>
                  )}
                />
              }
            />
            <Bar dataKey="users" fill="var(--color-users)" radius={4} />
            <Bar dataKey="scrolls" fill="var(--color-scrolls)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
