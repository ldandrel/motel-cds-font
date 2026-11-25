import { Fragment, StrictMode, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { createRoot } from "react-dom/client";
import "./fonts.css";
import { BoutonReponse, BulleImage, BulleAsk, BulleAnswer, ButtonNext, CDS, Decompte, InputAnswer, LyreColor, PadLyre, Smoke } from "./cds";
import type { CouleurLyre } from "./cds";

const MEDIA_URL = "https://lm-bucket-theatre.s3.eu-central-1.amazonaws.com/intercal/";

type Message = { de: "ask" | "answer" | "image"; texte?: string; image?: string };
type Suivant = (reponse?: string) => void;
type Etape = { messages: Message[]; footer: (suivant: Suivant) => ReactNode };

function ChoixCouleur({ suivant }: { suivant: Suivant }) {
  const [couleur, setCouleur] = useState<CouleurLyre | null>(null);
  return (
    <>
      <LyreColor onChange={setCouleur} />
      <ButtonNext emoji="✅" disabled={!couleur} onClick={() => suivant(`Je choisis le ${couleur}`)} />
    </>
  );
}

function Lumiere({ suivant }: { suivant: Suivant }) {
  const [bouge, setBouge] = useState(false);
  return (
    <>
      <PadLyre onChange={() => setBouge(true)} />
      <ButtonNext emoji="✅" disabled={!bouge} onClick={() => suivant("C'est bon, elle éclaire la scène")} />
    </>
  );
}

const ETAPES: Etape[] = [
  {
    messages: [{ de: "ask", texte: "Bienvenue au Motel des destins croisés ! 🔑 🧳" }],
    footer: (suivant) => <ButtonNext onClick={() => suivant("👍")} />,
  },
  {
    messages: [
      { de: "image", image: "fil blanc vert.jpg", texte: "Accède aux chambres en suivant le fil au sol." },
    ],
    footer: (suivant) => (
      <BoutonReponse texte="Je suis devant la porte" onClick={() => suivant("Je suis devant la porte")} />
    ),
  },
  {
    messages: [{ de: "ask", texte: "Avant d'ouvrir, dis-moi : de quoi as-tu rêvé cette nuit ?" }],
    footer: (suivant) => <InputAnswer onSend={suivant} />,
  },
  {
    messages: [{ de: "ask", texte: "Ferme les yeux. Tu as dix secondes pour t'en souvenir." }],
    footer: (suivant) => <Decompte duree={10} onFin={() => suivant()} />,
  },
  {
    messages: [{ de: "ask", texte: "Choisis la couleur de la lumière." }],
    footer: (suivant) => <ChoixCouleur suivant={suivant} />,
  },
  {
    messages: [{ de: "ask", texte: "Maintenant, guide-la jusqu'à la scène." }],
    footer: (suivant) => <Lumiere suivant={suivant} />,
  },
  {
    messages: [{ de: "ask", texte: "Il manque un peu de brume…" }],
    footer: (suivant) => <Smoke onClick={() => setTimeout(() => suivant(), 3000)} />,
  },
  {
    messages: [{ de: "ask", texte: "Merci. La clef est à toi. 🔑" }],
    footer: () => <ButtonNext emoji="↺" onClick={() => location.reload()} />,
  },
];

function Scenario() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [etape, setEtape] = useState(0);
  const [ecrit, setEcrit] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => {
      setMessages((m) => [...m, ...ETAPES[etape].messages]);
      setEcrit(false);
    }, 1400);
    return () => clearTimeout(t);
  }, [etape]);

  const suivant: Suivant = (reponse) => {
    if (reponse) setMessages((m) => [...m, { de: "answer", texte: reponse }]);
    setEcrit(true);
    setEtape((e) => Math.min(e + 1, ETAPES.length - 1));
  };

  return (
    <CDS ecrit={ecrit} footer={!ecrit && <Fragment key={etape}>{ETAPES[etape].footer(suivant)}</Fragment>}>
      {messages.map((m, i) =>
        m.de === "ask" ? (
          <BulleAsk key={i} texte={m.texte!} />
        ) : m.de === "answer" ? (
          <BulleAnswer key={i} texte={m.texte!} />
        ) : (
          <BulleImage key={i} image={MEDIA_URL + encodeURIComponent(m.image!)} texte={m.texte} />
        ),
      )}
    </CDS>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Scenario />
  </StrictMode>,
);
