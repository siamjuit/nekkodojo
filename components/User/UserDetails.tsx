"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { UserProfile } from "@clerk/nextjs";
import { 
  Calendar, Mail, Shield, MessageSquare, 
  MessageCircle, Trophy, AtSign, Pencil, 
  Check, X, Settings 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { BELTS } from "@/constants/belts";

interface Props {
  user: {
    name: string | null;
    firstName: string | null;
    lastName: string | null;
    bio: string | null;
    profileUrl: string | null;
    email: string;
    createdAt: Date;
  };
  stats: {
    solved: number;
    discussions: number;
    comments: number;
  };
}

export function UserDetails({ user, stats }: Props) {
  const router = useRouter();
  
  // --- BIO EDITING STATE ---
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState(user.bio || "A dedicated ninja training in the art of algorithms.");
  const [isSavingBio, setIsSavingBio] = useState(false);

  const joinDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Ninja";
  const email = user.email;
  const currentBelt = BELTS.findLast((b) => stats.solved >= b.minSolved) || BELTS[0];

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
    <div className="w-full bg-[#1a110d] border border-[#3e2723] rounded-3xl overflow-hidden shadow-2xl mb-10 group/card">
      
      {/* 1. EXPANDED BANNER */}
      <div className="h-48 w-full bg-linear-to-r from-[#0f0b0a] via-[#3e2723]/40 to-[#0f0b0a] border-b border-[#3e2723] relative">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-yellow-500 via-transparent to-transparent"></div>
        
        {/* --- EDIT PROFILE BUTTON (SHEET TRIGGER) --- */}
        <div className="absolute top-4 right-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-[#0f0b0a]/50 border-[#3e2723] text-[#a1887f] hover:text-[#d4af37] hover:border-[#d4af37] backdrop-blur-md transition-all"
              >
                <Settings className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </SheetTrigger>
            
            {/* SHEET CONFIG: Increased width to max-w-4xl to fit full profile */}
            <SheetContent side="right" className="w-full sm:max-w-4xl border-l border-[#3e2723] bg-[#0f0b0a] p-0 z-9999">
              <SheetTitle className="sr-only">Edit Profile</SheetTitle>
              
              <div className="h-full w-full">
                <UserProfile 
                  routing="hash"
                  appearance={{
                    elements: {
                      rootBox: "w-full h-full",
                      card: "w-full h-full shadow-none rounded-none border-none",
                      // Removed 'navbar: "hidden"' so full menu shows
                      scrollBox: "bg-[#0f0b0a] text-[#eaddcf]",
                      
                      // Customizing the Navbar to match Dark Theme
                      navbar: "bg-[#0f0b0a] border-r border-[#3e2723]",
                      navbarButton: "text-[#a1887f] hover:text-[#eaddcf] hover:bg-[#1a110d]",
                      activeNavbarButton: "text-[#d4af37] bg-[#1a110d] font-bold",
                      
                      // Header & Titles
                      headerTitle: "text-[#eaddcf]",
                      headerSubtitle: "text-[#a1887f]",
                      profileSectionTitleText: "text-[#d4af37]",
                      
                      // Preview Text
                      userPreviewMainIdentifier: "text-[#eaddcf]",
                      userPreviewSecondaryIdentifier: "text-[#a1887f]",
                      
                      // Inputs & Buttons
                      input: "bg-[#1a110d] border-[#3e2723] text-[#eaddcf]",
                      formButtonPrimary: "bg-[#d4af37] text-black hover:bg-[#b5952f]",
                      formButtonReset: "text-[#a1887f] hover:text-[#eaddcf] hover:bg-[#1a110d]",
                    },
                    variables: {
                      colorPrimary: "#d4af37",
                      colorBackground: "#0f0b0a",
                      colorText: "#eaddcf",
                      colorInputBackground: "#1a110d",
                      colorInputText: "#eaddcf",
                      colorTextSecondary: "#a1887f",
                    }
                  }} 
                />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="px-10 pb-10">
        <div className="flex flex-col lg:flex-row gap-10 -mt-20">
          
          {/* 2. AVATAR COLUMN */}
          <div className="flex flex-col items-center lg:items-start shrink-0">
            <div className="relative group">
              <div className="absolute -inset-2 bg-linear-to-br from-[#d4af37] to-[#3e2723] rounded-full blur-xl opacity-40 group-hover:opacity-60 transition duration-700"></div>
              <div className="relative w-40 h-40 rounded-full overflow-hidden border-[6px] border-[#1a110d] bg-[#0f0b0a] shadow-2xl">
                <Image src={user.profileUrl!} alt={fullName} fill className="object-cover" />
              </div>
              <div className="absolute bottom-2 right-2 bg-[#1a110d] border-2 border-[#3e2723] rounded-full p-2.5 shadow-lg" title="Verified Ninja">
                <Shield className="w-6 h-6 text-[#d4af37] fill-[#d4af37]/10" />
              </div>
            </div>
          </div>

          {/* 3. INFO COLUMN */}
          <div className="flex-1 pt-4 lg:pt-24 text-center lg:text-left space-y-8">
            
            {/* Header: Name, Username, Rank */}
            <div className="space-y-3">
              <div className="flex flex-col lg:flex-row items-center lg:items-end gap-4">
                <h1 className="text-4xl lg:text-5xl font-black text-[#eaddcf] tracking-tight leading-none">
                  {fullName}
                </h1>
                <Badge variant="outline" className={cn("mb-1.5 text-sm font-bold border px-4 py-1 rounded-full", currentBelt.color)}>
                  {currentBelt.name}
                </Badge>
              </div>
              
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-[#a1887f] font-medium">
                <span className="flex items-center gap-1.5 text-[#d4af37]">
                  <AtSign className="w-4 h-4" /> {user.name}
                </span>
                <span className="flex items-center gap-1.5 hover:text-[#eaddcf] transition-colors">
                  <Mail className="w-4 h-4" /> {email}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" /> Joined {joinDate}
                </span>
              </div>
            </div>

            {/* --- DISTINCT BIO SECTION (With Edit Logic) --- */}
            <div className="relative pl-6 border-l-4 border-[#3e2723] py-2 bg-[#0f0b0a]/30 rounded-r-xl max-w-3xl mx-auto lg:mx-0 group/bio">
              
              {!isEditingBio && (
                <button 
                  onClick={() => setIsEditingBio(true)}
                  className="absolute top-2 right-2 text-[#5d4037] hover:text-[#d4af37] opacity-0 group-hover/bio:opacity-100 transition-opacity"
                  title="Edit Bio"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              )}

              {isEditingBio ? (
                <div className="space-y-3 pr-2">
                  <Textarea 
                    value={bioText} 
                    onChange={(e) => setBioText(e.target.value)}
                    className="bg-[#1a110d] border-[#3e2723] text-[#eaddcf] focus-visible:ring-[#d4af37]/50 min-h-[100px]"
                    placeholder="Tell us about your coding journey..."
                  />
                  <div className="flex justify-end gap-2">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => setIsEditingBio(false)}
                      className="text-[#a1887f] hover:text-[#eaddcf]"
                    >
                      <X className="w-4 h-4 mr-1" /> Cancel
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={handleSaveBio}
                      disabled={isSavingBio}
                      className="bg-[#d4af37] text-black hover:bg-[#b5952f]"
                    >
                      <Check className="w-4 h-4 mr-1" /> {isSavingBio ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-lg text-[#eaddcf]/90 italic leading-relaxed min-h-12">
                  "{bioText}"
                </p>
              )}
            </div>

            {/* 4. STATS GRID (Relaxed Layout) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl mx-auto lg:mx-0 pt-2">
              <StatBox 
                icon={Trophy} 
                label="Solved" 
                value={stats.solved} 
                color="text-yellow-500" 
                bgGlow="bg-yellow-500/5"
                borderColor="border-yellow-500/20"
              />
              <StatBox 
                icon={MessageSquare} 
                label="Discussions" 
                value={stats.discussions} 
                color="text-blue-400" 
                bgGlow="bg-blue-500/5"
                borderColor="border-blue-400/20"
              />
              <StatBox 
                icon={MessageCircle} 
                label="Comments" 
                value={stats.comments} 
                color="text-green-400" 
                bgGlow="bg-green-500/5"
                borderColor="border-green-400/20"
              />
              <StatBox 
                icon={Shield} 
                label="Reputation" 
                value={(stats.solved * 10) + (stats.discussions * 5) + stats.comments} 
                color="text-purple-400" 
                bgGlow="bg-purple-500/5"
                borderColor="border-purple-400/20"
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

function StatBox({ icon: Icon, label, value, color, borderColor, bgGlow }: any) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-5 rounded-2xl bg-[#0f0b0a] border transition-all duration-300 hover:scale-105 hover:shadow-xl", borderColor, bgGlow)}>
      <div className="flex items-center gap-2 mb-2 opacity-80">
        <Icon className={cn("w-5 h-5", color)} />
        <span className="text-xs font-bold text-[#a1887f] uppercase tracking-widest">{label}</span>
      </div>
      <span className="text-3xl font-black text-[#eaddcf] tracking-tight">{value}</span>
    </div>
  );
}