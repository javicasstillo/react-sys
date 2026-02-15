import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Más adelante acá validás usuario real
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
                  <img src="/assets/logo.png" alt="Logo" className="w-25 mb-3" />

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label text-rosa">Usuario:</label>
                      <input type="email" className="form-control" />
                    </div>

                    <div className="mb-3">
                      <label className="form-label text-rosa">Contraseña:</label>
                      <input type="password" className="form-control" />
                    </div>

                    <div className="d-flex py-3 justify-content-end">
                      <button type="submit" className="btn bg-rosa text-white">
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

export default Login;
