import { motion } from "framer-motion";
import { evidence, fieldNotes, profile } from "../data/profile";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";

export function SurvivorProfile({ recovered }: { recovered: boolean }) {
  return (
    <section id="profile" aria-labelledby="profile-title" className="relative py-28 md:py-40">
      <div className="shell">
        <SectionHeader
          id="profile-title"
          index="01"
          fragment="Survivor profile"
          title={"Personnel\nrecord."}
          recovered={recovered}
        />

        {/* Statement + metadata */}
        <div className="grid gap-12 md:grid-cols-12">
          <Reveal className="md:col-span-7 lg:col-span-6 lg:col-start-2">
            <p className="text-[clamp(1.5rem,2.6vw,2.25rem)] font-light leading-[1.2] tracking-[-0.015em]">
              {profile.statement}
            </p>
          </Reveal>

          <Reveal delay={0.1} className="md:col-span-4 md:col-start-9 lg:col-span-3 lg:col-start-10">
            <dl className="border-t border-line">
              {profile.metadata.map((m) => (
                <div key={m.key} className="flex items-baseline justify-between gap-4 border-b border-line py-2.5">
                  <dt className="label">{m.key}</dt>
                  <dd className="flex items-center gap-2 text-right text-sm">
                    {m.live && <span className="live-dot" aria-hidden="true" />}
                    {m.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>

        {/* Evidence strip */}
        <div className="mt-24 md:mt-32">
          <p className="label mb-8">Evidence strip — 4 records linked</p>
          <ol className="relative grid gap-0 lg:grid-cols-4">
            {/* connecting line */}
            <motion.span
              aria-hidden="true"
              className="absolute left-[5px] top-0 hidden h-px origin-left bg-line-strong lg:left-0 lg:right-0 lg:block"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.6, 0, 0.2, 1] }}
            />
            <span aria-hidden="true" className="absolute bottom-0 left-[5px] top-0 w-px bg-line-strong lg:hidden" />
            {evidence.map((e, i) => (
              <li key={e.code} className="relative pb-10 pl-8 lg:pb-0 lg:pl-0 lg:pr-8 lg:pt-8">
                <span
                  aria-hidden="true"
                  className={`absolute left-0 top-1.5 h-[11px] w-[11px] border lg:-top-[5px] ${
                    e.stamp ? "border-amber bg-amber" : "border-bone-dim bg-ink"
                  }`}
                />
                <Reveal delay={0.12 * i} y={10}>
                  <p className="label-sm">
                    REC.{String(i + 1).padStart(2, "0")} · {e.code}
                  </p>
                  <p className="label mt-3">{e.label}</p>
                  <p className="mt-1 text-2xl font-medium tracking-tight">{e.title}</p>
                  <p className="mt-2 max-w-[22ch] text-sm leading-relaxed text-bone-dim">{e.detail}</p>
                  {e.stamp && (
                    <span className="stamp mt-4" aria-label={`Note: ${e.stamp}`}>
                      {e.stamp}
                    </span>
                  )}
                </Reveal>
              </li>
            ))}
          </ol>
        </div>

        {/* Field notes */}
        <div className="mt-28 grid gap-10 md:mt-36 md:grid-cols-12">
          <div className="md:col-span-3">
            <h3 className="label text-bone">Field notes</h3>
            <p className="label-sm mt-2 max-w-[24ch] normal-case tracking-normal">
              Things I've noticed about how I work. Unedited, mostly.
            </p>
          </div>
          <ol className="md:col-span-9">
            {fieldNotes.map((note, i) => (
              <li
                key={note}
                className="border-t border-line py-6 last:border-b"
                style={{ paddingLeft: `min(${i * 4}vw, ${i * 3.5}rem)` }}
              >
                <Reveal y={8} delay={0.05 * i} className="flex gap-5">
                  <span className="pt-1.5 font-mono text-[0.6875rem] text-amber">n.{String(i + 1).padStart(2, "0")}</span>
                  <p className="max-w-[46ch] text-xl leading-snug tracking-[-0.01em] md:text-2xl">{note}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
