"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Building2,
  MapPin,
  Image as ImageIcon,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/lib/store/auth-store";
import { useRestaurantRequestsQuery } from "@/modules/restaurant-requests/hooks";
import { useSubmitPlaceProfileMutation } from "@/modules/restaurant-requests/hooks";
import type { RestaurantRequest } from "@/modules/restaurant-requests/types";

const profileSchema = z.object({
  latitude: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val === "") return true;
        const num = parseFloat(val);
        return !isNaN(num) && num >= -90 && num <= 90;
      },
      { message: "La latitud debe ser un número entre -90 y 90" }
    ),
  longitude: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val === "") return true;
        const num = parseFloat(val);
        return !isNaN(num) && num >= -180 && num <= 180;
      },
      { message: "La longitud debe ser un número entre -180 y 180" }
    ),
  coverImageUrl: z.string().url("Debe ser una URL válida").optional().or(z.literal("")),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function OwnerProfilePage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const status = useAuthStore((state) => state.status);
  const [isClient, setIsClient] = useState(false);

  // Obtener solicitudes del usuario
  const { data: requestsData, isLoading: isLoadingRequests } = useRestaurantRequestsQuery();
  const userRequest = requestsData?.data.find((req) => req.contactEmail === user?.email);

  const submitProfileMutation = useSubmitPlaceProfileMutation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      latitude: "",
      longitude: "",
      coverImageUrl: "",
    },
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Proteger la ruta
  useEffect(() => {
    if (isClient) {
      if (status === "idle" || !user) {
        router.push("/login?redirect=/owner/profile");
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

  // Verificar que la solicitud esté pre-aprobada
  useEffect(() => {
    if (isClient && userRequest && userRequest.status !== "pre_approved") {
      router.push("/owner");
    }
  }, [isClient, userRequest, router]);

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

  if (isLoadingRequests) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
          <p className="text-sm text-slate-300">Cargando información del local...</p>
        </div>
      </main>
    );
  }

  if (!userRequest) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6">
            <AlertCircle className="mb-4 h-8 w-8 text-red-400" />
            <h2 className="mb-2 text-lg font-semibold text-white">Solicitud no encontrada</h2>
            <p className="mb-4 text-sm text-slate-300">
              No se encontró una solicitud asociada a tu cuenta. Por favor, envía una solicitud primero.
            </p>
            <Link
              href="/places/new"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
            >
              Enviar solicitud
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (userRequest.status !== "pre_approved") {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-6">
            <AlertCircle className="mb-4 h-8 w-8 text-amber-400" />
            <h2 className="mb-2 text-lg font-semibold text-white">Estado incorrecto</h2>
            <p className="mb-4 text-sm text-slate-300">
              Tu solicitud debe estar pre-aprobada para completar el perfil. Estado actual:{" "}
              <span className="font-medium">{userRequest.status}</span>
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

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await submitProfileMutation.mutateAsync({
        requestId: userRequest.id,
        latitude: data.latitude ? parseFloat(data.latitude) : undefined,
        longitude: data.longitude ? parseFloat(data.longitude) : undefined,
        coverImageUrl: data.coverImageUrl || undefined,
      });

      // Redirigir al dashboard con mensaje de éxito
      router.push("/owner?profile_submitted=true");
    } catch (error) {
      console.error("Error al enviar el perfil:", error);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/owner"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-300 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al panel
        </Link>

        <header className="mb-8">
          <h1 className="text-3xl font-semibold">Completar perfil del local</h1>
          <p className="mt-2 text-sm text-slate-300">
            Agrega información adicional para completar el perfil de tu local y enviarlo a revisión.
          </p>
        </header>

        {/* Información básica (solo lectura) */}
        <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur">
          <h2 className="mb-4 text-lg font-semibold text-white">Información básica</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium text-slate-400">Nombre del local</p>
              <p className="mt-1 text-sm text-white">{userRequest.name}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400">Ciudad</p>
              <p className="mt-1 text-sm text-white">{userRequest.city}</p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-xs font-medium text-slate-400">Dirección</p>
              <p className="mt-1 text-sm text-white">{userRequest.address}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400">Categorías</p>
              <p className="mt-1 text-sm text-white">{userRequest.categories.join(", ")}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-slate-400">Rango de precios</p>
              <p className="mt-1 text-sm text-white">
                {userRequest.priceRange === "low" ? "$" : userRequest.priceRange === "medium" ? "$$" : "$$$"}
              </p>
            </div>
          </div>
        </div>

        {/* Formulario de información adicional */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
              <MapPin className="h-5 w-5 text-emerald-400" />
              Ubicación (opcional pero recomendado)
            </h2>
            <p className="mb-4 text-xs text-slate-400">
              Las coordenadas ayudan a que los usuarios encuentren tu local en el mapa. Puedes obtenerlas desde Google
              Maps.
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="latitude" className="mb-2 block text-sm font-medium text-slate-300">
                  Latitud
                </label>
                <input
                  type="text"
                  id="latitude"
                  {...register("latitude")}
                  placeholder="Ej: 6.2476"
                  className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-slate-950"
                />
                {errors.latitude && (
                  <p className="mt-1 text-xs text-red-400">{errors.latitude.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="longitude" className="mb-2 block text-sm font-medium text-slate-300">
                  Longitud
                </label>
                <input
                  type="text"
                  id="longitude"
                  {...register("longitude")}
                  placeholder="Ej: -75.5658"
                  className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-slate-950"
                />
                {errors.longitude && (
                  <p className="mt-1 text-xs text-red-400">{errors.longitude.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
              <ImageIcon className="h-5 w-5 text-emerald-400" />
              Imagen de portada (opcional)
            </h2>
            <p className="mb-4 text-xs text-slate-400">
              URL de la imagen principal de tu local. Debe ser una imagen accesible públicamente.
            </p>
            <div>
              <label htmlFor="coverImageUrl" className="mb-2 block text-sm font-medium text-slate-300">
                URL de la imagen
              </label>
              <input
                type="url"
                id="coverImageUrl"
                {...register("coverImageUrl")}
                placeholder="https://ejemplo.com/imagen.jpg"
                className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-slate-950"
              />
              {errors.coverImageUrl && (
                <p className="mt-1 text-xs text-red-400">{errors.coverImageUrl.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={isSubmitting || submitProfileMutation.isPending}
              className="flex items-center gap-2 rounded-xl bg-emerald-500 px-8 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting || submitProfileMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Enviar perfil para revisión
                </>
              )}
            </button>
            <Link
              href="/owner"
              className="rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              Cancelar
            </Link>
          </div>

          {submitProfileMutation.isError && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-400" />
                <div>
                  <p className="text-sm font-medium text-red-400">Error al enviar el perfil</p>
                  <p className="mt-1 text-xs text-red-300">
                    {submitProfileMutation.error instanceof Error
                      ? submitProfileMutation.error.message
                      : "Ocurrió un error inesperado. Intenta nuevamente."}
                  </p>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </main>
  );
}

