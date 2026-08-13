import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { MainLayout } from '../../components/layout/MainLayout.tsx';
import { Search as SearchIcon, Filter, Book, Building, FileText, ChevronRight, SlidersHorizontal, Check, Layers, Loader2 } from 'lucide-react';
import { Button } from '../../components/common/Button.tsx';
import { searchPublic } from '../../services/api.ts';

const filters = {
  type: ['All', 'Courses', 'Programs', 'Articles', 'Institutions'],
  topic: ['Artificial Intelligence', 'Data Science', 'Software Engineering', 'Design'],
  level: ['Beginner', 'Intermediate', 'Advanced']
};

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [activeType, setActiveType] = useState('All');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      setLoading(true);
      searchPublic(q).then((res) => {
        if (res.success && res.data) {
          setResults(res.data);
        } else {
          setResults([]);
        }
        setLoading(false);
      });
    } else {
      setQuery('');
      setResults([]);
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams(query ? { q: query } : {});
  };

  const getIconForType = (type: string) => {
    const t = type.toLowerCase();
    switch (t) {
      case 'course': return <Book className="w-5 h-5 text-indigo-500" />;
      case 'program': return <Layers className="w-5 h-5 text-pink-500" />;
      case 'article': return <FileText className="w-5 h-5 text-emerald-500" />;
      case 'institution': return <Building className="w-5 h-5 text-purple-500" />;
      default: return <SearchIcon className="w-5 h-5 text-slate-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    const t = type.toLowerCase();
    switch (t) {
      case 'course': return 'Course';
      case 'program': return 'Program';
      case 'article': return 'Resource';
      case 'institution': return 'Institution';
      default: return 'Result';
    }
  };

  const filteredResults = results.filter(result => {
    const matchesType = activeType === 'All' || result.type.toLowerCase() === activeType.toLowerCase().replace(/s$/, '');
    return matchesType;
  });

  return (
    <MainLayout>
      <div className="bg-slate-50 min-h-screen pb-24">
        
        {/* Search Header */}
        <div className="bg-slate-900 py-16 border-b border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-4xl font-black text-white mb-6">Search Apex Academy</h1>
              <form onSubmit={handleSearch} className="relative">
                <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
                <input 
                  type="text" 
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for courses, programs, articles, or institutions..." 
                  className="w-full bg-white/10 border border-slate-700 text-white placeholder-slate-400 rounded-2xl py-4 pl-14 pr-32 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-lg"
                />
                <Button 
                  type="submit" 
                  variant="primary" 
                  className="absolute right-2 top-2 bottom-2 px-6"
                >
                  Search
                </Button>
              </form>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Mobile Filters Toggle */}
            <div className="lg:hidden">
              <button 
                onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                className="flex items-center gap-2 w-full justify-center py-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-bold shadow-sm"
              >
                <SlidersHorizontal className="w-5 h-5" /> Filters
              </button>
            </div>

            {/* Sidebar Filters */}
            <div className={`w-full lg:w-64 shrink-0 space-y-8 ${isMobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
              
              <div>
                <h3 className="font-bold text-slate-900 uppercase tracking-wider text-xs mb-4 flex items-center gap-2">
                  <Filter className="w-4 h-4" /> Content Type
                </h3>
                <div className="space-y-2">
                  {filters.type.map(type => (
                    <button 
                      key={type}
                      onClick={() => setActiveType(type)}
                      className={`flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeType === type 
                          ? 'bg-indigo-50 text-indigo-700' 
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      {type}
                      {activeType === type && <Check className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Results Area */}
            <div className="flex-1 space-y-6">
              
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <h2 className="text-xl font-bold text-slate-900">
                  {searchParams.get('q') ? `Showing results for "${searchParams.get('q')}"` : 'Enter a search term'}
                </h2>
                <span className="text-slate-500 font-medium text-sm">
                  {filteredResults.length} results found
                </span>
              </div>

              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                </div>
              ) : filteredResults.length > 0 ? (
                <div className="space-y-4">
                  {filteredResults.map((result) => (
                    <Link 
                      to={result.slug} 
                      key={result.id}
                      className="group block bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-indigo-100/50 hover:border-indigo-300 transition-all"
                    >
                      <div className="flex items-start gap-4 sm:gap-6">
                        <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors overflow-hidden">
                          {result.thumbnail ? (
                            <img src={result.thumbnail} alt={result.title} className="w-full h-full object-cover" />
                          ) : (
                            getIconForType(result.type)
                          )}
                        </div>
                        <div className="flex-1 space-y-2 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider rounded-md">
                              {getTypeLabel(result.type)}
                            </span>
                          </div>
                          
                          <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                            {result.title}
                          </h3>
                          
                          <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">
                            {result.description}
                          </p>
                          
                          {result.badge && (
                            <div className="text-xs font-medium text-slate-500 pt-2">
                              {result.badge}
                            </div>
                          )}
                        </div>
                        
                        <div className="hidden sm:flex items-center justify-center shrink-0 w-10 h-10 rounded-full bg-slate-50 group-hover:bg-indigo-600 transition-colors mt-2">
                          <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : searchParams.get('q') ? (
                <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-300">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                    <SearchIcon className="w-8 h-8 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">No results found</h3>
                  <p className="text-slate-500 max-w-md mx-auto">
                    We couldn't find anything matching "{searchParams.get('q')}". Try adjusting your filters or using more general keywords.
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-6"
                    onClick={() => { setQuery(''); setActiveType('All'); setSearchParams({}); }}
                  >
                    Clear Search
                  </Button>
                </div>
              ) : null}

            </div>

          </div>
        </div>
      </div>
    </MainLayout>
  );
};
