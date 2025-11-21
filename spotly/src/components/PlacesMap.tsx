"use client";

import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";
import type { PlaceSummary } from "@/modules/places/types";
import L from "leaflet";

// Fix para los iconos de Leaflet en Next.js
const iconRetinaUrl = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png";
const iconUrl = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png";
const shadowUrl = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

type PlacesMapProps = {
  places: PlaceSummary[];
  initialViewState?: {
    longitude: number;
    latitude: number;
    zoom: number;
  };
};

export function PlacesMap({ places, initialViewState }: PlacesMapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="flex h-[600px] items-center justify-center rounded-lg border border-slate-200 bg-slate-50">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
          <p className="text-sm text-slate-600">Cargando mapa...</p>
        </div>
      </div>
    );
  }

  // Calcular centro del mapa basado en los lugares
  const calculateCenter = () => {
    if (places.length === 0) {
      return { lat: 6.2476, lng: -75.5658 }; // Default: Medellín
    }

    // Filtrar lugares con coordenadas válidas
    const placesWithCoords = places.filter((p) => p.latitude != null && p.longitude != null);
    
    if (placesWithCoords.length === 0) {
      return { lat: 6.2476, lng: -75.5658 }; // Default: Medellín
    }

    const avgLat = placesWithCoords.reduce((sum, p) => sum + (p.latitude || 0), 0) / placesWithCoords.length;
    const avgLng = placesWithCoords.reduce((sum, p) => sum + (p.longitude || 0), 0) / placesWithCoords.length;

    return { lat: avgLat, lng: avgLng };
  };

  const center = initialViewState
    ? { lat: initialViewState.latitude, lng: initialViewState.longitude }
    : calculateCenter();

  const zoom = initialViewState?.zoom ?? 12;

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
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {places
          .filter((place) => place.latitude != null && place.longitude != null)
          .map((place) => (
            <Marker key={place.id} position={[place.latitude!, place.longitude!]}>
              <Popup>
                <div className="w-64 p-2">
                  <Link
                    href={`/places/${place.id}`}
                    className="block rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition hover:shadow-md"
                  >
                    {place.coverImageUrl && (
                      <div className="relative mb-2 h-32 w-full overflow-hidden rounded-md">
                        <img
                          src={place.coverImageUrl}
                          alt={place.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <h3 className="font-semibold text-slate-900">{place.name}</h3>
                    <p className="mt-1 text-xs text-slate-600 line-clamp-2">{place.description}</p>
                    <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                      <MapPin className="h-3 w-3" />
                      <span className="line-clamp-1">{place.address}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-medium text-slate-900">
                          {place.rating?.toFixed(1) ?? "N/A"}
                        </span>
                        <span className="text-xs text-slate-500">★</span>
                      </div>
                      <span className="text-xs text-slate-500">{place.city}</span>
                    </div>
                  </Link>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </div>
  );
}
