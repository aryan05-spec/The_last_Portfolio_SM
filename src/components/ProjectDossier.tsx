import { useEffect, useRef, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { projects, type Project } from "../data/projects";
import { ArchiveLink } from "./ArchiveLink";
import { ProjectFigure } from "./ProjectFigure";

type Props = {
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
};

/**
 * Full project dossier. A modal dialog with focus trapping, Escape to
 * close, and ←/→ to move between records. The only place the archive
 * "glitches" is when a record is switched in.
 */
export function ProjectDossier({ index, onClose, onNavigate }: Props) {
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const returnRef = useRef<HTMLButtonElement>(null);
  const project = index !== null ? projects[index] : null;
  const open = project !== null;

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    returnRef.current?.focus({ preventScroll: true });
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  useEffect(() => {
    if (index === null) return;
    panelRef.current?.scrollTo({ top: 0 });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") onNavigate((index + 1) % projects.length);
      else if (e.key === "ArrowLeft") onNavigate((index - 1 + projects.length) % projects.length);
      else if (e.key === "Tab" && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]):not([tabindex="-1"]), [tabindex]:not([tabindex="-1"])',
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, onClose, onNavigate]);

  return (
    <AnimatePresence>
      {project && index !== null && (
        <motion.div
          className="fixed inset-0 z-[70] flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            aria-label="Close record"
            tabIndex={-1}
            className="absolute inset-0 cursor-default bg-ink/80"
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="dossier-title"
            className="relative h-full w-full overflow-y-auto overscroll-contain border-l border-line-strong bg-ink lg:w-[min(1120px,92vw)]"
            initial={reduce ? { opacity: 0 } : { x: "6%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { x: "4%", opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.2, 0.7, 0.2, 1] }}
          >
            {/* Control bar */}
            <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-line bg-ink px-5 py-3 sm:px-10">
              <button ref={returnRef} type="button" onClick={onClose} className="label flex items-center gap-2 py-1.5 text-bone hover:text-amber">
                <ArrowLeft size={14} aria-hidden="true" /> Return to archive
              </button>
              <div className="flex items-center gap-1">
                <span className="label-sm mr-3 hidden sm:inline">
                  Record {index + 1} / {projects.length}
                </span>
                <button
                  type="button"
                  aria-label="Previous record"
                  onClick={() => onNavigate((index - 1 + projects.length) % projects.length)}
                  className="border border-line-strong p-2 hover:border-bone"
                >
                  <ChevronLeft size={14} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label="Next record"
                  onClick={() => onNavigate((index + 1) % projects.length)}
                  className="border border-line-strong p-2 hover:border-bone"
                >
                  <ChevronRight size={14} aria-hidden="true" />
                </button>
              </div>
            </div>

            <div key={project.id} className={reduce ? "" : "glitch-once"}>
              <DossierBody project={project} figNo={index + 1} />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DossierBody({ project, figNo }: { project: Project; figNo: number }) {
  const partial = project.integrity === "partial";

  return (
    <article className="px-5 pb-24 pt-10 sm:px-10 md:pt-14">
      <p className="label">
        Dossier <span className="text-amber">{project.id}</span> ·{" "}
        <span className={partial ? "text-rust" : ""}>integrity {project.integrity}</span>
      </p>
      <h2
        id="dossier-title"
        className="mt-5 text-[clamp(2.75rem,7vw,6rem)] font-semibold leading-[0.88] tracking-[-0.05em]"
      >
        {project.name}
      </h2>
      <p className="mt-5 max-w-[46ch] text-xl leading-snug">{project.tagline}</p>

      <dl className="mt-10 grid grid-cols-2 border-t border-line md:grid-cols-4">
        {[
          ["Project ID", project.id],
          ["Context", project.context],
          ["Year", project.year ?? "— not recovered"],
          ["Status", project.status],
        ].map(([k, v]) => (
          <div key={k} className="border-b border-line py-3 pr-4">
            <dt className="label-sm">{k}</dt>
            <dd className={`mt-1 text-sm ${v.startsWith("—") ? "text-ash" : ""}`}>{v}</dd>
          </div>
        ))}
      </dl>

      <ProjectFigure project={project} figNo={figNo} className="mt-12" />

      <div className="mt-16 space-y-14">
        <Block label="What it is">
          <p className="max-w-[62ch] text-lg leading-relaxed">{project.whatItIs}</p>
        </Block>

        <Block label="Why I built it">
          {project.whyIBuiltIt ? (
            <p className="max-w-[62ch] text-lg leading-relaxed text-bone-dim">{project.whyIBuiltIt}</p>
          ) : (
            <Missing />
          )}
        </Block>

        <Block label="What I actually did">
          {project.whatIDid ? (
            <ol className="max-w-[62ch] space-y-4">
              {project.whatIDid.map((item, i) => (
                <li key={item} className="flex gap-4 leading-relaxed">
                  <span className="pt-1 font-mono text-[0.6875rem] text-amber">{String(i + 1).padStart(2, "0")}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          ) : (
            <Missing />
          )}
        </Block>

        <Block label={project.architecture?.title ?? "Architecture"}>
          {project.architecture ? (
            <ol className="flex flex-wrap border-l border-t border-line">
              {project.architecture.steps.map((step, i) => (
                <li key={step.name} className="relative min-w-0 flex-1 basis-[11rem] border-b border-r border-line p-4">
                  <span className="font-mono text-[0.625rem] text-ash">
                    {String(i + 1).padStart(2, "0")}
                    {i < project.architecture!.steps.length - 1 && <span className="text-amber"> →</span>}
                  </span>
                  <p className="mt-2 font-medium">{step.name}</p>
                  <p className="mt-1 text-sm text-bone-dim">{step.note}</p>
                </li>
              ))}
            </ol>
          ) : (
            <Missing />
          )}
        </Block>

        <Block label="Technical highlights">
          {project.highlights ? (
            <ul className="max-w-[62ch] divide-y divide-line border-y border-line">
              {project.highlights.map((h) => (
                <li key={h} className="py-3 leading-relaxed">
                  {h}
                </li>
              ))}
            </ul>
          ) : (
            <Missing />
          )}
        </Block>

        <Block label="Lessons learned">
          {project.lessons ? (
            <ul className="max-w-[62ch] space-y-4">
              {project.lessons.map((l) => (
                <li key={l} className="border-l border-amber pl-4 leading-relaxed text-bone-dim">
                  {l}
                </li>
              ))}
            </ul>
          ) : (
            <Missing />
          )}
        </Block>

        <Block label="Stack">
          <ul className="flex flex-wrap gap-2">
            {project.stack.map((s) => (
              <li key={s} className="border border-line-strong px-3 py-1.5 font-mono text-[0.75rem]">
                {s}
              </li>
            ))}
          </ul>
        </Block>

        <Block label="Links">
          {project.links.length ? (
            <ul className="flex flex-wrap gap-3">
              {project.links.map((l) => (
                <li key={l.label}>
                  <ArchiveLink href={l.href} className="btn btn-ghost">
                    {l.label} <ArrowUpRight size={14} aria-hidden="true" />
                  </ArchiveLink>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-bone-dim">No public links for this record.</p>
          )}
        </Block>

        {project.note && (
          <p className="border-t border-line pt-6 font-mono text-[0.75rem] leading-relaxed text-bone-dim">
            <span className="text-amber">NOTE ·</span> {project.note}
          </p>
        )}
      </div>
    </article>
  );
}

function Block({ label, children }: { label: string; children: ReactNode }) {
  return (
    <section className="grid gap-4 md:grid-cols-12">
      <h3 className="label md:col-span-3">{label}</h3>
      <div className="md:col-span-9">{children}</div>
    </section>
  );
}

function Missing() {
  return (
    <p className="font-mono text-[0.75rem] tracking-[0.06em] text-rust">
      [ SEGMENT NOT RECOVERED ]{" "}
      <span className="text-ash">— details will be added when they're ready to share.</span>
    </p>
  );
}
