import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function Casas() {
  const [casas, setCasas] = useState([]);
  const propiedadesRef = collection(db, "propiedades");

  useEffect(() => {
    const fetchCasas = async () => {
      const q = query(propiedadesRef, where("tipo", "==", "casa"));
      const data = await getDocs(q);
      setCasas(data.docs.map(d => ({ id: d.id, ...d.data() })));
    };
    fetchCasas();
  }, []);

  return (
    <div className="container py-5">
      <h1>Casas</h1>
      <div className="row">
        {casas.map(c => (
          <div key={c.id} className="col-12 col-md-4 mb-3">
            <div className="card">
              <img src={c.imagen} className="card-img-top" alt={c.titulo} />
              <div className="card-body">
                <h5>{c.titulo}</h5>
                <p>${c.precio}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
