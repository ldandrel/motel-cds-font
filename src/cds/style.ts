import { keyframes } from "@mui/material/styles";

export const creme = "#e8e2d4";
export const texteClair = "#f4efe4";
export const encre = "#121a22";
export const nuit = "#0d1319";
export const police = "'Univers Else', 'Quicksand', system-ui, sans-serif";
export const easeOut = "cubic-bezier(.16,1,.3,1)";

export const rise = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to   { opacity: 1; transform: translateY(0); }
`;
export const blink = keyframes`
  0%, 60%, 100% { opacity: .25; }
  30% { opacity: 1; }
`;
export const drift = keyframes`
  0%   { transform: scale(1.08) translate3d(0, 0, 0); }
  100% { transform: scale(1.16) translate3d(0, -2.5%, 0); }
`;

// l'apostrophe droite (') est mal dessinée dans Univers Else, on passe en ’
export const apostrophes = (s = "") => s.replace(/'/g, "’");

export const verre = (flou: number) => ({
  background: "rgba(14,20,27,.55)",
  backdropFilter: `blur(${flou}px)`,
  WebkitBackdropFilter: `blur(${flou}px)`,
});

export const styleIndication = {
  font: `400 12.5px/1.4 ${police}`,
  letterSpacing: ".14em",
  textTransform: "uppercase",
  color: "rgba(242,237,226,.42)",
} as const;
