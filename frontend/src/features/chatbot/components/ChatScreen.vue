<template>
  <!-- Screen 2: the chat for one subject -->
  <div class="chat-screen">
    <!-- Top bar: back arrow + subject name -->
    <header class="chat-header">
      <button class="back-button" @click="emit('back')" aria-label="Back to subjects">
        ←
      </button>
      <h2 class="chat-title">{{ subject.name }}</h2>
      <!-- Only show "Clear chat" when there is something to clear.
           It is turned off while the AI is answering. -->
      <button
        v-if="messages.length > 0"
        class="clear-button"
        :disabled="isThinking"
        @click="clearChat"
      >
        Clear chat
      </button>
    </header>

    <!-- Middle: one bubble per message.
         Student messages go on the right, tutor messages on the left. -->
    <!-- Only this middle part scrolls, so the top bar and text box always stay visible -->
    <div ref="messagesBox" class="messages">
      <!-- Shown when the chat is empty -->
      <p v-if="messages.length === 0 && !isThinking" class="empty-message">
        Ask me anything about {{ subject.name }} to get started!
      </p>

      <div
        v-for="(message, index) in messages"
        :key="index"
        class="message-row"
        :class="message.role === 'user' ? 'from-user' : 'from-tutor'"
      >
        <span class="avatar">{{ message.role === 'user' ? '👤' : '🧠' }}</span>
        <p class="bubble">{{ message.content }}</p>
      </div>

      <!-- Shown while we wait for the AI to answer -->
      <div v-if="isThinking" class="message-row from-tutor">
        <span class="avatar">🧠</span>
        <p class="bubble thinking">Thinking…</p>
      </div>
    </div>

    <!-- Bottom: text box + send arrow.
         Enter sends, Shift+Enter makes a new line. -->
    <form class="input-bar" @submit.prevent="sendMessage">
      <textarea
        ref="textBox"
        v-model="draft"
        class="text-input"
        rows="1"
        placeholder="your text here"
        @input="growTextBox"
        @keydown.enter.exact.prevent="sendMessage"
      ></textarea>
      <button
        class="send-button"
        type="submit"
        aria-label="Send"
        :disabled="isThinking"
      >
        →
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue';
import { askLLM } from '../../../shared/llm.js';
import { loadChat, saveChat } from '../chatStorage.js';

// The chosen subject comes from the parent page.
const props = defineProps({
  subject: { type: Object, required: true },
});

// 'back' tells the parent page to go back to the subject menu.
// 'used' tells the parent page a message was sent (to update "last used").
const emit = defineEmits(['back', 'used']);

// What the student is currently typing in the text box.
const draft = ref('');

// A link to the <textarea> so we can change its height.
const textBox = ref(null);

// A link to the scrolling message area.
const messagesBox = ref(null);

// True while we are waiting for the AI to answer.
const isThinking = ref(false);

// All messages in this chat. Each one looks like:
//   { role: 'user', content: 'What is an atom?' }      <- the student
//   { role: 'assistant', content: 'An atom is ...' }   <- the tutor
// These are the role names the AI expects, so we can send the list as it is.
// We start with the chat saved last time for this subject (if any).
const messages = ref(loadChat(props.subject.id));

// When the chat opens, jump to the newest message.
onMounted(scrollToBottom);

// Instructions for the AI, so it acts like a tutor for this subject.
function tutorPrompt() {
  return (
    `You are a friendly ${props.subject.name} tutor for secondary school students. ` +
    `Explain things simply and step by step. Keep answers short unless asked for detail. ` +
    `If the question is not about ${props.subject.name}, gently guide the student back to the subject.`
  );
}

// Make the text box taller as the student types more lines.
function growTextBox() {
  const box = textBox.value;
  if (!box) return;
  box.style.height = 'auto'; // shrink first, so it can also get smaller
  box.style.height = box.scrollHeight + 'px';
}

// Scroll the message area down so the newest message is visible.
// We wait for nextTick() so Vue has drawn the new message first.
async function scrollToBottom() {
  await nextTick();
  const box = messagesBox.value;
  if (!box) return;
  box.scrollTo({ top: box.scrollHeight, behavior: 'smooth' });
}

