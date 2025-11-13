"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Clock, Loader2, Users, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useCreateBookingMutation } from "@/modules/bookings/hooks";
import { useRouter } from "next/navigation";

const bookingSchema = z.object({
  date: z.string().min(1, "Selecciona una fecha"),
  time: z.string().min(1, "Selecciona una hora"),
  numberOfGuests: z
    .number()
    .min(1, "Debe haber al menos 1 persona")
    .max(20, "Máximo 20 personas por reserva"),
  specialRequests: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

type BookingFormProps = {
  placeId: string;
  placeName: string;
  onSuccess?: () => void;
};

export function BookingForm({ placeId, placeName, onSuccess }: BookingFormProps) {
  const router = useRouter();
  const createBookingMutation = useCreateBookingMutation();
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      date: "",
      time: "",
      numberOfGuests: 2,
      specialRequests: "",
    },
  });

  const onSubmit = async (values: BookingFormValues) => {
    try {
      await createBookingMutation.mutateAsync({
        placeId,
        date: values.date,
        time: values.time,
        numberOfGuests: values.numberOfGuests,
        specialRequests: values.specialRequests || undefined,
      });

      setShowSuccess(true);
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 2000);
      } else {
        setTimeout(() => {
          router.push("/user");
        }, 2000);
      }
    } catch (error) {
      console.error("Error al crear reserva:", error);
    }
  };

  // Generar opciones de hora (cada 30 minutos desde 12:00 hasta 23:00)
  const timeOptions: string[] = [];
  for (let hour = 12; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
      timeOptions.push(timeString);
    }
  }

  // Fecha mínima: hoy
  const today = new Date().toISOString().split("T")[0];
  // Fecha máxima: 3 meses desde hoy
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateString = maxDate.toISOString().split("T")[0];

  if (showSuccess) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500">
          <Calendar className="h-6 w-6 text-white" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-emerald-900">¡Reserva creada!</h3>
        <p className="text-sm text-emerald-700">
          Tu reserva en <strong>{placeName}</strong> ha sido enviada. Te redirigiremos a tus reservas...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="date" className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
          <Calendar className="h-4 w-4 text-slate-500" />
          Fecha
        </label>
        <input
          type="date"
          id="date"
          min={today}
          max={maxDateString}
          {...register("date")}
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2"
        />
        {errors.date && (
          <p className="mt-1 text-xs text-red-600">{errors.date.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="time" className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
          <Clock className="h-4 w-4 text-slate-500" />
          Hora
        </label>
        <select
          id="time"
          {...register("time")}
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2"
        >
          <option value="">Selecciona una hora</option>
          {timeOptions.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
        {errors.time && (
          <p className="mt-1 text-xs text-red-600">{errors.time.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="numberOfGuests" className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
          <Users className="h-4 w-4 text-slate-500" />
          Número de personas
        </label>
        <input
          type="number"
          id="numberOfGuests"
          min={1}
          max={20}
          {...register("numberOfGuests", { valueAsNumber: true })}
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2"
        />
        {errors.numberOfGuests && (
          <p className="mt-1 text-xs text-red-600">{errors.numberOfGuests.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="specialRequests" className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700">
          <MessageSquare className="h-4 w-4 text-slate-500" />
          Solicitudes especiales (opcional)
        </label>
        <textarea
          id="specialRequests"
          rows={3}
          {...register("specialRequests")}
          placeholder="Ej: Mesa cerca de la ventana, celebración de cumpleaños..."
          className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 transition focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting || createBookingMutation.isPending}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting || createBookingMutation.isPending ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Creando reserva...
          </>
        ) : (
          <>
            <Calendar className="h-5 w-5" />
            Confirmar reserva
          </>
        )}
      </button>
    </form>
  );
}

