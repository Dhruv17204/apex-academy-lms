import React, { useState } from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout.tsx';
import { Card } from '../../components/common/Card.tsx';
import { Button } from '../../components/common/Button.tsx';
import { Input } from '../../components/common/Input.tsx';
import { Badge } from '../../components/common/Badge.tsx';
import { Search, Plus, Layers, BookOpen, Users, MoreVertical, Edit } from 'lucide-react';

const mockPrograms = [
  { id: 'PROG-1', title: 'Data Science Career Track', courses: 8, enrolled: 1250, status: 'Active', price: '$2,999' },
  { id: 'PROG-2', title: 'Machine Learning Engineering', courses: 6, enrolled: 890, status: 'Active', price: '$3,499' },
  { id: 'PROG-3', title: 'Generative AI Foundation', courses: 3, enrolled: 340, status: 'Active', price: '$999' },
  { id: 'PROG-4', title: 'Executive AI Strategy', courses: 4, enrolled: 120, status: 'Draft', price: '$1,999' },
];

export const AdminProgramsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = mockPrograms.filter(item => 
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Learning Programs</h1>
            <p className="text-xs text-slate-500 mt-1">Manage overarching programs, paths, and course bundles</p>
          </div>
          <Button variant="primary" icon={<Plus className="w-4 h-4" />}>
            Create Program
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map(program => (
            <Card key={program.id} className="p-5 space-y-4 hover:border-indigo-300 transition-colors cursor-pointer group">
              <div className="flex justify-between items-start">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Layers className="w-5 h-5" />
                </div>
                <Badge variant={program.status === 'Active' ? 'success' : 'warning'}>{program.status}</Badge>
              </div>
              
              <div>
                <h3 className="font-bold text-slate-900 leading-snug group-hover:text-indigo-600 transition-colors">{program.title}</h3>
                <div className="text-sm font-black text-slate-900 mt-1">{program.price}</div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" /> {program.courses} Courses</div>
                <div className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {program.enrolled.toLocaleString()} Enrolled</div>
              </div>
            </Card>
          ))}
        </div>
        
        {filtered.length === 0 && (
          <div className="py-12 text-center text-slate-500 bg-slate-50 border border-slate-200 border-dashed rounded-2xl">
            No programs found matching your search.
          </div>
        )}
      </div>
    </AdminLayout>
  );
};
