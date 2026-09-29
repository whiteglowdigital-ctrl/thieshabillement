/* ==========================================================================
   THIES HABILLEMENT — DONNÉES DU SITE
   --------------------------------------------------------------------------
   C'est le SEUL fichier à modifier pour adapter le site à un client.
   Structure du projet (système Jëfya) :
     index.html  → squelette vide (ne pas toucher)
     styles.css  → design system (ne pas toucher, sauf évolution du modèle)
     app.js      → moteur de rendu (ne pas toucher)
     content.js  → CE FICHIER : textes, couleurs, coordonnées, produits
     images/     → toutes les photos (voir images/README.md)

   Images : chaque visuel a un `src`. Laisser `src: null` affiche un
   emplacement "Visuel à venir" au bon format. Pour remplacer, déposer la
   photo dans images/ et renseigner son chemin, ex. src: 'images/hero.jpg'.

   `todo: true` = information NON confirmée. En mode prototype, un repère
   discret "À confirmer" s'affiche dessus. Passer `prototype: false` avant
   la mise en ligne.
   ========================================================================== */

window.SITE = {
  prototype: false,

  brand: {
    name: 'Thies Habillement',
    wordmark: 'THIÈS',                 // mot géant du hero
    wordmarkSub: 'HABILLEMENT',
    logoMark: 'images/logo-mark.png',  // pictogramme cintre + TH (masque, recoloré en CSS)
    // Signature présente sur le logo officiel du client
    tagline: 'Partenaire des grandes marques',
    activity: 'Confection · Homme & garçon',
    city: 'Thiès, Sénégal',
  },

  // Couleurs : modifier ici, tout le site suit.
  theme: {
    paper: '#e9e7e2',   // fond principal (gris chaud, cf. référence)
    paper2: '#f4f3f0',  // fond secondaire
    ink: '#121212',     // texte / noir
    accent: '#a92024',  // rouge du logo Thies Habillement
    muted: '#6d6a64',
  },

  contact: {
    // Numéro WhatsApp au format international, sans espaces ni +.
    // null = les boutons affichent un message "numéro à configurer".
    whatsapp: '221764052386',
    whatsappDisplay: '76 405 23 86',
    whatsappMessage: 'Bonjour Thies Habillement, je souhaite avoir des informations sur vos tenues.',
    phones: [],        // ex. ['77 000 00 00'] — n'afficher que les numéros confirmés
    email: null,
  },

  location: {
    area: 'Nguinth',
    city: 'Thiès, Sénégal',
    landmark: "En face de l'École ACAPES",
    mapsUrl: 'https://share.google/21wrojRrNSgoc38of',
    hours: [],         // ex. [{ d: 'Lun – Sam', h: '9h – 20h' }] — à fournir
    photo: { src: 'images/boutique.jpg', alt: 'Façade de la boutique Thies Habillement à Thiès, vitrine de tenues homme et garçon' },
  },

  socials: [
    { label: 'Google', url: 'https://share.google/21wrojRrNSgoc38of' },
    { label: 'Facebook', url: null, todo: true },
    { label: 'Instagram', url: null, todo: true },
  ],

  // Services affichés dans le bandeau d'engagements.
  // `show: false` masque un service tant qu'il n'est pas confirmé.
  services: [
    { icon: 'needle', title: 'Confection', text: 'Tenues confectionnées', show: true },
    { icon: 'hanger', title: 'Homme & garçon', text: 'Tenues africaines', show: true },
    { icon: 'chat', title: 'Commande WhatsApp', text: 'Réponse directe de la boutique', show: true },
    { icon: 'truck', title: 'Livraison', text: 'Renseignez-vous sur WhatsApp', show: true, todo: true },
    { icon: 'pin', title: 'Boutique', text: 'Nguinth, Thiès', show: false },
  ],

  nav: [
    { label: 'Collection', href: '#collection' },
    { label: 'La maison', href: '#maison' },
    { label: 'Savoir-faire', href: '#savoir-faire' },
    { label: 'Lookbook', href: '#lookbook' },
    { label: 'Boutique', href: '#boutique' },
  ],

  hero: {
    kicker: ['Partenaire', 'des grandes', 'marques'],
    // Idéal : photo détourée (PNG transparent) d'un mannequin en pied,
    // ~1400 px de haut. Une photo classique en portrait fonctionne aussi.
    image: { src: 'images/hero-boubou-blanc.webp', alt: 'Grand boubou blanc à plastron brodé sur mannequin', cutout: true, ratio: '733 / 1047' },
    ctaPrimary: { label: 'Voir la collection', href: '#collection' },
    ctaSecondary: { label: 'Commander sur WhatsApp', whatsapp: true },
    corner: ['Confection', 'Homme & garçon', 'Thiès'],
  },

  intro: {
    image: { src: 'images/maison-buste.jpg', alt: 'Buste de couture drapé de satin rouge, monogramme TH' },
    image2: { src: 'images/atelier-metre.jpg', alt: 'Mètre ruban et fil noir sur un tissu noir' },
    kicker: 'La maison',
    text: 'Thies Habillement confectionne et fournit des tenues africaines pour homme et garçon, depuis sa boutique de Nguinth, à Thiès.',
    todo: false,
  },

  // Catégories confirmées par le client : homme et enfant (garçon).
  collections: [
    { title: 'Homme', text: 'Grands boubous, ensembles et tenues brodées.', image: { src: 'images/boubou-vert.jpg', alt: "Grand boubou vert d'eau brodé" } },
    { title: 'Garçon', text: 'Ensembles brodés pour enfant.', image: { src: 'images/garcon-bleu-roi.jpg', alt: 'Ensemble garçon bleu roi brodé' } },
  ],

  // Pièces : aucun prix affiché. Chaque carte ouvre WhatsApp avec le nom de la pièce.
  selection: {
    title: 'La sélection',
    // L'accueil affiche ces pièces (dans cet ordre) ; la page Collection les affiche toutes.
    home: ['Grand boubou blanc brodé', 'Ensemble bleu nuit', 'Grand boubou doré', 'Ensemble blanc col officier', "Grand boubou vert d'eau", 'Grand boubou bleu ciel', 'Ensemble garçon noir', 'Ensemble garçon bleu roi'],
    moreLabel: 'Voir toute la collection',
    pageTitle: 'La collection',
    pageIntro: 'Grands boubous, ensembles brodés et tenues pour garçon. Choisissez une pièce, la boutique vous répond sur WhatsApp.',
    items: [
      { name: 'Grand boubou blanc brodé', category: 'Homme', image: { src: 'images/boubou-blanc.jpg', alt: 'Grand boubou blanc à plastron brodé' } },
      { name: 'Ensemble bleu nuit', category: 'Homme', image: { src: 'images/kaftan-marine.jpg', alt: 'Ensemble bleu nuit à bande brodée' } },
      { name: 'Grand boubou doré', category: 'Homme', image: { src: 'images/boubou-or.jpg', alt: 'Grand boubou doré brodé' } },
      { name: 'Ensemble blanc col officier', category: 'Homme', image: { src: 'images/kaftan-blanc.jpg', alt: 'Ensemble blanc col officier à bande brodée' } },
      { name: "Grand boubou vert d'eau", category: 'Homme', image: { src: 'images/boubou-vert.jpg', alt: "Grand boubou vert d'eau brodé" } },
      { name: 'Ensemble blanc brodé', category: 'Homme', image: { src: 'images/ensemble-blanc.jpg', alt: 'Ensemble blanc brodé' } },
      { name: 'Grand boubou bleu ciel', category: 'Homme', image: { src: 'images/boubou-bleu.jpg', alt: 'Grand boubou bleu ciel brodé' } },
      { name: 'Ensemble taupe', category: 'Homme', image: { src: 'images/ensemble-taupe.jpg', alt: 'Ensemble taupe à pan croisé' } },
      { name: 'Ensemble garçon noir', category: 'Garçon', image: { src: 'images/garcon-noir.jpg', alt: 'Ensemble garçon noir à broderie dorée' } },
      { name: 'Ensemble garçon bleu roi', category: 'Garçon', image: { src: 'images/garcon-bleu-roi.jpg', alt: 'Ensemble garçon bleu roi brodé' } },
    ],
  },

  craft: {
    kicker: 'Savoir-faire',
    title: ['Confection'],
    text: "Entreprise de confection et fournisseur de tenues africaines, Thies Habillement vous reçoit à Nguinth pour choisir ou commander votre tenue.",
    todo: true, // texte à valider avec le client (atelier, sur-mesure, délais)
    cta: { label: 'Demander une information', whatsapp: true },
    image: { src: 'images/atelier-couture.jpg', alt: 'Couture à la machine sur un tissu noir' },
    image2: { src: 'images/craft-boubou-or.jpg', alt: 'Plastron brodé d’un grand boubou doré' },
  },

  lookbook: {
    kicker: 'Lookbook',
    title: 'Les tenues de la maison',
    looks: [
      { caption: "Grand boubou vert d'eau", image: { src: 'images/boubou-vert.jpg', alt: "Grand boubou vert d'eau" } },
      { caption: 'Plastron brodé', image: { src: 'images/boubou-bleu-large.jpg', alt: 'Grand boubou bleu ciel, plastron brodé' }, wide: true },
      { caption: 'Ensemble noir brodé or', image: { src: 'images/ensemble-noir.jpg', alt: 'Ensemble noir à broderie dorée' } },
      { caption: 'Ensemble taupe', image: { src: 'images/ensemble-taupe.jpg', alt: 'Ensemble taupe' } },
      { caption: 'Grand boubou doré', image: { src: 'images/boubou-or.jpg', alt: 'Grand boubou doré' } },
      { caption: 'Ensemble blanc', image: { src: 'images/ensemble-blanc.jpg', alt: 'Ensemble blanc brodé' } },
    ],
  },

  whatsappBand: {
    image: { src: 'images/atelier-ciseaux.jpg', alt: 'Cintre monogramme TH doré et ciseaux de tailleur sur velours bordeaux' },
    kicker: 'Commande & informations',
    title: ['Une tenue', 'vous plaît ?'],
    text: 'Envoyez-nous le modèle qui vous intéresse, la boutique vous répond directement sur WhatsApp.',
    cta: 'Écrire sur WhatsApp',
  },

  footer: {
    credit: 'Réalisé par Jëfya',
    note: 'Photos fournies par le client ; emplacements « Visuel à venir » à compléter.',
  },
};
