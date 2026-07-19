import { useAuth } from "../../context/AuthContext";
import { ROLES } from "../../constants/roles";

const PendienteAprobacion = () => {
  const { profile, logout } = useAuth();

  return (
    <div className="registro-page">
      <div className="registro-shell">
        <div className="registro-header">
          <h1 className="registro-header__title">Tu cuenta está en revisión</h1>
          <p className="registro-header__subtitle">
            {profile?.role === ROLES.INSTITUCION
              ? "INTUR debe validar manualmente tu acceso institucional antes de que puedas entrar al panel."
              : "INTUR está revisando tu perfil. Te notificaremos por correo cuando sea aprobado."}
          </p>
        </div>

        <div className="registro-card">
          <p>
            Mientras tanto, puedes seguir explorando Ruta 505 como visitante,
            pero no podrás publicar contenido hasta que tu cuenta sea
            verificada.
          </p>
          <button className="registro-submit" type="button" onClick={logout}>
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default PendienteAprobacion;