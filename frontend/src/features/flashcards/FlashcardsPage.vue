<!--
  Flashcards feature: standalone page for the team app.

  Screens, in order:
    1. Curriculum   – O Level / IB Diploma / A Level
    2. Subjects     – e.g. Mathematics, Physics, Computer Science HL
    3. Syllabus     – every topic and sub-topic; GREEN = deck ready, GREY = locked
    4. Flashcards   – the timed card practice, results page and "Focus on wrong"

  Data lives in ./data/syllabus.js (topics) and ./data/cards.js (flashcard decks).
  AI calls go through the shared askLLM() helper. Styling uses ONLY theme.css variables.
-->
<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { decks, TIME_LIMITS } from './data/cards.js';
import { levels } from './data/syllabus.js';
// FlashcardsPage.vue lives in src/features/flashcards/,
// so we go up TWO folders to reach src/shared/llm.js.
import { askLLM } from '../../shared/llm.js';

// ---------- Deck and progress ----------

function buildDeck(source) {
  return source.map((card, order) => {
    // A card can ask for a longer timer (e.g. a multi-step maths question); otherwise use its difficulty.
    const configured = Number(card.seconds ?? TIME_LIMITS?.[card.difficulty]);
    const timeLimit = Number.isFinite(configured) && configured > 0 ? configured : 60;

    return {
      ...card,
      id: String(card.id ?? `card-${order}`),
      timeLimit,
      timeLeft: timeLimit,
      started: false,
      endsAt: null,
      flipped: false,
      revealed: false,
      result: null, // null | 'correct' | 'wrong'
      timedOut: false,
    };
  });
}

const sourceCards = ref([]);   // the original deck of the chosen sub-topic (used by Reset)
const deck = ref([]);          // the cards in the current round
const index = ref(0);
const round = ref(1);
const showResults = ref(false);
const reviewNote = ref('');
const generating = ref(false);
const generatingText = ref('');
const generationError = ref('');
let generationSerial = 0;

const currentCard = computed(() => deck.value[index.value] ?? null);
const total = computed(() => deck.value.length);
// Counts come from each card's SAVED result, so going back or double-clicking can't double count.
const correctCount = computed(() => deck.value.filter(card => card.result === 'correct').length);
const wrongCount = computed(() => deck.value.filter(card => card.result === 'wrong').length);
const answeredCount = computed(() => correctCount.value + wrongCount.value);

// Accuracy = correct / (correct + wrong) * 100
const accuracy = computed(() => answeredCount.value === 0
  ? 0 : 100 * correctCount.value / answeredCount.value);

// Results page: wrong % is worked out from the ROUNDED correct %, so the two always add up to 100%.
const wrongPercent = computed(() => (answeredCount.value === 0 ? 0 : 100 - Math.round(accuracy.value)));

// Round progress = (correct + wrong) / total * 100
const progress = computed(() => total.value === 0
  ? 0 : 100 * answeredCount.value / total.value);

const allDone = computed(() => total.value > 0 && answeredCount.value === total.value);
const isLast = computed(() => index.value === total.value - 1);
const canNext = computed(() => Boolean(currentCard.value?.result));
const status = computed(() => {
  const card = currentCard.value;
  if (!card) return '';
  if (card.timedOut) return "Time's up — automatically marked Wrong.";
  if (card.result === 'correct') return '✓ Marked Correct';
  if (card.result === 'wrong') return '× Marked Wrong';
  return '';
});

function wholePercent(value) {
  return `${Math.round(value)}%`;
}

// Label on review-round cards, showing how the card was made.
function variationLabel(source) {
  if (source === 'auto') return '✦ New numbers';
  if (source === 'alt') return '✦ Asked another way';
  return '✦ AI variation';
}

// ---------- Navigation: curriculum → subject → syllabus → flashcards ----------

const view = ref('levels'); // 'levels' | 'subjects' | 'syllabus' | 'study'
const selectedLevel = ref(null);
const selectedSubject = ref(null);
const selectedSubtopic = ref(null);

// A sub-topic is READY when data/cards.js has a non-empty deck for it.
function deckFor(subtopic) {
  const list = subtopic?.deck ? decks?.[subtopic.deck] : null;
  return Array.isArray(list) && list.length > 0 ? list : null;
}

function readyInSubject(subject) {
  return (subject?.topics ?? []).reduce(
    (count, topic) => count + (topic.subtopics ?? []).filter(deckFor).length, 0);
}

function readyInLevel(level) {
  return (level?.subjects ?? []).reduce((count, subject) => count + readyInSubject(subject), 0);
}

function topicHasReady(topic) {
  return (topic.subtopics ?? []).some(deckFor);
}

function subtopicCount(subject) {
  return (subject?.topics ?? []).reduce((count, topic) => count + (topic.subtopics ?? []).length, 0);
}

function subjectTitle(subject) {
  return subject ? `${subject.name}${subject.tag ? ` ${subject.tag}` : ''}` : '';
}

// Groups topics under their theme heading (e.g. "Theme A — Concepts of computer science").
function themeGroups(subject) {
  const groups = [];
  for (const topic of subject?.topics ?? []) {
    const last = groups[groups.length - 1];
    if (last && last.theme === (topic.theme ?? '')) last.topics.push(topic);
    else groups.push({ theme: topic.theme ?? '', topics: [topic] });
  }
  return groups;
}

// Stops any AI generation that is still running (e.g. when leaving the flashcards).
function stopGenerating() {
  generationSerial += 1;
  generating.value = false;
  generatingText.value = '';
}

function openLevel(level) {
  selectedLevel.value = level;
  view.value = 'subjects';
}

function openSubject(subject) {
  selectedSubject.value = subject;
  view.value = 'syllabus';
}

function startSubtopic(subtopic) {
  const list = deckFor(subtopic);
  if (!list) return; // locked sub-topic: nothing to start
  stopGenerating();
  selectedSubtopic.value = subtopic;
  sourceCards.value = list;
  reviewNote.value = '';
  generationError.value = '';
  startRound(list, 1);
  view.value = 'study';
}

// Leaving the flashcards (via the breadcrumb or 'Back to syllabus') ends the current round;
// opening the sub-topic again starts a fresh round.
function goTo(target) {
  if (view.value === 'study') stopGenerating();
  view.value = target;
}

// ---------- Timer (accurate even if the browser tab was inactive) ----------

let ticker = null;

function expireCard(card) {
  if (!card || card.result) return;
  card.timeLeft = 0;
  card.result = 'wrong';
  card.timedOut = true;
  card.revealed = true;
  card.flipped = true;
}

function updateTimer() {
  if (view.value !== 'study' || showResults.value) return;
  const card = currentCard.value;
  if (!card || !card.started || card.result) return;

  card.timeLeft = Math.max(0, Math.ceil((card.endsAt - Date.now()) / 1000));
  if (card.timeLeft === 0) expireCard(card);
}

onMounted(() => {
  ticker = setInterval(updateTimer, 200);
});

