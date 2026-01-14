"use client";

import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query"; 

// --- TYPES ---
interface TopicStat {
  name: string;
  total: number;
  solved: number;
  percent: number;
}

interface ActivityData {
  date: string;
  count: number;
}

interface Props {
  activityData: ActivityData[];
  categoryStats: TopicStat[];
  companyStats: TopicStat[];
}

// --- COLORS ---
const COLORS = {
  solved: "#22c55e", // Green-500
  remaining: "#3e2723", // Dark Brown (Unsolved)
  line: "#d4af37", // Gold
  grid: "#3e2723", // Grid lines
};

export function ProfileCharts({
  activityData,
  categoryStats,
  companyStats,
}: Props) {
  return (
    <div className="space-y-8 md:space-y-12">
      {/* 1. ACTIVITY GRAPH (Line Chart) */}
      <Card className="bg-[#1a110d] border-[#3e2723]">
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-lg md:text-xl text-[#eaddcf]">
            Activity Log (Last 30 Days)
          </CardTitle>
        </CardHeader>
        {/* Responsive Height: 250px on Mobile, 350px on Desktop */}
        <CardContent className="h-[250px] md:h-[350px] w-full p-2 md:p-6 pt-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={activityData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={COLORS.grid}
                opacity={0.5}
              />
              <XAxis
                dataKey="date"
                stroke="#a1887f"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                // Show fewer ticks on mobile if needed, usually recharts handles this well
              />
              <YAxis
                stroke="#a1887f"
                fontSize={10}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
                width={30}
              />
              <Tooltip
                cursor={{ stroke: "#d4af37", strokeWidth: 1 }}
                wrapperStyle={{ outline: "none", zIndex: 1000 }}
                contentStyle={{
                  backgroundColor: "#1a110d",
                  border: "1px solid #3e2723",
                  borderRadius: "8px",
                  color: "#eaddcf",
                  fontSize: "12px",
                }}
                labelStyle={{ color: "#a1887f", marginBottom: "0.25rem" }}
                itemStyle={{ color: "#d4af37", fontWeight: "bold" }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke={COLORS.line}
                strokeWidth={3}
                dot={{
                  fill: "#0f0b0a",
                  stroke: COLORS.line,
                  strokeWidth: 2,
                  r: 3,
                }}
                activeDot={{ r: 5, fill: COLORS.line }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 2. CATEGORY DONUTS */}
      <section>
        <h3 className="text-lg md:text-xl font-bold text-[#eaddcf] mb-6 pl-3 border-l-4 border-[#d4af37]">
          Category Mastery
        </h3>
        {/* Responsive Grid: 2 columns on mobile, auto-fit on desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-8 gap-x-4">
          {categoryStats.map((stat) => (
            <div key={stat.name} className="flex justify-center">
              <DonutCard stat={stat} />
            </div>
          ))}
        </div>
      </section>

      {/* 3. COMPANY DONUTS */}
      <section>
        <h3 className="text-lg md:text-xl font-bold text-[#eaddcf] mb-6 pl-3 border-l-4 border-[#d4af37]">
          Company Badges
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-8 gap-x-4">
          {companyStats.map((stat) => (
            <div key={stat.name} className="flex justify-center">
              <DonutCard stat={stat} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

// --- REUSABLE DYNAMIC DONUT ---
function DonutCard({ stat }: { stat: TopicStat }) {
  // Logic: Dimensional Sizing based on Total Questions
  // Adjusted for mobile: slightly smaller minimums
  // Desktop Max: 160px, Mobile Max could be controlled via logic but keeping it consistent is cleaner visually
  const size = Math.min(Math.max(stat.total * 3, 100), 160);
  const outerRadius = size / 2;
  const innerRadius = outerRadius - 8; // Thickness of ring

  const data = [
    { name: "Solved", value: stat.solved },
    { name: "Remaining", value: stat.total - stat.solved },
  ];

  if (stat.total === 0) return null;

  return (
    <div className="flex flex-col items-center gap-2 group">
      <div
        className="relative flex items-center justify-center transition-all duration-300 hover:scale-110"
        style={{ width: size, height: size }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              stroke="none"
              paddingAngle={2}
            >
              <Cell key="solved" fill={COLORS.solved} />
              <Cell key="remaining" fill={COLORS.remaining} />
            </Pie>
            
            <Tooltip
              formatter={(val: number) => [`${val} Questions`, ""]}
              wrapperStyle={{ outline: "none", zIndex: 1000 }}
              contentStyle={{
                backgroundColor: "#1a110d",
                borderColor: "#3e2723",
                borderRadius: "6px",
                color: "#eaddcf",
                fontSize: "12px",
                padding: "8px 12px",
              }}
              itemStyle={{ color: "#d4af37", fontWeight: "600" }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Centered Percentage Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span
            className="text-[#eaddcf] font-bold"
            style={{ fontSize: Math.max(size * 0.2, 14) }}
          >
            {stat.percent}%
          </span>
        </div>
      </div>

      {/* Label */}
      <div className="text-center w-full px-1">
        <p className="text-[#eaddcf] font-medium text-xs md:text-sm truncate w-full group-hover:text-[#d4af37] transition-colors">
          {stat.name}
        </p>
        <p className="text-[#5d4037] text-[10px] md:text-xs font-mono mt-0.5">
          {stat.solved} / {stat.total}
        </p>
      </div>
    </div>
  );
}