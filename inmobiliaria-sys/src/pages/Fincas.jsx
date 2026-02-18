import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../firebase"
import { Link } from "react-router-dom"

export default function Departamentos() {
  const [departamentos, setDepartamentos] = useState([])
  const [seleccionada, setSeleccionada] = useState(null)

  useEffect(() => {
    const fetch = async () => {
      const snap = await getDocs(collection(db, "fincas"))
      setDepartamentos(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    }
    fetch()
  }, [])


  return (
    <div className="container py-5">
      <h1>Fincas</h1>

      <div className="row">
        {departamentos.map(d => (
          <div key={d.id} className="col-md-4 mb-4">
            <div className="card h-100">
              <img src={d.imagenes?.[0]} className="card-img-top" style={{ height: 200, objectFit: "cover" }} />

              <div className="card-body d-flex flex-column">
                <h5>{d.titulo}</h5>
                <p className="mb-1"><strong>${d.precio}</strong></p>
                <p className="text-muted">{d.ubicacion}</p>

                <p>{d.descripcion?.slice(0, 100)}{d.descripcion?.length > 100 && "..."}</p>

                <ul className="small mb-3">
                  <li>Habitaciones: {d.habitaciones}</li>
                  <li>Baños: {d.banos}</li>
                  <li>Pisos: {d.pisos}</li>
                  <li>Metros²: {d.metrosCuadrados}</li>
                </ul>

                <Link to={`/propiedad/fincas/${f.id}`} className="btn btn-dark">
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
