export type UpdateUserProfilePayload = {
  name?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  role: "user" | "owner" | "admin";
  createdAt: string;
  updatedAt: string;
};

