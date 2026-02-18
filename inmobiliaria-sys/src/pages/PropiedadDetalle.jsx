import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../firebase"

export default function DetallePropiedad() {
  const { id, tipo } = useParams()
  const [propiedad, setPropiedad] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPropiedad = async () => {
      try {
        const ref = doc(db, tipo, id)
        const snap = await getDoc(ref)

        if (snap.exists()) {
          setPropiedad({ id: snap.id, ...snap.data() })
        } else {
          console.log("No existe la propiedad")
        }
      } catch (error) {
        console.error("Error cargando propiedad:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPropiedad()
  }, [id, tipo])

  if (loading) return <h2 className="text-center mt-5">Cargando propiedad...</h2>

  if (!propiedad) return <h2 className="text-center mt-5">Propiedad no encontrada</h2>

  const enviarWhatsapp = () => {
    const mensaje = encodeURIComponent(
      `Hola! Te quiero consultar por esta propiedad: ${window.location.href}`
    )
    window.open(`https://wa.me/${propiedad.whatsapp}?text=${mensaje}`, "_blank")
  }

  return (
    <div className="container py-5">
      <h1>{propiedad.titulo}</h1>
      <h3 className="text-success">${propiedad.precio}</h3>

      <div className="row my-4">
        {propiedad.imagenes?.map((img, i) => (
          <div key={i} className="col-md-4 mb-3">
            <img
              src={img}
              className="img-fluid rounded"
              style={{ height: 220, objectFit: "cover", width: "100%" }}
            />
          </div>
        ))}
      </div>

      <p>{propiedad.descripcion}</p>

      <ul>
        <li>Habitaciones: {propiedad.habitaciones}</li>
        <li>Baños: {propiedad.banos}</li>
        <li>Pisos: {propiedad.pisos}</li>
        <li>Metros cuadrados: {propiedad.metrosCuadrados}</li>
        <li>Ubicación: {propiedad.ubicacion}</li>
        <li>Asesor: {propiedad.asesor}</li>
      </ul>

      <button className="btn btn-success mt-3" onClick={enviarWhatsapp}>
        Enviar WhatsApp
      </button>
    </div>
  )
}
