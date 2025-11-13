"use client";

import { Calendar, Heart, MapPin, Search, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store";

export default function UserDashboard() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const status = useAuthStore((state) => state.status);
  const [isMounted, setIsMounted] = useState(false);

  // Solo verificar autenticación después de que el componente se monte (cliente)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Proteger la ruta: solo usuarios autenticados pueden acceder
  useEffect(() => {
    if (isMounted && (status === "idle" || !user)) {
      router.push("/login?redirect=/user");
    }
  }, [isMounted, status, user, router]);

  // Mostrar loading mientras se monta el componente o se verifica la autenticación
  if (!isMounted || !user) {
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
    <main className="min-h-screen bg-white px-6 py-16 text-slate-900">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header>
          <h1 className="text-3xl font-semibold">
            Hola{user?.name ? `, ${user.name.split(" ")[0]}` : ""} 👋
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Gestiona tus reservas, favoritos y preferencias desde un solo lugar.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          <Link
            href="/places"
            className="group rounded-2xl border border-slate-200 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-sm transition hover:border-emerald-300 hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-emerald-100 p-3 text-emerald-600 group-hover:bg-emerald-200">
                <Search className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Explorar lugares</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Descubre restaurantes, bares y discotecas cerca de ti
                </p>
              </div>
            </div>
          </Link>

          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-3 text-blue-600">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Tus reservas</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Próximamente: verás aquí todas tus reservas activas y pasadas
                </p>
              </div>
            </div>
            <div className="mt-4 rounded-lg bg-white p-4 text-center">
              <p className="text-sm text-slate-500">Aún no tienes reservas</p>
              <Link
                href="/places"
                className="mt-2 inline-block text-sm font-medium text-emerald-600 hover:text-emerald-700"
              >
                Explorar lugares →
              </Link>
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-pink-100 p-3 text-pink-600">
                <Heart className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Favoritos</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Próximamente: guarda tus lugares favoritos para acceder rápido
                </p>
              </div>
            </div>
            <div className="mt-4 rounded-lg bg-white p-4 text-center">
              <p className="text-sm text-slate-500">Aún no tienes favoritos</p>
              <Link
                href="/places"
                className="mt-2 inline-block text-sm font-medium text-emerald-600 hover:text-emerald-700"
              >
                Descubrir lugares →
              </Link>
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-purple-100 p-3 text-purple-600">
                <User className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Mi perfil</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Próximamente: edita tu información personal y preferencias
                </p>
              </div>
            </div>
            <div className="mt-4 space-y-2 rounded-lg bg-white p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Email:</span>
                <span className="font-medium text-slate-900">{user?.email || "—"}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Nombre:</span>
                <span className="font-medium text-slate-900">{user?.name || "—"}</span>
              </div>
            </div>
          </article>
        </div>

        <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
          <div className="flex items-start gap-4">
            <MapPin className="h-5 w-5 text-emerald-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-emerald-900">¿Listo para tu próxima salida?</h3>
              <p className="mt-1 text-sm text-emerald-700">
                Explora los mejores lugares cerca de ti y reserva tu mesa en segundos.
              </p>
              <Link
                href="/places"
                className="mt-3 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Ver lugares disponibles
                <Search className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

