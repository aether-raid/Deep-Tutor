<template>
  <!-- Screen 1: a list of subjects. Clicking one tells the parent page which subject was chosen. -->
  <ul class="subject-list">
    <li v-for="subject in subjects" :key="subject.id">
      <button class="subject-button" @click="emit('select', subject)">
        <span class="subject-name">📖 {{ subject.name }}</span>
        <span class="last-used">Last Used Date: {{ subject.lastUsed }}</span>
      </button>
    </li>
  </ul>
</template>

<script setup>
// The list of subjects comes from the parent page as a prop.
defineProps({
  subjects: { type: Array, required: true },
});

// We send a 'select' event up to the parent when a subject is clicked.
const emit = defineEmits(['select']);
</script>

<style scoped>
.subject-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

/* Each subject is a rounded "pill" button, like in the wireframe */
.subject-button {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-3) var(--space-5);
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-surface);
  color: var(--color-text);
  font-family: var(--font-body);
  font-size: 1rem;
  cursor: pointer;
  text-align: left;
}

.subject-button:hover {
  border-color: var(--color-primary);
}

.subject-name {
  font-family: var(--font-heading);
  font-weight: 700;
}

.last-used {
  color: var(--color-muted);
}
</style>
