import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { sections, type SectionId } from "../data/profile";

type Props = { latest: SectionId | null; count: number };

/** Brief system message each time a fragment is recovered. */
export function RecoveryToast({ latest, count }: Props) {
  const [visible, setVisible] = useState<SectionId | null>(null);

  useEffect(() => {
    if (!latest) return;
    setVisible(latest);
    const t = window.setTimeout(() => setVisible(null), 2600);
    return () => window.clearTimeout(t);
  }, [latest]);

  const section = sections.find((s) => s.id === visible);
  const complete = count === sections.length;

  return (
    <div className="pointer-events-none fixed bottom-5 left-1/2 z-40 -translate-x-1/2 md:left-auto md:right-14 md:translate-x-0" aria-live="polite">
      <AnimatePresence>
        {section && (
          <motion.p
            key={section.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="label whitespace-nowrap border border-line-strong bg-ink px-3 py-2 text-bone"
          >
            <span className="text-amber">+</span> Fragment {section.index} recovered — {section.fragment}
            {complete && <span className="text-amber"> · record complete</span>}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
