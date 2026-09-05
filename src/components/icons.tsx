import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };

const base = (size = 16) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export const IconPlay = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M7 4.5v15l12-7.5L7 4.5Z" fill="currentColor" stroke="none" />
  </svg>
);

export const IconPause = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <rect x="6" y="4.5" width="4" height="15" fill="currentColor" stroke="none" />
    <rect x="14" y="4.5" width="4" height="15" fill="currentColor" stroke="none" />
  </svg>
);

export const IconReset = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M3 12a9 9 0 1 0 3-6.7" />
    <path d="M3 4v5h5" />
  </svg>
);

export const IconClose = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const IconChevronLeft = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M14.5 5 8 12l6.5 7" />
  </svg>
);

export const IconChevronRight = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M9.5 5 16 12l-6.5 7" />
  </svg>
);

export const IconOrbits = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <circle cx="12" cy="12" r="2.4" fill="currentColor" stroke="none" />
    <ellipse cx="12" cy="12" rx="9.5" ry="4" transform="rotate(-18 12 12)" />
  </svg>
);

export const IconTag = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <path d="M4 7h16M4 12h10M4 17h13" />
  </svg>
);

export const IconFollow = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
  </svg>
);

export const IconArrowKeys = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <rect x="2.5" y="8" width="6" height="8" rx="1" />
    <rect x="9" y="8" width="6" height="8" rx="1" />
    <rect x="15.5" y="8" width="6" height="8" rx="1" />
    <path d="M5 12.5 4.2 11h1.6L5 12.5ZM12 11.5l.8 1.5h-1.6L12 11.5ZM18.5 12.5l-.8-1.5h1.6l-.8 1.5Z" fill="currentColor" stroke="none" />
  </svg>
);

export const IconBelt = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}>
    <circle cx="12" cy="12" r="2.1" fill="currentColor" stroke="none" />
    <path d="M12 4.6a7.4 7.4 0 0 1 7.4 7.4" />
    <path d="M12 19.4a7.4 7.4 0 0 1-7.4-7.4" />
    <circle cx="18.1" cy="6.6" r="1" fill="currentColor" stroke="none" />
    <circle cx="5.6" cy="17.1" r="1" fill="currentColor" stroke="none" />
    <circle cx="19.7" cy="14.8" r="0.7" fill="currentColor" stroke="none" />
    <circle cx="4.6" cy="9.3" r="0.7" fill="currentColor" stroke="none" />
  </svg>
);
