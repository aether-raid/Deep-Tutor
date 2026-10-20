// A Level H2 Mathematics (9758) — Topic 1 Functions and graphs, Topic 2 Sequences and series
// Lives at: src/features/flashcards/data/decks/a-h2-math-1-2.js
//
// Scope follows the official SEAB 9758 H2 Mathematics syllabus (2026/2027), sub-topics 1.1, 1.2, 1.3 and 2.1,
// including its exclusions (e.g. no (fg)⁻¹ = g⁻¹f⁻¹, no domain restriction for composite functions).
// Every question is ORIGINAL (A Level style, not copied from past papers or school prelims).
// Number questions are built by code, so the printed answer always matches the question.
// Definitions in quotation marks are verbatim from the free OpenStax textbooks
// (Precalculus 2e / Algebra and Trigonometry 2e); each card's "ref" says which.

import { deck, pick } from './helpers.js';
import { MINUS, coefTimes, frac, fracText, gcd, linear, num, par, polyText, sup } from './math-tools.js';

const SYLLABUS = section => `SEAB H2 Mathematics 9758 syllabus, ${section}`;
const PRECALC = chapter => `OpenStax Precalculus 2e, ch. ${chapter}`;

// Builds a NUMBER card: the original card and every variation come from the same build() function.
function numberCard(id, difficulty, ref, build, defaults, makeValues, seconds) {
  return {
    id, difficulty, ref, ...(seconds ? { seconds } : {}),
    ...build(defaults),
    vary: { make: rand => build(makeValues(rand)) },
  };
}

const nonZero = (rand, min, max) => {
  let n = 0;
  while (n === 0) n = rand(min, max);
  return n;
};

// ---------- Small exact-fraction toolkit (fractions are { n, d }) ----------
const F = (n, d = 1) => frac(n, d);
const add = (a, b) => F(a.n * b.d + b.n * a.d, a.d * b.d);
const mul = (a, b) => F(a.n * b.n, a.d * b.d);
const less = (a, b) => a.n * b.d < b.n * a.d;
const value = a => a.n / a.d;
const ft = a => fracText(a.n, a.d);

// "x < −2 or 1/3 < x < 4" from a list of open intervals [[lo, hi], …] (null = infinity)
function intervalsText(intervals, v = 'x') {
  return intervals.map(([lo, hi]) => {
    if (lo === null && hi === null) return `all real ${v}`;
    if (lo === null) return `${v} < ${ft(hi)}`;
    if (hi === null) return `${v} > ${ft(lo)}`;
    return `${ft(lo)} < ${v} < ${ft(hi)}`;
  }).join(' or ');
}

// Solves sign(expression) > 0 (or < 0) by testing a point in each interval between critical values.
function solveBySign(criticals, signAt, wantPositive) {
  const points = [...criticals].sort((a, b) => value(a) - value(b));
  const edges = [null, ...points, null];
  const result = [];
  for (let i = 0; i < edges.length - 1; i++) {
    const lo = edges[i];
    const hi = edges[i + 1];
    const test = lo === null ? value(hi) - 1 : hi === null ? value(lo) + 1 : (value(lo) + value(hi)) / 2;
    if ((signAt(test) > 0) === wantPositive) result.push([lo, hi]);
  }
  // Merge neighbouring intervals (only happens if a critical value is not a sign change).
  return result;
}

// =====================================================================
// 1.1 Functions
// =====================================================================

