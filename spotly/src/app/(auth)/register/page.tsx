"use client";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-16 text-white">
      <div className="w-full max-w-md rounded-2xl bg-white/5 p-8 shadow-2xl backdrop-blur">
        <header className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight">Crea tu cuenta</h1>
          <p className="mt-2 text-sm text-slate-300">
            Regístrate con correo o Google para guardar reservas y tus lugares favoritos.
          </p>
        </header>
        <section className="mt-10 space-y-4 text-sm text-slate-400">
          <p>
            Este formulario cubrirá S1-1 con validaciones de datos, acuerdos de términos y
            confirmación de correo. El envío usará el cliente HTTP compartido.
          </p>
          <p>
            Próximamente se agregará la selección de rol (usuario vs. dueño de local) y el flujo de
            aprobación para nuevos locales.
          </p>
        </section>
      </div>
    </main>
  );
}

