"use client";

export default function AdminDashboard() {
  return (
    <main className="min-h-screen bg-slate-100 px-6 py-16 text-slate-950">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header>
          <h1 className="text-3xl font-semibold">Panel administrativo</h1>
          <p className="mt-2 text-sm text-slate-600">
            Aquí se gestionará la aprobación de locales (S1-7), la moderación de cuentas (S4-6) y
            las métricas generales (S4-7).
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Aprobaciones pendientes</h2>
            <p className="mt-2 text-sm text-slate-600">
              Listado de locales que requieren revisión. Este bloque se conectará con la API de
              onboarding de locales.
            </p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Métricas clave</h2>
            <p className="mt-2 text-sm text-slate-600">
              Placeholder para métricas de usuarios activos, reservas confirmadas y locales
              aprobados.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}

