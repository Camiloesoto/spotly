export type LocalProfile = {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  categories: string[];
  priceRange: "low" | "medium" | "high";
  musicStyles: string[];
  coverImageUrl?: string;
  gallery?: string[];
  schedule: Array<{
    day: string;
    opensAt: string;
    closesAt: string;
  }>;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
};

export type UpdateLocalProfilePayload = Partial<
  Pick<
    LocalProfile,
    | "name"
    | "description"
    | "address"
    | "phone"
    | "categories"
    | "priceRange"
    | "musicStyles"
    | "coverImageUrl"
    | "gallery"
    | "schedule"
  >
>;

