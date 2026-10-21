// All AI calls for the Weakness Identification page live here.
// We only talk to the AI through askLLM() from shared/llm.js (no API keys in this file).
import { askLLM } from '../../shared/llm.js';

// Added to every system prompt: the page cannot show LaTeX, so maths must be plain text.
const PLAIN_MATHS =
  'Never use LaTeX. Write all maths in simple plain text, e.g. 5 × 4 ÷ 2 = 10, x^2, sqrt(2), 3/4. ';

// Asks the AI for 10 MCQs when there is no mock bank for a subject.
// Returns an array of questions, or null if the AI is unavailable or the reply is unusable.
// Kept short on purpose: askLLM only allows a short reply, so we don't ask for explanations here.
// If focusTopic is given, it asks for 5 questions on that one topic instead.
export async function generateQuestions({ levelName, streamName, subjectName, focusTopic = null }) {
  const systemPrompt =
    'You write multiple-choice quiz questions for Singapore students, following the MOE syllabus. ' +
    PLAIN_MATHS +
    'Reply with JSON only. No extra text.';

  const count = focusTopic ? 5 : 10;
  const coverage = focusTopic
    ? `All questions must be on the topic "${focusTopic}". `
    : 'Cover 3 or 4 different topics, at least 2 questions per topic. ';

  const userPrompt =
    `Write ${count} multiple-choice questions for ${levelName}` +
    (streamName ? ` (${streamName})` : '') +
    ` ${subjectName}. ${coverage}` +
    'Mix "understanding" questions (knowing the idea) and "application" questions (using it), ' +
    'and mix "easy", "medium" and "hard" questions. ' +
    'Keep each question under 30 words. Reply as a JSON array like: ' +
    '[{"topic":"Fractions","skill":"understanding","difficulty":"easy","question":"...","options":["...","...","...","..."],"answer":0}] ' +
    'where "answer" is the index (0-3) of the correct option.';

  const reply = await safeAsk(userPrompt, systemPrompt);
  return parseQuestions(reply, count);
}

// Calls askLLM but never throws, so the page can always fall back gracefully.
async function safeAsk(userPrompt, systemPrompt) {
  try {
    return await askLLM([{ role: 'user', content: userPrompt }], systemPrompt);
  } catch {
    return 'Something went wrong while contacting the AI.';
  }
}

// ---------------------------------------------------------------------------
// AI revision suggestions (results screen)
// ---------------------------------------------------------------------------

const LETTERS = ['A', 'B', 'C', 'D'];

// Asks the AI for a revision plan based on the quiz analysis (from analysis.js).
// Returns { ok: true, plan } or { ok: false, message } so the page can fall back.
// Only quiz content is sent: no names or personal details.
export async function getSuggestions(analysis, { levelName, streamName, subjectName }) {
  const systemPrompt =
    'You are a kind, clear tutor for Singapore students (MOE syllabus). ' +
    'Explain mistakes simply, at the level of the student. ' +
    'For each mistake say whether it is an Understanding problem (does not know the idea) ' +
    'or an Application problem (knows the idea but cannot use it in a problem). ' +
    PLAIN_MATHS +
    'Reply with JSON only. No extra text.';

  const userPrompt =
    `Student: ${levelName}${streamName ? ` (${streamName})` : ''}, ${subjectName}.\n` +
    `Score: ${analysis.score}/${analysis.total}.\n\n` +
    `Topics (weakest first):\n${describeTopics(analysis)}\n\n` +
    `Wrong answers:\n${describeMistakes(analysis) || 'None'}\n\n` +
    'Reply as JSON in exactly this shape (keep every text under 35 words):\n' +
    '{"summary":"2 short sentences on how they did",' +
    '"priorities":[{"topic":"...","type":"Understanding or Application","why":"...","revise":["...","..."],"tip":"..."}],' +
    '"mistakes":[{"q":3,"type":"Understanding or Application","explanation":"where and why it went wrong"}],' +
    '"nextSteps":["...","..."]}\n' +
    'Give at most 3 priorities (weakest topics first) and one "mistakes" entry per wrong answer listed above.';

  const reply = await safeAsk(userPrompt, systemPrompt);
  const plan = parsePlan(reply);
  if (!plan) {
    // askLLM returns a readable message (e.g. "No API key found...") when it fails.
    return { ok: false, message: reply.length < 200 ? reply : 'The AI reply could not be read.' };
  }
  return { ok: true, plan };
}

// One line per topic, e.g. "- Ratio: 1/3 correct, Misconception, avg 40s"
function describeTopics(analysis) {
  return analysis.topics
    .map((t) => `- ${t.name}: ${t.correct}/${t.total} correct, ${t.diagnosis.label}, avg ${Math.round(t.avgSeconds)}s`)
    .join('\n');
}

