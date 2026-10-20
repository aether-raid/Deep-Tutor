// Flashcard decks for the Flashcards page (mock study content, no real student data).
// Lives at: src/features/flashcards/data/cards.js
//
// This file just collects every deck in one place. The cards themselves live in data/decks/:
//   decks/ib-cs-a1.js       IB Computer Science HL — A1 Computer fundamentals
//   decks/ib-physics-a.js   IB Physics SL/HL — Theme A Space, time and motion
//   decks/ib-math-aa-1.js   IB Mathematics AA SL/HL — Topic 1 Number and algebra
//   decks/a-h2-physics.js   A Level H2 Physics — Section I Foundations of Physics (Topics 1–4)
//   decks/a-h2-math-1-2.js  A Level H2 Mathematics — 1 Functions and graphs, 2 Sequences and series
//   decks/a-h2-computing-1.js  A Level H2 Computing — Module 1 Programming Fundamentals
//   decks/o-level-math.js   O Level Mathematics 4052 — N1–N9, G1–G7, S1–S2
//   decks/o-level-amath.js  O Level Additional Mathematics 4049 — A1–A6, G1–G3, C1
//   decks/o-level-computing.js  O Level Computing 7155 — M1–M5 (all 18 sub-topics)
//   decks/o-level-physics.js  O Level Physics 6091 — topics 1–20 (all 61 sub-topics)
//
// Each deck is linked to a syllabus sub-topic in data/syllabus.js through its key
// (for example deck: 'ib-cs-a1-1'). A sub-topic with a deck shows GREEN (ready);
// a sub-topic without one shows GREY (locked).
//
// To add a new deck: create a file in data/decks/, import it below and add it to "decks".

import { csA1Decks } from './decks/ib-cs-a1.js';
import { physicsADecks } from './decks/ib-physics-a.js';
import { mathAA1Decks } from './decks/ib-math-aa-1.js';
import { h2PhysicsDecks } from './decks/a-h2-physics.js';
import { h2MathDecks } from './decks/a-h2-math-1-2.js';
import { h2ComputingDecks } from './decks/a-h2-computing-1.js';
import { oLevelMathDecks } from './decks/o-level-math.js';
import { oLevelAMathDecks } from './decks/o-level-amath.js';
import { oLevelComputingDecks } from './decks/o-level-computing.js';
import { oLevelPhysicsDecks } from './decks/o-level-physics.js';

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
  ...h2PhysicsDecks,
  ...h2ComputingDecks,
  ...oLevelMathDecks,
  ...oLevelAMathDecks,
  ...oLevelComputingDecks,
  ...oLevelPhysicsDecks,
};
