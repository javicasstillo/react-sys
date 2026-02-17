import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../firebase"
import ModalDetalle from "../components/ModalDetalle"

export default function Fincas() {
  const [fincas, setFincas] = useState([])
  const [seleccionada, setSeleccionada] = useState(null)

  useEffect(() => {
    const fetch = async () => {
      const snap = await getDocs(collection(db, "fincas"))
      setFincas(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    }
    fetch()
  }, [])

  const enviarWhatsapp = numero => {
    window.open(`https://wa.me/${numero}`, "_blank")
  }

  return (
    <div className="container py-5">
      <h1>Fincas</h1>

      <div className="row">
        {fincas.map(f => (
          <div key={f.id} className="col-md-4 mb-4">
            <div className="card h-100">

              <img 
                src={f.imagenes?.[0]} 
                className="card-img-top" 
                style={{ height: 200, objectFit: "cover" }} 
              />

              <div className="card-body d-flex flex-column">
                <h5>{f.titulo}</h5>
                <p><strong>${f.precio}</strong></p>

                <p>
                  {f.descripcion?.slice(0, 100)}
                  {f.descripcion?.length > 100 && "..."}
                </p>

                <ul className="small mb-3">
                  <li>🛏 {f.habitaciones}</li>
                  <li>🛁 {f.banos}</li>
                  <li>🏢 {f.pisos}</li>
                  <li>📐 {f.metrosCuadrados} m²</li>
                </ul>

                <button className="btn btn-dark mb-2" onClick={() => setSeleccionada(f)}>
                  Ver propiedad
                </button>

                <button className="btn btn-success mt-auto" onClick={() => enviarWhatsapp(f.whatsapp)}>
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
