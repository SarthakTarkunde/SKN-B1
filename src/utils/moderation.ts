// Moderation utility to prevent abuse, hate speech, threats, and leaks of private personal details

const BANNED_PATTERNS = [
  /kill\s+(you|him|her|them)/i,
  /die/i,
  /threat/i,
  /fire\s+(him|her)/i,
  /idiot/i,
  /moron/i,
  /bastard/i,
  /scam/i,
  /fraud/i,
  /bribe/i,
  /corrupt/i,
  /slut/i,
  /whore/i,
  /chutiya/i,
  /madarchod/i,
  /bhenchod/i,
  /gandu/i,
  /harami/i,
  /kamina/i,
  /f\*ck/i,
  /fuck/i,
  /shit/i,
  /asshole/i,
  /bitch/i,
];

// Regex for student PRN, phone number, or personal emails
const PRN_OR_PHONE_REGEX = /(\b\d{10}\b|\b7\d{7,9}[A-Za-z]?\b|\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b)/;

export interface ModerationResult {
  isSafe: boolean;
  status: 'approved' | 'flagged';
  flagReason?: string;
}

export function moderateReviewContent(likedText: string, improvementText: string): ModerationResult {
  const combinedText = `${likedText} ${improvementText}`.toLowerCase();

  // Check personal identifying info (phone numbers, emails, PRNs)
  if (PRN_OR_PHONE_REGEX.test(combinedText)) {
    return {
      isSafe: false,
      status: 'flagged',
      flagReason: 'Contains potential phone number, student PRN, or personal email. Student identity must remain anonymous.',
    };
  }

  // Check abusive / threat words
  for (const pattern of BANNED_PATTERNS) {
    if (pattern.test(combinedText)) {
      return {
        isSafe: false,
        status: 'flagged',
        flagReason: 'Contains language flagged by community guidelines for abusive words or personal attacks. Held for admin moderation.',
      };
    }
  }

  return {
    isSafe: true,
    status: 'approved',
  };
}

// Generate realistic anonymous badges
export function generateAnonymousAlias(experienceLevel: string): string {
  const cleanExp = experienceLevel.split('-')[0].trim();
  const variants = [
    `Anonymous IT Student (${cleanExp || 'Student'})`,
    `Anonymous SE/TE Scholar`,
    `Anonymous IT Batchmate`,
    `Anonymous Campus Peer`,
    `SKNCOE IT Student`
  ];
  return variants[Math.floor(Math.random() * variants.length)];
}

// Anti-spam duplicate submission check using localStorage
export function checkSubmissionAllowed(facultyId: string): { allowed: boolean; remainingSeconds: number } {
  try {
    const key = `skn_last_sub_${facultyId}`;
    const lastSub = localStorage.getItem(key);
    if (!lastSub) return { allowed: true, remainingSeconds: 0 };

    const diffMs = Date.now() - parseInt(lastSub, 10);
    const cooldownMs = 30 * 1000; // 30 seconds cooldown between submissions for same faculty

    if (diffMs < cooldownMs) {
      return {
        allowed: false,
        remainingSeconds: Math.ceil((cooldownMs - diffMs) / 1000),
      };
    }
  } catch {
    // ignore localstorage errors
  }
  return { allowed: true, remainingSeconds: 0 };
}

export function recordSubmission(facultyId: string): void {
  try {
    localStorage.setItem(`skn_last_sub_${facultyId}`, Date.now().toString());
  } catch {
    // ignore
  }
}
