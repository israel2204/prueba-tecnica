"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMensaje("");
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      username: formData.get("username"),
      password: formData.get("password"),
    };

    try {
      const res = await fetch("https://localhost:7171/api/Auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const result = await res.json();
        const token = result.token;

        if (token) {
          localStorage.setItem("token", token);
          console.log("Token recibido:", token);
          setMensaje("¡Inicio de sesión exitoso!");
          router.push("/productos");
        } else {
          setError("No se recibió un token válido.");
        }
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Error al iniciar sesión");
      }
    } catch {
      setError("No se pudo conectar con el servidor");
    }
  }

  return (
    <main className="grid h-screen place-items-center">
      <div className="flex flex-col items-center justify-center gap-4 rounded-md border border-gray-300 p-8">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Gestion de productos</h1>
          <p className="text-sm text-gray-500">
            Aplicaion para gestionar productos
          </p>
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
            <label>Contraseña</label>
            <input
              name="password"
              type="password"
              className="h-8 rounded border border-gray-300 px-2"
              required
            />
          </div>
          <button className="h-8 rounded bg-black text-white" type="submit">
            Iniciar sesión
          </button>
          <Link
            href="/registro"
            className="text-sm text-blue-500 hover:underline"
          >
            ¿No tienes cuenta? Regístrate
          </Link>
          {mensaje && (
            <div className="mt-2 text-center text-green-600">{mensaje}</div>
          )}
          {error && (
            <div className="mt-2 text-center text-red-600">{error}</div>
          )}
        </form>
      </div>
    </main>
  );
}
