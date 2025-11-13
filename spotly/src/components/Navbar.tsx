"use client";

import { LogIn, LogOut, User, UtensilsCrossed } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { logout } from "@/modules/auth/service";
import { useAuthStore } from "@/lib/store/auth-store";

export function Navbar() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const status = useAuthStore((state) => state.status);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <nav className="border-b border-slate-800 bg-slate-950/95 backdrop-blur-sm">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-bold text-white transition hover:text-emerald-400">
          Seki
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/places"
            className="text-sm font-medium text-slate-300 transition hover:text-white"
          >
            Lugares
          </Link>

          {status === "authenticated" && user ? (
            <>
              {user.role === "owner" && (
                <Link
                  href="/places/new"
                  className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
                >
                  <UtensilsCrossed className="h-4 w-4" />
                  Registrar local
                </Link>
              )}
              <Link
                href={
                  user.role === "admin"
                    ? "/dashboard/admin"
                    : user.role === "owner"
                      ? "/dashboard/owner"
                      : "/dashboard/user"
                }
                className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                <User className="h-4 w-4" />
                {user.name}
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
              >
                <LogOut className="h-4 w-4" />
                Salir
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/50 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                <LogIn className="h-4 w-4" />
                Iniciar sesión
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600"
              >
                Crear cuenta
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

