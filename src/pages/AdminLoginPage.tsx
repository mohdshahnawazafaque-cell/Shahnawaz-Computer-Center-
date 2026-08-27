import React, { useState } from 'react';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowRight,
  Monitor,
  AlertCircle,
  KeyRound,
  CheckCircle2,
  RefreshCw,
  X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Breadcrumbs } from '../components/Breadcrumbs';

interface AdminLoginPageProps {
  onNavigate: (path: string) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onNavigate }) => {
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Forgot / Reset Password Modal State
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetStep, setResetStep] = useState<'request' | 'reset'>('request');
  const [resetEmail, setResetEmail] = useState('');
  const [resetTokenInput, setResetTokenInput] = useState('');
  const [newResetPassword, setNewResetPassword] = useState('');
  const [confirmResetPassword, setConfirmResetPassword] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMsg, setResetMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  if (isAuthenticated) {
    onNavigate('/admin');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const res = await login(email.trim(), password);
    setIsLoading(false);

    if (res.success) {
      onNavigate('/admin');
    } else {
      setError(res.error || 'Invalid credentials. Please verify your email and password.');
    }
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetMsg(null);
    setResetLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail.trim() }),
      });
      let data: any = {};
      try {
        const text = await res.text();
        data = text ? JSON.parse(text) : {};
      } catch {
        data = {};
      }
      if (res.ok && data.resetToken) {
        setResetTokenInput(data.resetToken);
        setResetStep('reset');
        setResetMsg({
          text: 'Reset token generated successfully. Enter your new password below.',
          type: 'success',
        });
      } else {
        setResetMsg({ text: data.error || 'Failed to request reset token.', type: 'error' });
      }
    } catch {
      setResetMsg({ text: 'Network error while requesting token.', type: 'error' });
    } finally {
      setResetLoading(false);
    }
  };

  const handleExecuteReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetMsg(null);

    if (newResetPassword.length < 6) {
      setResetMsg({ text: 'New password must be at least 6 characters.', type: 'error' });
      return;
    }

    if (newResetPassword !== confirmResetPassword) {
      setResetMsg({ text: 'Passwords do not match.', type: 'error' });
      return;
    }

    setResetLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: resetTokenInput.trim(),
          newPassword: newResetPassword.trim(),
          confirmPassword: confirmResetPassword.trim(),
        }),
      });

      let data: any = {};
      try {
        const text = await res.text();
        data = text ? JSON.parse(text) : {};
      } catch {
        data = {};
      }
      if (res.ok && data.success) {
        setPassword(newResetPassword);
        setResetMsg({ text: 'Password reset successfully! You can now log in.', type: 'success' });
        setTimeout(() => {
          setShowResetModal(false);
          setResetStep('request');
        }, 1800);
      } else {
        setResetMsg({ text: data.error || 'Failed to reset password.', type: 'error' });
      }
    } catch {
      setResetMsg({ text: 'Network error while resetting password.', type: 'error' });
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div id="admin-login-page" className="pb-16 min-h-[70vh] flex flex-col justify-center">
      <Breadcrumbs items={[{ label: 'Admin Access Login' }]} onNavigate={onNavigate} />

      <div className="max-w-md mx-auto w-full px-4 mt-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-300 dark:border-slate-600 shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-[#0B2545] p-6 text-white text-center border-b-4 border-red-600">
            <div className="w-12 h-12 rounded-xl bg-red-600 text-white mx-auto flex items-center justify-center font-black shadow-md mb-2">
              <Monitor className="w-6 h-6" />
            </div>
            <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight">
              ADMIN CONTROL PORTAL
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Shahnawaz Computer Center Content Management System
            </p>
          </div>

          {/* Form */}
          <div className="p-6 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">Admin Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter admin email address"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-700 dark:text-slate-200">Master Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setResetMsg(null);
                      setResetStep('request');
                      setShowResetModal(true);
                    }}
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Forgot / Reset?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password..."
                    className="w-full pl-9 pr-9 py-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#0B2545] hover:bg-slate-800 text-white font-black uppercase tracking-wider text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Secure Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-700 border-t border-slate-200 dark:border-slate-700 text-center text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Protected with JSON Web Token (JWT) & Bcrypt Encryption</span>
          </div>
        </div>
      </div>

      {/* Forgot / Reset Password Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-300 dark:border-slate-600 shadow-2xl max-w-md w-full overflow-hidden text-xs">
            <div className="bg-[#0B2545] p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2 font-black uppercase">
                <KeyRound className="w-4 h-4 text-amber-400" />
                <span>Reset Admin Password</span>
              </div>
              <button
                onClick={() => setShowResetModal(false)}
                className="p-1 hover:bg-white dark:bg-slate-800/10 rounded-lg transition-colors text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {resetMsg && (
                <div
                  className={`p-3 rounded-xl font-bold flex items-center gap-2 ${
                    resetMsg.type === 'success'
                      ? 'bg-emerald-50 border border-emerald-300 text-emerald-800'
                      : 'bg-red-50 border border-red-300 text-red-800'
                  }`}
                >
                  {resetMsg.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  )}
                  <span>{resetMsg.text}</span>
                </div>
              )}

              {resetStep === 'request' ? (
                <form onSubmit={handleRequestReset} className="space-y-3">
                  <p className="text-slate-600 dark:text-slate-300">
                    Enter your registered admin email address to generate an instant security reset token:
                  </p>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">Registered Email</label>
                    <input
                      type="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="Enter registered admin email"
                      className="w-full p-2.5 bg-slate-50 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="w-full py-2.5 bg-[#0B2545] hover:bg-slate-800 text-white font-bold rounded-lg transition-all flex items-center justify-center gap-1.5"
                  >
                    {resetLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Generate Reset Token'}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleExecuteReset} className="space-y-3">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">Security Token</label>
                    <input
                      type="text"
                      readOnly
                      value={resetTokenInput}
                      className="w-full p-2 bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-600 rounded font-mono text-[11px] text-slate-600 dark:text-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">New Password (min 6 chars)</label>
                    <input
                      type="password"
                      required
                      value={newResetPassword}
                      onChange={(e) => setNewResetPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-200 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      value={confirmResetPassword}
                      onChange={(e) => setConfirmResetPassword(e.target.value)}
                      placeholder="Re-type new password"
                      className="w-full p-2.5 border border-slate-300 dark:border-slate-600 rounded-lg"
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setResetStep('request')}
                      className="w-1/3 py-2 bg-slate-100 dark:bg-slate-800/50 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold rounded-lg"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={resetLoading}
                      className="w-2/3 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg flex items-center justify-center gap-1.5"
                    >
                      {resetLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Set New Password'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
