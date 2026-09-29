# Images — Thies Habillement

Déposer les photos ici puis renseigner leur chemin dans `content.js` (`src: 'images/…'`).
Tant qu'un `src` vaut `null`, le site affiche un emplacement « Visuel à venir » au bon format.

| Emplacement (content.js)        | Qté | Format conseillé                                  |
|---------------------------------|-----|---------------------------------------------------|
| hero.image                      | 1   | Silhouette en pied, PNG détouré (fond transparent), ~1400 px de haut. Ajouter `cutout: true`. |
| collections[].image             | 3   | Portrait 4:5, ~900×1125                           |
| selection.items[].image         | 8   | Portrait 3:4, ~900×1200, fond neutre              |
| craft.image / craft.image2      | 2   | Portrait 4:5 (détail couture) + carré 1:1 (atelier) |
| lookbook.looks[].image          | 5   | 2:3 (et 3:2 pour `wide: true`), ~1400 px          |
| location.photo                  | 1   | 4:3 — actuellement : façade (capture Google fournie) |

Fichiers présents :
- `logo-mark.png` — pictogramme cintre + TH extrait du logo (masque recoloré en CSS).
- `boutique.jpg` — façade (capture Google, basse résolution, à remplacer).
- Photos client (mannequins sur fond velours rouge) : `boubou-bleu.jpg`, `boubou-or.jpg`, `boubou-vert.jpg`, `ensemble-blanc.jpg`, `ensemble-taupe.jpg`.
- Détourés (fond rouge retiré automatiquement) : `boubou-bleu-detoure.png` (hero), `boubou-vert-detoure.png`, `ensemble-blanc-detoure.png`.
- Recadrages : `detail-broderie-or.jpg`, `detail-poche-blanc.jpg`, `boubou-bleu-large.jpg`.
- Manquent : photos garçon (catégorie + 3 pièces).
