import { useState } from "react";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import SvgIcon from "@mui/material/SvgIcon";
import Typography from "@mui/material/Typography";
import { easeOut, rise, styleIndication } from "./style";

export type CouleurLyre = "rouge" | "vert" | "bleu";

type Props = {
  // null quand on retape sur la couleur allumée pour éteindre
  onChange?: (couleur: CouleurLyre | null) => void;
  valeur?: CouleurLyre;
};

const COULEURS: { nom: CouleurLyre; teinte: string }[] = [
  { nom: "rouge", teinte: "#ff4a3d" },
  { nom: "vert", teinte: "#3ddc6e" },
  { nom: "bleu", teinte: "#3d8bff" },
];

// icône Lightbulb de Material Icons
const Ampoule = ({ couleur, allumee }: { couleur: string; allumee: boolean }) => (
  <SvgIcon
    sx={{
      fontSize: 34,
      color: couleur,
      opacity: allumee ? 1 : 0.55,
      filter: allumee ? `drop-shadow(0 0 8px ${couleur})` : "none",
      transition: "opacity .3s ease, filter .3s ease",
    }}
  >
    <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7" />
  </SvgIcon>
);

export default function LyreColor({ onChange, valeur }: Props) {
  const [choisie, setChoisie] = useState(valeur);

  const choisir = (couleur: CouleurLyre) => {
    const suivante = couleur === choisie ? undefined : couleur;
    setChoisie(suivante);
    onChange?.(suivante ?? null);
  };

  return (
    <>
      <Box sx={{ display: "flex", gap: "22px", animation: `${rise} .6s ${easeOut} both` }}>
        {COULEURS.map(({ nom, teinte }) => {
          const active = choisie === nom;
          return (
            <ButtonBase
              key={nom}
              onClick={() => choisir(nom)}
              disableRipple
              aria-label={nom}
              aria-pressed={active}
              sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                border: `1px solid ${active ? teinte : "rgba(232,226,212,.30)"}`,
                background: "rgba(232,226,212,.10)",
                backdropFilter: "blur(18px)",
                WebkitBackdropFilter: "blur(18px)",
                boxShadow: active ? `0 0 28px ${teinte}99` : "0 10px 34px rgba(0,0,0,.35)",
                transition: "box-shadow .3s ease, border-color .3s ease, transform .18s ease",
                "&:active": { transform: "scale(.94)" },
              }}
            >
              <Ampoule couleur={teinte} allumee={active} />
            </ButtonBase>
          );
        })}
      </Box>
      <Typography sx={styleIndication}>choisis la couleur de la lumière</Typography>
    </>
  );
}
