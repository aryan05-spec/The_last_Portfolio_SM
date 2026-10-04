import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { links, profile, sections } from "../data/profile";
import { ArchiveLink } from "./ArchiveLink";
import { SystemStatus } from "./SystemStatus";

const HEADLINE = ["Building things", "that survive", "the demo."];

function today() {
  const d = new Date();
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

/** Live cursor coordinates — the archive is "scanning" the visitor. */
function useCursorReadout(ref: React.RefObject<HTMLElement | null>) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(pointer: fine)").matches) return;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        setPos({ x: Math.round(e.clientX - r.left), y: Math.round(e.clientY - r.top) });
      });
    };
    el.addEventListener("pointermove", onMove);
    return () => {
      el.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, [ref]);
  return pos;
}

export function Hero({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const cursor = useCursorReadout(ref);

  return (
    <section
      id="top"
      ref={ref}
      aria-labelledby="hero-title"
      className="relative flex min-h-[100svh] flex-col pt-24 md:pt-28"
    >
      <div className="shell relative flex flex-1 flex-col">
        {/* Record header */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 border-y border-line py-3 md:grid-cols-4">
          <p className="label">
            Archive record <span className="whitespace-nowrap text-bone">No. 0007</span>
          </p>
          <p className="label">
            Subject <span className="text-bone">{profile.name}</span>
          </p>
          <p className="label">
            Status <span className="text-amber">Active</span>
          </p>
          <p className="label md:text-right">
            Accessed <span className="text-bone tabular-nums">{today()}</span>
          </p>
        </div>

        <div className="grid flex-1 grid-cols-12 gap-x-6 pt-10 md:pt-16">
          {/* Side rail */}
          <div className="col-span-1 hidden flex-col justify-between pb-10 lg:flex" aria-hidden="true">
            <span className="label-sm [writing-mode:vertical-rl] rotate-180">
              {profile.institutionShort} / {profile.field}
            </span>
            <span className="label-sm tabular-nums leading-relaxed">
              X {String(cursor.x).padStart(4, "0")}
              <br />Y {String(cursor.y).padStart(4, "0")}
            </span>
          </div>

          <div className="col-span-12 lg:col-span-11">
            <h1 id="hero-title" className="sr-only">
              {profile.name} — {profile.roles.join(", ")}
            </h1>
            <p
              aria-hidden="true"
              className="relative font-display text-[clamp(3.1rem,10.4vw,10.5rem)] font-semibold uppercase leading-[0.86] tracking-[-0.05em]"
            >
              {HEADLINE.map((line, i) => (
                <motion.span
                  key={line}
                  className={`block ${i === 1 ? "pl-[0.6em] md:pl-[1.4em]" : ""} ${i === 2 ? "text-amber" : ""}`}
                  initial={{ opacity: 0, y: "0.25em" }}
                  animate={ready ? { opacity: 1, y: 0 } : undefined}
                  transition={{ duration: 0.8, delay: 0.08 * i, ease: [0.2, 0.7, 0.2, 1] }}
                >
                  {line}
                  {i === 2 && (
                    <span className="label ml-3 hidden align-top normal-case tracking-normal text-bone-dim md:inline-block md:translate-y-[0.9em]">
                      ← and production,
                      <br />
                      ideally.
                    </span>
                  )}
                </motion.span>
              ))}
            </p>

            <div className="mt-12 grid gap-10 md:mt-16 md:grid-cols-12">
              <motion.div
                className="md:col-span-6 lg:col-span-5"
                initial={{ opacity: 0 }}
                animate={ready ? { opacity: 1 } : undefined}
                transition={{ duration: 0.8, delay: 0.35 }}
              >
                <p className="label mb-4 text-bone">
                  {profile.name} — {profile.roles.join(" / ")}
                </p>
                <p className="text-[1.0625rem] leading-relaxed text-bone-dim md:text-lg">{profile.intro}</p>
              </motion.div>

              <motion.div
                className="flex flex-col justify-between gap-8 md:col-span-6 md:col-start-7 lg:col-span-5 lg:col-start-8"
                initial={{ opacity: 0 }}
                animate={ready ? { opacity: 1 } : undefined}
                transition={{ duration: 0.8, delay: 0.45 }}
              >
                <div>
                  <SystemStatus label="Archive online" />
                  <div className="mt-5 flex flex-wrap gap-3">
                    <a href="#archives" className="btn btn-primary">
                      Explore archive <span aria-hidden="true">↓</span>
                    </a>
                    <ArchiveLink href={links.github} className="btn btn-ghost">
                      View GitHub <ArrowUpRight size={14} aria-hidden="true" />
                    </ArchiveLink>
                  </div>
                </div>
                <figure className="border-l border-amber pl-4">
                  <figcaption className="label-sm mb-2">Last transmission</figcaption>
                  <blockquote className="text-lg leading-snug text-bone">“{profile.lastTransmission}”</blockquote>
                </figure>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Table of contents — doubles as an index of recovered fragments */}
        <nav aria-label="Archive index" className="mt-16 border-t border-line pb-8 pt-4">
          <ol className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3 md:grid-cols-5">
            {sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="group flex items-baseline gap-2 py-1">
                  <span className="font-mono text-[0.6875rem] text-amber">{s.index}</span>
                  <span className="text-sm text-bone-dim transition-colors group-hover:text-bone">{s.fragment}</span>
                  <span className="label-sm hidden flex-1 translate-y-[-3px] border-b border-dotted border-line md:block" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </section>
  );
}
