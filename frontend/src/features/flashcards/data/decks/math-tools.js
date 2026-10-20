// Exact-arithmetic helpers for the maths decks: fractions, surds, angles and nice formatting.
// Lives at: src/features/flashcards/data/decks/math-tools.js
//
// Everything here is plain JavaScript, so answers stay EXACT (3/4, 2√3, 5π/6) instead of
// becoming rounded decimals.

export const MINUS = '−';

// ---------- Numbers ----------

export function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

export function factorial(n) {
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

export function nCr(n, r) {
  if (r < 0 || r > n) return 0;
  let result = 1;
  for (let i = 1; i <= r; i++) result = (result * (n - r + i)) / i;
  return Math.round(result);
}

export function nPr(n, r) {
  let result = 1;
  for (let i = 0; i < r; i++) result *= n - i;
  return result;
}

export function isPrime(n) {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) if (n % i === 0) return false;
  return true;
}

// Uses a proper minus sign: -3 → "−3"
export function num(n) {
  return String(n).replace(/^-/, MINUS);
}

// Superscript for powers: 2 → "²", -3 → "⁻³"
const SUPERSCRIPT = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
export function sup(n) {
  return String(n).split('').map(ch => SUPERSCRIPT[ch] ?? ch).join('');
}

// Rounds to 3 significant figures, keeping trailing zeros (IB style): 2.5 → "2.50"
export function sf3(x) {
  const text = Number(x).toPrecision(3);
  // toPrecision switches to "1.03e+3" for big numbers; show those as ordinary numbers instead.
  return (text.includes('e') ? Number(text).toLocaleString('en-US') : text).replace(/^-/, MINUS);
}

// Rounds correctly even when the exact value ends in 5 (1723.025 → 1723.03),
// which plain Math.round can get wrong because of floating-point error.
export function roundTo(x, dp) {
  // Scale first, then clean off the tiny floating-point error, then round.
  return Math.round(Number((Number(x) * 10 ** dp).toFixed(6))) / 10 ** dp;
}

