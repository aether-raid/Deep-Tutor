<script setup>
import { PROJECT_NAME } from '../config.js';
</script>

<template>
  <section class="page">
    <h1 class="title">About {{ PROJECT_NAME }}</h1>
    <p class="subtitle">Coming soon</p>
  </section>
</template>

<style scoped>
.page {
  font-family: var(--font-body);
  color: var(--color-text);
}

.title {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  margin-bottom: var(--space-2);
}

.subtitle {
  color: var(--color-muted);
}
</style>
