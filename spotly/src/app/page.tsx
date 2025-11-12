export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 py-24 text-white">
      <section className="max-w-3xl text-center">
        <span className="rounded-full bg-white/10 px-4 py-1 text-sm font-medium uppercase tracking-wide text-slate-200">
          Plataforma Spotly
        </span>
        <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
          Reserva, preordena y descubre los mejores planes nocturnos de tu ciudad.
        </h1>
        <p className="mt-6 text-lg text-slate-300">
          Spotly conecta usuarios con restaurantes, bares y discotecas. Encuentra lugares,
          guarda tus favoritos y gestiona reservas en un solo lugar.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="/auth/login"
            className="rounded-full bg-emerald-500 px-6 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400"
          >
            Iniciar sesión
          </a>
          <a
            href="/auth/register"
            className="rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:border-emerald-300 hover:text-emerald-300"
          >
            Crear cuenta
          </a>
        </div>
      </section>
    </main>
  );
}
