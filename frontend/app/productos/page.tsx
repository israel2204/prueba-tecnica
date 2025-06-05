"use client";
import { useState } from "react";

export default function ProductoForm() {
  const [form, setForm] = useState({
    id: "",
    nombre: "",
    descripcion: "",
    precio: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("https://localhost:7171/api/Products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          precio: Number(form.precio),
        }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }
      alert("Producto agregado");
      setForm({ id: "", nombre: "", descripcion: "", precio: "" });
    } catch (error: any) {
      alert("Error al guardar el producto: " + (error.message || error));
    }
  };

  return (
    <div
      style={{
        maxWidth: 350,
        margin: "40px auto",
        padding: "24px",
        borderRadius: "10px",
        background: "#f9f9f9",
        boxShadow: "0 2px 8px #0001",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          color: "#1976d2",
          marginBottom: 20,
        }}
      >
        Agregar Producto
      </h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 14 }}>
          <label htmlFor="id" style={{ display: "block", marginBottom: 4 }}>
            ID
          </label>
          <input
            type="text"
            id="id"
            name="id"
            required
            value={form.id}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "7px",
              borderRadius: "5px",
              border: "1px solid #bbb",
            }}
          />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label htmlFor="nombre" style={{ display: "block", marginBottom: 4 }}>
            Nombre
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            required
            value={form.nombre}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "7px",
              borderRadius: "5px",
              border: "1px solid #bbb",
            }}
          />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label
            htmlFor="descripcion"
            style={{ display: "block", marginBottom: 4 }}
          >
            Descripción
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            required
            rows={2}
            value={form.descripcion}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "7px",
              borderRadius: "5px",
              border: "1px solid #bbb",
            }}
          />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label htmlFor="precio" style={{ display: "block", marginBottom: 4 }}>
            Precio
          </label>
          <input
            type="number"
            id="precio"
            name="precio"
            required
            min="0"
            step="0.01"
            value={form.precio}
            onChange={handleChange}
            style={{
              width: "100%",
              padding: "7px",
              borderRadius: "5px",
              border: "1px solid #bbb",
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "5px",
            border: "none",
            background: "#1976d2",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          Agregar
        </button>
      </form>
    </div>
  );
}
