// Mock data for the Weakness Identification page.
// Everything in this file is made up. There is NO real student data here.

// Singapore school levels, grouped into Primary and Secondary.
export const STAGES = [
  {
    id: 'primary',
    name: 'Primary',
    levels: [
      { id: 'p1', name: 'Primary 1', short: 'P1' },
      { id: 'p2', name: 'Primary 2', short: 'P2' },
      { id: 'p3', name: 'Primary 3', short: 'P3' },
      { id: 'p4', name: 'Primary 4', short: 'P4' },
      { id: 'p5', name: 'Primary 5', short: 'P5' },
      { id: 'p6', name: 'Primary 6', short: 'P6' },
    ],
  },
  {
    id: 'secondary',
    name: 'Secondary',
    levels: [
      { id: 's1', name: 'Secondary 1', short: 'Sec 1' },
      { id: 's2', name: 'Secondary 2', short: 'Sec 2' },
      { id: 's3', name: 'Secondary 3', short: 'Sec 3' },
      { id: 's4', name: 'Secondary 4', short: 'Sec 4' },
    ],
  },
];

// Subject levels under Full Subject-Based Banding (secondary only).
export const STREAMS = [
  { id: 'g3', name: 'G3', hint: 'like Express' },
  { id: 'g2', name: 'G2', hint: 'like Normal (Academic)' },
  { id: 'g1', name: 'G1', hint: 'like Normal (Technical)' },
];

// Every subject the page knows about. "icon" is short text, not an image.
export const SUBJECTS = {
  english: { id: 'english', name: 'English', icon: 'Aa' },
  math: { id: 'math', name: 'Mathematics', icon: 'fx' },
  science: { id: 'science', name: 'Science', icon: 'Sc' },
  geography: { id: 'geography', name: 'Geography', icon: 'Ge' },
  amath: { id: 'amath', name: 'Additional Mathematics', icon: 'A+' },
  physics: { id: 'physics', name: 'Physics', icon: 'Ph' },
  chemistry: { id: 'chemistry', name: 'Chemistry', icon: 'Ch' },
  biology: { id: 'biology', name: 'Biology', icon: 'Bi' },
};

// Which subjects each level takes (simplified for the demo).
const SUBJECTS_BY_LEVEL = {
  p1: ['english', 'math'],
  p2: ['english', 'math'],
  p3: ['english', 'math', 'science'],
  p4: ['english', 'math', 'science'],
  p5: ['english', 'math', 'science'],
  p6: ['english', 'math', 'science'],
  s1: ['english', 'math', 'science', 'geography'],
  s2: ['english', 'math', 'science', 'geography'],
  s3: ['english', 'math', 'amath', 'physics', 'chemistry', 'biology'],
  s4: ['english', 'math', 'amath', 'physics', 'chemistry', 'biology'],
};

// A pretend student's past results per subject (percent).
// null means the student has not taken a quiz in that subject yet.
export const MOCK_PROGRESS = {
  english: 60,
  math: 28,
  science: 45,
  geography: 72,
  amath: null,
  physics: 45,
  chemistry: 35,
  biology: 78,
};

// ---------- Small helper functions ----------

// Returns the list of subject objects for a level, e.g. 'p3'.
export function getSubjectsForLevel(levelId) {
  const ids = SUBJECTS_BY_LEVEL[levelId] ?? [];
  return ids.map((id) => SUBJECTS[id]);
}

// Finds a level object (e.g. { id: 's3', name: 'Secondary 3' }) by its id.
export function findLevel(levelId) {
  for (const stage of STAGES) {
    const level = stage.levels.find((l) => l.id === levelId);
    if (level) return level;
  }
  return null;
}

// Secondary level ids start with "s".
export function isSecondary(levelId) {
  return typeof levelId === 'string' && levelId.startsWith('s');
}

// Turns a percent into a strength label. Same cut-offs everywhere on the page.
export function getStrength(percent) {
  if (percent === null || percent === undefined) {
    return { key: 'none', label: 'Not tried' };
  }
  if (percent < 40) return { key: 'weak', label: 'Weak' };
  if (percent < 70) return { key: 'moderate', label: 'Moderate' };
  return { key: 'strong', label: 'Strong' };
}
