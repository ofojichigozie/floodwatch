import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { Reading } from '../types';

interface Props {
  readings: Reading[];
}

export const ReadingsChart = ({ readings }: Props) => {
  const data = [...readings]
    .reverse()
    .slice(-20)
    .map((r) => ({
      time: new Date(r.timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      waterLevel: parseFloat(r.waterLevelCm.toFixed(1)),
      rainIntensity: parseFloat((r.rainIntensity / 10.23).toFixed(1)), // normalize to 0-100
    }));

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8 flex items-center justify-center">
        <p className="text-slate-400 text-sm">No data to chart yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-semibold text-slate-800">Sensor Readings</h3>
          <p className="text-xs text-slate-400 mt-0.5">Last {data.length} readings</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0891B2" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#0891B2" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="time"
            tick={{ fontSize: 11, fill: '#94a3b8' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              background: '#fff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              fontSize: '12px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)',
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: '12px', paddingTop: '12px' }}
            formatter={(val) => (val === 'waterLevel' ? 'Water Level (cm)' : 'Rain Intensity (%)')}
          />
          <Area
            type="monotone"
            dataKey="waterLevel"
            stroke="#0891B2"
            strokeWidth={2}
            fill="url(#waterGradient)"
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
          <Area
            type="monotone"
            dataKey="rainIntensity"
            stroke="#F59E0B"
            strokeWidth={2}
            fill="url(#rainGradient)"
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
