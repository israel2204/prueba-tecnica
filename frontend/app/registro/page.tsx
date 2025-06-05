"use client";
import Link from "next/link";

export default function Register() {
  return (
    <main className="grid h-screen place-items-center">
      <div className="flex flex-col items-center justify-center gap-4 rounded-md border border-gray-300 p-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Registro</h1>
          <p className="text-sm text-gray-500">Crea una cuenta nueva</p>
        </div>
        <form className="grid gap-2">
          <div className="grid">
            <label>Usuario</label>
            <input
              name="username"
              type="text"
              className="h-8 rounded border border-gray-300 px-2"
              required
            />
          </div>
          <div className="grid">
            <label>Correo electrónico</label>
            <input
              name="email"
              type="email"
              className="h-8 rounded border border-gray-300 px-2"
              required
            />
          </div>
          <div className="grid">
            <label>Contraseña</label>
            <input
              name="password"
              type="password"
              className="h-8 rounded border border-gray-300 px-2"
              required
            />
          </div>
          <button className="h-8 rounded bg-black text-white" type="submit">
            Registrarse
          </button>
          <Link href="/" className="mt-2 text-center text-sm text-blue-600">
            ¿Ya tienes cuenta? Inicia sesión
          </Link>
        </form>
      </div>
    </main>
  );
}
