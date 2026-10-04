import type { Project } from "../data/projects";
import { KeywordPruning } from "./visuals/KeywordPruning";
import { MeshSync } from "./visuals/MeshSync";
import { OrderPipeline } from "./visuals/OrderPipeline";

type Props = { project: Project; figNo: number; className?: string; caption?: boolean };

/** A framed, captioned figure. Captions say plainly what a visual is. */
export function ProjectFigure({ project, figNo, className = "", caption = true }: Props) {
  return (
    <figure className={className}>
      <div className="ticks relative overflow-hidden border border-line bg-ink-2">
        <span className="label-sm absolute left-3 top-2.5 z-10">Fig. {String(figNo).padStart(2, "0")}</span>
        <span className="label-sm absolute right-3 top-2.5 z-10">{project.id}</span>
        <div className={project.visual === "order-pipeline" ? "pt-6" : "px-2 pb-2 pt-8 sm:px-4"}>
          {project.visual === "mesh-sync" && <MeshSync />}
          {project.visual === "order-pipeline" && <OrderPipeline />}
          {project.visual === "kws-pruning" && <KeywordPruning />}
        </div>
      </div>
      {caption && (
        <figcaption className="label-sm mt-3 max-w-[60ch] normal-case leading-relaxed tracking-normal">
          Fig. {String(figNo).padStart(2, "0")} — {project.figure}
        </figcaption>
      )}
    </figure>
  );
}
