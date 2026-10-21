<script setup>
// Results screen: score, score per topic, weakest topics highlighted,
// and a detailed look at every question in the chosen topic.
import { ref, computed } from 'vue';
import { analyseQuiz, CONFIDENCE_LABELS, DIFFICULTY_LABELS, SKILL_INFO, TOPIC_STATUS, formatDuration } from '../analysis.js';
import { findLevel, findStream } from '../data/subjects.js';
import AiSuggestions from './AiSuggestions.vue';
import { buildAskLink } from '../askAiLink.js';

const props = defineProps({
  level: { type: String, required: true },
  stream: { type: String, default: null },
  subject: { type: Object, required: true },
  result: { type: Object, required: true }, // what QuizScreen sent on submit
});

const emit = defineEmits(['retake', 'home', 'view-progress']);

const LETTERS = ['A', 'B', 'C', 'D'];

const levelName = findLevel(props.level)?.name ?? '';
const streamName = findStream(props.stream)?.name ?? null;

// All the numbers and labels come from analysis.js.
const analysis = computed(() => analyseQuiz(props.result));

// The four summary tiles at the top.
const stats = computed(() => [
  { value: `${analysis.value.score} / ${analysis.value.total}`, label: 'Score' },
  { value: formatDuration(analysis.value.totalSeconds), label: 'Time taken' },
  { value: analysis.value.confidentWrongCount, label: 'Confident but wrong' },
  { value: analysis.value.luckyGuessCount, label: 'Lucky guesses' },
]);

// Topics grouped by status for the topic map (Needs work, Shaky, Strong, Not enough data).
const statusGroups = computed(() =>
  Object.entries(TOPIC_STATUS)
    .map(([key, info]) => ({
      key,
      label: info.label,
      topics: analysis.value.topics.filter((t) => t.status === key),
    }))
    .filter((group) => group.topics.length > 0)
);

// Which topic is open in the detail panel. Starts on the weakest topic.
const selectedName = ref(analysis.value.topics[0]?.name ?? null);
const selectedTopic = computed(() => analysis.value.topics.find((t) => t.name === selectedName.value));

const isWeakest = (topic) => analysis.value.weakestTopics.some((t) => t.name === topic.name);

