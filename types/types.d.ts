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
  attachments: Attachment[];
  tag: string;
  likeCount: number;
  disLikeCount: number;
  _count: {
    comments: number;
  };
  userVote?: "like" | "dislike" | null;
  isLiked: Boolean;
  isDisliked: Boolean;
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
  discussion: DiscussionProps,
  attachments?: Attachment;
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

declare interface Attachment {
  id: string;
  postUrl: string;
  type: string;
}

declare interface NavLinkProps {
  name: string;
  url: string;
  icon: LucideIcon;
}

declare interface UserProps {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  profileUrl: string;
  role: string;
  beltRank: string;
  createdAt: string;
  isBanned?: Boolean;
  isShadowBanned?: Boolean;
}
