import { useEffect, useState } from "react"
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db, storage } from "../firebase"
import Swal from "sweetalert2"

const ASESORES = [
  "Carlos Sacon",
  "Fabricio Signes",
  "Alfredo Signes",
  "Rodolfo Andrade",
  "Nahuel Barroso",
  "Leonel Bernardeau",
  "Silvia Diaz"
]

const TIPOS = [
  { label: "Casa", value: "casas" },
  { label: "Departamento", value: "departamentos" },
  { label: "Finca", value: "fincas" },
  { label: "Lote", value: "lotes" },
  { label: "Local comercial", value: "locales" }
]

const Admin = () => {
  const [tipo, setTipo] = useState("")
  const [propiedades, setPropiedades] = useState([])
  const [editandoId, setEditandoId] = useState(null)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    titulo: "",
    precio: "",
    descripcion: "",
    banos: "",
    habitaciones: "",
    pisos: "",
    metrosCuadrados: "",
    asesor: "",
    whatsapp: "",
    imagenes: []
  })

  const [preview, setPreview] = useState([])

  const fetchProps = async () => {
    if (!tipo) return
    const snapshot = await getDocs(collection(db, tipo))
    setPropiedades(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
  }

  useEffect(() => {
    fetchProps()
  }, [tipo])

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // 👉 ACÁ está lo que volvimos a agregar: previews de imágenes
  const handleImages = e => {
    const files = Array.from(e.target.files)
    setForm({ ...form, imagenes: files })
    const urls = files.map(file => URL.createObjectURL(file))
    setPreview(urls)
  }

  const subirImagenes = async files => {
    const urls = []
    for (const file of files) {
      const imgRef = ref(storage, `propiedades/${tipo}/${Date.now()}-${file.name}`)
      await uploadBytes(imgRef, file)
      urls.push(await getDownloadURL(imgRef))
    }
    return urls
  }

  const resetForm = () => {
    setForm({
      titulo: "",
      precio: "",
      descripcion: "",
      banos: "",
      habitaciones: "",
      pisos: "",
      metrosCuadrados: "",
      asesor: "",
      whatsapp: "",
      imagenes: []
    })
    setPreview([])
    setEditandoId(null)
  }

  const crearOEditar = async e => {
    e.preventDefault()

    try {
      setLoading(true)

      let urls = []
      if (form.imagenes.length) {
        urls = await subirImagenes(form.imagenes)
      }

      if (editandoId) {
        const refDoc = doc(db, tipo, editandoId)
        await updateDoc(refDoc, {
          ...form,
          imagenes: urls.length
            ? urls
            : propiedades.find(p => p.id === editandoId).imagenes
        })
      } else {
        await addDoc(collection(db, tipo), {
          ...form,
          imagenes: urls
        })
      }

      Swal.fire({
        icon: "success",
        title: "Propiedad cargada con éxito",
        confirmButtonText: "OK"
      })

      resetForm()
      fetchProps()
    } catch (error) {
      console.error(error)
      Swal.fire({
        icon: "error",
        title: "Ocurrió un error",
        text: "Intenta más tarde o contactá a soporte",
        confirmButtonText: "OK"
      })
    } finally {
      setLoading(false)
    }
  }

  const eliminar = async id => {
    await deleteDoc(doc(db, tipo, id))
    fetchProps()
  }

  const editar = prop => {
    setEditandoId(prop.id)
    setForm({ ...prop, imagenes: [] })
    setPreview(prop.imagenes || [])
  }

  const cortar = txt => (txt?.length > 100 ? txt.slice(0, 100) + "..." : txt)

  return (
    <div className="container py-5">

      {!tipo && (
        <>
          <h2 className="mb-3">¿Qué tipo de propiedad querés cargar?</h2>
          <div className="d-flex gap-2 flex-wrap">
            {TIPOS.map(t => (
              <button
                key={t.value}
                className="btn btn-dark"
                onClick={() => setTipo(t.value)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </>
      )}

      {tipo && (
        <>
          <button className="btn btn-secondary mb-3" onClick={() => setTipo("")}>
            Cambiar tipo de propiedad
          </button>

          <h2>Admin {tipo.toUpperCase()}</h2>

          <form onSubmit={crearOEditar} className="mb-5">

            <input className="form-control mb-2" name="titulo" placeholder="Título" value={form.titulo} onChange={handleChange} required />
            <input className="form-control mb-2" name="precio" placeholder="Precio" value={form.precio} onChange={handleChange} required />

            <textarea className="form-control mb-2" name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} />

            <div className="row g-2 mb-2">
              <input className="form-control" name="banos" placeholder="Baños" value={form.banos} onChange={handleChange} />
              <input className="form-control" name="habitaciones" placeholder="Habitaciones" value={form.habitaciones} onChange={handleChange} />
              <input className="form-control" name="pisos" placeholder="Pisos" value={form.pisos} onChange={handleChange} />
              <input className="form-control" name="metrosCuadrados" placeholder="Metros cuadrados" value={form.metrosCuadrados} onChange={handleChange} />
            </div>

            <select className="form-control mb-2" name="asesor" value={form.asesor} onChange={handleChange} required>
              <option value="">Asesor Designado</option>
              {ASESORES.map(a => <option key={a} value={a}>{a}</option>)}
            </select>

            <input className="form-control mb-2" type="number" name="whatsapp" placeholder="Whatsapp" value={form.whatsapp} onChange={handleChange} required />

            <input type="file" multiple className="form-control mb-2" onChange={handleImages} />

            {/* 👉 PREVIEW DE IMÁGENES */}
            {preview.length > 0 && (
              <div className="d-flex gap-2 flex-wrap mb-3">
                {preview.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt="preview"
                    style={{
                      width: 80,
                      height: 80,
                      objectFit: "cover",
                      borderRadius: 6,
                      border: "1px solid #ddd"
                    }}
                  />
                ))}
              </div>
            )}

            <button className="btn btn-success" disabled={loading}>
              {loading ? "Creando propiedad..." : editandoId ? "Guardar cambios" : "Crear propiedad"}
            </button>
          </form>

          <div className="row g-4">
            {propiedades.map(p => (
              <div key={p.id} className="col-md-4">
                <div className="card h-100 shadow">
                  <img src={p.imagenes?.[0]} className="card-img-top" style={{ height: 200, objectFit: "cover" }} />

                  <div className="card-body">
                    <h5>{p.titulo}</h5>
                    <strong>${p.precio}</strong>
                    <p className="small text-muted">{cortar(p.descripcion)}</p>

                    <p className="small mb-1"><strong>Asesor:</strong> {p.asesor}</p>
                    <p className="small mb-3"><strong>WhatsApp:</strong> {p.whatsapp}</p>

                    <div className="d-flex gap-2">
                      <button className="btn btn-dark btn-sm w-100" onClick={() => editar(p)}>Editar</button>
                      <button className="btn btn-danger btn-sm w-100" onClick={() => eliminar(p.id)}>Eliminar</button>
                    </div>
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

export default Admin
