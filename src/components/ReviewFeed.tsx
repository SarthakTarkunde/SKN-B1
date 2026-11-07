import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ReviewCard } from './ReviewCard';
import {
  MessageSquare,
  Filter,
  SlidersHorizontal,
  PlusCircle,
  Sparkles,
  BookOpen
} from 'lucide-react';

export const ReviewFeed: React.FC = () => {
  const { faculty, reviews, setIsReviewModalOpen, setSelectedFacultyForReview } = useApp();

  const [selectedFacultyId, setSelectedFacultyId] = useState<string>('all');
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'highest'>('recent');

  const approvedReviews = reviews.filter((r) => r.status === 'approved');

  let filtered = approvedReviews.filter((r) => {
    if (selectedFacultyId !== 'all' && r.facultyId !== selectedFacultyId) {
      return false;
    }
    if (selectedRatingFilter !== 'all') {
      const targetStar = parseInt(selectedRatingFilter, 10);
      if (Math.round(r.overallRating) !== targetStar) return false;
    }
    return true;
  });

  filtered = filtered.sort((a, b) => {
    if (sortBy === 'helpful') {
      return b.helpfulVotes - a.helpfulVotes;
    }
    if (sortBy === 'highest') {
      return b.overallRating - a.overallRating;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleOpenNewReview = () => {
    setSelectedFacultyForReview(null);
    setIsReviewModalOpen(true);
  };

  return (
    <section id="reviews-feed-section" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/80">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2">
            <MessageSquare className="w-4 h-4" />
            <span>Campus Community Stream</span>
          </div>
          <h2 className="font-heading text-3xl font-bold text-white tracking-tight">
            Latest Student Reviews
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Read direct, unedited anonymous opinions and advice from IT classmates across all semesters.
          </p>
        </div>

        <button
          onClick={handleOpenNewReview}
          className="self-start md:self-auto px-4 py-2.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 text-xs font-semibold flex items-center gap-2 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Write a Review</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/90 mb-8 flex flex-wrap items-center justify-between gap-4 backdrop-blur-md">
        
        {/* Filter by Faculty */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-purple-400 shrink-0" />
          <span className="text-xs text-slate-400 font-medium">Faculty:</span>
          <select
            value={selectedFacultyId}
            onChange={(e) => setSelectedFacultyId(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-purple-500 cursor-pointer"
          >
            <option value="all">All IT Faculty ({approvedReviews.length})</option>
            {faculty.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} ({reviews.filter((r) => r.facultyId === f.id && r.status === 'approved').length})
              </option>
            ))}
          </select>
        </div>

        {/* Filter by Stars */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Rating:</span>
          <select
            value={selectedRatingFilter}
            onChange={(e) => setSelectedRatingFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-purple-500 cursor-pointer"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars Only</option>
            <option value="4">4 Stars Only</option>
            <option value="3">3 Stars Only</option>
            <option value="2">2 Stars Only</option>
            <option value="1">1 Star Only</option>
          </select>
        </div>

        {/* Sort by */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="text-xs text-slate-400 font-medium">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-purple-500 cursor-pointer"
          >
            <option value="recent">Most Recent</option>
            <option value="helpful">Most Helpful Upvotes</option>
            <option value="highest">Highest Rating</option>
          </select>
        </div>

      </div>

      {/* Reviews Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((rev) => (
            <ReviewCard key={rev.id} review={rev} showFacultyName={true} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 rounded-2xl bg-slate-900/40 border border-slate-800">
          <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="font-heading text-lg font-bold text-white">No Reviews Match Filters</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your faculty selection or rating filter to view more campus student feedback.
          </p>
          <button
            onClick={() => {
              setSelectedFacultyId('all');
              setSelectedRatingFilter('all');
            }}
            className="mt-4 px-4 py-2 text-xs font-semibold rounded-xl bg-purple-600/30 text-purple-300 border border-purple-500/40 hover:bg-purple-600/50"
          >
            Reset Filters
          </button>
        </div>
      )}

    </section>
  );
};
