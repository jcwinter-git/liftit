// Body-part glyphs from the hugeicons free set (MIT), inlined so the app
// doesn't pull in a full icon-data package for seven icons.

type IconProps = { className?: string };

function Svg({ className, children }: IconProps & { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      {children}
    </svg>
  );
}

const stroke = {
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  strokeWidth: 1.5,
} as const;

export function ArmsIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path
        {...stroke}
        d="M2.018 20.305c1.129 1.615 6.041 2.882 8.362-.14c2.51 1.2 6.649.828 10.02-1.052c.468-.26.911-.59 1.183-1.054c.613-1.045.627-2.495-.491-4.634c-1.865-4.654-5.218-8.74-6.572-10.383c-.278-.253-2.051-.613-3.133-.96c-.478-.147-1.367-.245-2.43 1.157c-.505.664-2.796 2.297.11 3.394c.451.115.782.326 2.837-.049c.267-.046.935 0 1.406.826l.984 1.407a.96.96 0 0 1 .169.44c.172 1.499.166 3.375 1.002 4.326c-1.29-.934-4.664-2.042-7.206 1.112M2.002 12.94a6.714 6.714 0 0 1 8.416-.418"
      />
    </Svg>
  );
}

export function BackIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <g {...stroke}>
        <path d="M15.5 10A1.5 1.5 0 0 1 14 8.5M8.5 10A1.5 1.5 0 0 0 10 8.5M14 2v.643c0 .587 0 .88.065 1.13a2 2 0 0 0 1.16 1.336c.237.1.527.141 1.108.224c1.162.166 1.743.25 2.218.45a4 4 0 0 1 2.318 2.672C21 8.954 21 9.54 21 10.714V22M10 2v.643c0 .587 0 .88-.065 1.13a2 2 0 0 1-1.16 1.336c-.237.1-.527.141-1.108.224c-1.162.166-1.743.25-2.218.45A4 4 0 0 0 3.13 8.454C3 8.954 3 9.54 3 10.714V22m9-9v9" />
        <path d="M18 11.5s-.545 2.864-.497 5.727C17.535 19.127 18 22 18 22M6 11.5s.545 2.864.497 5.727C6.465 19.127 6 22 6 22" />
      </g>
    </Svg>
  );
}

export function ChestIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <g stroke="currentColor" strokeLinecap="round" strokeWidth={1.5}>
        <path
          strokeLinejoin="round"
          d="M7.978 11c.41.206.737.562.996.995m0 0c.996 1.67.996 4.505.996 4.505c0 3.5-1.784 4.5-3.985 4.5C4.99 21 2 20.5 2 16C2 9.5 5.487 5 8.476 5c2.39 0 1.496 5 .498 6.995M16.022 11c-.412.206-.738.562-.997.995m0 0c-.996 1.67-.996 4.505-.996 4.505c0 3.5 1.784 4.5 3.985 4.5c.997 0 3.986-.5 3.986-5c0-6.5-3.487-11-6.477-11c-2.391 0-1.493 5-.498 6.995"
        />
        <path d="m14 7l-2-1.333m0 0L10 7m2-1.333V3" />
      </g>
    </Svg>
  );
}

export function ShouldersIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path
        {...stroke}
        d="m17 7l2 .5m-11 10s-3-1.5-3-5s2.5-5 7-6.5c3-1 5-2 5-4M6 16s-.5 1.385-.5 3.23C5.5 20.616 6 22 6 22m6-7l.813 1.219A4 4 0 0 0 16.14 18H19m-1-3v.01m-5 1.49V22"
      />
    </Svg>
  );
}

export function LegsIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <g {...stroke}>
        <path d="M5.002 2c2.691.314 8.897 1.896 11.64 5.746c.337.47.69.804 1.27.95c.724.18 1.324.666 1.542 1.4c.232.798.66 1.64.524 2.494c-.052.327-.212.628-.532 1.23L15.099 22" />
        <path d="M4.002 12c1 1.726 4.164 2.596 8 1.726a10.1 10.1 0 0 0-2.685 2.225c-.559.646-.797 1.544-.836 2.452c-.052 1.212-.232 2.53-.854 3.597M5.002 7s1.959.29 3.5 1.5c1 .786 2.916 1.31 3.5 1.5" />
      </g>
    </Svg>
  );
}

export function AbsIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <path
        {...stroke}
        d="M22 6c0 1-1 3-5 3s-5-2-5-3c0 1-1 3-5 3S2 7 2 6m8-2.5C9.667 3 8.5 2 7 2m7 1.5C14.333 3 15.5 2 17 2M4 9v1c0 1.32.266 2.62.56 3.9c.54 2.346.81 5.68-.56 8.1M20 9v1c0 1.32-.266 2.62-.56 3.9c-.54 2.346-.81 5.68.56 8.1m-4-3c-1.485 1.179-2.356 1.369-3.677.282a.54.54 0 0 0-.664-.021C10.264 20.28 9.4 20.29 8 19m8-5c-1.485 1.179-2.356 1.369-3.677.282a.54.54 0 0 0-.664-.021C10.264 15.28 9.4 15.29 8 14m4 0v-2"
      />
    </Svg>
  );
}

export function OtherIcon({ className }: IconProps) {
  return (
    <Svg className={className}>
      <g stroke="currentColor" strokeWidth={1.5}>
        <path d="M16 4.5a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0Z" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m5 12l1.476-2.326c.26-.41.391-.616.562-.783c.17-.167.374-.29.782-.534l.922-.553c.862-.518 1.293-.777 1.77-.802s.93.187 1.839.61l1.695.792c.373.174.56.26.723.383q.174.13.318.295c.135.156.24.34.45.708c.37.647.555.97.816 1.199c.184.16.394.285.62.368c.32.118.68.118 1.398.118H19"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m6.5 21l2.636-2.307a2 2 0 0 0 .31-2.667L8 14l3.5-6.5M8 14h3.5m5.5 4l-2.4-3.2A2 2 0 0 0 13 14h-1.5m0 0L15 9"
        />
      </g>
    </Svg>
  );
}
