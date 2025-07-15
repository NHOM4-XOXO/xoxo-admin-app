export interface Stats {
  id: number;
  totalUsers: number;
  newUsersToday: number;
  totalPosts: number;
  newPostsToday: number;
  pendingReports: number;
  onlineUsers: number;
  engagementRate: number;
  updatedAt: string;
}

export interface Activity {
  id: number;
  type: "report" | "user" | "post";
  message: string;
  time: string;
  urgent: boolean;
  userId?: string;
  postId?: string;
  createdAt: string;
}

export interface TopPost {
  id: number;
  title: string;
  likes: number;
  comments: number;
  shares: number;
  authorId: string;
  createdAt: string;
}

export interface ChartDataPoint {
  date: string;
  users?: number;
  posts?: number;
}

export interface ChartData {
  userGrowth: ChartDataPoint[];
  postActivity: ChartDataPoint[];
}
