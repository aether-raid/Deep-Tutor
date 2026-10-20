// O Level Additional Mathematics 4049 (Singapore-Cambridge GCE O Level, 2026) — all A-Math decks.
// Lives at: src/features/flashcards/data/decks/o-level-amath.js
//
//   Algebra:                    A1 – A6
//   Geometry and Trigonometry:  G1 – G3
//   Calculus:                   C1
//
// Most numerical cards have a "vary" recipe: make(rand) returns a new { question, answer, working }
// with different numbers, and the answer is worked out in code, so it is always right.
// Exact answers (fractions, surds, π) use the helpers in math-tools.js.

import { deck, pick } from './helpers.js';
import { gcd, nCr, num, sup, sf3, frac, fracText, surd, surdText, sinExact, cosExact, piText, polyText, coefTimes } from './math-tools.js';

// ---------- Small helpers ----------

// [[2, 'x²'], [-5, 'x'], [3, '']] → "2x² − 5x + 3"
const poly = terms => polyText(terms.map(([c, v]) => ({ c, v })));

// lin(2, -3) → "(2x − 3)"
const lin = (a, b, v = 'x') => `(${poly([[a, v], [b, '']])})`;

// A random whole number from 1 to max, made negative half the time.
function nonZero(rand, max) {
  const n = rand(1, max);
  return rand(0, 1) ? n : -n;
}

// " + 5" or " − 5" (for joining a number onto an expression)
function plusMinus(n) {
  return n < 0 ? ` − ${-n}` : ` + ${n}`;
}

// (3, -2) → "(3, −2)"
function point(x, y) {
  return `(${num(x)}, ${num(y)})`;
}

// 1 decimal place with a proper minus sign
function dp1(x) {
  return x.toFixed(1).replace(/^-/, '−');
}

// (p + q√s)/r in simplest form: (6, 2, 5, 4) → "(3 + √5)/2",  (5, 1, 2, 1) → "5 + √2"
function surdFraction(p, q, s, r) {
  if (r < 0) [p, q, r] = [-p, -q, -r];
  const g = gcd(gcd(p, q), r);
  [p, q, r] = [p / g, q / g, r / g];
  const top = poly([[p, ''], [q, `√${s}`]]);
  if (r === 1) return top;
  return p === 0 ? `${top}/${r}` : `(${top})/${r}`;
}

// Writes the solution of a quadratic inequality whose roots are p < q.
// "outside" = x < p or x > q;  "inside" = p < x < q.
function quadraticSolution(p, q, sign) {
  if (sign === '>') return `x < ${num(p)} or x > ${num(q)}`;
  if (sign === '≥') return `x ≤ ${num(p)} or x ≥ ${num(q)}`;
  if (sign === '<') return `${num(p)} < x < ${num(q)}`;
  return `${num(p)} ≤ x ≤ ${num(q)}`;
}

const FLIP = { '<': '>', '>': '<', '≤': '≥', '≥': '≤' };
const ROOT_FREE = [2, 3, 5, 6, 7, 10, 11]; // numbers with no square factor, for surds

// Two different whole numbers from -max..max (not 0), smaller first.
function twoRoots(rand, max) {
  const p = nonZero(rand, max);
  let q;
  do { q = nonZero(rand, max); } while (q === p);
  return p < q ? [p, q] : [q, p];
}

// ---------- A1 Quadratic functions ----------

const aMathA1 = deck('A1 Quadratic functions', [
  {
    id: 'am-a1-01', difficulty: 'medium',
    question: 'State whether y = 2x² − 12x + 5 has a maximum or a minimum value, and find it and the value of x where it occurs.',
    answer: 'Minimum value −13 when x = 3',
    working: 'Complete the square: y = 2(x − 3)² − 13. A squared term is never negative, so the minimum is −13 at x = 3',
    vary: {
      make: rand => {
        const a = pick(rand, [1, 2, 3, -1, -2]);
        const h = nonZero(rand, 5);
        const k = nonZero(rand, 12);
        const lead = a === 1 ? '' : a === -1 ? '−' : num(a);
        const kind = a > 0 ? 'minimum' : 'maximum';
        return {
          question: `State whether y = ${poly([[a, 'x²'], [-2 * a * h, 'x'], [a * h * h + k, '']])} has a maximum or a minimum value, and find it and the value of x where it occurs.`,
          answer: `${a > 0 ? 'Minimum' : 'Maximum'} value ${num(k)} when x = ${num(h)}`,
          working: `Complete the square: y = ${lead}${lin(1, -h)}²${plusMinus(k)}. ${a > 0 ? 'A squared term is never negative' : 'Minus a squared term is never positive'}, so the ${kind} is ${num(k)} at x = ${num(h)}`,
        };
      },
    },
  },
  {
    id: 'am-a1-02', difficulty: 'medium',
    question: 'Express x² + 6x + 2 in the form (x + a)² + b.',
    answer: '(x + 3)² − 7',
    working: 'Half of 6 is 3: (x + 3)² = x² + 6x + 9, so x² + 6x + 2 = (x + 3)² − 7',
    vary: {
      make: rand => {
        const h = nonZero(rand, 6);
        const k = nonZero(rand, 12);
        const c = h * h + k;
        return {
          question: `Express ${poly([[1, 'x²'], [2 * h, 'x'], [c, '']])} in the form (x + a)² + b.`,
          answer: `${lin(1, h)}²${plusMinus(k)}`,
          working: `Half of ${num(2 * h)} is ${num(h)}: ${lin(1, h)}² = ${poly([[1, 'x²'], [2 * h, 'x'], [h * h, '']])}, so ${poly([[1, 'x²'], [2 * h, 'x'], [c, '']])} = ${lin(1, h)}²${plusMinus(k)}`,
        };
      },
    },
  },
  {
    id: 'am-a1-03', difficulty: 'easy',
    question: 'What does the discriminant b² − 4ac tell you about the roots of ax² + bx + c = 0?',
    answer: 'b² − 4ac > 0: two real, distinct roots (the curve cuts the x-axis twice).\nb² − 4ac = 0: two real, equal roots (the curve touches the x-axis).\nb² − 4ac < 0: no real roots (the curve does not meet the x-axis).',
  },
  {
    id: 'am-a1-04', difficulty: 'medium',
    question: 'When is ax² + bx + c always positive for all real x? When is it always negative?',
    answer: 'Always positive: a > 0 and b² − 4ac < 0.\nAlways negative: a < 0 and b² − 4ac < 0.',
  },
  {
    id: 'am-a1-05', difficulty: 'hard',
    question: 'Find the range of values of k for which x² + kx + 9 is always positive.',
    answer: '−6 < k < 6',
    working: 'a = 1 > 0, so we need b² − 4ac < 0: k² − 36 < 0 → (k + 6)(k − 6) < 0 → −6 < k < 6',
    vary: {
      make: rand => {
        const a = pick(rand, [1, 2, 3]);
        const t = rand(1, 3);
        const c = a * t * t;
        const bound = 2 * a * t;
        return {
          question: `Find the range of values of k for which ${poly([[a, 'x²'], [1, 'kx'], [c, '']])} is always positive.`,
          answer: `−${bound} < k < ${bound}`,
          working: `a = ${a} > 0, so we need b² − 4ac < 0: k² − ${4 * a * c} < 0 → (k + ${bound})(k − ${bound}) < 0 → −${bound} < k < ${bound}`,
        };
      },
    },
  },
  {
    id: 'am-a1-06', difficulty: 'hard',
    question: 'The line y = kx − 2 is a tangent to the curve y = x² + 2x + 2. Find the possible values of k.',
    answer: 'k = −2 or k = 6',
    working: 'x² + 2x + 2 = kx − 2 → x² + (2 − k)x + 4 = 0. Tangent → equal roots: (2 − k)² − 16 = 0 → 2 − k = ±4',
    vary: {
      make: rand => {
        const b = nonZero(rand, 5);
        const m = rand(1, 4);
        const d = nonZero(rand, 6);
        const c = d + m * m;
        const [k1, k2] = [b - 2 * m, b + 2 * m];
        return {
          question: `The line y = kx${plusMinus(d)} is a tangent to the curve y = ${poly([[1, 'x²'], [b, 'x'], [c, '']])}. Find the possible values of k.`,
          answer: `k = ${num(k1)} or k = ${num(k2)}`,
          working: `${poly([[1, 'x²'], [b, 'x'], [c, '']])} = kx${plusMinus(d)} → x² + (${num(b)} − k)x + ${m * m} = 0. Tangent → equal roots: (${num(b)} − k)² − ${4 * m * m} = 0 → ${num(b)} − k = ±${2 * m}`,
        };
      },
    },
  },
  {
    id: 'am-a1-07', difficulty: 'hard',
    question: 'Find the range of values of k for which the line y = x + k does not meet the curve y = x² − 3x + 5.',
    answer: 'k < 1',
    working: 'x² − 3x + 5 = x + k → x² − 4x + (5 − k) = 0. No real roots: 16 − 4(5 − k) < 0 → 4k < 4 → k < 1',
    vary: {
      make: rand => {
        const m = nonZero(rand, 3);
        const p = 2 * nonZero(rand, 3); // b − m, even so the boundary is a whole number
        const b = m + p;
        const c = nonZero(rand, 9);
        const bound = c - (p * p) / 4;
        const meets = rand(0, 1) === 1;
        const curve = poly([[1, 'x²'], [b, 'x'], [c, '']]);
        return {
          question: `Find the range of values of k for which the line y = ${poly([[m, 'x']])} + k ${meets ? 'meets' : 'does not meet'} the curve y = ${curve}${meets ? ' at two distinct points' : ''}.`,
          answer: `k ${meets ? '>' : '<'} ${num(bound)}`,
          working: `${curve} = ${poly([[m, 'x']])} + k → x² ${p < 0 ? '−' : '+'} ${Math.abs(p)}x + (${num(c)} − k) = 0. ${meets ? 'Two real roots' : 'No real roots'}: ${p * p} − 4(${num(c)} − k) ${meets ? '>' : '<'} 0 → k ${meets ? '>' : '<'} ${num(bound)}`,
        };
      },
    },
  },
  {
    id: 'am-a1-08', difficulty: 'medium',
    question: 'Use the discriminant to describe the roots of 2x² − 3x + 5 = 0.',
    answer: 'No real roots',
    working: 'b² − 4ac = (−3)² − 4(2)(5) = 9 − 40 = −31 < 0',
    vary: {
      make: rand => {
        const kind = pick(rand, ['two', 'equal', 'none']);
        let a, b, c, D;
        if (kind === 'equal') {
          a = rand(1, 4);
          const r = nonZero(rand, 4);
          [b, c] = [-2 * a * r, a * r * r];
        } else {
          do { [a, b, c] = [rand(1, 5), nonZero(rand, 9), nonZero(rand, 9)]; D = b * b - 4 * a * c; } while (kind === 'two' ? D <= 0 : D >= 0);
        }
        D = b * b - 4 * a * c;
        const answer = D > 0 ? 'Two real, distinct roots' : D === 0 ? 'Two real, equal roots' : 'No real roots';
        return {
          question: `Use the discriminant to describe the roots of ${poly([[a, 'x²'], [b, 'x'], [c, '']])} = 0.`,
          answer,
          working: `b² − 4ac = (${num(b)})² − 4(${a})(${num(c)}) = ${b * b}${plusMinus(-4 * a * c)} = ${num(D)} ${D > 0 ? '> 0' : D === 0 ? '= 0' : '< 0'}`,
        };
      },
    },
  },
  {
    id: 'am-a1-09', difficulty: 'medium',
    question: 'The equation kx² − 6x + 3 = 0 has two equal roots. Find k.',
    answer: 'k = 3',
    working: 'Equal roots: b² − 4ac = 0 → 36 − 12k = 0 → k = 3',
    vary: {
      make: rand => {
        const q = nonZero(rand, 6);
        const divisors = [];
        for (let d = 1; d <= 12; d++) if ((q * q) % d === 0) divisors.push(d);
        const c = pick(rand, divisors);
        const k = (q * q) / c;
        return {
          question: `The equation ${poly([[1, 'kx²'], [2 * q, 'x'], [c, '']])} = 0 has two equal roots. Find k.`,
          answer: `k = ${k}`,
          working: `Equal roots: b² − 4ac = 0 → ${4 * q * q} − ${4 * c}k = 0 → k = ${k}`,
        };
      },
    },
  },
  {
    id: 'am-a1-10', difficulty: 'hard',
    question: 'Show that x² + kx + k − 1 = 0 has real roots for all values of k.',
    answer: 'b² − 4ac = k² − 4(k − 1) = k² − 4k + 4 = (k − 2)², which is never negative. So b² − 4ac ≥ 0 and the roots are always real.',
  },
  {
    id: 'am-a1-11', difficulty: 'medium',
    question: 'For y = −x² + 4x + 5, find the x-intercepts, the y-intercept and the turning point.',
    answer: 'x-intercepts −1 and 5; y-intercept 5; maximum point (2, 9)',
    working: 'y = −(x + 1)(x − 5). The turning point is halfway between the roots: x = 2, y = −4 + 8 + 5 = 9',
    vary: {
      make: rand => {
        const a = pick(rand, [1, -1]);
        let p, q;
        do { [p, q] = twoRoots(rand, 6); } while ((p + q) % 2 !== 0);
        const h = (p + q) / 2;
        const k = a * (h - p) * (h - q);
        return {
          question: `For y = ${poly([[a, 'x²'], [-a * (p + q), 'x'], [a * p * q, '']])}, find the x-intercepts, the y-intercept and the turning point.`,
          answer: `x-intercepts ${num(p)} and ${num(q)}; y-intercept ${num(a * p * q)}; ${a > 0 ? 'minimum' : 'maximum'} point ${point(h, k)}`,
          working: `y = ${a < 0 ? '−' : ''}${lin(1, -p)}${lin(1, -q)}. The turning point is halfway between the roots: x = ${num(h)}, y = ${num(k)}`,
        };
      },
    },
  },
]);

// ---------- A2 Equations and inequalities ----------

