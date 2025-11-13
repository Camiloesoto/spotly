"use client";

import { AlertCircle, CheckCircle2, Clock, FileText, XCircle, Eye, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store";
import { useRestaurantRequestsQuery, useReviewRestaurantRequestMutation } from "@/modules/restaurant-requests/hooks";
import type { RestaurantRequestStatus } from "@/modules/restaurant-requests/types";

const STATUS_LABELS: Record<RestaurantRequestStatus, { label: string; color: string; bgColor: string }> = {
  pending_review: { label: "Pendiente", color: "text-amber-700", bgColor: "bg-amber-100" },
  pre_approved: { label: "Pre-aprobado", color: "text-blue-700", bgColor: "bg-blue-100" },
  rejected: { label: "Rechazado", color: "text-red-700", bgColor: "bg-red-100" },
  in_review: { label: "En revisión", color: "text-purple-700", bgColor: "bg-purple-100" },
  published: { label: "Publicado", color: "text-emerald-700", bgColor: "bg-emerald-100" },
  changes_requested: { label: "Cambios requeridos", color: "text-orange-700", bgColor: "bg-orange-100" },
  suspended: { label: "Suspendido", color: "text-slate-700", bgColor: "bg-slate-100" },
};

export default function AdminRequestsPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const status = useAuthStore((state) => state.status);
  const [isClient, setIsClient] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string | undefined>(undefined);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      if (status === "idle" || !user) {
        router.push("/login?redirect=/admin/requests");
        return;
      }
      if (user.role !== "admin") {
        if (user.role === "owner") {
          router.push("/owner");
        } else {
          router.push("/user");
        }
        return;
      }
    }
  }, [isClient, status, user, router]);

  const { data, isLoading, isError, error } = useRestaurantRequestsQuery(filterStatus);
  const reviewMutation = useReviewRestaurantRequestMutation();

  const handleApprove = async (requestId: string) => {
    if (!confirm("¿Estás seguro de que deseas pre-aprobar esta solicitud?")) {
      return;
    }
    try {
      await reviewMutation.mutateAsync({
        id: requestId,
        payload: { status: "pre_approved" },
      });
    } catch (error) {
      console.error("Error al aprobar solicitud:", error);
      alert("Error al aprobar la solicitud. Intenta nuevamente.");
    }
  };

  const handleReject = async (requestId: string) => {
    const reason = prompt("Ingresa la razón del rechazo (opcional):");
    try {
      await reviewMutation.mutateAsync({
        id: requestId,
        payload: {
          status: "rejected",
          rejectionReason: reason || undefined,
        },
      });
    } catch (error) {
      console.error("Error al rechazar solicitud:", error);
      alert("Error al rechazar la solicitud. Intenta nuevamente.");
    }
  };

  if (!isClient || !user || user.role !== "admin") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
          <p className="text-sm text-slate-600">Cargando...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/admin"
                className="mb-2 inline-flex items-center gap-2 text-sm text-slate-600 transition hover:text-slate-900"
              >
                ← Volver al panel
              </Link>
              <h1 className="text-2xl font-bold text-slate-900">Solicitudes de restaurantes</h1>
              <p className="mt-1 text-sm text-slate-600">
                Revisa y gestiona las solicitudes de nuevos locales
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Filtros */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setFilterStatus(undefined)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              filterStatus === undefined
                ? "bg-emerald-500 text-white"
                : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50"
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilterStatus("pending_review")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              filterStatus === "pending_review"
                ? "bg-amber-500 text-white"
                : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50"
            }`}
          >
            Pendientes
          </button>
          <button
            onClick={() => setFilterStatus("pre_approved")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              filterStatus === "pre_approved"
                ? "bg-blue-500 text-white"
                : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50"
            }`}
          >
            Pre-aprobadas
          </button>
          <button
            onClick={() => setFilterStatus("rejected")}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              filterStatus === "rejected"
                ? "bg-red-500 text-white"
                : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50"
            }`}
          >
            Rechazadas
          </button>
        </div>

        {/* Lista de solicitudes */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
              <p className="text-sm text-slate-600">Cargando solicitudes...</p>
            </div>
          </div>
        )}

        {isError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-3" />
            <p className="text-sm font-medium text-red-900">
              Error al cargar las solicitudes
            </p>
            <p className="mt-1 text-xs text-red-700">
              {error instanceof Error ? error.message : "Intenta recargar la página"}
            </p>
          </div>
        )}

        {!isLoading && !isError && data && (
          <>
            {data.data.length === 0 ? (
              <div className="rounded-lg border border-slate-200 bg-white p-12 text-center">
                <FileText className="mx-auto h-12 w-12 text-slate-400 mb-3" />
                <p className="text-sm font-medium text-slate-900 mb-1">
                  No hay solicitudes {filterStatus ? `con estado "${STATUS_LABELS[filterStatus as RestaurantRequestStatus]?.label}"` : ""}
                </p>
                <p className="text-sm text-slate-600">
                  Las nuevas solicitudes aparecerán aquí cuando sean enviadas
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {data.data.map((request) => {
                  const statusInfo = STATUS_LABELS[request.status];
                  return (
                    <div
                      key={request.id}
                      className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-lg font-semibold text-slate-900">{request.name}</h3>
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusInfo.color} ${statusInfo.bgColor}`}
                            >
                              {statusInfo.label}
                            </span>
                          </div>

                          <div className="grid gap-3 sm:grid-cols-2 mb-4">
                            <div>
                              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                                Contacto
                              </p>
                              <p className="text-sm text-slate-900">{request.contactName}</p>
                              <p className="text-sm text-slate-600">{request.contactEmail}</p>
                              <p className="text-sm text-slate-600">{request.contactPhone}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                                Ubicación
                              </p>
                              <p className="text-sm text-slate-900">{request.address}</p>
                              <p className="text-sm text-slate-600">
                                {request.city}, {request.country}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                                Categorías
                              </p>
                              <p className="text-sm text-slate-900">{request.categories.join(", ")}</p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                                Rango de precios
                              </p>
                              <p className="text-sm text-slate-900 capitalize">{request.priceRange}</p>
                            </div>
                          </div>

                          {request.description && (
                            <div className="mb-4">
                              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                                Descripción
                              </p>
                              <p className="text-sm text-slate-700">{request.description}</p>
                            </div>
                          )}

                          {request.rejectionReason && (
                            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3">
                              <p className="text-xs font-medium text-red-900 mb-1">Razón del rechazo:</p>
                              <p className="text-sm text-red-700">{request.rejectionReason}</p>
                            </div>
                          )}

                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            <span>
                              Enviada: {new Date(request.submittedAt).toLocaleDateString("es-CO")}
                            </span>
                            {request.reviewedAt && (
                              <span>
                                Revisada: {new Date(request.reviewedAt).toLocaleDateString("es-CO")}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="ml-4 flex flex-col gap-2">
                          {request.status === "pending_review" && (
                            <>
                              <button
                                onClick={() => handleApprove(request.id)}
                                disabled={reviewMutation.isPending}
                                className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:bg-emerald-400"
                              >
                                {reviewMutation.isPending ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <CheckCircle2 className="h-4 w-4" />
                                )}
                                Pre-aprobar
                              </button>
                              <button
                                onClick={() => handleReject(request.id)}
                                disabled={reviewMutation.isPending}
                                className="inline-flex items-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <XCircle className="h-4 w-4" />
                                Rechazar
                              </button>
                            </>
                          )}
                          {request.status === "pre_approved" && (
                            <Link
                              href={`/admin/requests/${request.id}`}
                              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                              <Eye className="h-4 w-4" />
                              Ver detalles
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

