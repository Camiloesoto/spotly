"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock,
  Loader2,
  MapPin,
  Music,
  Phone,
  Tag,
  UtensilsCrossed,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";

import { useRegisterLocalMutation } from "@/modules/auth/hooks";
import type { LocalRegisterPayload } from "@/modules/auth/types";

const DAYS_OF_WEEK = [
  { value: "monday", label: "Lunes" },
  { value: "tuesday", label: "Martes" },
  { value: "wednesday", label: "Miércoles" },
  { value: "thursday", label: "Jueves" },
  { value: "friday", label: "Viernes" },
  { value: "saturday", label: "Sábado" },
  { value: "sunday", label: "Domingo" },
] as const;

const CATEGORIES = [
  { id: "restaurant", label: "Restaurante" },
  { id: "bar", label: "Bar" },
  { id: "club", label: "Discoteca" },
  { id: "cafe", label: "Café" },
  { id: "pub", label: "Pub" },
  { id: "lounge", label: "Lounge" },
] as const;

const MUSIC_STYLES = [
  "Pop",
  "Rock",
  "Reggaeton",
  "Salsa",
  "Bachata",
  "Electronic",
  "Hip-Hop",
  "Jazz",
  "Latin",
  "Indie",
  "Country",
  "R&B",
] as const;

const registerLocalSchema = z.object({
  name: z.string().trim().min(3, "El nombre debe tener al menos 3 caracteres").max(100),
  description: z.string().trim().min(20, "La descripción debe tener al menos 20 caracteres").max(500),
  address: z.string().trim().min(5, "Ingresa una dirección válida").max(200),
  city: z.string().trim().min(2, "Ingresa una ciudad válida").max(100),
  country: z.string().trim().min(2, "Ingresa un país válido").max(100),
  phone: z
    .string()
    .trim()
    .regex(/^[\d\s\-\+\(\)]+$/, "Ingresa un teléfono válido")
    .min(8, "El teléfono debe tener al menos 8 dígitos"),
  categories: z.array(z.string()).min(1, "Selecciona al menos una categoría"),
  priceRange: z.enum(["low", "medium", "high"]),
  musicStyles: z.array(z.string()),
  schedule: z
    .array(
      z.object({
        day: z.string(),
        opensAt: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, "Formato: HH:MM"),
        closesAt: z.string().regex(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/, "Formato: HH:MM"),
      })
    )
    .min(1, "Configura al menos un día de horario"),
});

type RegisterLocalFormValues = z.infer<typeof registerLocalSchema>;

