import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./fonts.css";
import { BoutonReponse, BulleImage, BulleAsk, BulleAnswer, ButtonNext, CDS, Decompte, InputAnswer, LyreColor, PadLyre, Smoke } from "./cds";

const MEDIA_URL = "https://lm-bucket-theatre.s3.eu-central-1.amazonaws.com/intercal/";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CDS
      ecrit
      footer={
        <>
          <Decompte duree={30} onFin={() => console.log("fin du décompte")} /> 
          <ButtonNext emoji="👍" onClick={() => console.log("suivant")} /> 
          <BoutonReponse texte="D'un escalier qui descendait dans l'eau." onClick={() => console.log("réponse")} /> 
          <InputAnswer onSend={(texte) => console.log("message :", texte)} />
          <Smoke onClick={() => console.log("fumée")} /> 
          <LyreColor onChange={(c) => console.log("couleur lyre :", c)} />
          <PadLyre onChange={({ x, y }) => console.log("lyre :", x, y)} />
        </>
      }
    >
      <BulleAsk texte="Bienvenue au Motel des destins croisés ! 🔑 🧳" />
      <BulleAnswer texte="Je clique pour commencer 🤩" />
      <BulleImage
        image={MEDIA_URL + encodeURIComponent("fil blanc vert.jpg")}
        texte="Accède aux chambres en suivant le fil au sol."
      />
      <BulleAsk texte="Avant d'ouvrir, dis-moi : de quoi as-tu rêvé cette nuit ?" />
    </CDS>
  </StrictMode>,
);
