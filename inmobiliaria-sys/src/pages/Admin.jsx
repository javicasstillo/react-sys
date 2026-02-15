import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Link } from "react-router-dom";

export function Admin() {
  const [propiedades, setPropiedades] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [precio, setPrecio] = useState("");
  const [imagen, setImagen] = useState("");

  const propiedadesRef = collection(db, "propiedades");

  const obtenerPropiedades = async () => {
    const data = await getDocs(propiedadesRef);
    setPropiedades(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    obtenerPropiedades();
  }, []);

  const crearPropiedad = async (e) => {
    e.preventDefault();
    await addDoc(propiedadesRef, {
      titulo,
      precio,
      imagen,
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
      <h1 className="text-bebas">Panel de Administración</h1>

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
          Agregar propiedad
        </button>
      </form>

      <div className="row">
        {propiedades.map((prop) => (
          <div key={prop.id} className="col-12 col-md-4 mb-3">
            <div className="card">
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
    </div>
  );
}