const h1_1 = deck('1.1 Functions', [
  {
    id: 'h11-c1', difficulty: 'easy', ref: `${PRECALC(1)}; ${SYLLABUS('1.1')}`,
    question: 'Define a function, its domain and its range.',
    answer: 'A function is "a relation in which each input value yields a unique output value".\nDomain: "the set of all possible input values for a relation".\nRange: "the set of output values that result from the input values in a relation".',
    alternates: [
      { question: 'Is the relation x ↦ ±√x (x ≥ 0) a function? Explain.', answer: 'No. Each positive input gives two outputs, but a function must give each input a unique output.' },
      { question: 'State the range of f(x) = x² + 3, x ∈ ℝ.', answer: 'R_f = [3, ∞), since x² ≥ 0 for all real x.' },
      { question: 'Fill the gap: the ___ of a function is the set of all possible input values.', answer: 'Domain.' },
    ],
  },
  {
    id: 'h11-c2', difficulty: 'medium', ref: `${PRECALC(1)}; ${SYLLABUS('1.1')}`,
    question: 'State the conditions for f⁻¹ and for the composite fg to exist. How are the graphs of f and f⁻¹ related?',
    answer: 'f⁻¹ exists ⇔ f is one-to-one ("a function for which each value of the output is associated with a unique input value") — check with the horizontal line test.\nfg exists ⇔ R_g ⊆ D_f.\nThe graph of y = f⁻¹(x) is the reflection of y = f(x) in the line y = x, with D_f⁻¹ = R_f and R_f⁻¹ = D_f.',
    alternates: [
      { question: 'Describe the horizontal line test.', answer: '"A method of testing whether a function is one-to-one by determining whether any horizontal line intersects the graph more than once." If any horizontal line cuts the graph more than once, f is not one-to-one.' },
      { question: 'f(x) = √x (x ≥ 0) and g(x) = x − 5 (x ∈ ℝ). Does fg exist? Explain.', answer: 'No. R_g = ℝ is not a subset of D_f = [0, ∞) — for example g(0) = −5 is not in the domain of f.' },
      { question: 'f is one-to-one, with domain [1, 4] and range [2, 9]. State the domain and range of f⁻¹.', answer: 'D_f⁻¹ = [2, 9] (= R_f) and R_f⁻¹ = [1, 4] (= D_f).' },
    ],
  },
  numberCard('h11-n1', 'hard', SYLLABUS('1.1'),
    ({ a, b, c, d }) => {
      // f(x) = (ax + b)/(cx + d) → f⁻¹(x) = (b − dx)/(cx − a), domain x ≠ a/c (the range of f)
      const excluded = F(a, c);
      const fText = `(${linear(a, b)})/(${linear(c, d)})`;
      const invText = `(${linear(-d, b)})/(${linear(c, -a)})`;
      return {
        question: `f(x) = ${fText}, x ∈ ℝ, x ≠ ${ft(F(-d, c))}. Find f⁻¹(x) and state the domain of f⁻¹.`,
        answer: `f⁻¹(x) = ${invText}, x ∈ ℝ, x ≠ ${ft(excluded)}`,
        working: `Let y = ${fText} → y(${linear(c, d)}) = ${linear(a, b)} → ${polyText([{ c, v: 'xy' }, { c: -a, v: 'x' }])} = ${linear(-d, b, 'y')} → x(${linear(c, -a, 'y')}) = ${linear(-d, b, 'y')} → x = (${linear(-d, b, 'y')})/(${linear(c, -a, 'y')}). D_f⁻¹ = R_f = ℝ \\ {${ft(excluded)}} (the horizontal asymptote of y = f(x) is y = ${ft(excluded)}).`,
      };
    },
    { a: 2, b: 1, c: 1, d: -3 },
    rand => {
      let v;
      do {
        v = { a: nonZero(rand, -5, 5), b: nonZero(rand, -6, 6), c: rand(1, 3), d: nonZero(rand, -6, 6) };
      } while (v.a * v.d - v.b * v.c === 0 || v.a === -v.d || gcd(gcd(v.a, v.b), gcd(v.c, v.d)) !== 1); // not constant, not self-inverse, already simplified
      return v;
    },
    90),
  numberCard('h11-n2', 'hard', SYLLABUS('1.1'),
    ({ a, c }) => {
      const exists = c > a;
      return {
        question: `f(x) = ln(${linear(1, -a)}), x > ${num(a)}, and g(x) = ${polyText([{ c: 1, v: 'x²' }, { c, v: '' }])}, x ∈ ℝ. Determine whether fg exists. If it does, find fg(x) and its range.`,
        answer: exists
          ? `fg exists, since R_g = [${num(c)}, ∞) ⊆ D_f = (${num(a)}, ∞). fg(x) = ln(x² + ${c - a}), with range [ln ${c - a}, ∞)${c - a === 1 ? ', i.e. [0, ∞)' : ''}.`
          : `fg does not exist: R_g = [${num(c)}, ∞) is not a subset of D_f = (${num(a)}, ∞) — e.g. g(0) = ${num(c)} is not in D_f.`,
        working: exists
          ? `fg(x) = f(${polyText([{ c: 1, v: 'x²' }, { c, v: '' }])}) = ln(${polyText([{ c: 1, v: 'x²' }, { c, v: '' }])} − ${par(a)}) = ln(x² + ${c - a}). The smallest value of x² + ${c - a} is ${c - a} (at x = 0), and ln is increasing, so R_fg = [ln ${c - a}, ∞).`
          : `For fg to exist we need R_g ⊆ D_f. R_g = [${num(c)}, ∞) contains ${num(c)}, but ${num(c)} ≤ ${num(a)} is outside D_f.`,
      };
    },
    { a: 1, c: 4 },
    rand => ({ a: nonZero(rand, -3, 4), c: rand(-3, 6) }),
    90),
  numberCard('h11-n3', 'hard', SYLLABUS('1.1'),
    ({ h, k }) => ({
      question: `f(x) = ${polyText([{ c: 1, v: 'x²' }, { c: -2 * h, v: 'x' }, { c: h * h + k, v: '' }])}, x ∈ ℝ. (a) Explain why f⁻¹ does not exist. (b) The domain is restricted to x ≤ a. State the largest value of a for which f⁻¹ exists, and find f⁻¹(x) for this domain.`,
      answer: `(a) f is not one-to-one: e.g. f(${num(h - 1)}) = f(${num(h + 1)}) = ${num(1 + k)}. (b) a = ${num(h)}; f⁻¹(x) = ${num(h)} − √(x ${k < 0 ? '+' : MINUS} ${Math.abs(k)}), x ≥ ${num(k)}`,
      working: `Complete the square: f(x) = (x ${h < 0 ? '+' : MINUS} ${Math.abs(h)})² ${k < 0 ? MINUS : '+'} ${Math.abs(k)} — a parabola with vertex (${num(h)}, ${num(k)}). It is one-to-one for x ≤ ${num(h)}. y = (x − ${par(h)})² + ${par(k)} → x − ${par(h)} = −√(y − ${par(k)}) (negative root because x ≤ ${num(h)}) → f⁻¹(x) = ${num(h)} − √(x − ${par(k)}); D_f⁻¹ = R_f = [${num(k)}, ∞).`,
    }),
    { h: 3, k: -2 },
    rand => ({ h: nonZero(rand, -5, 5), k: nonZero(rand, -6, 6) }),
    90),
  numberCard('h11-n4', 'hard', SYLLABUS('1.1'),
    ({ p, q }) => ({
      question: `f(x) = (x² + ${p * q})/${p + q}, x ≥ 0. Find the exact values of x for which f(x) = f⁻¹(x).`,
      answer: `x = ${Math.min(p, q)} or x = ${Math.max(p, q)}`,
      working: `f is increasing for x ≥ 0, so the graphs of f and f⁻¹ meet on the line y = x. Solve f(x) = x: x² + ${p * q} = ${p + q}x → x² − ${p + q}x + ${p * q} = 0 → (x − ${p})(x − ${q}) = 0.`,
    }),
    { p: 2, q: 5 },
    rand => {
      const p = rand(1, 6);
      let q = p;
      while (q === p) q = rand(1, 8);
      return { p, q };
    },
    60),
]);

