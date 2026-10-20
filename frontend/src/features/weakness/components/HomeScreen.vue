<script setup>
// Home screen: the student picks a level (and stream for secondary),
// then picks a subject to start a 10-question quiz.
import { computed, ref, watch } from 'vue';
import {
  STAGES,
  getSubjectsForLevel,
  getStreamsForLevel,
  getSubjectOptions,
  findLevel,
  isLowerPrimary,
} from '../data/subjects.js';
import { getSubjectProgress } from '../progress.js';

// The parent page owns these values (v-model), so they are remembered
// when the student comes back to this screen.
const level = defineModel('level');
const stream = defineModel('stream');

// Quizzes finished in this session, so the cards show the latest results.
const props = defineProps({
  history: { type: Array, default: () => [] },
});

// Messages sent up to WeaknessPage.vue.
const emit = defineEmits(['start', 'view-progress']);

// Streams for the chosen level (P5–P6: Standard/Foundation, Secondary: G1–G3).
const streams = computed(() => getStreamsForLevel(level.value));

// Adds the progress (mock + this session's quizzes) and strength label to each subject.
function withProgress(subject) {
  const { percent, strength } = getSubjectProgress(level.value, stream.value, subject.id, props.history);
  const hasOptions = getSubjectOptions(subject.id, stream.value) !== null;
  return { ...subject, percent, strength, hasOptions };
}

// ---------- Sub-subject choice ----------
// Mother Tongue, Combined Science and Humanities need one more choice
// (e.g. Chinese, or Physics + Chemistry) before the quiz can start.
const pending = ref(null); // { subject, prompt, options } while choosing
const pendingOptionId = ref(null); // the option the student clicked

function pickSubject(subject) {
  const choice = getSubjectOptions(subject.id, stream.value);
  if (!choice) {
    // Nothing more to choose: start straight away.
    emit('start', { ...subject, option: null, displayName: subject.name });
    return;
  }
  pending.value = { subject, ...choice };
  pendingOptionId.value = null;
}

function confirmOption() {
  const { subject, options } = pending.value;
  const option = options.find((o) => o.id === pendingOptionId.value);
  emit('start', { ...subject, option, displayName: `${subject.name} (${option.name})` });
}

function cancelOption() {
  pending.value = null;
}

// If the level or stream changes, the open choice may no longer be valid.
watch([level, stream], cancelOption);

// Subjects for the chosen level + stream, split into two groups.
const groups = computed(() => {
  const { core, other } = getSubjectsForLevel(level.value, stream.value);
  return [
    { title: 'Core subjects', subjects: core.map(withProgress) },
    { title: 'Electives and optional subjects', subjects: other.map(withProgress) },
  ].filter((group) => group.subjects.length > 0);
});

// All subjects in one list (used for the ring and the tip).
const subjects = computed(() => groups.value.flatMap((group) => group.subjects));

// Average of the subjects the student has tried (for the ring).
const overall = computed(() => {
  const tried = subjects.value.filter((s) => s.percent !== null);
  if (tried.length === 0) return null;
  const total = tried.reduce((sum, s) => sum + s.percent, 0);
  return Math.round(total / tried.length);
});

// The weakest tried subject, used for a short tip under the ring.
const weakest = computed(() => {
  const tried = subjects.value.filter((s) => s.percent !== null);
  if (tried.length === 0) return null;
  return tried.reduce((low, s) => (s.percent < low.percent ? s : low));
});

const levelName = computed(() => findLevel(level.value)?.name ?? '');

function selectLevel(id) {
  level.value = id;
  // Keep the current stream if this level has it, otherwise pick the first one
  // (Standard or G3). Levels without streams (P1–P4) get null.
  const options = getStreamsForLevel(id);
  const stillValid = options.some((s) => s.id === stream.value);
  stream.value = stillValid ? stream.value : options[0]?.id ?? null;
}
</script>

