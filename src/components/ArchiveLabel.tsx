import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  index?: string;
  className?: string;
  as?: "span" | "p" | "div";
};

/** Monospace system label. Optional index renders as `01 /`. */
export function ArchiveLabel({ children, index, className = "", as: Tag = "span" }: Props) {
  return (
    <Tag className={`label ${className}`}>
      {index && <span className="text-amber">{index} / </span>}
      {children}
    </Tag>
  );
}
