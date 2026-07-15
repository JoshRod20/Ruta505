import { useEffect, useState } from "react";
import logo from "../../assets/images/logo-principal.png";

const SplashScreen = ({ onFinish, minDuration = 2400 }) => {
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const leaveTimer = setTimeout(() => setIsLeaving(true), minDuration - 400);
    const finishTimer = setTimeout(() => onFinish?.(), minDuration);
    return () => {
      clearTimeout(leaveTimer);
      clearTimeout(finishTimer);
    };
  }, [minDuration, onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white transition-opacity duration-400 ${
        isLeaving ? "opacity-0" : "opacity-100"
      }`}
      style={{
        backgroundImage:
          "radial-gradient(circle at 1px 1px, rgba(11,110,54,0.08) 1px, transparent 0)",
        backgroundSize: "24px 24px",
      }}
    >
      <img
        src={logo}
        alt="Ruta 505"
        className="w-40 sm:w-48 animate-ruta-pop"
      />
      {/* 
      <p className="mt-4 font-display italic text-ruta-forest/80 text-lg tracking-wide animate-ruta-fade-up">
        Descubre la Cultura junto a Pinolito
      </p> 
      */}
      

      <div className="mt-10 flex items-center gap-2.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <span
            key={i}
            className="w-2.5 h-2.5 rounded-full bg-ruta-leaf"
            style={{ animation: `ruta-trail 1.3s ease-in-out ${i * 0.12}s infinite` }}
          />
        ))}
      </div>

      <span className="sr-only" role="status">
        Cargando Ruta 505…
      </span>
    </div>
  );
};

export default SplashScreen;