const aMathA2 = deck('A2 Equations and inequalities', [
  {
    id: 'am-a2-01', difficulty: 'medium',
    question: 'Solve x² − x − 6 > 0.',
    answer: 'x < −2 or x > 3',
    working: '(x + 2)(x − 3) > 0. The U-shaped curve is above the x-axis outside the roots −2 and 3',
    vary: {
      make: rand => {
        const [p, q] = twoRoots(rand, 7);
        const sign = pick(rand, ['>', '≥', '<', '≤']);
        const outside = sign === '>' || sign === '≥';
        return {
          question: `Solve ${poly([[1, 'x²'], [-(p + q), 'x'], [p * q, '']])} ${sign} 0.`,
          answer: quadraticSolution(p, q, sign),
          working: `${lin(1, -p)}${lin(1, -q)} ${sign} 0. The U-shaped curve is ${outside ? 'above' : 'below'} the x-axis ${outside ? 'outside' : 'between'} the roots ${num(p)} and ${num(q)}`,
        };
      },
    },
  },
  {
    id: 'am-a2-02', difficulty: 'hard',
    question: 'Solve −x² + 2x + 8 ≥ 0.',
    answer: '−2 ≤ x ≤ 4',
    working: 'Multiply by −1 and reverse the sign: x² − 2x − 8 ≤ 0 → (x + 2)(x − 4) ≤ 0 → −2 ≤ x ≤ 4',
    vary: {
      make: rand => {
        const [p, q] = twoRoots(rand, 7);
        const sign = pick(rand, ['>', '≥', '<', '≤']);
        const flipped = FLIP[sign];
        return {
          question: `Solve ${poly([[-1, 'x²'], [p + q, 'x'], [-p * q, '']])} ${sign} 0.`,
          answer: quadraticSolution(p, q, flipped),
          working: `Multiply by −1 and reverse the sign: ${poly([[1, 'x²'], [-(p + q), 'x'], [p * q, '']])} ${flipped} 0 → ${lin(1, -p)}${lin(1, -q)} ${flipped} 0 → ${quadraticSolution(p, q, flipped)}`,
        };
      },
    },
  },
  {
    id: 'am-a2-03', difficulty: 'medium',
    question: 'Solve x(x − 3) < 10.',
    answer: '−2 < x < 5',
    working: 'x² − 3x − 10 < 0 → (x + 2)(x − 5) < 0 → −2 < x < 5',
    vary: {
      make: rand => {
        let p, q;
        do { [p, q] = twoRoots(rand, 7); } while (p + q === 0);
        const b = -(p + q);
        const c = -p * q;
        const sign = pick(rand, ['>', '<']);
        return {
          question: `Solve x${lin(1, b)} ${sign} ${num(c)}.`,
          answer: quadraticSolution(p, q, sign),
          working: `${poly([[1, 'x²'], [b, 'x'], [-c, '']])} ${sign} 0 → ${lin(1, -p)}${lin(1, -q)} ${sign} 0 → ${quadraticSolution(p, q, sign)}`,
        };
      },
    },
  },
  {
    id: 'am-a2-04', difficulty: 'hard',
    question: 'Solve the simultaneous equations:\ny = x + 1\ny = x² − 2x + 3',
    answer: 'x = 1, y = 2 or x = 2, y = 3',
    working: 'x² − 2x + 3 = x + 1 → x² − 3x + 2 = 0 → (x − 1)(x − 2) = 0',
    vary: {
      make: rand => {
        let x1, x2;
        do { [x1, x2] = [rand(-4, 4), rand(-4, 4)]; } while (x1 >= x2);
        const m = nonZero(rand, 3);
        const d = nonZero(rand, 5);
        const b = m - (x1 + x2);
        const c = d + x1 * x2;
        return {
          question: `Solve the simultaneous equations:\ny = ${poly([[m, 'x'], [d, '']])}\ny = ${poly([[1, 'x²'], [b, 'x'], [c, '']])}`,
          answer: `x = ${num(x1)}, y = ${num(m * x1 + d)} or x = ${num(x2)}, y = ${num(m * x2 + d)}`,
          working: `${poly([[1, 'x²'], [b, 'x'], [c, '']])} = ${poly([[m, 'x'], [d, '']])} → ${poly([[1, 'x²'], [-(x1 + x2), 'x'], [x1 * x2, '']])} = 0 → ${lin(1, -x1)}${lin(1, -x2)} = 0`,
        };
      },
    },
  },
  {
    id: 'am-a2-05', difficulty: 'medium',
    question: 'Solve the simultaneous equations:\nx + y = 7\nxy = 12',
    answer: 'x = 3, y = 4 or x = 4, y = 3',
    working: 'y = 7 − x → x(7 − x) = 12 → x² − 7x + 12 = 0 → (x − 3)(x − 4) = 0',
    vary: {
      make: rand => {
        let t1, t2;
        do { [t1, t2] = twoRoots(rand, 7); } while (t1 + t2 === 0);
        const s = t1 + t2;
        const p = t1 * t2;
        return {
          question: `Solve the simultaneous equations:\nx + y = ${num(s)}\nxy = ${num(p)}`,
          answer: `x = ${num(t1)}, y = ${num(t2)} or x = ${num(t2)}, y = ${num(t1)}`,
          working: `y = ${num(s)} − x → x(${num(s)} − x) = ${num(p)} → ${poly([[1, 'x²'], [-s, 'x'], [p, '']])} = 0 → ${lin(1, -t1)}${lin(1, -t2)} = 0`,
        };
      },
    },
  },
  {
    id: 'am-a2-06', difficulty: 'hard',
    question: 'Find the range of values of k for which x² + 2kx + 6k = 0 has no real roots.',
    answer: '0 < k < 6',
    working: 'b² − 4ac < 0 → 4k² − 24k < 0 → 4k(k − 6) < 0 → 0 < k < 6',
    vary: {
      make: rand => {
        const c = rand(2, 9);
        const real = rand(0, 1) === 1;
        return {
          question: `Find the range of values of k for which ${poly([[1, 'x²'], [2, 'kx'], [c, 'k']])} = 0 has ${real ? 'real roots' : 'no real roots'}.`,
          answer: real ? `k ≤ 0 or k ≥ ${c}` : `0 < k < ${c}`,
          working: `b² − 4ac ${real ? '≥' : '<'} 0 → 4k² − ${4 * c}k ${real ? '≥' : '<'} 0 → 4k(k − ${c}) ${real ? '≥' : '<'} 0 → ${real ? `k ≤ 0 or k ≥ ${c}` : `0 < k < ${c}`}`,
        };
      },
    },
  },
  {
    id: 'am-a2-07', difficulty: 'hard',
    question: 'Solve x⁴ − 13x² + 36 = 0.',
    answer: 'x = ±2 or x = ±3',
    working: 'Let u = x²: u² − 13u + 36 = 0 → (u − 4)(u − 9) = 0 → x² = 4 or x² = 9',
    vary: {
      make: rand => {
        const a = rand(1, 4);
        const b = rand(a + 1, 6);
        const [A, B] = [a * a, b * b];
        return {
          question: `Solve ${poly([[1, 'x⁴'], [-(A + B), 'x²'], [A * B, '']])} = 0.`,
          answer: `x = ±${a} or x = ±${b}`,
          working: `Let u = x²: ${poly([[1, 'u²'], [-(A + B), 'u'], [A * B, '']])} = 0 → (u − ${A})(u − ${B}) = 0 → x² = ${A} or x² = ${B}`,
        };
      },
    },
  },
  {
    id: 'am-a2-08', difficulty: 'easy',
    question: 'How do you solve a quadratic inequality such as (x − a)(x − b) > 0, where a < b?',
    answer: 'Find the roots a and b, then sketch the U-shaped curve.\n"> 0" means above the x-axis: x < a or x > b.\n"< 0" means below the x-axis: a < x < b.',
  },
  {
    id: 'am-a2-09', difficulty: 'easy',
    question: 'How do you solve simultaneous equations where one is linear and one is quadratic?',
    answer: 'Make one unknown the subject of the LINEAR equation, substitute it into the quadratic, solve the resulting quadratic, then substitute back to find the matching values of the other unknown (give the answers in pairs).',
  },
]);

// ---------- A3 Surds ----------

const aMathA3 = deck('A3 Surds', [
  {
    id: 'am-a3-01', difficulty: 'easy',
    question: 'Simplify √72.',
    answer: '6√2',
    working: '√72 = √(36 × 2) = 6√2',
    vary: {
      make: rand => {
        const s = pick(rand, ROOT_FREE);
        const k = rand(2, 9);
        return {
          question: `Simplify √${k * k * s}.`,
          answer: `${k}√${s}`,
          working: `√${k * k * s} = √(${k * k} × ${s}) = ${k}√${s}`,
        };
      },
    },
  },
  {
    id: 'am-a3-02', difficulty: 'medium',
    question: 'Simplify √50 + √18 − √8.',
    answer: '6√2',
    working: '5√2 + 3√2 − 2√2 = 6√2',
    vary: {
      make: rand => {
        const s = pick(rand, [2, 3, 5]);
        let m1, m2, m3;
        do { [m1, m2, m3] = [rand(2, 6), rand(2, 6), rand(2, 6)]; } while (m1 === m2 || m2 === m3 || m1 === m3 || m1 + m2 - m3 === 0);
        const total = m1 + m2 - m3;
        return {
          question: `Simplify √${m1 * m1 * s} + √${m2 * m2 * s} − √${m3 * m3 * s}.`,
          answer: poly([[total, `√${s}`]]),
          working: `${m1}√${s} + ${m2}√${s} − ${m3}√${s} = ${poly([[total, `√${s}`]])}`,
        };
      },
    },
  },
  {
    id: 'am-a3-03', difficulty: 'medium',
    question: 'Expand and simplify (3 + √2)(4 − √2).',
    answer: '10 + √2',
    working: '12 − 3√2 + 4√2 − 2 = 10 + √2',
    vary: {
      make: rand => {
        const s = pick(rand, [2, 3, 5, 7]);
        const [a, b, c, d] = [rand(1, 6), nonZero(rand, 4), rand(1, 6), nonZero(rand, 4)];
        const r = `√${s}`;
        return {
          question: `Expand and simplify (${poly([[a, ''], [b, r]])})(${poly([[c, ''], [d, r]])}).`,
          answer: poly([[a * c + b * d * s, ''], [a * d + b * c, r]]),
          working: `${poly([[a * c, ''], [a * d, r], [b * c, r], [b * d * s, '']])} = ${poly([[a * c + b * d * s, ''], [a * d + b * c, r]])}`,
        };
      },
    },
  },
  {
    id: 'am-a3-04', difficulty: 'medium',
    question: 'Expand and simplify (2√3 − 1)².',
    answer: '13 − 4√3',
    working: '(2√3)² − 2(2√3)(1) + 1² = 12 − 4√3 + 1 = 13 − 4√3',
    vary: {
      make: rand => {
        const s = pick(rand, [2, 3, 5, 7]);
        const b = rand(1, 4);
        const a = nonZero(rand, 5);
        const r = `√${s}`;
        return {
          question: `Expand and simplify (${poly([[b, r], [a, '']])})².`,
          answer: poly([[b * b * s + a * a, ''], [2 * a * b, r]]),
          working: `(${poly([[b, r]])})² ${a < 0 ? '−' : '+'} 2(${poly([[b, r]])})(${Math.abs(a)}) + ${Math.abs(a)}² = ${b * b * s}${plusMinus(2 * a * b).replace(/(\d+)$/, `$1${r}`)} + ${a * a} = ${poly([[b * b * s + a * a, ''], [2 * a * b, r]])}`,
        };
      },
    },
  },
  {
    id: 'am-a3-05', difficulty: 'easy',
    question: 'Rationalise the denominator of 6/√3.',
    answer: '2√3',
    working: '6/√3 × √3/√3 = 6√3/3 = 2√3',
    vary: {
      make: rand => {
        const s = pick(rand, ROOT_FREE);
        const k = rand(1, 12);
        const answer = surdText(surd(k, s, s));
        return {
          question: `Rationalise the denominator of ${k}/√${s}.`,
          answer,
          working: `${k}/√${s} × √${s}/√${s} = ${k === 1 ? '' : k}√${s}/${s} = ${answer}`,
        };
      },
    },
  },
  {
    id: 'am-a3-06', difficulty: 'medium',
    question: 'Rationalise the denominator of 1/(3 − √2).',
    answer: '(3 + √2)/7',
    working: 'Multiply top and bottom by the conjugate (3 + √2): (3 + √2)/(9 − 2) = (3 + √2)/7',
    vary: {
      make: rand => {
        const s = pick(rand, [2, 3, 5, 6, 7]);
        const [a, b, c] = [rand(1, 6), nonZero(rand, 3), rand(1, 6)];
        const denominator = a * a - b * b * s;
        const r = `√${s}`;
        return {
          question: `Rationalise the denominator of ${c}/(${poly([[a, ''], [b, r]])}).`,
          answer: surdFraction(c * a, -c * b, s, denominator),
          working: `Multiply top and bottom by the conjugate (${poly([[a, ''], [-b, r]])}): ${c === 1 ? '' : c}(${poly([[a, ''], [-b, r]])})/(${a * a} − ${b * b * s}) = ${surdFraction(c * a, -c * b, s, denominator)}`,
        };
      },
    },
  },
  {
    id: 'am-a3-07', difficulty: 'hard',
    question: 'Express (√5 + 1)/(√5 − 1) in the form (a + b√5)/c.',
    answer: '(3 + √5)/2',
    working: 'Multiply by (√5 + 1)/(√5 + 1): (5 + 2√5 + 1)/(5 − 1) = (6 + 2√5)/4 = (3 + √5)/2',
    vary: {
      make: rand => {
        const s = pick(rand, ROOT_FREE);
        let a;
        do { a = nonZero(rand, 4); } while (a * a === s);
        const r = `√${s}`;
        return {
          question: `Express (${r}${plusMinus(a)})/(${r}${plusMinus(-a)}) in the form (a + b${r})/c.`,
          answer: surdFraction(s + a * a, 2 * a, s, s - a * a),
          working: `Multiply by (${r}${plusMinus(a)})/(${r}${plusMinus(a)}): (${s} ${a < 0 ? '−' : '+'} ${Math.abs(2 * a)}${r} + ${a * a})/(${s} − ${a * a}) = ${surdFraction(s + a * a, 2 * a, s, s - a * a)}`,
        };
      },
    },
  },
  {
    id: 'am-a3-08', difficulty: 'hard',
    question: 'Solve √(2x + 3) = x.',
    answer: 'x = 3',
    working: 'Square: 2x + 3 = x² → x² − 2x − 3 = 0 → x = 3 or x = −1. Check: x = −1 gives √1 = −1, which is false, so reject it',
    vary: {
      make: rand => {
        let r, t;
        do { [r, t] = [rand(1, 7), -rand(1, 5)]; } while (r + t === 0);
        const a = r + t;
        const b = -r * t;
        return {
          question: `Solve √(${poly([[a, 'x'], [b, '']])}) = x.`,
          answer: `x = ${r}`,
          working: `Square: ${poly([[a, 'x'], [b, '']])} = x² → ${poly([[1, 'x²'], [-a, 'x'], [-b, '']])} = 0 → x = ${r} or x = ${num(t)}. Check: x = ${num(t)} would make the square root negative, so reject it`,
        };
      },
    },
  },
  {
    id: 'am-a3-09', difficulty: 'hard',
    question: 'Solve 2 + x√3 = 5x, giving x in the form (a + b√3)/c.',
    answer: '(5 + √3)/11',
    working: '2 = x(5 − √3) → x = 2/(5 − √3) = 2(5 + √3)/(25 − 3) = (5 + √3)/11',
    vary: {
      make: rand => {
        const s = pick(rand, [2, 3, 5, 6, 7]);
        const d = rand(2, 6);
        const c = rand(1, 6);
        const r = `√${s}`;
        return {
          question: `Solve ${c} + x${r} = ${d}x, giving x in the form (a + b${r})/c.`,
          answer: surdFraction(c * d, c, s, d * d - s),
          working: `${c} = x(${d} − ${r}) → x = ${c}/(${d} − ${r}) = ${c}(${d} + ${r})/(${d * d} − ${s}) = ${surdFraction(c * d, c, s, d * d - s)}`,
        };
      },
    },
  },
  {
    id: 'am-a3-10', difficulty: 'hard',
    question: 'A rectangle has area (8 + 3√2) cm² and length (2 + √2) cm. Find its width in the form (a + b√2) cm.',
    answer: '(5 − √2) cm',
    working: '(8 + 3√2)/(2 + √2) × (2 − √2)/(2 − √2) = (16 − 8√2 + 6√2 − 6)/2 = (10 − 2√2)/2 = 5 − √2',
    vary: {
      make: rand => {
        const s = pick(rand, [2, 3, 5]);
        let p, q, a, b, areaRational, areaSurd;
        do {
          [p, q, a, b] = [rand(3, 8), nonZero(rand, 2), rand(1, 4), rand(1, 2)];
          areaRational = p * a + q * b * s;
          areaSurd = p * b + q * a;
        } while (p + q * Math.sqrt(s) <= 0 || areaRational <= 0 || areaSurd <= 0); // keep the area looking natural
        const r = `√${s}`;
        return {
          question: `A rectangle has area (${poly([[areaRational, ''], [areaSurd, r]])}) cm² and length (${poly([[a, ''], [b, r]])}) cm. Find its width in the form (a + b${r}) cm.`,
          answer: `(${poly([[p, ''], [q, r]])}) cm`,
          working: `Width = area ÷ length. Multiply top and bottom by the conjugate (${poly([[a, ''], [-b, r]])}), whose product with the length is ${num(a * a - b * b * s)}, then simplify → ${poly([[p, ''], [q, r]])}`,
        };
      },
    },
  },
  {
    id: 'am-a3-11', difficulty: 'easy',
    question: 'What is the conjugate of a + b√c, and why is it useful?',
    answer: 'The conjugate is a − b√c. Multiplying them gives (a + b√c)(a − b√c) = a² − b²c, a whole number with no surd, so it is used to rationalise denominators.',
  },
]);