// Ask the student to confirm, then remove every message.
function clearChat() {
  const sure = window.confirm('Are you sure you want to clear this chat? This cannot be undone.');
  if (sure) {
    messages.value = [];
    saveChat(props.subject.id, []); // also forget the saved copy
  }
}

async function sendMessage() {
  const text = draft.value.trim();

  // Don't send empty messages, or a new one while the AI is still answering.
  if (!text || isThinking.value) return;

  // 1. Add the student's question.
  messages.value.push({ role: 'user', content: text });
  emit('used'); // update the "last used" date

  // 2. Empty the text box and shrink it back to one line.
  draft.value = '';
  await nextTick();
  growTextBox();

  // 3. Ask the AI. We send the WHOLE chat so it remembers earlier
  //    questions - that is what makes follow-up questions work.
  isThinking.value = true;
  scrollToBottom(); // show the question and "Thinking…"
  const reply = await askLLM(messages.value, tutorPrompt());
  isThinking.value = false;

  // 4. Add the tutor's answer.
  messages.value.push({ role: 'assistant', content: reply });
  scrollToBottom();

  // 5. Save the chat so it is still here after leaving the page.
  //    (We save after the answer, so a saved chat never ends half-way.)
  saveChat(props.subject.id, messages.value);
}
</script>

<style scoped>
/* Stack header, messages and input bar on top of each other.
   The chat fills the screen height (minus the page padding above and below),
   so the page itself never needs to scroll. */
.chat-screen {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 2 * var(--space-6));
  min-width: 0; /* stops long content from making the page wider */
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding-bottom: var(--space-3);
  border-bottom: 1px solid var(--color-border);
}

/* Back arrow sits on the left, title stays centred */
.back-button {
  position: absolute;
  left: 0;
  border: none;
  background: none;
  color: var(--color-text);
  font-size: 1.5rem;
  cursor: pointer;
}

.chat-title {
  font-family: var(--font-heading);
  font-size: 1.1rem;
  margin: 0;
}

/* "Clear chat" sits on the right of the top bar */
.clear-button {
  position: absolute;
  right: 0;
  padding: var(--space-1) var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-surface);
  color: var(--color-muted);
  font-family: var(--font-body);
  font-size: 0.875rem;
  cursor: pointer;
}

.clear-button:hover {
  color: var(--color-text);
  border-color: var(--color-primary);
}

.clear-button:disabled {
  cursor: wait;
  opacity: 0.6;
}

.empty-message {
  margin: auto;
  color: var(--color-muted);
  text-align: center;
}

/* The message area takes the leftover space and scrolls on its own */
.messages {
  flex: 1;
  min-height: 0; /* needed so a flex child is allowed to scroll */
  overflow-y: auto;
  padding: var(--space-4) var(--space-1);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

/* One row = avatar + bubble */
.message-row {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
}

/* Student messages: put them on the right, avatar after the bubble */
.from-user {
  flex-direction: row-reverse;
}

.avatar {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--color-primary-soft);
  font-size: 1.25rem;
}

.bubble {
  max-width: 70%;
  min-width: 0;
  margin: 0;
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: calc(var(--radius) * 3);
  background: var(--color-surface);
  line-height: 1.5;
  white-space: pre-wrap; /* keep line breaks from the answer */
  overflow-wrap: anywhere; /* break very long words onto the next line */
}

.thinking {
  color: var(--color-muted);
  font-style: italic;
}

.input-bar {
  display: flex;
  gap: var(--space-3);
  align-items: flex-end;
}

/* The text box wraps long text onto new lines and grows taller */
.text-input {
  flex: 1;
  min-width: 0;
  max-height: 150px; /* after this it scrolls instead of growing */
  padding: var(--space-3) var(--space-5);
  border: 1px solid var(--color-border);
  border-radius: calc(var(--radius) * 4);
  background: var(--color-surface);
  color: var(--color-text);
  font-family: var(--font-body);
  font-size: 1rem;
  line-height: 1.5;
  resize: none;
  overflow-wrap: anywhere;
}

.send-button {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  border: 1px solid var(--color-border);
  border-radius: 50%;
  background: var(--color-surface);
  color: var(--color-text);
  font-size: 1.25rem;
  cursor: pointer;
}

.send-button:disabled {
  color: var(--color-muted);
  cursor: wait;
}

.send-button:hover,
.back-button:hover {
  color: var(--color-muted);
}
</style>
