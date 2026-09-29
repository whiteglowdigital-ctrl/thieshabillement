/* ==========================================================================
   Moteur de rendu — modèle "Maison de mode" Jëfya
   Lit window.SITE (content.js) et construit la page. Ne contient aucune
   donnée client : tout changement de contenu se fait dans content.js.
   ========================================================================== */
(function () {
  const S = window.SITE;
  const root = document.getElementById('site');
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- Thème ---------- */
  const t = S.theme || {};
  const rs = document.documentElement.style;
  if (t.paper) rs.setProperty('--paper', t.paper);
  if (t.paper2) rs.setProperty('--paper-2', t.paper2);
  if (t.ink) rs.setProperty('--ink', t.ink);
  if (t.accent) rs.setProperty('--accent', t.accent);
  if (t.muted) rs.setProperty('--muted', t.muted);
  rs.setProperty('--mark', `url("${S.brand.logoMark}")`);

  /* ---------- Icônes (traits fins, style référence) ---------- */
  const I = {
    chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20.5 11.6a8.5 8.5 0 0 1-12.4 7.5L3.5 20.5l1.4-4.4A8.5 8.5 0 1 1 20.5 11.6Z"/><path d="M9 9.2c.3 1.9 1.9 3.9 4.2 4.8l1.2-1.1 1.9.9-.4 1.6c-3.6.2-7.9-3.3-8-7.3l1.6-.4.9 1.9Z"/></svg>',
    pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
    arrowL: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M19 12H5m6-6-6 6 6 6"/></svg>',
    arrowR: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>',
    needle: '<svg viewBox="0 0 36 36" fill="none" stroke-width="1.3" stroke-linecap="round"><path d="M8 28 27 9"/><ellipse cx="28.6" cy="7.4" rx="1.4" ry="2.6" transform="rotate(45 28.6 7.4)"/><path d="M27.5 8.5c3 2 4 6 1 9-3.5 3.5-8-.5-11.5 3S15 29 11 30"/></svg>',
    hanger: '<svg viewBox="0 0 36 36" fill="none" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M15 9a3 3 0 1 1 3 3v3"/><path d="M18 15 4 24.5c-1 .7-.5 2 .7 2h26.6c1.2 0 1.7-1.3.7-2L18 15Z"/></svg>',
    truck: '<svg viewBox="0 0 36 36" fill="none" stroke-width="1.3" stroke-linejoin="round"><path d="M3 9h19v16H3zM22 14h6l5 5v6H22"/><circle cx="9" cy="27" r="2.6" fill="var(--paper)"/><circle cx="27" cy="27" r="2.6" fill="var(--paper)"/></svg>',
  };
  const svcIcon = (k) => I[k] || '';

  /* ---------- Helpers ---------- */
  const todo = (on, label = 'À confirmer') => (on ? `<span class="todo-mark">${esc(label)}</span>` : '');
  const media = (img = {}, cls = '', extra = '') => {
    const inner = img.src
      ? `<img src="${esc(img.src)}" alt="${esc(img.alt || '')}" loading="lazy">`
      : `<div class="ph" role="img" aria-label="${esc(img.alt || 'Visuel à venir')}"><span>Visuel à venir · ${esc(img.label || '')}</span></div>`;
    return `<div class="media ${cls}">${extra}${inner}</div>`;
  };
  const waHref = (text) => (S.contact.whatsapp ? `https://wa.me/${S.contact.whatsapp}?text=${encodeURIComponent(text || S.contact.whatsappMessage)}` : '#whatsapp');
  const waAttrs = (text) => `href="${waHref(text)}" data-wa ${S.contact.whatsapp ? 'target="_blank" rel="noopener"' : ''}`;
  const brandHTML = () => `<a class="brand" href="#top" aria-label="${esc(S.brand.name)} — accueil"><span class="mark" aria-hidden="true"></span><span><b>${esc(S.brand.wordmark)}</b><small>${esc(S.brand.wordmarkSub)}</small></span></a>`;
  const L = S.location;

  /* ---------- Sections ---------- */
  const topbar = `
  <div class="topbar caps caps-sm"><div class="wrap">
    <span class="tb-side">${esc(S.brand.activity)}</span>
    <span>${esc(L.area)} · ${esc(L.city)}</span>
    <nav class="tb-side"><a ${waAttrs()}>WhatsApp</a><span>|</span><a href="#boutique">Nous trouver</a></nav>
  </div></div>`;

  const header = `
  <header class="header" id="header"><div class="wrap">
    <nav class="nav caps" aria-label="Navigation principale">${S.nav.slice(0, 4).map((n) => `<a href="${n.href}">${esc(n.label)}</a>`).join('')}</nav>
    <button class="burger" aria-label="Ouvrir le menu" aria-expanded="false" id="burger"><span></span></button>
    ${brandHTML()}
    <div class="actions caps">
      <a class="icon-link hide-md" href="#boutique">${I.pin}<span>Boutique</span></a>
      <a class="icon-link" ${waAttrs()} aria-label="Commander sur WhatsApp">${I.chat}<span>WhatsApp</span></a>
    </div>
  </div></header>`;

  const menu = `
  <div class="menu" id="menu" aria-hidden="true">
    <div class="menu-top">${brandHTML()}<button class="menu-close" id="menuClose" aria-label="Fermer le menu"></button></div>
    <nav class="menu-links">${S.nav.map((n, i) => `<a href="${n.href}"><small>0${i + 1}</small>${esc(n.label)}</a>`).join('')}</nav>
    <div class="menu-foot">
      <a class="btn btn--accent" ${waAttrs()}>${I.chat}Commander sur WhatsApp</a>
      <p class="caps caps-sm">${esc(L.area)} · ${esc(L.city)}<br>${esc(L.landmark)}</p>
    </div>
  </div>`;

  const H = S.hero;
  const word = [...S.brand.wordmark].map((c, i) => `<span class="ch" style="--i:${i}">${esc(c)}</span>`).join('');
  const heroFig = H.image.src
    ? `<div class="hero-figure media ${H.image.cutout ? 'cutout' : ''}"><img src="${esc(H.image.src)}" alt="${esc(H.image.alt)}"></div>`
    : `<div class="hero-figure media"><div class="ph" role="img" aria-label="${esc(H.image.alt)}"><span>Visuel à venir · ${esc(H.image.label)}</span></div></div>`;
  const hero = `
  <section class="hero" id="top"><div class="wrap">
    <p class="hero-kicker caps">${H.kicker.map((k) => `<span>${esc(k)}</span>`).join('')}<span class="rule"></span></p>
    <h1 class="hero-word" aria-label="${esc(S.brand.name)}">${word}</h1>
    <p class="hero-script" aria-hidden="true">Habillement</p>
    <div class="hero-shadow"></div>
    ${heroFig}
    <div class="hero-ctas">
      <a class="btn" href="${H.ctaPrimary.href}">${esc(H.ctaPrimary.label)}</a>
      <a class="link" ${waAttrs()}>${esc(H.ctaSecondary.label)} <span class="arr">→</span></a>
    </div>
    <p class="hero-corner caps">${H.corner.map((k) => `<span>${esc(k)}</span>`).join('')}<span class="rule"></span></p>
  </div></section>`;

  const cats = `
  <section class="cats on-ink" id="collections" aria-label="Collections"><div class="wrap">
    ${S.collections.map((c) => `
    <article class="cat">
      ${media(c.image, 'rv-img')}
      <div>
        <h3>${esc(c.title)}</h3>
        <p>${esc(c.text)}</p>
        <a class="link" href="#selection" data-filter="${esc(c.title)}">Voir ${esc(c.title.toLowerCase())} <span class="arr">→</span></a>
        <div style="margin-top:12px">${todo(c.todo, 'Catégorie à confirmer')}</div>
      </div>
    </article>`).join('')}
  </div></section>`;

  const intro = `
  <section class="intro"><div class="wrap">
    <div class="intro-side"><span class="mark" aria-hidden="true"></span><span class="caps">${esc(S.intro.kicker)}</span></div>
    <div class="rv">
      <p class="big">${esc(S.intro.text).replace('tenues africaines', '<em>tenues africaines</em>')}</p>
      <p class="sig">${esc(S.brand.tagline)}</p>
    </div>
  </div></section>`;

  const cats4 = ['Tout', ...new Set(S.selection.items.map((i) => i.category))];
  const selection = `
  <section class="selection" id="selection"><div class="wrap">
    <div class="shead">
      <h2>${esc(S.selection.title)}</h2>
      <div class="filters" role="group" aria-label="Filtrer">${cats4.map((c, i) => `<button type="button" aria-pressed="${i === 0}" data-cat="${esc(c)}">${esc(c)}</button>`).join('')}</div>
    </div>
    <div class="grid">
      ${S.selection.items.map((p) => `
      <article class="card rv" data-cat="${esc(p.category)}">
        ${media(p.image, '', `<a class="card-ask" ${waAttrs(`Bonjour, je suis intéressé(e) par : ${p.name} (${p.category})`)} aria-label="Demander ${esc(p.name)} sur WhatsApp">${I.chat}</a>`)}
        <div class="card-meta"><h3>${esc(p.name)}</h3><span class="caps caps-sm">${esc(p.category)}</span></div>
        <a class="link card-cta" ${waAttrs(`Bonjour, je suis intéressé(e) par : ${p.name} (${p.category})`)}>Demander <span class="arr">→</span></a>
      </article>`).join('')}
    </div>
  </div></section>`;

  const C = S.craft;
  const craft = `
  <section class="craft" id="savoir-faire"><div class="wrap">
    <div class="craft-text">
      <span class="caps">${esc(C.kicker)}</span>
      <h2 class="rv">${C.title.map((w) => `<span>${esc(w)}</span>`).join('')}</h2>
      <p>${esc(C.text)}</p>
      ${todo(C.todo, 'Texte à valider avec le client')}
      <a class="btn" ${waAttrs('Bonjour, je souhaite une information sur la confection de tenues.')}>${esc(C.cta.label)}</a>
    </div>
    <div class="craft-visual">
      ${media(C.image, 'main rv-img')}
      ${media(C.image2, 'inset')}
    </div>
  </div></section>`;

  const svcs = S.services.filter((s) => s.show);
  const services = `
  <section class="services" aria-label="Services"><div class="wrap" style="--n:${svcs.length}">
    ${svcs.map((s) => `<div class="svc">${svcIcon(s.icon)}<div><h3>${esc(s.title)}</h3><p>${esc(s.text)}</p>${todo(s.todo)}</div></div>`).join('')}
  </div></section>`;

  const LB = S.lookbook;
  const lookbook = `
  <section class="lookbook" id="lookbook">
    <div class="wrap"><div class="shead">
      <div><span class="caps">${esc(LB.kicker)}</span><h2>${esc(LB.title)}</h2></div>
      <div class="lb-ctrl"><span class="caps lb-count" id="lbCount">01 / ${String(LB.looks.length).padStart(2, '0')}</span>
        <button type="button" id="lbPrev" aria-label="Précédent">${I.arrowL}</button><button type="button" id="lbNext" aria-label="Suivant">${I.arrowR}</button></div>
    </div></div>
    <div class="track" id="lbTrack" tabindex="0" aria-label="Lookbook, défilement horizontal">
      ${LB.looks.map((l, i) => `<figure class="look ${l.wide ? 'wide' : ''}">${media(l.image)}<figcaption class="caps caps-sm"><span>${esc(l.caption)}</span><span>${String(i + 1).padStart(2, '0')}</span></figcaption></figure>`).join('')}
    </div>
    <div class="lb-progress" aria-hidden="true"><i id="lbBar"></i></div>
  </section>`;

  const W = S.whatsappBand;
  const wa = `
  <section class="wa on-ink" id="whatsapp"><div class="wrap">
    <div><span class="caps">${esc(W.kicker)}</span><h2 class="rv">${W.title.map((w) => `<span>${esc(w)}</span>`).join('')}</h2></div>
    <div class="wa-side">
      <p>${esc(W.text)}</p>
      <a class="btn btn--accent" ${waAttrs()}>${I.chat}${esc(W.cta)}</a>
      <div class="wa-num">${S.contact.whatsapp ? `WhatsApp · +${esc(S.contact.whatsapp)}` : todo(true, 'Numéro WhatsApp à confirmer')}</div>
    </div>
  </div></section>`;

  const hours = L.hours && L.hours.length
    ? L.hours.map((h) => `${esc(h.d)} · ${esc(h.h)}`).join('<br>')
    : `<span style="color:var(--muted)">Sur demande</span> ${todo(true, 'Horaires à fournir')}`;
  const shop = `
  <section class="shop" id="boutique"><div class="wrap">
    <figure class="shop-photo">
      ${media(L.photo, 'rv-img')}
      <figcaption class="caps caps-sm"><span>La boutique</span><span>${esc(L.area)} — ${esc(L.city)}</span></figcaption>
    </figure>
    <div class="shop-info">
      <div><span class="caps">Nous trouver</span><h2>${esc(L.area)},<br>${esc(L.city.split(',')[0])}</h2></div>
      <dl>
        <dt class="caps caps-sm">Adresse</dt><dd>${esc(L.area)}, ${esc(L.city)}<br>${esc(L.landmark)}</dd>
        <dt class="caps caps-sm">Horaires</dt><dd>${hours}</dd>
        <dt class="caps caps-sm">Contact</dt><dd>${S.contact.phones.length ? S.contact.phones.map(esc).join('<br>') : `WhatsApp ${todo(true, 'Numéro à confirmer')}`}</dd>
      </dl>
      <div class="shop-btns">
        <a class="btn" href="${esc(L.mapsUrl)}" target="_blank" rel="noopener">${I.pin}Itinéraire</a>
        <a class="btn btn--ghost" ${waAttrs('Bonjour, je souhaite passer à la boutique.')}>${I.chat}Nous écrire</a>
      </div>
    </div>
  </div></section>`;

  const social = S.socials.map((s) => (s.url
    ? `<li><a href="${esc(s.url)}" target="_blank" rel="noopener">${esc(s.label)} ↗</a></li>`
    : `<li><span class="muted-link">${esc(s.label)}</span> ${todo(s.todo, 'Lien à fournir')}</li>`)).join('');
  const footer = `
  <footer class="footer on-ink"><div class="wrap">
    <div class="foot-cols">
      <div><p class="sig">${esc(S.brand.tagline)}</p><p>${esc(S.brand.name)} — ${esc(S.brand.activity.toLowerCase())}. ${esc(L.area)}, ${esc(L.city)}, ${esc(L.landmark.charAt(0).toLowerCase() + L.landmark.slice(1))}.</p></div>
      <div><h4 class="caps caps-sm">Maison</h4><ul>${S.nav.map((n) => `<li><a href="${n.href}">${esc(n.label)}</a></li>`).join('')}</ul></div>
      <div><h4 class="caps caps-sm">Contact</h4><ul><li><a ${waAttrs()}>WhatsApp</a></li><li><a href="${esc(L.mapsUrl)}" target="_blank" rel="noopener">Google Maps ↗</a></li></ul></div>
      <div><h4 class="caps caps-sm">Suivre</h4><ul>${social}</ul></div>
    </div>
    <p class="foot-word" aria-hidden="true">${esc(S.brand.wordmark)} ${esc(S.brand.wordmarkSub)}</p>
    <div class="foot-bottom caps caps-sm"><span>© ${new Date().getFullYear()} ${esc(S.brand.name)}</span><span>${esc(S.footer.credit)}</span></div>
  </div></footer>`;

  const mbar = `<div class="mbar" id="mbar"><a class="btn" ${waAttrs()}>${I.chat}Commander sur WhatsApp</a><a class="btn btn--ghost" href="#boutique" aria-label="Nous trouver">${I.pin}</a></div>`;
  const chip = S.prototype ? `<button class="proto-chip" id="protoChip" type="button" aria-pressed="true"><i></i>Repères prototype</button>` : '';

  root.innerHTML = topbar + header + menu + '<main>' + hero + cats + intro + selection + craft + services + lookbook + wa + shop + '</main>' + footer + mbar + chip + '<div class="toast" id="toast" role="status"></div>';
  if (S.prototype) document.body.classList.add('show-todo');

  /* ---------- Interactions ---------- */
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => [...document.querySelectorAll(s)];

  // Toast WhatsApp tant que le numéro n'est pas configuré
  const toast = $('#toast');
  let tt;
  const say = (html) => { toast.innerHTML = html; toast.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove('on'), 3800); };
  if (!S.contact.whatsapp) {
    $$('[data-wa]').forEach((a) => a.addEventListener('click', (e) => {
      e.preventDefault();
      say('Numéro WhatsApp en attente de confirmation. À renseigner dans <code>content.js → contact.whatsapp</code>.');
    }));
  }

  // Menu mobile
  const menuEl = $('#menu');
  const setMenu = (open) => { menuEl.classList.toggle('open', open); menuEl.setAttribute('aria-hidden', !open); $('#burger').setAttribute('aria-expanded', open); document.body.style.overflow = open ? 'hidden' : ''; };
  $('#burger').addEventListener('click', () => setMenu(true));
  $('#menuClose').addEventListener('click', () => setMenu(false));
  $$('.menu-links a, .menu-foot a').forEach((a) => a.addEventListener('click', () => setMenu(false)));

  // Header qui se masque en descendant + barre mobile
  const header_ = $('#header'); const mb = $('#mbar'); const heroEl = $('.hero');
  let lastY = 0;
  addEventListener('scroll', () => {
    const y = scrollY;
    header_.classList.toggle('scrolled', y > 40);
    header_.classList.toggle('hide', y > 500 && y > lastY + 4);
    if (y < lastY - 4) header_.classList.remove('hide');
    lastY = y;
    mb.classList.toggle('on', y > heroEl.offsetTop + heroEl.offsetHeight * 0.7);
  }, { passive: true });

  // Filtres de la sélection (+ liens des catégories)
  const setFilter = (cat) => {
    $$('.filters button').forEach((b) => b.setAttribute('aria-pressed', b.dataset.cat === cat));
    $$('.card').forEach((c) => { c.hidden = !(cat === 'Tout' || c.dataset.cat === cat); });
  };
  $$('.filters button').forEach((b) => b.addEventListener('click', () => setFilter(b.dataset.cat)));
  $$('[data-filter]').forEach((a) => a.addEventListener('click', () => {
    const c = a.dataset.filter; setFilter($$('.filters button').some((b) => b.dataset.cat === c) ? c : 'Tout');
  }));

  // Lookbook : flèches, compteur, progression
  const track = $('#lbTrack'); const bar = $('#lbBar'); const count = $('#lbCount');
  const looks = $$('.look');
  const step = (d) => {
    const x = track.scrollLeft; const pad = parseFloat(getComputedStyle(track).paddingLeft);
    const pos = looks.map((l) => l.offsetLeft - pad);
    const target = d > 0 ? pos.find((p) => p > x + 4) : [...pos].reverse().find((p) => p < x - 4);
    track.scrollTo({ left: target ?? (d > 0 ? track.scrollWidth : 0), behavior: 'smooth' });
  };
  $('#lbPrev').addEventListener('click', () => step(-1));
  $('#lbNext').addEventListener('click', () => step(1));
  const upd = () => {
    const max = track.scrollWidth - track.clientWidth; const r = max > 0 ? track.scrollLeft / max : 0;
    const w = Math.max(12, (track.clientWidth / track.scrollWidth) * 100);
    bar.style.width = w + '%'; bar.style.left = r * (100 - w) + '%';
    const pad = parseFloat(getComputedStyle(track).paddingLeft);
    let idx = looks.findIndex((l) => l.offsetLeft - pad >= track.scrollLeft - 10);
    if (r > 0.98) idx = looks.length - 1;
    count.textContent = `${String(Math.max(idx, 0) + 1).padStart(2, '0')} / ${String(looks.length).padStart(2, '0')}`;
  };
  track.addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); upd();

  // Repères prototype
  const chipEl = $('#protoChip');
  if (chipEl) chipEl.addEventListener('click', () => { const on = document.body.classList.toggle('show-todo'); chipEl.setAttribute('aria-pressed', on); });
})();
