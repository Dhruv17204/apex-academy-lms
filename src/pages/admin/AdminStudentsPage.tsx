import React, { useState } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout.tsx';
import { Card } from '../../components/common/Card.tsx';
import { Button } from '../../components/common/Button.tsx';
import { Input } from '../../components/common/Input.tsx';
import { Badge } from '../../components/common/Badge.tsx';
import { Search, UserPlus, MoreVertical, Edit, Shield, Mail } from 'lucide-react';

const mockStudents = [
  { id: 'STU-991', name: 'Eleanor Shellstrop', email: 'eleanor@example.com', enrolled: '2023-01-15', progress: '85%', status: 'Active' },
  { id: 'STU-992', name: 'Chidi Anagonye', email: 'chidi@example.com', enrolled: '2023-02-10', progress: '42%', status: 'Active' },
  { id: 'STU-993', name: 'Tahani Al-Jamil', email: 'tahani@example.com', enrolled: '2023-03-05', progress: '100%', status: 'Graduated' },
  { id: 'STU-994', name: 'Jason Mendoza', email: 'jason@example.com', enrolled: '2023-04-20', progress: '5%', status: 'Suspended' },
];

export const AdminStudentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = mockStudents.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Student Management</h1>
            <p className="text-xs text-slate-500 mt-1">Manage enrollments, track progress, and handle student accounts</p>
          </div>
          <Button variant="primary" icon={<UserPlus className="w-4 h-4" />}>
            Invite Student
          </Button>
        </div>

        <Card className="p-0 overflow-hidden border border-slate-200 shadow-sm">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="w-full max-w-sm">
              <Input
                placeholder="Search students by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="w-4 h-4" />}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Export Data</Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Student</th>
                  <th className="px-6 py-4">Enrollment Date</th>
                  <th className="px-6 py-4">Course Progress</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{item.name}</div>
                      <div className="text-xs text-slate-500">{item.email}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs font-mono">{item.enrolled}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-full max-w-[100px] h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${item.status === 'Graduated' ? 'bg-emerald-500' : 'bg-indigo-500'}`} 
                            style={{ width: item.progress }}
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-700">{item.progress}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={
                        item.status === 'Active' ? 'success' : 
                        item.status === 'Graduated' ? 'primary' : 'danger'
                      }>
                        {item.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors" title="Message">
                          <Mail className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors" title="Manage Access">
                          <Shield className="w-4 h-4" />
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
