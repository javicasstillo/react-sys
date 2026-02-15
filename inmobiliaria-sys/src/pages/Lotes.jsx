import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function Lotes() {
  const [lotes, setLotes] = useState([]);

  useEffect(() => {
    const fetchLotes = async () => {
      const ref = collection(db, "propiedades");
      const q = query(ref, where("tipo", "==", "lote"));
      const data = await getDocs(q);
      setLotes(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    fetchLotes();
  }, []);

  return (
    <div className="container py-5">
      <h1>Lotes</h1>

      <div className="row">
        {lotes.map((lote) => (
          <div key={lote.id} className="col-md-4 mb-4">
            <div className="card">
              <img src={lote.imagen} className="card-img-top" />
              <div className="card-body">
                <h5>{lote.titulo}</h5>
                <p>${lote.precio}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
