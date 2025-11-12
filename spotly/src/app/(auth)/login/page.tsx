"use client";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-16 text-white">
      <div className="w-full max-w-md rounded-2xl bg-white/5 p-8 shadow-2xl backdrop-blur">
        <header className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight">Bienvenido a Spotly</h1>
          <p className="mt-2 text-sm text-slate-300">
            Inicia sesión con tu correo o continúa con Google para gestionar tus reservas.
          </p>
        </header>
        <section className="mt-10 space-y-4 text-sm text-slate-400">
          <p>
            Aquí irá el formulario de autenticación (S1-2). La integración se conectará con el
            módulo de autenticación y el backend para emitir tokens (JWT).
          </p>
          <p>
            También se incluirá el botón de inicio de sesión con Google y la lógica de redirección
            según el tipo de usuario (cliente, dueño de local, admin).
          </p>
        </section>
      </div>
    </main>
  );
}

