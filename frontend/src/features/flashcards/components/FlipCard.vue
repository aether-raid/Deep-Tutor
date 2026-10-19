<!--
  One flashcard that flips in 3D.
  Front = question, back = answer.
  Before the timer starts, the question is blurred and a "Start timer" warning shows on top.
-->
<script setup>
const props = defineProps({
  card: { type: Object, required: true },
  flipped: { type: Boolean, required: true },
  // true when the student has not started the timer yet (question stays blurred)
  locked: { type: Boolean, required: true },
});

const emit = defineEmits(['flip', 'start']);

function handleClick() {
  // Can't flip until the timer has been started
  if (!props.locked) emit('flip');
}
</script>

<template>
  <div class="scene">
    <div
      class="card"
      :class="{ flipped, locked }"
      role="button"
      :tabindex="locked ? -1 : 0"
      :aria-label="flipped ? 'Show question' : 'Show answer'"
      @click="handleClick"
      @keydown.enter.prevent="handleClick"
      @keydown.space.prevent="handleClick"
    >
      <!-- FRONT: the question -->
      <div class="face front">
        <div class="tags">
          <span class="tag">{{ card.difficulty }}</span>
          <span v-if="card.isVariation" class="tag">✨ AI variation</span>
        </div>
        <p class="kicker">Question</p>
        <p class="text">{{ card.question }}</p>
        <p class="hint">Tap the card to reveal the answer</p>
      </div>

      <!-- BACK: the answer -->
      <div class="face back">
        <p class="kicker">Answer</p>
        <p class="text">{{ card.answer }}</p>
        <p class="hint">Did you get it right? Choose below.</p>
      </div>
    </div>

    <!-- Warning overlay: shown until the student starts the timer -->
    <div v-if="locked" class="overlay">
      <p class="overlay-title">⏱ Ready?</p>
      <p class="overlay-text">
        You have <strong>{{ card.timeLimit }} seconds</strong> for this {{ card.difficulty }} card.
        If time runs out before you flip it, it counts as wrong.
      </p>
      <button class="start-btn" type="button" @click="emit('start')">Start timer</button>
    </div>
  </div>
</template>

<style scoped>
.scene {
  position: relative;
  width: 100%;
  max-width: 560px;
  margin: 0 auto;
  aspect-ratio: 16 / 10;
  min-height: 240px;
  /* Needed for the 3D flip effect */
  perspective: 1200px;
}

.card {
  position: relative;
  width: 100%;
  height: 100%;
  cursor: pointer;
  transform-style: preserve-3d;
  transition: transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
  border-radius: calc(var(--radius) * 3);
  outline: none;
}

.card:hover:not(.locked) {
  transform: translateY(-4px);
}

.card.flipped {
  transform: rotateY(180deg);
}

.card:focus-visible .face {
  outline: 3px solid var(--color-muted);
  outline-offset: 3px;
}

.card.locked {
  cursor: default;
}

/* Both faces sit on top of each other; the back is pre-rotated */
.face {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  padding: var(--space-6) var(--space-5);
  border-radius: inherit;
  backface-visibility: hidden;
  text-align: center;
  box-shadow:
    0 2px 4px color-mix(in srgb, var(--color-primary) 8%, transparent),
    0 18px 40px color-mix(in srgb, var(--color-primary) 18%, transparent);
}

.front {
  background-color: var(--color-surface);
  /* Subtle dotted paper pattern */
  background-image: radial-gradient(var(--color-border) 1px, transparent 1px);
  background-size: 18px 18px;
  border: 1px solid var(--color-border);
  color: var(--color-text);
  transition: filter 0.4s ease;
}

/* Blur the question until the timer starts */
.locked .front {
  filter: blur(7px);
}

.back {
  transform: rotateY(180deg);
  background: linear-gradient(
    135deg,
    var(--color-primary),
    color-mix(in srgb, var(--color-primary) 70%, var(--color-muted))
  );
  color: var(--color-bg);
}

.tags {
  position: absolute;
  top: var(--space-4);
  left: var(--space-4);
  display: flex;
  gap: var(--space-2);
}

.tag {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
  padding: var(--space-1) var(--space-3);
  border-radius: 999px;
  background: var(--color-primary-soft);
  color: var(--color-muted);
  border: 1px solid var(--color-border);
}

.kicker {
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  opacity: 0.6;
}

.text {
  font-family: var(--font-heading);
  font-size: clamp(1.3rem, 3.5vw, 2rem);
  font-weight: 600;
  line-height: 1.3;
}

.hint {
  font-size: 0.8rem;
  opacity: 0.55;
}

/* ----- Start-timer warning ----- */
.overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  padding: var(--space-5);
  text-align: center;
  color: var(--color-text);
  border-radius: calc(var(--radius) * 3);
  background: color-mix(in srgb, var(--color-bg) 55%, transparent);
}

.overlay-title {
  font-family: var(--font-heading);
  font-size: 1.4rem;
  font-weight: 700;
}

.overlay-text {
  max-width: 360px;
  color: var(--color-muted);
}

.start-btn {
  font: inherit;
  font-weight: 600;
  padding: var(--space-3) var(--space-6);
  border: none;
  border-radius: 999px;
  background: var(--color-primary);
  color: var(--color-bg);
  cursor: pointer;
  box-shadow: 0 8px 20px color-mix(in srgb, var(--color-primary) 30%, transparent);
  transition: transform 0.15s ease;
}

.start-btn:hover {
  transform: scale(1.05);
}
</style>
