import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout.tsx';
import { Card } from '../../components/common/Card.tsx';
import { Button } from '../../components/common/Button.tsx';
import { Input } from '../../components/common/Input.tsx';
import { Badge } from '../../components/common/Badge.tsx';
import { Search, Shield, XOctagon, Eye, Filter } from 'lucide-react';

import { fetchAdminCertificates } from '../../services/api.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.tsx';

export const AdminCertificatesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { session } = useAuth();

  useEffect(() => {
    async function loadCerts() {
      if (!session?.access_token) return;
      try {
        const res = await fetchAdminCertificates(session.access_token);
        if (res.success) {
          setCertificates(res.data);
        }
      } catch (err) {
        console.error('Failed to load certificates', err);
      } finally {
        setLoading(false);
      }
    }
    loadCerts();
  }, [session]);

  const filteredCerts = certificates.filter(cert => {
    const studentName = cert.profiles?.full_name || '';
    const courseTitle = cert.courses?.title || '';
    return studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
           courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
           cert.certificate_code.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading) return <AdminLayout><div className="p-8 flex justify-center"><LoadingSpinner /></div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Issued Certificates</h1>
            <p className="text-xs text-slate-500 mt-1">Audit issued certificates, public verification hashes, and revocation history</p>
          </div>
          <Button variant="primary" icon={<Shield className="w-4 h-4" />}>
            Issue Custom Certificate
          </Button>
        </div>

        <Card className="p-0 overflow-hidden border border-slate-200 shadow-sm">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="w-full max-w-sm">
              <Input
                placeholder="Search by student, course, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="w-4 h-4" />}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" icon={<Filter className="w-4 h-4" />}>Filter</Button>
              <Button variant="outline" size="sm">Export CSV</Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Certificate ID</th>
                  <th className="px-6 py-4">Student Name</th>
                  <th className="px-6 py-4">Course/Program</th>
                  <th className="px-6 py-4">Issue Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredCerts.length > 0 ? (
                  filteredCerts.map((cert) => (
                    <tr key={cert.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-emerald-500" />
                          <span className="font-mono text-slate-700 text-xs font-bold">{cert.certificate_code}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-900">{cert.profiles?.full_name || 'Unknown Student'}</td>
                      <td className="px-6 py-4 text-slate-600">{cert.courses?.title || 'Unknown Course'}</td>
                      <td className="px-6 py-4 text-slate-500 text-xs font-mono">{new Date(cert.issued_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4">
                        <Badge variant={cert.verification_status === 'VALID' ? 'success' : 'danger'}>
                          {cert.verification_status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors" title="View Certificate">
                            <Eye className="w-4 h-4" />
                          </button>
                          {cert.verification_status === 'VALID' && (
                            <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Revoke Certificate">
                              <XOctagon className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      No certificates found matching "{searchTerm}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
            <span>Showing {filteredCerts.length} of {certificates.length} items</span>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm" disabled>Next</Button>
            </div>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};
