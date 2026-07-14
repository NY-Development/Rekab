import { memo } from 'react';

interface Node {
  x: number;
  y: number;
}

// Percent-based coordinates so the lines scale with the container.
const NODES: Node[] = [
  { x: 8, y: 20 },
  { x: 90, y: 15 },
  { x: 12, y: 78 },
  { x: 85, y: 82 },
  { x: 50, y: 50 },
];

const CONNECTIONS: [number, number][] = [
  [0, 4],
  [1, 4],
  [2, 4],
  [3, 4],
];

/**
 * Faint animated lines linking the floating nodes, evoking a data/network
 * graph. Pure SVG with a dash-offset keyframe animation — cheap to render
 * and easy to disable for reduced motion via the `animate` prop.
 */
function NetworkConnectionsImpl({ animate = true, className }: { animate?: boolean; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={`absolute inset-0 size-full ${className ?? ''}`}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      {CONNECTIONS.map(([fromIdx, toIdx], i) => {
        const from = NODES[fromIdx];
        const to = NODES[toIdx];
        return (
          <line
            key={i}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke="currentColor"
            strokeWidth="0.15"
            strokeDasharray="1.5 2"
            className={animate ? 'text-primary-foreground/40 animate-[dash_6s_linear_infinite]' : 'text-primary-foreground/25'}
          />
        );
      })}
    </svg>
  );
}

export const NetworkConnections = memo(NetworkConnectionsImpl);
