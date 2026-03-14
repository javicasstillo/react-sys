import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import Swal from "sweetalert2"
import jsPDF from "jspdf"
import ZoomPlugin from "yet-another-react-lightbox/plugins/zoom"
import "yet-another-react-lightbox/styles.css"

import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"

export default function PropiedadDetalle() {
  const { tipo, id } = useParams();
  const [propiedad, setPropiedad] = useState(null);
  const navigate = useNavigate()
  const [imagenActual, setImagenActual] = useState(0)
  
  const [abrirGaleria, setAbrirGaleria] = useState(false)
  const [indexImagen, setIndexImagen] = useState(0)

  useEffect(() => {
    const fetch = async () => {
      try {
        const snap = await getDoc(doc(db, tipo, id));
        if (snap.exists()) {
          setPropiedad(snap.data());
        }
      } catch (e) {
        console.error("Error cargando propiedad:", e);
      }
    };
    fetch();
  }, [tipo, id]);

  useEffect(() => {

    if (!propiedad) return

    const carousel = document.getElementById("carouselPropiedad")

    if (!carousel) return

    const actualizarContador = () => {

      const slides = carousel.querySelectorAll(".carousel-item")
      const activo = carousel.querySelector(".carousel-item.active")

      const index = Array.from(slides).indexOf(activo)

      if (index >= 0) {
        setImagenActual(index)
      }

    }

    carousel.addEventListener("slid.bs.carousel", actualizarContador)

    return () => {
      carousel.removeEventListener("slid.bs.carousel", actualizarContador)
    }

  }, [propiedad])

  if (!propiedad) return <p className="text-center py-5">Cargando propiedad...</p>;

  const linkPropiedad = window.location.href;
  const mensaje = encodeURIComponent(
    `Hola! Te quiero consultar por esta propiedad: ${linkPropiedad}`
  );

  const enviarWhatsapp = () => {
    window.open(`https://wa.me/${propiedad.whatsapp}?text=${mensaje}`, "_blank");
  };

  const compartirPropiedad = async () => {
  const url = window.location.href

  // 📱 Si el navegador soporta share nativo (celulares)
  if (navigator.share) {
    try {
      await navigator.share({
        title: propiedad.titulo,
        text: "Mirá esta propiedad 👇",
        url: url
      })
    } catch (err) {
      console.log("Share cancelado")
    }
  }

  // 💻 Si NO lo soporta (PC)
  else {
    try {
      await navigator.clipboard.writeText(url)

      Swal.fire({
        icon: "success",
        title: "¡Link copiado!",
        text: "La propiedad está lista para ser compartida.",
        timer: 2000,
        showConfirmButton: false
      })

    } catch (err) {
      Swal.fire("Error", "No se pudo copiar el link", "error")
    }
  }
}

const generarPDF = async () => {

  const pdf = new jsPDF()

  // LOGO



// 🔹 franja de color del header
pdf.setFillColor(0, 0, 0) // 
pdf.rect(0, 0, 210, 35, "F")

// 🔹 logo
const logo = await cargarLogoBase64("/assets/logo.png")
pdf.addImage(logo, "PNG", 75, 7, 60, 20)

  // TITULO
  pdf.setFontSize(18)
  pdf.text(propiedad.titulo, 10, 40)

  // PRECIO
  pdf.setFontSize(14)
  pdf.text(`Precio: ${propiedad.precio} USD`, 10, 50)

  // REFERENCIA
  pdf.text(`Referencia: ${propiedad.referencia}`, 10, 58)

  const imagenes = propiedad.imagenes?.slice(0,4) || []

let x = 10
let y = 70

const ancho = 90
const alto = 65

for (let i = 0; i < imagenes.length; i++) {

  const base64 = await cargarImagenBase64(imagenes[i])

  pdf.addImage(base64, "JPEG", x, y, ancho, alto)

  if (i % 2 === 0) {
    x = 110
  } else {
    x = 10
    y += 75
  }
}

  // DATOS
  pdf.addPage()

  pdf.setFontSize(16)
  pdf.text("Características", 10, 20)

  pdf.setFontSize(12)

  pdf.text(`Metros totales: ${propiedad.metrosCuadrados} m²`, 10, 35)
  pdf.text(`Metros cubiertos: ${propiedad.metrosCubiertos || "-"} m²`, 10, 45)
  pdf.text(`Habitaciones: ${propiedad.habitaciones}`, 10, 55)
  pdf.text(`Baños: ${propiedad.banos}`, 10, 65)
  pdf.text(`Ubicación: ${propiedad.ubicacion}`, 10, 75)

  // DESCRIPCIÓN
  pdf.setFontSize(16)
  pdf.text("Descripción", 10, 95)

  pdf.setFontSize(12)

  const texto = pdf.splitTextToSize(propiedad.descripcion, 180)

pdf.text(texto, 10, 105)

// calcular altura real del texto
const textDimensions = pdf.getTextDimensions(texto)
let finalDescripcion = 105 + textDimensions.h

// si el contacto se pasa del límite de la hoja → nueva página
if (finalDescripcion > 240) {
  pdf.addPage()
  finalDescripcion = 20
}

// línea separadora
pdf.line(10, finalDescripcion + 5, 200, finalDescripcion + 5)

// CONTACTO
pdf.setFontSize(14)
pdf.text("Contacto", 10, finalDescripcion + 15)

pdf.setFontSize(12)
pdf.text("Inmobiliaria SyS", 10, finalDescripcion + 25)
pdf.text("Las Heras 181 - San Rafael", 10, finalDescripcion + 32)
pdf.text("Tel: +54 9 260 4345281", 10, finalDescripcion + 39)

  pdf.save(`propiedad-${propiedad.referencia}.pdf`)
}

const cargarImagenBase64 = (url) => {
  return new Promise((resolve) => {

    const img = new Image()
    img.crossOrigin = "anonymous"

    img.onload = () => {

      const canvas = document.createElement("canvas")
      canvas.width = img.width
      canvas.height = img.height

      const ctx = canvas.getContext("2d")
      ctx.drawImage(img, 0, 0)

      const dataURL = canvas.toDataURL("image/jpeg")

      resolve(dataURL)
    }

    img.src = url
  })
}

const cargarLogoBase64 = (url) => {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = "anonymous"

    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = img.width
      canvas.height = img.height

      const ctx = canvas.getContext("2d")
      ctx.drawImage(img, 0, 0)

      resolve(canvas.toDataURL("image/png"))
    }

    img.src = url
  })
}

  

  return (

    <>
    <header>
            <nav className="navbar  bg-rosa fixed-top">
              <div className="container d-flex justify-content-between">
                <img src="/assets/logo.png" alt="logo" className="logo cursor" onClick={() => navigate("/")}/>
                <button 
                  className="btn btn-outline-light bg-rosa text-white fs-5"
                  onClick={() => navigate("/")}
                >
                  ← Ir al Inicio
                </button>
                  
              </div>
            </nav>
          </header>
    <div className="container py-3">

      

      <h1 className="mb-3 text-center">{propiedad.titulo}</h1>
      <p className="fw-bold text-center tamano2 text-rosa"> ${propiedad.precio} USD</p>
      

      {/* CARROUSEL EXACTO AL MODAL */}
      {/* CARROUSEL CON ALTURA FIJA Y ESTILOS EN CSS */}
      <div
          id="carouselPropiedad"
          className="carousel slide mb-4 carousel-propiedad"
          data-bs-touch="false"
          data-bs-interval="false"
        >
        <div className="carousel-inner">

          {propiedad.imagenes?.map((img, i) => (
            <div
              key={i}
              className={`carousel-item ${i === 0 ? "active" : ""}`}
            >
              <div className="carousel-propiedad-item">
                <img
                  src={img}
                  alt={`Propiedad ${i + 1}`}
                  className="carousel-propiedad-img"
                  style={{ cursor: "zoom-in" }}
                  onClick={() => {
                    setIndexImagen(i)
                    setAbrirGaleria(true)
                  }}
                />
              </div>
            </div>
          ))}

        </div>

        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselPropiedad"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon carousel-propiedad-arrow"></span>
        </button>

        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselPropiedad"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon carousel-propiedad-arrow"></span>
        </button>
      </div>
     <Lightbox
  open={abrirGaleria}
  close={() => setAbrirGaleria(false)}
  index={indexImagen}
  slides={propiedad.imagenes.map(img => ({ src: img }))}
  plugins={[ZoomPlugin]}
  zoom={{
    maxZoomPixelRatio: 3,
    zoomInMultiplier: 2,
    doubleTapDelay: 300,
  }}
/>
      <div className="text-center mb-3 text-muted">
        {imagenActual + 1} / {propiedad.imagenes?.length}
      </div>
      <div className="row gy-3">
        <div className="col-6 col-md-4">
          <p className="p-3   bg-body-secondary   text-center rounded h-100"> {propiedad.metrosCuadrados} M²</p>
        </div>
        <div className="col-6 col-md-4">
          <p className="p-3   bg-body-secondary   text-center rounded h-100"> {propiedad.metrosCubiertos} M² cub</p>
        </div>
        <div className="col-6 col-md-4">
          <p className="p-3   bg-body-secondary  text-center rounded h-100">{propiedad.banos} Baños </p>
        </div>
        
        <div className="col-6 col-md-6">
          <p className="p-3   bg-body-secondary   text-center rounded h-100"> {propiedad.habitaciones} Habitaciones</p>
        </div>
        
        <div className="col-12 col-md-6">
          <p className="p-3   bg-body-secondary   text-center rounded h-100"> <i class="bi bi-geo-alt-fill text-dark fs-5"></i> {propiedad.ubicacion}</p>
        </div>
        
      </div>
      {/* DESCRIPCIÓN */}
      <p className="py-3" style={{ whiteSpace: "pre-line" }}>
        {propiedad.descripcion}
      </p>

      {/* DATOS IGUAL QUE EL MODAL */}
      
      
      <div className="row justify-content-center">

        <div className="col-12 text-center">
          <p className=" h-100"> <strong>Asesor Designado:</strong> {propiedad.asesor}</p>
        </div>
        <div className="col-6 col-md-12">
          <div className="d-flex justify-content-center gap-2 flex-wrap">

            <button 
              className="rounded h-100 btn bg-rosa text-white"
              onClick={enviarWhatsapp}
            >
              <i className="bi bi-whatsapp fs-5"></i> Enviar WhatsApp
            </button>
            
            <button 
              className="rounded h-100 btn btn-outline-dark"
              onClick={compartirPropiedad}
            >
              <i className="bi bi-share-fill fs-5"></i> Compartir
            </button>

            <button 
              className="rounded h-100 btn btn-outline-danger"
              onClick={generarPDF}
            >
              <i className="bi bi-file-earmark-pdf-fill fs-5"></i> Generar PDF
            </button>

          </div>
        </div>
      </div>
      
      

      

    </div>

    <footer className="bg-rosa">
        <div className="container py-3">
          <div className="row justify-content-between">
            <article className="col-12 col-md-6 text-center" onClick={() => navigate("/")}>
              <button className="bg-transparent border-0">
                <img src="/assets/logo.png" alt="logo footer" className="w-50 logo" />
              </button>
            </article>

            <article className="col-12 col-md-3 text-center text-md-start pt-4">
              <h6 className="text-white">Contacto</h6>
              <ul className="list-unstyled text-white">
                <li>Las Heras 181 - San Rafael</li>
                <li>+54 9 260-4345281</li>
                <li>consultas.inmobiliariasys@gmail.com</li>
              </ul>
            </article>
          </div>
        </div>

        <p className="mb-0 py-3 text-center text-white">
          &copy; Inmobiliaria SyS | Desarrollado por{" "}
          <a href="https://genesys.com.ar/" className="link-dark link-underline-opacity-0">Genesys</a>
        </p>
      </footer>

    </>
  );
}
