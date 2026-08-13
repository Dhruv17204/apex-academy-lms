import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MainLayout } from '../../components/layout/MainLayout.tsx';
import { ArrowLeft, Briefcase, TrendingUp, Award, Quote, Terminal, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '../../components/common/Button.tsx';
import { fetchSuccessStoryById } from '../../services/api.ts';

export const SuccessStoryDetailPage: React.FC = () => {
  const { id } = useParams();
  const [story, setStory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(true);
      fetchSuccessStoryById(id).then(res => {
        if (res.success && res.data) {
          setStory(res.data);
        }
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        </div>
      </MainLayout>
    );
  }

  if (!story) {
    return (
      <MainLayout>
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">Success Story Not Found</h2>
          <Link to="/success-stories" className="text-indigo-600 font-medium hover:underline">
            Back to Alumni Stories
          </Link>
        </div>
      </MainLayout>
    );
  }

  // Parse structured JSON sections if they exist, otherwise render raw string or mock
  const sections = story.sections || {
    background: story.story || 'A great background story.',
    challenge: 'Overcoming technical and personal hurdles.',
    solution: 'Apex Academy provided the right curriculum.',
    outcome: 'A new role with higher salary.'
  };

  const portfolio = story.portfolio || [];

  return (
    <MainLayout>
      <div className="bg-slate-50 min-h-screen pb-24">
        
        {/* Hero Section */}
        <div className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 bg-slate-900 overflow-hidden">
          <div className="absolute inset-0">
            <img src={story.cover_image_url || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'} alt="Cover" className="w-full h-full object-cover opacity-20 mix-blend-overlay" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/40"></div>
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link to="/success-stories" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors font-medium text-sm mb-12">
              <ArrowLeft className="w-4 h-4" /> Back to Alumni Stories
            </Link>
            
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
              <div className="flex-1 space-y-8 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider rounded-full border border-indigo-500/30">
                  <Award className="w-4 h-4" /> Alumni Success
                </div>
                
                <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
                  From {story.previous_role} <br/> to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">{story.new_role}</span>
                </h1>
                
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                  {story.current_company && (
                    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-slate-700/50">
                      <Briefcase className="w-5 h-5 text-indigo-400" />
                      <div className="text-left">
                        <div className="text-[10px] uppercase font-bold text-slate-400">Current Company</div>
                        <div className="text-sm font-bold text-white">{story.current_company}</div>
                      </div>
                    </div>
                  )}
                  {story.salary_increase && (
                    <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-emerald-900/30 backdrop-blur-sm border border-emerald-500/30">
                      <TrendingUp className="w-5 h-5 text-emerald-400" />
                      <div className="text-left">
                        <div className="text-[10px] uppercase font-bold text-emerald-400/80">Salary Increase</div>
                        <div className="text-sm font-bold text-emerald-300">{story.salary_increase}</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="shrink-0 relative">
                <div className="absolute inset-0 bg-indigo-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                {story.image_url ? (
                  <img 
                    src={story.image_url} 
                    alt={story.learner_name} 
                    className="relative w-64 h-64 lg:w-80 lg:h-80 object-cover rounded-full border-4 border-slate-800 shadow-2xl" 
                  />
                ) : (
                  <div className="relative w-64 h-64 lg:w-80 lg:h-80 bg-slate-800 rounded-full border-4 border-slate-700 shadow-2xl flex items-center justify-center font-bold text-6xl text-slate-600">
                    {story.learner_name?.charAt(0) || 'A'}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20">
            
            {/* Main Narrative */}
            <div className="lg:col-span-2 space-y-16">
              
              {story.testimonial && (
                <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl shadow-indigo-100/20 border border-slate-200 relative overflow-hidden">
                  <Quote className="absolute top-8 left-8 w-16 h-16 text-indigo-50" />
                  <p className="relative z-10 text-xl lg:text-2xl text-slate-700 font-medium italic leading-relaxed pt-8">
                    "{story.testimonial}"
                  </p>
                  <div className="mt-8 flex items-center gap-4">
                    <div className="w-12 h-1 bg-indigo-500 rounded-full"></div>
                    <div className="font-bold text-slate-900">{story.learner_name}</div>
                  </div>
                </div>
              )}

              <div className="space-y-12 text-slate-600 text-lg leading-relaxed">
                {sections.background && (
                  <section className="space-y-4">
                    <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 text-slate-500 text-sm">1</span>
                      The Background
                    </h2>
                    <p className="whitespace-pre-wrap">{sections.background}</p>
                  </section>
                )}
                
                {sections.challenge && (
                  <section className="space-y-4">
                    <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-rose-100 text-rose-500 text-sm">2</span>
                      The Challenge
                    </h2>
                    <p className="whitespace-pre-wrap">{sections.challenge}</p>
                  </section>
                )}
                
                {sections.solution && (
                  <section className="space-y-4">
                    <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100 text-indigo-500 text-sm">3</span>
                      The Apex Solution
                    </h2>
                    <p className="whitespace-pre-wrap">{sections.solution}</p>
                  </section>
                )}
                
                {sections.outcome && (
                  <section className="space-y-4">
                    <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                      <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-emerald-100 text-emerald-500 text-sm">4</span>
                      The Outcome
                    </h2>
                    <p className="whitespace-pre-wrap">{sections.outcome}</p>
                  </section>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              
              <div className="bg-slate-900 rounded-3xl p-8 shadow-xl text-white">
                <h3 className="font-black text-xl mb-6">Program Taken</h3>
                <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-4">
                    <Award className="w-6 h-6 text-indigo-400" />
                  </div>
                  <h4 className="font-bold text-lg mb-2">{story.program_taken || 'Apex Academy Program'}</h4>
                  <p className="text-slate-400 text-sm mb-6">
                    A comprehensive program covering the core skills needed to succeed in modern tech roles.
                  </p>
                  <Link to="/programs" className="block w-full">
                    <Button variant="primary" className="w-full justify-center">
                      View Programs
                    </Button>
                  </Link>
                </div>
              </div>

              {portfolio.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
                  <h3 className="font-black text-slate-900 text-xl mb-6 flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-indigo-500" /> Key Projects
                  </h3>
                  <div className="space-y-6">
                    {portfolio.map((project: any, idx: number) => (
                      <div key={idx} className="space-y-3 pb-6 border-b border-slate-100 last:border-0 last:pb-0">
                        <h4 className="font-bold text-slate-900 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {project.title}
                        </h4>
                        <p className="text-sm text-slate-600">
                          {project.description}
                        </p>
                        {project.tech && project.tech.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {project.tech.map((t: string) => (
                              <span key={t} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-md">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      </div>
    </MainLayout>
  );
};
