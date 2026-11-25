import Box from "@mui/material/Box";
import { apostrophes, easeOut, police, rise, texteClair, verre } from "./style";

export const styleBulleAsk = {
  ...verre(14),
  alignSelf: "flex-start",
  maxWidth: "82%",
  border: "1px solid rgba(232,226,212,.16)",
  borderRadius: "20px 20px 20px 6px",
  p: "14px 17px",
  font: `400 20px/1.45 ${police}`,
  color: texteClair,
  textWrap: "pretty",
  boxShadow: "0 8px 30px rgba(0,0,0,.35)",
  animation: `${rise} .7s ${easeOut} both`,
} as const;

export default function BulleAsk({ texte }: { texte?: string }) {
  return <Box sx={styleBulleAsk}>{apostrophes(texte)}</Box>;
}
