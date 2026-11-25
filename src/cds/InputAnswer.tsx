import { useState } from "react";
import type { KeyboardEvent } from "react";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import InputBase from "@mui/material/InputBase";
import Typography from "@mui/material/Typography";
import { easeOut, encre, police, rise, styleIndication, texteClair, verre } from "./style";

type Props = {
  onSend?: (texte: string) => void;
  placeholder?: string;
};

export default function InputAnswer({ onSend, placeholder = "Écris ta réponse…" }: Props) {
  const [texte, setTexte] = useState("");
  const vide = texte.trim() === "";

  const envoyer = () => {
    if (vide) return;
    onSend?.(texte.trim());
    setTexte("");
  };

  const toucheClavier = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      envoyer();
    }
  };

  return (
    <>
      <Box
        sx={{
          ...verre(18),
          width: "100%",
          display: "flex",
          alignItems: "flex-end",
          gap: "12px",
          p: "7px 7px 7px 20px",
          border: "1px solid rgba(232,226,212,.28)",
          borderRadius: "28px",
          boxShadow: "0 10px 34px rgba(0,0,0,.35)",
          animation: `${rise} .6s ${easeOut} both`,
        }}
      >
        <InputBase
          value={texte}
          onChange={(e) => setTexte(e.target.value)}
          onKeyDown={toucheClavier}
          placeholder={placeholder}
          autoFocus
          multiline
          maxRows={3}
          fullWidth
          sx={{
            py: "10px",
            font: `400 19px/1.35 ${police}`,
            color: texteClair,
            "& textarea::placeholder": { color: "rgba(242,237,226,.45)", opacity: 1 },
          }}
        />
        <ButtonBase
          onClick={envoyer}
          disabled={vide}
          disableRipple
          aria-label="envoyer"
          sx={{
            width: 44,
            height: 44,
            flex: "none",
            borderRadius: "50%",
            background: "rgba(232,226,212,.92)",
            color: encre,
            fontSize: 20,
            lineHeight: 1,
            opacity: vide ? 0.4 : 1,
            transition: "opacity .3s ease, transform .18s ease",
            "&:active": { transform: "scale(.94)" },
          }}
        >
          ↑
        </ButtonBase>
      </Box>
      <Typography sx={styleIndication}>écris puis envoie</Typography>
    </>
  );
}
