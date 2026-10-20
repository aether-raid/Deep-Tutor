<script setup>
// Quiz screen: 10 multiple-choice questions, one at a time.
// For every question we record the answer, how sure the student felt,
// and how long they spent. The results screen uses all three to find weak spots.
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { findQuestionBank } from '../data/questions.js';
import { findLevel, findStream } from '../data/subjects.js';
import { generateQuestions } from '../weaknessAI.js';
import { buildQuiz, shuffleOptions } from '../buildQuiz.js';

const props = defineProps({
  level: { type: String, required: true }, // e.g. 's3'
  stream: { type: String, default: null }, // e.g. 'g3'
  subject: { type: Object, required: true }, // from HomeScreen, has displayName and option
  focusTopic: { type: String, default: null }, // set by "Practice" buttons: quiz on one topic only
});

const emit = defineEmits(['submit', 'quit']);

const LETTERS = ['A', 'B', 'C', 'D'];

const CONFIDENCE_LEVELS = [
  { id: 'guess', label: 'Guessing' },
  { id: 'fairly', label: 'Fairly sure' },
  { id: 'certain', label: 'Certain' },
];

const levelName = findLevel(props.level)?.name ?? '';
const streamName = findStream(props.stream)?.name ?? null;

// ---------- Loading the questions ----------
const status = ref('loading'); // 'loading' | 'ready' | 'error'
const source = ref('mock'); // 'mock' (from data/) or 'ai' (generated)
const questions = ref([]);

// One record per question, filled in as the student works.
// choice: index of picked option (or null), confidence: id (or null), seconds: time spent
const answers = ref([]);

async function loadQuestions() {
  const bank = findQuestionBank(props.level, props.stream, props.subject.id, props.subject.option?.id);

  if (bank) {
    // A new random 10 from the bank each time (see buildQuiz.js).
    questions.value = buildQuiz(bank, props.focusTopic);
    source.value = 'mock';
  } else {
    // No mock bank for this subject yet, so ask the AI to write one.
    const generated = await generateQuestions({
      levelName,
      streamName,
      subjectName: props.subject.displayName,
      focusTopic: props.focusTopic,
    });
    if (!generated) {
      status.value = 'error';
      return;
    }
    questions.value = generated.map(shuffleOptions);
    source.value = 'ai';
  }

  answers.value = questions.value.map(() => ({ choice: null, confidence: null, seconds: 0 }));
  status.value = 'ready';
  startTimer();
}

// ---------- Timer ----------
const elapsed = ref(0); // total seconds on the quiz
let timerId = null;
let questionStartedAt = 0; // when the current question was opened (ms)

function startTimer() {
  questionStartedAt = Date.now();
  timerId = setInterval(() => {
    elapsed.value += 1;
  }, 1000);
}

// Adds the time spent on the current question to its record.
function recordTimeOnCurrent() {
  const now = Date.now();
  answers.value[current.value].seconds += (now - questionStartedAt) / 1000;
  questionStartedAt = now;
}

