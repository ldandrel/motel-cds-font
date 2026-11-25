import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import { keyframes } from "@mui/material/styles";

import cielFlou from "../assets/ciel_flou.jpg";
import { drift, easeOut, nuit, police, rise, styleIndication, texteClair, verre } from "./style";

type Props = {
  onStart?: () => void;
  texte?: string;
  heure?: string;
  date?: string;
  imageFond?: string;
};

const pulse = keyframes`
  0%, 100% { box-shadow: 0 10px 34px rgba(0,0,0,.35), 0 0 0 0 rgba(232,226,212,.18); }
  50%      { box-shadow: 0 10px 34px rgba(0,0,0,.35), 0 0 0 18px rgba(232,226,212,0); }
`;

export default function Onboarding({ onStart, texte = "commencer", heure = "03:33", date, imageFond = cielFlou }: Props) {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100dvh",
        overflow: "hidden",
        bgcolor: nuit,
        fontFamily: police,
        userSelect: "none",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${imageFond})`,
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
          animation: `${drift} 60s ease-in-out infinite alternate`,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(180deg, rgba(9,14,20,.55) 0%, rgba(9,14,20,.25) 40%, rgba(9,14,20,.80) 100%)",
        }}
      />

      <Box
        sx={{
          position: "relative",
          pt: "calc(env(safe-area-inset-top) + 56px)",
          textAlign: "center",
          color: texteClair,
          textShadow: "0 0 40px rgba(232,226,212,.45)",
          animation: `${rise} .8s ${easeOut} both`,
        }}
      >
        <Typography sx={{ font: `300 92px/1 ${police}`, letterSpacing: ".02em", fontVariantNumeric: "tabular-nums" }}>
          {heure}
        </Typography>
        {date && (
          <Typography sx={{ font: `400 22px/1.3 ${police}`, mt: "10px", color: "rgba(242,237,226,.75)" }}>
            {date}
          </Typography>
        )}
      </Box>

      <Box
        sx={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          pointerEvents: "none",
        }}
      >
        <ButtonBase
          onClick={onStart}
          disableRipple
          sx={{
            ...verre(18),
            pointerEvents: "auto",
            p: "18px 44px",
            border: "1px solid rgba(232,226,212,.32)",
            borderRadius: "40px",
            font: `400 22px/1 ${police}`,
            letterSpacing: ".18em",
            textTransform: "uppercase",
            color: texteClair,
            transition: "transform .18s ease",
            animation: `${rise} .8s ${easeOut} .2s both, ${pulse} 2.8s ease-out 1s infinite`,
            "&:active": { transform: "scale(.96)" },
          }}
        >
          {texte}
        </ButtonBase>
        <Typography sx={{ ...styleIndication, animation: `${rise} .8s ${easeOut} .35s both` }}>
          la clef des songes
        </Typography>
      </Box>
    </Box>
  );
}
