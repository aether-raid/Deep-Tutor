<script setup>
// The project name lives in config.js, so we import it instead of typing it here.
import { PROJECT_NAME } from '../config.js';

// One-line description of what the project does.
const PURPOSE = 'Your friendly study buddy: ask questions, revise with flashcards, and find the topics you need to practise.';

// The 3 feature cards. Each "path" must match a route in router/index.js.
const FEATURES = [
  {
    title: 'Chatbot',
    icon: '💬',
    description: 'Ask any study question and get a clear, simple answer.',
    path: '/chatbot',
    color: 'yellow', // which pastel pill colour to use
  },
  {
    title: 'Flashcards',
    icon: '🃏',
    description: 'Revise key facts quickly with flip-able cards.',
    path: '/flashcards',
    color: 'blue',
  },
  {
    title: 'Weakness Identification',
    icon: '🎯',
    description: 'Find the topics you find hardest so you know what to practise.',
    path: '/weakness',
    color: 'green',
  },
];
</script>

<template>
  <section class="page">
    <!-- Hero: project name and one-line purpose -->
    <header class="hero">
      <img src="../../assets/Untitled_design-removebg-preview.png" style="width: 30%; height: auto;" /> 
    </header>

    <!-- Feature cards: v-for makes one card per item in FEATURES.
         router-link changes page without reloading the whole app. -->
    <div class="cards">
      <router-link
        v-for="feature in FEATURES"
        :key="feature.path"
        :to="feature.path"
        :class="['card', 'pill-' + feature.color]"
      >
        <!-- Left side: icon + bold title -->
        <span class="card-left">
          <span class="card-icon">{{ feature.icon }}</span>
          <h2 class="card-title">{{ feature.title }}</h2>
        </span>
        <!-- Right side: short description -->
        <p class="card-text">{{ feature.description }}</p>
      </router-link>
    </div>
  </section>
</template>

<style scoped>
/*
  Page-only colours, taken from the design picture.
  theme.css only has greys and we may not edit it, so these pastel colours
  are defined ONCE here and used everywhere below by name.
*/
.page {
  --home-panel: #eaf4ff;       /* light blue page panel */
  --home-ink: #2e2a6b;         /* dark indigo for headings */
  --home-outline: #1f1f3a;     /* dark outline, like the picture */
  --pill-yellow: #fff38a;      /* Chatbot */
  --pill-blue: #7ea6ff;        /* Flashcards */
  --pill-green: #8cf5c4;       /* Weakness Identification */

  font-family: var(--font-body);
  color: var(--color-text);

  /* The light blue rounded panel that holds the whole page */
  padding: var(--space-6);
  background: var(--home-panel);
  border: 2px solid var(--home-outline);
  border-radius: 16px;
}

/* Hero: no box of its own any more, it sits directly on the panel */
.hero {
  padding-bottom: var(--space-4);
}

.title {
  font-family: var(--font-heading);
  font-size: 2rem;
  font-weight: 800;
  color: var(--home-ink);
  margin-bottom: var(--space-2);
}

.purpose {
  font-size: 1.1rem;
  color: var(--color-muted);
  max-width: 60ch; /* keeps the line from getting too long to read */
}

/* The list of pill-shaped rows, stacked with space between them */
.cards {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  margin-top: var(--space-4);
}

/* One pill row: icon + title on the left, description on the right */
.card {
  display: flex;
  align-items: center;
  justify-content: space-between; /* pushes the description to the right */
  gap: var(--space-4);
  padding: var(--space-3) var(--space-5);
  border-radius: 999px; /* very large radius = fully rounded pill ends */
  color: var(--home-ink);
  text-decoration: none; /* remove the default link underline */
}

/* Mouse hover: lift the pill a little and show a dark outline */
.pill-blue:hover {
  transform: translateY(-2px);
  border-color: #3e66bf;
  box-shadow: 0 3px 0 #3e66bf;
}

.pill-green:hover {
  transform: translateY(-2px);
  border-color: #4cb584;
  box-shadow: 0 3px 0 #4cb584;
}
.pill-yellow:hover {
  transform: translateY(-2px);
  border-color: #bfb34a;
  box-shadow: 0 3px 0 #bfb34a;
}

/* Keyboard users (Tab key): show a clear ring around the focused pill */
.card:focus-visible {
  outline: 3px solid var(--home-ink);
  outline-offset: 3px;
}

/* Turn off the movement for people who ask their device for less motion */
@media (prefers-reduced-motion: reduce) {
  .card {
    transition: none;
  }

  .card:hover {
    transform: none;
  }
}

/* One background colour per card (set by "color" in FEATURES) */
.pill-yellow {
  background: var(--pill-yellow);
  border: 2px solid transparent; /* invisible now, shown on hover */
  transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
}

.pill-blue {
  background: var(--pill-blue);
  border: 2px solid transparent; /* invisible now, shown on hover */
  transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
}

.pill-green {
  background: var(--pill-green);
  border: 2px solid transparent; /* invisible now, shown on hover */
  transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
}

.card-left {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.card-icon {
  font-size: 1.3rem;
}

.card-title {
  font-family: var(--font-heading);
  font-size: 1.1rem;
  font-weight: 700;
}

.card-text {
  font-size: 0.95rem;
  text-align: right;
}

/* Phone / small screens (same breakpoint as the app layout) */
@media (max-width: 768px) {
  .page {
    padding: var(--space-4);
  }

  .title {
    font-size: 1.5rem;
  }

  /* Stack the description under the title instead of beside it */
  .card {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-1);
    padding: var(--space-3) var(--space-4);
    border-radius: 20px; /* softer corners look better on taller cards */
  }

  .card-text {
    text-align: left;
  }
}
</style>
