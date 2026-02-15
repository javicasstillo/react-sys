import { useEffect, useState } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { Link } from "react-router-dom";

export default function Admin() {
  const [propiedades, setPropiedades] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [precio, setPrecio] = useState("");
  const [imagen, setImagen] = useState("");
  const [tipo, setTipo] = useState("");

  const propiedadesRef = collection(db, "propiedades");

  const obtenerPropiedades = async () => {
    if (!tipo) return;
    const q = query(propiedadesRef, where("tipo", "==", tipo));
    const data = await getDocs(q);
    setPropiedades(data.docs.map((d) => ({ ...d.data(), id: d.id })));
  };

  useEffect(() => {
    obtenerPropiedades();
  }, [tipo]);

  const crearPropiedad = async (e) => {
    e.preventDefault();
    await addDoc(propiedadesRef, {
      titulo,
      precio,
      imagen,
      tipo,
    });
    setTitulo("");
    setPrecio("");
    setImagen("");
    obtenerPropiedades();
  };

  const borrarPropiedad = async (id) => {
    const propDoc = doc(db, "propiedades", id);
    await deleteDoc(propDoc);
    obtenerPropiedades();
  };

  return (
    <div className="container py-5">
      <h1 className="text-bebas mb-4">Panel de Administración</h1>

      {/* SELECTOR DE TIPO */}
      {!tipo && (
        <div className="text-center py-5">
          <h2 className="mb-4">¿Qué querés administrar?</h2>

          <div className="d-flex flex-wrap justify-content-center gap-3">
            {["casa", "departamento", "finca", "lote", "local"].map((t) => (
              <button
                key={t}
                className="btn btn-outline-dark"
                onClick={() => setTipo(t)}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>

          <Link to="/" className="btn btn-secondary mt-4">
            Volver al sitio
          </Link>
        </div>
      )}

      {/* PANEL CRUD */}
      {tipo && (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Administrando: {tipo.toUpperCase()}</h2>

            <button
              className="btn btn-secondary"
              onClick={() => setTipo("")}
            >
              Cambiar tipo
            </button>
          </div>

          <form onSubmit={crearPropiedad} className="mb-4">
            <input
              type="text"
              placeholder="Título"
              className="form-control mb-2"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Precio"
              className="form-control mb-2"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="URL de imagen"
              className="form-control mb-2"
              value={imagen}
              onChange={(e) => setImagen(e.target.value)}
              required
            />

            <button className="btn bg-rosa text-white">
              Agregar {tipo}
            </button>
          </form>

          <div className="row">
            {propiedades.map((prop) => (
              <div key={prop.id} className="col-12 col-md-4 mb-3">
                <div className="card h-100">
                  <img src={prop.imagen} className="card-img-top" />
                  <div className="card-body">
                    <h5>{prop.titulo}</h5>
                    <p>${prop.precio}</p>
                    <button
                      onClick={() => borrarPropiedad(prop.id)}
                      className="btn btn-danger btn-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Link to="/" className="btn btn-secondary mt-4">
            Volver al sitio
          </Link>
        </>
      )}
    </div>
  );
}
