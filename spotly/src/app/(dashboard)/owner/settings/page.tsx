"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Users,
  Clock,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Save,
} from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/lib/store/auth-store";
import { usePlaceByOwnerQuery, useUpdatePlaceBookingConfigMutation } from "@/modules/places/hooks";
import type { BookingScheduleItem } from "@/modules/places/types";

const DAYS_OF_WEEK = [
  { value: "monday", label: "Lunes" },
  { value: "tuesday", label: "Martes" },
  { value: "wednesday", label: "Miércoles" },
  { value: "thursday", label: "Jueves" },
  { value: "friday", label: "Viernes" },
  { value: "saturday", label: "Sábado" },
  { value: "sunday", label: "Domingo" },
] as const;

const bookingConfigSchema = z.object({
  capacity: z
    .string()
    .min(1, "La capacidad es requerida")
    .refine(
      (val) => {
        const num = parseInt(val, 10);
        return !isNaN(num) && num > 0 && num <= 1000;
      },
      { message: "La capacidad debe ser un número entre 1 y 1000" }
    ),
  bookingSchedule: z
    .array(
      z.object({
        day: z.string(),
        opensAt: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, "Formato: HH:MM"),
        closesAt: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, "Formato: HH:MM"),
        isAvailable: z.boolean(),
      })
    )
    .min(1, "Configura al menos un día"),
});

type BookingConfigFormData = z.infer<typeof bookingConfigSchema>;

