import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../firebase"
import { Link } from "react-router-dom"

export default function Casas() {
  const [casas, setCasas] = useState([])

  useEffect(() => {
    const fetchCasas = async () => {
      const snap = await getDocs(collection(db, "casas"))
      setCasas(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    }
    fetchCasas()
  }, [])


  return (
    <div className="container py-5">
      <h1>Casas</h1>

      <div className="row">
        {casas.map(c => (
          <div key={c.id} className="col-md-4 mb-4">
            <div className="card h-100">

              <img
                src={c.imagenes?.[0]}
                alt={c.titulo}
                className="card-img-top"
                style={{ height: 200, objectFit: "cover" }}
              />

              <div className="card-body d-flex flex-column">
                <h5>{c.titulo}</h5>
                <p className="fw-bold">${c.precio}</p>

                <p>
                  {c.descripcion?.slice(0, 100)}
                  {c.descripcion?.length > 100 && "..."}
                </p>

                <ul className="list-unstyled small mb-3">
                  <li>🛏 {c.habitaciones} habitaciones</li>
                  <li>🚿 {c.banos} baños</li>
                  <li>🏢 {c.pisos} pisos</li>
                  <li>📐 {c.metrosCuadrados} m²</li>
                </ul>

                <Link to={`/propiedad/casas/${c.id}`} className="btn btn-dark mb-2">
                  Ver propiedad
                </Link>

              </div>

            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
