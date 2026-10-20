// IB Mathematics: Analysis and Approaches — Topic 1 Number and algebra
// Lives at: src/features/flashcards/data/decks/ib-math-aa-1.js
//
// Scope follows the IB Mathematics: analysis and approaches guide:
//   SL 1.1–1.9 are for SL and HL students. AHL 1.10–1.16 are HL only.
// Every question is ORIGINAL (written in IB style, not copied from past papers or textbooks).
// Number questions are built by code, so the answer printed on the card always matches the question
// and "Focus on wrong" can make endless new versions. Definitions are based on the free
// OpenStax textbooks (Precalculus 2e / Algebra and Trigonometry 2e); each card's "ref" says which.
//
// Card fields: id, question, answer, difficulty — plus optional working, ref, vary, alternates,
// and seconds (a longer timer for multi-step questions).

import { deck, pick } from './helpers.js';
import {
  MINUS, coefTimes, complexText, cosExact, eulerText, factorial, frac, fracText, gcd, isPrime, linear, money, nCr,
  nPr, num, par, piPar, piText, polyText, power, principal, roundTo, seriesText, sf3, sinExact, sqrtText, standardForm, sup, surd, surdText, surdTimes,
} from './math-tools.js';

const GUIDE = section => `IB Mathematics: analysis and approaches guide, ${section}`;
const PRECALC = chapter => `OpenStax Precalculus 2e, ch. ${chapter}`;
const ALGTRIG = chapter => `OpenStax Algebra and Trigonometry 2e, ch. ${chapter}`;

// Builds a NUMBER card: the original card and every variation come from the same build() function.
function numberCard(id, difficulty, ref, build, defaults, makeValues, seconds) {
  return {
    id, difficulty, ref, ...(seconds ? { seconds } : {}),
    ...build(defaults),
    vary: { make: rand => build(makeValues(rand)) },
  };
}

// A random whole number that is not zero.
const nonZero = (rand, min, max) => {
  let n = 0;
  while (n === 0) n = rand(min, max);
  return n;
};

// =====================================================================
// SL 1.1 Standard form
// =====================================================================

const t1_1 = deck('1.1 Standard form', [
  {
    id: 'm11-c1', difficulty: 'easy', ref: `${ALGTRIG(1)}; ${GUIDE('SL 1.1')}`,
    question: 'What is standard form (scientific notation)?',
    answer: '"A shorthand notation for writing very large or very small numbers in the form a × 10ⁿ where 1 ≤ |a| < 10 and n is an integer." (IB writes a × 10ᵏ with 1 ≤ a < 10, k ∈ ℤ.)',
    alternates: [
      { question: 'Is 23.5 × 10⁴ in standard form? If not, rewrite it.', answer: 'No — 23.5 is not between 1 and 10. It is 2.35 × 10⁵.' },
      { question: 'Write 0.000 407 in standard form.', answer: '4.07 × 10⁻⁴' },
      { question: 'In a × 10ᵏ, what does a negative value of k tell you about the number?', answer: 'The number is between −1 and 1 (a small number): the decimal point moves |k| places to the left.' },
    ],
  },
  numberCard('m11-n1', 'medium', GUIDE('SL 1.1'),
    ({ A, p, B, q }) => {
      const product = A * B; // A and B are the mantissas × 10
      return {
        question: `Without a calculator, find (${A / 10} × 10${sup(p)}) × (${B / 10} × 10${sup(q)}). Give your answer in standard form.`,
        answer: standardForm(product, p + q - 2),
        working: `Multiply the numbers: ${A / 10} × ${B / 10} = ${product / 100}; add the powers: 10${sup(p)} × 10${sup(q)} = 10${sup(p + q)}. So ${product / 100} × 10${sup(p + q)} = ${standardForm(product, p + q - 2)}`,
      };
    },
    { A: 32, p: 5, B: 45, q: -2 },
    rand => ({ A: rand(11, 99), p: rand(-6, 9), B: rand(11, 99), q: rand(-9, 6) })),
  numberCard('m11-n2', 'medium', GUIDE('SL 1.1'),
    ({ A, p, B, q }) => {
      // (A/10 × 10^p) + (B/10 × 10^(p−1)) = (10A + B) × 10^(p−2)
      const total = 10 * A + B;
      return {
        question: `Find (${A / 10} × 10${sup(p)}) + (${B / 10} × 10${sup(p - 1)}), giving your answer in standard form.`,
        answer: standardForm(total, p - 2),
        working: `Write both with the same power: ${B / 10} × 10${sup(p - 1)} = ${B / 100} × 10${sup(p)}. Then ${A / 10} + ${B / 100} = ${total / 100}, so the sum is ${total / 100} × 10${sup(p)}${total / 100 < 10 ? '' : ` = ${standardForm(total, p - 2)}`}`,
      };
    },
    { A: 72, p: 6, B: 58 },
    rand => ({ A: rand(11, 99), p: rand(-5, 9), B: rand(11, 99) })),
  numberCard('m11-n3', 'hard', GUIDE('SL 1.1'),
    ({ A, p, B, q }) => {
      // Exact integer arithmetic, so rounding to 3 s.f. is always correct (no floating-point error).
      const s = 2 - Math.floor(Math.log10(A / B));
      let m3 = Math.round((A * 10 ** s) / B); // the 3 significant figures, as a whole number 100–999
      let e = p - q - s + 2;
      if (m3 === 1000) {
        m3 = 100;
        e += 1;
      }
      const files = Math.floor((A * 10 ** (p - q)) / B); // A × 10^(p−q) is a whole number here
      return {
        question: `A hard drive holds ${A / 10} × 10${sup(p)} bytes. Each video file is ${B / 10} × 10${sup(q)} bytes. How many video files can it hold? Give your answer in standard form to 3 significant figures, then state the actual whole number of files.`,
        answer: `${(m3 / 100).toFixed(2)} × 10${sup(e)} — so ${files.toLocaleString('en-US')} whole files`,
        working: `(${A / 10} ÷ ${B / 10}) × 10${sup(p - q)} = ${(m3 / 100).toFixed(2)} × 10${sup(e)} (3 s.f.). Only complete files count, so round DOWN: ${files.toLocaleString('en-US')}.`,
      };
    },
    { A: 20, p: 12, B: 35, q: 8 },
    rand => ({ A: rand(11, 99), p: rand(11, 13), B: rand(11, 99), q: rand(6, 9) })),
]);

// =====================================================================
// SL 1.2 Arithmetic sequences and series
// =====================================================================

const t1_2 = deck('1.2 Arithmetic sequences and series', [
  {
    id: 'm12-c1', difficulty: 'easy', ref: `${PRECALC(11)}; ${GUIDE('SL 1.2')}`,
    question: 'What is an arithmetic sequence? Give the IB formulae for its nth term and the sum of its first n terms.',
    answer: 'A sequence in which the difference between any two consecutive terms is a constant (the common difference d).\nuₙ = u₁ + (n − 1)d\nSₙ = n/2 (2u₁ + (n − 1)d) = n/2 (u₁ + uₙ)',
    alternates: [
      { question: 'Is 5, 9, 13, 17, … arithmetic? If so, state u₁ and d.', answer: 'Yes. u₁ = 5 and d = 4 (each term is 4 more than the one before).' },
      { question: 'Which sum formula is quickest when you know the first AND the last term of an arithmetic series?', answer: 'Sₙ = n/2 (u₁ + uₙ).' },
      { question: 'True or false: in an arithmetic sequence the ratio of consecutive terms is constant. Explain.', answer: 'False. The DIFFERENCE between consecutive terms is constant. A constant ratio describes a geometric sequence.' },
    ],
  },
  numberCard('m12-n1', 'medium', GUIDE('SL 1.2'),
    ({ u1, d, m, k }) => {
      const um = u1 + (m - 1) * d;
      const uk = u1 + (k - 1) * d;
      return {
        question: `In an arithmetic sequence, u${sub(m)} = ${num(um)} and u${sub(k)} = ${num(uk)}. Find the first term u₁ and the common difference d.`,
        answer: `u₁ = ${num(u1)}, d = ${num(d)}`,
        working: `u${sub(k)} − u${sub(m)} = (${k} − ${m})d → ${num(uk)} − ${par(um)} = ${k - m}d → d = ${num(d)}. Then u₁ = u${sub(m)} − ${m - 1}d = ${num(um)} − ${par((m - 1) * d)} = ${num(u1)}`,
      };
    },
    { u1: 7, d: 4, m: 3, k: 10 },
    rand => {
      const m = rand(2, 5);
      return { u1: rand(-20, 30), d: nonZero(rand, -7, 9), m, k: rand(m + 3, m + 10) };
    }),
  numberCard('m12-n2', 'medium', GUIDE('SL 1.2'),
    ({ u1, d, n }) => {
      const S = (n * (2 * u1 + (n - 1) * d)) / 2;
      return {
        question: `Find the sum of the first ${n} terms of the arithmetic series ${seriesText([u1, u1 + d, u1 + 2 * d])}`,
        answer: num(S),
        working: `u₁ = ${num(u1)}, d = ${num(d)}. Sₙ = n/2 (2u₁ + (n − 1)d) = ${n}/2 × (${num(2 * u1)} + ${n - 1} × ${par(d)}) = ${num(S)}`,
      };
    },
    { u1: 12, d: 5, n: 30 },
    rand => ({ u1: rand(-15, 40), d: nonZero(rand, -6, 8), n: rand(15, 60) })),
  numberCard('m12-n3', 'hard', GUIDE('SL 1.2'),
    ({ u1, d, target }) => {
      let n = 0;
      let S = 0;
      while (S <= target) {
        n += 1;
        S += u1 + (n - 1) * d;
      }
      const before = S - (u1 + (n - 1) * d);
      return {
        question: `Consider the arithmetic series ${u1} + ${u1 + d} + ${u1 + 2 * d} + … Find the least number of terms needed for the sum to exceed ${target}.`,
        answer: `${n} terms`,
        working: `Solve n/2 (${2 * u1} + ${d}(n − 1)) > ${target} with technology (or a quadratic inequality). S${sub(n - 1)} = ${before} ≤ ${target}, S${sub(n)} = ${S} > ${target}, so n = ${n}.`,
      };
    },
    { u1: 8, d: 3, target: 1000 },
    rand => ({ u1: rand(2, 15), d: rand(2, 9), target: rand(5, 30) * 100 }),
    60),
  numberCard('m12-n4', 'medium', GUIDE('SL 1.2'),
    ({ a, b, n }) => {
      const value = (a * n * (n + 1)) / 2 + b * n;
      return {
        question: `Evaluate Σ (from r = 1 to ${n}) of (${linear(a, b, 'r')}).`,
        answer: num(value),
        working: `This is arithmetic with u₁ = ${num(a + b)}, u${sub(n)} = ${num(a * n + b)}, n = ${n}: S = ${n}/2 × (${num(a + b)} + ${par(a * n + b)}) = ${num(value)}`,
      };
    },
    { a: 3, b: 2, n: 40 },
    rand => ({ a: nonZero(rand, -5, 7), b: rand(-9, 12), n: rand(12, 50) })),
  numberCard('m12-n5', 'medium', GUIDE('SL 1.2'),
    ({ s, d, rows }) => {
      const last = s + (rows - 1) * d;
      const total = (rows * (s + last)) / 2;
      return {
        question: `A theatre has ${rows} rows. The first row has ${s} seats and each row after that has ${d} more seat${d === 1 ? '' : 's'} than the row in front. Find (a) the number of seats in the last row and (b) the total number of seats.`,
        answer: `(a) ${last}  (b) ${total}`,
        working: `(a) u${sub(rows)} = ${s} + (${rows} − 1) × ${d} = ${last}. (b) S${sub(rows)} = ${rows}/2 × (${s} + ${last}) = ${total}`,
      };
    },
    { s: 18, d: 2, rows: 25 },
    rand => ({ s: rand(10, 30), d: rand(1, 4), rows: rand(12, 40) })),
]);

