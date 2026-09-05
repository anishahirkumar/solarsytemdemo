export type PlanetType = "Terrestrial" | "Gas giant" | "Ice giant";

export interface MoonSpec {
  name: string;
  /** orbital distance, as a multiple of the planet's visual radius */
  dist: number;
  /** canvas radius in px at zoom 1 */
  size: number;
  /** visual orbital period in sim-days (negative = retrograde) */
  period: number;
  color: string;
  angle0: number;
}

export interface Planet {
  id: string;
  name: string;
  type: PlanetType;
  tagline: string;
  fact: string;
  /** real values */
  diameterKm: number;
  distanceMkm: number;
  au: number;
  orbitalDays: number;
  rotationText: string;
  tempC: number;
  moons: number;
  /** named satellites shown in the dossier */
  moonNames: string[];
  /** rendered satellite system */
  moonVisuals: MoonSpec[];
  /** render palette */
  colorLight: string;
  color: string;
  colorDark: string;
  glow: string;
  /** initial orbital angle, radians */
  angle0: number;
}

export const EARTH_DIAMETER = 12756;
export const BASE_DAYS_PER_SEC = 10; // 1× velocity
export const SPEED_PRESETS = [0.5, 1, 2, 4, 8, 16];

const GA = 2.39996; // golden angle spread for pleasing starting positions

