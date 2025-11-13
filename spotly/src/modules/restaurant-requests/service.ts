import { apiClient } from "@/lib/api/client";
import type {
  RestaurantRequest,
  RestaurantRequestListResponse,
  ReviewRestaurantRequestPayload,
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

export async function listRestaurantRequests(status?: string): Promise<RestaurantRequestListResponse> {
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
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const updated = updateMockRequestStatus(
      id,
      payload.status,
      "admin_001", // En producción vendría del token JWT
      payload.rejectionReason
    );

    if (!updated) {
      throw new Error("Solicitud no encontrada");
    }

    return updated;
  }

  return await apiClient.patch<RestaurantRequest>(`${REQUESTS_BASE}/${id}/review`, payload);
}

