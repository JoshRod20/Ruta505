import { BrowserRouter, Routes, Route } from "react-router-dom";
import SplashGate from "../components/common/SplashGate";
import Onboarding from "../pages/onboarding/Onboarding";
import AuthPage from "../pages/auth/AuthPage";
import Home from "../pages/turista/Home";
import SeleccionarTipo from "../pages/turista/SeleccionarTipo";
import SeleccionarActor from "../pages/turista/SeleccionarActor";

import RegistroTurista from "../pages/turista/RegistroTurista";
import RegistroComunidad from "../pages/comunidad/RegistroComunidad";
import RegistroArtesano from "../pages/artesano/RegistroArtesano";
import RegistroGuia from "../pages/guia/RegistroGuia";
import RegistroEmprendedor from "../pages/emprendedor/RegistroEmprendedor";
import RegistroInstitucion from "../pages/intur/RegistroIntur";
import RequireAuth from "../routes/RequireAuth.jsx";
import PendienteAprobacion from "../components/common/PendienteAprobacion";
import { ROLES } from "../constants/roles";

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<SplashGate />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/seleccionar-tipo" element={<SeleccionarTipo />} />
      <Route path="/seleccionar-actor" element={<SeleccionarActor />} />

      <Route path="/registro/turista" element={<RegistroTurista />} />
      <Route path="/registro/comunidad" element={<RegistroComunidad />} />
      <Route path="/registro/artesano" element={<RegistroArtesano />} />
      <Route path="/registro/guia" element={<RegistroGuia />} />
      <Route path="/registro/emprendedor" element={<RegistroEmprendedor />} />
      <Route path="/registro/intur" element={<RegistroInstitucion />} />

      <Route path="/login" element={<AuthPage />} />

      <Route
        path="/pendiente-aprobacion"
        element={
          <RequireAuth roles={[ROLES.ACTOR_CULTURAL, ROLES.INSTITUCION]}>
            <PendienteAprobacion />
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