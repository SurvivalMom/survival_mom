import { loadFont as loadGoogleFont } from "@remotion/google-fonts/NotoSansJP";
import { loadFont as loadLocalFont } from "@remotion/fonts";
import { staticFile } from "remotion";

/**
 * Telop font. Switch with REMOTION_FONT_MODE in my-short-video/.env
 * (.env is git-ignored, so each machine can choose its own):
 *
 *   noto   (default) Noto Sans JP from Google Fonts. Free, looks the same
 *          everywhere, including cloud render servers.
 *   system Fonts installed on the rendering machine: Hiragino on a Mac,
 *          Meiryo / Yu Gothic on Windows. No font files enter the project.
 *   file   Font files you hold a license for, placed in public/fonts/
 *          (git-ignored). Paths are relative to public/:
 *            REMOTION_FONT_BOLD=fonts/your-font-W8.otf    (headline, weight 900)
 *            REMOTION_FONT_MEDIUM=fonts/your-font-W6.otf  (badge, weight 700)
 *
 * Commercial fonts (Hiragino, Meiryo, etc.) must never be committed to git:
 * the OS licenses do not allow redistributing the files. See public/fonts/README.md.
 */

type Mode = "noto" | "system" | "file";
const MODE = (process.env.REMOTION_FONT_MODE ?? "noto") as Mode;

// Used after the chosen font, for any glyph it lacks.
const FALLBACK = "'Noto Sans JP', sans-serif";

const SYSTEM_STACK = [
  "'Hiragino Sans'", // macOS (W0-W9; 900 picks a heavy weight)
  "'Hiragino Kaku Gothic ProN'", // older macOS
  "'Meiryo'", // Windows (Regular/Bold only; 900 renders as Bold)
  "'Yu Gothic'", // Windows
].join(", ");

const LICENSED_FAMILY = "TelopLicensed";

const resolve = (): string => {
  if (MODE === "system") {
    // Still load Noto as the fallback, so a machine without Hiragino or
    // Meiryo does not drop to a thin default font.
    loadGoogleFont("normal", { weights: ["700", "900"] });
    return `${SYSTEM_STACK}, ${FALLBACK}`;
  }

  if (MODE === "file") {
    const bold = process.env.REMOTION_FONT_BOLD ?? "fonts/telop-bold.otf";
    const medium = process.env.REMOTION_FONT_MEDIUM ?? bold;
    loadLocalFont({ family: LICENSED_FAMILY, url: staticFile(bold), weight: "900" });
    loadLocalFont({ family: LICENSED_FAMILY, url: staticFile(medium), weight: "700" });
    return `'${LICENSED_FAMILY}', ${FALLBACK}`;
  }

  const { fontFamily } = loadGoogleFont("normal", { weights: ["700", "900"] });
  return `${fontFamily}, sans-serif`;
};

export const FONT_MODE = MODE;
export const FONT_FAMILY = resolve();
