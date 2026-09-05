import { PLANETS } from "../data/planets";

interface Props {
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function PlanetRail({ selectedId, onSelect }: Props) {
  return (
    <nav
      aria-label="Planets"
      className="absolute left-4 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-1 md:flex lg:left-5"
    >
      <span className="mb-2 font-mono text-[8.5px] tracking-[0.3em] text-faint [writing-mode:vertical-rl] rotate-180">
        WORLDS · 08
      </span>
      {PLANETS.map((p, i) => {
        const active = selectedId === p.id;
        return (
          <button
            key={p.id}
            onClick={() => onSelect(p.id)}
            aria-pressed={active}
            title={`${p.name} — ${p.au} AU`}
            className="anim-rise group flex items-center gap-2.5 rounded-sm py-[5px] pl-1 pr-2 text-left transition-colors hover:bg-ink/[0.04]"
            style={{ animationDelay: `${250 + i * 55}ms` }}
          >
            <span
              className={`h-[13px] w-[13px] shrink-0 rounded-full transition-transform duration-200 group-hover:scale-125 ${
                active ? "scale-125" : ""
              }`}
              style={{
                background: `radial-gradient(circle at 34% 30%, ${p.colorLight}, ${p.color} 58%, ${p.colorDark})`,
                boxShadow: active ? `0 0 12px ${p.glow}` : `0 0 4px ${p.glow}`,
                outline: active ? `1px solid ${p.color}` : "none",
                outlineOffset: 2.5,
              }}
            />
            <span
              className={`font-mono text-[10px] tracking-[0.22em] transition-all duration-200 ${
                active
                  ? "translate-x-0 text-ink opacity-100"
                  : "-translate-x-1 text-dim opacity-0 group-hover:translate-x-0 group-hover:opacity-90"
              }`}
            >
              {String(i + 1).padStart(2, "0")} {p.name.toUpperCase()}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
