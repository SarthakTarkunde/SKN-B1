import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ReviewReport } from '../types';
import {
  X,
  AlertTriangle,
  Flag,
  ShieldAlert,
  Send,
  CheckCircle2
} from 'lucide-react';

export const ReportModal: React.FC = () => {
  const {
    isReportModalOpen,
    setIsReportModalOpen,
    selectedReviewForReport,
    setSelectedReviewForReport,
    reportReview,
  } = useApp();

  const [reason, setReason] = useState<ReviewReport['reason']>('harassment');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isReportModalOpen || !selectedReviewForReport) return null;

  const rev = selectedReviewForReport;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    reportReview(rev.id, reason, comment);

    setIsSubmitting(false);
    setIsReportModalOpen(false);
    setSelectedReviewForReport(null);
  };

  const handleClose = () => {
    setIsReportModalOpen(false);
    setSelectedReviewForReport(null);
  };

  const reportReasons: { id: ReviewReport['reason']; title: string; desc: string }[] = [
    {
      id: 'harassment',
      title: 'Harassment or Threatening Language',
      desc: 'Contains threats, intimidation, or aggressive behavior toward faculty.',
    },
    {
      id: 'personal_attack',
      title: 'Personal Attack or Slurs',
      desc: 'Targets personal character, looks, or non-academic attributes rather than coursework.',
    },
    {
      id: 'false_allegation',
      title: 'Unverified Allegation or Defamation',
      desc: 'Makes unsubstantiated serious claims or rumors without academic basis.',
    },
    {
      id: 'abusive_language',
      title: 'Abusive or Inappropriate Words',
      desc: 'Uses profanity, hate speech, or vulgar expressions.',
    },
    {
      id: 'spam',
      title: 'Spam or Duplicate Post',
      desc: 'Nonsense, promotional content, or repeated copy-pasting.',
    },
    {
      id: 'other',
      title: 'Other Guideline Violation',
      desc: 'Breaches general SKNCOE academic community standards.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-lg bg-[#0B0F1E] border border-rose-500/30 rounded-3xl shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-rose-950/70 via-slate-900 to-[#0B0F1E] border-b border-slate-800 relative">
          <button
            onClick={handleClose}
            className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs font-semibold uppercase text-rose-400 tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4" />
            <span>Community Moderation</span>
          </div>

          <h2 className="font-heading text-xl font-bold text-white">
            Report Inappropriate Review
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Help us maintain a constructive, respectful platform for SKNCOE IT faculty and students.
          </p>
        </div>

        {/* Target Review Snippet */}
        <div className="px-6 py-3 bg-slate-900/60 border-b border-slate-800 text-xs text-slate-300">
          <p className="font-semibold text-purple-300">Target Faculty: {rev.facultyName}</p>
          <p className="text-slate-400 line-clamp-2 mt-0.5 italic">
            "{rev.likedText || rev.improvementText}"
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Reason for Reporting
            </label>
            <div className="space-y-2">
              {reportReasons.map((item) => (
                <label
                  key={item.id}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    reason === item.id
                      ? 'bg-rose-950/40 border-rose-500 text-rose-200'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="reportReason"
                    value={item.id}
                    checked={reason === item.id}
                    onChange={() => setReason(item.id)}
                    className="mt-1 text-rose-500 focus:ring-rose-500"
                  />
                  <div>
                    <p className="text-xs font-bold">{item.title}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">{item.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Additional Details (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="Provide context on why this review violates guidelines..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-rose-500 placeholder-slate-500"
            />
          </div>

          {/* Policy assurance */}
          <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800 flex items-center gap-2 text-xs text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Reported reviews are automatically hidden from the public feed until evaluated by a moderator.
            </span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-transform active:scale-95"
            >
              <Flag className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Reporting...' : 'Submit Report'}</span>
            </button>
          </div>

        </form>

      </div>

    </div>
  );
};
