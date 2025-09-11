export type PostItemResponse = {
  id: number;
  content: string;
  status: string; // hoặc PostStatus nếu có enum
  type: string; // hoặc PostType nếu có enum
  location: string;
  hashtags: string;
  isPublic: boolean;
  allowComments: boolean;
  allowLikes: boolean;
  allowShares: boolean;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  viewCount: number;
  authorId: number;
  authorFirstName: string;
  authorLastName: string;
  authorAvatarUrl: string;
  createdAt: string; // FE nên dùng string ISO
  updatedAt: string;
};
