"use client";

export default function UserDashboard() {
  return (
    <main className="min-h-screen bg-white px-6 py-16 text-slate-900">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header>
          <h1 className="text-3xl font-semibold">Hola de nuevo</h1>
          <p className="mt-2 text-sm text-slate-600">
            Gestiona tus reservas, favoritos y preferencias desde un solo lugar.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Tus reservas</h2>
            <p className="mt-2 text-sm text-slate-600">
              Resumen del estado de tus reservas (S2-4), con acciones rápidas para cancelar (S2-5).
            </p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Favoritos</h2>
            <p className="mt-2 text-sm text-slate-600">
              Aquí se mostrará la lista de lugares guardados (S3-4, S3-5) y accesos a filtros
              personalizados.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}

