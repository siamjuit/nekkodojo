declare interface DiscussionProps {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  authorId: string;
  author: {
    firstName: string | null;
    lastName: string | null;
    profileUrl: string | null;
    beltRank: string | null;
  };
  attachments: {
    id: string;
    postUrl: string;
    type: "image" | "video" | "gif";
  }[];
  tag: string;
  likeCount: number;
  disLikeCount: number;
  _count: {
    comments: number;
  };
  userVote?: "like" | "dislike" | null;
  chkLike: Boolean;
  chkDis: Boolean;
  isBookmarked?: Boolean;
}

declare interface CommentProps {
  id: string;
  description: string;
  discussionId: string;
  authorId: string;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    name: string;
    profileUrl: string;
    beltRank: string;
  };
  attachments?: {
    id: string;
    postUrl: string;
    type: string;
  };
  parentId?: string;
  createdAt: string | Date;
  likeCount: number;
  dislikeCount: number;
  _count?: {
    replies: number;
  };
  replies?: CommentProps[];
  isLiked?: Boolean;
  isDisliked?: Boolean;
  isBookmarked?: Boolean;
}

declare interface NavLinkProps {
  name: string;
  url: string;
  icon: LucideIcon;
}