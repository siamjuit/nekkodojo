import {User, Bookmark, MessageSquare, BookOpen, LayoutDashboard} from "lucide-react";

export const NavLinks: NavLinkProps[] = [
  {
    name: "Profile",
    url: "/profile",
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
    name: "Bookmark",
    url: "/bookmarks",
    icon: Bookmark,
  },
];
