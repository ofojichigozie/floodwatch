import { ReactNode } from 'react';

interface Props {
  label: string;
  value: string | number | ReactNode;
  icon: ReactNode;
  sub?: string;
  accent?: 'teal' | 'amber' | 'red' | 'slate';
}

const accents = {
  teal: 'bg-cyan-50 text-cyan-600',
  amber: 'bg-amber-50 text-amber-600',
  red: 'bg-red-50 text-red-600',
  slate: 'bg-slate-100 text-slate-600',
};

export const StatCard = ({ label, value, icon, sub, accent = 'teal' }: Props) => (
  <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm flex flex-col gap-3">
    {/* Icon row */}
    <div className={`self-start p-2.5 rounded-xl ${accents[accent]}`}>{icon}</div>
    {/* Text block — always full width */}
    <div>
      <p className="text-xs text-slate-500 font-medium leading-snug">{label}</p>
      <p className="text-2xl font-bold text-slate-800 mt-0.5 leading-tight">{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-1 leading-snug">{sub}</p>}
    </div>
  </div>
);
