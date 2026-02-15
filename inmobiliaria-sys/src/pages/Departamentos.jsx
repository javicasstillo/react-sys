import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function Departamentos() {
  const [departamentos, setDepartamentos] = useState([]);

  useEffect(() => {
    const fetchDepartamentos = async () => {
      const ref = collection(db, "propiedades");
      const q = query(ref, where("tipo", "==", "departamento"));
      const data = await getDocs(q);
      setDepartamentos(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    fetchDepartamentos();
  }, []);

  return (
    <div className="container py-5">
      <h1>Departamentos</h1>

      <div className="row">
        {departamentos.map((depto) => (
          <div key={depto.id} className="col-md-4 mb-4">
            <div className="card">
              <img src={depto.imagen} className="card-img-top" />
              <div className="card-body">
                <h5>{depto.titulo}</h5>
                <p>${depto.precio}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