// Subscript digits for term labels: 12 → "₁₂"
function sub(n) {
  const map = { '-': '₋', 0: '₀', 1: '₁', 2: '₂', 3: '₃', 4: '₄', 5: '₅', 6: '₆', 7: '₇', 8: '₈', 9: '₉' };
  return String(n).split('').map(ch => map[ch]).join('');
}

// =====================================================================
// SL 1.3 Geometric sequences and series
// =====================================================================

const t1_3 = deck('1.3 Geometric sequences and series', [
  {
    id: 'm13-c1', difficulty: 'easy', ref: `${PRECALC(11)}; ${GUIDE('SL 1.3')}`,
    question: 'What is a geometric sequence? Give the IB formulae for its nth term and the sum of its first n terms.',
    answer: '"A sequence in which the ratio of a term to a previous term is a constant" — the common ratio r.\nuₙ = u₁rⁿ⁻¹\nSₙ = u₁(rⁿ − 1)/(r − 1) = u₁(1 − rⁿ)/(1 − r), r ≠ 1',
    alternates: [
      { question: 'Is 48, −24, 12, −6, … geometric? If so, state u₁ and r.', answer: 'Yes. u₁ = 48 and r = −1/2.' },
      { question: 'How do you find the common ratio of a geometric sequence from two consecutive terms?', answer: 'Divide a term by the one before it: r = uₙ₊₁ ÷ uₙ.' },
      { question: 'True or false: a geometric sequence can have a common ratio of 0. Explain.', answer: 'False. With r = 0 every term after the first would be 0, so the ratio of consecutive terms could not be found. The common ratio of a geometric sequence must be non-zero.' },
    ],
  },
  numberCard('m13-n1', 'medium', GUIDE('SL 1.3'),
    ({ u1, r, n }) => {
      const un = u1 * r ** (n - 1);
      return {
        question: `A geometric sequence has u₁ = ${num(u1)} and common ratio ${num(r)}. Find u${sub(n)}.`,
        answer: num(un),
        working: `uₙ = u₁rⁿ⁻¹ → u${sub(n)} = ${num(u1)} × ${par(r)}${sup(n - 1)} = ${num(un)}`,
      };
    },
    { u1: 5, r: -2, n: 9 },
    rand => ({ u1: nonZero(rand, -6, 8), r: pick(rand, [-3, -2, 2, 3]), n: rand(5, 10) })),
  numberCard('m13-n2', 'hard', GUIDE('SL 1.3'),
    ({ u1, r, a }) => {
      const ua = u1 * r ** (a - 1);
      const ub = u1 * r ** (a + 2);
      return {
        question: `The ${ord(a)} term of a geometric sequence is ${num(ua)} and the ${ord(a + 3)} term is ${num(ub)}. Find the common ratio and the first term.`,
        answer: `r = ${num(r)}, u₁ = ${num(u1)}`,
        working: `u${sub(a + 3)} ÷ u${sub(a)} = r³ = ${num(ub)} ÷ ${num(ua)} = ${num(r ** 3)} → r = ${num(r)}. u₁ = u${sub(a)} ÷ r${sup(a - 1)} = ${num(ua)} ÷ ${num(r ** (a - 1))} = ${num(u1)}`,
      };
    },
    { u1: 3, r: 2, a: 2 },
    rand => ({ u1: nonZero(rand, -5, 6), r: pick(rand, [-3, -2, 2, 3]), a: rand(2, 3) })),
  numberCard('m13-n3', 'medium', GUIDE('SL 1.3'),
    ({ u1, r, n }) => {
      const S = (u1 * (r ** n - 1)) / (r - 1);
      return {
        question: `Find the sum of the first ${n} terms of the geometric series ${seriesText([u1, u1 * r, u1 * r * r])}`,
        answer: num(S),
        working: `u₁ = ${num(u1)}, r = ${num(r)}. Sₙ = u₁(rⁿ − 1)/(r − 1) = ${num(u1)} × (${par(r)}${sup(n)} − 1) ÷ (${num(r)} − 1) = ${num(S)}`,
      };
    },
    { u1: 4, r: 3, n: 8 },
    rand => ({ u1: nonZero(rand, -5, 9), r: pick(rand, [-2, 2, 3]), n: rand(6, 11) })),
  numberCard('m13-n4', 'hard', GUIDE('SL 1.3'),
    ({ u1, r10, target }) => {
      const r = r10 / 10;
      let n = 0;
      let S = 0;
      while (S <= target) {
        n += 1;
        S = (u1 * (r ** n - 1)) / (r - 1);
      }
      const before = (u1 * (r ** (n - 1) - 1)) / (r - 1);
      return {
        question: `For the geometric series ${u1} + ${Number((u1 * r).toFixed(4))} + ${Number((u1 * r * r).toFixed(4))} + …, find the least value of n for which Sₙ > ${target}.`,
        answer: `n = ${n}`,
        working: `r = ${r}. Solve ${u1}(${r}ⁿ − 1)/${Number((r - 1).toFixed(2))} > ${target} with technology: S${sub(n - 1)} ≈ ${sf3(before)} ≤ ${target}, S${sub(n)} ≈ ${sf3(S)} > ${target}, so n = ${n}.`,
      };
    },
    { u1: 6, r10: 15, target: 1000 },
    rand => ({ u1: rand(2, 12), r10: pick(rand, [12, 13, 15, 20, 25]), target: rand(2, 20) * 500 }),
    60),
]);

// 1 → "1st", 2 → "2nd", 3 → "3rd", 4 → "4th"
function ord(n) {
  const suffix = n % 100 >= 11 && n % 100 <= 13 ? 'th' : ({ 1: 'st', 2: 'nd', 3: 'rd' }[n % 10] ?? 'th');
  return `${n}${suffix}`;
}

// =====================================================================
// SL 1.4 Financial applications
// =====================================================================

const t1_4 = deck('1.4 Financial applications', [
  {
    id: 'm14-c1', difficulty: 'medium', ref: GUIDE('SL 1.4'),
    question: 'Write the compound interest formula used in IB, and explain each symbol.',
    answer: 'FV = PV × (1 + r/(100k))ᵏⁿ\nFV = future value, PV = present value, r = annual interest rate (%), k = number of compounding periods per year, n = number of years.',
    alternates: [
      { question: 'An account pays interest "compounded quarterly". What is the value of k?', answer: 'k = 4 (interest is added 4 times a year).' },
      { question: 'How is annual depreciation at r% per year modelled?', answer: 'As a geometric sequence: value after n years = initial value × (1 − r/100)ⁿ.' },
      { question: 'Why does compound interest grow faster than simple interest at the same rate?', answer: 'Interest is added to the balance, so later interest is also earned on earlier interest — the balance grows geometrically.' },
    ],
  },
  numberCard('m14-n1', 'medium', GUIDE('SL 1.4'),
    ({ PV, r10, n }) => {
      const r = r10 / 10;
      const FV = PV * (1 + r / 100) ** n;
      return {
        question: `$${money(PV)} is invested at ${r}% per year, compounded annually. Find its value after ${n} years, to the nearest cent.`,
        answer: `$${money(roundTo(FV, 2))}`,
        working: `FV = ${PV} × (1 + ${r}/100)${sup(n)} = ${PV} × ${Number((1 + r / 100).toFixed(4))}${sup(n)} = $${money(FV)}`,
      };
    },
    { PV: 5000, r10: 35, n: 8 },
    rand => ({ PV: rand(10, 200) * 100, r10: rand(15, 75, 5), n: rand(3, 15) })),
  numberCard('m14-n2', 'hard', GUIDE('SL 1.4'),
    ({ PV, r10, n }) => {
      const r = r10 / 10;
      const FV = PV * (1 + r / 1200) ** (12 * n);
      const annual = PV * (1 + r / 100) ** n;
      return {
        question: `$${money(PV)} is invested for ${n} years at ${r}% per year, compounded monthly. Find (a) the final value to the nearest cent and (b) how much more this is than with annual compounding.`,
        answer: `(a) $${money(FV)}  (b) $${money(roundTo(FV, 2) - roundTo(annual, 2))} more (using the rounded values)`,
        working: `(a) FV = ${PV} × (1 + ${r}/(100 × 12))${sup(12 * n)} = $${money(FV)}. (b) Annually: ${PV} × (1 + ${r}/100)${sup(n)} = $${money(annual)}; difference = $${money(FV)} − $${money(annual)} = $${money(roundTo(FV, 2) - roundTo(annual, 2))}`,
      };
    },
    { PV: 12000, r10: 48, n: 6 },
    rand => ({ PV: rand(20, 300) * 100, r10: rand(20, 80, 2), n: rand(3, 12) }),
    60),
  numberCard('m14-n3', 'medium', GUIDE('SL 1.4'),
    ({ V0, r, n }) => {
      const V = V0 * (1 - r / 100) ** n;
      return {
        question: `A car is bought for $${money(V0)}. It loses ${r}% of its value every year. Find its value after ${n} years, to the nearest dollar.`,
        answer: `$${roundTo(V, 0).toLocaleString('en-US')}`,
        working: `Value = ${V0} × (1 − ${r}/100)${sup(n)} = ${V0} × ${(1 - r / 100).toFixed(2)}${sup(n)} = $${money(V)}`,
      };
    },
    { V0: 32000, r: 15, n: 5 },
    rand => ({ V0: rand(15, 80) * 1000, r: rand(8, 25), n: rand(3, 10) })),
  numberCard('m14-n4', 'hard', GUIDE('SL 1.4'),
    ({ PV, r10, target }) => {
      const r = r10 / 10;
      let n = 0;
      while (PV * (1 + r / 100) ** n < target) n += 1;
      return {
        question: `$${money(PV)} is invested at ${r}% per year, compounded annually. After how many complete years will the investment first be worth at least $${money(target)}?`,
        answer: `${n} years`,
        working: `Solve ${PV}(1 + ${r}/100)ⁿ ≥ ${target} with technology or logs: n ≥ ln(${target}/${PV}) ÷ ln(${Number((1 + r / 100).toFixed(4))}) = ${sf3(Math.log(target / PV) / Math.log(1 + r / 100))}, so ${n} complete years.`,
      };
    },
    { PV: 8000, r10: 42, target: 12000 },
    rand => {
      const PV = rand(20, 100) * 100;
      return { PV, r10: rand(20, 80, 2), target: PV * rand(15, 30) / 10 };
    }),
  numberCard('m14-n5', 'hard', GUIDE('SL 1.4'),
    ({ PV, FV, n }) => {
      const r = 100 * ((FV / PV) ** (1 / n) - 1);
      return {
        question: `An investment of $${money(PV)} grows to $${money(FV)} after ${n} years, with interest compounded annually. Find the annual interest rate, to 3 significant figures.`,
        answer: `${sf3(r)}%`,
        working: `${PV}(1 + r/100)${sup(n)} = ${FV} → 1 + r/100 = (${FV}/${PV})^(1/${n}) = ${Number(((FV / PV) ** (1 / n)).toPrecision(6))} → r = ${sf3(r)}%`,
      };
    },
    { PV: 4000, FV: 5200, n: 6 },
    rand => {
      const PV = rand(20, 100) * 100;
      return { PV, FV: PV + rand(5, 40) * 100, n: rand(3, 12) };
    }),
]);

