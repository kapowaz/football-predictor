import { ResponsiveContainer, LineChart, Line, Tooltip, YAxis } from 'recharts';
import type { TooltipPayload } from 'recharts';
import { colorSuccess, colorDanger, colorNeutral } from '../../theme.css';
import type { PositionTrend } from '../../utils/positionHistory';
import * as styles from './Sparkline.css';

const SPARKLINE_WIDTH = 152;

const trendStrokeColor: Record<PositionTrend, string> = {
  positive: colorSuccess,
  negative: colorDanger,
  stable: colorNeutral,
};

const getOrdinal = (n: number): string => {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`;
  switch (n % 10) {
    case 1: return `${n}st`;
    case 2: return `${n}nd`;
    case 3: return `${n}rd`;
    default: return `${n}th`;
  }
};

interface PositionTooltipProps {
  active?: boolean;
  payload?: TooltipPayload;
}

const PositionTooltip = ({ active, payload }: PositionTooltipProps) => {
  const value = payload?.[0]?.value;
  if (!active || typeof value !== 'number') return null;
  return (
    <div className={styles.tooltip}>
      {getOrdinal(value)}
    </div>
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

  return (
    <div className={styles.container}>
      <ResponsiveContainer width={SPARKLINE_WIDTH} height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 2, right: 2, bottom: 2, left: 2 }}
        >
          <YAxis domain={[1, teamCount]} reversed hide />
          <Tooltip
            content={<PositionTooltip />}
            cursor={false}
            allowEscapeViewBox={{ x: true, y: true }}
          />
          <Line
            type="monotone"
            dataKey="position"
            stroke={trendStrokeColor[trend]}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 3, strokeWidth: 0 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
