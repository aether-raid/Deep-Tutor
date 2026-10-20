// Flashcard decks for the Flashcards page (mock study content, no real student data).
// Lives at: src/features/flashcards/data/cards.js
//
// This file just collects every deck in one place. The cards themselves live in data/decks/:
//   decks/ib-cs-a1.js       IB Computer Science HL — A1 Computer fundamentals
//   decks/ib-physics-a.js   IB Physics SL/HL — Theme A Space, time and motion
//   decks/ib-math-aa-1.js   IB Mathematics AA SL/HL — Topic 1 Number and algebra
//   decks/a-physics-1.js … a-physics-4.js   A Level H2 Physics — Section I Foundations of Physics
//   decks/a-h2-math-1-2.js  A Level H2 Mathematics — 1 Functions and graphs, 2 Sequences and series
//
// Each deck is linked to a syllabus sub-topic in data/syllabus.js through its key
// (for example deck: 'ib-cs-a1-1'). A sub-topic with a deck shows GREEN (ready);
// a sub-topic without one shows GREY (locked).
//
// To add a new deck: create a file in data/decks/, import it below and add it to "decks".

import { csA1Decks } from './decks/ib-cs-a1.js';
import { physicsADecks } from './decks/ib-physics-a.js';
import { mathAA1Decks } from './decks/ib-math-aa-1.js';
import { aPhysics1Decks } from './decks/a-physics-1.js';
import { aPhysics2Decks } from './decks/a-physics-2.js';
import { aPhysics3Decks } from './decks/a-physics-3.js';
import { aPhysics4Decks } from './decks/a-physics-4.js';
import { h2MathDecks } from './decks/a-h2-math-1-2.js';

// Seconds allowed per card, by difficulty.
export const TIME_LIMITS = {
  easy: 20,
  medium: 40,
  hard: 60,
};

export const decks = {
  ...csA1Decks,
  ...physicsADecks,
  ...mathAA1Decks,
  ...h2MathDecks,
  ...aPhysics1Decks,
  ...aPhysics2Decks,
  ...aPhysics3Decks,
  ...aPhysics4Decks,
};