// =====================================================================
// SL 1.5 Laws of exponents (integer) and introduction to logarithms
// =====================================================================

const t1_5 = deck('1.5 Exponents and introduction to logarithms', [
  {
    id: 'm15-c1', difficulty: 'easy', ref: `${PRECALC(4)}; ${GUIDE('SL 1.5')}`,
    question: 'What does logₐ x mean? What are log x and ln x?',
    answer: 'A logarithm is "the exponent to which b must be raised to get x": y = log_b x ⇔ bʸ = x (b > 0, b ≠ 1, x > 0). So logₐ x is the power of a that gives x.\nlog x means log₁₀ x (the common logarithm); ln x means logₑ x (the natural logarithm).',
    alternates: [
      { question: 'Rewrite 10³ = 1000 as a logarithm statement.', answer: 'log₁₀ 1000 = 3.' },
      { question: 'Rewrite ln y = 4 as an exponential statement.', answer: 'y = e⁴.' },
      { question: 'Why is log₁₀(−100) undefined?', answer: 'No power of 10 is negative (10ˣ > 0 for all x), so the logarithm of a negative number is not defined.' },
    ],
  },
  {
    id: 'm15-c2', difficulty: 'easy', ref: GUIDE('SL 1.5'),
    question: 'State the laws of exponents for integer powers: aᵐ × aⁿ, aᵐ ÷ aⁿ, (aᵐ)ⁿ, a⁰ and a⁻ⁿ.',
    answer: 'aᵐ × aⁿ = aᵐ⁺ⁿ\naᵐ ÷ aⁿ = aᵐ⁻ⁿ\n(aᵐ)ⁿ = aᵐⁿ\na⁰ = 1 (a ≠ 0)\na⁻ⁿ = 1/aⁿ (a ≠ 0)',
    alternates: [
      { question: 'Simplify 5⁻² without a calculator.', answer: '1/25' },
      { question: 'True or false: 2³ × 3³ = 6⁶. Explain.', answer: 'False. 2³ × 3³ = (2 × 3)³ = 6³ — the powers are not added because the bases are different.' },
      { question: 'Simplify (x⁴)³ ÷ x⁵.', answer: 'x¹² ÷ x⁵ = x⁷' },
    ],
  },
  numberCard('m15-n1', 'medium', GUIDE('SL 1.5'),
    ({ k, a, b, m, j, c, d }) => {
      const coef = frac(k ** m, j);
      const px = a * m - c;
      const py = b * m - d;
      const variablePart = power('x', px) + power('y', py);
      const coefText = coef.d === 1 ? (coef.n === 1 && variablePart ? '' : `${coef.n}`) : `(${coef.n}/${coef.d})`;
      return {
        question: `Simplify (${k}${power('x', a)}${power('y', b)})${sup(m)} ÷ (${j}${power('x', c)}${power('y', d)}), leaving any negative powers.`,
        answer: `${coefText}${variablePart}` || '1',
        working: `Numerator: ${k}${sup(m)}x${sup(a * m)}y${sup(b * m)} = ${k ** m}x${sup(a * m)}y${sup(b * m)}. Divide: ${k ** m}/${j} = ${fracText(k ** m, j)}, x: ${num(a * m)} − ${par(c)} = ${num(px)}, y: ${num(b * m)} − ${par(d)} = ${num(py)}`,
      };
    },
    { k: 2, a: 3, b: -1, m: 3, j: 4, c: 2, d: 1 },
    rand => ({ k: pick(rand, [2, 3]), a: nonZero(rand, -2, 4), b: nonZero(rand, -2, 3), m: pick(rand, [2, 3]), j: pick(rand, [2, 3, 4, 6]), c: nonZero(rand, -3, 5), d: nonZero(rand, -3, 4) })),
  numberCard('m15-n2', 'easy', GUIDE('SL 1.5'),
    ({ k }) => {
      const shown = k >= 0 ? (10 ** k).toLocaleString('en-US') : `0.${'0'.repeat(-k - 1)}1`;
      return {
        question: `Without a calculator, find log₁₀ ${shown}.`,
        answer: num(k),
        working: `${shown} = 10${sup(k)}, so log₁₀ ${shown} = ${num(k)}`,
      };
    },
    { k: -4 },
    rand => ({ k: nonZero(rand, -6, 7) })),
  numberCard('m15-n3', 'medium', GUIDE('SL 1.5'),
    ({ a, N }) => {
      const x = Math.log10(N / a);
      return {
        question: `Solve ${a} × 10ˣ = ${N}, giving x to 3 significant figures.`,
        answer: `x = ${sf3(x)}`,
        working: `10ˣ = ${N}/${a} = ${Number((N / a).toFixed(4))} → x = log₁₀(${Number((N / a).toFixed(4))}) = ${sf3(x)}`,
      };
    },
    { a: 4, N: 900 },
    rand => ({ a: rand(2, 9), N: rand(15, 999) * 10 })),
  numberCard('m15-n4', 'medium', GUIDE('SL 1.5'),
    ({ m, N }) => {
      const x = Math.log(N) / m;
      return {
        question: `Solve e${sup(m)}ˣ = ${N}, giving x to 3 significant figures.`,
        answer: `x = ${sf3(x)}`,
        working: `Take ln of both sides: ${m}x = ln ${N} → x = ln ${N} ÷ ${m} = ${sf3(x)}`,
      };
    },
    { m: 2, N: 50 },
    rand => ({ m: rand(2, 5), N: rand(3, 200) })),
]);

// =====================================================================
// SL 1.6 Simple deductive proof
// =====================================================================

const t1_6 = deck('1.6 Simple deductive proof', [
  {
    id: 'm16-c1', difficulty: 'easy', ref: GUIDE('SL 1.6'),
    question: 'What is the difference between "=" and "≡"? How should an LHS to RHS proof be set out?',
    answer: '"=" means equal for particular values (an equation); "≡" means identically equal — true for ALL values (an identity).\nStart from the left-hand side only, rewrite it step by step, and finish with the right-hand side. Do not work on both sides at once.',
    alternates: [
      { question: 'Should you write (x + 1)² ≡ x² + 2x + 1 or (x + 1)² = x² + 2x + 1 to stress that it holds for every x?', answer: '(x + 1)² ≡ x² + 2x + 1 — "≡" shows an identity, true for all x.' },
      { question: 'Why is "start with LHS = RHS and simplify both sides until you get 0 = 0" not a valid proof?', answer: 'It assumes what you are trying to prove. A proof must start from one side and transform it into the other.' },
      { question: 'Prove that the sum of any three consecutive integers is a multiple of 3.', answer: 'Let the integers be n, n + 1, n + 2. Their sum is 3n + 3 = 3(n + 1), which is a multiple of 3 since n + 1 is an integer.' },
    ],
  },
  numberCard('m16-n1', 'medium', GUIDE('SL 1.6'),
    ({ a }) => ({
      question: `Show that (n + ${a})² − (n − ${a})² ≡ ${4 * a}n.`,
      answer: `LHS = (n² + ${2 * a}n + ${a * a}) − (n² − ${2 * a}n + ${a * a}) = n² + ${2 * a}n + ${a * a} − n² + ${2 * a}n − ${a * a} = ${4 * a}n = RHS`,
      working: 'Expand both brackets, remove the brackets carefully (the minus sign changes every sign in the second bracket), then collect like terms.',
    }),
    { a: 3 },
    rand => ({ a: rand(2, 9) })),
  numberCard('m16-n2', 'hard', GUIDE('SL 1.6'),
    ({ k, a }) => ({
      question: `Show that ${k}/(x − ${a}) − ${k}/(x + ${a}) ≡ ${2 * a * k}/(x² − ${a * a}).`,
      answer: `LHS = [${k === 1 ? '' : k}(x + ${a}) − ${k === 1 ? '' : k}(x − ${a})] / [(x − ${a})(x + ${a})] = (${coefTimes(k, 1, 'x')} + ${k * a} − ${coefTimes(k, 1, 'x')} + ${k * a}) / (x² − ${a * a}) = ${2 * a * k}/(x² − ${a * a}) = RHS`,
      working: 'Use the common denominator (x − a)(x + a) = x² − a² (difference of two squares), then simplify the numerator.',
    }),
    { k: 2, a: 3 },
    rand => ({ k: rand(1, 6), a: rand(1, 7) })),
  numberCard('m16-n3', 'hard', GUIDE('SL 1.6'),
    ({ a, c }) => ({
      question: `Show that x² + ${2 * a}x + ${a * a + c} > 0 for all real values of x.`,
      answer: `x² + ${2 * a}x + ${a * a + c} = (x + ${a})² + ${c}. Since (x + ${a})² ≥ 0 for all real x, (x + ${a})² + ${c} ≥ ${c} > 0.`,
      working: `Complete the square: x² + ${2 * a}x = (x + ${a})² − ${a * a}, so the expression is (x + ${a})² − ${a * a} + ${a * a + c} = (x + ${a})² + ${c}.`,
    }),
    { a: 3, c: 2 },
    rand => ({ a: rand(1, 8), c: rand(1, 9) })),
]);

