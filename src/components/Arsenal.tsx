import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { allSkills, arsenal, levelLabel, type SkillLevel } from "../data/skills";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";

const LEVELS: SkillLevel[] = ["exploring", "working", "field-tested"];

export function Arsenal({ recovered }: { recovered: boolean }) {
  const [activeId, setActiveId] = useState(allSkills[1].id);
  const active = allSkills.find((s) => s.id === activeId) ?? allSkills[0];

  return (
    <section id="arsenal" aria-labelledby="arsenal-title" className="relative py-28 md:py-40">
      <div className="shell">
        <SectionHeader
          id="arsenal-title"
          index="02"
          fragment="The arsenal"
          title={"System\nloadout."}
          recovered={recovered}
          aside={
            <p className="max-w-[34ch] text-bone-dim">
              No percentage bars. Each module says why I use it, where I've used it, and how far I've taken it.
              <span className="label-sm mt-3 block">Hover or select a module ↓</span>
            </p>
          }
        />

        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            {arsenal.map((slot, si) => {
              const holdsActive = slot.skills.some((s) => s.id === active.id);
              return (
                <Reveal key={slot.slot} delay={0.04 * si} y={10}>
                  <div className="grid gap-4 border-t border-line py-6 sm:grid-cols-[9rem_1fr] md:grid-cols-[11rem_1fr]">
                    <div>
                      <p className="label-sm">Slot {slot.slot}</p>
                      <h3 className="mt-1 text-lg font-medium tracking-tight">{slot.name}</h3>
                      <p className="label-sm mt-1">{String(slot.skills.length).padStart(2, "0")} modules</p>
                    </div>
                    <ul className="flex flex-wrap gap-2.5" aria-label={`${slot.name} modules`}>
                      {slot.skills.map((skill) => {
                        const isActive = skill.id === active.id;
                        return (
                          <li key={skill.id}>
                            <button
                              type="button"
                              aria-pressed={isActive}
                              onClick={() => setActiveId(skill.id)}
                              onMouseEnter={() => setActiveId(skill.id)}
                              onFocus={() => setActiveId(skill.id)}
                              className={`group relative flex items-center gap-3 border py-2.5 pl-3 pr-4 text-left transition-colors duration-150 ${
                                isActive
                                  ? "border-bone bg-bone text-ink"
                                  : "border-line-strong bg-ink-2 text-bone hover:border-bone-dim"
                              }`}
                            >
                              <span
                                aria-hidden="true"
                                className={`h-2 w-2 rounded-full border ${
                                  isActive ? "border-ink bg-amber" : "border-bone-dim"
                                }`}
                              />
                              <span className="flex flex-col">
                                <span
                                  className={`font-mono text-[0.5625rem] tracking-[0.12em] ${
                                    isActive ? "text-ink/60" : "text-ash"
                                  }`}
                                >
                                  {skill.id}
                                </span>
                                <span className="text-[0.95rem] font-medium leading-tight">{skill.name}</span>
                              </span>
                              <LevelPips level={skill.level} inverted={isActive} />
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  {/* On small screens the readout sits right under its slot */}
                  {holdsActive && (
                    <div className="pb-6 lg:hidden">
                      <ModuleReadout skill={active} />
                    </div>
                  )}
                </Reveal>
              );
            })}
            <div className="border-t border-line pt-4">
              <p className="label-sm">
                Loadout — {allSkills.length} modules across {arsenal.length} slots ·{" "}
                <span className="inline-flex items-center gap-1 align-middle">
                  <LevelPips level="field-tested" /> field-tested
                </span>{" "}
                <span className="inline-flex items-center gap-1 align-middle">
                  <LevelPips level="working" /> working
                </span>{" "}
                <span className="inline-flex items-center gap-1 align-middle">
                  <LevelPips level="exploring" /> exploring
                </span>
              </p>
            </div>
          </div>

          <aside className="hidden lg:col-span-4 lg:block" aria-label="Selected module details">
            <div className="sticky top-24">
              <ModuleReadout skill={active} />
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

function LevelPips({ level, inverted = false }: { level: SkillLevel; inverted?: boolean }) {
  const n = LEVELS.indexOf(level) + 1;
  return (
    <span className="ml-1 flex gap-[2px] self-end pb-1" aria-hidden="true">
      {LEVELS.map((_, i) => (
        <span
          key={i}
          className={`h-[7px] w-[3px] ${
            i < n ? (inverted ? "bg-ink" : "bg-amber") : inverted ? "bg-ink/20" : "bg-line-strong"
          }`}
        />
      ))}
    </span>
  );
}

function ModuleReadout({ skill }: { skill: (typeof allSkills)[number] }) {
  return (
    <div className="ticks border border-line bg-ink-2 p-6">
      <div className="flex items-center justify-between">
        <p className="label-sm">
          Module {skill.id} · Slot {skill.slot.slot}
        </p>
        <span className="label-sm">{skill.slot.name}</span>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={skill.id}
          initial={{ opacity: 0, x: 6 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -6 }}
          transition={{ duration: 0.16 }}
        >
          <p className="mt-6 text-[2.5rem] font-semibold leading-none tracking-[-0.04em]">{skill.name}</p>
          <dl className="mt-8 space-y-5">
            <div>
              <dt className="label">Why I use it</dt>
              <dd className="mt-1.5 leading-relaxed">{skill.why}</dd>
            </div>
            <div>
              <dt className="label">Where I used it</dt>
              <dd className="mt-1.5 leading-relaxed text-bone-dim">{skill.where}</dd>
            </div>
            <div>
              <dt className="label">Experience</dt>
              <dd className="mt-2 flex items-center gap-3">
                <span className="flex gap-1" aria-hidden="true">
                  {LEVELS.map((l, i) => (
                    <span
                      key={l}
                      className={`h-1.5 w-8 ${i <= LEVELS.indexOf(skill.level) ? "bg-amber" : "bg-line-strong"}`}
                    />
                  ))}
                </span>
                <span className="text-sm">{levelLabel[skill.level]}</span>
              </dd>
            </div>
          </dl>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
