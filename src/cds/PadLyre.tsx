import { useRef, useState } from "react";
import type { PointerEvent } from "react";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Typography from "@mui/material/Typography";
import { easeOut, police, rise, styleIndication, verre } from "./style";

type Props = {
  // x et y entre -1 et 1, y vers le haut
  onChange?: (position: { x: number; y: number }) => void;
};

const trait = { fill: "none", stroke: "rgba(232,226,212,.22)", strokeWidth: 1, vectorEffect: "non-scaling-stroke" } as const;
const legende = { fill: "rgba(232,226,212,.38)", fontFamily: police, fontSize: 3.6, letterSpacing: ".3em", textAnchor: "middle" } as const;

const Plan = () => (
  <Box component="svg" viewBox="0 0 100 100" sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
    <rect x="18" y="9" width="64" height="24" rx="2" {...trait} fill="rgba(232,226,212,.05)" />
    <text x="50" y="22.5" {...legende}>SCÈNE</text>
    {[58, 66, 74, 82].map((y) => (
      <path key={y} d={`M ${14 + (y - 58) / 4} ${y} Q 50 ${y + 9} ${86 - (y - 58) / 4} ${y}`} {...trait} />
    ))}
    <text x="50" y="96" {...legende}>GRADINS</text>
  </Box>
);

const borne = (v: number) => Math.min(1, Math.max(-1, v));

export default function PadLyre({ onChange }: Props) {
  const zoneRef = useRef<HTMLDivElement>(null);
  const [lyre, setLyre] = useState({ x: 0, y: 0 });

  const orienter = (position: { x: number; y: number }) => {
    setLyre(position);
    onChange?.(position);
  };
  const viser = (e: PointerEvent<HTMLDivElement>) => {
    const zone = zoneRef.current?.getBoundingClientRect();
    if (!zone) return;
    orienter({
      x: +borne(((e.clientX - zone.left) / zone.width) * 2 - 1).toFixed(2),
      y: +borne(1 - ((e.clientY - zone.top) / zone.height) * 2).toFixed(2),
    });
  };

  return (
    <>
      <Box
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          viser(e);
        }}
        onPointerMove={(e) => e.currentTarget.hasPointerCapture(e.pointerId) && viser(e)}
        sx={{
          ...verre(18),
          position: "relative",
          width: "min(100%, 300px)",
          aspectRatio: "1",
          border: "1px solid rgba(232,226,212,.28)",
          borderRadius: "28px",
          boxShadow: "0 10px 34px rgba(0,0,0,.35)",
          touchAction: "none",
          cursor: "crosshair",
          animation: `${rise} .6s ${easeOut} both`,
        }}
      >
        <Plan />
        <Box ref={zoneRef} sx={{ position: "absolute", inset: 24 }}>
          <Box
            sx={{
              position: "absolute",
              top: "-24px",
              bottom: "-24px",
              left: `${(lyre.x + 1) * 50}%`,
              width: "1px",
              background: "rgba(232,226,212,.22)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              left: "-24px",
              right: "-24px",
              top: `${(1 - lyre.y) * 50}%`,
              height: "1px",
              background: "rgba(232,226,212,.22)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              left: `${(lyre.x + 1) * 50}%`,
              top: `${(1 - lyre.y) * 50}%`,
              width: 40,
              height: 40,
              transform: "translate(-50%, -50%)",
              borderRadius: "50%",
              background: "rgba(232,226,212,.92)",
              boxShadow: "0 0 24px rgba(232,226,212,.7)",
            }}
          />
        </Box>
      </Box>
      <Typography sx={styleIndication}>glisse pour diriger la lumière</Typography>
      <ButtonBase
        onClick={() => orienter({ x: 0, y: 0 })}
        sx={{
          ...styleIndication,
          visibility: lyre.x || lyre.y ? "visible" : "hidden",
          mt: "-4px",
          color: "rgba(242,237,226,.7)",
          textDecoration: "underline",
          textUnderlineOffset: "4px",
        }}
      >
        recentrer
      </ButtonBase>
    </>
  );
}
