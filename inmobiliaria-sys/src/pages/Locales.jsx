import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";

export default function Locales() {
  const [locales, setLocales] = useState([]);

  useEffect(() => {
    const fetchLocales = async () => {
      const ref = collection(db, "propiedades");
      const q = query(ref, where("tipo", "==", "local"));
      const data = await getDocs(q);
      setLocales(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    fetchLocales();
  }, []);

  return (
    <div className="container py-5">
      <h1>Locales comerciales</h1>

      <div className="row">
        {locales.map((local) => (
          <div key={local.id} className="col-md-4 mb-4">
            <div className="card">
              <img src={local.imagen} className="card-img-top" />
              <div className="card-body">
                <h5>{local.titulo}</h5>
                <p>${local.precio}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
