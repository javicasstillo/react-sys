import { useEffect, useState } from "react"
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db, storage } from "../firebase"

export default function Admin() {
  const [props, setProps] = useState([])
  const [titulo, setTitulo] = useState("")
  const [file, setFile] = useState(null)

  const cargar = async () => {
    const snap = await getDocs(collection(db, "propiedades"))
    setProps(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  }

  useEffect(() => { cargar() }, [])

  const crear = async () => {
    const imgRef = ref(storage, `propiedades/${file.name}`)
    await uploadBytes(imgRef, file)
    const url = await getDownloadURL(imgRef)

    await addDoc(collection(db, "propiedades"), {
      titulo,
      imagen: url,
      createdAt: Date.now()
    })

    setTitulo("")
    setFile(null)
    cargar()
  }

  const borrar = async (id, img) => {
    await deleteDoc(doc(db, "propiedades", id))
    setProps(props.filter(p => p.id !== id))
  }

  return (
    <div className="container py-4">
      <h1>Panel de Administración</h1>
      <p>Bienvenido al panel privado de Inmobiliaria SyS.</p>

      <div className="card p-3 mb-4">
        <input className="form-control my-2" placeholder="Título" value={titulo} onChange={e => setTitulo(e.target.value)} />
        <input className="form-control my-2" type="file" onChange={e => setFile(e.target.files[0])} />
        <button onClick={crear} className="btn btn-success">Agregar</button>
      </div>

      <div className="row">
        {props.map(p => (
          <div key={p.id} className="col-md-4">
            <div className="card mb-3">
              <img src={p.imagen} className="card-img-top" />
              <div className="card-body">
                <h5>{p.titulo}</h5>
                <button onClick={() => borrar(p.id)} className="btn btn-danger">Eliminar</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
