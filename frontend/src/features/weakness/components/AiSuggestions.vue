<script setup>
// AI revision suggestions, shown at the bottom of the results screen.
// Asks the AI (through weaknessAI.js -> askLLM) for a revision plan.
// If the AI is unavailable, it shows a plan built from the quiz rules instead.
import { ref, onMounted } from 'vue';
import { getSuggestions, buildOfflinePlan } from '../weaknessAI.js';

const props = defineProps({
  analysis: { type: Object, required: true }, // from analysis.js
  context: { type: Object, required: true }, // { levelName, streamName, subjectName }
});

// Sends the AI's per-question explanations up to ResultsScreen,
// so they can appear inside each question card.
const emit = defineEmits(['explanations']);

const status = ref('loading'); // 'loading' | 'ready'
const source = ref('ai'); // 'ai' or 'offline'
const notice = ref(''); // why we fell back to the offline plan
const plan = ref(null);
const copied = ref(false);

async function load() {
  status.value = 'loading';
  notice.value = '';
  copied.value = false;

  const response = await getSuggestions(props.analysis, props.context);

  if (response.ok) {
    plan.value = response.plan;
    source.value = 'ai';
    // e.g. { 3: 'You added instead of subtracting...', 7: '...' }
    const notes = {};
    for (const m of response.plan.mistakes) notes[m.q] = m;
    emit('explanations', notes);
  } else {
    plan.value = buildOfflinePlan(props.analysis);
    source.value = 'offline';
    notice.value = response.message;
    emit('explanations', {});
  }
  status.value = 'ready';
}

onMounted(load);

// A short plain-text summary a student can paste to their teacher.
async function copyForTeacher() {
  const a = props.analysis;
  const lines = [
    `${props.context.subjectName} (${props.context.levelName}${props.context.streamName ? ', ' + props.context.streamName : ''})`,
    `Score: ${a.score}/${a.total}. Confident but wrong: ${a.confidentWrongCount}. Lucky guesses: ${a.luckyGuessCount}.`,
    '',
    'By topic:',
    ...a.topics.map((t) => `- ${t.name}: ${t.correct}/${t.total} (${t.diagnosis.label})`),
    '',
    'Revision priorities:',
    ...plan.value.priorities.map((p, i) => `${i + 1}. ${p.topic} [${p.type}]: ${p.why}`),
  ];
  try {
    await navigator.clipboard.writeText(lines.join('\n'));
    copied.value = true;
  } catch {
    copied.value = false;
  }
}
</script>

<template>
  <section class="card">
    <div class="head">
      <div>
        <h2 class="title">Your revision plan</h2>
        <p class="muted small">What to revise first, and why you lost marks.</p>
      </div>
      <span v-if="status === 'ready'" class="source">
        {{ source === 'ai' ? '✦ AI tutor' : 'Based on your answers' }}
      </span>
    </div>

    <!-- Loading -->
    <div v-if="status === 'loading'" class="loading" aria-live="polite">
      <span class="spinner" aria-hidden="true"></span>
      The AI tutor is looking at your answers…
    </div>

    <template v-else>
      <!-- Shown when the AI could not be used -->
      <p v-if="source === 'offline'" class="notice">
        The AI tutor is not available right now, so this plan was made from your quiz results.
        <span class="muted">({{ notice }})</span>
      </p>

      <p class="summary">{{ plan.summary }}</p>

      <!-- Priority topics -->
      <ol v-if="plan.priorities.length" class="priorities">
        <li v-for="(p, index) in plan.priorities" :key="p.topic + index" class="priority">
          <div class="priority-head">
            <span class="number">{{ index + 1 }}</span>
            <strong>{{ p.topic }}</strong>
            <span class="type">{{ p.type }}</span>
          </div>
          <p>{{ p.why }}</p>
          <div v-if="p.revise.length">
            <p class="label">What to revise</p>
            <ul class="list">
              <li v-for="item in p.revise" :key="item">{{ item }}</li>
            </ul>
          </div>
          <p v-if="p.tip" class="tip"><strong>Tip: </strong>{{ p.tip }}</p>
        </li>
      </ol>

      <!-- Per-question explanations from the AI -->
      <div v-if="plan.mistakes.length">
        <p class="label">Where each mistake came from</p>
        <ul class="mistakes">
          <li v-for="m in plan.mistakes" :key="m.q">
            <strong>Q{{ m.q }}</strong>
            <span class="type">{{ m.type }}</span>
            {{ m.explanation }}
          </li>
        </ul>
      </div>

      <div v-if="plan.nextSteps.length">
        <p class="label">Next steps</p>
        <ul class="list">
          <li v-for="step in plan.nextSteps" :key="step">{{ step }}</li>
        </ul>
      </div>

      <div class="actions">
        <span v-if="copied" class="muted small" aria-live="polite">Copied!</span>
        <button class="btn btn-outline" @click="copyForTeacher">Copy summary for teacher</button>
        <button class="btn btn-ghost" @click="load">↻ Ask again</button>
      </div>
    </template>
  </section>
</template>

<style scoped>
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  line-height: 1.5;
}

.head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-3);
  flex-wrap: wrap;
}

.title {
  font-family: var(--font-heading);
  font-size: 1.1rem;
}

.muted {
  color: var(--color-muted);
}

.small {
  font-size: 0.8rem;
}

.source {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 2px var(--space-3);
  border-radius: 999px;
  border: 1px solid var(--color-primary);
}

/* ---------- Loading ---------- */
.loading {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  color: var(--color-muted);
}

.spinner {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid var(--color-border);
  border-top-color: var(--color-primary);
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.notice {
  font-size: 0.85rem;
  border: 1px dashed var(--color-border);
  border-radius: var(--radius);
  padding: var(--space-2) var(--space-3);
}

.summary {
  font-size: 1rem;
}

/* ---------- Priorities ---------- */
.priorities {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: var(--space-3);
}

.priority {
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  font-size: 0.9rem;
}

/* The first priority is the most important, so it gets the strongest border */
.priority:first-child {
  border: 2px solid var(--color-primary);
}

.priority-head {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.number {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--color-primary);
  color: var(--color-bg);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
}

.type {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 1px var(--space-2);
  border-radius: 999px;
  background: var(--color-primary-soft);
  border: 1px solid var(--color-border);
  margin-right: var(--space-1);
}

.label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-muted);
  margin-bottom: var(--space-1);
}

.list {
  padding-left: var(--space-5);
  font-size: 0.9rem;
}

.tip {
  background: var(--color-primary-soft);
  border-radius: var(--radius);
  padding: var(--space-2) var(--space-3);
}

.mistakes {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  font-size: 0.9rem;
}

.mistakes li {
  border-left: 3px solid var(--color-primary);
  padding-left: var(--space-3);
}

.mistakes strong {
  margin-right: var(--space-2);
}

/* ---------- Actions ---------- */
.actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
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
</style>