// =====================================================================
// SL 1.7 Rational exponents, laws of logarithms, exponential equations
// =====================================================================

const t1_7 = deck('1.7 Rational exponents and laws of logarithms', [
  {
    id: 'm17-c1', difficulty: 'medium', ref: `${PRECALC(4)}; ${GUIDE('SL 1.7')}`,
    question: 'State the three laws of logarithms and the change of base formula.',
    answer: 'logₐ(xy) = logₐ x + logₐ y\nlogₐ(x/y) = logₐ x − logₐ y\nlogₐ(xᵐ) = m logₐ x  (a, x, y > 0)\nChange of base: logₐ x = log_b x ÷ log_b a',
    alternates: [
      { question: 'Write log 12 − log 3 + 2 log 5 as a single logarithm and evaluate it.', answer: 'log(12 × 5² ÷ 3) = log 100 = 2.' },
      { question: 'True or false: log(x + y) = log x + log y. Explain.', answer: 'False. The product law is log(xy) = log x + log y; there is no simple law for the log of a sum.' },
      { question: 'How would you evaluate log₇ 20 on a calculator that only has log and ln buttons?', answer: 'Use change of base: log₇ 20 = ln 20 ÷ ln 7 (or log 20 ÷ log 7) ≈ 1.54.' },
    ],
  },
  {
    id: 'm17-c2', difficulty: 'easy', ref: `${ALGTRIG(1)}; ${GUIDE('SL 1.7')}`,
    question: 'What does a rational exponent such as a^(m/n) mean?',
    answer: 'a^(m/n) = (ⁿ√a)ᵐ = ⁿ√(aᵐ): the nth root of a, raised to the power m. A negative exponent means the reciprocal: a^(−m/n) = 1 / a^(m/n).',
    alternates: [
      { question: 'Write ∛(x²) using a fractional power.', answer: 'x^(2/3)' },
      { question: 'Without a calculator, evaluate 8^(2/3).', answer: '(∛8)² = 2² = 4' },
      { question: 'Without a calculator, evaluate 25^(−1/2).', answer: '1/√25 = 1/5' },
    ],
  },
  numberCard('m17-n1', 'medium', GUIDE('SL 1.7'),
    ({ c, q, p }) => {
      const base = c ** q;
      const value = p > 0 ? `${c ** p}` : `1/${c ** -p}`;
      return {
        question: `Without a calculator, evaluate ${base}^(${num(p)}/${q}).`,
        answer: value,
        working: `${base} = ${c}${sup(q)}, so ${base}^(${num(p)}/${q}) = ${c}${sup(p)} = ${value}`,
      };
    },
    { c: 2, q: 4, p: -3 },
    rand => {
      const q = pick(rand, [2, 3, 4]);
      const c = q === 4 ? pick(rand, [2, 3]) : q === 3 ? pick(rand, [2, 3, 4, 5]) : pick(rand, [2, 3, 4, 5, 6, 7, 9]);
      let p = 0;
      while (p === 0 || gcd(Math.abs(p), q) !== 1) p = rand(-3, 3);
      return { c, q, p };
    }),
  numberCard('m17-n2', 'medium', GUIDE('SL 1.7'),
    ({ p10, q10, m, k }) => {
      const p = p10 / 10;
      const q = q10 / 10;
      const value = (m * p10 + q10 / 2 - 10 * k) / 10;
      return {
        question: `Given that logₐ x = ${p} and logₐ y = ${q}, find logₐ(x${sup(m)}√y ÷ ${power('a', k)}).`,
        answer: num(Number(value.toFixed(2))),
        working: `= ${m} logₐ x + ½ logₐ y − ${k === 1 ? '' : `${k} `}logₐ a = ${m} × ${p} + ½ × ${q} − ${k} = ${num(Number(value.toFixed(2)))}`,
      };
    },
    { p10: 23, q10: 18, m: 3, k: 2 },
    rand => ({ p10: rand(5, 40), q10: rand(2, 40, 2), m: rand(2, 4), k: rand(1, 3) })),
  numberCard('m17-n3', 'medium', GUIDE('SL 1.7'),
    ({ a, m, c, N }) => {
      const x = (Math.log(N) / Math.log(a) - c) / m;
      return {
        question: `Solve ${a}^(${linear(m, c)}) = ${N}, giving x to 3 significant figures.`,
        answer: `x = ${sf3(x)}`,
        working: `Take logs: (${linear(m, c)}) ln ${a} = ln ${N} → ${linear(m, c)} = ${sf3(Math.log(N) / Math.log(a))} → x = ${sf3(x)}`,
      };
    },
    { a: 3, m: 2, c: 1, N: 50 },
    rand => {
      let values;
      do {
        values = { a: pick(rand, [2, 3, 5, 7]), m: rand(2, 4), c: nonZero(rand, -3, 3), N: rand(10, 500) };
      } while (Math.abs(Math.log(values.N) / Math.log(values.a) - values.c) < 1e-9); // avoid the trivial answer x = 0
      return values;
    }),
  numberCard('m17-n4', 'hard', GUIDE('SL 1.7'),
    ({ a, b }) => {
      const x = (Math.log(a) + Math.log(b)) / (Math.log(b) - Math.log(a));
      return {
        question: `Solve ${a}^(x + 1) = ${b}^(x − 1), giving x to 3 significant figures.`,
        answer: `x = ${sf3(x)}`,
        working: `(x + 1) ln ${a} = (x − 1) ln ${b} → x ln ${a} + ln ${a} = x ln ${b} − ln ${b} → x(ln ${b} − ln ${a}) = ln ${a} + ln ${b} → x = ln ${a * b} ÷ ln(${b}/${a}) = ${sf3(x)}`,
      };
    },
    { a: 2, b: 5 },
    rand => {
      const a = pick(rand, [2, 3, 4, 5]);
      let b = a;
      while (b === a) b = pick(rand, [2, 3, 5, 6, 7, 9]);
      return { a, b };
    },
    60),
  numberCard('m17-n5', 'hard', GUIDE('SL 1.7'),
    ({ s, t }) => {
      const x = 2 ** s;
      const k = 2 ** s - 2 ** t;
      const m = s + t;
      const other = -(2 ** t);
      return {
        question: `Solve log₂ x + log₂(x − ${k}) = ${m}.`,
        answer: `x = ${x}`,
        working: `log₂(x(x − ${k})) = ${m} → x² − ${k}x = ${2 ** m} → x² − ${k}x − ${2 ** m} = 0 → (x − ${x})(x + ${2 ** t}) = 0 → x = ${x} or x = ${num(other)}. Reject ${num(other)}: log₂ of a negative number is undefined.`,
      };
    },
    { s: 3, t: 1 },
    rand => {
      const s = rand(2, 5);
      return { s, t: rand(0, s - 1) };
    },
    60),
]);

// =====================================================================
// SL 1.8 Sum of infinite geometric sequences
// =====================================================================

const t1_8 = deck('1.8 Infinite geometric series', [
  {
    id: 'm18-c1', difficulty: 'easy', ref: `${PRECALC(11)}; ${GUIDE('SL 1.8')}`,
    question: 'When does an infinite geometric series have a sum, and what is the formula?',
    answer: 'Only when |r| < 1 (the series converges).\nS∞ = u₁ / (1 − r)',
    alternates: [
      { question: 'Does 2 + 6 + 18 + … have a sum to infinity? Explain.', answer: 'No. r = 3 and |r| > 1, so the terms grow and the series diverges.' },
      { question: 'Find the sum to infinity of 12 + 6 + 3 + 1.5 + …', answer: 'r = 1/2, so S∞ = 12 ÷ (1 − 1/2) = 24.' },
      { question: 'Why can S∞ = u₁/(1 − r) only be used when |r| < 1?', answer: 'Only then does rⁿ → 0 as n → ∞, so Sₙ = u₁(1 − rⁿ)/(1 − r) approaches u₁/(1 − r).' },
    ],
  },
  numberCard('m18-n1', 'medium', GUIDE('SL 1.8'),
    ({ u1, p, q }) => {
      const S = frac(u1 * q, q - p);
      return {
        question: `Find the sum to infinity of the geometric series with first term ${num(u1)} and common ratio ${fracText(p, q)}.`,
        answer: fracText(S.n, S.d),
        working: `|r| = ${fracText(Math.abs(p), q)} < 1, so S∞ = ${num(u1)} ÷ (1 − ${p < 0 ? `(${fracText(p, q)})` : fracText(p, q)}) = ${num(u1)} ÷ ${fracText(q - p, q)} = ${fracText(S.n, S.d)}`,
      };
    },
    { u1: 18, p: -2, q: 3 },
    rand => {
      const q = rand(3, 7);
      let p = 0;
      while (p === 0 || gcd(Math.abs(p), q) !== 1) p = rand(-(q - 1), q - 1);
      return { u1: nonZero(rand, -20, 40), p, q };
    }),
  numberCard('m18-n2', 'hard', GUIDE('SL 1.8'),
    ({ a, b, c }) => ({
      question: `A geometric series has common ratio r = (${linear(a, b)})/${c}. Find the values of x for which the sum to infinity exists.`,
      answer: `${fracText(-c - b, a)} < x < ${fracText(c - b, a)}`,
      working: `Need |r| < 1: −1 < (${linear(a, b)})/${c} < 1 → ${num(-c)} < ${linear(a, b)} < ${c} → ${num(-c - b)} < ${coefTimes(a, 1, 'x')} < ${num(c - b)} → ${fracText(-c - b, a)} < x < ${fracText(c - b, a)}`,
    }),
    { a: 2, b: -1, c: 3 },
    rand => {
      let values;
      do {
        values = { a: rand(1, 5), b: nonZero(rand, -6, 6), c: rand(2, 9) };
      } while (gcd(gcd(values.a, values.b), values.c) !== 1); // keep the ratio in lowest terms
      return values;
    }),
  numberCard('m18-n3', 'medium', GUIDE('SL 1.8'),
    ({ u1, p, q }) => {
      const S = frac(u1 * q, q - p);
      return {
        question: `An infinite geometric series has first term ${u1} and sum to infinity ${fracText(S.n, S.d)}. Find the common ratio.`,
        answer: `r = ${fracText(p, q)}`,
        working: `${fracText(S.n, S.d)} = ${u1}/(1 − r) → 1 − r = ${u1} ÷ ${fracText(S.n, S.d)} = ${fracText(q - p, q)} → r = ${fracText(p, q)}`,
      };
    },
    { u1: 10, p: 3, q: 5 },
    rand => {
      const q = rand(3, 8);
      let p = 0;
      while (p === 0 || gcd(Math.abs(p), q) !== 1) p = rand(-(q - 1), q - 1);
      return { u1: rand(2, 30), p, q };
    }),
  numberCard('m18-n4', 'hard', GUIDE('SL 1.8'),
    ({ block }) => {
      const f = frac(block, 99);
      const digits = String(block).padStart(2, '0');
      return {
        question: `Use an infinite geometric series to write 0.${digits}${digits}${digits}… (the digits ${digits} repeating forever) as a fraction in its simplest form.`,
        answer: fracText(f.n, f.d),
        working: `0.${digits}${digits}… = ${block}/100 + ${block}/100² + … with u₁ = ${block}/100, r = 1/100. S∞ = (${block}/100) ÷ (1 − 1/100) = ${block}/99 = ${fracText(f.n, f.d)}`,
      };
    },
    { block: 27 },
    rand => {
      let block = 0;
      while (block === 0 || block % 11 === 0) block = rand(1, 98); // multiples of 11 are a single repeating digit
      return { block };
    }),
]);

