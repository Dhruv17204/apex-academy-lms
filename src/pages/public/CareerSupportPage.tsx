import React from 'react';
import { MainLayout } from '../../components/layout/MainLayout.tsx';
import { Button } from '../../components/common/Button.tsx';
import { Target, Users, FileEdit, Briefcase, ChevronRight, CheckCircle2 } from 'lucide-react';

const features = [
  { icon: FileEdit, title: 'Resume & Portfolio Reviews', desc: 'Get personalized feedback from industry veterans on your resume, GitHub, and portfolio projects to stand out.' },
  { icon: Users, title: '1-on-1 Mentorship', desc: 'Connect with mentors working at top tech companies. Schedule mock interviews and receive tailored career advice.' },
  { icon: Target, title: 'Interview Preparation', desc: 'Access a curated bank of technical and behavioral interview questions. Practice with real-time feedback systems.' },
  { icon: Briefcase, title: 'Direct Referrals', desc: 'Our dedicated placement team works directly with hiring partners to fast-track your application to the final round.' },
];

export const CareerSupportPage: React.FC = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="bg-slate-900 pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col items-start gap-4">
              <span className="inline-block px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-bold rounded-full border border-amber-500/30">
                Placement & Support
              </span>
              <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight">
                Your Bridge from <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">Learning to Earning</span>
              </h1>
              <p className="text-lg text-slate-300 leading-relaxed max-w-lg">
                We don't just teach you skills; we help you launch your career. Join a placement ecosystem designed to get you hired at top tech companies.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button variant="primary" size="lg" onClick={() => {
                  const el = document.getElementById('hiring-partners');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}>View Hiring Partners</Button>
                <Button variant="outline" size="lg" className="border-slate-700 text-slate-300 hover:bg-slate-800" onClick={() => {
                  const el = document.getElementById('services');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}>Explore Services</Button>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-600 rounded-3xl blur-3xl opacity-20 animate-pulse" />
              <div className="bg-slate-800 border border-slate-700 rounded-3xl p-8 relative shadow-2xl">
                <div className="space-y-6">
                  {[
                    '92% Placement Rate within 6 months',
                    '$95k Average Starting Salary',
                    '200+ Active Hiring Partners',
                    'Lifetime Career Support Access'
                  ].map((stat, idx) => (
                    <div key={idx} className="flex items-center gap-4 bg-slate-900/50 p-4 rounded-2xl border border-slate-700/50">
                      <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <span className="text-slate-200 font-medium text-lg">{stat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div id="services" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900">Comprehensive Career Ecosystem</h2>
            <p className="text-slate-600 text-lg">Everything you need to successfully navigate the modern tech job market.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:border-indigo-100 transition-all group">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-3">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
