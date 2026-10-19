<!-- Final page: "You got X/N correct" (Reset) and "You need to improve on Y/N" (Focus on wrong). -->
<script setup>
import { computed } from 'vue';

const props = defineProps({
  correct: { type: Number, required: true },
  wrong: { type: Number, required: true },
  total: { type: Number, required: true },
  // true while the AI is making practice variations
  loading: { type: Boolean, default: false },
});

const emit = defineEmits(['reset', 'focus']);

const correctPercent = computed(() => Math.round((props.correct / props.total) * 100));
const wrongPercent = computed(() => Math.round((props.wrong / props.total) * 100));
</script>

<template>
  <div class="results">
    <!-- Left panel: correct -->
    <div class="panel good">
      <p class="message">
        You got <strong>{{ correct }}/{{ total }}</strong> correct!
      </p>
      <p class="big">{{ correctPercent }}%</p>
      <button class="action" type="button" @click="emit('reset')">↺ Reset?</button>
    </div>

    <!-- Right panel: wrong -->
    <div class="panel bad">
      <template v-if="wrong > 0">
        <p class="message">
          You need to improve on <strong>{{ wrong }}/{{ total }}</strong>
        </p>
        <p class="big">{{ wrongPercent }}%</p>
        <button class="action" type="button" :disabled="loading" @click="emit('focus')">
          {{ loading ? 'Making practice cards…' : '🎯 Focus on wrong?' }}
        </button>
      </template>
      <template v-else>
        <p class="message">Nothing to improve on.</p>
        <p class="big">🎉</p>
        <p class="message">Perfect score!</p>
      </template>
    </div>
  </div>
</template>

<style scoped>
.results {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-4);
  padding: var(--space-4);
  max-width: 720px;
  margin: var(--space-6) auto 0;
  border-radius: calc(var(--radius) * 3);
  background: var(--color-primary);
  box-shadow: 0 20px 50px color-mix(in srgb, var(--color-primary) 30%, transparent);
  animation: pop-in 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-5);
  min-height: 300px;
  padding: var(--space-6) var(--space-4);
  border-radius: calc(var(--radius) * 2);
  text-align: center;
}

/* Light panel for correct, dark panel for wrong (theme greys only) */
.good {
  background: var(--color-surface);
  color: var(--color-text);
}

.bad {
  background: color-mix(in srgb, var(--color-primary) 75%, var(--color-muted));
  color: var(--color-bg);
}

.message {
  font-size: 1.1rem;
  line-height: 1.4;
}

.big {
  font-family: var(--font-heading);
  font-size: 3.5rem;
  font-weight: 800;
}

.action {
  font: inherit;
  font-size: 1.1rem;
  font-weight: 700;
  padding: var(--space-3) var(--space-5);
  border-radius: 999px;
  border: 2px solid currentColor;
  background: transparent;
  color: inherit;
  cursor: pointer;
  transition: transform 0.15s ease;
}

.action:hover:not(:disabled) {
  transform: scale(1.05);
}

.action:disabled {
  opacity: 0.6;
  cursor: wait;
}

@keyframes pop-in {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

@media (max-width: 600px) {
  .results {
    grid-template-columns: 1fr;
  }
  .panel {
    min-height: 220px;
  }
}
</style>
