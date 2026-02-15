import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function Fincas() {
  const [fincas, setFincas] = useState([]);

  useEffect(() => {
    const fetchFincas = async () => {
      const ref = collection(db, "propiedades");
      const q = query(ref, where("tipo", "==", "finca"));
      const data = await getDocs(q);
      setFincas(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    fetchFincas();
  }, []);

  return (
    <div className="container py-5">
      <h1>Fincas</h1>

      <div className="row">
        {fincas.map((finca) => (
          <div key={finca.id} className="col-md-4 mb-4">
            <div className="card">
              <img src={finca.imagen} className="card-img-top" />
              <div className="card-body">
                <h5>{finca.titulo}</h5>
                <p>${finca.precio}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
