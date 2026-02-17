import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../firebase"
import ModalDetalle from "../components/ModalDetalle"

export default function Casas() {
  const [casas, setCasas] = useState([])
  const [seleccionada, setSeleccionada] = useState(null)

  useEffect(() => {
    const fetch = async () => {
      const snap = await getDocs(collection(db, "casas"))
      setCasas(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    }
    fetch()
  }, [])

  const enviarWhatsapp = numero => {
    window.open(`https://wa.me/${numero}`, "_blank")
  }

  return (
    <div className="container py-5">
      <h1>Casas</h1>

      <div className="row">
        {casas.map(c => (
          <div key={c.id} className="col-md-4 mb-4">
            <div className="card h-100">
              <img
                src={c.imagenes?.[0]}
                className="card-img-top"
                style={{ height: 200, objectFit: "cover" }}
              />

              <div className="card-body d-flex flex-column">
                <h5>{c.titulo}</h5>
                <p className="mb-1"><strong>${c.precio}</strong></p>
                <p className="text-muted mb-2">{c.ubicacion}</p>

                <p>
                  {c.descripcion?.slice(0, 100)}
                  {c.descripcion?.length > 100 && "..."}
                </p>

                <ul className="small mb-3">
                  <li>Habitaciones: {c.habitaciones}</li>
                  <li>Baños: {c.banos}</li>
                  <li>Pisos: {c.pisos}</li>
                  <li>Metros²: {c.metrosCuadrados}</li>
                </ul>

                <button className="btn btn-dark mb-2" onClick={() => setSeleccionada(c)}>
                  Ver propiedad
                </button>

                <button className="btn btn-success mt-auto" onClick={() => enviarWhatsapp(c.whatsapp)}>
                  Enviar WhatsApp
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {seleccionada && (
        <ModalDetalle propiedad={seleccionada} onClose={() => setSeleccionada(null)} />
      )}
    </div>
  )
}
