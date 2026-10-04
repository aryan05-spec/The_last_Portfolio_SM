type Props = { label: string; className?: string };

/** Pulsing status indicator — the only element allowed to "breathe". */
export function SystemStatus({ label, className = "" }: Props) {
  return (
    <span className={`label inline-flex items-center gap-2 text-bone ${className}`}>
      <span className="live-dot" aria-hidden="true" />
      {label}
    </span>
  );
}
