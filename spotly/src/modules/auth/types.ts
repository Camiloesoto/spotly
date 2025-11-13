export type OAuthProvider = "google";

export type RegisterPayload = {
  email: string;
  password: string;
  fullName: string;
  role: "user" | "owner";
  acceptTerms: boolean;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type Session = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: "user" | "owner" | "admin";
    avatarUrl?: string;
  };
};

export type LocalRegisterPayload = {
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
  // Datos de contacto del solicitante
  contactName: string;
  contactEmail: string;
  contactPhone: string;
};

export type LocalRegisterResponse = {
  success: boolean;
  message: string;
  requestId: string;
};