// Scrolls to the detail panel after picking a topic (handy on phones).
const detailPanel = ref(null);
function openTopic(name, scroll = false) {
  selectedName.value = name;
  if (scroll) detailPanel.value?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Details sent to the AI tutor (no personal information).
const aiContext = {
  levelName,
  streamName,
  subjectName: props.subject.displayName,
};

// The "Ask AI" button opens the Chatbot page in a new tab for that question.
// The link says which chatbot to use and carries the question, both answers,
// the student's level and stream (see askAiLink.js).
function askAiLink(item) {
  return buildAskLink(item, {
    ...aiContext,
    subjectId: props.subject.id,
    // Time on every question, so the chatbot can compare this one with the rest.
    allSeconds: analysis.value.items.map((i) => i.seconds),
  });
}

// AI explanations per question number, filled in by AiSuggestions.
const aiNotes = ref({});

function answerText(item, index) {
  return index === null ? 'Skipped' : `${LETTERS[index]}. ${item.options[index]}`;
}
</script>

<template>
  <div class="results">
    <!-- Header -->
    <header class="header">
      <div>
        <h1 class="title">Quiz analysis</h1>
        <p class="muted">
          We looked at your answers, how sure you were and how long you took to find where you stand.
          Tap a topic to see every question and why it went wrong.
        </p>
      </div>
      <span class="tag">
        {{ subject.displayName }} · {{ levelName }}<span v-if="streamName"> · {{ streamName }}</span>
      </span>
    </header>

    <!-- Summary tiles -->
    <section class="stats">
      <div v-for="stat in stats" :key="stat.label" class="stat">
        <span class="stat-value">{{ stat.value }}</span>
        <span class="stat-label">{{ stat.label }}</span>
      </div>
    </section>

    <!-- Main finding -->
    <section class="banner">
      <div>
        <p class="banner-title">{{ analysis.pattern.title }}</p>
        <p class="banner-detail">{{ analysis.pattern.detail }}</p>
        <p v-if="analysis.pattern.focus.length" class="banner-focus">
          Focus first on:
          <strong>{{ analysis.pattern.focus.join(', ') }}</strong>
        </p>
      </div>
      <button
        v-if="analysis.weakestTopics.length"
        class="btn btn-primary"
        @click="openTopic(analysis.weakestTopics[0].name, true)"
      >
        Show weakest topic
      </button>
    </section>

    <div class="columns">
      <!-- Left: score per topic, grouped by status -->
      <section class="card">
        <h2 class="card-title">Score by topic</h2>
        <p class="muted small">Weakest topics are shown first.</p>

        <div v-for="group in statusGroups" :key="group.key" class="status-group">
          <p class="status-label">
            <span class="dot" :class="'dot-' + group.key"></span>{{ group.label }}
          </p>

          <button
            v-for="topic in group.topics"
            :key="topic.name"
            class="topic"
            :class="['topic-' + topic.status, { selected: topic.name === selectedName }]"
            @click="openTopic(topic.name)"
          >
            <div class="topic-top">
              <span class="topic-name">{{ topic.name }}</span>
              <span v-if="isWeakest(topic)" class="weakest">Weakest</span>
            </div>
            <div class="bar">
              <div class="bar-fill" :style="{ width: topic.percent + '%' }"></div>
            </div>
            <span class="topic-meta">
              {{ topic.correct }}/{{ topic.total }} correct · {{ topic.percent }}% · {{ Math.round(topic.avgSeconds) }}s avg
            </span>
          </button>
        </div>
      </section>

      <!-- Right: detail for the selected topic -->
      <section v-if="selectedTopic" ref="detailPanel" class="card detail">
        <div class="detail-head">
          <h2 class="card-title">{{ selectedTopic.name }}</h2>
          <span class="diagnosis" :class="'diagnosis-' + selectedTopic.diagnosis.key">
            {{ selectedTopic.diagnosis.label }}
          </span>
        </div>
        <p>{{ selectedTopic.diagnosis.summary }}</p>
        <p v-if="selectedTopic.skillNote" class="skill-note">{{ selectedTopic.skillNote }}</p>

        <div class="mini-stats">
          <div class="mini">
            <span class="mini-value">{{ selectedTopic.percent }}%</span>
            <span class="mini-label">Accuracy</span>
          </div>
          <div class="mini">
            <span class="mini-value">{{ Math.round(selectedTopic.avgSeconds) }}s</span>
            <span class="mini-label">Avg time</span>
          </div>
          <div class="mini">
            <span class="mini-value">{{ selectedTopic.confidence }}</span>
            <span class="mini-label">Usual confidence</span>
          </div>
        </div>

        <div>
          <p class="section-label">Evidence</p>
          <ul class="evidence">
            <li v-for="line in selectedTopic.evidence" :key="line">{{ line }}</li>
          </ul>
        </div>

        <!-- Every question in this topic -->
        <article
          v-for="item in selectedTopic.items"
          :key="item.number"
          class="q"
          :class="{ 'q-wrong': !item.correct }"
        >
          <div class="q-head">
            <strong>Q{{ item.number }}</strong>
            <span class="result-tag" :class="item.correct ? 'tag-right' : 'tag-wrong'">
              {{ item.correct ? 'Correct' : item.skipped ? 'Skipped' : 'Incorrect' }}
            </span>
            <span class="muted small">
              {{ item.seconds }}s · {{ CONFIDENCE_LABELS[item.confidence] ?? 'No confidence given' }}
              · {{ SKILL_INFO[item.skill].label }}
              <template v-if="item.difficulty">· {{ DIFFICULTY_LABELS[item.difficulty] }}</template>
            </span>
          </div>

          <p class="q-text">{{ item.question }}</p>

          <div class="answers">
            <div class="answer-box">
              <span class="answer-label">Your answer</span>
              <span>{{ answerText(item, item.choice) }}</span>
            </div>
            <div class="answer-box">
              <span class="answer-label">Correct answer</span>
              <span>{{ answerText(item, item.answer) }}</span>
            </div>
          </div>

          <!-- Why it went wrong (only for wrong answers) -->
          <div v-if="!item.correct" class="went-wrong">
            <p v-if="!item.skipped && item.whyWrong">
              <strong>Where it went wrong: </strong>{{ item.whyWrong[item.choice] }}
            </p>
            <p v-if="aiNotes[item.number]">
              <strong>✦ AI tutor ({{ aiNotes[item.number].type }}): </strong>{{ aiNotes[item.number].explanation }}
            </p>
            <p v-else-if="!item.skipped && !item.whyWrong" class="muted">
              No stored explanation for this question. See the revision plan below.
            </p>
            <p>
              <strong>Mistake type: {{ SKILL_INFO[item.skill].label }}. </strong>
              {{ SKILL_INFO[item.skill].meaning }}
              <span v-if="item.confidentWrong">
                You were sure of your answer, so this is likely a misconception rather than a careless slip.
              </span>
            </p>
          </div>

          <div class="solution">
            <p v-if="item.explanation" class="section-label">Worked solution</p>
            <div class="solution-row">
              <p class="solution-text">{{ item.explanation }}</p>
              <!-- Opens the Chatbot page in a new tab, ready to explain this question -->
              <a
                class="btn-ask"
                :href="askAiLink(item)"
                target="_blank"
                rel="noopener"
                :aria-label="`Ask AI about question ${item.number} (opens in a new tab)`"
              >
                ✦ Ask AI
              </a>
            </div>
          </div>
        </article>
      </section>
    </div>

    <!-- AI revision plan (falls back to a rule-based plan if the AI is unavailable) -->
    <AiSuggestions :analysis="analysis" :context="aiContext" @explanations="aiNotes = $event" />

    <!-- What next -->
    <div class="actions">
      <button class="btn btn-ghost" @click="emit('home')">← Back to subjects</button>
      <button class="btn btn-outline" @click="emit('view-progress')">View overall progress</button>
      <button class="btn btn-primary" @click="emit('retake')">Try again with new questions</button>
    </div>
  </div>
</template>

<style scoped>
.results {
  max-width: 1100px;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.muted {
  color: var(--color-muted);
}

.small {
  font-size: 0.8rem;
}

/* ---------- Header ---------- */
.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.title {
  font-family: var(--font-heading);
  font-size: 1.6rem;
  margin-bottom: var(--space-2);
}

.header .muted {
  max-width: 65ch;
  line-height: 1.5;
}

.tag {
  font-size: 0.8rem;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  padding: var(--space-1) var(--space-3);
  background: var(--color-primary-soft);
}

/* ---------- Summary tiles ---------- */
.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: var(--space-3);
}

.stat {
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.stat-value {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 700;
}

.stat-label {
  font-size: 0.8rem;
  color: var(--color-muted);
}

/* ---------- Banner ---------- */
.banner {
  border: 1px solid var(--color-border);
  border-left: 4px solid var(--color-primary);
  border-radius: var(--radius);
  background: var(--color-surface);
  padding: var(--space-4) var(--space-5);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.banner-title {
  font-weight: 700;
  margin-bottom: var(--space-1);
}

.banner-detail,
.banner-focus {
  font-size: 0.9rem;
  line-height: 1.5;
}

.banner-focus {
  margin-top: var(--space-2);
}

/* ---------- Columns ---------- */
.columns {
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: var(--space-4);
  align-items: start;
}

.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.card-title {
  font-family: var(--font-heading);
  font-size: 1.1rem;
}

/* ---------- Topic map ---------- */
.status-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin-top: var(--space-2);
}

.status-label {
  font-size: 0.85rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

/* Status dots: no red/amber/green in the theme, so fill amount shows status */
.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid var(--color-primary);
}

.dot-weak {
  background: var(--color-primary);
}

.dot-moderate {
  background: linear-gradient(90deg, var(--color-primary) 50%, transparent 50%);
}

.dot-none {
  border-style: dashed;
  border-color: var(--color-muted);
}

.topic {
  font-family: var(--font-body);
  color: var(--color-text);
  text-align: left;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-left-width: 4px;
  border-radius: var(--radius);
  padding: var(--space-3);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  cursor: pointer;
}

.topic:hover {
  border-color: var(--color-primary);
}

/* Weak topics get a solid thick left edge so they stand out */
.topic-weak {
  border-left-color: var(--color-primary);
}

.topic-moderate {
  border-left-style: dashed;
  border-left-color: var(--color-primary);
}

.topic.selected {
  background: var(--color-primary-soft);
  border-color: var(--color-primary);
}

.topic-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-2);
}

