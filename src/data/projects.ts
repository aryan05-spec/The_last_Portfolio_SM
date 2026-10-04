/**
 * PROJECT ARCHIVE DATA
 * ------------------------------------------------------------------
 * Each record renders as a row in the archive and as a full dossier.
 * Unknown values can be left `undefined` — they render as
 * "not recovered". Links set to PLACEHOLDER render as "link pending".
 */

export type ProjectVisual = "mesh-sync" | "order-pipeline" | "kws-pruning";

export type ProjectLink = { label: string; href: string };

export type Project = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  context: string;
  year?: string;
  status: string;
  integrity: "complete" | "partial";
  stack: string[];
  whatItIs: string;
  whyIBuiltIt?: string;
  whatIDid?: string[];
  highlights?: string[];
  architecture?: { title: string; steps: { name: string; note: string }[] };
  lessons?: string[];
  visual: ProjectVisual;
  figure: string;
  links: ProjectLink[];
  note?: string;
};

export const projects: Project[] = [
  {
    id: "A-01",
    slug: "meshnote",
    name: "Meshnote",
    tagline: "Shared notes that sync phone-to-phone when there's no internet at all.",
    context: "Personal project",
    year: "2026",
    status: "Recovered — still syncing",
    integrity: "complete",
    stack: ["Go", "SvelteKit", "CRDTs", "SQLite", "mDNS"],
    whatItIs:
      "An offline-first notes app for study groups. Devices on the same local network find each other and merge edits directly — no server, no account, no signal required.",
    whyIBuiltIt:
      "Our hostel Wi-Fi drops every evening right when everyone is sharing notes before an exam. Every cloud app froze. The devices were all in the same room; they just couldn't talk to each other without the internet.",
    whatIDid: [
      "Wrote a small Go sync daemon that discovers peers over mDNS and exchanges changes over the local network.",
      "Modelled each note as a CRDT so concurrent edits merge without conflicts or a central server.",
      "Built the SvelteKit client with a service worker, so the app itself loads with zero connectivity.",
      "Tested with 12 devices in a hostel common room — edits reached every peer in under 2 seconds.",
    ],
    highlights: [
      "Zero-server architecture: every device is a full replica.",
      "Gossip-style propagation — an edit hops device to device until everyone has it.",
      "Offline peers catch up automatically when they rejoin.",
      "Local SQLite storage with a compact operation log (~40 KB per busy note).",
    ],
    architecture: {
      title: "Sync path",
      steps: [
        { name: "Local edit", note: "keystroke becomes an operation" },
        { name: "CRDT merge", note: "applied to the local replica" },
        { name: "Peer discovery", note: "mDNS on the local network" },
        { name: "Gossip", note: "ops forwarded peer to peer" },
        { name: "Catch-up", note: "rejoining devices replay missed ops" },
      ],
    },
    lessons: [
      "Clocks lie. Ordering by device timestamps broke within an hour; logical clocks fixed it.",
      "The hard part of offline-first isn't storage, it's telling the user what state they're in.",
      "Testing on 12 real phones found bugs that 12 browser tabs never did.",
    ],
    visual: "mesh-sync",
    figure: "An edit spreading through a local mesh of devices. Offline peers shown in red. Schematic.",
    links: [
      { label: "Repository", href: "https://example.com/github/aryan-singh-dev/meshnote" },
      { label: "Demo", href: "https://example.com/demo/meshnote" },
    ],
  },
  {
    id: "A-02",
    slug: "queueless",
    name: "Queueless",
    tagline: "Order from the campus canteen by chat — in Hindi, Odia or English — and skip the line.",
    context: "Monsoon Build Sprint '26 · team of 4",
    year: "2026",
    status: "Hackathon finalist",
    integrity: "complete",
    stack: ["TypeScript", "Node.js", "Chat bot API", "SQLite", "Docker"],
    whatItIs:
      "A chat bot that takes canteen orders in whichever language students type, confirms the order, and hands back a pickup token when the food is ready.",
    whyIBuiltIt:
      "Lunch break is 40 minutes and the canteen line takes 25 of them. Most of that time is spent repeating an order the counter could have known in advance.",
    whatIDid: [
      "Built the order parser that maps free-text messages to menu items and quantities.",
      "Designed the confirmation step so nothing reaches the kitchen without the student saying yes.",
      "Wrote the kitchen queue and token system, and containerised it for the demo.",
    ],
    highlights: [
      "Mixed-language input handled with a small synonym dictionary — no heavy NLP needed.",
      "Explicit confirmation before every order; misparses never reach the kitchen.",
      "Kitchen view shows a live queue sorted by pickup time.",
      "In the demo run, average wait at the counter dropped from ~18 to ~4 minutes.",
    ],
    architecture: {
      title: "Order flow",
      steps: [
        { name: "Chat message", note: "student types their order" },
        { name: "Order parsing", note: "language + items + quantity" },
        { name: "Menu match", note: "check availability & price" },
        { name: "Confirmation", note: "student approves the order" },
        { name: "Kitchen queue", note: "ordered by pickup slot" },
        { name: "Pickup token", note: "ping when it's ready" },
      ],
    },
    lessons: [
      "A good confirmation message prevents more errors than a smarter parser.",
      "Hackathon scope: we cut payments on hour 6 and it was the right call.",
    ],
    visual: "order-pipeline",
    figure: "Order flow as built for the hackathon demo. Schematic.",
    links: [
      { label: "Repository", href: "https://example.com/github/aryan-singh-dev/queueless" },
      { label: "Demo video", href: "https://example.com/video/queueless-demo" },
    ],
  },
  {
    id: "A-03",
    slug: "murmur",
    name: "Murmur",
    tagline: "A wake-word model small enough to live on a ₹300 microcontroller.",
    context: "Self-directed edge-ML experiment",
    year: "2026",
    status: "Partial record",
    integrity: "partial",
    stack: ["Python", "TensorFlow Lite", "Pruning", "int8 quantisation", "C"],
    whatItIs:
      "A tiny keyword-spotting model that recognises a handful of spoken commands (\"lights on\", \"lights off\") entirely on-device, with no cloud and no phone.",
    whyIBuiltIt:
      "Voice control shouldn't need an internet connection to switch on a lamp. I wanted to see how small a useful speech model could get.",
    whatIDid: [
      "Trained a small convolutional model on spectrograms of a few spoken commands.",
      "Pruned and quantised it to int8 — from roughly 410 KB down to about 96 KB.",
    ],
    highlights: undefined,
    architecture: undefined,
    lessons: undefined,
    visual: "kws-pruning",
    figure: "Illustration of pruning a small speech model. Not a plot of results.",
    links: [{ label: "Notebook", href: "https://example.com/github/aryan-singh-dev/murmur" }],
    note: "Experiment in progress. Firmware write-up and accuracy numbers will be added once the next round of tests is done.",
  },
];
