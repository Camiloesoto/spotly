"use client";

export default function OwnerDashboard() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header>
          <h1 className="text-3xl font-semibold">Panel del local</h1>
          <p className="mt-2 text-sm text-slate-300">
            Desde aquí el dueño administrará su perfil, reservas entrantes (S2-6), preórdenes y
            métricas futuras.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur">
            <h2 className="text-lg font-semibold text-white">
              Próximas tareas de Sprint 1
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-slate-200">
              <li>• Completar formulario de registro de local (S1-5).</li>
              <li>• Permitir edición de perfil (S1-6).</li>
              <li>• Preparar integración con flujo de aprobación de admin (S1-7).</li>
            </ul>
          </article>
          <article className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg backdrop-blur">
            <h2 className="text-lg font-semibold text-white">Reservas</h2>
            <p className="mt-2 text-sm text-slate-200">
              Este módulo mostrará reservas pendientes, confirmadas y rechazadas con acciones rápidas
              (S2-6, S2-7).
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}

