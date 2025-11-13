"use client";

import {
  ArrowLeft,
  Calendar,
  Clock,
  Globe,
  Loader2,
  MapPin,
  Music,
  Phone,
  Star,
  UtensilsCrossed,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

import { usePlaceQuery } from "@/modules/places/hooks";
import type { PlaceCategory, PriceRange } from "@/modules/places/types";

const DAYS_LABELS: Record<string, string> = {
  monday: "Lunes",
  tuesday: "Martes",
  wednesday: "Miércoles",
  thursday: "Jueves",
  friday: "Viernes",
  saturday: "Sábado",
  sunday: "Domingo",
};

export default function PlaceDetailPage() {
  const params = useParams();
  const placeId = params.id as string;

  const { data: place, isLoading, isError, error } = usePlaceQuery(placeId);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (isError || !place) {
    return (
      <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-16">
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-red-200 bg-red-50 p-12 text-center">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <div>
            <p className="font-semibold text-red-900">Error al cargar el restaurante</p>
            <p className="mt-1 text-sm text-red-700">
              {error instanceof Error ? error.message : "Intenta nuevamente más tarde"}
            </p>
          </div>
          <Link
            href="/places"
            className="mt-4 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-600"
          >
            Volver a lugares
          </Link>
        </div>
      </main>
    );
  }

  const categoryLabels: Record<PlaceCategory, string> = {
    restaurant: "Restaurante",
    bar: "Bar",
    club: "Discoteca",
  };

  const priceRangeLabels: Record<PriceRange, string> = {
    low: "$ Económico",
    medium: "$$ Moderado",
    high: "$$$ Alto",
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="relative h-64 w-full bg-slate-200 sm:h-80 md:h-96">
        {place.coverImageUrl ? (
          <Image
            src={place.coverImageUrl}
            alt={place.name}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-600">
            <UtensilsCrossed className="h-24 w-24" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <Link
            href="/places"
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium transition hover:text-emerald-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a lugares
          </Link>
          <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl">{place.name}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="font-semibold">{place.rating.toFixed(1)}</span>
              {place.reviewCount && (
                <span className="text-white/80">({place.reviewCount} reseñas)</span>
              )}
            </div>
            <span className="rounded-full bg-white/20 px-3 py-1 backdrop-blur-sm">
              {categoryLabels[place.category]}
            </span>
            <span className="font-medium">{priceRangeLabels[place.priceRange]}</span>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="mb-4 text-2xl font-bold text-slate-900">Sobre este lugar</h2>
              <p className="text-slate-700 leading-relaxed">{place.description}</p>
            </section>

            {place.gallery && place.gallery.length > 0 && (
              <section>
                <h2 className="mb-4 text-2xl font-bold text-slate-900">Galería</h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {place.gallery.map((imageUrl, index) => (
                    <div key={index} className="relative aspect-square overflow-hidden rounded-lg">
                      <Image
                        src={imageUrl}
                        alt={`${place.name} - Imagen ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, 33vw"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {place.musicStyles && place.musicStyles.length > 0 && (
              <section>
                <h2 className="mb-4 text-2xl font-bold text-slate-900">Estilos musicales</h2>
                <div className="flex flex-wrap gap-2">
                  {place.musicStyles.map((style) => (
                    <span
                      key={style}
                      className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700"
                    >
                      <Music className="h-4 w-4 text-emerald-500" />
                      {style}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {place.amenities && place.amenities.length > 0 && (
              <section>
                <h2 className="mb-4 text-2xl font-bold text-slate-900">Amenidades</h2>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {place.amenities.map((amenity) => (
                    <div
                      key={amenity}
                      className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
                    >
                      <UtensilsCrossed className="h-4 w-4 text-emerald-500" />
                      {amenity}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled
                title="Funcionalidad de reservas próximamente"
              >
                <Calendar className="h-5 w-5" />
                Reservar mesa
              </button>
              <p className="mt-2 text-xs text-slate-500 text-center">
                Próximamente disponible
              </p>
            </div>

            {place.schedule && place.schedule.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-slate-900">
                  <Clock className="h-5 w-5 text-emerald-500" />
                  Horarios
                </h3>
                <div className="space-y-2">
                  {place.schedule.map((scheduleItem) => {
                    const dayLabel = DAYS_LABELS[scheduleItem.day] || scheduleItem.day;
                    const isToday = new Date().toLocaleDateString("es-ES", { weekday: "long" }).toLowerCase() === scheduleItem.day.toLowerCase();
                    return (
                      <div
                        key={scheduleItem.day}
                        className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${
                          isToday ? "bg-emerald-50 font-medium text-emerald-900" : "bg-slate-50 text-slate-700"
                        }`}
                      >
                        <span>{dayLabel}</span>
                        {scheduleItem.isClosed ? (
                          <span className="text-slate-500">Cerrado</span>
                        ) : (
                          <span>
                            {scheduleItem.opensAt} - {scheduleItem.closesAt}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-lg font-semibold text-slate-900">Información de contacto</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 flex-shrink-0 text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-900">{place.address}</p>
                    <p className="text-sm text-slate-600">{place.city}</p>
                    {place.distanceInKm && (
                      <p className="mt-1 text-xs text-slate-500">
                        A {place.distanceInKm.toFixed(1)} km de tu ubicación
                      </p>
                    )}
                  </div>
                </div>

                {place.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 flex-shrink-0 text-slate-400" />
                    <a
                      href={`tel:${place.phone}`}
                      className="text-sm font-medium text-emerald-600 transition hover:text-emerald-700"
                    >
                      {place.phone}
                    </a>
                  </div>
                )}

                {place.website && (
                  <div className="flex items-center gap-3">
                    <Globe className="h-5 w-5 flex-shrink-0 text-slate-400" />
                    <a
                      href={place.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-emerald-600 transition hover:text-emerald-700"
                    >
                      Visitar sitio web
                    </a>
                  </div>
                )}
              </div>
            </div>

            {place.capacity && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-2 text-lg font-semibold text-slate-900">Capacidad</h3>
                <p className="text-sm text-slate-600">{place.capacity} personas</p>
              </div>
            )}

            {place.averageTicket && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="mb-2 text-lg font-semibold text-slate-900">Ticket promedio</h3>
                <p className="text-sm text-slate-600">${place.averageTicket.toLocaleString()}</p>
              </div>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}

