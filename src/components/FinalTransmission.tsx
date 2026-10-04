import { ArrowUpRight } from "lucide-react";
import { links, profile, sections } from "../data/profile";
import { ArchiveLink } from "./ArchiveLink";
import { Reveal } from "./Reveal";
import { useScramble } from "../hooks/useScramble";

type Props = {
  recovered: boolean;
  recoveredCount: number;
  onReplayBoot: () => void;
};

const CHANNELS = [
  { key: "github", label: "GitHub", href: links.github, kind: "url" as const, meta: "code · experiments" },
  { key: "linkedin", label: "LinkedIn", href: links.linkedin, kind: "url" as const, meta: "work · experience" },
  { key: "x", label: "X / Twitter", href: links.x, kind: "url" as const, meta: "build notes" },
  { key: "email", label: "Email", href: links.email, kind: "email" as const, meta: links.email },
];

export function FinalTransmission({ recovered, recoveredCount, onReplayBoot }: Props) {
  const line1 = useScramble("If you found this archive,", recovered, 600);
  const complete = recoveredCount === sections.length;

  return (
    <section id="transmission" aria-labelledby="transmission-title" className="relative pt-28 md:pt-40">
      <div className="shell">
        <div className="flex items-center gap-4">
          <span className="label whitespace-nowrap">
            <span className="text-amber">05</span> / Final transmission
          </span>
          <span className="rule flex-1" aria-hidden="true" />
        </div>

        <h2
          id="transmission-title"
          className="mt-10 text-[clamp(2.6rem,8vw,8rem)] font-semibold uppercase leading-[0.88] tracking-[-0.05em]"
        >
          <span className="sr-only">If you found this archive, the network is still alive.</span>
          <span aria-hidden="true" className="block text-bone-dim">
            {line1}
          </span>
          <span aria-hidden="true" className="block md:pl-[1.2em]">
            the network is <span className="text-amber">still alive.</span>
          </span>
        </h2>

        <div className="mt-16 grid gap-12 md:mt-24 md:grid-cols-12">
          <Reveal className="md:col-span-4">
            <p className="text-2xl leading-snug">
              Want to build something interesting?
              <br />
              <span className="text-bone-dim">Let's talk.</span>
            </p>
            <p className="mt-4 max-w-[36ch] text-bone-dim">
              Internships, hackathon teams, open-source collaborations — or a system that needs to keep working offline.
            </p>
          </Reveal>

          <Reveal delay={0.1} className="md:col-span-8">
            <ul className="border-t border-line-strong">
              {CHANNELS.map((c, i) => (
                <li key={c.key} className="border-b border-line-strong">
                  <ArchiveLink
                    href={c.href}
                    kind={c.kind}
                    className="group relative flex items-baseline gap-4 overflow-hidden py-6 md:gap-8 md:py-8"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 origin-left scale-x-0 bg-amber transition-transform duration-300 ease-out group-hover:scale-x-100"
                    />
                    <span className="relative font-mono text-[0.6875rem] text-amber transition-colors group-hover:text-ink">
                      CH.{String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="relative text-[clamp(2rem,5vw,3.75rem)] font-medium leading-none tracking-[-0.04em] transition-colors group-hover:text-ink">
                      {c.label}
                    </span>
                    <span className="label-sm relative ml-auto hidden transition-colors group-hover:text-ink sm:inline">
                      {c.meta}
                    </span>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="relative shrink-0 self-center transition-colors group-hover:text-ink"
                      size={22}
                    />
                  </ArchiveLink>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>

      <footer className="mt-32 border-t border-line md:mt-48">
        <div className="shell grid gap-6 py-8 sm:grid-cols-2 md:grid-cols-4">
          <p className="label text-bone">Archive end</p>
          <p className="label">
            Node: {profile.handle} · <span className="normal-case">{links.phone}</span>
          </p>
          <p className="label">
            Status: <span className="text-amber">Still building</span>
          </p>
          <p className="label md:text-right">
            Fragments {recoveredCount}/{sections.length}
            {complete ? " · record restored" : ""}
          </p>
        </div>
        <div className="shell flex flex-wrap items-center justify-between gap-4 pb-10">
          <p className="label-sm">
            Built by hand with React, TypeScript, Tailwind and SVG · {profile.coordinates.lat}, {profile.coordinates.lon}
          </p>
          <button type="button" onClick={onReplayBoot} className="label-sm underline-offset-4 hover:text-bone hover:underline">
            Replay boot sequence
          </button>
        </div>
      </footer>
    </section>
  );
}
