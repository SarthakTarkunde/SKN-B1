import React from 'react';
import { useApp } from '../context/AppContext';
import { FacultyCard } from './FacultyCard';
import { Users, Filter, SlidersHorizontal, Search, Sparkles } from 'lucide-react';

export const FacultyList: React.FC = () => {
  const {
    faculty,
    searchTerm,
    setSearchTerm,
    selectedFilter,
    setSelectedFilter,
    selectedSort,
    setSelectedSort,
  } = useApp();

  // Filter logic
  let filtered = faculty.filter((f) => {
    // Search filter
    const term = searchTerm.toLowerCase();
    const matchName = f.name.toLowerCase().includes(term);
    const matchSubjects = f.subjects.some((s) => s.toLowerCase().includes(term));
    const matchDept = f.department.toLowerCase().includes(term);
    const matchTags = f.tags?.some((t) => t.toLowerCase().includes(term)) || false;

    if (term && !matchName && !matchSubjects && !matchDept && !matchTags) {
      return false;
    }

    // Category filter
    if (selectedFilter === 'top_rated') {
      return f.stats.averageOverall >= 4.5;
    }
    if (selectedFilter === 'four_plus') {
      return f.stats.averageOverall >= 4.0;
    }
    if (selectedFilter === 'high_satisfaction') {
      return f.stats.satisfactionPercentage >= 85;
    }

    return true;
  });

  // Sort logic
  filtered = filtered.sort((a, b) => {
    if (selectedSort === 'highest_rated') {
      return b.stats.averageOverall - a.stats.averageOverall;
    }
    if (selectedSort === 'most_reviews') {
      return b.stats.totalReviews - a.stats.totalReviews;
    }
    if (selectedSort === 'satisfaction') {
      return b.stats.satisfactionPercentage - a.stats.satisfactionPercentage;
    }
    if (selectedSort === 'name_asc') {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  return (
    <section id="faculty-section" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-400 mb-2">
            <Users className="w-4 h-4" />
            <span>SKNCOE IT Faculty Directory</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Faculty Ratings & Feedback
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-xl">
            Explore authentic academic evaluations, review teaching quality, explanation methods, and student satisfaction.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setSelectedFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedFilter === 'all'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            All Faculty ({faculty.length})
          </button>
          <button
            onClick={() => setSelectedFilter('top_rated')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedFilter === 'top_rated'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            ⭐ 4.5+ Stars
          </button>
          <button
            onClick={() => setSelectedFilter('high_satisfaction')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedFilter === 'high_satisfaction'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            👍 &gt;85% Satisfied
          </button>
        </div>
      </div>

      {/* Search & Sort Controls Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/90 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-md">
        
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search faculty name or subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-950/70 border border-slate-700/70 rounded-xl text-slate-200 placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <SlidersHorizontal className="w-4 h-4 text-purple-400" />
          <span className="text-xs text-slate-400 font-medium">Sort by:</span>
          <select
            value={selectedSort}
            onChange={(e) => setSelectedSort(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-950/70 border border-slate-700/70 rounded-xl text-slate-200 focus:outline-none focus:border-purple-500 cursor-pointer"
          >
            <option value="highest_rated">Highest Rated (★)</option>
            <option value="most_reviews">Most Reviews</option>
            <option value="satisfaction">Satisfaction %</option>
            <option value="name_asc">Name (A-Z)</option>
          </select>
        </div>

      </div>

      {/* Grid of Faculty Cards */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((fac) => (
            <FacultyCard key={fac.id} faculty={fac} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 px-4 rounded-2xl bg-slate-900/40 border border-slate-800">
          <Users className="w-12 h-12 text-slate-500 mx-auto mb-3 opacity-60" />
          <h3 className="font-heading text-lg font-bold text-white">No Faculty Found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            No faculty match your search for "{searchTerm}". Try clearing your filters or search terms.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedFilter('all');
            }}
            className="mt-4 px-4 py-2 text-xs font-semibold rounded-xl bg-purple-600/30 text-purple-300 border border-purple-500/40 hover:bg-purple-600/40"
          >
            Reset Filters
          </button>
        </div>
      )}

    </section>
  );
};
