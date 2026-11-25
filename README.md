# La clef des songes — front

```
npm install
npm run dev
```

`src/main.tsx` sert de page de test, avec tous les components.

Tout les components sont dans `src/cds/`. J'ai essayé de les faire le plus plug and play. je les décris ci-dessous.


## Components

### `CDS`

L'écran complet : le header « la clef des songes », la zone des messages, et le footer. Les bulles vont en `children`, les boutons et le reste dans `footer`.

| prop | type | défaut | |
|---|---|---|---|
| `children` | `ReactNode` | | les bulles, dans l'ordre |
| `footer` | `ReactNode` | | ce qu'il y a en bas (bouton, décompte, pad…), on peut en mettre plusieurs dans un fragment |
| `ecrit` | `boolean` | `false` | ajoute les trois points sous le dernier message et passe le statut à « écrit… » |
| `imageFond` | `string` | `ciel_flou.jpg` | URL d'une autre image de fond |

Le scroll reste collé en bas tout seul quand un message arrive, et il y a un fondu en haut et en bas de la zone des messages.

### `Onboarding`

| prop | type | défaut | |
|---|---|---|---|
| `onStart` | `() => void` | | au tap sur le bouton (c'est là que vous pouvez lancer le plein écran) |
| `texte` | `string` | `"commencer"` | le texte du bouton, par exemple « continuer » quand on revient |
| `heure` | `string` | `"03:33"` | le texte affiché en grand |
| `date` | `string` (optionnel) | | le texte sous l'heure, par exemple `"mer. 25 nov."` |
| `imageFond` | `string` | `ciel_flou.jpg` | URL d'une autre image de fond |

### `BulleAsk`

Un message du motel (bulle en verre, à gauche).

| prop | type | |
|---|---|---|
| `texte` | `string` | le texte du message |

### `BulleAnswer`

La réponse du visiteur (bulle crème, à droite).

| prop | type | |
|---|---|---|
| `texte` | `string` | le texte de la réponse |

### `BulleImage`

Un message du motel avec une image au-dessus du texte. L'image fait 180 px de haut max, elle n'est pas coupée.

| prop | type | |
|---|---|---|
| `image` | `string` | URL complète de l'image |
| `texte` | `string` (optionnel) | le texte sous l'image |

### `BoutonReponse`

Le bouton avec le texte de la réponse proposée, et « touche pour répondre » en dessous. Quand `texte` change, l'anim d'apparition se relance.

| prop | type | |
|---|---|---|
| `texte` | `string` | le texte de la réponse |
| `onClick` | `() => void` | au tap |

### `ButtonNext`

Le bouton avec le texte de la réponse proposée, et « touche pour répondre » en dessous. Il semble que vous n'avez pas ce type de réponse. À voir comment vous l'implementer. 

| prop | type | défaut | |
|---|---|---|---|
| `onClick` | `() => void` | | au tap |
| `emoji` | `string` | `"👍"` | ce qu'il y a dans le rond |
| `disabled` | `boolean` | `false` | grisé, plus de pulse ni de texte |
| `taille` | `number` | `74` | diamètre en px |

### `InputAnswer`

Le champ pour que le spectateur tape son message (`SEND_MESSAGE`). Même look que `BoutonReponse`, avec la flèche pour envoyer à droite. Le champ grandit jusqu'à 3 lignes, Entrée envoie et Maj+Entrée fait un retour à la ligne. La flèche est grisée tant que c'est vide, et le champ se vide après l'envoi.

| prop | type | défaut | |
|---|---|---|---|
| `onSend` | `(texte: string) => void` | | à l'envoi, avec le texte sans les espaces autour |
| `placeholder` | `string` | `"Écris ta réponse…"` | le texte quand le champ est vide |


### `Decompte`

Le rond avec les secondes qui défilent et l'anneau qui se remplit. Il démarre tout seul quand il s'affiche, passe en `m:ss` au-dessus d'une minute, et disparaît à la fin. Il se base sur l'heure de départ donc il ne dérive pas si l'onglet passe en arrière-plan.

| prop | type | défaut | |
|---|---|---|---|
| `duree` | `number` | | en secondes |
| `onFin` | `() => void` | | appelé une fois à la fin |
| `taille` | `number` | `74` | diamètre en px |

Pour le relancer, il faut changer sa `key` (le plus simple c'est l'`uuid` du prompt).

### `PadLyre`

Le carré pour diriger la lyre, avec le plan de la salle derrière (scène en haut, gradins en bas). On glisse le point au doigt ou à la souris, « recentrer » apparaît dès qu'on a bougé.

| prop | type | |
|---|---|---|
| `onChange` | `({ x, y }) => void` | à chaque mouvement, x et y entre -1 et 1 (y vers le haut, donc 1 = côté scène), arrondis à 2 décimales. Même format que le pad actuel |

```tsx
<PadLyre onChange={({ x, y }) => {
  sendOscMessage(`${oscPath}/x`, x);
  sendOscMessage(`${oscPath}/y`, y);
}} />
```

### `LyreColor`

Trois ampoules rouge / vert / bleu pour choisir la couleur du projo. Celle choisie s'allume.

| prop | type | |
|---|---|---|
| `onChange` | `(couleur: CouleurLyre \| null) => void` | au tap, avec `"rouge"`, `"vert"` ou `"bleu"`. Si on retape sur celle qui est allumée, ça éteint et on reçoit `null` |
| `valeur` | `CouleurLyre` (optionnel) | pour en présélectionner une |

Le type `CouleurLyre` est exporté aussi.

Ça marche comme votre contrôle `MOTEL_CONTROL_LIGHT`, donc on peut garder les mêmes messages OSC :

```tsx
<LyreColor onChange={(couleur) => {
  sendOscMessage(`${oscPath}/red`, couleur === "rouge" ? 1 : 0);
  sendOscMessage(`${oscPath}/green`, couleur === "vert" ? 1 : 0);
  sendOscMessage(`${oscPath}/blue`, couleur === "bleu" ? 1 : 0);
}} />
```

### `Smoke`

Le bouton pour lâcher la fumée (`MOTEL_CONTROL_SMOKE`). Au repos, un grand rond avec 💨 et des volutes qui dérivent doucement. Au tap, des nuages montent du rond et passent par-dessus les messages, puis le rond devient terne : on ne peut le lancer qu'une fois, comme le bouton actuel. Le component ne gère que le démarrage, la durée et l'arrêt restent de votre côté.

| prop | type | défaut | |
|---|---|---|---|
| `onClick` | `() => void` | | au tap |
| `disabled` | `boolean` | `false` | la fumée a déjà été lâchée, le bouton s'affiche directement désactivé |
| `taille` | `number` | `120` | diamètre en px |

```tsx
<Smoke onClick={() => {
  sendOscMessage(oscPath, 1);
  setTimeout(() => sendOscMessage(oscPath, 0), smokeDuration * 1000);
}} />
```
