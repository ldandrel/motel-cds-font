# La clef des songes — front

Écran de conversation du théâtre (mode `chat`). React 18 + MUI 6 + TypeScript, Vite.

```
npm install
npm run dev
```

`src/main.tsx` sert de page de test, avec tous les components.

Tout est dans `src/cds/`, c'est le seul dossier à copier (+ `fonts.css` et `assets/` pour la police et le fond). Les components ne font que de l'affichage : la logique (prompts, historique, enchaînement) reste côté théâtre.

## Exemple

```tsx
import { CDS, BulleAsk, BulleAnswer, BulleImage, ButtonNext } from "./cds";

<CDS ecrit={false} pied={<ButtonNext onClick={suivant} />}>
  {messages.map((m, i) =>
    m.de === "visiteur" ? <BulleAnswer key={i} texte={m.texte} />
    : m.image ? <BulleImage key={i} image={m.image} texte={m.texte} />
    : <BulleAsk key={i} texte={m.texte} />
  )}
</CDS>
```

## Components

### `CDS`
L'écran : fond, en-tête, messages, et le pied en bas.
- `children` : les bulles
- `pied` : ce qu'on met en bas (bouton, décompte, pad…), on peut en mettre plusieurs
- `ecrit` : affiche « écrit… » et les trois points
- `imageFond` : pour changer le fond

### Bulles
- `BulleAsk` : message du motel → `texte`
- `BulleAnswer` : réponse du visiteur → `texte`
- `BulleImage` : message du motel avec une image → `image` (URL complète), `texte` (optionnel)

### Dans le pied
- `ButtonNext` : rond « appuie pour continuer » → `onClick`, `emoji` (👍 par défaut), `disabled`, `taille`
- `BoutonReponse` : bouton avec le texte de la réponse → `texte`, `onClick`
- `Decompte` : démarre tout seul → `duree` (en secondes), `onFin`, `taille`. Pour le relancer, changer sa `key`.
- `PadLyre` : pour diriger la lyre → `onChange({ x, y })`, x et y entre -1 et 1
- `LyreColor` : couleur du projo → `onChange(couleur)` avec `"rouge"`, `"vert"` ou `"bleu"`, `valeur` pour en présélectionner une

Pour la lyre par exemple :

```tsx
<PadLyre onChange={({ x, y }) => {
  sendOscMessage(`${oscPath}/x`, x);
  sendOscMessage(`${oscPath}/y`, y);
}} />
```
