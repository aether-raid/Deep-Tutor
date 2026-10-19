// Mock data for the Weakness Identification page.
// Everything about the "student" here is made up. There is NO real student data.
//
// Subject lists follow the Singapore system (checked against SEAB's
// 2026 PSLE list and 2027 SEC G1/G2/G3 syllabus lists). They are
// simplified: arts/practical subjects (Art, Music, D&T, Food Science,
// applied subjects) are left out because they don't suit a 10-question MCQ.

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

// "Streams" the student can pick.
// P5–P6: Standard or Foundation (the school decides from P4 results).
// Secondary: Full Subject-Based Banding levels G1, G2, G3.
// P1–P4 have no stream.
const PRIMARY_STREAMS = [
  { id: 'standard', name: 'Standard', hint: 'most pupils' },
  { id: 'foundation', name: 'Foundation', hint: 'set from P4 results' },
];

const SECONDARY_STREAMS = [
  { id: 'g3', name: 'G3', hint: 'was Express' },
  { id: 'g2', name: 'G2', hint: 'was N(A)' },
  { id: 'g1', name: 'G1', hint: 'was N(T)' },
];

// Every subject the page knows about.
// "icon" is short text (not an image). "note" is an optional small subtitle.
export const SUBJECTS = {
  // Languages
  english: { id: 'english', name: 'English Language', icon: 'Aa' },
  mt: { id: 'mt', name: 'Mother Tongue', icon: 'MT', note: 'Chinese, Malay, Tamil or others' },
  higherMt: { id: 'higherMt', name: 'Higher Mother Tongue', icon: 'HM', note: 'Chinese, Malay or Tamil' },
  literature: { id: 'literature', name: 'Literature in English', icon: 'Li' },

  // Mathematics
  math: { id: 'math', name: 'Mathematics', icon: 'fx' },
  amath: { id: 'amath', name: 'Additional Mathematics', icon: 'A+' },

  // Sciences
  science: { id: 'science', name: 'Science', icon: 'Sc' },
  combinedScience: { id: 'combinedScience', name: 'Combined Science', icon: 'CS', note: 'Two of Physics, Chemistry, Biology' },
  physics: { id: 'physics', name: 'Physics', icon: 'Ph' },
  chemistry: { id: 'chemistry', name: 'Chemistry', icon: 'Ch' },
  biology: { id: 'biology', name: 'Biology', icon: 'Bi' },

  // Humanities
  geography: { id: 'geography', name: 'Geography', icon: 'Ge' },
  history: { id: 'history', name: 'History', icon: 'Hi' },
  combinedHumanities: { id: 'combinedHumanities', name: 'Humanities', icon: 'Hu', note: 'Social Studies + Geography, History or Literature' },

  // Other electives
  poa: { id: 'poa', name: 'Principles of Accounts', icon: 'PA' },
  computing: { id: 'computing', name: 'Computing', icon: 'Cp' },
  business: { id: 'business', name: 'Elements of Business Skills', icon: 'Bz' },

  // Primary Foundation subjects (P5–P6)
  fEnglish: { id: 'fEnglish', name: 'Foundation English', icon: 'Aa' },
  fMt: { id: 'fMt', name: 'Foundation Mother Tongue', icon: 'MT' },
  fMath: { id: 'fMath', name: 'Foundation Mathematics', icon: 'fx' },
  fScience: { id: 'fScience', name: 'Foundation Science', icon: 'Sc' },
};

// Some subjects need one more choice before the quiz starts
// (which language, which science pair, which humanities elective).
// Lists follow SEAB's 2026 PSLE and 2027 SEC subject lists.
const CHINESE_MALAY_TAMIL = [
  { id: 'chinese', name: 'Chinese' },
  { id: 'malay', name: 'Malay' },
  { id: 'tamil', name: 'Tamil' },
];

// Non-Tamil Indian languages (offered at PSLE, G2 and G3, not at G1).
const OTHER_MT = [
  { id: 'bengali', name: 'Bengali' },
  { id: 'gujarati', name: 'Gujarati' },
  { id: 'hindi', name: 'Hindi' },
  { id: 'panjabi', name: 'Panjabi' },
  { id: 'urdu', name: 'Urdu' },
];

const SCIENCE_PAIRS = [
  { id: 'physChem', name: 'Physics, Chemistry' },
  { id: 'physBio', name: 'Physics, Biology' },
  { id: 'chemBio', name: 'Chemistry, Biology' },
];

const HUMANITIES_ELECTIVES = [
  { id: 'geography', name: 'Social Studies, Geography' },
  { id: 'history', name: 'Social Studies, History' },
  { id: 'literature', name: 'Social Studies, Literature in English' },
];

// G3 also offers the Mother Tongue literature electives.
const HUMANITIES_ELECTIVES_G3_ONLY = [
  { id: 'litChinese', name: 'Social Studies, Literature in Chinese' },
  { id: 'litMalay', name: 'Social Studies, Literature in Malay' },
  { id: 'litTamil', name: 'Social Studies, Literature in Tamil' },
];

// The question shown above the choices, per subject.
const OPTION_PROMPTS = {
  mt: 'Which Mother Tongue do you take?',
  fMt: 'Which Mother Tongue do you take?',
  higherMt: 'Which Higher Mother Tongue do you take?',
  combinedScience: 'Which two sciences are in your Combined Science?',
  combinedHumanities: 'Which elective do you take with Social Studies?',
};

