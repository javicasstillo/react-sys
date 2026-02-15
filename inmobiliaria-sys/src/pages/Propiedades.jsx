import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export default function Propiedades() {
  const [propiedades, setPropiedades] = useState([]);

  useEffect(() => {
    const traerPropiedades = async () => {
      const querySnapshot = await getDocs(collection(db, "propiedades"));
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPropiedades(data);
    };

    traerPropiedades();
  }, []);

  return (
    <div className="container my-5">
      <h2>Propiedades disponibles</h2>

      <div className="row">
        {propiedades.map((p) => (
          <div className="col-md-4 mb-3" key={p.id}>
            <div className="card">
              <img src={p.imagen} className="card-img-top" />
              <div className="card-body">
                <h5>{p.titulo}</h5>
                <p>${p.precio}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
