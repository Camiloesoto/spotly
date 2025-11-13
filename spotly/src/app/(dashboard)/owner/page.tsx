"use client";

import Link from "next/link";
import { Building2, Clock, CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store";
import { useRestaurantRequestsQuery } from "@/modules/restaurant-requests/hooks";
import type { RestaurantRequestStatus } from "@/modules/restaurant-requests/types";

const STATUS_LABELS: Record<RestaurantRequestStatus, { label: string; description: string; icon: typeof Building2; color: string }> = {
  pending_review: {
    label: "Pendiente de revisión",
    description: "Tu solicitud está siendo revisada por nuestro equipo. Te notificaremos cuando haya una actualización.",
    icon: Clock,
    color: "text-amber-400",
  },
  pre_approved: {
    label: "Pre-aprobada",
    description: "¡Tu solicitud ha sido pre-aprobada! Ahora puedes completar tu perfil y enviarlo para la revisión final.",
    icon: CheckCircle2,
    color: "text-blue-400",
  },
  rejected: {
    label: "Rechazada",
    description: "Tu solicitud fue rechazada. Puedes revisar los detalles y enviar una nueva solicitud si lo deseas.",
    icon: XCircle,
    color: "text-red-400",
  },
  in_review: {
    label: "En revisión",
    description: "Tu perfil está siendo revisado. Te notificaremos cuando sea publicado.",
    icon: Clock,
    color: "text-purple-400",
  },
  published: {
    label: "Publicado",
    description: "¡Tu local está publicado y visible en Seki! Ya puedes recibir reservas.",
    icon: CheckCircle2,
    color: "text-emerald-400",
  },
  changes_requested: {
    label: "Cambios requeridos",
    description: "Se requieren algunos cambios en tu perfil. Revisa los detalles y actualiza la información.",
    icon: AlertCircle,
    color: "text-orange-400",
  },
  suspended: {
    label: "Suspendido",
    description: "Tu local ha sido suspendido temporalmente. Contacta al soporte para más información.",
    icon: XCircle,
    color: "text-slate-400",
  },
};

export default function OwnerDashboard() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const status = useAuthStore((state) => state.status);
  const [isClient, setIsClient] = useState(false);

  // Obtener solicitudes del usuario (filtrar por su email)
  const { data: requestsData, isLoading: isLoadingRequests } = useRestaurantRequestsQuery();
  const userRequest = requestsData?.data.find((req) => req.contactEmail === user?.email);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Proteger la ruta: solo usuarios autenticados con rol owner pueden acceder
  useEffect(() => {
    if (isClient) {
      if (status === "idle" || !user) {
        router.push("/login?redirect=/owner");
        return;
      }
      if (user.role !== "owner") {
        // Redirigir según el rol del usuario
        if (user.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/user");
        }
        return;
      }
    }
  }, [isClient, status, user, router]);

  // Mostrar loading mientras se monta el componente o se verifica la autenticación
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

  const StatusIcon = userRequest ? STATUS_LABELS[userRequest.status].icon : Building2;
  const statusInfo = userRequest ? STATUS_LABELS[userRequest.status] : null;

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header>
          <h1 className="text-3xl font-semibold">Panel del local</h1>
          <p className="mt-2 text-sm text-slate-300">
            Desde aquí el dueño administrará su perfil, reservas entrantes, preórdenes y métricas futuras.
          </p>
        </header>

        {/* Estado de la solicitud o prompt para registrar */}
        {isLoadingRequests ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-emerald-400" />
              <p className="text-sm text-slate-300">Verificando estado de tu solicitud...</p>
            </div>
          </div>
        ) : userRequest ? (
          <div className={`rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur ${statusInfo?.color.replace("text-", "border-")}`}>
            <div className="flex items-start gap-4">
              <div className={`rounded-lg bg-white/10 p-3 ${statusInfo?.color}`}>
                <StatusIcon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h2 className="mb-2 text-lg font-semibold text-white">Estado de tu solicitud</h2>
                <p className={`mb-3 text-sm font-medium ${statusInfo?.color}`}>
                  {statusInfo?.label}
                </p>
                <p className="mb-4 text-sm text-slate-300">
                  {statusInfo?.description}
                </p>
                {userRequest.status === "pending_review" && (
                  <p className="text-xs text-slate-400">
                    Enviada el {new Date(userRequest.submittedAt).toLocaleDateString("es-CO", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                )}
                {userRequest.status === "pre_approved" && (
                  <Link
                    href={`/owner/profile`}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-slate-950"
                  >
                    <Building2 className="h-4 w-4" />
                    Completar perfil del local
                  </Link>
                )}
                {userRequest.status === "rejected" && userRequest.rejectionReason && (
                  <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3">
                    <p className="text-xs font-medium text-red-400 mb-1">Razón del rechazo:</p>
                    <p className="text-sm text-red-300">{userRequest.rejectionReason}</p>
                  </div>
                )}
                {userRequest.status === "rejected" && (
                  <Link
                    href="/places/new"
                    className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-slate-950"
                  >
                    Enviar nueva solicitud
                  </Link>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur">
            <h2 className="mb-4 text-lg font-semibold text-white">¿Aún no has registrado tu local?</h2>
            <p className="mb-4 text-sm text-slate-300">
              Completa el formulario de solicitud para que tu establecimiento sea evaluado y pueda aparecer en Seki.
              Una vez aprobado, podrás comenzar a recibir reservas.
            </p>
            <Link
              href="/places/new"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              <Building2 className="h-4 w-4" />
              Enviar solicitud de registro
            </Link>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur">
            <h2 className="text-lg font-semibold text-white">Próximas funcionalidades</h2>
            <ul className="mt-4 space-y-2 text-sm text-slate-200">
              <li>• Completar y enviar perfil del restaurante (HU-R03)</li>
              <li>• Configurar capacidad y horarios de reservas (HU-R04)</li>
              <li>• Ver reservas del día (HU-R05)</li>
              <li>• Cambiar estado de las reservas (HU-R06)</li>
              <li>• Bloquear horarios específicos (HU-R07)</li>
            </ul>
          </article>
          <article className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur">
            <h2 className="text-lg font-semibold text-white">Reservas</h2>
            <p className="mt-2 text-sm text-slate-200">
              Este módulo mostrará reservas pendientes, confirmadas y rechazadas con acciones rápidas para gestionar
              el flujo de clientes (HU-R05, HU-R06).
            </p>
            {userRequest?.status === "published" && (
              <Link
                href="/owner/bookings"
                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Ver reservas
              </Link>
            )}
          </article>
        </div>
      </section>
    </main>
  );
}