// =====================================================================
// SL 1.9 The binomial theorem
// =====================================================================

const t1_9 = deck('1.9 The binomial theorem', [
  {
    id: 'm19-c1', difficulty: 'medium', ref: `${PRECALC(11)}; ${GUIDE('SL 1.9')}`,
    question: 'State the binomial theorem for (a + b)ⁿ, n ∈ ℕ, and give the general term.',
    answer: '(a + b)ⁿ = aⁿ + ⁿC₁aⁿ⁻¹b + … + ⁿCᵣaⁿ⁻ʳbʳ + … + bⁿ\nGeneral term: ⁿCᵣ aⁿ⁻ʳ bʳ, where ⁿCᵣ = n! / (r!(n − r)!).',
    alternates: [
      { question: 'How many terms are there in the expansion of (2x − 5)⁸?', answer: '9 terms — always n + 1 terms.' },
      { question: 'Use Pascal\'s triangle to write the coefficients in the expansion of (a + b)⁵.', answer: '1, 5, 10, 10, 5, 1' },
      { question: 'Without a calculator, find ⁶C₂.', answer: '6! ÷ (2! 4!) = (6 × 5) ÷ 2 = 15' },
    ],
  },
  numberCard('m19-n1', 'medium', GUIDE('SL 1.9'),
    ({ a, b, n, k }) => {
      const coef = nCr(n, k) * a ** (n - k) * b ** k;
      return {
        question: `Find the coefficient of x${sup(k)} in the expansion of (${a} ${b < 0 ? MINUS : '+'} ${Math.abs(b) === 1 ? '' : Math.abs(b)}x)${sup(n)}.`,
        answer: num(coef),
        working: `Term in x${sup(k)}: ${n}C${k} × ${a}${sup(n - k)} × (${b < 0 ? MINUS : ''}${coefTimes(Math.abs(b), 1, 'x')})${sup(k)}, so the coefficient is ${nCr(n, k)} × ${a ** (n - k)} × ${par(b ** k)} = ${num(coef)}`,
      };
    },
    { a: 2, b: -3, n: 6, k: 4 },
    rand => {
      const n = rand(4, 8);
      return { a: rand(1, 3), b: nonZero(rand, -4, 4), n, k: rand(2, n - 1) };
    }),
  numberCard('m19-n2', 'hard', GUIDE('SL 1.9'),
    ({ n, c }) => {
      const r = (2 * n) / 3;
      const value = nCr(n, r) * c ** r;
      return {
        question: `Find the term independent of x in the expansion of (x² ${c < 0 ? MINUS : '+'} ${Math.abs(c)}/x)${sup(n)}.`,
        answer: num(value),
        working: `General term: ${n}Cᵣ (x²)${sup(n)}⁻ʳ (${num(c)}/x)ʳ = ${n}Cᵣ (${num(c)})ʳ x^(${2 * n} − 3r). Independent of x when ${2 * n} − 3r = 0 → r = ${r}. Term = ${n}C${r} × ${par(c)}${sup(r)} = ${nCr(n, r)} × ${par(c ** r)} = ${num(value)}`,
      };
    },
    { n: 6, c: 2 },
    rand => ({ n: pick(rand, [3, 6, 9]), c: pick(rand, [-3, -2, -1, 2, 3]) }),
    60),
  numberCard('m19-n3', 'medium', GUIDE('SL 1.9'),
    ({ k, n }) => {
      const t1 = n * k;
      const t2 = nCr(n, 2) * k * k;
      return {
        question: `Find the first three terms, in ascending powers of x, of (1 ${k < 0 ? MINUS : '+'} ${coefTimes(Math.abs(k), 1, 'x')})${sup(n)}.`,
        answer: `1 ${t1 < 0 ? MINUS : '+'} ${Math.abs(t1)}x + ${t2}x²`,
        working: `1 + ${n}C1(${k < 0 ? MINUS : ''}${coefTimes(Math.abs(k), 1, 'x')}) + ${n}C2(${k < 0 ? MINUS : ''}${coefTimes(Math.abs(k), 1, 'x')})² = ${polyText([{ c: 1, v: '' }, { c: t1, v: 'x' }, { c: t2, v: 'x²' }])}`,
      };
    },
    { k: -2, n: 7 },
    rand => ({ k: nonZero(rand, -4, 4), n: rand(5, 10) })),
  numberCard('m19-n4', 'hard', GUIDE('SL 1.9'),
    ({ k, n }) => {
      const V = nCr(n, 2) * k * k;
      return {
        question: `The coefficient of x² in the expansion of (1 + kx)${sup(n)} is ${V}. Find the possible values of k.`,
        answer: `k = ±${k}`,
        working: `${n}C2 k² = ${V} → ${nCr(n, 2)}k² = ${V} → k² = ${k * k} → k = ±${k}`,
      };
    },
    { k: 3, n: 6 },
    rand => ({ k: rand(2, 5), n: rand(4, 9) })),
]);

// =====================================================================
// AHL 1.10 Counting principles and extended binomial theorem (HL)
// =====================================================================

const WORDS = ['BANANA', 'LETTER', 'SUCCESS', 'PEPPER', 'STATISTICS', 'MISSISSIPPI', 'COFFEE', 'BALLOON', 'COMMITTEE', 'ASSESSMENT'];

const t1_10 = deck('1.10 Counting principles (HL)', [
  {
    id: 'm110-c1', difficulty: 'medium', ref: `${PRECALC(11)}; ${GUIDE('AHL 1.10')}`,
    question: 'HL: What is the difference between a permutation and a combination? Give ⁿPᵣ and ⁿCᵣ.',
    answer: 'Permutation: "a selection of objects in which order matters". ⁿPᵣ = n! / (n − r)!\nCombination: "a selection of objects in which order does not matter". ⁿCᵣ = n! / (r!(n − r)!)',
    alternates: [
      { question: 'HL: Choosing 3 students to form a committee — permutation or combination? Why?', answer: 'Combination — the order in which they are chosen does not matter.' },
      { question: 'HL: Awarding gold, silver and bronze to 3 of 10 runners — permutation or combination? Why?', answer: 'Permutation — the order matters (who gets which medal). ¹⁰P₃ = 720.' },
      { question: 'HL: State the multiplication (fundamental counting) principle.', answer: '"If one event can occur in m ways and a second event can occur in n ways after the first event has occurred, then the two events can occur in m × n ways."' },
    ],
  },
  numberCard('m110-n1', 'medium', GUIDE('AHL 1.10'),
    ({ word }) => {
      const counts = {};
      for (const ch of word) counts[ch] = (counts[ch] ?? 0) + 1;
      const repeats = Object.entries(counts).filter(([, c]) => c > 1);
      const denominator = repeats.reduce((prod, [, c]) => prod * factorial(c), 1);
      const total = factorial(word.length) / denominator;
      return {
        question: `HL: How many different arrangements are there of the letters of the word ${word}?`,
        answer: total.toLocaleString('en-US'),
        working: `${word.length} letters with repeats ${repeats.map(([ch, c]) => `${ch} × ${c}`).join(', ')}: ${word.length}! ÷ (${repeats.map(([, c]) => `${c}!`).join(' × ')}) = ${total.toLocaleString('en-US')}`,
      };
    },
    { word: 'STATISTICS' },
    rand => ({ word: pick(rand, WORDS) })),
  numberCard('m110-n2', 'hard', GUIDE('AHL 1.10'),
    ({ men, women, k }) => {
      const all = nCr(men + women, k);
      const noWomen = nCr(men, k);
      return {
        question: `HL: A committee of ${k} is chosen from ${men} men and ${women} women. In how many ways can this be done if the committee must include at least one woman?`,
        answer: `${(all - noWomen).toLocaleString('en-US')}`,
        working: `Total − no women = ${men + women}C${k} − ${men}C${k} = ${all.toLocaleString('en-US')} − ${noWomen.toLocaleString('en-US')} = ${(all - noWomen).toLocaleString('en-US')}`,
      };
    },
    { men: 7, women: 5, k: 4 },
    rand => {
      const k = rand(3, 5);
      return { men: rand(k, 9), women: rand(2, 8), k };
    }),
  numberCard('m110-n3', 'hard', GUIDE('AHL 1.10'),
    ({ n }) => {
      const together = 2 * factorial(n - 1);
      const apart = factorial(n) - together;
      return {
        question: `HL: ${n} people, including Ana and Ben, sit in a row. In how many ways can they sit if (a) Ana and Ben sit together, (b) Ana and Ben do not sit together?`,
        answer: `(a) ${together.toLocaleString('en-US')}  (b) ${apart.toLocaleString('en-US')}`,
        working: `(a) Treat Ana and Ben as one unit: ${n - 1}! arrangements × 2 orders = ${together.toLocaleString('en-US')}. (b) Total − together = ${n}! − ${together.toLocaleString('en-US')} = ${apart.toLocaleString('en-US')}`,
      };
    },
    { n: 6 },
    rand => ({ n: rand(5, 9) })),
  numberCard('m110-n4', 'hard', GUIDE('AHL 1.10'),
    ({ a, p, q }) => {
      // (1 + ax)^(p/q) = 1 + (p/q)(a x) + [(p/q)(p/q − 1)/2](a x)² + …
      const c1 = frac(p * a, q);
      const c2 = frac(p * (p - q) * a * a, 2 * q * q);
      const power = q === 1 ? num(p) : `${num(p)}/${q}`;
      const term = (c, v) => `${c.n < 0 ? ` ${MINUS} ` : ' + '}${coefTimes(c.n, c.d, v)}`;
      return {
        question: `HL: Find the first three terms in the expansion of (1 ${a < 0 ? MINUS : '+'} ${Math.abs(a)}x)^(${power}), and state the values of x for which it is valid.`,
        answer: `1${term(c1, 'x')}${term(c2, 'x²')}, valid for |x| < 1/${Math.abs(a)}`,
        working: `(1 + y)ⁿ = 1 + ny + n(n − 1)/2 y² + … with n = ${power}, y = ${num(a)}x: ${power} × ${par(a)} = ${fracText(c1.n, c1.d)}; (${power})(${power} − 1)/2 × ${a * a} = ${fracText(c2.n, c2.d)}. Valid when |${num(a)}x| < 1.`,
      };
    },
    { a: 2, p: 1, q: 2 },
    rand => {
      const [p, q] = pick(rand, [[1, 2], [-1, 2], [1, 3], [-1, 3], [-2, 1], [-3, 1], [3, 2], [-3, 2]]);
      return { a: pick(rand, [-4, -3, -2, 2, 3, 4]), p, q };
    },
    90),
  numberCard('m110-n5', 'medium', GUIDE('AHL 1.10'),
    ({ n, k }) => ({
      question: `HL: A code is made of ${k} symbols, each chosen from ${n} different symbols. How many codes are possible if (a) no symbol may be used more than once, (b) symbols may be repeated?`,
      answer: `(a) ${nPr(n, k).toLocaleString('en-US')}  (b) ${(n ** k).toLocaleString('en-US')}`,
      working: `(a) Order matters, no repeats: ${n}P${k} = ${Array.from({ length: k }, (_, i) => n - i).join(' × ')} = ${nPr(n, k).toLocaleString('en-US')}. (b) ${n} choices each time: ${n}${sup(k)} = ${(n ** k).toLocaleString('en-US')}`,
    }),
    { n: 8, k: 4 },
    rand => ({ n: rand(6, 12), k: rand(3, 5) })),
]);

