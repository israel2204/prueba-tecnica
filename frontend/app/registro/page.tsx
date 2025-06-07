"use client";
import Link from "next/link";
import { useState } from "react";

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMensaje("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      username: formData.get("username"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    try {
      const res = await fetch("http://localhost:5000/api/Auth/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setMensaje(
          "¡Usuario registrado correctamente! Ahora puedes iniciar sesión."
        );
        e.currentTarget.reset();
      } else {
        let errorMsg = "Error al registrar usuario";
        const text = await res.text();
        if (text) {
          try {
            const error = JSON.parse(text);
            errorMsg = error.error || errorMsg;
          } catch {
            errorMsg = text;
          }
        } else {
          errorMsg = "Error al registrar usuario. Código: " + res.status;
        }
        setMensaje(errorMsg);
      }
    } catch {
      setMensaje("No se pudo conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid h-screen place-items-center">
      <div className="flex flex-col items-center justify-center gap-4 rounded-md border border-gray-300 p-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Registro</h1>
          <p className="text-sm text-gray-500">Crea una cuenta nueva</p>
        </div>
        <form className="grid gap-2" onSubmit={handleSubmit}>
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
          <button
            className="h-8 rounded bg-black text-white"
            type="submit"
            disabled={loading}
          >
            {loading ? "Registrando..." : "Registrarse"}
          </button>
          {mensaje && (
            <div className="mt-2 text-center text-sm text-red-600">
              {mensaje}
            </div>
          )}
          <Link href="/" className="mt-2 text-center text-sm text-blue-600">
            ¿Ya tienes cuenta? Inicia sesión
          </Link>
        </form>
      </div>
    </main>
  );
}
