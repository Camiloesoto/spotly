"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Loader2, Lock, LogIn, Mail, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useLoginMutation, useOAuthMutation } from "@/modules/auth/hooks";
import type { Session } from "@/modules/auth/types";

const loginSchema = z.object({
  email: z.string().trim().email("Ingresa un correo válido"),
  password: z.string().min(1, "Ingresa tu contraseña"),
  remember: z.boolean().default(false),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const loginMutation = useLoginMutation();
  const oauthMutation = useOAuthMutation();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      const session = await loginMutation.mutateAsync({
        email: values.email,
        password: values.password,
      });
      redirectByRole(session, router);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No pudimos iniciar sesión. Revisa tus credenciales e inténtalo de nuevo.";
      setServerError(message);
    }
  });

  const disableForm = isSubmitting || loginMutation.isPending;

  const handleContinueWithGoogle = async () => {
    setServerError(null);
    try {
      const { redirectUrl } = await oauthMutation.mutateAsync("google");
      window.location.href = redirectUrl;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No pudimos conectarnos con Google. Intenta más tarde.";
      setServerError(message);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.18),_transparent_55%)]" />
      <div className="relative z-10 grid w-full max-w-4xl gap-10 rounded-3xl border border-white/10 bg-white/[0.05] p-10 shadow-[0_22px_70px_-12px_rgba(0,0,0,0.55)] backdrop-blur-xl md:grid-cols-[1.05fr_0.95fr] md:p-14">
        <section className="flex flex-col justify-between">
          <div>
            <span className="inline-flex items-center rounded-full bg-sky-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-sky-200">
              vuelve a spotly
            </span>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-5xl">
              Accede a tus reservas en segundos
            </h1>
            <p className="mt-4 text-base text-slate-300">
              Ten a mano tus lugares favoritos, continúa una pre-reserva o responde solicitudes de
              tus clientes desde cualquier dispositivo.
            </p>
          </div>

          <ul className="mt-10 space-y-3 text-sm text-slate-300">
            <li className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-sky-200" />
              Autenticación protegida con tokens y refresco automático.
            </li>
            <li className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-sky-200" />
              Diferenciamos paneles según tu rol: usuario, dueño o admin.
            </li>
            <li className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-sky-200" />
              Reintentos seguros y feedback inmediato ante credenciales inválidas.
            </li>
          </ul>
        </section>

        <section className="flex flex-col justify-center">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                <Mail className="h-4 w-4 text-sky-200" />
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="tu-email@spotly.com"
                className="w-full rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none transition hover:border-sky-400/40 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/30"
                {...register("email")}
                disabled={disableForm}
              />
              {errors.email && <FieldError message={errors.email.message} />}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="flex items-center gap-2 text-sm font-medium">
                <Lock className="h-4 w-4 text-sky-200" />
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="Ingresa tu contraseña"
                className="w-full rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none transition hover:border-sky-400/40 focus:border-sky-400 focus:ring-2 focus:ring-sky-400/30"
                {...register("password")}
                disabled={disableForm}
              />
              {errors.password && <FieldError message={errors.password.message} />}
            </div>

            <div className="flex items-center justify-between text-sm text-slate-300">
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border border-white/30 bg-transparent accent-sky-400"
                  {...register("remember")}
                  disabled={disableForm}
                />
                Recordarme 30 días
              </label>
              <Link
                href="/auth/forgot-password"
                className="text-sky-200 underline-offset-4 hover:underline"
              >
                Recuperar contraseña
              </Link>
            </div>

            {serverError && (
              <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {serverError}
              </div>
            )}

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:bg-sky-400/60"
              disabled={disableForm}
            >
              {disableForm ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verificando credenciales...
                </>
              ) : (
                <>
                  Iniciar sesión
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 space-y-4">
            <button
              type="button"
              onClick={handleContinueWithGoogle}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:border-sky-300/40 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
              disabled={disableForm || oauthMutation.isPending}
            >
              {oauthMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Conectando con Google...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Continuar con Google
                </>
              )}
            </button>

            <p className="text-sm text-slate-300">
              ¿Aún no tienes cuenta?{" "}
              <Link
                href="/auth/register"
                className="text-sky-200 underline-offset-4 hover:underline"
              >
                Regístrate gratis
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

function redirectByRole(session: Session, router: ReturnType<typeof useRouter>) {
  const role = session.user.role;
  if (role === "owner") {
    router.push("/dashboard/owner");
    return;
  }
  if (role === "admin") {
    router.push("/dashboard/admin");
    return;
  }
  router.push("/dashboard/user");
}

type FieldErrorProps = {
  message?: string;
};

function FieldError({ message }: FieldErrorProps) {
  if (!message) return null;
  return <p className="text-xs text-red-300">{message}</p>;
}
