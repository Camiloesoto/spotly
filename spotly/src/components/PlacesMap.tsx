"use client";

import { MapPin } from "lucide-react";
import { useCallback, useState } from "react";
import Map, { Marker, Popup, ViewStateChangeEvent } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import Link from "next/link";
import type { PlaceSummary } from "@/modules/places/types";

type PlacesMapProps = {
  places: PlaceSummary[];
  initialViewState?: {
    longitude: number;
    latitude: number;
    zoom: number;
  };
};

export function PlacesMap({ places, initialViewState }: PlacesMapProps) {
  const [selectedPlace, setSelectedPlace] = useState<PlaceSummary | null>(null);
  const [viewState, setViewState] = useState({
    longitude: initialViewState?.longitude ?? -74.006,
    latitude: initialViewState?.latitude ?? 40.7128,
    zoom: initialViewState?.zoom ?? 12,
  });

  // Calcular centro del mapa basado en los lugares si no hay initialViewState
  const calculateCenter = useCallback(() => {
    if (places.length === 0) {
      return { longitude: -74.006, latitude: 40.7128 }; // Default: NYC
    }

    const avgLat = places.reduce((sum, p) => sum + p.latitude, 0) / places.length;
    const avgLng = places.reduce((sum, p) => sum + p.longitude, 0) / places.length;

    return { longitude: avgLng, latitude: avgLat };
  }, [places]);

  // Si no hay initialViewState, usar el centro calculado
  if (!initialViewState && places.length > 0) {
    const center = calculateCenter();
    if (viewState.longitude === -74.006 && viewState.latitude === 40.7128) {
      setViewState((prev) => ({
        ...prev,
        longitude: center.longitude,
        latitude: center.latitude,
      }));
    }
  }

  const getCategoryColor = (category: PlaceSummary["category"]) => {
    switch (category) {
      case "restaurant":
        return "bg-emerald-500";
      case "bar":
        return "bg-blue-500";
      case "club":
        return "bg-purple-500";
      default:
        return "bg-slate-500";
    }
  };

  return (
    <div className="relative h-[600px] w-full overflow-hidden rounded-lg border border-slate-200">
      <Map
        {...viewState}
        onMove={(evt: ViewStateChangeEvent) => setViewState(evt.viewState)}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXV4NTFmZmYyY3B6Y3M2bTkzcnkifQ.rJcFIG214AriISLbB6B5aw"}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
      >
        {places.map((place) => (
          <Marker
            key={place.id}
            longitude={place.longitude}
            latitude={place.latitude}
            anchor="bottom"
          >
            <button
              type="button"
              onClick={() => setSelectedPlace(place)}
              className="group relative"
            >
              <div
                className={`${getCategoryColor(
                  place.category
                )} flex h-8 w-8 items-center justify-center rounded-full shadow-lg transition hover:scale-110`}
              >
                <MapPin className="h-5 w-5 text-white" />
              </div>
              {selectedPlace?.id === place.id && (
                <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-white px-3 py-1.5 text-sm font-medium text-slate-900 shadow-lg">
                  {place.name}
                </div>
              )}
            </button>
          </Marker>
        ))}

        {selectedPlace && (
          <Popup
            longitude={selectedPlace.longitude}
            latitude={selectedPlace.latitude}
            anchor="bottom"
            onClose={() => setSelectedPlace(null)}
            closeButton={true}
            closeOnClick={false}
            className="mapboxgl-popup-content"
          >
            <div className="w-64 p-2">
              <Link
                href={`/places/${selectedPlace.id}`}
                className="block rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition hover:shadow-md"
              >
                {selectedPlace.coverImageUrl && (
                  <div className="relative mb-2 h-32 w-full overflow-hidden rounded-md">
                    <img
                      src={selectedPlace.coverImageUrl}
                      alt={selectedPlace.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <h3 className="font-semibold text-slate-900">{selectedPlace.name}</h3>
                <p className="mt-1 text-xs text-slate-600 line-clamp-2">
                  {selectedPlace.description}
                </p>
                <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                  <MapPin className="h-3 w-3" />
                  <span className="line-clamp-1">{selectedPlace.address}</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium text-slate-900">
                      {selectedPlace.rating.toFixed(1)}
                    </span>
                    <span className="text-xs text-slate-500">★</span>
                  </div>
                  <span className="text-xs text-slate-500">{selectedPlace.city}</span>
                </div>
              </Link>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}

