import type { Planet } from "../data/planets";
import { EARTH_DIAMETER, fmt } from "../data/planets";
import {
  IconClose,
  IconChevronLeft,
  IconChevronRight,
} from "./icons";

interface Props {
  planet: Planet;
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  prevName: string;
  nextName: string;
}

/** log-scale position between min..max, 0..100 */
const logPct = (v: number, min: number, max: number) =>
  (Math.log(v / min) / Math.log(max / min)) * 100;

function Stat({
  label,
  value,
  sub,
  delay,
}: {
  label: string;
  value: string;
  sub: string;
  delay: number;
}) {
  return (
    <div
      className="anim-rise rounded-sm border border-line/60 bg-abyss/50 px-3 py-2.5"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="font-mono text-[9px] tracking-[0.22em] text-faint">
        {label}
      </div>
      <div className="mt-1 font-mono text-[15px] font-medium leading-tight text-ink">
        {value}
      </div>
      <div className="mt-0.5 text-[11px] text-dim">{sub}</div>
    </div>
  );
}

function CompareBar({
  label,
  pct,
  color,
  earthPct,
  delay,
}: {
  label: string;
  pct: number;
  color: string;
  earthPct: number;
  delay: number;
}) {
  return (
    <div className="anim-rise" style={{ animationDelay: `${delay}ms` }}>
      <div className="mb-1.5 flex items-baseline justify-between">
        <span className="font-mono text-[9px] tracking-[0.22em] text-faint">
          {label}
        </span>
        <span className="font-mono text-[9px] text-dim">log scale</span>
      </div>
      <div className="relative h-1.5 overflow-hidden rounded-full bg-line/40">
        <div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{
            width: `${Math.max(pct, 1.5)}%`,
            background: `linear-gradient(90deg, ${color}66, ${color})`,
            boxShadow: `0 0 8px ${color}88`,
          }}
        />
        <div
          className="absolute inset-y-0 w-px bg-ink/60"
          style={{ left: `${earthPct}%` }}
          title="Earth"
        />
      </div>
      <div
        className="mt-0.5 font-mono text-[8px] tracking-wider text-faint"
        style={{ marginLeft: `calc(${earthPct}% - 12px)` }}
      >
        EARTH
      </div>
    </div>
  );
}

