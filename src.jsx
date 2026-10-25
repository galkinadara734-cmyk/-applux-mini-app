import React, { useEffect, useMemo, useState } from "react";
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
// Иконки сайтов правообладателей; это не всегда иконки iOS-приложений.
const domains = {
  1: "sberbank.ru", 2: "tbank.ru", 3: "vtb.ru", 4: "alfabank.ru",
  5: "gazprombank.ru", 6: "psbank.ru", 7: "rshb.ru", 8: "sovcombank.ru",
  9: "telegram.org", 10: "whatsapp.com", 11: "google.com", 12: "spotify.com",
  13: "canva.com", 14: "duolingo.com"
};
function AppIcon({ app, large = false }) {
  const [failed, setFailed] = React.useState(false);
  const domain = domains[app.id];
  return <div className={large ? "lux-icon lux-icon-large" : "lux-icon"}>
    {domain && !failed ? <img src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`} alt="" loading="lazy" onError={() => setFailed(true)} /> : <span>{app.emoji}</span>}
  </div>;
}
const categories = ["Все", "Нет в App Store", ...new Set(apps.map(a => a.category))];
const needsCheck = (app) => app.status !== "App Store" && !app.status.startsWith("App Store ·");
const detailsStyle = { background: "#151c30", border: "1px solid #303b5b", borderRadius: 18, padding: 18, marginBottom: 14 };
const actionStyle = { display: "inline-block", padding: "12px 16px", borderRadius: 12, background: "#aaa8ff", color: "#101326", fontWeight: 700, textDecoration: "none", border: 0, cursor: "pointer", marginRight: 8, marginTop: 8 };
const secondaryStyle = { ...actionStyle, background: "#29334e", color: "#fff" };


function App() {const [dbApps, setDbApps] = useState([]);

useEffect(() => {
  fetch("/api/apps")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Ошибка загрузки каталога");
      }
      return response.json();
    })
    .then((data) => {
      if (Array.isArray(data)) {
        setDbApps(data);
      }
    })
    .catch((error) => {
      console.error("Neon:", error);
    });
}, []);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Все");
  const [cart, setCart] = useState([]);
  const [page, setPage] = useState("catalog");
  const [activeId, setActiveId] = useState(null);
  const activeApp = apps.find(a => a.id === activeId);
  const showApp = (id) => { setActiveId(id); setPage("details"); window.scrollTo(0, 0); };
  const goCatalog = () => { setPage("catalog"); window.scrollTo(0, 0); };
  const goLimited = () => { setCategory("Нет в App Store"); setQuery(""); setPage("catalog"); window.scrollTo({top:0,behavior:"smooth"}); };
  const [notice, setNotice] = useState("");
  const filtered = useMemo(() => apps.filter(a =>
    (category === "Все" || (category === "Нет в App Store" ? needsCheck(a) : a.category === category)) &&
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
          <h1>Приложения для iPhone.<br/><span>В одном месте.</span></h1>
          <p>Находи приложения для iPhone, включая те, которые сложно найти в российском App Store. Способы получения проверяй в официальных источниках.</p>
        </section>
        <label className="search"><span>⌕</span><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Поиск приложений..." /></label>
        <div className="lux-feature" role="button" tabIndex={0} onClick={goLimited} onKeyDown={e => {if(e.key === "Enter") goLimited();}}>
          <div className="lux-feature-mark">✦</div><div><b>Нет в App Store?</b><small>Приложения с ограниченной доступностью и проверка официальных способов</small></div><span>→</span>
        </div>
        <div className="section-head"><h2>Категории</h2><span>{filtered.length} прилож.</span></div>
        <div className="categories">{categories.map(c => <button key={c} className={category === c ? "category active" : "category"} onClick={() => setCategory(c)}>{c}</button>)}</div>
        {category === "Нет в App Store" && <div className="lux-access-note"><b>Нет в App Store — проверяем доступность</b><p>В этом разделе собраны приложения, для которых доступность в российском App Store или способ установки на iPhone требуют проверки. Это не означает, что каждое из них удалено во всех регионах. Ссылки ведут на сайты правообладателей; установка не гарантируется.</p><button onClick={() => setCategory("Все")}>← Показать весь каталог</button></div>}
        <div className="section-head"><h2>{category === "Нет в App Store" ? "Особый доступ" : "Каталог"}</h2><span>Официальные источники</span></div>
        <div className="cards">{filtered.map(a => <article className="app-card" key={a.id}>
          <AppIcon app={a} />
          <div className="app-info"><h3>{a.name}</h3><div className="app-category">{a.category}</div><p>{a.description}</p><p className="app-status">{needsCheck(a) ? "● Требует проверки доступности" : "● " + a.status}</p>
            <div className="actions"><button className="source-btn" onClick={() => showApp(a.id)}>Подробнее →</button><a className="source-btn" href={a.source} target="_blank" rel="noreferrer">{a.status === "App Store" ? "App Store ↗" : "Официальный источник ↗"}</a><button className={cart.includes(a.id) ? "add-btn added" : "add-btn"} onClick={() => cart.includes(a.id) ? remove(a.id) : add(a.id)}>{cart.includes(a.id) ? "✓ В корзине" : "+ В корзину"}</button></div>
          </div>
        </article>)}
        {filtered.length === 0 && <div className="empty">Ничего не найдено. Попробуй другой запрос.</div>}</div>
      </> : page === "details" && activeApp ? <section className="cart-page">
        <button className="back" onClick={goCatalog}>← Назад в каталог</button>
        <div style={detailsStyle}>
          <AppIcon app={activeApp} large />
          <h1 style={{ marginBottom: 8 }}>{activeApp.name}</h1>
          <p className="muted">{activeApp.category} · iPhone</p>
          <p>{activeApp.description}</p>
          <p className="app-status">{needsCheck(activeApp) ? "Доступность и способ установки требуют проверки" : activeApp.status}</p>
        </div>
        <div style={detailsStyle}>
          <h2>Как получить приложение</h2>
          {needsCheck(activeApp) ? <>
            <p>1. Открой официальный сайт разработчика или банка.</p>
            <p>2. Найди актуальную инструкцию для iPhone и проверь совместимость с твоей версией iOS.</p>
            <p>3. Используй только подтверждённый правообладателем способ. Если приложения нет в App Store, возможность установки не гарантируется.</p>
          </> : <>
            <p>1. Перейди по ссылке App Store.</p>
            <p>2. Проверь доступность в своём регионе и совместимость с iPhone.</p>
            <p>3. Установи приложение обычным способом, если оно доступно.</p>
          </>}
          <a style={actionStyle} href={activeApp.source} target="_blank" rel="noopener noreferrer">Официальный источник ↗</a>
        </div>
        <div style={detailsStyle}>
          <h2>Нужна помощь?</h2>
          <p>Открой наш Telegram-бот и напиши название приложения. Пока обращения обрабатываются вручную — автоматическая заявка ещё не подключена.</p>
          <a style={actionStyle} href="https://t.me/Applux63_bot" target="_blank" rel="noopener noreferrer">Открыть бот Applux ↗</a>
          <button style={secondaryStyle} onClick={() => { if (navigator.clipboard?.writeText) { navigator.clipboard.writeText("Здравствуйте! Нужна помощь с приложением: " + activeApp.name).then(() => setNotice("Текст обращения скопирован")).catch(() => setNotice("Напишите название приложения в боте")); } else { setNotice("Напишите название приложения в боте"); } }}>Скопировать текст заявки</button>
          <p className="fineprint">Не передавай пароли Apple ID, банковские пароли и коды подтверждения. Не устанавливай непроверенные профили и сертификаты.</p>
        </div>
        {notice && <div className="toast">{notice}</div>}
      </section> : <section className="cart-page">
        <button className="back" onClick={goCatalog}>← Назад в каталог</button>
        <h1>Корзина</h1><p className="muted">Список выбранных приложений и полезных ссылок.</p>
        {selected.length ? selected.map(a => <div className="cart-row" key={a.id}><AppIcon app={a} /><div className="cart-name"><b>{a.name}</b><small>{a.category} · Бесплатный каталог</small></div><button className="remove" onClick={() => remove(a.id)}>Убрать</button></div>) : <div className="empty">Корзина пока пуста. Добавь приложения из каталога.</div>}
        {selected.length > 0 && <button className="primary wide" onClick={() => {setNotice("Это демонстрационный каталог. Оплата и оформление заказов пока не подключены.");}}>Продолжить</button>}
        <p className="fineprint">На этом этапе корзина сохраняется только во время открытой сессии. Оплата и отправка заказов пока не подключены.</p>
        {notice && <div className="toast">{notice}</div>}
      </section>}
    </main>
    <nav className="bottom-nav">
      <button className={page === "catalog" ? "nav-item selected" : "nav-item"} onClick={goCatalog}><span>⌂</span>Каталог</button>
      <button className={page === "cart" ? "nav-item selected" : "nav-item"} onClick={() => setPage("cart")}><span>🛒</span>Корзина {cart.length ? `(${cart.length})` : ""}</button>
      <button className="nav-item" onClick={() => window.open("https://t.me/Applux63_bot", "_blank", "noopener,noreferrer")}><span>ⓘ</span>Помощь</button>
    </nav>
    {notice && page === "catalog" && <div className="toast">{notice}</div>}
    <footer>Applux · Демоверсия · Проверяйте актуальность способов получения у правообладателей</footer>
  </div>;
}
const luxCSS = `
/* Нижняя панель не закрывает последние карточки и кнопки на iPhone. */
.app-shell { padding-bottom: calc(116px + env(safe-area-inset-bottom, 0px)) !important; }
main { padding-bottom: 32px !important; }
.bottom-nav {
  position: fixed !important;
  bottom: calc(12px + env(safe-area-inset-bottom, 0px)) !important;
  left: 50% !important;
  transform: translateX(-50%) !important;
  width: min(480px, calc(100% - 28px)) !important;
  margin: 0 !important;
  z-index: 30;
  box-shadow: 0 12px 32px rgba(0,0,0,.45);
}
.toast { bottom: calc(102px + env(safe-area-inset-bottom, 0px)) !important; z-index: 35; }
@media (max-width: 420px) {
  .app-card { align-items: flex-start; }
  .actions { gap: 7px; }
  .source-btn, .add-btn { max-width: 100%; white-space: normal; text-align: center; }
}
.lux-icon { width: 70px; height: 70px; border-radius: 19px; flex: 0 0 70px; background: linear-gradient(140deg,#293653,#151b2f); display:flex; align-items:center; justify-content:center; overflow:hidden; border:1px solid rgba(167,178,255,.12); }
.lux-icon img { width: 51px; height: 51px; object-fit: contain; border-radius: 12px; }
.lux-icon span { font-size: 32px; }
.lux-icon-large { width: 90px; height:90px; margin-bottom: 15px; border-radius: 24px; }
.lux-icon-large img { width: 66px; height:66px; }
.lux-feature { display:flex; align-items:center; gap: 14px; padding: 17px; border-radius: 19px; background: linear-gradient(110deg,#29244c,#171e37); border:1px solid #4c467b; margin: 18px 0 26px; cursor:pointer; }
.lux-feature-mark { display:grid; place-items:center; width:48px; height:48px; border-radius:14px; background:#a9a8ff; color:#14172a; font-size:28px; flex-shrink:0; }
.lux-feature b { display:block; font-size:15px; color:#f6f6ff; }
.lux-feature small { display:block; color:#b8bed5; margin-top:4px; line-height:1.4; }
.lux-feature > span { margin-left:auto; color:#b4b3ff; font-size:24px; }
.app-card { position:relative; }
.app-status { color:#c0baff; }
.lux-access-note { border:1px solid #494477; background:linear-gradient(125deg,#242440,#171d30); border-radius:20px; padding:18px; margin:12px 0 24px; }
.lux-access-note b { color:#f4f0ff; font-size:17px; }
.lux-access-note p { color:#c2c6d9; font-size:14px; line-height:1.6; }
.lux-access-note button { background:#a9a8ff; border:0; color:#17172b; padding:11px 15px; border-radius:11px; font-weight:700; cursor:pointer; }
@media (max-width: 420px) { .lux-icon { width:60px; height:60px; flex-basis:60px; } .lux-icon img { width:44px; height:44px; } .lux-icon-large { width:90px; height:90px; } }
`;
const luxStyle = document.createElement("style"); luxStyle.textContent = luxCSS; document.head.appendChild(luxStyle);
createRoot(document.getElementById("root")).render(<App />);
