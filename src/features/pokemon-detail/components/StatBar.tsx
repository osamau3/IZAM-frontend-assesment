import { memo, useMemo } from 'react';
import './StatBar.css';

interface StatBarProps {
  label: string;
  value: number;
  maxValue?: number;
}

/**
 * Stat progress bar for the detail page.
 *
 * Why max 255: The PokéAPI documents 255 as the theoretical maximum
 * base stat value, making it the correct denominator for visual
 * proportion.
 */

const STAT_LABELS: Record<string, string> = {
  'hp': 'HP',
  'attack': 'Attack',
  'defense': 'Defense',
  'special-attack': 'Sp. Attack',
  'special-defense': 'Sp. Defense',
  'speed': 'Speed',
};

/**
 * Why React.memo + useMemo: StatBar renders 6 times per detail page.
 * Memoizing prevents re-computation of the percentage and display
 * label when the parent re-renders but stat values haven't changed.
 */
function StatBarInner({ label, value, maxValue = 255 }: StatBarProps) {
  const { percentage, displayLabel } = useMemo(() => ({
    percentage: Math.min((value / maxValue) * 100, 100),
    displayLabel: STAT_LABELS[label] || label,
  }), [label, value, maxValue]);

  return (
    <div className="stat-bar" id={`stat-${label}`}>
      <span className="stat-bar__label">{displayLabel}</span>
      <div className="stat-bar__track">
        <div
          className="stat-bar__fill"
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={maxValue}
          aria-label={`${displayLabel}: ${value}`}
        />
      </div>
      <span className="stat-bar__value">{value}</span>
    </div>
  );
}

export const StatBar = memo(StatBarInner);
