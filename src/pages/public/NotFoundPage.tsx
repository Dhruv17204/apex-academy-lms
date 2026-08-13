import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, AlertCircle, ArrowLeft } from 'lucide-react';
import { MainLayout } from '../../components/layout/MainLayout.tsx';

export const NotFoundPage: React.FC = () => {
  return (
    <MainLayout>
      
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-3xl -z-10" />
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-3xl -z-10" />
        
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-8 mx-auto shadow-sm">
          <AlertCircle className="w-12 h-12 text-blue-600" />
        </div>
        
        <h1 className="text-8xl font-extrabold text-slate-900 tracking-tight mb-4 drop-shadow-sm">
          4<span className="text-blue-600">0</span>4
        </h1>
        
        <h2 className="text-3xl font-bold text-slate-800 mb-6 tracking-tight">
          Oops! Page not found
        </h2>
        
        <p className="text-slate-600 max-w-md mx-auto mb-10 text-lg leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3 bg-white text-slate-700 font-medium rounded-xl hover:bg-slate-50 hover:text-blue-600 transition-all border border-slate-200 shadow-sm focus:ring-4 focus:ring-slate-100 outline-none w-full sm:w-auto justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
            Go Back
          </button>
          
          <Link 
            to="/"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 hover:shadow-md hover:shadow-blue-600/20 transition-all focus:ring-4 focus:ring-blue-600/20 outline-none w-full sm:w-auto justify-center"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
          
          <Link 
            to="/search"
            className="flex items-center gap-2 px-6 py-3 bg-indigo-50 text-indigo-700 font-medium rounded-xl hover:bg-indigo-100 transition-all focus:ring-4 focus:ring-indigo-100 outline-none w-full sm:w-auto justify-center"
          >
            <Search className="w-5 h-5" />
            Search Courses
          </Link>
        </div>
      </main>
    </MainLayout>
  );
};
