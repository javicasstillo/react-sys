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
    `Hola! Te quiero consultar por esta propiedad: ${linkPropiedad}`
  );

  const enviarWhatsapp = () => {
    window.open(`https://wa.me/${propiedad.whatsapp}?text=${mensaje}`, "_blank");
  };

  return (
    <div className="container py-3">

      <Link to={`/${tipo}`} className="btn btn-outline-secondary mb-3">
        ← Volver
      </Link>

      <h1 className="mb-3 text-center">{propiedad.titulo}</h1>
      <p className="fw-bold text-center tamano2 text-rosa"> ${propiedad.precio} USD</p>
      

      {/* CARROUSEL EXACTO AL MODAL */}
{/* CARROUSEL CON ALTURA FIJA Y ESTILOS EN CSS */}
<div id="carouselPropiedad" className="carousel slide mb-4 carousel-propiedad">
  <div className="carousel-inner">

    {propiedad.imagenes?.map((img, i) => (
      <div
        key={i}
        className={`carousel-item ${i === 0 ? "active" : ""}`}
      >
        <div className="carousel-propiedad-item">
          <img
            src={img}
            alt={`Propiedad ${i + 1}`}
            className="carousel-propiedad-img"
          />
        </div>
      </div>
    ))}

  </div>

  <button
    className="carousel-control-prev"
    type="button"
    data-bs-target="#carouselPropiedad"
    data-bs-slide="prev"
  >
    <span className="carousel-control-prev-icon carousel-propiedad-arrow"></span>
  </button>

  <button
    className="carousel-control-next"
    type="button"
    data-bs-target="#carouselPropiedad"
    data-bs-slide="next"
  >
    <span className="carousel-control-next-icon carousel-propiedad-arrow"></span>
  </button>
</div>
      <div className="row gy-3">
        <div className="col-6 col-md-4">
          <p className="p-3   bg-body-secondary  text-center rounded h-100">{propiedad.banos} Baños </p>
        </div>
        <div className="col-6 col-md-4">
          <p className="p-3   bg-body-secondary   text-center rounded h-100"> {propiedad.habitaciones} Habitaciones</p>
        </div>
        <div className="col-6 col-md-4">
          <p className="p-3   bg-body-secondary   text-center rounded h-100"> {propiedad.metrosCuadrados} M²</p>
        </div>
        <div className="col-6 col-md-12">
          <p className="p-3   bg-body-secondary   text-center rounded h-100"> <i class="bi bi-geo-alt-fill text-dark fs-5"></i> {propiedad.ubicacion}</p>
        </div>
        
      </div>
      {/* DESCRIPCIÓN */}
      <p className="py-3">{propiedad.descripcion}</p>

      {/* DATOS IGUAL QUE EL MODAL */}
      
      
      <div className="row justify-content-center">

        <div className="col-6 text-center">
          <p className=" h-100"> <strong>Asesor Designado:</strong> {propiedad.asesor}</p>
        </div>
        <div className="col-6">
          <button className="rounded h-100 btn bg-rosa text-white" onClick={enviarWhatsapp}>
            <i class="bi bi-whatsapp fs-5"></i> Enviar WhatsApp
          </button>
        </div>
      </div>
      
      

      

    </div>
  );
}
