import { useState, FormEvent } from 'react';
import { Droplets, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useLogin } from '../hooks/useLogin';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { submit, loading } = useLogin();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    submit(email, password);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex w-[420px] flex-shrink-0 bg-[#0C1A2E] flex-col items-center justify-center px-12 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-cyan-400 to-teal-400" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-cyan-500/5" />
        <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-cyan-500/5" />

        <div className="relative z-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-500/15 rounded-2xl mb-6">
            <Droplets size={32} className="text-cyan-400" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">FloodWatch</h1>
          <p className="text-cyan-400/70 mt-2 text-sm leading-relaxed max-w-xs">
            Real-time IoT flood detection and risk monitoring system
          </p>

          <div className="mt-10 space-y-3 text-left">
            {[
              { label: 'Live sensor data', sub: 'Rain & ultrasonic readings' },
              { label: 'AI risk analysis', sub: 'Random Forest prediction model' },
              { label: 'Instant alerts', sub: 'WebSocket real-time updates' },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-3 bg-white/5 rounded-xl px-4 py-3"
              >
                <div className="mt-0.5 h-2 w-2 rounded-full bg-cyan-500 flex-shrink-0" />
                <div>
                  <p className="text-white text-sm font-medium">{item.label}</p>
                  <p className="text-cyan-400/60 text-xs mt-0.5">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <Droplets size={24} className="text-cyan-600" />
            <span className="font-bold text-slate-800 text-lg">FloodWatch</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800">Welcome back</h2>
            <p className="text-slate-500 text-sm mt-1">Sign in to your admin account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@floodwatch.io"
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-colors bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-2.5 pr-11 rounded-xl border border-slate-200 text-slate-800 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition-colors bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !email || !password}
              className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-300 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors mt-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-8">FloodWatch Admin Portal</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
