<script setup>
// Weakness Identification page.
// This one page shows four "screens" and swaps between them (no extra routes):
//   home -> quiz -> results -> home      and      home <-> overall
import { ref } from 'vue';
import HomeScreen from './components/HomeScreen.vue';
import QuizScreen from './components/QuizScreen.vue';
import ResultsScreen from './components/ResultsScreen.vue';
import OverallScreen from './components/OverallScreen.vue';
import { analyseQuiz } from './analysis.js';
import { getSubjectOptions } from './data/subjects.js';

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

// Set when a "Practice" button asks for a quiz on one topic only.
const focusTopic = ref(null);

// Quizzes finished in this session (kept in memory only, nothing is saved).
// The Home and Overall screens use this to show the latest results.
const history = ref([]);

function startQuiz(subject, topic = null) {
  selectedSubject.value = subject;
  focusTopic.value = topic;
  quizKey.value += 1;
  screen.value = 'quiz';
}

function finishQuiz(result) {
  quizResult.value = result;

  // Save a short summary of each topic for the progress screens.
  const analysis = analyseQuiz(result);
  history.value.push({
    level: selectedLevel.value,
    subject: selectedSubject.value,
    topics: analysis.topics.map((t) => ({
      name: t.name,
      percent: t.percent,
      correct: t.correct,
      total: t.total,
      diagnosis: t.diagnosis.label,
    })),
  });

  screen.value = 'results';
}

// "Practice" buttons on the Overall screen.
function practice(subject, topic) {
  // Reuse the sub-subject (e.g. Chinese, or Physics + Chemistry) from an earlier quiz.
  const earlier = [...history.value]
    .reverse()
    .find((h) => h.level === selectedLevel.value && h.subject.id === subject.id);
  if (earlier) {
    startQuiz(earlier.subject, topic);
    return;
  }

  // Subjects that need a sub-subject choice: send the student home to choose it.
  if (getSubjectOptions(subject.id, selectedStream.value)) {
    goTo('home');
    return;
  }

  startQuiz({ ...subject, option: null, displayName: subject.name }, topic);
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
      :history="history"
      @start="startQuiz"
      @view-progress="goTo('overall')"
    />

    <QuizScreen
      v-else-if="screen === 'quiz'"
      :key="quizKey"
      :level="selectedLevel"
      :stream="selectedStream"
      :subject="selectedSubject"
      :focus-topic="focusTopic"
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

    <OverallScreen
      v-else-if="screen === 'overall'"
      :level="selectedLevel"
      :stream="selectedStream"
      :history="history"
      @practice="practice"
      @home="goTo('home')"
    />
  </section>
</template>

<style scoped>
.page {
  font-family: var(--font-body);
  color: var(--color-text);
}
</style>
