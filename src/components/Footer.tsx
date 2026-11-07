import React from 'react';
import { useApp } from '../context/AppContext';
import { GraduationCap, Heart, Shield, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setIsReviewModalOpen, setSelectedFacultyForReview, setIsAdminModalOpen } = useApp();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenReview = () => {
    setSelectedFacultyForReview(null);
    setIsReviewModalOpen(true);
  };

  return (
    <footer className="bg-[#05070E] border-t border-slate-800/80 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Col 1: Brand */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={scrollToTop}>
              <div className="w-9 h-9 rounded-xl bg-purple-600/30 border border-purple-500/40 flex items-center justify-center text-purple-300">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-heading font-bold text-lg text-white">
                SKNCOE Faculty Reviews
              </span>
            </div>
            <p className="text-slate-400 text-xs max-w-sm leading-relaxed">
              Sinhgad College of Engineering, Vadgaon (Bk), Pune — Department of Information Technology. An independent, student-led academic rating and anonymous feedback portal.
            </p>
            <div className="flex items-center gap-2 text-slate-500 text-[11px]">
              <span>🔒 100% Student Privacy Preserved</span>
              <span>•</span>
              <span>Zero PII Tracked</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-200 mb-3">
              Navigation
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="#faculty-section" className="hover:text-purple-400 transition-colors">
                  IT Faculty Directory
                </a>
              </li>
              <li>
                <a href="#trending-section" className="hover:text-purple-400 transition-colors">
                  Trending Insights
                </a>
              </li>
              <li>
                <a href="#reviews-feed-section" className="hover:text-purple-400 transition-colors">
                  Community Reviews
                </a>
              </li>
              <li>
                <a href="#about-section" className="hover:text-purple-400 transition-colors">
                  Guidelines & Disclaimer
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Actions & Admin */}
          <div>
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-200 mb-3">
              Student Actions
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={handleOpenReview}
                  className="hover:text-purple-400 transition-colors text-left"
                >
                  ✍️ Submit Anonymous Review
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsAdminModalOpen(true)}
                  className="hover:text-purple-400 transition-colors flex items-center gap-1.5 text-left"
                >
                  <Shield className="w-3.5 h-3.5 text-purple-400" />
                  <span>Admin & Moderation</span>
                </button>
              </li>
              <li>
                <button
                  onClick={scrollToTop}
                  className="hover:text-purple-400 transition-colors flex items-center gap-1"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                  <span>Back to top</span>
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>
            © {new Date().getFullYear()} SKNCOE Faculty Reviews. Created for students of Sinhgad College of Engineering, Pune.
          </p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> for the SKNCOE IT Student Community
          </p>
        </div>
      </div>
    </footer>
  );
};
