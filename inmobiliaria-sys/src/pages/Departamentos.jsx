import { useEffect, useState } from "react"
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import { db } from "../firebase"
import { Link } from "react-router-dom"

export default function Departamentos() {
  const [departamentos, setDepartamentos] = useState([])
  const [pagina, setPagina] = useState(1)
  const porPagina = 12

  useEffect(() => {
    const fetchDepartamentos = async () => {
      const q = query(collection(db, "departamentos"), orderBy("precio", "desc"))
      const snap = await getDocs(q)
      setDepartamentos(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    }
    fetchDepartamentos()
  }, [])

  const totalPaginas = Math.ceil(departamentos.length / porPagina)
  const inicio = (pagina - 1) * porPagina
  const visibles = departamentos.slice(inicio, inicio + porPagina)

  return (
    <div className="container py-5">
      <h1 className="text-bebas tamano2 text-center">Departamentos</h1>

      <div className="row">
        {visibles.map(c => (
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

                <div className="row gy-3">
                  <div className="col-6">
                    <div className="rounded bg-body-secondary text-center p-3">
                      <p className="mb-0">{c.banos} Baños</p>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="rounded bg-body-secondary text-center p-3">
                      <p className="mb-0">{c.metrosCuadrados} M²</p>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="rounded bg-body-secondary text-center p-3">
                      <p className="mb-0">{c.habitaciones} Habitaciones</p>
                    </div>
                  </div>

                  <div className="d-flex flex-column gap-3">
                    <div className="text-center p-3">
                      <i className="bi bi-geo-alt-fill fs-1 text-rosa titilar"></i>
                      <p className="titilar">{c.ubicacion}</p>
                    </div>
                  </div>
                </div>

                <p>
                  {c.descripcion?.slice(0, 100)}
                  {c.descripcion?.length > 100 && "..."}
                </p>

                <Link to={`/propiedad/departamentos/${c.id}`} className="btn bg-dark text-white mb-2">
                  Ver propiedad
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPaginas > 1 && (
        <div className="d-flex justify-content-center gap-2 mt-4">
          {Array.from({ length: totalPaginas }).map((_, i) => (
            <button
              key={i}
              className={`btn ${pagina === i + 1 ? "btn-dark" : "btn-outline-dark"}`}
              onClick={() => setPagina(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}