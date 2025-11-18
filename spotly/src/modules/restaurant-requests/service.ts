import { apiClient } from "@/lib/api/client";
import type {
  RestaurantRequest,
  RestaurantRequestListResponse,
  ReviewRestaurantRequestPayload,
  RestaurantRequestStatus,
} from "./types";
import {
  MOCK_RESTAURANT_REQUESTS,
  getMockRequestById,
  getMockRequestsByStatus,
  addMockRequest,
  updateMockRequestStatus,
} from "./mock-data";

const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true" || process.env.NODE_ENV === "development";

const REQUESTS_BASE = "/api/v1/restaurant-requests";

// Helper para verificar si Prisma está disponible
async function getPrisma() {
  try {
    const { getPrismaClient } = await import("@/lib/prisma");
    return await getPrismaClient();
  } catch (error) {
    return null;
  }
}

// Helper para mapear RestaurantRequestStatus de Prisma a string
function mapPrismaStatusToStatus(prismaStatus: string): RestaurantRequestStatus {
  const statusMap: Record<string, RestaurantRequestStatus> = {
    PENDING_REVIEW: "pending_review",
    PRE_APPROVED: "pre_approved",
    REJECTED: "rejected",
    IN_REVIEW: "in_review",
    PUBLISHED: "published",
    CHANGES_REQUESTED: "changes_requested",
    SUSPENDED: "suspended",
  };
  return statusMap[prismaStatus] || "pending_review";
}

// Helper para mapear string a RestaurantRequestStatus de Prisma
function mapStatusToPrismaStatus(status: RestaurantRequestStatus): string {
  const statusMap: Record<RestaurantRequestStatus, string> = {
    pending_review: "PENDING_REVIEW",
    pre_approved: "PRE_APPROVED",
    rejected: "REJECTED",
    in_review: "IN_REVIEW",
    published: "PUBLISHED",
    changes_requested: "CHANGES_REQUESTED",
    suspended: "SUSPENDED",
  };
  return statusMap[status] || "PENDING_REVIEW";
}

// Helper para mapear PriceRange de Prisma a string
function mapPrismaPriceRangeToPriceRange(prismaRange: string): "low" | "medium" | "high" {
  const rangeMap: Record<string, "low" | "medium" | "high"> = {
    LOW: "low",
    MEDIUM: "medium",
    HIGH: "high",
  };
  return rangeMap[prismaRange] || "medium";
}

// Helper para mapear string a PriceRange de Prisma
function mapPriceRangeToPrismaPriceRange(range: "low" | "medium" | "high"): string {
  const rangeMap: Record<"low" | "medium" | "high", string> = {
    low: "LOW",
    medium: "MEDIUM",
    high: "HIGH",
  };
  return rangeMap[range] || "MEDIUM";
}

// Helper para convertir RestaurantRequest de Prisma a tipo local
function mapPrismaRequestToRequest(prismaRequest: any): RestaurantRequest {
  return {
    id: prismaRequest.id,
    status: mapPrismaStatusToStatus(prismaRequest.status),
    name: prismaRequest.name,
    description: prismaRequest.description,
    address: prismaRequest.address,
    city: prismaRequest.city,
    country: prismaRequest.country,
    phone: prismaRequest.phone,
    categories: prismaRequest.categories || [],
    priceRange: mapPrismaPriceRangeToPriceRange(prismaRequest.priceRange),
    musicStyles: prismaRequest.musicStyles || [],
    schedule: (prismaRequest.schedule as any) || [],
    contactName: prismaRequest.contactName,
    contactEmail: prismaRequest.contactEmail,
    contactPhone: prismaRequest.contactPhone,
    submittedAt: prismaRequest.submittedAt.toISOString(),
    reviewedAt: prismaRequest.reviewedAt?.toISOString(),
    reviewedBy: prismaRequest.reviewedBy || undefined,
    rejectionReason: prismaRequest.rejectionReason || undefined,
    ownerUserId: prismaRequest.ownerUserId || undefined,
  };
}

export async function listRestaurantRequests(status?: string): Promise<RestaurantRequestListResponse> {
  // Intentar usar Prisma primero (si está disponible y no estamos en modo mock)
  const prisma = await getPrisma();
  if (prisma && !USE_MOCK_DATA) {
    try {
      const where: any = {};
      if (status) {
        where.status = mapStatusToPrismaStatus(status as RestaurantRequestStatus);
      }

      const prismaRequests = await prisma.restaurantRequest.findMany({
        where,
        orderBy: { submittedAt: "desc" },
        include: {
          owner: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
      });

      const requests = prismaRequests.map(mapPrismaRequestToRequest);

      return {
        data: requests,
        total: requests.length,
      };
    } catch (error) {
      // Si hay error de Prisma, fallar al mock data o API
      console.error("Error usando Prisma, fallando a mock data:", error);
    }
  }

  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 600));

    let requests = [...MOCK_RESTAURANT_REQUESTS];

    if (status) {
      requests = getMockRequestsByStatus(status as any);
    }

    // Ordenar por fecha de envío (más recientes primero)
    requests.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

    return {
      data: requests,
      total: requests.length,
    };
  }

  const params = status ? { status } : {};
  return await apiClient.get<RestaurantRequestListResponse>(REQUESTS_BASE, { params });
}