// =====================================================================
// 1.2 Graphs and transformations
// =====================================================================

const h1_2 = deck('1.2 Graphs and transformations', [
  {
    id: 'h12-c1', difficulty: 'medium', ref: `${PRECALC(3)}; ${SYLLABUS('1.2')}`,
    question: 'What are vertical and horizontal asymptotes? How do you find the asymptotes of y = (ax² + bx + c)/(dx + e)?',
    answer: 'Vertical asymptote: "a vertical line x = a where the graph tends toward positive or negative infinity as the inputs approach a".\nHorizontal asymptote: "a horizontal line y = b where the graph approaches the line as the inputs increase or decrease without bound."\nFor (ax² + bx + c)/(dx + e): vertical asymptote x = −e/d (provided the numerator ≠ 0 there); divide to get y = (px + q) + r/(dx + e) — the oblique asymptote is y = px + q.',
    alternates: [
      { question: 'State the asymptotes of y = (3x − 1)/(x + 2).', answer: 'Vertical: x = −2. Horizontal: y = 3.' },
      { question: 'Why does y = (x² + 1)/(x − 1) have an oblique (slant) asymptote and not a horizontal one?', answer: 'The numerator\'s degree is one more than the denominator\'s, so y = x + 1 + 2/(x − 1): as x → ±∞, y → x + 1, a sloping line.' },
      { question: 'True or false: a graph can never cross its horizontal asymptote. Explain.', answer: 'False. An asymptote describes behaviour as x → ±∞ (or near a vertical line); the curve may cross a horizontal or oblique asymptote at finite x.' },
    ],
  },
  {
    id: 'h12-c2', difficulty: 'medium', ref: `${PRECALC(1)}; ${SYLLABUS('1.2')}`,
    question: 'Describe the transformations from y = f(x) to (a) y = f(x) + a, (b) y = f(x + a), (c) y = af(x), (d) y = f(ax).',
    answer: '(a) Translation by a units in the positive y-direction.\n(b) Translation by a units in the NEGATIVE x-direction.\n(c) Scaling parallel to the y-axis by factor a (a > 0).\n(d) Scaling parallel to the x-axis by factor 1/a.',
    alternates: [
      { question: 'What single transformation maps y = f(x) onto y = f(−x)?', answer: 'Reflection in the y-axis — a "horizontal reflection": it "reflects a function\'s graph across the y-axis by multiplying the input by −1".' },
      { question: 'A point (4, 6) lies on y = f(x). Find the corresponding point on y = f(2x).', answer: '(2, 6) — x-coordinates are scaled by factor 1/2.' },
      { question: 'True or false: y = f(x − 3) is y = f(x) translated 3 units to the left. Explain.', answer: 'False. It is a translation 3 units in the positive x-direction (to the right).' },
    ],
  },
  {
    id: 'h12-c3', difficulty: 'hard', ref: SYLLABUS('1.2'),
    question: 'How are the graphs of y = |f(x)|, y = f(|x|) and y = 1/f(x) obtained from y = f(x)?',
    answer: 'y = |f(x)|: keep the parts with y ≥ 0, reflect the parts below the x-axis in the x-axis.\ny = f(|x|): delete the part for x < 0, then reflect the part for x ≥ 0 in the y-axis (the graph becomes symmetric about the y-axis).\ny = 1/f(x): zeros of f become vertical asymptotes; vertical asymptotes of f give points where 1/f → 0; a maximum point (a, b) (b ≠ 0) becomes a minimum point (a, 1/b), and vice versa; y = k (k ≠ 0) asymptotes become y = 1/k.',
    alternates: [
      { question: 'y = f(x) has a maximum point at (2, 4). What is the corresponding point on y = 1/f(x)?', answer: 'A minimum point at (2, 1/4).' },
      { question: 'True or false: y = f(|x|) is always symmetric about the y-axis. Explain.', answer: 'True. f(|−x|) = f(|x|), so replacing x by −x gives the same y-value.' },
      { question: 'y = f(x) cuts the x-axis at x = 3. What feature does y = 1/f(x) have at x = 3?', answer: 'A vertical asymptote x = 3 (since 1/f(x) → ±∞ as f(x) → 0).' },
    ],
  },
  {
    id: 'h12-c4', difficulty: 'medium', ref: `${PRECALC(10)}; ${SYLLABUS('1.2')}`,
    question: 'For x²/a² + y²/b² = 1 and x²/a² − y²/b² = 1, name the curve and give its key features.',
    answer: 'x²/a² + y²/b² = 1 is an ellipse ("the set of all points (x, y) in a plane such that the sum of their distances from two fixed points is a constant"), centre (0, 0), intercepts (±a, 0) and (0, ±b), symmetric in both axes.\nx²/a² − y²/b² = 1 is a hyperbola, vertices (±a, 0), asymptotes y = ±(b/a)x, no y-intercepts.',
    alternates: [
      { question: 'State the asymptotes of y²/9 − x²/4 = 1.', answer: 'y = ±(3/2)x.' },
      { question: 'What curve is y² = 8x, and what is its line of symmetry?', answer: 'A parabola with vertex at the origin, symmetric about the x-axis (y = 0).' },
      { question: 'Why does x²/16 − y²/9 = 1 have no points with −4 < x < 4?', answer: 'x²/16 = 1 + y²/9 ≥ 1, so x² ≥ 16, i.e. x ≤ −4 or x ≥ 4.' },
    ],
  },
  numberCard('h12-n1', 'medium', SYLLABUS('1.2'),
    ({ a, b, c, d }) => {
      const xInt = F(-b, a);
      const yInt = F(b, d);
      return {
        question: `For the curve y = (${linear(a, b)})/(${linear(c, d)}), state the equations of the asymptotes and the coordinates of the points where it crosses the axes.`,
        answer: `Asymptotes x = ${ft(F(-d, c))} and y = ${ft(F(a, c))}; crosses the axes at (${ft(xInt)}, 0) and (0, ${ft(yInt)})`,
        working: `Vertical asymptote where ${linear(c, d)} = 0. As x → ±∞, y → ${ft(F(a, c))}. y = 0 when ${linear(a, b)} = 0; x = 0 gives y = ${ft(F(b, d))}.`,
      };
    },
    { a: 2, b: -3, c: 1, d: 4 },
    rand => {
      let v;
      do {
        v = { a: nonZero(rand, -5, 5), b: nonZero(rand, -6, 6), c: rand(1, 3), d: nonZero(rand, -6, 6) };
      } while (v.a * v.d - v.b * v.c === 0);
      return v;
    }),
  numberCard('h12-n2', 'hard', SYLLABUS('1.2'),
    ({ p, q, r, e }) => {
      const k = q - p * e; // quotient: p x + k
      const rem = r - e * k; // remainder
      return {
        question: `Find the equations of the asymptotes of y = (${polyText([{ c: p, v: 'x²' }, { c: q, v: 'x' }, { c: r, v: '' }])})/(${linear(1, e)}).`,
        answer: `x = ${num(-e)} and y = ${linear(p, k)}`,
        working: `Divide: ${polyText([{ c: p, v: 'x²' }, { c: q, v: 'x' }, { c: r, v: '' }])} = (${linear(1, e)})(${linear(p, k)}) ${rem < 0 ? MINUS : '+'} ${Math.abs(rem)}, so y = ${linear(p, k)} ${rem < 0 ? MINUS : '+'} ${Math.abs(rem)}/(${linear(1, e)}). As x → ±∞ the fraction → 0, giving the oblique asymptote y = ${linear(p, k)}; the vertical asymptote is x = ${num(-e)}.`,
      };
    },
    { p: 2, q: 3, r: -1, e: -1 },
    rand => {
      let v;
      do {
        v = { p: nonZero(rand, -3, 3), q: rand(-6, 6), r: rand(-8, 8), e: nonZero(rand, -5, 5) };
      } while (v.r - v.e * (v.q - v.p * v.e) === 0 || v.q === v.p * v.e); // remainder ≠ 0; quotient keeps its constant term
      return v;
    },
    60),
  numberCard('h12-n3', 'hard', SYLLABUS('1.2'),
    ({ a, h, k, px, py }) => ({
      question: `Describe a sequence of transformations that maps y = f(x) onto y = ${a}f(x ${h < 0 ? '+' : MINUS} ${Math.abs(h)}) ${k < 0 ? MINUS : '+'} ${Math.abs(k)}. The point (${num(px)}, ${num(py)}) lies on y = f(x); find the corresponding point on the new curve.`,
      answer: `Translate ${Math.abs(h)} unit${Math.abs(h) === 1 ? '' : 's'} in the ${h > 0 ? 'positive' : 'negative'} x-direction; scale parallel to the y-axis by factor ${a}; translate ${Math.abs(k)} unit${Math.abs(k) === 1 ? '' : 's'} in the ${k > 0 ? 'positive' : 'negative'} y-direction. Point: (${num(px + h)}, ${num(a * py + k)})`,
      working: `The y-scaling must come BEFORE the y-translation (otherwise the translation would also be scaled). x-coordinate: ${num(px)} + ${par(h)} = ${num(px + h)}; y-coordinate: ${a} × ${par(py)} + ${par(k)} = ${num(a * py + k)}.`,
    }),
    { a: 3, h: 2, k: 1, px: 1, py: -2 },
    rand => ({ a: rand(2, 4), h: nonZero(rand, -4, 4), k: nonZero(rand, -5, 5), px: rand(-4, 4), py: rand(-4, 4) }),
    60),
  numberCard('h12-n4', 'medium', SYLLABUS('1.2'),
    ({ A, B, hyperbola }) => {
      // A²x² ± B²y² = A²B² → x²/B² ± y²/A² = 1
      const rhs = A * A * B * B;
      const sign = hyperbola ? MINUS : '+';
      return {
        question: `The curve C has equation ${A * A}x² ${sign} ${B * B}y² = ${rhs}. Name the curve and state ${hyperbola ? 'the coordinates of its vertices and the equations of its asymptotes' : 'the coordinates of the points where it meets the axes'}.`,
        answer: hyperbola
          ? `A hyperbola, x²/${B * B} − y²/${A * A} = 1: vertices (±${B}, 0); asymptotes y = ±${coefTimes(A, B, 'x')}`
          : `An ellipse, x²/${B * B} + y²/${A * A} = 1: meets the axes at (±${B}, 0) and (0, ±${A})`,
        working: `Divide by ${rhs}: x²/${B * B} ${sign} y²/${A * A} = 1, so a = ${B} and b = ${A}.${hyperbola ? ` Asymptotes y = ±(b/a)x = ±${coefTimes(A, B, 'x')}.` : ''}`,
      };
    },
    { A: 3, B: 2, hyperbola: true },
    rand => {
      const A = rand(2, 6);
      let B = A;
      while (B === A) B = rand(2, 6);
      return { A, B, hyperbola: rand(0, 1) === 1 };
    }),
  numberCard('h12-n5', 'medium', `${PRECALC(8)}; ${SYLLABUS('1.2')}`,
    ({ p, q }) => {
      const coefficient = F(q * q, p);
      return {
        question: `A curve has parametric equations x = ${coefTimes(p, 1, 't²')}, y = ${q}t. Find its Cartesian equation and name the curve.`,
        answer: `y² = ${coefTimes(coefficient.n, coefficient.d, 'x')} — a parabola (vertex at the origin, symmetric about the x-axis)`,
        working: `Eliminate the parameter: t = y/${q}, so x = ${p === 1 ? '' : p}(y/${q})² = ${coefTimes(p, 1, 'y²')}/${q * q} → y² = ${coefTimes(coefficient.n, coefficient.d, 'x')}.`,
      };
    },
    { p: 2, q: 4 },
    rand => ({ p: rand(1, 5), q: rand(2, 6) })),
  numberCard('h12-n6', 'hard', SYLLABUS('1.2'),
    ({ r, ax, ay, k }) => ({
      question: `The curve y = f(x) crosses the x-axis only at x = ${num(r)}, has a maximum point at (${num(ax)}, ${ay}) and a horizontal asymptote y = ${k}. State the corresponding features of y = 1/f(x).`,
      answer: `Vertical asymptote x = ${num(r)}; minimum point (${num(ax)}, ${ft(F(1, ay))}); horizontal asymptote y = ${ft(F(1, k))}`,
      working: `1/f(x) → ±∞ where f(x) = 0. Where f has a maximum value ${ay} (> 0), 1/f has a minimum value 1/${ay}. As f → ${k}, 1/f → ${ft(F(1, k))}.`,
    }),
    { r: -1, ax: 2, ay: 4, k: 2 },
    rand => {
      const r = rand(-5, 3);
      const k = pick(rand, [1, 2, 3, 5]);
      return { r, ax: rand(r + 1, r + 5), ay: rand(k + 1, k + 6), k }; // maximum above the asymptote, so the curve is sensible
    }),
]);

