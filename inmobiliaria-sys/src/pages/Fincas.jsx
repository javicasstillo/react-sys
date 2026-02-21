import { useEffect, useState } from "react"
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import { db } from "../firebase"
import { Link, useNavigate } from "react-router-dom"

export default function Fincas() {
  const [fincas, setFincas] = useState([])
  const [pagina, setPagina] = useState(1)
  const porPagina = 12
  const navigate = useNavigate()

  useEffect(() => {
    const fetchFincas = async () => {
      const q = query(collection(db, "fincas"), orderBy("precio", "desc"))
      const snap = await getDocs(q)
      setFincas(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    }
    fetchFincas()
  }, [])

  const totalPaginas = Math.ceil(fincas.length / porPagina)
  const inicio = (pagina - 1) * porPagina
  const visibles = fincas.slice(inicio, inicio + porPagina)

  return (
    <>
    <header>
            <nav className="navbar  bg-rosa fixed-top">
              <div className="container d-flex justify-content-between">
                <img src="/assets/logo.png" alt="logo" className="logo cursor" onClick={() => navigate(-1)}/>
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
      <h1 className="text-bebas tamano2 text-center">Fincas</h1>

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
                  <div className="col-12">
                    <div className="rounded bg-body-secondary text-center p-3">
                      <p className="mb-0">{c.metrosCuadrados} M²</p>
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

                <Link to={`/propiedad/fincas/${c.id}`} className="btn bg-dark text-white mb-2">
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
                <li>sysemprendimientos06@gmail.com</li>
              </ul>
            </article>
          </div>
        </div>

        <p className="mb-0 py-3 text-center text-white">
          &copy; Inmobiliaria SyS | Desarrollado por{" "}
          <a href="https://genesys.com.ar/" className="link-dark link-underline-opacity-0">Genesys</a>
        </p>
    </footer>
    </>
  )
}