// ---------- A4 Polynomials and partial fractions ----------

// x³ + bx² + cx + d from three roots: (x − r1)(x − r2)(x − r3)
function cubicFromRoots(r1, r2, r3) {
  return [1, -(r1 + r2 + r3), r1 * r2 + r1 * r3 + r2 * r3, -r1 * r2 * r3];
}
const cubicText = ([a, b, c, d]) => poly([[a, 'x³'], [b, 'x²'], [c, 'x'], [d, '']]);

// Joins partial fractions: [[2, '(x + 1)'], [-3, '(x − 2)']] → "2/(x + 1) − 3/(x − 2)"
function fractionsText(parts) {
  return parts
    .map(([top, bottom], i) => {
      const negative = typeof top === 'number' && top < 0;
      const body = `${typeof top === 'number' ? Math.abs(top) : top}/${bottom}`;
      if (i === 0) return (negative ? '−' : '') + body;
      return (negative ? ' − ' : ' + ') + body;
    })
    .join('');
}

const aMathA4 = deck('A4 Polynomials and partial fractions', [
  {
    id: 'am-a4-01', difficulty: 'easy',
    question: 'Find the remainder when 2x³ − 3x² + x − 5 is divided by (x − 2).',
    answer: '1',
    working: 'Remainder theorem: f(2) = 16 − 12 + 2 − 5 = 1',
    vary: {
      make: rand => {
        const [a, b, c, d] = [rand(1, 3), nonZero(rand, 5), nonZero(rand, 6), nonZero(rand, 9)];
        const r = nonZero(rand, 3);
        const terms = [a * r ** 3, b * r * r, c * r, d];
        const R = terms.reduce((s, v) => s + v, 0);
        return {
          question: `Find the remainder when ${cubicText([a, b, c, d])} is divided by ${lin(1, -r)}.`,
          answer: num(R),
          working: `Remainder theorem: f(${num(r)}) = ${terms.map((t, i) => (i === 0 ? num(t) : plusMinus(t).trim())).join(' ')} = ${num(R)}`,
        };
      },
    },
  },
  {
    id: 'am-a4-02', difficulty: 'medium',
    question: '(x − 2) is a factor of x³ + kx² − 5x + 6. Find k.',
    answer: 'k = −1',
    working: 'Factor theorem: f(2) = 0 → 8 + 4k − 10 + 6 = 0 → 4k = −4 → k = −1',
    vary: {
      make: rand => {
        let k, r, c, d;
        do {
          [k, r, c] = [nonZero(rand, 6), nonZero(rand, 3), nonZero(rand, 6)];
          d = -(r ** 3 + k * r * r + c * r);
        } while (d === 0);
        return {
          question: `${lin(1, -r)} is a factor of ${poly([[1, 'x³'], [1, 'kx²'], [c, 'x'], [d, '']])}. Find k.`,
          answer: `k = ${num(k)}`,
          working: `Factor theorem: f(${num(r)}) = 0 → ${num(r ** 3)} + ${poly([[r * r, 'k']])}${plusMinus(c * r)}${plusMinus(d)} = 0 → ${poly([[r * r, 'k']])} = ${num(-(r ** 3 + c * r + d))} → k = ${num(k)}`,
        };
      },
    },
  },
  {
    id: 'am-a4-03', difficulty: 'medium',
    question: 'Factorise completely x³ − 2x² − 5x + 6.',
    answer: '(x − 1)(x + 2)(x − 3)',
    working: 'f(1) = 1 − 2 − 5 + 6 = 0, so (x − 1) is a factor. Divide: x³ − 2x² − 5x + 6 = (x − 1)(x² − x − 6) = (x − 1)(x + 2)(x − 3)',
    vary: {
      make: rand => {
        let r1, r2, r3;
        do { [r1, r2, r3] = [nonZero(rand, 4), nonZero(rand, 4), nonZero(rand, 4)]; } while (new Set([r1, r2, r3]).size < 3);
        const coeffs = cubicFromRoots(r1, r2, r3);
        const rest = poly([[1, 'x²'], [-(r2 + r3), 'x'], [r2 * r3, '']]);
        return {
          question: `Factorise completely ${cubicText(coeffs)}.`,
          answer: `${lin(1, -r1)}${lin(1, -r2)}${lin(1, -r3)}`,
          working: `f(${num(r1)}) = 0, so ${lin(1, -r1)} is a factor. Divide: ${cubicText(coeffs)} = ${lin(1, -r1)}(${rest}) = ${lin(1, -r1)}${lin(1, -r2)}${lin(1, -r3)}`,
        };
      },
    },
  },
  {
    id: 'am-a4-04', difficulty: 'hard',
    question: 'Solve 2x³ − 3x² − 3x + 2 = 0.',
    answer: 'x = −1, x = 1/2 or x = 2',
    working: 'f(2) = 0 → (x − 2) is a factor → (x − 2)(2x² + x − 1) = 0 → (x − 2)(2x − 1)(x + 1) = 0',
    vary: {
      make: rand => {
        let r1, r2, a, b;
        do {
          [r1, r2] = [nonZero(rand, 3), nonZero(rand, 3)];
          a = pick(rand, [2, 3]);
          b = nonZero(rand, 5);
        } while (r1 === r2 || gcd(a, b) !== 1);
        const [s, p] = [r1 + r2, r1 * r2];
        const coeffs = [a, -b - a * s, a * p + b * s, -b * p];
        const roots = [r1, r2, b / a].sort((x, y) => x - y);
        const show = v => (Number.isInteger(v) ? num(v) : fracText(b, a));
        return {
          question: `Solve ${cubicText(coeffs)} = 0.`,
          answer: `x = ${show(roots[0])}, x = ${show(roots[1])} or x = ${show(roots[2])}`,
          working: `f(${num(r1)}) = 0 → ${lin(1, -r1)} is a factor → ${lin(1, -r1)}${lin(1, -r2)}${lin(a, -b)} = 0`,
        };
      },
    },
  },
  {
    id: 'am-a4-05', difficulty: 'medium',
    question: 'Factorise 8x³ + 27.',
    answer: '(2x + 3)(4x² − 6x + 9)',
    working: 'a³ + b³ = (a + b)(a² − ab + b²) with a = 2x, b = 3',
    vary: {
      make: rand => {
        const a = rand(1, 4);
        const b = rand(1, 5);
        const plus = rand(0, 1) === 1;
        const s = plus ? 1 : -1;
        return {
          question: `Factorise ${poly([[a ** 3, 'x³'], [s * b ** 3, '']])}.`,
          answer: `${lin(a, s * b)}(${poly([[a * a, 'x²'], [-s * a * b, 'x'], [b * b, '']])})`,
          working: plus
            ? `a³ + b³ = (a + b)(a² − ab + b²) with a = ${a === 1 ? '' : a}x, b = ${b}`
            : `a³ − b³ = (a − b)(a² + ab + b²) with a = ${a === 1 ? '' : a}x, b = ${b}`,
        };
      },
    },
  },
  {
    id: 'am-a4-06', difficulty: 'hard',
    question: 'f(x) = x³ + ax² + bx − 6. When f(x) is divided by (x − 1) the remainder is −4, and (x − 2) is a factor. Find a and b.',
    answer: 'a = −2, b = 3',
    working: 'f(1) = 1 + a + b − 6 = −4 → a + b = 1; f(2) = 8 + 4a + 2b − 6 = 0 → 2a + b = −1. Subtract: a = −2, so b = 3',
    vary: {
      make: rand => {
        let A, B, r1, r2, c0;
        do {
          [A, B, r1, r2] = [nonZero(rand, 5), nonZero(rand, 6), nonZero(rand, 3), nonZero(rand, 3)];
          c0 = -(r2 ** 3 + A * r2 * r2 + B * r2);
        } while (r1 === r2 || c0 === 0);
        const R = r1 ** 3 + A * r1 * r1 + B * r1 + c0;
        return {
          question: `f(x) = ${poly([[1, 'x³'], [1, 'ax²'], [1, 'bx'], [c0, '']])}. When f(x) is divided by ${lin(1, -r1)} the remainder is ${num(R)}, and ${lin(1, -r2)} is a factor. Find a and b.`,
          answer: `a = ${num(A)}, b = ${num(B)}`,
          working: `f(${num(r1)}) = ${num(R)} → ${poly([[r1 * r1, 'a'], [r1, 'b']])} = ${num(R - r1 ** 3 - c0)}; f(${num(r2)}) = 0 → ${poly([[r2 * r2, 'a'], [r2, 'b']])} = ${num(-(r2 ** 3) - c0)}. Solve simultaneously → a = ${num(A)}, b = ${num(B)}`,
        };
      },
    },
  },
  {
    id: 'am-a4-07', difficulty: 'medium',
    question: 'Find the quotient and remainder when 2x³ + x² − 5x + 4 is divided by (x + 2).',
    answer: 'Quotient 2x² − 3x + 1, remainder 2',
    working: 'Long division: 2x³ ÷ x = 2x², then −3x² ÷ x = −3x, then x ÷ x = 1; remainder 4 − 2 = 2',
    vary: {
      make: rand => {
        const [a, b, c] = [rand(1, 3), nonZero(rand, 5), nonZero(rand, 5)];
        const d = nonZero(rand, 4);
        const R = rand(-6, 6);
        const dividend = [a, b + a * d, c + b * d, c * d + R];
        return {
          question: `Find the quotient and remainder when ${cubicText(dividend)} is divided by ${lin(1, d)}.`,
          answer: `Quotient ${poly([[a, 'x²'], [b, 'x'], [c, '']])}, remainder ${num(R)}`,
          working: `Check: ${lin(1, d)}(${poly([[a, 'x²'], [b, 'x'], [c, '']])})${plusMinus(R)} = ${cubicText(dividend)}`,
        };
      },
    },
  },
  {
    id: 'am-a4-08', difficulty: 'medium',
    question: 'Express (5x + 1)/((x + 1)(x − 1)) in partial fractions.',
    answer: '2/(x + 1) + 3/(x − 1)',
    working: '5x + 1 = A(x − 1) + B(x + 1). x = 1: 6 = 2B → B = 3. x = −1: −4 = −2A → A = 2',
    vary: {
      make: rand => {
        let p, q;
        do { [p, q] = [nonZero(rand, 4), nonZero(rand, 4)]; } while (p === q);
        const [A, B] = [nonZero(rand, 5), nonZero(rand, 5)];
        const top = poly([[A + B, 'x'], [A * q + B * p, '']]);
        return {
          question: `Express (${top})/(${lin(1, p)}${lin(1, q)}) in partial fractions.`,
          answer: fractionsText([[A, lin(1, p)], [B, lin(1, q)]]),
          working: `${top} = A${lin(1, q)} + B${lin(1, p)}. x = ${num(-q)}: B = ${num(B)}. x = ${num(-p)}: A = ${num(A)}`,
        };
      },
    },
  },
  {
    id: 'am-a4-09', difficulty: 'hard',
    question: 'Express (x + 5)/((x + 1)(x − 1)²) in partial fractions.',
    answer: '1/(x + 1) − 1/(x − 1) + 3/(x − 1)²',
    working: 'x + 5 = A(x − 1)² + B(x + 1)(x − 1) + C(x + 1). x = 1: 6 = 2C → C = 3. x = −1: 4 = 4A → A = 1. Compare x²: 0 = A + B → B = −1',
    vary: {
      make: rand => {
        let p, q;
        do { [p, q] = [nonZero(rand, 3), nonZero(rand, 3)]; } while (p === q);
        const [A, B, C] = [nonZero(rand, 4), nonZero(rand, 4), nonZero(rand, 4)];
        // A(x+q)² + B(x+p)(x+q) + C(x+p)
        const x2 = A + B;
        const x1 = 2 * A * q + B * (p + q) + C;
        const x0 = A * q * q + B * p * q + C * p;
        const top = poly([[x2, 'x²'], [x1, 'x'], [x0, '']]);
        return {
          question: `Express (${top})/(${lin(1, p)}${lin(1, q)}²) in partial fractions.`,
          answer: fractionsText([[A, lin(1, p)], [B, lin(1, q)], [C, `${lin(1, q)}²`]]),
          working: `${top} = A${lin(1, q)}² + B${lin(1, p)}${lin(1, q)} + C${lin(1, p)}. x = ${num(-q)} gives C = ${num(C)}; x = ${num(-p)} gives A = ${num(A)}; comparing x² terms gives B = ${num(B)}`,
        };
      },
    },
  },
  {
    id: 'am-a4-10', difficulty: 'hard',
    question: 'Express (3x² + 2x + 5)/((x + 1)(x² + 2)) in partial fractions.',
    answer: '2/(x + 1) + (x + 1)/(x² + 2)',
    working: '3x² + 2x + 5 = A(x² + 2) + (Bx + C)(x + 1). x = −1: 6 = 3A → A = 2. Compare x²: 3 = A + B → B = 1. Compare constants: 5 = 2A + C → C = 1',
    vary: {
      make: rand => {
        const p = nonZero(rand, 3);
        const m = rand(1, 5);
        const [A, B, C] = [nonZero(rand, 4), rand(1, 4), nonZero(rand, 4)];
        const top = poly([[A + B, 'x²'], [B * p + C, 'x'], [A * m + C * p, '']]);
        const quad = `(${poly([[1, 'x²'], [m, '']])})`;
        return {
          question: `Express (${top})/(${lin(1, p)}${quad}) in partial fractions.`,
          answer: fractionsText([[A, lin(1, p)], [`(${poly([[B, 'x'], [C, '']])})`, quad]]),
          working: `${top} = A${quad} + (Bx + C)${lin(1, p)}. x = ${num(-p)} gives A = ${num(A)}; comparing x² gives B = ${B}; comparing constants gives C = ${num(C)}`,
        };
      },
    },
  },
  {
    id: 'am-a4-11', difficulty: 'easy',
    question: 'State the remainder theorem and the factor theorem.',
    answer: 'Remainder theorem: when f(x) is divided by (x − a), the remainder is f(a). (For (ax − b), it is f(b/a).)\nFactor theorem: (x − a) is a factor of f(x) if and only if f(a) = 0.',
  },
  {
    id: 'am-a4-12', difficulty: 'medium',
    question: 'What must you do first when the numerator has the same or higher degree than the denominator in partial fractions?',
    answer: 'It is an improper fraction: divide first (long division) to get a polynomial plus a proper fraction, then split the proper fraction into partial fractions.',
  },
]);

// ---------- A5 Binomial expansions ----------

