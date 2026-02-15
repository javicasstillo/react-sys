import { useEffect, useState } from "react"
import { collection, getDocs } from "firebase/firestore"
import { db } from "../firebase"

export default function Home() {
  const [props, setProps] = useState([])

  useEffect(() => {
    getDocs(collection(db, "propiedades")).then(snap => {
      setProps(snap.docs.map(d => d.data()))
    })
  }, [])

  return (
    <div className="container py-5">
      <h2>Propiedades disponibles</h2>
      <div className="row">
        {props.map((p, i) => (
          <div key={i} className="col-md-4">
            <div className="card">
              <img src={p.imagen} className="card-img-top" />
              <div className="card-body">
                <h5>{p.titulo}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
