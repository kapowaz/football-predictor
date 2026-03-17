import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ResponsiveContainer, AreaChart, Area, Tooltip, YAxis } from 'recharts';
import type { TooltipPayload } from 'recharts';
import { colorSuccess, colorDanger, colorNeutral } from '../../theme.css';
import type { PositionTrend } from '../../utils/positionHistory';
import * as styles from './Sparkline.css';

const SPARKLINE_WIDTH = 152;
const TOOLTIP_DEBOUNCE_MS = 120;
const TOOLTIP_OFFSET_Y = 8;

const trendStrokeColor: Record<PositionTrend, string> = {
  positive: colorSuccess,
  negative: colorDanger,
  stable: colorNeutral,
};

const getOrdinal = (n: number): string => {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`;
  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
};

interface PositionTooltipProps {
  active?: boolean;
  payload?: TooltipPayload;
  coordinate?: { x: number; y: number };
  visible?: boolean;
  svgRect?: DOMRect | null;
}

const PositionTooltip = ({
  active,
  payload,
  coordinate,
  visible,
  svgRect,
}: PositionTooltipProps) => {
  const value = payload?.[0]?.value;
  if (!visible || !active || typeof value !== 'number' || !coordinate || !svgRect) {
    return null;
  }

  return createPortal(
    <div
      className={styles.tooltip}
      style={{
        position: 'fixed',
        left: svgRect.left + coordinate.x,
        top: svgRect.top + coordinate.y - TOOLTIP_OFFSET_Y,
        transform: 'translate(-50%, -100%)',
        pointerEvents: 'none',
        zIndex: 10000,
      }}
    >
      {getOrdinal(value)}
    </div>,
    document.body,
  );
};

interface SparklineProps {
  /** Array of 1-based league positions (lower = better). */
  data: number[];
  /** Total number of teams in the competition (Y-axis domain max). */
  teamCount: number;
  /** Overall trend direction, determines stroke colour. */
  trend: PositionTrend;
}

export const Sparkline = ({ data, teamCount, trend }: SparklineProps) => {
  const chartData = data.map((position) => ({ position }));
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [svgRect, setSvgRect] = useState<DOMRect | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (hovered) {
      timerRef.current = setTimeout(() => setTooltipVisible(true), TOOLTIP_DEBOUNCE_MS);
      return () => clearTimeout(timerRef.current);
    }
  }, [hovered]);

  const strokeColor = trendStrokeColor[trend];
  const instanceId = useId();
  const strokeGradientId = `sparklineStroke-${instanceId}`;
  const fillGradientId = `sparklineFill-${instanceId}`;

  return (
    <div
      ref={containerRef}
      className={styles.container}
      onMouseEnter={() => {
        setHovered(true);
        const svg = containerRef.current?.querySelector('svg');
        if (svg) setSvgRect(svg.getBoundingClientRect());
      }}
      onMouseLeave={() => {
        setHovered(false);
        setTooltipVisible(false);
        setSvgRect(null);
      }}
    >
      <ResponsiveContainer width={SPARKLINE_WIDTH} height="100%">
        <AreaChart data={chartData} margin={{ top: 2, right: 12, bottom: 2, left: 12 }}>
          <defs>
            <linearGradient
              id={strokeGradientId}
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1="0"
              x2={SPARKLINE_WIDTH}
              y2="0"
            >
              <stop offset="0%" stopColor={strokeColor} stopOpacity={0.1} />
              <stop offset="100%" stopColor={strokeColor} stopOpacity={1} />
            </linearGradient>
            <linearGradient id={fillGradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity={0.3} />
              <stop offset="100%" stopColor={strokeColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <YAxis domain={[1, teamCount]} reversed hide />
          <Tooltip
            content={<PositionTooltip svgRect={svgRect} visible={tooltipVisible} />}
            cursor={false}
            isAnimationActive={false}
            allowEscapeViewBox={{ x: true, y: true }}
          />
          <Area
            type="linear"
            dataKey="position"
            baseValue={teamCount}
            stroke={`url(#${strokeGradientId})`}
            fill={`url(#${fillGradientId})`}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            dot={false}
            activeDot={{ r: 3, strokeWidth: 0 }}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