const aMathA5 = deck('A5 Binomial expansions', [
  {
    id: 'am-a5-01', difficulty: 'easy',
    question: 'Evaluate ⁷C₃.',
    answer: '35',
    working: '7! ÷ (3! × 4!) = 5040 ÷ (6 × 24) = 35',
    vary: {
      make: rand => {
        const n = rand(4, 10);
        const r = rand(1, n - 1);
        const SUB = '₀₁₂₃₄₅₆₇₈₉';
        const SUPER = '⁰¹²³⁴⁵⁶⁷⁸⁹';
        const tiny = (t, digits) => String(t).split('').map(d => digits[d]).join('');
        return {
          question: `Evaluate ${tiny(n, SUPER)}C${tiny(r, SUB)}.`,
          answer: String(nCr(n, r)),
          working: `${n}! ÷ (${r}! × ${n - r}!) = ${nCr(n, r)}`,
        };
      },
    },
  },
  {
    id: 'am-a5-02', difficulty: 'medium',
    question: 'Find the coefficient of x³ in the expansion of (2 + x)⁵.',
    answer: '40',
    working: 'Term = ⁵C₃ × 2² × x³ = 10 × 4 = 40',
    vary: {
      make: rand => {
        const [a, b] = [rand(1, 3), nonZero(rand, 3)];
        const n = rand(4, 7);
        const r = rand(2, n - 1);
        const coef = nCr(n, r) * a ** (n - r) * b ** r;
        return {
          question: `Find the coefficient of x${sup(r)} in the expansion of (${poly([[a, ''], [b, 'x']])})${sup(n)}.`,
          answer: num(coef),
          working: `Term = ${n}C${r} × ${a}${sup(n - r)} × (${poly([[b, 'x']])})${sup(r)} → ${nCr(n, r)} × ${a ** (n - r)} × ${b ** r < 0 ? `(${num(b ** r)})` : b ** r} = ${num(coef)}`,
        };
      },
    },
  },
  {
    id: 'am-a5-03', difficulty: 'medium',
    question: 'Find the first three terms, in ascending powers of x, of (1 − 2x)⁶.',
    answer: '1 − 12x + 60x²',
    working: '1 + ⁶C₁(−2x) + ⁶C₂(−2x)² = 1 − 12x + 15 × 4x²',
    vary: {
      make: rand => {
        const b = nonZero(rand, 3);
        const n = rand(4, 9);
        return {
          question: `Find the first three terms, in ascending powers of x, of (${poly([[1, ''], [b, 'x']])})${sup(n)}.`,
          answer: poly([[1, ''], [n * b, 'x'], [nCr(n, 2) * b * b, 'x²']]),
          working: `1 + ${n}C1(${poly([[b, 'x']])}) + ${n}C2(${poly([[b, 'x']])})² = ${poly([[1, ''], [n * b, 'x'], [nCr(n, 2) * b * b, 'x²']])}`,
        };
      },
    },
  },
  {
    id: 'am-a5-04', difficulty: 'hard',
    question: 'Find the term independent of x in the expansion of (x + 2/x)⁶.',
    answer: '160',
    working: 'General term ⁶Cᵣ x^(6 − r) (2/x)^r = ⁶Cᵣ 2^r x^(6 − 2r). Independent: 6 − 2r = 0 → r = 3 → 20 × 8 = 160',
    vary: {
      make: rand => {
        const [p, q] = pick(rand, [[1, 1], [2, 1], [1, 2], [3, 1]]);
        const c = nonZero(rand, 3);
        const ns = [3, 4, 5, 6, 7, 8, 9].filter(n => (p * n) % (p + q) === 0);
        const n = pick(rand, ns);
        const r = (p * n) / (p + q);
        const value = nCr(n, r) * c ** r;
        const xp = p === 1 ? 'x' : `x${sup(p)}`;
        const xq = q === 1 ? 'x' : `x${sup(q)}`;
        return {
          question: `Find the term independent of x in the expansion of (${xp} ${c < 0 ? '−' : '+'} ${Math.abs(c)}/${xq})${sup(n)}.`,
          answer: num(value),
          working: `General term ${n}Cr (${xp})^(${n} − r) (${num(c)}/${xq})^r has power of x ${p}(${n} − r) − ${q === 1 ? '' : q}r. Independent: ${p * n} − ${p + q}r = 0 → r = ${r} → ${nCr(n, r)} × ${num(c ** r)} = ${num(value)}`,
        };
      },
    },
  },
  {
    id: 'am-a5-05', difficulty: 'medium',
    question: 'The coefficient of x² in the expansion of (1 + x)ⁿ is 28. Find n.',
    answer: 'n = 8',
    working: 'ⁿC₂ = n(n − 1)/2 = 28 → n² − n − 56 = 0 → (n − 8)(n + 7) = 0 → n = 8 (n must be positive)',
    vary: {
      make: rand => {
        const n = rand(4, 12);
        const T = nCr(n, 2);
        return {
          question: `The coefficient of x² in the expansion of (1 + x)ⁿ is ${T}. Find n.`,
          answer: `n = ${n}`,
          working: `ⁿC₂ = n(n − 1)/2 = ${T} → n² − n − ${2 * T} = 0 → (n − ${n})(n + ${n - 1}) = 0 → n = ${n} (n must be positive)`,
        };
      },
    },
  },
  {
    id: 'am-a5-06', difficulty: 'hard',
    question: 'Find the coefficient of x² in the expansion of (1 + 2x)(1 − x)⁵.',
    answer: '0',
    working: '(1 − x)⁵ = 1 − 5x + 10x² + … → x² terms: 1 × 10x² + 2x × (−5x) = 10x² − 10x² → 0',
    vary: {
      make: rand => {
        const [a, b] = [nonZero(rand, 3), nonZero(rand, 2)];
        const n = rand(4, 7);
        const c1 = n * b;
        const c2 = nCr(n, 2) * b * b;
        const total = c2 + a * c1;
        return {
          question: `Find the coefficient of x² in the expansion of (${poly([[1, ''], [a, 'x']])})(${poly([[1, ''], [b, 'x']])})${sup(n)}.`,
          answer: num(total),
          working: `(${poly([[1, ''], [b, 'x']])})${sup(n)} = ${poly([[1, ''], [c1, 'x'], [c2, 'x²']])} + … → x² terms: 1 × ${num(c2)} + (${num(a)}) × (${num(c1)}) = ${num(total)}`,
        };
      },
    },
  },
  {
    id: 'am-a5-07', difficulty: 'easy',
    question: 'Write the general term of the expansion of (a + b)ⁿ.',
    answer: 'Tᵣ₊₁ = ⁿCᵣ aⁿ⁻ʳ bʳ, for r = 0, 1, 2, …, n.',
  },
  {
    id: 'am-a5-08', difficulty: 'hard',
    question: 'Use the first three terms of the expansion of (1 + x)⁵ to estimate 1.02⁵.',
    answer: '1.104',
    working: '(1 + x)⁵ ≈ 1 + 5x + 10x² with x = 0.02 → 1 + 0.1 + 0.004 = 1.104',
    vary: {
      make: rand => {
        const k = rand(1, 5); // x = k/100
        const n = rand(4, 8);
        const c2 = nCr(n, 2);
        const scaled = 10000 + 100 * n * k + c2 * k * k; // estimate × 10000, exact
        const estimate = String(scaled / 10000);
        const x = k / 100;
        return {
          question: `Use the first three terms of the expansion of (1 + x)${sup(n)} to estimate ${String(1 + x)}${sup(n)}.`,
          answer: estimate,
          working: `(1 + x)${sup(n)} ≈ 1 + ${n}x + ${c2}x² with x = ${x} → 1 + ${String((n * k) / 100)} + ${String((c2 * k * k) / 10000)} = ${estimate}`,
        };
      },
    },
  },
  {
    id: 'am-a5-09', difficulty: 'easy',
    question: 'Write down the coefficients in the expansion of (a + b)⁴.',
    answer: '1, 4, 6, 4, 1 → a⁴ + 4a³b + 6a²b² + 4ab³ + b⁴',
  },
  {
    id: 'am-a5-10', difficulty: 'medium',
    question: 'Expand (2x − 1)⁴ fully.',
    answer: '16x⁴ − 32x³ + 24x² − 8x + 1',
    working: '(2x)⁴ + 4(2x)³(−1) + 6(2x)²(−1)² + 4(2x)(−1)³ + (−1)⁴',
    vary: {
      make: rand => {
        const [a, b] = [rand(1, 3), nonZero(rand, 3)];
        const n = rand(3, 4);
        const powers = ['', 'x', 'x²', 'x³', 'x⁴'];
        const terms = [];
        for (let r = n; r >= 0; r--) terms.push([nCr(n, r) * a ** r * b ** (n - r), powers[r]]);
        return {
          question: `Expand ${lin(a, b)}${sup(n)} fully.`,
          answer: poly(terms),
          working: `Use the coefficients ${Array.from({ length: n + 1 }, (_, r) => nCr(n, r)).join(', ')} with a = ${a === 1 ? '' : a}x and b = ${num(b)}`,
        };
      },
    },
  },
]);

// ---------- A6 Exponential and logarithmic functions ----------

