// Builds the link for the "Ask AI" button on the results screen.
// It opens the Chatbot page in a new tab, with the right subject chatbot chosen
// and a message that explains the question, the student's answer and the correct answer.
//
// The link looks like:  /chatbot?subject=physics&ask=<the message>
// The Chatbot page reads "subject" and "ask" from the link (see the note in the
// reply: that page is owned by the chatbot team, so it needs a small change to use them).

const LETTERS = ['A', 'B', 'C', 'D'];

// The chatbot subjects (ids from features/chatbot/data/subjects.js).
// Only the ids are copied here, so this page does not import from another feature.
const CHATBOT_BY_SUBJECT = {
  english: 'english',
  math: 'mathematics',
  amath: 'mathematics',
  fMath: 'mathematics',
  physics: 'physics',
  chemistry: 'chemistry',
  biology: 'biology',
  // Every other subject (Mother Tongue, Humanities, Geography, History, Computing,
  // Principles of Accounts, ...) goes to the "Others" chatbot.
};

// Science topics belong to Physics, Chemistry or Biology. Primary and lower secondary
// "Science" and Combined Science mix the three, so we pick the chatbot from the topic.
// Topics not listed here go to "Others".
const CHATBOT_BY_SCIENCE_TOPIC = {
  // Physics
  Kinematics: 'physics',
  Energy: 'physics',
  Dynamics: 'physics',
  Electricity: 'physics',
  Forces: 'physics',
  'Turning effect of forces': 'physics',
  'Electrical systems': 'physics',
  Heat: 'physics',
  'Water cycle': 'physics',
  Light: 'physics',
  Magnets: 'physics',
  // Chemistry
  'Atomic structure': 'chemistry',
  'Acids and bases': 'chemistry',
  'Chemical bonding': 'chemistry',
  'Mole concept': 'chemistry',
  'Rate of reactions': 'chemistry',
  'Food chemistry': 'chemistry',
  Matter: 'chemistry',
  Materials: 'chemistry',
  'Particulate nature of matter': 'chemistry',
  // Biology
  'Cell structure': 'biology',
  Cells: 'biology',
  'Nutrition in humans': 'biology',
  'Transport in plants': 'biology',
  'Transport in humans': 'biology',
  'Biological molecules': 'biology',
  'Plant systems': 'biology',
  'Life cycles': 'biology',
  'Diversity of living things': 'biology',
  'Human digestive system': 'biology',
  Digestion: 'biology',
};

const SCIENCE_SUBJECTS = ['science', 'fScience', 'combinedScience'];

// Which chatbot should answer this question? Returns a chatbot subject id.
export function chatbotFor(subjectId, topic) {
  if (SCIENCE_SUBJECTS.includes(subjectId)) {
    return CHATBOT_BY_SCIENCE_TOPIC[topic] ?? 'others';
  }
  return CHATBOT_BY_SUBJECT[subjectId] ?? 'others';
}

// One line about how long the student took on this question compared with
// the rest of the quiz, e.g.
//   "Time: I took 45 s on this question. My average was 20 s per question,
//    so this was much slower than usual (the slowest of my 10 questions)."
// allSeconds = time spent on every question in the quiz.
function describeTime(item, allSeconds = []) {
  if (allSeconds.length < 2) return `Time: I took ${item.seconds} s on this question.`;

  const average = Math.round(allSeconds.reduce((sum, s) => sum + s, 0) / allSeconds.length);
  const ratio = average > 0 ? item.seconds / average : 1;

  let compared;
  if (ratio >= 1.5) compared = 'much slower than usual';
  else if (ratio >= 1.15) compared = 'a bit slower than usual';
  else if (ratio <= 0.5) compared = 'much faster than usual';
  else if (ratio <= 0.85) compared = 'a bit faster than usual';
  else compared = 'about my usual speed';

  // 1 = the slowest question in the quiz.
  const total = allSeconds.length;
  const rank = allSeconds.filter((s) => s > item.seconds).length + 1;
  const fastest = allSeconds.every((s) => s >= item.seconds);
  let place;
  if (rank === 1) place = `the slowest of my ${total} questions`;
  else if (fastest) place = `the fastest of my ${total} questions`;
  else place = `my ${ordinal(rank)} slowest of ${total}`;

  return (
    `Time: I took ${item.seconds} s on this question. My average was ${average} s per question, ` +
    `so this was ${compared} (${place}).`
  );
}

// 1 -> "1st", 2 -> "2nd", 3 -> "3rd", 4 -> "4th", 11 -> "11th"
function ordinal(n) {
  if (n % 100 >= 11 && n % 100 <= 13) return `${n}th`;
  return n + ({ 1: 'st', 2: 'nd', 3: 'rd' }[n % 10] ?? 'th');
}

// The message sent to the chatbot for one question.
export function buildAskMessage(item, context) {
  const { levelName, streamName, subjectName } = context;
  const options = item.options.map((text, i) => `${LETTERS[i]}. ${text}`).join('\n');
  const myAnswer = item.skipped ? 'I skipped this question.' : `${LETTERS[item.choice]}. ${item.options[item.choice]}`;

  return [
    `I am a ${levelName}${streamName ? ` (${streamName})` : ''} student in Singapore.`,
    `I just did this ${subjectName} quiz question (topic: ${item.topic}) and want to understand it.`,
    '',
    `Question: ${item.question}`,
    options,
    '',
    `My answer: ${myAnswer}`,
    `Correct answer: ${LETTERS[item.answer]}. ${item.options[item.answer]}`,
    describeTime(item, context.allSeconds),
    '',
    item.skipped
      ? 'Please explain how to solve this question, step by step, at my level.'
      : 'Please explain why the correct answer is right and where my answer went wrong, step by step, at my level.',
    // (The "no LaTeX, plain-text maths" rule is in the chatbot's system prompt, so it is not shown here.)
  ].join('\n');
}

// The link to open in a new tab.
export function buildAskLink(item, context) {
  const params = new URLSearchParams({
    subject: chatbotFor(context.subjectId, item.topic),
    ask: buildAskMessage(item, context),
  });
  return `/chatbot?${params.toString()}`;
}
