import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, ShieldAlert, Award, ArrowLeft, CheckCircle2, Calendar, FileText, Sparkles } from 'lucide-react';
import { Card } from '../../components/common/Card.tsx';
import { Button } from '../../components/common/Button.tsx';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.tsx';
import { verifyCertificatePublic } from '../../services/api.ts';
import { CertificateViewerModal } from '../../components/student/CertificateViewerModal.tsx';

export const PublicCertificateVerificationPage: React.FC = () => {
  const { verificationCode, code } = useParams<{ verificationCode?: string; code?: string }>();
  const activeCode = verificationCode || code || '';

  const [loading, setLoading] = useState<boolean>(true);
  const [result, setResult] = useState<{
    verified: boolean;
    error?: string;
    certificate?: {
      certificate_number: string;
      student_name: string;
      course_title: string;
      issued_at: string;
      verification_status: string;
      verification_url: string;
    };
  } | null>(null);

  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    async function verifyCode() {
      if (!activeCode) {
        setLoading(false);
        setResult({ verified: false, error: 'No verification code provided.' });
        return;
      }

      setLoading(true);
      const res = await verifyCertificatePublic(activeCode);
      setResult(res);
      setLoading(false);
    }

    verifyCode();
  }, [activeCode]);

  const cert = result?.certificate;
  const issuedDateStr = cert?.issued_at
    ? new Date(cert.issued_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between p-4 sm:p-8">
      {/* Header / Brand Nav */}
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between py-4 border-b border-slate-800">
        <Link to="/" className="flex items-center gap-2 font-black text-xl text-white tracking-tight">
          <span className="w-3 h-3 rounded-full bg-amber-500" />
          APEX ACADEMY
        </Link>
        <Link to="/login">
          <Button variant="outline" size="sm" className="text-slate-300 border-slate-700 hover:bg-slate-800">
            Sign In
          </Button>
        </Link>
      </div>

      {/* Main Container */}
      <div className="max-w-2xl w-full mx-auto my-12">
        {loading ? (
          <Card className="p-12 text-center bg-slate-800/80 border-slate-700">
            <LoadingSpinner size="lg" text="Verifying certificate credential against Apex Academy database..." />
          </Card>
        ) : result?.verified && cert ? (
          /* VERIFIED STATE */
          <Card className="p-8 sm:p-10 bg-slate-800/90 border border-emerald-500/40 shadow-2xl space-y-6">
            
            {/* Status Header */}
            <div className="flex items-center gap-3 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
              <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0" />
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-emerald-400">Official Status</span>
                <h1 className="text-lg font-black text-white">CERTIFICATE VERIFIED</h1>
              </div>
            </div>

            {/* Credential Card Details */}
            <div className="space-y-5 py-2">
              <div>
                <span className="text-xs text-slate-400 font-medium">Recipient Name</span>
                <p className="text-2xl font-black text-white">{cert.student_name}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-700/60">
                  <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    Course Name
                  </span>
                  <p className="text-sm font-bold text-slate-100 mt-1">{cert.course_title}</p>
                </div>

                <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-700/60">
                  <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    Issued Date
                  </span>
                  <p className="text-sm font-bold text-slate-100 mt-1">{issuedDateStr}</p>
                </div>
              </div>

              <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-700/60 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 font-medium">Certificate Identifier</span>
                  <p className="text-xs font-mono font-bold text-amber-400 mt-0.5">{cert.certificate_number}</p>
                </div>
                <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full border border-emerald-500/30">
                  Valid Record
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <Button
                variant="primary"
                onClick={() => setShowModal(true)}
                icon={<FileText className="w-4 h-4" />}
                className="w-full sm:w-auto"
              >
                View Official Document
              </Button>
              <Link to="/" className="w-full sm:w-auto">
                <Button variant="outline" icon={<ArrowLeft className="w-4 h-4" />} className="w-full text-slate-300 border-slate-700 hover:bg-slate-700">
                  Back to Homepage
                </Button>
              </Link>
            </div>

          </Card>
        ) : (
          /* INVALID STATE */
          <Card className="p-8 sm:p-10 bg-slate-800/90 border border-rose-500/40 shadow-2xl space-y-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 bg-rose-500/20 text-rose-300 text-xs font-black uppercase tracking-wider rounded-full border border-rose-500/30">
                Verification Failed
              </span>
              <h1 className="text-2xl font-black text-white pt-2">CERTIFICATE NOT FOUND</h1>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                The verification code <code className="text-amber-400 font-mono px-1 py-0.5 bg-slate-900 rounded">{activeCode}</code> does not match any valid issued certificate record in the Apex Academy database.
              </p>
            </div>

            <div className="pt-4">
              <Link to="/">
                <Button variant="outline" icon={<ArrowLeft className="w-4 h-4" />} className="text-slate-300 border-slate-700 hover:bg-slate-700">
                  Return to Apex Academy
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </div>

      {/* Modal for full document view */}
      {cert && (
        <CertificateViewerModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          certificate={cert}
        />
      )}

      {/* Footer Notice */}
      <div className="text-center text-xs text-slate-500 py-4 border-t border-slate-800">
        Apex Academy Verification Engine • Powered by Supabase PostgreSQL
      </div>
    </div>
  );
};
