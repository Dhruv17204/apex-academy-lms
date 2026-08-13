import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '../../components/layout/MainLayout.tsx';
import { ArrowRight, BookOpen, Clock, Tag, Loader2 } from 'lucide-react';
import { fetchArticles } from '../../services/api.ts';

const categories = ['All', 'Artificial Intelligence', 'Data Science', 'Career Advice', 'Engineering', 'Industry News'];

export const ResourcesPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchArticles().then(res => {
      if (res.success && res.data) {
        setArticles(res.data);
      }
      setLoading(false);
    });
  }, []);

  const filteredArticles = activeCategory === 'All' 
    ? articles 
    : articles.filter(a => a.category === activeCategory);

  const featuredArticle = articles.length > 0 ? articles[0] : null;
  const gridArticles = articles.length > 1 ? filteredArticles.slice(1) : filteredArticles;

  return (
    <MainLayout>
      {/* Header */}
      <div className="bg-slate-900 py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-sm font-bold rounded-full border border-indigo-500/30">
            Knowledge Hub
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Insights for the Modern Learner
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Explore articles, tutorials, and expert insights on AI breakthroughs, career growth, and software engineering.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900">No articles available</h3>
            <p className="text-slate-500">Check back later for new insights and resources.</p>
          </div>
        ) : (
          <>
            {/* Featured Article */}
            {featuredArticle && activeCategory === 'All' && (
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-amber-600" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-900">Featured Reading</h2>
                </div>
                
                <Link to={`/resources/${featuredArticle.slug}`} className="group block relative rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 border border-slate-200">
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="relative h-64 lg:h-auto overflow-hidden">
                      <img 
                        src={featuredArticle.image_url || 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=1200&q=80'} 
                        alt={featuredArticle.title} 
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                    <div className="bg-white p-8 lg:p-12 flex flex-col justify-center space-y-6">
                      <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        {featuredArticle.category && (
                          <span className="text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">{featuredArticle.category}</span>
                        )}
                        {featuredArticle.read_time && (
                          <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {featuredArticle.read_time}</span>
                        )}
                      </div>
                      <h3 className="text-3xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">
                        {featuredArticle.title}
                      </h3>
                      <p className="text-slate-600 text-lg leading-relaxed line-clamp-3">
                        {featuredArticle.excerpt}
                      </p>
                      <div className="flex items-center justify-between pt-6 border-t border-slate-100 mt-auto">
                        <div className="flex items-center gap-3">
                          <div className="text-sm font-bold text-slate-900">{featuredArticle.author || 'Apex Academy'}</div>
                        </div>
                        <div className="text-indigo-600 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                          Read Article <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </section>
            )}

            {/* Categories & Article Grid */}
            <section className="space-y-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-2xl font-black text-slate-900">Latest Articles</h2>
                
                {/* Category Filter */}
                <div className="flex overflow-x-auto pb-2 md:pb-0 hide-scrollbar gap-2">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
                        activeCategory === category 
                          ? 'bg-slate-900 text-white shadow-md' 
                          : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {gridArticles.map((article: any, idx: number) => (
                  <Link to={`/resources/${article.slug}`} key={article.id || idx} className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 hover:border-indigo-200 transition-all">
                    <div className="relative h-48 overflow-hidden">
                      <img src={article.image_url || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      {article.category && (
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-900 shadow-sm">
                          {article.category}
                        </div>
                      )}
                    </div>
                    <div className="p-6 flex flex-col flex-1 space-y-4">
                      <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                        <span>{new Date(article.published_at || article.created_at).toLocaleDateString()}</span>
                        {article.read_time && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {article.read_time}</span>
                          </>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">
                        {article.excerpt}
                      </p>
                      <div className="mt-auto pt-6 flex items-center justify-between border-t border-slate-50">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-700">{article.author || 'Apex Academy'}</span>
                        </div>
                        <ArrowRight className="w-5 h-5 text-indigo-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {gridArticles.length === 0 && (
                <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                  <Tag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-slate-900">No articles found</h3>
                  <p className="text-slate-500">We couldn't find any articles in the "{activeCategory}" category.</p>
                  <button 
                    onClick={() => setActiveCategory('All')}
                    className="mt-4 text-indigo-600 font-bold hover:text-indigo-700"
                  >
                    View all articles
                  </button>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </MainLayout>
  );
};

