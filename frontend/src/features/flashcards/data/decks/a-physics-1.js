// A Level H2 Physics 9478 — Topic 1 Quantities and Measurement
// Lives at: src/features/flashcards/data/decks/a-physics-1.js
//
// What is in scope comes from the official SEAB syllabus "Physics (Syllabus 9478), GCE Advanced Level H2",
// first examined 2026 (Section I Foundations of Physics, learning outcomes 1(a)–(j)).
// Each card's "ref" names the learning outcome it tests. All questions are original.
//
// Card fields: id, question, answer, difficulty — plus optional working, ref, vary, alternates, seconds
// (see decks/ib-cs-a1.js for what each one does).

import { deck, fmt, numberCard, pick } from './helpers.js';
import { SYL, deg, rad, sf1, toDecimals } from './a-physics-tools.js';

// =====================================================================
// Physical quantities and SI units — LO 1(a)–(e)
// =====================================================================

const units = deck('Physical quantities and SI units', [
  {
    id: 'ap1-c1', difficulty: 'easy', ref: SYL('1(a)'),
    question: 'Name the six SI base quantities in the H2 syllabus and give the base unit of each.',
    answer: 'Mass — kilogram (kg)\nLength — metre (m)\nTime — second (s)\nCurrent — ampere (A)\nTemperature — kelvin (K)\nAmount of substance — mole (mol)',
    alternates: [
      { question: 'True or false: the newton is an SI base unit. Explain.', answer: 'False. The newton is a derived unit: 1 N = 1 kg m s⁻². The base units are kg, m, s, A, K and mol.' },
      { question: 'Which SI base quantity is measured in moles, and which in kelvin?', answer: 'Amount of substance is measured in moles (mol). Temperature is measured in kelvin (K).' },
      { question: 'Charge is measured in coulombs. Is charge a base quantity? If not, which base quantities is it built from?', answer: 'No. Charge = current × time, so 1 C = 1 A s. Current (A) and time (s) are the base quantities.' },
    ],
  },
  {
    id: 'ap1-c2', difficulty: 'medium', ref: SYL('1(c)'),
    question: 'Express the newton (N) and the joule (J) in SI base units.',
    answer: 'N: F = ma → kg m s⁻²\nJ: W = Fs → kg m s⁻² × m = kg m² s⁻²',
    alternates: [
      { question: 'Express the watt (W) in SI base units.', answer: 'P = W/t → kg m² s⁻² ÷ s = kg m² s⁻³' },
      { question: 'Express the pascal (Pa), the unit of pressure, in SI base units.', answer: 'p = F/A → kg m s⁻² ÷ m² = kg m⁻¹ s⁻²' },
      { question: 'Express the volt (V) in SI base units.', answer: 'V = W/Q = energy ÷ (current × time) → kg m² s⁻² ÷ (A s) = kg m² s⁻³ A⁻¹' },
    ],
  },
  {
    id: 'ap1-c3', difficulty: 'medium', ref: SYL('1(d)'),
    question: 'What does it mean for a physical equation to be homogeneous? Does homogeneity prove an equation is correct?',
    answer: 'Every term in the equation has the same SI base units.\nNo. A homogeneous equation can still be wrong: base units cannot check pure numbers (such as the ½ in s = ut + ½at²), and a wrong term with the right units would pass.',
    alternates: [
      { question: 'Show that v² = u² + 2as is homogeneous.', answer: 'v² and u²: (m s⁻¹)² = m² s⁻². 2as: m s⁻² × m = m² s⁻². Every term has units m² s⁻², so the equation is homogeneous.' },
      { question: 'A student writes s = ut + at². It is homogeneous. Is it correct? What does this show?', answer: 'It is not correct — it should be s = ut + ½at². Homogeneity cannot detect a wrong pure number, so a homogeneous equation is not necessarily correct.' },
      { question: 'The drag force on a sphere is F = kv², where v is its speed. Find the SI base units of k.', answer: 'k = F/v² → kg m s⁻² ÷ m² s⁻² = kg m⁻¹' },
    ],
  },
  {
    id: 'ap1-c4', difficulty: 'easy', ref: SYL('1(e)'),
    question: 'Make reasonable estimates of: the mass of an adult, the speed of a person walking, and the height of a classroom door.',
    answer: 'Mass of an adult ≈ 60–70 kg\nWalking speed ≈ 1.5 m s⁻¹\nHeight of a door ≈ 2 m',
    alternates: [
      { question: 'Estimate the power of an electric kettle and the weight of an apple.', answer: 'Kettle ≈ 2 kW (2000 W). An apple of about 0.1 kg weighs about 1 N.' },
      { question: 'Estimate the diameter of an atom and the diameter of a human hair.', answer: 'Atom ≈ 10⁻¹⁰ m. Human hair ≈ 10⁻⁴ m (about 0.1 mm).' },
      { question: 'Estimate the kinetic energy of a car travelling on an expressway.', answer: 'Mass ≈ 1000–1500 kg, speed ≈ 25–30 m s⁻¹, so Ek = ½mv² ≈ 5 × 10⁵ J (order of magnitude 10⁵–10⁶ J).' },
    ],
  },

  numberCard('ap1-n1', 'easy', SYL('1(b)'),
    ({ value, prefix, unit }) => {
      const result = value * 10 ** prefix.power;
      return {
        question: `Express ${value} ${prefix.symbol}${unit.symbol} in ${unit.name}, in standard form where needed.`,
        answer: `${fmt(result)} ${unit.symbol}`,
        working: `${prefix.name} (${prefix.symbol}) = 10${prefix.sup} → ${value} × 10${prefix.sup} ${unit.symbol} = ${fmt(result)} ${unit.symbol}`,
      };
    },
    { value: 470, prefix: { name: 'nano', symbol: 'n', power: -9, sup: '⁻⁹' }, unit: { symbol: 'm', name: 'metres' } },
    rand => {
      const P = {
        p: { name: 'pico', symbol: 'p', power: -12, sup: '⁻¹²' }, n: { name: 'nano', symbol: 'n', power: -9, sup: '⁻⁹' },
        μ: { name: 'micro', symbol: 'μ', power: -6, sup: '⁻⁶' }, m: { name: 'milli', symbol: 'm', power: -3, sup: '⁻³' },
        c: { name: 'centi', symbol: 'c', power: -2, sup: '⁻²' }, k: { name: 'kilo', symbol: 'k', power: 3, sup: '³' },
        M: { name: 'mega', symbol: 'M', power: 6, sup: '⁶' }, G: { name: 'giga', symbol: 'G', power: 9, sup: '⁹' },
        T: { name: 'tera', symbol: 'T', power: 12, sup: '¹²' },
      };
      // Each unit only gets prefixes that are actually used with it (no "megaseconds" or "picohertz").
      const unit = pick(rand, [
        { symbol: 'm', name: 'metres', prefixes: ['p', 'n', 'μ', 'm', 'c', 'k'] },
        { symbol: 's', name: 'seconds', prefixes: ['p', 'n', 'μ', 'm'] },
        { symbol: 'A', name: 'amperes', prefixes: ['p', 'n', 'μ', 'm', 'k'] },
        { symbol: 'Hz', name: 'hertz', prefixes: ['k', 'M', 'G', 'T'] },
      ]);
      return { value: rand(2, 950), prefix: P[pick(rand, unit.prefixes)], unit };
    }),
]);

