import Box from "@mui/material/Box";
import { blink, rise, texteClair, verre } from "./style";

export default function Ecrit() {
  return (
    <Box
      sx={{
        ...verre(14),
        background: "rgba(14,20,27,.5)",
        display: "flex",
        alignItems: "center",
        gap: "5px",
        flex: "none",
        width: 66,
        p: "15px 18px",
        border: "1px solid rgba(232,226,212,.14)",
        borderRadius: "20px 20px 20px 6px",
        animation: `${rise} .5s ease both`,
      }}
    >
      {[0, 0.2, 0.4].map((delai) => (
        <Box
          key={delai}
          component="span"
          sx={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            bgcolor: texteClair,
            animation: `${blink} 1.3s ${delai}s infinite`,
          }}
        />
      ))}
    </Box>
  );
}
