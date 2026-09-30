/* ==========================================================================
   Moteur de rendu — modèle "Maison de mode" Jëfya
   Lit window.SITE (content.js) et construit la page. Ne contient aucune
   donnée client : tout changement de contenu se fait dans content.js.
   ========================================================================== */
(function () {
  const S = window.SITE;
  const root = document.getElementById('site');
  const slug = (v) => String(v).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-');
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
  I.search = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m20 20-4.8-4.8"/></svg>';
  I.close = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>';
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
  const O = S.order;
  const fmtPrice = (n) => `${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} ${O.currency}`;
  const modelHref = (p) => `#modele-${p.ref}`;

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
      <a class="icon-link" href="#collection" data-search-open aria-label="Rechercher un modèle">${I.search}<span>Rechercher</span></a>
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
    ? `<div class="hero-figure media ${H.image.cutout ? 'cutout' : ''}" style="--ratio:${esc(H.image.ratio || '5 / 8')}"><img src="${esc(H.image.src)}" alt="${esc(H.image.alt)}" fetchpriority="high" decoding="async"></div>`
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
      <a class="link" href="${H.ctaSecondary.href}" data-search-open>${esc(H.ctaSecondary.label)} <span class="arr">→</span></a>
    </div>
    <p class="hero-corner caps">${H.corner.map((k) => `<span>${esc(k)}</span>`).join('')}<span class="rule"></span></p>
  </div></section>`;

  const search = `
  <section class="finder" id="recherche" aria-label="Rechercher un modèle"><div class="wrap">
    <label class="finder-label" for="finderInput">${esc(O.searchLabel)}</label>
    <form class="finder-box" id="finderForm" role="search" autocomplete="off">
      ${I.search}
      <input id="finderInput" type="search" inputmode="search" enterkeyhint="search" placeholder="${esc(O.searchPlaceholder)}">
      <button type="submit" class="finder-go">Voir le modèle</button>
    </form>
    <div class="finder-results" id="finderResults" role="listbox" hidden></div>
  </div></section>`;

  const cats = `
  <section class="cats on-ink" id="collections" aria-label="Collections"><div class="wrap" style="--n:${S.collections.length}">
    ${S.collections.map((c) => `
    <article class="cat">
      ${media(c.image, 'rv-img')}
      <div>
        <h3>${esc(c.title)}</h3>
        <p>${esc(c.text)}</p>
        <a class="link" href="#collection-${slug(c.title)}">Voir ${esc(c.title.toLowerCase())} <span class="arr">→</span></a>
        <div style="margin-top:12px">${todo(c.todo, 'Catégorie à confirmer')}</div>
      </div>
    </article>`).join('')}
  </div></section>`;

  const intro = `
  <section class="intro on-ink" id="maison"><div class="wrap">
    ${media(S.intro.image, 'intro-main rv-img')}
    <div class="intro-body">
      <div class="intro-side"><span class="mark" aria-hidden="true"></span><span class="caps">${esc(S.intro.kicker)}</span></div>
      <div class="rv">
        <p class="big">${esc(S.intro.text).replace('homme et garçon', '<em>homme et garçon</em>')}</p>
        <p class="sig">${esc(S.brand.tagline)}</p>
      </div>
      ${S.intro.image2 ? media(S.intro.image2, 'intro-second') : ''}
    </div>
  </div></section>`;

  const SEL = S.selection;
  const cardHTML = (p) => `
      <article class="card rv" data-cat="${esc(p.category)}">
        <a class="card-link" href="${modelHref(p)}" aria-label="Modèle ${esc(p.ref)} — ${esc(p.name)}, ${esc(fmtPrice(p.price))}">
          ${media(p.image, '', '<span class="card-view" aria-hidden="true">Voir le modèle</span>')}
          <div class="card-meta">
            <h3>Modèle ${esc(p.ref)}</h3>
            <span class="card-price">${esc(fmtPrice(p.price))}<sup>*</sup></span>
          </div>
          <p class="card-name">${esc(p.name)} · ${esc(p.category)}</p>
        </a>
      </article>`;
  const priceFoot = `<p class="price-foot">${esc(O.priceNote)}</p>`;
  const selection = `
  <section class="selection" id="selection"><div class="wrap">
    <div class="shead">
      <h2>${esc(SEL.title)}</h2>
      <a class="link" href="#collection">${esc(SEL.moreLabel)} <span class="arr">→</span></a>
    </div>
    <div class="grid">${(SEL.home ? SEL.home.map((n) => SEL.items.find((i) => i.name === n)).filter(Boolean) : SEL.items.slice(0, 8)).map(cardHTML).join('')}</div>
    ${priceFoot}
  </div></section>`;

  /* ---------- Page Collection (vue séparée, route #collection) ---------- */
  const catList = ['Tout', ...new Set(SEL.items.map((i) => i.category))];
  const countOf = (c) => (c === 'Tout' ? SEL.items.length : SEL.items.filter((i) => i.category === c).length);
  const collectionPage = `
  <main class="cpage" id="cpage" hidden>
    <section class="cpage-head"><div class="wrap">
      <nav class="crumbs caps caps-sm" aria-label="Fil d'Ariane"><a href="#top">Accueil</a><span>/</span><span>${esc(SEL.pageTitle)}</span></nav>
      <div class="cpage-title">
        <h1>${esc(SEL.pageTitle)}</h1>
        <p>${esc(SEL.pageIntro)}</p>
      </div>
    </div></section>
    ${search}
    <div class="cbar"><div class="wrap">
      <div class="filters" role="group" aria-label="Filtrer par catégorie">${catList.map((c, i) => `<button type="button" aria-pressed="${i === 0}" data-cat="${esc(c)}">${esc(c)} <small>${countOf(c)}</small></button>`).join('')}</div>
      <span class="caps caps-sm cbar-count" id="ccount">${SEL.items.length} pièces</span>
    </div></div>
    <section class="cpage-grid"><div class="wrap"><div class="grid" id="cgrid">${SEL.items.map(cardHTML).join('')}</div>${priceFoot}</div></section>
    <section class="cpage-cta on-ink"><div class="wrap">
      <p>${esc(S.whatsappBand.text)}</p>
      <a class="btn btn--accent" ${waAttrs()}>${I.chat}${esc(S.whatsappBand.cta)}</a>
    </div></section>
  </main>`;

  /* ---------- Fiche modèle (route #modele-0021) ---------- */
  const modelPage = `
  <main class="mpage" id="mpage" hidden>
    <div class="wrap mpage-wrap">
      <nav class="crumbs caps caps-sm" aria-label="Fil d'Ariane"><a href="#top">Accueil</a><span>/</span><a href="#collection">${esc(SEL.pageTitle)}</a><span>/</span><span id="mCrumb"></span></nav>
      <div class="mpage-grid">
        <div class="mpage-media media" id="mMedia"></div>
        <div class="mpage-info">
          <p class="caps caps-sm mpage-cat" id="mCat"></p>
          <h1 class="mpage-title" id="mTitle"></h1>
          <p class="mpage-name" id="mName"></p>
          <p class="mpage-price"><span id="mPrice"></span><sup>*</sup></p>
          <p class="mpage-note">${esc(O.priceNote)}</p>
          <fieldset class="sizes" id="mSizes">
            <legend class="caps caps-sm">Taille <span class="sizes-err" id="mSizeErr" hidden>Choisissez une taille</span></legend>
            <div class="sizes-row">${O.sizes.map((z, i) => `<label class="size"><input type="radio" name="size" value="${esc(z)}" id="size-${i}"><span>${esc(z)}</span></label>`).join('')}</div>
          </fieldset>
          <button type="button" class="btn btn--accent mpage-cta" data-order-open>Commander ce modèle</button>
          <ul class="mpage-points">
            ${O.delivery.map((d) => `<li><b>${esc(d.label)}</b> — ${esc(d.detail)}</li>`).join('')}
          </ul>
          <a class="link mpage-back" href="#collection"><span class="arr">←</span> Voir toute la collection</a>
        </div>
      </div>
    </div>
  </main>`;

  const drawer = `
  <div class="sheet" id="sheet" hidden>
    <div class="sheet-backdrop" data-sheet-close></div>
    <form class="sheet-panel" id="orderForm" role="dialog" aria-modal="true" aria-labelledby="sheetTitle" novalidate>
      <span class="sheet-grip" aria-hidden="true"></span>
      <div class="sheet-head">
        <div>
          <p class="caps caps-sm" id="sheetMeta"></p>
          <h2 id="sheetTitle">Votre commande</h2>
        </div>
        <button type="button" class="sheet-x" data-sheet-close aria-label="Fermer">${I.close}</button>
      </div>
      <div class="field">
        <label for="fName">Prénom & Nom</label>
        <input id="fName" name="name" type="text" autocomplete="name" required placeholder="Ex : Moussa Ndiaye">
        <span class="field-err">Indiquez votre nom</span>
      </div>
      <div class="field">
        <label for="fCity">Ville / Quartier</label>
        <input id="fCity" name="city" type="text" autocomplete="address-level2" required placeholder="Ex : Thiès, Nguinth">
        <span class="field-err">Indiquez votre ville ou quartier</span>
      </div>
      <fieldset class="field">
        <legend>Récupération</legend>
        <div class="opts">
          ${O.delivery.map((d, i) => `<label class="opt"><input type="radio" name="delivery" value="${esc(d.id)}" ${i === 0 ? 'checked' : ''}><span><b>${esc(d.label)}</b><small>${esc(d.detail)}</small></span></label>`).join('')}
        </div>
      </fieldset>
      <div class="field">
        <label for="fNote">Note / Personnalisation <small>(facultatif)</small></label>
        <textarea id="fNote" name="note" rows="2" placeholder="Ex : même modèle en tissu bleu nuit"></textarea>
      </div>
      <button type="submit" class="btn btn--accent sheet-send">${I.chat}Envoyer ma commande sur WhatsApp</button>
      <p class="sheet-foot">WhatsApp s'ouvre avec votre message déjà rédigé : il ne reste qu'à l'envoyer.</p>
    </form>
  </div>`;

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
  <section class="wa on-ink" id="whatsapp">${W.image ? media(W.image, 'wa-img') : ''}<div class="wrap">
    <div><span class="caps">${esc(W.kicker)}</span><h2 class="rv">${W.title.map((w) => `<span>${esc(w)}</span>`).join('')}</h2></div>
    <div class="wa-side">
      <p>${esc(W.text)}</p>
      <a class="btn btn--accent" ${waAttrs()}>${I.chat}${esc(W.cta)}</a>
      <div class="wa-num">${S.contact.whatsapp ? `WhatsApp · ${esc(S.contact.whatsappDisplay || '+' + S.contact.whatsapp)}` : todo(true, 'Numéro WhatsApp à confirmer')}</div>
    </div>
  </div></section>`;

  const hours = L.hours && L.hours.length
    ? L.hours.map((h) => `${esc(h.d)} · ${esc(h.h)}`).join('<br>')
    : `<span style="color:var(--muted)">Nous consulter</span> ${todo(true, 'Horaires à fournir')}`;
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
        <dt class="caps caps-sm">Contact</dt><dd>${S.contact.whatsapp ? `<a ${waAttrs()}>WhatsApp · ${esc(S.contact.whatsappDisplay || S.contact.whatsapp)}</a>` : `WhatsApp ${todo(true, 'Numéro à confirmer')}`}${S.contact.phones.length ? '<br>' + S.contact.phones.map(esc).join('<br>') : ''}</dd>
      </dl>
      <div class="shop-btns">
        <a class="btn" href="${esc(L.mapsUrl)}" target="_blank" rel="noopener">${I.pin}Itinéraire</a>
        <a class="btn btn--ghost" ${waAttrs('Bonjour, je souhaite passer à la boutique.')}>${I.chat}Nous écrire</a>
      </div>
    </div>
  </div></section>`;

  const social = S.socials.filter((s) => s.url || S.prototype).map((s) => (s.url
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

  const mbar = `<div class="mbar" id="mbar"><button type="button" class="btn btn--accent" data-order-open>Commander ce modèle</button></div>`;
  const chip = S.prototype ? `<button class="proto-chip" id="protoChip" type="button" aria-pressed="true"><i></i>Repères prototype</button>` : '';

  const loaderOn = S.loader && S.loader.duration > 0 && !matchMedia('(prefers-reduced-motion: reduce)').matches;
  const loader = loaderOn ? `
  <div class="loader" id="loader" role="presentation">
    <div class="loader-inner">
      <span class="loader-mark" aria-hidden="true"></span>
      <p class="loader-word">${[...S.brand.wordmark].map((c, i) => `<span style="--i:${i}">${esc(c)}</span>`).join('')}</p>
      <p class="loader-sub">${esc(S.brand.wordmarkSub)}</p>
      <span class="loader-line" aria-hidden="true"><i></i></span>
      <p class="loader-sig">${esc(S.brand.tagline)}</p>
    </div>
  </div>` : '';

  root.innerHTML = loader + topbar + header + menu + '<main id="home">' + hero + cats + selection + intro + craft + services + lookbook + wa + shop + '</main>' + collectionPage + modelPage + footer + mbar + drawer + chip + '<div class="toast" id="toast" role="status"></div>';
  if (S.prototype) document.body.classList.add('show-todo');

  // Écran d'entrée : bloque le hero, puis s'ouvre vers le haut
  if (loaderOn) {
    const L_ = document.getElementById('loader');
    document.body.classList.add('is-loading');
    document.documentElement.style.setProperty('--load-ms', S.loader.duration + 'ms');
    let done = false;
    const finish = () => {
      if (done) return; done = true;
      L_.classList.add('out');
      document.body.classList.remove('is-loading');
      setTimeout(() => L_.remove(), 1100);
    };
    setTimeout(finish, S.loader.duration);
    L_.addEventListener('click', finish);
  }

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
    mb.classList.toggle('on', !mpage.hidden && y > 280);
  }, { passive: true });

  // Filtres de la page Collection
  const setFilter = (cat) => {
    $$('.filters button').forEach((b) => b.setAttribute('aria-pressed', b.dataset.cat === cat));
    $$('#cgrid .card').forEach((c) => { c.hidden = !(cat === 'Tout' || c.dataset.cat === cat); });
    $('#ccount').textContent = `${countOf(cat)} pièce${countOf(cat) > 1 ? 's' : ''}`;
  };
  $$('.filters button').forEach((b) => b.addEventListener('click', () => setFilter(b.dataset.cat)));

  // Routage : #collection (et #collection-homme…) = page Collection, le reste = accueil
  const home = $('#home'); const cpage = $('#cpage'); const mpage = $('#mpage');
  let current = null;
  const findModel = (ref) => SEL.items.find((i) => i.ref === ref);
  const showModel = (p) => {
    current = p;
    $('#mMedia').innerHTML = `<img src="${esc(p.image.src)}" alt="${esc(p.image.alt || p.name)}">`;
    $('#mCrumb').textContent = `Modèle ${p.ref}`;
    $('#mCat').textContent = p.category;
    $('#mTitle').textContent = `Modèle ${p.ref}`;
    $('#mName').textContent = p.name;
    $('#mPrice').textContent = fmtPrice(p.price);
    $$('#mSizes input').forEach((r) => { r.checked = false; });
    $('#mSizeErr').hidden = true; $('#mSizes').classList.remove('err');
    document.title = `Modèle ${p.ref} — ${S.brand.name}`;
  };
  const route = () => {
    const h = location.hash.slice(1);
    const isC = h === 'collection' || h.startsWith('collection-');
    const model = h.startsWith('modele-') ? findModel(h.slice(7)) : null;
    const wasAway = !cpage.hidden || !mpage.hidden;
    home.hidden = isC || !!model; cpage.hidden = !isC; mpage.hidden = !model;
    document.body.classList.toggle('on-collection', isC);
    document.body.classList.toggle('on-model', !!model);
    if (!model) { document.title = S.brand.name; closeSheet(); }
    mb.classList.remove('on');
    if (model) {
      showModel(model);
      scrollTo({ top: 0, behavior: 'instant' });
    } else if (isC) {
      const want = h.slice('collection-'.length);
      setFilter(catList.find((c) => slug(c) === want) || 'Tout');
      scrollTo({ top: 0, behavior: 'instant' });
    } else if (wasAway) {
      const t = h && document.getElementById(h);
      requestAnimationFrame(() => (t ? t.scrollIntoView() : scrollTo({ top: 0, behavior: 'instant' })));
    }
    upd && upd();
  };
  addEventListener('hashchange', route);

  /* ---------- Recherche par numéro de modèle ---------- */
  const norm = (v) => String(v).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  const digitsOf = (v) => (String(v).match(/\d+/) || [''])[0];
  const matchModels = (q) => {
    const n = norm(q).replace(/^(modele|model|mod|ref|n°|no|#)\s*/, '');
    if (!n) return [];
    const d = digitsOf(n);
    return SEL.items.filter((p) => {
      if (d) return p.ref.includes(d) || String(Number(p.ref)) === String(Number(d));
      return norm(p.name).includes(n) || norm(p.category).includes(n);
    });
  };
  const exactModel = (q) => { const d = digitsOf(q); return d ? SEL.items.find((p) => Number(p.ref) === Number(d)) : null; };
  const fInput = $('#finderInput'); const fRes = $('#finderResults');
  const renderResults = () => {
    const q = fInput.value;
    if (!q.trim()) { fRes.hidden = true; fRes.innerHTML = ''; return; }
    const list = matchModels(q);
    fRes.hidden = false;
    fRes.innerHTML = list.length
      ? list.slice(0, 5).map((p) => `<a class="finder-item" role="option" href="${modelHref(p)}"><img src="${esc(p.image.src)}" alt=""><span><b>Modèle ${esc(p.ref)}</b><small>${esc(p.name)}</small></span><em>${esc(fmtPrice(p.price))}*</em></a>`).join('')
      : `<div class="finder-empty">Aucun modèle ne correspond à « ${esc(q.trim())} ». <a ${waAttrs(`Bonjour, je cherche le modèle ${q.trim()} vu sur vos réseaux.`)}>Envoyez-nous la capture sur WhatsApp</a>.</div>`;
  };
  fInput.addEventListener('input', renderResults);
  $('#finderForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const p = exactModel(fInput.value) || (matchModels(fInput.value).length === 1 ? matchModels(fInput.value)[0] : null);
    if (p) { location.hash = modelHref(p); fInput.blur(); } else renderResults();
  });
  $$('[data-search-open]').forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault();
    // La recherche vit sur la page Collection : on y va, puis on place le curseur dans le champ
    const go = () => { setTimeout(() => fInput.focus({ preventScroll: true }), 120); };
    if (!cpage.hidden) { scrollTo({ top: 0, behavior: 'smooth' }); go(); }
    else { history.pushState(null, '', '#collection'); route(); go(); }
  }));

  /* ---------- Tiroir de commande + message WhatsApp ---------- */
  const sheet = $('#sheet'); const form = $('#orderForm');
  let lastFocus = null;
  const chosenSize = () => { const r = $('#mSizes input:checked'); return r ? r.value : ''; };
  const openSheet = () => {
    if (!current) return;
    const size = chosenSize();
    if (!size) {
      $('#mSizeErr').hidden = false; $('#mSizes').classList.add('err');
      $('#mSizes').scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    $('#sheetMeta').textContent = `Modèle ${current.ref} · Taille ${size} · ${fmtPrice(current.price)}*`;
    lastFocus = document.activeElement;
    sheet.hidden = false;
    requestAnimationFrame(() => sheet.classList.add('open'));
    document.body.style.overflow = 'hidden';
    setTimeout(() => $('#fName').focus({ preventScroll: true }), 350);
  };
  function closeSheet() {
    if (!sheet || sheet.hidden) return;
    sheet.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => { sheet.hidden = true; }, 380);
    if (lastFocus) lastFocus.focus({ preventScroll: true });
  }
  $$('[data-order-open]').forEach((b) => b.addEventListener('click', openSheet));
  $$('[data-sheet-close]').forEach((b) => b.addEventListener('click', closeSheet));
  addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSheet(); });
  $$('#mSizes input').forEach((r) => r.addEventListener('change', () => { $('#mSizeErr').hidden = true; $('#mSizes').classList.remove('err'); }));

  const buildMessage = (d) => [
    `Bonjour ${S.brand.name.replace('Thies', 'Thiès')} ! Je souhaite commander le Modèle ${current.ref}.`,
    '',
    'Mes informations :',
    `- Nom : ${d.name}`,
    `- Taille : ${d.size}`,
    `- Mode de récupération : ${d.delivery}`,
    `- Ville/Adresse : ${d.city}`,
    `- Note/Demande : ${d.note || 'Aucune'}`,
    '',
    'Merci de me confirmer la disponibilité et les modalités de paiement.',
  ].join('\n');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let ok = true;
    ['fName', 'fCity'].forEach((id) => {
      const el = $('#' + id); const bad = !el.value.trim();
      el.closest('.field').classList.toggle('err', bad);
      if (bad && ok) { el.focus(); ok = false; }
    });
    if (!ok) return;
    const opt = O.delivery.find((x) => x.id === form.delivery.value) || O.delivery[0];
    const msg = buildMessage({
      name: $('#fName').value.trim(),
      city: $('#fCity').value.trim(),
      size: chosenSize(),
      delivery: `${opt.label} (${opt.detail})`,
      note: $('#fNote').value.trim(),
    });
    if (!S.contact.whatsapp) { say('Numéro WhatsApp non configuré (content.js → contact.whatsapp).'); return; }
    const url = `https://wa.me/${S.contact.whatsapp}?text=${encodeURIComponent(msg)}`;
    // Lien réel cliqué pendant le geste de l'utilisateur : ouvre l'app WhatsApp sur mobile, un onglet sur ordinateur
    const a = document.createElement('a');
    a.href = url; a.target = '_blank'; a.rel = 'noopener';
    document.body.appendChild(a); a.click(); a.remove();
    say('WhatsApp s\'ouvre avec votre commande. Il ne reste qu\'à appuyer sur Envoyer.');
  });
  $$('#fName, #fCity').forEach((el) => el.addEventListener('input', () => el.closest('.field').classList.remove('err')));

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
  route();

  // Repères prototype
  const chipEl = $('#protoChip');
  if (chipEl) chipEl.addEventListener('click', () => { const on = document.body.classList.toggle('show-todo'); chipEl.setAttribute('aria-pressed', on); });
})();
