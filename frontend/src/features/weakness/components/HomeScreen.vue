<script setup>
// Home screen: the student picks a level (and stream for secondary),
// then picks a subject to start a 10-question quiz.
//hi
import {
  STAGES,
  STREAMS,
  MOCK_PROGRESS,
  getSubjectsForLevel,
  findLevel,
  isSecondary,
  getStrength,
} from '../data/subjects.js';

// The parent page owns these values (v-model), so they are remembered
// when the student comes back to this screen.
const level = defineModel('level');
const stream = defineModel('stream');

// Messages sent up to WeaknessPage.vue.
const emit = defineEmits(['start', 'view-progress']);

// Subjects for the chosen level, with the mock progress attached.
const subjects = computed(() =>
  getSubjectsForLevel(level.value).map((subject) => {
    const percent = MOCK_PROGRESS[subject.id] ?? null;
    return { ...subject, percent, strength: getStrength(percent) };
  })
);

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
  // Secondary students also need a stream; default to G3. Primary has none.
  stream.value = isSecondary(id) ? stream.value ?? 'g3' : null;
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

      <!-- Only secondary students choose a stream (subject level) -->
      <div v-if="isSecondary(level)" class="row">
        <span class="row-label">Stream</span>
        <div class="pills">
          <button
            v-for="s in STREAMS"
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

        <!-- One card per subject -->
        <div class="subject-grid">
          <button
            v-for="subject in subjects"
            :key="subject.id"
            class="subject-card"
            @click="emit('start', subject)"
          >
            <div class="subject-top">
              <span class="icon">{{ subject.icon }}</span>
              <span class="badge" :class="'badge-' + subject.strength.key">
                {{ subject.strength.label }}
              </span>
            </div>
            <span class="subject-name">{{ subject.name }}</span>
            <span class="subject-percent">
              {{ subject.percent === null ? '–' : subject.percent + '%' }}
            </span>
            <div class="bar">
              <div class="bar-fill" :style="{ width: (subject.percent ?? 0) + '%' }"></div>
            </div>
            <span class="cta">Start quiz →</span>
          </button>
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

.subject-grid {
  flex: 1;
  min-width: 260px;
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

.subject-card:hover {
  border-color: var(--color-primary);
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

@media (max-width: 600px) {
  .overview {
    flex-basis: 100%;
  }
}
</style>
