"use client";
import { useState, useEffect } from "react";

type Producto = {
  id: string;
  nombre: string;
  descripcion: string;
  precio: number;
};

export default function ProductosPage() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [form, setForm] = useState<Producto>({
    id: "",
    nombre: "",
    descripcion: "",
    precio: 0,
  });
  const [editMode, setEditMode] = useState(false);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : "";

  // Obtener productos
  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    const response = await fetch("http://localhost:5000/api/Products", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) {
      const data = await response.json();
      setProductos(data);
    } else {
      alert("Error al obtener productos");
    }
  };

  // Filtro y paginación
  const productosFiltrados = productos.filter(
    (p) =>
      String(p.nombre ?? "")
        .toLowerCase()
        .includes(filter.toLowerCase()) ||
      String(p.descripcion ?? "")
        .toLowerCase()
        .includes(filter.toLowerCase()) ||
      String(p.id ?? "")
        .toLowerCase()
        .includes(filter.toLowerCase())
  );
  const totalPages = Math.ceil(productosFiltrados.length / pageSize);
  const productosPagina = productosFiltrados.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editMode
        ? `http://localhost:5000/api/Products/${form.id}`
        : "http://localhost:5000/api/Products";
      const method = editMode ? "PUT" : "POST";
      const response = await fetch(url, {
        method,
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
      alert(editMode ? "Producto actualizado" : "Producto agregado");
      setForm({ id: "", nombre: "", descripcion: "", precio: 0 });
      setEditMode(false);
      fetchProductos();
    } catch (error: any) {
      alert("Error al guardar el producto: " + (error.message || error));
    }
  };

  const handleEdit = async (id: string) => {
    // GET api/products/{id}
    const response = await fetch(`http://localhost:5000/api/Products/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) {
      const data = await response.json();
      setForm(data);
      setEditMode(true);
    } else {
      alert("No se pudo cargar el producto");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Seguro que deseas eliminar este producto?")) return;
    const response = await fetch(`http://localhost:5000/api/Products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) {
      alert("Producto eliminado");
      fetchProductos();
    } else {
      alert("Error al eliminar el producto");
    }
  };

  const handleReportePDF = async () => {
    const response = await fetch(
      "http://localhost:5000/api/Products/reporte-pdf",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "reporte_productos.pdf";
      link.click();
      window.URL.revokeObjectURL(url);
    } else {
      alert("Error al descargar el reporte PDF");
    }
  };

  return (
    <div
      style={{
        maxWidth: 900,
        margin: "40px auto",
        padding: "24px",
        borderRadius: "10px",
        background: "#f9f9f9",
        boxShadow: "0 2px 8px #0001",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#1976d2", marginBottom: 20 }}>
        {editMode ? "Editar Producto" : "Agregar Producto"}
      </h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 30 }}>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 120 }}>
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
              disabled={editMode}
              style={{
                width: "100%",
                padding: "7px",
                borderRadius: "5px",
                border: "1px solid #bbb",
              }}
            />
          </div>
          <div style={{ flex: 2, minWidth: 180 }}>
            <label
              htmlFor="nombre"
              style={{ display: "block", marginBottom: 4 }}
            >
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
          <div style={{ flex: 3, minWidth: 220 }}>
            <label
              htmlFor="descripcion"
              style={{ display: "block", marginBottom: 4 }}
            >
              Descripción
            </label>
            <input
              type="text"
              id="descripcion"
              name="descripcion"
              required
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
          <div style={{ flex: 1, minWidth: 100 }}>
            <label
              htmlFor="precio"
              style={{ display: "block", marginBottom: 4 }}
            >
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
        </div>
        <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
          <button
            type="submit"
            style={{
              flex: 1,
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
            {editMode ? "Actualizar" : "Agregar"}
          </button>
          {editMode && (
            <button
              type="button"
              onClick={() => {
                setEditMode(false);
                setForm({ id: "", nombre: "", descripcion: "", precio: 0 });
              }}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "5px",
                border: "none",
                background: "#bbb",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "1rem",
                cursor: "pointer",
              }}
            >
              Cancelar edición
            </button>
          )}
        </div>
      </form>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <input
          type="text"
          placeholder="Buscar por ID, nombre o descripción..."
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPage(1);
          }}
          style={{
            width: "60%",
            padding: "8px",
            borderRadius: "5px",
            border: "1px solid #bbb",
          }}
        />
        <button
          onClick={handleReportePDF}
          style={{
            padding: "10px 18px",
            borderRadius: "5px",
            border: "none",
            background: "#43a047",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          Descargar PDF
        </button>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#e3e3e3" }}>
            <th style={{ padding: 8, border: "1px solid #ccc" }}>ID</th>
            <th style={{ padding: 8, border: "1px solid #ccc" }}>Nombre</th>
            <th style={{ padding: 8, border: "1px solid #ccc" }}>
              Descripción
            </th>
            <th style={{ padding: 8, border: "1px solid #ccc" }}>Precio</th>
            <th style={{ padding: 8, border: "1px solid #ccc" }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productosPagina.map((p) => (
            <tr key={p.id}>
              <td style={{ padding: 8, border: "1px solid #ccc" }}>{p.id}</td>
              <td style={{ padding: 8, border: "1px solid #ccc" }}>
                {p.nombre}
              </td>
              <td style={{ padding: 8, border: "1px solid #ccc" }}>
                {p.descripcion}
              </td>
              <td style={{ padding: 8, border: "1px solid #ccc" }}>
                {p.precio}
              </td>
              <td style={{ padding: 8, border: "1px solid #ccc" }}>
                <button
                  onClick={() => handleEdit(p.id)}
                  style={{
                    marginRight: 8,
                    padding: "4px 8px",
                    borderRadius: "4px",
                    border: "none",
                    background: "#1976d2",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  style={{
                    padding: "4px 8px",
                    borderRadius: "4px",
                    border: "none",
                    background: "#d32f2f",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
          {productosPagina.length === 0 && (
            <tr>
              <td colSpan={5} style={{ textAlign: "center", padding: 16 }}>
                No hay productos para mostrar.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Paginación */}
      <div
        style={{
          marginTop: 18,
          display: "flex",
          justifyContent: "center",
          gap: 8,
        }}
      >
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          style={{
            padding: "6px 12px",
            borderRadius: "4px",
            border: "1px solid #bbb",
            background: page === 1 ? "#eee" : "#fff",
            cursor: page === 1 ? "not-allowed" : "pointer",
          }}
        >
          Anterior
        </button>
        <span style={{ alignSelf: "center" }}>
          Página {page} de {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages || totalPages === 0}
          style={{
            padding: "6px 12px",
            borderRadius: "4px",
            border: "1px solid #bbb",
            background:
              page === totalPages || totalPages === 0 ? "#eee" : "#fff",
            cursor:
              page === totalPages || totalPages === 0
                ? "not-allowed"
                : "pointer",
          }}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
