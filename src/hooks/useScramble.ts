import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

const GLYPHS = "▚▞░▒#/\\<>_-=+*01";

/**
 * Decodes `text` from noise into its final form once `run` turns true.
 * Used sparingly: section titles decode the first time a fragment is
 * recovered. Returns the final text immediately for reduced motion.
 */
export function useScramble(text: string, run: boolean, duration = 700) {
  const reduce = useReducedMotion();
  const [output, setOutput] = useState(text);
  const done = useRef(false);

  useEffect(() => {
    if (!run || done.current || reduce) return;
    done.current = true;

    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const settled = Math.floor(progress * text.length);
      let next = "";
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (i < settled || ch === " " || ch === "\n") next += ch;
        else next += GLYPHS[(Math.random() * GLYPHS.length) | 0];
      }
      setOutput(next);
      if (progress < 1) frame = requestAnimationFrame(tick);
      else setOutput(text);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [run, text, duration, reduce]);

  return output;
}
