/**
 * PROFILE DATA
 * ------------------------------------------------------------------
 * Everything personal lives here. Presentation components only read
 * from this file, so edits here propagate across the whole archive.
 *
 * All contact details below are fictional and use reserved example
 * domains / unassigned numbers. Links set to PLACEHOLDER render as
 * "link pending" instead of a broken link.
 */

export const PLACEHOLDER = "PLACEHOLDER" as const;

export const links = {
  github: "https://example.com/github/aryan-singh-dev",
  linkedin: "https://example.com/linkedin/aryan-singh-iiit",
  x: "https://example.com/x/aryan_builds",
  email: "aryan.singh@example.com",
  phone: "+91 00000 12345",
};

export const isPlaceholder = (value: string | undefined) => !value || value === PLACEHOLDER;

export const profile = {
  name: "Aryan Singh",
  handle: "ARYAN-SINGH",
  roles: ["Software Engineer", "Builder", "Tinkerer"],
  institution: "International Institute of Information Technology, Bhubaneswar",
  institutionShort: "IIIT Bhubaneswar",
  degree: "B.Tech in Information Technology",
  duration: "2026–2030",
  field: "Information Technology",
  // IIIT Bhubaneswar — used as the archive's node coordinates.
  coordinates: { lat: "20.2934° N", lon: "85.7449° E" },

  intro:
    "I'm a first-year B.Tech IT student at IIIT Bhubaneswar. I build small, stubborn software: tools that keep working when the Wi-Fi doesn't, models small enough to run on a ₹300 microcontroller, and bots that save people a queue. I like finding out how little a system needs to still be useful.",

  lastTransmission: "If it only works on a good connection, it doesn't really work yet.",

  statement:
    "I'm drawn to software that has to survive bad conditions — flaky networks, cheap hardware, impatient users. Constraints are where the interesting engineering decisions hide.",

  metadata: [
    { key: "Location", value: "Bhubaneswar, Odisha" },
    { key: "Base", value: "IIIT Bhubaneswar" },
    { key: "Degree", value: "B.Tech IT · 2026–30" },
    { key: "Status", value: "Building", live: true },
    { key: "Interests", value: "Offline-first / Edge ML / Tools" },
  ],
};

/** The evidence strip — four connected records. */
export const evidence = [
  {
    code: "EDU",
    label: "Education",
    title: "IIIT Bhubaneswar",
    detail: "B.Tech in Information Technology · 2026–2030",
  },
  {
    code: "EXP",
    label: "Experience",
    title: "Paperkite Studio",
    detail: "Summer web-dev intern · offline-ready PWA work",
    stamp: "Shipped",
  },
  {
    code: "OSS",
    label: "Open source",
    title: "Small fixes, real merges",
    detail: "Docs, tests and bug fixes in sync & tooling libraries",
  },
  {
    code: "CMP",
    label: "Competition",
    title: "Hackathons",
    detail: "Monsoon Build Sprint '26 · finalist",
  },
];

/** Written in first person. */
export const fieldNotes = [
  "I test everything with airplane mode on first. It finds the bugs nobody else is looking for.",
  "I'd rather ship a small thing that works than demo a big thing that might.",
  "Most of my best ideas start as a script I wrote to avoid doing something twice.",
  "A model that fits on the device beats a better one that needs a server.",
  "I keep a notebook of every bug that took me more than an hour. It's getting long.",
];

export const sections = [
  { id: "profile", index: "01", label: "Profile", fragment: "Survivor profile" },
  { id: "arsenal", index: "02", label: "Arsenal", fragment: "Engineering arsenal" },
  { id: "archives", index: "03", label: "Archives", fragment: "Project archives" },
  { id: "log", index: "04", label: "Log", fragment: "Build log" },
  { id: "transmission", index: "05", label: "Transmission", fragment: "Final transmission" },
] as const;

export type SectionId = (typeof sections)[number]["id"];