onUnmounted(() => {
  clearInterval(ticker);
  generationSerial += 1;
});

function startTimer() {
  const card = currentCard.value;
  if (!card || card.started || card.result) return;
  card.started = true;
  card.endsAt = Date.now() + card.timeLimit * 1000;
}

// Green → yellow (75% left) → amber (50% left) → red (25% left)
const timerTone = computed(() => {
  const card = currentCard.value;
  if (!card) return 'green';
  const fraction = card.timeLeft / card.timeLimit;
  if (fraction <= 0.25) return 'red';
  if (fraction <= 0.5) return 'amber';
  if (fraction <= 0.75) return 'yellow';
  return 'green';
});

function formattedTime(seconds) {
  const safeSeconds = Math.max(0, Math.ceil(seconds || 0));
  return `${String(Math.floor(safeSeconds / 60)).padStart(2, '0')}:${String(safeSeconds % 60).padStart(2, '0')}`;
}

const remainingPercent = computed(() => currentCard.value
  ? 100 * currentCard.value.timeLeft / currentCard.value.timeLimit : 0);

// ---------- Click-to-flip and answer navigation ----------

function flipCard() {
  const card = currentCard.value;
  if (!card || !card.started) return;
  if (!card.result && Date.now() >= card.endsAt) {
    expireCard(card);
    return;
  }
  card.flipped = !card.flipped; // Click only — NEVER flip on hover.
  if (card.flipped) card.revealed = true;
  // The timer keeps running after the answer is revealed.
}

function markAnswer(result) {
  const card = currentCard.value;
  if (!card || !card.started || !card.flipped || card.result) return;
  if (Date.now() >= card.endsAt) {
    expireCard(card);
    return;
  }
  // Once marked, this card has exactly one saved result (and its timer stops).
  card.result = result;
}

function goBack() {
  if (index.value > 0) index.value -= 1;
}

function goNext() {
  if (!canNext.value) return; // cannot skip an unanswered card
  if (isLast.value) {
    if (allDone.value) {
      showResults.value = true;
      // The "how this round was built" notes belong to the start of a round, not its results page.
      reviewNote.value = '';
      generationError.value = '';
    }
    return;
  }
  index.value += 1;
}

function startRound(source, roundNumber) {
  deck.value = buildDeck(source);
  index.value = 0;
  round.value = roundNumber;
  showResults.value = false;
}

function resetAll() {
  if (generating.value) return;
  generationSerial += 1;
  startRound(sourceCards.value, 1);
  reviewNote.value = '';
  generationError.value = '';
}

// ---------- Review round: 3 extra practice cards for EVERY wrong card ----------
//
// For each wrong card the review round contains:
//   the original card  +  3 new cards testing the same idea.
//
// How the 3 new cards are made, in this order:
//   1. NUMBER cards with a "vary" recipe → code makes new numbers and calculates the answer (always correct).
//   2. CONCEPT cards with "alternates"   → pre-written questions asking the same idea another way.
//   3. Still short?                      → ask the AI (askLLM) for the rest.
//   4. Last resort                       → code varies simple sums like "What is 12 × 7?".
const EXTRA_PER_WRONG = 3;

// Mixes a list into random order (Fisher–Yates shuffle) without changing the original.
function shuffled(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Takes up to "count" pre-written alternate questions that haven't been used yet.
function fromAlternates(card, count, used) {
  const made = [];
  for (const alt of shuffled(card.alternates ?? [])) {
    if (made.length === count) break;
    const key = String(alt.question).trim().toLowerCase();
    if (!alt.question || !alt.answer || used.has(key)) continue;
    used.add(key);
    made.push({ question: alt.question, answer: alt.answer, working: alt.working ?? '', source: 'alt' });
  }
  return made;
}

// Random whole number between min and max (inclusive), in jumps of "step".
function randomInt(min, max, step = 1) {
  const steps = Math.floor((max - min) / step);
  return min + step * Math.floor(Math.random() * (steps + 1));
}

// "What is {a} × {b}?" + { a: 4, b: 9 }  →  "What is 4 × 9?"
function fillTemplate(template, values) {
  return template.replace(/\{(\w+)\}/g, (match, name) => (name in values ? String(values[name]) : match));
}

// Way 1: the card has its own recipe in data/cards.js. Two styles are supported:
//   vary: { make: rand => ({ question, answer, working }) }
//   vary: { template: 'What is {a} × {b}?', numbers: { a: [2, 12], b: [2, 12] }, answer: ({ a, b }) => a * b }
function fromRecipe(card) {
  const recipe = card.vary;
  if (!recipe) return null;

  if (typeof recipe.make === 'function') {
    const made = recipe.make(randomInt);
    if (!made || typeof made.question !== 'string' || made.answer === undefined || made.answer === null) return null;
    return { question: made.question, answer: String(made.answer), working: made.working ? String(made.working) : '', ...(made.code ? { code: made.code } : {}) };
  }

  if (typeof recipe.template !== 'string' || typeof recipe.answer !== 'function') return null;
  const values = {};
  for (const [name, range] of Object.entries(recipe.numbers ?? {})) {
    const [min, max, step = 1] = range;
    values[name] = randomInt(min, max, step);
  }
  const answer = recipe.answer(values);
  if (answer === undefined || answer === null || Number.isNaN(answer)) return null;
  return { question: fillTemplate(recipe.template, values), answer: String(answer) };
}

// Way 2: a simple one-step sum inside the question, e.g. "What is 12 × 7?" or "45 + 38 = ?"
const OPERATIONS = {
  '+': (a, b) => a + b,
  '-': (a, b) => a - b,
  '−': (a, b) => a - b,
  '×': (a, b) => a * b,
  'x': (a, b) => a * b,
  '*': (a, b) => a * b,
  '÷': (a, b) => a / b,
  '/': (a, b) => a / b,
};
const SIMPLE_SUM = /(\d+)\s*([+\-−×x*÷/])\s*(\d+)/;
const FIRST_NUMBER = /-?\d+(?:\.\d+)?/;

function fromSimpleSum(card) {
  const match = String(card.question).match(SIMPLE_SUM);
  const answerNumber = String(card.answer).match(FIRST_NUMBER);
  if (!match || !answerNumber) return null;

  const [whole, aText, op, bText] = match;
  const compute = OPERATIONS[op];
  const a0 = Number(aText);
  const b0 = Number(bText);
  // Only use this when the original answer really IS that sum (so we don't guess wrongly).
  if (!compute || b0 === 0 || Math.abs(compute(a0, b0) - Number(answerNumber[0])) > 1e-9) return null;

  // New numbers of a similar size to the originals.
  const near = n => randomInt(Math.max(1, Math.round(n * 0.5)), Math.round(n * 1.5) + 2);
  let a = near(a0);
  let b = near(b0);
  if (op === '÷' || op === '/') a = b * near(Math.max(1, Math.round(a0 / b0))); // keep division exact
  if ((op === '-' || op === '−') && a0 >= b0 && a < b) [a, b] = [b, a];      // avoid negatives if original had none

  const result = Number(compute(a, b).toFixed(4));
  return {
    question: card.question.replace(whole, `${a} ${op} ${b}`),
    // Swap the number in the original answer, keeping any units such as "kg".
    answer: String(card.answer).replace(FIRST_NUMBER, String(result)),
  };
}

// Makes up to "count" new cards with code (no AI). "used" stops duplicate questions.
function localVariations(card, count, used) {
  const made = [];
  for (let attempt = 0; attempt < 60 && made.length < count; attempt++) {
    const variation = fromRecipe(card) ?? fromSimpleSum(card);
    if (!variation) break; // no recipe and not a simple sum: code can't help with this card
    const key = `${variation.question}\n${variation.code ?? ''}`.trim().toLowerCase();
    if (used.has(key)) continue;
    used.add(key);
    made.push({ ...variation, source: 'auto' });
  }
  return made;
}

// ---------- AI part ----------

function responseText(reply) {
  if (typeof reply === 'string') return reply;
  if (typeof reply?.text === 'string') return reply.text;
  if (typeof reply?.message === 'string') return reply.message;
  if (typeof reply?.answer === 'string') return reply.answer;
  if (typeof reply?.content === 'string') return reply.content;
  if (Array.isArray(reply?.content)) {
    return reply.content.map(part => part?.text || '').join('\n');
  }
  if (typeof reply?.choices?.[0]?.message?.content === 'string') {
    return reply.choices[0].message.content;
  }
  return reply == null ? '' : JSON.stringify(reply);
}

// Gives up on the AI after 20 seconds, so a hanging request can't freeze the results page.
const AI_TIMEOUT_MS = 20000;
function askWithTimeout(prompt) {
  return Promise.race([
    askLLM(prompt),
    new Promise((_, reject) => setTimeout(() => reject(new Error('AI timed out')), AI_TIMEOUT_MS)),
  ]);
}

function parseVariations(reply) {
  const text = responseText(reply).trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '');
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    // Some model responses wrap JSON in explanatory text.
    const from = text.indexOf('[');
    const to = text.lastIndexOf(']');
    if (from < 0 || to <= from) throw new Error('AI did not return a JSON array.');
    parsed = JSON.parse(text.slice(from, to + 1));
  }
  const list = Array.isArray(parsed) ? parsed : (parsed?.variations ?? parsed?.cards);
  if (!Array.isArray(list)) throw new Error('AI did not return a list of questions.');
  return list;
}

