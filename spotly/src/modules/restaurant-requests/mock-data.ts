import type { RestaurantRequest, RestaurantRequestStatus } from "./types";

// Mock data para solicitudes de restaurantes
export const MOCK_RESTAURANT_REQUESTS: RestaurantRequest[] = [
  {
    id: "req_001",
    status: "pending_review",
    name: "La Terraza del Valle",
    description: "Restaurante de comida mediterránea con terraza al aire libre y vista panorámica. Ambiente relajado ideal para cenas románticas o reuniones familiares.",
    address: "Carrera 43A #1-50, El Poblado",
    city: "Medellín",
    country: "Colombia",
    phone: "+57 4 311 2345",
    categories: ["restaurant"],
    priceRange: "high",
    musicStyles: ["Jazz", "Latin"],
    schedule: [
      { day: "monday", opensAt: "12:00", closesAt: "23:00" },
      { day: "tuesday", opensAt: "12:00", closesAt: "23:00" },
      { day: "wednesday", opensAt: "12:00", closesAt: "23:00" },
      { day: "thursday", opensAt: "12:00", closesAt: "23:00" },
      { day: "friday", opensAt: "12:00", closesAt: "00:00" },
      { day: "saturday", opensAt: "12:00", closesAt: "00:00" },
      { day: "sunday", opensAt: "12:00", closesAt: "22:00" },
    ],
    contactName: "María González",
    contactEmail: "maria.gonzalez@terraza.com",
    contactPhone: "+57 300 123 4567",
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // Hace 2 días
  },
  {
    id: "req_002",
    status: "pending_review",
    name: "Bar El Rincón",
    description: "Bar temático con música en vivo los fines de semana. Especialidad en cócteles artesanales y tapas. Ambiente juvenil y desenfadado.",
    address: "Calle 10 #43-20, Laureles",
    city: "Medellín",
    country: "Colombia",
    phone: "+57 4 234 5678",
    categories: ["bar"],
    priceRange: "medium",
    musicStyles: ["Rock", "Indie", "Electronic"],
    schedule: [
      { day: "tuesday", opensAt: "18:00", closesAt: "02:00" },
      { day: "wednesday", opensAt: "18:00", closesAt: "02:00" },
      { day: "thursday", opensAt: "18:00", closesAt: "02:00" },
      { day: "friday", opensAt: "18:00", closesAt: "03:00" },
      { day: "saturday", opensAt: "18:00", closesAt: "03:00" },
    ],
    contactName: "Carlos Ramírez",
    contactEmail: "carlos.ramirez@rincon.com",
    contactPhone: "+57 310 987 6543",
    submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Hace 1 día
  },
  {
    id: "req_003",
    status: "pre_approved",
    name: "Discoteca Neon",
    description: "Discoteca moderna con sistema de sonido de última generación. Música electrónica y reggaeton. Eventos especiales los viernes y sábados.",
    address: "Carrera 70 #45-123, La 70",
    city: "Medellín",
    country: "Colombia",
    phone: "+57 4 567 8901",
    categories: ["club"],
    priceRange: "high",
    musicStyles: ["Electronic", "Reggaeton", "Hip-Hop"],
    schedule: [
      { day: "thursday", opensAt: "22:00", closesAt: "04:00" },
      { day: "friday", opensAt: "22:00", closesAt: "05:00" },
      { day: "saturday", opensAt: "22:00", closesAt: "05:00" },
    ],
    contactName: "Andrés López",
    contactEmail: "andres.lopez@neon.com",
    contactPhone: "+57 320 111 2233",
    submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // Hace 5 días
    reviewedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // Revisado hace 3 días
    reviewedBy: "admin_001",
  },
  {
    id: "req_004",
    status: "rejected",
    name: "Restaurante Fake",
    description: "Este es un restaurante de prueba que fue rechazado",
    address: "Calle Falsa 123",
    city: "Medellín",
    country: "Colombia",
    phone: "+57 4 999 9999",
    categories: ["restaurant"],
    priceRange: "medium",
    musicStyles: [],
    schedule: [
      { day: "monday", opensAt: "09:00", closesAt: "21:00" },
    ],
    contactName: "Test User",
    contactEmail: "test@fake.com",
    contactPhone: "+57 300 000 0000",
    submittedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    reviewedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    reviewedBy: "admin_001",
    rejectionReason: "Información incompleta o datos no verificables",
  },
];

// Helper functions para mock data
export function getMockRequestById(id: string): RestaurantRequest | undefined {
  return MOCK_RESTAURANT_REQUESTS.find((req) => req.id === id);
}

export function getMockRequestsByStatus(status: RestaurantRequestStatus): RestaurantRequest[] {
  return MOCK_RESTAURANT_REQUESTS.filter((req) => req.status === status);
}

export function addMockRequest(request: Omit<RestaurantRequest, "id" | "submittedAt">): RestaurantRequest {
  const newRequest: RestaurantRequest = {
    ...request,
    id: `req_${Date.now()}`,
    submittedAt: new Date().toISOString(),
  };
  MOCK_RESTAURANT_REQUESTS.push(newRequest);
  return newRequest;
}

export function updateMockRequestStatus(
  id: string,
  status: RestaurantRequestStatus,
  reviewedBy?: string,
  rejectionReason?: string
): RestaurantRequest | undefined {
  const request = MOCK_RESTAURANT_REQUESTS.find((req) => req.id === id);
  if (request) {
    request.status = status;
    request.reviewedAt = new Date().toISOString();
    if (reviewedBy) {
      request.reviewedBy = reviewedBy;
    }
    if (rejectionReason) {
      request.rejectionReason = rejectionReason;
    }
  }
  return request;
}

