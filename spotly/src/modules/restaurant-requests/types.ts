export type RestaurantRequestStatus = "pending_review" | "pre_approved" | "rejected" | "in_review" | "published" | "changes_requested" | "suspended";

export type RestaurantRequest = {
  id: string;
  status: RestaurantRequestStatus;
  // Datos del local
  name: string;
  description: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  categories: string[];
  priceRange: "low" | "medium" | "high";
  musicStyles: string[];
  schedule: Array<{
    day: string;
    opensAt: string;
    closesAt: string;
  }>;
  // Datos del contacto/solicitante
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  // Metadata
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
  // Si ya tiene cuenta creada
  ownerUserId?: string;
};

export type RestaurantRequestListResponse = {
  data: RestaurantRequest[];
  total: number;
};

export type ReviewRestaurantRequestPayload = {
  status: "pre_approved" | "rejected";
  rejectionReason?: string;
};

