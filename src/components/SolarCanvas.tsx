import { useEffect, useRef } from "react";
import {
  PLANETS,
  NEPTUNE_ORBIT,
  SUN_R,
  orbitRadius,
  visualRadius,
  angleAt,
  moonAngleAt,
  hexToRgba,
} from "../data/planets";

interface Props {
  playing: boolean;
  speedDaysPerSec: number;
  showOrbits: boolean;
  showLabels: boolean;
  follow: boolean;
  selectedId: string | null;
  reducedMotion: boolean;
  resetToken: number;
  onSelect: (id: string | null) => void;
  onFollowChange: (v: boolean) => void;
  onTick: (days: number) => void;
}

interface Star {
  x: number;
  y: number;
  r: number;
  a: number;
  ph: number;
  tw: number;
  layer: number; // 0.35 / 0.65 / 1
}

interface Hit {
  id: string;
  x: number;
  y: number;
  r: number;
}

const TAU = Math.PI * 2;
const clamp = (v: number, lo: number, hi: number) =>
  Math.min(hi, Math.max(lo, v));

export default function SolarCanvas(props: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const propsRef = useRef(props);

  useEffect(() => {
    propsRef.current = props;
  });

  /* reset simulation */
  const stateRef = useRef({
    simDays: 0,
    cam: { x: 0, y: 0, zoom: 0.4 },
    userZoom: 1,
    t: 0,
    lastTs: 0,
    lastTickSent: -1,
    stars: [] as Star[],
    hits: [] as Hit[],
    hoverId: null as string | null,
    drag: { on: false, x: 0, y: 0, moved: 0, announced: false },
  });

  useEffect(() => {
    const p = propsRef.current;
    if (props.resetToken > 0) {
      const s = stateRef.current;
      s.simDays = 0;
      s.userZoom = 1;
      s.lastTickSent = -1;
      p.onTick(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.resetToken]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const wrap = wrapRef.current!;
    const ctx = canvas.getContext("2d")!;
    const s = stateRef.current;

    let w = 0;
    let h = 0;
    let dpr = 1;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      w = Math.max(320, rect.width);
      h = Math.max(320, rect.height);
      dpr = clamp(window.devicePixelRatio || 1, 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      if (s.stars.length === 0) seedStars();
    };

    const seedStars = () => {
      const count = clamp(Math.round((w * h) / 4200), 160, 430);
      const layers = [0.35, 0.65, 1];
      s.stars = Array.from({ length: count }, () => {
        const layer = layers[Math.floor(Math.random() * 3)];
        return {
          x: Math.random(),
          y: Math.random(),
          r: 0.5 + Math.random() * 1.1 * layer,
          a: 0.25 + Math.random() * 0.6,
          ph: Math.random() * TAU,
          tw: 0.6 + Math.random() * 1.8,
          layer,
        };
      });
    };

    const ro = new ResizeObserver(resize);
    ro.observe(wrap);
    resize();

    /* ---------------- helpers ---------------- */

    const baseZoom = () => Math.min(w, h) / (2 * (NEPTUNE_ORBIT + 75));

    const worldToScreen = (wx: number, wy: number) => ({
      x: (wx - s.cam.x) * s.cam.zoom + w / 2,
      y: (wy - s.cam.y) * s.cam.zoom + h / 2,
    });

    const hitTest = (mx: number, my: number): string | null => {
      let best: Hit | null = null;
      let bestD = Infinity;
      for (const hp of s.hits) {
        const d = Math.hypot(hp.x - mx, hp.y - my);
        if (d <= hp.r + 7 && d < bestD) {
          bestD = d;
          best = hp;
        }
      }
      return best ? best.id : null;
    };

    /* ---------------- pointer input ---------------- */

    const toLocal = (e: PointerEvent | WheelEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const onPointerDown = (e: PointerEvent) => {
      canvas.setPointerCapture(e.pointerId);
      s.drag = { on: true, x: e.clientX, y: e.clientY, moved: 0, announced: false };
    };

    const onPointerMove = (e: PointerEvent) => {
      const { x, y } = toLocal(e);
      if (s.drag.on) {
        const dx = e.clientX - s.drag.x;
        const dy = e.clientY - s.drag.y;
        s.drag.x = e.clientX;
        s.drag.y = e.clientY;
        s.drag.moved += Math.abs(dx) + Math.abs(dy);
        s.cam.x -= dx / s.cam.zoom;
        s.cam.y -= dy / s.cam.zoom;
        if (s.drag.moved > 6 && !s.drag.announced) {
          s.drag.announced = true;
          if (propsRef.current.follow) propsRef.current.onFollowChange(false);
        }
        canvas.style.cursor = "grabbing";
        return;
      }
      const id = hitTest(x, y);
      s.hoverId = id;
      canvas.style.cursor = id ? "pointer" : "grab";
    };

    const onPointerUp = (e: PointerEvent) => {
      const wasDrag = s.drag.moved > 6;
      s.drag.on = false;
      canvas.style.cursor = "grab";
      if (wasDrag) return;
      const { x, y } = toLocal(e);
      propsRef.current.onSelect(hitTest(x, y));
    };

    const onPointerLeave = () => {
      s.hoverId = null;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const factor = Math.exp(-e.deltaY * 0.0011);
      s.userZoom = clamp(s.userZoom * factor, 0.55, 14);
      if (propsRef.current.follow) propsRef.current.onFollowChange(false);
    };

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", onPointerUp);
    canvas.addEventListener("pointerleave", onPointerLeave);
    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.style.cursor = "grab";

    /* ---------------- drawing ---------------- */

    const drawBackground = () => {
      ctx.fillStyle = "#04070f";
      ctx.fillRect(0, 0, w, h);

      // milky way band
      ctx.save();
      ctx.translate(w / 2, h / 2);
      ctx.rotate(-0.45);
      const band = ctx.createLinearGradient(0, -h * 0.55, 0, h * 0.55);
      band.addColorStop(0, "rgba(120,150,220,0)");
      band.addColorStop(0.5, "rgba(150,175,235,0.055)");
      band.addColorStop(1, "rgba(120,150,220,0)");
      ctx.fillStyle = band;
      ctx.fillRect(-w, -h * 0.6, w * 2, h * 1.2);
      ctx.restore();

      // faint nebulae — teal, deep blue, warm amber
      const nebs: Array<[number, number, number, string]> = [
        [0.18, 0.24, 0.5, "rgba(56,168,178,0.05)"],
        [0.82, 0.72, 0.55, "rgba(255,150,70,0.04)"],
        [0.65, 0.15, 0.4, "rgba(70,110,210,0.05)"],
      ];
      for (const [nx, ny, nr, col] of nebs) {
        const g = ctx.createRadialGradient(nx * w, ny * h, 0, nx * w, ny * h, nr * Math.max(w, h));
        g.addColorStop(0, col);
        g.addColorStop(1, "rgba(4,7,15,0)");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }

      // stars (parallax + twinkle)
      const p = propsRef.current;
      const ox = -s.cam.x * s.cam.zoom;
      const oy = -s.cam.y * s.cam.zoom;
      for (const st of s.stars) {
        const drift = p.reducedMotion ? 0 : s.t * st.layer * 1.4;
        const sx = (((st.x * w + ox * st.layer * 0.08 + drift) % w) + w) % w;
        const sy = (((st.y * h + oy * st.layer * 0.08) % h) + h) % h;
        const alpha = p.reducedMotion
          ? st.a
          : st.a * (0.62 + 0.38 * Math.sin(s.t * st.tw + st.ph));
        ctx.globalAlpha = alpha;
        ctx.fillStyle = st.layer > 0.8 ? "#dfe9ff" : "#9fb4d8";
        if (st.r > 1.15) {
          ctx.beginPath();
          ctx.arc(sx, sy, st.r, 0, TAU);
          ctx.fill();
        } else {
          ctx.fillRect(sx, sy, st.r + 0.5, st.r + 0.5);
        }
      }
      ctx.globalAlpha = 1;
    };

    const frame = (ts: number) => {
      const p = propsRef.current;
      const dt = clamp((ts - s.lastTs) / 1000, 0, 0.05);
      s.lastTs = ts;
      s.t += dt;

      if (p.playing && !p.reducedMotion) {
        s.simDays += p.speedDaysPerSec * dt;
      }

      // throttled clock report (~5 Hz)
      const q = Math.floor(s.simDays * 5);
      if (q !== s.lastTickSent) {
        s.lastTickSent = q;
        p.onTick(s.simDays);
      }

      /* camera */
      const sel = p.selectedId ? PLANETS.find((pl) => pl.id === p.selectedId) : null;
      const followActive = p.follow && !!sel;
      let tx = 0;
      let ty = 0;
      if (followActive && sel) {
        const a = angleAt(sel, s.simDays);
        const R = orbitRadius(sel.au);
        tx = Math.cos(a) * R;
        ty = Math.sin(a) * R;
      }
      const tZoom = followActive ? 2.2 : baseZoom() * s.userZoom;
      const k = p.reducedMotion ? 1 : 1 - Math.pow(0.0006, dt);
      if (!s.drag.on) {
        s.cam.x += (tx - s.cam.x) * k;
        s.cam.y += (ty - s.cam.y) * k;
      }
      s.cam.zoom += (tZoom - s.cam.zoom) * (p.reducedMotion ? 1 : 1 - Math.pow(0.002, dt));

      /* draw */
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      drawBackground();

      const sun = worldToScreen(0, 0);
      const zoom = s.cam.zoom;
      s.hits = [];

      // orbit paths
      for (const pl of PLANETS) {
        const R = orbitRadius(pl.au) * zoom;
        if (p.showOrbits) {
          const active = pl.id === p.selectedId;
          const hov = pl.id === s.hoverId;
          ctx.beginPath();
          ctx.arc(sun.x, sun.y, R, 0, TAU);
          ctx.strokeStyle = hexToRgba(pl.color, active ? 0.55 : hov ? 0.4 : 0.16);
          ctx.lineWidth = active ? 1.4 : 1;
          ctx.stroke();
        }
      }

      // per-planet geometry
      const geom = PLANETS.map((pl) => {
        const a = angleAt(pl, s.simDays);
        const R = orbitRadius(pl.au);
        const wp = { x: Math.cos(a) * R, y: Math.sin(a) * R };
        const sp = worldToScreen(wp.x, wp.y);
        const drawR = Math.max(visualRadius(pl.diameterKm) * zoom, 4.2);
        return { pl, a, sp, drawR };
      });

      // motion trails
      for (const g of geom) {
        const R = orbitRadius(g.pl.au) * zoom;
        const segs = 16;
        const step = 0.03;
        ctx.lineWidth = Math.max(1, g.drawR * 0.28);
        for (let i = segs; i >= 1; i--) {
          const a1 = g.a - i * step;
          const a2 = g.a - (i - 1) * step;
          ctx.beginPath();
          ctx.arc(sun.x, sun.y, R, a1, a2);
          ctx.strokeStyle = hexToRgba(g.pl.color, 0.3 * Math.pow(1 - i / segs, 1.3));
          ctx.stroke();
        }
      }

      // sun
      const sunPulse = p.reducedMotion ? 1 : 1 + 0.025 * Math.sin(s.t * 1.2);
      const sunDrawR = Math.max(SUN_R * zoom * sunPulse, 15);
      const glowR = sunDrawR * 3.1;
      let g1 = ctx.createRadialGradient(sun.x, sun.y, sunDrawR * 0.4, sun.x, sun.y, glowR);
      g1.addColorStop(0, "rgba(255,176,80,0.30)");
      g1.addColorStop(0.4, "rgba(255,150,60,0.10)");
      g1.addColorStop(1, "rgba(255,140,50,0)");
      ctx.fillStyle = g1;
      ctx.beginPath();
      ctx.arc(sun.x, sun.y, glowR, 0, TAU);
      ctx.fill();

      const core = ctx.createRadialGradient(
        sun.x - sunDrawR * 0.25,
        sun.y - sunDrawR * 0.25,
        sunDrawR * 0.1,
        sun.x,
        sun.y,
        sunDrawR
      );
      core.addColorStop(0, "#fff8e6");
      core.addColorStop(0.45, "#ffd98c");
      core.addColorStop(0.8, "#ffab40");
      core.addColorStop(1, "#e8641f");
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(sun.x, sun.y, sunDrawR, 0, TAU);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(sun.x, sun.y, sunDrawR * 1.22, 0, TAU);
      ctx.strokeStyle = "rgba(255,196,110,0.16)";
      ctx.lineWidth = sunDrawR * 0.16;
      ctx.stroke();

      // planets
      for (const g of geom) {
        const { pl, sp, drawR } = g;
        const hovered = s.hoverId === pl.id;
        const selected = p.selectedId === pl.id;
        const r = hovered ? drawR * 1.12 : drawR;

        // saturn rings — back pass
        if (pl.id === "saturn") {
          ctx.save();
          ctx.translate(sp.x, sp.y);
          ctx.rotate(-0.42);
          ctx.scale(1, 0.34);
          ctx.beginPath();
          ctx.arc(0, 0, r * 2.0, 0, TAU);
          ctx.strokeStyle = hexToRgba("#e8cd9a", 0.65);
          ctx.lineWidth = r * 0.52;
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(0, 0, r * 1.55, 0, TAU);
          ctx.strokeStyle = "rgba(20,16,8,0.5)";
          ctx.lineWidth = r * 0.08;
          ctx.stroke();
          ctx.restore();
        }

        // body, lit from the sun side
        const dx = sun.x - sp.x;
        const dy = sun.y - sp.y;
        const len = Math.hypot(dx, dy) || 1;
        const ox = (dx / len) * r * 0.45;
        const oy = (dy / len) * r * 0.45;
        const body = ctx.createRadialGradient(sp.x + ox, sp.y + oy, r * 0.12, sp.x, sp.y, r);
        body.addColorStop(0, pl.colorLight);
        body.addColorStop(0.55, pl.color);
        body.addColorStop(1, pl.colorDark);
        ctx.save();
        ctx.shadowColor = pl.glow;
        ctx.shadowBlur = 16;
        ctx.fillStyle = body;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, r, 0, TAU);
        ctx.fill();
        ctx.restore();

        // saturn rings — front pass
        if (pl.id === "saturn") {
          ctx.save();
          ctx.translate(sp.x, sp.y);
          ctx.rotate(-0.42);
          ctx.scale(1, 0.34);
          ctx.beginPath();
          ctx.arc(0, 0, r * 2.0, 0, Math.PI);
          ctx.strokeStyle = hexToRgba("#f0d8a8", 0.8);
          ctx.lineWidth = r * 0.52;
          ctx.stroke();
          ctx.restore();
        }

        // satellite system
        if (pl.moonVisuals.length && (selected || hovered || zoom > 0.9)) {
          const ux = dx / len;
          const uy = dy / len;
          const showMoonOrbits =
            p.showOrbits && (selected || hovered || zoom > 1.6);
          for (const m of pl.moonVisuals) {
            const md = r * m.dist + 3;
            if (showMoonOrbits) {
              ctx.beginPath();
              ctx.arc(sp.x, sp.y, md, 0, TAU);
              ctx.strokeStyle = "rgba(170,195,235,0.14)";
              ctx.lineWidth = 1;
              ctx.stroke();
            }
            const ma = moonAngleAt(m, s.simDays);
            const mx = sp.x + Math.cos(ma) * md;
            const my = sp.y + Math.sin(ma) * md;
            const ms = Math.max(m.size * (0.55 + 0.45 * zoom), 0.8);
            const mg = ctx.createRadialGradient(
              mx + ux * ms * 0.5,
              my + uy * ms * 0.5,
              ms * 0.1,
              mx,
              my,
              ms * 1.25
            );
            mg.addColorStop(0, m.color);
            mg.addColorStop(1, "rgba(12,16,26,0.95)");
            ctx.beginPath();
            ctx.arc(mx, my, ms, 0, TAU);
            ctx.fillStyle = mg;
            ctx.fill();
          }
        }

        // hover halo
        if (hovered && !selected) {
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, r + 5, 0, TAU);
          ctx.strokeStyle = "rgba(233,237,248,0.4)";
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // selection reticle
        if (selected) {
          ctx.save();
          ctx.strokeStyle = hexToRgba(pl.color, 0.95);
          ctx.lineWidth = 1.4;
          ctx.setLineDash([5, 7]);
          ctx.lineDashOffset = p.reducedMotion ? 0 : -s.t * 26;
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, r + 9, 0, TAU);
          ctx.stroke();
          ctx.setLineDash([]);
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, r + 15, 0, TAU);
          ctx.strokeStyle = hexToRgba(pl.color, 0.22);
          ctx.lineWidth = 1;
          ctx.stroke();
          ctx.restore();
        }

        // label
        if (p.showLabels || hovered || selected) {
          const ly = sp.y - r - 12;
          ctx.strokeStyle = hexToRgba(pl.color, 0.3);
          ctx.beginPath();
          ctx.moveTo(sp.x, sp.y - r - 3);
          ctx.lineTo(sp.x, ly + 4);
          ctx.stroke();
          ctx.font = '500 10px "IBM Plex Mono", monospace';
          ctx.textAlign = "center";
          ctx.fillStyle = selected
            ? "#f2f5ff"
            : hovered
              ? "rgba(233,237,248,0.9)"
              : "rgba(233,237,248,0.55)";
          ctx.fillText(pl.name.toUpperCase(), sp.x, ly);
        }

        s.hits.push({ id: pl.id, x: sp.x, y: sp.y, r: Math.max(drawR, 9) });
      }

      // vignette
      const vg = ctx.createRadialGradient(
        w / 2,
        h / 2,
        Math.min(w, h) * 0.35,
        w / 2,
        h / 2,
        Math.max(w, h) * 0.75
      );
      vg.addColorStop(0, "rgba(4,7,15,0)");
      vg.addColorStop(1, "rgba(3,5,12,0.55)");
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, w, h);

      raf = requestAnimationFrame(frame);
    };

    let raf = requestAnimationFrame((ts) => {
      s.lastTs = ts;
      raf = requestAnimationFrame(frame);
    });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("wheel", onWheel);
    };
  }, []);

  return (
    <div ref={wrapRef} className="absolute inset-0">
      <canvas ref={canvasRef} className="block" aria-label="Solar system orbital map" />
    </div>
  );
}
