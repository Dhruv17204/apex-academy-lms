import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Award, ShieldCheck, Mail, Globe, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-blue-500 flex items-center justify-center text-white shadow-md">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                APEX<span className="text-indigo-400">ACADEMY</span>
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Apex Academy is a world-class EdTech Learning & Certification Platform empowering professionals and students with career-oriented degree programs, executive certificates, and free self-paced courses.
            </p>

            <div className="pt-2 flex flex-col gap-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Verified Certificates with QR & Hash Validation</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>University & Industry Accredited Curriculums</span>
              </div>
            </div>
          </div>

          {/* Career Domains Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Career Domains</h4>
            <ul className="space-y-1.5 text-xs">
              <li><Link to="/domains/data-scientist" className="hover:text-indigo-400 transition-colors">Data Scientist</Link></li>
              <li><Link to="/domains/ai-engineer" className="hover:text-indigo-400 transition-colors">AI Engineer</Link></li>
              <li><Link to="/domains/ai-backend-engineer" className="hover:text-indigo-400 transition-colors">AI Backend Engineer</Link></li>
              <li><Link to="/domains/data-engineer" className="hover:text-indigo-400 transition-colors">Data Engineer</Link></li>
              <li><Link to="/domains/etl-developer" className="hover:text-indigo-400 transition-colors">ETL Developer</Link></li>
              <li><Link to="/domains/data-analyst" className="hover:text-indigo-400 transition-colors">Data Analyst</Link></li>
              <li><Link to="/domains/bi-developer" className="hover:text-indigo-400 transition-colors">BI Developer</Link></li>
              <li><Link to="/domains/bi-analyst" className="hover:text-indigo-400 transition-colors">BI Analyst</Link></li>
              <li><Link to="/domains/technical-analyst" className="hover:text-indigo-400 transition-colors">Technical Analyst</Link></li>
              <li><Link to="/domains/machine-learning-engineer" className="hover:text-indigo-400 transition-colors">ML Engineer</Link></li>
              <li><Link to="/domains/market-analytics-research" className="hover:text-indigo-400 transition-colors">Market Analytics</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Learner Ecosystem</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/free-courses" className="hover:text-white transition-colors">Free Short Courses</Link></li>
              <li><Link to="/career-support" className="hover:text-white transition-colors">Career Placement Support</Link></li>
              <li><Link to="/success-stories" className="hover:text-white transition-colors">Alumni Success Stories</Link></li>
              <li><Link to="/enterprise" className="hover:text-white transition-colors">Corporate Learning (Enterprise)</Link></li>
              <li><Link to="/resources" className="hover:text-white transition-colors">Tech & Career Blog</Link></li>
            </ul>
          </div>

          {/* Verification & Trust */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Verification & Legal</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link to="/verify-certificate" className="hover:text-white text-indigo-400 font-semibold flex items-center gap-1">Verify Certificate →</Link></li>
              <li><Link to="/institutions" className="hover:text-white transition-colors">Partner Universities</Link></li>
              <li><Link to="/programs" className="hover:text-white transition-colors">All Executive Programs</Link></li>
              <li><Link to="/search" className="hover:text-white transition-colors">Search Curriculum</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Apex Academy LMS. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              <Lock className="w-3.5 h-3.5 text-emerald-500" /> PostgreSQL & Express API Secured
            </span>
            <span>•</span>
            <span>Phase 1 Platform Architecture</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
