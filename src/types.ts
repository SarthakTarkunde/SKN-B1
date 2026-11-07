export interface RatingParameters {
  teachingQuality: number; // 1-5
  conceptExplanation: number; // 1-5
  doubtSolving: number; // 1-5
  studentInteraction: number; // 1-5
  overallSatisfaction: number; // 1-5
}

export interface RatingStats extends RatingParameters {
  averageOverall: number;
  totalReviews: number;
  satisfactionPercentage: number; // % rating >= 4
  neutralPercentage: number; // % rating == 3
  dissatisfiedPercentage: number; // % rating <= 2
  starDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  wouldTakeAgainPercent: number;
}

export interface Faculty {
  id: string;
  name: string;
  department: string;
  subjects: string[];
  designation: string;
  identityUnconfirmed?: boolean;
  avatarSeed?: string;
  description: string;
  experienceYears?: number;
  tags?: string[];
  stats: RatingStats;
}

export type ReviewStatus = 'approved' | 'pending' | 'flagged' | 'rejected';

export interface Review {
  id: string;
  facultyId: string;
  facultyName: string;
  subject: string;
  overallRating: number; // 1-5
  ratings: RatingParameters;
  experienceLevel: string; // e.g. 'TE - IT (Semester 5)', 'SE - IT', 'Passout / Alumni'
  likedText: string; // What do you like about this faculty?
  improvementText: string; // What could be improved?
  wouldTakeAgain: 'yes' | 'maybe' | 'no';
  attendanceStrictness: 'High' | 'Moderate' | 'Relaxed';
  tags: string[];
  helpfulVotes: number;
  status: ReviewStatus;
  moderationNotes?: string;
  studentAlias: string; // Always anonymous (e.g. "Anonymous SE-IT Student")
  createdAt: string;
}

export interface ReviewReport {
  id: string;
  reviewId: string;
  facultyName: string;
  reason: 'harassment' | 'abusive_language' | 'false_allegation' | 'personal_attack' | 'spam' | 'other';
  comment: string;
  createdAt: string;
  status: 'pending' | 'actioned' | 'dismissed';
}
