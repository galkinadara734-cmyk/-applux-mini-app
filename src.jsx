import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

const apps = [
  { id: 1, name: "СберБанк", category: "Банки", emoji: "🟢", description: "Банковские сервисы. Наличие приложения для iPhone и официальный способ получения необходимо уточнить у банка.", source: "https://www.sberbank.ru/", status: "Проверить способ установки" },
  { id: 2, name: "Т-Банк", category: "Банки", emoji: "💛", description: "Банковские услуги и управление счетами. Уточни актуальный вариант для iPhone на официальном сайте.", source: "https://www.tbank.ru/", status: "Проверить способ установки" },
  { id: 3, name: "ВТБ", category: "Банки", emoji: "🔵", description: "Банковские операции. Официальные варианты доступа для iPhone уточняются у банка.", source: "https://www.vtb.ru/", status: "Проверить способ установки" },
  { id: 4, name: "Альфа-Банк", category: "Банки", emoji: "🅰️", description: "Банковские продукты и платежи. Проверь актуальные инструкции на сайте банка.", source: "https://alfabank.ru/", status: "Проверить способ установки" },
  { id: 5, name: "Газпромбанк", category: "Банки", emoji: "🏦", description: "Банковские сервисы. Доступность приложения зависит от актуальных способов распространения.", source: "https://www.gazprombank.ru/", status: "Проверить способ установки" },
  { id: 6, name: "ПСБ", category: "Банки", emoji: "💼", description: "Банковские услуги. Официальный способ использования на iPhone нужно уточнить.", source: "https://www.psbank.ru/", status: "Проверить способ установки" },
  { id: 7, name: "Россельхозбанк", category: "Банки", emoji: "🌾", description: "Банковские услуги. Уточняй официальные варианты доступа для iPhone.", source: "https://www.rshb.ru/", status: "Проверить способ установки" },
  { id: 8, name: "Совкомбанк", category: "Банки", emoji: "💳", description: "Банковские сервисы. Ссылка ведёт на официальный сайт для проверки вариантов доступа.", source: "https://sovcombank.ru/", status: "Проверить способ установки" },
  { id: 9, name: "Telegram", category: "Общение", emoji: "✈️", description: "Мессенджер, группы и каналы.", source: "https://apps.apple.com/app/telegram-messenger/id686449807", status: "App Store" },
  { id: 10, name: "WhatsApp", category: "Общение", emoji: "💬", description: "Обмен сообщениями и звонки.", source: "https://apps.apple.com/app/whatsapp-messenger/id310633997", status: "App Store" },
  { id: 11, name: "Google Maps", category: "Навигация", emoji: "🗺️", description: "Карты и маршруты.", source: "https://apps.apple.com/app/google-maps/id585027354", status: "App Store" },
  { id: 12, name: "Spotify", category: "Музыка", emoji: "🎵", description: "Музыка и подкасты. Доступность зависит от региона.", source: "https://apps.apple.com/app/spotify-music/id324684580", status: "App Store · зависит от региона" },
  { id: 13, name: "Canva", category: "Творчество", emoji: "🎨", description: "Создание дизайнов и презентаций.", source: "https://apps.apple.com/app/canva-design-photo-video/id897446215", status: "App Store" },
  { id: 14, name: "Duolingo", category: "Обучение", emoji: "🦉", description: "Уроки иностранных языков.", source: "https://apps.apple.com/app/duolingo-language-lessons/id570060128", status: "App Store" }
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
          <p>Находи приложения для iPhone, включая те, которые сложно найти в российском App Store. Способы получения проверяй в официальных источниках.</p>
        </section>
        <label className="search"><span>⌕</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Поиск приложений..." /></label>
        <div className="section-head"><h2>Категории</h2><span>{filtered.length} прилож.</span></div>
        <div className="categories">{categories.map(c => <button key={c} className={category === c ? "category active" : "category"} onClick={() => setCategory(c)}>{c}</button>)}</div>
        <div className="section-head"><h2>Каталог</h2><span>Информация и ссылки</span></div>
        <div className="cards">{filtered.map(a => <article className="app-card" key={a.id}>
          <div className="app-emoji">{a.emoji}</div>
          <div className="app-info"><h3>{a.name}</h3><div className="app-category">{a.category}</div><p>{a.description}</p><p className="app-status">Статус: {a.status}</p>
            <div className="actions"><a className="source-btn" href={a.source} target="_blank" rel="noreferrer">{a.status === "App Store" ? "App Store ↗" : "Официальный источник ↗"}</a><button className={cart.includes(a.id) ? "add-btn added" : "add-btn"} onClick={() => cart.includes(a.id) ? remove(a.id) : add(a.id)}>{cart.includes(a.id) ? "✓ В корзине" : "+ В корзину"}</button></div>
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
    <footer>Applux · Демоверсия · Проверяйте актуальность способов получения у правообладателей</footer>
  </div>;
}
createRoot(document.getElementById("root")).render(<App />);
