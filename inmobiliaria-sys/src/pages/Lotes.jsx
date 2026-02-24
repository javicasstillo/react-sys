import { useEffect, useState } from "react"
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import { db } from "../firebase"
import { Link, useNavigate } from "react-router-dom"

export default function Lotes() {
  const [lotes, setLotes] = useState([])
  const [paginaActual, setPaginaActual] = useState(1)
  const porPagina = 12
  const navigate = useNavigate()

  useEffect(() => {
    const fetchLotes = async () => {
      const q = query(collection(db, "lotes"), orderBy("precio", "desc"))
      const snap = await getDocs(q)
      setLotes(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    }
    fetchLotes()
  }, [])

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }, [paginaActual])

  const totalPaginas = Math.ceil(lotes.length / porPagina)
  const inicio = (paginaActual - 1) * porPagina
  const fin = inicio + porPagina
  const lotesPaginados = lotes.slice(inicio, fin)

  return (
    <>
      <header>
        <nav className="navbar bg-rosa fixed-top">
          <div className="container d-flex justify-content-between">
            <img src="/assets/logo.png" alt="logo" className="logo cursor" onClick={() => navigate(-1)} />
            <button
              className="btn btn-outline-light bg-rosa text-white fs-5"
              onClick={() => navigate(-1)}
            >
              ← Volver
            </button>
          </div>
        </nav>
      </header>

      <div className="container py-5">
        <h1 className="text-bebas tamano2 text-center">Lotes</h1>

        <div className="row">
          {lotesPaginados.map(l => (
            <div key={l.id} className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="alturagpt skeleton">
                  <img
                    src={l.imagenes?.[0]}
                    loading="lazy"
                    alt={l.titulo}
                    className="card-img-top"
                    style={{ height: 200, objectFit: "cover" }}
                    onLoad={(e) => e.currentTarget.parentElement.classList.remove("skeleton")}
                  />
              </div>

                <div className="card-body d-flex flex-column">
                  <h5 className="text-center">{l.titulo}</h5>
                  <p className="fw-bold text-center fs-5 text-rosa">${l.precio} USD</p>

                  <div className="row gy-3">
                    <div className="col-12">
                      <div className="rounded bg-body-secondary text-center p-3">
                        <p className="mb-0">{l.metrosCuadrados} M²</p>
                      </div>
                    </div>

                    <div className="d-flex flex-column gap-3">
                      <div className="text-center p-3">
                        <i className="bi bi-geo-alt-fill fs-1 text-rosa titilar"></i>
                        <p className="titilar">{l.ubicacion}</p>
                      </div>
                    </div>
                  </div>

                  <p>
                    {l.descripcion?.slice(0, 100)}
                    {l.descripcion?.length > 100 && "..."}
                  </p>

                  <Link to={`/propiedad/lotes/${l.id}`} className="btn bg-dark text-white mb-2 mt-auto">
                    Ver propiedad
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

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

      <footer className="bg-rosa">
        <div className="container py-3">
          <div className="row justify-content-between">
            <article className="col-12 col-md-6 text-center" onClick={() => navigate(-1)}>
              <button className="bg-transparent border-0">
                <img src="/assets/logo.png" alt="logo footer" className="w-50 logo" />
              </button>
            </article>

            <article className="col-12 col-md-3 text-center text-md-start pt-4">
              <h6 className="text-white">Contacto</h6>
              <ul className="list-unstyled text-white">
                <li>Las Heras 181 - San Rafael</li>
                <li>+54 9 260-4345281</li>
                <li>consultas.inmobiliariasys@gmail.com</li>
              </ul>
            </article>
          </div>
        </div>

        <p className="mb-0 py-3 text-center text-white">
          &copy; Inmobiliaria SyS | Desarrollado por{" "}
          <a href="https://genesys.com.ar/" className="link-dark link-underline-opacity-0">
            Genesys
          </a>
        </p>
      </footer>
    </>
  )
}