// log base as a subscript: logText(2, '8') → "log₂ 8",  logText(2, '(x + 1)') → "log₂(x + 1)"
function logText(base, arg) {
  const SUB = '₀₁₂₃₄₅₆₇₈₉';
  const space = /^[([]/.test(String(arg)) ? '' : ' ';
  return `log${String(base).split('').map(d => SUB[d]).join('')}${space}${arg}`;
}

const aMathA6 = deck('A6 Exponential and logarithmic functions', [
  {
    id: 'am-a6-01', difficulty: 'easy',
    question: 'Evaluate log₂ 32 and log₃ (1/9).',
    answer: '5 and −2',
    working: '2⁵ = 32 and 3⁻² = 1/9',
    vary: {
      make: rand => {
        const b1 = rand(2, 5);
        const k1 = rand(2, b1 === 2 ? 6 : 4);
        const b2 = rand(2, 5);
        const k2 = -rand(1, 3);
        return {
          question: `Evaluate ${logText(b1, b1 ** k1)} and ${logText(b2, `(1/${b2 ** -k2})`)}.`,
          answer: `${k1} and ${num(k2)}`,
          working: `${b1}${sup(k1)} = ${b1 ** k1} and ${b2}${sup(k2)} = 1/${b2 ** -k2}`,
        };
      },
    },
  },
  {
    id: 'am-a6-02', difficulty: 'medium',
    question: 'Evaluate lg 8 + lg 5 − lg 4 without a calculator.',
    answer: '1',
    working: 'lg(8 × 5 ÷ 4) = lg 10 = 1',
    vary: {
      make: rand => {
        let a, b, c, k;
        do {
          [a, b] = [pick(rand, [2, 4, 5, 8, 20, 25, 40, 50]), pick(rand, [2, 4, 5, 8, 20, 25, 40, 50])];
          k = rand(1, 2);
          c = (a * b) / 10 ** k;
        } while (!Number.isInteger(c) || c <= 1 || c === a || c === b);
        return {
          question: `Evaluate lg ${a} + lg ${b} − lg ${c} without a calculator.`,
          answer: String(k),
          working: `lg(${a} × ${b} ÷ ${c}) = lg ${10 ** k} = ${k}`,
        };
      },
    },
  },
  {
    id: 'am-a6-03', difficulty: 'easy',
    question: 'State the three laws of logarithms.',
    answer: 'logₐ(xy) = logₐ x + logₐ y\nlogₐ(x/y) = logₐ x − logₐ y\nlogₐ(xⁿ) = n logₐ x\n(Also logₐ a = 1 and logₐ 1 = 0.)',
  },
  {
    id: 'am-a6-04', difficulty: 'medium',
    question: 'Solve 2ˣ = 7, giving your answer correct to 3 significant figures.',
    answer: 'x = 2.81',
    working: 'Take lg of both sides: x lg 2 = lg 7 → x = lg 7 ÷ lg 2 = 2.81',
    vary: {
      make: rand => {
        const base = rand(2, 9);
        let c;
        do { c = rand(3, 60); } while (Number.isInteger(Math.log(c) / Math.log(base) + 1e-12) || Math.abs(Math.round(Math.log(c) / Math.log(base)) - Math.log(c) / Math.log(base)) < 1e-9);
        const x = Math.log(c) / Math.log(base);
        return {
          question: `Solve ${base}ˣ = ${c}, giving your answer correct to 3 significant figures.`,
          answer: `x = ${sf3(x)}`,
          working: `Take lg of both sides: x lg ${base} = lg ${c} → x = lg ${c} ÷ lg ${base} = ${sf3(x)}`,
        };
      },
    },
  },
  {
    id: 'am-a6-05', difficulty: 'medium',
    question: 'Solve 3^(2x − 1) = 81.',
    answer: 'x = 5/2',
    working: '81 = 3⁴ → 2x − 1 = 4 → x = 5/2',
    vary: {
      make: rand => {
        const base = pick(rand, [2, 3, 5]);
        const k = rand(1, base === 2 ? 6 : 4);
        const p = rand(1, 4);
        const q = nonZero(rand, 4);
        return {
          question: `Solve ${base}^(${poly([[p, 'x'], [q, '']])}) = ${base ** k}.`,
          answer: `x = ${fracText(k - q, p)}`,
          working: `${base ** k} = ${base}${sup(k)} → ${poly([[p, 'x'], [q, '']])} = ${k} → x = ${fracText(k - q, p)}`,
        };
      },
    },
  },
  {
    id: 'am-a6-06', difficulty: 'medium',
    question: 'Solve e^(2x) = 5, giving your answer correct to 3 significant figures.',
    answer: 'x = 0.805',
    working: 'Take ln: 2x = ln 5 → x = ln 5 ÷ 2 = 0.805',
    vary: {
      make: rand => {
        const a = rand(2, 5);
        const c = pick(rand, [2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20]);
        const x = Math.log(c) / a;
        return {
          question: `Solve e^(${a}x) = ${c}, giving your answer correct to 3 significant figures.`,
          answer: `x = ${sf3(x)}`,
          working: `Take ln: ${a}x = ln ${c} → x = ln ${c} ÷ ${a} = ${sf3(x)}`,
        };
      },
    },
  },
  {
    id: 'am-a6-07', difficulty: 'hard',
    question: 'Solve log₂(x + 1) + log₂(x − 1) = 3.',
    answer: 'x = 3',
    working: 'log₂[(x + 1)(x − 1)] = 3 → x² − 1 = 8 → x = ±3. x = −3 makes log₂(x − 1) undefined, so x = 3',
    vary: {
      make: rand => {
        let base, x, p, q, i, j, k, other;
        do {
          base = pick(rand, [2, 3]);
          [i, j] = [rand(0, 3), rand(1, 3)];
          x = rand(1, 9);
          [p, q] = [base ** i - x, base ** j - x];
          k = i + j;
          other = -(p + q) - x;
        } while (p === q || p === 0 || q === 0);
        const otherValid = other + p > 0 && other + q > 0;
        const roots = otherValid ? [x, other].sort((m, n) => m - n) : [x];
        const product = poly([[1, 'x²'], [p + q, 'x'], [p * q - base ** k, '']]);
        return {
          question: `Solve ${logText(base, lin(1, p))} + ${logText(base, lin(1, q))} = ${k}.`,
          answer: roots.map(r => `x = ${num(r)}`).join(' or '),
          working: `${logText(base, `[${lin(1, p)}${lin(1, q)}]`)} = ${k} → ${lin(1, p)}${lin(1, q)} = ${base ** k} → ${product} = 0 → x = ${num(x)} or x = ${num(other)}${otherValid ? '' : `. x = ${num(other)} makes a log of a negative number, so reject it`}`,
        };
      },
    },
  },
  {
    id: 'am-a6-08', difficulty: 'medium',
    question: 'Evaluate log₄ 8.',
    answer: '3/2',
    working: 'Change base to 2: log₂ 8 ÷ log₂ 4 = 3 ÷ 2 = 3/2',
    vary: {
      make: rand => {
        const p = pick(rand, [2, 3]);
        let a, b;
        do { [a, b] = [rand(2, 3), rand(1, 5)]; } while (a === b || p ** b > 250);
        return {
          question: `Evaluate ${logText(p ** a, p ** b)}.`,
          answer: fracText(b, a),
          working: `Change base to ${p}: ${logText(p, p ** b)} ÷ ${logText(p, p ** a)} = ${b} ÷ ${a} = ${fracText(b, a)}`,
        };
      },
    },
  },
  {
    id: 'am-a6-09', difficulty: 'hard',
    question: 'Solve 2^(2x) − 5(2ˣ) + 4 = 0.',
    answer: 'x = 0 or x = 2',
    working: 'Let u = 2ˣ: u² − 5u + 4 = 0 → (u − 1)(u − 4) = 0 → 2ˣ = 1 or 2ˣ = 4',
    vary: {
      make: rand => {
        const base = pick(rand, [2, 3]);
        const m = rand(0, 2);
        const n = rand(m + 1, 3);
        const [u1, u2] = [base ** m, base ** n];
        return {
          question: `Solve ${base}^(2x) − ${u1 + u2}(${base}ˣ) + ${u1 * u2} = 0.`,
          answer: `x = ${m} or x = ${n}`,
          working: `Let u = ${base}ˣ: u² − ${u1 + u2}u + ${u1 * u2} = 0 → (u − ${u1})(u − ${u2}) = 0 → ${base}ˣ = ${u1} or ${base}ˣ = ${u2}`,
        };
      },
    },
  },
  {
    id: 'am-a6-10', difficulty: 'easy',
    question: 'What is ln x, and what are ln 1 and ln e?',
    answer: 'ln x is the logarithm to base e (e ≈ 2.718), the inverse of eˣ.\nln 1 = 0 and ln e = 1.',
  },
  {
    id: 'am-a6-11', difficulty: 'medium',
    question: 'Describe the graphs of y = eˣ and y = ln x.',
    answer: 'y = eˣ: passes through (0, 1), always positive, increasing; the x-axis is an asymptote.\ny = ln x: passes through (1, 0), only defined for x > 0, increasing; the y-axis is an asymptote.\nEach is the reflection of the other in the line y = x.',
  },
  {
    id: 'am-a6-12', difficulty: 'hard',
    question: 'A population is modelled by N = 500e^(0.04t), where t is in years. Find how long it takes for the population to double, correct to 3 significant figures.',
    answer: '17.3 years',
    working: '1000 = 500e^(0.04t) → e^(0.04t) = 2 → t = ln 2 ÷ 0.04 = 17.3',
    vary: {
      make: rand => {
        const N0 = 100 * rand(2, 9);
        const k = pick(rand, [0.02, 0.03, 0.04, 0.05, 0.06, 0.08]);
        if (rand(0, 1) === 1) {
          const t = rand(5, 30);
          const N = N0 * Math.exp(k * t);
          return {
            question: `A population is modelled by N = ${N0}e^(${k}t), where t is in years. Find N when t = ${t}, correct to 3 significant figures.`,
            answer: sf3(N),
            working: `N = ${N0} × e^(${k} × ${t}) = ${N0} × e^${Number((k * t).toFixed(2))} = ${sf3(N)}`,
          };
        }
        const m = pick(rand, [2, 3, 5]);
        const word = { 2: 'double', 3: 'triple', 5: 'become 5 times as large' }[m];
        const t = Math.log(m) / k;
        return {
          question: `A population is modelled by N = ${N0}e^(${k}t), where t is in years. Find how long it takes for the population to ${word}, correct to 3 significant figures.`,
          answer: `${sf3(t)} years`,
          working: `${N0 * m} = ${N0}e^(${k}t) → e^(${k}t) = ${m} → t = ln ${m} ÷ ${k} = ${sf3(t)}`,
        };
      },
    },
  },
]);

// ---------- G1 Trigonometric functions, identities and equations ----------

const RAD = Math.PI / 180;
const TRIG = { sin: d => Math.sin(d * RAD), cos: d => Math.cos(d * RAD), tan: d => Math.tan(d * RAD) };
const EXACT_ANGLES = [0, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330];

// Every angle 0° ≤ x ≤ 360° (in steps of 15°) where fn(x) equals value exactly.
function exactSolutions(fn, value) {
  const out = [];
  for (let x = 0; x <= 360; x += 15) {
    if (fn === 'tan' && x % 180 === 90) continue;
    if (Math.abs(TRIG[fn](x) - value) < 1e-9) out.push(x);
  }
  return out;
}

// Solutions in 0° ≤ x < 360° of sin x = k, cos x = k or tan x = k, sorted.
function generalSolutions(fn, k) {
  const norm = d => ((d % 360) + 360) % 360;
  let list;
  if (fn === 'sin') { const b = Math.asin(k) / RAD; list = [b, 180 - b]; }
  else if (fn === 'cos') { const b = Math.acos(k) / RAD; list = [b, 360 - b]; }
  else { const b = Math.atan(k) / RAD; list = [b, b + 180]; }
  return [...new Set(list.map(norm).map(d => Number(d.toFixed(6))))].sort((a, b) => a - b);
}

const degreeList = list => list.map(d => `${d}°`).join(', ');

const aMathG1 = deck('G1 Trigonometric functions, identities and equations', [
  {
    id: 'am-g1-01', difficulty: 'easy',
    question: 'Find the exact value of sin 240°.',
    answer: '−√3/2',
    working: '240° is in the 3rd quadrant (sin negative), basic angle 60° → −sin 60° = −√3/2',
    vary: {
      make: rand => {
        const angle = pick(rand, EXACT_ANGLES);
        const fn = pick(rand, ['sin', 'cos']);
        const value = fn === 'sin' ? sinExact(angle) : cosExact(angle);
        return {
          question: `Find the exact value of ${fn} ${angle}°.`,
          answer: surdText(value),
          working: `Use the basic angle and the sign of ${fn} in that quadrant (CAST) → ${surdText(value)}`,
        };
      },
    },
  },
  {
    id: 'am-g1-02', difficulty: 'medium',
    question: 'Find the exact value of cos(2π/3).',
    answer: '−1/2',
    working: '2π/3 = 120°, in the 2nd quadrant (cos negative), basic angle 60° → −cos 60° = −1/2',
    vary: {
      make: rand => {
        const angle = pick(rand, EXACT_ANGLES.filter(a => a !== 0));
        const fn = pick(rand, ['sin', 'cos']);
        const value = fn === 'sin' ? sinExact(angle) : cosExact(angle);
        return {
          question: `Find the exact value of ${fn}(${piText(angle)}).`,
          answer: surdText(value),
          working: `${piText(angle)} = ${angle}° → use the basic angle and the sign in that quadrant → ${surdText(value)}`,
        };
      },
    },
  },
  {
    id: 'am-g1-03', difficulty: 'medium',
    question: 'Solve sin x = 1/2 for 0° ≤ x ≤ 360°.',
    answer: 'x = 30°, 150°',
    working: 'Basic angle 30°. sin is positive in the 1st and 2nd quadrants → 30° and 180° − 30° = 150°',
    vary: {
      make: rand => {
        const fn = pick(rand, ['sin', 'cos', 'tan']);
        let angle, valueText, value;
        if (fn === 'tan') {
          angle = pick(rand, [30, 45, 60, 120, 135, 150]);
          const tanText = { 30: '1/√3', 45: '1', 60: '√3' };
          const basic = angle < 90 ? angle : 180 - angle;
          valueText = (angle > 90 ? '−' : '') + tanText[basic];
          value = TRIG.tan(angle);
        } else {
          angle = pick(rand, [30, 45, 60, 120, 135, 150, 210, 225, 240, 300, 315, 330]);
          value = TRIG[fn](angle);
          valueText = surdText(fn === 'sin' ? sinExact(angle) : cosExact(angle));
        }
        const solutions = exactSolutions(fn, value);
        return {
          question: `Solve ${fn} x = ${valueText} for 0° ≤ x ≤ 360°.`,
          answer: `x = ${degreeList(solutions)}`,
          working: `Find the basic angle, then use the quadrants where ${fn} is ${value > 0 ? 'positive' : 'negative'} (CAST)`,
        };
      },
    },
  },
  {
    id: 'am-g1-04', difficulty: 'medium',
    question: 'Solve tan x = 2 for 0° ≤ x < 360°, correct to 1 decimal place.',
    answer: 'x = 63.4°, 243.4°',
    working: 'Basic angle tan⁻¹ 2 = 63.4°. tan repeats every 180° → 63.4° and 243.4°',
    vary: {
      make: rand => {
        const fn = pick(rand, ['sin', 'cos', 'tan']);
        let k;
        do { k = fn === 'tan' ? nonZero(rand, 30) / 10 : nonZero(rand, 9) / 10; } while (fn !== 'tan' && Math.abs(k) === 0.5);
        const sols = generalSolutions(fn, k).filter(d => Number(d.toFixed(1)) < 360);
        return {
          question: `Solve ${fn} x = ${num(k)} for 0° ≤ x < 360°, correct to 1 decimal place.`,
          answer: `x = ${sols.map(d => `${dp1(d)}°`).join(', ')}`,
          working: `Basic angle = ${fn}⁻¹(${Math.abs(k)}) = ${dp1(fn === 'sin' ? Math.asin(Math.abs(k)) / RAD : fn === 'cos' ? Math.acos(Math.abs(k)) / RAD : Math.atan(Math.abs(k)) / RAD)}°, then use the quadrants where ${fn} is ${k > 0 ? 'positive' : 'negative'}`,
        };
      },
    },
  },
  {
    id: 'am-g1-05', difficulty: 'easy',
    question: 'Define sec x, cosec x and cot x.',
    answer: 'sec x = 1/cos x\ncosec x = 1/sin x\ncot x = 1/tan x = cos x/sin x',
  },
  {
    id: 'am-g1-06', difficulty: 'easy',
    question: 'State the three Pythagorean identities.',
    answer: 'sin²x + cos²x = 1\n1 + tan²x = sec²x\n1 + cot²x = cosec²x',
  },
  {
    id: 'am-g1-07', difficulty: 'medium',
    question: 'Given that sin A = 3/5 and A is obtuse, find the exact values of cos A and tan A.',
    answer: 'cos A = −4/5, tan A = −3/4',
    working: 'Right triangle 3-4-5. A is in the 2nd quadrant, where cos and tan are negative',
    vary: {
      make: rand => {
        const [a, b, c] = pick(rand, [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]]);
        const kind = pick(rand, ['obtuse', 'third', 'fourth']);
        if (kind === 'obtuse') {
          return {
            question: `Given that sin A = ${a}/${c} and A is obtuse, find the exact values of cos A and tan A.`,
            answer: `cos A = −${b}/${c}, tan A = −${a}/${b}`,
            working: `Right triangle ${a}-${b}-${c}. A is in the 2nd quadrant, where cos and tan are negative`,
          };
        }
        if (kind === 'third') {
          return {
            question: `Given that tan A = ${a}/${b} and 180° < A < 270°, find the exact values of sin A and cos A.`,
            answer: `sin A = −${a}/${c}, cos A = −${b}/${c}`,
            working: `Right triangle ${a}-${b}-${c}. A is in the 3rd quadrant, where sin and cos are negative`,
          };
        }
        return {
          question: `Given that cos A = ${b}/${c} and 270° < A < 360°, find the exact values of sin A and tan A.`,
          answer: `sin A = −${a}/${c}, tan A = −${a}/${b}`,
          working: `Right triangle ${a}-${b}-${c}. A is in the 4th quadrant, where sin and tan are negative`,
        };
      },
    },
  },
  {
    id: 'am-g1-08', difficulty: 'hard',
    question: 'Given that sin A = 3/5 and A is acute, find the exact values of sin 2A and cos 2A.',
    answer: 'sin 2A = 24/25, cos 2A = 7/25',
    working: 'cos A = 4/5. sin 2A = 2 sin A cos A = 2(3/5)(4/5) = 24/25; cos 2A = cos²A − sin²A = 16/25 − 9/25 = 7/25',
    vary: {
      make: rand => {
        const [p, q, c] = pick(rand, [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25]]);
        const [a, b] = rand(0, 1) ? [p, q] : [q, p];
        return {
          question: `Given that sin A = ${a}/${c} and A is acute, find the exact values of sin 2A and cos 2A.`,
          answer: `sin 2A = ${fracText(2 * a * b, c * c)}, cos 2A = ${fracText(b * b - a * a, c * c)}`,
          working: `cos A = ${b}/${c}. sin 2A = 2 sin A cos A = 2(${a}/${c})(${b}/${c}) = ${fracText(2 * a * b, c * c)}; cos 2A = cos²A − sin²A = ${b * b}/${c * c} − ${a * a}/${c * c} = ${fracText(b * b - a * a, c * c)}`,
        };
      },
    },
  },
  {
    id: 'am-g1-09', difficulty: 'hard',
    question: 'Express 3 sin x + 4 cos x in the form R sin(x + α), where R > 0 and 0° < α < 90°.',
    answer: '5 sin(x + 53.1°)',
    working: 'R cos α = 3, R sin α = 4 → R = √(3² + 4²) = 5, tan α = 4/3 → α = 53.1°',
    vary: {
      make: rand => {
        const [a, b] = [rand(1, 7), rand(1, 7)];
        const minus = rand(0, 1) === 1;
        const R = Math.sqrt(a * a + b * b);
        const Rtext = Number.isInteger(R) ? String(R) : surdText(surd(1, 1, a * a + b * b));
        const alpha = Math.atan(b / a) / RAD;
        return {
          question: `Express ${a === 1 ? '' : `${a} `}sin x ${minus ? '−' : '+'} ${b === 1 ? '' : `${b} `}cos x in the form R sin(x ${minus ? '−' : '+'} α), where R > 0 and 0° < α < 90°.`,
          answer: `${Rtext} sin(x ${minus ? '−' : '+'} ${dp1(alpha)}°)`,
          working: `R cos α = ${a}, R sin α = ${b} → R = √(${a}² + ${b}²) = ${Rtext}, tan α = ${b}/${a} → α = ${dp1(alpha)}°`,
        };
      },
    },
  },
  {
    id: 'am-g1-10', difficulty: 'medium',
    question: 'For y = 3 sin 2x + 1, state the amplitude, the period, and the maximum and minimum values.',
    answer: 'Amplitude 3, period 180°, maximum 4, minimum −2',
    working: 'Amplitude = |a| = 3. Period = 360° ÷ 2 = 180°. Max = 1 + 3, min = 1 − 3',
    vary: {
      make: rand => {
        const fn = pick(rand, ['sin', 'cos']);
        const a = rand(1, 5);
        const b = pick(rand, [1, 2, 3, 4]);
        const c = rand(-3, 3);
        const xPart = b === 1 ? 'x' : `${b}x`;
        return {
          question: `For y = ${a === 1 ? '' : `${a} `}${fn} ${xPart}${c === 0 ? '' : plusMinus(c)}, state the amplitude, the period, and the maximum and minimum values.`,
          answer: `Amplitude ${a}, period ${360 / b}°, maximum ${num(c + a)}, minimum ${num(c - a)}`,
          working: `Amplitude = ${a}. Period = 360° ÷ ${b} = ${360 / b}°. Max = ${num(c)} + ${a}, min = ${num(c)} − ${a}`,
        };
      },
    },
  },
  {
    id: 'am-g1-11', difficulty: 'hard',
    question: 'Solve 2sin²x − sin x − 1 = 0 for 0° ≤ x ≤ 360°.',
    answer: 'x = 90°, 210°, 330°',
    working: '(2 sin x + 1)(sin x − 1) = 0 → sin x = 1 gives 90°; sin x = −1/2 gives 210°, 330°',
    vary: {
      make: rand => {
        const [question, factors, f, roots] = pick(rand, [
          ['2sin²x − sin x − 1 = 0', '(2 sin x + 1)(sin x − 1) = 0', 'sin', [1, -0.5]],
          ['2cos²x + cos x − 1 = 0', '(2 cos x − 1)(cos x + 1) = 0', 'cos', [0.5, -1]],
          ['2sin²x − 3 sin x + 1 = 0', '(2 sin x − 1)(sin x − 1) = 0', 'sin', [0.5, 1]],
          ['2cos²x − 3 cos x + 1 = 0', '(2 cos x − 1)(cos x − 1) = 0', 'cos', [0.5, 1]],
          ['tan²x − 1 = 0', '(tan x − 1)(tan x + 1) = 0', 'tan', [1, -1]],
          ['2sin²x + sin x = 0', 'sin x (2 sin x + 1) = 0', 'sin', [0, -0.5]],
        ]);
        const solutions = [...new Set(roots.flatMap(r => exactSolutions(f, r)))].sort((a, b) => a - b);
        return {
          question: `Solve ${question} for 0° ≤ x ≤ 360°.`,
          answer: `x = ${degreeList(solutions)}`,
          working: `${factors} → ${roots.map(r => `${f} x = ${Math.abs(r) === 0.5 ? fracText(2 * r, 4) : num(r)}`).join(' or ')}`,
        };
      },
    },
  },
  {
    id: 'am-g1-12', difficulty: 'hard',
    question: 'Solve 2cos²x + 3 sin x = 3 for 0° ≤ x ≤ 360°.',
    answer: 'x = 30°, 90°, 150°',
    working: 'Use cos²x = 1 − sin²x: 2 − 2sin²x + 3 sin x − 3 = 0 → 2sin²x − 3 sin x + 1 = 0 → (2 sin x − 1)(sin x − 1) = 0 → sin x = 1/2 or 1',
  },
  {
    id: 'am-g1-13', difficulty: 'hard',
    question: 'A and B are acute, with sin A = 3/5 and cos B = 5/13. Find the exact value of sin(A + B).',
    answer: '63/65',
    working: 'cos A = 4/5, sin B = 12/13. sin(A + B) = sin A cos B + cos A sin B = (3/5)(5/13) + (4/5)(12/13) = 15/65 + 48/65 = 63/65',
    vary: {
      make: rand => {
        const t1 = pick(rand, [[3, 4, 5], [5, 12, 13], [8, 15, 17]]);
        const t2 = pick(rand, [[3, 4, 5], [5, 12, 13], [8, 15, 17]]);
        const [sA, cA, hA] = rand(0, 1) ? t1 : [t1[1], t1[0], t1[2]];
        const [sB, cB, hB] = rand(0, 1) ? t2 : [t2[1], t2[0], t2[2]];
        const formula = pick(rand, ['sin(A + B)', 'sin(A − B)', 'cos(A + B)', 'cos(A − B)']);
        const H = hA * hB;
        const values = {
          'sin(A + B)': [sA * cB + cA * sB, `sin A cos B + cos A sin B`],
          'sin(A − B)': [sA * cB - cA * sB, `sin A cos B − cos A sin B`],
          'cos(A + B)': [cA * cB - sA * sB, `cos A cos B − sin A sin B`],
          'cos(A − B)': [cA * cB + sA * sB, `cos A cos B + sin A sin B`],
        };
        const [top, rule] = values[formula];
        return {
          question: `A and B are acute, with sin A = ${sA}/${hA} and cos B = ${cB}/${hB}. Find the exact value of ${formula}.`,
          answer: fracText(top, H),
          working: `cos A = ${cA}/${hA}, sin B = ${sB}/${hB}. ${formula} = ${rule} = ${fracText(top, H)}`,
        };
      },
    },
  },
  {
    id: 'am-g1-14', difficulty: 'medium',
    question: 'Solve 2 sin x = 3 cos x for 0° ≤ x < 360°, correct to 1 decimal place.',
    answer: 'x = 56.3°, 236.3°',
    working: 'Divide by cos x: tan x = 3/2 → basic angle 56.3°; tan is positive in the 1st and 3rd quadrants',
    vary: {
      make: rand => {
        const a = rand(1, 5);
        let b;
        do { b = nonZero(rand, 5); } while (Math.abs(b) === a);
        const sols = generalSolutions('tan', b / a);
        return {
          question: `Solve ${a === 1 ? '' : `${a} `}sin x = ${b < 0 ? '−' : ''}${Math.abs(b) === 1 ? '' : `${Math.abs(b)} `}cos x for 0° ≤ x < 360°, correct to 1 decimal place.`,
          answer: `x = ${sols.map(d => `${dp1(d)}°`).join(', ')}`,
          working: `Divide by ${a === 1 ? '' : `${a} `}cos x: tan x = ${fracText(b, a)} → basic angle ${dp1(Math.atan(Math.abs(b / a)) / RAD)}°; tan is ${b > 0 ? 'positive in the 1st and 3rd' : 'negative in the 2nd and 4th'} quadrants`,
        };
      },
    },
  },
  {
    id: 'am-g1-15', difficulty: 'medium',
    question: 'What are good strategies for proving a trigonometric identity?',
    answer: 'Start from the more complicated side and work towards the other side. Write everything in sin and cos, combine fractions, and use sin²x + cos²x = 1 (and the double-angle formulae) to simplify. Never treat it like an equation by doing the same thing to both sides.',
  },
]);

