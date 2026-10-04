import type { ReactNode } from "react";
import { isPlaceholder } from "../data/profile";

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
  kind?: "url" | "email";
  ariaLabel?: string;
};

/**
 * External link that degrades honestly: if the URL in data is still a
 * PLACEHOLDER, it renders as a non-interactive "link pending" element
 * instead of a broken or invented link.
 */
export function ArchiveLink({ href, children, className = "", kind = "url", ariaLabel }: Props) {
  if (isPlaceholder(href)) {
    return (
      <span
        className={`${className} cursor-not-allowed opacity-60`}
        aria-disabled="true"
        title="Link not configured yet"
      >
        {children}
        <span className="label-sm ml-2 normal-case">[link pending]</span>
      </span>
    );
  }

  const resolved = kind === "email" ? `mailto:${href}` : href;
  return (
    <a
      href={resolved}
      className={className}
      aria-label={ariaLabel}
      {...(kind === "url" ? { target: "_blank", rel: "noreferrer noopener" } : {})}
    >
      {children}
    </a>
  );
}
