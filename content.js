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
  prototype: true,

  brand: {
    name: 'Thies Habillement',
    wordmark: 'THIÈS',                 // mot géant du hero
    wordmarkSub: 'HABILLEMENT',
    logoMark: 'images/logo-mark.png',  // pictogramme cintre + TH (masque, recoloré en CSS)
    // Signature présente sur le logo officiel du client
    tagline: 'Partenaire des grandes marques',
    activity: 'Confection & tenues africaines',
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
    // ⚠ Numéro WhatsApp NON CONFIRMÉ. Format international sans espaces ni +,
    // ex. '221776172203'. Tant que null, les boutons affichent un message.
    whatsapp: null,
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
    photo: { src: 'images/boutique.jpg', alt: 'Façade de la boutique Thies Habillement à Thiès' },
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
    { icon: 'hanger', title: 'Tenues africaines', text: 'Fournisseur à Thiès', show: true },
    { icon: 'chat', title: 'Commande WhatsApp', text: 'Réponse directe de la boutique', show: true },
    { icon: 'truck', title: 'Livraison', text: 'Modalités à préciser', show: true, todo: true },
    { icon: 'pin', title: 'Boutique', text: 'Nguinth, Thiès', show: false },
  ],

  nav: [
    { label: 'Collections', href: '#collections' },
    { label: 'Sélection', href: '#selection' },
    { label: 'Savoir-faire', href: '#savoir-faire' },
    { label: 'Lookbook', href: '#lookbook' },
    { label: 'Boutique', href: '#boutique' },
  ],

  hero: {
    kicker: ['Partenaire', 'des grandes', 'marques'],
    // Idéal : photo détourée (PNG transparent) d'un mannequin en pied,
    // ~1400 px de haut. Une photo classique en portrait fonctionne aussi.
    image: { src: null, alt: 'Tenue Thies Habillement portée', label: 'Silhouette en pied · PNG détouré' },
    ctaPrimary: { label: 'Découvrir', href: '#collections' },
    ctaSecondary: { label: 'Commander sur WhatsApp', whatsapp: true },
    corner: ['Confection', 'Tenues africaines', 'Thiès'],
  },

  intro: {
    kicker: 'La maison',
    text: 'Thies Habillement confectionne et fournit des tenues africaines depuis sa boutique de Nguinth, à Thiès.',
    todo: false,
  },

  // Catégories : structure proposée d'après la vitrine (homme, femme, enfant).
  collections: [
    { title: 'Homme', text: 'Tenues africaines pour homme.', image: { src: null, label: 'Homme · 4:5' }, todo: true },
    { title: 'Femme', text: 'Tenues africaines pour femme.', image: { src: null, label: 'Femme · 4:5' }, todo: true },
    { title: 'Enfant', text: 'Tenues africaines pour enfant.', image: { src: null, label: 'Enfant · 4:5' }, todo: true },
  ],

  // Pièces : aucun prix affiché. Chaque carte ouvre WhatsApp avec le nom de la pièce.
  selection: {
    title: 'La sélection',
    items: [
      { name: 'Modèle 01', category: 'Homme', image: { src: null, label: 'Pièce · 3:4' } },
      { name: 'Modèle 02', category: 'Homme', image: { src: null, label: 'Pièce · 3:4' } },
      { name: 'Modèle 03', category: 'Femme', image: { src: null, label: 'Pièce · 3:4' } },
      { name: 'Modèle 04', category: 'Enfant', image: { src: null, label: 'Pièce · 3:4' } },
      { name: 'Modèle 05', category: 'Femme', image: { src: null, label: 'Pièce · 3:4' } },
      { name: 'Modèle 06', category: 'Homme', image: { src: null, label: 'Pièce · 3:4' } },
      { name: 'Modèle 07', category: 'Homme', image: { src: null, label: 'Pièce · 3:4' } },
      { name: 'Modèle 08', category: 'Femme', image: { src: null, label: 'Pièce · 3:4' } },
    ],
  },

  craft: {
    kicker: 'Savoir-faire',
    title: ['CONFEC', 'TION'],
    text: "Entreprise de confection et fournisseur de tenues africaines, Thies Habillement vous reçoit à Nguinth pour choisir ou commander votre tenue.",
    todo: true, // texte à valider avec le client (atelier, sur-mesure, délais)
    cta: { label: 'Demander une information', whatsapp: true },
    image: { src: null, alt: 'Détail de confection', label: 'Détail de couture · portrait 4:5' },
    image2: { src: null, alt: 'Atelier', label: 'Atelier · 1:1' },
  },

  lookbook: {
    kicker: 'Lookbook',
    title: 'Portées à Thiès',
    looks: [
      { caption: 'Look 01', image: { src: null, label: 'Look · 2:3' } },
      { caption: 'Look 02', image: { src: null, label: 'Look · 3:2' }, wide: true },
      { caption: 'Look 03', image: { src: null, label: 'Look · 2:3' } },
      { caption: 'Look 04', image: { src: null, label: 'Look · 2:3' } },
      { caption: 'Look 05', image: { src: null, label: 'Look · 2:3' } },
    ],
  },

  whatsappBand: {
    kicker: 'Commande & informations',
    title: ['Une tenue', 'vous plaît ?'],
    text: 'Envoyez-nous le modèle qui vous intéresse, la boutique vous répond directement sur WhatsApp.',
    cta: 'Écrire sur WhatsApp',
  },

  footer: {
    credit: 'Prototype réalisé par Jëfya',
    note: 'Visuels de démonstration : les emplacements photo sont à remplacer par les photos de la boutique.',
  },
};
