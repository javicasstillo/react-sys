import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import ModalDetalle from "../components/ModalDetalle";

export default function Casas() {
  const [casas, setCasas] = useState([]);
  const [seleccionada, setSeleccionada] = useState(null);

  useEffect(() => {
    const fetchCasas = async () => {
      const ref = collection(db, "propiedades");
      const q = query(ref, where("tipo", "==", "lote"));
      const data = await getDocs(q);
      setCasas(data.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchCasas();
  }, []);

  return (
    <div className="container py-5">
      <h1 className="mb-4">Casas</h1>

      <div className="row">
        {casas.map((casa) => (
          <div key={casa.id} className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              <img
                src={casa.imagenes?.[0]}
                className="card-img-top"
                style={{ height: 220, objectFit: "cover" }}
              />
              <div className="card-body d-flex flex-column">
                <h5>{casa.titulo}</h5>
                <p className="fw-bold mb-1">${casa.precio}</p>

                <p className="text-muted small mb-2">
                  {casa.habitaciones} hab · {casa.banios} baños · {casa.metros} m²
                </p>

                <button
                  className="btn btn-outline-dark mt-auto"
                  data-bs-toggle="modal"
                  data-bs-target="#modalDetalle"
                  onClick={() => setSeleccionada(casa)}
                >
                  Ver propiedad
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {seleccionada && <ModalDetalle propiedad={seleccionada} />}
    </div>
  );
}
