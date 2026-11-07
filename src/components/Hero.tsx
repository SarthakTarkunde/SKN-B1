import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Sparkles,
  ArrowRight,
  PlusCircle,
  Users,
  CheckCircle,
  Lock,
  ThumbsUp
} from 'lucide-react';

export const Hero: React.FC = () => {
  const { faculty, reviews, setIsReviewModalOpen, setSelectedFacultyForReview } = useApp();

  const approvedReviews = reviews.filter((r) => r.status === 'approved');
  const totalApproved = approvedReviews.length;

  const satisfiedCount = approvedReviews.filter((r) => r.overallRating >= 4).length;
  const overallSatisfactionRate =
    totalApproved > 0 ? Math.round((satisfiedCount / totalApproved) * 100) : 94;

  const handleOpenReview = () => {
    setSelectedFacultyForReview(null);
    setIsReviewModalOpen(true);
  };

  const scrollToFaculty = () => {
    const el = document.getElementById('faculty-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28 border-b border-slate-800/60 bg-radial-hero">
      {/* Background glow orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[250px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Department Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs sm:text-sm font-medium mb-8 backdrop-blur-md shadow-lg shadow-purple-900/20">
          <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
          <span>Sinhgad College of Engineering • IT Department</span>
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
          <span className="text-purple-200">Vadgaon Bk, Pune</span>
        </div>

        {/* Hero Title */}
        <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.12]">
          Your Voice.{' '}
          <span className="bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
            Your Experience.
          </span>{' '}
          Your Campus.
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
          An independent, anonymous platform where SKNCOE students can share honest academic feedback.
        </p>

        {/* Hero CTA Buttons */}
        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <button
            onClick={scrollToFaculty}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-purple-500/30 hover:border-purple-400/60 text-white font-semibold text-sm transition-all shadow-xl hover:shadow-purple-500/20 flex items-center justify-center gap-2 group"
          >
            <span>Explore Faculty</span>
            <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={handleOpenReview}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm transition-all shadow-xl shadow-purple-600/30 hover:shadow-purple-600/50 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Submit Anonymous Review</span>
          </button>
        </div>

        {/* Anonymity Banner */}
        <div className="mt-10 inline-flex flex-wrap items-center justify-center gap-3 px-4 py-2 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-400 backdrop-blur-sm">
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>100% Anonymous</span>
          </div>
          <span className="hidden sm:inline text-slate-600">•</span>
          <div className="flex items-center gap-1.5 text-slate-300">
            <Lock className="w-3.5 h-3.5 text-purple-400" />
            <span>Zero PRN, Names, or Phone numbers collected</span>
          </div>
          <span className="hidden sm:inline text-slate-600">•</span>
          <div className="flex items-center gap-1.5 text-cyan-400 font-medium">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Community Moderated</span>
          </div>
        </div>

        {/* Metrics Bar */}
        <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <div className="flex items-center justify-center gap-2 text-purple-400 mb-1">
              <Users className="w-5 h-5" />
              <span className="font-heading text-2xl sm:text-3xl font-bold text-white">{faculty.length}</span>
            </div>
            <p className="text-xs text-slate-400 font-medium">IT Faculty Profiles</p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <div className="flex items-center justify-center gap-2 text-cyan-400 mb-1">
              <Sparkles className="w-5 h-5" />
              <span className="font-heading text-2xl sm:text-3xl font-bold text-white">{totalApproved}</span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Approved Reviews</p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <div className="flex items-center justify-center gap-2 text-emerald-400 mb-1">
              <ThumbsUp className="w-5 h-5" />
              <span className="font-heading text-2xl sm:text-3xl font-bold text-white">{overallSatisfactionRate}%</span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Student Satisfaction</p>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
            <div className="flex items-center justify-center gap-2 text-indigo-400 mb-1">
              <ShieldCheck className="w-5 h-5" />
              <span className="font-heading text-2xl sm:text-3xl font-bold text-white">0%</span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Personal Data Stored</p>
          </div>

        </div>

      </div>
    </div>
  );
};
