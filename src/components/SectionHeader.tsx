import type { ReactNode } from "react";
import { sections } from "../data/profile";
import { useScramble } from "../hooks/useScramble";

type Props = {
  index: string;
  fragment: string;
  title: string;
  recovered: boolean;
  aside?: ReactNode;
  id?: string;
};

/**
 * Section opener: a ruled metadata line, then a large editorial title
 * that decodes the first time its fragment is recovered.
 */
export function SectionHeader({ index, fragment, title, recovered, aside, id }: Props) {
  const decoded = useScramble(title, recovered, 650);

  return (
    <header className="mb-14 md:mb-20">
      <div className="flex items-center gap-4">
        <span className="label whitespace-nowrap">
          <span className="text-amber">{index}</span> / {fragment}
        </span>
        <span className="rule flex-1" aria-hidden="true" />
        <span className="label-sm hidden whitespace-nowrap sm:inline">
          Fragment {index} of {String(sections.length).padStart(2, "0")} —{" "}
          <span className={recovered ? "text-bone-dim" : "text-rust"}>
            {recovered ? "recovered" : "pending"}
          </span>
        </span>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-12 md:items-end">
        <h2
          id={id}
          className="whitespace-pre-line font-display text-[clamp(2.4rem,6.4vw,5.75rem)] font-medium leading-[0.92] tracking-[-0.035em] md:col-span-8"
          aria-label={title.replace(/\n/g, " ")}
        >
          <span aria-hidden="true">{decoded}</span>
        </h2>
        {aside && <div className="md:col-span-4 md:pb-2">{aside}</div>}
      </div>
    </header>
  );
}
