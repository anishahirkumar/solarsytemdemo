import { useCallback, useEffect, useState } from "react";
import SolarCanvas from "./components/SolarCanvas";
import InfoPanel from "./components/InfoPanel";
import ControlDock from "./components/ControlDock";
import PlanetRail from "./components/PlanetRail";
import { IconArrowKeys } from "./components/icons";
import { PLANETS, BASE_DAYS_PER_SEC, SPEED_PRESETS } from "./data/planets";

const useReducedMotion = () => {
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
};

export default function App() {
  const reducedMotion = useReducedMotion();

  const [selectedId, setSelectedId] = useState<string | null>("earth");
  const [playing, setPlaying] = useState(() => !reducedMotion);
  const [speedMult, setSpeedMult] = useState(1);
  const [showOrbits, setShowOrbits] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [showBelt, setShowBelt] = useState(true);
  const [follow, setFollow] = useState(false);
  const [simDays, setSimDays] = useState(0);
  const [resetToken, setResetToken] = useState(0);

  const onTick = useCallback((days: number) => setSimDays(days), []);

  const selectedIndex = selectedId
    ? PLANETS.findIndex((p) => p.id === selectedId)
    : -1;
  const selected = selectedIndex >= 0 ? PLANETS[selectedIndex] : null;

  const handleSelect = useCallback((id: string | null) => {
    setSelectedId(id);
    if (id === null) setFollow(false);
  }, []);

  const stepSelection = useCallback((dir: 1 | -1) => {
    setSelectedId((cur) => {
      const i = cur ? PLANETS.findIndex((p) => p.id === cur) : -1;
      const next =
        i === -1
          ? dir === 1
            ? 0
            : PLANETS.length - 1
          : (i + dir + PLANETS.length) % PLANETS.length;
      return PLANETS[next].id;
    });
  }, []);

  const toggleFollow = useCallback(() => {
    setFollow((f) => {
      if (!f) setSelectedId((cur) => cur ?? "earth");
      return !f;
    });
  }, []);

  /* keyboard shortcuts */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
      switch (e.key) {
        case " ":
          if (tag === "BUTTON") return;
          e.preventDefault();
          setPlaying((p) => !p);
          break;
        case "ArrowRight":
          e.preventDefault();
          stepSelection(1);
          break;
        case "ArrowLeft":
          e.preventDefault();
          stepSelection(-1);
          break;
        case "Escape":
          handleSelect(null);
          break;
        case "b":
        case "B":
          setShowBelt((v) => !v);
          break;
        case "+":
        case "=": {
          const i = SPEED_PRESETS.indexOf(speedMult);
          setSpeedMult(SPEED_PRESETS[Math.min(i + 1, SPEED_PRESETS.length - 1)]);
          break;
        }
        case "-":
        case "_": {
          const i = SPEED_PRESETS.indexOf(speedMult);
          setSpeedMult(SPEED_PRESETS[Math.max(i - 1, 0)]);
          break;
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [speedMult, stepSelection, handleSelect]);

  const prevName = selected
    ? PLANETS[(selectedIndex + PLANETS.length - 1) % PLANETS.length].name
    : "";
  const nextName = selected
    ? PLANETS[(selectedIndex + 1) % PLANETS.length].name
    : "";

  return (
    <div className="fixed inset-0 overflow-hidden bg-void font-body text-ink">
      {/* simulation */}
      <SolarCanvas
        playing={playing}
        speedDaysPerSec={speedMult * BASE_DAYS_PER_SEC}
        showOrbits={showOrbits}
        showLabels={showLabels}
        showBelt={showBelt}
        follow={follow}
        selectedId={selectedId}
        reducedMotion={reducedMotion}
        resetToken={resetToken}
        onSelect={handleSelect}
        onFollowChange={setFollow}
        onTick={onTick}
      />

      {/* header HUD */}
      <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start justify-between p-5 lg:p-6">
        <div className="anim-rise">
          <div className="flex items-center gap-2.5">
            <span className="h-px w-8 bg-solar/70" />
            <span className="font-mono text-[9.5px] tracking-[0.34em] text-halo">
              MISSION 08 · INTERACTIVE ORRERY
            </span>
          </div>
          <h1 className="mt-2 font-display text-[26px] font-extrabold leading-none tracking-[0.1em] md:text-[32px]">
            HELIOS<span className="text-solar">·</span>ORRERY
          </h1>
          <p className="mt-2 max-w-[300px] text-[12.5px] leading-snug text-dim">
            The Sun, its eight worlds and the asteroid belt — in live
            orbital motion.{" "}
            <span className="text-ink/80">Click any planet</span> to open its
            dossier.
          </p>
        </div>

        <div
          className="anim-rise hidden text-right sm:block"
          style={{ animationDelay: "120ms" }}
        >
          <div className="flex items-center justify-end gap-2">
            <span
              className={`h-2 w-2 rounded-full ${
                playing ? "anim-blink bg-[#5ee38a]" : "bg-solar"
              }`}
            />
            <span
              className={`font-mono text-[10px] tracking-[0.3em] ${
                playing ? "text-[#5ee38a]" : "text-solar"
              }`}
            >
              {playing ? "ORBITS RUNNING" : "SIMULATION HOLD"}
            </span>
          </div>
          <div className="mt-2 font-mono text-[10px] tracking-[0.2em] text-faint">
            SIM RATE · {Math.round(speedMult * BASE_DAYS_PER_SEC)} DAYS/SEC
          </div>
          <div className="mt-1 font-mono text-[10px] tracking-[0.2em] text-faint">
            SCROLL TO ZOOM · DRAG TO PAN
          </div>
        </div>
      </header>

      {/* planet rail */}
      <PlanetRail selectedId={selectedId} onSelect={(id) => handleSelect(id)} />

      {/* controls */}
      <ControlDock
        playing={playing}
        onTogglePlay={() => setPlaying((p) => !p)}
        speedMult={speedMult}
        onSpeed={setSpeedMult}
        simDays={simDays}
        showOrbits={showOrbits}
        showLabels={showLabels}
        showBelt={showBelt}
        follow={follow}
        onToggleOrbits={() => setShowOrbits((v) => !v)}
        onToggleLabels={() => setShowLabels((v) => !v)}
        onToggleBelt={() => setShowBelt((v) => !v)}
        onToggleFollow={toggleFollow}
        onReset={() => {
          setResetToken((t) => t + 1);
          setFollow(false);
        }}
        reducedMotion={reducedMotion}
      />

      {/* scale note */}
      <div className="pointer-events-none absolute bottom-4 left-4 z-10 hidden font-mono text-[8.5px] leading-relaxed tracking-[0.16em] text-faint md:block lg:left-5">
        ORBIT RADII √-SCALED TO FIT · BODY SIZES EXAGGERATED
        <br />
        ORBITAL PERIODS IN TRUE RATIO
        <br />
        BELT · 2.1–3.3 AU · KEPLERIAN MOTION
      </div>

      {/* keyboard hint */}
      <div className="pointer-events-none absolute bottom-4 right-4 z-10 hidden items-center gap-2 font-mono text-[8.5px] tracking-[0.16em] text-faint xl:flex">
        <IconArrowKeys size={26} className="text-faint" />
        <span>
          ←/→ CYCLE WORLDS · SPACE PLAY/PAUSE
          <br />
          +/− VELOCITY · B BELT · ESC RELEASE
        </span>
      </div>

      {/* tap hint when nothing selected */}
      {!selected && (
        <div className="pointer-events-none absolute left-1/2 top-[16%] z-10 -translate-x-1/2 anim-rise">
          <div className="hud-corners border border-line/70 bg-panel/70 px-5 py-3 text-center backdrop-blur-sm">
            <span className="font-mono text-[10px] tracking-[0.3em] text-halo">
              NO TARGET LOCKED
            </span>
            <p className="mt-1 text-[12px] text-dim">
              Click a planet — or press{" "}
              <kbd className="rounded-sm border border-line bg-abyss px-1.5 py-0.5 font-mono text-[10px] text-ink">
                →
              </kbd>{" "}
              to begin
            </p>
          </div>
        </div>
      )}

      {/* dossier */}
      {selected && (
        <InfoPanel
          key={selected.id}
          planet={selected}
          index={selectedIndex}
          onClose={() => handleSelect(null)}
          onPrev={() => stepSelection(-1)}
          onNext={() => stepSelection(1)}
          prevName={prevName}
          nextName={nextName}
        />
      )}
    </div>
  );
}
