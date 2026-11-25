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

## Pour le brancher dans le theatre

Je n'ai pas touché à ta logique, c'est toi qui sais quand afficher quoi. En gros je le verrais comme ça, à la place du rendu `chat` actuel :

```tsx
const MEDIA_URL = "https://lm-bucket-theatre.s3.eu-central-1.amazonaws.com/intercal/";

<CDS
  footer={
    <>
      {activePrompt?.answer === "CLICK_BUTTON" && (
        <BoutonReponse
          texte={activePrompt.answerButtonTextPayload}
          onClick={() => goToNext(activePrompt.answerButtonTextPayload)}
        />
      )}
      {activePrompt?.answer === "MOTEL_CONTROL_LYRE" && <PadLyre onChange={...} />}
      {activePrompt && activePrompt.autoGo > -1 && (
        <Decompte key={activePrompt.uuid} duree={activePrompt.autoGo} onFin={() => goToNext(undefined, true)} />
      )}
    </>
  }
>
  {logHistory.map((m, i) => {
    if (m.kind === "user") return <BulleAnswer key={i} texte={m.payload.userResponse} />;
    const { text, image } = m.payload.prompt.requestTextPayload;
    if (image) return <BulleImage key={i} image={MEDIA_URL + image} texte={text} />;
    return text ? <BulleAsk key={i} texte={text} /> : null;
  })}
</CDS>
```

`goToNext` c'est ta fonction qui passe au prompt suivant, avec le `(réponse, skip)` que tu as déjà.

## À savoir

- `Decompte` remplace ton `Go` (le CountdownCircleTimer). Garde pas les deux sinon ça avance deux fois.
- Sur les attentes courtes (1-2 s) c'est plus joli de mettre `ecrit` sur `CDS` plutôt qu'un décompte, mais c'est toi qui vois.
- Les bulles vides (ex. le prompt `MOTEL_CLEAR_HISTORY`) sont à filtrer avant, sinon ça fait une bulle vide.
- `CDS` fait `100dvh`, le scroll reste collé en bas tout seul.
- La police c'est Univers Else, à récupérer dans `src/assets/fonts/` avec `src/fonts.css`. Il y a aussi l'image de fond dans `src/assets/`.
- Les apostrophes droites sont remplacées par des ’ à l'affichage, la police les dessine mal.
- Pour `LyreColor` j'ai pas le chemin OSC de la couleur, à voir ensemble.

Pas encore fait : `CHOICE`, `SEND_MESSAGE`, `SCREEN_LIGHT`, la lumière et la fumée. Tu peux mettre tes components actuels dans `footer` en attendant.
  # motel-cds-font
