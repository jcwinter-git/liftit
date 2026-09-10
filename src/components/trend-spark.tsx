// Wordless "your numbers" mark: a solid zigzag bolt striking up and to the
// right. Drawn as one filled shape rather than a stroke so it holds its weight
// against the black new-workout block below it.
export function TrendSpark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 20" className={className} aria-hidden="true">
      <path
        d="M2.5 17.5 L10.85 4.98 L17.44 11.27 L24.13 4.55 L22.69 3.16 L28.41 2.31 L27.71 8.04 L26.27 6.65 L17.56 15.73 L11.15 10.02 Z"
        fill="currentColor"
      />
    </svg>
  );
}
