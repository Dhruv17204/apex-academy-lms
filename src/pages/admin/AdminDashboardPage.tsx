import React from 'react';
import { AdminLayout } from '../../components/layout/AdminLayout.tsx';
import { Card } from '../../components/common/Card.tsx';
import { Users, BookOpen, Award, MessageSquare, ShieldCheck } from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Apex Platform Control Center</h1>
          <p className="text-xs text-slate-500 mt-1">Monitor platform stats, programs, student enrollments, and issued certificates</p>
        </div>

        {/* Stats Grid - LIGHT THEME (No Fabricated Metrics) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 bg-white border-slate-200 text-slate-900 flex items-center justify-between shadow-xs">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Students</p>
              <p className="text-2xl font-black text-slate-900 mt-1">—</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </Card>

          <Card className="p-5 bg-white border-slate-200 text-slate-900 flex items-center justify-between shadow-xs">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Programs</p>
              <p className="text-2xl font-black text-amber-600 mt-1">—</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
          </Card>

          <Card className="p-5 bg-white border-slate-200 text-slate-900 flex items-center justify-between shadow-xs">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Certificates Issued</p>
              <p className="text-2xl font-black text-emerald-600 mt-1">—</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
          </Card>

          <Card className="p-5 bg-white border-slate-200 text-slate-900 flex items-center justify-between shadow-xs">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Enterprise Leads</p>
              <p className="text-2xl font-black text-purple-600 mt-1">—</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
          </Card>
        </div>

        {/* System Health */}
        <div className="p-6 bg-white border border-slate-200 rounded-2xl space-y-4 shadow-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-sm">PostgreSQL Database & API Status</h3>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Express API endpoints routing `/api/*` with PostgreSQL database adapter initialized. Dashboard analytics metrics will display live database aggregations once connected in dedicated analytics phase.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
};
