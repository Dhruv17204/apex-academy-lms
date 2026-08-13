import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '../../components/layout/MainLayout.tsx';
import { Button } from '../../components/common/Button.tsx';
import { Card } from '../../components/common/Card.tsx';
import { Badge } from '../../components/common/Badge.tsx';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.tsx';
import { fetchCourses, fetchCategories } from '../../services/api.ts';
import { 
  BookOpen, 
  Clock, 
  Award, 
  Search, 
  Sparkles, 
  ArrowRight,
  Filter,
  CheckCircle2
} from 'lucide-react';

export const FreeCoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    async function initData() {
      setLoading(true);

      const [catRes, courseRes] = await Promise.all([
        fetchCategories(),
        fetchCourses({
          category: selectedCategory,
          difficulty: selectedDifficulty,
          search: searchQuery,
        }),
      ]);

      if (catRes.success) setCategories(catRes.categories || []);
      if (courseRes.success) setCourses(courseRes.courses || []);

      setLoading(false);
    }

    initData();
  }, [selectedCategory, selectedDifficulty, searchQuery]);

  const formatDuration = (mins?: number) => {
    if (!mins) return 'Self-Paced';
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    if (hours === 0) return `${remainingMins} mins`;
    if (remainingMins === 0) return `${hours} hrs`;
    return `${hours} hrs ${remainingMins} mins`;
  };

  return (
    <MainLayout>
      {/* Header Hero */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-4">
          <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold rounded-full">
            100% Free Bootcamps & Courses
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Explore Free Skill Bootcamps
          </h1>
          <p className="text-slate-300 text-sm max-w-2xl leading-relaxed">
            Gain immediate access to foundational courses in Python, Cloud, Data Science, and Systems Engineering. Complete modules, test your skills, and earn verifiable certificates.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Filter Controls Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search course titles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Select Category */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Filter className="w-3.5 h-3.5" />
              <span>Category:</span>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium ml-2">
              <span>Difficulty:</span>
            </div>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium focus:outline-none"
            >
              <option value="all">All Levels</option>
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
          </div>
        </div>

        {/* Course Grid */}
        {loading ? (
          <div className="py-16 flex justify-center">
            <LoadingSpinner size="lg" text="Retrieving live catalog from database..." />
          </div>
        ) : courses.length === 0 ? (
          <div className="p-12 text-center bg-white border border-slate-200 rounded-2xl space-y-3">
            <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-900">New learning programs are being added.</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Check back soon as new career-aligned courses and skill bootcamps are published.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedCategory('all');
                setSelectedDifficulty('all');
                setSearchQuery('');
              }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card
                key={course.id}
                className="flex flex-col justify-between overflow-hidden hover:border-indigo-200 hover:shadow-md transition-all group"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
                      {course.category?.name || 'Course'}
                    </span>
                    <Badge variant={course.is_free ? 'emerald' : 'indigo'} size="sm">
                      {course.is_free ? 'FREE' : 'PAID'}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition-colors line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {course.short_description || course.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{formatDuration(course.duration_minutes)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                      <span>{course.difficulty}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" />
                    <span>Certificate Included</span>
                  </span>
                  <Link to={`/courses/${course.slug}`}>
                    <Button variant="primary" size="sm" className="font-bold">
                      View Details <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};
