import React from 'react';
import { MainLayout } from '../../components/layout/MainLayout.tsx';
import { Button } from '../../components/common/Button.tsx';
import { CheckCircle2, TrendingUp, ShieldCheck, Zap } from 'lucide-react';

export const EnterprisePage: React.FC = () => {
  return (
    <MainLayout>
      {/* Hero */}
      <div className="bg-slate-900 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500 via-slate-900 to-slate-900"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center space-y-8">
          <span className="inline-block px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-bold rounded-full border border-indigo-500/30 uppercase tracking-widest">
            For Enterprise
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight max-w-4xl leading-tight">
            Upskill Your Workforce for the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">AI Era</span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
            Customized corporate training programs to transform your engineering and business teams. Stay competitive with cutting-edge tech education.
          </p>
          <div className="pt-4">
            <Button variant="primary" size="lg" className="!bg-white !text-slate-900 hover:!bg-slate-100 border-none" onClick={() => window.location.href = 'mailto:enterprise@apexacademy.com'}>Contact Sales</Button>
          </div>
        </div>
      </div>

      {/* Metrics Section */}
      <div className="bg-indigo-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-indigo-500/50">
            <div>
              <div className="text-4xl font-black mb-1">300%</div>
              <div className="text-indigo-200 text-sm font-medium">Average ROI</div>
            </div>
            <div>
              <div className="text-4xl font-black mb-1">10k+</div>
              <div className="text-indigo-200 text-sm font-medium">Employees Trained</div>
            </div>
            <div>
              <div className="text-4xl font-black mb-1">95%</div>
              <div className="text-indigo-200 text-sm font-medium">Completion Rate</div>
            </div>
            <div>
              <div className="text-4xl font-black mb-1">24/7</div>
              <div className="text-indigo-200 text-sm font-medium">Support & Mentorship</div>
            </div>
          </div>
        </div>
      </div>

      {/* Value Props */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Zap, title: 'Tailored Learning Paths', desc: 'Custom curriculum designed specifically for your tech stack and business objectives.' },
            { icon: TrendingUp, title: 'Actionable Analytics', desc: 'Comprehensive dashboards to track employee progress, engagement, and skill acquisition.' },
            { icon: ShieldCheck, title: 'Enterprise Security', desc: 'SSO integration, robust data privacy standards, and dedicated account management.' }
          ].map((feature, idx) => (
            <div key={idx} className="bg-slate-50 rounded-3xl p-8 text-center space-y-4 hover:shadow-xl transition-shadow border border-slate-100">
              <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-6">
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-900">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};
