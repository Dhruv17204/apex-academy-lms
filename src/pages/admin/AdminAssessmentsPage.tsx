import React, { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout.tsx';
import { Card } from '../../components/common/Card.tsx';
import { Button } from '../../components/common/Button.tsx';
import { Input } from '../../components/common/Input.tsx';
import { Badge } from '../../components/common/Badge.tsx';
import { Search, Plus, CheckSquare, Edit, Trash2, Settings, BarChart2 } from 'lucide-react';

import { fetchAdminAssessments, generateQuizFromMaterial } from '../../services/api.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.tsx';

export const AdminAssessmentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [assessments, setAssessments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingAi, setGeneratingAi] = useState<string | null>(null);
  const { session } = useAuth();

  useEffect(() => {
    loadAssessments();
  }, [session]);

  async function loadAssessments() {
    if (!session?.access_token) return;
    try {
      const res = await fetchAdminAssessments(session.access_token);
      if (res.success) {
        setAssessments(res.data);
      }
    } catch (err) {
      console.error('Failed to load assessments', err);
    } finally {
      setLoading(false);
    }
  }

  const handleGenerateAI = async (assessmentId: string) => {
    if (!session?.access_token) return;
    const materialId = prompt("Enter the Course Material ID to generate a quiz from (e.g., from Course Materials page):");
    if (!materialId) return;

    setGeneratingAi(assessmentId);
    try {
      const res = await generateQuizFromMaterial(session.access_token, materialId, assessmentId, 5);
      if (res.success) {
        alert('AI Quiz generated successfully!');
        loadAssessments(); // Reload
      } else {
        alert('Failed: ' + res.error);
      }
    } catch (err: any) {
      alert('Error generating quiz: ' + err.message);
    } finally {
      setGeneratingAi(null);
    }
  };

  const filtered = assessments.filter(item => 
    item.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.courses?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <AdminLayout><div className="p-8 flex justify-center"><LoadingSpinner /></div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Assessments & Quizzes</h1>
            <p className="text-xs text-slate-500 mt-1">Manage course assessments, question banks, and grading criteria</p>
          </div>
          <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
            Create Assessment
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 border border-slate-200 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <CheckSquare className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">45</div>
              <div className="text-xs text-slate-500">Total Assessments</div>
            </div>
          </Card>
          <Card className="p-4 border border-slate-200 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <BarChart2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">84%</div>
              <div className="text-xs text-slate-500">Average Pass Rate</div>
            </div>
          </Card>
          <Card className="p-4 border border-slate-200 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-slate-900">1,200+</div>
              <div className="text-xs text-slate-500">Questions in Bank</div>
            </div>
          </Card>
        </div>

        <Card className="p-0 overflow-hidden border border-slate-200 shadow-sm">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="w-full max-w-sm">
              <Input
                placeholder="Search assessments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="w-4 h-4" />}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Course</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4 text-center">Questions</th>
                  <th className="px-6 py-4 text-center">Avg Score</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{item.title}</td>
                    <td className="px-6 py-4 text-slate-600">{item.courses?.title || 'No Course'}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded border border-slate-200">
                        {item.assessment_type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center font-medium text-slate-700">0</td>
                    <td className="px-6 py-4 text-center font-medium text-slate-700">0%</td>
                    <td className="px-6 py-4">
                      <Badge variant={item.is_published ? 'success' : 'warning'}>
                        {item.is_published ? 'Published' : 'Draft'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="!text-xs border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                          disabled={generatingAi === item.id}
                          onClick={() => handleGenerateAI(item.id)}
                        >
                          {generatingAi === item.id ? 'Generating...' : '✨ AI Generate'}
                        </Button>
                        <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
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
