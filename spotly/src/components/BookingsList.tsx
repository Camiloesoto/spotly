"use client";

import { Calendar, Clock, MapPin, Users, CheckCircle2, XCircle, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useBookingsQuery } from "@/modules/bookings/hooks";
import type { BookingStatus } from "@/modules/bookings/types";

type BookingsListProps = {
  showActiveOnly?: boolean;
};

export function BookingsList({ showActiveOnly = false }: BookingsListProps) {
  const { data, isLoading, isError, error } = useBookingsQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-emerald-500" />
          <p className="mt-2 text-sm text-slate-600">Cargando reservas...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <AlertCircle className="mx-auto h-8 w-8 text-red-500" />
        <p className="mt-2 text-sm font-medium text-red-900">Error al cargar reservas</p>
        <p className="mt-1 text-xs text-red-700">
          {error instanceof Error ? error.message : "Intenta nuevamente más tarde"}
        </p>
      </div>
    );
  }

  if (!data || data.data.length === 0) {
    return (
      <div className="rounded-lg border border-slate-100 bg-slate-50 p-8 text-center">
        <Calendar className="mx-auto h-12 w-12 text-slate-400 mb-3" />
        <p className="text-sm font-medium text-slate-900 mb-1">No tienes reservas</p>
        <p className="text-sm text-slate-600 mb-4">
          Cuando hagas una reserva, aparecerá aquí
        </p>
        <Link
          href="/places"
          className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
        >
          Explorar restaurantes
        </Link>
      </div>
    );
  }

  // Filtrar reservas activas si es necesario
  const activeStatuses: BookingStatus[] = ["pending", "confirmed"];
  const bookings = showActiveOnly
    ? data.data.filter((booking) => activeStatuses.includes(booking.status))
    : data.data;

  // Separar reservas futuras y pasadas
  const now = new Date();
  const futureBookings = bookings.filter((booking) => {
    const bookingDate = new Date(`${booking.date}T${booking.time}`);
    return bookingDate >= now;
  });

  const pastBookings = bookings.filter((booking) => {
    const bookingDate = new Date(`${booking.date}T${booking.time}`);
    return bookingDate < now;
  });

  const getStatusBadge = (status: BookingStatus) => {
    const styles = {
      pending: "bg-amber-100 text-amber-900 border-amber-200",
      confirmed: "bg-emerald-100 text-emerald-900 border-emerald-200",
      cancelled: "bg-red-100 text-red-900 border-red-200",
      completed: "bg-slate-100 text-slate-900 border-slate-200",
      rejected: "bg-red-100 text-red-900 border-red-200",
    };

    const labels = {
      pending: "Pendiente",
      confirmed: "Confirmada",
      cancelled: "Cancelada",
      completed: "Completada",
      rejected: "Rechazada",
    };

    const icons = {
      pending: <AlertCircle className="h-3 w-3" />,
      confirmed: <CheckCircle2 className="h-3 w-3" />,
      cancelled: <XCircle className="h-3 w-3" />,
      completed: <CheckCircle2 className="h-3 w-3" />,
      rejected: <XCircle className="h-3 w-3" />,
    };

    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${styles[status]}`}
      >
        {icons[status]}
        {labels[status]}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-CO", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const BookingCard = ({ booking }: { booking: typeof bookings[0] }) => (
    <Link
      href={`/bookings/${booking.id}`}
      className="block rounded-lg border border-slate-200 bg-white p-4 transition hover:border-emerald-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-slate-900">{booking.placeName}</h3>
            {getStatusBadge(booking.status)}
          </div>
          <div className="space-y-1.5 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span>{formatDate(booking.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-slate-400" />
              <span>{booking.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-slate-400" />
              <span>{booking.numberOfGuests} {booking.numberOfGuests === 1 ? "persona" : "personas"}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="space-y-6">
      {futureBookings.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-slate-700">Próximas reservas</h3>
          <div className="space-y-3">
            {futureBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        </div>
      )}

      {pastBookings.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-semibold text-slate-700">Reservas pasadas</h3>
          <div className="space-y-3">
            {pastBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        </div>
      )}

      {futureBookings.length === 0 && pastBookings.length === 0 && (
        <div className="rounded-lg border border-slate-100 bg-slate-50 p-8 text-center">
          <Calendar className="mx-auto h-12 w-12 text-slate-400 mb-3" />
          <p className="text-sm font-medium text-slate-900 mb-1">
            {showActiveOnly ? "No tienes reservas activas" : "No tienes reservas"}
          </p>
          <p className="text-sm text-slate-600 mb-4">
            {showActiveOnly
              ? "Tus reservas confirmadas y pendientes aparecerán aquí"
              : "Cuando hagas una reserva, aparecerá aquí"}
          </p>
          <Link
            href="/places"
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
          >
            Explorar restaurantes
          </Link>
        </div>
      )}
    </div>
  );
}

