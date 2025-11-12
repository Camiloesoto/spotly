"use client";

import {
  MapPin,
  Search,
  Star,
  Loader2,
  Filter,
  AlertCircle,
  UtensilsCrossed,
  Music,
  Beer,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useMemo } from "react";

import { usePlacesQuery } from "@/modules/places/hooks";
import type { PlaceCategory, PriceRange } from "@/modules/places/types";

export default function PlacesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<PlaceCategory | "all">("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState<PriceRange | "all">("all");

  const filters = useMemo(
    () => ({
      search: searchTerm.trim() || undefined,
      category: selectedCategory !== "all" ? selectedCategory : undefined,
      priceRange: selectedPriceRange !== "all" ? selectedPriceRange : undefined,
    }),
    [searchTerm, selectedCategory, selectedPriceRange]
  );

  const { data, isLoading, isError, error } = usePlacesQuery(filters);

  return (
    <main className="mx-auto min-h-screen w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Descubre lugares increíbles
        </h1>
        <p className="text-base text-slate-600 sm:text-lg">
          Explora restaurantes, bares y discotecas cercanas. Encuentra tu próximo plan perfecto.
        </p>
      </header>

      <section className="mb-8 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 shadow-sm transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
            <Filter className="h-4 w-4 text-slate-500" />
            <span className="font-medium text-slate-700">Filtros:</span>
          </div>

          <CategoryFilter value={selectedCategory} onChange={setSelectedCategory} />
          <PriceRangeFilter value={selectedPriceRange} onChange={setSelectedPriceRange} />
        </div>
      </section>

      {isLoading && (
        <div className="flex flex-col items-center justify-center gap-4 py-16">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
          <p className="text-sm text-slate-600">Cargando lugares...</p>
        </div>
      )}

      {isError && (
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-red-200 bg-red-50 p-8">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <div className="text-center">
            <p className="font-semibold text-red-900">Error al cargar lugares</p>
            <p className="mt-1 text-sm text-red-700">
              {error instanceof Error ? error.message : "Intenta nuevamente más tarde"}
            </p>
          </div>
        </div>
      )}

      {!isLoading && !isError && data && data.data.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-12 text-center">
          <Search className="h-12 w-12 text-slate-400" />
          <div>
            <p className="font-semibold text-slate-900">No se encontraron lugares</p>
            <p className="mt-1 text-sm text-slate-600">
              Intenta ajustar tus filtros o búsqueda para ver más resultados
            </p>
          </div>
        </div>
      )}

      {!isLoading && !isError && data && data.data.length > 0 && (
        <>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-slate-600">
              Mostrando <span className="font-semibold text-slate-900">{data.data.length}</span> de{" "}
              <span className="font-semibold text-slate-900">{data.total}</span> lugares
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.data.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}

type CategoryFilterProps = {
  value: PlaceCategory | "all";
  onChange: (value: PlaceCategory | "all") => void;
};

function CategoryFilter({ value, onChange }: CategoryFilterProps) {
  const categories: Array<{ value: PlaceCategory | "all"; label: string; icon: typeof UtensilsCrossed }> =
    [
      { value: "all", label: "Todos", icon: Filter },
      { value: "restaurant", label: "Restaurantes", icon: UtensilsCrossed },
      { value: "bar", label: "Bares", icon: Beer },
      { value: "club", label: "Discotecas", icon: Music },
    ];

  return (
    <div className="flex gap-2 rounded-lg border border-slate-200 bg-white p-1">
      {categories.map((category) => {
        const Icon = category.icon;
        const isActive = value === category.value;
        return (
          <button
            key={category.value}
            type="button"
            onClick={() => onChange(category.value)}
            className={`flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition ${
              isActive
                ? "bg-emerald-500 text-white shadow-sm"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <Icon className="h-3.5 w-3.5" />
            {category.label}
          </button>
        );
      })}
    </div>
  );
}

type PriceRangeFilterProps = {
  value: PriceRange | "all";
  onChange: (value: PriceRange | "all") => void;
};

function PriceRangeFilter({ value, onChange }: PriceRangeFilterProps) {
  const priceRanges: Array<{ value: PriceRange | "all"; label: string; symbol: string }> = [
    { value: "all", label: "Todos", symbol: "$$$" },
    { value: "low", label: "Económico", symbol: "$" },
    { value: "medium", label: "Moderado", symbol: "$$" },
    { value: "high", label: "Alto", symbol: "$$$" },
  ];

  return (
    <div className="flex gap-2 rounded-lg border border-slate-200 bg-white p-1">
      {priceRanges.map((range) => {
        const isActive = value === range.value;
        return (
          <button
            key={range.value}
            type="button"
            onClick={() => onChange(range.value)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
              isActive
                ? "bg-emerald-500 text-white shadow-sm"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            {range.symbol} {range.label}
          </button>
        );
      })}
    </div>
  );
}

type PlaceCardProps = {
  place: {
    id: string;
    name: string;
    description: string;
    city: string;
    address: string;
    category: PlaceCategory;
    priceRange: PriceRange;
    rating: number;
    coverImageUrl?: string;
    musicStyles: string[];
    distanceInKm?: number;
  };
};

function PlaceCard({ place }: PlaceCardProps) {
  const categoryLabels: Record<PlaceCategory, string> = {
    restaurant: "Restaurante",
    bar: "Bar",
    club: "Discoteca",
  };

  const priceRangeSymbols: Record<PriceRange, string> = {
    low: "$",
    medium: "$$",
    high: "$$$",
  };

  return (
    <Link
      href={`/places/${place.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg"
    >
      <div className="relative h-48 w-full bg-slate-200">
        {place.coverImageUrl ? (
          <Image
            src={place.coverImageUrl}
            alt={place.name}
            fill
            className="object-cover transition group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-600">
            <UtensilsCrossed className="h-12 w-12" />
          </div>
        )}
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs font-semibold text-slate-900 backdrop-blur-sm">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          {place.rating.toFixed(1)}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="flex-1 font-semibold text-slate-900 group-hover:text-emerald-600">
            {place.name}
          </h3>
          <span className="text-sm font-medium text-slate-600">
            {priceRangeSymbols[place.priceRange]}
          </span>
        </div>

        <p className="line-clamp-2 text-sm text-slate-600">{place.description}</p>

        <div className="mt-auto flex flex-wrap items-center gap-2 text-xs text-slate-500">
          <span className="rounded-md bg-slate-100 px-2 py-1 font-medium">
            {categoryLabels[place.category]}
          </span>
          {place.distanceInKm && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {place.distanceInKm.toFixed(1)} km
            </span>
          )}
          {place.musicStyles.length > 0 && (
            <span className="truncate">{place.musicStyles.slice(0, 2).join(", ")}</span>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <MapPin className="h-3 w-3 flex-shrink-0" />
          <span className="truncate">{place.address}</span>
        </div>
      </div>
    </Link>
  );
}