// Keeps only good AI cards (up to "max"). Returns fewer if some are unusable — the page fills the gap.
function validateVariations(sourceCard, proposed, used, max) {
  const originalsNumbers = String(sourceCard.question).match(/-?\d+(?:\.\d+)?/g)?.join(',') ?? '';
  const valid = [];

  for (const item of proposed) {
    const question = typeof item?.question === 'string' ? item.question.trim() : '';
    const answer = typeof item?.answer === 'string' || typeof item?.answer === 'number'
      ? String(item.answer).trim() : '';
    const working = typeof item?.working === 'string' ? item.working.trim().slice(0, 600) : '';
    if (!question || !answer || question.length > 500 || answer.length > 1000) continue;
    if (used.has(question.toLowerCase())) continue;

    // If the original question has numbers, each variation must use different numbers.
    if (originalsNumbers) {
      const changedNumbers = question.match(/-?\d+(?:\.\d+)?/g)?.join(',') ?? '';
      if (!changedNumbers || changedNumbers === originalsNumbers) continue;
    }

    used.add(question.toLowerCase());
    valid.push({ question, answer, working, source: 'ai' });
    if (valid.length === max) break;
  }
  return valid;
}

function buildPrompt(sourceCard) {
  return [
    'You are generating practice flashcards for a student who got this card wrong.',
    `Return ONLY a JSON array containing EXACTLY ${EXTRA_PER_WRONG + 1} objects.`,
    'Each object must have three string fields: "question", "answer" and "working".',
    '"working" is a one-line calculation or reason showing how the answer is reached.',
    'Every card must test the EXACT SAME underlying concept as the original.',
    'If the original is numerical, CHANGE the input numbers and recalculate each answer carefully, step by step.',
    'If the original is not numerical, ask about the same concept a different way: reverse the question (give the description, ask for the term), use a short real-world scenario, a fill-the-gap sentence, or a true/false statement that must be explained.',
    'Keep the same units, assumptions and difficulty. No duplicate questions.',
    'Do not invent facts. Use concise, clear wording.',
    `Syllabus topic: ${JSON.stringify(sourceCard.topic ?? '')}`,
    `Original question: ${JSON.stringify(sourceCard.question)}`,
    `Original answer: ${JSON.stringify(sourceCard.answer)}`,
    `Difficulty: ${JSON.stringify(sourceCard.difficulty)}`,
  ].join('\n');
}

// Makes exactly 3 extra cards when possible.
async function generateExtra(sourceCard) {
  const used = new Set([`${sourceCard.question}\n${sourceCard.code ?? ''}`.trim().toLowerCase()]);

  // 1) Recipe cards: code makes them first, so the answers are guaranteed correct.
  const recipeCards = sourceCard.vary ? localVariations(sourceCard, EXTRA_PER_WRONG, used) : [];

  // 2) Pre-written alternates for concept cards.
  const altCards = fromAlternates(sourceCard, EXTRA_PER_WRONG - recipeCards.length, used);
  const written = [...recipeCards, ...altCards];

  // 3) The AI fills whatever is still needed.
  let aiCards = [];
  let aiProblem = '';
  const needFromAI = EXTRA_PER_WRONG - written.length;
  if (needFromAI > 0) {
    try {
      const reply = await askWithTimeout(buildPrompt(sourceCard));
      aiCards = validateVariations(sourceCard, parseVariations(reply), used, needFromAI);
      if (aiCards.length < needFromAI) aiProblem = `AI gave only ${aiCards.length} usable card(s)`;
    } catch (error) {
      aiProblem = `AI unavailable: ${error?.message || error}`;
      console.warn('AI variation generation failed:', error);
    }
  }

  // 4) Last resort: simple sums done by code.
  const stillMissing = EXTRA_PER_WRONG - written.length - aiCards.length;
  const autoCards = stillMissing > 0 ? localVariations(sourceCard, stillMissing, used) : [];

  return { extra: [...written, ...aiCards, ...autoCards], aiProblem };
}

