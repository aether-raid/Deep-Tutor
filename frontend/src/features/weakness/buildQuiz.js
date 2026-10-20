// Builds a fresh quiz so every attempt is different:
//   1. picks 10 questions spread evenly across topics (every topic gets at least 2)
//   2. prefers questions the student did NOT see in their last attempt
//   3. mixes easy, medium and hard questions within each topic
//   4. shuffles the question order and the A–D order of the options

const QUIZ_LENGTH = 10;

// Question texts from the last attempt, per bank. Kept in memory only,
// so it is forgotten when the page is reloaded (no student data is stored).
const lastSeen = {};

// Returns a shuffled copy of a list (Fisher–Yates shuffle).
export function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Shuffles A–D for one question and keeps "answer" and "whyWrong" lined up.
export function shuffleOptions(question) {
  const order = shuffle([0, 1, 2, 3]); // e.g. [2, 0, 3, 1] = old option 2 is now A
  return {
    ...question,
    options: order.map((i) => question.options[i]),
    answer: order.indexOf(question.answer),
    whyWrong: question.whyWrong ? order.map((i) => question.whyWrong[i]) : null,
  };
}

// Reorders a shuffled pile so the difficulties take turns (e.g. easy, hard, medium, easy, ...).
// Taking the first 2 or 3 questions of a topic then gives a mix instead of, say, two easy ones.
function mixDifficulties(pile) {
  const groups = {};
  for (const q of pile) {
    const key = q.difficulty ?? 'medium';
    if (!groups[key]) groups[key] = [];
    groups[key].push(q);
  }
  const lists = Object.values(groups);
  const mixed = [];
  while (lists.some((list) => list.length > 0)) {
    for (const list of lists) {
      if (list.length > 0) mixed.push(list.shift());
    }
  }
  return mixed;
}

// Makes a new 10-question quiz from a question bank.
// If focusTopic is given (from the "Practice" buttons), it makes a short quiz
// using every question on that one topic instead.
export function buildQuiz(bank, focusTopic = null) {
  if (focusTopic) {
    const topicQuestions = bank.questions.filter((q) => q.topic === focusTopic);
    if (topicQuestions.length > 0) return shuffle(topicQuestions).map(shuffleOptions);
    // Topic not in this bank: fall through to a normal mixed quiz.
  }

  const seen = lastSeen[bank.id] ?? new Set();

  // Put the questions into one pile per topic.
  const piles = {};
  for (const q of bank.questions) {
    if (!piles[q.topic]) piles[q.topic] = [];
    piles[q.topic].push(q);
  }

  // Shuffle each pile, mix the difficulties, then move questions seen last time to the bottom.
  const pools = Object.values(piles).map((pile) => {
    const mixed = shuffle(pile);
    return [
      ...mixDifficulties(mixed.filter((q) => !seen.has(q.question))),
      ...mixDifficulties(mixed.filter((q) => seen.has(q.question))),
    ];
  });

  // Take one question from each topic in turn until we have 10.
  const picked = [];
  while (picked.length < QUIZ_LENGTH && pools.some((pool) => pool.length > 0)) {
    for (const pool of shuffle(pools)) {
      if (picked.length < QUIZ_LENGTH && pool.length > 0) {
        picked.push(pool.shift());
      }
    }
  }

  lastSeen[bank.id] = new Set(picked.map((q) => q.question));
  return shuffle(picked).map(shuffleOptions);
}
