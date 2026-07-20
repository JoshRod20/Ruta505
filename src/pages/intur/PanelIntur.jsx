import { useEffect, useState } from "react";
import {
  obtenerSolicitudesPendientes,
  actualizarEstadoVerificacion,
} from "../../services/panelIntur";
import { ROLES, ACTOR_TYPES, ESTADOS_VERIFICACION } from "../../constants/roles";
import LogoutButton from "../../components/common/LogoutButton";
import "../../styles/PanelIntur.css";

// Cada pestaña sabe cómo filtrar la lista completa de pendientes.
const TABS = [
  {
    id: ACTOR_TYPES.COMUNIDAD,
    label: "Comunidad",
    matches: (u) => u.actorType === ACTOR_TYPES.COMUNIDAD,
  },
  {
    id: ACTOR_TYPES.ARTESANO,
    label: "Artesano",
    matches: (u) => u.actorType === ACTOR_TYPES.ARTESANO,
  },
  {
    id: ACTOR_TYPES.GUIA,
    label: "Guía",
    matches: (u) => u.actorType === ACTOR_TYPES.GUIA,
  },
  {
    id: ACTOR_TYPES.EMPRENDEDOR,
    label: "Emprendedor",
    matches: (u) => u.actorType === ACTOR_TYPES.EMPRENDEDOR,
  },
  {
    id: ROLES.INSTITUCION,
    label: "Institución",
    matches: (u) => u.role === ROLES.INSTITUCION,
  },
];

// Qué campos mostrar de cada solicitud, según la pestaña activa.
const CAMPOS_POR_TAB = {
  [ACTOR_TYPES.COMUNIDAD]: [
    { key: "nombreComunidad", label: "Nombre" },
    { key: "descripcion", label: "Descripción" },
    { key: "ubicacion", label: "Ubicación" },
    { key: "telefonoContacto", label: "Teléfono" },
  ],
  [ACTOR_TYPES.ARTESANO]: [
    { key: "nombreArtesano", label: "Nombre" },
    { key: "especialidad", label: "Especialidad" },
    { key: "historiaBreve", label: "Historia" },
    { key: "ubicacionTaller", label: "Ubicación del taller" },
  ],
  [ACTOR_TYPES.GUIA]: [
    { key: "nombreGuia", label: "Nombre" },
    { key: "especialidadTematica", label: "Especialidad" },
    { key: "zonaCobertura", label: "Zona de cobertura" },
    { key: "idiomasQueDomina", label: "Idiomas", isArray: true },
  ],
  [ACTOR_TYPES.EMPRENDEDOR]: [
    { key: "nombreEmprendimiento", label: "Emprendimiento" },
    { key: "tipoOferta", label: "Tipo de oferta" },
    { key: "descripcion", label: "Descripción" },
    { key: "ubicacion", label: "Ubicación" },
  ],
  [ROLES.INSTITUCION]: [
    { key: "nombreInstitucion", label: "Institución" },
    { key: "cargo", label: "Cargo" },
  ],
};

const PanelIntur = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [tabActiva, setTabActiva] = useState(TABS[0].id);
  const [procesandoId, setProcesandoId] = useState(null);

  const cargarSolicitudes = async () => {
    setCargando(true);
    setError("");
    try {
      const datos = await obtenerSolicitudesPendientes();
      setSolicitudes(datos);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar las solicitudes. Intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  const handleDecision = async (uid, nuevoEstado) => {
    setProcesandoId(uid);
    try {
      await actualizarEstadoVerificacion(uid, nuevoEstado);
      // Actualización optimista: la quitamos de la lista local
      // sin esperar a volver a consultar todo Firestore.
      setSolicitudes((prev) => prev.filter((u) => u.id !== uid));
    } catch (err) {
      console.error(err);
      setError("No se pudo actualizar la solicitud. Intenta de nuevo.");
    } finally {
      setProcesandoId(null);
    }
  };

  const tabActual = TABS.find((t) => t.id === tabActiva);
  const solicitudesTab = solicitudes.filter(tabActual.matches);
  const campos = CAMPOS_POR_TAB[tabActiva] || [];

  return (
    <div className="panel-intur-page">
      <div className="panel-intur-header">
        <h1 className="panel-intur-title">Panel de INTUR</h1>
        <LogoutButton className="panel-intur-logout" />
      </div>

      <div className="panel-intur-tabs">
        {TABS.map((tab) => {
          const cantidad = solicitudes.filter(tab.matches).length;
          return (
            <button
              key={tab.id}
              type="button"
              className={`panel-intur-tab ${
                tab.id === tabActiva ? "panel-intur-tab--activa" : ""
              }`}
              onClick={() => setTabActiva(tab.id)}
            >
              {tab.label}
              {cantidad > 0 && <span className="panel-intur-badge">{cantidad}</span>}
            </button>
          );
        })}
      </div>

      {error && <p className="panel-intur-error">{error}</p>}

      {cargando ? (
        <p className="panel-intur-mensaje">Cargando solicitudes...</p>
      ) : solicitudesTab.length === 0 ? (
        <p className="panel-intur-mensaje">
          No hay solicitudes pendientes en esta categoría.
        </p>
      ) : (
        <div className="panel-intur-lista">
          {solicitudesTab.map((usuario) => (
            <div key={usuario.id} className="panel-intur-card">
              {campos.map(({ key, label, isArray }) => (
                <p key={key} className="panel-intur-campo">
                  <strong>{label}:</strong>{" "}
                  {isArray ? (usuario[key] || []).join(", ") : usuario[key]}
                </p>
              ))}
              <p className="panel-intur-campo">
                <strong>Email:</strong> {usuario.email}
              </p>

              <div className="panel-intur-acciones">
                <button
                  type="button"
                  className="panel-intur-btn panel-intur-btn--aprobar"
                  disabled={procesandoId === usuario.id}
                  onClick={() =>
                    handleDecision(usuario.id, ESTADOS_VERIFICACION.APROBADO)
                  }
                >
                  Aprobar
                </button>
                <button
                  type="button"
                  className="panel-intur-btn panel-intur-btn--rechazar"
                  disabled={procesandoId === usuario.id}
                  onClick={() =>
                    handleDecision(usuario.id, ESTADOS_VERIFICACION.RECHAZADO)
                  }
                >
                  Rechazar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PanelIntur;