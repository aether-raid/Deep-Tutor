<script setup>
// Overall progress: every subject's strength for the chosen level,
// and a topic-by-topic breakdown for the selected subject.
import { ref, computed } from 'vue';
import { getSubjectsForLevel, findLevel, findStream } from '../data/subjects.js';
import { getSubjectProgress } from '../progress.js';

const props = defineProps({
  level: { type: String, default: null },
  stream: { type: String, default: null },
  history: { type: Array, default: () => [] }, // quizzes finished this session
});

// practice(subject, topicName or null) starts a quiz from this screen.
const emit = defineEmits(['practice', 'home']);

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'weak', label: 'Weak' },
  { id: 'moderate', label: 'Moderate' },
  { id: 'strong', label: 'Strong' },
];

const levelName = computed(() => findLevel(props.level)?.name ?? '');
const streamName = computed(() => findStream(props.stream)?.name ?? null);

// Every subject for this level + stream, with its progress worked out.
const subjects = computed(() => {
  if (!props.level) return [];
  const { core, other } = getSubjectsForLevel(props.level, props.stream);
  return [...core, ...other].map((subject) => ({
    ...subject,
    ...getSubjectProgress(props.level, props.stream, subject.id, props.history),
  }));
});

// Filter pills (All / Weak / Moderate / Strong).
const filter = ref('all');
const visibleSubjects = computed(() =>
  filter.value === 'all' ? subjects.value : subjects.value.filter((s) => s.strength.key === filter.value)
);

// Which subject is open below. Starts on the weakest subject that has results.
function weakestSubjectId() {
  const tried = subjects.value.filter((s) => s.percent !== null);
  if (tried.length === 0) return subjects.value[0]?.id ?? null;
  return tried.reduce((low, s) => (s.percent < low.percent ? s : low)).id;
}
const selectedId = ref(weakestSubjectId());
const selected = computed(() => subjects.value.find((s) => s.id === selectedId.value) ?? null);

// Topic groups for the two summary boxes (topics not tried yet have percent null).
const needsAttention = computed(
  () => selected.value?.topics.filter((t) => t.percent !== null && t.percent < 50) ?? []
);
const goingWell = computed(
  () => selected.value?.topics.filter((t) => t.percent !== null && t.percent >= 70) ?? []
);
const notTriedCount = computed(() => selected.value?.topics.filter((t) => t.percent === null).length ?? 0);
</script>

<template>
  <div class="overall">
    <!-- Header -->
    <header class="header">
      <div>
        <button class="link" @click="emit('home')">← Back to home</button>
        <h1 class="title">Subjects: strengths and weak areas</h1>
        <p class="muted">Tap a subject to see which topics need work and which are going well.</p>
      </div>
      <span v-if="level" class="tag">
        {{ levelName }}<span v-if="streamName"> · {{ streamName }}</span>
      </span>
    </header>

    <!-- No level chosen yet -->
    <div v-if="!level" class="empty">
      <p>Choose your level on the home screen first, so we can show the right subjects.</p>
      <button class="btn btn-primary" @click="emit('home')">Choose my level</button>
    </div>

    <template v-else>
      <!-- Filter pills -->
      <div class="pills" role="group" aria-label="Filter subjects">
        <button
          v-for="f in FILTERS"
          :key="f.id"
          class="pill"
          :class="{ active: filter === f.id }"
          :aria-pressed="filter === f.id"
          @click="filter = f.id"
        >
          {{ f.label }}
        </button>
      </div>

      <!-- Subject cards -->
      <div class="subject-grid">
        <button
          v-for="subject in visibleSubjects"
          :key="subject.id"
          class="subject-card"
          :class="{ selected: subject.id === selectedId }"
          @click="selectedId = subject.id"
        >
          <span class="icon">{{ subject.icon }}</span>
          <span class="subject-name">{{ subject.name }}</span>
          <span class="subject-percent">{{ subject.percent === null ? '–' : subject.percent + '%' }}</span>
          <div class="bar">
            <div class="bar-fill" :style="{ width: (subject.percent ?? 0) + '%' }"></div>
          </div>
          <span class="badge" :class="'badge-' + subject.strength.key">{{ subject.strength.label }}</span>
        </button>
        <p v-if="visibleSubjects.length === 0" class="muted">No subjects in this group.</p>
      </div>

      <!-- Detail for the selected subject -->
      <section v-if="selected" class="card">
        <div class="detail-head">
          <div class="detail-title">
            <h2 class="card-title">{{ selected.name }}</h2>
            <span class="badge" :class="'badge-' + selected.strength.key">
              {{ selected.strength.label }}<span v-if="selected.percent !== null"> · {{ selected.percent }}%</span>
            </span>
            <span v-if="selected.lastQuiz" class="updated">Updated from your quiz</span>
          </div>
          <button
            v-if="selected.topics.length"
            class="btn btn-primary"
            @click="emit('practice', selected, selected.topics[0].name)"
          >
            Practise weakest topic
          </button>
        </div>

        <!-- No results yet -->
        <div v-if="selected.topics.length === 0" class="empty">
          <p>No results yet for {{ selected.name }}. Take a quiz to find your strengths and weak spots.</p>
          <button class="btn btn-primary" @click="emit('practice', selected, null)">Take a quiz</button>
        </div>

        <template v-else>
          <!-- Summary boxes -->
          <div class="summary">
            <div class="summary-box attention">
              <p class="summary-label">Needs attention</p>
              <p>{{ needsAttention.map((t) => t.name).join(', ') || 'Nothing urgent. Nice!' }}</p>
            </div>
            <div class="summary-box">
              <p class="summary-label">Going well</p>
              <p>{{ goingWell.map((t) => t.name).join(', ') || 'Keep practising to get here.' }}</p>
            </div>
          </div>

          <!-- Every topic in the subject: weakest first, not-tried topics at the bottom -->
          <p class="muted small">
            All {{ selected.topics.length }} topics, weakest first<span v-if="notTriedCount">
              ({{ notTriedCount }} not tried yet, at the bottom)</span>.
          </p>
          <ul class="topics">
            <li
              v-for="topic in selected.topics"
              :key="topic.name"
              class="topic"
              :class="{ untried: topic.percent === null }"
            >
              <div class="topic-text">
                <span class="topic-name">
                  {{ topic.name }}
                  <span v-if="topic.fromQuiz" class="updated">new</span>
                </span>
                <span class="topic-note">{{ topic.note }}</span>
              </div>
              <div class="bar topic-bar" :class="{ low: topic.percent !== null && topic.percent < 50 }">
                <div class="bar-fill" :style="{ width: (topic.percent ?? 0) + '%' }"></div>
              </div>
              <span class="topic-percent">{{ topic.percent === null ? '–' : topic.percent + '%' }}</span>
              <button class="btn btn-small" @click="emit('practice', selected, topic.name)">Practice</button>
            </li>
          </ul>
          <p class="muted small">
            "Practice" starts a short quiz on that topic when we have questions for it.
            Otherwise you get a mixed quiz for the subject.
          </p>
        </template>
      </section>
    </template>
  </div>
