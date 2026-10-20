// Turns a finished quiz into an easy-to-read analysis.
// No AI here: these are simple rules based on the answers, the student's
// confidence and the time spent. Step 4 sends this analysis to the AI for advice.

export const CONFIDENCE_LABELS = {
  guess: 'Guessing',
  fairly: 'Fairly sure',
  certain: 'Certain',
};

// What each skill type means, in words for students.
export const SKILL_INFO = {
  understanding: {
    label: 'Understanding',
    meaning: 'This question checks whether you know the idea itself (a fact, rule or definition).',
  },
  application: {
    label: 'Application',
    meaning: 'This question checks whether you can use the idea to solve a problem.',
  },
};

// Question difficulty (see data/questions.js). AI-generated questions may not have one.
export const DIFFICULTY_LABELS = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};

// Topic status, from worst to best. Same wording as the concept map.
export const TOPIC_STATUS = {
  weak: { label: 'Needs work', order: 0 },
  moderate: { label: 'Shaky', order: 1 },
  strong: { label: 'Strong', order: 2 },
  none: { label: 'Not enough data', order: 3 },
};

// ---------- Main function ----------

export function analyseQuiz({ questions, answers, totalSeconds }) {
  // 1. One record per question with everything we know about it.
  const items = questions.map((q, i) => {
    const a = answers[i];
    const skipped = a.choice === null;
    const correct = a.choice === q.answer;
    const confident = a.confidence === 'fairly' || a.confidence === 'certain';
    return {
      ...q,
      number: i + 1,
      choice: a.choice,
      confidence: a.confidence,
      seconds: a.seconds,
      skipped,
      correct,
      confidentWrong: !correct && !skipped && confident, // sure, but wrong = likely misconception
      luckyGuess: correct && a.confidence === 'guess', // right, but only by guessing
    };
  });

  const score = items.filter((i) => i.correct).length;
  const avgSeconds = average(items.map((i) => i.seconds));

  // 2. Group questions by topic and score each topic.
  const topicNames = [...new Set(items.map((i) => i.topic))];
  const topics = topicNames
    .map((name) => analyseTopic(name, items.filter((i) => i.topic === name), avgSeconds))
    .sort(compareTopics);

  // 3. Topics that need the most help (all "Needs work", or the lowest one if none).
  let weakestTopics = topics.filter((t) => t.status === 'weak');
  if (weakestTopics.length === 0 && topics[0] && topics[0].percent < 100) {
    weakestTopics = [topics[0]];
  }

  return {
    items,
    topics,
    weakestTopics,
    score,
    total: items.length,
    percent: Math.round((score / items.length) * 100),
    totalSeconds,
    avgSeconds,
    confidentWrongCount: items.filter((i) => i.confidentWrong).length,
    luckyGuessCount: items.filter((i) => i.luckyGuess).length,
    skippedCount: items.filter((i) => i.skipped).length,
    pattern: findPattern(items, weakestTopics),
  };
}

// ---------- Per-topic analysis ----------

function analyseTopic(name, items, overallAvgSeconds) {
  const correct = items.filter((i) => i.correct).length;
  const total = items.length;
  const percent = Math.round((correct / total) * 100);
  const avgSeconds = average(items.map((i) => i.seconds));
  const slow = avgSeconds > overallAvgSeconds * 1.5; // much slower than the student's own average

  let status;
  if (total < 2) status = 'none';
  else if (percent < 50) status = 'weak';
  else if (percent < 80) status = 'moderate';
  else status = 'strong';

  const wrong = items.filter((i) => !i.correct);
  const understandingWrong = wrong.filter((i) => i.skill === 'understanding').length;
  const applicationWrong = wrong.filter((i) => i.skill === 'application').length;

  return {
    name,
    items,
    correct,
    total,
    percent,
    avgSeconds,
    status,
    statusLabel: TOPIC_STATUS[status].label,
    confidence: mostCommonConfidence(items),
    diagnosis: diagnoseTopic(items, wrong, slow),
    skillNote: skillNote(items, understandingWrong, applicationWrong),
    evidence: buildEvidence(items, avgSeconds, overallAvgSeconds),
  };
}

// Gives the topic one clear label, like a teacher would.
function diagnoseTopic(items, wrong, slow) {
  if (wrong.length === 0) {
    if (items.some((i) => i.luckyGuess)) {
      return {
        key: 'lucky',
        label: 'Lucky guess',
        summary: 'All correct, but you guessed at least one. Revise it so you can be sure next time.',
      };
    }
    if (slow) {
      return {
        key: 'slow',
        label: 'Correct but slow',
        summary: 'You got it right but took much longer than usual. More practice will build speed.',
      };
    }
    return { key: 'secure', label: 'Secure', summary: 'Correct, confident and at a good pace. Well done!' };
  }

  if (wrong.every((i) => i.skipped)) {
    return {
      key: 'skipped',
      label: 'Not attempted',
      summary: 'You skipped the questions you missed here. Try them, because a guess teaches us more than a blank.',
    };
  }

  if (wrong.some((i) => i.confidentWrong)) {
    return {
      key: 'misconception',
      label: 'Misconception',
      summary: 'You felt sure but got it wrong. You may have learnt a rule or idea incorrectly.',
    };
  }

  return {
    key: 'gap',
    label: 'Knowledge gap',
    summary: 'You were unsure and got it wrong. This topic needs to be learnt again from the basics.',
  };
}

