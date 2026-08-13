import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MainLayout } from '../../components/layout/MainLayout.tsx';
import { Clock, Calendar, Share2, Bookmark, ArrowLeft, Loader2 } from 'lucide-react';
import { fetchArticleBySlug } from '../../services/api.ts';

export const ResourceDetailPage: React.FC = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      setLoading(true);
      fetchArticleBySlug(slug).then(res => {
        if (res.success && res.data) {
          setArticle(res.data);
        }
        setLoading(false);
      });
    }
  }, [slug]);

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
        </div>
      </MainLayout>
    );
  }

  if (!article) {
    return (
      <MainLayout>
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">Article Not Found</h2>
          <Link to="/resources" className="text-indigo-600 font-medium hover:underline">
            Back to Resources
          </Link>
        </div>
      </MainLayout>
    );
  }

  const tags = article.tags || ['Generative AI', 'Machine Learning', 'Future Trends', 'Software Engineering'];

  return (
    <MainLayout>
      <div className="bg-slate-50 min-h-screen pb-20">
        
        {/* Header/Hero Section */}
        <div className="relative pt-32 pb-24 bg-slate-900 overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src={article.image_url || 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=2000&q=80'} 
              alt="Cover" 
              className="w-full h-full object-cover opacity-20" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
          </div>
          
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <Link to="/resources" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors font-medium text-sm">
              <ArrowLeft className="w-4 h-4" /> Back to Resources
            </Link>
            
            <div className="space-y-6">
              {article.category && (
                <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider rounded-full border border-indigo-500/30">
                  {article.category}
                </span>
              )}
              <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
                {article.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-slate-300 text-sm font-medium pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold border-2 border-slate-600">
                    {article.author ? article.author.charAt(0) : 'A'}
                  </div>
                  <div>
                    <div className="text-white font-bold">{article.author || 'Apex Academy'}</div>
                    <div className="text-xs text-slate-400">Contributor</div>
                  </div>
                </div>
                <div className="w-px h-8 bg-slate-700 hidden sm:block"></div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  {new Date(article.published_at || article.created_at).toLocaleDateString()}
                </div>
                {article.read_time && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-slate-400" />
                    {article.read_time}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-10">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl shadow-slate-200/50 border border-slate-200">
            
            <div className="flex items-center justify-end gap-4 mb-8 pb-8 border-b border-slate-100">
              <button className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">
                <Share2 className="w-5 h-5" /> Share
              </button>
              <button className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors">
                <Bookmark className="w-5 h-5" /> Save
              </button>
            </div>

            {/* Prose Content */}
            <div 
              className="prose prose-lg prose-slate max-w-none prose-headings:font-black prose-h2:text-3xl prose-h2:mt-12 prose-h3:text-2xl prose-a:text-indigo-600 hover:prose-a:text-indigo-700 prose-img:rounded-2xl prose-blockquote:border-indigo-500 prose-blockquote:bg-indigo-50 prose-blockquote:py-4 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl prose-blockquote:font-medium prose-blockquote:text-indigo-900 prose-blockquote:not-italic"
              dangerouslySetInnerHTML={{ __html: article.content || '<p>No content available.</p>' }}
            />

            {/* Tags */}
            {tags.length > 0 && (
              <div className="mt-16 pt-8 border-t border-slate-100">
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Related Topics</h4>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag: string) => (
                    <Link key={tag} to={`/search?q=${tag}`} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-full transition-colors">
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </MainLayout>
  );
};