<template>
  <div class="home">
    <!-- Page header -->
    <header class="header">
      <div>
        <h1 class="title">Find your weak spots</h1>
        <p class="subtitle">
          Pick your level and a subject, then take a short 10-question quiz.
          We will show you which topics need work and why you lost marks.
        </p>
      </div>
      <button class="btn btn-outline" @click="emit('view-progress')">
        View overall progress
      </button>
    </header>

    <!-- Step 1: level and stream -->
    <section class="card">
      <h2 class="card-title"><span class="step">1</span> Choose your level</h2>

      <div v-for="stage in STAGES" :key="stage.id" class="row">
        <span class="row-label">{{ stage.name }}</span>
        <div class="pills">
          <button
            v-for="lvl in stage.levels"
            :key="lvl.id"
            class="pill"
            :class="{ active: level === lvl.id }"
            :aria-pressed="level === lvl.id"
            @click="selectLevel(lvl.id)"
          >
            {{ lvl.short }}
          </button>
        </div>
      </div>

      <!-- Only P5–P6 and secondary students choose a stream -->
      <div v-if="streams.length > 0" class="row">
        <span class="row-label">Stream</span>
        <div class="pills">
          <button
            v-for="s in streams"
            :key="s.id"
            class="pill"
            :class="{ active: stream === s.id }"
            :aria-pressed="stream === s.id"
            @click="stream = s.id"
          >
            {{ s.name }} <span class="pill-hint">{{ s.hint }}</span>
          </button>
        </div>
      </div>

      <!-- P1–P2 have no tests or grades, so make it clear this is just practice -->
      <p v-if="isLowerPrimary(level)" class="note">
        P1 and P2 have no tests, exams or grades. This quiz is just for practice.
      </p>
    </section>

    <!-- Step 2: subject -->
    <section class="card">
      <h2 class="card-title"><span class="step">2</span> Choose a subject</h2>

      <p v-if="!level" class="muted">Choose your level first to see your subjects.</p>

      <div v-else class="subject-layout">
        <!-- Overall strength ring for this level -->
        <div class="overview">
          <div class="ring" :style="{ '--pct': overall ?? 0 }">
            <div class="ring-inner">
              <span class="ring-value">{{ overall === null ? '–' : overall + '%' }}</span>
              <span class="ring-label">Overall strength</span>
            </div>
          </div>
          <p class="overview-tip">
            <template v-if="weakest">
              {{ levelName }}: <strong>{{ weakest.name }}</strong> needs the most attention.
            </template>
            <template v-else>No quizzes yet. Pick any subject to start.</template>
          </p>
        </div>

        <!-- Subject cards, grouped into core and other subjects -->
        <div class="groups">
          <div v-for="group in groups" :key="group.title" class="group">
            <h3 class="group-title">{{ group.title }}</h3>
            <div class="subject-grid">
              <button
                v-for="subject in group.subjects"
                :key="subject.id"
                class="subject-card"
                :class="{ selected: pending?.subject.id === subject.id }"
                @click="pickSubject(subject)"
              >
                <div class="subject-top">
                  <span class="icon">{{ subject.icon }}</span>
                  <span class="badge" :class="'badge-' + subject.strength.key">
                    {{ subject.strength.label }}
                  </span>
                </div>
                <span class="subject-name">{{ subject.name }}</span>
                <span v-if="subject.note" class="subject-note">{{ subject.note }}</span>
                <span class="subject-percent">
                  {{ subject.percent === null ? '–' : subject.percent + '%' }}
                </span>
                <div class="bar">
                  <div class="bar-fill" :style="{ width: (subject.percent ?? 0) + '%' }"></div>
                </div>
                <span class="cta">{{ subject.hasOptions ? 'Choose and start →' : 'Start quiz →' }}</span>
              </button>
            </div>

            <!-- Sub-subject chooser: appears under the group the clicked card is in -->
            <div
              v-if="pending && group.subjects.some((s) => s.id === pending.subject.id)"
              class="chooser"
            >
              <p class="chooser-title">
                <strong>{{ pending.subject.name }}</strong>: {{ pending.prompt }}
              </p>
              <div class="pills">
                <button
                  v-for="option in pending.options"
                  :key="option.id"
                  class="pill"
                  :class="{ active: pendingOptionId === option.id }"
                  :aria-pressed="pendingOptionId === option.id"
                  @click="pendingOptionId = option.id"
                >
                  {{ option.name }}
                </button>
              </div>
              <div class="chooser-actions">
                <button class="btn btn-ghost" @click="cancelOption">Cancel</button>
                <button class="btn btn-primary" :disabled="!pendingOptionId" @click="confirmOption">
                  Start quiz →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  max-width: 1000px;
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

