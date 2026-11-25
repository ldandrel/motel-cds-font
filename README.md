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

Le rond qui pulse, avec « appuie pour continuer » en dessous. Pour avancer quand il n'y a pas de vraie réponse à afficher.

| prop | type | défaut | |
|---|---|---|---|
| `onClick` | `() => void` | | au tap |
| `emoji` | `string` | `"👍"` | ce qu'il y a dans le rond |
| `disabled` | `boolean` | `false` | grisé, plus de pulse ni de texte |
| `taille` | `number` | `74` | diamètre en px |

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
| `onChange` | `(couleur: CouleurLyre) => void` | au tap, avec `"rouge"`, `"vert"` ou `"bleu"` |
| `valeur` | `CouleurLyre` (optionnel) | pour en présélectionner une |

Le type `CouleurLyre` est exporté aussi.

## Les messages et ce qu'on affiche

Je n'ai pas touché à ta logique, c'est toi qui sais quand afficher quoi. Voilà juste ce que je verrais pour chaque type de message.

### Les bulles (le `logHistory`)

| message | component |
|---|---|
| `kind: "cloud"` avec du texte | `BulleAsk` avec `requestTextPayload.text` |
| `kind: "cloud"` avec une image (`requestTextPayload.image` ou `requestImagePayload`) | `BulleImage` avec l'URL du bucket + le nom de l'image, et le texte s'il y en a un |
| `kind: "user"` | `BulleAnswer` avec `payload.userResponse` |
| `kind: "cloud"` sans texte ni image | rien, sinon ça fait une bulle vide |

Les images sont sur `https://lm-bucket-theatre.s3.eu-central-1.amazonaws.com/intercal/`.

### Le footer (selon `answer` du prompt en cours)

| `answer` | dans le footer | ensuite |
|---|---|---|
| `CLICK_BUTTON` | `BoutonReponse` avec `answerButtonTextPayload`. Si c'est juste « OK », `ButtonNext` est plus sympa | au tap, ton go-to-next avec la réponse |
| `WAIT_AUTO_GO` | `Decompte` avec `duree={autoGo}` et `key={uuid}`. Pour 1-2 s, plutôt `ecrit` sur `CDS` | `onFin` → ton go-to-next en skip |
| `NONE` | rien | |
| `MOTEL_CONTROL_LYRE` | `PadLyre`, et `LyreColor` si on garde la couleur | `onChange` → OSC sur `controlOscPath/x` et `/y` |
| `MOTEL_CLEAR_HISTORY` | rien, l'historique se vide | |
| `CHOICE`, `SEND_MESSAGE`, `SCREEN_LIGHT`, `MOTEL_CONTROL_LIGHT`, `MOTEL_CONTROL_SMOKE` | pas encore fait, tu peux mettre tes components actuels | |

Si `autoGo > -1`, peu importe l'`answer`, ça veut dire qu'il faut un `Decompte` en plus (comme ton `Go` aujourd'hui).

## À savoir

- `Decompte` remplace ton `Go` (le CountdownCircleTimer). Garde pas les deux sinon ça avance deux fois.
- `CDS` fait `100dvh`, le scroll reste collé en bas tout seul.
- La police c'est Univers Else, à récupérer dans `src/assets/fonts/` avec `src/fonts.css`. Il y a aussi l'image de fond dans `src/assets/`.
- Les apostrophes droites sont remplacées par des ’ à l'affichage, la police les dessine mal.
- Pour `LyreColor` j'ai pas le chemin OSC de la couleur, à voir ensemble.
