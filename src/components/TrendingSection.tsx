import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Flame,
  Award,
  MessageSquare,
  Clock,
  Star,
  ChevronRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { Faculty } from '../types';

export const TrendingSection: React.FC = () => {
  const { faculty, reviews, setActiveFacultyDetail, setIsReviewModalOpen, setSelectedFacultyForReview } = useApp();

  // 1. Highest Rated
  const highestRated = [...faculty]
    .filter((f) => f.stats.totalReviews > 0)
    .sort((a, b) => b.stats.averageOverall - a.stats.averageOverall)[0];

  // 2. Most Reviewed
  const mostReviewed = [...faculty]
    .filter((f) => f.stats.totalReviews > 0)
    .sort((a, b) => b.stats.totalReviews - a.stats.totalReviews)[0];

  // 3. Recently Reviewed
  const latestApprovedReview = [...reviews]
    .filter((r) => r.status === 'approved')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];

  const recentlyReviewed = latestApprovedReview
    ? faculty.find((f) => f.id === latestApprovedReview.facultyId) || faculty[0]
    : faculty[0];

  const handleOpenDetail = (f: Faculty) => {
    setActiveFacultyDetail(f);
  };

  const handleOpenReview = (f: Faculty, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFacultyForReview(f);
    setIsReviewModalOpen(true);
  };

  const trendingCards = [
    {
      title: 'Highest Rated Faculty',
      subtitle: 'Top-tier student satisfaction & explanation rating',
      badge: '👑 Student Champion',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      icon: <Award className="w-5 h-5 text-amber-400" />,
      faculty: highestRated,
      highlightMetric: highestRated?.stats.averageOverall ? `${highestRated.stats.averageOverall} / 5.0` : 'N/A',
      metricLabel: 'Rating Average',
    },
    {
      title: 'Most Reviewed Faculty',
      subtitle: 'Highest volume of student opinions & feedback',
      badge: '🔥 High Campus Engagement',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      icon: <MessageSquare className="w-5 h-5 text-purple-400" />,
      faculty: mostReviewed,
      highlightMetric: mostReviewed?.stats.totalReviews ? `${mostReviewed.stats.totalReviews} Reviews` : '0 Reviews',
      metricLabel: 'Verified Submissions',
    },
    {
      title: 'Recently Reviewed',
      subtitle: 'Latest student experience shared on campus',
      badge: '⚡ Fresh Feedback',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      icon: <Clock className="w-5 h-5 text-cyan-400" />,
      faculty: recentlyReviewed,
      highlightMetric: recentlyReviewed?.stats.satisfactionPercentage ? `${recentlyReviewed.stats.satisfactionPercentage}%` : 'N/A',
      metricLabel: 'Satisfaction Rate',
    },
  ];

  return (
    <section id="trending-section" className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-400 mb-2">
            <TrendingUp className="w-4 h-4" />
            <span>Campus Pulse</span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white">
            Trending in SKNCOE IT
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Real-time highlights based on aggregate student feedback and satisfaction metrics.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {trendingCards.map((item, index) => {
          if (!item.faculty) return null;
          const fac = item.faculty;

          return (
            <div
              key={index}
              onClick={() => handleOpenDetail(fac)}
              className="skn-card p-6 rounded-2xl cursor-pointer group relative overflow-hidden border border-slate-800 hover:border-purple-500/40 transition-all flex flex-col justify-between"
            >
              {/* Subtle gradient background */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/5 rounded-full blur-2xl group-hover:bg-purple-600/15 transition-all" />

              <div>
                {/* Header Tag */}
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                  <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                    {item.icon}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-slate-400 font-medium">{item.title}</p>
                  <h3 className="font-heading text-xl font-bold text-white mt-1 group-hover:text-purple-300 transition-colors flex items-center gap-2">
                    {fac.name}
                    {fac.identityUnconfirmed && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Unconfirmed
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-1">
                    {fac.subjects.slice(0, 2).join(', ')}
                  </p>
                </div>

                {/* Metric pill */}
                <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between mb-5">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      {item.metricLabel}
                    </span>
                    <span className="text-lg font-bold text-white flex items-center gap-1.5 mt-0.5">
                      {item.highlightMetric}
                      {item.metricLabel === 'Rating Average' && (
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400 inline" />
                      )}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Satisfaction
                    </span>
                    <span className="text-base font-bold text-emerald-400 mt-0.5">
                      {fac.stats.satisfactionPercentage}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 gap-2">
                <span className="text-xs font-semibold text-purple-400 group-hover:text-purple-300 flex items-center gap-1">
                  View Full Dashboard <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
                <button
                  onClick={(e) => handleOpenReview(fac, e)}
                  className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-purple-600/30 hover:border-purple-500/40 text-slate-200 border border-slate-700 transition-all"
                >
                  Rate
                </button>
              </div>

            </div>
          );
        })}
      </div>
    </section>
  );
};