async function focusOnWrong() {
  if (generating.value) return;
  const incorrect = deck.value.filter(card => card.result === 'wrong');
  if (incorrect.length === 0) return;

  generating.value = true;
  generationError.value = '';
  const requestId = ++generationSerial;
  const nextRound = round.value + 1;
  const newCards = [];
  let practiceCount = 0;
  let shortCount = 0;   // wrong cards that got fewer than 3 extras
  let aiProblem = '';

  // try/finally: even if something unexpected breaks, the buttons are unlocked again.
  try {
    for (const [n, source] of incorrect.entries()) {
      generatingText.value = `Making ${EXTRA_PER_WRONG} practice cards for mistake ${n + 1} of ${incorrect.length}…`;

      // 1) Always keep the original wrong card first.
      newCards.push({
        id: `original-${nextRound}-${source.id}`,
        question: source.question,
        code: source.code,
        answer: source.answer,
        working: source.working,
        ref: source.ref,
        difficulty: source.difficulty,
        seconds: source.seconds,
        topic: source.topic,
        vary: source.vary,
        alternates: source.alternates,
        source: source.source,
        isVariation: Boolean(source.isVariation),
      });

      // 2) Then its 3 new variations, right after it.
      const { extra, aiProblem: problem } = await generateExtra(source);
      if (requestId !== generationSerial) return; // page was reset or left meanwhile

      extra.forEach((variation, i) => {
        newCards.push({
          ...variation,
          id: `${variation.source}-${nextRound}-${source.id}-${i + 1}`,
          ref: source.ref,
          difficulty: source.difficulty,
          seconds: source.seconds,
          topic: source.topic,
          // Carry the recipe and alternates along, so a variation you get wrong can be varied again.
          vary: source.vary,
          alternates: source.alternates,
          isVariation: true,
        });
      });

      practiceCount += extra.length;
      if (extra.length < EXTRA_PER_WRONG) shortCount += 1;
      if (problem) aiProblem = problem;
    }

    startRound(newCards, nextRound);

    reviewNote.value = `Review round ${nextRound - 1}: ${incorrect.length} card(s) you got wrong`
      + ` + ${practiceCount} practice card(s) = ${newCards.length} cards.`;

    // Students see a friendly line; the technical reason goes to the browser console for developers.
    if (shortCount > 0) {
      generationError.value = `${shortCount} card(s) don't have practice variations yet, so they're repeated on their own.`;
    }
    if (aiProblem) console.warn(`[Flashcards] AI variations: ${aiProblem}. Check askLLM() in src/shared/llm.js.`);
  } catch (error) {
    console.error('Focus on wrong failed:', error);
    if (requestId === generationSerial) {
      generationError.value = `Could not build the review round: ${error?.message || error}`;
    }
  } finally {
    // Only unlock if this is still the latest request (not one the user already left).
    if (requestId === generationSerial) {
      generating.value = false;
      generatingText.value = '';
    }
  }
}

// ---------- SVG ring geometry ----------
const ringRadius = 39;
const ringLength = 2 * Math.PI * ringRadius;
function ringOffset(percent) {
  const bounded = Math.min(100, Math.max(0, Number(percent) || 0));
  return ringLength * (1 - bounded / 100);
}
</script>

