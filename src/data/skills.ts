/**
 * ARSENAL DATA
 * ------------------------------------------------------------------
 * `level` is deliberately qualitative — no percentage bars.
 *   field-tested : used in shipped projects
 *   working      : comfortable, used regularly
 *   exploring    : actively learning, used in experiments
 */

export type SkillLevel = "field-tested" | "working" | "exploring";

export type Skill = {
  id: string;
  name: string;
  why: string;
  where: string;
  level: SkillLevel;
};

export type SkillSlot = {
  slot: string;
  name: string;
  skills: Skill[];
};

export const levelLabel: Record<SkillLevel, string> = {
  "field-tested": "Field-tested",
  working: "Working knowledge",
  exploring: "Exploring",
};

export const arsenal: SkillSlot[] = [
  {
    slot: "A",
    name: "Languages",
    skills: [
      {
        id: "LG-01",
        name: "Go",
        why: "Small binaries, easy concurrency, and it compiles before my tea gets cold.",
        where: "The sync daemon in Meshnote.",
        level: "field-tested",
      },
      {
        id: "LG-02",
        name: "Python",
        why: "Fastest way to test whether an idea is worth a second afternoon.",
        where: "Model training and quantisation scripts for Murmur.",
        level: "field-tested",
      },
      {
        id: "LG-03",
        name: "TypeScript",
        why: "Types are cheaper than the bugs they prevent.",
        where: "Queueless bot backend and this archive.",
        level: "working",
      },
      {
        id: "LG-04",
        name: "C",
        why: "When every kilobyte counts, I want to see where it goes.",
        where: "Microcontroller firmware for Murmur.",
        level: "exploring",
      },
    ],
  },
  {
    slot: "B",
    name: "Frontend",
    skills: [
      {
        id: "FE-01",
        name: "SvelteKit",
        why: "Less code between me and a working interface.",
        where: "Meshnote's web client.",
        level: "working",
      },
      {
        id: "FE-02",
        name: "React",
        why: "The ecosystem has an answer for almost everything.",
        where: "Paperkite internship; this site.",
        level: "working",
      },
      {
        id: "FE-03",
        name: "Service Workers",
        why: "The difference between a website and something that survives a dead network.",
        where: "Offline caching at Paperkite and in Meshnote.",
        level: "field-tested",
      },
    ],
  },
  {
    slot: "C",
    name: "Edge ML",
    skills: [
      {
        id: "ML-01",
        name: "TensorFlow Lite",
        why: "Gets a model from a notebook onto a chip.",
        where: "Murmur keyword-spotting model.",
        level: "working",
      },
      {
        id: "ML-02",
        name: "Quantisation",
        why: "Halving the size of a model is often free accuracy-wise.",
        where: "Murmur: int8 model for a microcontroller.",
        level: "working",
      },
      {
        id: "ML-03",
        name: "scikit-learn",
        why: "A good baseline before reaching for anything deep.",
        where: "Coursework and quick experiments.",
        level: "exploring",
      },
    ],
  },
  {
    slot: "D",
    name: "Tools",
    skills: [
      {
        id: "TL-01",
        name: "Git",
        why: "Every experiment needs a way back.",
        where: "Every project.",
        level: "field-tested",
      },
      {
        id: "TL-02",
        name: "Docker",
        why: "Reproducible setups for teammates with very different laptops.",
        where: "Queueless deployment.",
        level: "working",
      },
      {
        id: "TL-03",
        name: "Linux",
        why: "Where the servers live, and where I'm most at home.",
        where: "Daily driver.",
        level: "field-tested",
      },
      {
        id: "TL-04",
        name: "Neovim",
        why: "Fast, keyboard-only, and configured exactly how I like it.",
        where: "Daily driver.",
        level: "working",
      },
      {
        id: "TL-05",
        name: "SQLite",
        why: "A real database that fits in a single file on any device.",
        where: "Local storage in Meshnote and Queueless.",
        level: "field-tested",
      },
    ],
  },
  {
    slot: "E",
    name: "Concepts",
    skills: [
      {
        id: "CN-01",
        name: "CRDTs",
        why: "Lets devices disagree for a while and still end up agreeing.",
        where: "Meshnote's merge logic.",
        level: "working",
      },
      {
        id: "CN-02",
        name: "Networking",
        why: "Most bugs I chase turn out to be the network.",
        where: "Peer discovery over local Wi-Fi in Meshnote.",
        level: "working",
      },
      {
        id: "CN-03",
        name: "DSA",
        why: "The vocabulary underneath every performance problem.",
        where: "Coursework and weekly practice.",
        level: "working",
      },
      {
        id: "CN-04",
        name: "APIs",
        why: "Clear contracts make teamwork at 3am possible.",
        where: "Queueless chat integration.",
        level: "working",
      },
    ],
  },
];

export const allSkills = arsenal.flatMap((s) => s.skills.map((skill) => ({ ...skill, slot: s })));
