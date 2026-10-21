<script setup>
import { PROJECT_NAME, NAV_ITEMS } from '../config.js';
</script>

<template>
  <aside class="sidebar">
    <header class="sidebar-header">
      <div class="header-container">
        <h1 class="project-name">{{ PROJECT_NAME }}</h1>
      <img src="../../assets/swallow.png" style="width: 15%; height: auto;" /> 
        
      </div>

    </header>

    <nav class="nav">
      <RouterLink
        v-for="item in NAV_ITEMS"
        :key="item.path"
        :to="item.path"
        class="nav-link"
        exact-active-class="active"
      >
        <span class="icon">{{ item.icon }}</span>
        <span>{{ item.label }}</span>
      </RouterLink>
    </nav>
  </aside>
</template>

<style scoped>
.header-container {
  display: flex;         /* Activates flexbox */
  align-items: center;   /* Vertically aligns the image and text in the middle */
  gap: 15px;             /* Adds clean spacing between the image and the h1 */
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 240px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-surface);
  border-right: 1px solid var(--color-border);
}

/* Title with the logo right beside it, on one line */
.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: var(--space-2);
  padding: var(--space-4);
  border-bottom: 1px solid var(--color-border);
}

/* Logo (511 x 511): shrunk to sit beside the title inside the 240px sidebar */
.logo {
  display: block;
  flex-shrink: 0; /* don't let a long title squash the logo */
  width: 56px;
  height: 56px;
  object-fit: contain;
}

.project-name {
  margin: 0;
  min-width: 0; /* lets a long name wrap instead of pushing the logo out */
  font-family: var(--font-heading);
  font-size: 1.5rem;
  color: var(--color-text);
  overflow-wrap: anywhere;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  padding: var(--space-3);
}

.nav-link {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  font-family: var(--font-body);
  color: var(--color-muted);
  text-decoration: none;
  border-radius: var(--radius);
}

.nav-link:hover {
  background: var(--color-primary-soft);
  color: var(--color-primary);
}

.nav-link.active {
  background: var(--color-primary-soft);
  color: var(--color-primary);
  font-weight: 600;
}

@media (max-width: 768px) {
  .sidebar {
    position: static;
    width: 100%;
    height: auto;
    border-right: none;
    border-bottom: 1px solid var(--color-border);
  }

  .nav {
    flex-direction: row;
    flex-wrap: wrap;
  }

  /* On phones the sidebar becomes a top bar, so keep the logo small */
  .logo {
    width: 40px;
    height: 40px;
  }
}
</style>
