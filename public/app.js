/* D'Ferraro — comportamento da página */
(function () {
  "use strict";
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const MENU = window.DF_MENU || { categories: [], wines: [], executivo: { pratos: [] } };
  const REVIEWS = window.DF_REVIEWS || { items: [] };
  const WA = "https://wa.me/5511989040476";
  const RESERVA = "https://dguests.com/reserva_mesa/Dferraro";

  const slug = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  /* ---------- Abertura ---------- */
  const loader = $("#loader");
  function finishLoader() {
    if (!loader || loader.classList.contains("done")) return;
    loader.classList.add("done");
    document.body.classList.remove("lock");
    setTimeout(() => loader.remove(), 1200);
  }
  document.body.classList.add("lock");
  let seen = false;
  try { seen = sessionStorage.getItem("df-intro") === "1"; sessionStorage.setItem("df-intro", "1"); } catch (_) {}
  if (seen && loader) loader.classList.add("quick");
  const minShow = reduced ? 300 : seen ? 900 : 2500;
  const start = performance.now();
  window.addEventListener("load", () => {
    const wait = Math.max(0, minShow - (performance.now() - start));
    setTimeout(finishLoader, wait);
  });
  setTimeout(finishLoader, 4500); // nunca prende a página

  /* ---------- Vídeos: fonte leve no celular, sem autoplay se o visitante pediu menos movimento ---------- */
  const smallScreen = window.matchMedia("(max-width: 700px)").matches;
  const saveData = navigator.connection && navigator.connection.saveData;
  $$("video[data-src]").forEach((v) => {
    if (reduced || saveData) { v.removeAttribute("autoplay"); return; }
    const src = smallScreen && v.dataset.srcM ? v.dataset.srcM : v.dataset.src;
    const load = () => { if (v.src) return; v.src = src; v.load(); v.play().catch(() => {}); };
    if (v.classList.contains("hero-video")) load();
    else if ("IntersectionObserver" in window) { const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { load(); io.disconnect(); } }), { rootMargin: "300px" }); io.observe(v); }
    else load();
  });

  /* ---------- Navegação ---------- */
  const nav = $("#nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const burger = $("#burger"), mobile = $("#menu-mobile");
  function toggleMobile(open) {
    const isOpen = open ?? mobile.hidden;
    burger.setAttribute("aria-expanded", String(isOpen));
    if (isOpen) { mobile.hidden = false; requestAnimationFrame(() => mobile.classList.add("open")); document.body.classList.add("lock"); }
    else { mobile.classList.remove("open"); document.body.classList.remove("lock"); setTimeout(() => { mobile.hidden = true; }, 400); }
  }
  burger.addEventListener("click", () => toggleMobile());
  $$("a", mobile).forEach((a) => a.addEventListener("click", () => toggleMobile(false)));

  // seção ativa no menu
  const sectionLinks = $$(".nav-links a");
  const sections = sectionLinks.map((a) => $(a.getAttribute("href"))).filter(Boolean);
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        sectionLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
      });
    }, { rootMargin: "-40% 0px -55% 0px" });
    sections.forEach((s) => io.observe(s));
  }

  /* ---------- Horários ---------- */
  // intervalos por dia da semana (0 = domingo)
  const HOURS = {
    1: [[7, 0, 9, 0], [11, 30, 16, 0]],
    2: [[7, 0, 9, 0], [11, 30, 16, 0]],
    3: [[7, 0, 9, 0], [11, 30, 22, 0]],
    4: [[7, 0, 9, 0], [11, 30, 22, 0]],
    5: [[7, 0, 9, 0], [11, 30, 22, 0]],
  };
  const DAYS = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
  const fmt = (h, m) => m ? `${h}h${String(m).padStart(2, "0")}` : `${h}h`;
  function nowSP() {
    // horário de São Paulo (UTC-3), independente do fuso do visitante
    const d = new Date();
    const utc = d.getTime() + d.getTimezoneOffset() * 60000;
    return new Date(utc - 3 * 3600000);
  }
  function status() {
    const d = nowSP(); const day = d.getDay(); const mins = d.getHours() * 60 + d.getMinutes();
    const today = HOURS[day] || [];
    for (const [h1, m1, h2, m2] of today) {
      const a = h1 * 60 + m1, b = h2 * 60 + m2;
      if (mins >= a && mins < b) return { open: true, text: `Aberto agora, até as ${fmt(h2, m2)}` };
    }
    const next = today.find(([h1, m1]) => mins < h1 * 60 + m1);
    if (next) return { open: false, text: `Fechado agora, abre hoje às ${fmt(next[0], next[1])}` };
    for (let i = 1; i <= 7; i++) {
      const nd = (day + i) % 7;
      if (HOURS[nd]) { const [h1, m1] = HOURS[nd][0]; return { open: false, text: `Fechado agora, abre ${i === 1 ? "amanhã" : DAYS[nd]} às ${fmt(h1, m1)}` }; }
    }
    return { open: false, text: "Fechado" };
  }
  function paintStatus() {
    const s = status();
    [$("#hero-status"), $("#hours-status")].forEach((el) => { if (!el) return; el.textContent = s.text; el.classList.toggle("closed", !s.open); });
    const day = nowSP().getDay();
    const rows = $$(".hours-table tr");
    rows.forEach((r) => r.classList.remove("today"));
    if (day === 1 || day === 2) rows[0].classList.add("today");
    else if (day >= 3 && day <= 5) rows[1].classList.add("today");
    else rows[2].classList.add("today");
  }
  paintStatus(); setInterval(paintStatus, 60000);

  /* ---------- Cardápio ---------- */
  const catNav = $("#cat-nav"), body = $("#menu-body");
  const allItems = []; // índice para o concierge
  function dishHTML(item, prefix, catName) {
    const id = `prato-${prefix ? prefix + "-" : ""}${slug(item.name)}`;
    allItems.push({ id, name: item.name, desc: item.desc || "", price: item.price || "", cat: catName, exec: !!prefix, img: item.img });
    const marks = [];
    if (item.signature) marks.push('<span class="mark" title="Assinatura da casa">✦</span>');
    const tags = [];
    if (item.vegan) tags.push("vegano");
    if (item.house) tags.push("criação da casa");
    return `<article class="dish" id="${id}"${item.img ? ` data-img="${esc(item.img)}"` : ""}>
      <div class="dish-row"><h4 class="dish-name">${marks.join("")}${esc(item.name)}</h4><span class="dish-leader" aria-hidden="true"></span>${item.price ? `<span class="dish-price">${esc(item.price)}</span>` : ""}</div>
      ${item.desc ? `<p class="dish-desc">${esc(item.desc)}</p>` : ""}
      ${tags.length ? `<span class="dish-tag">${tags.join(", ")}</span>` : ""}
    </article>`;
  }
  function renderMenu() {
    const ex = MENU.executivo;
    let html = `<section class="menu-cat" id="cat-executivo">
      <div class="menu-cat-head"><h3>Menu executivo</h3><div><p>Entrada do dia, prato principal e sobremesa do dia <span class="exec-price">${esc(ex.price)}</span></p><p class="exec-note">${esc(ex.when)}</p></div></div>
      <div class="dishes">${ex.pratos.map((p) => dishHTML(p, "executivo", "Menu executivo")).join("")}</div>
    </section>`;
    html += MENU.categories.map((c) => `<section class="menu-cat" id="cat-${c.id}">
      <div class="menu-cat-head"><h3>${esc(c.name)}</h3>${c.lead ? `<p>${esc(c.lead)}</p>` : ""}</div>
      <div class="dishes">${c.items.map((i) => dishHTML(i, "", c.name)).join("")}</div>
    </section>`).join("");
    body.innerHTML = html;
    catNav.innerHTML = [`<a href="#cat-executivo">Executivo</a>`].concat(MENU.categories.map((c) => `<a href="#cat-${c.id}">${esc(c.name)}</a>`)).join("");
    // navegação ativa
    const links = $$("a", catNav);
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id)); const act = $("a.active", catNav); if (act) act.scrollIntoView({ block: "nearest", inline: "center", behavior: reduced ? "auto" : "smooth" }); } });
      }, { rootMargin: "-30% 0px -60% 0px" });
      $$(".menu-cat", body).forEach((s) => io.observe(s));
    }
  }
  renderMenu();

  // destaque ao chegar por âncora (#prato-…)
  function flash(id) {
    const el = document.getElementById(id);
    if (!el) return false;
    el.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
    el.classList.remove("flash"); void el.offsetWidth; el.classList.add("flash");
    setTimeout(() => el.classList.remove("flash"), 2600);
    return true;
  }
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#prato-"], a[href^="#vinho-"]');
    if (!a) return;
    const id = a.getAttribute("href").slice(1);
    if (flash(id)) { e.preventDefault(); history.replaceState(null, "", "#" + id); }
  });
  if (/^#(prato|vinho)-/.test(location.hash)) setTimeout(() => flash(location.hash.slice(1)), 600);

  // foto do prato ao passar o mouse
  const preview = $("#dish-preview"), previewImg = $("img", preview);
  let previewOn = false;
  body.addEventListener("mouseover", (e) => {
    const d = e.target.closest(".dish[data-img]");
    if (!d || window.matchMedia("(hover: none)").matches) return;
    previewImg.src = `/assets/img/${d.dataset.img}-m.webp?b=2`;
    previewOn = true; preview.classList.add("show");
  });
  body.addEventListener("mouseout", (e) => { if (e.target.closest(".dish[data-img]") && !e.relatedTarget?.closest?.(".dish[data-img]")) { previewOn = false; preview.classList.remove("show"); } });
  document.addEventListener("mousemove", (e) => {
    if (!previewOn) return;
    const w = 230, pad = 18;
    let x = e.clientX + pad, y = e.clientY - w / 2;
    if (x + w > window.innerWidth - 10) x = e.clientX - w - pad;
    y = Math.max(10, Math.min(window.innerHeight - w - 10, y));
    preview.style.transform = `translate(${x}px, ${y}px)`;
    preview.style.left = "0"; preview.style.top = "0";
  });

  /* ---------- Vinhos ---------- */
  const wineBody = $("#wine-body");
  const allWines = [];
  function renderWines() {
    const groups = MENU.wines;
    const baseGroups = new Set(["Espumantes", "Rosés", "Brancos", "Em taça", "Meia garrafa · 375 ml"]);
    wineBody.innerHTML = groups.map((g) => `<div class="wine-group${baseGroups.has(g.group) ? "" : " extra"}">
      <h3>${esc(g.group)}</h3>
      ${g.items.map((w) => { const id = "vinho-" + slug(w.name); allWines.push({ id, name: w.name, desc: w.desc, price: w.price, cat: g.group, origin: w.origin }); return `<article class="wine" id="${id}">
        <div class="wine-row"><h4 class="wine-name">${esc(w.name)}</h4><span class="dish-leader" aria-hidden="true"></span><span class="dish-price">${esc(w.price)}</span></div>
        <p class="wine-origin">${esc(w.origin)}</p>
        ${w.desc ? `<p class="wine-desc">${esc(w.desc)}</p>` : ""}
      </article>`; }).join("")}
    </div>`).join("") + `<button type="button" class="wine-more" id="wine-more">Mostrar todos os tintos</button>`;
    wineBody.classList.add("collapsed");
    $("#wine-more").addEventListener("click", (e) => {
      const collapsed = wineBody.classList.toggle("collapsed");
      e.currentTarget.textContent = collapsed ? "Mostrar todos os tintos" : "Mostrar menos";
      if (collapsed) $("#vinhos").scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    });
  }
  renderWines();
  // se o link for de um vinho oculto, expande antes
  const origFlash = flash;
  flash = function (id) {
    const el = document.getElementById(id);
    if (el && el.closest(".wine-group.extra") && wineBody.classList.contains("collapsed")) { wineBody.classList.remove("collapsed"); $("#wine-more").textContent = "Mostrar menos"; }
    return origFlash(id);
  };

  /* ---------- Avaliações ---------- */
  const quotes = $("#quotes");
  quotes.innerHTML = REVIEWS.items.map((r) => `<blockquote class="quote"><p>${esc(r.text)}</p><footer>${esc(r.author)}, no Google, ${esc(r.when)}</footer></blockquote>`).join("");
  $("#review-write").href = REVIEWS.writeUrl; $("#review-read").href = REVIEWS.readUrl; $("#review-dguests").href = REVIEWS.dguestsUrl;
  const step = () => (quotes.querySelector(".quote")?.getBoundingClientRect().width || 400) + 40;
  $("#q-prev").addEventListener("click", () => quotes.scrollBy({ left: -step(), behavior: reduced ? "auto" : "smooth" }));
  $("#q-next").addEventListener("click", () => quotes.scrollBy({ left: step(), behavior: reduced ? "auto" : "smooth" }));

  /* ---------- Revelações ---------- */
  if ("IntersectionObserver" in window && !reduced) {
    const io = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .2 });
    $$(".reveal, .timeline").forEach((el) => io.observe(el));
  } else { $$(".reveal, .timeline").forEach((el) => el.classList.add("in")); }

  /* ---------- Concierge ---------- */
  const cBtn = $("#concierge-btn"), cPanel = $("#concierge-panel"), cClose = $("#concierge-close"), log = $("#concierge-log"), form = $("#concierge-form"), input = $("#concierge-input");
  let greeted = false;
  function openC(open) {
    cBtn.setAttribute("aria-expanded", String(open));
    if (open) { cPanel.hidden = false; requestAnimationFrame(() => cPanel.classList.add("open")); if (!greeted) { greeted = true; botSay(greeting()); } setTimeout(() => input.focus(), 350); }
    else { cPanel.classList.remove("open"); setTimeout(() => { cPanel.hidden = true; }, 350); }
  }
  cBtn.addEventListener("click", () => openC(cPanel.hidden));
  cClose.addEventListener("click", () => openC(false));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !cPanel.hidden) openC(false); });
  $$("#concierge-chips button").forEach((b) => b.addEventListener("click", () => ask(b.dataset.q)));
  form.addEventListener("submit", (e) => { e.preventDefault(); const q = input.value.trim(); if (!q) return; input.value = ""; ask(q); });
  log.addEventListener("click", (e) => { const a = e.target.closest('a[href^="#"]'); if (a && window.innerWidth < 600) openC(false); });

  function add(cls, html) { const d = document.createElement("div"); d.className = "msg " + cls; d.innerHTML = html; log.appendChild(d); log.scrollTop = log.scrollHeight; return d; }
  function botSay(html, delay) {
    const t = add("bot typing", "<span></span><span></span><span></span>");
    setTimeout(() => { t.classList.remove("typing"); t.innerHTML = html; log.scrollTop = log.scrollHeight; }, reduced ? 0 : (delay || 650));
  }
  function ask(q) { add("user", esc(q)); botSay(answer(q)); }
  function greeting() {
    const h = nowSP().getHours();
    const s = h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
    return `${s}. Sou o concierge do D'Ferraro. Posso indicar um prato, passar preços e horários ou ajudar com a sua reserva.`;
  }
  const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const has = (q, ...words) => words.some((w) => q.includes(w));
  const link = (href, label) => `<a href="${href}"${href.startsWith("http") ? ' target="_blank" rel="noopener"' : ""}>${label}</a>`;
  const hit = (it) => `<span class="dish-hit"><b>${esc(it.name)}</b> ${it.price ? `<span>${esc(it.price)}${it.exec ? " (menu executivo em três tempos)" : ""}</span>` : ""}${it.desc ? `<br>${esc(it.desc)}` : ""}<br>${link("#" + it.id, "Ver no cardápio")}</span>`;
  const DEMONYMS = { "chile": "chile", "argentin": "argentina", "uruguai": "uruguai", "portug": "portugal", "espanh": "espanha", "franc": "franca", "itali": "italia", "brasil": "brasil", "alem": "alemanha", "austral": "australia", "africa": "africa do sul", "americano": "estados unidos", "estados unidos": "estados unidos" };
  const STOP = new Set(["o", "a", "os", "as", "de", "do", "da", "dos", "das", "um", "uma", "e", "ou", "que", "tem", "qual", "quais", "quanto", "custa", "preco", "valor", "voces", "vcs", "voce", "vc", "eu", "quero", "queria", "gostaria", "me", "fala", "sobre", "com", "sem", "no", "na", "em", "pra", "para", "por", "ser", "ter", "mais", "menos", "algum", "alguma", "opcao", "opcoes", "prato", "pratos", "cardapio", "menu", "ai", "ne", "esse", "essa", "isso", "aqui", "la", "ola", "oi", "bom", "boa", "dia", "tarde", "noite"]);
  function search(q) {
    const words = norm(q).split(/[^a-z0-9]+/).filter((w) => w.length > 2 && !STOP.has(w));
    if (!words.length) return [];
    const pool = allItems.concat(allWines);
    const scored = pool.map((it) => {
      const n = norm(it.name), d = norm(it.desc || ""), c = norm(it.cat || ""), o = norm(it.origin || "");
      let s = 0;
      words.forEach((w) => { if (o && (o.includes(w) || w.startsWith(o.slice(0, 5)))) s += 4; if (n.includes(w)) s += 5; else if (n.split(/[^a-z0-9]+/).some((t) => t.startsWith(w) || w.startsWith(t) && t.length > 3)) s += 3; if (d.includes(w)) s += 1.5; if (c.includes(w)) s += 1; });
      if (it.exec) s -= .5;
      return [s, it];
    }).filter(([s]) => s >= 3).sort((a, b) => b[0] - a[0]);
    return scored.slice(0, 3).map(([, it]) => it);
  }
  function answer(raw) {
    const q = norm(raw);
    if (has(q, "horario", "horarios", "abre", "fecha", "funciona", "aberto", "que horas", "ate que horas", "hoje", "amanha", "domingo", "sabado")) {
      const s = status();
      return `${s.text}.<br>Segunda e terça, das 11h30 às 16h. Quarta a sexta, das 11h30 às 22h. Café da manhã de segunda a sexta, das 7h às 9h. Sábado e domingo a casa fica fechada.<br>${link("#localizacao", "Ver horários")}`;
    }
    if (has(q, "reserv", "mesa para", "marcar")) return `A reserva é feita online em um minuto: ${link(RESERVA, "reservar pelo DGuests")}. Se preferir, fale com a equipe no ${link(WA + "?text=" + encodeURIComponent("Olá! Gostaria de reservar uma mesa no D'Ferraro."), "WhatsApp")}.`;
    if (has(q, "onde", "endereco", "chegar", "localiza", "fica", "waze", "uber", "estacion", "manobrista", "metro", "mapa")) return `Av. das Nações Unidas, 17007, piso térreo da Torre Alpha, no Complexo 17007 Nações, em Santo Amaro. Há estacionamento com manobrista. ${link("#localizacao", "Abrir Waze, Uber ou mapa")}.`;
    if (has(q, "pagamento", "cartao", "pix", "vale", "alelo", "ticket", "pluxee", "sodexo", "dinheiro", "debito", "credito", "aceita")) return `Aceitamos dinheiro, Pix, cartões de crédito e débito e os vales Pluxee, Ticket Restaurante, Alelo e VR.`;
    if (has(q, "executivo", "almoco executivo", "menu do dia", "prato do dia")) return `O menu executivo custa ${esc(MENU.executivo.price)} e inclui entrada do dia, prato principal e sobremesa do dia, de segunda a sexta das 11h30 às 15h. Pratos principais: ${MENU.executivo.pratos.map((p) => p.name).join(", ")}.<br>${link("#cat-executivo", "Ver o menu executivo")}`;
    if (has(q, "cafe da manha", "cafe-da-manha", "breakfast")) return `O café da manhã é servido de segunda a sexta, das 7h às 9h: buffet com pães, frutas, frios e café expresso à vontade por R$ 34,90.`;
    if (has(q, "quilo", "buffet", "self")) return `O buffet por quilo é servido de segunda a sexta, das 11h30 às 14h, a R$ 89,00 o quilo. O menu executivo em três tempos (R$ 73,00) vai até as 15h.`;
    if (has(q, "happy", "chopp", "chope", "cerveja")) return `O happy hour é de quarta a sexta, no fim de tarde: chopp artesanal Paulistânia (lager a partir de R$ 15,00, IPA a partir de R$ 17,00), coquetelaria clássica e petiscos para dividir. ${link("#cat-bar", "Ver chopps e cervejas")} ou ${link("#cat-petiscos", "ver petiscos")}.`;
    if (has(q, "evento", "festa", "aniversario", "corporativ", "grupo", "pessoas", "confraterniza", "casamento", "reuniao")) return `A casa recebe grupos e eventos fechados: salão para até 130 pessoas, mesa redonda para 10 com prato giratório e menus sob medida (coquetel, degustação ou à la carte). Também fazemos catering corporativo. ${link(WA + "?text=" + encodeURIComponent("Olá! Gostaria de um orçamento para evento no D'Ferraro."), "Pedir orçamento no WhatsApp")}.`;
    if (has(q, "vegan", "vegetarian", "sem carne")) { const v = allItems.find((i) => /ravioli/i.test(i.name)); return `Temos o Ravioli di Verdure e Noci, massa vegana artesanal com legumes grelhados e pesto. Saladas e pratos sem carne também podem ser adaptados; é só avisar a equipe.${v ? hit(v) : ""}`; }
    if (has(q, "wifi", "wi-fi", "internet")) return `Sim, o salão tem Wi-Fi e é climatizado. Para reuniões de negócios, há espaço reservado e carta de vinhos e destilados.`;
    if (has(q, "telefone", "whatsapp", "contato", "falar", "ligar", "numero")) return `WhatsApp ${link(WA, "(11) 98904-0476")} e telefone ${link("tel:+551123649832", "(11) 2364-9832")}. Instagram ${link("https://www.instagram.com/dferraro.sp", "@dferraro.sp")}.`;
    if (has(q, "crianca", "kids", "infantil")) return `Crianças são bem-vindas. Para grupos com crianças, vale reservar e avisar nas observações para a equipe preparar a mesa. ${link(RESERVA, "Reservar")}.`;
    if (has(q, "sobremesa", "doce")) { const c = MENU.categories.find((c) => c.id === "sobremesas"); return `Sobremesas: ${c.items.map((i) => `${i.name} (${i.price})`).join(", ")}. ${link("#cat-sobremesas", "Ver sobremesas")}.`; }
    if (has(q, "vinho", "espumante", "taca", "rotulo", "carta", "tinto", "branco", "rose")) {
      const origin = Object.keys(DEMONYMS).find((k) => q.includes(k));
      if (origin) { const list = allWines.filter((w) => norm(w.origin) === DEMONYMS[origin]); if (list.length) return `${list.length === 1 ? "Rótulo" : "Rótulos"} de ${esc(list[0].origin)} na carta: ${list.map((w) => `${esc(w.name)} (${esc(w.price)})`).join(", ")}. ${link("#vinhos", "Ver a carta")}.`; }
      const kind = ["espumante", "rose", "branco", "tinto", "taca", "meia garrafa"].find((k) => q.includes(k));
      if (kind) { const list = allWines.filter((w) => norm(w.cat).includes(kind === "taca" ? "taca" : kind)); if (list.length) return `${esc(list[0].cat)}: ${list.map((w) => `${esc(w.name)} (${esc(w.price)})`).join(", ")}. ${link("#vinhos", "Ver a carta")}.`; }
      const hits = search(raw).filter((i) => i.id.startsWith("vinho-")); if (hits.length) return `Encontrei na carta:${hits.map(hit).join("")}`; return `A carta tem rótulos de nove países: espumantes, rosés, brancos e tintos do Brasil, Chile, Argentina, Uruguai, Portugal, Espanha, França e Itália, além de meias garrafas e vinhos em taça a partir de R$ 37,00. ${link("#vinhos", "Ver a carta")}.`; }
    if (has(q, "peixe", "pescado", "frutos do mar", "camarao", "salmao", "tilapia", "paella")) { const c = MENU.categories.find((c) => c.id === "pescados"); const extra = search(raw).filter((i) => !c.items.some((x) => x.name === i.name)).slice(0, 2); return `Pescados: ${c.items.map((i) => `${i.name} (${i.price})`).join(", ")}.${extra.map(hit).join("")}<br>${link("#cat-pescados", "Ver pescados")}`; }
    if (has(q, "carne", "picanha", "file", "mignon", "entrecote", "baby beef", "bife")) { const hits = search(raw); if (hits.length) return `Encontrei:${hits.map(hit).join("")}`; const c = MENU.categories.find((c) => c.id === "carnes"); return `Carnes: ${c.items.map((i) => `${i.name} (${i.price})`).join(", ")}. ${link("#cat-carnes", "Ver carnes")}.`; }
    if (has(q, "massa", "pasta", "risoto", "gnocchi", "nhoque", "fettuccine", "penne", "ravioli")) { const hits = search(raw); if (hits.length) return `Encontrei:${hits.map(hit).join("")}`; return `Massas e clássicos: ${MENU.categories.find((c) => c.id === "classicos").items.map((i) => `${i.name} (${i.price})`).join(", ")}. ${link("#cat-classicos", "Ver massas")}.`; }
    if (has(q, "drink", "coquetel", "caipirinha", "caipiroska", "gin", "negroni", "spritz", "bebida")) { const hits = search(raw); if (hits.length) return `Encontrei:${hits.map(hit).join("")}`; return `Drinks: Aperol Spritz, Negroni, Moscow Mule, Espresso Martini e as caipirinhas da casa, entre outros, de R$ 31,00 a R$ 46,00. ${link("#cat-drinks", "Ver drinks")}.`; }
    if (has(q, "petisco", "entrada", "tapas", "dividir", "aperitivo")) { const c = MENU.categories.find((c) => c.id === "petiscos"); return `Petiscos: ${c.items.map((i) => `${i.name} (${i.price})`).join(", ")}. ${link("#cat-petiscos", "Ver petiscos")}.`; }
    if (has(q, "assinatura", "recomenda", "indica", "sugest", "melhor", "famoso", "especialidade")) { const sig = allItems.filter((i) => /paella|chateaubriand|delon|tartare|ajillo/i.test(i.name) && !i.exec); return `Os pratos de assinatura da casa:${sig.map(hit).join("")}`; }
    if (has(q, "obrigad", "valeu", "perfeito", "otimo", "show")) return `Por nada. Quando quiser, a mesa está à sua espera: ${link(RESERVA, "reservar")}.`;
    if (has(q, "oi", "ola", "bom dia", "boa tarde", "boa noite") && q.length < 16) return greeting();
    const hits = search(raw);
    if (hits.length) return `Encontrei no cardápio:${hits.map(hit).join("")}`;
    return `Não encontrei isso no cardápio. Posso ajudar com pratos, preços, horários, reservas e como chegar. Para outras dúvidas, a equipe responde no ${link(WA + "?text=" + encodeURIComponent("Olá! Tenho uma dúvida sobre o D'Ferraro: " + raw), "WhatsApp")}.`;
  }
})();
