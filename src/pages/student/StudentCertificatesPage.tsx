import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { StudentLayout } from '../../components/layout/StudentLayout.tsx';
import { Button } from '../../components/common/Button.tsx';
import { Card } from '../../components/common/Card.tsx';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.tsx';
import { useAuth } from '../../context/AuthContext.tsx';
import { fetchMyCertificates } from '../../services/api.ts';
import { CertificateViewerModal } from '../../components/student/CertificateViewerModal.tsx';
import { Award, Download, ExternalLink, ShieldCheck, FileText, Sparkles } from 'lucide-react';

export const StudentCertificatesPage: React.FC = () => {
  const { session } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [selectedCert, setSelectedCert] = useState<any | null>(null);

  useEffect(() => {
    async function loadCertificates() {
      const token = session?.access_token;
      if (!token) {
        setLoading(false);
        return;
      }

      setLoading(true);
      const res = await fetchMyCertificates(token);
      if (res.success) {
        setCertificates(res.certificates || []);
      }
      setLoading(false);
    }

    loadCertificates();
  }, [session]);

  return (
    <StudentLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Earned Certificates</h1>
          <p className="text-xs text-slate-500">View and download your verified course credentials issued by Apex Academy</p>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center">
            <LoadingSpinner size="md" text="Loading earned certificates..." />
          </div>
        ) : certificates.length === 0 ? (
          /* Empty State */
          <Card className="p-8 sm:p-12 text-center space-y-4 max-w-xl">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
              <Award className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-base">No Certificates Issued Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Complete all required lessons, pass all module assessments, and clear the final course assessment to earn your official credential.
              </p>
            </div>
            <div className="pt-2">
              <Link to="/student/my-learning">
                <Button variant="primary" size="sm" icon={<Sparkles className="w-4 h-4" />}>
                  Go to My Learning
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          /* Certificates List */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificates.map((cert) => {
              const issuedDate = cert.issued_at
                ? new Date(cert.issued_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                : '';

              return (
                <Card key={cert.id} className="p-6 space-y-4 flex flex-col justify-between hover:border-amber-400/60 transition-colors">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
                          <Award className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm leading-snug">{cert.course_title}</h3>
                          <p className="text-xs text-slate-500 mt-0.5">Issued {issuedDate}</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200 flex items-center gap-1 shrink-0">
                        <ShieldCheck className="w-3 h-3" />
                        Verified
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 flex items-center justify-between text-xs font-mono text-slate-600">
                      <span>ID: {cert.certificate_number}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => setSelectedCert(cert)}
                      icon={<FileText className="w-4 h-4" />}
                    >
                      View Certificate
                    </Button>
                    <Link to={`/verify/${cert.certificate_number}`} target="_blank">
                      <Button variant="outline" size="sm" icon={<ExternalLink className="w-4 h-4" />}>
                        Verify Link
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal for viewing certificate */}
      {selectedCert && (
        <CertificateViewerModal
          isOpen={!!selectedCert}
          onClose={() => setSelectedCert(null)}
          certificate={selectedCert}
        />
      )}
    </StudentLayout>
  );
};