// =====================================================================
// Errors and uncertainties — LO 1(f)–(g)
// =====================================================================

const errors = deck('Errors and uncertainties', [
  {
    id: 'ap1-c5', difficulty: 'medium', ref: SYL('1(f)'),
    question: 'Distinguish between random errors and systematic errors.',
    answer: 'Random errors scatter readings unpredictably above and below the true value. They limit precision, and can be reduced by repeating readings and averaging.\nSystematic errors shift every reading by the same amount (or in the same direction). They limit accuracy, and averaging does not reduce them — the cause must be found and corrected.',
    alternates: [
      { question: 'A stopwatch is started a little late every time by the same person, by about the same amount. Random or systematic error? Will averaging help?', answer: 'Systematic — every time is too short in the same way. Averaging does not remove it.' },
      { question: 'Readings of a pendulum\'s period vary slightly because of reaction time. Random or systematic? How can its effect be reduced?', answer: 'Random. Time many oscillations (e.g. 20) and divide, and repeat the measurement and average.' },
      { question: 'True or false: repeating a measurement many times and averaging reduces systematic error. Explain.', answer: 'False. A systematic error shifts every reading the same way, so the average is shifted too. Averaging only reduces random error.' },
    ],
  },
  {
    id: 'ap1-c6', difficulty: 'medium', ref: SYL('1(f)'),
    question: 'Distinguish between precision and accuracy.',
    answer: 'Precision: how close repeated readings are to each other (small scatter). It is limited by random errors.\nAccuracy: how close a reading (or the mean) is to the true value. It is limited by systematic errors.',
    alternates: [
      { question: 'Five readings of g are 9.52, 9.53, 9.51, 9.52 and 9.53 m s⁻². The accepted value is 9.81 m s⁻². Are they precise, accurate, both or neither?', answer: 'Precise but not accurate — they agree closely with each other but are all well below the true value (a systematic error).' },
      { question: 'Readings are scattered widely, but their mean is very close to the true value. Describe them in terms of precision and accuracy.', answer: 'Accurate (the mean is close to the true value) but not precise (large scatter from random errors).' },
      { question: 'Which type of error limits precision, and which limits accuracy?', answer: 'Random errors limit precision. Systematic errors limit accuracy.' },
    ],
  },
  {
    id: 'ap1-c7', difficulty: 'easy', ref: SYL('1(f)'),
    question: 'What is a zero error? What type of error is it, and how is it corrected?',
    answer: 'A zero error is when an instrument does not read zero when the true value is zero (e.g. a micrometer reading 0.02 mm with its jaws closed).\nIt is a systematic error. Correct it by subtracting the zero reading from every measurement.',
    alternates: [
      { question: 'A micrometer reads −0.03 mm when its jaws are closed. A wire then reads 1.45 mm. What is the true diameter?', answer: '1.45 − (−0.03) = 1.48 mm.' },
      { question: 'An ammeter needle rests at 0.1 A with no current. A reading of 1.6 A is taken. What is the actual current?', answer: '1.6 − 0.1 = 1.5 A. (A zero error is systematic, so the same correction applies to every reading.)' },
      { question: 'Does a zero error affect the precision or the accuracy of readings? Why?', answer: 'Accuracy. It shifts every reading by the same amount, so the readings can still agree with each other.' },
    ],
  },

  numberCard('ap1-n2', 'medium', SYL('1(g)'),
    ({ m, l }) => {
      const percent = (0.1 / m + (3 * 0.01) / l) * 100;
      return {
        question: `A metal cube has mass (${m.toFixed(1)} ± 0.1) g and side length (${l.toFixed(2)} ± 0.01) cm. Its density is ρ = m / l³. Find the percentage uncertainty in ρ.`,
        answer: `${Number(percent.toPrecision(2))} %`,
        working: `Δρ/ρ = Δm/m + 3Δl/l = 0.1/${m.toFixed(1)} + 3 × 0.01/${l.toFixed(2)} = ${(0.1 / m).toFixed(5)} + ${((3 * 0.01) / l).toFixed(5)} = ${(percent / 100).toFixed(5)} → ${Number(percent.toPrecision(2))} %. (The power of 3 on l triples its fractional uncertainty.)`,
      };
    },
    { m: 213.4, l: 4.12 },
    rand => {
      // Picks a realistic density (2.0–11.0 g cm⁻³, aluminium to lead) and works out the mass from it.
      const l = rand(250, 600) / 100;
      const rho = rand(20, 110) / 10;
      return { m: Math.round(rho * l ** 3 * 10) / 10, l };
    }),

  numberCard('ap1-n3', 'hard', SYL('1(g)'),
    ({ L, dL, T, dT }) => {
      const g = (4 * Math.PI ** 2 * L) / T ** 2;
      const fraction = dL / L + (2 * dT) / T;
      const dg = sf1(g * fraction);
      const places = toDecimals(dg);
      return {
        question: `A pendulum of length (${L.toFixed(3)} ± ${dL.toFixed(3)}) m has period (${T.toFixed(2)} ± ${dT.toFixed(2)}) s. Using g = 4π²L / T², find g with its absolute uncertainty.`,
        answer: `g = (${g.toFixed(places)} ± ${dg.toFixed(places)}) m s⁻²`,
        working: `g = 4π² × ${L.toFixed(3)} ÷ ${T.toFixed(2)}² = ${g.toFixed(3)} m s⁻². Δg/g = ΔL/L + 2ΔT/T = ${(dL / L).toFixed(4)} + ${((2 * dT) / T).toFixed(4)} = ${fraction.toFixed(4)}. Δg = ${fraction.toFixed(4)} × ${g.toFixed(3)} = ${(g * fraction).toFixed(3)} → ${dg} (1 s.f.), and g is rounded to the same decimal place.`,
      };
    },
    { L: 0.8, dL: 0.002, T: 1.79, dT: 0.02 },
    rand => {
      const L = rand(500, 1200, 10) / 1000;
      // A realistic measured period near the true one (slightly off, like real data).
      const T = Math.round(2 * Math.PI * Math.sqrt(L / 9.81) * 100 + rand(-2, 2)) / 100;
      return { L, dL: rand(1, 3) / 1000, T, dT: rand(1, 3) / 100 };
    },
    { seconds: 90 }),

  numberCard('ap1-n4', 'medium', SYL('1(g)'),
    ({ a, b }) => {
      const diff = a - b;
      const percent = (0.2 / diff) * 100;
      return {
        question: `A spring's length is (${a.toFixed(1)} ± 0.1) cm when loaded and (${b.toFixed(1)} ± 0.1) cm when unloaded. Find the extension with its absolute uncertainty, and its percentage uncertainty.`,
        answer: `(${diff.toFixed(1)} ± 0.2) cm, which is ${Number(percent.toPrecision(2))} %`,
        working: `Extension = ${a.toFixed(1)} − ${b.toFixed(1)} = ${diff.toFixed(1)} cm. For a difference, ADD the absolute uncertainties: 0.1 + 0.1 = 0.2 cm. Percentage = 0.2 ÷ ${diff.toFixed(1)} × 100 = ${Number(percent.toPrecision(2))} % — much larger than for either length, because the difference is small.`,
      };
    },
    { a: 23.6, b: 20.4 },
    rand => {
      const b = rand(150, 250) / 10;
      return { a: b + rand(20, 80) / 10, b };
    }),
]);

