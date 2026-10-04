import { useEffect, useRef, useState } from "react";
import { sections, type SectionId } from "../data/profile";

/**
 * Tracks which archive fragments (sections) have been viewed and which
 * one is currently active. Powers the signature "record recovery" meter.
 */
export function useRecovery(enabled: boolean) {
  const [active, setActive] = useState<SectionId | null>(null);
  const [recovered, setRecovered] = useState<SectionId[]>([]);
  const [latest, setLatest] = useState<SectionId | null>(null);
  const seen = useRef(new Set<SectionId>());

  useEffect(() => {
    if (!enabled) return;

    const elements = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);

    // Recovered: a fragment counts once a meaningful part of it was seen.
    const recoverObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const id = entry.target.id as SectionId;
          if (seen.current.has(id)) continue;
          seen.current.add(id);
          setRecovered((prev) => [...prev, id]);
          setLatest(id);
        }
      },
      { rootMargin: "0px 0px -35% 0px", threshold: 0 },
    );

    elements.forEach((el) => {
      recoverObserver.observe(el);
    });

    // Active section: the last one whose top has crossed 40% of the viewport.
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const line = window.innerHeight * 0.4;
        let current: SectionId | null = null;
        for (const el of elements) {
          if (el.getBoundingClientRect().top <= line) current = el.id as SectionId;
        }
        setActive(current);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      recoverObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [enabled]);

  return { active, recovered, latest };
}
