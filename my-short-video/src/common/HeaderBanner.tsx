import React from "react";
import { FONT_FAMILY } from "./font";

/**
 * Fixed top header from the md: red box, yellow text, shown from 0s to the
 * end. No fade-in and no typewriter effect (the md asks for this, so the
 * header alone stops the scroll in the first frames).
 */
export const HeaderBanner: React.FC<{ text: string }> = ({ text }) => (
  <div
    style={{
      position: "absolute",
      // Below the TikTok/Shorts top UI (tabs, search).
      top: 210,
      left: 0,
      right: 0,
      display: "flex",
      justifyContent: "center",
    }}
  >
    <div
      style={{
        background: "#d92b1f",
        color: "#ffe500",
        fontFamily: FONT_FAMILY,
        fontWeight: 900,
        fontSize: 82,
        lineHeight: 1.25,
        textAlign: "center",
        whiteSpace: "pre-line",
        padding: "30px 48px",
        borderRadius: 28,
        boxShadow: "0 18px 46px rgba(0,0,0,0.5)",
      }}
    >
      {text}
    </div>
  </div>
);