// ---------- G2 Coordinate geometry in two dimensions ----------

// "y = (2/3)x − 1", "y = −3x + 4"
function lineText(n, d, c) {
  const f = frac(n, d);
  const xTerm = `${f.n < 0 ? '−' : ''}${coefTimes(f.n, f.d, 'x')}`;
  return `y = ${xTerm}${c === 0 ? '' : plusMinus(c)}`;
}

// ax + by = c with whole numbers, no common factor, and a positive first number.
function generalLine(a, b, c) {
  let g = gcd(gcd(a, b), c);
  if (a < 0 || (a === 0 && b < 0)) g = -g;
  return `${poly([[a / g, 'x'], [b / g, 'y']])} = ${num(c / g)}`;
}

const aMathG2 = deck('G2 Coordinate geometry in two dimensions', [
  {
    id: 'am-g2-01', difficulty: 'easy',
    question: 'A line has gradient 2/3. Find the gradient of a line perpendicular to it.',
    answer: '−3/2',
    working: 'm₁ × m₂ = −1 → m₂ = −1 ÷ (2/3) = −3/2',
    vary: {
      make: rand => {
        const p = nonZero(rand, 6);
        const q = rand(1, 6);
        return {
          question: `A line has gradient ${fracText(p, q)}. Find the gradient of a line perpendicular to it.`,
          answer: fracText(-q, p),
          working: `m₁ × m₂ = −1 → m₂ = −1 ÷ ${fracText(p, q)} = ${fracText(-q, p)}`,
        };
      },
    },
  },
  {
    id: 'am-g2-02', difficulty: 'hard',
    question: 'Find the equation of the perpendicular bisector of A(1, 2) and B(5, 6).',
    answer: 'x + y = 7',
    working: 'Midpoint (3, 4). Gradient AB = 4/4 = 1, so the perpendicular gradient is −1 → y − 4 = −(x − 3) → x + y = 7',
    vary: {
      make: rand => {
        let x1, y1, x2, y2;
        do { [x1, y1, x2, y2] = [rand(-6,6), rand(-6, 6), rand(-6, 6), rand(-6, 6)]; } while ((x1 + x2) % 2 || (y1 + y2) % 2 || (x1 === x2 && y1 === y2));
        const [mx, my] = [(x1 + x2) / 2, (y1 + y2) / 2];
        const [dx, dy] = [x2 - x1, y2 - y1];
        return {
          question: `Find the equation of the perpendicular bisector of A${point(x1, y1)} and B${point(x2, y2)}.`,
          answer: generalLine(dx, dy, dx * mx + dy * my),
          working: `Midpoint ${point(mx, my)}. The bisector is perpendicular to AB, whose direction is (${num(dx)}, ${num(dy)}) → ${generalLine(dx, dy, dx * mx + dy * my)}`,
        };
      },
    },
  },
  {
    id: 'am-g2-03', difficulty: 'medium',
    question: 'Are the lines y = (2/3)x + 1 and y = −(3/2)x + 4 perpendicular?',
    answer: 'Yes',
    working: '(2/3) × (−3/2) = −1',
    vary: {
      make: rand => {
        const p = nonZero(rand, 5);
        const q = rand(1, 5);
        const perpendicular = rand(0, 1) === 1;
        let [n2, d2] = [-q, p];
        if (!perpendicular) do { [n2, d2] = [nonZero(rand, 5), rand(1, 5)]; } while (p * n2 === -q * d2);
        const product = frac(p * n2, q * d2);
        return {
          question: `Are the lines ${lineText(p, q, nonZero(rand, 6))} and ${lineText(n2, d2, nonZero(rand, 6))} perpendicular?`,
          answer: perpendicular ? 'Yes' : 'No',
          working: `${fracText(p, q)} × ${fracText(n2, d2).replace(/^−/, '(−') + (fracText(n2, d2).startsWith('−') ? ')' : '')} = ${fracText(product.n, product.d)}${perpendicular ? '' : ', not −1'}`,
        };
      },
    },
  },
  {
    id: 'am-g2-04', difficulty: 'easy',
    question: 'State the centre and radius of the circle (x − 3)² + (y + 2)² = 25.',
    answer: 'Centre (3, −2), radius 5',
    working: '(x − a)² + (y − b)² = r² has centre (a, b) and radius r',
    vary: {
      make: rand => {
        const [a, b] = [rand(-6, 6), rand(-6, 6)];
        const r = rand(1, 9);
        const part = (v, letter) => (v === 0 ? `${letter}²` : `${lin(1, -v, letter)}²`);
        return {
          question: `State the centre and radius of the circle ${part(a, 'x')} + ${part(b, 'y')} = ${r * r}.`,
          answer: `Centre ${point(a, b)}, radius ${r}`,
          working: '(x − a)² + (y − b)² = r² has centre (a, b) and radius r',
        };
      },
    },
  },
  {
    id: 'am-g2-05', difficulty: 'medium',
    question: 'Find the centre and radius of the circle x² + y² − 6x + 4y − 12 = 0.',
    answer: 'Centre (3, −2), radius 5',
    working: 'Complete the square: (x − 3)² + (y + 2)² = 12 + 9 + 4 = 25',
    vary: {
      make: rand => {
        const [a, b] = [nonZero(rand, 6), nonZero(rand, 6)];
        const r = rand(1, 9);
        const c = a * a + b * b - r * r;
        return {
          question: `Find the centre and radius of the circle ${poly([[1, 'x²'], [1, 'y²'], [-2 * a, 'x'], [-2 * b, 'y'], [c, '']])} = 0.`,
          answer: `Centre ${point(a, b)}, radius ${r}`,
          working: `Complete the square: ${lin(1, -a)}² + ${lin(1, -b, 'y')}² = ${num(-c)} + ${a * a} + ${b * b} = ${r * r}`,
        };
      },
    },
  },
  {
    id: 'am-g2-06', difficulty: 'medium',
    question: 'Find the equation of the circle with centre (1, 2) that passes through (4, 6).',
    answer: '(x − 1)² + (y − 2)² = 25',
    working: 'r² = (4 − 1)² + (6 − 2)² = 9 + 16 = 25',
    vary: {
      make: rand => {
        const [a, b] = [nonZero(rand, 6), nonZero(rand, 6)];
        const [dx, dy] = [nonZero(rand, 6), nonZero(rand, 6)];
        const r2 = dx * dx + dy * dy;
        return {
          question: `Find the equation of the circle with centre ${point(a, b)} that passes through ${point(a + dx, b + dy)}.`,
          answer: `${lin(1, -a)}² + ${lin(1, -b, 'y')}² = ${r2}`,
          working: `r² = (${num(dx)})² + (${num(dy)})² = ${dx * dx} + ${dy * dy} = ${r2}`,
        };
      },
    },
  },
  {
    id: 'am-g2-07', difficulty: 'medium',
    question: 'A(−2, 1) and B(4, 9) are the ends of a diameter of a circle. Find the equation of the circle.',
    answer: '(x − 1)² + (y − 5)² = 25',
    working: 'Centre = midpoint (1, 5). Radius = half of AB = ½√(6² + 8²) = 5',
    vary: {
      make: rand => {
        const [a, b] = [rand(-5, 5), rand(-5, 5)];
        const [p, q, c] = pick(rand, [[3, 4, 5], [5, 12, 13], [6, 8, 10]]);
        const [dx, dy] = rand(0, 1) ? [p, q] : [q, p];
        const [sx, sy] = [nonZero(rand, 1), nonZero(rand, 1)];
        const part = (v, letter) => (v === 0 ? `${letter}²` : `${lin(1, -v, letter)}²`);
        return {
          question: `A${point(a - sx * dx, b - sy * dy)} and B${point(a + sx * dx, b + sy * dy)} are the ends of a diameter of a circle. Find the equation of the circle.`,
          answer: `${part(a, 'x')} + ${part(b, 'y')} = ${c * c}`,
          working: `Centre = midpoint ${point(a, b)}. Radius = half of AB = ½√(${2 * dx}² + ${2 * dy}²) = ${c}`,
        };
      },
    },
  },
  {
    id: 'am-g2-08', difficulty: 'medium',
    question: 'Find the area of the triangle with vertices (1, 2), (5, 3) and (2, 7).',
    answer: '9.5 square units',
    working: 'Shoelace: ½|1(3 − 7) + 5(7 − 2) + 2(2 − 3)| = ½|−4 + 25 − 2| = 9.5',
    vary: {
      make: rand => {
        let P, area;
        do {
          P = [[rand(-6, 6), rand(-6, 6)], [rand(-6, 6), rand(-6, 6)], [rand(-6, 6), rand(-6, 6)]];
          area = Math.abs(P[0][0] * (P[1][1] - P[2][1]) + P[1][0] * (P[2][1] - P[0][1]) + P[2][0] * (P[0][1] - P[1][1])) / 2;
        } while (area === 0);
        const [[x1, y1], [x2, y2], [x3, y3]] = P;
        const br = v => (v < 0 ? `(${num(v)})` : `${v}`); // negative numbers in brackets
        return {
          question: `Find the area of the triangle with vertices ${point(x1, y1)}, ${point(x2, y2)} and ${point(x3, y3)}.`,
          answer: `${area} square unit${area === 1 ? '' : 's'}`,
          working: `Shoelace: ½|${br(x1)}(${num(y2)} − ${br(y3)}) + ${br(x2)}(${num(y3)} − ${br(y1)}) + ${br(x3)}(${num(y1)} − ${br(y2)})| = ${area}`,
        };
      },
    },
  },
  {
    id: 'am-g2-09', difficulty: 'hard',
    question: 'The point P(5, 5) lies on a circle with centre (2, 1). Find the equation of the tangent at P.',
    answer: '3x + 4y = 35',
    working: 'Gradient of radius = 4/3, so the tangent gradient is −3/4 → y − 5 = −3/4(x − 5) → 3x + 4y = 35',
    vary: {
      make: rand => {
        const [a, b] = [rand(-4, 4), rand(-4, 4)];
        const [p, q] = pick(rand, [[3, 4], [4, 3], [5, 12], [12, 5], [6, 8], [8, 6]]);
        const [dx, dy] = [nonZero(rand, 1) * p, nonZero(rand, 1) * q];
        const [px, py] = [a + dx, b + dy];
        return {
          question: `The point P${point(px, py)} lies on a circle with centre ${point(a, b)}. Find the equation of the tangent at P.`,
          answer: generalLine(dx, dy, dx * px + dy * py),
          working: `Gradient of radius = ${fracText(dy, dx)}, so the tangent gradient is ${fracText(-dx, dy)} → ${generalLine(dx, dy, dx * px + dy * py)}`,
        };
      },
    },
  },
  {
    id: 'am-g2-10', difficulty: 'medium',
    question: 'To show y = axⁿ as a straight line, what should you plot, and what do the gradient and intercept give?',
    answer: 'Plot lg y against lg x: lg y = n lg x + lg a. Gradient = n, y-intercept = lg a.',
    vary: {
      make: rand => {
        const [form, plot, meaning] = pick(rand, [
          ['y = axⁿ', 'lg y against lg x: lg y = n lg x + lg a', 'Gradient = n, y-intercept = lg a'],
          ['y = abˣ', 'lg y against x: lg y = x lg b + lg a', 'Gradient = lg b, y-intercept = lg a'],
          ['y = ax² + b', 'y against x²', 'Gradient = a, y-intercept = b'],
          ['xy = a + bx', 'xy against x', 'Gradient = b, y-intercept = a'],
          ['y = aeᵏˣ', 'ln y against x: ln y = kx + ln a', 'Gradient = k, y-intercept = ln a'],
        ]);
        return {
          question: `To show ${form} as a straight line, what should you plot, and what do the gradient and intercept give?`,
          answer: `Plot ${plot}. ${meaning}.`,
          working: '',
        };
      },
    },
  },
  {
    id: 'am-g2-11', difficulty: 'hard',
    question: 'A graph of lg y against lg x is a straight line with gradient 2 and lg y-intercept 0.5. Express y in terms of x.',
    answer: 'y = 3.16x²',
    working: 'lg y = 2 lg x + 0.5 → y = 10^0.5 × x² = 3.16x²',
    vary: {
      make: rand => {
        const n = pick(rand, [2, 3, -1, -2]);
        const c = pick(rand, [0.2, 0.3, 0.5, 0.6, 0.8, 1.2]);
        const a = 10 ** c;
        const xPart = n === 1 ? 'x' : `x${sup(n)}`;
        return {
          question: `A graph of lg y against lg x is a straight line with gradient ${num(n)} and lg y-intercept ${c}. Express y in terms of x.`,
          answer: `y = ${sf3(a)}${xPart}`,
          working: `lg y = ${num(n)} lg x + ${c} → y = 10^${c} × ${xPart} = ${sf3(a)}${xPart}`,
        };
      },
    },
  },
  {
    id: 'am-g2-12', difficulty: 'medium',
    question: 'ABCD is a parallelogram with A(1, 1), B(5, 2) and C(6, 5). Find D.',
    answer: 'D(2, 4)',
    working: 'The diagonals bisect each other, so A + C = B + D → D = (1 + 6 − 5, 1 + 5 − 2) = (2, 4)',
    vary: {
      make: rand => {
        const [A, B, C] = [[rand(-5, 5), rand(-5, 5)], [rand(-5, 5), rand(-5, 5)], [rand(-5, 5), rand(-5, 5)]];
        const D = [A[0] + C[0] - B[0], A[1] + C[1] - B[1]];
        return {
          question: `ABCD is a parallelogram with A${point(...A)}, B${point(...B)} and C${point(...C)}. Find D.`,
          answer: `D${point(...D)}`,
          working: `The diagonals bisect each other, so A + C = B + D → D = ${point(...D)}`,
        };
      },
    },
  },
]);

