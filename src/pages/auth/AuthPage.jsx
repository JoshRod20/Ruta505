import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  FacebookAuthProvider,
  OAuthProvider,
} from "firebase/auth";
import { auth } from "../../services/firebase";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../styles/Auth.css";

const AuthPage = () => {
  const navigate = useNavigate();

  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [shareLocation, setShareLocation] = useState(false);
  const [language, setLanguage] = useState("Español");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const isLogin = mode === "login";

  const resetFeedback = () => {
    setError("");
    setFeedback("");
  };

  const switchMode = (nextMode) => {
    if (nextMode === mode) return;
    setMode(nextMode);
    resetFeedback();
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const mapFirebaseError = (code) => {
    switch (code) {
      case "auth/invalid-email":
        return "El correo electrónico no es válido.";
      case "auth/user-not-found":
      case "auth/wrong-password":
      case "auth/invalid-credential":
        return "Correo o contraseña incorrectos.";
      case "auth/email-already-in-use":
        return "Ya existe una cuenta con este correo.";
      case "auth/weak-password":
        return "La contraseña debe tener al menos 6 caracteres.";
      case "auth/popup-closed-by-user":
        return "Cerraste la ventana antes de completar el acceso.";
      default:
        return "Ocurrió un error. Inténtalo de nuevo.";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    resetFeedback();

    if (!email || !password) {
      setError("Completa tu correo y contraseña.");
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const credentials = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        if (telefono.trim()) {
          // El teléfono queda disponible aquí para guardarlo en el
          // perfil de Firestore del usuario cuando esa colección exista.
          await updateProfile(credentials.user, {
            displayName: telefono.trim(),
          });
        }
      }
      navigate("/home", { replace: true });
    } catch (err) {
      setError(mapFirebaseError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    resetFeedback();
    if (!email) {
      setError("Escribe tu correo para enviarte el enlace.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setFeedback("Te enviamos un enlace para restablecer tu contraseña.");
    } catch (err) {
      setError(mapFirebaseError(err.code));
    }
  };

  const handleSocialLogin = async (providerName) => {
    resetFeedback();
    let provider;
    if (providerName === "google") provider = new GoogleAuthProvider();
    if (providerName === "facebook") provider = new FacebookAuthProvider();
    if (providerName === "apple") provider = new OAuthProvider("apple.com");

    try {
      await signInWithPopup(auth, provider);
      navigate("/home", { replace: true });
    } catch (err) {
      setError(mapFirebaseError(err.code));
    }
  };

  const handleLocationClick = () => {
    resetFeedback();
    if (!navigator.geolocation) {
      setError("Tu navegador no soporta geolocalización.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      () => {
        setShareLocation(true);
        setFeedback("Ubicación compartida.");
      },
      () => setError("No pudimos acceder a tu ubicación.")
    );
  };

  const toggleLanguage = () =>
    setLanguage((prev) => (prev === "Español" ? "English" : "Español"));

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <div className="auth-header">
          <h1 className="auth-header__title">
            {isLogin ? "Bienvenid@ de vuelta" : "Únete a Ruta 505"}
          </h1>
          <p className="auth-header__subtitle">
            {isLogin
              ? "Inicia sesión para continuar tu ruta cultural."
              : "Crea tu cuenta y arma tu propia ruta cultural por Nicaragua."}
          </p>
        </div>

        <div className="auth-card">
          <div className="auth-toggle">
            <button
              type="button"
              onClick={() => switchMode("signup")}
              className={`auth-toggle__btn ${
                !isLogin ? "auth-toggle__btn--active" : "auth-toggle__btn--inactive"
              }`}
            >
              Registrarse
            </button>
            <button
              type="button"
              onClick={() => switchMode("login")}
              className={`auth-toggle__btn ${
                isLogin ? "auth-toggle__btn--active" : "auth-toggle__btn--inactive"
              }`}
            >
              Iniciar sesión
            </button>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              autoComplete="email"
              className="auth-input"
            />

            {isLogin ? (
              <>
                <div className="auth-input-wrap">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña"
                    autoComplete="current-password"
                    className="auth-input auth-input--password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                    }
                    className="auth-input-eye"
                  >
                    <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`} />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="auth-forgot"
                >
                  Olvidé la contraseña
                </button>
              </>
            ) : (
              <>
                <input
                  type="tel"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  placeholder="Teléfono"
                  autoComplete="tel"
                  className="auth-input"
                />
                <div className="auth-input-wrap">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña"
                    autoComplete="new-password"
                    className="auth-input auth-input--password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                    }
                    className="auth-input-eye"
                  >
                    <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`} />
                  </button>
                </div>
                <div className="auth-input-wrap">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirmar contraseña"
                    autoComplete="new-password"
                    className="auth-input auth-input--password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={
                      showConfirmPassword
                        ? "Ocultar contraseña"
                        : "Mostrar contraseña"
                    }
                    className="auth-input-eye"
                  >
                    <i
                      className={`bi ${
                        showConfirmPassword ? "bi-eye-slash" : "bi-eye"
                      }`}
                    />
                  </button>
                </div>
              </>
            )}

            {error && <p className="auth-error">{error}</p>}
            {feedback && !error && <p className="auth-feedback">{feedback}</p>}

            {!isLogin && (
              <div className="auth-location-row">
                <button
                  type="button"
                  onClick={handleLocationClick}
                  aria-label="Compartir ubicación"
                  aria-pressed={shareLocation}
                  className={`auth-location ${
                    shareLocation ? "auth-location--active" : ""
                  }`}
                >
                  <i className="bi bi-geo-alt-fill" />
                </button>
              </div>
            )}

            <button type="submit" disabled={loading} className="auth-submit">
              {loading
                ? "Un momento..."
                : isLogin
                ? "Iniciar sesión"
                : "Registrarse"}
            </button>
          </form>

          {isLogin ? (
            <>
              <div className="auth-divider">
                <span>O inicia sesión con</span>
              </div>

              <div className="auth-socials">
                <button
                  type="button"
                  onClick={() => handleSocialLogin("facebook")}
                  aria-label="Continuar con Facebook"
                  className="auth-social-btn auth-social-btn--facebook"
                >
                  <i className="bi bi-facebook" />
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialLogin("google")}
                  aria-label="Continuar con Google"
                  className="auth-social-btn auth-social-btn--google"
                >
                  <i className="bi bi-google" />
                </button>
                <button
                  type="button"
                  onClick={() => handleSocialLogin("apple")}
                  aria-label="Continuar con Apple"
                  className="auth-social-btn auth-social-btn--apple"
                >
                  <i className="bi bi-apple" />
                </button>
              </div>

              <p className="auth-switch">
                ¿No tienes cuenta?{" "}
                <button type="button" onClick={() => switchMode("signup")}>
                  Regístrate
                </button>
              </p>
            </>
          ) : (
            <button
              type="button"
              onClick={toggleLanguage}
              className="auth-language"
            >
              Idioma: {language}
            </button>
          )}

          <button
            type="button"
            onClick={() => navigate("/home")}
            className="auth-guest"
          >
            Explorar sin cuenta
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;