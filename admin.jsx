
import React from "react";

export default function Admin() {
  return (
    <main style={{
      minHeight: "100vh",
      background: "#101525",
      color: "#ffffff",
      padding: "24px",
      fontFamily: "Arial, sans-serif"
    }}>
      <h1>💜 Applux Admin</h1>
      <p>Панель управления каталогом приложений</p>

      <section style={{
        background: "#1c2540",
        padding: "20px",
        borderRadius: "16px",
        marginTop: "24px"
      }}>
        <h2>Управление приложениями</h2>
        <p>Здесь появятся добавление, редактирование и удаление приложений.</p>
        <p>Подключение к Neon и защищённый вход — следующий этап.</p>
      </section>
    </main>
  );
}
