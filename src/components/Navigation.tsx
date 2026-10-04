import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { profile, sections, type SectionId } from "../data/profile";

type Props = {
  active: SectionId | null;
  recovered: SectionId[];
};

/** Identity is recovered at boot; each section restores the rest. */
export function integrityOf(recovered: SectionId[]) {
  const base = 40;
  return Math.min(100, base + Math.round((recovered.length / sections.length) * (100 - base)));
}

export function Navigation({ active, recovered }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const integrity = integrityOf(recovered);
  const complete = integrity === 100;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open ? "border-b border-line bg-ink/92" : "border-b border-transparent"
      }`}
    >
      <nav aria-label="Archive sections" className="shell flex h-14 items-center justify-between gap-6">
        <a href="#top" className="group flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="live-dot" aria-hidden="true" />
          <span className="font-mono text-[0.75rem] tracking-[0.1em]">
            {profile.name.split(" ")[0].toUpperCase()} <span className="text-ash">/</span> <span className="text-bone-dim group-hover:text-bone">ARCHIVE</span>
          </span>
        </a>

        <ul className="hidden items-center gap-7 lg:flex">
          {sections.map((s) => {
            const isActive = active === s.id;
            const isRecovered = recovered.includes(s.id);
            return (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative font-mono text-[0.6875rem] uppercase tracking-[0.1em] transition-colors ${
                    isActive ? "text-bone" : isRecovered ? "text-bone-dim hover:text-bone" : "text-ash hover:text-bone"
                  }`}
                >
                  <span className={isActive ? "text-amber" : ""}>{s.index}</span> {s.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute -bottom-2 left-0 right-0 h-px bg-amber"
                      transition={{ type: "spring", stiffness: 500, damping: 40 }}
                    />
                  )}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-4">
          <IntegrityMeter integrity={integrity} complete={complete} recovered={recovered} />
          <button
            type="button"
            className="label border border-line-strong px-3 py-2 text-bone lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-x-0 bottom-0 top-14 z-40 flex flex-col bg-ink lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ul className="shell flex flex-1 flex-col justify-center gap-1">
              {sections.map((s, i) => (
                <motion.li
                  key={s.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i }}
                  className="border-b border-line"
                >
                  <a
                    href={`#${s.id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-4 py-4"
                  >
                    <span className="font-mono text-xs text-amber">{s.index}</span>
                    <span className="text-[2rem] font-medium leading-none tracking-tight">{s.label}</span>
                    <span className="label-sm ml-auto">
                      {recovered.includes(s.id) ? "recovered" : "pending"}
                    </span>
                  </a>
                </motion.li>
              ))}
            </ul>
            <p className="shell label-sm pb-8">Node: {profile.handle} · Integrity {integrity}%</p>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function IntegrityMeter({
  integrity,
  complete,
  recovered,
}: {
  integrity: number;
  complete: boolean;
  recovered: SectionId[];
}) {
  return (
    <div
      className="flex items-center gap-3"
    >
      <span className="sr-only">
        Archive integrity {integrity} percent, {recovered.length} of {sections.length} fragments recovered.
      </span>
      <span className="label hidden whitespace-nowrap xl:inline">
        {complete ? "Record restored" : "Archive integrity"}
      </span>
      <span className="flex gap-[3px]" aria-hidden="true">
        <span className="h-3 w-[3px] bg-bone" title="Identity" />
        {sections.map((s) => (
          <span
            key={s.id}
            title={s.fragment}
            className={`h-3 w-[3px] transition-colors duration-500 ${
              recovered.includes(s.id) ? (complete ? "bg-amber" : "bg-bone") : "bg-line-strong"
            }`}
          />
        ))}
      </span>
      <span
        className={`w-9 font-mono text-[0.75rem] tabular-nums ${complete ? "text-amber" : "text-bone"}`}
        aria-hidden="true"
      >
        {integrity}%
      </span>
    </div>
  );
}
