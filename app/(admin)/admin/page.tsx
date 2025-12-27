import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  ScrollText,
  MessageSquareWarning,
  Settings,
  ShieldAlert,
  ArrowRight,
  Feather,
} from "lucide-react";
import { checkRole } from "@/utils/roles";

export default async function AdminWelcomePage() {
  const user = await currentUser();

  // Security Check
  if (!user || !checkRole("admin")) {
    redirect("/");
  }

  const adminModules = [
    {
      title: "Command Center",
      description: "View vital statistics and recent dojo activity.",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      border: "hover:border-blue-400/50",
    },
    {
      title: "Disciples",
      description: "Manage users, promote roles, and banish bots.",
      href: "/admin/users",
      icon: Users,
      color: "text-[#d4af37]",
      bg: "bg-[#d4af37]/10",
      border: "hover:border-[#d4af37]/50",
    },
    {
      title: "Scrolls Library",
      description: "Moderate discussions and burn spam scrolls.",
      href: "/admin/content",
      icon: ScrollText,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      border: "hover:border-emerald-400/50",
    },
    {
      title: "The Tribunal",
      description: "Review reports and judge rule-breakers.",
      href: "/admin/reports",
      icon: MessageSquareWarning,
      color: "text-red-400",
      bg: "bg-red-400/10",
      border: "hover:border-red-400/50",
    },
    {
      title: "Katas",
      description: "Create and manage katas to test your disciples.",
      href: "/admin/questions",
      icon: Feather,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
      border: "hover:border-purple-400/50",
    },
    {
      title: "Dojo Settings",
      description: "Configure system preferences and global alerts.",
      href: "/admin/settings",
      icon: Settings,
      color: "text-[#a1887f]",
      bg: "bg-[#a1887f]/10",
      border: "hover:border-[#a1887f]/50",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      {/* Hero Section */}
      <div className="max-w-4xl w-full text-center space-y-6 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="inline-flex items-center justify-center p-4 rounded-full bg-[#3e2723]/30 border border-[#3e2723] mb-4">
          <ShieldAlert size={48} className="text-[#d4af37]" />
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-[#eaddcf] tracking-tight">
          Welcome, <span className="text-[#d4af37]">Sensei</span>
        </h1>
        <p className="text-xl text-[#a1887f] max-w-2xl mx-auto">
          You have entered the inner sanctum of the Nekodojo. Where would you like to direct your
          attention today?
        </p>
      </div>

      {/* Navigation Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
        {adminModules.map((module) => (
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
