import Github from "@/public/logos/github.svg";
import LinkedIn from "@/public/logos/linkedIn.svg";
import Leetcode from "@/public/logos/leetcode.svg";
import X from "@/public/logos/x.svg";
import Gitlab from "@/public/logos/gitlab.svg";
import StackOverflow from "@/public/logos/stackoverflow.svg";
import Devto from "@/public/logos/dev.svg";
import Link from "@/public/logos/link.svg";

export type Platform =
  | "github"
  | "linkedin"
  | "leetcode"
  | "x"
  | "gitlab"
  | "stackoverflow"
  | "dev";

export const getPlatform = (url: string) => {
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes("github.com"))
    return { type: "github", icon: Github, color: "text-white bg-gray-800" };
  if (lowerUrl.includes("x.com"))
    return { type: "x", icon: X, color: "text-blue-400 bg-blue-900/20" };
  if (lowerUrl.includes("linkedin.com"))
    return { type: "linkedin", icon: LinkedIn, color: "text-blue-600 bg-blue-900/20" };
  if (lowerUrl.includes("gitlab.com"))
    return { type: "gitlab", icon: Gitlab, color: "text-orange-600 bg-orange-900/20" };
  if (lowerUrl.includes("stackoverflow.com"))
    return {
      type: "stackoverflow",
      icon: StackOverflow,
      color: "text-orange-500 bg-orange-900/10",
    };
  if (lowerUrl.includes("leetcode.com"))
    return { type: "leetcode", icon: Leetcode, color: "text-yellow-500 bg-yellow-900/20" };
  if (lowerUrl.includes("dev.to"))
    return { type: "devto", icon: Devto, color: "text-white bg-black" };

  return {
    type: "website",
    icon: Link,
    color: "text-[#a1887f] bg-[#3e2723]/30",
  };
};