export async function getRestaurantRequestById(id: string): Promise<RestaurantRequest> {
  // Intentar usar Prisma primero (si está disponible y no estamos en modo mock)
  const prisma = await getPrisma();
  if (prisma && !USE_MOCK_DATA) {
    try {
      const prismaRequest = await prisma.restaurantRequest.findUnique({
        where: { id },
        include: {
          owner: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
      });

      if (!prismaRequest) {
        throw new Error("Solicitud no encontrada");
      }

      return mapPrismaRequestToRequest(prismaRequest);
    } catch (error) {
      // Si hay error de Prisma, fallar al mock data o API
      console.error("Error usando Prisma, fallando a mock data:", error);
    }
  }

  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const request = getMockRequestById(id);
    if (!request) {
      throw new Error("Solicitud no encontrada");
    }

    return request;
  }

  return await apiClient.get<RestaurantRequest>(`${REQUESTS_BASE}/${id}`);
}

export async function createRestaurantRequest(
  payload: Omit<RestaurantRequest, "id" | "status" | "submittedAt" | "reviewedAt" | "reviewedBy" | "rejectionReason" | "ownerUserId">
): Promise<RestaurantRequest> {
  // Intentar usar Prisma primero (si está disponible y no estamos en modo mock)
  const prisma = await getPrisma();
  if (prisma && !USE_MOCK_DATA) {
    try {
      // @ts-ignore - Prisma puede no estar instalado
      const prismaModule = await import("@prisma/client");
      const statusEnum = prismaModule?.RestaurantRequestStatus?.PENDING_REVIEW || "PENDING_REVIEW";
      const priceRangeEnum = mapPriceRangeToPrismaPriceRange(payload.priceRange);

      const newRequest = await prisma.restaurantRequest.create({
        data: {
          status: statusEnum,
          name: payload.name,
          description: payload.description,
          address: payload.address,
          city: payload.city,
          country: payload.country,
          phone: payload.phone,
          categories: payload.categories,
          priceRange: priceRangeEnum,
          musicStyles: payload.musicStyles,
          schedule: payload.schedule as any,
          contactName: payload.contactName,
          contactEmail: payload.contactEmail,
          contactPhone: payload.contactPhone,
        },
      });

      return mapPrismaRequestToRequest(newRequest);
    } catch (error) {
      // Si hay error de Prisma, fallar al mock data o API
      console.error("Error usando Prisma, fallando a mock data:", error);
    }
  }

  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newRequest = addMockRequest({
      ...payload,
      status: "pending_review",
    });

    return newRequest;
  }

  return await apiClient.post<RestaurantRequest>(REQUESTS_BASE, payload);
}

export async function reviewRestaurantRequest(
  id: string,
  payload: ReviewRestaurantRequestPayload
): Promise<RestaurantRequest> {
  // Intentar usar Prisma primero (si está disponible y no estamos en modo mock)
  const prisma = await getPrisma();
  if (prisma && !USE_MOCK_DATA) {
    try {
      // Obtener la solicitud antes de actualizarla
      const request = await prisma.restaurantRequest.findUnique({
        where: { id },
      });

      if (!request) {
        throw new Error("Solicitud no encontrada");
      }

      let ownerUserId: string | undefined = request.ownerUserId || undefined;

      // Si se pre-aprueba, crear el usuario owner automáticamente
      if (payload.status === "pre_approved" && !request.ownerUserId) {
        const { createOwnerFromRequest } = await import("@/modules/auth/service");
        const { userId } = await createOwnerFromRequest({
          contactEmail: request.contactEmail,
          contactName: request.contactName,
          contactPhone: request.contactPhone,
        });
        ownerUserId = userId;
      }

      // @ts-ignore - Prisma puede no estar instalado
      const prismaModule = await import("@prisma/client");
      const statusEnum = prismaModule?.RestaurantRequestStatus?.[mapStatusToPrismaStatus(payload.status)] || mapStatusToPrismaStatus(payload.status);

      const updated = await prisma.restaurantRequest.update({
        where: { id },
        data: {
          status: statusEnum,
          reviewedAt: new Date(),
          reviewedBy: "admin_001", // En producción vendría del token JWT
          rejectionReason: payload.rejectionReason || null,
          ownerUserId: ownerUserId || null,
        },
        include: {
          owner: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
      });

      return mapPrismaRequestToRequest(updated);
    } catch (error) {
      // Si hay error de Prisma, fallar al mock data o API
      console.error("Error usando Prisma, fallando a mock data:", error);
    }
  }

  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Obtener la solicitud antes de actualizarla
    const request = getMockRequestById(id);
    if (!request) {
      throw new Error("Solicitud no encontrada");
    }

    let ownerUserId: string | undefined;

    // Si se pre-aprueba, crear el usuario owner automáticamente
    if (payload.status === "pre_approved" && !request.ownerUserId) {
      const { createOwnerFromRequest } = await import("@/modules/auth/service");
      const { userId } = await createOwnerFromRequest({
        contactEmail: request.contactEmail,
        contactName: request.contactName,
        contactPhone: request.contactPhone,
      });
      ownerUserId = userId;
    }

    const updated = updateMockRequestStatus(
      id,
      payload.status,
      "admin_001", // En producción vendría del token JWT
      payload.rejectionReason,
      ownerUserId
    );

    if (!updated) {
      throw new Error("Error al actualizar la solicitud");
    }

    return updated;
  }

  return await apiClient.patch<RestaurantRequest>(`${REQUESTS_BASE}/${id}/review`, payload);
}

