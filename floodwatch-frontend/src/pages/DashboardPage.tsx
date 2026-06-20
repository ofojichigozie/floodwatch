import { useMemo, useEffect } from 'react';
import { Droplets, CloudRain, Activity, Database, RefreshCw } from 'lucide-react';
import { useReadings } from '../hooks/useReadings';
import { useSocket } from '../hooks/useSocket';
import { requestBrowserNotificationPermission } from '../utils/notifications';
import { StatCard } from '../components/StatCard';
import { ReadingsChart } from '../components/ReadingsChart';
import { ReadingsTable } from '../components/ReadingsTable';
import { AlertBanner, SystemStatus } from '../components/AlertBanner';
import { AppLayout } from '../components/AppLayout';
import { Reading } from '../types';
import { formatRainPercent } from '../utils/readings';

const DashboardPage = () => {
  const { readings, loading, deleteReading, addReading, refetch } = useReadings();

  // Request browser notification permission on mount
  useEffect(() => {
    requestBrowserNotificationPermission();
  }, []);

  // Live socket
  useSocket(addReading);

  const latest = readings[0] ?? null;

  const stats = useMemo(() => {
    if (readings.length === 0) return { avgWater: 0, avgRain: 0, highCount: 0 };
    const avgWater = readings.reduce((s, r) => s + r.waterLevelCm, 0) / readings.length;
    const avgRain = readings.reduce((s, r) => s + r.rainIntensity, 0) / readings.length;
    const highCount = readings.filter((r) => r.floodRisk === 'high').length;
    return { avgWater, avgRain, highCount };
  }, [readings]);

  const riskColor = (risk: Reading['floodRisk'] | null) => {
    if (risk === 'high') return 'text-red-600';
    if (risk === 'moderate') return 'text-amber-600';
    return 'text-emerald-600';
  };

  return (
    <AppLayout>
      <div className="px-6 py-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-800">Dashboard</h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {readings.length > 0
                ? `Last reading ${new Date(latest?.timestamp ?? '').toLocaleString()}`
                : 'Waiting for sensor data...'}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <SystemStatus connected={true} />
            <button
              onClick={refetch}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 bg-white border border-slate-200 px-3 py-1.5 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <RefreshCw size={14} />
              Refresh
            </button>
          </div>
        </div>

        {/* Alert banner */}
        <AlertBanner risk={latest?.floodRisk ?? null} location={latest?.location} />

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Readings"
            value={readings.length}
            icon={<Database size={20} />}
            sub="All time"
            accent="slate"
          />
          <StatCard
            label="Current Risk"
            value={
              latest ? (
                <span className={riskColor(latest.floodRisk)}>
                  {latest.floodRisk.charAt(0).toUpperCase() + latest.floodRisk.slice(1)}
                </span>
              ) : (
                '—'
              )
            }
            icon={<Activity size={20} />}
            sub={latest ? `${(latest.riskConfidence * 100).toFixed(0)}% confidence` : 'No data'}
            accent={
              latest?.floodRisk === 'high'
                ? 'red'
                : latest?.floodRisk === 'moderate'
                  ? 'amber'
                  : 'teal'
            }
          />
          <StatCard
            label="Avg Water Level"
            value={`${stats.avgWater.toFixed(1)} cm`}
            icon={<Droplets size={20} />}
            sub={latest ? `Container: ${latest.containerHeightCm} cm` : ''}
            accent="teal"
          />
          <StatCard
            label="Avg Rain Intensity"
            value={formatRainPercent(stats.avgRain)}
            icon={<CloudRain size={20} />}
            sub="0–100%"
            accent="amber"
          />
        </div>

        {/* Chart */}
        <ReadingsChart readings={readings} />

        {/* Table */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-slate-800">All Readings</h2>
            {stats.highCount > 0 && (
              <span className="text-xs bg-red-100 text-red-700 font-medium px-2.5 py-1 rounded-full">
                {stats.highCount} high risk {stats.highCount === 1 ? 'event' : 'events'}
              </span>
            )}
          </div>
          {loading ? (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
              <div className="inline-block h-6 w-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-slate-400 text-sm mt-3">Loading readings...</p>
            </div>
          ) : (
            <ReadingsTable readings={readings} onDelete={deleteReading} />
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