// Shows seconds as mm:ss, e.g. 754 -> "12:34".
const timerText = computed(() => {
  const minutes = String(Math.floor(elapsed.value / 60)).padStart(2, '0');
  const seconds = String(elapsed.value % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
});

onMounted(loadQuestions);
onUnmounted(() => clearInterval(timerId));

// ---------- Moving between questions ----------
const current = ref(0); // index of the question on screen

const question = computed(() => questions.value[current.value]);
const answer = computed(() => answers.value[current.value]);
const isLast = computed(() => current.value === questions.value.length - 1);
const answeredCount = computed(() => answers.value.filter((a) => a.choice !== null).length);
const progressPercent = computed(() => ((current.value + 1) / questions.value.length) * 100);

function goTo(index) {
  if (index < 0 || index >= questions.value.length) return;
  recordTimeOnCurrent();
  current.value = index;
  confirmingSubmit.value = false;
}

function chooseOption(index) {
  answer.value.choice = index;
}

function chooseConfidence(id) {
  answer.value.confidence = id;
}

// ---------- Submitting ----------
const confirmingSubmit = ref(false); // true while showing "submit with blanks?"

function trySubmit() {
  const unanswered = questions.value.length - answeredCount.value;
  if (unanswered > 0 && !confirmingSubmit.value) {
    confirmingSubmit.value = true; // ask once before submitting with blanks
    return;
  }
  submit();
}

function submit() {
  recordTimeOnCurrent();
  clearInterval(timerId);
  emit('submit', {
    questions: questions.value,
    answers: answers.value.map((a) => ({ ...a, seconds: Math.round(a.seconds) })),
    totalSeconds: elapsed.value,
    source: source.value,
  });
}

function quit() {
  if (status.value !== 'ready' || confirm('Leave the quiz? Your answers will be lost.')) {
    emit('quit');
  }
}
</script>

<template>
  <div class="quiz">
    <!-- Top bar: subject, question counter, timer -->
    <header class="topbar">
      <div>
        <button class="link" @click="quit">← Exit quiz</button>
        <p class="subject">{{ subject.displayName }}</p>
        <p class="meta">
          {{ levelName }}<span v-if="streamName"> · {{ streamName }}</span>
          <span v-if="focusTopic"> · Topic practice: {{ focusTopic }}</span>
        </p>
      </div>
      <p v-if="status === 'ready'" class="counter">
        Question {{ current + 1 }} of {{ questions.length }}
      </p>
      <p v-if="status === 'ready'" class="timer" aria-label="Time taken">⏱ {{ timerText }}</p>
    </header>

    <div v-if="status === 'ready'" class="progress" aria-hidden="true">
      <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
    </div>

    <!-- Loading AI questions -->
    <div v-if="status === 'loading'" class="message">
      <p>Preparing your questions…</p>
      <p class="muted">There is no practice set for this subject yet, so the AI is writing one.</p>
    </div>

    <!-- AI not available and no mock bank -->
    <div v-else-if="status === 'error'" class="message">
      <p>Sorry, we couldn't load questions for {{ subject.displayName }}.</p>
      <p class="muted">
        There is no practice set for this subject yet and the AI could not create one.
        Try a subject with a ready-made set, for example P5–P6 Standard Mathematics or Science,
        Sec 3–4 G3 Mathematics, or Combined Science (Physics, Chemistry).
      </p>
      <button class="btn btn-outline" @click="emit('quit')">← Back to subjects</button>
    </div>

    <!-- The quiz itself -->
    <div v-else class="layout">
      <section class="card question-card">
        <p class="label">
          Multiple choice
          <span v-if="source === 'ai'" class="ai-tag">AI-generated</span>
        </p>
        <h2 class="question">{{ question.question }}</h2>

        <!-- Answer options A–D -->
        <div class="options">
          <button
            v-for="(option, index) in question.options"
            :key="index"
            class="option"
            :class="{ selected: answer.choice === index }"
            :aria-pressed="answer.choice === index"
            @click="chooseOption(index)"
          >
            <span class="letter">{{ LETTERS[index] }}</span>
            {{ option }}
          </button>
        </div>

        <!-- How sure are you? -->
        <div class="confidence">
          <span class="confidence-label">How sure are you?</span>
          <div class="pills">
            <button
              v-for="c in CONFIDENCE_LEVELS"
              :key="c.id"
              class="pill"
              :class="{ active: answer.confidence === c.id }"
              :aria-pressed="answer.confidence === c.id"
              @click="chooseConfidence(c.id)"
            >
              {{ c.label }}
            </button>
          </div>
        </div>

        <!-- Previous / Skip / Next -->
        <div class="nav">
          <button class="btn btn-outline prev-btn" :disabled="current === 0" @click="goTo(current - 1)">
            Previous
          </button>
          <div class="nav-right">
            <button
              v-if="answer.choice === null && !isLast"
              class="btn btn-ghost"
              @click="goTo(current + 1)"
            >
              Skip
            </button>
            <button v-if="!isLast" class="btn btn-primary" @click="goTo(current + 1)">Next</button>
            <button v-else class="btn btn-primary" @click="trySubmit">Submit quiz</button>
          </div>
        </div>
      </section>

      <!-- Side panel: jump to any question, and submit -->
      <aside class="card side">
        <p class="side-title">Questions</p>
        <div class="grid">
          <button
            v-for="(q, index) in questions"
            :key="index"
            class="grid-btn"
            :class="{ answered: answers[index].choice !== null, current: index === current }"
            :aria-label="`Question ${index + 1}${answers[index].choice !== null ? ', answered' : ''}`"
            @click="goTo(index)"
          >
            {{ index + 1 }}
          </button>
        </div>
        <p class="muted small">{{ answeredCount }} of {{ questions.length }} answered</p>

        <button class="btn btn-outline full" @click="trySubmit">Submit quiz</button>

        <!-- Shown once if the student tries to submit with blanks -->
        <div v-if="confirmingSubmit" class="confirm">
          <p class="small">
            {{ questions.length - answeredCount }} question(s) not answered. Blank answers count as wrong.
          </p>
          <div class="confirm-actions">
            <button class="btn btn-ghost" @click="confirmingSubmit = false">Keep going</button>
            <button class="btn btn-primary" @click="submit">Submit anyway</button>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.quiz {
  max-width: 1000px;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

/* ---------- Top bar ---------- */
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.subject {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 1.1rem;
  margin-top: var(--space-2);
}

.meta,
.muted {
  color: var(--color-muted);
}

.meta {
  font-size: 0.85rem;
}

.counter {
  font-size: 0.9rem;
  color: var(--color-muted);
}

.timer {
  font-variant-numeric: tabular-nums;
  font-weight: 600;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  padding: var(--space-1) var(--space-3);
}

.progress {
  height: 4px;
  background: var(--color-surface);
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--color-primary-soft);
  transition: width 0.2s;
}

/* ---------- Layout ---------- */
.layout {
  display: grid;
  grid-template-columns: 1fr 240px;
  gap: var(--space-4);
  align-items: start;
}

.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: var(--space-5);
}