// Explains whether mistakes came from the idea itself or from using it.
function skillNote(items, understandingWrong, applicationWrong) {
  const understandingRight = items.some((i) => i.skill === 'understanding' && i.correct);
  if (understandingWrong === 0 && applicationWrong === 0) return null;
  if (understandingWrong === 0 && understandingRight) {
    return 'You know the idea, but you make mistakes when using it in a problem (Application).';
  }
  if (applicationWrong === 0) {
    return 'Your mistakes were about the idea itself (Understanding). Learn the rule first, then practise.';
  }
  return 'You lost marks on both knowing the idea (Understanding) and using it (Application). Start with the idea.';
}

// Short, factual bullet points that back up the diagnosis.
function buildEvidence(items, topicAvg, overallAvg) {
  const evidence = [];
  const list = (arr) => arr.map((i) => `Q${i.number}`).join(', ');

  const confidentWrong = items.filter((i) => i.confidentWrong);
  if (confidentWrong.length > 0) {
    evidence.push(`${list(confidentWrong)}: answered with confidence, but wrong.`);
  }
  const lucky = items.filter((i) => i.luckyGuess);
  if (lucky.length > 0) {
    evidence.push(`${list(lucky)}: correct, but you said you were guessing.`);
  }
  const skipped = items.filter((i) => i.skipped);
  if (skipped.length > 0) {
    evidence.push(`${list(skipped)}: skipped.`);
  }
  if (overallAvg > 0 && topicAvg > overallAvg * 1.5) {
    evidence.push(`About ${Math.round(topicAvg)}s per question here, compared with your average of ${Math.round(overallAvg)}s.`);
  }
  if (evidence.length === 0) {
    const right = items.filter((i) => i.correct);
    if (right.length === items.length) evidence.push('Every question in this topic was correct.');
    else evidence.push(`${list(items.filter((i) => !i.correct))}: wrong.`);
  }
  return evidence;
}

// ---------- Overall pattern (the banner at the top) ----------

function findPattern(items, weakestTopics) {
  const wrong = items.filter((i) => !i.correct && !i.skipped);
  const confidentWrong = items.filter((i) => i.confidentWrong);
  const understandingWrong = wrong.filter((i) => i.skill === 'understanding').length;
  const applicationWrong = wrong.filter((i) => i.skill === 'application').length;
  const focus = weakestTopics.map((t) => t.name);

  if (wrong.length === 0 && items.every((i) => i.correct)) {
    return { title: 'Excellent: every answer is correct!', detail: 'Try again for a new set of questions to make sure it sticks.', focus };
  }

  if (confidentWrong.length >= 2) {
    const topics = [...new Set(confidentWrong.map((i) => i.topic))].join(' and ');
    return {
      title: `${confidentWrong.length} answers were confident but wrong.`,
      detail: `These are likely misconceptions in ${topics}: ideas you believe are right but aren't. Fix these first, because they won't go away with practice alone.`,
      focus,
    };
  }

  if (applicationWrong >= 2 && applicationWrong >= understandingWrong * 2) {
    return {
      title: 'Most of your mistakes were in Application.',
      detail: 'You know the ideas, but slip up when using them in problems. Practise worked examples step by step.',
      focus,
    };
  }

  if (understandingWrong >= 2 && understandingWrong >= applicationWrong * 2) {
    return {
      title: 'Most of your mistakes were in Understanding.',
      detail: 'Some key ideas are not secure yet. Review the rules and definitions before doing more practice questions.',
      focus,
    };
  }

  return {
    title: focus.length ? `Your weakest area: ${focus.join(', ')}.` : 'A good attempt overall.',
    detail: 'Your mistakes were a mix of Understanding and Application. Start with the topic marked "Needs work".',
    focus,
  };
}

// ---------- Small helpers ----------

// Weakest first: lowest score, then most confident-wrong answers, then slowest.
function compareTopics(a, b) {
  if (a.status === 'none' && b.status !== 'none') return 1;
  if (b.status === 'none' && a.status !== 'none') return -1;
  if (a.percent !== b.percent) return a.percent - b.percent;
  const aCw = a.items.filter((i) => i.confidentWrong).length;
  const bCw = b.items.filter((i) => i.confidentWrong).length;
  if (aCw !== bCw) return bCw - aCw;
  return b.avgSeconds - a.avgSeconds;
}

function average(numbers) {
  if (numbers.length === 0) return 0;
  return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
}

// The confidence the student chose most often in a topic ("Not given" if none).
function mostCommonConfidence(items) {
  const counts = {};
  for (const i of items) {
    if (i.confidence) counts[i.confidence] = (counts[i.confidence] ?? 0) + 1;
  }
  const top = Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0];
  return top ? CONFIDENCE_LABELS[top] : 'Not given';
}

// Shows seconds as "3 min 20 s" or "45 s".
export function formatDuration(seconds) {
  const s = Math.round(seconds);
  if (s < 60) return `${s} s`;
  const m = Math.floor(s / 60);
  const rest = s % 60;
  return rest === 0 ? `${m} min` : `${m} min ${rest} s`;
}
