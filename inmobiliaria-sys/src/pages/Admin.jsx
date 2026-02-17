import { useEffect, useState } from "react";
import { db, storage } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function Admin() {
  const [tipo, setTipo] = useState("");
  const [titulo, setTitulo] = useState("");
  const [precio, setPrecio] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagenes, setImagenes] = useState([]);
  const [subiendo, setSubiendo] = useState(false);
  const [propiedades, setPropiedades] = useState([]);

  const propiedadesRef = collection(db, "propiedades");

  const handleImagenes = (e) => {
    setImagenes(Array.from(e.target.files));
  };

  const crearPropiedad = async (e) => {
    e.preventDefault();

    if (!tipo || !titulo || !precio || !descripcion || imagenes.length === 0) {
      alert("Completá todos los campos y seleccioná al menos una imagen");
      return;
    }

    try {
      setSubiendo(true);

      const urls = [];

      for (let i = 0; i < imagenes.length; i++) {
        const file = imagenes[i];
        const storageRef = ref(
          storage,
          `propiedades/${tipo}/${Date.now()}-${file.name}`
        );

        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        urls.push(url);
      }

      await addDoc(propiedadesRef, {
        titulo,
        precio: Number(precio),
        descripcion,
        imagenes: urls,
        tipo,
        createdAt: new Date(),
      });

      setTitulo("");
      setPrecio("");
      setDescripcion("");
      setImagenes([]);
      obtenerPropiedades();

      alert("Propiedad agregada correctamente ✅");
    } catch (error) {
      console.error("Error al agregar la propiedad:", error);
      alert("Error al agregar la propiedad");
    } finally {
      setSubiendo(false);
    }
  };

  const obtenerPropiedades = async () => {
    if (!tipo) return;

    const q = query(propiedadesRef, where("tipo", "==", tipo));
    const data = await getDocs(q);

    setPropiedades(
      data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }))
    );
  };

  const borrarPropiedad = async (id) => {
    await deleteDoc(doc(db, "propiedades", id));
    obtenerPropiedades();
  };

  useEffect(() => {
    obtenerPropiedades();
  }, [tipo]);

  if (!tipo) {
    return (
      <div className="container py-5">
        <h2>¿Qué tipo de propiedad querés administrar?</h2>

        <div className="d-flex flex-wrap gap-2 mt-3">
          <button className="btn btn-primary" onClick={() => setTipo("casa")}>
            Casas
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setTipo("departamento")}
          >
            Departamentos
          </button>
          <button className="btn btn-primary" onClick={() => setTipo("finca")}>
            Fincas
          </button>
          <button className="btn btn-primary" onClick={() => setTipo("lote")}>
            Lotes
          </button>
          <button className="btn btn-primary" onClick={() => setTipo("local")}>
            Locales comerciales
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2>Panel Admin – {tipo.toUpperCase()}</h2>

      <button
        className="btn btn-secondary mb-4"
        onClick={() => setTipo("")}
      >
        Cambiar tipo de propiedad
      </button>

      <form onSubmit={crearPropiedad} className="mb-5">
        <input
          type="text"
          placeholder="Título"
          className="form-control mb-2"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />

        <input
          type="number"
          placeholder="Precio"
          className="form-control mb-2"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
        />

        <textarea
          placeholder="Descripción (podés escribir largo)"
          className="form-control mb-2"
          rows={5}
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />

        <input
          type="file"
          className="form-control mb-3"
          multiple
          accept="image/*"
          onChange={handleImagenes}
        />

        <button className="btn btn-success" disabled={subiendo}>
          {subiendo ? "Subiendo imágenes..." : "Agregar propiedad"}
        </button>
      </form>

      <h4>Propiedades cargadas</h4>

      <div className="row">
        {propiedades.map((prop) => (
          <div key={prop.id} className="col-md-4 mb-4">
            <div className="card">
              {prop.imagenes?.[0] && (
                <img
                  src={prop.imagenes[0]}
                  className="card-img-top"
                  alt={prop.titulo}
                  style={{ height: 200, objectFit: "cover" }}
                />
              )}
              <div className="card-body">
                <h5>{prop.titulo}</h5>
                <p>${prop.precio}</p>
                <p className="small text-muted">
                  {prop.descripcion?.slice(0, 100)}...
                </p>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => borrarPropiedad(prop.id)}
                >
                  Borrar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
