<!-- Top bar: correct answers, wrong answers, percentage correct ring and the timer. -->
<script setup>
import { computed } from 'vue';
import ProgressRing from './ProgressRing.vue';

const props = defineProps({
  correct: { type: Number, required: true },
  wrong: { type: Number, required: true },
  percentCorrect: { type: Number, required: true },
  timeLeft: { type: Number, required: true },
  timeLimit: { type: Number, required: true },
});

// How much of the time is left, from 1 (full) down to 0 (empty).
const fractionLeft = computed(() => props.timeLeft / props.timeLimit);

// The timer changes "stage" every 25% of the time used:
// stage 0 = more than 75% left, 1 = 50-75%, 2 = 25-50%, 3 = under 25%.
const stage = computed(() => {
  if (fractionLeft.value > 0.75) return 0;
  if (fractionLeft.value > 0.5) return 1;
  if (fractionLeft.value > 0.25) return 2;
  return 3;
});
</script>

<template>
  <div class="stats">
    <div class="stat">
      <span class="label">Correct answers</span>
      <span class="number">{{ correct }} <span class="icon">✓</span></span>
    </div>

    <div class="stat">
      <span class="label">Wrong answers</span>
      <span class="number">{{ wrong }} <span class="icon">✗</span></span>
    </div>

    <div class="stat">
      <span class="label">Percentage correct</span>
      <ProgressRing :percent="percentCorrect" label="Percentage correct" :size="64" />
    </div>

    <div class="stat" :class="`stage-${stage}`">
      <span class="label">Timer</span>
      <span class="number timer-number">{{ timeLeft }}s</span>
      <!-- Bar that shrinks as time runs out and darkens at each 25% stage -->
      <div class="timer-track">
        <div class="timer-fill" :style="{ width: fractionLeft * 100 + '%' }"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border: 1px solid var(--color-border);
  border-radius: calc(var(--radius) * 2);
  background: var(--color-surface);
  overflow: hidden;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-2) var(--space-4);
  border-right: 1px solid var(--color-border);
}

.stat:last-child {
  border-right: none;
}

/* Header strip like the wireframe */
.label {
  align-self: stretch;
  text-align: center;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-muted);
  padding-bottom: var(--space-2);
  border-bottom: 1px solid var(--color-border);
}

.number {
  font-family: var(--font-heading);
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--color-text);
  font-variant-numeric: tabular-nums;
}

.icon {
  font-size: 1.1rem;
  color: var(--color-muted);
}

/* ----- Timer colours (theme greys only) ----- */
/* Each stage sets --timer-color; it gets darker as time runs out. */
.stage-0 { --timer-color: color-mix(in srgb, var(--color-muted) 55%, var(--color-bg)); }
.stage-1 { --timer-color: var(--color-muted); }
.stage-2 { --timer-color: color-mix(in srgb, var(--color-muted) 45%, var(--color-primary)); }
.stage-3 { --timer-color: var(--color-primary); }

.timer-number {
  color: var(--timer-color);
  transition: color 0.8s ease;
}

/* Last 25%: the number pulses to warn the student */
.stage-3 .timer-number {
  animation: pulse 1s ease-in-out infinite;
}

.timer-track {
  width: 80%;
  height: 8px;
  border-radius: 999px;
  background: var(--color-primary-soft);
  overflow: hidden;
}

.timer-fill {
  height: 100%;
  border-radius: 999px;
  background-color: var(--timer-color);
  /* Soft shine on top of the bar */
  background-image: linear-gradient(90deg, transparent, color-mix(in srgb, var(--color-bg) 35%, transparent));
  /* Smooth fade between stage colours, and smooth shrinking every second */
  transition: width 1s linear, background-color 0.8s ease;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.12); }
}

/* Phones: 2 x 2 grid instead of 4 in a row */
@media (max-width: 600px) {
  .stats {
    grid-template-columns: repeat(2, 1fr);
  }
  .stat:nth-child(2) {
    border-right: none;
  }
  .stat:nth-child(-n + 2) {
    border-bottom: 1px solid var(--color-border);
  }
}
</style>
