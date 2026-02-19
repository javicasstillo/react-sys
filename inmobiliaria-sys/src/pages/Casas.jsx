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
      <h1 className="text-bebas tamano2 text-center">Casas</h1>

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
                <h5 className="text-center">{c.titulo}</h5>
                <p className="fw-bold text-center fs-5 text-rosa">${c.precio} USD</p>

                <div className="row  gy-3">
                  <div className="col-6 ">
                    
                    <div className="rounded bg-body-secondary  text-center p-3">
                      <p className="mb-0"> {c.banos} Baños</p>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="rounded bg-body-secondary   text-center p-3">
                      <p className="mb-0"> {c.metrosCuadrados} M²</p>
                    </div>
                  </div>
                  <div className="col-12"> 
                    <div className="rounded bg-body-secondary   text-center p-3">
                      <p className="mb-0"> {c.habitaciones} Habitaciones</p>
                    </div>
                  </div>
                  
                  <div className="d-flex flex-column gap-3">
                    
                    <div className="text-center p-3">
                      <i class="bi bi-geo-alt-fill fs-1 text-rosa titilar"></i>
                      <p className="titilar"> {c.ubicacion}</p>
                    </div>
                    
                  </div>
                  
                </div>

                <p>
                  {c.descripcion?.slice(0, 100)}
                  {c.descripcion?.length > 100 && "..."}
                </p>

                

                <Link to={`/propiedad/casas/${c.id}`} className="btn bg-dark text-white mb-2">
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
