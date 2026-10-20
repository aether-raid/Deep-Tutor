// Small helpers shared by the deck files.
// Lives at: src/features/flashcards/data/decks/helpers.js

// Adds the sub-topic name to every card so the page can show it as a label.
export function deck(topic, list) {
  return list.map(card => ({ topic, ...card }));
}

// Picks one item from a list using the random helper the page passes in.
export function pick(rand, list) {
  return list[rand(0, list.length - 1)];
}

// 6220800 → "6,220,800"
export function withCommas(n) {
  return n.toLocaleString('en-US');
}

// Rounds to 3 significant figures, the usual precision for IB answers.
// 1234.5 → 1230, 0.012345 → 0.0123
export function sig3(x) {
  return Number(Number(x).toPrecision(3));
}

// Formats a number to 3 significant figures for display, using scientific notation
// for very large or very small values: 2.998e8 → "3.00 × 10⁸". Negatives use a proper minus sign (−).
export function fmt(x) {
  const n = Number(x);
  if (n === 0) return '0';
  const abs = Math.abs(n);
  let text;
  if (abs >= 1e5 || abs < 1e-3) {
    const [mantissa, exponent] = n.toExponential(2).split('e');
    const superscripts = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
    const power = String(Number(exponent)).split('').map(ch => superscripts[ch]).join('');
    text = `${mantissa} × 10${power}`;
  } else {
    text = String(sig3(n));
  }
  return text.replace(/^-/, '−');
}

// Builds a NUMBER card. The original card and every "Focus on wrong" variation come from the
// same build() function, so the printed answer can never disagree with the question.
// "extra" holds optional fields such as seconds (a longer timer for a long question).
export function numberCard(id, difficulty, ref, build, defaults, makeValues, extra = {}) {
  return { id, difficulty, ref, ...extra, ...build(defaults), vary: { make: rand => build(makeValues(rand)) } };
}

// "a" or "an" before a number when read aloud: an 8 kg mass, an 18 N force, a 12 m drop.
export function aOrAn(n) {
  const whole = String(n).split('.')[0];
  return whole.startsWith('8') || whole === '11' || whole === '18' ? 'an' : 'a';
}