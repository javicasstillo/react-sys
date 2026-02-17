import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../firebase"
import ModalDetalle from "../components/ModalDetalle"

export default function Lotes() {
  const [lotes, setLotes] = useState([])
  const [seleccionada, setSeleccionada] = useState(null)

  useEffect(() => {
    const fetch = async () => {
      const snap = await getDocs(collection(db, "lotes"))
      setLotes(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    }
    fetch()
  }, [])

  const enviarWhatsapp = numero => {
    window.open(`https://wa.me/${numero}`, "_blank")
  }

  return (
    <div className="container py-5">
      <h1>Lotes</h1>

      <div className="row">
        {lotes.map(l => (
          <div key={l.id} className="col-md-4 mb-4">
            <div className="card h-100">

              <img 
                src={l.imagenes?.[0]} 
                className="card-img-top" 
                style={{ height: 200, objectFit: "cover" }} 
              />

              <div className="card-body d-flex flex-column">
                <h5>{l.titulo}</h5>
                <p><strong>${l.precio}</strong></p>

                <p>
                  {l.descripcion?.slice(0, 100)}
                  {l.descripcion?.length > 100 && "..."}
                </p>

                <ul className="small mb-3">
                  <li>🛏 {l.habitaciones}</li>
                  <li>🛁 {l.banos}</li>
                  <li>🏢 {l.pisos}</li>
                  <li>📐 {l.metrosCuadrados} m²</li>
                </ul>

                <button className="btn btn-dark mb-2" onClick={() => setSeleccionada(l)}>
                  Ver propiedad
                </button>

                <button className="btn btn-success mt-auto" onClick={() => enviarWhatsapp(l.whatsapp)}>
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
