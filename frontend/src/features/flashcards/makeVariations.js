// Asks the AI to write a "variation" of each wrong card:
// same concept, different numbers, with the AI working out the new answer.
import { askLLM } from '../../shared/llm.js';

const SYSTEM_PROMPT =
  'You write practice flashcards for school students. Reply with JSON only, no extra text.';

// Takes an array of cards and returns an array of the SAME length.
// Each item is either { question, answer } or null (if the AI could not make one).
export async function makeVariations(wrongCards) {
  const empty = wrongCards.map(() => null);
  if (wrongCards.length === 0) return empty;

  // Only send the question and answer of each card to the AI.
  const simpleCards = wrongCards.map((card) => ({
    question: card.question,
    answer: card.answer,
  }));

  const prompt =
    'For each flashcard below, write ONE new flashcard that tests the same concept ' +
    'but changes the numbers or details. Work out the correct answer yourself and ' +
    'double-check it. Keep answers short. Reply with only a JSON array in the same order, ' +
    'where each item looks like {"question": "...", "answer": "..."}.\n\n' +
    JSON.stringify(simpleCards);

  const reply = await askLLM([{ role: 'user', content: prompt }], SYSTEM_PROMPT);

  try {
    // Cut out just the [ ... ] part in case the AI added any extra words.
    const start = reply.indexOf('[');
    const end = reply.lastIndexOf(']');
    const list = JSON.parse(reply.slice(start, end + 1));

    // Keep only items that really have a question and an answer.
    return wrongCards.map((_, i) => {
      const item = list[i];
      const isValid = item && typeof item.question === 'string' && typeof item.answer === 'string';
      return isValid ? { question: item.question, answer: item.answer } : null;
    });
  } catch (error) {
    // The reply was not valid JSON (or was an error message), so skip variations.
    return empty;
  }
}
