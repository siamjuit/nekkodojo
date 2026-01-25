"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { UserProfile } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import {
  Calendar,
  Mail,
  Shield,
  MessageSquare,
  MessageCircle,
  Trophy,
  AtSign,
  Pencil,
  Check,
  X,
  Settings,
  Crown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { BELTS } from "@/constants/belts";
import Link from "next/link";
import Share from "../Discussion/Share";
import SocialsManager from "./SocialManager";
import ReportButton from "./ReportButton";

declare interface Props {
  user: {
    id: string;
    name: string | null;
    firstName: string | null;
    lastName: string | null;
    bio: string | null;
    profileUrl: string | null;
    email: string;
    createdAt: Date;
    socialLinks?: { id: string; platform: string; platformUrl: string }[];
    beltRank: string;
  };
  stats: {
    solved: number;
    discussions: number;
    comments: number;
    reputation: number;
  };
  isOwnProfile?: boolean;
}

// --- CLERK THEME CONFIGURATION ---
const clerkAppearance = {
  baseTheme: dark,
  variables: {
    colorPrimary: "#d4af37", // Gold
    colorBackground: "#0f0b0a", // Dark Dojo
    colorText: "#eaddcf", // Parchment
    colorTextSecondary: "#a1887f", // Bronze
    colorInputBackground: "#1a110d",
    colorInputText: "#eaddcf",
    borderRadius: "0.75rem",
  },
  elements: {
    rootBox: "w-full h-full", // Ensure root takes full space
    card: "border border-[#3e2723] shadow-2xl bg-[#0f0b0a] w-full h-full", // Make card fill container
    navbar: "hidden",
    navbarButton: "text-[#a1887f] hover:text-[#d4af37]",
    headerTitle: "text-[#d4af37] font-bold font-serif",
    headerSubtitle: "text-[#a1887f]",
    socialButtonsBlockButton: "border-[#3e2723] hover:bg-[#1a110d]",
    formButtonPrimary: "bg-[#d4af37] hover:bg-[#b5952f] text-[#0f0b0a]",
    footerActionLink: "text-[#d4af37] hover:text-[#eaddcf]",
    scrollBox: "bg-[#0f0b0a]", // Fix white backgrounds in scroll areas
  },
};