<template>
  <section class="flashcards-page">
    <div class="heading-row">
      <div>
        <p class="eyebrow">ACTIVE RECALL</p>
        <h1>Flashcards</h1>
      </div>
      <span v-if="view === 'study' && round > 1" class="round-label">Review round {{ round - 1 }}</span>
    </div>

    <!-- Breadcrumb: click any earlier step to go back -->
    <nav v-if="view !== 'levels'" class="breadcrumb" aria-label="Flashcards navigation">
      <button type="button" class="crumb" @click="goTo('levels')">Curriculum</button>
      <template v-if="selectedLevel">
        <span class="crumb-sep">›</span>
        <button type="button" class="crumb" :class="{ 'is-current': view === 'subjects' }" :aria-current="view === 'subjects' ? 'page' : undefined"
                @click="goTo('subjects')">{{ selectedLevel.name }}</button>
      </template>
      <template v-if="selectedSubject && (view === 'syllabus' || view === 'study')">
        <span class="crumb-sep">›</span>
        <button type="button" class="crumb" :class="{ 'is-current': view === 'syllabus' }" :aria-current="view === 'syllabus' ? 'page' : undefined"
                @click="goTo('syllabus')">{{ subjectTitle(selectedSubject) }}</button>
      </template>
      <template v-if="selectedSubtopic && view === 'study'">
        <span class="crumb-sep">›</span>
        <span class="crumb is-current" aria-current="page">{{ selectedSubtopic.code }} {{ selectedSubtopic.name }}</span>
      </template>
    </nav>

    <!-- ===== Screen 1: choose a curriculum ===== -->
    <template v-if="view === 'levels'">
      <div class="picker-head">
        <h2>Choose your curriculum</h2>
        <p>Pick a curriculum, then a subject, then a syllabus topic to practise.</p>
      </div>
      <div class="choice-grid">
        <button v-for="level in levels" :key="level.id" type="button" class="choice-card"
                :class="readyInLevel(level) > 0 ? 'is-ready' : 'is-locked'" @click="openLevel(level)">
          <span class="choice-badge">{{ level.short }}</span>
          <strong class="choice-name">{{ level.name }}</strong>
          <span class="choice-sub">{{ level.subtitle }}</span>
          <span class="choice-meta">{{ level.subjects.length }} subjects</span>
          <span class="ready-tag">
            {{ readyInLevel(level) > 0 ? `● ${readyInLevel(level)} deck(s) ready` : '🔒 Syllabus only — decks coming soon' }}
          </span>
        </button>
      </div>
    </template>

    <!-- ===== Screen 2: choose a subject ===== -->
    <template v-else-if="view === 'subjects' && selectedLevel">
      <div class="picker-head">
        <h2>{{ selectedLevel.name }} subjects</h2>
        <p>{{ selectedLevel.subtitle }}</p>
      </div>
      <div class="choice-grid">
        <button v-for="subject in selectedLevel.subjects" :key="subject.id" type="button" class="choice-card"
                :class="readyInSubject(subject) > 0 ? 'is-ready' : 'is-locked'" @click="openSubject(subject)">
          <span class="choice-badge">{{ subject.tag || subject.short }}</span>
          <strong class="choice-name">{{ subjectTitle(subject) }}</strong>
          <span class="choice-sub">{{ subject.syllabus }}</span>
          <span class="choice-meta">{{ subject.topics.length }} topics · {{ subtopicCount(subject) }} sub-topics</span>
          <span class="ready-tag">
            {{ readyInSubject(subject) > 0 ? `● ${readyInSubject(subject)} deck(s) ready` : '🔒 Syllabus only' }}
          </span>
        </button>
      </div>
    </template>

    <!-- ===== Screen 3: the full syllabus ===== -->
    <template v-else-if="view === 'syllabus' && selectedSubject">
      <div class="picker-head">
        <h2>{{ subjectTitle(selectedSubject) }}</h2>
        <p>{{ selectedSubject.syllabus }}</p>
        <div class="legend">
          <span><i class="legend-dot dot-ready"></i> Ready — click to start</span>
          <span><i class="legend-dot dot-locked"></i> Locked — coming soon</span>
        </div>
      </div>

      <div v-for="group in themeGroups(selectedSubject)" :key="group.theme || 'all'" class="theme-block">
        <h3 v-if="group.theme" class="theme-title">{{ group.theme }}</h3>

        <article v-for="topic in group.topics" :key="`${topic.code}-${topic.name}`" class="topic-block"
                 :class="{ 'has-ready': topicHasReady(topic) }">
          <header class="topic-head">
            <span v-if="topic.code" class="topic-code">{{ topic.code }}</span>
            <h4>{{ topic.name }}</h4>
            <span v-if="topic.hlOnly" class="hl-badge">HL only</span>
          </header>

          <ul class="subtopic-list">
            <li v-for="sub in topic.subtopics" :key="`${sub.code}-${sub.name}`">
              <button type="button" class="subtopic"
                      :class="[deckFor(sub) ? 'is-ready' : 'is-locked', { 'no-code': !sub.code }]"
                      :disabled="!deckFor(sub)" @click="startSubtopic(sub)">
                <span v-if="sub.code" class="sub-code">{{ sub.code }}</span>
                <span class="sub-name">
                  {{ sub.name }}
                  <span v-if="sub.hlOnly" class="hl-badge">HL</span>
                </span>
                <span class="sub-status">
                  {{ deckFor(sub) ? `▶ Start · ${deckFor(sub).length} cards` : '🔒 Coming soon' }}
                </span>
              </button>
              <p v-if="sub.note" class="sub-note">{{ sub.note }}</p>
            </li>
          </ul>
        </article>
      </div>
    </template>

    <!-- ===== Screen 4: flashcards ===== -->
    <template v-else-if="view === 'study'">
      <template v-if="!showResults && currentCard">
        <!-- Top bar: correct, wrong, accuracy ring, timer -->
        <div class="stats-grid">
          <div class="stat-tile tile-correct">
            <span class="stat-label">Correct answers</span>
            <strong class="stat-number">{{ correctCount }} ✓</strong>
            <span class="stat-caption">of {{ answeredCount }} answered</span>
          </div>
          <div class="stat-tile tile-wrong">
            <span class="stat-label">Wrong answers</span>
            <strong class="stat-number">{{ wrongCount }} ×</strong>
            <span class="stat-caption">Review later</span>
          </div>

          <!-- Green = correct share, red = wrong share. Number shows only on hover/focus. -->
          <div class="stat-tile accuracy-tile">
            <span class="stat-label">Percentage correct</span>
            <div class="ring-box accuracy-ring" :class="{ 'has-answers': answeredCount > 0 }"
                 tabindex="0" role="img" :aria-label="`Accuracy: ${wholePercent(accuracy)}`">
              <svg viewBox="0 0 100 100" aria-hidden="true">
                <circle class="ring-track" cx="50" cy="50" :r="ringRadius" />
                <circle class="ring-fill" cx="50" cy="50" :r="ringRadius"
                        :stroke-dasharray="ringLength" :stroke-dashoffset="ringOffset(accuracy)" />
              </svg>
              <span class="ring-middle accuracy-number">{{ wholePercent(accuracy) }}</span>
            </div>
            <span class="stat-caption">Hover or tap to see</span>
          </div>

          <div class="stat-tile timer-tile" :class="`tone-${timerTone}`">
            <span class="stat-label">Timer</span>
            <strong class="stat-number clock">{{ formattedTime(currentCard.timeLeft) }}</strong>
            <span class="stat-caption">{{ currentCard.difficulty || 'Standard' }} difficulty</span>
            <div class="timer-track" aria-hidden="true">
              <div class="timer-fill" :style="{ width: `${remainingPercent}%` }"></div>
            </div>
          </div>
        </div>

        <p v-if="round > 1 && reviewNote" class="review-note">{{ reviewNote }}</p>
        <p v-if="generationError" class="review-note note-warning" role="status">{{ generationError }}</p>

        <div class="card-heading">
          <span class="pill">{{ currentCard.topic || 'Practice' }}</span>
          <span>Card {{ index + 1 }} / {{ total }}</span>
          <span v-if="currentCard.isVariation" class="pill pill-ai">
            {{ variationLabel(currentCard.source) }}
          </span>
        </div>

        <!-- 3D flip card. Click (or Enter/Space) flips it — hover only lifts it slightly. -->
        <div class="flashcard-wrap">
          <div class="flashcard-scene" :class="{ 'is-locked': !currentCard.started }">
            <button :key="currentCard.id" type="button" class="flashcard"
                    :class="{ 'is-flipped': currentCard.flipped }"
                    :disabled="!currentCard.started" @click="flipCard">
              <!-- FRONT: question -->
              <span class="card-face card-front" :aria-hidden="currentCard.flipped">
                <span class="face-tag">QUESTION</span>
                <span class="card-content" :class="{ blurred: !currentCard.started }">{{ currentCard.question }}</span>
                <!-- Program code (e.g. Python) keeps its indentation in a left-aligned code box. -->
                <span v-if="currentCard.code" class="card-code" :class="{ blurred: !currentCard.started }">{{ currentCard.code }}</span>
                <span class="flip-hint">{{ currentCard.started ? 'Click to flip ↻' : 'Start timer to reveal question' }}</span>
              </span>
              <!-- BACK: answer (only filled in once revealed, so it can't be peeked early) -->
              <span class="card-face card-back" :aria-hidden="!currentCard.flipped">
                <span class="face-tag">ANSWER</span>
                <span class="card-content answer-content">{{ currentCard.revealed ? currentCard.answer : '' }}</span>
                <span v-if="currentCard.revealed && currentCard.working" class="card-working">
                  Working: {{ currentCard.working }}
                </span>
                <span v-if="currentCard.revealed && currentCard.ref" class="card-ref">Source: {{ currentCard.ref }}</span>
                <span class="flip-hint">Click to see the question again ↻</span>
              </span>
            </button>
          </div>

          <!-- Warning shown before the timer starts; the question stays blurred. -->
          <div v-if="!currentCard.started" class="start-overlay">
            <p><strong>⚠ Timer warning</strong><br>Your countdown begins when you press Start.</p>
            <button type="button" class="primary-button" @click="startTimer">Start timer →</button>
          </div>
        </div>

        <div class="answer-actions">
          <template v-if="currentCard.started && currentCard.flipped && !currentCard.result">
            <button type="button" class="answer-button correct-button" @click="markAnswer('correct')">✓ Correct</button>
            <button type="button" class="answer-button wrong-button" @click="markAnswer('wrong')">× Wrong</button>
          </template>
          <p v-else-if="status" class="card-status" :class="`status-${currentCard.result}`" role="status">{{ status }}</p>
          <p v-else class="answer-placeholder">Flip the card to check your answer.</p>
        </div>

        <div class="footer-navigation">
          <button type="button" class="nav-button" :disabled="index === 0" @click="goBack">← Back</button>
          <div class="footer-progress">
            <div class="ring-box progress-ring" role="img" :aria-label="`Completion: ${wholePercent(progress)}`">
              <svg viewBox="0 0 100 100" aria-hidden="true">
                <circle class="ring-track" cx="50" cy="50" :r="ringRadius" />
                <circle class="ring-fill" cx="50" cy="50" :r="ringRadius"
                        :stroke-dasharray="ringLength" :stroke-dashoffset="ringOffset(progress)" />
              </svg>
              <span class="ring-middle">{{ wholePercent(progress) }}</span>
            </div>
            <span class="progress-title">Round progress</span>
          </div>
          <button type="button" class="nav-button next-button" :disabled="!canNext" @click="goNext">
            {{ isLast && allDone ? 'View results →' : 'Next →' }}
          </button>
        </div>
      </template>

      <!-- Final page: same layout as the wireframe (two boxes, button inside each). -->
      <div v-else-if="showResults" class="results-view">
        <p class="eyebrow">ROUND COMPLETE</p>
        <h2>Practice summary</h2>
        <p v-if="selectedSubtopic" class="results-topic">{{ selectedSubtopic.code }} {{ selectedSubtopic.name }}</p>
        <div class="results-grid">
          <div class="result-box result-good">
            <p class="result-line">You got <strong>{{ correctCount }}/{{ total }}</strong> correct!</p>
            <strong class="result-percent">{{ wholePercent(accuracy) }}</strong>
            <button type="button" class="result-button reset-button" :disabled="generating" @click="resetAll">Reset ↺</button>
          </div>
          <div class="result-box result-bad">
            <p class="result-line">You need to improve on <strong>{{ wrongCount }}/{{ total }}</strong></p>
            <strong class="result-percent">{{ wrongPercent }}%</strong>
            <button v-if="wrongCount > 0" type="button" class="result-button focus-button"
                    :disabled="generating" @click="focusOnWrong">
              {{ generating ? 'Generating practice cards…' : 'Focus on wrong →' }}
            </button>
            <p v-else class="result-line">Great — nothing to review!</p>
          </div>
        </div>
        <p v-if="generationError && !generating" class="review-note note-warning" role="status">{{ generationError }}</p>
        <p v-if="generating" class="generation-note" role="status">
          {{ generatingText || 'Preparing review cards…' }} This may take a moment.
        </p>
        <p v-if="wrongCount > 0 && !generating" class="results-hint">
          Focus on wrong gives you each wrong card again + up to {{ EXTRA_PER_WRONG }} practice cards on the same idea
          (new numbers, or the question asked another way).
        </p>
        <button type="button" class="nav-button back-to-syllabus" @click="goTo('syllabus')">← Back to syllabus</button>
      </div>

      <div v-else class="empty-state">
        <h2>No flashcards found</h2>
        <p>This sub-topic has no cards yet. Add a deck for it in <code>./data/cards.js</code>.</p>
        <button type="button" class="nav-button" @click="goTo('syllabus')">← Back to syllabus</button>
      </div>
    </template>
  </section>
</template>

<style scoped>
/*
  Every colour and font comes from theme.css variables.
  color-mix() only blends those variables to make soft tints — no new colours are introduced.
*/
.flashcards-page {
  width: min(100%, 940px);
  margin: 0 auto;
  display: grid;
  gap: var(--space-5);
  font-family: var(--font-body);
  color: var(--color-text);
}
.heading-row, .card-heading, .footer-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-3);
}
.heading-row h1, .results-view h2, .empty-state h2, .picker-head h2 {
  margin: 0;
  font-family: var(--font-heading);
  color: var(--color-primary);
}
.heading-row h1 { font-size: clamp(1.7rem, 4vw, 2.4rem); letter-spacing: -0.02em; }
.eyebrow { margin: 0 0 var(--space-1); color: var(--color-success); font-size: 0.76rem; letter-spacing: 0.14em; font-weight: 800; }
.round-label, .pill {
  border: 1px solid var(--color-border);
  background: var(--color-primary-soft);
  color: var(--color-text);
  border-radius: 999px;
  padding: var(--space-1) var(--space-3);
  font-size: 0.78rem;
  font-weight: 700;
}
.round-label {
  background: color-mix(in srgb, var(--color-danger) 10%, var(--color-surface));
  border-color: color-mix(in srgb, var(--color-danger) 35%, var(--color-surface));
  color: var(--color-danger);
}
.pill-ai {
  background: color-mix(in srgb, var(--color-warning) 18%, var(--color-surface));
  border-color: var(--color-warning);
}