export default function InfoPanel({
  planet: p,
  index,
  onClose,
  onPrev,
  onNext,
  prevName,
  nextName,
}: Props) {
  const earthSizePct = logPct(EARTH_DIAMETER, 4879, 142984);
  const earthDistPct = logPct(149.6, 57.9, 4495.1);
  const earthYearPct = logPct(365.2, 88, 59800);
  const years = p.orbitalDays / 365.25;

  return (
    <aside
      className="anim-panel panel-scroll absolute inset-y-0 right-0 z-30 flex w-[min(92vw,372px)] flex-col overflow-y-auto border-l border-line bg-panel/90 backdrop-blur-md"
      role="dialog"
      aria-label={`${p.name} details`}
    >
      <div className="pointer-events-none sticky top-0 h-px bg-gradient-to-r from-transparent via-solar/60 to-transparent" />

      {/* header */}
      <div className="flex items-center justify-between px-6 pt-5">
        <span className="font-mono text-[10px] tracking-[0.3em] text-halo">
          TARGET LOCKED · {String(index + 1).padStart(2, "0")}/08
        </span>
        <button
          onClick={onClose}
          className="rounded-sm border border-line p-1.5 text-dim transition-colors hover:border-ember/60 hover:text-ember"
          aria-label="Close panel"
        >
          <IconClose size={14} />
        </button>
      </div>

      {/* orb + name */}
      <div className="flex items-center gap-5 px-6 pt-5">
        <div className="relative shrink-0">
          <div className="anim-ring absolute -inset-2 rounded-full border border-dashed" style={{ borderColor: `${p.color}55` }} />
          <div
            className="anim-orb h-[76px] w-[76px] rounded-full"
            style={{
              background: `radial-gradient(circle at 32% 28%, ${p.colorLight}, ${p.color} 55%, ${p.colorDark})`,
              boxShadow: `0 0 42px ${p.glow}, inset -10px -10px 22px rgba(0,0,0,0.55)`,
            }}
          />
        </div>
        <div className="min-w-0">
          <h2
            className="font-display text-[34px] font-bold leading-none tracking-[0.06em]"
            style={{ textShadow: `0 0 26px ${p.glow}` }}
          >
            {p.name}
          </h2>
          <p className="mt-2 italic text-dim">“{p.tagline}”</p>
          <div className="mt-2.5 flex gap-2">
            <span
              className="rounded-sm border px-2 py-0.5 font-mono text-[9px] tracking-[0.18em]"
              style={{ borderColor: `${p.color}66`, color: p.colorLight }}
            >
              {p.type.toUpperCase()}
            </span>
            <span className="rounded-sm border border-line px-2 py-0.5 font-mono text-[9px] tracking-[0.18em] text-dim">
              PLANET {String(index + 1).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>

      {/* field note */}
      <div
        className="anim-rise mx-6 mt-5 border-l-2 bg-abyss/60 px-4 py-3"
        style={{ borderColor: p.color, animationDelay: "80ms" }}
      >
        <div className="font-mono text-[9px] tracking-[0.25em] text-faint">
          FIELD NOTE
        </div>
        <p className="mt-1.5 text-[13px] leading-relaxed text-ink/90">{p.fact}</p>
      </div>

      {/* stats */}
      <div className="grid grid-cols-2 gap-2 px-6 pt-5">
        <Stat
          label="DIAMETER"
          value={`${fmt(p.diameterKm)} km`}
          sub={`${(p.diameterKm / EARTH_DIAMETER).toFixed(2)} × Earth`}
          delay={120}
        />
        <Stat
          label="DISTANCE FROM SUN"
          value={`${fmt(p.distanceMkm)} M km`}
          sub={`${p.au} AU`}
          delay={160}
        />
        <Stat
          label="ORBITAL PERIOD"
          value={`${fmt(p.orbitalDays)} days`}
          sub={`${years < 10 ? years.toFixed(2) : years.toFixed(1)} Earth years`}
          delay={200}
        />
        <Stat
          label="DAY LENGTH"
          value={p.rotationText}
          sub="one full spin"
          delay={240}
        />
        <Stat
          label="MEAN TEMP"
          value={`${fmt(p.tempC)} °C`}
          sub="surface average"
          delay={280}
        />
        <Stat
          label="MOONS"
          value={String(p.moons)}
          sub="confirmed"
          delay={320}
        />
      </div>

      {/* major moons */}
      <div className="anim-rise px-6 pt-5" style={{ animationDelay: "340ms" }}>
        <p className="mb-2.5 font-mono text-[9px] tracking-[0.25em] text-faint">
          {p.moonNames.length > 0 ? "MAJOR MOONS" : "SATELLITES"}
        </p>
        {p.moonNames.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {p.moonNames.map((n) => (
              <span
                key={n}
                className="rounded-sm border border-line bg-white/[0.03] px-2 py-[3px] font-mono text-[9.5px] tracking-[0.08em] text-dim transition-colors hover:border-faint hover:text-ink"
              >
                {n}
              </span>
            ))}
            {p.moons > p.moonNames.length && (
              <span className="px-1 py-[3px] font-mono text-[9.5px] text-faint">
                +{p.moons - p.moonNames.length} more
              </span>
            )}
          </div>
        ) : (
          <p className="font-mono text-[10.5px] italic tracking-wide text-faint">
            None — a moonless world.
          </p>
        )}
      </div>

      {/* comparison bars */}
      <div className="space-y-4 px-6 pt-6">
        <CompareBar
          label="SIZE · MERCURY → JUPITER"
          pct={logPct(p.diameterKm, 4879, 142984)}
          color={p.color}
          earthPct={earthSizePct}
          delay={360}
        />
        <CompareBar
          label="DISTANCE FROM SUN"
          pct={logPct(p.distanceMkm, 57.9, 4495.1)}
          color={p.color}
          earthPct={earthDistPct}
          delay={400}
        />
        <CompareBar
          label="LENGTH OF YEAR"
          pct={logPct(p.orbitalDays, 88, 59800)}
          color={p.color}
          earthPct={earthYearPct}
          delay={440}
        />
      </div>

      {/* nav */}
      <div className="mt-6 flex items-center gap-2 border-t border-line px-6 py-4">
        <button
          onClick={onPrev}
          className="group flex flex-1 items-center gap-2 rounded-sm border border-line px-3 py-2 text-left transition-colors hover:border-halo/50 hover:bg-halo/5"
        >
          <IconChevronLeft size={14} className="text-dim transition-colors group-hover:text-halo" />
          <span className="font-mono text-[10px] tracking-[0.15em] text-dim transition-colors group-hover:text-ink">
            {prevName.toUpperCase()}
          </span>
        </button>
        <button
          onClick={onNext}
          className="group flex flex-1 items-center justify-end gap-2 rounded-sm border border-line px-3 py-2 text-right transition-colors hover:border-halo/50 hover:bg-halo/5"
        >
          <span className="font-mono text-[10px] tracking-[0.15em] text-dim transition-colors group-hover:text-ink">
            {nextName.toUpperCase()}
          </span>
          <IconChevronRight size={14} className="text-dim transition-colors group-hover:text-halo" />
        </button>
      </div>

      <div className="px-6 pb-6">
        <p className="font-mono text-[8.5px] leading-relaxed tracking-[0.14em] text-faint">
          DATA · NASA PLANETARY FACT SHEET
          <br />
          BODY SIZES EXAGGERATED FOR VISIBILITY — ORBITAL PERIODS IN TRUE RATIO
        </p>
      </div>
    </aside>
  );
}
