import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { navigateToPath } from '../../lib/browserRouting';

function getNextPath(search: string) {
  const params = new URLSearchParams(search);
  const next = params.get('next');
  return next && next.startsWith('/admin') ? next : '/admin/dashboard';
}

export const AdminLoginPage: React.FC<{ search: string }> = ({ search }) => {
  const { login, adminUser } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nextPath = useMemo(() => getNextPath(search), [search]);

  useEffect(() => {
    if (adminUser) {
      navigateToPath(nextPath, { replace: true });
    }
  }, [adminUser, nextPath]);

  const emailError =
    email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'Enter a valid admin email address.' : '';
  const passwordError =
    password.length > 0 && password.length < 8 ? 'Password must be at least 8 characters.' : '';
  const formError = error || emailError || passwordError;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!email || !password || emailError || passwordError) {
      setError('Enter a valid email address and password to continue.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await login({
        email,
        password,
        rememberMe,
      });
      setSuccess(true);
      window.setTimeout(() => {
        navigateToPath(nextPath, { replace: true });
      }, 450);
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : 'Unable to sign in right now.';
      setError(message);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(96,165,250,0.25),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(236,72,153,0.22),_transparent_28%),linear-gradient(160deg,_#020617_0%,_#111827_48%,_#020617_100%)]" />
      <motion.div
        className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl"
        animate={{ y: [0, -24, 0], x: [0, 18, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute right-0 top-0 h-80 w-80 rounded-full bg-sky-500/10 blur-3xl"
        animate={{ y: [0, 28, 0], x: [0, -20, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-10 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-violet-500/10 blur-3xl"
        animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-12 sm:px-6">
        <div className="grid w-full items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="hidden lg:block"
          >
            <div className="max-w-xl space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.28em] text-sky-100/90 backdrop-blur">
                <ShieldCheck className="h-4 w-4 text-pink-300" />
                Private Admin Access
              </div>

              <div className="space-y-4">
                <h1 className="font-serif text-5xl font-black leading-tight text-white">
                  Akshvik Tiny Trends
                  <span className="block bg-gradient-to-r from-sky-300 via-white to-pink-300 bg-clip-text text-transparent">
                    Admin Control Center
                  </span>
                </h1>
                <p className="max-w-lg text-sm leading-7 text-slate-300">
                  Secure operational access for store leadership. Sessions are validated server-side,
                  protected by HTTP-only cookies, and limited by role-based permissions.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  'Protected routes and server-validated sessions',
                  'Encrypted credentials managed by Firebase Authentication',
                  'Firestore updates restricted to verified admin operations',
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-3xl border border-white/10 bg-white/5 p-4 text-xs leading-6 text-slate-200 shadow-2xl shadow-slate-950/20 backdrop-blur-xl"
                  >
                    <Sparkles className="mb-3 h-4 w-4 text-pink-300" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mx-auto w-full max-w-md"
          >
            <div className="rounded-[2rem] border border-white/10 bg-white/8 p-6 shadow-[0_24px_80px_rgba(2,6,23,0.55)] backdrop-blur-2xl sm:p-8">
              <div className="mb-8 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 via-violet-500 to-pink-500 shadow-lg shadow-violet-900/40">
                  <Sparkles className="h-7 w-7 text-white" />
                </div>
                <h2 className="font-serif text-3xl font-black text-white">Admin Sign In</h2>
                <p className="mt-2 text-sm text-slate-300">Private access only for authorized administrators.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-[0.22em] text-slate-300">
                    Email Address
                  </label>
                  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 shadow-inner shadow-slate-950/20 transition focus-within:border-sky-400/60">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="admin@akshviktinytrends.com"
                      autoComplete="username"
                      className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                    />
                  </div>
                  {emailError ? <p className="text-xs text-rose-300">{emailError}</p> : null}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-[0.22em] text-slate-300">
                    Password
                  </label>
                  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 shadow-inner shadow-slate-950/20 transition focus-within:border-sky-400/60">
                    <Lock className="h-4 w-4 text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      onKeyUp={(event) => setCapsLockOn(event.getModifierState('CapsLock'))}
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((previous) => !previous)}
                      className="text-slate-400 transition hover:text-white"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {passwordError ? <p className="text-xs text-rose-300">{passwordError}</p> : null}
                  {capsLockOn ? (
                    <p className="flex items-center gap-1.5 text-xs text-amber-200">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      Caps Lock is on.
                    </p>
                  ) : null}
                </div>

                <div className="flex items-center justify-between gap-3 text-xs text-slate-300">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(event) => setRememberMe(event.target.checked)}
                      className="h-4 w-4 rounded border-white/20 bg-slate-950/60 text-pink-500 focus:ring-0"
                    />
                    Remember me for 7 days
                  </label>
                  <a
                    href="mailto:security@akshviktinytrends.com?subject=Admin%20Access%20Assistance"
                    className="font-semibold text-sky-300 transition hover:text-white"
                  >
                    Need access help?
                  </a>
                </div>

                <AnimatePresence mode="wait">
                  {formError ? (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100"
                    >
                      {formError}
                    </motion.div>
                  ) : null}

                  {success ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100"
                    >
                      <span className="inline-flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        Access granted. Opening the admin dashboard...
                      </span>
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                <motion.button
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 via-violet-500 to-pink-500 px-4 py-3.5 text-sm font-black text-white shadow-xl shadow-violet-950/35 transition disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? 'Securing session...' : 'Sign In to Dashboard'}
                </motion.button>
              </form>

              <p className="mt-6 text-center text-[11px] leading-5 text-slate-400">
                This private system is monitored and all sign-in activity is audited.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
