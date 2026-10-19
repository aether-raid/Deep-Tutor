<!-- A circular progress ring that fills up to `percent` (0 to 100). -->
<script setup>
import { computed } from 'vue';

const props = defineProps({
  percent: { type: Number, required: true },
  label: { type: String, default: '' },
  size: { type: Number, default: 72 },
});

const STROKE = 8;

// Circle maths: the ring is drawn with a dashed stroke.
// We hide part of the dash (the "offset") to show how full the ring is.
const radius = computed(() => (props.size - STROKE) / 2);
const circumference = computed(() => 2 * Math.PI * radius.value);
const safePercent = computed(() => Math.min(Math.max(props.percent, 0), 100));
const offset = computed(() => circumference.value * (1 - safePercent.value / 100));
</script>

<template>
  <div
    class="ring"
    :style="{ width: size + 'px', height: size + 'px' }"
    role="img"
    :aria-label="`${label} ${Math.round(safePercent)}%`"
  >
    <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`">
      <!-- Grey background circle -->
      <circle class="track" :cx="size / 2" :cy="size / 2" :r="radius" :stroke-width="STROKE" />
      <!-- Filled part (rotated so it starts at the top) -->
      <circle
        class="fill"
        :class="{ empty: safePercent === 0 }"
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        :stroke-width="STROKE"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="offset"
        :transform="`rotate(-90 ${size / 2} ${size / 2})`"
      />
    </svg>
    <span class="value">{{ Math.round(safePercent) }}%</span>
  </div>
</template>

<style scoped>
.ring {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.track {
  fill: none;
  stroke: var(--color-border);
}

.fill {
  fill: none;
  stroke: var(--color-primary);
  stroke-linecap: round;
  /* Smoothly animate the ring when the percentage changes */
  transition: stroke-dashoffset 0.6s ease;
}

/* A round line cap would show a dot at 0%, so hide it */
.fill.empty {
  opacity: 0;
}

.value {
  position: absolute;
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: 0.9rem;
  color: var(--color-text);
}
</style>
