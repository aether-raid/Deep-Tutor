// Works out a subject's progress for the Home and Overall screens.
// Starts from the mock past results, then mixes in quizzes taken in this
// session, so the student sees their latest quiz reflected straight away.
import { MOCK_TOPICS } from './data/mockProgress.js';
import { isSecondary, getStrength } from './data/subjects.js';

// history: list of finished quizzes kept by WeaknessPage.vue (in memory only), e.g.
//   { level: 's3', subject: {...}, topics: [{ name, percent, correct, total, diagnosis }] }
export function getSubjectProgress(levelId, subjectId, history = []) {
  const stage = isSecondary(levelId) ? 'secondary' : 'primary';
  const mock = MOCK_TOPICS[stage][subjectId] ?? [];
  const topics = mock.map((t) => ({ ...t, fromQuiz: false }));

  // Most recent quiz for this level + subject, if any.
  const lastQuiz = [...history].reverse().find((h) => h.level === levelId && h.subject.id === subjectId) ?? null;

  if (lastQuiz) {
    for (const t of lastQuiz.topics) {
      const existing = topics.find((x) => x.name === t.name);
      const note = `Last quiz: ${t.correct}/${t.total} correct (${t.diagnosis})`;
      if (existing) {
        // Blend the old result with the new quiz so one quiz doesn't erase the past.
        existing.percent = Math.round((existing.percent + t.percent) / 2);
        existing.note = note;
        existing.fromQuiz = true;
      } else {
        topics.push({ name: t.name, percent: t.percent, note, fromQuiz: true });
      }
    }
  }

  topics.sort((a, b) => a.percent - b.percent); // weakest first

  const percent = topics.length
    ? Math.round(topics.reduce((sum, t) => sum + t.percent, 0) / topics.length)
    : null;

  return { percent, strength: getStrength(percent), topics, lastQuiz };
}
