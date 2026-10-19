<!--
  Flashcards page.
  Flow: start timer -> flip card -> mark correct / wrong -> back / next -> results
        -> "Focus on wrong" repeats wrong cards plus AI-made variations.
-->
<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { cards, TIME_LIMITS } from './data/cards.js';
import { makeVariations } from './makeVariations.js';
import StatsBar from './components/StatsBar.vue';
import FlipCard from './components/FlipCard.vue';
import ProgressRing from './components/ProgressRing.vue';
import ResultsScreen from './components/ResultsScreen.vue';

// ---------- State ----------

// Turn plain cards into "deck" cards that also remember their own progress.
function buildDeck(cardList) {
  return cardList.map((card) => ({
    ...card,
    timeLimit: TIME_LIMITS[card.difficulty],
    timeLeft: TIME_LIMITS[card.difficulty],
    started: false, // has the timer been started?
    revealed: false, // has the answer been shown at least once?
    result: null, // null, 'correct' or 'wrong'
  }));
}

const deck = ref(buildDeck(cards)); // cards in the current round
const index = ref(0); // which card we are looking at
const isFlipped = ref(false);
const showResults = ref(false);
const round = ref(1); // 1 = first go, 2+ = "focus on wrong" rounds
const isLoadingReview = ref(false);
const message = ref(''); // small note under the card, e.g. "Time's up!"
const reviewNote = ref(''); // note shown at the top of a review round

// ---------- Numbers for the top bar and rings ----------

const currentCard = computed(() => deck.value[index.value]);
const total = computed(() => deck.value.length); // total number of cards
const correctCount = computed(() => deck.value.filter((c) => c.result === 'correct').length);
const wrongCount = computed(() => deck.value.filter((c) => c.result === 'wrong').length);

// Percentage correct = correct / total
const percentCorrect = computed(() => (correctCount.value / total.value) * 100);
// Progress done = (correct + wrong) / total
const percentDone = computed(() => ((correctCount.value + wrongCount.value) / total.value) * 100);

const allDone = computed(() => correctCount.value + wrongCount.value === total.value);
const isLastCard = computed(() => index.value === total.value - 1);

// Text under the card: a fresh message (e.g. "Time's up!") or how this card was marked.
const statusText = computed(() => {
  if (message.value) return message.value;
  if (currentCard.value.result === 'correct') return '✓ Marked as correct';
  if (currentCard.value.result === 'wrong') return '✗ Marked as wrong';
  return '';
});

// ---------- Timer ----------

let timerId = null;

// Runs once every second.
function tick() {
  const card = currentCard.value;
  if (showResults.value || !card) return;

  // Only count down if the timer is started and the answer has not been seen yet.
  if (!card.started || card.revealed || card.result) return;

  card.timeLeft -= 1;

  if (card.timeLeft <= 0) {
    // Time ran out before flipping: automatically wrong.
    card.timeLeft = 0;
    card.result = 'wrong';
    card.revealed = true;
    isFlipped.value = true;
    message.value = "⏰ Time's up! This card was marked as wrong.";
  }
}

onMounted(() => {
  timerId = setInterval(tick, 1000);
});

onUnmounted(() => {
  clearInterval(timerId);
});

function startTimer() {
  currentCard.value.started = true;
}

// ---------- Card actions ----------

function flipCard() {
  isFlipped.value = !isFlipped.value;
  // Once the answer is seen, the timer stops for this card.
  if (isFlipped.value) currentCard.value.revealed = true;
}

function markAnswer(result) {
  if (currentCard.value.result) return; // each card can only be marked once
  currentCard.value.result = result;
}

function goBack() {
  if (index.value > 0) index.value -= 1;
}

function goNext() {
  if (allDone.value) {
    showResults.value = true;
  } else if (!isLastCard.value) {
    index.value += 1;
  }
}

// Whenever we move to another card, show its answer side only if it was already revealed.
watch(index, () => {
  isFlipped.value = currentCard.value.revealed;
  message.value = '';
});

// ---------- Results actions ----------

function startRound(cardList, roundNumber) {
  deck.value = buildDeck(cardList);
  round.value = roundNumber;
  index.value = 0;
  isFlipped.value = false;
  message.value = '';
  showResults.value = false;
}

// "Reset?" - start again with the full original deck.
function resetAll() {
  startRound(cards, 1);
  reviewNote.value = '';
}

// "Focus on wrong?" - repeat the wrong cards, plus an AI variation of each one.
async function focusOnWrong() {
  const wrongCards = deck.value.filter((c) => c.result === 'wrong');
  const nextRound = round.value + 1;

  isLoadingReview.value = true;
  const variations = await makeVariations(wrongCards);
  isLoadingReview.value = false;

  const reviewCards = [];
  wrongCards.forEach((card, i) => {
    // The original card again
    reviewCards.push({
      id: card.id,
      question: card.question,
      answer: card.answer,
      difficulty: card.difficulty,
      isVariation: card.isVariation,
    });
    // Its AI variation (if the AI managed to make one)
    if (variations[i]) {
      reviewCards.push({
        id: `${card.id}-r${nextRound}`,
        question: variations[i].question,
        answer: variations[i].answer,
        difficulty: card.difficulty,
        isVariation: true,
      });
    }
  });

  startRound(reviewCards, nextRound);

  reviewNote.value = variations.some(Boolean)
    ? 'Your wrong cards are back, plus ✨ AI variations that test the same idea with new numbers.'
    : 'AI variations are unavailable right now, so you are reviewing your wrong cards only.';
}
</script>