export const PLANETS: Planet[] = [
  {
    id: "mercury",
    name: "Mercury",
    type: "Terrestrial",
    tagline: "The scorched sprinter",
    fact: "A year here lasts just 88 Earth days, yet one solar day — sunrise to sunrise — drags on for 176. Two Mercurian years fit inside a single day.",
    diameterKm: 4879,
    distanceMkm: 57.9,
    au: 0.39,
    orbitalDays: 88,
    rotationText: "58.6 days",
    tempC: 167,
    moons: 0,
    moonNames: [],
    moonVisuals: [],
    colorLight: "#ddd8d2",
    color: "#9c968f",
    colorDark: "#45413b",
    glow: "rgba(196,188,176,0.5)",
    angle0: 0 * GA,
  },
  {
    id: "venus",
    name: "Venus",
    type: "Terrestrial",
    tagline: "Earth's veiled twin",
    fact: "Venus spins backwards, so slowly that its day (243 Earth days) outlasts its year — and the Sun rises in the west beneath its crushing acid clouds.",
    diameterKm: 12104,
    distanceMkm: 108.2,
    au: 0.72,
    orbitalDays: 224.7,
    rotationText: "243 days ↺",
    tempC: 464,
    moons: 0,
    moonNames: [],
    moonVisuals: [],
    colorLight: "#ffe9c2",
    color: "#e0b26a",
    colorDark: "#7a5728",
    glow: "rgba(240,196,120,0.55)",
    angle0: 1 * GA,
  },
  {
    id: "earth",
    name: "Earth",
    type: "Terrestrial",
    tagline: "The blue oasis",
    fact: "The only world known to harbor life. Its large Moon steadies the axial tilt, keeping Earth's climate calm enough for oceans — and for us.",
    diameterKm: 12756,
    distanceMkm: 149.6,
    au: 1,
    orbitalDays: 365.2,
    rotationText: "23.9 hours",
    tempC: 15,
    moons: 1,
    moonNames: ["Luna"],
    moonVisuals: [
      { name: "Luna", dist: 2.15, size: 1.7, period: 31, color: "#c8cdd6", angle0: 0.8 },
    ],
    colorLight: "#a5dcff",
    color: "#3f7fd4",
    colorDark: "#122f66",
    glow: "rgba(96,165,255,0.6)",
    angle0: 2 * GA,
  },
  {
    id: "mars",
    name: "Mars",
    type: "Terrestrial",
    tagline: "The rust frontier",
    fact: "Mars hosts Olympus Mons, a volcano nearly three Everests tall, and Valles Marineris — a canyon system that would span the entire United States.",
    diameterKm: 6792,
    distanceMkm: 227.9,
    au: 1.52,
    orbitalDays: 687,
    rotationText: "24.6 hours",
    tempC: -65,
    moons: 2,
    moonNames: ["Phobos", "Deimos"],
    moonVisuals: [
      { name: "Phobos", dist: 1.95, size: 1.0, period: 3.2, color: "#a89a8c", angle0: 2.2 },
      { name: "Deimos", dist: 2.8, size: 0.85, period: 6.5, color: "#9a8d80", angle0: 4.6 },
    ],
    colorLight: "#ffb08a",
    color: "#cf5f3a",
    colorDark: "#5f2111",
    glow: "rgba(224,110,70,0.55)",
    angle0: 3 * GA,
  },
  {
    id: "jupiter",
    name: "Jupiter",
    type: "Gas giant",
    tagline: "The giant shield",
    fact: "The Great Red Spot is a storm wider than Earth that has raged for centuries. Jupiter's immense gravity also acts as a shield, sweeping comets away from the inner worlds.",
    diameterKm: 142984,
    distanceMkm: 778.6,
    au: 5.2,
    orbitalDays: 4331,
    rotationText: "9.9 hours",
    tempC: -110,
    moons: 95,
    moonNames: ["Io", "Europa", "Ganymede", "Callisto", "Amalthea", "Himalia", "Thebe", "Metis"],
    moonVisuals: [
      { name: "Io", dist: 1.7, size: 1.5, period: 8, color: "#e8d27a", angle0: 1.1 },
      { name: "Europa", dist: 2.05, size: 1.35, period: 11.4, color: "#d9d4c8", angle0: 3.4 },
      { name: "Ganymede", dist: 2.4, size: 1.95, period: 16.2, color: "#b7ab98", angle0: 5.2 },
      { name: "Callisto", dist: 2.85, size: 1.7, period: 24.5, color: "#8f8577", angle0: 0.4 },
    ],
    colorLight: "#ffdcb0",
    color: "#c9925c",
    colorDark: "#61401f",
    glow: "rgba(214,160,100,0.5)",
    angle0: 4 * GA,
  },
  {
    id: "saturn",
    name: "Saturn",
    type: "Gas giant",
    tagline: "Lord of the rings",
    fact: "Its dazzling rings stretch 280,000 km across yet are as thin as ~10 metres in places. Saturn itself is so light it would float in water.",
    diameterKm: 120536,
    distanceMkm: 1433.5,
    au: 9.58,
    orbitalDays: 10747,
    rotationText: "10.7 hours",
    tempC: -140,
    moons: 146,
    moonNames: ["Titan", "Rhea", "Iapetus", "Dione", "Tethys", "Enceladus", "Mimas", "Hyperion"],
    moonVisuals: [
      { name: "Enceladus", dist: 2.5, size: 1.1, period: 7.2, color: "#eef3f5", angle0: 2.8 },
      { name: "Rhea", dist: 2.85, size: 1.4, period: 12.7, color: "#cfc9bd", angle0: 5.5 },
      { name: "Titan", dist: 3.35, size: 2.1, period: 23.9, color: "#d8a55e", angle0: 1.6 },
    ],
    colorLight: "#ffe9c4",
    color: "#dcb877",
    colorDark: "#6f5327",
    glow: "rgba(230,196,130,0.55)",
    angle0: 5 * GA,
  },
  {
    id: "uranus",
    name: "Uranus",
    type: "Ice giant",
    tagline: "The tilted ice world",
    fact: "Knocked almost fully onto its side by an ancient impact, Uranus rolls around the Sun at a 98° tilt — each pole gets 42 years of daylight, then 42 of night.",
    diameterKm: 51118,
    distanceMkm: 2872.5,
    au: 19.2,
    orbitalDays: 30589,
    rotationText: "17.2 hours ↺",
    tempC: -195,
    moons: 28,
    moonNames: ["Titania", "Oberon", "Umbriel", "Ariel", "Miranda"],
    moonVisuals: [
      { name: "Miranda", dist: 2.05, size: 1.0, period: 7.1, color: "#c3c9d1", angle0: 0.9 },
      { name: "Ariel", dist: 2.45, size: 1.2, period: 12.4, color: "#cdd2d9", angle0: 3.1 },
      { name: "Titania", dist: 2.95, size: 1.55, period: 21.2, color: "#b9bfc9", angle0: 4.9 },
      { name: "Oberon", dist: 3.4, size: 1.4, period: 25.7, color: "#a9aeb8", angle0: 2.0 },
    ],
    colorLight: "#d2f7ff",
    color: "#7cc7d8",
    colorDark: "#28606f",
    glow: "rgba(124,210,230,0.55)",
    angle0: 6 * GA,
  },
  {
    id: "neptune",
    name: "Neptune",
    type: "Ice giant",
    tagline: "The wind-ravaged blue",
    fact: "Supersonic winds tear across Neptune at over 2,000 km/h — the fastest in the Solar System. Fittingly, it was found with mathematics before any telescope spotted it.",
    diameterKm: 49528,
    distanceMkm: 4495.1,
    au: 30.05,
    orbitalDays: 59800,
    rotationText: "16.1 hours",
    tempC: -200,
    moons: 16,
    moonNames: ["Triton", "Proteus", "Nereid", "Larissa"],
    moonVisuals: [
      { name: "Triton", dist: 2.35, size: 1.55, period: -14.6, color: "#cfe0e8", angle0: 1.4 },
      { name: "Nereid", dist: 3.15, size: 0.9, period: 52, color: "#9aa5b1", angle0: 4.2 },
    ],
    colorLight: "#aec6ff",
    color: "#4666d8",
    colorDark: "#16245c",
    glow: "rgba(100,136,240,0.6)",
    angle0: 7 * GA,
  },
];

/* ------------------------------------------------------------------ */
/*  Scene scaling — orbital radii use a √ compression so all eight     */
/*  orbits fit on screen; orbital periods keep their true ratios.      */
/* ------------------------------------------------------------------ */

export const SUN_R = 30;

export const orbitRadius = (au: number): number => 105 + 148 * Math.sqrt(au);

export const visualRadius = (diameterKm: number): number =>
  3.4 + 2.05 * Math.sqrt(diameterKm / EARTH_DIAMETER);

export const NEPTUNE_ORBIT = orbitRadius(PLANETS[PLANETS.length - 1].au);

export const angleAt = (p: Planet, simDays: number): number =>
  p.angle0 + (Math.PI * 2 * simDays) / p.orbitalDays;

export const moonAngleAt = (m: MoonSpec, simDays: number): number =>
  m.angle0 + (Math.PI * 2 * simDays) / m.period;

export const fmt = (n: number): string => n.toLocaleString("en-US");

export const hexToRgba = (hex: string, alpha: number): string => {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
};
