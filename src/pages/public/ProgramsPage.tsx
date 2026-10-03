
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Clock,
  Star,
  Sparkles,
  BarChart3,
  BrainCircuit,
  Server,
  Database,
  Layers,
  LineChart,
  PieChart,
  Briefcase,
  Activity,
  Target,
  ArrowRight,
  TrendingUp,
  Award,
  CheckCircle2
} from 'lucide-react';
import { MainLayout } from '../../components/layout/MainLayout.tsx';
import { Button } from '../../components/common/Button.tsx';
import { CAREER_DOMAINS, CareerDomain } from '../../data/domainsData.ts';

const DOMAIN_ICON_MAP: Record<string, React.ElementType> = {
  BarChart3,
  BrainCircuit,
  Server,
  Database,
  Layers,
  LineChart,
  PieChart,
  Briefcase,
  Activity,
  Sparkles,
  Target
};

export const ProgramsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBadge, setSelectedBadge] = useState<string>('all');

  const filteredDomains = CAREER_DOMAINS.filter(domain => {
    const matchesSearch =
      domain.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      domain.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      domain.targetRoles.some(r => r.toLowerCase().includes(searchQuery.toLowerCase())) ||
      domain.keyTools.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSearch;
  });

  return (
    <MainLayout>
      <div className="bg-slate-50 min-h-screen text-slate-800 py-10" style={{ fontFamily: 'Poppins, sans-serif' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

          {/* Header Banner (GL Style banner with high contrast white text) */}
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-8 sm:p-10 rounded-2xl border border-slate-800 shadow-lg text-center max-w-5xl mx-auto space-y-4 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <span
              className="text-[10px] font-black uppercase tracking-widest bg-indigo-500/20 border border-indigo-500/30 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5"
              style={{ color: '#c7d2fe' }}
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Career Domain Directory (11 Core Tracks)</span>
            </span>

            <h1
              className="text-2xl sm:text-4xl font-bold tracking-tight leading-tight text-white"
              style={{ color: '#ffffff' }}
            >
              Apex Career Domains & Learning Paths
            </h1>

            <p
              className="text-xs sm:text-xs max-w-2xl mx-auto leading-relaxed font-medium"
              style={{ color: '#cbd5e1' }}
            >
              Explore our 11 industry-approved career domains. Each domain is structured with targeted role requirements, essential toolstacks, salary benchmarks, and live curriculum frameworks.
            </p>

            {/* Search input */}
            <div className="relative max-w-md mx-auto pt-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by domain, role, or tool..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white/15 backdrop-blur-md border border-white/20 rounded-lg text-xs text-white placeholder:text-slate-400 focus:bg-white focus:text-slate-900 focus:outline-none transition-all font-medium"
              />
            </div>
          </div>

          {/* Quick Domain Grid Count Header (Removed dev import banners) */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span>All Approved Career Domains</span>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full text-white font-bold animate-pulse" style={{ backgroundColor: '#026adb' }}>
                {filteredDomains.length} / {CAREER_DOMAINS.length}
              </span>
            </h2>
          </div>

          {/* 11 Career Domain Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDomains.map((domain) => {
              const IconComp = DOMAIN_ICON_MAP[domain.iconName] || BarChart3;

              return (
                <div
                  key={domain.id}
                  className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Domain Card Banner Image (h-32 instead of h-48 for optimized height) */}
                    <div className="relative h-32 overflow-hidden bg-slate-900">
                      <img
                        src={domain.cardImage}
                        alt={domain.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent"></div>

                      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                        <span
                          className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider shadow-md flex items-center gap-1 text-white"
                          style={{ backgroundColor: '#026adb' }}
                        >
                          <IconComp className="w-2.5 h-2.5 text-white" />
                          {domain.badge}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-900/80 text-amber-300 border border-amber-400/30 text-[9px] font-bold tracking-wider shadow-sm flex items-center gap-1 backdrop-blur-xs">
                          <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                          Apex Career Track
                        </span>
                      </div>

                      <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                        <span className="text-[10px] font-semibold text-slate-200 uppercase tracking-wider block">
                          Career Focus
                        </span>
                        <span className="text-xs font-bold text-white drop-shadow-sm line-clamp-1">
                          {domain.learningFocus}
                        </span>
                      </div>
                    </div>

                    {/* Card Body (p-4 instead of p-6 for optimized compactness) */}
                    <div className="p-4 space-y-3">

                      <div className="space-y-1">
                        <h3 className="font-bold text-slate-900 text-base leading-snug transition-colors group-hover:text-blue-600">
                          {domain.name}
                        </h3>
                        <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                          {domain.shortDesc}
                        </p>
                      </div>

                      {/* Target Roles */}
                      <div className="space-y-1 pt-1.5 border-t border-slate-100">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                          Target Roles:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {domain.targetRoles.map((role, idx) => (
                            <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-slate-50 text-slate-600 font-medium border border-slate-100">
                              {role}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Key Skills */}
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block">
                          Key Competencies:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {domain.keySkills.slice(0, 3).map((skill, idx) => (
                            <span key={idx} className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 font-semibold border border-emerald-100">
                              {skill}
                            </span>
                          ))}
                          {domain.keySkills.length > 3 && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-55 text-slate-400 font-semibold">
                              +{domain.keySkills.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Card Actions (p-4 instead of p-6 for clean space) */}
                  <div className="p-4 pt-0">
                    <Link to={`/domains/${domain.slug}`} className="block w-full">
                      <button
                        className="w-full text-white text-xs font-semibold py-2 rounded-lg transition-all hover:opacity-90 flex items-center justify-center gap-1.5"
                        style={{ backgroundColor: '#026adb' }}
                      >
                        <span>Explore Domain Layout</span>
                        <ArrowRight className="w-3.5 h-3.5 text-white" />
                      </button>
                    </Link>
                  </div>

                </div>
              );
            })}
          </div>

          {filteredDomains.length === 0 && (
            <div className="bg-white p-12 rounded-3xl text-center max-w-md mx-auto border border-slate-200 shadow-2xs">
              <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900">No domains match your search</h3>
              <p className="text-xs text-slate-500 mt-1">Try typing terms like "Data", "AI", "BI", or "Engineer".</p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-4 px-4 py-2 border rounded-lg text-xs font-bold transition-all hover:bg-slate-55"
              >
                Clear Search Filter
              </button>
            </div>
          )}

        </div>
      </div>
    </MainLayout>
  );
};
