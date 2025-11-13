"use client";

import { AlertCircle, Building2, CheckCircle2, Clock, FileText, Shield, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store";

export default function AdminDashboard() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const status = useAuthStore((state) => state.status);
  const [isClient, setIsClient] = useState(false);

  // Solo verificar autenticación después de que el componente se monte (cliente)
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Proteger la ruta: solo administradores pueden acceder
  useEffect(() => {
    if (isClient) {
      if (status === "idle" || !user) {
        router.push("/login?redirect=/admin");
        return;
      }
      if (user.role !== "admin") {
        // Redirigir según el rol del usuario
        if (user.role === "owner") {
          router.push("/owner");
        } else {
          router.push("/user");
        }
        return;
      }
    }
  }, [isClient, status, user, router]);

  // Mostrar loading mientras se monta el componente o se verifica la autenticación
  if (!isClient || !user || user.role !== "admin") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
          <p className="text-sm text-slate-600">Cargando...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Panel administrativo</h1>
              <p className="mt-1 text-sm text-slate-600">
                Gestiona la plataforma, aprueba locales y monitorea métricas
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-1.5">
              <Shield className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-900">Administrador</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Métricas principales */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Usuarios activos</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">1,234</p>
                <p className="mt-1 text-xs text-slate-500">+12% este mes</p>
              </div>
              <div className="rounded-lg bg-blue-100 p-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Locales activos</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">89</p>
                <p className="mt-1 text-xs text-slate-500">+5 este mes</p>
              </div>
              <div className="rounded-lg bg-emerald-100 p-3">
                <Building2 className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Reservas hoy</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">342</p>
                <p className="mt-1 text-xs text-slate-500">+8% vs ayer</p>
              </div>
              <div className="rounded-lg bg-purple-100 p-3">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Pendientes revisión</p>
                <p className="mt-2 text-3xl font-bold text-slate-900">12</p>
                <p className="mt-1 text-xs text-slate-500">Solicitudes nuevas</p>
              </div>
              <div className="rounded-lg bg-amber-100 p-3">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Secciones principales */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Solicitudes pendientes */}
            <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-slate-600" />
                  Solicitudes de locales pendientes
                </h2>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
                  12 pendientes
                </span>
              </div>
              <div className="space-y-3">
                {/* Placeholder para solicitudes */}
                <div className="rounded-lg border border-slate-100 bg-slate-50 p-6 text-center">
                  <Building2 className="mx-auto h-12 w-12 text-slate-400 mb-3" />
                  <p className="text-sm font-medium text-slate-900 mb-1">
                    No hay solicitudes pendientes
                  </p>
                  <p className="text-sm text-slate-600">
                    Las nuevas solicitudes de locales aparecerán aquí para revisión
                  </p>
                </div>
              </div>
            </section>

            {/* Actividad reciente */}
            <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-slate-600" />
                Actividad reciente
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50 p-4">
                  <div className="rounded-full bg-emerald-100 p-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">
                      Local &quot;El Buen Sabor&quot; aprobado
                    </p>
                    <p className="mt-1 text-xs text-slate-600">Hace 2 horas</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50 p-4">
                  <div className="rounded-full bg-blue-100 p-2">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">
                      Nuevo usuario registrado
                    </p>
                    <p className="mt-1 text-xs text-slate-600">Hace 3 horas</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-lg border border-slate-100 bg-slate-50 p-4">
                  <div className="rounded-full bg-amber-100 p-2">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">
                      Solicitud de local requiere atención
                    </p>
                    <p className="mt-1 text-xs text-slate-600">Hace 5 horas</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Acciones rápidas */}
            <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Acciones rápidas</h2>
              <div className="space-y-2">
                <Link
                  href="/admin/places"
                  className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  <Building2 className="h-5 w-5 text-slate-600" />
                  Gestionar locales
                </Link>
                <Link
                  href="/admin/users"
                  className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  <Users className="h-5 w-5 text-slate-600" />
                  Gestionar usuarios
                </Link>
                <Link
                  href="/admin/metrics"
                  className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  <TrendingUp className="h-5 w-5 text-slate-600" />
                  Ver métricas
                </Link>
              </div>
            </section>

            {/* Información del administrador */}
            <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Shield className="h-5 w-5 text-slate-600" />
                Mi cuenta
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                    Nombre
                  </p>
                  <p className="text-sm font-medium text-slate-900">{user.name}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                    Email
                  </p>
                  <p className="text-sm font-medium text-slate-900">{user.email}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                    Rol
                  </p>
                  <div className="mt-1 inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-2 py-1">
                    <Shield className="h-3 w-3 text-emerald-600" />
                    <span className="text-xs font-semibold text-emerald-900">Administrador</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
