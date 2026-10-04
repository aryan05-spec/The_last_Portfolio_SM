import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { profile } from "../data/profile";

const BOOT_LINES: { text: string; state: string; tone?: "warn" }[] = [
  { text: "ARCHIVE NODE 07", state: "MOUNTED" },
  { text: "SYSTEM STATUS", state: "UNSTABLE", tone: "warn" },
  { text: "NETWORK", state: "PARTIALLY RESTORED" },
  { text: "PERSONNEL RECORD", state: "FOUND" },
];

const LINE_MS = 340;
const RECOVER_MS = 900;

export const SKIP_KEY = "archive.skipBoot";

type Props = { onComplete: () => void };

/**
 * 2–4 second boot. Every step is skippable; reduced motion shows the
 * final state immediately.
 */
export function BootSequence({ onComplete }: Props) {
  const reduce = useReducedMotion();
  const [lines, setLines] = useState(reduce ? BOOT_LINES.length : 0);
  const [phase, setPhase] = useState<"boot" | "recover" | "ready">(reduce ? "ready" : "boot");
  const [progress, setProgress] = useState(reduce ? 100 : 0);
  const [leaving, setLeaving] = useState(false);
  const enterRef = useRef<HTMLButtonElement>(null);
  const leavingRef = useRef(false);

  // Lock page scroll while the overlay is up.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    if (phase !== "boot") return;
    if (lines < BOOT_LINES.length) {
      const t = window.setTimeout(() => setLines((n) => n + 1), LINE_MS);
      return () => window.clearTimeout(t);
    }
    const t = window.setTimeout(() => setPhase("recover"), 220);
    return () => window.clearTimeout(t);
  }, [lines, phase]);

  useEffect(() => {
    if (phase !== "recover") return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / RECOVER_MS);
      // Stalls briefly around 60% — the network is unreliable, after all.
      const eased = p < 0.55 ? p * 1.1 : p < 0.7 ? 0.605 : 0.605 + (p - 0.7) * 1.317;
      setProgress(Math.round(Math.min(1, eased) * 100));
      if (p < 1) frame = requestAnimationFrame(tick);
      else setPhase("ready");
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [phase]);

  useEffect(() => {
    if (phase === "ready") enterRef.current?.focus({ preventScroll: true });
  }, [phase]);

  const exit = () => {
    if (leavingRef.current) return;
    leavingRef.current = true;
    setLeaving(true);
    window.setTimeout(onComplete, reduce ? 0 : 520);
  };

  const skip = () => {
    try {
      window.localStorage.setItem(SKIP_KEY, "1");
    } catch {
      /* storage unavailable — skip just this once */
    }
    exit();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") skip();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Archive boot sequence"
      className="fixed inset-0 z-[100] flex flex-col bg-ink text-bone"
      initial={false}
      animate={leaving ? { clipPath: "inset(0 0 100% 0)" } : { clipPath: "inset(0 0 0% 0)" }}
      transition={{ duration: 0.5, ease: [0.7, 0, 0.3, 1] }}
    >
      <div className="env-grid" aria-hidden="true" />

      <div className="shell relative flex items-center justify-between pt-5">
        <span className="label">Silicon Maze / The last portfolio</span>
        <span className="label-sm hidden sm:inline">
          {profile.coordinates.lat} · {profile.coordinates.lon}
        </span>
      </div>

      <div className="shell relative flex flex-1 flex-col justify-center">
        <ol className="space-y-2 font-mono text-[0.75rem] tracking-[0.06em] sm:text-[0.8125rem]" aria-live="polite">
          {BOOT_LINES.slice(0, lines).map((line, i) => (
            <li key={line.text} className="flex max-w-xl items-baseline gap-3">
              <span className="text-ash" aria-hidden="true">
                {(i * 0.34 + 0.012).toFixed(3)}
              </span>
              <span className="text-bone-dim">[</span>
              <span>{line.text}</span>
              <span
                className="mx-1 hidden flex-1 border-b border-dotted border-line-strong sm:block"
                aria-hidden="true"
              />
              <span className={line.tone === "warn" ? "text-rust" : "text-bone"}>{line.state}</span>
              <span className="text-bone-dim">]</span>
            </li>
          ))}
        </ol>

        <div className="mt-10 min-h-[15rem] sm:min-h-[17rem]">
          {phase !== "boot" && (
            <div>
              <div className="flex max-w-xl items-center gap-4 font-mono text-[0.75rem] tracking-[0.08em]">
                <span className={phase === "ready" ? "text-bone-dim" : "caret"}>
                  {phase === "ready" ? "IDENTITY RECOVERED" : "RECOVERING IDENTITY"}
                </span>
                <span className="relative h-px flex-1 bg-line-strong" aria-hidden="true">
                  <span className="absolute inset-y-0 left-0 bg-amber" style={{ width: `${progress}%` }} />
                </span>
                <span className="w-10 text-right tabular-nums">{progress}%</span>
              </div>

              {phase === "ready" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="mt-8"
                >
                  <p className="font-display text-[clamp(3rem,11vw,9.5rem)] font-semibold uppercase leading-[0.85] tracking-[-0.045em]">
                    {profile.name.split(" ").map((word, i) => (
                      <motion.span
                        key={word}
                        className="block"
                        initial={{ clipPath: "inset(0 100% 0 0)" }}
                        animate={{ clipPath: "inset(0 0% 0 0)" }}
                        transition={{ duration: 0.55, delay: i * 0.12, ease: [0.6, 0, 0.2, 1] }}
                      >
                        {word}
                      </motion.span>
                    ))}
                  </p>
                  <p className="label mt-5 text-bone">{profile.roles.join(" / ")}</p>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="shell relative flex flex-wrap items-center justify-between gap-4 pb-6 sm:pb-8">
        <button
          ref={enterRef}
          type="button"
          onClick={exit}
          disabled={phase !== "ready"}
          className="btn btn-primary disabled:cursor-wait disabled:bg-ink-3 disabled:text-ash"
        >
          Enter archive <span aria-hidden="true">→</span>
        </button>
        <button type="button" onClick={skip} className="label underline-offset-4 hover:text-bone hover:underline">
          Skip boot sequence <span className="text-ash">[esc]</span>
        </button>
      </div>
    </motion.div>
  );
}
