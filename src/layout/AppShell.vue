<script setup>
import Sidebar from './Sidebar.vue';
</script>

<template>
  <div class="app-shell">
    <Sidebar />
    <main class="content">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  display: flex;
  min-height: 100vh;
  background: var(--color-bg);
}

.content {
  flex: 1;
  margin-left: 240px;
  padding: var(--space-6);
  overflow-y: auto;
  color: var(--color-text);
}

@media (max-width: 768px) {
  .app-shell {
    flex-direction: column;
  }

  .content {
    margin-left: 0;
    padding: var(--space-4);
  }
}
</style>
