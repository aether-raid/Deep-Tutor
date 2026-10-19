<template>
  <section class="page">
    <!-- Screen 1: no subject picked yet, so show the menu -->
    <template v-if="!selectedSubject">
      <h1 class="title">Chatbot</h1>
      <SubjectMenu :subjects="subjectList" @select="chooseSubject" />
    </template>

    <!-- Screen 2: a subject is picked, so show its chat -->
    <ChatScreen
      v-else
      :subject="selectedSubject"
      @back="goBack"
      @used="markAsUsed"
    />
  </section>
</template>

<script setup>
import { ref } from 'vue';
import SubjectMenu from './components/SubjectMenu.vue';
import ChatScreen from './components/ChatScreen.vue';
import { subjects } from './data/subjects.js';
import { loadLastUsed, saveLastUsed, todayAsText } from './chatStorage.js';

// The subjects to show in the menu.
// We start from the mock data, but use the saved "last used" date if there is one.
const subjectList = ref(
  subjects.map((subject) => ({
    ...subject,
    lastUsed: loadLastUsed(subject.id) || subject.lastUsed,
  }))
);

// The subject the student picked (null means no subject picked yet).
const selectedSubject = ref(null);

// Called when the student sends a message: set this subject's date to today.
function markAsUsed() {
  const today = todayAsText();
  selectedSubject.value.lastUsed = today; // updates the menu straight away
  saveLastUsed(selectedSubject.value.id, today); // remembers it for next time
}

// Open the chat screen for the clicked subject.
function chooseSubject(subject) {
  selectedSubject.value = subject;
}

// Go back to the subject menu.
function goBack() {
  selectedSubject.value = null;
}
</script>

<style scoped>
.page {
  font-family: var(--font-body);
  color: var(--color-text);
}

.title {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  margin-bottom: var(--space-4);
}
</style>