// =====================================================================
// Scalars and vectors — LO 1(h)–(j)
// =====================================================================

const vectors = deck('Scalars and vectors', [
  {
    id: 'ap1-c8', difficulty: 'easy', ref: SYL('1(h)'),
    question: 'Distinguish between scalar and vector quantities, with three examples of each.',
    answer: 'A scalar has magnitude only, e.g. mass, distance, speed, energy, time, temperature.\nA vector has magnitude and direction, e.g. displacement, velocity, acceleration, force, momentum, electric field strength.',
    alternates: [
      { question: 'Sort these into scalars and vectors: work, weight, momentum, power, electric field strength, charge.', answer: 'Scalars: work, power, charge.\nVectors: weight, momentum, electric field strength.' },
      { question: 'True or false: energy is a vector because it can be "transferred" from one place to another. Explain.', answer: 'False. Energy has magnitude only, so it is a scalar. "Transferred" does not mean it has a direction.' },
      { question: 'Speed and velocity can have the same number. What extra information does velocity carry?', answer: 'Direction. Velocity is a vector (speed in a given direction); speed is its magnitude only.' },
    ],
  },
  {
    id: 'ap1-c9', difficulty: 'medium', ref: SYL('1(i)'),
    question: 'How do you subtract one vector from another, for example to find a change in velocity Δv = v − u?',
    answer: 'Add the negative: v − u = v + (−u). Reverse the direction of u, then add it tip-to-tail to v. The resultant (from the tail of the first to the tip of the last) is Δv.',
    alternates: [
      { question: 'A ball moving at 5 m s⁻¹ to the right bounces back at 5 m s⁻¹ to the left. What is its change in velocity?', answer: '10 m s⁻¹ to the left. Δv = v − u = (−5) − (+5) = −10 m s⁻¹, taking right as positive. (Its change in speed is zero.)' },
      { question: 'When adding two vectors with a scale drawing, how are they arranged, and what is the resultant?', answer: 'Tip-to-tail: draw the second starting from the tip of the first. The resultant goes from the tail of the first to the tip of the second.' },
      { question: 'Two forces of 3 N and 4 N act on a point. What are the largest and smallest possible resultants?', answer: 'Largest 7 N (same direction). Smallest 1 N (opposite directions). Any value in between is possible at other angles.' },
    ],
  },

  numberCard('ap1-n5', 'easy', SYL('1(i)'),
    ({ a, b }) => {
      const r = Math.hypot(a, b);
      const angle = deg(Math.atan(b / a));
      return {
        question: `A hiker walks ${a} km due north, then ${b} km due east. Find the magnitude and direction of her resultant displacement.`,
        answer: `${fmt(r)} km at ${fmt(angle)}° east of north`,
        working: `Perpendicular vectors: R = √(${a}² + ${b}²) = ${fmt(r)} km. Angle from north: tan θ = ${b}/${a} → θ = ${fmt(angle)}°`,
      };
    },
    { a: 6, b: 8 },
    rand => ({ a: rand(2, 15), b: rand(2, 15) })),

  numberCard('ap1-n6', 'easy', SYL('1(j)'),
    ({ F, theta }) => {
      const fx = F * Math.cos(rad(theta));
      const fy = F * Math.sin(rad(theta));
      return {
        question: `A rope pulls a crate with a force of ${F} N at ${theta}° above the horizontal. Find the horizontal and vertical components of the force.`,
        answer: `Horizontal ${fmt(fx)} N, vertical ${fmt(fy)} N`,
        working: `Fx = F cos θ = ${F} cos ${theta}° = ${fmt(fx)} N. Fy = F sin θ = ${F} sin ${theta}° = ${fmt(fy)} N`,
      };
    },
    { F: 120, theta: 35 },
    rand => ({ F: rand(20, 400, 10), theta: rand(10, 75, 5) })),

  numberCard('ap1-n7', 'hard', SYL('1(i)'),
    ({ f1, f2, theta }) => {
      const r = Math.sqrt(f1 ** 2 + f2 ** 2 + 2 * f1 * f2 * Math.cos(rad(theta)));
      // Angle of the resultant measured from the f1 direction.
      const alpha = deg(Math.atan2(f2 * Math.sin(rad(theta)), f1 + f2 * Math.cos(rad(theta))));
      return {
        question: `Two forces of ${f1} N and ${f2} N act on the same point with an angle of ${theta}° between them. Find the magnitude of the resultant and its angle to the ${f1} N force.`,
        answer: `${fmt(r)} N at ${fmt(alpha)}° to the ${f1} N force`,
        working: `Components along and across the ${f1} N force: x = ${f1} + ${f2} cos ${theta}° = ${fmt(f1 + f2 * Math.cos(rad(theta)))} N, y = ${f2} sin ${theta}° = ${fmt(f2 * Math.sin(rad(theta)))} N. R = √(x² + y²) = ${fmt(r)} N, ${f1 + f2 * Math.cos(rad(theta)) < 0 ? `x is negative, so α = 180° − tan⁻¹(|y/x|) = ${fmt(alpha)}°` : `tan α = y/x → α = ${fmt(alpha)}°`}`,
      };
    },
    { f1: 30, f2: 20, theta: 60 },
    rand => ({ f1: rand(10, 60, 5), f2: rand(10, 60, 5), theta: rand(20, 160, 10) }),
    { seconds: 90 }),

  numberCard('ap1-n8', 'medium', SYL('1(i)'),
    ({ v }) => {
      const dv = v * Math.SQRT2;
      return {
        question: `A car travelling due north at ${v} m s⁻¹ turns a corner and then travels due east at ${v} m s⁻¹. Find the magnitude and direction of its change in velocity.`,
        answer: `${fmt(dv)} m s⁻¹ towards the south-east`,
        working: `Δv = v_final − v_initial = (${v} east) + (${v} south). These are perpendicular: |Δv| = √(${v}² + ${v}²) = ${v}√2 = ${fmt(dv)} m s⁻¹, at 45° between east and south. (The speed did not change, but the velocity did.)`,
      };
    },
    { v: 15 },
    rand => ({ v: rand(5, 30) })),
]);

// The keys below are used in data/syllabus.js (deck: 'a-phys-1-1', ...).
export const aPhysics1Decks = {
  'a-phys-1-1': units,
  'a-phys-1-2': errors,
  'a-phys-1-3': vectors,
};
