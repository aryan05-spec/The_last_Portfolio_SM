import { useRef, useState } from "react";
import { projects, type Project } from "../data/projects";
import { ProjectDossier } from "./ProjectDossier";
import { ProjectFigure } from "./ProjectFigure";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";

export function ProjectArchive({ recovered }: { recovered: boolean }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);

  const close = () => {
    const i = openIndex;
    setOpenIndex(null);
    if (i !== null) window.setTimeout(() => triggers.current[i]?.focus({ preventScroll: true }), 50);
  };

  return (
    <section id="archives" aria-labelledby="archives-title" className="relative py-28 md:py-40">
      <div className="shell">
        <SectionHeader
          id="archives-title"
          index="03"
          fragment="The archives"
          title={"Recovered\nartifacts."}
          recovered={recovered}
          aside={
            <p className="max-w-[34ch] text-bone-dim">
              Things I built, recovered with as much context as survived. Open a record for the full dossier.
              <span className="label-sm mt-3 block">
                {projects.length} records · {projects.filter((p) => p.integrity === "complete").length} complete
              </span>
            </p>
          }
        />

        <div className="space-y-28 md:space-y-40">
          {projects.map((project, i) => (
            <ProjectRow
              key={project.id}
              project={project}
              index={i}
              onOpen={() => setOpenIndex(i)}
              buttonRef={(el) => {
                triggers.current[i] = el;
              }}
            />
          ))}
        </div>
      </div>

      <ProjectDossier
        index={openIndex}
        onClose={close}
        onNavigate={(i) => setOpenIndex(i)}
      />
    </section>
  );
}

type RowProps = {
  project: Project;
  index: number;
  onOpen: () => void;
  buttonRef: (el: HTMLButtonElement | null) => void;
};

function ProjectRow({ project, index, onOpen, buttonRef }: RowProps) {
  const flipped = index % 2 === 1;
  const partial = project.integrity === "partial";

  return (
    <article className="group/row grid items-start gap-10 lg:grid-cols-12 lg:gap-6" aria-labelledby={`${project.slug}-title`}>
      {/* Text */}
      <Reveal className={`lg:col-span-5 ${flipped ? "lg:order-2 lg:col-start-8" : ""}`}>
        <div className="flex items-baseline justify-between gap-4 border-b border-line pb-3">
          <span className="label">
            Record <span className="text-amber">{project.id}</span>
          </span>
          <span className={`label-sm ${partial ? "text-rust" : ""}`}>
            {partial ? "Integrity: partial" : "Integrity: complete"}
          </span>
        </div>

        <h3
          id={`${project.slug}-title`}
          className="mt-8 text-[clamp(2.4rem,5vw,4.5rem)] font-semibold leading-[0.9] tracking-[-0.045em]"
        >
          {project.name}
        </h3>
        <p className="mt-5 max-w-[38ch] text-lg leading-snug text-bone">{project.tagline}</p>

        <dl className="mt-8 grid grid-cols-[6.5rem_1fr] gap-y-2 text-sm">
          <dt className="label">Context</dt>
          <dd>{project.context}</dd>
          <dt className="label">Year</dt>
          <dd className={project.year ? "" : "text-ash"}>{project.year ?? "— not recovered"}</dd>
          <dt className="label">Status</dt>
          <dd>{project.status}</dd>
          <dt className="label">Stack</dt>
          <dd className="text-bone-dim">{project.stack.join(" · ")}</dd>
        </dl>

        <p className="mt-8 max-w-[52ch] leading-relaxed text-bone-dim">{project.whatItIs}</p>

        <button
          ref={buttonRef}
          type="button"
          onClick={onOpen}
          className="btn btn-ghost mt-8 group-hover/row:border-bone"
          aria-haspopup="dialog"
        >
          Open record <span aria-hidden="true" className="transition-transform group-hover/row:translate-x-1">→</span>
        </button>
      </Reveal>

      {/* Figure */}
      <Reveal
        delay={0.1}
        className={`relative ${partial ? "lg:col-span-6" : "lg:col-span-7"} ${
          flipped ? "lg:order-1 lg:col-start-1" : partial ? "lg:col-start-7" : "lg:col-start-6"
        } ${index === 0 ? "lg:-mr-6 xl:-mr-12" : ""}`}
      >
        <div className="relative">
          {/* offset frame — revealed as the figure shifts on hover */}
          <span
            aria-hidden="true"
            className="absolute inset-0 border border-amber/0 transition-colors duration-300 group-hover/row:border-amber/60"
          />
          <div className="relative transition-transform duration-300 ease-out group-hover/row:-translate-x-2 group-hover/row:-translate-y-2">
            <ProjectFigure project={project} figNo={index + 1} caption={false} />
            {/* Hover metadata + whole-figure click target (keyboard users use the button) */}
            <button
              type="button"
              tabIndex={-1}
              aria-hidden="true"
              onClick={onOpen}
              className="absolute inset-0 flex items-end justify-between bg-linear-to-t from-ink/85 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover/row:opacity-100"
            >
              <span className="label text-bone">
                {project.id} · {project.status}
              </span>
              <span className="label text-amber">Open record →</span>
            </button>
          </div>
        </div>
        <p className="label-sm mt-3 max-w-[60ch] normal-case leading-relaxed tracking-normal">
          Fig. {String(index + 1).padStart(2, "0")} — {project.figure}
        </p>
      </Reveal>
    </article>
  );
}