.topic-name {
  font-weight: 600;
}

.weakest {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 2px var(--space-2);
  border-radius: 999px;
  background: var(--color-danger);
  color: var(--color-bg);
}

.topic-meta {
  font-size: 0.75rem;
  color: var(--color-muted);
}

.bar {
  height: 6px;
  border-radius: 999px;
  background: var(--color-primary);
  overflow: hidden;
}

.topic.selected .bar {
  background: var(--color-primary);
}

.bar-fill {
  height: 100%;
  background: var(--color-primary-soft);
}

.topic.selected .bar-fill {
  background: var(--color-surface);
}

/* ---------- Detail panel ---------- */
.detail {
  scroll-margin-top: var(--space-4);
}

.detail-head {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.diagnosis {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 2px var(--space-3);
  border-radius: 999px;
  border: 1px solid var(--color-primary);
}

.diagnosis-misconception,
.diagnosis-gap {
  background: var(--color-primary);
  color: var(--color-bg);
}

.diagnosis-secure {
  border-color: var(--color-border);
}

.skill-note {
  font-size: 0.9rem;
  border-left: 3px solid var(--color-border);
  padding-left: var(--space-3);
}

.mini-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-2);
}

.mini {
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: var(--space-3);
  display: flex;
  flex-direction: column;
}

