import type { Reading } from '../types';

interface Props {
  risk: Reading['floodRisk'];
  size?: 'sm' | 'md' | 'lg';
}

const config = {
  low: { label: 'Low Risk', className: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  moderate: { label: 'Moderate Risk', className: 'bg-amber-100 text-amber-700 border-amber-200' },
  high: { label: 'High Risk', className: 'bg-red-100 text-red-700 border-red-200' },
};

const sizes = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-3 py-1',
  lg: 'text-base px-4 py-1.5 font-semibold',
};

export const RiskBadge = ({ risk, size = 'md' }: Props) => {
  const { label, className } = config[risk];
  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${className} ${sizes[size]}`}
    >
      <span
        className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
          risk === 'low' ? 'bg-emerald-500' : risk === 'moderate' ? 'bg-amber-500' : 'bg-red-500'
        }`}
      />
      {label}
    </span>
  );
};
