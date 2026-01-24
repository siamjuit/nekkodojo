"use client";

import { useState } from "react";
import Link from "next/link";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp, Trophy } from "lucide-react";
import { getCategoryColor } from "@/constants/get-colors"; 

// Types
interface CategoryStat {
  name: string;
  solved: number;
  total: number;
}

interface CompanyStat {
  id: string;
  name: string;
  logo: string;
  solved: number;
  total: number;
}

interface DifficultyStat {
  name: string;
  value: number;
  color: string;
}

interface ProfileChartsProps {
  difficultyStats: DifficultyStat[];
  categoryStats: CategoryStat[]; // ✅ Restored Prop
  totalSolved: number;
  companyStats: CompanyStat[];
  activityData?: any[];
  isCurrentUser: boolean;
}

export default function ProfileCharts({
  difficultyStats,
  categoryStats,
  totalSolved,
  companyStats,
  isCurrentUser,
}: ProfileChartsProps) {
  const [expandCategories, setExpandCategories] = useState(false);
  const [expandCompanies, setExpandCompanies] = useState(false);

  // Logic for expanding lists
  const visibleCategories = expandCategories ? categoryStats : categoryStats.slice(0, 3);
  const visibleCompanies = expandCompanies ? companyStats : companyStats.slice(0, 5);

  const hasSolvedAny = totalSolved > 0;

  // --- EMPTY STATE ---
  if (!hasSolvedAny) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border border-dashed border-[#3e2723] rounded-xl bg-[#1a110d]/30 text-center">
        <div className="bg-[#3e2723]/30 p-4 rounded-full mb-4">
          <Trophy className="w-8 h-8 text-[#5d4037]" />
        </div>
        {isCurrentUser ? (
          <div className="space-y-2">
            <h3 className="text-[#eaddcf] font-bold text-lg">Your journey begins now</h3>
            <p className="text-[#a1887f] text-sm max-w-md mx-auto">
              You haven't solved any katas yet. The dojo awaits your first contribution.
            </p>
            <Button asChild className="mt-4 bg-[#d4af37] text-black hover:bg-[#b5952f]">
              <Link href="/problems">Start Training</Link>
            </Button>
          </div>
        ) : (
          <div>
            <h3 className="text-[#a1887f] font-medium">
              This Ronin has not started their training yet.
            </h3>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* --- SECTION 1: DIFFICULTY MASTERY (Big Chart) --- */}
      <section className="space-y-6">
        <h3 className="text-xl font-bold text-[#eaddcf]">Dojo Mastery</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CHART CARD */}
          <Card className="bg-[#1a110d] border-[#3e2723] p-6 flex flex-col items-center justify-center relative min-h-[300px]">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={difficultyStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {difficultyStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: "#1a110d",
                    borderColor: "#3e2723",
                    color: "#eaddcf",
                    borderRadius: "8px",
                  }}
                  itemStyle={{ color: "#eaddcf" }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-4xl font-black text-[#eaddcf]">{totalSolved}</span>
              <span className="text-xs text-[#a1887f] uppercase tracking-widest font-bold">
                Solved
              </span>
            </div>
          </Card>

          {/* LEGEND CARD */}
          <Card className="bg-[#1a110d] border-[#3e2723] p-6 flex flex-col justify-center space-y-6">
            {difficultyStats.map((stat) => (
              <div key={stat.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-bold text-[#eaddcf]">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: stat.color }}
                    />
                    {stat.name}
                  </span>
                  <span className="text-[#a1887f] font-mono">{stat.value} Solved</span>
                </div>
                <div className="h-2 w-full bg-[#0f0b0a] rounded-full overflow-hidden border border-[#3e2723]">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${totalSolved > 0 ? (stat.value / totalSolved) * 100 : 0}%`,
                      backgroundColor: stat.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </Card>
        </div>
      </section>

      {/* --- SECTION 2: CATEGORIES (Restored) --- */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-[#eaddcf]">Mastery by Category</h3>
          {categoryStats.length > 3 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpandCategories(!expandCategories)}
              className="text-[#d4af37] hover:bg-[#3e2723]/20"
            >
              {expandCategories ? (
                <>
                  <ChevronUp className="w-4 h-4 mr-1" /> Show Less
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4 mr-1" /> Show More
                </>
              )}
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleCategories.map((cat, idx) => {
            const percentage = Math.round((cat.solved / cat.total) * 100) || 0;
            const color = getCategoryColor(idx);

            return (
              <Card
                key={cat.name}
                className="bg-[#1a110d] border-[#3e2723] p-4 flex items-center gap-4"
              >
                <div className="relative w-16 h-16 shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[{ value: cat.solved }, { value: cat.total - cat.solved }]}
                        cx="50%"
                        cy="50%"
                        innerRadius={22}
                        outerRadius={30}
                        startAngle={90}
                        endAngle={-270}
                        dataKey="value"
                        stroke="none"
                      >
                        <Cell fill={color} />
                        <Cell fill="#3e2723" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-[#eaddcf]">
                    {percentage}%
                  </div>
                </div>

                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[#eaddcf]">{cat.name}</span>
                  <span className="text-xs text-[#a1887f]">
                    {cat.solved} / {cat.total} Solved
                  </span>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* --- SECTION 3: COMPANIES --- */}
      {companyStats.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#eaddcf]">Great Houses Challenged</h3>
            {companyStats.length > 5 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpandCompanies(!expandCompanies)}
                className="text-[#d4af37] hover:bg-[#3e2723]/20"
              >
                {expandCompanies ? (
                  <>
                    <ChevronUp className="w-4 h-4 mr-1" /> Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 mr-1" /> Show More
                  </>
                )}
              </Button>
            )}
          </div>

          <Card className="bg-[#1a110d] border-[#3e2723] p-6 pr-0 overflow-hidden">
            <div
              style={{ height: `${visibleCompanies.length * 60}px` }}
              className="w-full transition-all duration-500"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={visibleCompanies}
                  margin={{ top: 0, right: 30, left: 40, bottom: 0 }}
                  barSize={20}
                >
                  <XAxis type="number" hide />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tick={<CustomCompanyTick data={visibleCompanies} />}
                    width={150}
                    interval={0}
                  />
                  <RechartsTooltip
                    cursor={{ fill: "#3e2723", opacity: 0.2 }}
                    contentStyle={{
                      backgroundColor: "#1a110d",
                      borderColor: "#3e2723",
                      color: "#eaddcf",
                    }}
                    itemStyle={{ color: "#d4af37" }}
                  />
                  <Bar dataKey="total" fill="#3e2723" radius={[0, 4, 4, 0]} stackId="a" />
                  <Bar dataKey="solved" fill="#d4af37" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </section>
      )}
    </div>
  );
}

const CustomCompanyTick = ({ x, y, payload, data }: any) => {
  const company = data[payload.index];
  return (
    <g transform={`translate(${x},${y})`}>
      <foreignObject x="-40" y="-12" width="24" height="24">
        <div className="w-6 h-6 rounded-full overflow-hidden relative">
          <img src={company.logo} alt={company.name} className="object-contain w-full h-full p-0.5" />
        </div>
      </foreignObject>
      <text x="-50" y="4" dy="0" textAnchor="end" fill="#a1887f" fontSize="12px" fontWeight="500">
        {company.name}
      </text>
    </g>
  );
};
