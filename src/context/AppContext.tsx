import React, { createContext, useContext, useState, useEffect } from 'react';
import { Faculty, Review, ReviewReport, ReviewStatus } from '../types';
import { INITIAL_FACULTY_RAW, INITIAL_REVIEWS, INITIAL_REPORTS } from '../data/defaultData';
import { calculateFacultyStats } from '../utils/calculator';
import { moderateReviewContent, recordSubmission, checkSubmissionAllowed } from '../utils/moderation';

interface Toast {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
}

interface AppContextType {
  faculty: Faculty[];
  reviews: Review[];
  reports: ReviewReport[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
  selectedSort: string;
  setSelectedSort: (sort: string) => void;
  
  // Modals & Navigation
  activeFacultyDetail: Faculty | null;
  setActiveFacultyDetail: (faculty: Faculty | null) => void;
  isReviewModalOpen: boolean;
  setIsReviewModalOpen: (open: boolean) => void;
  selectedFacultyForReview: Faculty | null;
  setSelectedFacultyForReview: (faculty: Faculty | null) => void;
  isReportModalOpen: boolean;
  setIsReportModalOpen: (open: boolean) => void;
  selectedReviewForReport: Review | null;
  setSelectedReviewForReport: (review: Review | null) => void;
  isAdminModalOpen: boolean;
  setIsAdminModalOpen: (open: boolean) => void;
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (val: boolean) => void;
  
  // Actions
  addReview: (reviewData: Omit<Review, 'id' | 'createdAt' | 'helpfulVotes' | 'status' | 'studentAlias'>) => { success: boolean; message: string; status: ReviewStatus };
  updateFaculty: (updated: Faculty) => void;
  addFaculty: (newFaculty: Omit<Faculty, 'stats'>) => void;
  deleteFaculty: (facultyId: string) => void;
  moderateReview: (reviewId: string, status: ReviewStatus, notes?: string) => void;
  deleteReview: (reviewId: string) => void;
  reportReview: (reviewId: string, reason: ReviewReport['reason'], comment: string) => void;
  resolveReport: (reportId: string, action: 'dismissed' | 'actioned') => void;
  voteHelpful: (reviewId: string) => void;
  resetToDefaultData: () => void;
  
  // Notifications
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load faculty & reviews from LocalStorage or defaults
  const [facultyList, setFacultyList] = useState<Omit<Faculty, 'stats'>[]>(() => {
    try {
      const saved = localStorage.getItem('skn_faculty_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_FACULTY_RAW;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem('skn_reviews_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_REVIEWS;
  });

  const [reports, setReports] = useState<ReviewReport[]>(() => {
    try {
      const saved = localStorage.getItem('skn_reports_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_REPORTS;
  });

  // UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedSort, setSelectedSort] = useState('highest_rated');

  // Modals
  const [activeFacultyDetail, setActiveFacultyDetail] = useState<Faculty | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedFacultyForReview, setSelectedFacultyForReview] = useState<Faculty | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedReviewForReport, setSelectedReviewForReport] = useState<Review | null>(null);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (t: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { ...t, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('skn_faculty_v1', JSON.stringify(facultyList));
    } catch (e) {
      console.error(e);
    }
  }, [facultyList]);

  useEffect(() => {
    try {
      localStorage.setItem('skn_reviews_v1', JSON.stringify(reviews));
    } catch (e) {
      console.error(e);
    }
  }, [reviews]);

  useEffect(() => {
    try {
      localStorage.setItem('skn_reports_v1', JSON.stringify(reports));
    } catch (e) {
      console.error(e);
    }
  }, [reports]);

  // Dynamically calculate faculty stats based on approved reviews
  const faculty: Faculty[] = facultyList.map((fac) => {
    const facReviews = reviews.filter((r) => r.facultyId === fac.id);
    return {
      ...fac,
      stats: calculateFacultyStats(facReviews),
    };
  });

  // Keep activeFacultyDetail in sync with latest calculated stats
  useEffect(() => {
    if (activeFacultyDetail) {
      const updated = faculty.find((f) => f.id === activeFacultyDetail.id);
      if (updated) {
        setActiveFacultyDetail(updated);
      }
    }
  }, [reviews, facultyList]);

  // Submit anonymous review
  const addReview = (reviewData: Omit<Review, 'id' | 'createdAt' | 'helpfulVotes' | 'status' | 'studentAlias'>) => {
    // Check anti-spam cooldown
    const rateCheck = checkSubmissionAllowed(reviewData.facultyId);
    if (!rateCheck.allowed) {
      addToast({
        type: 'warning',
        title: 'Please wait',
        message: `To prevent spam, please wait ${rateCheck.remainingSeconds}s before submitting another review for this faculty.`,
      });
      return { success: false, message: 'Rate limit reached', status: 'rejected' as ReviewStatus };
    }

    // Run automated moderation
    const moderation = moderateReviewContent(reviewData.likedText, reviewData.improvementText);
    const status: ReviewStatus = moderation.status;

    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      status,
      moderationNotes: moderation.flagReason,
      helpfulVotes: 0,
      studentAlias: `Anonymous IT Student (${reviewData.experienceLevel.split('-')[0].trim() || 'Student'})`,
      createdAt: new Date().toISOString(),
    };

    setReviews((prev) => [newReview, ...prev]);
    recordSubmission(reviewData.facultyId);

    if (status === 'flagged') {
      addToast({
        type: 'warning',
        title: 'Submitted for Moderation',
        message: 'Your review contains phrases flagged by community guidelines and has been sent to the moderation queue for review.',
      });
    } else {
      addToast({
        type: 'success',
        title: 'Review Published Anonymously!',
        message: 'Thank you for your constructive feedback. Ratings and percentages have been recalculated.',
      });
    }

    return {
      success: true,
      message: status === 'flagged' ? 'Held for moderation' : 'Published successfully',
      status,
    };
  };

  // Upvote review
  const voteHelpful = (reviewId: string) => {
    const key = `skn_voted_${reviewId}`;
    if (localStorage.getItem(key)) {
      addToast({
        type: 'info',
        title: 'Already Marked',
        message: 'You have already marked this review as helpful.',
      });
      return;
    }
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, helpfulVotes: r.helpfulVotes + 1 } : r))
    );
    try {
      localStorage.setItem(key, '1');
    } catch {}
    addToast({
      type: 'success',
      title: 'Feedback Noted',
      message: 'Marked as helpful.',
    });
  };

  // Report review
  const reportReview = (reviewId: string, reason: ReviewReport['reason'], comment: string) => {
    const rev = reviews.find((r) => r.id === reviewId);
    if (!rev) return;

    const newReport: ReviewReport = {
      id: `rep-${Date.now()}`,
      reviewId,
      facultyName: rev.facultyName,
      reason,
      comment,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    setReports((prev) => [newReport, ...prev]);

    // Automatically mark review as flagged if reported
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, status: 'flagged', moderationNotes: `Student report: ${reason}` } : r))
    );

    addToast({
      type: 'info',
      title: 'Report Received',
      message: 'Thank you for protecting our community. The review is hidden pending admin verification.',
    });
  };

  // Admin moderation actions
  const moderateReview = (reviewId: string, status: ReviewStatus, notes?: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, status, moderationNotes: notes || r.moderationNotes } : r))
    );
    addToast({
      type: 'success',
      title: 'Review Status Updated',
      message: `Review is now marked as ${status.toUpperCase()}.`,
    });
  };

  const deleteReview = (reviewId: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
    setReports((prev) => prev.filter((rep) => rep.reviewId !== reviewId));
    addToast({
      type: 'info',
      title: 'Review Removed',
      message: 'Review permanently deleted from database.',
    });
  };

  const resolveReport = (reportId: string, action: 'dismissed' | 'actioned') => {
    setReports((prev) =>
      prev.map((rep) => (rep.id === reportId ? { ...rep, status: action } : rep))
    );
    addToast({
      type: 'info',
      title: 'Report Handled',
      message: `Report marked as ${action}.`,
    });
  };

  // Faculty management
  const updateFaculty = (updated: Faculty) => {
    setFacultyList((prev) =>
      prev.map((f) =>
        f.id === updated.id
          ? {
              id: updated.id,
              name: updated.name,
              department: updated.department,
              subjects: updated.subjects,
              designation: updated.designation,
              identityUnconfirmed: updated.identityUnconfirmed,
              avatarSeed: updated.avatarSeed,
              experienceYears: updated.experienceYears,
              description: updated.description,
              tags: updated.tags,
            }
          : f
      )
    );
    addToast({
      type: 'success',
      title: 'Faculty Profile Updated',
      message: `Updated profile details for ${updated.name}.`,
    });
  };

  const addFaculty = (newFaculty: Omit<Faculty, 'stats'>) => {
    const fac: Omit<Faculty, 'stats'> = {
      ...newFaculty,
      id: `fac-${Date.now()}`,
    };
    setFacultyList((prev) => [...prev, fac]);
    addToast({
      type: 'success',
      title: 'Faculty Added',
      message: `${newFaculty.name} added to SKNCOE IT Department directory.`,
    });
  };

  const deleteFaculty = (facultyId: string) => {
    setFacultyList((prev) => prev.filter((f) => f.id !== facultyId));
    setReviews((prev) => prev.filter((r) => r.facultyId !== facultyId));
    addToast({
      type: 'warning',
      title: 'Faculty Removed',
      message: 'Faculty profile and associated reviews removed.',
    });
  };

  // Reset to original data
  const resetToDefaultData = () => {
    localStorage.removeItem('skn_faculty_v1');
    localStorage.removeItem('skn_reviews_v1');
    localStorage.removeItem('skn_reports_v1');
    setFacultyList(INITIAL_FACULTY_RAW);
    setReviews(INITIAL_REVIEWS);
    setReports(INITIAL_REPORTS);
    addToast({
      type: 'info',
      title: 'Default Data Restored',
      message: 'All faculty profiles and baseline reviews restored.',
    });
  };

  return (
    <AppContext.Provider
      value={{
        faculty,
        reviews,
        reports,
        searchTerm,
        setSearchTerm,
        selectedFilter,
        setSelectedFilter,
        selectedSort,
        setSelectedSort,
        activeFacultyDetail,
        setActiveFacultyDetail,
        isReviewModalOpen,
        setIsReviewModalOpen,
        selectedFacultyForReview,
        setSelectedFacultyForReview,
        isReportModalOpen,
        setIsReportModalOpen,
        selectedReviewForReport,
        setSelectedReviewForReport,
        isAdminModalOpen,
        setIsAdminModalOpen,
        isAdminLoggedIn,
        setIsAdminLoggedIn,
        addReview,
        updateFaculty,
        addFaculty,
        deleteFaculty,
        moderateReview,
        deleteReview,
        reportReview,
        resolveReport,
        voteHelpful,
        resetToDefaultData,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