</template>

<style scoped>
.overall {
  max-width: 1000px;
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
  align-items: flex-end;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.title {
  font-family: var(--font-heading);
  font-size: 1.6rem;
  margin: var(--space-2) 0;
}

.tag {
  font-size: 0.8rem;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  padding: var(--space-1) var(--space-3);
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

.empty {
  border: 1px dashed var(--color-border);
  border-radius: var(--radius);
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-3);
}

/* ---------- Filter pills ---------- */
.pills {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.pill {
  font-family: var(--font-body);
  font-size: 0.85rem;
  padding: var(--space-1) var(--space-4);
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
  color: var(--color-primary);
}

/* ---------- Subject cards ---------- */
.subject-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: var(--space-3);
}

.subject-card {
  font-family: var(--font-body);
  color: var(--color-text);
  text-align: left;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-2);
  cursor: pointer;
}

.subject-card:hover {
  border-color: var(--color-primary);
}

.subject-card.selected {
  border: 2px solid var(--color-primary);
  background: var(--color-primary-soft);
}

.icon {
  width: 36px;
  height: 36px;
  border-radius: var(--radius);
  background: var(--color-primary-soft);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
}

.subject-card.selected .icon {
  background: var(--color-surface);
}

.subject-name {
  font-size: 0.85rem;
  color: var(--color-muted);
}

.subject-percent {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 700;
}

/* Selected card: name and percent turn light so they stand out */
.subject-card.selected .subject-name,
.subject-card.selected .subject-percent {
  color: var(--color-bg);
}

.bar {
  width: 100%;
  height: 6px;
  border-radius: 999px;
  background: var(--color-primary);
  overflow: hidden;
}

.subject-card.selected .bar {
  background: var(--color-primary);
}

.subject-card.selected .bar-fill {
  background: var(--color-surface);
}

.bar-fill {
  height: 100%;
  background: var(--color-primary-soft);
}

/* Strength badges: style instead of colour (theme has no red/green) */
.badge {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 2px var(--space-2);
  border-radius: 999px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-bg)
}

.badge-weak {
  background: var(--color-danger);
  border-color: var(--color-primary);
  color: var(--color-bg);
}

.badge-moderate {
  background: var(--color-warning);
}

.badge-strong {
  background: var(--color-success);
  
}

.badge-none {
  border-style: dashed;
  color: var(--color-muted);
}

/* ---------- Detail card ---------- */
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.card-title {
  font-family: var(--font-heading);
  font-size: 1.2rem;
}

.detail-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.detail-title {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.updated {
  font-size: 0.7rem;
  color: var(--color-muted);
  border: 1px dashed var(--color-border);
  border-radius: 999px;
  padding: 0 var(--space-2);
  font-weight: 400;
}

.summary {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3);
}

.summary-box {
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: var(--space-3) var(--space-4);
  font-size: 0.9rem;
}



.summary-label {
  font-weight: 700;
  margin-bottom: var(--space-1);
}

/* ---------- Topic rows ---------- */
.topics {
  list-style: none;
  display: flex;
  flex-direction: column;
}

.topic {
  display: grid;
  grid-template-columns: 1fr 180px 48px auto;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) 0;
  border-bottom: 1px solid var(--color-border);
}

/* Topics with no score yet are dimmed and get a dashed bar */
.topic.untried .topic-name {
  color: var(--color-muted);
}

.topic.untried .topic-bar {
  background: transparent;
  border: 1px dashed var(--color-border);
}

.topic-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.topic-name {
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.topic-note {
  font-size: 0.8rem;
  color: var(--color-muted);
}

/* Weak topics get a thicker bar so they stand out without colour */
.topic-bar.low {
  height: 10px;
}

.topic-percent {
  font-size: 0.85rem;
  font-weight: 600;
  text-align: right;
}

/* ---------- Buttons ---------- */
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

.btn-small {
  font-size: 0.8rem;
  padding: var(--space-1) var(--space-3);
  background: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-primary);
}

.btn-small:hover {
  background: var(--color-primary-soft);
  color: var(--color-bg)
}

/* ---------- Small screens ---------- */
@media (max-width: 640px) {
  .summary {
    grid-template-columns: 1fr;
  }

  /* Topic row: text on top, then bar + percent + button underneath */
  .topic {
    grid-template-columns: 1fr 48px auto;
  }

  .topic-text {
    grid-column: 1 / -1;
  }
}
</style>
