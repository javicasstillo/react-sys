import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function PropertyForm() {
  const [titulo, setTitulo] = useState("");
  const [precio, setPrecio] = useState("");
  const [imagen, setImagen] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    await addDoc(collection(db, "propiedades"), {
      titulo,
      precio,
      imagen,
      createdAt: new Date()
    });

    setTitulo("");
    setPrecio("");
    setImagen("");
    alert("Propiedad creada!");
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded">
      <h3>Agregar propiedad</h3>

      <input
        className="form-control mb-2"
        placeholder="Título"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
      />

      <input
        className="form-control mb-2"
        placeholder="Precio"
        value={precio}
        onChange={(e) => setPrecio(e.target.value)}
      />

      <input
        className="form-control mb-2"
        placeholder="URL imagen"
        value={imagen}
        onChange={(e) => setImagen(e.target.value)}
      />

      <button className="btn btn-primary w-100">Guardar</button>
    </form>
  );
}