// ---------- G3 Proofs in plane geometry ----------

const aMathG3 = deck('G3 Proofs in plane geometry', [
  {
    id: 'am-g3-01', difficulty: 'easy',
    question: 'State the midpoint theorem.',
    answer: 'The line joining the midpoints of two sides of a triangle is parallel to the third side and half its length.',
  },
  {
    id: 'am-g3-02', difficulty: 'easy',
    question: 'In triangle ABC, M and N are the midpoints of AB and AC. BC = 14 cm. Find MN.',
    answer: '7 cm',
    working: 'Midpoint theorem: MN = ½BC = 7 cm (and MN ∥ BC)',
    vary: {
      make: rand => {
        const len = rand(3, 30);
        if (rand(0, 1) === 1) {
          return {
            question: `In triangle ABC, M and N are the midpoints of AB and AC. BC = ${2 * len} cm. Find MN.`,
            answer: `${len} cm`,
            working: `Midpoint theorem: MN = ½BC = ${len} cm (and MN ∥ BC)`,
          };
        }
        return {
          question: `In triangle ABC, M and N are the midpoints of AB and AC. MN = ${len} cm. Find BC.`,
          answer: `${2 * len} cm`,
          working: `Midpoint theorem: MN = ½BC → BC = 2 × ${len} = ${2 * len} cm`,
        };
      },
    },
  },
  {
    id: 'am-g3-03', difficulty: 'easy',
    question: 'State the tangent–chord (alternate segment) theorem.',
    answer: 'The angle between a tangent and a chord at the point of contact equals the angle in the alternate segment (the angle subtended by the chord at the circumference on the other side).',
  },
  {
    id: 'am-g3-04', difficulty: 'medium',
    question: 'TA is a tangent to a circle at A. AB is a chord and C is a point on the circle in the alternate segment. Angle TAB = 65°. Find angle ACB.',
    answer: '65°',
    working: 'Alternate segment theorem: angle ACB = angle TAB = 65°',
    vary: {
      make: rand => {
        const t = rand(25, 80);
        return {
          question: `TA is a tangent to a circle at A. AB is a chord and C is a point on the circle in the alternate segment. Angle TAB = ${t}°. Find angle ACB.`,
          answer: `${t}°`,
          working: `Alternate segment theorem: angle ACB = angle TAB = ${t}°`,
        };
      },
    },
  },
  {
    id: 'am-g3-05', difficulty: 'hard',
    question: 'TA is a tangent to a circle with centre O at A, and AB is a chord. Angle TAB = 40°. Find angle AOB.',
    answer: '80°',
    working: 'Alternate segment: the angle at the circumference on chord AB is 40°. Angle at centre = 2 × 40° = 80°',
    vary: {
      make: rand => {
        const t = rand(20, 85);
        return {
          question: `TA is a tangent to a circle with centre O at A, and AB is a chord. Angle TAB = ${t}°. Find angle AOB.`,
          answer: `${2 * t}°`,
          working: `Alternate segment: the angle at the circumference on chord AB is ${t}°. Angle at centre = 2 × ${t}° = ${2 * t}°`,
        };
      },
    },
  },
  {
    id: 'am-g3-06', difficulty: 'hard',
    question: 'In triangle ABC, D is on AB and E is on AC with DE ∥ BC. AD = 4 cm, AB = 10 cm and AE = 6 cm. Find AC.',
    answer: '15 cm',
    working: 'Triangles ADE and ABC are similar (corresponding angles, DE ∥ BC) → AD/AB = AE/AC → 4/10 = 6/AC → AC = 15 cm',
    vary: {
      make: rand => {
        const [p, q] = pick(rand, [[2, 5], [3, 5], [2, 3], [3, 4], [4, 5], [1, 3]]);
        const [s, t] = [rand(1, 4), rand(1, 4)];
        return {
          question: `In triangle ABC, D is on AB and E is on AC with DE ∥ BC. AD = ${p * s} cm, AB = ${q * s} cm and AE = ${p * t} cm. Find AC.`,
          answer: `${q * t} cm`,
          working: `Triangles ADE and ABC are similar (corresponding angles, DE ∥ BC) → AD/AB = AE/AC → ${p * s}/${q * s} = ${p * t}/AC → AC = ${q * t} cm`,
        };
      },
    },
  },
  {
    id: 'am-g3-07', difficulty: 'medium',
    question: 'In a geometry proof, how do you show that two triangles are similar?',
    answer: 'Show two pairs of equal angles (AA), giving a reason for each, e.g. "common angle", "vertically opposite angles", "alternate angles, AB ∥ CD" or "angles in the same segment". Then state "triangles are similar (AA)".',
  },
  {
    id: 'am-g3-08', difficulty: 'medium',
    question: 'Give three ways to prove that a quadrilateral is a parallelogram.',
    answer: 'Any three of: both pairs of opposite sides are parallel; both pairs of opposite sides are equal; one pair of opposite sides is equal AND parallel; the diagonals bisect each other; both pairs of opposite angles are equal.',
  },
  {
    id: 'am-g3-09', difficulty: 'hard',
    question: 'How can you prove that four points lie on a circle (are concyclic)?',
    answer: 'Show that a pair of opposite angles of the quadrilateral add up to 180° (converse of the cyclic quadrilateral property), or that two angles standing on the same segment are equal (converse of angles in the same segment).',
  },
  {
    id: 'am-g3-10', difficulty: 'hard',
    question: 'How can you prove that a line is a tangent to a circle?',
    answer: 'Show that the line is perpendicular to the radius at the point where it meets the circle, or use the converse of the alternate segment theorem (the angle between the line and a chord equals the angle in the alternate segment).',
  },
  {
    id: 'am-g3-11', difficulty: 'easy',
    question: 'How should each statement in a geometry proof be written?',
    answer: 'Every statement needs a reason in brackets using a standard property, e.g. "∠ABC = ∠ADC (∠s in same segment)" or "∠PQR = 90° (tangent ⟂ radius)". Finish by clearly stating what was to be proved.',
  },
]);

// ---------- C1 Differentiation and integration ----------

// x with a power: xPow(1) → "x", xPow(3) → "x³"
const xPow = k => (k === 1 ? 'x' : `x${sup(k)}`);

// Small subscript / superscript digits for integral limits: ∫₁³
const SUB_DIGITS = '₀₁₂₃₄₅₆₇₈₉';
const SUP_DIGITS = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const limits = (a, b) => `∫${SUB_DIGITS[a]}${SUP_DIGITS[b]}`;

// "3 sin 2x" style: coefficient (hidden if 1, "−" if −1), function, inner "ax"
function trigTerm(c, fn, a) {
  const lead = c === 1 ? '' : c === -1 ? '−' : `${num(c)} `;
  return `${lead}${fn} ${a === 1 ? '' : a}x`;
}

