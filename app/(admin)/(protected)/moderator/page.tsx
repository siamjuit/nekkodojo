import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  ScrollText,
  MessageSquareWarning,
  ArrowRight,
  LayoutDashboard,
  MessageSquareText,
} from "lucide-react";

export default async function ModeratorWelcomePage() {
  const user = await currentUser();
  const role = user?.publicMetadata.role as string;
  if (!user || (role !== "admin" && role !== "moderator")) {
    redirect("/");
  }

  const moderatorModules = [
    {
      title: "Guardian Dashboard",
      description: "Overview of active disturbances and content stats.",
      href: "/moderator/dashboard",
      icon: LayoutDashboard,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      border: "hover:border-blue-400/50",
    },
    {
      title: "Scrolls Library",
      description: "Patrol the library and review new inscriptions.",
      href: "/moderator/content",
      icon: ScrollText,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      border: "hover:border-emerald-400/50",
    },
    {
      title: "Inscriptions",
      description: "Monitor disciple chatter and erase dishonorable words.",
      href: "/moderator/comments",
      icon: MessageSquareText,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
      border: "hover:border-purple-400/50",
    },
    {
      title: "The Tribunal",
      description: "Judge reported content and restore balance.",
      href: "/moderator/reports",
      icon: MessageSquareWarning,
      color: "text-red-400",
      bg: "bg-red-400/10",
      border: "hover:border-red-400/50",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      {/* Hero Section */}
      <div className="max-w-4xl w-full text-center space-y-6 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="inline-flex items-center justify-center p-4 rounded-full bg-[#3e2723]/30 border border-[#3e2723] mb-4">
          <ShieldCheck size={48} className="text-[#d4af37]" />
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-[#eaddcf] tracking-tight">
          Welcome, <span className="text-[#d4af37]">Guardian</span>
        </h1>
        <p className="text-xl text-[#a1887f] max-w-2xl mx-auto">
          The dojo relies on your vigilance. Maintain peace and order within the clan.
        </p>
      </div>

      {/* Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
        {moderatorModules.map((module) => (
          <Link
            key={module.title}
            href={module.href}
            className={`group relative overflow-hidden rounded-2xl border border-[#3e2723] bg-[#1a110d] p-8 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${module.border}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${module.bg} ${module.color}`}>
                <module.icon size={28} />
              </div>
              <ArrowRight className="text-[#3e2723] group-hover:text-[#eaddcf] transition-colors" />
            </div>

            <h3 className="text-xl font-bold text-[#eaddcf] mb-2 group-hover:text-[#d4af37] transition-colors">
              {module.title}
            </h3>
            <p className="text-[#a1887f] text-sm leading-relaxed">{module.description}</p>

            {/* Hover Gradient Overlay */}
            <div
              className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none bg-linear-to-br from-current to-transparent ${module.color}`}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
