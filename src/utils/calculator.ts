import { Review, RatingStats } from '../types';

export function calculateFacultyStats(reviews: Review[]): RatingStats {
  const approvedReviews = reviews.filter((r) => r.status === 'approved');
  const count = approvedReviews.length;

  if (count === 0) {
    return {
      averageOverall: 0,
      totalReviews: 0,
      satisfactionPercentage: 0,
      neutralPercentage: 0,
      dissatisfiedPercentage: 0,
      teachingQuality: 0,
      conceptExplanation: 0,
      doubtSolving: 0,
      studentInteraction: 0,
      overallSatisfaction: 0,
      starDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      wouldTakeAgainPercent: 0,
    };
  }

  let sumOverall = 0;
  let sumTeaching = 0;
  let sumExplanation = 0;
  let sumDoubt = 0;
  let sumInteraction = 0;
  let sumSatisfaction = 0;

  let satisfiedCount = 0;
  let neutralCount = 0;
  let dissatisfiedCount = 0;
  let wouldTakeAgainCount = 0;

  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  approvedReviews.forEach((r) => {
    sumOverall += r.overallRating;
    sumTeaching += r.ratings.teachingQuality;
    sumExplanation += r.ratings.conceptExplanation;
    sumDoubt += r.ratings.doubtSolving;
    sumInteraction += r.ratings.studentInteraction;
    sumSatisfaction += r.ratings.overallSatisfaction;

    // Star distribution
    const roundedStar = Math.min(5, Math.max(1, Math.round(r.overallRating))) as 1 | 2 | 3 | 4 | 5;
    distribution[roundedStar] = (distribution[roundedStar] || 0) + 1;

    // Satisfaction calculation:
    // Satisfied if overallRating >= 4
    // Neutral if overallRating === 3
    // Dissatisfied if overallRating <= 2
    if (r.overallRating >= 4) {
      satisfiedCount++;
    } else if (r.overallRating === 3) {
      neutralCount++;
    } else {
      dissatisfiedCount++;
    }

    if (r.wouldTakeAgain === 'yes') {
      wouldTakeAgainCount++;
    } else if (r.wouldTakeAgain === 'maybe') {
      wouldTakeAgainCount += 0.5;
    }
  });

  const round1 = (val: number) => Math.round((val / count) * 10) / 10;

  return {
    averageOverall: round1(sumOverall),
    totalReviews: count,
    satisfactionPercentage: Math.round((satisfiedCount / count) * 100),
    neutralPercentage: Math.round((neutralCount / count) * 100),
    dissatisfiedPercentage: Math.round((dissatisfiedCount / count) * 100),
    teachingQuality: round1(sumTeaching),
    conceptExplanation: round1(sumExplanation),
    doubtSolving: round1(sumDoubt),
    studentInteraction: round1(sumInteraction),
    overallSatisfaction: round1(sumSatisfaction),
    starDistribution: distribution,
    wouldTakeAgainPercent: Math.round((wouldTakeAgainCount / count) * 100),
  };
}
