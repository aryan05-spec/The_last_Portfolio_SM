/**
 * BUILD LOG
 * ------------------------------------------------------------------
 * Newest first. `date` is "YYYY.MM" — leave undefined to render as
 * "undated".
 */

export type LogEntry = {
  date?: string;
  title: string;
  body: string;
  tag: string;
};

export const buildLog: LogEntry[] = [
  {
    date: "2026.10",
    title: "This archive",
    body: "Designed and built this site for Silicon Maze — The Last Portfolio. React, TypeScript, Tailwind, and a lot of SVG.",
    tag: "web",
  },
  {
    date: "2026.09",
    title: "Monsoon Build Sprint",
    body: "36-hour hackathon. Our team built Queueless and made the final round.",
    tag: "competition",
  },
  {
    date: "2026.08",
    title: "First semester at IIIT-BH",
    body: "Started B.Tech IT. Found the people who also stay late in the lab.",
    tag: "education",
  },
  {
    date: "2026.06",
    title: "Paperkite Studio",
    body: "Summer internship: made a client's booking PWA work offline and sync on reconnect.",
    tag: "industry",
  },
  {
    date: "2026.04",
    title: "Murmur on a microcontroller",
    body: "Got a keyword-spotting model under 100 KB and running on a cheap dev board.",
    tag: "edge ml",
  },
  {
    date: "2026.01",
    title: "CRDT rabbit hole",
    body: "Read every paper I could understand on conflict-free replicated data types. Meshnote came out of it.",
    tag: "research",
  },
  {
    date: "2025.11",
    title: "First merged PR",
    body: "A docs fix and a flaky-test fix in an open-source sync library. Small, but it counted.",
    tag: "open source",
  },
];
