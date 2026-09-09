// Hand-drawn circles: slightly wobbly, non-closing paths so they read as pencil
// rather than a perfect vector ring.
const CIRCLES: Record<string, string[]> = {
  // One loose pass with a small overshoot where the stroke closes.
  single: [
    "M62 20 C88 19 106 40 105 62 C104 85 84 104 60 104 C36 104 17 85 18 61 C19 38 38 20 63 19 C70 19 76 20 81 22",
  ],
  // Two passes, as if gone round twice.
  double: [
    "M60 19 C86 18 105 39 104 62 C103 86 83 104 59 104 C35 104 16 84 18 60 C20 37 39 19 62 19",
    "M70 23 C92 29 101 47 100 64 C98 87 79 100 58 99 C36 98 21 81 22 60 C23 43 33 30 48 24",
  ],
  // Deliberately open loop, like a quick marker circle.
  open: [
    "M84 27 C67 17 42 21 29 38 C15 57 21 84 43 96 C66 108 95 97 102 74 C107 57 101 39 86 30",
  ],
};

export function SketchPlus({
  variant = "single",
  className = "",
}: {
  variant?: keyof typeof CIRCLES;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 122 122" fill="none" className={className} aria-hidden="true">
      {CIRCLES[variant].map((d, i) => (
        <path
          key={i}
          d={d}
          stroke="currentColor"
          strokeWidth={i === 0 ? 4 : 2.6}
          strokeLinecap="round"
          opacity={i === 0 ? 1 : 0.55}
        />
      ))}
      <path
        d="M61 43 C61 55 61 68 61 80"
        stroke="currentColor"
        strokeWidth={4}
        strokeLinecap="round"
      />
      <path
        d="M42 61 C54 61 68 61 80 61"
        stroke="currentColor"
        strokeWidth={4}
        strokeLinecap="round"
      />
    </svg>
  );
}
