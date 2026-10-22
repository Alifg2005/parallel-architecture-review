const LANES = [70, 130, 190, 250];
// Task blocks per lane: [start x, width]. Deliberately uneven, like real load imbalance.
const TASKS: [number, number][][] = [
  [[150, 70], [240, 44]],
  [[150, 110]],
  [[150, 52], [214, 60]],
  [[150, 92]],
];
const BARRIER_X = 300;

/**
 * Hero illustration of the fork–join model: one master thread forks a team, works, hits a barrier, joins.
 * Animated with CSS (see .lane-draw / .lane-pop in index.css) so it is fully visible even without JS timing,
 * and static under prefers-reduced-motion.
 */
export function ThreadLanes() {
  return (
    <svg viewBox="0 0 480 320" className="h-auto w-full" role="img" aria-labelledby="lanes-title lanes-desc">
      <title id="lanes-title">Fork–join execution</title>
      <desc id="lanes-desc">
        A master thread forks into four threads that each run tasks of different lengths, wait at a barrier, and join
        back into the master thread.
      </desc>

      <g fill="none" strokeLinecap="round" className="stroke-line-strong" strokeWidth="2">
        <path d="M24 160 H96" pathLength={1} className="lane-draw" />
        {LANES.map((y, i) => (
          <path
            key={y}
            d={`M96 160 C122 160 112 ${y} 138 ${y} H360 C386 ${y} 376 160 404 160`}
            pathLength={1}
            className="lane-draw"
            style={{ animationDelay: `${150 + i * 60}ms` }}
          />
        ))}
        <path d="M404 160 H456" pathLength={1} className="lane-draw" style={{ animationDelay: '600ms' }} />
      </g>

      <line
        x1={BARRIER_X}
        x2={BARRIER_X}
        y1="44"
        y2="276"
        strokeDasharray="4 6"
        strokeWidth="1.5"
        className="lane-pop stroke-warm"
        style={{ animationDelay: '900ms' }}
      />
      <text x={BARRIER_X} y="34" textAnchor="middle" className="fill-warm font-mono text-[11px]">
        barrier
      </text>

      {TASKS.map((tasks, lane) =>
        tasks.map(([x, w], t) => (
          <rect
            key={`${lane}-${t}`}
            x={x}
            y={(LANES[lane] ?? 0) - 11}
            width={w}
            height="22"
            rx="7"
            strokeWidth="1.5"
            className="lane-pop fill-accent-soft stroke-accent"
            style={{ animationDelay: `${450 + lane * 80 + t * 120}ms` }}
          />
        )),
      )}

      {LANES.map((y, i) => (
        <text key={y} x="352" y={y - 16} textAnchor="end" className="fill-muted font-mono text-[10px]">
          T{i}
        </text>
      ))}

      <circle cx="96" cy="160" r="6" className="fill-accent" />
      <circle cx="404" cy="160" r="6" className="fill-accent" />
      <text x="96" y="186" textAnchor="middle" className="fill-ink-2 font-mono text-[11px]">
        fork
      </text>
      <text x="404" y="186" textAnchor="middle" className="fill-ink-2 font-mono text-[11px]">
        join
      </text>
      <text x="24" y="146" className="fill-muted font-mono text-[10px]">
        master
      </text>
    </svg>
  );
}