// =====================================================================
// 1.3 Equations and inequalities
// =====================================================================

const h1_3 = deck('1.3 Equations and inequalities', [
  {
    id: 'h13-c1', difficulty: 'medium', ref: `${PRECALC(1)}; ${SYLLABUS('1.3')}`,
    question: 'State the two modulus relations in the H2 syllabus, and explain how to solve f(x)/g(x) > 0 without a calculator.',
    answer: '|x − a| < b ⇔ a − b < x < a + b;  |x − a| > b ⇔ x < a − b or x > a + b.\nFor f(x)/g(x) > 0: do NOT multiply by g(x) (its sign is unknown). Bring everything to one side, factorise, find the critical values (zeros of numerator and denominator), then use a sign table or sketch (or multiply by g(x)², which is positive).',
    alternates: [
      { question: 'Solve |x − 3| < 5.', answer: '−2 < x < 8' },
      { question: 'Why is multiplying both sides of (x + 1)/(x − 2) > 3 by (x − 2) a mistake?', answer: 'If x − 2 < 0 the inequality sign must flip, so you would lose (or wrongly gain) solutions. Its sign is unknown.' },
      { question: 'What is an "absolute value inequality"?', answer: '"A relationship in the form |A| < B, |A| ≤ B, |A| > B, or |A| ≥ B."' },
    ],
  },
  {
    id: 'h13-c2', difficulty: 'easy', ref: SYLLABUS('1.3'),
    question: 'How can a graph be used to solve the inequality f(x) > g(x)?',
    answer: 'Sketch y = f(x) and y = g(x) (e.g. with a graphing calculator), find the x-coordinates of their intersections, and read off the x-values where the graph of f lies ABOVE the graph of g.',
    alternates: [
      { question: 'The curves y = f(x) and y = g(x) meet at x = −1 and x = 4, and f is above g only between them. Solve f(x) > g(x).', answer: '−1 < x < 4' },
      { question: 'When a graphing calculator gives an intersection at x = 2.347…, how many significant figures should you usually give?', answer: '3 significant figures (x = 2.35), unless the question asks otherwise.' },
      { question: 'True or false: an answer read from a graphing calculator needs no working at all. Explain.', answer: 'False. Sketch the graphs used and state the intersections found — answers with no working may get no marks.' },
    ],
  },
  numberCard('h13-n1', 'easy', SYLLABUS('1.3'),
    ({ a, b, c, greater }) => {
      const lo = F(-c - b, a);
      const hi = F(c - b, a);
      return {
        question: `Solve |${linear(a, b)}| ${greater ? '>' : '<'} ${c}.`,
        answer: greater ? `x < ${ft(lo)} or x > ${ft(hi)}` : `${ft(lo)} < x < ${ft(hi)}`,
        working: greater
          ? `${linear(a, b)} < ${num(-c)} or ${linear(a, b)} > ${c} → ${a === 1 ? '' : a}x < ${num(-c - b)} or ${a === 1 ? '' : a}x > ${num(c - b)}`
          : `${num(-c)} < ${linear(a, b)} < ${c} → ${num(-c - b)} < ${a === 1 ? '' : a}x < ${num(c - b)}`,
      };
    },
    { a: 2, b: -3, c: 7, greater: false },
    rand => ({ a: rand(1, 4), b: nonZero(rand, -6, 6), c: rand(1, 9), greater: rand(0, 1) === 1 })),
  numberCard('h13-n2', 'hard', SYLLABUS('1.3'),
    ({ r1, r2, s, wantPositive }) => {
      const sign = x => ((x - r1) * (x - r2)) / (x - s);
      const intervals = solveBySign([F(r1), F(r2), F(s)], sign, wantPositive);
      return {
        question: `Without using a calculator, solve (${polyText([{ c: 1, v: 'x²' }, { c: -(r1 + r2), v: 'x' }, { c: r1 * r2, v: '' }])})/(${linear(1, -s)}) ${wantPositive ? '>' : '<'} 0.`,
        answer: intervalsText(intervals),
        working: `Factorise: (${linear(1, -r1)})(${linear(1, -r2)})/(${linear(1, -s)}) ${wantPositive ? '>' : '<'} 0. Critical values ${[r1, r2, s].sort((x, y) => x - y).map(num).join(', ')}. Use a sign table (the sign changes at each critical value) and pick the intervals where the expression is ${wantPositive ? 'positive' : 'negative'}.`,
      };
    },
    { r1: -2, r2: 3, s: 1, wantPositive: true },
    rand => {
      const values = new Set();
      while (values.size < 3) values.add(nonZero(rand, -6, 6)); // no zero, so no lone "(x)" factor
      const [r1, r2, s] = [...values];
      return { r1, r2, s, wantPositive: rand(0, 1) === 1 };
    },
    90),
  numberCard('h13-n3', 'hard', SYLLABUS('1.3'),
    ({ a, b, c, d }) => {
      // (ax + b)/(x + c) < d ⇔ ((a − d)x + (b − cd))/(x + c) < 0
      const p = a - d;
      const q = b - c * d;
      const root = F(-q, p);
      const pole = F(-c);
      const sign = x => (p * x + q) / (x + c);
      const intervals = solveBySign([root, pole], sign, false);
      return {
        question: `Without using a calculator, solve (${linear(a, b)})/(${linear(1, c)}) < ${num(d)}.`,
        answer: intervalsText(intervals),
        working: `Bring to one side: (${linear(a, b)})/(${linear(1, c)}) − ${par(d)} < 0 → (${linear(p, q)})/(${linear(1, c)}) < 0. Critical values x = ${ft(root)} and x = ${ft(pole)}. Sign table → ${intervalsText(intervals)}.`,
      };
    },
    { a: 2, b: 5, c: -1, d: 3 },
    rand => {
      let v;
      do {
        v = { a: nonZero(rand, -4, 5), b: nonZero(rand, -6, 8), c: nonZero(rand, -5, 5), d: nonZero(rand, -4, 4) };
      } while (v.a === v.d || v.a * v.c === v.b || v.b === v.c * v.d); // a ≠ d; root ≠ pole; rearranged numerator keeps a constant term
      return v;
    },
    90),
  numberCard('h13-n4', 'hard', SYLLABUS('1.3'),
    ({ prices, qty }) => {
      const names = ['notebooks', 'pens', 'files'];
      const totals = qty.map(row => row.reduce((s, n, i) => s + n * prices[i], 0));
      const people = ['Ali', 'Bea', 'Chen'];
      const money = cents => `$${(cents / 100).toFixed(2)}`;
      return {
        question: `${people.map((p, i) => `${p} buys ${qty[i].map((n, j) => `${n} ${n === 1 ? names[j].replace(/s$/, '') : names[j]}`).join(', ')} for ${money(totals[i])}`).join('. ')}. Form a system of linear equations and find the price of each item.`,
        answer: `Notebook ${money(prices[0])}, pen ${money(prices[1])}, file ${money(prices[2])}`,
        working: `Let the prices be n, p, f (in $): ${qty.map((row, i) => `${polyText([{ c: row[0], v: 'n' }, { c: row[1], v: 'p' }, { c: row[2], v: 'f' }])} = ${(totals[i] / 100).toFixed(2)}`).join('; ')}. Solve with a graphing calculator.`,
      };
    },
    { prices: [250, 120, 180], qty: [[2, 3, 1], [1, 5, 2], [3, 2, 4]] },
    rand => {
      let qty;
      const det = m => m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
      do {
        qty = Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => rand(1, 6)));
      } while (det(qty) === 0);
      return { prices: [rand(15, 60, 5) * 10, rand(5, 30, 5) * 10, rand(8, 40, 2) * 10], qty };
    },
    90),
]);

