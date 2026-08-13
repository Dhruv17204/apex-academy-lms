import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '../../components/layout/MainLayout.tsx';
import { Button } from '../../components/common/Button.tsx';
import { ArrowRight, Quote, Loader2 } from 'lucide-react';
import { fetchSuccessStories } from '../../services/api.ts';

export const SuccessStoriesPage: React.FC = () => {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setLoading(true);
    fetchSuccessStories().then(res => {
      if (res.success && res.data) {
        setStories(res.data);
      }
      setLoading(false);
    });
  }, []);

  return (
    <MainLayout>
      {/* Hero Section */}
      <div className="relative bg-slate-900 text-white overflow-hidden py-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/2 w-[1000px] h-[1000px] rounded-full bg-gradient-to-b from-indigo-500/20 to-purple-500/20 blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <span className="inline-block px-4 py-1.5 bg-indigo-500/20 text-indigo-300 text-sm font-bold rounded-full border border-indigo-500/30">
            Alumni Impact
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
            Transforming Careers, <br className="hidden md:block"/> Changing Lives
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Read inspiring stories of learners who transitioned into high-growth roles in AI, Data Science, Software Engineering, and Management.
          </p>
        </div>
      </div>

      {/* Stories Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
          </div>
        ) : stories.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">No stories available</h3>
            <p className="text-slate-500">Check back later for inspiring success stories.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stories.map((story) => (
              <Link to={`/success-stories/${story.id}`} key={story.id} className="block bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-200/20 relative group hover:-translate-y-1 hover:border-indigo-300 transition-all duration-300 cursor-pointer">
                <Quote className="absolute top-8 right-8 w-12 h-12 text-indigo-50 group-hover:text-indigo-100 transition-colors" />
                <div className="flex items-center gap-4 mb-6">
                  {story.image_url && !imageErrors[story.id] ? (
                    <img 
                      src={story.image_url} 
                      alt={story.learner_name} 
                      className="w-16 h-16 rounded-full object-cover shadow-inner" 
                      onError={() => setImageErrors(prev => ({ ...prev, [story.id]: true }))}
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-400 shadow-inner">
                      {story.learner_name?.charAt(0) || 'A'}
                    </div>
                  )}
                  <div>
                    <h3 className="font-black text-slate-900 text-lg group-hover:text-indigo-600 transition-colors">{story.learner_name}</h3>
                    {story.salary_increase && (
                      <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md inline-block mt-1">
                        {story.salary_increase} Salary Increase
                      </div>
                    )}
                  </div>
                </div>
                
                <p className="text-slate-600 leading-relaxed italic mb-8 relative z-10 line-clamp-4">
                  "{story.testimonial}"
                </p>

                <div className="space-y-3 pt-6 border-t border-slate-100">
                  <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Previous Role</div>
                    <div className="text-sm font-medium text-slate-700">{story.previous_role} {story.previous_company ? ` @ ${story.previous_company}` : ''}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">New Role</div>
                    <div className="text-sm font-black text-indigo-900">{story.new_role} {story.current_company ? ` @ ${story.current_company}` : ''}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-indigo-50 border-y border-indigo-100 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900">Ready to write your own success story?</h2>
          <p className="text-slate-600 text-lg">Join thousands of students who have accelerated their careers with Apex Academy.</p>
          <div className="flex justify-center">
            <Link to="/programs">
              <Button variant="primary" size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                Explore Programs
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
