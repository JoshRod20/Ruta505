import { BrowserRouter, Routes, Route } from "react-router-dom";
import SplashGate from "../components/common/SplashGate";
import Onboarding from "../pages/onboarding/Onboarding";
import Home from "../pages/turista/Home";

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<SplashGate />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;