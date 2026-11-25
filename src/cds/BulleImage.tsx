import Box from "@mui/material/Box";
import { apostrophes } from "./style";
import { styleBulleAsk } from "./BulleAsk";

type Props = {
  image: string;
  texte?: string;
};

export default function BulleImage({ image, texte }: Props) {
  return (
    <Box sx={{ ...styleBulleAsk, minWidth: 200 }}>
      <Box
        component="img"
        src={image}
        alt=""
        sx={{
          display: "block",
          width: "auto",
          height: "auto",
          maxWidth: "100%",
          maxHeight: 180,
          mx: "auto",
          borderRadius: "12px",
          mb: texte ? "10px" : 0,
        }}
      />
      {texte && <Box sx={{ width: 0, minWidth: "100%" }}>{apostrophes(texte)}</Box>}
    </Box>
  );
}
