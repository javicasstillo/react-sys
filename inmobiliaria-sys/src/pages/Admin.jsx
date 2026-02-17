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
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

export default function Admin() {
  const [titulo, setTitulo] = useState("");
  const [precio, setPrecio] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tipo, setTipo] = useState("");

  const [banios, setBanios] = useState("");
  const [habitaciones, setHabitaciones] = useState("");
  const [pisos, setPisos] = useState("");
  const [metros, setMetros] = useState("");

  const [imagenes, setImagenes] = useState([]);
  const [preview, setPreview] = useState([]);

  const [propiedades, setPropiedades] = useState([]);
  const [loading, setLoading] = useState(false);

  const propiedadesRef = collection(db, "propiedades");

  const handleImagenes = (e) => {
    const files = Array.from(e.target.files);
    setImagenes(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setPreview(previews);
  };

  const obtenerPropiedades = async () => {
    const q = query(propiedadesRef, where("tipo", "==", tipo));
    const data = await getDocs(q);
    setPropiedades(data.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  useEffect(() => {
    if (tipo) obtenerPropiedades();
  }, [tipo]);

  const crearPropiedad = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const urls = [];

      for (const file of imagenes) {
        const imgRef = ref(
          storage,
          `propiedades/${tipo}/${Date.now()}-${file.name}`
        );
        await uploadBytes(imgRef, file);
        const url = await getDownloadURL(imgRef);
        urls.push(url);
      }

      await addDoc(propiedadesRef, {
        titulo,
        precio,
        descripcion,
        tipo,
        imagenes: urls,
        banios,
        habitaciones,
        pisos,
        metros,
        createdAt: Date.now(),
      });

      setTitulo("");
      setPrecio("");
      setDescripcion("");
      setBanios("");
      setHabitaciones("");
      setPisos("");
      setMetros("");
      setImagenes([]);
      setPreview([]);

      obtenerPropiedades();
      alert("Propiedad cargada correctamente");
    } catch (error) {
      console.error(error);
      alert("Error al agregar la propiedad");
    } finally {
      setLoading(false);
    }
  };

  const eliminarPropiedad = async (id) => {
    await deleteDoc(doc(db, "propiedades", id));
    obtenerPropiedades();
  };

  if (!tipo) {
    return (
      <div className="container py-5">
        <h2>¿Qué tipo de propiedad querés administrar?</h2>

        {["casa", "departamento", "finca", "lote", "local"].map((t) => (
          <button
            key={t}
            className="btn btn-dark me-2 mt-3"
            onClick={() => setTipo(t)}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="container py-5">
      <button
        className="btn btn-secondary mb-3"
        onClick={() => setTipo("")}
      >
        Cambiar tipo de propiedad
      </button>

      <h2 className="mb-4">Admin {tipo.toUpperCase()}</h2>

      <form onSubmit={crearPropiedad} className="row g-3 mb-5">
        <div className="col-md-6">
          <input
            className="form-control"
            placeholder="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </div>

        <div className="col-md-6">
          <input
            className="form-control"
            placeholder="Precio"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            required
          />
        </div>

        <div className="col-12">
          <textarea
            className="form-control"
            placeholder="Descripción"
            rows={5}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            required
          />
        </div>

        <div className="col-md-3">
          <input
            className="form-control"
            placeholder="Baños"
            type="number"
            value={banios}
            onChange={(e) => setBanios(e.target.value)}
          />
        </div>

        <div className="col-md-3">
          <input
            className="form-control"
            placeholder="Habitaciones"
            type="number"
            value={habitaciones}
            onChange={(e) => setHabitaciones(e.target.value)}
          />
        </div>

        <div className="col-md-3">
          <input
            className="form-control"
            placeholder="Pisos"
            type="number"
            value={pisos}
            onChange={(e) => setPisos(e.target.value)}
          />
        </div>

        <div className="col-md-3">
          <input
            className="form-control"
            placeholder="Metros cuadrados"
            type="number"
            value={metros}
            onChange={(e) => setMetros(e.target.value)}
          />
        </div>

        <div className="col-12">
          <input
            type="file"
            multiple
            className="form-control"
            onChange={handleImagenes}
            required
          />
        </div>

        {/* Preview imágenes */}
        <div className="col-12 d-flex flex-wrap gap-2">
          {preview.map((img, i) => (
            <img
              key={i}
              src={img}
              alt=""
              style={{
                width: 100,
                height: 100,
                objectFit: "cover",
                borderRadius: 6,
                border: "1px solid #ccc",
              }}
            />
          ))}
        </div>

        <div className="col-12">
          <button className="btn btn-success" disabled={loading}>
            {loading ? "Subiendo..." : "Crear propiedad"}
          </button>
        </div>
      </form>

      <h4>Propiedades cargadas</h4>

      {propiedades.map((p) => (
        <div
          key={p.id}
          className="border p-3 mb-2 d-flex justify-content-between align-items-center"
        >
          <div>
            <strong>{p.titulo}</strong> – ${p.precio}
          </div>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => eliminarPropiedad(p.id)}
          >
            Eliminar
          </button>
        </div>
      ))}
    </div>
  );
}
