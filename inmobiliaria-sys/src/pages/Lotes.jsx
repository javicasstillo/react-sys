import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../firebase"
import ModalDetalle from "../components/ModalDetalle"

export default function Departamentos() {
  const [departamentos, setDepartamentos] = useState([])
  const [seleccionada, setSeleccionada] = useState(null)

  useEffect(() => {
    const fetch = async () => {
      const snap = await getDocs(collection(db, "lotes"))
      setDepartamentos(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    }
    fetch()
  }, [])

  const enviarWhatsapp = numero => window.open(`https://wa.me/${numero}`, "_blank")

  return (
    <div className="container py-5">
      <h1>Lotes</h1>

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

                <button className="btn btn-dark mb-2" onClick={() => setSeleccionada(d)}>Ver propiedad</button>
                <button className="btn btn-success mt-auto" onClick={() => enviarWhatsapp(d.whatsapp)}>Enviar WhatsApp</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {seleccionada && <ModalDetalle propiedad={seleccionada} onClose={() => setSeleccionada(null)} />}
    </div>
  )
}