// =====================================================================
// AHL 1.11 Partial fractions (HL)
// =====================================================================

const t1_11 = deck('1.11 Partial fractions (HL)', [
  {
    id: 'm111-c1', difficulty: 'medium', ref: `${PRECALC(9)}; ${GUIDE('AHL 1.11')}`,
    question: 'HL: When can a fraction be split into partial fractions in IB, and what form do you use?',
    answer: 'When the denominator has (at most two) distinct linear factors and the degree of the numerator is less than the degree of the denominator:\n(px + q)/((ax + b)(cx + d)) ≡ A/(ax + b) + B/(cx + d).',
    alternates: [
      { question: 'HL: Write the form of the partial fractions for (5x − 1)/((x + 2)(x − 3)).', answer: 'A/(x + 2) + B/(x − 3)' },
      { question: 'HL: Describe the "substitution" (cover-up) method for finding A and B.', answer: 'Multiply through by the denominator, then substitute the x-value that makes each linear factor zero; each substitution leaves one unknown to find.' },
      { question: 'HL: Why must you factorise the denominator first?', answer: 'The partial fractions are built from the linear factors of the denominator, so you need to know them.' },
    ],
  },
  numberCard('m111-n1', 'hard', GUIDE('AHL 1.11'),
    ({ A, B, a, b }) => {
      // A/(x − a) + B/(x − b) = [A(x − b) + B(x − a)] / ((x − a)(x − b))
      const p = A + B;
      const q = -A * b - B * a;
      const s = -(a + b);
      const t = a * b;
      return {
        question: `HL: Express (${linear(p, q)}) / (${polyText([{ c: 1, v: 'x²' }, { c: s, v: 'x' }, { c: t, v: '' }])}) in partial fractions.`,
        answer: `${num(A)}/(${linear(1, -a)}) ${B < 0 ? MINUS : '+'} ${Math.abs(B)}/(${linear(1, -b)})`,
        working: `Denominator = (${linear(1, -a)})(${linear(1, -b)}). ${linear(p, q)} ≡ A(${linear(1, -b)}) + B(${linear(1, -a)}). x = ${num(a)}: ${num(p * a + q)} = ${num(a - b)}A → A = ${num(A)}. x = ${num(b)}: ${num(p * b + q)} = ${num(b - a)}B → B = ${num(B)}`,
      };
    },
    { A: 3, B: 2, a: 1, b: -4 },
    rand => {
      const a = nonZero(rand, -6, 6);
      let b = a;
      while (b === a) b = nonZero(rand, -6, 6);
      let A = 0;
      let B = 0;
      while (A + B === 0) {
        A = nonZero(rand, -5, 6);
        B = nonZero(rand, -5, 6);
      }
      return { A, B, a, b };
    },
    90),
  numberCard('m111-n2', 'hard', GUIDE('AHL 1.11'),
    ({ A, B, c, d, e }) => {
      // A/(cx + d) + B/(x + e) = [A(x + e) + B(cx + d)] / ((cx + d)(x + e))
      const p = A + B * c;
      const q = A * e + B * d;
      const x1 = frac(-d, c);
      return {
        question: `HL: Express (${linear(p, q)}) / ((${linear(c, d)})(${linear(1, e)})) in partial fractions.`,
        answer: `${num(A)}/(${linear(c, d)}) ${B < 0 ? MINUS : '+'} ${Math.abs(B)}/(${linear(1, e)})`,
        working: `${linear(p, q)} ≡ A(${linear(1, e)}) + B(${linear(c, d)}). x = ${num(-e)}: ${num(p * -e + q)} = ${num(c * -e + d)}B → B = ${num(B)}. x = ${fracText(x1.n, x1.d)}: A(${fracText(x1.n, x1.d)} ${e < 0 ? MINUS : '+'} ${Math.abs(e)}) = ${fracText(p * x1.n + q * x1.d, x1.d)} → A = ${num(A)}`,
      };
    },
    { A: 4, B: -1, c: 2, d: 1, e: 3 },
    rand => {
      const c = rand(2, 4);
      let d = 0;
      while (gcd(c, d) !== 1) d = nonZero(rand, -5, 5);
      let e = 0;
      while (e === 0 || c * e === d) e = nonZero(rand, -5, 5); // factors must be different
      let A = 0;
      let B = 0;
      while (A + B * c === 0) {
        A = nonZero(rand, -5, 6);
        B = nonZero(rand, -4, 4);
      }
      return { A, B, c, d, e };
    },
    90),
]);

// =====================================================================
// AHL 1.12 Complex numbers in Cartesian form (HL)
// =====================================================================

const cx = (a, b) => complexText(surd(a), surd(b));

const t1_12 = deck('1.12 Complex numbers: Cartesian form (HL)', [
  {
    id: 'm112-c1', difficulty: 'easy', ref: `${PRECALC(3)}; ${GUIDE('AHL 1.12')}`,
    question: 'HL: For z = a + bi, define the real part, imaginary part, complex conjugate, modulus and argument.',
    answer: 'i² = −1. Re(z) = a, Im(z) = b.\nConjugate z* = a − bi.\nModulus |z| = √(a² + b²) — the distance from the origin in the complex plane.\nArgument arg z = the angle θ from the positive real axis to z (usually −π < θ ≤ π).',
    alternates: [
      { question: 'HL: What is the product of z = a + bi and its conjugate z*?', answer: 'zz* = a² + b² = |z|² — always a real number.' },
      { question: 'HL: In which quadrant of the complex plane is −3 + 2i, and is its argument positive or negative?', answer: 'Second quadrant (real part negative, imaginary part positive); the argument is positive, between π/2 and π.' },
      { question: 'HL: Simplify i⁷.', answer: 'i⁷ = i⁴ × i³ = 1 × (−i) = −i' },
    ],
  },
  numberCard('m112-n1', 'medium', GUIDE('AHL 1.12'),
    ({ a, b, c, d }) => ({
      question: `HL: Find (${cx(a, b)})(${cx(c, d)}) in the form x + yi.`,
      answer: cx(a * c - b * d, a * d + b * c),
      working: `= ${num(a * c)} + ${par(a * d)}i + ${par(b * c)}i + ${par(b * d)}i² = (${num(a * c)} − ${par(b * d)}) + (${num(a * d)} + ${par(b * c)})i = ${cx(a * c - b * d, a * d + b * c)}`,
    }),
    { a: 3, b: -2, c: 1, d: 4 },
    rand => ({ a: nonZero(rand, -6, 6), b: nonZero(rand, -6, 6), c: nonZero(rand, -5, 5), d: nonZero(rand, -5, 5) })),
  numberCard('m112-n2', 'hard', GUIDE('AHL 1.12'),
    ({ a, b, c, d }) => {
      const den = c * c + d * d;
      const re = frac(a * c + b * d, den);
      const im = frac(b * c - a * d, den);
      return {
        question: `HL: Write (${cx(a, b)}) ÷ (${cx(c, d)}) in the form x + yi, where x and y are exact.`,
        answer: complexText(surd(re.n, re.d), surd(im.n, im.d)),
        working: `Multiply top and bottom by the conjugate ${cx(c, -d)}: numerator = ${cx(a * c + b * d, b * c - a * d)}, denominator = ${par(c)}² + ${par(d)}² = ${den}. So ${complexText(surd(re.n, re.d), surd(im.n, im.d))}`,
      };
    },
    { a: 4, b: 3, c: 1, d: -2 },
    rand => ({ a: nonZero(rand, -6, 6), b: nonZero(rand, -6, 6), c: nonZero(rand, -4, 4), d: nonZero(rand, -4, 4) }),
    60),
  numberCard('m112-n3', 'medium', GUIDE('AHL 1.12'),
    ({ a, b }) => {
      const arg = Math.atan2(b, a);
      return {
        question: `HL: Find the modulus and argument of z = ${cx(a, b)}. Give the modulus exactly and the argument in radians to 3 significant figures (−π < arg z ≤ π).`,
        answer: `|z| = ${sqrtText(a * a + b * b)}, arg z = ${sf3(arg)}`,
        working: `|z| = √(${par(a)}² + ${par(b)}²) = √${a * a + b * b}${sqrtText(a * a + b * b) === `√${a * a + b * b}` ? '' : ` = ${sqrtText(a * a + b * b)}`}. z is in quadrant ${a > 0 ? (b > 0 ? 'I' : 'IV') : b > 0 ? 'II' : 'III'}, so arg z = ${sf3(arg)} (check the quadrant — don't just use arctan(${num(b)}/${num(a)}) = ${sf3(Math.atan(b / a))})`,
      };
    },
    { a: -3, b: 4 },
    rand => ({ a: nonZero(rand, -7, 7), b: nonZero(rand, -7, 7) })),
  numberCard('m112-n4', 'medium', GUIDE('AHL 1.12'),
    ({ p, q }) => ({
      question: `HL: Solve z² ${-2 * p < 0 ? MINUS : '+'} ${Math.abs(2 * p)}z + ${p * p + q * q} = 0.`,
      answer: `z = ${cx(p, q)} or z = ${cx(p, -q)}`,
      working: `Discriminant = ${4 * p * p} − ${4 * (p * p + q * q)} = ${num(-4 * q * q)} < 0. z = (${num(2 * p)} ± √(${num(-4 * q * q)})) ÷ 2 = (${num(2 * p)} ± ${2 * q}i) ÷ 2 = ${num(p)} ± ${q === 1 ? '' : q}i`,
    }),
    { p: 3, q: 2 },
    rand => ({ p: nonZero(rand, -5, 5), q: rand(1, 6) })),
  numberCard('m112-n5', 'hard', GUIDE('AHL 1.12'),
    ({ k, x, y }) => {
      // k z + i z* with z = x + yi:  k x + k y i + i(x − y i) = (k x + y) + (k y + x) i
      const re = k * x + y;
      const im = k * y + x;
      return {
        question: `HL: Find the complex number z such that ${k}z + iz* = ${cx(re, im)}.`,
        answer: `z = ${cx(x, y)}`,
        working: `Let z = x + yi: ${k}(x + yi) + i(x − yi) = (${k}x + y) + (x + ${k}y)i. Compare: ${k}x + y = ${num(re)} and x + ${k}y = ${num(im)}. Solving gives x = ${num(x)}, y = ${num(y)}.`,
      };
    },
    { k: 2, x: 3, y: -1 },
    rand => ({ k: rand(2, 4), x: nonZero(rand, -6, 6), y: nonZero(rand, -6, 6) }),
    90),
]);

