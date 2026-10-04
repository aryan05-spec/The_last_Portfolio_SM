import { useState } from "react";
import { MotionConfig } from "framer-motion";
import { sections } from "./data/profile";
import { useRecovery } from "./hooks/useRecovery";
import { Arsenal } from "./components/Arsenal";
import { BootSequence, SKIP_KEY } from "./components/BootSequence";
import { BuildLog } from "./components/BuildLog";
import { Environment } from "./components/Environment";
import { FinalTransmission } from "./components/FinalTransmission";
import { Hero } from "./components/Hero";
import { Navigation } from "./components/Navigation";
import { ProjectArchive } from "./components/ProjectArchive";
import { RecoveryToast } from "./components/RecoveryToast";
import { SurvivorProfile } from "./components/SurvivorProfile";

function shouldSkipBoot() {
  try {
    return window.localStorage.getItem(SKIP_KEY) === "1";
  } catch {
    return false;
  }
}

export default function App() {
  const [booted, setBooted] = useState(shouldSkipBoot);
  const { active, recovered, latest } = useRecovery(booted);
  const has = (id: (typeof sections)[number]["id"]) => recovered.includes(id);

  const replayBoot = () => {
    try {
      window.localStorage.removeItem(SKIP_KEY);
    } catch {
      /* ignore */
    }
    window.scrollTo({ top: 0 });
    setBooted(false);
  };

  return (
    <MotionConfig reducedMotion="user">
      <a
        href="#main"
        className="label fixed left-4 top-4 z-[200] -translate-y-24 bg-amber px-3 py-2 text-ink focus:translate-y-0"
      >
        Skip to content
      </a>

      <Environment />
      {!booted && <BootSequence onComplete={() => setBooted(true)} />}

      <div inert={!booted} className="relative">
        <Navigation active={active} recovered={recovered} />
        <main id="main">
          <Hero ready={booted} />
          <SurvivorProfile recovered={has("profile")} />
          <Arsenal recovered={has("arsenal")} />
          <ProjectArchive recovered={has("archives")} />
          <BuildLog recovered={has("log")} />
          <FinalTransmission
            recovered={has("transmission")}
            recoveredCount={recovered.length}
            onReplayBoot={replayBoot}
          />
        </main>
      </div>

      {booted && <RecoveryToast latest={latest} count={recovered.length} />}
    </MotionConfig>
  );
}
