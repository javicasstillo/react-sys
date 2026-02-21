import { useEffect, useState } from "react"
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import Swal from "sweetalert2"
import { db, storage } from "../firebase"

export default function Admin() {
  const [tipo, setTipo] = useState("")
  const [items, setItems] = useState([])

  const [titulo, setTitulo] = useState("")
  const [precio, setPrecio] = useState("")
  const [descripcion, setDescripcion] = useState("")
  const [ubicacion, setUbicacion] = useState("")
  const [banos, setBanos] = useState("")
  const [habitaciones, setHabitaciones] = useState("")
  const [metrosCuadrados, setMetrosCuadrados] = useState("")
  const [asesor, setAsesor] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [imagenes, setImagenes] = useState([])
  const [preview, setPreview] = useState([])

  const [loading, setLoading] = useState(false)
  const [editando, setEditando] = useState(null)

  useEffect(() => {
    if (!tipo) return

    const fetch = async () => {
      const snap = await getDocs(collection(db, tipo))
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    }

    fetch()
  }, [tipo])

  const resetForm = () => {
    setTitulo("")
    setPrecio("")
    setDescripcion("")
    setUbicacion("")
    setBanos("")
    setHabitaciones("")
    setMetrosCuadrados("")
    setAsesor("")
    setWhatsapp("")
    setImagenes([])
    setPreview([])
    setEditando(null)
  }

  const subirImagenes = async () => {
    const urls = []

    for (let img of imagenes) {
      const imgRef = ref(storage, `propiedades/${tipo}/${Date.now()}-${img.name}`)
      await uploadBytes(imgRef, img)
      const url = await getDownloadURL(imgRef)
      urls.push(url)
    }

    return urls
  }

  const crearPropiedad = async e => {
    e.preventDefault()
    try {
      setLoading(true)

      const urls = imagenes.length ? await subirImagenes() : []

      const data = {
        titulo,
        precio: Number(precio),
        descripcion,
        ubicacion,
        banos,
        habitaciones,
        metrosCuadrados,
        imagenes: urls,
        asesor,
        whatsapp
      }

      if (editando) {
        await updateDoc(doc(db, tipo, editando.id), {
          ...data,
          imagenes: urls.length ? urls : editando.imagenes
        })
      } else {
        await addDoc(collection(db, tipo), data)
      }

      Swal.fire("Éxito", "Propiedad cargada con éxito", "success")
      resetForm()

      const snap = await getDocs(collection(db, tipo))
      setItems(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    } catch (err) {
      console.error(err)
      Swal.fire("Error", "Ocurrió un error, intenta más tarde o contacta a soporte", "error")
    } finally {
      setLoading(false)
    }
  }

  const eliminar = async id => {
    await deleteDoc(doc(db, tipo, id))
    setItems(items.filter(i => i.id !== id))
  }

  const handleEdit = item => {
    setEditando(item)
    setTitulo(item.titulo)
    setPrecio(item.precio)
    setDescripcion(item.descripcion)
    setUbicacion(item.ubicacion || "")
    setBanos(item.banos)
    setHabitaciones(item.habitaciones)
    setMetrosCuadrados(item.metrosCuadrados)
    setAsesor(item.asesor)
    setWhatsapp(item.whatsapp)
    setPreview(item.imagenes || [])
    setImagenes([])
  }

  const handlePreview = files => {
    setImagenes(files)
    const prevs = Array.from(files).map(file => URL.createObjectURL(file))
    setPreview(prevs)
  }

  return (
    <div className="container py-5">
      <h1>Panel de Administrador</h1>

      {!tipo && (
        <div className="mb-4">
          <h5>¿Qué querés cargar?</h5>
          {["casas", "departamentos", "fincas", "lotes", "locales"].map(t => (
            <button key={t} className="btn btn-dark me-2 mb-2" onClick={() => setTipo(t)}>
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      {tipo && (
        <>
          <button className="btn btn-outline-secondary mb-3" onClick={() => setTipo("")}>
            Cambiar tipo
          </button>

          <form onSubmit={crearPropiedad} className="card p-4 mb-5">

            <input className="form-control mb-2" placeholder="Título" value={titulo} onChange={e => setTitulo(e.target.value)} required />
            <input
              type="number"
              className="form-control mb-2"
              placeholder="Precio"
              value={precio}
              onChange={e => setPrecio(Number(e.target.value))}
              required
            />
            <textarea className="form-control mb-2" placeholder="Descripción" rows={4} value={descripcion} onChange={e => setDescripcion(e.target.value)} required />

            <input className="form-control mb-2" placeholder="Ubicación" value={ubicacion} onChange={e => setUbicacion(e.target.value)} required />

            <input className="form-control mb-2" placeholder="Baños" value={banos} onChange={e => setBanos(e.target.value)} />
            <input className="form-control mb-2" placeholder="Habitaciones" value={habitaciones} onChange={e => setHabitaciones(e.target.value)} />
            <input className="form-control mb-2" placeholder="Metros cuadrados" value={metrosCuadrados} onChange={e => setMetrosCuadrados(e.target.value)} />

            <select className="form-select mb-2" value={asesor} onChange={e => setAsesor(e.target.value)} required>
              <option value="">Asesor Designado</option>
              {["Carlos Sacon", "Fabricio Signes", "Alfredo Signes", "Rodolfo Andrade", "Nahuel Barroso", "Leonel Bernardeau", "Silvia Diaz"].map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>

            <input className="form-control mb-3" placeholder="WhatsApp" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} required />

            <input type="file" className="form-control mb-3" multiple accept="image/*" onChange={e => handlePreview(e.target.files)} />

            <div className="d-flex gap-2 flex-wrap mb-3">
              {preview.map((p, i) => (
                <img key={i} src={p} style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 6 }} />
              ))}
            </div>

            <button className="btn btn-dark" disabled={loading}>
              {loading ? "Creando propiedad..." : editando ? "Guardar cambios" : "Crear propiedad"}
            </button>
          </form>

          <h4>Propiedades cargadas</h4>
          <div className="row">
            {items.map(item => (
              <div key={item.id} className="col-md-4 mb-3">
                <div className="card h-100">
                  <img src={item.imagenes?.[0]} className="card-img-top" style={{ height: 180, objectFit: "cover" }} />
                  <div className="card-body">
                    <h5>{item.titulo}</h5>
                    <p>{item.descripcion?.slice(0, 100)}...</p>
                    <button className="btn btn-sm btn-outline-dark me-2" onClick={() => handleEdit(item)}>Editar</button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => eliminar(item.id)}>Eliminar</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
