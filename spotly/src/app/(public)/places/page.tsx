export default function PlacesPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-8 px-6 py-16">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-slate-900">Lugares destacados</h1>
        <p className="text-sm text-slate-500">
          Vista pública con listado y filtros básicos (S1-3, S1-4). Se conectará a la API para
          traer lugares cercanos y búsquedas por nombre.
        </p>
      </header>

      <section className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-600">
          Aquí irá el grid de tarjetas de lugares, filtros por ubicación y buscador. Implementación
          futura con React Query + suscripciones en tiempo real según disponibilidad.
        </p>
      </section>
    </main>
  );
}

