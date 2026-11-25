import { useState } from "react";
import type { CSSProperties } from "react";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import { keyframes } from "@mui/material/styles";
import { easeOut, rise, styleIndication } from "./style";

type Props = {
  onClick?: () => void;
  disabled?: boolean;
  taille?: number;
};

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

const nuage = "radial-gradient(circle, rgba(244,239,228,.9) 0%, rgba(244,239,228,0) 70%)";

const BOUFFEES = [
  { dx: "-40px", delai: 0, duree: 3.4, taille: 70 },
  { dx: "30px", delai: 0.4, duree: 3.8, taille: 60 },
  { dx: "-10px", delai: 0.8, duree: 3.2, taille: 80 },
  { dx: "50px", delai: 1.2, duree: 4, taille: 56 },
  { dx: "-55px", delai: 1.6, duree: 3.6, taille: 64 },
  { dx: "15px", delai: 2, duree: 3.4, taille: 74 },
];

export default function Smoke({ onClick, disabled = false, taille = 120 }: Props) {
  const [lachee, setLachee] = useState(false);

  const lacher = () => {
    setLachee(true);
    onClick?.();
  };

  return (
    <>
      <Box sx={{ position: "relative", width: taille, height: taille, animation: `${rise} .6s ${easeOut} both` }}>
        {lachee && (
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
                  animation: `${monte} ${b.duree}s ${b.delai}s ease-out both`,
                }}
              />
            ))}
          </Box>
        )}

        <ButtonBase
          onClick={lacher}
          disabled={disabled || lachee}
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
            opacity: disabled || lachee ? 0.5 : 1,
            transition: "opacity .8s ease, transform .18s ease",
            "&:active": { transform: "scale(.96)" },
          }}
        >
          {!disabled &&
            !lachee &&
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
                  opacity: 0.22,
                  animation: `${derive} ${7 + i * 2}s ease-in-out ${i * -1.3}s infinite alternate`,
                }}
              />
            ))}
          <Box component="span" sx={{ position: "relative" }}>
            💨
          </Box>
        </ButtonBase>
      </Box>
      <Typography sx={styleIndication}>
        {disabled || lachee ? "la fumée est lâchée" : "touche pour lâcher la fumée"}
      </Typography>
    </>
  );
}
