import { SPEED_PRESETS, BASE_DAYS_PER_SEC } from "../data/planets";
import {
  IconPlay,
  IconPause,
  IconReset,
  IconOrbits,
  IconTag,
  IconFollow,
} from "./icons";

interface Props {
  playing: boolean;
  onTogglePlay: () => void;
  speedMult: number;
  onSpeed: (mult: number) => void;
  simDays: number;
  showOrbits: boolean;
  showLabels: boolean;
  follow: boolean;
  onToggleOrbits: () => void;
  onToggleLabels: () => void;
  onToggleFollow: () => void;
  onReset: () => void;
  reducedMotion: boolean;
}

function Toggle({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`flex items-center gap-1.5 rounded-sm border px-2.5 py-1.5 font-mono text-[10px] tracking-[0.18em] transition-all duration-200 ${
        active
          ? "border-halo/60 bg-halo/10 text-halo shadow-[0_0_14px_rgba(111,227,255,0.15)]"
          : "border-line text-dim hover:border-faint hover:text-ink"
      }`}
    >
      {children}
      <span className="hidden lg:inline">{label}</span>
    </button>
  );
}

export default function ControlDock({
  playing,
  onTogglePlay,
  speedMult,
  onSpeed,
  simDays,
  showOrbits,
  showLabels,
  follow,
  onToggleOrbits,
  onToggleLabels,
  onToggleFollow,
  onReset,
  reducedMotion,
}: Props) {
  const years = Math.floor(simDays / 365.25);
  const doy = Math.floor(simDays % 365.25);

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-4 z-20 flex justify-center px-3">
      <div className="hud-corners anim-rise pointer-events-auto flex max-w-[96vw] flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-md border border-line bg-panel/85 px-4 py-2.5 shadow-[0_10px_40px_rgba(0,0,0,0.5)] backdrop-blur-md"
        style={{ animationDelay: "150ms" }}
      >
        {/* transport */}
        <div className="flex items-center gap-2">
          <button
            onClick={onTogglePlay}
            aria-label={playing ? "Pause simulation" : "Play simulation"}
            title={playing ? "Pause (Space)" : "Play (Space)"}
            className={`flex h-10 w-10 items-center justify-center rounded-sm border transition-all duration-200 ${
              playing
                ? "border-solar/70 bg-solar/15 text-solar shadow-[0_0_18px_rgba(255,180,84,0.25)]"
                : "border-solar/50 text-solar hover:bg-solar/10"
            }`}
          >
            {playing ? <IconPause size={17} /> : <IconPlay size={17} />}
          </button>
          <button
            onClick={onReset}
            aria-label="Reset simulation"
            title="Reset clock (T = 0)"
            className="flex h-8 w-8 items-center justify-center rounded-sm border border-line text-dim transition-colors hover:border-ember/60 hover:text-ember"
          >
            <IconReset size={14} />
          </button>
        </div>

        <div className="hidden h-8 w-px bg-line sm:block" />

        {/* speed */}
        <div className="flex items-center gap-2.5">
          <div className="flex flex-col">
            <span className="font-mono text-[8.5px] tracking-[0.28em] text-faint">
              VELOCITY
            </span>
            <span className="font-mono text-[10px] text-solar">
              {Math.round(speedMult * BASE_DAYS_PER_SEC)} d/s
            </span>
          </div>
          <div className="flex gap-1">
            {SPEED_PRESETS.map((m) => (
              <button
                key={m}
                onClick={() => onSpeed(m)}
                aria-pressed={speedMult === m}
                className={`rounded-sm border px-2 py-1 font-mono text-[10.5px] transition-all duration-150 ${
                  speedMult === m
                    ? "border-solar/70 bg-solar/15 text-solar shadow-[0_0_12px_rgba(255,180,84,0.2)]"
                    : "border-line text-dim hover:border-faint hover:text-ink"
                }`}
              >
                {m}×
              </button>
            ))}
          </div>
        </div>

        <div className="hidden h-8 w-px bg-line sm:block" />

        {/* mission clock */}
        <div className="flex flex-col leading-tight">
          <span className="font-mono text-[8.5px] tracking-[0.28em] text-faint">
            MISSION CLOCK
          </span>
          <span className="font-mono text-[15px] font-medium tabular-nums text-ink">
            YR {String(years).padStart(3, "0")}
            <span className="text-faint"> · </span>DAY{" "}
            {String(doy).padStart(3, "0")}
          </span>
        </div>

        <div className="hidden h-8 w-px bg-line md:block" />

        {/* view toggles */}
        <div className="flex items-center gap-1.5">
          <Toggle active={showOrbits} onClick={onToggleOrbits} label="ORBITS">
            <IconOrbits size={13} />
          </Toggle>
          <Toggle active={showLabels} onClick={onToggleLabels} label="LABELS">
            <IconTag size={13} />
          </Toggle>
          <Toggle active={follow} onClick={onToggleFollow} label="FOLLOW">
            <IconFollow size={13} />
          </Toggle>
        </div>

        {reducedMotion && (
          <span className="flex items-center gap-1.5 rounded-sm border border-solar/40 bg-solar/10 px-2 py-1 font-mono text-[8.5px] tracking-[0.2em] text-solar">
            <span className="h-1.5 w-1.5 rounded-full bg-solar" />
            REDUCED MOTION
          </span>
        )}
      </div>
    </div>
  );
}
