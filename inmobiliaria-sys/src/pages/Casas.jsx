import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function Casas() {
  const [casas, setCasas] = useState([]);

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
              <img src={casa.imagen} className="card-img-top" />
              <div className="card-body">
                <h5>{casa.titulo}</h5>
                <p>${casa.precio}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
