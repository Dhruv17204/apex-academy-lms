import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  BrainCircuit, 
  BarChart3, 
  Code2, 
  Briefcase, 
  Building2, 
  Clock, 
  Award, 
  ChevronRight, 
  CheckCircle2, 
  Users, 
  Star,
  ShieldCheck,
  Server,
  Database,
  Layers,
  LineChart,
  PieChart,
  Activity,
  Target,
  ArrowRight,
  GraduationCap,
  Search,
  TrendingUp,
  PhoneCall,
  Check,
  BookOpen,
  X,
  Trophy,
  Play,
  Zap
} from 'lucide-react';
import { MainLayout } from '../../components/layout/MainLayout.tsx';
import { Button } from '../../components/common/Button.tsx';
import { Badge } from '../../components/common/Badge.tsx';
import { checkApiHealth, submitCounselorLeadApi } from '../../services/api.ts';
import { HealthCheckResponse } from '../../types/index.ts';
import { useAuth } from '../../context/AuthContext.tsx';
import { CAREER_DOMAINS, CareerDomain } from '../../data/domainsData.ts';

import campusBgImage from '../../assets/images/iit_campus_collaboration_1785784162422.jpg';

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

export const HomePage: React.FC = () => {
  const { isAuthenticated, user, profile, session } = useAuth();
  const [apiHealth, setApiHealth] = useState<HealthCheckResponse | null>(null);
  const [loadingHealth, setLoadingHealth] = useState(true);
  const navigate = useNavigate();

  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [isCounselorModalOpen, setIsCounselorModalOpen] = useState<boolean>(false);
  const [counselorFormSubmitted, setCounselorFormSubmitted] = useState<boolean>(false);
  const [isCounselorSubmitting, setIsCounselorSubmitting] = useState<boolean>(false);
  const [counselorError, setCounselorError] = useState<string | null>(null);
  const [counselorData, setCounselorData] = useState({
    name: '',
    email: '',
    phone: '',
    target_domain: 'Data Scientist',
    experience_level: 'Student / Fresher',
    preferred_contact_method: 'Phone Call',
    message: ''
  });

  useEffect(() => {
    if (isCounselorModalOpen) {
      setCounselorError(null);
      if (isAuthenticated) {
        setCounselorData((prev) => ({
          ...prev,
          name: prev.name || profile?.full_name || user?.user_metadata?.full_name || '',
          email: prev.email || user?.email || '',
        }));
      }
    }
  }, [isCounselorModalOpen, isAuthenticated, profile, user]);

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    checkApiHealth().then((res) => {
      setApiHealth(res);
      setLoadingHealth(false);
    });
  }, []);

  const EMPLOYER_LOGOS = [
    { name: 'Google', abbr: 'G', color: '#4285F4' },
    { name: 'Microsoft', abbr: 'MS', color: '#00A4EF' },
    { name: 'Amazon', abbr: 'AMZ', color: '#FF9900' },
    { name: 'Deloitte', abbr: 'DL', color: '#86BC25' },
    { name: 'Flipkart', abbr: 'FK', color: '#2874F0' },
    { name: 'Infosys', abbr: 'INF', color: '#007CC3' },
    { name: 'TCS', abbr: 'TCS', color: '#1D5B79' },
    { name: 'Accenture', abbr: 'ACC', color: '#A100FF' },
  ];

  const DOMAIN_CATEGORIES = [
    { id: 'all', label: 'All Domains', icon: Sparkles },
    { id: 'ai', label: 'AI & Deep Learning', icon: BrainCircuit },
    { id: 'data-engineering', label: 'Data Engineering', icon: Database },
    { id: 'analytics-bi', label: 'Analytics & BI', icon: BarChart3 },
    { id: 'strategy', label: 'Research & Strategy', icon: Target },
  ];

  const PLATFORM_STATS = [
    { value: '10,000+', label: 'Learners Enrolled', icon: Users },
    { value: '11', label: 'Career Domains', icon: Briefcase },
    { value: '55+', label: 'Expert-Led Lessons', icon: BookOpen },
    { value: '3,300+', label: 'Hiring Partners', icon: Building2 },
  ];

  const SUCCESS_STORIES = [
    {
      name: 'Ananya Roy',
      previousRole: 'Systems Engineer',
      previousCompany: 'Legacy Tech Ltd',
      newRole: 'Senior AI Engineer',
      newCompany: 'Microsoft',
      salaryHike: '125%',
      domain: 'AI Engineer',
      quote: 'Apex Academy\'s live domain track with hands-on vector search labs completely transformed my career trajectory. Within 5 months, I transitioned into a Senior AI role!',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    },
    {
      name: 'Rohan Mehta',
      previousRole: 'BI Analyst',
      previousCompany: 'FinTech Solutions',
      newRole: 'Lead Data Scientist',
      newCompany: 'Deloitte',
      salaryHike: '95%',
      domain: 'Data Scientist',
      quote: 'The deep-dive capstones in predictive modeling gave me the exact confidence needed for senior technical interviews. The career advisor support was outstanding.',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
    },
    {
      name: 'Priya Sharma',
      previousRole: 'Database Admin',
      previousCompany: 'Cloud Systems',
      newRole: 'Principal Data Engineer',
      newCompany: 'Flipkart',
      salaryHike: '110%',
      domain: 'Data Engineer',
      quote: 'Building real-time Spark and Airflow pipelines during the Data Engineering track helped me crack top-tier product engineering offers seamlessly.',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
    },
  ];

  const FAQS = [
    {
      q: 'What are the 11 Career Domains offered at Apex Academy?',
      a: 'The 11 specialized career domains are: Data Scientist, AI Engineer, AI Backend Engineer, Data Engineer, ETL Developer, Data Analyst, BI Developer, BI Analyst, Technical Analyst, Machine Learning Engineer, and Market Analytics & Research. Each domain has a structured learning path, curated toolstack, and a verifiable completion certificate.',
    },
    {
      q: 'Are the courses completely free to enroll in?',
      a: 'Yes! All foundational courses on Apex Academy are 100% free to enroll. You get full access to video lectures, reading materials, hands-on exercises, module quizzes, and a verifiable digital certificate upon course completion — with no credit card required.',
    },
    {
      q: 'Will I receive a verifiable certificate upon completing a course?',
      a: 'Yes, every completed course includes an employer-verifiable digital certificate featuring a unique verification code. Employers and recruiters can instantly verify authenticity via our public verification page. Share it directly on LinkedIn or attach it to job applications.',
    },
    {
      q: 'How do I speak to a Career Advisor about domain selection?',
      a: 'Click "Talk to Career Advisor" anywhere on the platform to schedule a complimentary 1-on-1 consultation. Our career advisors will review your background, experience level, and career goals to recommend the optimal domain path for maximum impact.',
    },
    {
      q: 'Can I learn at my own pace?',
      a: 'Absolutely. All courses on Apex Academy are 100% self-paced. You can start, pause, and resume learning at any time. Your progress, video position, and quiz results are automatically saved to your dashboard.',
    },
  ];

  const filteredDomains = CAREER_DOMAINS.filter((d) => {
    let categoryMatch = true;
    if (activeCategoryFilter === 'ai') {
      categoryMatch = ['ai-engineer', 'ai-backend-engineer', 'machine-learning-engineer'].includes(d.slug);
    } else if (activeCategoryFilter === 'data-engineering') {
      categoryMatch = ['data-engineer', 'etl-developer'].includes(d.slug);
    } else if (activeCategoryFilter === 'analytics-bi') {
      categoryMatch = ['data-scientist', 'data-analyst', 'bi-developer', 'bi-analyst'].includes(d.slug);
    } else if (activeCategoryFilter === 'strategy') {
      categoryMatch = ['technical-analyst', 'market-analytics-research'].includes(d.slug);
    }

    const searchMatch = searchQuery === '' || 
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      d.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.targetRoles.some(r => r.toLowerCase().includes(searchQuery.toLowerCase())) ||
      d.keyTools.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return categoryMatch && searchMatch;
  });

  const handleCounselorFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isCounselorSubmitting) return;

    const trimmedName = counselorData.name.trim();
    const trimmedEmail = counselorData.email.trim();
    const trimmedPhone = counselorData.phone.trim();
    const trimmedDomain = counselorData.target_domain.trim();
    const trimmedExp = counselorData.experience_level.trim();
    const trimmedContact = counselorData.preferred_contact_method.trim();
    const trimmedMsg = counselorData.message.trim();

    if (!trimmedName || trimmedName.length < 2) {
      setCounselorError('Please enter your full name (at least 2 characters).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      setCounselorError('Please enter a valid email address.');
      return;
    }

    const cleanDigits = trimmedPhone.replace(/\D/g, '');
    if (!trimmedPhone || cleanDigits.length < 7) {
      setCounselorError('Please enter a valid phone number (at least 7 digits).');
      return;
    }

    if (!trimmedDomain) {
      setCounselorError('Please select a Target Domain.');
      return;
    }

    setIsCounselorSubmitting(true);
    setCounselorError(null);

    try {
      const response = await submitCounselorLeadApi(
        {
          name: trimmedName,
          email: trimmedEmail,
          phone: trimmedPhone,
          target_domain: trimmedDomain,
          experience_level: trimmedExp,
          preferred_contact_method: trimmedContact,
          message: trimmedMsg || undefined,
        },
        session?.access_token
      );

      if (response.success) {
        setCounselorFormSubmitted(true);
        setCounselorError(null);
      } else {
        setCounselorError(response.error || "We couldn't submit your request. Please check your details and try again.");
      }
    } catch (err: any) {
      setCounselorError("We couldn't submit your request. Please check your details and try again.");
    } finally {
      setIsCounselorSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="bg-white min-h-screen" style={{ fontFamily: 'Poppins, sans-serif' }}>

        {/* ── TOP PROMO BAR ─────────────────────────────────────── */}
        <div style={{ background: 'linear-gradient(90deg, #0041b2 0%, #026adb 50%, #0258b8 100%)' }} className="text-white py-2 px-4 text-xs">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-bold text-[10px] uppercase tracking-wide">
                🎓 Free Courses Live
              </span>
              <span className="text-white/90 text-xs font-medium hidden sm:inline">
                Enroll in any of our 5 published courses with Certificates — 100% Free, Self-Paced
              </span>
            </div>
            <button 
              onClick={() => setIsCounselorModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold transition-all hover:scale-105"
            >
              <PhoneCall className="w-3 h-3" />
              <span>Talk to Career Advisor</span>
            </button>
          </div>
        </div>

        {/* ── HERO SECTION ──────────────────────────────────────── */}
        <section style={{ background: 'linear-gradient(135deg, #f0f7ff 0%, #e8f0fc 40%, #f5f0ff 100%)' }} className="pt-10 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Domain Quick Pills */}
            <div className="mb-8 flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
              <span className="text-[11px] font-bold uppercase text-slate-500 tracking-wider shrink-0 mr-1">
                11 Domains:
              </span>
              {CAREER_DOMAINS.slice(0, 8).map((domain) => {
                const IconComp = DOMAIN_ICON_MAP[domain.iconName] || BarChart3;
                return (
                  <Link key={domain.id} to={`/domains/${domain.slug}`} className="shrink-0 group">
                    <span className="px-3 py-1.5 rounded-full bg-white hover:bg-blue-600 hover:text-white text-slate-700 text-xs font-semibold border border-slate-200 shadow-sm hover:shadow-md hover:border-transparent transition-all duration-200 flex items-center gap-1.5">
                      <IconComp className="w-3.5 h-3.5 text-blue-600 group-hover:text-amber-300 transition-colors" />
                      <span>{domain.name}</span>
                    </span>
                  </Link>
                );
              })}
              <Link to="/programs" className="shrink-0">
                <span className="px-3 py-1.5 rounded-full bg-blue-600 text-white text-xs font-bold border border-blue-600 shadow-sm flex items-center gap-1">
                  <span>View All</span>
                  <ChevronRight className="w-3 h-3" />
                </span>
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

              {/* LEFT COPY */}
              <div className="lg:col-span-7 space-y-6">

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-blue-800 text-xs font-semibold">
                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                  <span>Aligned with 11 High-Growth Career Tracks — Certificates Included</span>
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.1]">
                  Master Future-Ready{' '}
                  <span style={{ background: 'linear-gradient(90deg, #026adb, #4f9ef5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Career Domains
                  </span>
                  <br />
                  <span className="text-slate-700">with Apex Academy</span>
                </h1>

                <p className="text-base text-slate-600 max-w-xl leading-relaxed">
                  Whether you aspire to become a <strong className="text-slate-800">Data Scientist, AI Engineer, Data Engineer, or BI Analyst</strong>, Apex Academy provides structured learning paths, quizzes, practical exercises, and industry-verifiable certificates across 11 career domains.
                </p>

                {/* Hero Search */}
                <div className="max-w-lg">
                  <div className="flex items-center bg-white rounded-xl border-2 border-blue-200 shadow-md focus-within:border-blue-500 focus-within:shadow-lg transition-all overflow-hidden">
                    <Search className="w-4 h-4 text-slate-400 ml-4 shrink-0" />
                    <input 
                      type="text" 
                      placeholder="Search career domains, roles, or tools..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-3 py-3 text-sm text-slate-900 bg-transparent focus:outline-none placeholder:text-slate-400"
                    />
                    <button 
                      onClick={() => {
                        const el = document.getElementById('domains-section');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      style={{ background: '#026adb' }}
                      className="hover:opacity-90 text-white font-semibold text-sm px-5 py-3 shrink-0 transition-opacity"
                    >
                      Search
                    </button>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <Link to="/free-courses">
                    <button style={{ background: '#026adb' }} className="hover:opacity-90 text-white font-bold text-sm px-7 py-3 rounded-lg shadow-md transition-all flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      <span>Browse Free Courses</span>
                    </button>
                  </Link>
                  <button 
                    onClick={() => setIsCounselorModalOpen(true)}
                    className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-semibold text-sm px-7 py-3 rounded-lg shadow-sm transition-all flex items-center gap-2"
                  >
                    <PhoneCall className="w-4 h-4 text-blue-600" />
                    <span>Talk to Career Advisor</span>
                  </button>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-4 gap-3 pt-4 border-t border-slate-200">
                  {PLATFORM_STATS.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                      <div key={i} className="text-center">
                        <p className="text-lg font-black text-slate-900">{stat.value}</p>
                        <p className="text-[11px] text-slate-500 font-medium leading-tight">{stat.label}</p>
                      </div>
                    );
                  })}
                </div>

              </div>

              {/* RIGHT CARD */}
              <div className="lg:col-span-5">
                <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
                  
                  {/* Course Preview Image */}
                  <div className="relative h-52 overflow-hidden bg-slate-900">
                    <img 
                      src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80" 
                      alt="AI Learning Lab" 
                      className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="bg-white/95 text-slate-900 text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-md flex items-center gap-1">
                        <BrainCircuit className="w-3 h-3 text-blue-600" />
                        AI Engineer Domain
                      </span>
                      <span className="bg-amber-400 text-slate-950 text-[10px] font-bold px-2 py-1 rounded-full">
                        🔥 Most Popular
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 text-white">
                      <p className="text-xs font-semibold text-white/80">Featured Learning Track</p>
                      <p className="text-base font-black text-white">AI Engineer Career Blueprint</p>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">LLMs • Computer Vision • AI Agents</span>
                      <span className="bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded text-[10px]">FREE</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                        <p className="text-slate-400 text-[10px] uppercase font-bold">Status</p>
                        <p className="font-bold text-slate-900 mt-0.5">Live & Enrolling</p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                        <p className="text-blue-400 text-[10px] uppercase font-bold">Certificate</p>
                        <p className="font-bold text-blue-800 mt-0.5">Employer Verifiable</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link to="/domains/ai-engineer" className="flex-1">
                        <button style={{ background: '#026adb' }} className="w-full text-white font-semibold text-sm py-2.5 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5">
                          Explore Domain
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </Link>
                      <Link to="/free-courses">
                        <button className="border border-blue-200 text-blue-700 font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-blue-50 transition-colors">
                          All Courses
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── EMPLOYER LOGO BAR ─────────────────────────────────── */}
        <section className="py-8 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest text-center mb-6">
              Our Learners Work At
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
              {EMPLOYER_LOGOS.map((emp, i) => (
                <div key={i} className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity cursor-default">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[10px] font-black shrink-0"
                    style={{ background: emp.color }}
                  >
                    {emp.abbr}
                  </div>
                  <span className="text-slate-700 font-semibold text-sm hidden sm:inline">{emp.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PLATFORM STATS ─────────────────────────────────────── */}
        <section className="py-12 bg-slate-50 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { value: '10,000+', label: 'Learners Enrolled', color: '#026adb' },
                { value: '55+', label: 'Expert-Led Lessons', color: '#16a34a' },
                { value: '100%', label: 'Free Self-Paced', color: '#d97706' },
                { value: '3,300+', label: 'Hiring Partner Companies', color: '#7c3aed' },
              ].map((s, i) => (
                <div key={i} className="bg-white rounded-xl p-6 text-center shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
                  <p className="text-3xl font-black" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-xs text-slate-500 font-semibold mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CAREER DOMAIN CATALOG ─────────────────────────────── */}
        <section id="domains-section" className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="text-center max-w-3xl mx-auto mb-10">
              <span className="inline-block text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                11 Core Career Tracks
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
                Explore Career Domains
              </h2>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                Choose your target career role. Each domain includes structured courses, hands-on labs, assessments, and a verifiable certificate.
              </p>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar mb-8 pb-2">
              {DOMAIN_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategoryFilter === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategoryFilter(cat.id)}
                    className={`px-4 py-2 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition-all shrink-0 ${
                      isActive 
                        ? 'text-white shadow-md' 
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                    style={isActive ? { background: '#026adb' } : {}}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-blue-600'}`} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Domain Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDomains.map((domain) => {
                const IconComp = DOMAIN_ICON_MAP[domain.iconName] || BarChart3;
                return (
                  <div 
                    key={domain.id} 
                    className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 flex flex-col group"
                  >
                    {/* Image */}
                    <div className="relative h-44 overflow-hidden bg-slate-800">
                      <img 
                        src={domain.cardImage} 
                        alt={domain.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/30 to-transparent" />
                      <div className="absolute top-3 left-3">
                        <span className="px-2 py-1 rounded-md bg-white/95 text-slate-900 text-[10px] font-bold uppercase tracking-wide flex items-center gap-1">
                          <IconComp className="w-3 h-3 text-blue-600" />
                          {domain.badge}
                        </span>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <span className="text-[10px] text-blue-200 font-semibold uppercase">Focus Area</span>
                        <p className="text-xs font-bold text-white line-clamp-1">{domain.learningFocus}</p>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors mb-1">
                        {domain.name}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-4">
                        {domain.shortDesc}
                      </p>

                      {/* Target Roles */}
                      <div className="mb-3">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Target Roles</p>
                        <div className="flex flex-wrap gap-1">
                          {domain.targetRoles.slice(0, 3).map((role, rIdx) => (
                            <span key={rIdx} className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                              {role}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Tools */}
                      <div className="mb-5">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1.5">Key Tools</p>
                        <div className="flex flex-wrap gap-1">
                          {domain.keyTools.slice(0, 4).map((tool, tIdx) => (
                            <span key={tIdx} className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono border border-blue-100">
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="mt-auto flex gap-2">
                        <Link to={`/domains/${domain.slug}`} className="flex-1">
                          <button style={{ background: '#026adb' }} className="w-full text-white font-semibold text-xs py-2.5 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-1">
                            Explore Domain
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </Link>
                        <button 
                          onClick={() => {
                            setCounselorData(prev => ({ ...prev, target_domain: domain.name }));
                            setIsCounselorModalOpen(true);
                          }}
                          className="border border-slate-300 text-slate-600 hover:bg-slate-100 text-xs px-3 py-2.5 rounded-lg transition-colors"
                          title="Get counseling"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredDomains.length === 0 && (
              <div className="bg-white p-12 rounded-xl text-center border border-slate-200">
                <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900">No matching domains found</h3>
                <p className="text-xs text-slate-500 mt-1">Try resetting the filter or changing your search term.</p>
                <button 
                  onClick={() => { setActiveCategoryFilter('all'); setSearchQuery(''); }}
                  className="mt-4 text-blue-600 font-semibold text-sm hover:underline"
                >
                  Reset Filters
                </button>
              </div>
            )}

          </div>
        </section>

        {/* ── FREE COURSES SECTION ──────────────────────────────── */}
        <section className="py-16 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
              <div>
                <span className="inline-block text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  🎁 100% Free — No Credit Card
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-3">
                  Start Learning for Free Today
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Get immediate access to structured courses with quizzes, labs, and verifiable certificates.
                </p>
              </div>
              <Link to="/free-courses" className="shrink-0">
                <button style={{ background: '#026adb' }} className="text-white font-semibold text-sm px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  View Full Catalog
                </button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                {
                  title: 'Statistics for Data & Analytics',
                  slug: 'statistics-data-analytics',
                  duration: '11 Modules · 55 Lessons',
                  level: 'Intermediate',
                  rating: 4.9,
                  image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=400&q=80',
                },
                {
                  title: 'Python Programming Fundamentals',
                  slug: 'python-programming-fundamentals',
                  duration: 'Self-Paced',
                  level: 'Beginner',
                  rating: 4.85,
                  image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=400&q=80',
                },
                {
                  title: 'SQL & Relational Databases',
                  slug: 'sql-relational-databases',
                  duration: 'Self-Paced',
                  level: 'Beginner',
                  rating: 4.88,
                  image: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=400&q=80',
                },
              ].map((course, idx) => (
                <div key={idx} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all overflow-hidden group">
                  <div className="relative h-36 overflow-hidden bg-slate-100">
                    <img src={course.image} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded">
                      FREE · Certificate
                    </span>
                  </div>
                  <div className="p-4 space-y-3">
                    <h4 className="font-bold text-slate-900 text-sm leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                      {course.title}
                    </h4>
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span>{course.duration}</span>
                      <span className="text-amber-500 font-bold">★ {course.rating}</span>
                    </div>
                    <Link to={`/courses/${course.slug}`} className="block">
                      <button className="w-full border border-blue-200 text-blue-700 hover:bg-blue-50 font-semibold text-xs py-2 rounded-lg transition-colors">
                        Enroll Free →
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHY APEX ACADEMY ──────────────────────────────────── */}
        <section className="py-16 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="inline-block text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                The Apex Advantage
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
                Why Professionals Choose Apex Academy
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: GraduationCap,
                  color: '#026adb',
                  bg: '#e8f0fc',
                  title: 'Verified Certificates',
                  desc: 'Earn employer-verifiable digital certificates with unique QR codes upon completing any course.',
                },
                {
                  icon: Users,
                  color: '#7c3aed',
                  bg: '#f3f0ff',
                  title: '1-on-1 Domain Mentorship',
                  desc: 'Weekly live code reviews and career guidance from practitioners at Google, OpenAI, and Deloitte.',
                },
                {
                  icon: Briefcase,
                  color: '#d97706',
                  bg: '#fffbeb',
                  title: 'Placement Support',
                  desc: 'Resume building, mock interviews, and access to 3,300+ hiring partner placement drives.',
                },
                {
                  icon: ShieldCheck,
                  color: '#16a34a',
                  bg: '#f0fdf4',
                  title: 'Instant Verification',
                  desc: 'Verifiable certificates instantly shareable on LinkedIn — recruiters can verify in seconds.',
                },
              ].map((adv, idx) => {
                const Icon = adv.icon;
                return (
                  <div key={idx} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all text-center group">
                    <div 
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform"
                      style={{ background: adv.bg }}
                    >
                      <Icon className="w-7 h-7" style={{ color: adv.color }} />
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm mb-2">{adv.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{adv.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── SUCCESS STORIES ───────────────────────────────────── */}
        <section className="py-16 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="inline-block text-xs font-bold text-emerald-700 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Alumni Impact
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
                Real Career Transformations
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SUCCESS_STORIES.map((story, sIdx) => (
                <div key={sIdx} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <img src={story.avatar} alt={story.name} className="w-14 h-14 rounded-full object-cover border-2 border-blue-200 shadow-sm" />
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{story.name}</h4>
                      <span className="text-[10px] text-blue-600 font-semibold">{story.domain} Domain</span>
                    </div>
                  </div>

                  {/* Career transition card */}
                  <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 mb-4">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-400 line-through text-[11px]">{story.previousRole} @ {story.previousCompany}</span>
                      <span className="bg-emerald-100 text-emerald-800 font-bold text-[10px] px-2 py-0.5 rounded">
                        +{story.salaryHike}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 font-bold text-slate-900 text-xs">
                      <ArrowRight className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{story.newRole} at {story.newCompany}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 italic leading-relaxed flex-1">
                    "{story.quote}"
                  </p>

                  <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified Alumni
                    </span>
                    <span className="text-slate-400">LinkedIn Confirmed</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ SECTION ───────────────────────────────────────── */}
        <section className="py-16 bg-white border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Frequently Asked Questions
              </h2>
              <p className="text-sm text-slate-500 mt-2">Everything you need to know about learning at Apex Academy</p>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq, idx) => (
                <div key={idx} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:border-blue-200 transition-colors">
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                    className="w-full text-left px-6 py-4 font-semibold text-slate-900 text-sm flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <span className="font-black text-xl shrink-0" style={{ color: '#026adb' }}>
                      {openFaqIndex === idx ? '−' : '+'}
                    </span>
                  </button>
                  {openFaqIndex === idx && (
                    <div className="px-6 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ─────────────────────────────────────────── */}
        <section style={{ background: 'linear-gradient(135deg, #026adb 0%, #0041b2 100%)' }} className="py-16 text-white text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              Ready to Accelerate Your Career?
            </h2>
            <p className="text-blue-100 text-sm max-w-xl mx-auto leading-relaxed">
              Schedule a free 1:1 consultation with a career advisor to find the perfect domain path based on your experience and goals.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button 
                onClick={() => setIsCounselorModalOpen(true)}
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm px-8 py-3.5 rounded-lg shadow-xl transition-colors flex items-center gap-2"
              >
                <PhoneCall className="w-4 h-4" />
                Book Free 1:1 Domain Counseling
              </button>
              <Link to="/programs">
                <button className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold text-sm px-8 py-3.5 rounded-lg transition-colors">
                  Browse All 11 Domains
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* ── COUNSELOR MODAL ───────────────────────────────────── */}
        {isCounselorModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200 max-h-[90vh] overflow-y-auto">
              <button 
                onClick={() => setIsCounselorModalOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {counselorFormSubmitted ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900">Request Received!</h3>
                    <p className="text-sm text-slate-600 mt-2 leading-relaxed max-w-xs mx-auto">
                      Thank you! Your domain consultation request has been submitted. Our career advisor will contact you using your preferred contact method.
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      setIsCounselorModalOpen(false);
                      setCounselorFormSubmitted(false);
                      setCounselorData({
                        name: '', email: '', phone: '',
                        target_domain: 'Data Scientist',
                        experience_level: 'Student / Fresher',
                        preferred_contact_method: 'Phone Call',
                        message: ''
                      });
                    }}
                    className="mt-2 text-sm font-semibold text-blue-600 hover:underline"
                  >
                    Done & Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleCounselorFormSubmit} className="space-y-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md">
                      Free Domain Consultation
                    </span>
                    <h3 className="text-xl font-black text-slate-900 mt-2">Speak to a Domain Advisor</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Get personalized advice on selecting the right career domain path.</p>
                  </div>

                  {counselorError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium">
                      {counselorError}
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                    <input 
                      type="text" required
                      placeholder="e.g. Karan Patel"
                      value={counselorData.name}
                      onChange={(e) => setCounselorData({ ...counselorData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                    <input 
                      type="email" required
                      placeholder="e.g. karan@gmail.com"
                      value={counselorData.email}
                      onChange={(e) => setCounselorData({ ...counselorData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Phone / WhatsApp *</label>
                    <input 
                      type="tel" required
                      placeholder="+91 98765 43210"
                      value={counselorData.phone}
                      onChange={(e) => setCounselorData({ ...counselorData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Target Domain *</label>
                      <select 
                        value={counselorData.target_domain}
                        onChange={(e) => setCounselorData({ ...counselorData, target_domain: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                      >
                        {CAREER_DOMAINS.map(d => (
                          <option key={d.id} value={d.name}>{d.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Experience *</label>
                      <select 
                        value={counselorData.experience_level}
                        onChange={(e) => setCounselorData({ ...counselorData, experience_level: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                      >
                        <option value="Student / Fresher">Student / Fresher</option>
                        <option value="0–2 Years">0–2 Years</option>
                        <option value="2–5 Years">2–5 Years</option>
                        <option value="5+ Years">5+ Years</option>
                      </select>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isCounselorSubmitting}
                    style={{ background: '#026adb' }}
                    className="w-full text-white font-bold text-sm py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {isCounselorSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <span>Request Free Callback</span>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </MainLayout>
  );
};
