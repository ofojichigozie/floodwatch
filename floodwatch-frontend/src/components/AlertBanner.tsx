import { AlertTriangle, ShieldAlert, CheckCircle, X } from 'lucide-react';
import { useState } from 'react';
import type { Reading } from '../types';

interface Props {
  risk: Reading['floodRisk'] | null;
  location?: string;
}

export const AlertBanner = ({ risk, location }: Props) => {
  const [dismissed, setDismissed] = useState(false);

  if (!risk || risk === 'low' || dismissed) return null;

  const isHigh = risk === 'high';

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-2xl border ${
        isHigh
          ? 'bg-red-50 border-red-200 text-red-800'
          : 'bg-amber-50 border-amber-200 text-amber-800'
      }`}
    >
      <div className="mt-0.5">
        {isHigh ? (
          <ShieldAlert size={20} className="text-red-500" />
        ) : (
          <AlertTriangle size={20} className="text-amber-500" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm">
          {isHigh ? 'High Flood Risk Detected' : 'Moderate Flood Risk'}
        </p>
        <p className="text-sm mt-0.5 opacity-80">
          {isHigh
            ? `Dangerous water levels at ${location ?? 'sensor location'}. Immediate action may be required.`
            : `Rising water levels detected at ${location ?? 'sensor location'}. Monitor the situation closely.`}
        </p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="opacity-50 hover:opacity-100 transition-opacity mt-0.5"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export const SystemStatus = ({ connected }: { connected: boolean }) => (
  <div
    className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full ${
      connected ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
    }`}
  >
    <span
      className={`h-1.5 w-1.5 rounded-full ${
        connected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
      }`}
    />
    {connected ? 'Live' : 'Offline'}
  </div>
);

export const EmptyReadings = () => (
  <div className="flex items-center gap-2 text-sm text-slate-400">
    <CheckCircle size={15} className="text-slate-300" />
    All clear — no active alerts
  </div>
);
