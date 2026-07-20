import { BrowserRouter, Routes, Route } from "react-router-dom";
import SplashGate from "../components/common/SplashGate";
import Onboarding from "../pages/onboarding/Onboarding";
import AuthPage from "../pages/auth/AuthPage";
import Home from "../components/common/Home";
import SeleccionarTipo from "../pages/turista/SeleccionarTipo";
import SeleccionarActor from "../pages/turista/SeleccionarActor";

import RegistroTurista from "../pages/turista/RegistroTurista";
import RegistroComunidad from "../pages/comunidad/RegistroComunidad";
import RegistroArtesano from "../pages/artesano/RegistroArtesano";
import RegistroGuia from "../pages/guia/RegistroGuia";
import RegistroEmprendedor from "../pages/emprendedor/RegistroEmprendedor";
import RegistroInstitucion from "../pages/intur/RegistroIntur";
import PanelIntur from "../pages/intur/PanelIntur";
import RequireAuth from "../routes/RequireAuth.jsx";
import RedirectIfAuthenticated from "../routes/RedirectIfAuthenticated.jsx";
import PendienteAprobacion from "../components/common/PendienteAprobacion";
import { ROLES, ESTADOS_VERIFICACION } from "../constants/roles";

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<SplashGate />} />
      <Route
        path="/onboarding"
        element={
          <RedirectIfAuthenticated>
            <Onboarding />
          </RedirectIfAuthenticated>
        }
      />
      <Route
        path="/seleccionar-tipo"
        element={
          <RedirectIfAuthenticated>
            <SeleccionarTipo />
          </RedirectIfAuthenticated>
        }
      />
      <Route
        path="/seleccionar-actor"
        element={
          <RedirectIfAuthenticated>
            <SeleccionarActor />
          </RedirectIfAuthenticated>
        }
      />

      <Route
        path="/registro/turista"
        element={
          <RedirectIfAuthenticated>
            <RegistroTurista />
          </RedirectIfAuthenticated>
        }
      />
      <Route
        path="/registro/comunidad"
        element={
          <RedirectIfAuthenticated>
            <RegistroComunidad />
          </RedirectIfAuthenticated>
        }
      />
      <Route
        path="/registro/artesano"
        element={
          <RedirectIfAuthenticated>
            <RegistroArtesano />
          </RedirectIfAuthenticated>
        }
      />
      <Route
        path="/registro/guia"
        element={
          <RedirectIfAuthenticated>
            <RegistroGuia />
          </RedirectIfAuthenticated>
        }
      />
      <Route
        path="/registro/emprendedor"
        element={
          <RedirectIfAuthenticated>
            <RegistroEmprendedor />
          </RedirectIfAuthenticated>
        }
      />
      <Route
        path="/registro/intur"
        element={
          <RedirectIfAuthenticated>
            <RegistroInstitucion />
          </RedirectIfAuthenticated>
        }
      />

      <Route
        path="/login"
        element={
          <RedirectIfAuthenticated>
            <AuthPage />
          </RedirectIfAuthenticated>
        }
      />

      <Route
        path="/pendiente-aprobacion"
        element={
          <RequireAuth roles={[ROLES.ACTOR_CULTURAL, ROLES.INSTITUCION]}>
            <PendienteAprobacion />
          </RequireAuth>
        }
      />

      <Route
        path="/panel-intur"
        element={
          <RequireAuth
            roles={[ROLES.INSTITUCION]}
            estados={[ESTADOS_VERIFICACION.APROBADO]}
          >
            <PanelIntur />
          </RequireAuth>
        }
      />

      <Route
        path="/home"
        element={
          <RequireAuth roles={[ROLES.TURISTA, ROLES.ACTOR_CULTURAL, ROLES.INSTITUCION]}>
            <Home />
          </RequireAuth>
        }
      />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;