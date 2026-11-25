import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import cielFlou from "../assets/ciel_flou.jpg";
import Ecrit from "./Ecrit";
import { creme, drift, nuit, police } from "./style";

type Props = {
  children?: ReactNode;
  footer?: ReactNode;
  ecrit?: boolean;
  imageFond?: string;
};

export default function CDS({ children, footer, ecrit = false, imageFond = cielFlou }: Props) {
  return (
    <Box
      sx={{
        position: "relative",
        width: "100%",
        height: "100dvh",
        overflow: "hidden",
        bgcolor: nuit,
        fontFamily: police,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* fond */}
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
          background:
            "linear-gradient(180deg, rgba(9,14,20,.62) 0%, rgba(9,14,20,.30) 28%, rgba(9,14,20,.34) 62%, rgba(9,14,20,.86) 100%)",
        }}
      />

      {/* header */}
      <Box
        component="header"
        sx={{
          position: "relative",
          flex: "none",
          p: "calc(env(safe-area-inset-top) + 20px) 22px 14px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <Box
          sx={{
            width: 9,
            height: 9,
            flex: "none",
            borderRadius: "50%",
            bgcolor: creme,
            boxShadow: "0 0 12px rgba(232,226,212,.9)",
          }}
        />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ font: `400 17px/1.2 ${police}`, letterSpacing: ".02em", color: "#f2ede2" }}>
            la clef des songes
          </Typography>
          <Typography
            sx={{
              font: `400 12.5px/1.4 ${police}`,
              letterSpacing: ".06em",
              textTransform: "uppercase",
              color: "rgba(242,237,226,.52)",
              mt: "3px",
            }}
          >
            {ecrit ? "écrit…" : "en ligne"}
          </Typography>
        </Box>
      </Box>

      {/* fil de messages */}
      <Box
        component="main"
        sx={{
          position: "relative",
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          overflowX: "hidden",
          // column-reverse = le scroll reste collé en bas tout seul
          display: "flex",
          flexDirection: "column-reverse",
          p: "24px 20px 48px",
          maskImage: "linear-gradient(to bottom, transparent 0, #000 24px, #000 calc(100% - 48px), transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0, #000 24px, #000 calc(100% - 48px), transparent 100%)",
        }}
      >
        {/* mb auto pour garder les messages en haut quand il y en a peu */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: "14px", mb: "auto" }}>
          {children}
          {ecrit && <Ecrit />}
        </Box>
      </Box>

      {/* footer */}
      <Box
        component="footer"
        sx={{
          position: "relative",
          flex: "none",
          minHeight: 15,
          p: "12px 20px calc(env(safe-area-inset-bottom) + 22px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "10px",
        }}
      >
        {footer}
      </Box>
    </Box>
  );
}
