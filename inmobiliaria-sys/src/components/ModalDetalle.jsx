export default function ModalDetalle({ propiedad }) {
  return (
    <div
      className="modal fade"
      id="modalDetalle"
      tabIndex="-1"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{propiedad.titulo}</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>

          <div className="modal-body">
            {/* Carrusel */}
            <div
              id="carouselPropiedad"
              className="carousel slide mb-4"
              data-bs-ride="carousel"
            >
              <div className="carousel-inner">
                {propiedad.imagenes?.map((img, i) => (
                  <div
                    key={i}
                    className={`carousel-item ${i === 0 ? "active" : ""}`}
                  >
                    <img
                      src={img}
                      className="d-block w-100"
                      style={{ maxHeight: "450px", objectFit: "cover" }}
                    />
                  </div>
                ))}
              </div>

              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#carouselPropiedad"
                data-bs-slide="prev"
              >
                <span
                  className="carousel-control-prev-icon"
                  style={{ filter: "invert(1)" }}
                ></span>
              </button>

              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#carouselPropiedad"
                data-bs-slide="next"
              >
                <span
                  className="carousel-control-next-icon"
                  style={{ filter: "invert(1)" }}
                ></span>
              </button>
            </div>

            {/* Datos */}
            <h4 className="fw-bold">${propiedad.precio}</h4>

            <p className="text-muted mb-2">
              {propiedad.habitaciones} habitaciones · {propiedad.banios} baños ·{" "}
              {propiedad.pisos} pisos · {propiedad.metros} m²
            </p>

            <p style={{ whiteSpace: "pre-line" }}>
              {propiedad.descripcion}
            </p>
          </div>

          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              data-bs-dismiss="modal"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
