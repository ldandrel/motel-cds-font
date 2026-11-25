import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import { keyframes } from "@mui/material/styles";
import { styleIndication } from "./style";

type Props = {
  onClick?: () => void;
  emoji?: string;
  disabled?: boolean;
  taille?: number;
};

const pulse = keyframes`
  0%, 100% { box-shadow: 0 0 0 0 rgba(232,226,212,.20); }
  50%      { box-shadow: 0 0 0 16px rgba(232,226,212,0); }
`;

export default function ButtonNext({ onClick, emoji = "👍", disabled = false, taille = 74 }: Props) {
  return (
    <>
      <ButtonBase
        onClick={onClick}
        disabled={disabled}
        disableRipple
        sx={{
          width: taille,
          height: taille,
          borderRadius: "50%",
          border: "1px solid rgba(232,226,212,.30)",
          background: "rgba(232,226,212,.10)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          fontSize: Math.round(taille * 0.43),
          lineHeight: 1,
          color: "#fff",
          opacity: disabled ? 0.5 : 1,
          transition: "opacity .4s ease, transform .18s ease",
          animation: disabled ? "none" : `${pulse} 2.6s ease-out infinite`,
          "&:active": { transform: "scale(.94)" },
        }}
      >
        {emoji}
      </ButtonBase>
      <Typography sx={{ ...styleIndication, minHeight: 15 }}>{disabled ? "" : "appuie pour continuer"}</Typography>
    </>
  );
}
