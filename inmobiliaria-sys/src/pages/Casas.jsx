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
      const q = query(ref, where("tipo", "==", "casa"));
      const data = await getDocs(q);
      setCasas(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    fetchCasas();
  }, []);

  return (
    <div className="container py-5">
      <h1>Casas</h1>

      <div className="row">
        {casas.map((casa) => (
          <div key={casa.id} className="col-md-4 mb-4">
            <div className="card">
              <img
                src={casa.imagenes?.[0]}
                className="card-img-top"
                style={{ height: 200, objectFit: "cover" }}
              />
              <div className="card-body">
                <h5>{casa.titulo}</h5>
                <p>${casa.precio}</p>

                <button
                  className="btn btn-primary"
                  onClick={() => setSeleccionada(casa)}
                >
                  Ver propiedad
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {seleccionada && (
        <ModalDetalle
          propiedad={seleccionada}
          onClose={() => setSeleccionada(null)}
        />
      )}
    </div>
  );
}
