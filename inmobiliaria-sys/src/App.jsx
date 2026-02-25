import { HashRouter, Routes, Route, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AOS from "aos";
import Admin from "./pages/Admin";
import Casas from "./pages/Casas";
import Departamentos from "./pages/Departamentos";
import Fincas from "./pages/Fincas";
import Lotes from "./pages/Lotes";
import Locales from "./pages/Locales";
import PropiedadDetalle from "./pages/PropiedadDetalle"
import { Collapse } from "bootstrap";
import Swal from "sweetalert2";
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "./firebase" 
import PrivateRoute from "./components/PrivateRoute";

function scrollTo(id) {
  setTimeout(() => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, 100);
}


function cerrarMenu() {
  const nav = document.getElementById("navbarNav");
  if (!nav) return;

  const instance = Collapse.getOrCreateInstance(nav);
  instance.hide();
}



function Home() {
  useEffect(() => {
    AOS.init({ once: true });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const data = new FormData(form);

    try {
      const res = await fetch("https://formsubmit.co/ajax/consultas.inmobiliariasys@gmail.com", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        form.reset();
        Swal.fire({
          icon: "success",
          title: "¡Mensaje enviado!",
          text: "Gracias por escribirnos. Te respondemos a la brevedad 🙌",
          confirmButtonText: "Genial",
        });
      } else {
        throw new Error("Error al enviar");
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Ups 😕",
        text: "No se pudo enviar el mensaje. Probá de nuevo en unos minutos.",
        confirmButtonText: "Reintentar",
      });
    }
  };



  return (
    <>
      <header>
        <nav className="navbar navbar-expand-lg bg-rosa  fixed-top">
          <div className="container">
            <Link to="/" className="navbar-brand" onClick={() => scrollTo("banner")}>
              <img src="/assets/logo.png" alt="logo" className="logo" />
            </Link>

            <button
              className="navbar-toggler"
              type="button"
              onClick={() => {
                const nav = document.getElementById("navbarNav");
                if (!nav) return;

                const instance = Collapse.getOrCreateInstance(nav);
                instance.toggle();
              }}
            >
              <span className="navbar-toggler-icon"></span>
            </button>






            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <button
                    className="nav-link text-white btn btn-link"
                    onClick={() => {
                      scrollTo("banner");
                      cerrarMenu();
                    }}
                  >
                    Inicio
                  </button>
                </li>
                
                <li className="nav-item">
                  <button
                    className="nav-link text-white btn btn-link"
                    onClick={() => {
                      scrollTo("menu-propiedades");
                      cerrarMenu();
                    }}
                  >
                    Propiedades
                  </button>

                </li>
                <li className="nav-item">
                  <button
                    className="nav-link text-white btn btn-link"
                    onClick={() => {
                      scrollTo("servicios");
                      cerrarMenu();
                    }}
                  >
                    Servicios
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className="nav-link text-white btn btn-link"
                    onClick={() => {
                      scrollTo("nosotros");
                      cerrarMenu();
                    }}
                  >
                    Nosotros
                  </button>

                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link text-rosa"
                    to="/login"
                    onClick={cerrarMenu}
                  >
                    Iniciar sesión
                  </Link>

                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      {/* MAIN */}
      <main>
        {/* BANNER */}
        <section id="banner" className="portada d-flex align-items-center">
          <div className="container py-5">
            <div className="row justify-content-center align-items-center g-5">
              <div className="col-12 col-lg-6 d-flex flex-column justify-content-center align-items-center text-center text-md-start">
                <div className="mt-5 d-flex justify-content-center gap-2 gap-md-3">
                  <div className="p-2 p-md-3 bg-black rounded bg-opacity-50 flex-fill">
                    <h1 className="mb-0 text-white text-bebas text-center">+10</h1>
                    <h3 className="text-white text-bebas text-center">Años de<br />Experiencia</h3>
                  </div>
                  <div className="p-2 p-md-3 bg-black rounded bg-opacity-50 flex-fill">
                    <h1 className="mb-0 text-white text-bebas text-center">+50</h1>
                    <h3 className="text-white text-bebas text-center">Propiedades<br />Entregadas</h3>
                  </div>
                  <div className="p-2 p-md-3 bg-black rounded bg-opacity-50 flex-fill">
                    <h1 className="mb-0 text-white text-bebas text-center">+60</h1>
                    <h3 className="text-white text-bebas text-center">Propiedades<br />Disponibles</h3>
                  </div>
                </div>

                <p className="fs-5 text-white text-center px-2 px-md-0 d-none d-md-block">
                  Nos especializamos en propiedades ubicadas en las mejores zonas de
                  San Rafael, Mendoza. Compromiso, transparencia y acompañamiento en
                  cada operación.
                </p>
              </div>

              <div className="col-12 col-lg-6">
                <div className="form">
                  <div className="card borde p-4 p-md-5 bg-black bg-opacity-50">
                    <h3 className="mb-2 text-bebas text-center tamano2 text-rosa">
                      Descubrí tu nuevo hogar
                    </h3>
                    <p className="text-white text-center mb-4">
                      ¡Contactanos para recibir la mejor oferta del mercado!
                    </p>

                    <form onSubmit={handleSubmit}>
                      <div className="row g-3 mb-3">
                        <div className="col-12 col-md-6">
                          <label className="form-label text-rosa">Nombre *</label>
                          <input type="text" className="form-control" name="nombre" required />
                        </div>

                        <div className="col-12 col-md-6">
                          <label className="form-label text-rosa">Apellido *</label>
                          <input type="text" className="form-control" name="apellido" required />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label text-rosa">Email *</label>
                        <input type="email" className="form-control" name="email" required />
                      </div>

                      <div className="mb-4">
                        <label className="form-label text-rosa">Mensaje *</label>
                        <textarea className="form-control" rows="4" name="mensaje" required />
                      </div>

                      {/* Config FormSubmit */}
                      <input type="hidden" name="_captcha" value="false" />
                      <input type="hidden" name="_subject" value="Nueva consulta" />
                      <input type="hidden" name="_template" value="table" />

                      <div className="text-center text-md-end">
                        <button type="submit" className="btn text-white bg-rosa px-4">
                          Enviar
                        </button>
                      </div>
                    </form>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROPIEDADES */}
        <section id="menu-propiedades" className="d-flex align-items-center">
          <div className="container py-3">
            <h3 className="text-bebas text-center tamano2" data-aos="fade-up">
              Propiedades
            </h3>

            <div className="row justify-content-center gy-3">
              {[
                { nombre: "Casas", ruta: "/casas" },
                { nombre: "Departamentos", ruta: "/departamentos" },
                { nombre: "Locales", ruta: "/locales" },
                { nombre: "Lotes", ruta: "/lotes" },
                { nombre: "Fincas", ruta: "/fincas" },
              ].map((item, i) => (
                <div key={i} className="col-12 col-md-6 col-lg-4" data-aos="fade-up">
                  <Link to={item.ruta} className="text-decoration-none">
                    <div className="card h-100">
                      <div className={`mini-portada-${item.nombre.toLowerCase()} d-flex align-items-end justify-content-center`}>
                        <p className="text-bebas text-white tamano2">
                          {item.nombre}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SERVICIOS */}
        <section id="servicios" className="d-flex align-items-center bg-body-secondary">
          <div className="container">
            <h3 className="tamano text-bebas text-center" data-aos="fade-up">¿Tenés una propiedad?</h3>
            <div className="row justify-content-center gy-3">
              <div className="col-6">
                <a href="https://api.whatsapp.com/send?phone=2604237530&text=¡Hola Inmobiliaria SyS👋! Estuve viendo su pagina web y quiero vender mi propiedad" className="link-underline-opacity-0 link-light">
                  <div className="card bg-rosa" data-aos="fade-up">
                    <div className="altura d-flex flex-column align-items-center justify-content-center">
                      <i className="bi bi-cash-coin fs-1 text-white"></i>
                      <h3 className="text-white text-bebas">Quiero venderla</h3>
                    </div>
                  </div>
                </a>
              </div>
              <div className="col-6">
                <a href="https://api.whatsapp.com/send?phone=2604345281&text=¡Hola Inmobiliaria SyS👋! Estuve viendo su pagina web y quiero tasar mi propiedad" className="link-underline-opacity-0 link-light">
                  <div className="card bg-black" data-aos="fade-up">
                    <div className="altura d-flex flex-column align-items-center justify-content-center">
                      <i className="bi bi-pencil-square fs-1 text-white"></i>
                      <h3 className="text-white text-bebas">Quiero tasarla</h3>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* NOSOTROS */}
        <section id="nosotros" className="d-flex align-items-center">
          <div className="container py-3">
            <h3 className="text-bebas text-center tamano2" data-aos="fade-up">
              Nosotros
            </h3>

            <div className="row justify-content-center align-items-center gy-3">
              <div className="col-12 col-lg-6" data-aos="fade-up">
                <img src="/assets/oficina" alt="imagen" className="w-100" />
              </div>

              <div className="col-12 col-lg-6 py-3" data-aos="fade-up">
                <p>
                  Nuestra historia comienza en el año 2003, cuando dos amigos apasionados
                  por el mundo inmobiliario, Carlos Sacon y Fabricio Signes, decidieron
                  emprender un camino juntos. Carlos, con su matrícula profesional, y
                  Fabricio, con su experiencia en ventas, comenzaron a trabajar en una
                  empresa del sector, donde adquirieron valiosos conocimientos y forjaron
                  una sólida amistad.
                </p>

                <p>
                  En 2017, decidieron dar un paso más y abrir su propia oficina comercial
                  en San Rafael, Mendoza. Así nació S y S Inmobiliaria, una empresa joven
                  pero con una visión clara: ofrecer un servicio inmobiliario de calidad,
                  adaptado a las necesidades de cada cliente y basado en la confianza y la
                  transparencia.
                </p>

                <div className="d-flex gap-2 py-2" >
                  <div className="col-6" data-aos="fade-up">
                    <div className="rounded py-3 h-100 bg-body-secondary">
                      <div className="d-flex flex-column align-items-center justify-content-center gap-3 h-100">
                        <img
                          src="/assets/Carlos.jpg"
                          alt="Carlos Sacon"
                          className="w-50 h-100 circulo text-center rounded"
                        />
                        <div className="d-flex flex-column justify-content-center">
                          <h3 className="text-center text-bebas mb-0">Carlos Sacon</h3>
                          <p className="text-center">Corredor Inmobiliario</p>
                          <a
                            href="https://api.whatsapp.com/send?phone=2604345281&text=¡Hola Carlos👋! Estuve viendo su pagina web y necesito hacer la siguiente consulta: "
                            className="link-underline-opacity-0 link-light"
                          >
                            <button className="btn bg-rosa text-white">
                              <i className="bi bi-whatsapp"></i> Enviar Whatsapp
                            </button>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-6" data-aos="fade-up">
                    <div className="rounded py-3 h-100 bg-body-secondary">
                      <div className="d-flex flex-column align-items-center justify-content-center gap-3 h-100">
                        <img
                          src="/assets/Fabricio.jpg"
                          alt="Fabricio Signes"
                          className="w-50 h-100 text-center rounded"
                        />
                        <div className="d-flex flex-column justify-content-center">
                          <h3 className="text-center text-bebas mb-0">Fabricio Signes</h3>
                          <p className="text-center">Asesor de ventas</p>
                          <a
                            href="https://api.whatsapp.com/send?phone=2604237530&text=¡Hola Fabricio👋! Estuve viendo su pagina web y necesito hacer la siguiente consulta: "
                            className="link-underline-opacity-0 link-light"
                          >
                            <button className="btn bg-rosa text-white">
                              <i className="bi bi-whatsapp"></i> Enviar Whatsapp
                            </button>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            <div className="container my-4">

              {/* BOTÓN */}
              <div className="text-center mb-3">
                <button
                  id="btnEquipo"
                  className="btn bg-rosa text-white px-4 py-2 fw-bold"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#equipoCollapse"
                  aria-expanded="false"
                  aria-controls="equipoCollapse"
                  onClick={(e) => {
                    e.currentTarget.disabled = true
                    e.currentTarget.innerText = "Equipo Cargado"
                  }} 
                >
                  Conocé a nuestro equipo
                </button>
              </div>

              {/* DESPLEGABLE */}
              <div className="collapse" id="equipoCollapse">
                <div className="row justify-content-center align-items-center gy-3">

                  {/* Leonel */}
                  <div className="col-6 col-lg-2" data-aos="fade-up">
                    <div className="rounded py-3 h-100 bg-body-secondary d-flex flex-column">
                      <div className="d-flex flex-column align-items-center justify-content-between gap-3 h-100">

                        <div className="d-flex justify-content-center" style={{ height: 120 }}>
                          <img
                            src="/assets/Leonel.jpg"
                            alt="Leonel Bernardeau"
                            className="w-100 h-100 rounded object-fit-cover"
                            style={{ maxWidth: 120 }}
                            loading="lazy"
                          />
                        </div>

                        <div className="d-flex flex-column justify-content-center text-center">
                          <h3 className="text-bebas mb-0">Leonel Bernardeau</h3>
                          <p className="mb-2">Asesor de ventas</p>
                        </div>

                        <a
                          href="https://api.whatsapp.com/send?phone=2604594195&text=¡Hola Leonel👋! Estuve viendo su pagina web y necesito hacer la siguiente consulta: "
                          className="link-underline-opacity-0 link-light mt-auto d-flex"
                        >
                          <button className="btn bg-rosa text-white w-100">
                            <i className="bi bi-whatsapp"></i> Enviar Whatsapp
                          </button>
                        </a>

                      </div>
                    </div>
                  </div>

                  {/* Nahuel */}
                  <div className="col-6 col-lg-2" data-aos="fade-up">
                    <div className="rounded py-3 h-100 bg-body-secondary d-flex flex-column">
                      <div className="d-flex flex-column align-items-center justify-content-between gap-3 h-100">

                        <div className="d-flex justify-content-center" style={{ height: 120 }}>
                          <img
                            src="/assets/Nahuel.jpg"
                            alt="Nahuel Barroso"
                            className="w-100 h-100 rounded object-fit-cover"
                            style={{ maxWidth: 120 }}
                            loading="lazy"
                          />
                        </div>

                        <div className="d-flex flex-column justify-content-center text-center">
                          <h3 className="text-bebas mb-0">Nahuel Barroso</h3>
                          <p className="mb-2">Asesor de ventas</p>
                        </div>

                        <a
                          href="https://api.whatsapp.com/send?phone=2604222764&text=¡Hola Nahuel👋! Estuve viendo su pagina web y necesito hacer la siguiente consulta: "
                          className="link-underline-opacity-0 link-light mt-auto d-flex"
                        >
                          <button className="btn bg-rosa text-white w-100">
                            <i className="bi bi-whatsapp"></i> Enviar Whatsapp
                          </button>
                        </a>

                      </div>
                    </div>
                  </div>

                  {/* Alfredo */}
                  <div className="col-6 col-lg-2" data-aos="fade-up">
                    <div className="rounded py-3 h-100 bg-body-secondary d-flex flex-column">
                      <div className="d-flex flex-column align-items-center justify-content-between gap-3 h-100">

                        <div className="d-flex justify-content-center" style={{ height: 120 }}>
                          <img
                            src="/assets/Alfredo.jpg"
                            alt="Alfredo Signes"
                            className="w-100 h-100 rounded object-fit-cover"
                            style={{ maxWidth: 120 }}
                            loading="lazy"
                          />
                        </div>

                        <div className="d-flex flex-column justify-content-center text-center">
                          <h3 className="text-bebas mb-0">Alfredo Signes</h3>
                          <p className="mb-2">Administración</p>
                        </div>

                        <a
                          href="https://api.whatsapp.com/send?phone=2604387319&text=¡Hola Alfredo👋! Estuve viendo su pagina web y necesito hacer la siguiente consulta: "
                          className="link-underline-opacity-0 link-light mt-auto d-flex"
                        >
                          <button className="btn bg-rosa text-white w-100">
                            <i className="bi bi-whatsapp"></i> Enviar Whatsapp
                          </button>
                        </a>

                      </div>
                    </div>
                  </div>

                  {/* Rodolfo */}
                  <div className="col-6 col-lg-2" data-aos="fade-up">
                    <div className="rounded py-3 h-100 bg-body-secondary d-flex flex-column">
                      <div className="d-flex flex-column align-items-center justify-content-between gap-3 h-100">

                        <div className="d-flex justify-content-center" style={{ height: 120 }}>
                          <img
                            src="/assets/Rodolfo.jpg"
                            alt="Rodolfo Andrade"
                            className="w-100 h-100 rounded object-fit-cover"
                            style={{ maxWidth: 120 }}
                            loading="lazy"
                          />
                        </div>

                        <div className="d-flex flex-column justify-content-center text-center">
                          <h3 className="text-bebas mb-0">Rodolfo Andrade</h3>
                          <p className="mb-2">Asesor de ventas</p>
                        </div>

                        <a
                          href="https://api.whatsapp.com/send?phone=2604331325&text=¡Hola Rodolfo👋! Estuve viendo su pagina web y necesito hacer la siguiente consulta: "
                          className="link-underline-opacity-0 link-light mt-auto d-flex"
                        >
                          <button className="btn bg-rosa text-white w-100">
                            <i className="bi bi-whatsapp"></i> Enviar Whatsapp
                          </button>
                        </a>

                      </div>
                    </div>
                  </div>

                  {/* Silvia */}
                  <div className="col-6 col-lg-2" data-aos="fade-up">
                    <div className="rounded py-3 h-100 bg-body-secondary d-flex flex-column">
                      <div className="d-flex flex-column align-items-center justify-content-between gap-3 h-100">

                        <div className="d-flex justify-content-center" style={{ height: 120 }}>
                          <img
                            src="/assets/Silvina.jpg"
                            alt="Silvia Diaz"
                            className="w-100 h-100 rounded object-fit-cover"
                            style={{ maxWidth: 120 }}
                            loading="lazy"
                          />
                        </div>

                        <div className="d-flex flex-column justify-content-center text-center">
                          <h3 className="text-bebas mb-0">Silvia Diaz</h3>
                          <p className="mb-2">Asesora de ventas</p>
                        </div>

                        <a
                          href="https://api.whatsapp.com/send?phone=2604051517&text=¡Hola Silvia👋! Estuve viendo su pagina web y necesito hacer la siguiente consulta: "
                          className="link-underline-opacity-0 link-light mt-auto d-flex"
                        >
                          <button className="btn bg-rosa text-white w-100">
                            <i className="bi bi-whatsapp"></i> Enviar Whatsapp
                          </button>
                        </a>

                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
             
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-rosa">
        <div className="container py-3">
          <div className="row">
            <article className="col-12 col-md-6 text-center">
              <button onClick={() => scrollTo("banner")} className="bg-transparent border-0">
                <img src="/assets/logo.png" alt="logo footer" className="w-50" />
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

            <article className="col-12 col-md-3 text-center text-md-start pt-4">
              <h6 className="text-white">Navegación</h6>
              <ul className="list-unstyled">
                <li><button className="btn text-white" onClick={() => scrollTo("banner")}>Inicio</button></li>
                <li><button className="btn text-white" onClick={() => scrollTo("menu-propiedades")}>Propiedades</button></li>
                <li><button className="btn text-white" onClick={() => scrollTo("servicios")}>Servicios</button></li>
                <li><button className="btn text-white" onClick={() => scrollTo("nosotros")}>Nosotros</button></li>
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

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      Swal.fire({
        icon: "warning",
        title: "Campos incompletos",
        text: "Completá usuario y contraseña",
        confirmButtonText: "Ok",
      })
      return
    }

    setLoading(true)

    try {
      await signInWithEmailAndPassword(auth, email, password)

      Swal.fire({
        icon: "success",
        title: "¡Bienvenido!",
        text: "Inicio de sesión correcto",
        timer: 1200,
        showConfirmButton: false,
      })

      setTimeout(() => {
        navigate("/admin")
      }, 1200)
    } catch (error) {
      console.error(error)

      Swal.fire({
        icon: "error",
        title: "Credenciales incorrectas",
        text: "Usuario o contraseña inválidos",
        confirmButtonText: "Reintentar",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <header>
        <nav className="navbar bg-rosa fixed-top py-3">
          <div className="container d-flex justify-content-between">
            <img
              src="/assets/logo.png"
              alt="logo"
              className="logo cursor"
              onClick={() => navigate(-1)}
            />
            <button
              className="btn btn-outline-light bg-rosa text-white fs-5"
              onClick={() => navigate(-1)}
              type="button"
            >
              ← Volver
            </button>
          </div>
        </nav>
      </header>

      <main>
        <section id="login" className="portada2 d-flex align-items-center">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 col-md-6">
                <div className="card bg-black bg-opacity-50 p-4">
                  <div className="d-flex flex-column align-items-center">
                    <img src="/assets/logo.png" className="w-25 mb-3" />

                    <form onSubmit={handleSubmit} className="w-100">
                      <div className="mb-3">
                        <label className="form-label text-rosa">Usuario</label>
                        <input
                          type="email"
                          className="form-control"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label text-rosa">Contraseña</label>
                        <input
                          type="password"
                          className="form-control"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>

                      <div className="d-flex justify-content-end">
                        <button
                          className="btn bg-rosa text-white"
                          disabled={loading}
                          type="submit"
                        >
                          {loading ? "Ingresando..." : "Ingresar"}
                        </button>
                      </div>
                    </form>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <Admin />
          </PrivateRoute>
        }
      />
      <Route path="/casas" element={<Casas />} />
      <Route path="/departamentos" element={<Departamentos />} />
      <Route path="/locales" element={<Locales />} />
      <Route path="/lotes" element={<Lotes />} />
      <Route path="/fincas" element={<Fincas />} />
      <Route path="/propiedad/:tipo/:id" element={<PropiedadDetalle />} />
    </Routes>
  );
}

