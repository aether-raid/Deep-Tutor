// Small helpers shared by the A Level H2 Physics deck files (a-physics-1.js … a-physics-4.js).
// Lives at: src/features/flashcards/data/decks/a-physics-tools.js

// Acceleration of free fall, as given in the 9478 "Data and Formulae" list.
export const G = 9.81;

// Where each fact comes from (shown on the back of the card): the learning outcome in the official syllabus.
export const SYL = outcome => `SEAB H2 Physics 9478 syllabus (2026), LO ${outcome}`;

export const rad = degrees => (degrees * Math.PI) / 180;
export const deg = radians => (radians * 180) / Math.PI;

// Rounds an uncertainty to 1 significant figure: 0.245 → 0.2, 0.0951 → 0.1, 0.0874 → 0.09.
export function sf1(x) {
  return Number(Number(x).toPrecision(1));
}

// How many decimal places a 1 s.f. uncertainty has, so the value can be rounded to match: 0.2 → 1, 0.09 → 2.
export function toDecimals(uncertainty) {
  return Math.max(0, -Math.floor(Math.log10(uncertainty)));
}

// Intermediate values in the working, to 4 significant figures, so each step multiplies out.
export const f4 = x => String(Number(Number(x).toPrecision(4))).replace(/^-/, '−');
