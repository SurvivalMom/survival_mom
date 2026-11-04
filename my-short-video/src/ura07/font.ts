import { loadFont } from "@remotion/google-fonts/NotoSansJP";

// Load the weights we use, so the telop looks the same on any machine
// (including render servers without Japanese fonts).
const { fontFamily } = loadFont("normal", { weights: ["700", "900"] });

export const FONT_FAMILY = `${fontFamily}, 'Hiragino Sans', 'Yu Gothic', sans-serif`;
