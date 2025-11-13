"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  LogIn,
  Lock,
  Mail,
  ShieldCheck,
  User2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { type UseFormRegister, useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { useOAuthMutation, useRegisterUserMutation } from "@/modules/auth/hooks";

const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(3, "Tu nombre debe tener al menos 3 caracteres")
      .max(80, "Máximo 80 caracteres"),
    email: z.string().trim().email("Ingresa un correo válido"),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(/[A-Z]/, "Incluye al menos una mayúscula")
      .regex(/[0-9]/, "Incluye al menos un número"),
    confirmPassword: z.string().min(1, "Confirma tu contraseña"),
    role: z.enum(["user", "owner"]),
    acceptTerms: z
      .boolean()
      .refine((value) => value, "Debes aceptar los términos y condiciones"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Las contraseñas no coinciden",
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const registerMutation = useRegisterUserMutation();
  const oauthMutation = useOAuthMutation();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "user",
      acceptTerms: false,
    },
  });

  const selectedRole = useWatch({
    control,
    name: "role",
  });

  const onSubmit = handleSubmit(async ({ confirmPassword: _confirmPassword, ...payload }) => {
    setServerError(null);
    setIsSuccess(false);
    void _confirmPassword;

    try {
      await registerMutation.mutateAsync(payload);
      setIsSuccess(true);
      const nextPath = payload.role === "owner" ? "/owner" : "/user";
      setTimeout(() => router.push(nextPath), 900);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "No pudimos crear tu cuenta. Intenta de nuevo en unos segundos.";
      setServerError(message);
    }
  });

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

  const disableForm = isSubmitting || registerMutation.isPending;

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-white">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.18),_transparent_55%)]" />
      <div className="relative z-10 grid w-full max-w-5xl gap-12 rounded-3xl border border-white/10 bg-white/[0.06] p-10 shadow-[0_22px_70px_-12px_rgba(0,0,0,0.6)] backdrop-blur-xl md:grid-cols-[1.1fr_0.9fr] md:p-14">
        <section className="flex flex-col justify-between">
          <div>
            <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">
              nuevo en Seki
            </span>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight md:text-5xl">
              Crea tu cuenta y guarda tus planes favoritos
            </h1>
            <p className="mt-4 text-base text-slate-300">
              Al registrarte podrás reservar mesas en segundos, descubrir lugares según tu estilo y
              retomar tus búsquedas desde cualquier dispositivo.
            </p>
          </div>

          <ul className="mt-10 space-y-3 text-sm text-slate-300">
            <li className="flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-300" />
              Autenticación segura con verificación de correo.
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-300" />
              Sincroniza tus reservas, favoritos y preferencias.
            </li>
            <li className="flex items-center gap-3">
              <ArrowRight className="h-5 w-5 text-emerald-300" />
              Acceso rápido al panel con flujos diferenciados para usuarios y dueños.
            </li>
          </ul>

          <p className="mt-10 hidden text-xs text-slate-500 md:block">
            Al continuar confirmas que leíste y aceptas los{" "}
            <Link href="/legal/terminos" className="text-emerald-300 underline-offset-4 hover:underline">
              Términos & Condiciones
            </Link>{" "}
            de Seki.
          </p>
        </section>

        <section className="flex flex-col justify-center">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label htmlFor="fullName" className="flex items-center gap-2 text-sm font-medium">
                <User2 className="h-4 w-4 text-emerald-300" />
                Nombre completo
              </label>
              <input
                id="fullName"
                type="text"
                autoComplete="name"
                placeholder="María Camila Torres"
                className="w-full rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none transition hover:border-emerald-400/40 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30"
                {...register("fullName")}
                disabled={disableForm}
              />
              {errors.fullName && <FieldError message={errors.fullName.message} />}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                <Mail className="h-4 w-4 text-emerald-300" />
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="tu-email@ejemplo.com"
                className="w-full rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none transition hover:border-emerald-400/40 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30"
                {...register("email")}
                disabled={disableForm}
              />
              {errors.email && <FieldError message={errors.email.message} />}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label htmlFor="password" className="flex items-center gap-2 text-sm font-medium">
                  <Lock className="h-4 w-4 text-emerald-300" />
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Mínimo 8 caracteres"
                  className="w-full rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none transition hover:border-emerald-400/40 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30"
                  {...register("password")}
                  disabled={disableForm}
                />
                {errors.password && <FieldError message={errors.password.message} />}
              </div>
              <div className="space-y-1.5">
                <label
                  htmlFor="confirmPassword"
                  className="flex items-center gap-2 text-sm font-medium"
                >
                  <Lock className="h-4 w-4 text-emerald-300" />
                  Repite tu contraseña
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Debe coincidir"
                  className="w-full rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none transition hover:border-emerald-400/40 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/30"
                  {...register("confirmPassword")}
                  disabled={disableForm}
                />
                {errors.confirmPassword && <FieldError message={errors.confirmPassword.message} />}
              </div>
            </div>

            <fieldset className="space-y-3">
              <legend className="text-sm font-medium text-white">¿Cómo usarás Seki?</legend>
              <div className="grid gap-3 sm:grid-cols-2">
                <RoleOption
                  id="role-user"
                  title="Busco lugares"
                  description="Reservo mesas, guardo favoritos y descubro planes según mi mood."
                  value="user"
                  isActive={selectedRole === "user"}
                  register={register}
                  disabled={disableForm}
                />
                <RoleOption
                  id="role-owner"
                  title="Tengo un local"
                  description="Gestiono reservas, menú y visibilidad. Podrás completar tu perfil luego."
                  value="owner"
                  isActive={selectedRole === "owner"}
                  register={register}
                  disabled={disableForm}
                />
              </div>
              {errors.role && <FieldError message={errors.role.message} />}
            </fieldset>

            <label className="flex items-start gap-3 text-sm text-slate-300">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border border-white/30 bg-transparent accent-emerald-400"
                {...register("acceptTerms")}
                disabled={disableForm}
              />
              <span>
                Acepto los{" "}
                <Link href="/legal/terminos" className="text-emerald-300 underline-offset-4 hover:underline">
                  términos y condiciones
                </Link>{" "}
                y autorizo el tratamiento de mis datos según la política de privacidad.
              </span>
            </label>
            {errors.acceptTerms && <FieldError message={errors.acceptTerms.message} />}

            {serverError && (
              <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {serverError}
              </div>
            )}

            {isSuccess && (
              <div className="flex items-center gap-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                <CheckCircle2 className="h-5 w-5" />
                ¡Cuenta creada! Te redirigiremos a tu panel para comenzar.
              </div>
            )}

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:bg-emerald-400/60"
              disabled={disableForm}
            >
              {disableForm ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creando tu cuenta...
                </>
              ) : (
                <>
                  Crear cuenta
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 space-y-4">
            <button
              type="button"
              onClick={handleContinueWithGoogle}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:border-emerald-400/40 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:cursor-not-allowed disabled:opacity-60"
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
              ¿Ya tienes una cuenta?{" "}
              <Link href="/login" className="text-emerald-300 underline-offset-4 hover:underline">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

type RoleOptionProps = {
  id: string;
  title: string;
  description: string;
  value: "user" | "owner";
  isActive: boolean;
  register: UseFormRegister<RegisterFormValues>;
  disabled: boolean;
};

function RoleOption({ id, title, description, value, isActive, register, disabled }: RoleOptionProps) {
  return (
    <label
      htmlFor={id}
      className={`group flex h-full cursor-pointer flex-col rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-emerald-400/40 hover:bg-white/10 ${
        isActive ? "border-emerald-400/60 bg-emerald-400/10" : ""
      } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
    >
      <div className="flex items-center justify-between">
        <input
          type="radio"
          id={id}
          value={value}
          className="h-4 w-4 accent-emerald-400"
          {...register("role")}
          disabled={disabled}
        />
        {isActive && <CheckCircle2 className="h-5 w-5 text-emerald-300" />}
      </div>
      <span className="mt-3 text-sm font-semibold text-white">{title}</span>
      <span className="mt-2 text-xs text-slate-300">{description}</span>
    </label>
  );
}

type FieldErrorProps = {
  message?: string;
};

function FieldError({ message }: FieldErrorProps) {
  if (!message) return null;
  return <p className="text-xs text-red-300">{message}</p>;
}
