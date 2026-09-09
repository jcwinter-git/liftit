// Wordless "your numbers" mark: a line stepping up and to the right.
export function TrendSpark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 20" fill="none" className={className} aria-hidden="true">
      <path
        d="M3 16 L11 11 L18 13.5 L29 4"
        stroke="currentColor"
        strokeWidth={2.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M23 4 L29 4 L29 10"
        stroke="currentColor"
        strokeWidth={2.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