.message {
  border: 1px dashed var(--color-border);
  border-radius: var(--radius);
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-3);
  line-height: 1.5;
}

/* ---------- Question ---------- */
.question-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-muted);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.ai-tag {
  text-transform: none;
  letter-spacing: 0;
  border: 1px dashed var(--color-border);
  border-radius: 999px;
  padding: 0 var(--space-2);
}

.question {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  line-height: 1.4;
}

.options {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.option {
  font-family: var(--font-body);
  font-size: 0.95rem;
  color: var(--color-text);
  text-align: left;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: var(--space-3) var(--space-4);
  display: flex;
  align-items: center;
  gap: var(--space-3);
  cursor: pointer;
}

.option:hover {
  border-color: var(--color-primary);
}

.option.selected {
  border: 2px solid var(--color-primary);
  background: var(--color-primary-soft);
  color: var(--color-bg);
}

.letter {
  flex-shrink: 0;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 600;
}

.option.selected .letter {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-text);
}

/* ---------- Confidence ---------- */
.confidence {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.confidence-label {
  font-size: 0.9rem;
  color: var(--color-muted);
}

.pills {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.pill {
  font-family: var(--font-body);
  font-size: 0.85rem;
  padding: var(--space-1) var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-surface);
  color: var(--color-text);
  cursor: pointer;
}

.pill:hover {
  border-color: var(--color-primary);
}

.pill.active {
  background: var(--color-primary-soft);
  border-color: var(--color-primary);
  color: var(--color-bg);
}

/* ---------- Navigation ---------- */
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--color-border);
  padding-top: var(--space-4);
}

.nav-right {
  display: flex;
  gap: var(--space-2);
}

/* ---------- Side panel ---------- */
.side {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.side-title {
  font-weight: 600;
}

.grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: var(--space-2);
}

.grid-btn {
  font-family: var(--font-body);
  aspect-ratio: 1;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: var(--color-surface);
  color: var(--color-text);
  cursor: pointer;
}

.grid-btn.answered {
  background: var(--color-primary-soft);
  border-color: var(--color-primary);
  color: var(--color-bg);
}

.grid-btn.current {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.small {
  font-size: 0.8rem;
}

.confirm {
  border-top: 1px solid var(--color-border);
  padding-top: var(--space-3);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.confirm-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-2);
}

/* ---------- Buttons ---------- */
.btn {
  font-family: var(--font-body);
  font-size: 0.9rem;
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius);
  cursor: pointer;
}

.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-primary {
  background: var(--color-primary-soft);
  color: var(--color-bg);
  border: 1px solid var(--color-primary);
}

.btn-outline {
  background: var(--color-surface);
  color: var(--color-bg);
  border: 1px solid var(--color-primary);
}

.btn-outline:hover:not(:disabled) {
  background: var(--color-primary-soft);
}

.btn-ghost {
  background: transparent;
  color: var(--color-muted);
  border: 1px solid transparent;
}

.btn-ghost:hover {
  color: var(--color-text);
}

.full {
  width: 100%;
}

/* "Previous" button only: dark text (other outline buttons are not affected) */
.btn-outline.prev-btn {
  color: var(--color-text);
}

/* Bottom "Submit quiz" button: always --color-primary-soft, even on hover */
.btn-outline.full,
.btn-outline.full:hover:not(:disabled) {
  background: var(--color-primary-soft);
}

.link {
  font-family: var(--font-body);
  font-size: 0.85rem;
  background: none;
  border: none;
  color: var(--color-muted);
  cursor: pointer;
  padding: 0;
}

.link:hover {
  color: var(--color-text);
}

/* Stack the side panel under the question on small screens */
@media (max-width: 768px) {
  .layout {
    grid-template-columns: 1fr;
  }
}
</style>
