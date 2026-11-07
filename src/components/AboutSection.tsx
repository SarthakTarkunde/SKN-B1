import React from 'react';
import {
  ShieldCheck,
  Lock,
  HeartHandshake,
  AlertTriangle,
  GraduationCap,
  Sparkles,
  CheckCircle,
  FileText
} from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about-section" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-800/80">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-3">
          <GraduationCap className="w-4 h-4" />
          <span>Platform Mission & Guidelines</span>
        </div>
        <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          About SKNCOE Faculty Reviews
        </h2>
        <p className="text-sm sm:text-base text-slate-300 mt-3 leading-relaxed">
          An independent, student-driven academic review community designed specifically for students of Sinhgad College of Engineering (SKNCOE), Information Technology Department.
        </p>
      </div>

      {/* 3 Pillars Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        
        {/* Pillar 1: Zero Personal Data */}
        <div className="skn-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-lg font-bold text-white mb-2">
              100% Student Anonymity
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              We never collect student names, Permanent Registration Numbers (PRNs), roll numbers, phone numbers, or email addresses. Feedback is completely unlinked to any student profile.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Zero PII Database Storage</span>
          </div>
        </div>

        {/* Pillar 2: Academic Focus */}
        <div className="skn-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-lg font-bold text-white mb-2">
              Constructive Peer Insights
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Reviews evaluate teaching pedagogy, concept clarity, doubt resolution, and lab mentorship to help juniors prepare effectively for SPPU university examinations and practical vivas.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px] text-purple-300 font-semibold">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>5-Parameter Evaluation System</span>
          </div>
        </div>

        {/* Pillar 3: Anti-Harassment Safeguard */}
        <div className="skn-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-heading text-lg font-bold text-white mb-2">
              Proactive Moderation
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Our automated word filter and community report workflows prevent abusive, defamatory, or threatening language. No faculty member may be targeted with personal attacks or unverified claims.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px] text-indigo-300 font-semibold">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Automated & Human Moderation</span>
          </div>
        </div>

      </div>

      {/* Institutional Disclaimer Banner */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-purple-500/30 backdrop-blur-md">
        <div className="flex items-start gap-3.5">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 space-y-2 leading-relaxed">
            <h4 className="font-heading font-bold text-sm text-white">
              Official Academic Notice & Institutional Disclaimer
            </h4>
            <p>
              <strong>SKNCOE Faculty Reviews</strong> is an independent student community resource. Ratings and comments published on this website represent voluntary student opinions and subjective experiences, not verified institutional performance appraisals by Sinhgad College of Engineering (SKNCOE), Sinhgad Institutes, or Savitribai Phule Pune University (SPPU).
            </p>
            <p className="text-slate-400">
              This forum is created to foster mutual academic respect and improve student preparedness. Any reviews containing defamatory statements, threats, or breaches of privacy are immediately removed per our anti-harassment policy.
            </p>
          </div>
        </div>
      </div>

    </section>
  );
};
