import { motion } from "framer-motion";
import { buildLog } from "../data/buildlog";
import { SectionHeader } from "./SectionHeader";

export function BuildLog({ recovered }: { recovered: boolean }) {
  return (
    <section id="log" aria-labelledby="log-title" className="relative py-28 md:py-40">
      <div className="shell">
        <SectionHeader
          id="log-title"
          index="04"
          fragment="Build log"
          title={"Things I\nwent looking for."}
          recovered={recovered}
          aside={
            <p className="max-w-[34ch] text-bone-dim">
              Not a résumé — a running log of what I explored, newest first. Entries without a timestamp stay undated
              rather than guessed.
            </p>
          }
        />

        <div className="grid gap-10 md:grid-cols-12">
          <div className="hidden md:col-span-3 md:block">
            <div className="sticky top-24">
              <p className="label-sm">$ tail build.log</p>
              <p className="label-sm mt-1">{buildLog.length} entries</p>
            </div>
          </div>

          <ol className="relative md:col-span-9">
            <span aria-hidden="true" className="absolute bottom-0 left-[5.5rem] top-0 hidden w-px bg-line sm:block md:left-[7rem]" />
            {buildLog.map((entry, i) => (
              <motion.li
                key={entry.title}
                className="relative grid gap-2 border-b border-line py-7 first:pt-0 sm:grid-cols-[5.5rem_1fr] sm:gap-0 md:grid-cols-[7rem_1fr]"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, margin: "0px 0px -10% 0px" }}
                transition={{ duration: 0.5, delay: Math.min(i, 3) * 0.05 }}
              >
                <div className="flex items-baseline gap-3 sm:block">
                  <p className={`font-mono text-[0.75rem] tabular-nums ${entry.date ? "text-bone" : "text-ash"}`}>
                    {entry.date ? `[${entry.date}]` : "[undated]"}
                  </p>
                  <p className="label-sm sm:mt-1">{entry.tag}</p>
                </div>
                <div className="relative sm:pl-8">
                  <span
                    aria-hidden="true"
                    className={`absolute -left-[3px] top-2 hidden h-[7px] w-[7px] sm:block ${i === 0 ? "bg-amber" : "bg-bone-dim"}`}
                  />
                  <h3 className="text-[1.6rem] font-medium uppercase leading-none tracking-[-0.02em] md:text-[2rem]">
                    {entry.title}
                  </h3>
                  <p className="mt-3 max-w-[56ch] leading-relaxed text-bone-dim">{entry.body}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
