import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import { keyframes } from "@mui/material/styles";
import { creme, easeOut, rise, styleIndication } from "./style";

type Props = {
  // en secondes, comme smokeDuration
  duree: number;
  // true au tap, false à la fin
  onChange?: (actif: boolean) => void;
  // déjà lâchée : bouton désactivé
  utilise?: boolean;
  taille?: number;
};

type Etat = "repos" | "enCours" | "fini";

const derive = keyframes`
  0%   { transform: translate(-12%, 8%) scale(1); }
  50%  { transform: translate(10%, -6%) scale(1.15); }
  100% { transform: translate(-4%, -12%) scale(.95); }
`;
const monte = keyframes`
  0%   { transform: translate(-50%, 0) scale(.4); opacity: 0; }
  18%  { opacity: .55; }
  100% { transform: translate(calc(-50% + var(--dx)), -280px) scale(2.6); opacity: 0; }
`;
const remplit = keyframes`
  from { stroke-dashoffset: 100; }
  to   { stroke-dashoffset: 0; }
`;
const dissipe = keyframes`
  from { opacity: .45; transform: translate(-50%, -50%) scale(1); }
  to   { opacity: 0; transform: translate(-50%, -90%) scale(1.8); }
`;

const nuage = "radial-gradient(circle, rgba(244,239,228,.9) 0%, rgba(244,239,228,0) 70%)";

// les volutes qui sortent du rond pendant la fumée
const BOUFFEES = [
  { dx: "-40px", delai: 0, duree: 3.4, taille: 70 },
  { dx: "30px", delai: 0.5, duree: 3.8, taille: 60 },
  { dx: "-10px", delai: 1, duree: 3.2, taille: 80 },
  { dx: "50px", delai: 1.5, duree: 4, taille: 56 },
  { dx: "-55px", delai: 2, duree: 3.6, taille: 64 },
  { dx: "15px", delai: 2.5, duree: 3.4, taille: 74 },
];

const TEXTES: Record<Etat, string> = {
  repos: "touche pour lâcher la fumée",
  enCours: "pshhhiiit…",
  fini: "la fumée est lâchée",
};

export default function Smoke({ duree, onChange, utilise = false, taille = 120 }: Props) {
  const [etat, setEtat] = useState<Etat>(utilise ? "fini" : "repos");
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    if (etat !== "enCours") return;
    const fin = window.setTimeout(() => {
      setEtat("fini");
      onChangeRef.current?.(false);
    }, duree * 1000);
    return () => window.clearTimeout(fin);
  }, [etat, duree]);

  const lacher = () => {
    setEtat("enCours");
    onChange?.(true);
  };

  const enCours = etat === "enCours";

  return (
    <>
      <Box sx={{ position: "relative", width: taille, height: taille, animation: `${rise} .6s ${easeOut} both` }}>
        {enCours && (
          <Box sx={{ position: "absolute", left: "50%", top: "50%", pointerEvents: "none" }}>
            {BOUFFEES.map((b, i) => (
              <Box
                key={i}
                style={{ "--dx": b.dx } as CSSProperties}
                sx={{
                  position: "absolute",
                  left: 0,
                  top: -b.taille / 2,
                  width: b.taille,
                  height: b.taille,
                  borderRadius: "50%",
                  background: nuage,
                  filter: "blur(12px)",
                  opacity: 0,
                  animation: `${monte} ${b.duree}s ${b.delai}s ease-out infinite`,
                }}
              />
            ))}
          </Box>
        )}

        <ButtonBase
          onClick={lacher}
          disabled={etat !== "repos"}
          disableRipple
          aria-label="lâcher la fumée"
          sx={{
            position: "relative",
            width: taille,
            height: taille,
            borderRadius: "50%",
            overflow: "hidden",
            border: "1px solid rgba(232,226,212,.30)",
            background: "rgba(232,226,212,.10)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            fontSize: Math.round(taille * 0.34),
            lineHeight: 1,
            opacity: etat === "fini" ? 0.5 : 1,
            transition: "opacity .8s ease, transform .18s ease",
            "&:active": { transform: "scale(.96)" },
          }}
        >
          {etat !== "fini" &&
            [0, 1, 2].map((i) => (
              <Box
                key={i}
                sx={{
                  position: "absolute",
                  width: "70%",
                  height: "70%",
                  left: `${[0, 30, 12][i]}%`,
                  top: `${[20, 6, 38][i]}%`,
                  borderRadius: "50%",
                  background: nuage,
                  filter: "blur(10px)",
                  opacity: enCours ? 0.75 : 0.22,
                  transition: "opacity 1.2s ease",
                  animation: `${derive} ${enCours ? 2.4 + i : 7 + i * 2}s ease-in-out ${i * -1.3}s infinite alternate`,
                }}
              />
            ))}
          {etat === "fini" && (
            <Box
              sx={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: "80%",
                height: "80%",
                borderRadius: "50%",
                background: nuage,
                filter: "blur(12px)",
                animation: `${dissipe} 2.5s ease-out both`,
              }}
            />
          )}
          <Box component="span" sx={{ position: "relative", opacity: enCours ? 0 : 1, transition: "opacity .6s ease" }}>
            💨
          </Box>
        </ButtonBase>

        {enCours && (
          <Box
            component="svg"
            viewBox="0 0 100 100"
            sx={{ position: "absolute", inset: -6, width: taille + 12, height: taille + 12, transform: "rotate(-90deg)", pointerEvents: "none" }}
          >
            <Box
              component="circle"
              cx="50"
              cy="50"
              r="49"
              pathLength={100}
              fill="none"
              stroke={creme}
              strokeWidth={1.2}
              strokeDasharray={100}
              sx={{ animation: `${remplit} ${duree}s linear both` }}
            />
          </Box>
        )}
      </Box>
      <Typography sx={styleIndication}>{TEXTES[etat]}</Typography>
    </>
  );
}
