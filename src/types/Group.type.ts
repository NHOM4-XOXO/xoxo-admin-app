export type GroupStatus =
  | "ACTIVE"
  | "SUSPENDED"
  | "BANNED"
  | "UNDER_REVIEW"
  | "ARCHIVED";
export type GroupPrivacy = "PUBLIC" | "PRIVATE";
export type GroupRole = "OWNER" | "ADMIN" | "MEMBER";
export type GroupCreator = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  roles: GroupRole[];
  dateOfBirth: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  avatarUrl: string;
  coverUrl: string;
  bio: string;
  createdAt: string;
  updatedAt: string;
  enabled: boolean;
  username: string;
};
export type GroupItemResponse = {
  id: number;
  title: string;
  description: string;
  coverUrl: string;
  creator: GroupCreator;
  privacy: GroupPrivacy;
  status: GroupStatus;
  memberCount: number;
  postCount: number;
  isVerified: boolean;
  rules: string;
  tags: string;
  location: string;
  website: string;
  createdAt: string;
  updatedAt: string;
};