/* ---------- Breadcrumb ---------- */
.breadcrumb { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-1) var(--space-2); font-size: 0.85rem; }
.crumb {
  font: inherit;
  border: 0;
  background: none;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius);
  color: var(--color-muted);
  cursor: pointer;
}
button.crumb:hover { color: var(--color-text); background: var(--color-primary-soft); }
.crumb.is-current { color: var(--color-text); font-weight: 700; }
span.crumb { cursor: default; }
.crumb-sep { color: var(--color-muted); }

/* ---------- Curriculum / subject pickers ---------- */
.picker-head { display: grid; gap: var(--space-2); }
.picker-head p { margin: 0; color: var(--color-muted); }
.choice-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: var(--space-4); }
.choice-card {
  --choice-color: var(--color-muted);
  font: inherit;
  color: var(--color-text);
  text-align: left;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-5);
  border: 1px solid var(--color-border);
  border-top: 5px solid var(--choice-color);
  border-radius: calc(var(--radius) * 2);
  background: linear-gradient(160deg, color-mix(in srgb, var(--choice-color) 10%, var(--color-surface)), var(--color-surface));
  box-shadow: 0 6px 18px color-mix(in srgb, var(--color-primary) 6%, transparent);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.choice-card:hover { transform: translateY(-3px); box-shadow: 0 12px 26px color-mix(in srgb, var(--color-primary) 12%, transparent); }
.choice-card:focus-visible { outline: 3px solid var(--color-success); outline-offset: 3px; }
.choice-card.is-ready { --choice-color: var(--color-success); border-color: color-mix(in srgb, var(--color-success) 45%, var(--color-surface)); }
.choice-card.is-locked { background: var(--color-primary-soft); }
.choice-badge {
  align-self: flex-start;
  min-width: 44px;
  text-align: center;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius);
  font-weight: 800;
  color: var(--color-bg);
  background: var(--choice-color);
}
.choice-name { font-size: 1.2rem; }
.choice-sub, .choice-meta { font-size: 0.85rem; color: var(--color-muted); }
.ready-tag { margin-top: auto; padding-top: var(--space-2); font-size: 0.82rem; font-weight: 700; color: var(--choice-color); }

