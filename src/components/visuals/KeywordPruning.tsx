import { useEffect, useRef, useState } from "react";
import { useInView } from "../../hooks/useInView";

/**
 * Illustration of pruning a small keyword-spotting model. Cells fade
 * out once when the figure scrolls into view. Not a plot of results.
 */

const BLOCKS = 8;
const CHANNELS = 12;

// Deterministic pattern so the figure is stable across renders.
const pruned = (b: number, h: number) => (b * 7 + h * 5) % 11 < 3 || (b > 4 && (b + h) % 4 === 0);

const WAVE = Array.from({ length: 64 }, (_, i) => {
  const env = Math.sin((i / 63) * Math.PI) ** 0.6;
  const v = Math.sin(i * 0.9) * 0.55 + Math.sin(i * 2.3) * 0.3 + Math.sin(i * 0.37) * 0.15;
  return Math.max(0.06, Math.abs(v) * env);
});

export function KeywordPruning() {
  const ref = useRef<SVGSVGElement>(null);
  const seen = useInView(ref);
  const inView = useSticky(seen);

  return (
    <svg
      ref={ref}
      viewBox="0 0 600 300"
      className="h-auto w-full"
      role="img"
      aria-label="Illustration: a spoken command waveform feeding a stack of model layers, with some channels removed to show the idea of pruning."
    >
      <g transform="translate(24 150)">
        {WAVE.map((v, i) => (
          <rect key={i} x={i * 3} y={-v * 60} width={1.6} height={v * 120} fill="#a8a293" />
        ))}
        <text x={0} y={110} fontSize="11" fill="#77725f" className="font-mono">
          "lights off" · 16 kHz
        </text>
      </g>

      <path d="M222 150 H262" stroke="#77725f" strokeDasharray="2 3" />

      <g transform="translate(272 34)">
        {Array.from({ length: BLOCKS }, (_, b) => (
          <g key={b} transform={`translate(0 ${b * 28})`}>
            <text x={0} y={13} fontSize="10" fill="#77725f" className="font-mono">
              L{String(b + 1).padStart(2, "0")}
            </text>
            {Array.from({ length: CHANNELS }, (_, h) => {
              const cut = pruned(b, h);
              return (
                <rect
                  key={h}
                  x={34 + h * 20}
                  y={2}
                  width={15}
                  height={15}
                  fill="#ebe4d3"
                  fillOpacity={cut && inView ? 0 : 0.82}
                  stroke={cut && inView ? "#ff8f2b" : "none"}
                  strokeDasharray="2 2"
                  style={{ transition: `fill-opacity 500ms ${(b * CHANNELS + h) * 8}ms` }}
                />
              );
            })}
          </g>
        ))}
        <text x={34} y={BLOCKS * 28 + 18} fontSize="10" fill="#a8a293" className="font-mono">
          <tspan fill="#ff8f2b">⬚</tspan> pruned · ■ kept — illustrative
        </text>
      </g>
    </svg>
  );
}

/** Latches true once — the pruning happens once, it does not loop. */
function useSticky(value: boolean) {
  const [latched, setLatched] = useState(false);
  useEffect(() => {
    if (value) setLatched(true);
  }, [value]);
  return latched;
}