// Only the wrong answers, capped at 6 so the AI reply stays short.
function describeMistakes(analysis) {
  return analysis.items
    .filter((i) => !i.correct)
    .slice(0, 6)
    .map((i) => {
      const given = i.skipped ? 'skipped' : `${LETTERS[i.choice]}. ${i.options[i.choice]}`;
      return (
        `Q${i.number} [${i.topic}, ${i.skill}, confidence: ${i.confidence ?? 'not given'}] ${i.question}\n` +
        `  Student: ${given} | Correct: ${LETTERS[i.answer]}. ${i.options[i.answer]}`
      );
    })
    .join('\n');
}

// Pulls the JSON object out of the AI reply and makes sure every part is usable.
function parsePlan(text) {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1) return null;

  let data;
  try {
    data = JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
  if (typeof data.summary !== 'string') return null;

  const asList = (value) => (Array.isArray(value) ? value.filter((v) => typeof v === 'string') : []);

  return {
    summary: data.summary,
    priorities: (Array.isArray(data.priorities) ? data.priorities : []).slice(0, 3).map((p) => ({
      topic: String(p.topic ?? ''),
      type: p.type === 'Application' ? 'Application' : 'Understanding',
      why: String(p.why ?? ''),
      revise: asList(p.revise),
      tip: p.tip ? String(p.tip) : null,
    })),
    mistakes: (Array.isArray(data.mistakes) ? data.mistakes : [])
      .filter((m) => Number.isInteger(m.q) && typeof m.explanation === 'string')
      .map((m) => ({
        q: m.q,
        type: m.type === 'Application' ? 'Application' : 'Understanding',
        explanation: m.explanation,
      })),
    nextSteps: asList(data.nextSteps),
  };
}

// Same shape as the AI plan, built from rules only.
// Used when the AI is unavailable, so the student always gets advice.
export function buildOfflinePlan(analysis) {
  // Topics are already sorted weakest first; take up to 3 that lost marks.
  const focusTopics = analysis.topics.filter((t) => t.percent < 100).slice(0, 3);

  const priorities = focusTopics.map((topic) => {
    const wrong = topic.items.filter((i) => !i.correct);
    const applicationWrong = wrong.filter((i) => i.skill === 'application').length;
    const type = applicationWrong > wrong.length / 2 ? 'Application' : 'Understanding';
    return {
      topic: topic.name,
      type,
      why: topic.skillNote ?? topic.diagnosis.summary,
      revise: reviseIdeas(topic.diagnosis.key, type, topic.name),
      tip: topic.diagnosis.key === 'misconception'
        ? 'For each wrong answer, write one line on why your choice was wrong. This stops the same mistake coming back.'
        : null,
    };
  });

  const nextSteps = [];
  if (analysis.confidentWrongCount > 0) {
    nextSteps.push('Re-read the "Where it went wrong" notes for answers you were sure about. These matter most.');
  }
  if (analysis.skippedCount > 0) {
    nextSteps.push('Next time, give every question a try. Even a guess helps us find your weak spots.');
  }
  nextSteps.push('Take the quiz again in a few days. You will get a new set of questions.');

  const summary =
    analysis.score === analysis.total
      ? `You scored ${analysis.score}/${analysis.total}. Excellent work! Keep practising to make it stick.`
      : `You scored ${analysis.score}/${analysis.total}. ${analysis.pattern.title}`;

  return { summary, priorities, mistakes: [], nextSteps };
}

// Simple revision ideas depending on the kind of problem.
function reviseIdeas(diagnosisKey, type, topicName) {
  if (diagnosisKey === 'skipped') {
    return [`Read your notes on ${topicName}`, 'Try every question, even if you have to guess'];
  }
  if (type === 'Understanding') {
    return [
      `Re-learn the key rules and definitions for ${topicName}`,
      'Explain each rule in your own words, or to a friend',
      'Then try 3 easy questions to check',
    ];
  }
  return [
    `Study 2–3 worked examples on ${topicName}, step by step`,
    'Cover the solution and try the same question yourself',
    'Check each step against the method, not just the final answer',
  ];
}

// ---------------------------------------------------------------------------

// Pulls the JSON array out of the AI reply and checks every question is usable.
function parseQuestions(text, count) {
  const start = text.indexOf('[');
  const end = text.lastIndexOf(']');
  if (start === -1 || end === -1) return null;

  let list;
  try {
    list = JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }

  const valid = Array.isArray(list)
    ? list.filter(
        (q) =>
          typeof q.question === 'string' &&
          Array.isArray(q.options) &&
          q.options.length === 4 &&
          Number.isInteger(q.answer) &&
          q.answer >= 0 &&
          q.answer <= 3
      )
    : [];

  // Need a full quiz. If the reply was cut off, treat it as a failure.
  if (valid.length < count) return null;

  return valid.slice(0, count).map((q) => ({
    topic: q.topic || 'General',
    skill: q.skill === 'application' ? 'application' : 'understanding',
    difficulty: ['easy', 'medium', 'hard'].includes(q.difficulty) ? q.difficulty : null,
    question: q.question,
    options: q.options.map(String),
    answer: q.answer,
    explanation: null, // filled in later by the AI feedback step
    whyWrong: null,
  }));
}
