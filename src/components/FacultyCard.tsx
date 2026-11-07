import React from 'react';
import { Faculty } from '../types';
import { useApp } from '../context/AppContext';
import {
  Star,
  MessageSquare,
  ThumbsUp,
  AlertCircle,
  BookOpen,
  ArrowRight,
  PlusCircle,
  Sparkles,
  HelpCircle,
  GraduationCap
} from 'lucide-react';

interface FacultyCardProps {
  faculty: Faculty;
}

export const FacultyCard: React.FC<FacultyCardProps> = ({ faculty }) => {
  const { setActiveFacultyDetail, setSelectedFacultyForReview, setIsReviewModalOpen } = useApp();

  const handleOpenReviews = () => {
    setActiveFacultyDetail(faculty);
  };

  const handleAddReview = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFacultyForReview(faculty);
    setIsReviewModalOpen(true);
  };

  // Color logic for satisfaction %
  const getSatisfactionColor = (pct: number) => {
    if (pct >= 85) return 'text-emerald-400 bg-emerald-950/40 border-emerald-500/30';
    if (pct >= 65) return 'text-blue-400 bg-blue-950/40 border-blue-500/30';
    if (pct >= 50) return 'text-amber-400 bg-amber-950/40 border-amber-500/30';
    return 'text-rose-400 bg-rose-950/40 border-rose-500/30';
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = rating >= star;
          const isHalf = !isFilled && rating >= star - 0.5;
          return (
            <Star
              key={star}
              className={`w-4 h-4 ${
                isFilled
                  ? 'text-amber-400 fill-amber-400'
                  : isHalf
                  ? 'text-amber-400 fill-amber-400/50'
                  : 'text-slate-600'
              }`}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="skn-card rounded-2xl p-6 flex flex-col justify-between group relative overflow-hidden">
      
      {/* Top Banner & Badges */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          
          {/* Avatar / Initial */}
          <div className="flex items-center gap-3">
            <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-purple-600/30 via-indigo-600/20 to-slate-800 border border-purple-500/30 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform p-3">
              <span className="font-heading font-black text-xl text-purple-300">
                {faculty.name.charAt(0)}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-heading font-bold text-lg text-white group-hover:text-purple-300 transition-colors">
                  {faculty.name}
                </h3>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <GraduationCap className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                <span className="truncate max-w-[200px]">{faculty.designation}</span>
              </p>
            </div>
          </div>

          {/* Department badge */}
          <span className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            {faculty.department}
          </span>
        </div>

        {/* Unconfirmed Identity Notice if applicable */}
        {faculty.identityUnconfirmed && (
          <div className="mb-4 px-3 py-2 rounded-xl bg-amber-950/40 border border-amber-500/30 flex items-center gap-2 text-amber-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
            <span className="leading-tight">Faculty identity currently unconfirmed by IT department admin.</span>
          </div>
        )}

        {/* Subjects taught */}
        <div className="mb-5">
          <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1.5 flex items-center gap-1">
            <BookOpen className="w-3 h-3 text-indigo-400" />
            Subjects Taught:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {faculty.subjects.map((sub, i) => (
              <span
                key={i}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-200 border border-slate-700/80 font-medium"
              >
                {sub}
              </span>
            ))}
          </div>
        </div>

        {/* Rating & Satisfaction Dashboard Preview */}
        <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/90 mb-5">
          {/* Average Rating */}
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-heading text-2xl font-black text-white">
                {faculty.stats.averageOverall.toFixed(1)}
              </span>
              <span className="text-xs text-slate-400">/ 5.0</span>
            </div>
            <div className="mt-1">
              {renderStars(faculty.stats.averageOverall)}
            </div>
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 font-medium">
              <MessageSquare className="w-3 h-3 text-purple-400" />
              {faculty.stats.totalReviews} {faculty.stats.totalReviews === 1 ? 'review' : 'reviews'}
            </p>
          </div>

          {/* Satisfaction Percentage */}
          <div className="border-l border-slate-800 pl-3 flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-semibold uppercase text-slate-400 block tracking-wider">
                Satisfaction
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`text-xl font-bold ${faculty.stats.satisfactionPercentage >= 75 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {faculty.stats.satisfactionPercentage}%
                </span>
                <ThumbsUp className="w-4 h-4 text-emerald-400" />
              </div>
            </div>

            {/* Satisfaction Bar */}
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(5, faculty.stats.satisfactionPercentage)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Quick Parameters Mini-breakdown */}
        <div className="space-y-1.5 mb-5 text-xs">
          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400 text-[11px]">Teaching Quality:</span>
            <span className="font-semibold text-slate-200">{faculty.stats.teachingQuality.toFixed(1)} ★</span>
          </div>
          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400 text-[11px]">Concept Explanation:</span>
            <span className="font-semibold text-slate-200">{faculty.stats.conceptExplanation.toFixed(1)} ★</span>
          </div>
          <div className="flex justify-between items-center text-slate-300">
            <span className="text-slate-400 text-[11px]">Doubt-solving Ability:</span>
            <span className="font-semibold text-slate-200">{faculty.stats.doubtSolving.toFixed(1)} ★</span>
          </div>
        </div>

      </div>

      {/* Action Buttons as explicitly requested: View Reviews & Add Review */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800">
        <button
          onClick={handleOpenReviews}
          className="px-3 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/80 border border-slate-700/90 hover:border-purple-500/40 text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-sm"
        >
          <span>View Reviews</span>
          <ArrowRight className="w-3.5 h-3.5 text-purple-400" />
        </button>

        <button
          onClick={handleAddReview}
          className="px-3 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-md shadow-purple-600/25 active:scale-95"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Add Review</span>
        </button>
      </div>

    </div>
  );
};
