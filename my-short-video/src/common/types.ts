export type Mood = "tense" | "turn" | "soft" | "cta";

/** One center telop card. Frames are absolute, at 30fps. */
export type Card = {
  from: number;
  to: number;
  /** `**word**` marks the one emphasis word. 14 characters max in total. */
  text: string;
  mood: Mood;
  /** Scene number in the md (1-3), or 4 for the closing CTA. */
  scene: 1 | 2 | 3 | 4;
};
