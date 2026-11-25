import { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { keyframes } from "@mui/material/styles";
import { creme, police, texteClair } from "./style";

type Props = {
  // en secondes, pour relancer il faut changer la key
  duree: number;
  onFin?: () => void;
  taille?: number;
};

const tic = keyframes`
  from { opacity: .35; transform: scale(.86); }
  to   { opacity: 1; transform: scale(1); }
`;

const minutes = (s: number) => (s < 60 ? String(s) : `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`);

export default function Decompte({ duree, onFin, taille = 74 }: Props) {
  const [restant, setRestant] = useState(duree);
  const onFinRef = useRef(onFin);
  onFinRef.current = onFin;

  useEffect(() => {
    const debut = performance.now();
    let frame = 0;
    // on part de l'heure de début, sinon ça dérive si l'onglet est en pause
    const avancer = (maintenant: number) => {
      const r = Math.max(0, duree - (maintenant - debut) / 1000);
      setRestant(r);
      if (r > 0) frame = requestAnimationFrame(avancer);
      else onFinRef.current?.();
    };
    frame = requestAnimationFrame(avancer);
    return () => cancelAnimationFrame(frame);
  }, [duree]);

  if (restant <= 0) return null;
  const secondes = Math.ceil(restant);

  return (
    <Box sx={{ position: "relative", width: taille, height: taille }}>
      <Box
        sx={{
          width: taille,
          height: taille,
          borderRadius: "50%",
          border: "1px solid rgba(232,226,212,.30)",
          background: "rgba(232,226,212,.10)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          font: `400 ${Math.round(taille * 0.3)}px/1 ${police}`,
          color: texteClair,
        }}
      >
        <Box component="span" key={secondes} sx={{ animation: `${tic} .45s ease-out both` }}>
          {minutes(secondes)}
        </Box>
      </Box>
      <CircularProgress
        variant="determinate"
        value={100 * (1 - restant / duree)}
        size={taille + 12}
        thickness={1.2}
        sx={{
          position: "absolute",
          top: -6,
          left: -6,
          color: creme,
          pointerEvents: "none",
          "& .MuiCircularProgress-circle": { transition: "none" },
        }}
      />
    </Box>
  );
}
