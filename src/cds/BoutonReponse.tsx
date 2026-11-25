import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import { apostrophes, easeOut, encre, police, rise, styleIndication, texteClair, verre } from "./style";

type Props = {
  texte: string;
  onClick?: () => void;
};

export default function BoutonReponse({ texte, onClick }: Props) {
  return (
    <>
      <ButtonBase
        key={texte} // relance l'anim quand la réponse change
        onClick={onClick}
        disableRipple
        sx={{
          ...verre(18),
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          p: "7px 7px 7px 20px",
          textAlign: "left",
          border: "1px solid rgba(232,226,212,.28)",
          borderRadius: "28px",
          boxShadow: "0 10px 34px rgba(0,0,0,.35)",
          transition: "transform .18s ease",
          animation: `${rise} .6s ${easeOut} both`,
          "&:active": { transform: "scale(.98)" },
        }}
      >
        <Box component="span" sx={{ py: "10px", font: `400 19px/1.35 ${police}`, color: texteClair }}>
          {apostrophes(texte)}
        </Box>
        <Box
          component="span"
          sx={{
            width: 44,
            height: 44,
            flex: "none",
            alignSelf: "flex-end",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(232,226,212,.92)",
            color: encre,
            fontSize: 20,
            lineHeight: 1,
          }}
        >
          ↑
        </Box>
      </ButtonBase>
      <Typography sx={styleIndication}>touche pour répondre</Typography>
    </>
  );
}
