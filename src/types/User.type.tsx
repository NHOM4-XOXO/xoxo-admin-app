export interface UserType {
  id: number;
  name: string;
  email: string;
  avatar: string;
  coverPhoto?: string;
  bio?: string;
  location?: string;
  birthday?: string;
  gender?: "male" | "female" | "other";
  role: "user" | "admin";
  status: "active" | "banned";
  createdAt: string;
  friends?: number[];
  followers?: number[];
  following?: number[];
}