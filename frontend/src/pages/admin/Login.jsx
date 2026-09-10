import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [showPass, setShowPass]   = useState(false);
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);
  const { login }                 = useAuth();
  const navigate                  = useNavigate();

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const interval = setInterval(() => {
      setLockoutSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutSeconds]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (lockoutSeconds > 0) return;

    setError('');
    setLoading(true);

    try {
      await login(email, password);
      setFailedAttempts(0);
      navigate('/admin/dashboard');
    } catch (err) {
      const nextFailures = failedAttempts + 1;
      setFailedAttempts(nextFailures);

      if (nextFailures >= 5) {
        setLockoutSeconds(60);
        setError('Too many failed attempts. Login locked for 60 seconds.');
      } else {
        setError(err?.message || 'Unable to sign in with those credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const isLocked = lockoutSeconds > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal via-charcoal-soft to-[#1a1a2e] flex items-center justify-center px-4">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-spice/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-[0_24px_80px_rgba(0,0,0,0.5)]">

          {/* Logo mark */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-orange-gradient flex items-center justify-center shadow-glow mb-4">
              <Lock size={22} className="text-white" />
            </div>
            <h1 className="font-display text-2xl font-bold text-white">Admin Login</h1>
            <p className="font-body text-sm text-white/40 mt-1">Idli Junction · Secure Portal</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 flex items-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl font-body text-sm">
              <AlertCircle size={16} className="flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="relative">
              <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                id="login-email"
                type="email"
                required
                autoComplete="username"
                disabled={isLocked || loading}
                placeholder="Email address"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-white/8 border border-white/10 text-white placeholder-white/30 font-body text-sm
                           pl-10 pr-4 py-3.5 rounded-xl outline-none transition-all duration-200
                           focus:border-spice/60 focus:ring-2 focus:ring-spice/20 focus:bg-white/10 disabled:opacity-50"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                id="login-password"
                type={showPass ? 'text' : 'password'}
                required
                autoComplete="current-password"
                disabled={isLocked || loading}
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-white/8 border border-white/10 text-white placeholder-white/30 font-body text-sm
                           pl-10 pr-12 py-3.5 rounded-xl outline-none transition-all duration-200
                           focus:border-spice/60 focus:ring-2 focus:ring-spice/20 focus:bg-white/10 disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                disabled={isLocked || loading}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors"
                aria-label={showPass ? 'Hide password' : 'Show password'}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLocked || loading}
              className="w-full btn-primary justify-center py-4 rounded-xl shadow-glow mt-2 disabled:opacity-50 transition-all"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating…
                </span>
              ) : isLocked ? (
                `Locked (${lockoutSeconds}s)`
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="font-body text-center text-xs text-white/25 mt-6">
            Authorized access only. All actions are logged.
          </p>
        </div>
      </div>
    </div>
  );
}