// Returns { prompt, options } for a subject, or null if there is nothing to choose.
// The stream matters: G1 has only Chinese/Malay/Tamil, and only G3 has the MTL literatures.
export function getSubjectOptions(subjectId, streamId) {
  let options = null;

  if (subjectId === 'mt') {
    options = streamId === 'g1' ? CHINESE_MALAY_TAMIL : [...CHINESE_MALAY_TAMIL, ...OTHER_MT];
  } else if (subjectId === 'fMt') {
    options = [...CHINESE_MALAY_TAMIL, ...OTHER_MT];
  } else if (subjectId === 'higherMt') {
    options = CHINESE_MALAY_TAMIL;
  } else if (subjectId === 'combinedScience') {
    options = SCIENCE_PAIRS;
  } else if (subjectId === 'combinedHumanities') {
    options =
      streamId === 'g3'
        ? [...HUMANITIES_ELECTIVES, ...HUMANITIES_ELECTIVES_G3_ONLY]
        : HUMANITIES_ELECTIVES;
  }

  if (!options) return null;
  return { prompt: OPTION_PROMPTS[subjectId], options };
}

// Subject ids for each group of students.
// "core" = everyone takes it. "other" = electives / optional subjects.
const SUBJECT_LISTS = {
  // P1–P2: English, Mother Tongue, Maths (no tests, exams or grades)
  lowerPrimary: { core: ['english', 'mt', 'math'], other: [] },
  // P3–P6 Standard: Science starts at P3; Higher MT is optional
  primaryStandard: { core: ['english', 'mt', 'math', 'science'], other: ['higherMt'] },
  // P5–P6 Foundation: Foundation version of each PSLE subject
  primaryFoundation: { core: ['fEnglish', 'fMt', 'fMath', 'fScience'], other: [] },
  // Sec 1–2: same subjects for every stream, taught at G1/G2/G3
  lowerSecondary: {
    core: ['english', 'mt', 'math', 'science'],
    other: ['geography', 'history', 'literature'],
  },
  // Sec 3–4 G1: G1 Humanities is not examined, and there is no G1 Additional Maths
  upperG1: { core: ['english', 'mt', 'math', 'science'], other: ['computing', 'business'] },
  // Sec 3–4 G2: combined science and humanities; Geography/History/Literature also offered alone
  upperG2: {
    core: ['english', 'mt', 'math', 'combinedScience', 'combinedHumanities'],
    other: ['amath', 'geography', 'history', 'literature', 'poa', 'computing'],
  },
  // Sec 3–4 G3: adds Higher MT and the pure sciences
  upperG3: {
    core: ['english', 'mt', 'math', 'combinedScience', 'combinedHumanities'],
    other: [
      'higherMt', 'amath', 'physics', 'chemistry', 'biology',
      'geography', 'history', 'literature', 'poa', 'computing',
    ],
  },
};

// A pretend student's past results per subject (percent).
// Subjects not listed here have not been tried yet.
export const MOCK_PROGRESS = {
  english: 60,
  mt: 52,
  math: 28,
  science: 45,
  combinedScience: 41,
  physics: 45,
  chemistry: 35,
  biology: 78,
  geography: 72,
  history: 66,
  combinedHumanities: 63,
};

// ---------- Small helper functions ----------

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

// P1 and P2 have no tests or grades, so the page shows a "practice only" note.
export function isLowerPrimary(levelId) {
  return levelId === 'p1' || levelId === 'p2';
}

// Which streams a level can choose from. Empty list = no stream to pick.
export function getStreamsForLevel(levelId) {
  if (levelId === 'p5' || levelId === 'p6') return PRIMARY_STREAMS;
  if (isSecondary(levelId)) return SECONDARY_STREAMS;
  return [];
}

// Finds a stream object (e.g. { id: 'g3', name: 'G3' }) by its id.
export function findStream(streamId) {
  return [...PRIMARY_STREAMS, ...SECONDARY_STREAMS].find((s) => s.id === streamId) ?? null;
}

// Picks the right list from SUBJECT_LISTS for a level + stream.
function getListKey(levelId, streamId) {
  if (isLowerPrimary(levelId)) return 'lowerPrimary';
  if (levelId === 'p3' || levelId === 'p4') return 'primaryStandard';
  if (levelId === 'p5' || levelId === 'p6') {
    return streamId === 'foundation' ? 'primaryFoundation' : 'primaryStandard';
  }
  if (levelId === 's1' || levelId === 's2') return 'lowerSecondary';
  if (levelId === 's3' || levelId === 's4') {
    if (streamId === 'g1') return 'upperG1';
    if (streamId === 'g2') return 'upperG2';
    return 'upperG3';
  }
  return null;
}

// Returns { core: [...subjects], other: [...subjects] } for a level + stream.
export function getSubjectsForLevel(levelId, streamId) {
  const list = SUBJECT_LISTS[getListKey(levelId, streamId)];
  if (!list) return { core: [], other: [] };
  return {
    core: list.core.map((id) => SUBJECTS[id]),
    other: list.other.map((id) => SUBJECTS[id]),
  };
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
