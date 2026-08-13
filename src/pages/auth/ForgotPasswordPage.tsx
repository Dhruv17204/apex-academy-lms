import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '../../components/layout/MainLayout.tsx';
import { Button } from '../../components/common/Button.tsx';
import { Input } from '../../components/common/Input.tsx';
import { Mail, GraduationCap, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.tsx';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSubmitting(true);

    try {
      const res = await resetPassword(email.trim());
      if (!res.success) {
        setErrorMsg(res.error || 'Failed to send reset email.');
      } else {
        setSuccessMsg(res.message || 'Reset link sent successfully!');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'An error occurred while resetting your password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl border border-slate-200 shadow-md space-y-6">
          <div className="text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-md">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">Reset Password</h2>
            <p className="text-slate-500 text-xs">Enter your email to receive a password reset link</p>
          </div>

          {errorMsg && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-red-800 text-xs">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl text-center space-y-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" />
              <p className="font-bold">Reset Instructions Sent!</p>
              <p>{successMsg}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Registered Email"
                type="email"
                placeholder="student@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="w-4 h-4" />}
                required
                disabled={isSubmitting}
              />

              <Button variant="primary" type="submit" className="w-full font-bold" disabled={isSubmitting}>
                {isSubmitting ? 'Sending Link...' : 'Send Reset Link'}
              </Button>
            </form>
          )}

          <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
            Remember your password?{' '}
            <Link to="/login" className="text-indigo-600 font-bold hover:underline">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
