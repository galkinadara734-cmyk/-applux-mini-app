
import React, { useEffect, useState } from "react";

export default function Admin() {
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [apps, setApps] = useState([]);
  const [appsLoading, setAppsLoading] = useState(false);
  const [appsError, setAppsError] = useState("");

  useEffect(() => {
    if (!loggedIn) return;

    let cancelled = false;

    async function loadApps() {
      setAppsLoading(true);
      setAppsError("");

      try {
        const response = await fetch("/api/admin-apps", {
          credentials: "same-origin",
          cache: "no-store"
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Ошибка загрузки каталога"
          );
        }

        if (!cancelled) {
          setApps(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!cancelled) {
          setAppsError(err.message);
        }
      } finally {
        if (!cancelled) {
          setAppsLoading(false);
        }
      }
    }

    loadApps();

    return () => {
      cancelled = true;
    };
  }, [loggedIn]);

  async function login(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Ошибка входа");
      }

      setLoggedIn(true);
      setPassword("");
    } catch (err) {
      setError(err.message || "Не удалось войти");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle = {
    width: "100%",
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid #455071",
    background: "#101525",
    color: "white",
    fontSize: "16px",
    boxSizing: "border-box"
  };

  const buttonStyle = {
    width: "100%",
    padding: "15px",
    borderRadius: "12px",
    border: "none",
    background: "#aaa8ff",
    color: "#101525",
    fontWeight: "bold",
    fontSize: "16px",
    marginTop: "16px"
  };

  return (
    <main style={{
      minHeight: "100vh",
      background: "#101525",
      color: "white",
      padding: "24px",
      fontFamily: "Arial, sans-serif",
      boxSizing: "border-box"
    }}>
      <h1>💜 Applux Admin</h1>
      <p>Панель управления каталогом приложений</p>

      <section style={{
        background: "#1c2540",
        padding: "22px",
        borderRadius: "18px",
        marginTop: "24px"
      }}>
        {!loggedIn ? (
          <>
            <h2>🔐 Вход администратора</h2>
            <p>Введите пароль для проверки доступа.</p>

            <form onSubmit={login}>
              <input
                type="password"
                placeholder="Пароль администратора"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                style={inputStyle}
              />

              <button
                type="submit"
                disabled={loading}
                style={buttonStyle}
              >
                {loading ? "Проверяем..." : "Войти"}
              </button>
            </form>

            {error && (
              <p role="alert" style={{ color: "#ffb4b4" }}>
                {error}
              </p>
            )}
          </>
        ) : (
          <>
            <h2>✅ Пароль подтверждён</h2>
            <p>Проверка пароля прошла успешно.</p>
            <p>
              Управление базой Neon подключим
              после настройки защищённой сессии.
            </p>
            
<button
  onClick={async () => {
    try {
      const response = await fetch("/api/admin-logout", {
        method: "POST",
        credentials: "same-origin"
      });

      if (!response.ok) {
        throw new Error("Ошибка выхода");
      }

      setLoggedIn(false);
      setPassword("");
      setError("");
    } catch (err) {
      setError("Не удалось завершить сеанс. Попробуй ещё раз.");
    }
  }}
  style={buttonStyle}
>
  Выйти
</button>
          </>
        )}
      </section>
    </main>
  );
}

