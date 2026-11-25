import Box from "@mui/material/Box";
import { apostrophes, easeOut, encre, police, rise } from "./style";

export default function BulleAnswer({ texte }: { texte?: string }) {
  return (
    <Box
      sx={{
        alignSelf: "flex-end",
        maxWidth: "82%",
        background: "rgba(232,226,212,.90)",
        border: "1px solid rgba(232,226,212,.6)",
        borderRadius: "20px 20px 6px 20px",
        p: "13px 17px",
        font: `400 19px/1.4 ${police}`,
        color: encre,
        textWrap: "pretty",
        boxShadow: "0 8px 30px rgba(0,0,0,.30)",
        animation: `${rise} .6s ${easeOut} both`,
      }}
    >
      {apostrophes(texte)}
    </Box>
  );
}
