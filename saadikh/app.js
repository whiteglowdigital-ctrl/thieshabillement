/* ==========================================================================
   Saadikh — moteur du site (Jëfya)
   Lit window.SITE (content.js). Vues : accueil · #collection(-famille) · #modele-006
   Le panier reste dans le navigateur du visiteur ; la commande part sur
   WhatsApp, déjà rédigée.
   ========================================================================== */
(function () {
  const S = window.SITE;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const V = (u) => `${u}?v=${S.version || 1}`;
  const store = {
    get(k, d) { try { const v = localStorage.getItem(`saadikh-${k}`); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(`saadikh-${k}`, JSON.stringify(v)); } catch (e) { /* stockage indisponible : on garde en mémoire */ } },
  };
  const wa = (text) => `https://wa.me/${S.contact.whatsapp}?text=${encodeURIComponent(text)}`;

  /* ---------- Devises (prix unitaire arrondi : le total est la somme des lignes) ---------- */
  const C = S.currencies;
  let cur = store.get('cur', C.default);
  if (!C.list.some((c) => c.code === cur)) cur = C.default;
  const cOf = (code) => C.list.find((c) => c.code === code);
  const unit = (xof, code = cur) => Math.round(xof / cOf(code).perUnit);
  const fmt = (n, code = cur) => { const c = cOf(code); return `${c.prefix || ''}${n.toLocaleString('fr-FR').replace(/[  ]/g, ' ')}${c.suffix || ''}`; };
  const money = (xof, code = cur, q = 1) => fmt(unit(xof, code) * q, code);
  const price = (xof, cls = 'price') => `<span class="${cls}" data-xof="${xof}">${money(xof)}</span>`;

  /* ---------- Catalogue ---------- */
  const P = S.products;
  const byRef = (r) => P.find((p) => p.ref === r);
  const famOf = (id) => S.families.find((f) => f.id === id);
  const EV = { id: 'evenements', label: 'Grands événements', text: 'Broderies, satin, galons dorés : les tenues des jours de fête et de cérémonie.' };

  /* ---------- Logo de l'enseigne, redessiné : bonnet rayé, bande en zigzag, socle « STAM » ---------- */
  const bonnet = (cls = '') => `<svg class="bonnet ${cls}" viewBox="0 0 100 92" aria-hidden="true">
    <defs><clipPath id="dome-${cls || 'x'}"><path d="M14 46 C14 18 30 6 50 6 C70 6 86 18 86 46 Z"/></clipPath></defs>
    <g clip-path="url(#dome-${cls || 'x'})" fill="currentColor">${Array.from({ length: 12 }, (_, i) => `<rect x="${14 + i * 6}" y="4" width="3.4" height="44"/>`).join('')}</g>
    <path d="M14 46 C14 18 30 6 50 6 C70 6 86 18 86 46" fill="none" stroke="currentColor" stroke-width="1.6"/>
    <rect x="12" y="46" width="76" height="14" rx="1.5" fill="currentColor"/>
    <path d="M15 57 L21 49 L27 57 L33 49 L39 57 L45 49 L51 57 L57 49 L63 57 L69 49 L75 57 L81 49 L85 55" fill="none" stroke="var(--bonnet-in, #fff)" stroke-width="1.8" stroke-linejoin="miter"/>
    <path d="M10 66 C4 66 4 76 11 76 C11 84 22 86 27 81 C33 87 44 86 48 81 C54 87 66 87 71 81 C77 86 90 83 89 76 C96 76 96 66 89 66 Z" fill="currentColor"/>
    <text x="50" y="78.5" text-anchor="middle" font-family="'Pinyon Script', cursive" font-size="13" fill="var(--bonnet-in, #fff)">Stam</text>
  </svg>`;
  const brand = `<a class="brand" href="#accueil" aria-label="${esc(S.brand.name)}, ${esc(S.brand.sub)}, accueil">${bonnet('hd-b')}<span class="brand-name">SAADIKH</span></a>`;

  const I = {
    bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M5 8h14l-1.2 12H6.2L5 8Z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><path d="M4 8h16M4 16h16"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="10.5" cy="10.5" r="6"/><path d="m20 20-5-5"/></svg>',
    prev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"><path d="M20 12H4m6-6-6 6 6 6"/></svg>',
    next: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"><path d="M4 12h16m-6-6 6 6-6 6"/></svg>',
    hanger: '<svg class="hook" viewBox="0 0 60 26" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M30 13V8.5a3.5 3.5 0 1 0-3.5-3.5"/><path d="M30 13 3 24h54Z"/></svg>',
  };

  /* ---------- Gabarits ---------- */
  const curSwitch = () => `<div class="cur" role="group" aria-label="Devise">${C.list.map((c) => `<button type="button" data-cur="${c.code}" aria-pressed="${c.code === cur}">${esc(c.label)}</button>`).join('')}</div>`;
  const navLinks = `<a href="#portant">Collection</a><a href="#atelier">L’atelier</a><a href="#sur-mesure">Sur-mesure</a><a href="#collection-evenements">Grands événements</a>`;

  const header = `
  <header class="hd" id="hd"><div class="w hd-in">
    ${brand}
    <nav class="hd-nav" aria-label="Navigation">${navLinks}</nav>
    <div class="hd-tools">${curSwitch()}<a class="ib" href="#collection" aria-label="Rechercher un modèle">${I.search}</a><button class="ib" id="cartBtn" aria-label="Ouvrir le panier">${I.bag}<span class="badge" id="badge" hidden>0</span></button><button class="ib burger" id="burger" aria-label="Ouvrir le menu">${I.menu}</button></div>
  </div></header>
  <div class="menu" id="menu" hidden><div class="menu-in">
    <button class="ib menu-x" id="menuX" aria-label="Fermer le menu">${I.close}</button>
    ${bonnet('menu-b')}
    <nav>${navLinks}<a href="#commander">Commander</a></nav>
    <p class="menu-foot">${esc(S.brand.tagline)}</p>
  </div></div>`;

  const card = (p) => `
    <article class="card" data-ref="${p.ref}" data-fam="${p.family}" data-ev="${p.events ? 1 : 0}">
      ${I.hanger}
      <a href="#modele-${p.ref}" class="card-a">
        <span class="card-img"><img src="${V(p.img)}" alt="${esc(p.name)}"></span>
        <span class="card-meta"><span class="card-top"><span class="card-fam">${esc(famOf(p.family).label)}</span><span class="card-no">N° ${esc(p.ref)}</span></span><span class="card-name">${esc(p.name)}</span>${price(p.price, 'card-price')}</span>
      </a>
    </article>`;

  // 1. Hero : la photo du modèle Blanc & Or d'un côté, l'ivoire et le nom de la maison de l'autre
  const HP = byRef(S.hero.ref);
  const hero = `
  <section class="hero" id="accueil">
    <div class="hero-side">
      <div class="hero-mark">${bonnet('hero-b')}<span class="brand-name">SAADIKH</span><span class="hero-sub">${esc(S.brand.sub)} · Dakar</span></div>
      <h1 class="hero-t"><span>Quand c’est élégant,</span><em>c’est Saadikh.</em></h1>
      <p class="hero-p">${esc(S.hero.lead)}</p>
      <div class="hero-cta"><a class="tl" href="#portant">Découvrir la collection</a><a class="tl" href="#sur-mesure">Le sur-mesure</a></div>
    </div>
    <a class="hero-photo" href="#modele-${HP.ref}"><img src="${V(HP.img)}" alt="${esc(famOf(HP.family).label)} ${esc(HP.name)}"><span class="hero-tag"><i>N° ${esc(HP.ref)}</i>${esc(famOf(HP.family).label)} ${esc(HP.name)}</span></a>
  </section>`;

  // 2. L'atelier : section noire, une seule grande image, un texte court
  const T = S.atelier;
  const atelier = `
  <section class="atelier" id="atelier"><div class="w at-in">
    <figure class="at-fig"><img src="${V(T.image)}" alt="${esc(T.alt)}"></figure>
    <div class="at-copy">
      <p class="eyebrow">L’atelier · ${esc(S.address.line2)}</p>
      <h2><span>De la coupe</span><em>à la broderie</em></h2>
      ${T.text.map((t) => `<p>${esc(t)}</p>`).join('')}
      <p class="at-sign">${esc(S.brand.signature)}</p>
    </div>
  </div></section>`;

  // 3. Le portant : pièces présentées une à une, en composition alternée
  const look = (p) => `
    <article class="look" data-ref="${p.ref}" data-fam="${p.family}">
      <a class="look-img" href="#modele-${p.ref}"><img src="${V(p.img)}" alt="${esc(p.name)}"></a>
      <div class="look-txt">
        <span class="look-no">N° ${esc(p.ref)}</span>
        <h3><a href="#modele-${p.ref}">${esc(p.name)}</a></h3>
        <p class="look-fam">${esc(famOf(p.family).label)} · ${esc(p.fabric)}</p>
        <p class="look-d">${esc(p.detail)}</p>
        ${price(p.price, 'look-price')}
        <a class="tl tl--s" href="#modele-${p.ref}">Voir la pièce</a>
      </div>
    </article>`;
  const segs = [{ id: 'all', label: 'Toutes' }, ...S.families];
  const portant = `
  <section class="portant" id="portant"><div class="w">
    <header class="pt-h">
      <div><p class="eyebrow">Le portant</p><h2>Les pièces <em>de la maison</em></h2></div>
      <div class="seg" role="tablist" aria-label="Filtrer les pièces">${segs.map((t, i) => `<button type="button" role="tab" data-seg="${t.id}" aria-selected="${i === 0}">${esc(t.label)}</button>`).join('')}<span class="seg-bar" aria-hidden="true"></span></div>
    </header>
    <div class="looks" id="looks">${S.featured.map(byRef).filter(Boolean).concat(P.filter((p) => !S.featured.includes(p.ref))).map(look).join('')}</div>
    <p class="pt-more"><a class="tl" href="#collection" id="ptMore">Voir les ${P.length} modèles</a></p>
  </div></section>`;

  // 4. Le sur-mesure : une invitation privée, un conseiller personnel sur WhatsApp
  const IV = S.invitation;
  const invitation = `
  <section class="invite" id="sur-mesure"><div class="w iv-in">
    <div class="iv-copy">
      <p class="eyebrow">Sur-mesure · Salon privé</p>
      <h2><span>Une pièce</span><em>qui n’existe que pour vous.</em></h2>
      <p class="iv-p">${esc(IV.text)}</p>
      <p class="iv-path">${IV.path.map((t) => `<span>${esc(t)}</span>`).join('<i aria-hidden="true"></i>')}</p>
      <p class="iv-note">${esc(IV.note)}</p>
    </div>
    <a class="card-inv" href="${wa(IV.message)}" target="_blank" rel="noopener">
      <span class="ci-frame">
        ${bonnet('ci-b')}
        <span class="ci-k">Invitation privée</span>
        <span class="ci-t">Votre conseiller personnel</span>
        <span class="ci-d">Une conversation sur WhatsApp, à Dakar comme dans la diaspora.</span>
        <span class="ci-go">Ouvrir le salon <span aria-hidden="true">→</span></span>
        <span class="ci-n">${esc(S.contact.whatsappDisplay)}</span>
      </span>
    </a>
  </div></section>`;

  const A = S.address;
  const footer = `
  <footer class="ft"><div class="w">
    <div class="ft-top"><div class="ft-brand">${bonnet('ft-b')}<span class="brand-name">SAADIKH</span></div><p class="ft-tag">${esc(S.brand.tagline)}</p></div>
    <div class="ft-cols">
      <div><b>La maison</b><span>${esc(A.line1)}, ${esc(A.line2)}</span><span>${esc(A.city)}</span></div>
      <div><b>Collection</b>${S.families.map((f) => `<a href="#collection-${f.id}">${esc(f.label)}</a>`).join('')}<a href="#collection-evenements">Grands événements</a></div>
      <div><b>Commander</b><span>Panier, puis confirmation sur WhatsApp. Livraison à Dakar, dans les régions et dans la diaspora.</span></div>
      <div><b>Contact</b><a href="${wa(`Bonjour ${S.brand.name}, j’ai une question.`)}" target="_blank" rel="noopener">WhatsApp · ${esc(S.contact.whatsappDisplay)}</a><span>${S.socials.map(esc).join(' · ')}</span></div>
    </div>
    <p class="ft-b"><span>© ${new Date().getFullYear()} ${esc(S.brand.name)} · ${esc(S.brand.sub)}</span><span>${esc(S.credit)}</span></p>
  </div></footer>`;

  const filters = [{ id: 'all', label: 'Tout' }, ...S.families, EV];
  const collPage = `
  <main class="pg" id="vColl" hidden><div class="w">
    <header class="pg-h"><p class="eyebrow"><a href="#accueil">Accueil</a> / Collection</p><h1 id="cTitle">La collection</h1><p id="cText"></p></header>
    <div class="bar">
      <div class="tabs" role="group" aria-label="Filtrer">${filters.map((f) => `<button type="button" data-f="${f.id}" aria-pressed="${f.id === 'all'}">${esc(f.label)}</button>`).join('')}</div>
      <label class="find" for="cFind">${I.search}<input id="cFind" type="search" inputmode="numeric" placeholder="N° du modèle, ex : 006" autocomplete="off"></label>
    </div>
    <p class="count" id="cCount"></p>
    <div class="grid" id="cGrid">${P.map(card).join('')}</div>
    <p class="empty" id="cEmpty" hidden></p>
    <p class="note">${esc(C.note)}</p>
  </div></main>`;

  const pdpPage = `
  <main class="pg" id="vPdp" hidden><div class="w">
    <p class="eyebrow crumbs"><a href="#accueil">Accueil</a> / <a href="#collection">Collection</a> / <span id="pCrumb"></span></p>
    <div class="pdp">
      <figure class="pdp-fig"><span class="glow" aria-hidden="true"></span><img id="pImg" alt=""></figure>
      <div class="pdp-info">
        <p class="eyebrow" id="pFam"></p>
        <h1 id="pName"></h1>
        <p class="pdp-d" id="pDetail"></p>
        <dl class="spec" id="pSpec"></dl>
        <p class="pdp-price" id="pPrice"></p>
        <fieldset class="sizes" id="pSizes"><legend>Taille <span class="err" id="pErr" hidden>Choisissez une taille</span></legend>${S.sizes.map((z, i) => `<label><input type="radio" name="size" value="${esc(z)}" id="sz${i}"><span>${esc(z)}</span></label>`).join('')}</fieldset>
        <div class="buy"><div class="qty"><button type="button" data-q="-1" aria-label="Moins">−</button><output id="pQty">1</output><button type="button" data-q="1" aria-label="Plus">+</button></div><button type="button" class="btn btn--solid" id="pAdd">Ajouter au panier</button></div>
        <ul class="pdp-notes"><li>« Sur-mesure » : la maison vous contacte pour vos mesures, même à distance.</li><li>Commande confirmée sur WhatsApp : disponibilité, livraison et paiement.</li></ul>
      </div>
    </div>
    <section class="also"><h2>Dans la même famille</h2><div class="grid" id="pAlso"></div></section>
  </div></main>`;

  const drawer = `
  <div class="dw" id="dw" hidden><div class="dw-bg" data-x></div>
    <aside class="dw-p" role="dialog" aria-modal="true" aria-labelledby="dwT">
      <header class="dw-h"><div><h2 id="dwT">Votre panier</h2><p class="dw-steps"><span id="s1" class="on">1 · Panier</span><span id="s2">2 · Coordonnées</span></p></div><button type="button" class="ib" data-x aria-label="Fermer">${I.close}</button></header>
      <div class="dw-b" id="dwB"></div><div class="dw-f" id="dwF"></div>
    </aside></div>`;

  // Écran d'entrée : une ligne de couture se pique à travers l'écran, puis le logo apparaît
  const seamPath = 'M-20 150 C 160 70, 300 230, 500 140 S 820 70, 1020 150';
  const loader = matchMedia('(prefers-reduced-motion: reduce)').matches ? '' : `
  <div class="ld" id="ld" aria-hidden="true">
    <svg class="ld-seam" viewBox="0 0 1000 300" preserveAspectRatio="none"><defs><mask id="ldm"><path class="ld-mask" d="${seamPath}" pathLength="1"/></mask></defs><path class="ld-guide" d="${seamPath}"/><path class="ld-stitch" d="${seamPath}" mask="url(#ldm)"/></svg>
    <div class="ld-ruler"></div>
    <div class="ld-in">${bonnet('ld-b')}<span class="brand-name ld-name">SAADIKH</span><span class="ld-sub">${esc(S.brand.sub)}</span></div>
  </div>`;

  document.getElementById('site').innerHTML = loader + header
    + `<main id="vHome">${hero}${atelier}${portant}${invitation}</main>`
    + collPage + pdpPage + footer + drawer + '<div class="toast" id="toast" role="status"></div>';

  /* ---------- Écran d'entrée ---------- */
  const ld = $('#ld');
  if (ld) { document.body.classList.add('lock'); const end = () => { ld.classList.add('out'); document.body.classList.remove('lock'); setTimeout(() => ld.remove(), 900); }; setTimeout(end, 3000); ld.addEventListener('click', end); }

  /* ---------- Message court ---------- */
  const toast = $('#toast'); let tt;
  const say = (html) => { toast.innerHTML = html; toast.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove('on'), 4000); };

  /* ---------- En-tête et menu ---------- */
  const hd = $('#hd');
  addEventListener('scroll', () => hd.classList.toggle('sc', scrollY > 20), { passive: true });
  const menu = $('#menu');
  const setMenu = (on) => { menu.hidden = !on; document.body.classList.toggle('lock', on); };
  $('#burger').onclick = () => setMenu(true);
  $('#menuX').onclick = () => setMenu(false);
  $$('#menu a').forEach((a) => a.addEventListener('click', () => setMenu(false)));

  /* ---------- Devises ---------- */
  const refreshPrices = () => {
    $$('[data-xof]').forEach((el) => { el.textContent = money(Number(el.dataset.xof)); });
    $$('[data-cur]').forEach((b) => b.setAttribute('aria-pressed', b.dataset.cur === cur));
  };
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-cur]'); if (!b) return;
    cur = b.dataset.cur; store.set('cur', cur); refreshPrices(); if (!$('#dw').hidden) renderCart();
  });

  /* ---------- Portant : sélecteur et composition alternée (4 pièces à la fois) ---------- */
  const looksEl = $('#looks');
  const setSeg = (id) => {
    const btn = $(`[data-seg="${id}"]`);
    $$('[data-seg]').forEach((x) => x.setAttribute('aria-selected', x === btn));
    const bar = $('.seg-bar'); bar.style.width = `${btn.offsetWidth}px`; bar.style.transform = `translateX(${btn.offsetLeft}px)`;
    let k = 0; let n = 0;
    $$('.look', looksEl).forEach((el) => { const ok = id === 'all' || el.dataset.fam === id; if (ok) n++; el.hidden = !ok || k >= 4; if (!el.hidden) { el.dataset.side = k % 2 ? 'r' : 'l'; k++; } });
    const more = $('#ptMore'); more.href = id === 'all' ? '#collection' : `#collection-${id}`; more.textContent = `Voir les ${n} modèle${n > 1 ? 's' : ''}${id === 'all' ? '' : ` · ${famOf(id).label}`}`;
  };
  $$('[data-seg]').forEach((b) => b.addEventListener('click', () => setSeg(b.dataset.seg)));
  addEventListener('resize', () => setSeg(($('[data-seg][aria-selected="true"]') || {}).dataset?.seg || 'all'));

  /* ---------- Collection : filtres et recherche ---------- */
  let filt = 'all';
  const applyColl = () => {
    const q = $('#cFind').value.trim(); const d = (q.match(/\d+/) || [''])[0];
    let n = 0;
    $$('#cGrid .card').forEach((c) => {
      const okF = filt === 'all' || c.dataset.fam === filt || (filt === EV.id && c.dataset.ev === '1');
      const okQ = !d || Number(c.dataset.ref) === Number(d);
      c.hidden = !(okF && okQ); if (!c.hidden) n++;
    });
    $$('.tabs [data-f]').forEach((b) => b.setAttribute('aria-pressed', b.dataset.f === filt));
    const f = filt === EV.id ? EV : famOf(filt);
    $('#cTitle').textContent = f ? f.label : 'La collection';
    $('#cText').textContent = f ? f.text : 'Deux pièces et trois pièces pour homme. Chaque modèle porte un numéro : retrouvez celui vu sur nos réseaux.';
    $('#cCount').textContent = `${n} modèle${n > 1 ? 's' : ''}`;
    const e = $('#cEmpty'); e.hidden = n > 0;
    if (!n) e.innerHTML = `Aucun modèle ne porte le numéro « ${esc(q)} ». <a href="${wa(`Bonjour, je cherche le modèle ${q} vu sur vos réseaux.`)}" target="_blank" rel="noopener">Envoyez-nous la photo sur WhatsApp</a>.`;
  };
  $$('.tabs [data-f]').forEach((b) => b.addEventListener('click', () => { filt = b.dataset.f; applyColl(); }));
  $('#cFind').addEventListener('input', applyColl);
  $('#cFind').addEventListener('keydown', (e) => { if (e.key !== 'Enter') return; const d = (e.target.value.match(/\d+/) || [''])[0]; const p = d && P.find((x) => Number(x.ref) === Number(d)); if (p) location.hash = `#modele-${p.ref}`; });

  /* ---------- Fiche modèle ---------- */
  let curP = null; let qty = 1;
  const showPdp = (p) => {
    curP = p; qty = 1; $('#pQty').textContent = '1'; $('#pErr').hidden = true;
    $$('#pSizes input').forEach((i) => { i.checked = false; });
    $('#pImg').src = V(p.img); $('#pImg').alt = p.name;
    $('#pCrumb').textContent = `N° ${p.ref}`;
    $('#pFam').textContent = `${famOf(p.family).label}${p.events ? ' · Grands événements' : ''}`;
    $('#pName').textContent = p.name;
    $('#pDetail').textContent = p.detail;
    $('#pSpec').innerHTML = `<div><dt>Modèle</dt><dd>N° ${esc(p.ref)}</dd></div><div><dt>Matière</dt><dd>${esc(p.fabric)}</dd></div><div><dt>Couleur</dt><dd><i class="dot" style="--c:${p.hex}"></i>${esc(p.color)}</dd></div>`;
    $('#pPrice').innerHTML = price(p.price);
    $('#pAlso').innerHTML = P.filter((x) => x.family === p.family && x.ref !== p.ref).slice(0, 4).map(card).join('');
    document.title = `${p.name} · ${S.brand.name}`;
  };
  $$('[data-q]').forEach((b) => b.addEventListener('click', () => { qty = Math.max(1, Math.min(20, qty + Number(b.dataset.q))); $('#pQty').textContent = qty; }));
  $('#pAdd').addEventListener('click', () => {
    const z = $('#pSizes input:checked');
    if (!z) { $('#pErr').hidden = false; $('#pSizes').animate([{ transform: 'translateX(-4px)' }, { transform: 'translateX(4px)' }, { transform: 'none' }], { duration: 280 }); return; }
    addToCart(curP.ref, z.value, qty);
  });
  $('#pSizes').addEventListener('change', () => { $('#pErr').hidden = true; });

  /* ---------- Panier ---------- */
  let cart = store.get('cart', []).filter((l) => byRef(l.ref));
  const save = () => store.set('cart', cart);
  const count = () => cart.reduce((n, l) => n + l.qty, 0);
  const total = (code = cur) => cart.reduce((n, l) => n + l.qty * unit(byRef(l.ref).price, code), 0);
  const updBadge = () => { const n = count(); const b = $('#badge'); b.hidden = !n; b.textContent = n; };
  const addToCart = (ref, size, q) => {
    const l = cart.find((x) => x.ref === ref && x.size === size);
    if (l) l.qty += q; else cart.push({ ref, size, qty: q });
    save(); updBadge();
    say(`<span>${esc(byRef(ref).name)} · ${esc(size)} ajouté au panier</span><button type="button" id="tOpen">Voir le panier</button>`);
    $('#tOpen').onclick = () => openCart();
  };
  let stepN = 1;
  const dw = $('#dw');
  const openCart = () => { toast.classList.remove('on'); stepN = 1; renderCart(); dw.hidden = false; document.body.classList.add('lock'); requestAnimationFrame(() => dw.classList.add('on')); };
  const closeCart = () => { dw.classList.remove('on'); document.body.classList.remove('lock'); setTimeout(() => { dw.hidden = true; }, 350); };
  $('#cartBtn').onclick = openCart;
  $$('[data-x]', dw).forEach((b) => { b.onclick = closeCart; });
  addEventListener('keydown', (e) => { if (e.key === 'Escape') { if (!dw.hidden) closeCart(); if (!menu.hidden) setMenu(false); } });

  const field = (id, label, input) => `<div class="fld" id="f-${id}"><label for="${id}">${label}</label>${input}<span class="fld-e">Champ à remplir</span></div>`;
  const renderCart = () => {
    $('#s1').classList.toggle('on', stepN === 1); $('#s2').classList.toggle('on', stepN === 2);
    $('#dwT').textContent = stepN === 1 ? 'Votre panier' : 'Vos coordonnées';
    const B = $('#dwB'); const F = $('#dwF');
    if (!cart.length) {
      B.innerHTML = `<div class="dw-empty">${bonnet('empty-b')}<p>Votre panier est vide.</p><a class="tl" href="#collection" data-x>Découvrir la collection</a></div>`;
      F.innerHTML = ''; $$('[data-x]', B).forEach((b) => { b.onclick = closeCart; }); return;
    }
    const totals = `<div class="tot"><span>Devise</span>${curSwitch()}</div><div class="tot tot--big"><span>Total · ${count()} article${count() > 1 ? 's' : ''}</span><b>${fmt(total())}</b></div>${cur !== 'XOF' ? `<p class="tot-x">soit ${fmt(total('XOF'), 'XOF')}</p>` : ''}<p class="tot-x">Hors frais de livraison, confirmés sur WhatsApp.</p>`;
    if (stepN === 1) {
      B.innerHTML = cart.map((l, i) => { const p = byRef(l.ref); return `
        <div class="line"><img src="${V(p.img)}" alt=""><div><b>${esc(p.name)}</b><span>N° ${esc(p.ref)} · ${esc(famOf(p.family).label)} · Taille ${esc(l.size)}</span><div class="qty qty--s"><button type="button" data-l="${i}" data-d="-1" aria-label="Moins">−</button><output>${l.qty}</output><button type="button" data-l="${i}" data-d="1" aria-label="Plus">+</button></div></div><div class="line-r"><span>${money(p.price, cur, l.qty)}</span><button type="button" class="tl tl--s" data-rm="${i}">Retirer</button></div></div>`; }).join('');
      F.innerHTML = `${totals}<button type="button" class="btn btn--solid btn--full" id="goForm">Continuer</button>`;
      $$('[data-d]', B).forEach((b) => b.addEventListener('click', () => { const l = cart[b.dataset.l]; l.qty = Math.max(1, l.qty + Number(b.dataset.d)); save(); updBadge(); renderCart(); }));
      $$('[data-rm]', B).forEach((b) => b.addEventListener('click', () => { cart.splice(Number(b.dataset.rm), 1); save(); updBadge(); renderCart(); }));
      $('#goForm').onclick = () => { stepN = 2; renderCart(); B.scrollTop = 0; };
      return;
    }
    const c = store.get('client', { mode: 'sn' });
    B.innerHTML = `<button type="button" class="tl tl--s back" id="back">← Retour au panier</button>
      ${field('oName', 'Prénom et nom', `<input id="oName" autocomplete="name" value="${esc(c.name || '')}" placeholder="Ex : Moussa Diop">`)}
      <fieldset class="where"><legend>Où êtes-vous ?</legend>
        <label><input type="radio" name="mode" value="sn" ${c.mode !== 'abroad' ? 'checked' : ''}><span><b>Au Sénégal</b><small>Dakar et régions</small></span></label>
        <label><input type="radio" name="mode" value="abroad" ${c.mode === 'abroad' ? 'checked' : ''}><span><b>À l’étranger</b><small>Diaspora</small></span></label>
      </fieldset>
      <div id="wSn" ${c.mode === 'abroad' ? 'hidden' : ''}>${field('oRegion', 'Région', `<select id="oRegion"><option value="">Choisir la région</option>${S.regions.map((r) => `<option ${r === c.region ? 'selected' : ''}>${esc(r)}</option>`).join('')}</select>`)}${field('oQuartier', 'Quartier ou adresse', `<input id="oQuartier" autocomplete="street-address" value="${esc(c.quartier || '')}" placeholder="Ex : Mermoz, Sacré-Cœur 3…">`)}</div>
      <div id="wAb" ${c.mode === 'abroad' ? '' : 'hidden'}>${field('oCountry', 'Pays', `<select id="oCountry"><option value="">Choisir le pays</option>${S.countries.map((r) => `<option ${r === c.country ? 'selected' : ''}>${esc(r)}</option>`).join('')}</select>`)}${field('oCity', 'Ville', `<input id="oCity" autocomplete="address-level2" value="${esc(c.city || '')}" placeholder="Ex : Paris, Milan, New York…">`)}</div>
      ${field('oNote', 'Note <small>(facultatif)</small>', '<textarea id="oNote" rows="2" placeholder="Ex : mesures pour le sur-mesure, date souhaitée…"></textarea>')}`;
    F.innerHTML = `${totals}<button type="button" class="btn btn--solid btn--full" id="send">Envoyer ma commande sur WhatsApp</button><p class="tot-x">WhatsApp s’ouvre avec votre commande déjà rédigée : il ne reste qu’à l’envoyer.</p>`;
    $('#back').onclick = () => { stepN = 1; renderCart(); };
    $$('input[name="mode"]', B).forEach((r) => r.addEventListener('change', () => { if (r.checked) { const ab = r.value === 'abroad'; $('#wSn').hidden = ab; $('#wAb').hidden = !ab; } }));
    $('#send').onclick = send;
  };

  const send = () => {
    const v = (id) => ($(`#${id}`) ? $(`#${id}`).value.trim() : '');
    const mode = ($('input[name="mode"]:checked') || {}).value || 'sn';
    const need = ['oName', ...(mode === 'sn' ? ['oRegion', 'oQuartier'] : ['oCountry', 'oCity'])];
    let bad = null;
    need.forEach((id) => { const ok = !!v(id); $(`#f-${id}`).classList.toggle('bad', !ok); if (!ok && !bad) bad = id; });
    const client = { name: v('oName'), mode, region: v('oRegion'), quartier: v('oQuartier'), country: v('oCountry'), city: v('oCity') };
    store.set('client', client);
    if (bad) { $(`#${bad}`).focus(); say('<span>Il manque une information pour la livraison.</span>'); return; }
    const lines = cart.map((l, i) => { const p = byRef(l.ref); return `${i + 1}. N° ${p.ref} — ${p.name} (${famOf(p.family).label}) — Taille ${l.size} — Qté ${l.qty} — ${money(p.price, cur, l.qty)}`; });
    const where = mode === 'sn' ? `Sénégal — Région de ${client.region}, ${client.quartier}` : `Étranger — ${client.country}, ${client.city}`;
    const msg = [`Bonjour ${S.brand.name} ! Je souhaite passer commande :`, '', ...lines, '', `Total : ${fmt(total())}${cur !== 'XOF' ? ` (soit ${fmt(total('XOF'), 'XOF')})` : ''}`, '', 'Mes informations :', `- Nom : ${client.name}`, `- Livraison : ${where}`, `- Note : ${v('oNote') || 'Aucune'}`, '', 'Merci de me confirmer la disponibilité, les frais de livraison et les modalités de paiement.'].join('\n');
    const a = document.createElement('a'); a.href = wa(msg); a.target = '_blank'; a.rel = 'noopener'; document.body.appendChild(a); a.click(); a.remove();
    say('<span>WhatsApp s’ouvre avec votre commande. Appuyez sur Envoyer pour la transmettre.</span>');
  };

  /* ---------- Navigation entre les vues ---------- */
  const views = { home: $('#vHome'), coll: $('#vColl'), pdp: $('#vPdp') };
  const route = () => {
    const h = location.hash.slice(1);
    const p = h.startsWith('modele-') ? byRef(h.slice(7)) : null;
    const isColl = h === 'collection' || h.startsWith('collection-');
    const v = p ? 'pdp' : isColl ? 'coll' : 'home';
    const was = Object.keys(views).find((k) => !views[k].hidden);
    Object.entries(views).forEach(([k, el]) => { el.hidden = k !== v; });
    document.body.dataset.view = v;
    if (v === 'pdp') { showPdp(p); scrollTo(0, 0); return; }
    document.title = `${S.brand.name} · ${S.brand.sub}`;
    if (v === 'coll') { const want = h.slice(11); filt = famOf(want) || want === EV.id ? want : 'all'; $('#cFind').value = ''; applyColl(); scrollTo(0, 0); return; }
    const t = h && h !== 'accueil' && document.getElementById(h);
    if (t) requestAnimationFrame(() => t.scrollIntoView({ behavior: was === 'home' ? 'smooth' : 'instant' }));
    else if (was !== 'home' || h === 'accueil') scrollTo({ top: 0, behavior: was === 'home' ? 'smooth' : 'instant' });
  };
  addEventListener('hashchange', route);

  /* ---------- Apparition douce au défilement (le contenu reste visible) ---------- */
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.body.classList.add('anim');
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -6% 0px' });
    $$('.at-fig, .at-copy, .pt-h, .look-img, .look-txt, .iv-copy, .card-inv').forEach((el) => { el.classList.add('rv'); io.observe(el); });
    setTimeout(() => $$('.rv').forEach((el) => el.classList.add('in')), 5000);
  }

  setSeg('all'); updBadge(); refreshPrices(); route();
  if (document.fonts) document.fonts.ready.then(() => setSeg(($('[data-seg][aria-selected="true"]') || {}).dataset?.seg || 'all'));
})();
