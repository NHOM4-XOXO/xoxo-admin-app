export type UserType = {
  id: number;
  enabled: boolean;
  username?: string | null;
  roles: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  avatarUrl?: string | null;
  coverUrl?: string | null;
  bio?: string | null;
  location?: string | null;
  createdAt: string;
  updatedAt: string;
};
