import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  Search,
  PlusCircle,
  Shield,
  Menu,
  X,
  Sparkles,
  TrendingUp,
  BookOpen,
  Users
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    searchTerm,
    setSearchTerm,
    setIsReviewModalOpen,
    setSelectedFacultyForReview,
    setIsAdminModalOpen,
    isAdminLoggedIn,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleOpenNewReview = () => {
    setSelectedFacultyForReview(null);
    setIsReviewModalOpen(true);
    setMobileMenuOpen(false);
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#070A13]/90 backdrop-blur-xl border-b border-purple-500/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 p-0.5 shadow-lg shadow-purple-500/25">
              <div className="w-full h-full bg-[#0B0F1E] rounded-[14px] flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-purple-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-purple-300 bg-clip-text text-transparent">
                  SKNCOE
                </span>
                <span className="text-xs font-semibold uppercase px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  IT Dept
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium tracking-wide">
                Faculty Reviews & Ratings
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => scrollTo('faculty-section')}
              className="px-3.5 py-2 text-sm font-medium text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/50 transition-colors flex items-center gap-1.5"
            >
              <Users className="w-4 h-4 text-purple-400" />
              Faculty
            </button>
            <button
              onClick={() => scrollTo('trending-section')}
              className="px-3.5 py-2 text-sm font-medium text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/50 transition-colors flex items-center gap-1.5"
            >
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              Trending
            </button>
            <button
              onClick={() => scrollTo('reviews-feed-section')}
              className="px-3.5 py-2 text-sm font-medium text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/50 transition-colors flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4 text-emerald-400" />
              Student Reviews
            </button>
            <button
              onClick={() => scrollTo('about-section')}
              className="px-3.5 py-2 text-sm font-medium text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/50 transition-colors"
            >
              About
            </button>
          </nav>

          {/* Desktop Search & Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Quick Search */}
            <div className="relative w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search faculty or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-900/80 border border-slate-700/60 rounded-xl text-slate-200 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/50 transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Submit Anonymous Review CTA */}
            <button
              onClick={handleOpenNewReview}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Write Review</span>
            </button>

            {/* Admin Portal Button */}
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors ${
                isAdminLoggedIn
                  ? 'border-purple-500 bg-purple-950/40 text-purple-300'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
              title="Admin & Moderation Portal"
            >
              <Shield className="w-4 h-4 text-purple-400" />
              {isAdminLoggedIn && <span className="hidden xl:inline text-[11px] font-bold">Admin Active</span>}
            </button>
          </div>

          {/* Mobile hamburger button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={handleOpenNewReview}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-purple-600 text-white flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Review</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#0B0F1E] px-4 pt-3 pb-6 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search faculty or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-900 border border-slate-700 rounded-xl text-slate-200"
            />
          </div>

          <div className="flex flex-col gap-1 pt-2">
            <button
              onClick={() => scrollTo('faculty-section')}
              className="text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800"
            >
              🎓 Faculty Profiles
            </button>
            <button
              onClick={() => scrollTo('trending-section')}
              className="text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800"
            >
              🔥 Trending Insights
            </button>
            <button
              onClick={() => scrollTo('reviews-feed-section')}
              className="text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800"
            >
              💬 Recent Student Reviews
            </button>
            <button
              onClick={() => scrollTo('about-section')}
              className="text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800"
            >
              ℹ️ About & Guidelines
            </button>
            <button
              onClick={() => {
                setIsAdminModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="text-left px-3 py-2.5 rounded-lg text-sm font-medium text-purple-400 hover:bg-slate-800 flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              Admin Portal
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
