import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function PropiedadDetalle() {
  const { tipo, id } = useParams();
  const [propiedad, setPropiedad] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const snap = await getDoc(doc(db, tipo, id));
        if (snap.exists()) {
          setPropiedad(snap.data());
        }
      } catch (e) {
        console.error("Error cargando propiedad:", e);
      }
    };
    fetch();
  }, [tipo, id]);

  if (!propiedad) return <p className="text-center py-5">Cargando propiedad...</p>;

  const linkPropiedad = window.location.href;
  const mensaje = encodeURIComponent(
    `Te quiero consultar por esta propiedad: ${linkPropiedad}`
  );

  const enviarWhatsapp = () => {
    window.open(`https://wa.me/${propiedad.whatsapp}?text=${mensaje}`, "_blank");
  };

  return (
    <div className="container py-5">

      <Link to={`/${tipo}`} className="btn btn-outline-secondary mb-3">
        ← Volver
      </Link>

      <h1 className="mb-3">{propiedad.titulo}</h1>

      {/* CARROUSEL EXACTO AL MODAL */}
      <div id="carouselPropiedad" className="carousel slide mb-4">
        <div className="carousel-inner">
          {propiedad.imagenes?.map((img, i) => (
            <div key={i} className={`carousel-item ${i === 0 ? "active" : ""}`}>
              <img
                src={img}
                className="d-block w-100"
                style={{ maxHeight: 450, objectFit: "cover" }}
              />
            </div>
          ))}
        </div>

        <button className="carousel-control-prev" type="button" data-bs-target="#carouselPropiedad" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" style={{ filter: "invert(1)" }}></span>
        </button>

        <button className="carousel-control-next" type="button" data-bs-target="#carouselPropiedad" data-bs-slide="next">
          <span className="carousel-control-next-icon" style={{ filter: "invert(1)" }}></span>
        </button>
      </div>

      {/* DESCRIPCIÓN */}
      <p>{propiedad.descripcion}</p>

      {/* DATOS IGUAL QUE EL MODAL */}
      <ul className="list-group mb-4">
        <li className="list-group-item">🛏 Habitaciones: {propiedad.habitaciones}</li>
        <li className="list-group-item">🛁 Baños: {propiedad.banos}</li>
        <li className="list-group-item">🏢 Pisos: {propiedad.pisos}</li>
        <li className="list-group-item">📐 Metros cuadrados: {propiedad.metrosCuadrados}</li>
        <li className="list-group-item">📍 Ubicación: {propiedad.ubicacion}</li>
      </ul>

      <p><strong>Asesor:</strong> {propiedad.asesor}</p>
      <p><strong>Precio:</strong> ${propiedad.precio}</p>

      <button className="btn btn-success" onClick={enviarWhatsapp}>
        Enviar WhatsApp
      </button>

    </div>
  );
}
