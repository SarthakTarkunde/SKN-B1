import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ReviewCard } from './ReviewCard';
import {
  X,
  Star,
  ThumbsUp,
  MessageSquare,
  AlertCircle,
  PlusCircle,
  BookOpen,
  GraduationCap,
  Sparkles,
  BarChart3,
  CheckCircle,
  Info
} from 'lucide-react';

export const FacultyDetailModal: React.FC = () => {
  const {
    activeFacultyDetail,
    setActiveFacultyDetail,
    reviews,
    setIsReviewModalOpen,
    setSelectedFacultyForReview,
  } = useApp();

  const [starFilter, setStarFilter] = useState<number | null>(null);

  if (!activeFacultyDetail) return null;

  const fac = activeFacultyDetail;
  const facReviews = reviews.filter(
    (r) => r.facultyId === fac.id && r.status === 'approved'
  );

  const filteredReviews = starFilter
    ? facReviews.filter((r) => Math.round(r.overallRating) === starFilter)
    : facReviews;

  const handleOpenReview = () => {
    setSelectedFacultyForReview(fac);
    setIsReviewModalOpen(true);
  };

  const handleClose = () => {
    setActiveFacultyDetail(null);
  };

  const stats = fac.stats;
  const total = stats.totalReviews || 1; // avoid division by zero

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              rating >= star
                ? 'text-amber-400 fill-amber-400'
                : rating >= star - 0.5
                ? 'text-amber-400 fill-amber-400/50'
                : 'text-slate-600'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-[#0B0F1E] border border-purple-500/25 rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Header Bar */}
        <div className="p-6 sm:p-8 bg-gradient-to-r from-purple-950/70 via-slate-900 to-[#0B0F1E] border-b border-slate-800 relative">
          
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pr-10">
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 p-0.5 shadow-xl shrink-0">
                <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center font-heading font-black text-2xl text-purple-300">
                  {fac.name.charAt(0)}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-white">
                    {fac.name}
                  </h2>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold">
                    {fac.department}
                  </span>
                </div>
                <p className="text-sm text-slate-300 mt-1 flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-purple-400" />
                  <span>{fac.designation}</span>
                  {fac.experienceYears && (
                    <>
                      <span className="text-slate-600">•</span>
                      <span>~{fac.experienceYears} Years Teaching Experience</span>
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Quick Action */}
            <button
              onClick={handleOpenReview}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 shrink-0 transition-transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Rate Faculty</span>
            </button>
          </div>

          {/* Unconfirmed Identity Warning */}
          {fac.identityUnconfirmed && (
            <div className="mt-4 p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 flex items-center gap-2.5 text-amber-300 text-xs">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Note:</strong> Faculty identity currently unconfirmed in SKNCOE IT database records. Ratings represent student feedback for this course module.
              </span>
            </div>
          )}

          {/* Description & Subjects */}
          <p className="text-xs text-slate-300 mt-4 leading-relaxed max-w-3xl">
            {fac.description}
          </p>

          <div className="flex flex-wrap gap-2 mt-4">
            {fac.subjects.map((sub, i) => (
              <span
                key={i}
                className="text-xs px-3 py-1 rounded-xl bg-slate-800/80 text-slate-200 border border-slate-700/80 font-medium"
              >
                📚 {sub}
              </span>
            ))}
          </div>

        </div>

        {/* Satisfaction Dashboard Section */}
        <div className="p-6 sm:p-8 bg-[#070A14] border-b border-slate-800">
          
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-purple-400" />
            <h3 className="font-heading text-lg font-bold text-white tracking-wide">
              Satisfaction & Rating Dashboard
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* 1. Overall Score Box */}
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                  Overall Average Rating
                </span>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="font-heading text-4xl sm:text-5xl font-black text-white">
                    {stats.averageOverall.toFixed(1)}
                  </span>
                  <span className="text-sm font-semibold text-slate-400">/ 5.0</span>
                </div>
                <div className="mt-2">{renderStars(stats.averageOverall)}</div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>Total Verified Reviews:</span>
                  <span className="font-bold text-white">{stats.totalReviews}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-300 mt-1.5">
                  <span>Would Take Again:</span>
                  <span className="font-bold text-emerald-400">{stats.wouldTakeAgainPercent}%</span>
                </div>
              </div>
            </div>

            {/* 2. Sentiment Breakdown (Satisfied / Neutral / Dissatisfied) */}
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                  Student Sentiment Breakdown
                </span>

                <div className="mt-3 space-y-3">
                  {/* Satisfied */}
                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <span className="text-emerald-400 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        Satisfied (4-5 ★)
                      </span>
                      <span className="text-white font-bold">{stats.satisfactionPercentage}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-400 h-full rounded-full transition-all duration-700"
                        style={{ width: `${stats.satisfactionPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Neutral */}
                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <span className="text-amber-400 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        Neutral (3 ★)
                      </span>
                      <span className="text-white font-bold">{stats.neutralPercentage}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-amber-400 h-full rounded-full transition-all duration-700"
                        style={{ width: `${stats.neutralPercentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Dissatisfied */}
                  <div>
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <span className="text-rose-400 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-rose-400" />
                        Dissatisfied (1-2 ★)
                      </span>
                      <span className="text-white font-bold">{stats.dissatisfiedPercentage}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-rose-400 h-full rounded-full transition-all duration-700"
                        style={{ width: `${stats.dissatisfiedPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 mt-3 pt-3 border-t border-slate-800">
                Calculated dynamically from voluntary anonymous submissions.
              </p>
            </div>

            {/* 3. Star Distribution Chart (5★ to 1★) */}
            <div className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider block mb-3">
                Rating Distribution
              </span>

              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = stats.starDistribution[stars as 1 | 2 | 3 | 4 | 5] || 0;
                  const pct = stats.totalReviews > 0 ? Math.round((count / stats.totalReviews) * 100) : 0;
                  return (
                    <div
                      key={stars}
                      onClick={() => setStarFilter(starFilter === stars ? null : stars)}
                      className={`flex items-center gap-2 text-xs cursor-pointer p-1 rounded-lg hover:bg-slate-800/60 transition-colors ${
                        starFilter === stars ? 'bg-purple-950/50 text-purple-300' : 'text-slate-300'
                      }`}
                    >
                      <span className="w-6 font-semibold">{stars} ★</span>
                      <div className="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-indigo-400 h-full rounded-full transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-10 text-right text-[11px] text-slate-400">{count} ({pct}%)</span>
                    </div>
                  );
                })}
              </div>

              {starFilter && (
                <button
                  onClick={() => setStarFilter(null)}
                  className="mt-2 text-[11px] text-purple-400 hover:text-purple-300 underline block"
                >
                  Clear star filter
                </button>
              )}
            </div>

          </div>

          {/* 5 Parameters Detailed Breakdown Progress Bars */}
          <div className="mt-6 p-5 rounded-2xl bg-slate-900/50 border border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Parameter-Wise Performance Breakdown (Out of 5.0)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Teaching Quality</span>
                  <span className="text-purple-300 font-bold">{stats.teachingQuality.toFixed(1)} / 5</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-purple-500 h-full rounded-full"
                    style={{ width: `${(stats.teachingQuality / 5) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Concept Explanation</span>
                  <span className="text-indigo-300 font-bold">{stats.conceptExplanation.toFixed(1)} / 5</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-500 h-full rounded-full"
                    style={{ width: `${(stats.conceptExplanation / 5) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Doubt-Solving Ability</span>
                  <span className="text-cyan-300 font-bold">{stats.doubtSolving.toFixed(1)} / 5</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-cyan-500 h-full rounded-full"
                    style={{ width: `${(stats.doubtSolving / 5) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Student Interaction</span>
                  <span className="text-pink-300 font-bold">{stats.studentInteraction.toFixed(1)} / 5</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-pink-500 h-full rounded-full"
                    style={{ width: `${(stats.studentInteraction / 5) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Overall Satisfaction</span>
                  <span className="text-emerald-300 font-bold">{stats.overallSatisfaction.toFixed(1)} / 5</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full"
                    style={{ width: `${(stats.overallSatisfaction / 5) * 100}%` }}
                  />
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Student Reviews List */}
        <div className="p-6 sm:p-8 bg-[#0B0F1E]">
          
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-heading text-lg font-bold text-white">
                Student Reviews ({filteredReviews.length})
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Anonymous student experiences for {fac.name}
              </p>
            </div>

            <button
              onClick={handleOpenReview}
              className="px-3.5 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Write Review</span>
            </button>
          </div>

          {filteredReviews.length > 0 ? (
            <div className="space-y-4">
              {filteredReviews.map((rev) => (
                <ReviewCard key={rev.id} review={rev} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-4 rounded-2xl bg-slate-900/40 border border-slate-800">
              <MessageSquare className="w-10 h-10 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-300">No reviews found for this filter</p>
              <p className="text-xs text-slate-400 mt-1">
                Be the first SKNCOE IT student to share your experience with {fac.name}!
              </p>
              <button
                onClick={handleOpenReview}
                className="mt-4 px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-semibold hover:bg-purple-500"
              >
                Submit First Review
              </button>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle className="w-4 h-4" />
            <span>Identity Protection: Student submissions are strictly unlinked from names or PRNs.</span>
          </div>
          <button
            onClick={handleClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
          >
            Close
          </button>
        </div>

      </div>

    </div>
  );
};
