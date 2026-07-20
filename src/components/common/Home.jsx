import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";
import { useAuth } from "../../context/AuthContext";
import { ROLES, ESTADOS_VERIFICACION } from "../../constants/roles";

const Home = () => {
  const { role, estadoVerificacion } = useAuth();

  const esInstitucionAprobada =
    role === ROLES.INSTITUCION && estadoVerificacion === ESTADOS_VERIFICACION.APROBADO;

  return (
    <div className="min-h-screen bg-ruta-cream flex items-center justify-center px-6 text-center">
      <div>
        <h1 className="font-display text-3xl text-ruta-forest font-bold mb-2">
          ¡Ya estás dentro!
        </h1>
        <p className="font-body text-ruta-ink/70">
          Aquí vivirá el Home real de Ruta 505 (explorar, mapa, Pinolito...).
        </p>

        {esInstitucionAprobada && (
          <Link to="/panel-intur" className="block mt-4 font-body underline text-ruta-forest">
            Ir al panel de INTUR
          </Link>
        )}

        <LogoutButton />
      </div>
    </div>
  );
};

export default Home;