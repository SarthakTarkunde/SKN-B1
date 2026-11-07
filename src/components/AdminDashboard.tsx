import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Faculty, Review, ReviewStatus } from '../types';
import {
  X,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Trash2,
  Edit,
  Plus,
  RefreshCw,
  Lock,
  Download,
  Users,
  MessageSquare,
  AlertCircle,
  Save,
  Check
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    faculty,
    reviews,
    reports,
    isAdminModalOpen,
    setIsAdminModalOpen,
    isAdminLoggedIn,
    setIsAdminLoggedIn,
    moderateReview,
    deleteReview,
    resolveReport,
    updateFaculty,
    addFaculty,
    deleteFaculty,
    resetToDefaultData,
  } = useApp();

  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState<'reviews' | 'faculty' | 'reports' | 'data'>('reviews');
  const [reviewFilter, setReviewFilter] = useState<'all' | 'flagged' | 'pending' | 'approved' | 'rejected'>('flagged');

  // Faculty edit state
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [isAddingFaculty, setIsAddingFaculty] = useState(false);
  const [newFacultyForm, setNewFacultyForm] = useState({
    name: '',
    department: 'Information Technology',
    subjects: '',
    designation: 'Assistant Professor',
    description: '',
    identityUnconfirmed: false,
    experienceYears: 5,
    tags: 'IT, Engineering',
  });

  if (!isAdminModalOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === 'skncoe2025' || pinInput === 'admin123' || pinInput === 'admin') {
      setIsAdminLoggedIn(true);
      setPinError(false);
      setPinInput('');
    } else {
      setPinError(true);
    }
  };

  const handleDemoLogin = () => {
    setIsAdminLoggedIn(true);
    setPinError(false);
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
  };

  const handleClose = () => {
    setIsAdminModalOpen(false);
    setEditingFaculty(null);
    setIsAddingFaculty(false);
  };

  // Save edited faculty
  const handleSaveFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaculty) return;

    updateFaculty(editingFaculty);
    setEditingFaculty(null);
  };

  // Add new faculty
  const handleCreateFaculty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFacultyForm.name.trim()) return;

    const subjectsArray = newFacultyForm.subjects
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const tagsArray = newFacultyForm.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    addFaculty({
      id: `fac-${Date.now()}`,
      name: newFacultyForm.name.trim(),
      department: newFacultyForm.department.trim(),
      subjects: subjectsArray.length > 0 ? subjectsArray : ['Information Technology Course'],
      designation: newFacultyForm.designation.trim(),
      description: newFacultyForm.description.trim() || 'Faculty member in the Department of Information Technology at SKNCOE.',
      identityUnconfirmed: newFacultyForm.identityUnconfirmed,
      experienceYears: Number(newFacultyForm.experienceYears) || 5,
      tags: tagsArray,
    });

    setIsAddingFaculty(false);
    setNewFacultyForm({
      name: '',
      department: 'Information Technology',
      subjects: '',
      designation: 'Assistant Professor',
      description: '',
      identityUnconfirmed: false,
      experienceYears: 5,
      tags: 'IT, Engineering',
    });
  };

  // Export JSON backup
  const handleExportData = () => {
    const data = {
      faculty,
      reviews,
      reports,
      exportTimestamp: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `skncoe-reviews-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredReviews = reviews.filter((r) => {
    if (reviewFilter === 'all') return true;
    return r.status === reviewFilter;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-5xl bg-[#0B0F1E] border border-purple-500/30 rounded-3xl shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-purple-950 via-slate-900 to-[#0B0F1E] border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-600/30 border border-purple-500/40 text-purple-300">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading text-xl font-bold text-white">
                  SKNCOE Admin & Moderation Portal
                </h2>
                {isAdminLoggedIn && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Authenticated
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Faculty profile management, content moderation, and anti-harassment safeguards.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdminLoggedIn && (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300"
              >
                Sign Out
              </button>
            )}
            <button
              onClick={handleClose}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Not Logged In View */}
        {!isAdminLoggedIn ? (
          <div className="p-8 text-center max-w-md mx-auto my-auto">
            <div className="w-16 h-16 rounded-3xl bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-400 mx-auto mb-4">
              <Lock className="w-8 h-8" />
            </div>
            <h3 className="font-heading text-xl font-bold text-white mb-2">
              Staff & Moderator Access
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              Enter administrator passcode to edit faculty directory entries or review flagged student submissions.
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  placeholder="Enter passcode (e.g. skncoe2025)"
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setPinError(false);
                  }}
                  className={`w-full px-4 py-3 rounded-xl bg-slate-900 border text-white text-center tracking-widest text-sm focus:outline-none ${
                    pinError
                      ? 'border-rose-500 ring-1 ring-rose-500'
                      : 'border-slate-700 focus:border-purple-500'
                  }`}
                />
                {pinError && (
                  <p className="text-xs text-rose-400 mt-1.5">
                    Invalid passcode. Default is <code className="text-purple-300">skncoe2025</code>
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-purple-600/30"
              >
                Sign In to Admin Portal
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-slate-800">
              <button
                onClick={handleDemoLogin}
                className="text-xs text-purple-400 hover:text-purple-300 underline font-medium"
              >
                ⚡ 1-Click Demo Login (for review & testing)
              </button>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex-1 flex flex-col min-h-0">
            
            {/* Tabs Navigation */}
            <div className="px-6 bg-slate-950 border-b border-slate-800 flex items-center justify-between gap-4 shrink-0 overflow-x-auto">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`px-4 py-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                    activeTab === 'reviews'
                      ? 'border-purple-500 text-purple-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Review Moderation ({reviews.filter((r) => r.status === 'flagged').length} Flagged)</span>
                </button>

                <button
                  onClick={() => setActiveTab('faculty')}
                  className={`px-4 py-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                    activeTab === 'faculty'
                      ? 'border-purple-500 text-purple-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Faculty Directory ({faculty.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('reports')}
                  className={`px-4 py-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                    activeTab === 'reports'
                      ? 'border-purple-500 text-purple-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <AlertCircle className="w-4 h-4" />
                  <span>Student Reports ({reports.filter((rep) => rep.status === 'pending').length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('data')}
                  className={`px-4 py-3.5 text-xs font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap ${
                    activeTab === 'data'
                      ? 'border-purple-500 text-purple-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Download className="w-4 h-4" />
                  <span>Data & System</span>
                </button>
              </div>

              {activeTab === 'faculty' && (
                <button
                  onClick={() => setIsAddingFaculty(!isAddingFaculty)}
                  className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAddingFaculty ? 'Cancel' : 'Add New Faculty'}</span>
                </button>
              )}
            </div>

            {/* Tab 1: Review Moderation */}
            {activeTab === 'reviews' && (
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                
                {/* Filter pills */}
                <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    {(['all', 'flagged', 'pending', 'approved', 'rejected'] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => setReviewFilter(st)}
                        className={`text-xs px-3 py-1 rounded-lg capitalize font-medium ${
                          reviewFilter === st
                            ? 'bg-purple-600 text-white'
                            : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                        }`}
                      >
                        {st} ({reviews.filter((r) => (st === 'all' ? true : r.status === st)).length})
                      </button>
                    ))}
                  </div>
                  <span className="text-xs text-slate-400">
                    Showing {filteredReviews.length} reviews
                  </span>
                </div>

                {filteredReviews.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    No reviews in the <span className="text-purple-300 font-bold uppercase">{reviewFilter}</span> queue.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredReviews.map((rev) => (
                      <div
                        key={rev.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          rev.status === 'flagged'
                            ? 'bg-amber-950/20 border-amber-500/40'
                            : rev.status === 'rejected'
                            ? 'bg-rose-950/20 border-rose-500/40'
                            : 'bg-slate-900/60 border-slate-800'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <span className="text-xs font-bold text-purple-300">
                              {rev.facultyName}
                            </span>
                            <span className="text-slate-400 text-xs ml-2">
                              • {rev.subject} • {rev.studentAlias}
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                                rev.status === 'approved'
                                  ? 'bg-emerald-500/20 text-emerald-300'
                                  : rev.status === 'flagged'
                                  ? 'bg-amber-500/20 text-amber-300'
                                  : 'bg-rose-500/20 text-rose-300'
                              }`}
                            >
                              {rev.status}
                            </span>
                            <span className="text-xs font-bold text-amber-400">
                              {rev.overallRating} ★
                            </span>
                          </div>
                        </div>

                        {rev.moderationNotes && (
                          <div className="mb-2 p-2 rounded-lg bg-amber-950/50 border border-amber-500/30 text-[11px] text-amber-200">
                            <strong>Moderation Warning:</strong> {rev.moderationNotes}
                          </div>
                        )}

                        <div className="text-xs space-y-1 mb-3">
                          {rev.likedText && (
                            <p className="text-slate-300">
                              <strong className="text-emerald-400">Liked:</strong> "{rev.likedText}"
                            </p>
                          )}
                          {rev.improvementText && (
                            <p className="text-slate-300">
                              <strong className="text-purple-400">Improvement:</strong> "{rev.improvementText}"
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                          <span className="text-[10px] text-slate-400">
                            Submitted: {new Date(rev.createdAt).toLocaleString()}
                          </span>

                          <div className="flex items-center gap-2">
                            {rev.status !== 'approved' && (
                              <button
                                onClick={() => moderateReview(rev.id, 'approved')}
                                className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium flex items-center gap-1"
                              >
                                <CheckCircle className="w-3.5 h-3.5" />
                                <span>Approve</span>
                              </button>
                            )}

                            {rev.status !== 'rejected' && (
                              <button
                                onClick={() => moderateReview(rev.id, 'rejected')}
                                className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium flex items-center gap-1"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>Reject</span>
                              </button>
                            )}

                            <button
                              onClick={() => deleteReview(rev.id)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900 text-slate-400 hover:text-white"
                              title="Delete permanently"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            )}

            {/* Tab 2: Faculty Directory & Edit */}
            {activeTab === 'faculty' && (
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Add New Faculty Drawer */}
                {isAddingFaculty && (
                  <form onSubmit={handleCreateFaculty} className="p-5 rounded-2xl bg-slate-900 border border-purple-500/40 space-y-4">
                    <h4 className="font-heading font-bold text-sm text-white flex items-center gap-2">
                      <Plus className="w-4 h-4 text-purple-400" />
                      Add New Faculty to IT Department
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Faculty Full Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Dr. S. K. Shinde"
                          value={newFacultyForm.name}
                          onChange={(e) => setNewFacultyForm({ ...newFacultyForm, name: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Designation</label>
                        <input
                          type="text"
                          value={newFacultyForm.designation}
                          onChange={(e) => setNewFacultyForm({ ...newFacultyForm, designation: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Subjects (comma-separated)</label>
                        <input
                          type="text"
                          placeholder="e.g. Artificial Intelligence, Machine Learning"
                          value={newFacultyForm.subjects}
                          onChange={(e) => setNewFacultyForm({ ...newFacultyForm, subjects: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-slate-400 mb-1">Department</label>
                        <input
                          type="text"
                          value={newFacultyForm.department}
                          onChange={(e) => setNewFacultyForm({ ...newFacultyForm, department: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Bio / Profile Description</label>
                      <textarea
                        rows={2}
                        placeholder="Specialization, background, academic focus..."
                        value={newFacultyForm.description}
                        onChange={(e) => setNewFacultyForm({ ...newFacultyForm, description: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newFacultyForm.identityUnconfirmed}
                          onChange={(e) => setNewFacultyForm({ ...newFacultyForm, identityUnconfirmed: e.target.checked })}
                          className="rounded text-purple-500"
                        />
                        <span>Flag as "Identity currently unconfirmed" (placeholder identity)</span>
                      </label>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingFaculty(false)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-lg bg-purple-600 text-xs text-white font-semibold hover:bg-purple-500"
                      >
                        Save Faculty
                      </button>
                    </div>
                  </form>
                )}

                {/* Edit Modal / Form if editing */}
                {editingFaculty && (
                  <form onSubmit={handleSaveFaculty} className="p-5 rounded-2xl bg-purple-950/30 border border-purple-500 space-y-4">
                    <h4 className="font-heading font-bold text-sm text-white flex items-center justify-between">
                      <span>Editing: {editingFaculty.name}</span>
                      <button
                        type="button"
                        onClick={() => setEditingFaculty(null)}
                        className="text-xs text-slate-400 hover:text-white"
                      >
                        Cancel Edit
                      </button>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-slate-300 mb-1">Faculty Name (Editable)</label>
                        <input
                          type="text"
                          required
                          value={editingFaculty.name}
                          onChange={(e) => setEditingFaculty({ ...editingFaculty, name: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-slate-300 mb-1">Designation</label>
                        <input
                          type="text"
                          value={editingFaculty.designation}
                          onChange={(e) => setEditingFaculty({ ...editingFaculty, designation: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-slate-300 mb-1">Department</label>
                        <input
                          type="text"
                          value={editingFaculty.department}
                          onChange={(e) => setEditingFaculty({ ...editingFaculty, department: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-slate-300 mb-1">Subjects (comma-separated)</label>
                        <input
                          type="text"
                          value={editingFaculty.subjects.join(', ')}
                          onChange={(e) =>
                            setEditingFaculty({
                              ...editingFaculty,
                              subjects: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Description / Notes</label>
                      <textarea
                        rows={3}
                        value={editingFaculty.description}
                        onChange={(e) => setEditingFaculty({ ...editingFaculty, description: e.target.value })}
                        className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingFaculty.identityUnconfirmed || false}
                          onChange={(e) =>
                            setEditingFaculty({
                              ...editingFaculty,
                              identityUnconfirmed: e.target.checked,
                            })
                          }
                          className="rounded text-purple-500"
                        />
                        <span>Flag as "Identity currently unconfirmed" (e.g. BCN Ma'am)</span>
                      </label>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setEditingFaculty(null)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-lg bg-purple-600 text-xs text-white font-semibold hover:bg-purple-500 flex items-center gap-1.5"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Update Faculty Profile</span>
                      </button>
                    </div>
                  </form>
                )}

                {/* Faculty List Table */}
                <div className="space-y-3">
                  {faculty.map((f) => (
                    <div
                      key={f.id}
                      className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-950/70 border border-purple-500/30 flex items-center justify-center font-bold text-purple-300">
                          {f.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-heading font-bold text-sm text-white">{f.name}</h4>
                            {f.identityUnconfirmed && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                Unconfirmed
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400">
                            {f.designation} • {f.subjects.slice(0, 2).join(', ')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                          <span className="text-xs font-bold text-amber-400">{f.stats.averageOverall.toFixed(1)} ★</span>
                          <p className="text-[10px] text-slate-400">{f.stats.totalReviews} reviews • {f.stats.satisfactionPercentage}% sat</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingFaculty(f)}
                            className="p-2 rounded-xl bg-slate-800 hover:bg-purple-600 text-slate-300 hover:text-white transition-colors"
                            title="Edit details"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Remove ${f.name} and all associated reviews?`)) {
                                deleteFaculty(f.id);
                              }
                            }}
                            className="p-2 rounded-xl bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white transition-colors"
                            title="Delete faculty"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* Tab 3: Student Reports */}
            {activeTab === 'reports' && (
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Flagged Review Reports from Students
                  </h4>
                  <span className="text-xs text-slate-400">
                    {reports.length} total reports
                  </span>
                </div>

                {reports.length === 0 ? (
                  <div className="text-center py-12 text-slate-400 text-xs">
                    No active student reports filed.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {reports.map((rep) => (
                      <div
                        key={rep.id}
                        className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start justify-between gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-rose-400 uppercase">
                              [{rep.reason.replace('_', ' ')}]
                            </span>
                            <span className="text-xs text-slate-300 font-semibold">
                              Target: {rep.facultyName}
                            </span>
                          </div>
                          {rep.comment && (
                            <p className="text-xs text-slate-300 mt-1">"{rep.comment}"</p>
                          )}
                          <p className="text-[10px] text-slate-500 mt-1">
                            Reported: {new Date(rep.createdAt).toLocaleString()} • Status: {rep.status}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {rep.status === 'pending' && (
                            <>
                              <button
                                onClick={() => resolveReport(rep.id, 'dismissed')}
                                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                              >
                                Dismiss
                              </button>
                              <button
                                onClick={() => {
                                  deleteReview(rep.reviewId);
                                  resolveReport(rep.id, 'actioned');
                                }}
                                className="px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
                              >
                                Delete Review
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Tab 4: Data & Reset */}
            {activeTab === 'data' && (
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Stats Summary */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-[11px] text-slate-400">Total Faculty</span>
                    <p className="text-2xl font-bold text-white mt-1">{faculty.length}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-[11px] text-slate-400">Total Reviews</span>
                    <p className="text-2xl font-bold text-purple-400 mt-1">{reviews.length}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-[11px] text-slate-400">Approved Reviews</span>
                    <p className="text-2xl font-bold text-emerald-400 mt-1">
                      {reviews.filter((r) => r.status === 'approved').length}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-[11px] text-slate-400">Pending / Flagged</span>
                    <p className="text-2xl font-bold text-amber-400 mt-1">
                      {reviews.filter((r) => r.status === 'flagged' || r.status === 'pending').length}
                    </p>
                  </div>
                </div>

                {/* Backup & Export */}
                <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-heading font-bold text-sm text-white">Export Platform Database</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Download full snapshot of faculty profiles, anonymous reviews, and moderation history as JSON.
                    </p>
                  </div>
                  <button
                    onClick={handleExportData}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 shrink-0"
                  >
                    <Download className="w-4 h-4 text-purple-400" />
                    <span>Export JSON</span>
                  </button>
                </div>

                {/* Reset to initial mock data */}
                <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-heading font-bold text-sm text-rose-300">Restore Baseline Demo Data</h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Reset the directory back to the 5 initial SKNCOE IT faculty (Bangare, Narote, OOP Passout Ma'am, BCN Ma'am, Lord VISHAL) with default reviews.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to restore default mock data? All submitted reviews will be reset.')) {
                        resetToDefaultData();
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-600/30 hover:bg-rose-600/50 text-rose-200 border border-rose-500/40 text-xs font-semibold flex items-center gap-2 shrink-0"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Reset Database</span>
                  </button>
                </div>

              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
};
