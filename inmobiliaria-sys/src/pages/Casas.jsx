import { useEffect, useState } from "react"
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import { db } from "../firebase"
import { Link } from "react-router-dom"

export default function Casas() {
  const [casas, setCasas] = useState([])
  const [paginaActual, setPaginaActual] = useState(1)
  const porPagina = 12

  useEffect(() => {
    const fetchCasas = async () => {
      const q = query(collection(db, "casas"), orderBy("precio", "desc"))
      const snap = await getDocs(q)
      setCasas(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    }
    fetchCasas()
  }, [])

  const totalPaginas = Math.ceil(casas.length / porPagina)
  const inicio = (paginaActual - 1) * porPagina
  const fin = inicio + porPagina
  const casasPaginadas = casas.slice(inicio, fin)

  return (
    <div className="container py-5">
      <h1 className="text-bebas tamano2 text-center">Casas</h1>

      <div className="row">
        {casasPaginadas.map(c => (
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
                      <i className="bi bi-geo-alt-fill fs-1 text-rosa titilar"></i>
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

      {/* PAGINACIÓN */}
      {totalPaginas > 1 && (
        <div className="d-flex justify-content-center gap-2 mt-4">
          <button
            className="btn btn-outline-dark"
            disabled={paginaActual === 1}
            onClick={() => setPaginaActual(p => p - 1)}
          >
            ← Anterior
          </button>

          {[...Array(totalPaginas)].map((_, i) => (
            <button
              key={i}
              className={`btn ${paginaActual === i + 1 ? "btn-dark" : "btn-outline-dark"}`}
              onClick={() => setPaginaActual(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            className="btn btn-outline-dark"
            disabled={paginaActual === totalPaginas}
            onClick={() => setPaginaActual(p => p + 1)}
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  )
}