export function UserDetails({ user, stats, isOwnProfile }: Props) {
  const router = useRouter();

  // --- BIO EDITING STATE ---
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState(
    user.bio || "A dedicated ninja training in the art of algorithms."
  );
  const [isSavingBio, setIsSavingBio] = useState(false);

  const joinDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Ninja";
  const email = user.email;
  const currentBelt = BELTS.findLast((b) => b.key === user.beltRank) || BELTS[0];

  const handleSaveBio = async () => {
    setIsSavingBio(true);
    try {
      const res = await fetch("/api/users/bio", {
        method: "PATCH",
        body: JSON.stringify({ bio: bioText }),
      });

      if (!res.ok) throw new Error("Failed to save");

      toast.success("Bio updated successfully");
      setIsEditingBio(false);
      router.refresh();
    } catch (error) {
      toast.error("Failed to update bio");
    } finally {
      setIsSavingBio(false);
    }
  };

  return (
    <div className="w-full bg-[#1a110d] border border-[#3e2723] rounded-3xl overflow-hidden shadow-[0_0_40px_-10px_rgba(0,0,0,0.7)] mb-8 md:mb-10 group/card relative">
      {/* Decorative Corner Accents */}
      <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-[#d4af37]/20 rounded-tl-3xl pointer-events-none" />
      <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-[#d4af37]/20 rounded-tr-3xl pointer-events-none" />

      {/* 1. EXPANDED BANNER */}
      <div className="h-40 md:h-56 w-full relative overflow-hidden">
        {/* Rich Gradient Background */}
        <div className="absolute inset-0 bg-linear-to-b from-[#3e2723] via-[#1a110d] to-[#0f0b0a]" />

        {/* Texture/Pattern Overlay */}
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />

        {/* Gold Glow Effect */}
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top,var(--tw-gradient-stops))] from-[#d4af37]/40 via-transparent to-transparent" />

        {!isOwnProfile && (
          <div className="absolute top-3 md:top-4 left-3 md:left-6 z-10">
            <ReportButton targetUserId={user.id} targetUserName={user.name!} />
          </div>
        )}

        {/* --- TOP RIGHT ACTIONS CONTAINER --- */}
        <div className="absolute top-3 right-3 md:top-4 md:right-6 flex items-center gap-3 z-10">
          {/* Edit Button (Only for Owner) */}
          {isOwnProfile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-[#0f0b0a]/80 border-[#d4af37]/50 px-4 text-[#d4af37] hover:bg-[#d4af37] hover:text-[#0f0b0a] backdrop-blur-md transition-all text-xs md:text-sm h-10 rounded-full shadow-[0_0_15px_-3px_rgba(212,175,55,0.3)]"
                >
                  <Settings className="w-4 h-4" />
                  <span className="hidden sm:inline font-bold">Manage Account</span>
                  <span className="sm:hidden">Edit</span>
                </Button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="w-full sm:max-w-5xl border-l-2 border-[#d4af37] bg-[#0f0b0a] p-0 z-9999 [&>button]:text-[#d4af37] [&>button]:h-8 [&>button]:w-8 [&>button]:bg-[#1a110d] [&>button]:rounded-full [&>button]:border [&>button]:border-[#3e2723] [&>button]:hover:bg-[#d4af37] [&>button]:hover:text-black [&>button]:transition-all [&>button]:top-4 [&>button]:right-4 [&>button_svg]:w-4 [&>button_svg]:h-4"
              >
                <SheetTitle className="sr-only">Edit Profile</SheetTitle>
                <SheetDescription className="sr-only">
                  Update your account settings
                </SheetDescription>

                <div className="h-full w-full flex flex-col items-center justify-center p-4 md:p-8 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-fixed overflow-y-auto">
                  <div className="relative w-full h-full max-h-[800px] flex justify-center">
                    {/* Glow behind the modal */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-[#d4af37]/10 blur-3xl rounded-full -z-10" />

                    <UserProfile routing="hash" appearance={clerkAppearance} />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}
          <div className="h-10 flex items-center">
            <Share />
          </div>
        </div>
      </div>

      <div className="px-4 md:px-12 pb-8 md:pb-12 relative">
        <div className="flex flex-col lg:flex-row gap-8 md:gap-12 -mt-16 md:-mt-24">
          {/* 2. AVATAR COLUMN */}
          <div className="flex flex-col items-center lg:items-start shrink-0 z-10">
            <div className="relative group">
              {/* Spinning Glow Effect */}
              <div className="absolute -inset-1 bg-linear-to-br from-[#d4af37] via-[#b5952f] to-[#3e2723] rounded-full blur-md opacity-70 group-hover:opacity-100 transition duration-700 animate-pulse" />

              {/* Avatar Container */}
              <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-[6px] border-[#0f0b0a] bg-[#0f0b0a] shadow-2xl">
                <Image src={user.profileUrl!} alt={fullName} fill className="object-cover" />
              </div>

              {/* Verified Badge */}
              <div
                className="absolute bottom-2 right-2 md:bottom-4 md:right-4 bg-[#0f0b0a] border border-[#d4af37] rounded-full p-2 shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                title="Verified Ninja"
              >
                <Crown className="w-5 h-5 md:w-7 md:h-7 text-[#d4af37] fill-[#d4af37]" />
              </div>
            </div>
          </div>

          {/* 3. INFO COLUMN */}
          <div className="flex-1 pt-4 md:pt-28 text-center lg:text-left space-y-8">
            {/* Header Info */}
            <div className="space-y-4">
              <div className="flex flex-col lg:flex-row items-center lg:items-end gap-3 md:gap-5">
                <h1 className="text-4xl md:text-6xl font-black bg-clip-text text-white tracking-tight leading-none drop-shadow-lg">
                  {fullName}
                </h1>
                <Badge
                  variant="outline"
                  className={cn(
                    "mb-2 text-xs md:text-sm font-bold border-2 px-4 py-1 rounded-full shadow-lg uppercase tracking-wider",
                    currentBelt.color,
                    "bg-[#0f0b0a]"
                  )}
                >
                  {currentBelt.name}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-3 text-sm text-[#a1887f] font-medium font-mono">
                <Link
                  href={`/member/${user.name}`}
                  className="flex items-center gap-2 text-[#d4af37] hover:underline decoration-[#d4af37]/50 underline-offset-4"
                >
                  <AtSign className="w-4 h-4" /> {user.name}
                </Link>
                <span className="flex items-center gap-2 hover:text-[#eaddcf] transition-colors cursor-default">
                  <Mail className="w-4 h-4" /> {email}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Joined {joinDate}
                </span>
              </div>
            </div>

            {/* --- BIO SECTION (The Scroll) --- */}
            <div className="relative group/bio">
              <div className="absolute inset-0 bg-[#0f0b0a] rounded-xl transform rotate-1 opacity-50 border border-[#3e2723]"></div>
              <div className="relative pl-6 md:pl-8 border-l-4 border-[#d4af37] py-6 px-6 bg-[#1a110d] rounded-r-xl shadow-inner border-y border-r">
                {isOwnProfile && !isEditingBio && (
                  <button
                    onClick={() => setIsEditingBio(true)}
                    className="absolute top-2 right-2 text-[#5d4037] hover:text-[#d4af37] transition-all p-2 hover:bg-[#3e2723]/30 rounded-full"
                    title="Edit Bio"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                )}

                {isOwnProfile && isEditingBio ? (
                  <div className="space-y-4">
                    <Textarea
                      value={bioText}
                      onChange={(e) => setBioText(e.target.value)}
                      className="bg-[#0f0b0a] border-[#3e2723] text-[#eaddcf] focus-visible:ring-[#d4af37] min-h-[120px] text-base font-serif italic"
                      placeholder="Inscribe your journey here..."
                    />
                    <div className="flex justify-end gap-3">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setIsEditingBio(false)}
                        className="text-[#a1887f] hover:text-[#eaddcf] hover:bg-[#3e2723]/20"
                      >
                        <X className="w-4 h-4 mr-2" /> Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSaveBio}
                        disabled={isSavingBio}
                        className="bg-[#d4af37] text-[#0f0b0a] hover:bg-[#b5952f] font-bold"
                      >
                        <Check className="w-4 h-4 mr-2" />{" "}
                        {isSavingBio ? "Inscribing..." : "Save Scroll"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <span className="absolute -top-3 -left-2 text-4xl text-[#3e2723] font-serif">
                      “
                    </span>
                    <p className="text-base md:text-lg text-[#eaddcf] font-serif italic leading-relaxed opacity-90">
                      {bioText}
                    </p>
                    <span className="absolute -bottom-6 right-0 text-4xl text-[#3e2723] font-serif">
                      ”
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* --- SOCIALS MANAGER --- */}
            <div className="max-w-3xl mx-auto lg:mx-0 w-full pt-2">
              <SocialsManager initialLinks={user.socialLinks} isOwnProfile={isOwnProfile} />
            </div>

            {/* 4. STATS GRID (Talismans) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-5xl mx-auto lg:mx-0 pt-4">
              <StatBox
                icon={Trophy}
                label="Solved"
                value={stats.solved}
                color="text-yellow-500"
                glowColor="group-hover:shadow-yellow-500/20 group-hover:border-yellow-500/40"
              />
              <StatBox
                icon={MessageSquare}
                label="Discussions"
                value={stats.discussions}
                color="text-blue-400"
                glowColor="group-hover:shadow-blue-500/20 group-hover:border-blue-400/40"
              />
              <StatBox
                icon={MessageCircle}
                label="Comments"
                value={stats.comments}
                color="text-green-400"
                glowColor="group-hover:shadow-green-500/20 group-hover:border-green-400/40"
              />
              <StatBox
                icon={Shield}
                label="Reputation"
                value={stats.reputation}
                color="text-purple-400"
                glowColor="group-hover:shadow-purple-500/20 group-hover:border-purple-400/40"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBox({ icon: Icon, label, value, color, glowColor }: any) {
  return (
    <div
      className={cn(
        "group flex flex-col items-center justify-center p-4 md:p-6 rounded-2xl bg-[#0f0b0a] border border-[#3e2723] transition-all duration-300 hover:-translate-y-1 relative overflow-hidden",
        glowColor,
        "hover:shadow-xl"
      )}
    >
      {/* Subtle Background Glow on Hover */}
      <div
        className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-current",
          color
        )}
      />

      <div className="flex items-center gap-2 mb-2 relative z-10">
        <div className={cn("p-1.5 rounded-full bg-[#1a110d] border border-[#3e2723]", color)}>
          <Icon className="w-4 h-4 md:w-5 md:h-5" />
        </div>
        <span className="text-[10px] md:text-xs font-black text-[#8d6e63] uppercase tracking-widest group-hover:text-[#eaddcf] transition-colors">
          {label}
        </span>
      </div>
      <span className="text-2xl md:text-4xl font-black text-[#eaddcf] tracking-tight group-hover:scale-110 transition-transform duration-300 z-10">
        {value}
      </span>
    </div>
  );
}
