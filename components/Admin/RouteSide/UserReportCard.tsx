"use client";

import { useState } from "react";
import Image from "next/image";
import { ShieldAlert, EyeOff, Gavel, XCircle, Loader2, Unlock, UserX, Ghost } from "lucide-react";
import { toast } from "sonner";
import {
  dismissReport,
  banUser,
  unbanUser,
  shadowbanUser,
} from "@/app/(admin)/(protected)/_actions";

interface UserReportProps {
  report: {
    id: string;
    reason: string;
    createdAt: Date;
    reporter: {
      firstName: string | null;
      lastName: string | null;
      profileUrl: string | null;
    };
    reported: {
      id: string;
      firstName: string | null;
      lastName: string | null;
      profileUrl: string | null;
      email: string;
      isBanned?: boolean; // Optional fields from your Prisma User model
      isShadowbanned?: boolean;
    };
  };
}

export function UserReportCard({ report }: UserReportProps) {
  const [loading, setLoading] = useState(false);

  // Derive display names
  const reporterName = report.reporter.firstName
    ? `${report.reporter.firstName} ${report.reporter.lastName || ""}`
    : "Unknown Ronin";

  const reportedName = report.reported.firstName
    ? `${report.reported.firstName} ${report.reported.lastName || ""}`
    : "Unknown User";

  const handleAction = async (action: "dismiss" | "ban" | "unban" | "shadowban") => {
    setLoading(true);
    try {
      let res;

      switch (action) {
        case "dismiss":
          await dismissReport(report.id);
          toast.success("Report dismissed");
          break;
        case "ban":
          res = await banUser(report.reported.id, report.id);
          if (res?.success) toast.success(res.message);
          else toast.error(res?.message || "Action failed");
          break;
        case "unban":
          res = await unbanUser(report.reported.id);
          if (res?.success) toast.success(res.message);
          else toast.error(res?.message || "Action failed");
          break;
        case "shadowban":
          // Default to 7 days
          res = await shadowbanUser(report.reported.id, report.id, 7);
          if (res?.success) toast.success(res.message);
          else toast.error(res?.message || "Action failed");
          break;
      }
    } catch (err) {
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1a110d] border border-[#3e2723] rounded-xl p-5 shadow-lg group hover:border-[#d4af37]/30 transition-all relative overflow-hidden">
      {/* STATUS BADGES (Visual indicators if they are already punished) */}
      <div className="absolute top-2 right-2 flex gap-1">
        {report.reported.isBanned && (
          <div className="bg-red-900/40 text-red-500 text-[10px] font-bold px-2 py-0.5 rounded border border-red-900 flex items-center gap-1">
            <UserX size={10} /> BANNED
          </div>
        )}
        {report.reported.isShadowbanned && (
          <div className="bg-orange-900/40 text-orange-500 text-[10px] font-bold px-2 py-0.5 rounded border border-orange-900 flex items-center gap-1">
            <Ghost size={10} /> SHADOW
          </div>
        )}
      </div>

      {/* HEADER: Reporter vs Reported */}
      <div className="flex flex-col gap-3 mb-4 pb-4 border-b border-[#3e2723]">
        {/* REPORTED USER (The Target) */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-[#d4af37]/10 border border-[#d4af37]/30 shrink-0">
            {report.reported.profileUrl ? (
              <Image
                src={report.reported.profileUrl}
                alt="Reported"
                width={40}
                height={40}
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#d4af37]">
                <UserX size={20} />
              </div>
            )}
          </div>
          <div>
            <h3 className="text-[#eaddcf] font-bold text-sm leading-tight">{reportedName}</h3>
            <p className="text-[#a1887f] text-xs font-mono">{report.reported.email}</p>
          </div>
        </div>

        {/* CONNECTION LINE */}
        <div className="flex items-center gap-2 text-[10px] text-[#5d4037] font-mono uppercase tracking-widest pl-4 border-l border-[#3e2723]">
          <span>Reported by</span>
          <span className="text-[#8d6e63] font-bold">{reporterName}</span>
          <span>•</span>
          <span>{new Date(report.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* REASON BODY */}
      <div className="bg-[#0f0b0a] p-3 rounded-lg border border-[#3e2723] mb-6">
        <div className="flex items-start gap-2">
          <ShieldAlert size={16} className="text-[#d4af37] mt-0.5 shrink-0" />
          <p className="text-sm text-[#eaddcf] italic leading-relaxed">"{report.reason}"</p>
        </div>
      </div>

      {/* ACTION GRID */}
      <div className="grid grid-cols-2 gap-2">
        {/* Dismiss */}
        <button
          disabled={loading}
          onClick={() => handleAction("dismiss")}
          className="col-span-2 flex items-center justify-center p-2 rounded bg-[#3e2723]/20 text-[#a1887f] hover:bg-[#3e2723] hover:text-[#eaddcf] transition-colors text-xs font-medium gap-2 disabled:opacity-50"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
          Dismiss Report
        </button>

        {/* Shadowban (7 Days) */}
        <button
          disabled={loading}
          onClick={() => handleAction("shadowban")}
          className="flex flex-col items-center justify-center p-3 rounded bg-[#3e2723]/20 text-[#a1887f] hover:bg-orange-900/20 hover:text-orange-500 border border-transparent hover:border-orange-900/30 transition-all text-xs gap-1 disabled:opacity-50"
          title="Shadowban for 7 days"
        >
          <EyeOff size={16} />
          <span className="font-bold">7d Shadow</span>
        </button>

        {/* Ban / Unban Logic */}
        {report.reported.isBanned ? (
          <button
            disabled={loading}
            onClick={() => handleAction("unban")}
            className="flex flex-col items-center justify-center p-3 rounded bg-green-900/10 text-green-600 hover:bg-green-900/20 hover:text-green-500 border border-transparent hover:border-green-900/30 transition-all text-xs gap-1 disabled:opacity-50"
          >
            <Unlock size={16} />
            <span className="font-bold">Unban User</span>
          </button>
        ) : (
          <button
            disabled={loading}
            onClick={() => handleAction("ban")}
            className="flex flex-col items-center justify-center p-3 rounded bg-[#3e2723]/20 text-[#a1887f] hover:bg-red-900/20 hover:text-red-500 border border-transparent hover:border-red-900/30 transition-all text-xs gap-1 disabled:opacity-50"
          >
            <Gavel size={16} />
            <span className="font-bold">Perm Ban</span>
          </button>
        )}
      </div>
    </div>
  );
}
