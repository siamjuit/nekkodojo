import { User, Bookmark, MessageSquare, BookOpen } from "lucide-react";

export const NavLinks: NavLinkProps[] = [
  {
    name: "Profile",
    url: "/",
    icon: User,
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
