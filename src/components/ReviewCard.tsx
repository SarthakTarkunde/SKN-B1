import React from 'react';
import { Review } from '../types';
import { useApp } from '../context/AppContext';
import {
  Star,
  ThumbsUp,
  Flag,
  Calendar,
  CheckCircle2,
  BookOpen,
  Sparkles,
  HelpCircle,
  Clock,
  ShieldCheck
} from 'lucide-react';

interface ReviewCardProps {
  review: Review;
  showFacultyName?: boolean;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review, showFacultyName = false }) => {
  const { voteHelpful, setSelectedReviewForReport, setIsReportModalOpen } = useApp();

  const handleReport = () => {
    setSelectedReviewForReport(review);
    setIsReportModalOpen(true);
  };

  const formattedDate = new Date(review.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  // Sentiment classification
  const isSatisfied = review.overallRating >= 4;
  const isNeutral = review.overallRating === 3;

  return (
    <div className="skn-card rounded-2xl p-5 border border-slate-800 hover:border-purple-500/30 transition-all flex flex-col justify-between">
      
      {/* Top Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-300 font-bold text-sm shadow-sm">
              <ShieldCheck className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-heading font-semibold text-sm text-slate-100">
                  {review.studentAlias}
                </span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  {review.experienceLevel}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                <Calendar className="w-3 h-3 text-slate-500" />
                <span>{formattedDate}</span>
                <span className="text-slate-600">•</span>
                <span className="text-emerald-400 font-medium">Verified Anonymous</span>
              </p>
            </div>
          </div>

          {/* Overall Rating Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-900 border border-slate-700/80">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="font-heading font-bold text-sm text-white">{review.overallRating}.0</span>
          </div>
        </div>

        {/* Faculty Name (if displayed in global reviews feed) */}
        {showFacultyName && (
          <div className="mb-3 px-3 py-1.5 rounded-xl bg-purple-950/30 border border-purple-500/20 text-xs flex items-center justify-between">
            <span className="text-slate-400">Review for:</span>
            <span className="font-semibold text-purple-300">{review.facultyName}</span>
          </div>
        )}

        {/* Subject and Course tag */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="text-xs px-2.5 py-0.5 rounded-lg bg-indigo-950/50 text-indigo-300 border border-indigo-500/30 font-medium flex items-center gap-1">
            <BookOpen className="w-3 h-3 text-indigo-400" />
            {review.subject}
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700/80">
            Attendance: {review.attendanceStrictness}
          </span>
          {review.wouldTakeAgain === 'yes' && (
            <span className="text-[11px] px-2 py-0.5 rounded-lg bg-emerald-950/40 text-emerald-300 border border-emerald-500/30">
              ✓ Would Take Again
            </span>
          )}
        </div>

        {/* 5 Parameters Rating Mini Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 mb-4 text-[11px]">
          <div>
            <span className="text-slate-400 block text-[10px]">Teaching Quality</span>
            <span className="font-semibold text-slate-200">{review.ratings.teachingQuality} / 5 ★</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Concept Explanation</span>
            <span className="font-semibold text-slate-200">{review.ratings.conceptExplanation} / 5 ★</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Doubt-Solving</span>
            <span className="font-semibold text-slate-200">{review.ratings.doubtSolving} / 5 ★</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Student Interaction</span>
            <span className="font-semibold text-slate-200">{review.ratings.studentInteraction} / 5 ★</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px]">Satisfaction</span>
            <span className="font-semibold text-slate-200">{review.ratings.overallSatisfaction} / 5 ★</span>
          </div>
        </div>

        {/* Review Comments: What I Liked */}
        {review.likedText && (
          <div className="mb-3.5 p-3.5 rounded-xl bg-slate-900/60 border-l-2 border-l-emerald-500 border border-slate-800/80">
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              What I Liked:
            </p>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              "{review.likedText}"
            </p>
          </div>
        )}

        {/* Review Comments: What Could Be Improved */}
        {review.improvementText && (
          <div className="mb-4 p-3.5 rounded-xl bg-slate-900/60 border-l-2 border-l-purple-500 border border-slate-800/80">
            <p className="text-[11px] font-bold uppercase tracking-wider text-purple-400 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Areas for Improvement:
            </p>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              "{review.improvementText}"
            </p>
          </div>
        )}

        {/* Tags */}
        {review.tags && review.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {review.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] px-2 py-0.5 rounded-md bg-purple-950/40 text-purple-300 border border-purple-500/20 font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

      </div>

      {/* Footer: Helpful upvote & Report button */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
        <button
          onClick={() => voteHelpful(review.id)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-purple-950/50 text-slate-300 hover:text-purple-300 border border-slate-800 hover:border-purple-500/30 transition-all font-medium"
        >
          <ThumbsUp className="w-3.5 h-3.5" />
          <span>Helpful ({review.helpfulVotes})</span>
        </button>

        <button
          onClick={handleReport}
          className="flex items-center gap-1 text-slate-400 hover:text-rose-400 transition-colors p-1"
          title="Report inappropriate review"
        >
          <Flag className="w-3.5 h-3.5" />
          <span className="text-[11px]">Report</span>
        </button>
      </div>

    </div>
  );
};
