// Saves chats and "last used" dates in the browser (localStorage),
// so they are still there after leaving and coming back to the Chatbot page.
// The data stays only in this browser on this computer.
//
// Every read/write is wrapped in try/catch: some browsers (e.g. private mode)
// block localStorage, and then we simply carry on without saving.

// All our keys start with this, so they don't clash with other features.
const PREFIX = 'chatbot:';

// ----- Chats -----

// Get the saved messages for one subject (an empty list if there are none).
export function loadChat(subjectId) {
  try {
    const saved = localStorage.getItem(PREFIX + 'chat:' + subjectId);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

// Save the messages for one subject.
export function saveChat(subjectId, messages) {
  try {
    localStorage.setItem(PREFIX + 'chat:' + subjectId, JSON.stringify(messages));
  } catch {
    // Saving failed - the chat still works, it just won't be remembered.
  }
}

// ----- Last used dates -----

// Get the saved "last used" date for one subject (null if never used).
export function loadLastUsed(subjectId) {
  try {
    return localStorage.getItem(PREFIX + 'lastUsed:' + subjectId);
  } catch {
    return null;
  }
}

// Save the "last used" date for one subject.
export function saveLastUsed(subjectId, dateText) {
  try {
    localStorage.setItem(PREFIX + 'lastUsed:' + subjectId, dateText);
  } catch {
    // Saving failed - ignore it.
  }
}

// Today's date as text in the same style as the mock data, e.g. "19/10/2026".
export function todayAsText() {
  return new Date().toLocaleDateString('en-GB');
}