// =====================================================================
// 2.1 Sequences and series
// =====================================================================

const h2_1 = deck('2.1 Sequences and series', [
  {
    id: 'h21-c1', difficulty: 'easy', ref: `${PRECALC(11)}; ${SYLLABUS('2.1')}`,
    question: 'What is the difference between an explicit formula and a recurrence (recursive) formula for a sequence? How are uₙ and Sₙ related?',
    answer: 'Explicit formula: "a formula that defines each term of a sequence in terms of its position in the sequence", e.g. uₙ = 3n + 1.\nRecursive formula: "a formula that defines each term of a sequence using previous term(s)", e.g. uₙ₊₁ = 2uₙ − 1, u₁ = 3.\nuₙ = Sₙ − Sₙ₋₁ (for n ≥ 2), and u₁ = S₁.',
    alternates: [
      { question: 'If Sₙ = n² + 2n, find u₁ and u₅.', answer: 'u₁ = S₁ = 3; u₅ = S₅ − S₄ = 35 − 24 = 11.' },
      { question: 'Is uₙ₊₁ = uₙ + 4, u₁ = 7 an explicit or a recursive formula? Write the other form.', answer: 'Recursive. Explicit form: uₙ = 7 + 4(n − 1) = 4n + 3.' },
      { question: 'Why does uₙ = Sₙ − Sₙ₋₁ not work for n = 1?', answer: 'The formula for Sₙ is only valid for n ≥ 1. S₀ should be 0 (the sum of no terms), but putting n = 0 into the formula need not give 0 (e.g. Sₙ = 2ⁿ gives 1), so find u₁ from u₁ = S₁.' },
    ],
  },
  {
    id: 'h21-c2', difficulty: 'medium', ref: `${PRECALC(11)}; ${SYLLABUS('2.1')}`,
    question: 'When does a series converge? When does an infinite geometric series converge, and what is its sum?',
    answer: 'A series converges if Sₙ tends to a finite limit as n → ∞; that limit is the sum to infinity.\nAn infinite geometric series converges when −1 < r < 1 (|r| < 1): "The sum of an infinite series is defined if the series is geometric and −1 < r < 1." Then S∞ = a/(1 − r).',
    alternates: [
      { question: 'Does 5 − 10 + 20 − 40 + … converge? Explain.', answer: 'No. r = −2 and |r| > 1, so the terms grow in size and Sₙ has no limit.' },
      { question: 'True or false: if uₙ → 0 then the series Σuₙ must converge. Explain.', answer: 'False. The terms tending to 0 is necessary but not sufficient — e.g. 1 + 1/2 + 1/3 + … has uₙ → 0 but diverges.' },
      { question: 'Find the sum to infinity of 9 + 3 + 1 + 1/3 + …', answer: 'r = 1/3, so S∞ = 9 ÷ (1 − 1/3) = 27/2.' },
    ],
  },
  numberCard('h21-n1', 'medium', SYLLABUS('2.1'),
    ({ a, b }) => ({
      question: `The sum of the first n terms of a sequence is Sₙ = ${polyText([{ c: a, v: 'n²' }, { c: b, v: 'n' }])}. Find uₙ and show that the sequence is arithmetic.`,
      answer: `uₙ = ${linear(2 * a, b - a, 'n')}. uₙ − uₙ₋₁ = ${num(2 * a)}, a constant, so it is arithmetic (first term ${num(a + b)}, common difference ${num(2 * a)}).`,
      working: `uₙ = Sₙ − Sₙ₋₁ = [${polyText([{ c: a, v: 'n²' }, { c: b, v: 'n' }])}] − [${polyText([{ c: a, v: '(n − 1)²' }, { c: b, v: '(n − 1)' }])}] = ${polyText([{ c: a, v: '(2n − 1)' }, { c: b, v: '' }])} = ${linear(2 * a, b - a, 'n')}. Check: u₁ = S₁ = ${num(a + b)} ✓`,
    }),
    { a: 3, b: -1 },
    rand => ({ a: nonZero(rand, -4, 5), b: nonZero(rand, -7, 7) })),
  numberCard('h21-n2', 'hard', SYLLABUS('2.1'),
    ({ c, p, q }) => {
      const coef = F(c * (q - p), q); // uₙ = c(1 − r) rⁿ⁻¹
      return {
        question: `The sum of the first n terms of a series is Sₙ = ${c}(1 − (${p}/${q})ⁿ). Find uₙ and state the sum to infinity.`,
        answer: `uₙ = ${coef.d === 1 ? ft(coef) : `(${ft(coef)})`}(${p}/${q})ⁿ⁻¹; S∞ = ${c}`,
        working: `uₙ = Sₙ − Sₙ₋₁ = ${c}[(${p}/${q})ⁿ⁻¹ − (${p}/${q})ⁿ] = ${c}(${p}/${q})ⁿ⁻¹(1 − ${p}/${q}) = ${coef.d === 1 ? ft(coef) : `(${ft(coef)})`}(${p}/${q})ⁿ⁻¹ — geometric with r = ${p}/${q}. As n → ∞, (${p}/${q})ⁿ → 0, so S∞ = ${c}.`,
      };
    },
    { c: 12, p: 2, q: 3 },
    rand => {
      const q = rand(2, 6);
      let p = 0;
      while (p === 0 || gcd(p, q) !== 1) p = rand(1, q - 1);
      return { c: rand(2, 30), p, q };
    },
    60),
  numberCard('h21-n3', 'hard', SYLLABUS('2.1'),
    ({ an, ad, b, u1 }) => {
      const a = F(an, ad);
      const terms = [F(u1)];
      for (let i = 0; i < 3; i++) terms.push(add(mul(a, terms[i]), F(b)));
      const limit = F(b * ad, ad - an); // L = b/(1 − a)
      return {
        question: `A sequence is defined by u₁ = ${num(u1)} and uₙ₊₁ = (${fracText(an, ad)})uₙ ${b < 0 ? MINUS : '+'} ${Math.abs(b)}. Find u₂, u₃ and u₄, and find the limit of uₙ as n → ∞.`,
        answer: `u₂ = ${ft(terms[1])}, u₃ = ${ft(terms[2])}, u₄ = ${ft(terms[3])}; limit = ${ft(limit)}`,
        working: `Apply the recurrence three times. Since |${fracText(an, ad)}| < 1 the sequence converges to L with L = (${fracText(an, ad)})L ${b < 0 ? MINUS : '+'} ${Math.abs(b)} → L(1 − ${par(an) === String(an) ? fracText(an, ad) : `(${fracText(an, ad)})`}) = ${num(b)} → L = ${ft(limit)}.`,
      };
    },
    { an: 1, ad: 2, b: 6, u1: 4 },
    rand => {
      const ad = rand(2, 5);
      let an = 0;
      while (an === 0 || gcd(Math.abs(an), ad) !== 1) an = rand(-(ad - 1), ad - 1);
      const b = nonZero(rand, -9, 12);
      let u1;
      do {
        u1 = rand(-5, 10);
      } while (u1 * (ad - an) === b * ad); // u₁ must not already equal the limit (constant sequence)
      return { an, ad, b, u1 };
    },
    90),
  numberCard('h21-n4', 'hard', SYLLABUS('2.1'),
    ({ base, k }) => {
      const geo = `${base}(${base}ⁿ − 1)${base === 2 ? '' : `/${base - 1}`}`;
      return {
        question: `Find Σ (from r = 1 to n) of (${base}ʳ ${k < 0 ? MINUS : '+'} ${coefTimes(Math.abs(k), 1, 'r')}), giving your answer in terms of n.`,
        answer: `${geo} ${k < 0 ? MINUS : '+'} ${coefTimes(Math.abs(k), 2, 'n(n + 1)')}`,
        working: `Split into two series: Σ ${base}ʳ is geometric with first term ${base} and common ratio ${base}: ${base}(${base}ⁿ − 1)/(${base} − 1). Σ r = n(n + 1)/2, so Σ ${k < 0 ? MINUS : ''}${coefTimes(Math.abs(k), 1, 'r')} = ${k < 0 ? MINUS : ''}${coefTimes(Math.abs(k), 2, 'n(n + 1)')}.`,
      };
    },
    { base: 2, k: 3 },
    rand => ({ base: pick(rand, [2, 3, 4]), k: nonZero(rand, -6, 8) }),
    60),
  numberCard('h21-n5', 'hard', SYLLABUS('2.1'),
    ({ a, k, m }) => {
      // terms u₁, u₍₁₊ₖ₎, u₍₁₊ₘ₎ of an AP are consecutive terms of a GP
      const d = F(a * (m - 2 * k), k * k);
      const r = F(m - k, k);
      return {
        question: `An arithmetic sequence has first term ${a} and common difference d ≠ 0. Its 1st, ${ord(1 + k)} and ${ord(1 + m)} terms are consecutive terms of a geometric sequence. Find d and the common ratio of the geometric sequence.`,
        answer: `d = ${ft(d)}, r = ${ft(r)}`,
        working: `(${a} + ${coefTimes(k, 1, 'd')})² = ${a}(${a} + ${m}d) → ${2 * a * k}d + ${coefTimes(k * k, 1, 'd²')} = ${a * m}d → ${coefTimes(k * k, 1, 'd')} = ${num(a * (m - 2 * k))} (d ≠ 0)${k === 1 ? '' : ` → d = ${ft(d)}`}. r = (${a} + ${coefTimes(k, 1, 'd')})/${a} = ${ft(r)}.`,
      };
    },
    { a: 3, k: 2, m: 6 },
    rand => {
      const k = rand(1, 4);
      let m = 2 * k;
      while (m === 2 * k || m === k) m = rand(k + 1, k + 10);
      return { a: rand(1, 9), k, m };
    },
    90),
  numberCard('h21-n6', 'hard', SYLLABUS('2.1'),
    ({ u1, p, q, power }) => {
      const r = p / q;
      const S = (u1 * q) / (q - p);
      let n = 0;
      while (S * r ** n >= 10 ** -power) n += 1;
      return {
        question: `A geometric series has first term ${u1} and common ratio ${p}/${q}. Find the least value of n for which the sum to infinity exceeds Sₙ by less than 10${sup(-power)}.`,
        answer: `n = ${n}`,
        working: `S∞ = ${u1}/(1 − ${p}/${q}) = ${ft(F(u1 * q, q - p))}. S∞ − Sₙ = S∞(${p}/${q})ⁿ < 10${sup(-power)} → n > ln(10${sup(-power)} ÷ ${ft(F(u1 * q, q - p))}) ÷ ln(${p}/${q}) = ${(Math.log(10 ** -power / S) / Math.log(r)).toFixed(3)} (the inequality flips because ln(${p}/${q}) < 0), so n = ${n}.`,
      };
    },
    { u1: 8, p: 3, q: 4, power: 3 },
    rand => {
      const q = rand(3, 6);
      let p = 0;
      while (p === 0 || gcd(p, q) !== 1) p = rand(1, q - 1);
      return { u1: rand(2, 20), p, q, power: rand(2, 4) };
    },
    90),
]);

function ord(n) {
  const suffix = n % 100 >= 11 && n % 100 <= 13 ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' }[n % 10] ?? 'th');
  return `${n}${suffix}`;
}

// The keys below are used in data/syllabus.js (deck: 'a-h2m-1-1', ...).
export const h2MathDecks = {
  'a-h2m-1-1': h1_1,
  'a-h2m-1-2': h1_2,
  'a-h2m-1-3': h1_3,
  'a-h2m-2-1': h2_1,
};