// =====================================================================
// AHL 1.13 Polar and Euler form (HL)
// =====================================================================

const NICE_ANGLES = [-150, -135, -120, -90, -60, -45, -30, 30, 45, 60, 90, 120, 135, 150, 180];

// Exact Cartesian form of r cis θ (r a whole number, θ in degrees)
function polarToCartesian(r, deg) {
  return complexText(surdTimes(surd(r), cosExact(deg)), surdTimes(surd(r), sinExact(deg)));
}

const t1_13 = deck('1.13 Polar and Euler form (HL)', [
  {
    id: 'm113-c1', difficulty: 'medium', ref: `${PRECALC(8)}; ${GUIDE('AHL 1.13')}`,
    question: 'HL: Write z in modulus–argument (polar) form and in Euler form. What happens to moduli and arguments when two complex numbers are multiplied?',
    answer: 'z = r(cos θ + i sin θ) = r cis θ = re^(iθ), where r = |z| and θ = arg z.\nMultiplying: moduli multiply and arguments add — r₁e^(iθ₁) × r₂e^(iθ₂) = r₁r₂e^(i(θ₁ + θ₂)). Dividing: moduli divide and arguments subtract.',
    alternates: [
      { question: 'HL: Geometrically, what does multiplying a complex number by i do?', answer: 'Rotates it anticlockwise by π/2 about the origin (i = e^(iπ/2), modulus 1).' },
      { question: 'HL: Write −1 in Euler form.', answer: '−1 = e^(iπ) (modulus 1, argument π).' },
      { question: 'HL: If |z| = 3 and arg z = π/5, what are |z²| and arg(z²)?', answer: '|z²| = 9 and arg(z²) = 2π/5.' },
    ],
  },
  numberCard('m113-n1', 'medium', GUIDE('AHL 1.13'),
    ({ r, deg }) => ({
      question: `HL: Write z = ${polarToCartesian(r, deg)} in the form r cis θ, where r > 0 and −π < θ ≤ π.`,
      answer: `${r} cis(${piText(deg)})`,
      working: `r = |z| = ${r}. cos θ = ${surdText(cosExact(deg))}, sin θ = ${surdText(sinExact(deg))}, so θ = ${piText(deg)} (check the quadrant).`,
    }),
    { r: 4, deg: 120 },
    rand => ({ r: rand(2, 6), deg: pick(rand, NICE_ANGLES) })),
  numberCard('m113-n2', 'medium', GUIDE('AHL 1.13'),
    ({ r, deg }) => ({
      question: `HL: Write z = ${eulerText(r, deg)} in Cartesian form, exactly.`,
      answer: polarToCartesian(r, deg),
      working: `z = ${r}(cos(${piText(deg)}) + i sin(${piText(deg)})) = ${r}(${surdText(cosExact(deg))} + (${surdText(sinExact(deg))})i) = ${polarToCartesian(r, deg)}`,
    }),
    { r: 6, deg: -135 },
    rand => ({ r: rand(2, 8), deg: pick(rand, NICE_ANGLES) })),
  numberCard('m113-n3', 'hard', GUIDE('AHL 1.13'),
    ({ r1, d1, r2, d2 }) => {
      const product = principal(d1 + d2);
      const quotient = principal(d1 - d2);
      const ratio = frac(r1, r2);
      return {
        question: `HL: z = ${eulerText(r1, d1)} and w = ${eulerText(r2, d2)}. Find zw and z/w in the form re^(iθ), −π < θ ≤ π.`,
        answer: `zw = ${eulerText(r1 * r2, product)},  z/w = ${eulerText(fracText(ratio.n, ratio.d), quotient)}`,
        working: `Multiply moduli, add arguments: ${r1} × ${r2} = ${r1 * r2}, ${piText(d1)} + ${piPar(d2)} = ${piText(d1 + d2)}${d1 + d2 === product ? '' : ` → ${piText(product)}`}. Divide moduli, subtract arguments: ${fracText(ratio.n, ratio.d)}, ${piText(d1)} − ${piPar(d2)} = ${piText(d1 - d2)}${d1 - d2 === quotient ? '' : ` → ${piText(quotient)}`}`,
      };
    },
    { r1: 6, d1: 120, r2: 2, d2: 135 },
    rand => ({ r1: rand(2, 9), d1: pick(rand, NICE_ANGLES), r2: rand(2, 5), d2: pick(rand, NICE_ANGLES) }),
    60),
]);

// =====================================================================
// AHL 1.14 Conjugate roots, De Moivre's theorem, powers and roots (HL)
// =====================================================================

// Complex numbers with exact polar forms, for De Moivre questions.
const DE_MOIVRE_BASES = [
  { text: '1 + i', r: 'root2', deg: 45 },
  { text: '1 − i', r: 'root2', deg: -45 },
  { text: '−1 + i', r: 'root2', deg: 135 },
  { text: '√3 + i', r: 2, deg: 30 },
  { text: '1 − √3i', r: 2, deg: -60 },
  { text: '−√3 + i', r: 2, deg: 150 },
];

// r to the power n, as a surd (r is 2 or √2)
function modulusPower(r, n) {
  if (r === 'root2') return n % 2 === 0 ? surd(2 ** (n / 2)) : surd(2 ** ((n - 1) / 2), 1, 2);
  return surd(r ** n);
}

const t1_14 = deck('1.14 De Moivre\'s theorem and complex roots (HL)', [
  {
    id: 'm114-c1', difficulty: 'medium', ref: `${PRECALC(8)}; ${GUIDE('AHL 1.14')}`,
    question: 'HL: State De Moivre\'s theorem and the conjugate root theorem.',
    answer: 'De Moivre: [r(cos θ + i sin θ)]ⁿ = rⁿ(cos nθ + i sin nθ), i.e. (r cis θ)ⁿ = rⁿ cis(nθ).\nConjugate roots: if a polynomial equation has real coefficients and a + bi is a root, then a − bi is also a root.',
    alternates: [
      { question: 'HL: A cubic equation with real coefficients has roots 2 and 3 − i. What is its third root?', answer: '3 + i — complex roots of real-coefficient polynomials come in conjugate pairs.' },
      { question: 'HL: How many distinct nth roots does a non-zero complex number have, and how are they arranged?', answer: 'n roots, all with the same modulus, equally spaced around a circle with arguments 2π/n apart.' },
      { question: 'HL: True or false: x² + 4 = 0 has real coefficients, so its roots must be real. Explain.', answer: 'False. Its roots are ±2i. Real coefficients only guarantee that complex roots come in conjugate pairs.' },
    ],
  },
  numberCard('m114-n1', 'hard', GUIDE('AHL 1.14'),
    ({ base, n }) => {
      const R = modulusPower(base.r, n);
      const angle = principal(base.deg * n);
      const result = complexText(surdTimes(R, cosExact(angle)), surdTimes(R, sinExact(angle)));
      const rText = base.r === 'root2' ? '√2' : `${base.r}`;
      return {
        question: `HL: Use De Moivre's theorem to find (${base.text})${sup(n)} in the form a + bi.`,
        answer: result,
        working: `${base.text} = ${rText} cis(${piText(base.deg)}). (${rText})${sup(n)} = ${surdText(R)}; ${n} × ${piPar(base.deg)} = ${piText(base.deg * n)} ≡ ${piText(angle)}. So ${surdText(R)} cis(${piText(angle)}) = ${result}`,
      };
    },
    { base: DE_MOIVRE_BASES[3], n: 5 },
    rand => ({ base: pick(rand, DE_MOIVRE_BASES), n: rand(3, 10) }),
    90),
  numberCard('m114-n2', 'hard', GUIDE('AHL 1.14'),
    ({ rho, n, deg }) => {
      const R = rho ** n;
      const roots = Array.from({ length: n }, (_, k) => principal((deg + 360 * k) / n)).sort((x, y) => x - y);
      const angles = roots.map(d => piText(d));
      return {
        question: `HL: Solve z${sup(n)} = ${polarToCartesian(R, deg)}. Give your answers in the form r cis θ, −π < θ ≤ π.`,
        answer: angles.map(a => `${rho === 1 ? '' : `${rho} `}cis(${a})`).join(',  '),
        working: `${polarToCartesian(R, deg)} = ${R} cis(${piText(deg)} + 2kπ). z = ${R}^(1/${n}) cis((${piText(deg)} + 2kπ)/${n}) = ${rho} cis(${piText(deg / n)} + 2kπ/${n}), k = 0, …, ${n - 1}`,
      };
    },
    { rho: 2, n: 3, deg: 90 },
    rand => ({ rho: rand(1, 3), n: rand(3, 4), deg: pick(rand, [90, -90, 180, 60, 120, -60, 45, 135]) }),
    120),
  numberCard('m114-n3', 'hard', GUIDE('AHL 1.14'),
    ({ a, b, r }) => {
      const m = a * a + b * b;
      const p = -2 * a - r;
      const q = m + 2 * a * r;
      const s = -r * m;
      return {
        question: `HL: Given that ${cx(a, b)} is a root of ${polyText([{ c: 1, v: 'z³' }, { c: p, v: 'z²' }, { c: q, v: 'z' }, { c: s, v: '' }])} = 0, find the other two roots.`,
        answer: `${cx(a, -b)} and ${num(r)}`,
        working: `Real coefficients, so the conjugate ${cx(a, -b)} is also a root. (z − (${cx(a, b)}))(z − (${cx(a, -b)})) = ${polyText([{ c: 1, v: 'z²' }, { c: -2 * a, v: 'z' }, { c: m, v: '' }])}. Comparing constants: ${m} × (−r) = ${num(s)} → third root r = ${num(r)}`,
      };
    },
    { a: 2, b: 1, r: -3 },
    rand => ({ a: nonZero(rand, -4, 4), b: rand(1, 4), r: nonZero(rand, -5, 5) }),
    90),
]);

