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

  /* ---------- Índice do cardápio (para o concierge) ---------- */
  const DG_MENU = "https://www.dguests.com.br/cardapio/Dferraro";
  const deepLink = (it) => DG_MENU + "#:~:text=" + encodeURIComponent(it.dg || it.name).replace(/-/g, "%2D");
  const allItems = [];
  MENU.executivo.pratos.forEach((p) => allItems.push({ name: p.name, dg: p.dg, desc: p.desc || "", price: MENU.executivo.price, cat: "Menu executivo", exec: true }));
  MENU.categories.forEach((c) => c.items.forEach((i) => allItems.push({ name: i.name, dg: i.dg, desc: i.desc || "", price: i.price || "", cat: c.name })));
  const allWines = [];
  MENU.wines.forEach((g) => g.items.forEach((w) => allWines.push({ name: w.name, dg: w.dg, desc: w.desc || "", price: w.price, cat: g.group, origin: w.origin, wine: true })));

  /* ---------- Ocasiões ---------- */
  const ocList = $("#oc-list");
  if (ocList) {
    const tabs = $$("button[data-oc]", ocList);
    const imgs = $$(".oc-img"), panels = $$(".oc-panel");
    let current = "happy", timer = null, touched = false;
    function show(oc) {
      current = oc;
      tabs.forEach((b) => b.setAttribute("aria-selected", String(b.dataset.oc === oc)));
      imgs.forEach((i) => i.classList.toggle("is-on", i.dataset.oc === oc));
      panels.forEach((p) => p.classList.toggle("is-on", p.dataset.oc === oc));
    }
    function next() { const i = tabs.findIndex((b) => b.dataset.oc === current); show(tabs[(i + 1) % tabs.length].dataset.oc); }
    function startAuto() { if (reduced || touched) return; stopAuto(); timer = setInterval(next, 5200); }
    function stopAuto() { if (timer) { clearInterval(timer); timer = null; } }
    tabs.forEach((b) => {
      b.addEventListener("click", () => { touched = true; stopAuto(); show(b.dataset.oc); });
      b.addEventListener("mouseenter", () => { if (window.matchMedia("(hover: hover)").matches) { stopAuto(); show(b.dataset.oc); } });
    });
    ocList.addEventListener("mouseleave", () => startAuto());
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) startAuto(); else stopAuto(); }), { threshold: .3 });
      io.observe($("#ocasioes"));
    } else startAuto();
    // teclado: setas entre as abas
    ocList.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp" && e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      e.preventDefault(); touched = true; stopAuto();
      const i = tabs.findIndex((b) => b.dataset.oc === current);
      const n = (e.key === "ArrowDown" || e.key === "ArrowRight") ? (i + 1) % tabs.length : (i - 1 + tabs.length) % tabs.length;
      show(tabs[n].dataset.oc); tabs[n].focus();
    });
  }

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
  const openMenuBtn = $("#open-menu");
  if (openMenuBtn) openMenuBtn.addEventListener("click", () => { openC(true); setTimeout(() => { if (log.children.length <= 1) botSay("Qual prato você quer consultar? Posso passar o preço e abrir o item direto no cardápio digital."); }, 500); });
  cClose.addEventListener("click", () => openC(false));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !cPanel.hidden) openC(false); });
  $$("#concierge-chips button").forEach((b) => b.addEventListener("click", () => ask(b.dataset.q)));
  form.addEventListener("submit", (e) => { e.preventDefault(); const q = input.value.trim(); if (!q) return; input.value = ""; ask(q); });
  log.addEventListener("click", (e) => { const a = e.target.closest('a[href^="#"]'); if (a && window.innerWidth < 600) openC(false); });
  const cat = (id) => DG_MENU + "#:~:text=" + encodeURIComponent(({ executivo: "Menu Executivo", petiscos: "Tapas no Tomate", carnes: "Baby Beef", pescados: "Saint Peter", classicos: "Salada Caesar", sobremesas: "Gelatos", drinks: "Caipirinha do Amor", bar: "Artesanal Lager", "sem-alcool": "Água com ou sem gás", vinhos: "Carta de Vinhos" })[id] || "");

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
  const hit = (it) => `<span class="dish-hit"><b>${esc(it.name)}</b> ${it.price ? `<span>${esc(it.price)}${it.exec ? " (menu executivo em três tempos)" : ""}</span>` : ""}${it.desc ? `<br>${esc(it.desc)}` : ""}<br>${link(deepLink(it), "Abrir no cardápio digital")}</span>`;
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
    if (has(q, "aniversario", "niver", "comemora", "surpresa")) return `Aniversários são bem-vindos: reserve a mesa e escreva nas observações que é aniversário. A equipe prepara a recepção, o brinde com espumante e a sobremesa da casa. Para grupos maiores, a mesa redonda recebe até 10 pessoas. ${link(RESERVA, "Reservar para aniversário")}.`;
    if (has(q, "reserv", "mesa para", "marcar")) return `A reserva é feita online em um minuto: ${link(RESERVA, "reservar pelo DGuests")}. Se preferir, fale com a equipe no ${link(WA + "?text=" + encodeURIComponent("Olá! Gostaria de reservar uma mesa no D'Ferraro."), "WhatsApp")}.`;
    if (has(q, "onde", "endereco", "chegar", "localiza", "fica", "waze", "uber", "estacion", "manobrista", "metro", "mapa")) return `Av. das Nações Unidas, 17007, piso térreo da Torre Alpha, no Complexo 17007 Nações, em Santo Amaro. Há estacionamento com manobrista. ${link("#localizacao", "Abrir Waze, Uber ou mapa")}.`;
    if (has(q, "pagamento", "cartao", "pix", "vale", "alelo", "ticket", "pluxee", "sodexo", "dinheiro", "debito", "credito", "aceita")) return `Aceitamos dinheiro, Pix, cartões de crédito e débito e os vales Pluxee, Ticket Restaurante, Alelo e VR.`;
    if (has(q, "executivo", "almoco executivo", "menu do dia", "prato do dia")) return `O menu executivo custa ${esc(MENU.executivo.price)} e inclui entrada do dia, prato principal e sobremesa do dia, de segunda a sexta das 11h30 às 15h. Pratos principais: ${MENU.executivo.pratos.map((p) => p.name).join(", ")}.<br>${link(cat("executivo"), "Ver o menu executivo")}`;
    if (has(q, "cafe da manha", "cafe-da-manha", "breakfast")) return `O café da manhã é servido de segunda a sexta, das 7h às 9h: buffet com pães, frutas, frios e café expresso à vontade por R$ 34,90.`;
    if (has(q, "quilo", "buffet", "self")) return `O buffet por quilo é servido de segunda a sexta, das 11h30 às 14h, a R$ 89,00 o quilo. O menu executivo em três tempos (R$ 73,00) vai até as 15h.`;
    if (has(q, "happy", "chopp", "chope", "cerveja")) return `O happy hour é de quarta a sexta, no fim de tarde: chopp artesanal Paulistânia (lager a partir de R$ 15,00, IPA a partir de R$ 17,00), coquetelaria clássica e petiscos para dividir. ${link(cat("bar"), "Ver chopps e cervejas")} ou ${link(cat("petiscos"), "ver petiscos")}.`;
    if (has(q, "evento", "festa", "aniversario", "corporativ", "grupo", "pessoas", "confraterniza", "casamento", "reuniao")) return `A casa recebe grupos e eventos fechados: salão para até 130 pessoas, mesa redonda para 10 com prato giratório e menus sob medida (coquetel, degustação ou à la carte). Também fazemos catering corporativo. ${link(WA + "?text=" + encodeURIComponent("Olá! Gostaria de um orçamento para evento no D'Ferraro."), "Pedir orçamento no WhatsApp")}.`;
    if (has(q, "vegan", "vegetarian", "sem carne")) { const v = allItems.find((i) => /ravioli/i.test(i.name)); return `Temos o Ravioli di Verdure e Noci, massa vegana artesanal com legumes grelhados e pesto. Saladas e pratos sem carne também podem ser adaptados; é só avisar a equipe.${v ? hit(v) : ""}`; }
    if (has(q, "wifi", "wi-fi", "internet")) return `Sim, o salão tem Wi-Fi e é climatizado. Para reuniões de negócios, há espaço reservado e carta de vinhos e destilados.`;
    if (has(q, "telefone", "whatsapp", "contato", "falar", "ligar", "numero")) return `WhatsApp ${link(WA, "(11) 98904-0476")} e telefone ${link("tel:+551123649832", "(11) 2364-9832")}. Instagram ${link("https://www.instagram.com/dferraro.sp", "@dferraro.sp")}.`;
    if (has(q, "crianca", "kids", "infantil")) return `Crianças são bem-vindas. Para grupos com crianças, vale reservar e avisar nas observações para a equipe preparar a mesa. ${link(RESERVA, "Reservar")}.`;
    if (has(q, "sobremesa", "doce")) { const c = MENU.categories.find((c) => c.id === "sobremesas"); return `Sobremesas: ${c.items.map((i) => `${i.name} (${i.price})`).join(", ")}. ${link(cat("sobremesas"), "Ver sobremesas")}.`; }
    if (has(q, "vinho", "espumante", "taca", "rotulo", "carta", "tinto", "branco", "rose")) {
      const origin = Object.keys(DEMONYMS).find((k) => q.includes(k));
      if (origin) { const list = allWines.filter((w) => norm(w.origin) === DEMONYMS[origin]); if (list.length) return `${list.length === 1 ? "Rótulo" : "Rótulos"} de ${esc(list[0].origin)} na carta: ${list.map((w) => `${esc(w.name)} (${esc(w.price)})`).join(", ")}. ${link(cat("vinhos"), "Ver a carta")}.`; }
      const kind = ["espumante", "rose", "branco", "tinto", "taca", "meia garrafa"].find((k) => q.includes(k));
      if (kind) { const list = allWines.filter((w) => norm(w.cat).includes(kind === "taca" ? "taca" : kind)); if (list.length) return `${esc(list[0].cat)}: ${list.map((w) => `${esc(w.name)} (${esc(w.price)})`).join(", ")}. ${link(cat("vinhos"), "Ver a carta")}.`; }
      const hits = search(raw).filter((i) => i.wine); if (hits.length) return `Encontrei na carta:${hits.map(hit).join("")}`; return `A carta tem rótulos de nove países: espumantes, rosés, brancos e tintos do Brasil, Chile, Argentina, Uruguai, Portugal, Espanha, França e Itália, além de meias garrafas e vinhos em taça a partir de R$ 37,00. ${link(cat("vinhos"), "Ver a carta")}.`; }
    if (has(q, "peixe", "pescado", "frutos do mar", "camarao", "salmao", "tilapia", "paella")) { const c = MENU.categories.find((c) => c.id === "pescados"); const extra = search(raw).filter((i) => !c.items.some((x) => x.name === i.name)).slice(0, 2); return `Pescados: ${c.items.map((i) => `${i.name} (${i.price})`).join(", ")}.${extra.map(hit).join("")}<br>${link(cat("pescados"), "Ver pescados")}`; }
    if (has(q, "carne", "picanha", "file", "mignon", "entrecote", "baby beef", "bife")) { const hits = search(raw); if (hits.length) return `Encontrei:${hits.map(hit).join("")}`; const c = MENU.categories.find((c) => c.id === "carnes"); return `Carnes: ${c.items.map((i) => `${i.name} (${i.price})`).join(", ")}. ${link(cat("carnes"), "Ver carnes")}.`; }
    if (has(q, "massa", "pasta", "risoto", "gnocchi", "nhoque", "fettuccine", "penne", "ravioli")) { const hits = search(raw); if (hits.length) return `Encontrei:${hits.map(hit).join("")}`; return `Massas e clássicos: ${MENU.categories.find((c) => c.id === "classicos").items.map((i) => `${i.name} (${i.price})`).join(", ")}. ${link(cat("classicos"), "Ver massas")}.`; }
    if (has(q, "drink", "coquetel", "caipirinha", "caipiroska", "gin", "negroni", "spritz", "bebida")) { const hits = search(raw); if (hits.length) return `Encontrei:${hits.map(hit).join("")}`; return `Drinks: Aperol Spritz, Negroni, Moscow Mule, Espresso Martini e as caipirinhas da casa, entre outros, de R$ 31,00 a R$ 46,00. ${link(cat("drinks"), "Ver drinks")}.`; }
    if (has(q, "petisco", "entrada", "tapas", "dividir", "aperitivo")) { const c = MENU.categories.find((c) => c.id === "petiscos"); return `Petiscos: ${c.items.map((i) => `${i.name} (${i.price})`).join(", ")}. ${link(cat("petiscos"), "Ver petiscos")}.`; }
    if (has(q, "assinatura", "recomenda", "indica", "sugest", "melhor", "famoso", "especialidade")) { const sig = allItems.filter((i) => /paella|chateaubriand|delon|tartare|ajillo/i.test(i.name) && !i.exec); return `Os pratos de assinatura da casa:${sig.map(hit).join("")}`; }
    if (has(q, "obrigad", "valeu", "perfeito", "otimo", "show")) return `Por nada. Quando quiser, a mesa está à sua espera: ${link(RESERVA, "reservar")}.`;
    if (has(q, "oi", "ola", "bom dia", "boa tarde", "boa noite") && q.length < 16) return greeting();
    const hits = search(raw);
    if (hits.length) return `Encontrei no cardápio:${hits.map(hit).join("")}`;
    return `Não encontrei isso no cardápio. Posso ajudar com pratos, preços, horários, reservas e como chegar. Para outras dúvidas, a equipe responde no ${link(WA + "?text=" + encodeURIComponent("Olá! Tenho uma dúvida sobre o D'Ferraro: " + raw), "WhatsApp")}.`;
  }
})();
