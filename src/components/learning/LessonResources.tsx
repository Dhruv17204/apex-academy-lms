import React from 'react';
import { 
  FileText, 
  Code2, 
  Database, 
  ExternalLink, 
  Download, 
  Paperclip,
  FileSpreadsheet,
  BookOpen
} from 'lucide-react';

interface ResourceItem {
  id: string;
  title: string;
  resource_type: string;
  file_url: string;
}

interface LessonResourcesProps {
  resources: ResourceItem[];
}

export const LessonResources: React.FC<LessonResourcesProps> = ({ resources }) => {
  if (!resources || resources.length === 0) {
    return null;
  }

  const getResourceIcon = (type: string) => {
    switch (type?.toUpperCase()) {
      case 'PDF':
        return <FileText className="w-4 h-4 text-red-500" />;
      case 'CODE':
        return <Code2 className="w-4 h-4 text-indigo-500" />;
      case 'DATASET':
        return <Database className="w-4 h-4 text-emerald-500" />;
      case 'NOTE':
        return <BookOpen className="w-4 h-4 text-amber-500" />;
      case 'LINK':
        return <ExternalLink className="w-4 h-4 text-blue-500" />;
      default:
        return <Paperclip className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
      <div className="flex items-center gap-2">
        <Paperclip className="w-4 h-4 text-indigo-600" />
        <h3 className="font-bold text-slate-900 text-sm">Lesson Resources & Attachments ({resources.length})</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {resources.map((res) => (
          <a
            key={res.id}
            href={res.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-white border border-slate-200 hover:border-indigo-300 rounded-xl flex items-center justify-between gap-3 shadow-2xs hover:shadow-xs transition-all group"
          >
            <div className="flex items-center gap-2.5 truncate">
              {getResourceIcon(res.resource_type)}
              <div className="truncate">
                <span className="font-semibold text-xs text-slate-800 group-hover:text-indigo-600 block truncate">
                  {res.title}
                </span>
                <span className="text-[10px] text-slate-400 uppercase font-bold">
                  {res.resource_type}
                </span>
              </div>
            </div>

            <div className="p-1.5 bg-slate-100 group-hover:bg-indigo-50 text-slate-500 group-hover:text-indigo-600 rounded-lg shrink-0 transition-colors">
              <Download className="w-3.5 h-3.5" />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};
