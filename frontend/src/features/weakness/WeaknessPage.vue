<script setup>
// Weakness Identification page.
// This one page shows four "screens" and swaps between them (no extra routes):
//   home -> quiz -> results -> home      and      home <-> overall
import { ref } from 'vue';
import HomeScreen from './components/HomeScreen.vue';
import QuizScreen from './components/QuizScreen.vue';
import ResultsScreen from './components/ResultsScreen.vue';

// Which screen is showing right now: 'home' | 'quiz' | 'results' | 'overall'
const screen = ref('home');

// What the student picked on the home screen.
const selectedLevel = ref(null); // e.g. 'p3' or 's3'
const selectedStream = ref(null); // e.g. 'g3' or 'standard'
const selectedSubject = ref(null); // subject object + chosen option + displayName

// What the quiz sends back when it is submitted (questions, answers, time).
const quizResult = ref(null);

// Changing this number makes Vue build a brand-new QuizScreen,
// which picks a new random set of questions.
const quizKey = ref(0);

function startQuiz(subject) {
  selectedSubject.value = subject;
  quizKey.value += 1;
  screen.value = 'quiz';
}

function finishQuiz(result) {
  quizResult.value = result;
  screen.value = 'results';
}

function retake() {
  quizKey.value += 1;
  screen.value = 'quiz';
}

function goTo(name) {
  screen.value = name;
}
</script>

<template>
  <section class="page">
    <HomeScreen
      v-if="screen === 'home'"
      v-model:level="selectedLevel"
      v-model:stream="selectedStream"
      @start="startQuiz"
      @view-progress="goTo('overall')"
    />

    <QuizScreen
      v-else-if="screen === 'quiz'"
      :key="quizKey"
      :level="selectedLevel"
      :stream="selectedStream"
      :subject="selectedSubject"
      @submit="finishQuiz"
      @quit="goTo('home')"
    />

    <ResultsScreen
      v-else-if="screen === 'results'"
      :level="selectedLevel"
      :stream="selectedStream"
      :subject="selectedSubject"
      :result="quizResult"
      @retake="retake"
      @home="goTo('home')"
      @view-progress="goTo('overall')"
    />

    <!-- Placeholder: the overall progress screen is built in step 5 -->
    <div v-else-if="screen === 'overall'" class="placeholder">
      <p class="muted">Overall progress will appear here in step 5.</p>
      <button class="btn" @click="goTo('home')">← Back to home</button>
    </div>
  </section>
</template>

<style scoped>
.page {
  font-family: var(--font-body);
  color: var(--color-text);
}

.placeholder {
  border: 1px dashed var(--color-border);
  border-radius: var(--radius);
  padding: var(--space-6);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-4);
}

.muted {
  color: var(--color-muted);
}

.btn {
  font-family: var(--font-body);
  font-size: 0.9rem;
  padding: var(--space-2) var(--space-4);
  border: 1px solid var(--color-primary);
  border-radius: var(--radius);
  background: var(--color-surface);
  color: var(--color-text);
  cursor: pointer;
}

.btn:hover {
  background: var(--color-primary-soft);
}
</style>
