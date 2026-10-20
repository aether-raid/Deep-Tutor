// Works out a subject's progress for the Home and Overall screens.
// Starts from the mock past results, then mixes in quizzes taken in this
// session, so the student sees their latest quiz reflected straight away.
// Every topic in the subject's question bank is listed, even ones not tried yet.
import { MOCK_TOPICS } from './data/mockProgress.js';
import { isSecondary, getStrength, getSubjectOptions } from './data/subjects.js';
import { findQuestionBank } from './data/questions.js';

// history: list of finished quizzes kept by WeaknessPage.vue (in memory only), e.g.
//   { level: 's3', subject: {...}, topics: [{ name, percent, correct, total, diagnosis }] }
export function getSubjectProgress(levelId, streamId, subjectId, history = []) {
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

  // Add every other topic from the question bank as "not tried yet" (percent: null).
  const optionId = lastQuiz?.subject.option?.id ?? null;
  for (const name of getBankTopics(levelId, streamId, subjectId, optionId)) {
    if (!topics.some((t) => t.name === name)) {
      topics.push({ name, percent: null, note: 'Not tried yet', fromQuiz: false });
    }
  }

  // Weakest first. Topics with no score yet go to the bottom.
  topics.sort((a, b) => {
    if (a.percent === null) return b.percent === null ? 0 : 1;
    if (b.percent === null) return -1;
    return a.percent - b.percent;
  });

  // The subject's percent only counts topics that have a score.
  const scored = topics.filter((t) => t.percent !== null);
  const percent = scored.length
    ? Math.round(scored.reduce((sum, t) => sum + t.percent, 0) / scored.length)
    : null;

  return { percent, strength: getStrength(percent), topics, lastQuiz };
}

// Topic names in the question bank(s) for this level + stream + subject, in bank order.
// If the sub-subject (e.g. Physics + Chemistry) is not known yet, every option's topics are listed.
function getBankTopics(levelId, streamId, subjectId, optionId) {
  const choice = getSubjectOptions(subjectId, streamId);
  const optionIds = optionId ? [optionId] : choice ? choice.options.map((o) => o.id) : [null];

  const names = [];
  for (const id of optionIds) {
    const bank = findQuestionBank(levelId, streamId, subjectId, id);
    for (const q of bank?.questions ?? []) {
      if (!names.includes(q.topic)) names.push(q.topic);
    }
  }
  return names;
}