export default function OwnerSettingsPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const status = useAuthStore((state) => state.status);
  const [isClient, setIsClient] = useState(false);

  const { data: place, isLoading: isLoadingPlace, isError: isErrorPlace } = usePlaceByOwnerQuery(
    user?.id || ""
  );
  const updateConfigMutation = useUpdatePlaceBookingConfigMutation();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<BookingConfigFormData>({
    resolver: zodResolver(bookingConfigSchema),
    defaultValues: {
      capacity: "",
      bookingSchedule: [],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: "bookingSchedule",
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Proteger la ruta
  useEffect(() => {
    if (isClient) {
      if (status === "idle" || !user) {
        router.push("/login?redirect=/owner/settings");
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

  // Cargar datos del lugar cuando esté disponible
  useEffect(() => {
    if (place) {
      // Inicializar con los horarios generales si no hay horarios de reserva configurados
      const schedule = place.schedule || [];
      const bookingSchedule: BookingScheduleItem[] =
        schedule.length > 0
          ? schedule.map((s) => ({
              day: s.day,
              opensAt: s.opensAt,
              closesAt: s.closesAt,
              isAvailable: !s.isClosed,
            }))
          : DAYS_OF_WEEK.map((day) => ({
              day: day.value,
              opensAt: "12:00",
              closesAt: "22:00",
              isAvailable: true,
            }));

      reset({
        capacity: place.capacity?.toString() || "",
        bookingSchedule,
      });
    }
  }, [place, reset]);

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
          <p className="text-sm text-slate-300">Cargando configuración del local...</p>
        </div>
      </main>
    );
  }

  if (isErrorPlace || !place) {
    return (
      <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
        <div className="mx-auto max-w-3xl">
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

  const onSubmit = async (data: BookingConfigFormData) => {
    try {
      await updateConfigMutation.mutateAsync({
        placeId: place.id,
        payload: {
          capacity: parseInt(data.capacity, 10),
          bookingSchedule: data.bookingSchedule,
        },
      });

      // Mostrar mensaje de éxito (podrías usar un toast aquí)
      router.push("/owner?config_updated=true");
    } catch (error) {
      console.error("Error al actualizar la configuración:", error);
    }
  };

  const addDay = () => {
    const existingDays = fields.map((f) => f.day);
    const availableDay = DAYS_OF_WEEK.find((day) => !existingDays.includes(day.value));
    if (availableDay) {
      append({
        day: availableDay.value,
        opensAt: "12:00",
        closesAt: "22:00",
        isAvailable: true,
      });
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
          <h1 className="text-3xl font-semibold">Configuración de reservas</h1>
          <p className="mt-2 text-sm text-slate-300">
            Configura la capacidad máxima y los horarios disponibles para recibir reservas en tu local.
          </p>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Capacidad */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
              <Users className="h-5 w-5 text-emerald-400" />
              Capacidad máxima
            </h2>
            <p className="mb-4 text-xs text-slate-400">
              Define el número máximo de personas que puede albergar tu local simultáneamente.
            </p>
            <div>
              <label htmlFor="capacity" className="mb-2 block text-sm font-medium text-slate-300">
                Capacidad (personas)
              </label>
              <input
                type="number"
                id="capacity"
                {...register("capacity")}
                min="1"
                max="1000"
                placeholder="Ej: 50"
                className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-slate-950"
              />
              {errors.capacity && (
                <p className="mt-1 text-xs text-red-400">{errors.capacity.message}</p>
              )}
            </div>
          </div>

          {/* Horarios de reservas */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="mb-2 flex items-center gap-2 text-lg font-semibold text-white">
                  <Clock className="h-5 w-5 text-emerald-400" />
                  Horarios de reservas
                </h2>
                <p className="text-xs text-slate-400">
                  Define los horarios en los que aceptas reservas. Pueden ser diferentes a tus horarios de operación.
                </p>
              </div>
              {fields.length < 7 && (
                <button
                  type="button"
                  onClick={addDay}
                  className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
                >
                  + Agregar día
                </button>
              )}
            </div>

            {fields.length === 0 && (
              <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
                <p className="text-sm text-amber-300">
                  No hay horarios configurados. Agrega al menos un día para permitir reservas.
                </p>
              </div>
            )}

            <div className="space-y-4">
              {fields.map((field, index) => {
                const dayLabel = DAYS_OF_WEEK.find((d) => d.value === field.day)?.label || field.day;
                return (
                  <div
                    key={field.id}
                    className="rounded-lg border border-white/10 bg-white/5 p-4"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-medium text-white">{dayLabel}</h3>
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="text-xs text-red-400 transition hover:text-red-300"
                      >
                        Eliminar
                      </button>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-400">
                          Día
                        </label>
                        <select
                          {...register(`bookingSchedule.${index}.day`)}
                          className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-slate-950"
                        >
                          {DAYS_OF_WEEK.map((day) => (
                            <option key={day.value} value={day.value}>
                              {day.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-400">
                          Apertura
                        </label>
                        <input
                          type="time"
                          {...register(`bookingSchedule.${index}.opensAt`)}
                          className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-slate-950"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-400">
                          Cierre
                        </label>
                        <input
                          type="time"
                          {...register(`bookingSchedule.${index}.closesAt`)}
                          className="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-slate-950"
                        />
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`available-${index}`}
                        {...register(`bookingSchedule.${index}.isAvailable`)}
                        className="h-4 w-4 rounded border-white/20 bg-white/5 text-emerald-500 focus:ring-2 focus:ring-emerald-300"
                      />
                      <label htmlFor={`available-${index}`} className="text-sm text-slate-300">
                        Disponible para reservas este día
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>

            {errors.bookingSchedule && (
              <p className="mt-2 text-xs text-red-400">{errors.bookingSchedule.message}</p>
            )}
          </div>

          {/* Botones de acción */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={isSubmitting || updateConfigMutation.isPending}
              className="flex items-center gap-2 rounded-xl bg-emerald-500 px-8 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting || updateConfigMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Guardar configuración
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

          {updateConfigMutation.isError && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-400" />
                <div>
                  <p className="text-sm font-medium text-red-400">Error al guardar la configuración</p>
                  <p className="mt-1 text-xs text-red-300">
                    {updateConfigMutation.error instanceof Error
                      ? updateConfigMutation.error.message
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

