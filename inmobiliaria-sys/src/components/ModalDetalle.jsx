import { useState } from "react";

export default function ModalDetalle({ propiedad, onClose }) {
  const [index, setIndex] = useState(0);

  if (!propiedad) return null;

  const next = () => {
    setIndex((prev) =>
      prev === propiedad.imagenes.length - 1 ? 0 : prev + 1
    );
  };

  const prev = () => {
    setIndex((prev) =>
      prev === 0 ? propiedad.imagenes.length - 1 : prev - 1
    );
  };

  return (
    <div style={overlay}>
      <div style={modal}>
        <button className="btn btn-danger mb-3" onClick={onClose}>
          Cerrar
        </button>

        {/* Carrusel */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <button className="btn btn-light border" onClick={prev}>
            <i className="bi bi-chevron-left fs-3 text-dark"></i>
          </button>

          <img
            src={propiedad.imagenes[index]}
            alt=""
            className="img-fluid mx-3"
            style={{ maxHeight: 320, objectFit: "cover" }}
          />

          <button className="btn btn-light border" onClick={next}>
            <i className="bi bi-chevron-right fs-3 text-dark"></i>
          </button>
        </div>

        {/* Info */}
        <h3 className="mb-2">{propiedad.titulo}</h3>
        <h4 className="text-success mb-3">${propiedad.precio}</h4>

        <p style={{ whiteSpace: "pre-line" }}>
          {propiedad.descripcion}
        </p>
      </div>
    </div>
  );
}

const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(0,0,0,0.7)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
};

const modal = {
  background: "#fff",
  padding: 20,
  borderRadius: 10,
  maxWidth: 750,
  width: "95%",
  maxHeight: "90vh",
  overflowY: "auto",
};