// Money to 2 decimal places with thousands separators: 1234.5 → "1,234.50"
export function money(x) {
  return roundTo(x, 2).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ---------- Fractions ----------

// Returns a simplified fraction { n, d } with a positive denominator.
export function frac(n, d = 1) {
  if (d < 0) {
    n = -n;
    d = -d;
  }
  const g = gcd(n, d);
  return { n: n / g, d: d / g };
}

export function fracText(n, d = 1) {
  const f = frac(n, d);
  const body = f.d === 1 ? `${Math.abs(f.n)}` : `${Math.abs(f.n)}/${f.d}`;
  return f.n < 0 ? MINUS + body : body;
}

// ---------- Surds: a value c·√s, where c is a fraction and s has no square factors ----------

export function surd(cn, cd = 1, s = 1) {
  // Move square factors out of s: √12 = 2√3
  let outside = 1;
  for (let k = 2; k * k <= s; k++) {
    while (s % (k * k) === 0) {
      s /= k * k;
      outside *= k;
    }
  }
  const c = frac(cn * outside, cd);
  return { n: c.n, d: c.d, s: c.n === 0 ? 1 : s };
}

export function surdTimes(a, b) {
  return surd(a.n * b.n, a.d * b.d, a.s * b.s);
}

export function surdIsZero(a) {
  return a.n === 0;
}

// { n: 3, d: 2, s: 2 } → "3√2/2";  { n: -1, d: 2, s: 3 } → "−√3/2";  { n: 5, d: 1, s: 1 } → "5"
export function surdText(a) {
  if (a.n === 0) return '0';
  const sign = a.n < 0 ? MINUS : '';
  const top = Math.abs(a.n);
  if (a.s === 1) return sign + (a.d === 1 ? `${top}` : `${top}/${a.d}`);
  const root = `√${a.s}`;
  const numerator = top === 1 ? root : `${top}${root}`;
  return sign + (a.d === 1 ? numerator : `${numerator}/${a.d}`);
}

// Square root of a whole number as an exact surd: √50 → 5√2
export function sqrtText(n) {
  return surdText(surd(1, 1, n));
}

// ---------- Angles (in degrees, multiples of 15°) with exact trig values ----------

// Exact cosine for a multiple of 30° or 45°, as a surd.
export function cosExact(deg) {
  const d = ((deg % 360) + 360) % 360;
  const table = {
    0: surd(1), 30: surd(1, 2, 3), 45: surd(1, 2, 2), 60: surd(1, 2), 90: surd(0),
    120: surd(-1, 2), 135: surd(-1, 2, 2), 150: surd(-1, 2, 3), 180: surd(-1),
    210: surd(-1, 2, 3), 225: surd(-1, 2, 2), 240: surd(-1, 2), 270: surd(0),
    300: surd(1, 2), 315: surd(1, 2, 2), 330: surd(1, 2, 3),
  };
  if (!(d in table)) throw new Error(`No exact cosine for ${deg}°`);
  return table[d];
}

export function sinExact(deg) {
  return cosExact(90 - deg);
}

// Angle in (−180°, 180°]
export function principal(deg) {
  let d = ((deg % 360) + 360) % 360;
  if (d > 180) d -= 360;
  return d;
}

// Degrees → radians as a fraction of π: 150 → "5π/6", −90 → "−π/2", 0 → "0"
export function piText(deg) {
  if (deg === 0) return '0';
  const f = frac(deg, 180);
  const sign = f.n < 0 ? MINUS : '';
  const top = Math.abs(f.n) === 1 ? 'π' : `${Math.abs(f.n)}π`;
  return sign + (f.d === 1 ? top : `${top}/${f.d}`);
}

// Exact Cartesian form a + bi from two surds: "−2 + 2√3i", "3i", "(3√2/2) − (3√2/2)i"
export function complexText(re, im) {
  const reZero = surdIsZero(re);
  const imZero = surdIsZero(im);
  if (reZero && imZero) return '0';
  // Fractions in front of i get brackets so they can't be misread: (11/5)i, not 11/5i
  const wrap = a => (a.d !== 1 ? `(${surdText({ ...a, n: Math.abs(a.n) })})` : surdText({ ...a, n: Math.abs(a.n) }));
  const imBody = (() => {
    const abs = { ...im, n: Math.abs(im.n) };
    if (abs.n === 1 && abs.d === 1 && abs.s === 1) return 'i';
    return `${wrap(abs)}i`;
  })();
  if (imZero) return surdText(re);
  if (reZero) return (im.n < 0 ? MINUS : '') + imBody;
  return `${surdText(re)} ${im.n < 0 ? MINUS : '+'} ${imBody}`;
}

// ---------- Algebra formatting ----------

// [{ c: 3, v: 'x²' }, { c: -5, v: 'x' }, { c: 2, v: '' }] → "3x² − 5x + 2"
export function polyText(terms) {
  let out = '';
  for (const { c, v } of terms) {
    if (c === 0) continue;
    const abs = Math.abs(c);
    const body = v && abs === 1 ? v : `${abs}${v}`;
    if (out === '') out = (c < 0 ? MINUS : '') + body;
    else out += (c < 0 ? ` ${MINUS} ` : ' + ') + body;
  }
  return out || '0';
}

// "x + 3", "x − 2", "2x + 5" for a linear factor px + q
export function linear(p, q, v = 'x') {
  return polyText([{ c: p, v }, { c: q, v: '' }]);
}

// x with a power, hiding a power of 1: ('x', 1) → "x", ('y', -2) → "y⁻²", ('x', 0) → ""
export function power(v, n) {
  if (n === 0) return '';
  return n === 1 ? v : `${v}${sup(n)}`;
}

// A fraction coefficient in front of a variable: (1/2, 'x²') → "(1/2)x²", (3, 'x') → "3x", (1, 'x') → "x"
export function coefTimes(n, d, v) {
  const f = frac(n, d);
  const abs = Math.abs(f.n);
  if (f.d === 1) return abs === 1 && v ? v : `${abs}${v}`;
  return `(${abs}/${f.d})${v}`;
}

// A series written properly: [5, -9, 13] → "5 − 9 + 13 + …"
export function seriesText(terms) {
  return terms.map((t, i) => (i === 0 ? num(t) : `${t < 0 ? MINUS : '+'} ${Math.abs(t)}`)).join(' ') + ' + …';
}

// Negative numbers in brackets inside working: −4 → "(−4)", 3 → "3"
export function par(n) {
  return n < 0 ? `(${num(n)})` : `${n}`;
}

// An angle for use inside working, bracketed when negative: −90 → "(−π/2)"
export function piPar(deg) {
  return deg < 0 ? `(${piText(deg)})` : piText(deg);
}

// Euler form exponent: 135 → "e^(i3π/4)", −90 → "e^(−iπ/2)"
export function eulerText(r, deg) {
  const angle = deg < 0 ? `−i${piText(-deg)}` : `i${piText(deg)}`;
  const modulus = String(r) === '1' ? '' : String(r).includes('/') ? `(${r})` : `${r}`;
  return deg === 0 ? `${modulus}e^(i0) = ${r}` : `${modulus}e^(${angle})`;
}

// Standard form from an exact whole-number mantissa: (1440, −3) → "1.44 × 10⁰"
export function standardForm(mantissaInt, exponent) {
  let m = Math.abs(mantissaInt);
  const digits = String(m).length;
  const e = exponent + digits - 1;
  const mantissa = Number((m / 10 ** (digits - 1)).toFixed(6));
  return `${mantissaInt < 0 ? MINUS : ''}${mantissa} × 10${sup(e)}`;
}