// =====================================================================
// AHL 1.15 Proof by induction, contradiction and counterexample (HL)
// =====================================================================

const t1_15 = deck('1.15 Proof (HL)', [
  {
    id: 'm115-c1', difficulty: 'medium', ref: GUIDE('AHL 1.15'),
    question: 'HL: Describe the four steps of a proof by mathematical induction.',
    answer: '1. Basis: show the statement is true for the first value (usually n = 1).\n2. Assumption: assume it is true for n = k.\n3. Inductive step: using the assumption, prove it is true for n = k + 1.\n4. Conclusion: since it is true for n = 1, and true for k ⇒ true for k + 1, it is true for all n ∈ ℤ⁺.',
    alternates: [
      { question: 'HL: Why is the basis step essential in a proof by induction?', answer: 'Without a starting case, "true for k ⇒ true for k + 1" proves nothing — the chain of implications needs a first true statement.' },
      { question: 'HL: In the inductive step, what must you use?', answer: 'The assumption that the statement is true for n = k.' },
      { question: 'HL: Write a suitable final conclusion sentence for a proof by induction.', answer: 'Since the statement is true for n = 1, and if it is true for n = k it is true for n = k + 1, by mathematical induction it is true for all positive integers n.' },
    ],
  },
  {
    id: 'm115-c2', difficulty: 'hard', ref: GUIDE('AHL 1.15'),
    question: 'HL: Outline a proof by contradiction that √2 is irrational.',
    answer: 'Assume √2 = p/q with p, q integers with no common factor. Then 2q² = p², so p² is even, so p is even: p = 2m. Then 2q² = 4m², so q² = 2m² and q is even. Both p and q are even — contradicting "no common factor". So √2 is irrational.',
    alternates: [
      { question: 'HL: What is the first step of a proof by contradiction?', answer: 'Assume the opposite of the statement you want to prove.' },
      { question: 'HL: In the proof that √2 is irrational, what contradiction is reached?', answer: 'p and q are both even, although they were assumed to have no common factor.' },
      { question: 'HL: Is one counterexample enough to disprove "for all n" statements? Explain.', answer: 'Yes. A single case where the statement is false shows it is not always true.' },
    ],
  },
  numberCard('m115-n1', 'hard', GUIDE('AHL 1.15'),
    ({ a }) => ({
      question: `HL: Prove by mathematical induction that ${a}ⁿ − 1 is divisible by ${a - 1} for all n ∈ ℤ⁺.`,
      answer: `Basis: n = 1: ${a} − 1 = ${a - 1}, divisible by ${a - 1}. Assume ${a}ᵏ − 1 = ${a - 1}M for some integer M. Then ${a}ᵏ⁺¹ − 1 = ${a} × ${a}ᵏ − 1 = ${a}(${a - 1}M + 1) − 1 = ${a - 1} × ${a}M + ${a - 1} = ${a - 1}(${a}M + 1), which is divisible by ${a - 1}. True for n = 1 and true for k ⇒ true for k + 1, so true for all n ∈ ℤ⁺.`,
      working: `Key step: write ${a}ᵏ = ${a - 1}M + 1 from the assumption, then substitute into ${a}ᵏ⁺¹ = ${a} × ${a}ᵏ.`,
    }),
    { a: 7 },
    rand => ({ a: rand(3, 11) }),
    120),
  numberCard('m115-n2', 'medium', GUIDE('AHL 1.15'),
    ({ p }) => {
      let n = 1;
      while (isPrime(n * n - n + p)) n += 1;
      const value = n * n - n + p;
      const factor = Array.from({ length: value }, (_, i) => i + 2).find(f => value % f === 0);
      return {
        question: `HL: Find a counterexample to the statement "n² − n + ${p} is prime for every positive integer n".`,
        answer: `n = ${n}: ${n}² − ${n} + ${p} = ${value} = ${factor} × ${value / factor}, which is not prime.`,
        working: `Try n = 1, 2, 3, … — the first failure is n = ${n}. (A quick idea: n = ${p} gives ${p}² − ${p} + ${p} = ${p}², never prime.)`,
      };
    },
    { p: 11 },
    rand => ({ p: pick(rand, [3, 5, 11, 17, 41]) })),
]);

// =====================================================================
// AHL 1.16 Systems of linear equations (HL)
// =====================================================================

const eq3 = (a, b, c, d) => `${polyText([{ c: a, v: 'x' }, { c: b, v: 'y' }, { c: c, v: 'z' }])} = ${num(d)}`;
const det3 = m =>
  m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);

const t1_16 = deck('1.16 Systems of linear equations (HL)', [
  {
    id: 'm116-c1', difficulty: 'medium', ref: `${PRECALC(9)}; ${GUIDE('AHL 1.16')}`,
    question: 'HL: What are the three possible outcomes when solving a system of three linear equations in three unknowns? Describe each geometrically.',
    answer: 'Unique solution: the three planes meet at a single point.\nInfinitely many solutions: the planes meet in a line (or are the same plane) — the system is consistent but dependent.\nNo solution: the planes have no common point (e.g. parallel planes, or a triangular prism) — the system is inconsistent.',
    alternates: [
      { question: 'HL: Row reduction gives the row 0 0 0 | 5. What does this tell you?', answer: '0 = 5 is impossible, so the system is inconsistent — there is no solution.' },
      { question: 'HL: Row reduction gives the row 0 0 0 | 0 (and no contradictions). What does this tell you?', answer: 'One equation depends on the others, so there are infinitely many solutions — a line of solutions (or a whole plane if two rows become zero).' },
      { question: 'HL: What is a consistent system of equations?', answer: 'One that has at least one solution (either a unique solution or infinitely many).' },
    ],
  },
  numberCard('m116-n1', 'medium', GUIDE('AHL 1.16'),
    ({ m, x, y, z }) => {
      const rhs = m.map(r => r[0] * x + r[1] * y + r[2] * z);
      return {
        question: `HL: Solve the system:\n${m.map((r, i) => eq3(r[0], r[1], r[2], rhs[i])).join('\n')}`,
        answer: `x = ${num(x)}, y = ${num(y)}, z = ${num(z)}`,
        working: `Use technology or elimination. Check in the first equation: ${par(m[0][0])} × ${par(x)} + ${par(m[0][1])} × ${par(y)} + ${par(m[0][2])} × ${par(z)} = ${num(rhs[0])} ✓`,
      };
    },
    { m: [[1, 2, -1], [2, -1, 3], [3, 1, 1]], x: 2, y: -1, z: 3 },
    rand => {
      let m;
      do {
        m = Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => rand(-4, 5)));
      } while (det3(m) === 0 || m.some(row => row.filter(v => v === 0).length >= 2)); // unique solution, and no near-empty rows
      return { m, x: nonZero(rand, -5, 5), y: rand(-5, 5), z: rand(-5, 5) };
    },
    90),
  numberCard('m116-n2', 'hard', GUIDE('AHL 1.16'),
    ({ r1, r2, d1, d2, consistent }) => {
      // Row 3 = row 1 + row 2, except its z-coefficient is k. No unique solution when k = r1z + r2z.
      const k = r1[2] + r2[2];
      const d3 = consistent ? d1 + d2 : d1 + d2 + 3;
      return {
        question: `HL: Consider the system\n${eq3(...r1, d1)}\n${eq3(...r2, d2)}\n${polyText([{ c: r1[0] + r2[0], v: 'x' }, { c: r1[1] + r2[1], v: 'y' }])} + kz = ${num(d3)}\n(a) Find the value of k for which the system does not have a unique solution. (b) For this value of k, does the system have no solution or infinitely many?`,
        answer: `(a) k = ${num(k)}  (b) ${consistent ? 'infinitely many solutions' : 'no solution'}`,
        working: `(a) Equation 1 + equation 2 gives ${polyText([{ c: r1[0] + r2[0], v: 'x' }, { c: r1[1] + r2[1], v: 'y' }, { c: k, v: 'z' }])} = ${num(d1 + d2)}. If k = ${num(k)}, the left side of equation 3 matches this, so the equations are not independent (the determinant is zero). (b) The right sides: ${num(d1 + d2)} vs ${num(d3)} — ${consistent ? 'equal, so equation 3 adds nothing new: infinitely many solutions.' : 'different, a contradiction: no solution.'}`,
      };
    },
    { r1: [1, 2, -1], r2: [2, -1, 3], d1: 4, d2: 1, consistent: false },
    rand => {
      let r1;
      let r2;
      do {
        r1 = [nonZero(rand, -3, 3), nonZero(rand, -3, 3), nonZero(rand, -3, 3)];
        r2 = [nonZero(rand, -3, 3), nonZero(rand, -3, 3), nonZero(rand, -3, 3)];
      } while (r1[0] * r2[1] - r1[1] * r2[0] === 0); // rows 1 and 2 must not be parallel
      return { r1, r2, d1: rand(-6, 8), d2: rand(-6, 8), consistent: rand(0, 1) === 1 };
    },
    120),
]);

// The keys below are used in data/syllabus.js (deck: 'ib-math-1-1', ...).
// SL students see 1.1–1.9; HL students also see 1.10–1.16.
export const mathAA1Decks = {
  'ib-math-1-1': t1_1,
  'ib-math-1-2': t1_2,
  'ib-math-1-3': t1_3,
  'ib-math-1-4': t1_4,
  'ib-math-1-5': t1_5,
  'ib-math-1-6': t1_6,
  'ib-math-1-7': t1_7,
  'ib-math-1-8': t1_8,
  'ib-math-1-9': t1_9,
  'ib-math-1-10': t1_10,
  'ib-math-1-11': t1_11,
  'ib-math-1-12': t1_12,
  'ib-math-1-13': t1_13,
  'ib-math-1-14': t1_14,
  'ib-math-1-15': t1_15,
  'ib-math-1-16': t1_16,
};
