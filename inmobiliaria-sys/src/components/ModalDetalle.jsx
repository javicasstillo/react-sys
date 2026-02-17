import { useEffect } from "react"

export default function ModalDetalle({ propiedad, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => (document.body.style.overflow = "auto")
  }, [])

  const enviarWhatsapp = () => {
    window.open(`https://wa.me/${propiedad.whatsapp}`, "_blank")
  }

  return (
    <div className="modal fade show d-block" style={{ background: "rgba(0,0,0,.7)" }}>
      <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">

          <div className="modal-header">
            <h5>{propiedad.titulo}</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            <p className="text-muted">{propiedad.ubicacion}</p>

            <div id="carouselPropiedad" className="carousel slide mb-3">
              <div className="carousel-inner">
                {propiedad.imagenes.map((img, i) => (
                  <div key={i} className={`carousel-item ${i === 0 ? "active" : ""}`}>
                    <img src={img} className="d-block w-100" style={{ maxHeight: 450, objectFit: "cover" }} />
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

            <p>{propiedad.descripcion}</p>

            <ul>
              <li>Baños: {propiedad.banos}</li>
              <li>Habitaciones: {propiedad.habitaciones}</li>
              <li>Pisos: {propiedad.pisos}</li>
              <li>Metros cuadrados: {propiedad.metrosCuadrados}</li>
            </ul>

            <p><strong>Asesor:</strong> {propiedad.asesor}</p>
          </div>

          <div className="modal-footer">
            <button className="btn btn-success" onClick={enviarWhatsapp}>Enviar WhatsApp</button>
            <button className="btn btn-secondary" onClick={onClose}>Cerrar</button>
          </div>

        </div>
      </div>
    </div>
  )
}
