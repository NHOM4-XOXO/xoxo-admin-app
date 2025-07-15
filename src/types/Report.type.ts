export interface Report {
  id: number;
  author: string;
  authorAvatar?: string;
  content: string;
  image?: string;
  createdAt: string;
  likes: number;
  comments: number;
  shares: number;
  status: "published" | "reported" | "hidden";
  reports: number;
}
