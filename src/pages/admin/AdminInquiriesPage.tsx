import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout.tsx';
import { Card } from '../../components/common/Card.tsx';
import { Button } from '../../components/common/Button.tsx';
import { Input } from '../../components/common/Input.tsx';
import { Badge } from '../../components/common/Badge.tsx';
import { Search, Mail, Reply, CheckCircle, Clock } from 'lucide-react';

import { fetchAdminInquiries } from '../../services/api.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.tsx';

export const AdminInquiriesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { session } = useAuth();

  useEffect(() => {
    async function loadInquiries() {
      if (!session?.access_token) return;
      try {
        const res = await fetchAdminInquiries(session.access_token);
        if (res.success) {
          setInquiries(res.data);
        }
      } catch (err) {
        console.error('Failed to load inquiries', err);
      } finally {
        setLoading(false);
      }
    }
    loadInquiries();
  }, [session]);

  const filtered = inquiries.filter(item => 
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.target_domain?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <AdminLayout><div className="p-8 flex justify-center"><LoadingSpinner /></div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Support Inquiries</h1>
          <p className="text-xs text-slate-500 mt-1">Manage student support tickets and enterprise contact requests</p>
        </div>

        <Card className="p-0 overflow-hidden border border-slate-200 shadow-sm">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="w-full max-w-sm">
              <Input
                placeholder="Search tickets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="w-4 h-4" />}
              />
            </div>
            <div className="flex gap-2 text-xs font-bold text-slate-600">
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-amber-500"/> 1 Open Ticket</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Ticket ID</th>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Subject</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">{item.id.substring(0, 8)}...</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{item.name}</div>
                      <div className="text-xs text-slate-500">{item.email}</div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-800">{item.target_domain || 'General Inquiry'}</td>
                    <td className="px-6 py-4 text-slate-500 text-xs">{new Date(item.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <Badge variant={
                        item.status === 'NEW' ? 'danger' : 
                        item.status === 'CONTACTED' ? 'warning' : 'success'
                      }>
                        {item.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" icon={<Reply className="w-3 h-3" />}>Reply</Button>
                        {item.status !== 'CLOSED' && (
                          <button className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors" title="Mark as Resolved">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};
