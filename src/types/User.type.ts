export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  coverPhoto?: string | null;
  bio?: string | null;
  location?: string | null;
  birthday?: string | null;
  gender?: "male" | "female" | "other" | null;
  role: "user" | "admin";
  status: "active" | "banned";
  createdAt: string;
  friends?: number[] | null;
  followers?: number[] | null;
  following?: number[] | null;
}
