import React from 'react';
import { MainLayout } from '../../components/layout/MainLayout.tsx';
import { Button } from '../../components/common/Button.tsx';
import { Input } from '../../components/common/Input.tsx';
import { Building2, BookOpen, Presentation, GraduationCap } from 'lucide-react';

export const InstitutionsPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="bg-slate-50 pb-20">
        {/* Hero */}
        <div className="bg-white border-b border-slate-200 pt-32 pb-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
            <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
              <Building2 className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto">
              Empower Your Students with Industry-Ready Tech Skills
            </h1>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
              Partner with Apex Academy to integrate cutting-edge AI, Data Science, and Engineering curricula into your university programs.
            </p>
          </div>
        </div>

        {/* Benefits & Form */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 -mt-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-12 pt-10">
              <div className="space-y-4">
                <h2 className="text-3xl font-black text-slate-900">Why Partner with Us?</h2>
                <p className="text-slate-600">Bridge the gap between academia and industry requirements with our specialized LMS.</p>
              </div>

              <div className="space-y-8">
                {[
                  { icon: BookOpen, title: 'Turnkey Curriculum', desc: 'Ready-to-deploy modules in Machine Learning, Web3, and Cloud Architecture.' },
                  { icon: Presentation, title: 'Dedicated LMS Portal', desc: 'White-labeled learning environment for your institution with full analytics.' },
                  { icon: GraduationCap, title: 'Co-Branded Certificates', desc: 'Issue verifiable blockchain credentials backed by both your university and Apex Academy.' }
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-1">{item.title}</h3>
                        <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-xl shadow-slate-200/50">
              <h3 className="text-2xl font-black text-slate-900 mb-6">Request a Demo</h3>
              <form className="space-y-5" onSubmit={(e) => {
                e.preventDefault();
                alert('Thank you for your interest! Our academic partnerships team will contact you within 24 hours.');
                (e.target as HTMLFormElement).reset();
              }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Input label="First Name" placeholder="John" required />
                  <Input label="Last Name" placeholder="Doe" required />
                </div>
                <Input label="Work Email" placeholder="john@university.edu" type="email" required />
                <Input label="Institution Name" placeholder="State University" required />
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">How can we help?</label>
                  <textarea 
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                    rows={4}
                    placeholder="Tell us about your institution's goals..."
                  />
                </div>
                <Button variant="primary" className="w-full justify-center mt-2 bg-blue-600 hover:bg-blue-700">Submit Request</Button>
                <p className="text-center text-xs text-slate-500 mt-4">By submitting, you agree to our Terms of Service and Privacy Policy.</p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
