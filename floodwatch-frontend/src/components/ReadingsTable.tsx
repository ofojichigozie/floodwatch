import { useState } from 'react';
import { Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Reading } from '../types';
import { formatRainPercent } from '../utils/readings';
import { RiskBadge } from './RiskBadge';

interface Props {
  readings: Reading[];
  onDelete: (id: string) => void;
}

const PAGE_SIZE = 10;

export const ReadingsTable = ({ readings, onDelete }: Props) => {
  const [page, setPage] = useState(1);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const totalPages = Math.max(1, Math.ceil(readings.length / PAGE_SIZE));
  const paginated = readings.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = (id: string) => {
    if (confirmId === id) {
      onDelete(id);
      setConfirmId(null);
    } else {
      setConfirmId(id);
      setTimeout(() => setConfirmId(null), 3000);
    }
  };

  if (readings.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
        <p className="text-slate-400 text-sm">No readings yet. Waiting for sensor data...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Location
              </th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Risk
              </th>
              <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Water Level
              </th>
              <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Rain
              </th>
              <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Confidence
              </th>
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                Time
              </th>
              <th className="px-5 py-3.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {paginated.map((r) => (
              <tr key={r._id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3.5 font-medium text-slate-700">{r.location}</td>
                <td className="px-5 py-3.5">
                  <RiskBadge risk={r.floodRisk} size="sm" />
                </td>
                <td className="px-5 py-3.5 text-right text-slate-600">
                  {r.waterLevelCm.toFixed(1)}{' '}
                  <span className="text-slate-400">/ {r.containerHeightCm} cm</span>
                </td>
                <td className="px-5 py-3.5 text-right text-slate-600">
                  {formatRainPercent(r.rainIntensity)}
                </td>
                <td className="px-5 py-3.5 text-right">
                  <span
                    className={`font-semibold ${
                      r.riskConfidence >= 0.8 ? 'text-slate-800' : 'text-slate-500'
                    }`}
                  >
                    {(r.riskConfidence * 100).toFixed(0)}%
                  </span>
                </td>
                <td className="px-5 py-3.5 text-slate-400 whitespace-nowrap">
                  {new Date(r.timestamp).toLocaleString()}
                </td>
                <td className="px-5 py-3.5">
                  <button
                    onClick={() => handleDelete(r._id)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      confirmId === r._id
                        ? 'bg-red-100 text-red-600'
                        : 'text-slate-300 hover:text-red-500 hover:bg-red-50'
                    }`}
                    title={confirmId === r._id ? 'Click again to confirm' : 'Delete reading'}
                  >
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100">
          <p className="text-xs text-slate-400">
            {readings.length} readings · Page {page} of {totalPages}
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
