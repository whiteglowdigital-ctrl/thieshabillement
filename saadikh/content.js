/* ==========================================================================
   SAADIKH (STAM by Fall) — DONNÉES DU SITE
   --------------------------------------------------------------------------
   Seul fichier à modifier : textes, catalogue, prix, coordonnées.
   Le moteur (app.js) ne contient aucune donnée.

   Prix saisis en F CFA (EXEMPLES, à remplacer). L'euro suit la parité fixe,
   le dollar le taux indiqué dans `currencies`.

   Confirmé : logo de l'enseigne, slogan, WhatsApp 78 895 25 55, boutique
   à Sicap Foire (Jardin Boussoura), sur-mesure à distance, diaspora,
   familles deux pièces / trois pièces.
   À valider : noms des modèles, prix, matières, tenues « grands événements ».
   ========================================================================== */

window.SITE = {
  version: 21, // à augmenter après chaque changement d'images

  brand: {
    name: 'Saadikh',
    sub: 'STAM by Fall',
    tagline: 'Quand c’est élégant, c’est Saadikh',
    signature: 'Traditionnellement vôtre',   // signature manuscrite du sac de la boutique
  },

  contact: {
    whatsapp: '221788952555',
    whatsappDisplay: '78 895 25 55',
  },

  address: { line1: 'Sicap Foire', line2: 'Jardin Boussoura', city: 'Dakar, Sénégal' },

  // Liens ajoutés quand le client les donnera : pour l'instant, noms seuls
  socials: ['TikTok', 'Instagram', 'Facebook'],

  currencies: {
    default: 'XOF',
    list: [
      { code: 'XOF', label: 'F CFA', perUnit: 1, suffix: ' F CFA' },
      { code: 'EUR', label: '€', perUnit: 655.957, suffix: ' €' },
      { code: 'USD', label: '$', perUnit: 600, prefix: '$' },
    ],
    note: 'Prix en € et en $ donnés à titre indicatif, convertis depuis le franc CFA.',
  },

  sizes: ['S', 'M', 'L', 'XL', 'XXL', 'Sur-mesure'],

  families: [
    { id: 'deux', label: 'Deux pièces', text: 'La tunique et son pantalon assorti. Sobre et net, pour le vendredi comme pour tous les jours.' },
    { id: 'trois', label: 'Trois pièces', text: 'L’ensemble complet, avec pantalon ou thiaya. Brodé et ample, pour les jours qui comptent.' },
  ],

  // Catalogue. ref = numéro du modèle. events = proposé dans « Grands événements ».
  products: [
    { ref: '006', name: 'Thiaya Bleu Roi', family: 'trois', events: true, price: 120000, color: 'Bleu roi', hex: '#22346f', fabric: 'Bazin rayé', img: 'images/tenues/trois-pieces-thiaya-bleu-roi.webp', detail: 'Grand boubou à plastron brodé en rosace, porté sur sa thiaya assortie.' },
    { ref: '005', name: 'Blanc & Or', family: 'trois', events: true, price: 95000, color: 'Blanc', hex: '#efeae0', fabric: 'Bazin blanc', img: 'images/tenues/boubou-blanc-brode.webp', detail: 'Blanc lumineux, galon doré au col et le long de la patte, broderie aux poignets.' },
    { ref: '004', name: 'Satin Argent', family: 'trois', events: true, price: 90000, color: 'Argent', hex: '#bfc1c3', fabric: 'Satin', img: 'images/tenues/boubou-satin-argent.webp', detail: 'Satin argenté, patte brodée de fins motifs, fentes latérales.' },
    { ref: '007', name: 'Vert Bouteille', family: 'trois', events: true, price: 75000, color: 'Vert bouteille', hex: '#1e4a40', fabric: 'Tissu satiné', img: 'images/tenues/trois-pieces-vert-bouteille.webp', detail: 'Col rond passepoilé d’argent, patte brodée de petits épis.' },
    { ref: '003', name: 'Bleu Nuit Brodé', family: 'trois', events: false, price: 70000, color: 'Bleu nuit', hex: '#1c2340', fabric: 'Coton fin', img: 'images/tenues/ensemble-bleu-nuit.webp', detail: 'Tunique à broderie argentée au plastron, avec son sarouel assorti.' },
    { ref: '008', name: 'Gris Lilas', family: 'deux', events: false, price: 55000, color: 'Gris lilas', hex: '#aaa3b9', fabric: 'Coton fin', img: 'images/tenues/trois-pieces-gris-lilas.webp', detail: 'Col rond, galon doré le long de la patte, fentes latérales.' },
    { ref: '001', name: 'Vert Forêt', family: 'deux', events: false, price: 55000, color: 'Vert forêt', hex: '#1f4a3c', fabric: 'Tissu satiné', img: 'images/tenues/tenue-vert-foret.webp', detail: 'Col rond bordé, patte brodée, poche poitrine, manches amples.' },
    { ref: '009', name: 'Bleu Ciel', family: 'deux', events: false, price: 50000, color: 'Bleu ciel', hex: '#aebfd0', fabric: 'Coton fin', img: 'images/tenues/trois-pieces-bleu-ciel.webp', detail: 'Col rond, patte surpiquée, coupe droite et fentes latérales.' },
    { ref: '002', name: 'Moka', family: 'deux', events: false, price: 50000, color: 'Moka', hex: '#7b6652', fabric: 'Coton fin', img: 'images/tenues/tenue-moka.webp', detail: 'Col rond, patte courte, fentes latérales, pantalon assorti.' },
  ],

  // Pièces présentées en premier sur le portant de l'accueil
  featured: ['006', '004', '005', '007', '003', '008'],

  hero: {
    ref: '005',
    lead: 'Deux pièces et trois pièces pour homme, taillés à Dakar pour les jours qui comptent. En boutique, en ligne et sur mesure, jusque dans la diaspora.',
  },

  atelier: {
    image: 'images/splash-metre.webp',
    alt: 'Fil d’or, mètre ruban et épingles sur un tissu noir',
    text: [
      'Tout commence par un geste lent : on déroule le tissu, on le laisse tomber, on écoute sa lumière.',
      'À Sicap Foire, au Jardin Boussoura, chaque pièce est coupée ample, à la mesure de celui qui la portera, puis brodée fil à fil jusqu’à ce que le détail devienne une signature.',
    ],
  },

  invitation: {
    text: 'Le sur-mesure Saadikh commence par une conversation. Un conseiller de la maison vous accompagne en personne, depuis le choix du tissu jusqu’à la livraison, que vous soyez à Dakar, à Paris ou à New York.',
    path: ['Une conversation', 'Vos mesures, à distance', 'Votre pièce, confectionnée', 'Livrée jusqu’à vous'],
    note: 'Un mètre ruban suffit : votre conseiller vous guide pour chaque mesure.',
    message: 'Bonjour Saadikh, je souhaite être accompagné par un conseiller pour une tenue sur mesure.',
  },

  events: {
    title: ['Pour les', 'grands événements'],
    moments: ['Korité', 'Tabaski', 'Mariages', 'Baptêmes', 'Magal'],
    text: 'Le jour où tous les regards se posent sur vous, la tenue doit être à la hauteur : broderies, satin, galons dorés, thiaya portée haut.',
    ref: '006',
    detailImg: 'images/detail-broderie.webp',
  },

  craft: {
    title: 'De la coupe à la broderie',
    text: 'Un vêtement d’apparat se reconnaît à trois choses : la noblesse du tissu, l’ampleur de la coupe et la finesse de ce qui est cousu. Chez Saadikh, chacune prend son temps.',
    image: 'images/saadikh-mannequin.webp',
    imageAlt: 'Tenue en satin blanc brodé sur un buste de couture, devant l’enseigne Saadikh',
    items: [
      { t: 'Le tissu', d: 'Bazin, lin, satin, coton fin : choisis pour leur tenue et leur lumière.', img: 'images/splash-metre.webp', alt: 'Mètre ruban, bobine dorée et épingles sur un tissu noir' },
      { t: 'La coupe', d: 'Ample et droite, pensée pour le mouvement, la prière et les longues journées de fête.', img: 'images/detail-machine-blanche.webp', alt: 'Pied de biche doré cousant un lin blanc' },
      { t: 'Le détail', d: 'Liserés, surpiqûres, boutons de manchette : la signature qui fait la différence.', img: 'images/detail-lisere.webp', alt: 'Tunique en lin blanc à liseré noir et or' },
    ],
  },

  measure: {
    title: ['Votre tenue,', 'à vos mesures.'],
    text: 'Vous êtes à Dakar, à Paris ou à New York ? La maison confectionne votre tenue sur mesure, à distance. Tout se fait par WhatsApp.',
    steps: [
      { t: 'Vous choisissez', d: 'Un modèle de la collection, ou votre idée : tissu, couleur, broderie.' },
      { t: 'Vous envoyez vos mesures', d: 'La maison vous guide pas à pas, avec un simple mètre ruban.' },
      { t: 'La maison confectionne', d: 'Vous suivez l’avancée de votre tenue.' },
      { t: 'Vous recevez', d: 'À Dakar, dans les régions et à l’étranger.' },
    ],
    cta: 'Demander un sur-mesure',
    message: 'Bonjour Saadikh, je souhaite une tenue sur mesure.',
    img: 'images/saadikh-atelier-or.webp',
    imgAlt: 'Logo Saadikh doré, ciseaux et mètre ruban de tailleur',
  },

  howTo: [
    { t: 'Choisissez', d: 'Votre tenue, sa taille et la quantité, puis ajoutez-la au panier.' },
    { t: 'Indiquez où vous êtes', d: 'Au Sénégal ou à l’étranger, en quelques champs.' },
    { t: 'Confirmez sur WhatsApp', d: 'Votre commande part déjà rédigée. La maison confirme disponibilité, livraison et paiement.' },
  ],
  delivery: [
    { t: 'Dakar', d: 'Retrait en boutique ou livraison : tarif confirmé sur WhatsApp.' },
    { t: 'Régions', d: 'Tarif et délai confirmés sur WhatsApp.' },
    { t: 'Diaspora', d: 'Envoi à l’étranger : tarif et délai confirmés sur WhatsApp.' },
    { t: 'Paiement', d: 'Modes de paiement communiqués à la confirmation.' },
  ],

  regions: ['Dakar', 'Diourbel', 'Fatick', 'Kaffrine', 'Kaolack', 'Kédougou', 'Kolda', 'Louga', 'Matam', 'Saint-Louis', 'Sédhiou', 'Tambacounda', 'Thiès', 'Ziguinchor'],
  countries: ['France', 'Italie', 'Espagne', 'Belgique', 'Allemagne', 'Royaume-Uni', 'Suisse', 'États-Unis', 'Canada', 'Côte d’Ivoire', 'Mali', 'Gambie', 'Mauritanie', 'Maroc', 'Autre pays'],

  credit: 'Réalisé par Jëfya',
};