.subtitle,
.muted {
  color: var(--color-muted);
  max-width: 60ch;
  line-height: 1.5;
}

/* ---------- Cards ---------- */
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
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

/* Small numbered circle in front of each card title */
.step {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--color-primary);
  color: var(--color-bg);
  font-size: 0.8rem;
}

/* ---------- Level / stream pills ---------- */
.row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.row-label {
  width: 90px;
  color: var(--color-muted);
  font-size: 0.9rem;
}

.pills {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.pill {
  font-family: var(--font-body);
  font-size: 0.9rem;
  padding: var(--space-2) var(--space-4);
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
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-bg);
}

.pill-hint {
  font-size: 0.75rem;
  opacity: 0.75;
  margin-left: var(--space-1);
}

/* ---------- Subjects ---------- */
.subject-layout {
  display: flex;
  gap: var(--space-5);
  flex-wrap: wrap;
}

.overview {
  flex: 0 0 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
  text-align: center;
}

/* Ring chart made with a conic gradient. --pct is set from the template. */
.ring {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: conic-gradient(
    var(--color-primary) calc(var(--pct) * 1%),
    var(--color-border) 0
  );
  display: flex;
  align-items: center;
  justify-content: center;
}

.ring-inner {
  width: 124px;
  height: 124px;
  border-radius: 50%;
  background: var(--color-surface);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.ring-value {
  font-family: var(--font-heading);
  font-size: 1.8rem;
  font-weight: 700;
}

.ring-label,
.overview-tip {
  font-size: 0.8rem;
  color: var(--color-muted);
}

.note {
  font-size: 0.85rem;
  color: var(--color-muted);
  background: var(--color-primary-soft);
  border-radius: var(--radius);
  padding: var(--space-2) var(--space-3);
}

.groups {
  flex: 1;
  min-width: 260px;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.group-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-muted);
  margin-bottom: var(--space-2);
}

.subject-note {
  font-size: 0.75rem;
  color: var(--color-muted);
}

.subject-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, 1fr));
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
  gap: var(--space-2);
  cursor: pointer;
}

.subject-card:hover,
.subject-card.selected {
  border-color: var(--color-primary);
}

.subject-card.selected {
  background: var(--color-primary-soft);
}

/* Box for choosing a sub-subject (language, science pair, elective) */
.chooser {
  margin-top: var(--space-3);
  padding: var(--space-4);
  border: 1px solid var(--color-primary);
  border-radius: var(--radius);
  background: var(--color-surface);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.chooser-title {
  font-size: 0.9rem;
}

.chooser-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-2);
}

.subject-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.subject-name {
  font-size: 0.9rem;
  color: var(--color-muted);
}

.subject-percent {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 700;
}

.bar {
  height: 6px;
  border-radius: 999px;
  background: var(--color-primary-soft);
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: var(--color-primary);
}

.cta {
  font-size: 0.8rem;
  color: var(--color-muted);
  margin-top: var(--space-1);
}

.subject-card:hover .cta {
  color: var(--color-text);
}

/* Strength badges: theme has no red/green, so we use style instead of colour.
   Weak is the loudest (solid), Strong is the quietest (outline). */
.badge {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 2px var(--space-2);
  border-radius: 999px;
  border: 1px solid var(--color-border);
}

.badge-weak {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-bg);
}

.badge-moderate {
  background: var(--color-primary-soft);
}

.badge-strong {
  background: var(--color-surface);
}

.badge-none {
  border-style: dashed;
  color: var(--color-muted);
}

/* ---------- Buttons ---------- */
.btn {
  font-family: var(--font-body);
  font-size: 0.9rem;
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius);
  cursor: pointer;
}

.btn-outline {
  background: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-primary);
}

.btn-outline:hover {
  background: var(--color-primary-soft);
}

.btn-primary {
  background: var(--color-primary);
  color: var(--color-bg);
  border: 1px solid var(--color-primary);
}

.btn-primary:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-ghost {
  background: transparent;
  color: var(--color-muted);
  border: 1px solid transparent;
}

.btn-ghost:hover {
  color: var(--color-text);
}

@media (max-width: 600px) {
  .overview {
    flex-basis: 100%;
  }
}
</style>
