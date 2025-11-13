"use client";

import { Calendar, Heart, Search, User, Settings, Clock } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store";

export default function UserDashboard() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const status = useAuthStore((state) => state.status);
  const [isClient, setIsClient] = useState(false);

  // Solo verificar autenticación después de que el componente se monte (cliente)
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Proteger la ruta: solo usuarios autenticados pueden acceder
  useEffect(() => {
    if (isClient && (status === "idle" || !user)) {
      router.push("/login?redirect=/user");
    }
  }, [isClient, status, user, router]);

  // Mostrar loading mientras se monta el componente o se verifica la autenticación
  if (!isClient || !user) {
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
              <h1 className="text-2xl font-bold text-slate-900">Mi cuenta</h1>
              <p className="mt-1 text-sm text-slate-600">{user.email}</p>
            </div>
            <Link
              href="/places"
              className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
            >
              <Search className="h-4 w-4" />
              Buscar restaurantes
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Reservas */}
            <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-slate-600" />
                  Mis reservas
                </h2>
              </div>
              <div className="rounded-lg border border-slate-100 bg-slate-50 p-8 text-center">
                <Calendar className="mx-auto h-12 w-12 text-slate-400 mb-3" />
                <p className="text-sm font-medium text-slate-900 mb-1">No tienes reservas</p>
                <p className="text-sm text-slate-600 mb-4">
                  Cuando hagas una reserva, aparecerá aquí
                </p>
                <Link
                  href="/places"
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
                >
                  Explorar restaurantes
                </Link>
              </div>
            </section>

            {/* Favoritos */}
            <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-slate-600" />
                  Mis favoritos
                </h2>
              </div>
              <div className="rounded-lg border border-slate-100 bg-slate-50 p-8 text-center">
                <Heart className="mx-auto h-12 w-12 text-slate-400 mb-3" />
                <p className="text-sm font-medium text-slate-900 mb-1">No tienes favoritos</p>
                <p className="text-sm text-slate-600 mb-4">
                  Guarda tus restaurantes favoritos para acceder rápido
                </p>
                <Link
                  href="/places"
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Descubrir lugares
                </Link>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Perfil */}
            <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-slate-600" />
                Mi perfil
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
                <button className="mt-4 w-full rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 flex items-center justify-center gap-2">
                  <Settings className="h-4 w-4" />
                  Editar perfil
                </button>
              </div>
            </section>

            {/* Accesos rápidos */}
            <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">Accesos rápidos</h2>
              <div className="space-y-2">
                <Link
                  href="/places"
                  className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  <Search className="h-5 w-5 text-slate-600" />
                  Buscar restaurantes
                </Link>
                <Link
                  href="/places"
                  className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  <Clock className="h-5 w-5 text-slate-600" />
                  Historial de reservas
                </Link>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

