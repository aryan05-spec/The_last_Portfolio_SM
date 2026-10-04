import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useInView } from "../../hooks/useInView";

/**
 * Schematic local mesh. An edit lands on one device and spreads hop by
 * hop to every reachable peer. Two devices are offline — they wait.
 */

type Node = { id: string; x: number; y: number; offline?: boolean };

const NODES: Node[] = [
  { id: "phone-1", x: 300, y: 36 },
  { id: "tab-2", x: 470, y: 52 },
  { id: "laptop-3", x: 110, y: 48 },
  { id: "phone-4", x: 220, y: 120 },
  { id: "phone-5", x: 380, y: 126 },
  { id: "lab-pc", x: 510, y: 140 },
  { id: "phone-7", x: 60, y: 150 },
  { id: "laptop-8", x: 150, y: 214 },
  { id: "phone-9", x: 300, y: 210 },
  { id: "tab-10", x: 450, y: 222 },
  { id: "phone-11", x: 230, y: 296 },
  { id: "phone-12", x: 380, y: 300 },
  { id: "pi-hub", x: 500, y: 300 },
  { id: "phone-14", x: 300, y: 370 },
  { id: "laptop-15", x: 110, y: 350 },
  { id: "phone-16", x: 450, y: 368, offline: true },
  { id: "tab-17", x: 30, y: 262, offline: true },
];

// Undirected links between devices that can see each other.
const LINKS: [string, string][] = [
  ["phone-1", "phone-4"], ["phone-1", "phone-5"], ["tab-2", "lab-pc"], ["tab-2", "tab-10"], ["laptop-3", "phone-7"],
  ["laptop-3", "phone-4"], ["phone-4", "laptop-8"], ["phone-4", "phone-9"], ["phone-5", "phone-9"], ["phone-5", "tab-10"],
  ["lab-pc", "tab-10"], ["lab-pc", "pi-hub"], ["phone-7", "laptop-8"], ["laptop-8", "phone-11"], ["laptop-8", "laptop-15"],
  ["phone-9", "phone-11"], ["phone-9", "phone-12"], ["tab-10", "phone-12"], ["tab-10", "pi-hub"], ["phone-11", "phone-14"],
  ["phone-12", "phone-14"], ["phone-11", "laptop-15"], ["phone-16", "pi-hub"], ["tab-17", "laptop-15"],
];

const SEEDS = ["phone-12", "laptop-15", "laptop-8", "pi-hub"];

const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));

function hops(seed: string) {
  const adj: Record<string, string[]> = {};
  for (const [a, b] of LINKS) {
    (adj[a] ??= []).push(b);
    (adj[b] ??= []).push(a);
  }
  const depth: Record<string, number> = { [seed]: 0 };
  const queue = [seed];
  while (queue.length) {
    const cur = queue.shift()!;
    for (const d of adj[cur] ?? []) {
      if (depth[d] === undefined && !byId[d].offline) {
        depth[d] = depth[cur] + 1;
        queue.push(d);
      }
    }
  }
  return depth;
}

export function MeshSync() {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref);
  const reduce = useReducedMotion();
  const [seedIdx, setSeedIdx] = useState(0);
  const [step, setStep] = useState(reduce ? 99 : 0);

  const seed = SEEDS[seedIdx];
  const depths = useMemo(() => hops(seed), [seed]);
  const maxDepth = Math.max(...Object.values(depths));

  useEffect(() => {
    if (reduce || !inView) return;
    const holdUntil = maxDepth + 4;
    const t = window.setTimeout(
      () => {
        if (step >= holdUntil) {
          setSeedIdx((i) => (i + 1) % SEEDS.length);
          setStep(0);
        } else setStep((s) => s + 1);
      },
      step === 0 ? 700 : 420,
    );
    return () => window.clearTimeout(t);
  }, [step, inView, reduce, maxDepth]);

  const reached = Object.entries(depths).filter(([, d]) => d <= step && d > 0).length;
  const isLit = (id: string) => depths[id] !== undefined && depths[id] <= step;

  return (
    <svg
      ref={ref}
      viewBox="0 0 600 420"
      className="h-auto w-full"
      role="img"
      aria-label="Schematic mesh of devices. An edit on one device spreads hop by hop to every connected peer; two offline devices are not reached."
    >
      {LINKS.map(([from, to]) => {
        const a = byId[from];
        const b = byId[to];
        const lit = isLit(from) && isLit(to) && Math.abs(depths[from] - depths[to]) === 1;
        const offline = a.offline || b.offline;
        return (
          <line
            key={`${from}-${to}`}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            className={lit ? "text-amber" : offline ? "text-rust" : "text-[#3b3933]"}
            stroke="currentColor"
            strokeWidth={lit ? 1.4 : 1}
            strokeDasharray={offline ? "3 4" : undefined}
            style={{ transition: "stroke 300ms, stroke-width 300ms" }}
          />
        );
      })}

      {NODES.map((n) => {
        const lit = isLit(n.id);
        const isSeed = n.id === seed;
        return (
          <g key={n.id} transform={`translate(${n.x} ${n.y})`}>
            {isSeed && !reduce && (
              <circle r="14" fill="none" stroke="#ff8f2b" strokeOpacity="0.5">
                <animate attributeName="r" from="6" to="22" dur="1.4s" repeatCount="indefinite" />
                <animate attributeName="stroke-opacity" from="0.6" to="0" dur="1.4s" repeatCount="indefinite" />
              </circle>
            )}
            <rect
              x={-5}
              y={-5}
              width={10}
              height={10}
              fill={isSeed ? "#ff8f2b" : lit ? "#0c0c0a" : "#12120f"}
              stroke={n.offline ? "#c0645a" : lit ? "#ff8f2b" : "#77725f"}
              strokeDasharray={n.offline ? "2 2" : undefined}
              style={{ transition: "fill 300ms, stroke 300ms" }}
            />
            <text
              x={10}
              y={4}
              className="dg-text font-mono"
              fontSize={11}
              fill={n.offline ? "#c0645a" : lit ? "#ebe4d3" : "#77725f"}
              style={{ transition: "fill 300ms" }}
            >
              {n.id}
            </text>
          </g>
        );
      })}

      <g className="dg-text font-mono" fontSize="11">
        <text x="16" y="410" fill="#a8a293">
          Δ edit on {seed} → {reached} peer{reached === 1 ? "" : "s"} synced
        </text>
        <text x="584" y="410" fill="#c0645a" textAnchor="end">
          ⌁ 2 offline
        </text>
      </g>
    </svg>
  );
}
