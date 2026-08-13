import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { MainLayout } from '../../components/layout/MainLayout.tsx';
import { Button } from '../../components/common/Button.tsx';
import { Input } from '../../components/common/Input.tsx';
import { Award, ShieldCheck, CheckCircle2, Search } from 'lucide-react';

export const VerifyCertificatePage: React.FC = () => {
  const { certificateId: urlCertId } = useParams();
  const [certificateId, setCertificateId] = useState(urlCertId || 'APEX-2026-ML-8841');
  const [verifiedResult, setVerifiedResult] = useState<{
    id: string;
    studentName: string;
    courseName: string;
    issueDate: string;
    issuer: string;
    status: string;
  } | null>({
    id: urlCertId || 'APEX-2026-ML-8841',
    studentName: 'Alex Morgan',
    courseName: 'Machine Learning Fundamentals & Model Evaluation',
    issueDate: 'August 2026',
    issuer: 'Apex Academy & UT Austin McCombs Partner Hub',
    status: 'AUTHENTIC & VERIFIED',
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (certificateId.trim()) {
      setVerifiedResult({
        id: certificateId.trim(),
        studentName: 'Alex Morgan',
        courseName: 'Machine Learning Fundamentals & Model Evaluation',
        issueDate: 'August 2026',
        issuer: 'Apex Academy Partner Network',
        status: 'AUTHENTIC & VERIFIED',
      });
    }
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 bg-amber-50 border border-amber-200 text-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
            <Award className="w-7 h-7" />
          </div>
          <h1 className="text-3xl font-black text-slate-900">Certificate Verification Portal</h1>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">
            Verify the authenticity of any Apex Academy credential by entering the unique Certificate ID below.
          </p>
        </div>

        {/* Search Box */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Enter Certificate ID (e.g. APEX-2026-ML-8841)"
                value={certificateId}
                onChange={(e) => setCertificateId(e.target.value)}
                icon={<Search className="w-4 h-4" />}
              />
            </div>
            <Button variant="primary" type="submit" className="shrink-0">
              Verify Credential
            </Button>
          </form>
        </div>

        {/* Verification Result Card */}
        {verifiedResult && (
          <div className="bg-white rounded-2xl border border-emerald-200 p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-emerald-600" />
                <span className="font-bold text-slate-900 text-sm">Credential Status</span>
              </div>
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {verifiedResult.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-500 block mb-1">Learner Name</span>
                <span className="font-bold text-slate-900 text-sm">{verifiedResult.studentName}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-500 block mb-1">Certificate ID</span>
                <span className="font-mono font-bold text-indigo-600 text-sm">{verifiedResult.id}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl md:col-span-2">
                <span className="text-slate-500 block mb-1">Course / Program</span>
                <span className="font-bold text-slate-900 text-sm">{verifiedResult.courseName}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-500 block mb-1">Completion Date</span>
                <span className="font-bold text-slate-900">{verifiedResult.issueDate}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-500 block mb-1">Issuing Authority</span>
                <span className="font-bold text-slate-900">{verifiedResult.issuer}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};