/* ---------- Syllabus ---------- */
.legend { display: flex; flex-wrap: wrap; gap: var(--space-4); font-size: 0.82rem; color: var(--color-muted); }
.legend span { display: inline-flex; align-items: center; gap: var(--space-2); }
.legend-dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }
.dot-ready { background: var(--color-success); }
.dot-locked { background: var(--color-border); border: 1px solid var(--color-muted); }
.theme-block { display: grid; gap: var(--space-3); }
.theme-title {
  margin: var(--space-2) 0 0;
  font-family: var(--font-heading);
  font-size: 0.85rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-muted);
}
.topic-block {
  border: 1px solid var(--color-border);
  border-left: 5px solid var(--color-border);
  border-radius: calc(var(--radius) * 2);
  background: var(--color-surface);
  padding: var(--space-4);
  display: grid;
  gap: var(--space-3);
}
.topic-block.has-ready { border-left-color: var(--color-success); }
.topic-head { display: flex; align-items: center; gap: var(--space-3); flex-wrap: wrap; }
.topic-head h4 { margin: 0; font-family: var(--font-heading); font-size: 1.05rem; }
.topic-code {
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius);
  background: var(--color-primary);
  color: var(--color-bg);
  font-size: 0.85rem;
}
.hl-badge {
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  padding: 2px var(--space-2);
  border-radius: 999px;
  border: 1px solid var(--color-warning-strong);
  color: var(--color-text);
  background: color-mix(in srgb, var(--color-warning) 20%, var(--color-surface));
  vertical-align: middle;
}
.subtopic-list { list-style: none; margin: 0; padding: 0; display: grid; gap: var(--space-2); }
.subtopic {
  font: inherit;
  width: 100%;
  text-align: left;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}
.subtopic.is-ready {
  cursor: pointer;
  border-color: var(--color-success);
  background: color-mix(in srgb, var(--color-success) 12%, var(--color-surface));
}
.subtopic.is-ready:hover { transform: translateX(3px); box-shadow: 0 6px 16px color-mix(in srgb, var(--color-success) 22%, transparent); }
.subtopic.is-ready:focus-visible { outline: 3px solid var(--color-success); outline-offset: 2px; }
.subtopic.is-ready .sub-status { color: var(--color-success); }
.subtopic.is-locked {
  cursor: not-allowed;
  background: var(--color-primary-soft);
  color: var(--color-muted);
}
/* Some syllabuses (e.g. O Level Physics) have no sub-topic numbers, so there are only two columns. */
.subtopic.no-code { grid-template-columns: 1fr auto; }
.sub-code { font-weight: 800; font-variant-numeric: tabular-nums; min-width: 3.2em; }
.sub-status { font-size: 0.82rem; font-weight: 700; white-space: nowrap; }
.sub-note { margin: var(--space-1) 0 0 var(--space-4); font-size: 0.8rem; color: var(--color-muted); }

/* ---------- Stat tiles ---------- */
.stats-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: var(--space-3); }
.stat-tile {
  --tile-accent: var(--color-primary);
  border: 1px solid var(--color-border);
  border-top: 4px solid var(--tile-accent);
  border-radius: var(--radius);
  background: linear-gradient(180deg, color-mix(in srgb, var(--tile-accent) 7%, var(--color-surface)), var(--color-surface));
  min-height: 130px;
  padding: var(--space-3);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  overflow: hidden;
  box-shadow: 0 4px 14px color-mix(in srgb, var(--color-primary) 6%, transparent);
}
.tile-correct { --tile-accent: var(--color-success); }
.tile-wrong { --tile-accent: var(--color-danger); }
.tile-correct .stat-number { color: var(--color-success); }
.tile-wrong .stat-number { color: var(--color-danger); }
.stat-label, .stat-caption { font-size: 0.8rem; color: var(--color-muted); }
.stat-label { font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; font-size: 0.72rem; }
.stat-number { font-size: clamp(1.5rem, 3vw, 2.2rem); line-height: 1.2; font-variant-numeric: tabular-nums; }
.accuracy-tile { align-items: center; text-align: center; }

/* ---------- Rings ---------- */
.ring-box { position: relative; width: 80px; height: 80px; display: grid; place-items: center; }
.ring-box svg { width: 100%; height: 100%; transform: rotate(-90deg); }
.ring-track, .ring-fill { fill: none; stroke-width: 10; }
.ring-track { stroke: var(--color-border); transition: stroke 0.35s ease; }
.ring-fill { stroke: var(--color-primary); stroke-linecap: round; transition: stroke-dashoffset 0.45s ease; }
.ring-middle { position: absolute; font-size: 0.98rem; font-weight: 800; font-variant-numeric: tabular-nums; }

/* Accuracy ring: green slice = correct, red slice = wrong (like the wireframe) */
.accuracy-ring { cursor: help; border-radius: 100%; outline-offset: 4px; }
.accuracy-ring .ring-fill { stroke: var(--color-success); stroke-linecap: butt; }
.accuracy-ring.has-answers .ring-track { stroke: var(--color-danger); }
.accuracy-number { opacity: 0; transition: opacity 0.2s ease; }
/* :focus also covers tapping on phones (there is no hover on a touch screen). */
.accuracy-ring:hover .accuracy-number, .accuracy-ring:focus .accuracy-number { opacity: 1; }

/* ---------- Timer: green → yellow → amber → red ---------- */
.timer-tile { --timer-color: var(--color-success); --tile-accent: var(--timer-color); }
.timer-tile.tone-green { --timer-color: var(--color-success); }
.timer-tile.tone-yellow { --timer-color: var(--color-warning); }
.timer-tile.tone-amber { --timer-color: var(--color-warning-strong); }
.timer-tile.tone-red { --timer-color: var(--color-danger); }
.timer-tile { transition: border-color 0.35s ease, background 0.35s ease; }
.clock { color: var(--timer-color); transition: color 0.35s ease; }
.timer-track { margin-top: auto; width: 100%; height: 8px; overflow: hidden; background: var(--color-border); border-radius: 99px; }
.timer-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, color-mix(in srgb, var(--timer-color) 55%, var(--color-surface)), var(--timer-color));
  transition: width 0.2s linear, background 0.35s ease;
}

/* ---------- Notes ---------- */
.card-heading { font-size: 0.85rem; color: var(--color-muted); }
.review-note, .generation-note {
  margin: 0;
  border: 1px solid var(--color-border);
  border-left: 4px solid var(--color-success);
  padding: var(--space-3);
  border-radius: var(--radius);
  background: var(--color-primary-soft);
}
.note-warning { border-left-color: var(--color-warning-strong); }

