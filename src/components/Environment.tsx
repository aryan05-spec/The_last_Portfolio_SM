import { profile } from "../data/profile";

/**
 * Persistent archive environment: faint grid, grain, scanlines, one
 * slow data line and corner coordinates. Purely decorative.
 */
export function Environment() {
  return (
    <div aria-hidden="true">
      <div className="env-grid" />
      <div className="env-sweep" />
      <div className="env-grain" />
      <div className="env-scan" />
      <div className="pointer-events-none fixed bottom-4 left-4 z-30 hidden flex-col gap-1 min-[1560px]:flex">
        <span className="label-sm">{profile.coordinates.lat}</span>
        <span className="label-sm">{profile.coordinates.lon}</span>
      </div>
      <div className="pointer-events-none fixed bottom-4 right-4 z-30 hidden min-[1560px]:block">
        <span className="label-sm [writing-mode:vertical-rl]">NODE 07 — {profile.handle}</span>
      </div>
    </div>
  );
}
