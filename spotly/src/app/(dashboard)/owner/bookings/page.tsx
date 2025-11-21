"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  Users,
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Filter,
} from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/lib/store/auth-store";
import { usePlaceByOwnerQuery } from "@/modules/places/hooks";
import { useBookingsByPlaceQuery, useUpdateBookingStatusMutation } from "@/modules/bookings/hooks";
import type { BookingStatus } from "@/modules/bookings/types";

const STATUS_LABELS: Record<BookingStatus, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  pending: {
    label: "Pendiente",
    color: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    icon: Clock,
  },
  confirmed: {
    label: "Confirmada",
    color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelada",
    color: "bg-red-500/20 text-red-400 border-red-500/30",
    icon: XCircle,
  },
  completed: {
    label: "Completada",
    color: "bg-slate-500/20 text-slate-400 border-slate-500/30",
    icon: CheckCircle2,
  },
  rejected: {
    label: "Rechazada",
    color: "bg-red-500/20 text-red-400 border-red-500/30",
    icon: XCircle,
  },
};

export default function OwnerBookingsPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const status = useAuthStore((state) => state.status);
  const [isClient, setIsClient] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [selectedStatus, setSelectedStatus] = useState<BookingStatus | "all">("all");

  const { data: place, isLoading: isLoadingPlace, isError: isErrorPlace } = usePlaceByOwnerQuery(
    user?.id || ""
  );
  const { data: bookingsData, isLoading: isLoadingBookings } = useBookingsByPlaceQuery(
    place?.id || "",
    selectedDate
  );
  const updateStatusMutation = useUpdateBookingStatusMutation();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Proteger la ruta
  useEffect(() => {
    if (isClient) {
      if (status === "idle" || !user) {
        router.push("/login?redirect=/owner/bookings");
        return;
      }
      if (user.role !== "owner") {
        if (user.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/user");
        }
        return;
      }
    }
  }, [isClient, status, user, router]);

  if (!isClient || !user || user.role !== "owner") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
          <p className="text-sm text-slate-300">Cargando...</p>
        </div>
      </main>
    );
  }

  if (isLoadingPlace) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
          <p className="text-sm text-slate-300">Cargando información del local...</p>
        </div>
      </main>
    );
  }

  if (isErrorPlace || !place) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6">
            <AlertCircle className="mb-4 h-8 w-8 text-red-400" />
            <h2 className="mb-2 text-lg font-semibold text-white">Local no encontrado</h2>
            <p className="mb-4 text-sm text-slate-300">
              No se encontró un local asociado a tu cuenta. Por favor, completa el perfil primero.
            </p>
            <Link
              href="/owner"
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al panel
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Filtrar reservas por estado si es necesario
  const bookings = bookingsData?.data || [];
  const filteredBookings =
    selectedStatus === "all"
      ? bookings
      : bookings.filter((booking) => booking.status === selectedStatus);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-CO", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/owner"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-300 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al panel
        </Link>

        <header className="mb-8">
          <h1 className="text-3xl font-semibold">Reservas del local</h1>
          <p className="mt-2 text-sm text-slate-300">
            Gestiona las reservas de <span className="font-medium text-white">{place.name}</span>
          </p>
        </header>

        {/* Filtros */}
        <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label htmlFor="date" className="mb-2 block text-sm font-medium text-slate-300">
                Fecha
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  type="date"
                  id="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 pl-10 text-sm text-white focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-slate-950"
                />
              </div>
            </div>
            <div className="flex-1">
              <label htmlFor="status" className="mb-2 block text-sm font-medium text-slate-300">
                Estado
              </label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <select
                  id="status"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as BookingStatus | "all")}
                  className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 pl-10 text-sm text-white focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-slate-950"
                >
                  <option value="all">Todos los estados</option>
                  <option value="pending">Pendiente</option>
                  <option value="confirmed">Confirmada</option>
                  <option value="cancelled">Cancelada</option>
                  <option value="completed">Completada</option>
                  <option value="rejected">Rechazada</option>
                </select>
              </div>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSelectedDate(new Date().toISOString().split("T")[0]);
                  setSelectedStatus("all");
                }}
                className="rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        </div>

        {/* Lista de reservas */}
        {isLoadingBookings ? (
          <div className="flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-12">
            <div className="text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-emerald-400" />
              <p className="mt-4 text-sm text-slate-300">Cargando reservas...</p>
            </div>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
            <Calendar className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-4 text-lg font-semibold text-white">No hay reservas</h3>
            <p className="mt-2 text-sm text-slate-400">
              {selectedDate === new Date().toISOString().split("T")[0]
                ? "No hay reservas para hoy."
                : `No hay reservas para el ${formatDate(selectedDate)}.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-2">
              <p className="text-sm text-slate-300">
                Mostrando <span className="font-medium text-white">{filteredBookings.length}</span>{" "}
                reserva{filteredBookings.length !== 1 ? "s" : ""}
              </p>
              <p className="text-sm text-slate-400">{formatDate(selectedDate)}</p>
            </div>

            {filteredBookings.map((booking) => {
              const StatusIcon = STATUS_LABELS[booking.status].icon;
              const statusInfo = STATUS_LABELS[booking.status];

              return (
                <div
                  key={booking.id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur transition hover:border-white/20"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-white">{booking.userName}</h3>
                          <p className="text-sm text-slate-400">{booking.userEmail}</p>
                          {booking.userPhone && (
                            <p className="text-xs text-slate-500">{booking.userPhone}</p>
                          )}
                        </div>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${statusInfo.color}`}
                        >
                          <StatusIcon className="h-3.5 w-3.5" />
                          {statusInfo.label}
                        </span>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <Clock className="h-4 w-4 text-slate-400" />
                          <span>{formatTime(booking.time)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <Users className="h-4 w-4 text-slate-400" />
                          <span>
                            {booking.numberOfGuests} {booking.numberOfGuests === 1 ? "persona" : "personas"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          <span>{formatDate(booking.date)}</span>
                        </div>
                      </div>

                      {booking.specialRequests && (
                        <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                          <p className="text-xs font-medium text-slate-400 mb-1">Solicitudes especiales:</p>
                          <p className="text-sm text-slate-300">{booking.specialRequests}</p>
                        </div>
                      )}
                    </div>

                    {/* Acciones para cambiar estado */}
                    <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end">
                      {booking.status === "pending" && (
                        <>
                          <button
                            onClick={() =>
                              updateStatusMutation.mutate({ id: booking.id, payload: { status: "confirmed" } })
                            }
                            disabled={updateStatusMutation.isPending}
                            className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400 transition hover:bg-emerald-500/20 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            Confirmar
                          </button>
                          <button
                            onClick={() =>
                              updateStatusMutation.mutate({ id: booking.id, payload: { status: "rejected" } })
                            }
                            disabled={updateStatusMutation.isPending}
                            className="inline-flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <XCircle className="h-4 w-4" />
                            Rechazar
                          </button>
                        </>
                      )}
                      {booking.status === "confirmed" && (
                        <button
                          onClick={() =>
                            updateStatusMutation.mutate({ id: booking.id, payload: { status: "completed" } })
                          }
                          disabled={updateStatusMutation.isPending}
                          className="inline-flex items-center gap-2 rounded-lg border border-slate-500/30 bg-slate-500/10 px-4 py-2 text-sm font-medium text-slate-400 transition hover:bg-slate-500/20 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Marcar como completada
                        </button>
                      )}
                      {(booking.status === "pending" || booking.status === "confirmed") && (
                        <button
                          onClick={() =>
                            updateStatusMutation.mutate({ id: booking.id, payload: { status: "cancelled" } })
                          }
                          disabled={updateStatusMutation.isPending}
                          className="inline-flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <XCircle className="h-4 w-4" />
                          Cancelar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