/* ---------- 3D flip card ---------- */
.flashcard-wrap { position: relative; }
.flashcard-scene { perspective: 1400px; transition: transform 0.2s ease; }
.flashcard-scene:not(.is-locked):hover { transform: translateY(-3px); }
.flashcard {
  font: inherit;
  color: var(--color-text);
  width: 100%;
  padding: 0;
  border: 0;
  background: none;
  text-align: center;
  cursor: pointer;
  display: grid;
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.2, 0.7, 0.2, 1);
}
.flashcard.is-flipped { transform: rotateY(180deg); }
.flashcard:disabled { cursor: default; }
.flashcard:focus-visible { outline: 3px solid var(--color-success); outline-offset: 4px; border-radius: var(--radius); }
.card-face {
  grid-area: 1 / 1; /* both faces sit in the same spot */
  min-height: 320px;
  padding: var(--space-5);
  border: 1px solid var(--color-border);
  border-radius: calc(var(--radius) * 2);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-4);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  box-shadow: 0 14px 36px color-mix(in srgb, var(--color-primary) 12%, transparent);
}
.card-front {
  border-top: 5px solid var(--color-primary);
  background:
    radial-gradient(circle at 100% 0%, color-mix(in srgb, var(--color-success) 10%, transparent), transparent 45%),
    linear-gradient(145deg, var(--color-surface), var(--color-primary-soft));
}
.card-back {
  transform: rotateY(180deg);
  border-top: 5px solid var(--color-success);
  background:
    radial-gradient(circle at 0% 100%, color-mix(in srgb, var(--color-warning) 12%, transparent), transparent 45%),
    linear-gradient(145deg, color-mix(in srgb, var(--color-success) 9%, var(--color-surface)), var(--color-primary-soft));
}
.face-tag { align-self: flex-start; font-size: 0.75rem; font-weight: 800; color: var(--color-muted); letter-spacing: 0.13em; }
.card-back .face-tag { color: var(--color-success); }
.card-content { display: block; font-size: clamp(1.35rem, 3vw, 2rem); line-height: 1.45; font-weight: 600; white-space: pre-wrap; overflow-wrap: anywhere; }
/* Answers are often longer than questions, so they use a slightly smaller size. */
.answer-content { font-size: clamp(1.05rem, 2.2vw, 1.35rem); font-weight: 500; text-align: left; }
.card-content.blurred, .card-code.blurred { filter: blur(9px); user-select: none; }
.card-code {
  display: block;
  width: 100%;
  max-width: 640px;
  text-align: left;
  white-space: pre;
  overflow-x: auto;
  font-family: var(--font-mono, var(--font-body));
  font-size: 0.95rem;
  line-height: 1.5;
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius);
  border: 1px solid var(--color-border);
  background: var(--color-primary-soft);
  color: var(--color-text);
}
.flip-hint { font-size: 0.8rem; color: var(--color-muted); }
.card-working {
  font-size: 0.9rem;
  color: var(--color-muted);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius);
  background: color-mix(in srgb, var(--color-success) 8%, var(--color-surface));
}
.card-ref { font-size: 0.75rem; color: var(--color-muted); font-style: italic; }
.results-hint { margin: 0; color: var(--color-muted); font-size: 0.9rem; }

.start-overlay {
  position: absolute;
  inset: 0;
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  text-align: center;
  pointer-events: none;
}
.start-overlay p {
  margin: 0;
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius);
  border: 1px solid var(--color-warning);
  border-left: 5px solid var(--color-warning-strong);
  background: color-mix(in srgb, var(--color-warning) 12%, var(--color-surface));
  max-width: 360px;
  box-shadow: 0 8px 24px color-mix(in srgb, var(--color-primary) 10%, transparent);
}
.start-overlay button { pointer-events: auto; }

/* ---------- Buttons ---------- */
.primary-button, .nav-button, .answer-button, .result-button {
  font: inherit;
  font-weight: 700;
  padding: var(--space-3) var(--space-5);
  border-radius: 999px;
  cursor: pointer;
  transition: transform 0.15s ease, opacity 0.15s ease, box-shadow 0.15s ease;
}
.primary-button { background: var(--color-primary); color: var(--color-bg); border: 1px solid var(--color-primary); }
.nav-button { background: var(--color-surface); color: var(--color-text); border: 1px solid var(--color-border); }
.next-button:not(:disabled) { background: var(--color-primary); color: var(--color-bg); border-color: var(--color-primary); }
.primary-button:hover:not(:disabled), .nav-button:hover:not(:disabled),
.answer-button:hover:not(:disabled), .result-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px color-mix(in srgb, var(--color-primary) 18%, transparent);
}
.primary-button:disabled, .nav-button:disabled, .answer-button:disabled, .result-button:disabled { cursor: not-allowed; opacity: 0.4; }

.answer-actions { min-height: 58px; display: flex; flex-wrap: wrap; justify-content: center; align-items: center; gap: var(--space-4); }
.answer-button { min-width: 150px; color: var(--color-bg); }
.correct-button { border: 2px solid var(--color-success); background: var(--color-success); }
.wrong-button { border: 2px solid var(--color-danger); background: var(--color-danger); }
.card-status { margin: 0; font-weight: 700; padding: var(--space-2) var(--space-4); border-radius: 999px; }
.status-correct { color: var(--color-success); background: color-mix(in srgb, var(--color-success) 12%, var(--color-surface)); }
.status-wrong { color: var(--color-danger); background: color-mix(in srgb, var(--color-danger) 10%, var(--color-surface)); }
.answer-placeholder { margin: 0; font-size: 0.85rem; color: var(--color-muted); }

.footer-navigation { border-top: 1px solid var(--color-border); padding: var(--space-3) 0; }
.footer-progress { display: flex; align-items: center; flex-direction: column; gap: var(--space-1); }
.progress-title { color: var(--color-muted); font-size: 0.8rem; }

/* ---------- Results page ---------- */
.results-view, .empty-state {
  border: 1px solid var(--color-border);
  background: var(--color-primary-soft);
  padding: var(--space-6);
  border-radius: calc(var(--radius) * 2);
  display: grid;
  gap: var(--space-4);
}
.results-topic { margin: 0; color: var(--color-muted); font-weight: 600; }
.results-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--space-4); }
.result-box {
  --box-color: var(--color-primary);
  border: 1px solid color-mix(in srgb, var(--box-color) 35%, var(--color-surface));
  border-top: 6px solid var(--box-color);
  background: linear-gradient(160deg, color-mix(in srgb, var(--box-color) 14%, var(--color-surface)), var(--color-surface));
  border-radius: calc(var(--radius) * 2);
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: var(--space-4);
}
.result-good { --box-color: var(--color-success); }
.result-bad { --box-color: var(--color-danger); }
.result-line { margin: 0; font-size: 1.15rem; font-weight: 600; }
.result-percent { font-size: clamp(2.2rem, 6vw, 3.4rem); color: var(--box-color); font-variant-numeric: tabular-nums; }
.result-button { margin-top: auto; border: 2px solid var(--box-color); background: var(--box-color); color: var(--color-bg); }
.back-to-syllabus, .empty-state .nav-button { justify-self: start; }

@media (max-width: 680px) {
  .stats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .card-face { min-height: 280px; }
  .footer-navigation { gap: var(--space-2); }
  .nav-button { padding: var(--space-2) var(--space-3); }
  .results-grid { grid-template-columns: 1fr; }
  .subtopic { grid-template-columns: auto 1fr; }
  .sub-status { grid-column: 2; }
  .answer-button { min-width: 0; flex: 1; }
  .subtopic.no-code { grid-template-columns: 1fr; }
  .subtopic.no-code .sub-status { grid-column: 1; }
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { transition-duration: 0s !important; }
}
</style>