export default function RegisterLocalPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterLocalFormValues>({
    resolver: zodResolver(registerLocalSchema),
    defaultValues: {
      name: "",
      description: "",
      address: "",
      city: "",
      country: "",
      phone: "",
      categories: [],
      priceRange: "medium",
      musicStyles: [],
      schedule: DAYS_OF_WEEK.map((day) => ({
        day: day.value,
        opensAt: "09:00",
        closesAt: "22:00",
      })),
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "schedule",
  });

  const registerLocalMutation = useRegisterLocalMutation();

  const selectedCategories = watch("categories");
  const selectedMusicStyles = watch("musicStyles");
  const selectedPriceRange = watch("priceRange");

  const onSubmit = handleSubmit(async (data) => {
    setServerError(null);
    try {
      const payload: LocalRegisterPayload = {
        name: data.name,
        description: data.description,
        address: data.address,
        city: data.city,
        country: data.country,
        phone: data.phone,
        categories: data.categories,
        priceRange: data.priceRange,
        musicStyles: data.musicStyles,
        schedule: data.schedule.filter((s) => s.opensAt && s.closesAt),
      };

      await registerLocalMutation.mutateAsync(payload);
      router.push("/dashboard/owner");
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : "Error al registrar el local. Intenta nuevamente."
      );
    }
  });

  const toggleCategory = (categoryId: string) => {
    const current = watch("categories");
    const updated = current.includes(categoryId)
      ? current.filter((c) => c !== categoryId)
      : [...current, categoryId];
    setValue("categories", updated, { shouldValidate: true });
  };

  const toggleMusicStyle = (style: string) => {
    const current = watch("musicStyles");
    const updated = current.includes(style)
      ? current.filter((s) => s !== style)
      : [...current, style];
    setValue("musicStyles", updated, { shouldValidate: true });
  };

  const disableForm = isSubmitting || registerLocalMutation.isPending;

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/places"
        className="mb-6 inline-flex items-center gap-2 text-sm text-slate-600 transition hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a lugares
      </Link>

      <header className="mb-8 space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Registra tu local
        </h1>
        <p className="text-base text-slate-600 sm:text-lg">
          Completa la información de tu establecimiento para aparecer en Seki y recibir reservas.
        </p>
      </header>

      <form onSubmit={onSubmit} className="space-y-8">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-slate-900">
            <Building2 className="h-5 w-5 text-emerald-500" />
            Información básica
          </h2>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-700">
                Nombre del local *
              </label>
              <input
                id="name"
                type="text"
                {...register("name")}
                disabled={disableForm}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 disabled:bg-slate-50"
                placeholder="Ej: La Terraza del Mar"
              />
              {errors.name && <FieldError message={errors.name.message} />}
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="description" className="mb-2 block text-sm font-medium text-slate-700">
                Descripción *
              </label>
              <textarea
                id="description"
                rows={4}
                {...register("description")}
                disabled={disableForm}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 disabled:bg-slate-50"
                placeholder="Describe tu local, especialidades, ambiente..."
              />
              {errors.description && <FieldError message={errors.description.message} />}
            </div>

            <div>
              <label htmlFor="address" className="mb-2 block text-sm font-medium text-slate-700">
                Dirección *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  id="address"
                  type="text"
                  {...register("address")}
                  disabled={disableForm}
                  className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 disabled:bg-slate-50"
                  placeholder="Calle y número"
                />
              </div>
              {errors.address && <FieldError message={errors.address.message} />}
            </div>

            <div>
              <label htmlFor="city" className="mb-2 block text-sm font-medium text-slate-700">
                Ciudad *
              </label>
              <input
                id="city"
                type="text"
                {...register("city")}
                disabled={disableForm}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 disabled:bg-slate-50"
                placeholder="Ej: Bogotá"
              />
              {errors.city && <FieldError message={errors.city.message} />}
            </div>

            <div>
              <label htmlFor="country" className="mb-2 block text-sm font-medium text-slate-700">
                País *
              </label>
              <input
                id="country"
                type="text"
                {...register("country")}
                disabled={disableForm}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 disabled:bg-slate-50"
                placeholder="Ej: Colombia"
              />
              {errors.country && <FieldError message={errors.country.message} />}
            </div>

            <div>
              <label htmlFor="phone" className="mb-2 block text-sm font-medium text-slate-700">
                Teléfono *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  id="phone"
                  type="tel"
                  {...register("phone")}
                  disabled={disableForm}
                  className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-400 transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 disabled:bg-slate-50"
                  placeholder="+57 300 123 4567"
                />
              </div>
              {errors.phone && <FieldError message={errors.phone.message} />}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-slate-900">
            <Tag className="h-5 w-5 text-emerald-500" />
            Categorías y características
          </h2>

          <div className="space-y-6">
            <div>
              <label className="mb-3 block text-sm font-medium text-slate-700">
                Categorías * (selecciona al menos una)
              </label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {CATEGORIES.map((category) => {
                  const isSelected = selectedCategories.includes(category.id);
                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => toggleCategory(category.id)}
                      disabled={disableForm}
                      className={`flex items-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition ${
                        isSelected
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                      } disabled:cursor-not-allowed disabled:opacity-60`}
                    >
                      <UtensilsCrossed className="h-4 w-4" />
                      {category.label}
                    </button>
                  );
                })}
              </div>
              {errors.categories && <FieldError message={errors.categories.message} />}
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium text-slate-700">
                Rango de precio *
              </label>
              <div className="flex gap-3">
                {(["low", "medium", "high"] as const).map((range) => {
                  const labels = { low: "$ Económico", medium: "$$ Moderado", high: "$$$ Alto" };
                  const isSelected = selectedPriceRange === range;
                  return (
                    <label
                      key={range}
                      className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-medium transition ${
                        isSelected
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <input
                        type="radio"
                        value={range}
                        {...register("priceRange")}
                        disabled={disableForm}
                        className="sr-only"
                      />
                      {labels[range]}
                    </label>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="mb-3 block text-sm font-medium text-slate-700">
                Estilos musicales (opcional)
              </label>
              <div className="flex flex-wrap gap-2">
                {MUSIC_STYLES.map((style) => {
                  const isSelected = selectedMusicStyles.includes(style);
                  return (
                    <button
                      key={style}
                      type="button"
                      onClick={() => toggleMusicStyle(style)}
                      disabled={disableForm}
                      className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                        isSelected
                          ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                      } disabled:cursor-not-allowed disabled:opacity-60`}
                    >
                      <Music className="h-3 w-3" />
                      {style}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-slate-900">
            <Clock className="h-5 w-5 text-emerald-500" />
            Horarios de atención
          </h2>

          <div className="space-y-4">
            {fields.map((field, index) => {
              const day = DAYS_OF_WEEK.find((d) => d.value === field.day);
              return (
                <div
                  key={field.id}
                  className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center"
                >
                  <div className="flex-1 font-medium text-slate-700 sm:w-32">{day?.label}</div>
                  <div className="flex flex-1 items-center gap-2">
                    <input
                      type="time"
                      {...register(`schedule.${index}.opensAt`)}
                      disabled={disableForm}
                      className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 disabled:bg-slate-50"
                    />
                    <span className="text-slate-500">a</span>
                    <input
                      type="time"
                      {...register(`schedule.${index}.closesAt`)}
                      disabled={disableForm}
                      className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 disabled:bg-slate-50"
                    />
                  </div>
                </div>
              );
            })}
            {errors.schedule && <FieldError message={errors.schedule.message} />}
          </div>
        </section>

        {serverError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {serverError}
          </div>
        )}

        {registerLocalMutation.isSuccess && (
          <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <CheckCircle2 className="h-5 w-5" />
            ¡Local registrado exitosamente! Redirigiendo...
          </div>
        )}

        <div className="flex gap-4">
          <Link
            href="/places"
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={disableForm}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-emerald-400"
          >
            {disableForm ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Registrando local...
              </>
            ) : (
              <>
                Registrar local
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </main>
  );
}

type FieldErrorProps = {
  message?: string;
};

function FieldError({ message }: FieldErrorProps) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs text-red-600">{message}</p>;
}

