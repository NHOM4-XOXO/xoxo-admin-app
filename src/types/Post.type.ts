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
  createdAt: string;
  updatedAt: string;
  media?: MediaItem[];
};
export type MediaItem = {
  id: number;
  mediaUrl: string;
  mediaType: "IMAGE" | "VIDEO" | string;
  originalFilename?: string;
  fileSize?: number;
  createdAt?: string;
  uploadedBy?: {
    id: number;
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
    username?: string;
  };
};