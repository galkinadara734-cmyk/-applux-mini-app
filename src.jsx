import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

const apps = [
  { id: 1, name: "Telegram", category: "Общение", emoji: "✈️", description: "Мессенджер для переписки, каналов и групп.", price: 0, source: "https://apps.apple.com/app/telegram-messenger/id686449807" },
  { id: 2, name: "WhatsApp Messenger", category: "Общение", emoji: "💬", description: "Сообщения и звонки через интернет.", price: 0, source: "https://apps.apple.com/app/whatsapp-messenger/id310633997" },
  { id: 3, name: "Google Maps", category: "Полезное", emoji: "🗺️", description: "Карты, маршруты и поиск мест.", price: 0, source: "https://apps.apple.com/app/google-maps/id585027354" },
  { id: 4, name: "Spotify", category: "Музыка", emoji: "🎵", description: "Музыка и подкасты. Доступность зависит от региона.", price: 0, source: "https://apps.apple.com/app/spotify-music/id324684580" },
  { id: 5, name: "Canva", category: "Творчество", emoji: "🎨", description: "Создание дизайнов, сторис и презентаций.", price: 0, source: "https://apps.apple.com/app/canva-design-photo-video/id897446215" },
  { id: 6, name: "Duolingo", category: "Обучение", emoji: "🦉", description: "Короткие уроки для изучения языков.", price: 0, source: "https://apps.apple.com/app/duolingo-language-lessons/id570060128" }
];
const categories = ["Все", ...new Set(apps.map(a => a.category))];

function App() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Все");
  const [cart, setCart] = useState([]);
  const [page, setPage] = useState("catalog");
  const [notice, setNotice] = useState("");
  const filtered = useMemo(() => apps.filter(a =>
    (category === "Все" || a.category === category) &&
    (a.name + " " + a.description + " " + a.category).toLowerCase().includes(query.toLowerCase())
  ), [query, category]);
  const add = (id) => { setCart(old => old.includes(id) ? old : [...old, id]); setNotice("Добавлено в корзину"); setTimeout(() => setNotice(""), 1800); };
  const remove = (id) => setCart(old => old.filter(x => x !== id));
  const selected = apps.filter(a => cart.includes(a.id));

  return <div className="app-shell">
    <header className="top">
      <div className="brand-icon">A</div>
      <div><div className="brand">Applux</div><div className="tagline">Каталог приложений для iPhone</div></div>
      <button className="cart-chip" onClick={() => setPage("cart")}>🛒 <span>{cart.length}</span></button>
    </header>
    <main>
      {page === "catalog" ? <>
        <section className="hero">
          <div className="eyebrow">ТВОЙ КАТАЛОГ</div>
          <h1>Нужное приложение.<br/><span>В одном месте.</span></h1>
          <p>Находи приложения и переходи к официальным источникам установки.</p>
        </section>
        <label className="search"><span>⌕</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Поиск приложений..." /></label>
        <div className="section-head"><h2>Категории</h2><span>{filtered.length} прилож.</span></div>
        <div className="categories">{categories.map(c => <button key={c} className={category === c ? "category active" : "category"} onClick={() => setCategory(c)}>{c}</button>)}</div>
        <div className="section-head"><h2>Каталог</h2><span>Официальные ссылки</span></div>
        <div className="cards">{filtered.map(a => <article className="app-card" key={a.id}>
          <div className="app-emoji">{a.emoji}</div>
          <div className="app-info"><h3>{a.name}</h3><div className="app-category">{a.category}</div><p>{a.description}</p>
            <div className="actions"><a className="source-btn" href={a.source} target="_blank" rel="noreferrer">App Store ↗</a><button className={cart.includes(a.id) ? "add-btn added" : "add-btn"} onClick={() => cart.includes(a.id) ? remove(a.id) : add(a.id)}>{cart.includes(a.id) ? "✓ В корзине" : "+ В корзину"}</button></div>
          </div>
        </article>)}
        {filtered.length === 0 && <div className="empty">Ничего не найдено. Попробуй другой запрос.</div>}</div>
      </> : <section className="cart-page">
        <button className="back" onClick={() => setPage("catalog")}>← Назад в каталог</button>
        <h1>Корзина</h1><p className="muted">Список выбранных приложений и полезных ссылок.</p>
        {selected.length ? selected.map(a => <div className="cart-row" key={a.id}><span className="cart-emoji">{a.emoji}</span><div className="cart-name"><b>{a.name}</b><small>{a.category} · Бесплатный каталог</small></div><button className="remove" onClick={() => remove(a.id)}>Убрать</button></div>) : <div className="empty">Корзина пока пуста. Добавь приложения из каталога.</div>}
        {selected.length > 0 && <button className="primary wide" onClick={() => {setNotice("Это демонстрационный каталог. Оплата и оформление заказов пока не подключены.");}}>Продолжить</button>}
        <p className="fineprint">На этом этапе корзина сохраняется только во время открытой сессии. Оплата и отправка заказов пока не подключены.</p>
        {notice && <div className="toast">{notice}</div>}
      </section>}
    </main>
    <nav className="bottom-nav">
      <button className={page === "catalog" ? "nav-item selected" : "nav-item"} onClick={() => setPage("catalog")}><span>⌂</span>Каталог</button>
      <button className={page === "cart" ? "nav-item selected" : "nav-item"} onClick={() => setPage("cart")}><span>🛒</span>Корзина {cart.length ? `(${cart.length})` : ""}</button>
      <button className="nav-item" onClick={() => setNotice("Поддержка будет подключена на следующем этапе.")}><span>ⓘ</span>Помощь</button>
    </nav>
    {notice && page === "catalog" && <div className="toast">{notice}</div>}
    <footer>Applux · Демоверсия · Ссылки ведут в App Store</footer>
  </div>;
}
createRoot(document.getElementById("root")).render(<App />);
