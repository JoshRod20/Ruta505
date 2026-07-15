import { useState } from "react";
import { useNavigate } from "react-router-dom";

import pinolito from "../../assets/images/pinolito.png";
import rama from "../../assets/images/rama-pinolito.png";
import escenaBienvenida from "../../assets/images/escena-bienvenida.png";
import catedral from "../../assets/images/catedral.png";
import bailarina from "../../assets/images/bailarina.png";
import gigantona from "../../assets/images/gigantona.png";
import nube1 from "../../assets/images/nube-1.png";
import nube2 from "../../assets/images/nube-2.png";
import flor1 from "../../assets/images/flor-1.png";
import flor2 from "../../assets/images/flor-2.png";
import sueloMarron from "../../assets/images/suelo-marron.png";
import sueloVerde from "../../assets/images/suelo-verde.png";

const SLIDES = [
  { id: "bienvenida", title: "Bienvenid@ a Ruta 505", cta: "Comenzar", ground: null },
  { id: "esencia", title: "Descubre la esencia de Nicaragua", cta: "Siguiente", ground: sueloVerde },
  { id: "comunidades", title: "Conecta con comunidades auténticas", cta: "Siguiente", ground: sueloVerde },
  { id: "experiencia", title: "Tu próxima experiencia comienza aquí", cta: "Comenzar", ground: sueloMarron },
];

// Quita el borde/anillo por defecto del navegador y pone uno propio, sutil, solo visible con teclado
const focusRing =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2";

const Onboarding = () => {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const slide = SLIDES[step];
  const isLast = step === SLIDES.length - 1;

  const finish = () => {
    localStorage.setItem("ruta505_hasVisited", "true");
    navigate("/home", { replace: true });
  };

  const handleNext = () => (isLast ? finish() : setStep((s) => s + 1));

  const renderIllustration = () => {
    switch (slide.id) {
      case "bienvenida":
        return (
          <div className="relative w-full h-full">
            <img
              src={escenaBienvenida}
              alt="Volcán y laguna de Nicaragua"
              className="absolute inset-x-0 bottom-0 w-full h-[68%] object-cover object-bottom"
            />
            <img
              src={rama}
              alt=""
              className="absolute bottom-[26%] left-1/2 -translate-x-1/2 z-10 w-[46%] max-w-[13rem]"
            />
            <img
              src={pinolito}
              alt="Pinolito"
              className="absolute bottom-[34%] left-1/2 -translate-x-1/2 z-20 w-[26%] max-w-[7rem] animate-ruta-pop"
            />
          </div>
        );
      case "esencia":
        return (
          <div className="relative w-full h-full flex items-end justify-center pb-2">
            <img
              src={catedral}
              alt="Catedral de León"
              className="max-h-full max-w-[75%] object-contain"
            />
            <img
              src={bailarina}
              alt="Bailarina de folclor"
              className="absolute bottom-[8%] right-[6%] w-[22%] max-w-[5.5rem] z-10"
            />
          </div>
        );
      case "comunidades":
        return (
          // max-h-full es la clave: por muy alta que sea la imagen, nunca empuja al título
          <div className="w-full h-full flex items-end justify-center pb-2">
            <img
              src={gigantona}
              alt="Gigantona y Enano Cabezón"
              className="max-h-full max-w-[65%] object-contain"
            />
          </div>
        );
      case "experiencia":
        return (
          // Ahora ancladas al fondo de ESTA zona, que termina justo donde empieza el pie
          <div className="relative w-full h-full">
            <img src={flor1} alt="" className="absolute bottom-0 left-0 w-[30%] max-w-[7rem]" />
            <img
              src={flor2}
              alt=""
              className="absolute bottom-0 right-0 w-[30%] max-w-[7rem] scale-x-[-1]"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-dvh w-full bg-slate-100 flex items-center justify-center">
      <div
        className="relative h-dvh w-full md:h-auto md:aspect-[9/19.5] md:w-[380px] lg:w-[420px]
                   md:max-h-[92dvh] md:rounded-[2.5rem] md:shadow-2xl overflow-hidden
                   bg-gradient-to-b from-sky-400 via-sky-300 to-sky-200"
      >
        <button
          onClick={finish}
          className={`absolute z-30 right-4 font-body text-sm text-white/85 hover:text-white transition-colors rounded ${focusRing}`}
          style={{ top: "max(1rem, env(safe-area-inset-top))" }}
        >
          Saltar
        </button>

        {/* Estructura en columna real: la zona de cielo crece, el pie se queda pegado abajo siempre */}
        <div className="flex flex-col h-full">
          {/* Zona de cielo + título + ilustración */}
          <div className="relative flex-1 min-h-0 overflow-hidden">
            <img
              src={nube1}
              alt=""
              className="absolute top-4 left-2 w-[clamp(4rem,20vw,5.5rem)] opacity-90 z-0"
            />
            <img
              src={nube2}
              alt=""
              className="absolute top-10 right-2 w-[clamp(3rem,14vw,4rem)] opacity-80 z-0"
            />

            <div className="relative z-20 pt-12 sm:pt-14 px-6 sm:px-8 text-center">
              <h1 className="font-display font-bold text-white drop-shadow-sm leading-snug text-[clamp(1.2rem,4.5vw,1.6rem)]">
                {slide.title}
              </h1>
            </div>

            <div className="absolute inset-x-0 bottom-0 top-[36%] z-10">
              {renderIllustration()}
            </div>
          </div>

          {/* Pie: dots + botón, con el color del "suelo" de fondo (o celeste si no hay suelo) */}
          <div
            className="shrink-0 flex flex-col items-center gap-3 sm:gap-4 px-6 sm:px-8 pt-5 pb-[max(1.5rem,env(safe-area-inset-bottom))]"
            style={
              slide.ground
                ? {
                    backgroundImage: `url(${slide.ground})`,
                    backgroundSize: "cover",
                    backgroundPosition: "top",
                  }
                : { backgroundColor: "#bfe3f7" }
            }
          >
            <div className="flex items-center gap-2">
              {SLIDES.map((s, i) => (
                <span
                  key={s.id}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === step ? "w-6 bg-white" : "w-2 bg-white/50"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className={`w-full max-w-xs font-display font-semibold text-white bg-ruta-sun hover:brightness-95 transition rounded-full py-3 sm:py-3.5 shadow-lg text-[clamp(0.95rem,3.2vw,1.05rem)] ${focusRing}`}
            >
              {slide.cta}
            </button>

            {isLast && (
              <button
                onClick={finish}
                className={`font-body text-sm text-white/85 hover:text-white py-1 rounded ${focusRing}`}
              >
                Ya tengo cuenta
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;