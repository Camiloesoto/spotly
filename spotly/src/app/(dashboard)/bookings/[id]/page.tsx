"use client";

import {
  ArrowLeft,
  Calendar,
  Clock,
  Loader2,
  MapPin,
  Phone,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useBookingQuery, useCancelBookingMutation } from "@/modules/bookings/hooks";
import { useAuthStore } from "@/lib/store/auth-store";

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;
  const user = useAuthStore((state) => state.user);
  const { data: booking, isLoading, isError, error } = useBookingQuery(bookingId);
  const cancelBookingMutation = useCancelBookingMutation();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  // Proteger la ruta: solo usuarios autenticados pueden acceder
  if (!user) {
    router.push("/login?redirect=/bookings/" + bookingId);
    return null;
  }

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-emerald-500" />
          <p className="mt-2 text-sm text-slate-600">Cargando reserva...</p>
        </div>
      </main>
    );
  }

  if (isError || !booking) {
    return (
      <main className="mx-auto min-h-screen w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-lg border border-red-200 bg-red-50 p-8 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h1 className="mt-4 text-xl font-semibold text-red-900">Reserva no encontrada</h1>
          <p className="mt-2 text-sm text-red-700">
            {error instanceof Error ? error.message : "La reserva que buscas no existe o no tienes acceso a ella"}
          </p>
          <Link
            href="/user"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a mis reservas
          </Link>
        </div>
      </main>
    );
  }

  const getStatusInfo = (status: typeof booking.status) => {
    switch (status) {
      case "pending":
        return {
          label: "Pendiente",
          description: "Tu reserva está siendo revisada por el restaurante",
          icon: <AlertCircle className="h-5 w-5" />,
          color: "text-amber-600",
          bgColor: "bg-amber-50",
          borderColor: "border-amber-200",
        };
      case "confirmed":
        return {
          label: "Confirmada",
          description: "Tu reserva ha sido confirmada. ¡Nos vemos pronto!",
          icon: <CheckCircle2 className="h-5 w-5" />,
          color: "text-emerald-600",
          bgColor: "bg-emerald-50",
          borderColor: "border-emerald-200",
        };
      case "cancelled":
        return {
          label: "Cancelada",
          description: "Esta reserva ha sido cancelada",
          icon: <XCircle className="h-5 w-5" />,
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
        };
      case "completed":
        return {
          label: "Completada",
          description: "Esta reserva ya fue completada",
          icon: <CheckCircle2 className="h-5 w-5" />,
          color: "text-slate-600",
          bgColor: "bg-slate-50",
          borderColor: "border-slate-200",
        };
      case "rejected":
        return {
          label: "Rechazada",
          description: "Esta reserva fue rechazada por el restaurante",
          icon: <XCircle className="h-5 w-5" />,
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
        };
    }
  };

  const statusInfo = getStatusInfo(booking.status);
  const canCancel = booking.status === "pending" || booking.status === "confirmed";

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-CO", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleCancel = async () => {
    setIsCancelling(true);
    try {
      await cancelBookingMutation.mutateAsync(booking.id);
      setShowCancelConfirm(false);
      // La query se actualizará automáticamente
    } catch (error) {
      console.error("Error al cancelar reserva:", error);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/user"
        className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a mis reservas
      </Link>

      <div className="space-y-6">
        {/* Estado de la reserva */}
        <div
          className={`rounded-lg border ${statusInfo.borderColor} ${statusInfo.bgColor} p-6`}
        >
          <div className="flex items-start gap-4">
            <div className={`${statusInfo.color}`}>{statusInfo.icon}</div>
            <div className="flex-1">
              <h1 className="text-xl font-semibold text-slate-900">{booking.placeName}</h1>
              <div className="mt-2 flex items-center gap-2">
                <span className={`text-sm font-medium ${statusInfo.color}`}>
                  {statusInfo.label}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-600">{statusInfo.description}</p>
            </div>
          </div>
        </div>

        {/* Información de la reserva */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Detalles de la reserva</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Fecha
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-900">
                    {formatDate(booking.date)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Hora
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-900">{booking.time}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-slate-400 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                    Número de personas
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-900">
                    {booking.numberOfGuests} {booking.numberOfGuests === 1 ? "persona" : "personas"}
                  </p>
                </div>
              </div>

              {booking.placeAddress && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                      Dirección
                    </p>
                    <p className="mt-1 text-sm font-medium text-slate-900">
                      {booking.placeAddress}
                    </p>
                  </div>
                </div>
              )}

              {booking.placePhone && (
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                      Teléfono
                    </p>
                    <a
                      href={`tel:${booking.placePhone}`}
                      className="mt-1 text-sm font-medium text-emerald-600 hover:text-emerald-700"
                    >
                      {booking.placePhone}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Información adicional</h2>
            <div className="space-y-4">
              {booking.specialRequests ? (
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                    Solicitudes especiales
                  </p>
                  <p className="text-sm text-slate-900">{booking.specialRequests}</p>
                </div>
              ) : (
                <p className="text-sm text-slate-500">No hay solicitudes especiales</p>
              )}

              <div className="pt-4 border-t border-slate-200">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                  ID de reserva
                </p>
                <p className="text-xs font-mono text-slate-600">{booking.id}</p>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                  Creada el
                </p>
                <p className="text-sm text-slate-600">
                  {new Date(booking.createdAt).toLocaleDateString("es-CO", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Acciones */}
        {canCancel && (
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            {showCancelConfirm ? (
              <div>
                <h3 className="mb-2 text-sm font-semibold text-slate-900">
                  ¿Estás seguro de cancelar esta reserva?
                </h3>
                <p className="mb-4 text-sm text-slate-600">
                  Esta acción no se puede deshacer. La mesa quedará disponible para otros clientes.
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowCancelConfirm(false)}
                    className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    disabled={isCancelling}
                  >
                    No, mantener reserva
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={isCancelling}
                    className="flex-1 rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-50"
                  >
                    {isCancelling ? (
                      <>
                        <Loader2 className="inline h-4 w-4 animate-spin" />
                        Cancelando...
                      </>
                    ) : (
                      <>
                        <Trash2 className="inline h-4 w-4" />
                        Sí, cancelar reserva
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <button
                  type="button"
                  onClick={() => setShowCancelConfirm(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                >
                  <Trash2 className="h-4 w-4" />
                  Cancelar reserva
                </button>
              </div>
            )}
          </div>
        )}

        {/* Link al lugar */}
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <Link
            href={`/places/${booking.placeId}`}
            className="flex items-center justify-between text-sm font-medium text-emerald-600 transition hover:text-emerald-700"
          >
            <span>Ver información del restaurante</span>
            <ArrowLeft className="h-4 w-4 rotate-180" />
          </Link>
        </div>
      </div>
    </main>
  );
}

