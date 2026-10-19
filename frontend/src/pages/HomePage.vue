<script setup>
// The project name lives in config.js, so we import it instead of typing it here.
import { PROJECT_NAME } from '../config.js';

// One-line description of what the project does.
const PURPOSE = 'Your friendly study buddy: ask questions, revise with flashcards, and find the topics you need to practise.';
</script>

<template>
  <section class="page">
    <!-- Hero: project name and one-line purpose -->
    <header class="hero">
      <h1 class="title">{{ PROJECT_NAME }}</h1>
      <p class="purpose">{{ PURPOSE }}</p>
    </header>

    <!-- Step 2 will add the 3 feature cards here -->
  </section>
</template>

<style scoped>
.page {
  font-family: var(--font-body);
  color: var(--color-text);
}

/* Soft coloured box at the top of the page */
.hero {
  padding: var(--space-6) var(--space-5);
  background: var(--color-primary-soft);
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
}

.title {
  font-family: var(--font-heading);
  font-size: 2rem;
  color: var(--color-primary);
  margin-bottom: var(--space-3);
}

.purpose {
  font-size: 1.1rem;
  color: var(--color-muted);
  max-width: 60ch; /* keeps the line from getting too long to read */
}
</style>
