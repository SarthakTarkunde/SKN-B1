import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  Star,
  ShieldCheck,
  AlertTriangle,
  Send,
  HelpCircle,
  Sparkles,
  CheckCircle2,
  Lock,
  ThumbsUp
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ReviewModal: React.FC = () => {
  const {
    faculty,
    isReviewModalOpen,
    setIsReviewModalOpen,
    selectedFacultyForReview,
    setSelectedFacultyForReview,
    addReview,
  } = useApp();

  const [facultyId, setFacultyId] = useState('');
  const [subject, setSubject] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('TE - IT (Semester 5)');
  
  // 5 parameters
  const [teachingQuality, setTeachingQuality] = useState(5);
  const [conceptExplanation, setConceptExplanation] = useState(5);
  const [doubtSolving, setDoubtSolving] = useState(5);
  const [studentInteraction, setStudentInteraction] = useState(5);
  const [overallSatisfaction, setOverallSatisfaction] = useState(5);

  // Overall rating
  const [overallRating, setOverallRating] = useState(5);

  const [likedText, setLikedText] = useState('');
  const [improvementText, setImprovementText] = useState('');
  const [wouldTakeAgain, setWouldTakeAgain] = useState<'yes' | 'maybe' | 'no'>('yes');
  const [attendanceStrictness, setAttendanceStrictness] = useState<'High' | 'Moderate' | 'Relaxed'>('Moderate');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill selected faculty if opened from a specific card
  useEffect(() => {
    if (selectedFacultyForReview) {
      setFacultyId(selectedFacultyForReview.id);
      if (selectedFacultyForReview.subjects.length > 0) {
        setSubject(selectedFacultyForReview.subjects[0]);
      }
    } else if (faculty.length > 0 && !facultyId) {
      setFacultyId(faculty[0].id);
      setSubject(faculty[0].subjects[0] || '');
    }
  }, [selectedFacultyForReview, faculty]);

  // Update subject suggestions when faculty changes
  const currentFaculty = faculty.find((f) => f.id === facultyId);

  const handleFacultyChange = (id: string) => {
    setFacultyId(id);
    const found = faculty.find((f) => f.id === id);
    if (found && found.subjects.length > 0) {
      setSubject(found.subjects[0]);
    } else {
      setSubject('');
    }
  };

  // Recalculate average overall rating when parameters change
  useEffect(() => {
    const avg = (teachingQuality + conceptExplanation + doubtSolving + studentInteraction + overallSatisfaction) / 5;
    setOverallRating(Math.round(avg));
  }, [teachingQuality, conceptExplanation, doubtSolving, studentInteraction, overallSatisfaction]);

  const availableTags = [
    'SPPU Exam Oriented',
    'Clear Notes',
    'High Subject Knowledge',
    'Approachable',
    'Detailed Diagrams',
    'Strict Attendance',
    'Supportive in Viva',
    'Helpful in Labs',
    'Engaging Lectures',
    'Fair Grading',
    'Punctual',
    'Industry Oriented'
  ];

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!facultyId) return;

    if (!likedText.trim() && !improvementText.trim()) {
      alert('Please share at least a sentence on what you liked or what could be improved.');
      return;
    }

    setIsSubmitting(true);

    const facultyObj = faculty.find((f) => f.id === facultyId);
    const result = addReview({
      facultyId,
      facultyName: facultyObj ? facultyObj.name : 'Unknown Faculty',
      subject: subject.trim() || 'General IT Course',
      overallRating,
      ratings: {
        teachingQuality,
        conceptExplanation,
        doubtSolving,
        studentInteraction,
        overallSatisfaction,
      },
      experienceLevel,
      likedText: likedText.trim(),
      improvementText: improvementText.trim(),
      wouldTakeAgain,
      attendanceStrictness,
      tags: selectedTags,
    });

    setIsSubmitting(false);

    if (result.success) {
      // Fire celebratory confetti if high rating
      if (overallRating >= 4) {
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {}
      }

      // Reset form
      setLikedText('');
      setImprovementText('');
      setSelectedTags([]);
      setIsReviewModalOpen(false);
      setSelectedFacultyForReview(null);
    }
  };

  const handleClose = () => {
    setIsReviewModalOpen(false);
    setSelectedFacultyForReview(null);
  };

  // Star selector helper
  const renderStarInput = (value: number, onChange: (val: number) => void, label: string) => {
    return (
      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
        <span className="text-xs text-slate-300 font-medium">{label}</span>
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              onClick={() => onChange(star)}
              className="p-1 focus:outline-none transition-transform hover:scale-125"
            >
              <Star
                className={`w-5 h-5 ${
                  value >= star
                    ? 'text-amber-400 fill-amber-400'
                    : 'text-slate-600 hover:text-amber-400/50'
                }`}
              />
            </button>
          ))}
          <span className="text-xs font-bold text-amber-300 w-5 text-right">{value}</span>
        </div>
      </div>
    );
  };

  if (!isReviewModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-2xl bg-[#0B0F1E] border border-purple-500/30 rounded-3xl shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-purple-950/80 via-slate-900 to-[#0B0F1E] border-b border-slate-800 relative">
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold uppercase text-purple-400 tracking-wider mb-1">
            <Lock className="w-3.5 h-3.5" />
            <span>100% Anonymous Feedback</span>
          </div>

          <h2 className="font-heading text-2xl font-bold text-white">
            Submit Anonymous Faculty Review
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Your identity is never collected or displayed. Help fellow SKNCOE IT peers with your constructive experiences.
          </p>
        </div>

        {/* Disclaimer Banner */}
        <div className="px-6 py-3.5 bg-purple-950/40 border-b border-purple-500/20 flex items-start gap-3 text-xs text-purple-200">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Community Disclaimer:</strong> Please keep reviews respectful, constructive, and based on genuine academic experiences. Personal attacks, threats, and abusive language are not allowed.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Faculty Selector & Subject */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Select Faculty <span className="text-purple-400">*</span>
              </label>
              <select
                value={facultyId}
                onChange={(e) => handleFacultyChange(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-purple-500 font-medium"
              >
                {faculty.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} {f.identityUnconfirmed ? '(Unconfirmed)' : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Subject / Course (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Operating Systems / DBMS"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Academic Semester / Year */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Your Academic Standing (Anonymous Tag)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                'SE - IT (Sem 3)',
                'SE - IT (Sem 4)',
                'TE - IT (Sem 5)',
                'TE - IT (Sem 6)',
                'BE - IT (Sem 7)',
                'BE - IT (Sem 8)',
                'Passout / Alumni',
                'FE - Student'
              ].map((standing) => (
                <button
                  type="button"
                  key={standing}
                  onClick={() => setExperienceLevel(standing)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border text-center transition-all ${
                    experienceLevel === standing
                      ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/25'
                      : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {standing}
                </button>
              ))}
            </div>
          </div>

          {/* 5 Star Rating Parameters Section */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Rate Specific Parameters (1–5 Stars)
              </label>
              <span className="text-xs text-purple-400 font-bold">
                Calculated Overall: {overallRating}.0 ★
              </span>
            </div>

            <div className="space-y-2">
              {renderStarInput(teachingQuality, setTeachingQuality, '1. Teaching Quality')}
              {renderStarInput(conceptExplanation, setConceptExplanation, '2. Concept Explanation')}
              {renderStarInput(doubtSolving, setDoubtSolving, '3. Doubt-solving Ability')}
              {renderStarInput(studentInteraction, setStudentInteraction, '4. Student Interaction')}
              {renderStarInput(overallSatisfaction, setOverallSatisfaction, '5. Overall Satisfaction')}
            </div>
          </div>

          {/* Additional Preferences: Would take again? & Attendance */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Would you recommend taking this faculty?
              </label>
              <div className="flex gap-2">
                {[
                  { id: 'yes', label: 'Yes 👍' },
                  { id: 'maybe', label: 'Maybe 🤷' },
                  { id: 'no', label: 'No 👎' },
                ].map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => setWouldTakeAgain(item.id as any)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      wouldTakeAgain === item.id
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Attendance Strictness
              </label>
              <div className="flex gap-2">
                {(['High', 'Moderate', 'Relaxed'] as const).map((level) => (
                  <button
                    type="button"
                    key={level}
                    onClick={() => setAttendanceStrictness(level)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      attendanceStrictness === level
                        ? 'bg-purple-600 text-white border-purple-500'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Descriptive Feedback: What I Liked */}
          <div>
            <label className="block text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              What do you like about this faculty?
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Explains practical applications well, very supportive in labs, provides clear exam guidance..."
              value={likedText}
              onChange={(e) => setLikedText(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-100 text-xs focus:outline-none focus:border-emerald-500 placeholder-slate-500 leading-relaxed"
            />
          </div>

          {/* Descriptive Feedback: What Could Be Improved */}
          <div>
            <label className="block text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              What could be improved?
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Could pace lectures slightly slower in complex topics, more live terminal coding examples..."
              value={improvementText}
              onChange={(e) => setImprovementText(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-100 text-xs focus:outline-none focus:border-purple-500 placeholder-slate-500 leading-relaxed"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Select Relevant Tags
            </label>
            <div className="flex flex-wrap gap-1.5">
              {availableTags.map((tag) => {
                const active = selectedTags.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                      active
                        ? 'bg-purple-600 text-white border-purple-500 shadow-sm'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    #{tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Anonymity Security Notice */}
          <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 flex items-center gap-2.5 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Your submission will be published as an anonymous student review. No student name, PRN, or email is ever stored.
            </span>
          </div>

          {/* Submit CTA */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-purple-600/30 transition-transform active:scale-95 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Verifying...' : 'Submit Anonymous Review'}</span>
            </button>
          </div>

        </form>

      </div>

    </div>
  );
};