const aMathC1 = deck('C1 Differentiation and integration', [
  {
    id: 'am-c1-01', difficulty: 'easy',
    question: 'Differentiate y = 3x⁴ − 5x² + 7x − 2 with respect to x.',
    answer: 'dy/dx = 12x³ − 10x + 7',
    working: 'Multiply by the power, then reduce the power by 1: 4 × 3x³ − 2 × 5x + 7',
    vary: {
      make: rand => {
        const [a, b, c, d, e] = [nonZero(rand, 5), rand(-6, 6), rand(-9, 9), nonZero(rand, 9), rand(-9, 9)];
        return {
          question: `Differentiate y = ${poly([[a, 'x⁴'], [b, 'x³'], [c, 'x²'], [d, 'x'], [e, '']])} with respect to x.`,
          answer: `dy/dx = ${poly([[4 * a, 'x³'], [3 * b, 'x²'], [2 * c, 'x'], [d, '']])}`,
          working: 'Multiply by the power, then reduce the power by 1 (the constant term disappears)',
        };
      },
    },
  },
  {
    id: 'am-c1-02', difficulty: 'medium',
    question: 'Differentiate y = 4/x² with respect to x.',
    answer: 'dy/dx = −8/x³',
    working: 'y = 4x⁻² → dy/dx = −8x⁻³ = −8/x³',
    vary: {
      make: rand => {
        // Coefficient in front of x: 1 → "", −1 → "−"
        const lead = c => (c === 1 ? '' : c === -1 ? '−' : num(c));
        if (rand(0, 1) === 1) {
          const a = nonZero(rand, 6);
          const k = rand(1, 3);
          return {
            question: `Differentiate y = ${num(a)}/${xPow(k)} with respect to x.`,
            answer: `dy/dx = ${num(-a * k)}/${xPow(k + 1)}`,
            working: `y = ${lead(a)}x${sup(-k)} → dy/dx = ${lead(-a * k)}x${sup(-k - 1)} = ${num(-a * k)}/${xPow(k + 1)}`,
          };
        }
        const a = 2 * rand(1, 5);
        return {
          question: `Differentiate y = ${a}√x with respect to x.`,
          answer: `dy/dx = ${a / 2}/√x`,
          working: `y = ${a}x^(1/2) → dy/dx = ${lead(a / 2)}x^(−1/2) = ${a / 2}/√x`,
        };
      },
    },
  },
  {
    id: 'am-c1-03', difficulty: 'medium',
    question: 'Differentiate y = (2x + 3)⁵ with respect to x.',
    answer: 'dy/dx = 10(2x + 3)⁴',
    working: 'Chain rule: 5(2x + 3)⁴ × 2',
    vary: {
      make: rand => {
        const [a, b] = [nonZero(rand, 5), nonZero(rand, 7)];
        const n = rand(3, 7);
        return {
          question: `Differentiate y = ${lin(a, b)}${sup(n)} with respect to x.`,
          answer: `dy/dx = ${num(n * a)}${lin(a, b)}${sup(n - 1)}`,
          working: `Chain rule: ${n}${lin(a, b)}${sup(n - 1)} × ${a < 0 ? `(${num(a)})` : a}`,
        };
      },
    },
  },
  {
    id: 'am-c1-04', difficulty: 'hard',
    question: 'Differentiate y = x(2x + 1)³, giving your answer in factorised form.',
    answer: 'dy/dx = (2x + 1)²(8x + 1)',
    working: 'Product rule: (2x + 1)³ + x × 3(2x + 1)² × 2 = (2x + 1)²[(2x + 1) + 6x]',
    vary: {
      make: rand => {
        const [a, b] = [rand(1, 4), nonZero(rand, 5)];
        const n = rand(2, 5);
        const power = n - 1 === 1 ? '' : sup(n - 1);
        const g = gcd((n + 1) * a, b); // take any common factor out of the last bracket
        const factored = `${g === 1 ? '' : g}${lin(a, b)}${power}${lin(((n + 1) * a) / g, b / g)}`;
        return {
          question: `Differentiate y = x${lin(a, b)}${sup(n)}, giving your answer in factorised form.`,
          answer: `dy/dx = ${factored}`,
          working: `Product rule: ${lin(a, b)}${sup(n)} + x × ${n}${lin(a, b)}${power} × ${a} = ${lin(a, b)}${power}[${lin(a, b)} + ${n * a}x] = ${factored}`,
        };
      },
    },
  },
  {
    id: 'am-c1-05', difficulty: 'hard',
    question: 'Differentiate y = x/(2x + 1) with respect to x.',
    answer: 'dy/dx = 1/(2x + 1)²',
    working: 'Quotient rule: [(2x + 1)(1) − x(2)] / (2x + 1)² = 1/(2x + 1)²',
    vary: {
      make: rand => {
        let p, q, r, s;
        do { [p, q, r, s] = [rand(1, 4), rand(-5, 5), rand(1, 4), nonZero(rand, 5)]; } while (p * s - q * r === 0);
        const top = poly([[p, 'x'], [q, '']]);
        return {
          question: `Differentiate y = (${top})/${lin(r, s)} with respect to x.`,
          answer: `dy/dx = ${num(p * s - q * r)}/${lin(r, s)}²`,
          working: `Quotient rule: [${lin(r, s)}(${p}) − (${top})(${r})] / ${lin(r, s)}² = ${num(p * s - q * r)}/${lin(r, s)}²`,
        };
      },
    },
  },
  {
    id: 'am-c1-06', difficulty: 'medium',
    question: 'Differentiate y = 3 sin 2x with respect to x.',
    answer: 'dy/dx = 6 cos 2x',
    working: 'd/dx(sin ax) = a cos ax → 3 × 2 cos 2x',
    vary: {
      make: rand => {
        const fn = pick(rand, ['sin', 'cos', 'tan']);
        const c = nonZero(rand, 5);
        const a = rand(1, 5);
        const result = { sin: [c * a, 'cos'], cos: [-c * a, 'sin'], tan: [c * a, 'sec²'] }[fn];
        const rule = { sin: 'd/dx(sin ax) = a cos ax', cos: 'd/dx(cos ax) = −a sin ax', tan: 'd/dx(tan ax) = a sec² ax' }[fn];
        return {
          question: `Differentiate y = ${trigTerm(c, fn, a)} with respect to x.`,
          answer: `dy/dx = ${trigTerm(result[0], result[1], a)}`,
          working: rule,
        };
      },
    },
  },
  {
    id: 'am-c1-07', difficulty: 'medium',
    question: 'Differentiate y = ln(3x + 2) with respect to x.',
    answer: 'dy/dx = 3/(3x + 2)',
    working: 'd/dx[ln f(x)] = f′(x)/f(x)',
    vary: {
      make: rand => {
        const [a, b] = [rand(1, 6), nonZero(rand, 7)];
        if (rand(0, 1) === 1) {
          return {
            question: `Differentiate y = ln${lin(a, b)} with respect to x.`,
            answer: `dy/dx = ${a}/${lin(a, b)}`,
            working: 'd/dx[ln f(x)] = f′(x)/f(x)',
          };
        }
        const c = nonZero(rand, 5);
        const exponent = poly([[a, 'x'], [b, '']]);
        return {
          question: `Differentiate y = ${c === 1 ? '' : c === -1 ? '−' : num(c)}e^(${exponent}) with respect to x.`,
          answer: `dy/dx = ${c * a === 1 ? '' : c * a === -1 ? '−' : num(c * a)}e^(${exponent})`,
          working: `d/dx[e^f(x)] = f′(x)e^f(x) → ${num(c)} × ${a}`,
        };
      },
    },
  },
  {
    id: 'am-c1-08', difficulty: 'easy',
    question: 'Find the gradient of the curve y = x³ − 4x at the point where x = 2.',
    answer: '8',
    working: 'dy/dx = 3x² − 4 → at x = 2: 12 − 4 = 8',
    vary: {
      make: rand => {
        const [a, b, c, d] = [nonZero(rand, 3), rand(-5, 5), rand(-8, 8), rand(-9, 9)];
        const x = nonZero(rand, 3);
        const g = 3 * a * x * x + 2 * b * x + c;
        return {
          question: `Find the gradient of the curve y = ${poly([[a, 'x³'], [b, 'x²'], [c, 'x'], [d, '']])} at the point where x = ${num(x)}.`,
          answer: num(g),
          working: `dy/dx = ${poly([[3 * a, 'x²'], [2 * b, 'x'], [c, '']])} → at x = ${num(x)}: ${num(g)}`,
        };
      },
    },
  },
  {
    id: 'am-c1-09', difficulty: 'medium',
    question: 'Find the equation of the tangent to y = x² − 3x + 1 at the point where x = 2.',
    answer: 'y = x − 3',
    working: 'dy/dx = 2x − 3 = 1 at x = 2. Point (2, −1). y − (−1) = 1(x − 2) → y = x − 3',
    vary: {
      make: rand => {
        const [b, c] = [rand(-6, 6), rand(-8, 8)];
        const x0 = nonZero(rand, 4);
        const y0 = x0 * x0 + b * x0 + c;
        const m = 2 * x0 + b;
        return {
          question: `Find the equation of the tangent to y = ${poly([[1, 'x²'], [b, 'x'], [c, '']])} at the point where x = ${num(x0)}.`,
          answer: `y = ${m === 0 ? num(y0) : poly([[m, 'x'], [y0 - m * x0, '']])}`,
          working: `dy/dx = ${poly([[2, 'x'], [b, '']])} = ${num(m)} at x = ${num(x0)}. Point ${point(x0, y0)}. y − ${y0 < 0 ? `(${num(y0)})` : y0} = ${num(m)}(x − ${x0 < 0 ? `(${num(x0)})` : x0})`,
        };
      },
    },
  },
  {
    id: 'am-c1-10', difficulty: 'hard',
    question: 'Find the equation of the normal to y = x² − 3x + 1 at the point where x = 2.',
    answer: 'x + y = 1',
    working: 'Tangent gradient = 1, so the normal gradient is −1. Through (2, −1): y + 1 = −(x − 2) → x + y = 1',
    vary: {
      make: rand => {
        let b, c, x0, m;
        do { [b, c, x0] = [rand(-6, 6), rand(-8, 8), nonZero(rand, 4)]; m = 2 * x0 + b; } while (m === 0);
        const y0 = x0 * x0 + b * x0 + c;
        return {
          question: `Find the equation of the normal to y = ${poly([[1, 'x²'], [b, 'x'], [c, '']])} at the point where x = ${num(x0)}.`,
          answer: generalLine(1, m, x0 + m * y0),
          working: `Tangent gradient = ${num(m)}, so the normal gradient is ${fracText(-1, m)}. Through ${point(x0, y0)} → ${generalLine(1, m, x0 + m * y0)}`,
        };
      },
    },
  },
  {
    id: 'am-c1-11', difficulty: 'hard',
    question: 'Find the stationary points of y = x³ − 3x² − 9x + 5 and determine their nature.',
    answer: '(−1, 10) is a maximum; (3, −22) is a minimum',
    working: 'dy/dx = 3x² − 6x − 9 = 3(x + 1)(x − 3) = 0. d²y/dx² = 6x − 6: negative at x = −1 (max), positive at x = 3 (min)',
    vary: {
      make: rand => {
        let p, q;
        do { [p, q] = [rand(-4, 3), rand(-3, 4)]; } while (p >= q || (p + q) % 2 !== 0);
        const b = (-3 * (p + q)) / 2;
        const c = 3 * p * q;
        const d = rand(-9, 9);
        const y = x => x ** 3 + b * x * x + c * x + d;
        return {
          question: `Find the stationary points of y = ${poly([[1, 'x³'], [b, 'x²'], [c, 'x'], [d, '']])} and determine their nature.`,
          answer: `${point(p, y(p))} is a maximum; ${point(q, y(q))} is a minimum`,
          working: `dy/dx = ${poly([[3, 'x²'], [2 * b, 'x'], [c, '']])} = 3${lin(1, -p)}${lin(1, -q)} = 0. d²y/dx² = ${poly([[6, 'x'], [2 * b, '']])}: negative at x = ${num(p)} (max), positive at x = ${num(q)} (min)`,
        };
      },
    },
  },
  {
    id: 'am-c1-12', difficulty: 'medium',
    question: 'Find the range of values of x for which y = x³ − 3x² is decreasing.',
    answer: '0 < x < 2',
    working: 'dy/dx = 3x² − 6x = 3x(x − 2) < 0 → 0 < x < 2',
    vary: {
      make: rand => {
        let p, q;
        do { [p, q] = [rand(-4, 3), rand(-3, 4)]; } while (p >= q || (p + q) % 2 !== 0);
        const b = (-3 * (p + q)) / 2;
        const c = 3 * p * q;
        const decreasing = rand(0, 1) === 1;
        return {
          question: `Find the range of values of x for which y = ${poly([[1, 'x³'], [b, 'x²'], [c, 'x']])} is ${decreasing ? 'decreasing' : 'increasing'}.`,
          answer: decreasing ? `${num(p)} < x < ${num(q)}` : `x < ${num(p)} or x > ${num(q)}`,
          working: `dy/dx = ${poly([[3, 'x²'], [2 * b, 'x'], [c, '']])} = 3${lin(1, -p)}${lin(1, -q)} ${decreasing ? '<' : '>'} 0`,
        };
      },
    },
  },
  {
    id: 'am-c1-13', difficulty: 'hard',
    question: 'The radius of a circle increases at 0.2 cm/s. Find the rate of increase of its area when the radius is 5 cm.',
    answer: '2π ≈ 6.28 cm²/s',
    working: 'A = πr² → dA/dr = 2πr. dA/dt = dA/dr × dr/dt = 2π(5)(0.2) = 2π',
    vary: {
      make: rand => {
        if (rand(0, 1) === 1) {
          const r = rand(2, 12);
          const rate = pick(rand, [0.1, 0.2, 0.3, 0.4, 0.5]);
          const k = Number((2 * r * rate).toFixed(4));
          return {
            question: `The radius of a circle increases at ${rate} cm/s. Find the rate of increase of its area when the radius is ${r} cm.`,
            answer: `${k === 1 ? '' : k}π ≈ ${sf3(k * Math.PI)} cm²/s`,
            working: `A = πr² → dA/dr = 2πr. dA/dt = dA/dr × dr/dt = 2π(${r})(${rate}) = ${k === 1 ? '' : k}π`,
          };
        }
        const r = rand(2, 10);
        const dV = 10 * rand(1, 20);
        const dr = dV / (4 * Math.PI * r * r);
        return {
          question: `Air is pumped into a spherical balloon at ${dV} cm³/s. Find the rate at which the radius is increasing when the radius is ${r} cm.`,
          answer: `${sf3(dr)} cm/s`,
          working: `V = 4/3 πr³ → dV/dr = 4πr² = ${4 * r * r}π. dr/dt = dV/dt ÷ dV/dr = ${dV} ÷ ${4 * r * r}π = ${sf3(dr)}`,
        };
      },
    },
  },
  {
    id: 'am-c1-14', difficulty: 'easy',
    question: 'Find ∫(6x² − 4x + 3) dx.',
    answer: '2x³ − 2x² + 3x + c',
    working: 'Increase each power by 1 and divide by the new power; add the constant c',
    vary: {
      make: rand => {
        const [A, B, C] = [nonZero(rand, 4), rand(-5, 5), nonZero(rand, 9)];
        return {
          question: `Find ∫(${poly([[3 * A, 'x²'], [2 * B, 'x'], [C, '']])}) dx.`,
          answer: `${poly([[A, 'x³'], [B, 'x²'], [C, 'x']])} + c`,
          working: 'Increase each power by 1 and divide by the new power; add the constant c',
        };
      },
    },
  },
  {
    id: 'am-c1-15', difficulty: 'medium',
    question: 'Find ∫(2x + 1)⁴ dx.',
    answer: '(2x + 1)⁵/10 + c',
    working: '∫(ax + b)ⁿ dx = (ax + b)ⁿ⁺¹ / [a(n + 1)] + c → (2x + 1)⁵ / (2 × 5)',
    vary: {
      make: rand => {
        const [a, b] = [rand(1, 5), nonZero(rand, 7)];
        const n = rand(2, 6);
        return {
          question: `Find ∫${lin(a, b)}${sup(n)} dx.`,
          answer: `${lin(a, b)}${sup(n + 1)}/${a * (n + 1)} + c`,
          working: `∫(ax + b)ⁿ dx = (ax + b)ⁿ⁺¹ / [a(n + 1)] + c → ${lin(a, b)}${sup(n + 1)} / (${a} × ${n + 1})`,
        };
      },
    },
  },
  {
    id: 'am-c1-16', difficulty: 'medium',
    question: 'Find ∫cos 2x dx.',
    answer: '(1/2)sin 2x + c',
    working: '∫cos ax dx = (1/a) sin ax + c',
    vary: {
      make: rand => {
        const kind = pick(rand, ['cos', 'sin', 'exp', 'recip']);
        const a = rand(2, 5);
        const k = rand(1, 6);
        // (k/a) in front of the answer: "(3/2)sin 2x", "2 sin 2x", "−cos 3x", "2e^(3x)"
        const coef = (top, letters) => {
          const f = frac(top, a);
          const size = Math.abs(f.n);
          const gap = /^(sin|cos)/.test(letters) ? ' ' : '';
          const body = f.d === 1 ? (size === 1 ? letters : `${size}${gap}${letters}`) : `(${size}/${f.d})${letters}`;
          return (f.n < 0 ? '−' : '') + body;
        };
        const lead = k === 1 ? '' : `${k} `;
        if (kind === 'cos') return { question: `Find ∫${lead}cos ${a}x dx.`, answer: `${coef(k, `sin ${a}x`)} + c`, working: '∫cos ax dx = (1/a) sin ax + c' };
        if (kind === 'sin') return { question: `Find ∫${lead}sin ${a}x dx.`, answer: `${coef(-k, `cos ${a}x`)} + c`, working: '∫sin ax dx = −(1/a) cos ax + c' };
        if (kind === 'exp') return { question: `Find ∫${k === 1 ? '' : k}e^(${a}x) dx.`, answer: `${coef(k, `e^(${a}x)`)} + c`, working: '∫e^(ax) dx = (1/a) e^(ax) + c' };
        const b = nonZero(rand, 6);
        return { question: `Find ∫${k}/${lin(a, b)} dx, where ${poly([[a, 'x'], [b, '']])} > 0.`, answer: `${coef(k, `ln${lin(a, b)}`)} + c`, working: '∫1/(ax + b) dx = (1/a) ln(ax + b) + c' };
      },
    },
  },
  {
    id: 'am-c1-17', difficulty: 'medium',
    question: 'Evaluate ∫₁³ (3x² − 2x) dx.',
    answer: '18',
    working: '[x³ − x²] from 1 to 3 = (27 − 9) − (1 − 1) = 18',
    vary: {
      make: rand => {
        const [A, B, C] = [nonZero(rand, 3), rand(-4, 4), rand(-6, 6)];
        const lo = rand(0, 2);
        const hi = rand(lo + 1, 4);
        const F = x => A * x ** 3 + B * x * x + C * x;
        return {
          question: `Evaluate ${limits(lo, hi)} (${poly([[3 * A, 'x²'], [2 * B, 'x'], [C, '']])}) dx.`,
          answer: num(F(hi) - F(lo)),
          working: `[${poly([[A, 'x³'], [B, 'x²'], [C, 'x']])}] from ${lo} to ${hi} = (${num(F(hi))}) − (${num(F(lo))}) = ${num(F(hi) - F(lo))}`,
        };
      },
    },
  },
  {
    id: 'am-c1-18', difficulty: 'medium',
    question: 'How do you find the area between a curve and the x-axis when part of the curve is below the axis?',
    answer: 'Find where the curve crosses the x-axis. Integrate each part separately: an integral over a part below the axis is negative, so take its absolute value. Add the absolute values together.',
  },
  {
    id: 'am-c1-19', difficulty: 'hard',
    question: 'A particle moves with velocity v = 3t² − 12t + 9 m/s. Find the times when it is at rest and its acceleration at t = 2.',
    answer: 'At rest when t = 1 s and t = 3 s; acceleration at t = 2 is 0 m/s²',
    working: 'v = 3(t − 1)(t − 3) = 0. a = dv/dt = 6t − 12 → at t = 2: 0',
    vary: {
      make: rand => {
        let p, q;
        do { [p, q] = [rand(1, 4), rand(2, 6)]; } while (p >= q);
        const T = rand(0, 6);
        const acc = 6 * T - 3 * (p + q);
        return {
          question: `A particle moves with velocity v = ${poly([[3, 't²'], [-3 * (p + q), 't'], [3 * p * q, '']])} m/s. Find the times when it is at rest and its acceleration at t = ${T}.`,
          answer: `At rest when t = ${p} s and t = ${q} s; acceleration at t = ${T} is ${num(acc)} m/s²`,
          working: `v = 3${lin(1, -p, 't')}${lin(1, -q, 't')} = 0. a = dv/dt = ${poly([[6, 't'], [-3 * (p + q), '']])} → at t = ${T}: ${num(acc)}`,
        };
      },
    },
  },
  {
    id: 'am-c1-20', difficulty: 'medium',
    question: 'A curve has gradient dy/dx = 6x − 4 and passes through (1, 5). Find its equation.',
    answer: 'y = 3x² − 4x + 6',
    working: 'y = ∫(6x − 4) dx = 3x² − 4x + c. At (1, 5): 5 = 3 − 4 + c → c = 6',
    vary: {
      make: rand => {
        const [a, b] = [nonZero(rand, 4), rand(-6, 6)];
        const [x0, y0] = [rand(-3, 3), rand(-9, 9)];
        const c = y0 - a * x0 * x0 - b * x0;
        return {
          question: `A curve has gradient dy/dx = ${poly([[2 * a, 'x'], [b, '']])} and passes through ${point(x0, y0)}. Find its equation.`,
          answer: `y = ${poly([[a, 'x²'], [b, 'x'], [c, '']])}`,
          working: `y = ${poly([[a, 'x²'], [b, 'x']])} + c. At ${point(x0, y0)}: ${num(y0)} = ${num(a * x0 * x0 + b * x0)} + c → c = ${num(c)}`,
        };
      },
    },
  },
  {
    id: 'am-c1-21', difficulty: 'medium',
    question: 'How do you use the second derivative to decide the nature of a stationary point?',
    answer: 'At a stationary point (dy/dx = 0): if d²y/dx² > 0 it is a minimum; if d²y/dx² < 0 it is a maximum. If d²y/dx² = 0, check the sign of dy/dx on either side instead.',
  },
  {
    id: 'am-c1-22', difficulty: 'easy',
    question: 'How are displacement s, velocity v and acceleration a related in kinematics?',
    answer: 'v = ds/dt and a = dv/dt (differentiate to go s → v → a).\ns = ∫v dt and v = ∫a dt (integrate to go back). A particle is at rest when v = 0.',
  },
]);

// ---------- All O Level A-Math decks (the keys are used by data/syllabus.js) ----------
export const oLevelAMathDecks = {
  'o-amath-a1': aMathA1,
  'o-amath-a2': aMathA2,
  'o-amath-a3': aMathA3,
  'o-amath-a4': aMathA4,
  'o-amath-a5': aMathA5,
  'o-amath-a6': aMathA6,
  'o-amath-g1': aMathG1,
  'o-amath-g2': aMathG2,
  'o-amath-g3': aMathG3,
  'o-amath-c1': aMathC1,
};