.mini-value {
  font-weight: 700;
}

.mini-label {
  font-size: 0.75rem;
  color: var(--color-muted);
}

.section-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-muted);
  margin-bottom: var(--space-1);
}

.evidence {
  padding-left: var(--space-5);
  font-size: 0.9rem;
  line-height: 1.6;
}

/* ---------- One question ---------- */
.q {
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.q-wrong {
  border-color: var(--color-primary);
}

.q-head {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.result-tag {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 2px var(--space-2);
  border-radius: 999px;
  border: 1px solid var(--color-border);
}

.tag-wrong {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-bg);
}

.q-text {
  line-height: 1.5;
}

.answers {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-2);
}

.answer-box {
  background: var(--color-primary-soft);
  border-radius: var(--radius);
  padding: var(--space-3);
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  font-size: 0.9rem;
}

.answer-label {
  font-size: 0.75rem;
  color: var(--color-muted);
}

.went-wrong {
  border-left: 4px solid var(--color-primary);
  background: var(--color-primary-soft);
  border-radius: var(--radius);
  padding: var(--space-3);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  font-size: 0.9rem;
  line-height: 1.5;
}

.solution {
  font-size: 0.9rem;
  line-height: 1.5;
}

/* Explanation on the left, "Ask AI" button on the right (stacks on small screens) */
.solution-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.solution-text {
  flex: 1 1 240px;
}

.btn-ask {
  margin-left: auto;
  font-family: var(--font-body);
  font-size: 0.8rem;
  text-decoration: none;
  padding: var(--space-1) var(--space-3);
  border: 1px solid var(--color-primary);
  border-radius: var(--radius);
  background: var(--color-surface);
  color: var(--color-text);
  white-space: nowrap;
}

.btn-ask:hover {
  background: var(--color-primary-soft);
}

/* ---------- Actions ---------- */
.actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.btn {
  font-family: var(--font-body);
  font-size: 0.9rem;
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius);
  cursor: pointer;
}

.btn-primary {
  background: var(--color-primary-soft);
  color: var(--color-bg);
  border: 1px solid var(--color-primary);
}

.btn-outline {
  background: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-primary);
}

.btn-outline:hover {
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

/* Stack everything on small screens */
@media (max-width: 860px) {
  .columns {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 500px) {
  .answers,
  .mini-stats {
    grid-template-columns: 1fr;
  }
}
</style>
