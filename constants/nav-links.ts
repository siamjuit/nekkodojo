import { User, Bookmark, MessageSquare, BookOpen, Trophy, Users2 } from "lucide-react";

export const NavLinks: NavLinkProps[] = [
  {
    name: "Profile",
    url: "/member",
    icon: User,
  },
  {
    name: "Members",
    url: "/member",
    icon: Users2,
  },
  {
    name: "Leaderboard",
    url: "/leaderboard",
    icon: Trophy
  },
  {
    name: "Problems",
    url: "/problems",
    icon: BookOpen,
  },
  {
    name: "Discussions",
    url: "/discussions",
    icon: MessageSquare,
  },
  {
    name: "Archives",
    url: "/archives",
    icon: Bookmark,
  },
];
