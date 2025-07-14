export interface Post {
  id: number;
  author: string;
  authorAvatar: string;
  content: string;
  image?: string;
  createdAt: string;
  likes: number;
  comments: number;
  shares: number;
  status: "published" | "hidden" | "reported";
  reports: number;
}
