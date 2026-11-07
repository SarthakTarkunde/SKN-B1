# 🎓 SKNCOE Faculty Reviews

**Modern, Anonymous Faculty Review & Rating Platform**  
Exclusively designed for students of **Sinhgad College of Engineering (SKNCOE), Vadgaon (Bk), Pune — Department of Information Technology**.

---

## 🌟 Key Features

1. **100% Student Privacy & Anonymity**:
   - Zero collection of student names, Permanent Registration Numbers (PRNs), roll numbers, emails, or phone numbers.
   - Submissions are permanently unlinked from student identities.
   - Built-in anti-spam duplicate prevention using localized cooldown tracking.

2. **Faculty Profiles (IT Department)**:
   Pre-configured with the initial 5 IT faculty members:
   - **M. L. Bangare** (Operating Systems, System Programming, Cloud Computing)
   - **Abhilasha Narote** (Database Management Systems, Data Structures & Algorithms)
   - **OOP Passout Ma'am** (Object-Oriented Programming with C++/Java)
   - **BCN Ma'am** (Basic Communication Networks - *tagged with unconfirmed identity notice*)
   - **Lord VISHAL** (Theory of Computation, Software Engineering, Web Development)

3. **5-Parameter Rating System**:
   - 🌟 Teaching Quality (1–5)
   - 🌟 Concept Explanation (1–5)
   - 🌟 Doubt-Solving Ability (1–5)
   - 🌟 Student Interaction (1–5)
   - 🌟 Overall Satisfaction (1–5)
   - Automatic dynamic recalculation of aggregate averages, star distributions, and satisfaction percentages.

4. **Interactive Satisfaction Dashboard**:
   - Visual percentage meters for **Satisfied** (4–5 ★), **Neutral** (3 ★), and **Dissatisfied** (1–2 ★) students.
   - 5-Star to 1-Star rating distribution breakdown with clickable filters.
   - Individual parameter performance bars.
   - "Would take again" recommendation metric.

5. **Student Reviews & Community Feed**:
   - Clear distinction between "What I Liked" and "Areas for Improvement".
   - Semester standing tags (SE Sem 3/4, TE Sem 5/6, BE, Alumni).
   - Attendance strictness indicators (High, Moderate, Relaxed).
   - Upvoting helpful reviews with one-click counter.
   - "Report Inappropriate Review" modal for community self-regulation.

6. **Automated Moderation & Admin Portal**:
   - Instant word filter detecting profanity, threats, slurs, and PII leaks.
   - Flagged reviews are automatically quarantined until administrative review.
   - Full Admin Portal:
     - Passcode: `skncoe2025` (with convenient 1-Click Demo Login)
     - Moderate review queue (Approve / Reject / Delete)
     - Edit faculty names, departments, subjects, designations, and verification status
     - Add new faculty members to the directory
     - Export full database as JSON
     - One-click restore to baseline mock data

---

## 🚀 Quick Start

### Run Locally

```bash
# Navigate to project
cd /Users/sarthakvaibhavtarkunde/.gemini/antigravity/scratch/skncoe-faculty-reviews

# Start the Vite development server
./node_modules/.bin/vite

# Or preview the production build
./node_modules/.bin/vite preview
```

Open **`http://localhost:5173`** in your browser.

---

## 🎨 Design Philosophy
- **Dark Navy & Purple University-Tech Theme** (`#070A13`, deep violet, royal purple, and cyan highlights).
- Clean card borders with frosted glass (`backdrop-blur-md`).
- Fully mobile-responsive layout for phone and desktop viewing.
- Confetti celebration upon submitting high-rated reviews.
