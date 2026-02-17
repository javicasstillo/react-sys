import { useEffect, useState } from "react"
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db, storage } from "../firebase"

const Admin = () => {
  const [tipo, setTipo] = useState("casas")
  const [propiedades, setPropiedades] = useState([])
  const [editandoId, setEditandoId] = useState(null)

  const [form, setForm] = useState({
    titulo: "",
    precio: "",
    descripcion: "",
    banos: "",
    habitaciones: "",
    pisos: "",
    metrosCuadrados: "",
    imagenes: []
  })

  const [preview, setPreview] = useState([])

  const fetchProps = async () => {
    const snapshot = await getDocs(collection(db, tipo))
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    setPropiedades(data)
  }

  useEffect(() => {
    fetchProps()
  }, [tipo])

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleImages = e => {
    const files = Array.from(e.target.files)
    setForm({ ...form, imagenes: files })
    setPreview(files.map(file => URL.createObjectURL(file)))
  }

  const subirImagenes = async files => {
    const urls = []
    for (const file of files) {
      const imgRef = ref(storage, `propiedades/${Date.now()}-${file.name}`)
      await uploadBytes(imgRef, file)
      const url = await getDownloadURL(imgRef)
      urls.push(url)
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
      imagenes: []
    })
    setPreview([])
    setEditandoId(null)
  }

  const crearOEditar = async e => {
    e.preventDefault()

    let urls = []
    if (form.imagenes.length > 0) {
      urls = await subirImagenes(form.imagenes)
    }

    if (editandoId) {
      const refDoc = doc(db, tipo, editandoId)
      await updateDoc(refDoc, {
        ...form,
        imagenes: urls.length ? urls : propiedades.find(p => p.id === editandoId).imagenes
      })
    } else {
      await addDoc(collection(db, tipo), {
        ...form,
        imagenes: urls
      })
    }

    resetForm()
    fetchProps()
  }

  const eliminar = async id => {
    await deleteDoc(doc(db, tipo, id))
    fetchProps()
  }

  const editar = prop => {
    setEditandoId(prop.id)
    setForm({
      titulo: prop.titulo,
      precio: prop.precio,
      descripcion: prop.descripcion,
      banos: prop.banos,
      habitaciones: prop.habitaciones,
      pisos: prop.pisos,
      metrosCuadrados: prop.metrosCuadrados,
      imagenes: []
    })
    setPreview(prop.imagenes)
  }

  const cortarTexto = texto => {
    if (!texto) return ""
    return texto.length > 100 ? texto.substring(0, 100) + "..." : texto
  }

  return (
    <div className="container py-5">

      <button className="btn btn-secondary mb-3" onClick={() => setTipo(tipo === "casas" ? "departamentos" : "casas")}>
        Cambiar tipo de propiedad
      </button>

      <h2 className="mb-4">Admin {tipo.toUpperCase()}</h2>

      {/* FORM */}
      <form onSubmit={crearOEditar} className="mb-5">
        <div className="row g-2 mb-2">
          <input className="form-control" name="titulo" placeholder="Título" value={form.titulo} onChange={handleChange} required />
          <input className="form-control" name="precio" placeholder="Precio" value={form.precio} onChange={handleChange} required />
        </div>

        <textarea className="form-control mb-2" name="descripcion" placeholder="Descripción" value={form.descripcion} onChange={handleChange} required />

        <div className="row g-2 mb-2">
          <input className="form-control" name="banos" placeholder="Baños" value={form.banos} onChange={handleChange} />
          <input className="form-control" name="habitaciones" placeholder="Habitaciones" value={form.habitaciones} onChange={handleChange} />
          <input className="form-control" name="pisos" placeholder="Pisos" value={form.pisos} onChange={handleChange} />
          <input className="form-control" name="metrosCuadrados" placeholder="Metros cuadrados" value={form.metrosCuadrados} onChange={handleChange} />
        </div>

        <input type="file" multiple className="form-control mb-2" onChange={handleImages} />

        {preview.length > 0 && (
          <div className="d-flex gap-2 mb-3 flex-wrap">
            {preview.map((img, i) => (
              <img key={i} src={img} style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 6 }} />
            ))}
          </div>
        )}

        <button className="btn btn-success">
          {editandoId ? "Guardar cambios" : "Crear propiedad"}
        </button>

        {editandoId && (
          <button type="button" className="btn btn-outline-secondary ms-2" onClick={resetForm}>
            Cancelar edición
          </button>
        )}
      </form>

      {/* LISTADO */}
      <h4 className="mb-3">Propiedades cargadas</h4>

      <div className="row g-4">
        {propiedades.map(prop => (
          <div key={prop.id} className="col-md-4">
            <div className="card h-100 shadow-sm">
              <img
                src={prop.imagenes?.[0]}
                className="card-img-top"
                style={{ height: 200, objectFit: "cover" }}
              />

              <div className="card-body d-flex flex-column">
                <h5>{prop.titulo}</h5>
                <strong className="mb-2">${prop.precio}</strong>

                <p className="small text-muted mb-2">
                  {cortarTexto(prop.descripcion)}
                </p>

                <div className="d-flex gap-3 small mb-3">
                  <span> 🛁: {prop.banos}</span>
                  <span> 🛏️: {prop.habitaciones}</span>
                  <span> 🏢: {prop.pisos}</span>
                  <span> 📐: {prop.metrosCuadrados} m²</span>
                </div>

                <div className="mt-auto d-flex gap-2">
                  <button className="btn btn-dark btn-sm w-100" onClick={() => editar(prop)}>
                    Editar
                  </button>
                  <button className="btn btn-danger btn-sm w-100" onClick={() => eliminar(prop.id)}>
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}

export default Admin