<template>
  <section class="page">
    <header class="page-header">
      <h1 class="title">Flashcards</h1>
      <span v-if="round > 1" class="round-badge">🎯 Review round {{ round - 1 }}</span>
    </header>

    <!-- ===== Studying screen ===== -->
    <template v-if="!showResults">
      <StatsBar
        :correct="correctCount"
        :wrong="wrongCount"
        :percent-correct="percentCorrect"
        :time-left="currentCard.timeLeft"
        :time-limit="currentCard.timeLimit"
      />

      <p v-if="round > 1 && reviewNote" class="review-note">{{ reviewNote }}</p>

      <p class="counter">Card {{ index + 1 }} of {{ total }}</p>

      <!-- :key makes a fresh card for each question, so it doesn't spin while changing cards -->
      <FlipCard
        :key="`${round}-${index}`"
        :card="currentCard"
        :flipped="isFlipped"
        :locked="!currentCard.started && !currentCard.result"
        @flip="flipCard"
        @start="startTimer"
      />

      <!-- Correct / Wrong buttons: only after the answer is shown and before it is marked -->
      <div class="answer-row">
        <template v-if="isFlipped && !currentCard.result">
          <button class="answer-btn correct" type="button" @click="markAnswer('correct')">
            ✓ Correct
          </button>
          <button class="answer-btn wrong" type="button" @click="markAnswer('wrong')">
            ✗ Wrong
          </button>
        </template>
        <p v-else-if="statusText" class="message">{{ statusText }}</p>
      </div>

      <!-- Bottom bar: Back, progress ring, Next -->
      <nav class="bottom-bar">
        <button class="arrow" type="button" :disabled="index === 0" @click="goBack">
          <span aria-hidden="true">←</span> Back
        </button>

        <div class="progress">
          <ProgressRing :percent="percentDone" label="Progress" :size="72" />
          <span class="progress-label">Progress</span>
        </div>

        <button
          class="arrow"
          type="button"
          :disabled="isLastCard && !allDone"
          @click="goNext"
        >
          {{ allDone ? 'Finish' : 'Next' }} <span aria-hidden="true">→</span>
        </button>
      </nav>
    </template>

    <!-- ===== Final page ===== -->
    <ResultsScreen
      v-else
      :correct="correctCount"
      :wrong="wrongCount"
      :total="total"
      :loading="isLoadingReview"
      @reset="resetAll"
      @focus="focusOnWrong"
    />
  </section>
</template>

<style scoped>
.page {
  font-family: var(--font-body);
  color: var(--color-text);
  max-width: 880px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.page-header {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.title {
  font-family: var(--font-heading);
  font-size: 1.5rem;
}

.round-badge {
  font-size: 0.85rem;
  font-weight: 600;
  padding: var(--space-1) var(--space-3);
  border-radius: 999px;
  background: var(--color-primary);
  color: var(--color-bg);
}

.review-note {
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius);
  background: var(--color-primary-soft);
  border: 1px solid var(--color-border);
  color: var(--color-muted);
  font-size: 0.9rem;
}

.counter {
  text-align: center;
  color: var(--color-muted);
  font-size: 0.9rem;
  margin-top: var(--space-2);
}

/* ----- Correct / Wrong buttons ----- */
.answer-row {
  display: flex;
  justify-content: center;
  gap: var(--space-4);
  min-height: 52px; /* keeps the layout from jumping when buttons appear */
  margin-top: var(--space-3);
}

.answer-btn {
  font: inherit;
  font-weight: 700;
  min-width: 150px;
  padding: var(--space-3) var(--space-5);
  border-radius: 999px;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  animation: rise 0.35s ease;
}

.answer-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 18px color-mix(in srgb, var(--color-primary) 20%, transparent);
}

/* Correct = solid dark, Wrong = outlined (theme greys only) */
.answer-btn.correct {
  background: var(--color-primary);
  color: var(--color-bg);
  border: 2px solid var(--color-primary);
}

.answer-btn.wrong {
  background: var(--color-surface);
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
}

.message {
  align-self: center;
  color: var(--color-muted);
  font-weight: 600;
  text-align: center;
}

/* ----- Bottom bar ----- */
.bottom-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
}

.arrow {
  font: inherit;
  font-weight: 600;
  padding: var(--space-3) var(--space-5);
  border-radius: 999px;
  border: 1px solid var(--color-border);
  background: var(--color-primary-soft);
  color: var(--color-text);
  cursor: pointer;
  transition: background 0.15s ease, transform 0.15s ease;
}

.arrow:hover:not(:disabled) {
  background: var(--color-border);
  transform: scale(1.04);
}

.arrow:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.progress {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
}

.progress-label {
  font-size: 0.8rem;
  color: var(--color-muted);
}

@keyframes rise {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
