import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useInView } from "../../hooks/useInView";

/**
 * Queueless order flow. A message travels down the pipeline and waits
 * at the confirmation gate — nothing reaches the kitchen without a yes.
 */

const STEPS = [
  { name: "Chat message", note: "student types an order" },
  { name: "Order parsing", note: "language + items + qty" },
  { name: "Menu match", note: "availability · price" },
  { name: "Confirmation", note: "student says yes", gate: true },
  { name: "Kitchen queue", note: "sorted by pickup slot" },
  { name: "Pickup token", note: "ping when ready" },
];

const UTTERANCES = [
  { lang: "HI", text: "दो पराठे और एक चाय", gloss: "two parathas and a tea" },
  { lang: "EN", text: "1 veg thali, extra rice, pickup 1:10", gloss: "" },
];

export function OrderPipeline() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const reduce = useReducedMotion();
  const [step, setStep] = useState(reduce ? STEPS.length - 1 : 0);
  const [utterance, setUtterance] = useState(0);

  useEffect(() => {
    if (reduce || !inView) return;
    const atGate = STEPS[step]?.gate;
    const last = step >= STEPS.length - 1;
    const t = window.setTimeout(
      () => {
        if (last) {
          setStep(0);
          setUtterance((u) => (u + 1) % UTTERANCES.length);
        } else setStep((s) => s + 1);
      },
      atGate ? 1800 : last ? 2000 : 750,
    );
    return () => window.clearTimeout(t);
  }, [step, inView, reduce]);

  const u = UTTERANCES[utterance];

  return (
    <div
      ref={ref}
      className="p-5 sm:p-7"
      role="img"
      aria-label="Queueless order flow: chat message, order parsing, menu match, confirmation, kitchen queue, then pickup token."
    >
      <div className="mb-6 border-b border-line pb-5" aria-hidden="true">
        <p className="label-sm">Input · {u.lang}</p>
        <p className="mt-2 text-lg leading-snug sm:text-xl" lang={u.lang === "HI" ? "hi" : "en"}>
          “{u.text}”
        </p>
        {u.gloss && <p className="label-sm mt-1 normal-case tracking-normal">≈ {u.gloss}</p>}
      </div>

      <ol className="relative" aria-hidden="true">
        <span className="absolute bottom-3 left-[5px] top-3 w-px bg-line-strong" />
        {STEPS.map((s, i) => {
          const done = i < step;
          const current = i === step;
          return (
            <li key={s.name} className="relative flex items-baseline gap-4 py-[7px] pl-7">
              <span
                className={`absolute left-0 top-[11px] h-[11px] w-[11px] border transition-colors duration-300 ${
                  current
                    ? "border-amber bg-amber"
                    : done
                      ? "border-bone-dim bg-bone-dim"
                      : "border-line-strong bg-ink"
                } ${s.gate ? "rotate-45" : ""}`}
              />
              <span className={`font-mono text-[0.625rem] ${current ? "text-amber" : "text-ash"}`}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className={`text-[0.95rem] transition-colors duration-300 ${current || done ? "text-bone" : "text-ash"}`}>
                {s.name}
              </span>
              <span className="label-sm ml-auto hidden text-right normal-case tracking-normal sm:inline">
                {current && s.gate ? <span className="text-amber">awaiting confirmation…</span> : s.note}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
