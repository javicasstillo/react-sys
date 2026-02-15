import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AOS from "aos";
import Admin from "./pages/Admin"; // ✅ Correcto
import Casas from "./pages/Casas";
import Departamentos from "./pages/Departamentos";
import Fincas from "./pages/Fincas";
import Lotes from "./pages/Lotes";
import Locales from "./pages/Locales";

function Home() {
  useEffect(() => {
    AOS.init({ once: true });
  }, []);

  return (
    <>
      {/* HEADER */}
      <header>
        <nav className="navbar navbar-expand-lg bg-rosa fixed-top">
          <div className="container">
            <a className="navbar-brand" href="#banner">
              <img src="/assets/logo.png" alt="logo" className="logo" />
            </a>

            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <a className="nav-link text-white" href="#banner">
                    Inicio
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link text-white" href="#nosotros">
                    Nosotros
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link text-white" href="#propiedades">
                    Propiedades
                  </a>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-rosa" to="/login">
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
              <div className="col-12 col-md-6 d-flex flex-column justify-content-center align-items-center text-center text-md-start">
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
                    <h1 className="mb-0 text-white text-bebas text-center">+40</h1>
                    <h3 className="text-white text-bebas text-center">Propiedades<br />Disponibles</h3>
                  </div>
                </div>

                <p className="fs-5 text-white text-center px-2 px-md-0 d-none d-md-block">
                  Nos especializamos en propiedades ubicadas en las mejores zonas de
                  San Rafael, Mendoza. Compromiso, transparencia y acompañamiento en
                  cada operación.
                </p>
              </div>

              <div className="col-12 col-md-6">
                <div className="form">
                  <div className="card borde p-4 p-md-5 bg-black bg-opacity-50">
                    <h3 className="mb-2 text-bebas text-center tamano2 text-rosa">
                      Descubrí tu nuevo hogar
                    </h3>
                    <p className="text-white text-center mb-4">
                      ¡Contactanos para recibir la mejor oferta del mercado!
                    </p>

                    <form>
                      <div className="row g-3 mb-3">
                        <div className="col-12 col-md-6">
                          <label className="form-label text-rosa">Nombre *</label>
                          <input type="text" className="form-control" />
                        </div>
                        <div className="col-12 col-md-6">
                          <label className="form-label text-rosa">Apellido *</label>
                          <input type="text" className="form-control" />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label className="form-label text-rosa">Email *</label>
                        <input type="email" className="form-control" />
                      </div>

                      <div className="mb-4">
                        <label className="form-label text-rosa">Mensaje *</label>
                        <textarea className="form-control" rows="4" placeholder="Escribe aquí..."></textarea>
                      </div>

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
                <a href="https://api.whatsapp.com/send?phone=2604345281&text=¡Hola Inmobiliaria SyS👋! Estuve viendo su pagina web y quiero vender mi propiedad" className="link-underline-opacity-0 link-light">
                  <div className="card bg-rosa" data-aos="fade-up">
                    <div className="altura d-flex flex-column align-items-center justify-content-center">
                      <i className="bi bi-cash-coin fs-1 text-white"></i>
                      <h3 className="text-white text-bebas">Quiero venderla</h3>
                    </div>
                  </div>
                </a>
              </div>
              <div className="col-6">
                <a href="https://api.whatsapp.com/send?phone=2604237530&text=¡Hola Inmobiliaria SyS👋! Estuve viendo su pagina web y quiero tasar mi propiedad" className="link-underline-opacity-0 link-light">
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

            <div className="row justify-content-center align-items-center">
              <div className="col-12 col-md-6" data-aos="fade-up">
                <img src="/assets/oficina" alt="imagen" className="w-100" />
              </div>

              <div className="col-12 col-md-6 py-3" data-aos="fade-up">
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
            </div>
          </div>
        </section>

      </main>


      {/* FOOTER */}
<footer className="bg-rosa">
        <div className="container py-3">
          <div className="row">
            <article className="col-12 col-md-6 text-center">
              <a href="#banner">
                <img src="/assets/logo.png" alt="logo footer" className="w-50" />
              </a>
            </article>

            <article className="col-12 col-md-3 text-center text-md-start pt-4">
              <h6 className="text-white">Contacto</h6>
              <ul className="list-unstyled">
                <li><a href="#" className="link-light link-underline-opacity-0">Las Heras 181 - San Rafael</a></li>
                <li><a href="#" className="link-light link-underline-opacity-0">+54 9 260-4345281</a></li>
                <li><a href="mailto:sysemprendimientos06@gmail.com" className="link-light link-underline-opacity-0">sysemprendimientos06@gmail.com</a></li>
              </ul>
            </article>

            <article className="col-12 col-md-3 text-center text-md-start pt-4">
              <h6 className="text-white">Navegación</h6>
              <ul className="list-unstyled">
                <li><a href="#banner" className="link-light link-underline-opacity-0">Inicio</a></li>
                <li><a href="#menu-propiedades" className="link-light link-underline-opacity-0">Propiedades</a></li>
                <li><a href="#servicios" className="link-light link-underline-opacity-0">Servicios</a></li>
                <li><a href="#nosotros" className="link-light link-underline-opacity-0">Nosotros</a></li>
                <li><a href="#contacto" className="link-light link-underline-opacity-0">Contacto</a></li>
              </ul>
            </article>
          </div>

          <div className="d-flex flex-column">
            <div className="ms-auto centrado">
              <p className="text-white text-center">Seguinos en nuestras redes:</p>
            </div>

            <div className="d-flex gap-3 fs-4 ms-auto mb-3 centrado">
              <a href="https://www.instagram.com/inmobiliaria.sys/" className="link-light"><i className="bi bi-instagram"></i></a>
              <a href="https://www.facebook.com/SYSEmprendimientosInmobiliarios" className="link-light"><i className="bi bi-facebook"></i></a>
              <a href="#" className="link-light"><i className="bi bi-twitter"></i></a>
            </div>
          </div>
        </div>

        <p className="mb-0 py-3 text-center text-white">
          &copy; Inmobiliaria SyS | Todos los derechos reservados | Desarrollado por{" "}
          <a href="https://genesys.com.ar/" className="link-dark link-underline-opacity-0">Genesys</a>
        </p>
      </footer>

    </>
  );
}

function Login() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/admin");
  };

  return (
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
                      <input type="email" className="form-control" />
                    </div>

                    <div className="mb-3">
                      <label className="form-label text-rosa">Contraseña</label>
                      <input type="password" className="form-control" />
                    </div>

                    <div className="d-flex justify-content-end">
                      <button className="btn bg-rosa text-white">
                        Ingresar
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
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/casas" element={<Casas />} />
      <Route path="/departamentos" element={<Departamentos />} />
      <Route path="/locales" element={<Locales />} />
      <Route path="/lotes" element={<Lotes />} />
      <Route path="/fincas" element={<Fincas />} />
    </Routes>

  );
}
