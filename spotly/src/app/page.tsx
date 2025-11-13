import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 py-24 text-white">
      <section className="max-w-3xl text-center">
        <span className="rounded-full bg-white/10 px-4 py-1 text-sm font-medium uppercase tracking-wide text-slate-200">
          Plataforma Seki
        </span>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
          Encuentra dónde ir según el plan que tengas en mente
        </h1>
        <p className="mt-6 text-lg text-slate-300">
          Seki te ayuda a encontrar restaurantes, bares y discotecas ideales según zona, presupuesto, tipo de música y con quién vas. Reserva, pre-ordena y divide la cuenta con tus amigos.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/auth/login"
            className="rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/auth/register"
            className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:border-emerald-300 hover:text-emerald-300"
          >
            Crear cuenta
          </Link>
          <Link
            href="/places/new"
            className="rounded-full border border-emerald-400/50 bg-emerald-500/10 px-6 py-3 text-sm font-semibold text-emerald-300 transition hover:border-emerald-300 hover:bg-emerald-500/20"
          >
            Registrar mi local
          </Link>
        </div>
      </section>
    </main>
  );
}
