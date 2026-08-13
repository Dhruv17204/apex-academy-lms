import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout.tsx';
import { Card } from '../../components/common/Card.tsx';
import { Button } from '../../components/common/Button.tsx';
import { Input } from '../../components/common/Input.tsx';
import { Badge } from '../../components/common/Badge.tsx';
import { Search, Plus, FileText, MoreVertical, Edit, Trash2, Eye } from 'lucide-react';

import { fetchAdminContent } from '../../services/api.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.tsx';

export const AdminContentPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [content, setContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { session } = useAuth();

  useEffect(() => {
    async function loadContent() {
      if (!session?.access_token) return;
      try {
        const res = await fetchAdminContent(session.access_token);
        if (res.success) {
          setContent(res.data);
        }
      } catch (err) {
        console.error('Failed to load content', err);
      } finally {
        setLoading(false);
      }
    }
    loadContent();
  }, [session]);

  const filteredContent = content.filter(item => 
    item.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.author?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <AdminLayout><div className="p-8 flex justify-center"><LoadingSpinner /></div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Articles & Stories</h1>
            <p className="text-xs text-slate-500 mt-1">Manage articles, blog posts, and alumni success stories</p>
          </div>
          <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
            Create Content
          </Button>
        </div>

        <Card className="p-0 overflow-hidden border border-slate-200 shadow-sm">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="w-full max-w-sm">
              <Input
                placeholder="Search content by title or author..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="w-4 h-4" />}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Filter</Button>
              <Button variant="outline" size="sm">Export</Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Author</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Views</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredContent.length > 0 ? (
                  filteredContent.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <span className="font-bold text-slate-900">{item.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{item.author}</td>
                      <td className="px-6 py-4">
                        <Badge variant={
                          item.is_published ? 'success' : 'warning'
                        }>
                          {item.is_published ? 'Published' : 'Draft'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-xs font-mono">
                        {new Date(item.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-slate-700">0</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      No content found matching "{searchTerm}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
            <span>Showing {filteredContent.length} of {content.length} items</span>
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
