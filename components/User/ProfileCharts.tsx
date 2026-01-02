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
  CartesianGrid 
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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

export function ProfileCharts({ activityData, categoryStats, companyStats }: Props) {
  return (
    <div className="space-y-8">
      
      {/* 1. ACTIVITY GRAPH (Line Chart) */}
      <Card className="bg-[#1a110d] border-[#3e2723]">
        <CardHeader>
          <CardTitle className="text-[#eaddcf]">Activity Log (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} opacity={0.5} />
              <XAxis 
                dataKey="date" 
                stroke="#a1887f" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false}
              />
              <YAxis 
                stroke="#a1887f" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                allowDecimals={false}
              />
              <Tooltip 
                cursor={{ stroke: "#d4af37", strokeWidth: 1 }}
                // FIX: High zIndex to prevent overlap
                wrapperStyle={{ outline: 'none', zIndex: 1000 }}
                // FIX: Solid background and visible text colors
                contentStyle={{ 
                  backgroundColor: "#1a110d", 
                  border: "1px solid #3e2723", 
                  borderRadius: "8px",
                  color: "#eaddcf" 
                }}
                labelStyle={{ color: "#a1887f", marginBottom: "0.25rem" }}
                itemStyle={{ color: "#d4af37", fontWeight: "bold" }}
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke={COLORS.line} 
                strokeWidth={3} 
                dot={{ fill: "#0f0b0a", stroke: COLORS.line, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: COLORS.line }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 2. CATEGORY DONUTS */}
      <section>
        <h3 className="text-xl font-bold text-[#eaddcf] mb-4 pl-1 border-l-4 border-[#d4af37]">Category Mastery</h3>
        <div className="flex flex-wrap gap-6 justify-center sm:justify-start">
          {categoryStats.map((stat) => (
            <DonutCard key={stat.name} stat={stat} />
          ))}
        </div>
      </section>

      {/* 3. COMPANY DONUTS */}
      <section>
        <h3 className="text-xl font-bold text-[#eaddcf] mb-4 pl-1 border-l-4 border-[#d4af37]">Company Badges</h3>
        <div className="flex flex-wrap gap-6 justify-center sm:justify-start">
          {companyStats.map((stat) => (
            <DonutCard key={stat.name} stat={stat} />
          ))}
        </div>
      </section>
    </div>
  );
}

// --- REUSABLE DYNAMIC DONUT ---
function DonutCard({ stat }: { stat: TopicStat }) {
  // LOGIC: Dimensional Sizing based on Total Questions
  // Min Size: 80px, Max Size: 160px
  const size = Math.min(Math.max(stat.total * 3, 100), 180); 
  const outerRadius = size / 2;
  const innerRadius = outerRadius - 8; // Thickness of ring

  const data = [
    { name: "Solved", value: stat.solved },
    { name: "Remaining", value: stat.total - stat.solved },
  ];

  // If 0 total (edge case), ensure we don't render NaN
  if (stat.total === 0) return null;

  return (
    <div className="flex flex-col items-center gap-2">
      <div 
        className="relative flex items-center justify-center transition-all hover:scale-105"
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
            >
              <Cell key="solved" fill={COLORS.solved} />
              <Cell key="remaining" fill={COLORS.remaining} />
            </Pie>
            <Tooltip 
               // FIX: Clean formatter for tooltip text
               formatter={(val: number) => [`${val} Questions`, '']}
               // FIX: Ensure tooltip is visible and on top
               wrapperStyle={{ outline: 'none', zIndex: 1000 }}
               contentStyle={{ 
                 backgroundColor: "#1a110d", 
                 borderColor: "#3e2723", 
                 borderRadius: "6px",
                 color: "#eaddcf", 
                 fontSize: "12px",
                 padding: "8px 12px"
               }}
               itemStyle={{ color: "#d4af37", fontWeight: "600" }}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Centered Percentage Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[#eaddcf] font-bold" style={{ fontSize: size * 0.2 }}>
            {stat.percent}%
          </span>
        </div>
      </div>
      
      {/* Label */}
      <div className="text-center">
        <p className="text-[#eaddcf] font-medium text-sm truncate max-w-[150px]">{stat.name}</p>
        <p className="text-[#5d4037] text-xs font-mono">{stat.solved} / {stat.total}</p>
      </div>
    </div>
  );
}