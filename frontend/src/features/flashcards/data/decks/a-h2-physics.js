// A Level H2 Physics 9478 — Section I Foundations of Physics (Topics 1–4), all in one file.
// Lives at: src/features/flashcards/data/decks/a-h2-physics.js
//
// Topic 1 Quantities and Measurement · Topic 2 Forces and Moments
// Topic 3 Motion and Forces · Topic 4 Energy and Fields
//
// Scope: official SEAB syllabus 9478 (first examined 2026). All questions are original.
// g = 9.81 m s⁻², e = 1.60 × 10⁻¹⁹ C (syllabus data list).
// To add a topic: add its decks below and list their keys in h2PhysicsDecks at the bottom.

import { aOrAn, deck, fmt, numberCard, pick } from './helpers.js';

// =====================================================================
// Small physics helpers used by every topic below
// =====================================================================

// Acceleration of free fall, as given in the 9478 "Data and Formulae" list.
const G = 9.81;

// Where each fact comes from (shown on the back of the card): the learning outcome in the official syllabus.
const SYL = outcome => `SEAB H2 Physics 9478 syllabus (2026), LO ${outcome}`;

const rad = degrees => (degrees * Math.PI) / 180;
const deg = radians => (radians * 180) / Math.PI;

// Rounds an uncertainty to 1 significant figure: 0.245 → 0.2, 0.0951 → 0.1, 0.0874 → 0.09.
function sf1(x) {
  return Number(Number(x).toPrecision(1));
}

// How many decimal places a 1 s.f. uncertainty has, so the value can be rounded to match: 0.2 → 1, 0.09 → 2.
function toDecimals(uncertainty) {
  return Math.max(0, -Math.floor(Math.log10(uncertainty)));
}

// Intermediate values in the working, to 4 significant figures, so each step multiplies out.
const f4 = x => String(Number(Number(x).toPrecision(4))).replace(/^-/, '−');

// #####################################################################
// TOPIC 1 QUANTITIES AND MEASUREMENT
// What is in scope comes from the official SEAB syllabus "Physics (Syllabus 9478), GCE Advanced Level H2",
// first examined 2026 (Section I Foundations of Physics, learning outcomes 1(a)–(j)).
// Each card's "ref" names the learning outcome it tests. All questions are original.
// Card fields: id, question, answer, difficulty — plus optional working, ref, vary, alternates, seconds
// (see decks/ib-cs-a1.js for what each one does).
// =====================================================================
// Physical quantities and SI units — LO 1(a)–(e)
// =====================================================================
// #####################################################################

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

// #####################################################################
// TOPIC 2 FORCES AND MOMENTS
// Scope: official SEAB syllabus 9478 (first examined 2026), learning outcomes 2(a)–(i).
// The syllabus says coefficients of friction and viscosity are NOT required, so no card uses them.
// All questions are original. g = 9.81 m s⁻² (syllabus data list).
// =====================================================================
// Types of force — LO 2(a)–(c)
// =====================================================================
// #####################################################################

const forceTypes = deck('Types of force', [
  {
    id: 'ap2-c1', difficulty: 'medium', ref: SYL('2(a)'),
    question: 'Describe the force on (i) a mass in a gravitational field, (ii) a charge in an electric field, (iii) a current-carrying conductor in a magnetic field.',
    answer: '(i) Weight W = mg, along the field lines (towards the attracting mass).\n(ii) F = qE: along the field lines for a positive charge, opposite to them for a negative charge.\n(iii) F = BIL sin θ, perpendicular to both the current and the field (direction from Fleming\'s left-hand rule).',
    alternates: [
      { question: 'An electron is placed in a uniform electric field pointing to the right. Which way is the force on it?', answer: 'To the left. The electron is negative, so the force is opposite to the field direction.' },
      { question: 'A wire carries a current parallel to a magnetic field. What is the magnetic force on it? Why?', answer: 'Zero. F = BIL sin θ and θ = 0°, so sin θ = 0.' },
      { question: 'True or false: the gravitational force on a mass acts perpendicular to the gravitational field lines. Explain.', answer: 'False. It acts along the field lines — field lines show the direction of the force on a mass.' },
    ],
  },
  {
    id: 'ap2-c2', difficulty: 'medium', ref: SYL('2(b)'),
    question: 'Explain the origin of the upthrust (buoyant force) on an object immersed in a fluid.',
    answer: 'Pressure in a fluid increases with depth. The bottom of the object is deeper than its top, so the fluid pushes up on the bottom harder than it pushes down on the top. The difference is a resultant upward force — the upthrust.',
    alternates: [
      { question: 'Why does a block feel lighter when it is lowered into water?', answer: 'The water exerts an upthrust on it (greater pressure on its lower surface than on its upper surface), which partly supports its weight.' },
      { question: 'True or false: an object only experiences upthrust if it floats. Explain.', answer: 'False. Any object immersed in a fluid has upthrust, because pressure increases with depth. A sinking object simply has a weight greater than the upthrust.' },
      { question: 'What is the normal force (normal contact force)?', answer: 'The contact force a surface exerts on an object, perpendicular to the surface. It stops the object from passing through the surface.' },
    ],
  },
  {
    id: 'ap2-c3', difficulty: 'medium', ref: SYL('2(b)'),
    question: 'Describe frictional force and viscous force (e.g. air resistance). How does air resistance depend on speed?',
    answer: 'Friction acts along the surface between two surfaces in contact, opposing their relative motion (or the tendency to move).\nA viscous force acts on an object moving through a fluid, opposing its motion. Air resistance increases as the object\'s speed increases, and is zero when it is at rest relative to the air.',
    alternates: [
      { question: 'A skydiver jumps from a plane. Why does her acceleration decrease as she falls?', answer: 'Air resistance increases with her speed, so the resultant downward force (weight − air resistance) decreases, and so does her acceleration.' },
      { question: 'A box rests on a slope without sliding. Which way does friction act on it? Why?', answer: 'Up the slope. Friction opposes the box\'s tendency to slide down the slope.' },
      { question: 'What is terminal velocity, and why is it reached?', answer: 'The constant velocity of a falling object when air resistance has grown to equal its weight. The resultant force is then zero, so it stops accelerating.' },
    ],
  },
  {
    id: 'ap2-c4', difficulty: 'easy', ref: SYL('2(c)'),
    question: 'State Hooke\'s law. What is the force constant k?',
    answer: 'The extension of a spring is proportional to the force applied, provided the limit of proportionality is not exceeded: F = kx.\nThe force constant k is the force per unit extension (unit N m⁻¹). A stiffer spring has a larger k.',
    alternates: [
      { question: 'What is the gradient of a force–extension graph for a spring obeying Hooke\'s law?', answer: 'The force constant k (force ÷ extension).' },
      { question: 'What happens to a force–extension graph beyond the limit of proportionality?', answer: 'It stops being a straight line through the origin — extension is no longer proportional to force, so Hooke\'s law no longer applies.' },
      { question: 'Two springs stretch by the same amount, but spring A needs twice the force of spring B. Compare their force constants.', answer: 'k_A = 2k_B — spring A is twice as stiff.' },
    ],
  },

  numberCard('ap2-n1', 'easy', SYL('2(c)'),
    ({ m, x }) => {
      const F = (m / 1000) * G;
      const k = F / (x / 100);
      return {
        question: `Hanging a ${m} g mass on a spring stretches it by ${x} cm. Find the force constant of the spring.`,
        answer: `${fmt(k)} N m⁻¹`,
        working: `F = mg = ${f4(m / 1000)} × 9.81 = ${f4(F)} N. k = F / x = ${f4(F)} ÷ ${f4(x / 100)} = ${fmt(k)} N m⁻¹ (convert g → kg and cm → m first)`,
      };
    },
    { m: 300, x: 6.0 },
    rand => ({ m: rand(100, 800, 50), x: rand(20, 150) / 10 })),

  numberCard('ap2-n2', 'medium', SYL('2(c)'),
    ({ k, F }) => {
      const series = (2 * F) / k;
      const parallel = F / (2 * k);
      return {
        question: `Two identical springs each have force constant ${k} N m⁻¹. A load of ${F} N hangs from them. Find the total extension when the springs are joined (a) in series, (b) side by side in parallel.`,
        answer: `(a) ${fmt(series * 100)} cm  (b) ${fmt(parallel * 100)} cm`,
        working: `(a) Series: each spring carries the full ${F} N, so each stretches ${F}/${k} m; total x = 2F/k = ${fmt(series)} m. (b) Parallel: each carries ${F / 2} N, so x = (F/2)/k = ${fmt(parallel)} m.`,
      };
    },
    { k: 50, F: 4 },
    rand => ({ k: rand(20, 200, 10), F: rand(2, 12) })),
]);

// =====================================================================
// Moment and torque — LO 2(d)–(f)
// =====================================================================

const moments = deck('Moment and torque', [
  {
    id: 'ap2-c5', difficulty: 'easy', ref: SYL('2(d)'),
    question: 'Define the moment of a force about a point, and the torque of a couple.',
    answer: 'Moment of a force = the force × the perpendicular distance from the point to the line of action of the force.\nTorque of a couple = one of the forces × the perpendicular distance between their lines of action.',
    alternates: [
      { question: 'Why is it easier to open a door by pushing at the handle rather than near the hinges?', answer: 'The handle is further from the hinge, so the same force has a larger perpendicular distance and gives a larger moment.' },
      { question: 'A force acts along a line that passes through the pivot. What is its moment about the pivot?', answer: 'Zero — its perpendicular distance from the pivot is zero.' },
      { question: 'What is the SI unit of moment (or torque)?', answer: 'N m (newton metre).' },
    ],
  },
  {
    id: 'ap2-c6', difficulty: 'medium', ref: SYL('2(e)'),
    question: 'What is a couple? Why does a couple produce rotation only, and no translation?',
    answer: 'A couple is a pair of equal and opposite forces whose lines of action are parallel but do not coincide.\nThe forces cancel, so the resultant force is zero (no translation). Their moments act in the same sense, so there is a resultant torque (rotation).',
    alternates: [
      { question: 'Give an everyday example of a couple.', answer: 'Turning a steering wheel with two hands, turning a tap, or using a T-shaped wheel brace — equal, opposite, parallel forces on either side.' },
      { question: 'True or false: the torque of a couple is the same about every point. Explain.', answer: 'True. Its torque depends only on one force and the perpendicular distance between the forces, not on where the axis is.' },
      { question: 'A couple acts on a body at rest in space. Describe the motion that follows.', answer: 'It starts to rotate but its centre of mass does not move, because the resultant force is zero.' },
    ],
  },
  {
    id: 'ap2-c7', difficulty: 'easy', ref: SYL('2(f)'),
    question: 'What is the centre of gravity of a body?',
    answer: 'The single point where the whole weight of the body may be taken to act.',
    alternates: [
      { question: 'Where is the centre of gravity of a uniform metre rule?', answer: 'At its midpoint, the 50 cm mark.' },
      { question: 'A shape hangs freely from a pin. Where does its centre of gravity settle, and why?', answer: 'Directly below the pin. Only then does its weight have no moment about the pin, so it is in equilibrium.' },
      { question: 'Why does a bus with heavy luggage on its roof tip over more easily?', answer: 'The luggage raises the centre of gravity, so when the bus tilts, the line of action of its weight passes outside the wheelbase at a smaller angle of tilt. Its moment then tips the bus over instead of pulling it back upright.' },
    ],
  },

  numberCard('ap2-n3', 'medium', SYL('2(d)'),
    ({ F, d, theta }) => {
      const M = F * (d / 100) * Math.sin(rad(theta));
      return {
        question: `A force of ${F} N is applied to the end of a spanner ${d} cm long, at ${theta}° to the spanner. Find the moment of the force about the bolt.`,
        answer: `${fmt(M)} N m`,
        working: `Perpendicular distance = ${f4(d / 100)} × sin ${theta}° = ${f4((d / 100) * Math.sin(rad(theta)))} m. Moment = ${F} × ${f4((d / 100) * Math.sin(rad(theta)))} = ${fmt(M)} N m (only the perpendicular part counts)`,
      };
    },
    { F: 80, d: 25, theta: 60 },
    rand => ({ F: rand(20, 200, 10), d: rand(15, 45), theta: rand(20, 90, 5) })),

  numberCard('ap2-n4', 'easy', SYL('2(d)'),
    ({ D, F }) => {
      const T = F * (D / 100);
      return {
        question: `A driver turns a steering wheel of diameter ${D} cm with two equal and opposite forces of ${F} N, tangent to the rim. Find the torque of the couple.`,
        answer: `${fmt(T)} N m`,
        working: `Torque = one force × perpendicular distance between them = ${F} × ${f4(D / 100)} = ${fmt(T)} N m`,
      };
    },
    { D: 38, F: 15 },
    rand => ({ D: rand(30, 45), F: rand(5, 40) })),
]);

// =====================================================================
// Translational and rotational equilibrium — LO 2(g)–(i)
// =====================================================================

const equilibrium = deck('Translational and rotational equilibrium', [
  {
    id: 'ap2-c8', difficulty: 'easy', ref: SYL('2(h)'),
    question: 'State the two conditions for a body to be in equilibrium.',
    answer: '1. No resultant force (translational equilibrium).\n2. No resultant torque about any point (rotational equilibrium).',
    alternates: [
      { question: 'State the principle of moments.', answer: 'For a body in rotational equilibrium, the sum of clockwise moments about any point equals the sum of anticlockwise moments about the same point.' },
      { question: 'A couple acts on a body. Is the body in equilibrium? Why?', answer: 'No. The resultant force is zero, but the resultant torque is not, so it is not in rotational equilibrium.' },
      { question: 'When taking moments to solve a problem, why is it useful to choose the pivot at an unknown force?', answer: 'That force has zero moment about the pivot, so it drops out of the equation, leaving fewer unknowns.' },
    ],
  },
  {
    id: 'ap2-c9', difficulty: 'hard', ref: SYL('2(i)'),
    question: 'Three non-parallel coplanar forces keep a body in equilibrium. What two things must be true about them?',
    answer: '1. Drawn tip-to-tail, they form a closed vector triangle (resultant force zero).\n2. Their lines of action pass through a single point (otherwise there would be a resultant torque about that point).',
    alternates: [
      { question: 'What does a closed vector triangle of forces tell you?', answer: 'The resultant of the forces is zero — the body is in translational equilibrium.' },
      { question: 'A uniform ladder leans against a smooth wall. Its weight and the wall\'s force meet at a point. Where must the ground\'s force point?', answer: 'Through that same point, because for three forces in equilibrium all three lines of action must pass through one point.' },
      { question: 'What is a free-body diagram?', answer: 'A diagram of one body on its own, showing every force acting on it (and not the forces it exerts on other bodies).' },
    ],
  },

  numberCard('ap2-n5', 'medium', SYL('2(g)'),
    ({ L, W, P, x }) => {
      const rightR = (W * (L / 2) + P * x) / L;
      const leftR = W + P - rightR;
      return {
        question: `A uniform plank ${L} m long weighing ${W} N rests on supports at both ends. A load of ${P} N stands ${x} m from the left end. Find the force from each support.`,
        answer: `Left ${fmt(leftR)} N, right ${fmt(rightR)} N`,
        working: `Moments about the left end: R_right × ${L} = ${W} × ${L / 2} + ${P} × ${x} → R_right = ${fmt(rightR)} N. Forces: R_left = ${W} + ${P} − ${fmt(rightR)} = ${fmt(leftR)} N`,
      };
    },
    { L: 4, W: 200, P: 600, x: 1 },
    rand => {
      const L = rand(2, 8);
      return { L, W: rand(50, 400, 10), P: rand(100, 900, 50), x: rand(1, L * 2 - 1) / 2 };
    },
    { seconds: 90 }),

  numberCard('ap2-n6', 'easy', SYL('2(g)'),
    ({ m1, d1, m2 }) => {
      const d2 = (m1 * d1) / m2;
      return {
        question: `A ${m1} kg child sits ${d1} m from the pivot of a see-saw. How far from the pivot, on the other side, must a ${m2} kg child sit to balance it?`,
        answer: `${fmt(d2)} m`,
        working: `Principle of moments: ${m1}g × ${d1} = ${m2}g × d → d = ${m1} × ${d1} ÷ ${m2} = ${fmt(d2)} m (g cancels)`,
      };
    },
    { m1: 30, d1: 1.6, m2: 40 },
    rand => {
      const m1 = rand(20, 45);
      const d1 = rand(10, 20) / 10;
      // Keeps the second child on a realistic see-saw (no more than 2 m out).
      const m2Min = Math.ceil((m1 * d1) / 2);
      let m2 = m1;
      while (m2 === m1) m2 = rand(Math.max(m2Min, 20), Math.max(m2Min, 20) + 25); // equal masses would make it trivial
      return { m1, d1, m2 };
    }),

  numberCard('ap2-n7', 'medium', SYL('2(i)'),
    ({ m, theta }) => {
      const T = (m * G) / (2 * Math.cos(rad(theta)));
      return {
        question: `A ${m} kg picture hangs from two strings, each at ${theta}° to the vertical, symmetrically. Find the tension in each string.`,
        answer: `${fmt(T)} N`,
        working: `Vertical equilibrium: 2T cos ${theta}° = mg = ${m} × 9.81 = ${f4(m * G)} N → T = ${f4(m * G)} ÷ (2 cos ${theta}°) = ${fmt(T)} N. (Horizontal components cancel.)`,
      };
    },
    { m: 4, theta: 40 },
    rand => ({ m: rand(1, 12), theta: rand(15, 75, 5) })),

  numberCard('ap2-n8', 'hard', SYL('2(g)'),
    ({ W, theta }) => {
      const T = W / (2 * Math.sin(rad(theta)));
      const H = T * Math.cos(rad(theta));
      const V = W - T * Math.sin(rad(theta));
      return {
        question: `A uniform rod of weight ${W} N is hinged to a wall and held horizontal by a cable from its far end to the wall above, at ${theta}° to the rod. Find the tension in the cable and the force from the hinge.`,
        answer: `T = ${fmt(T)} N; hinge force ${fmt(Math.hypot(H, V))} N`,
        working: `Moments about the hinge (rod length L): T sin ${theta}° × L = ${W} × L/2 → T = ${W} ÷ (2 sin ${theta}°) = ${fmt(T)} N. Hinge: horizontal H = T cos ${theta}° = ${f4(H)} N, vertical V = ${W} − T sin ${theta}° = ${f4(V)} N, so its magnitude = √(H² + V²) = ${fmt(Math.hypot(H, V))} N at ${fmt(deg(Math.atan(V / H)))}° above the rod.`,
      };
    },
    { W: 120, theta: 30 },
    rand => ({ W: rand(40, 300, 10), theta: rand(20, 60, 5) }),
    { seconds: 120 }),

  numberCard('ap2-n9', 'medium', SYL('2(i)'),
    ({ m, F }) => {
      const W = m * G;
      const T = Math.hypot(F, W);
      const angle = deg(Math.atan(F / W));
      return {
        question: `A ${m} kg ball hangs on a string. A horizontal force of ${F} N pulls it sideways until it rests in equilibrium. Find the angle of the string to the vertical and the tension in it.`,
        answer: `${fmt(angle)}° to the vertical; T = ${fmt(T)} N`,
        working: `Weight = ${m} × 9.81 = ${f4(W)} N. Vector triangle (weight, ${F} N, T) closes: tan θ = ${F} / ${f4(W)} → θ = ${fmt(angle)}°. T = √(${F}² + ${f4(W)}²) = ${fmt(T)} N`,
      };
    },
    { m: 2, F: 12 },
    rand => ({ m: rand(1, 6), F: rand(3, 40) })),
]);

// #####################################################################
// TOPIC 3 MOTION AND FORCES
// Scope: official SEAB syllabus 9478 (first examined 2026), learning outcomes 3(a)–(i).
// Newton's laws are worded exactly as the syllabus states them. Projectiles and collisions are
// separate topics (5 and 6) in this syllabus, so they are left out here.
// All questions are original. g = 9.81 m s⁻² (syllabus data list).
// =====================================================================
// Kinematics — LO 3(a)–(c)
// =====================================================================
// #####################################################################

const kinematics = deck('Kinematics', [
  {
    id: 'ap3-c1', difficulty: 'easy', ref: SYL('3(a)'),
    question: 'Distinguish between distance and displacement, and between speed and velocity.',
    answer: 'Distance is the total length of path travelled (scalar). Displacement is the straight-line change in position, with direction (vector).\nSpeed is the rate of change of distance (scalar). Velocity is the rate of change of displacement (vector).',
    alternates: [
      { question: 'A runner completes exactly one lap of a 400 m track in 80 s. Find her average speed and her average velocity.', answer: 'Average speed = 400 ÷ 80 = 5 m s⁻¹. Average velocity = 0, because her displacement is zero.' },
      { question: 'Define acceleration.', answer: 'The rate of change of velocity: a = Δv / Δt. It is a vector.' },
      { question: 'True or false: a car going round a bend at a constant 20 m s⁻¹ is not accelerating. Explain.', answer: 'False. Its direction changes, so its velocity changes — it is accelerating, even though its speed is constant.' },
    ],
  },
  {
    id: 'ap3-c2', difficulty: 'medium', ref: SYL('3(c)'),
    question: 'What physical quantity is given by: (i) the gradient of a displacement–time graph, (ii) the gradient of a velocity–time graph, (iii) the area under a velocity–time graph?',
    answer: '(i) Velocity\n(ii) Acceleration\n(iii) Displacement',
    alternates: [
      { question: 'A displacement–time graph is curved. How do you find the velocity at one instant?', answer: 'Draw the tangent to the curve at that instant and find its gradient.' },
      { question: 'A velocity–time graph is curved, so the acceleration is not uniform. How do you find the displacement?', answer: 'Find the area under the curve, e.g. by counting squares or splitting it into strips. The suvat equations cannot be used.' },
      { question: 'On a velocity–time graph, part of the area lies below the time axis. What does that part mean?', answer: 'Displacement in the negative direction (the object is moving backwards). Subtract it to find the net displacement, or add it to find the distance.' },
    ],
  },
  {
    id: 'ap3-c3', difficulty: 'medium', ref: SYL('3(b)'),
    question: 'Describe the velocity–time graph of a ball dropped from rest that bounces several times on the floor (no air resistance, taking up as positive).',
    answer: 'Straight lines all of gradient −9.81 m s⁻² (the acceleration of free fall). At each bounce the velocity jumps suddenly from negative (moving down) to positive (moving up), shown by a near-vertical line. If energy is lost at each bounce, the rebound speed (and so the peak of each line) is slightly smaller each time.',
    alternates: [
      { question: 'On a velocity–time graph for a ball thrown straight up and caught again, what is the velocity at the top, and what is the gradient there?', answer: 'Velocity = 0 at the top, but the gradient is still −9.81 m s⁻² — it is still accelerating downwards.' },
      { question: 'What does a horizontal line on a displacement–time graph mean?', answer: 'The object is at rest — its displacement is not changing, so its velocity is zero.' },
      { question: 'A speed–time graph and a velocity–time graph are drawn for a ball thrown upward. How do they differ?', answer: 'The velocity–time graph goes from positive through zero to negative. The speed–time graph is the same shape but "reflected" above the axis — speed is never negative.' },
    ],
  },

  numberCard('ap3-n1', 'easy', SYL('3(a)'),
    ({ a, t1, b, t2 }) => {
      const speed = (a + b) / (t1 + t2);
      const velocity = (a - b) / (t1 + t2);
      return {
        question: `A cyclist rides ${a} m due east in ${t1} s, then ${b} m due west in ${t2} s. Find her average speed and her average velocity for the whole trip.`,
        answer: `Average speed ${fmt(speed)} m s⁻¹; average velocity ${fmt(velocity)} m s⁻¹ due east`,
        working: `Distance = ${a} + ${b} = ${a + b} m, displacement = ${a} − ${b} = ${a - b} m east, time = ${t1 + t2} s. Speed = ${a + b} ÷ ${t1 + t2} = ${fmt(speed)} m s⁻¹. Velocity = ${a - b} ÷ ${t1 + t2} = ${fmt(velocity)} m s⁻¹ east`,
      };
    },
    { a: 600, t1: 100, b: 200, t2: 60 },
    rand => {
      const a = rand(300, 900, 50);
      return { a, t1: rand(60, 180, 10), b: rand(50, a - 100, 50), t2: rand(30, 120, 10) };
    }),

  numberCard('ap3-n2', 'medium', SYL('3(c)'),
    ({ v, t1, t2, t3 }) => {
      const s = 0.5 * v * t1 + v * t2 + 0.5 * v * t3;
      return {
        question: `A train starts from rest and accelerates uniformly to ${v} m s⁻¹ in ${t1} s, travels at constant speed for ${t2} s, then decelerates uniformly to rest in ${t3} s. Use its velocity–time graph to find the total distance travelled.`,
        answer: `${fmt(s)} m`,
        working: `Area under the graph = ½ × ${t1} × ${v} + ${t2} × ${v} + ½ × ${t3} × ${v} = ${0.5 * v * t1} + ${v * t2} + ${0.5 * v * t3} = ${fmt(s)} m`,
      };
    },
    { v: 20, t1: 30, t2: 60, t3: 40 },
    rand => ({ v: rand(10, 30, 2), t1: rand(10, 50, 5), t2: rand(20, 120, 10), t3: rand(10, 50, 5) })),
]);

// =====================================================================
// Uniformly accelerated linear motion — LO 3(d)–(e)
// =====================================================================

const suvat = deck('Uniformly accelerated linear motion', [
  {
    id: 'ap3-c4', difficulty: 'hard', ref: SYL('3(d)'),
    question: 'Starting from the definitions of velocity and acceleration, derive v = u + at and s = ut + ½at² for uniform acceleration.',
    answer: 'Acceleration a = (v − u)/t is constant → v = u + at.\nFor uniform acceleration the average velocity is (u + v)/2, so s = (u + v)t/2.\nSubstitute v = u + at: s = (u + u + at)t/2 = ut + ½at².\n(Or: s = area under the v–t graph = rectangle ut + triangle ½ × t × at.)',
    alternates: [
      { question: 'Derive v² = u² + 2as from v = u + at and s = (u + v)t/2.', answer: 't = (v − u)/a. Substitute: s = (u + v)(v − u)/(2a) = (v² − u²)/(2a), so v² = u² + 2as.' },
      { question: 'Use a velocity–time graph to show that s = ut + ½at².', answer: 'The graph is a straight line from u to v = u + at. The area under it is a rectangle (u × t) plus a triangle (½ × t × at), so s = ut + ½at².' },
      { question: 'Why can s = (u + v)t/2 only be used when acceleration is uniform?', answer: 'Only then is the velocity–time graph a straight line, so the average velocity is exactly halfway between u and v.' },
    ],
  },
  {
    id: 'ap3-c5', difficulty: 'medium', ref: SYL('3(e)'),
    question: 'When can the equations of uniformly accelerated motion be used? Give one case where they cannot.',
    answer: 'Only for motion in a straight line with constant acceleration — e.g. a body falling vertically without air resistance in a uniform gravitational field.\nThey cannot be used when acceleration changes, e.g. a skydiver with air resistance, or a mass on a spring.',
    alternates: [
      { question: 'A ball is thrown straight up. Can one suvat equation describe both the way up and the way down? Why?', answer: 'Yes, if air resistance is ignored. The acceleration is −9.81 m s⁻² (taking up as positive) throughout, including at the top.' },
      { question: 'Which suvat equation would you use if you do not know, and do not need, the time?', answer: 'v² = u² + 2as.' },
      { question: 'True or false: a ball thrown straight up has zero acceleration at its highest point. Explain.', answer: 'False. Its velocity is zero at the top, but gravity still acts, so its acceleration is still 9.81 m s⁻² downwards.' },
    ],
  },

  numberCard('ap3-n3', 'medium', SYL('3(e)'),
    ({ u, s }) => {
      const a = -(u * u) / (2 * s);
      return {
        question: `A car travelling at ${u} m s⁻¹ brakes uniformly and stops in ${s} m. Find its acceleration.`,
        answer: `${fmt(a)} m s⁻² (a deceleration of ${fmt(-a)} m s⁻²)`,
        working: `v² = u² + 2as → 0 = ${u}² + 2a(${s}) → a = −${u * u} ÷ ${2 * s} = ${fmt(a)} m s⁻²`,
      };
    },
    { u: 25, s: 50 },
    rand => {
      const u = rand(12, 34);
      const sMin = Math.ceil((u * u) / 16 / 5) * 5; // keeps braking below about 8 m s⁻² (realistic for a car)
      return { u, s: rand(sMin, sMin + 40, 5) };
    }),

  numberCard('ap3-n4', 'easy', SYL('3(e)'),
    ({ h }) => {
      const t = Math.sqrt((2 * h) / G);
      const v = Math.sqrt(2 * G * h);
      return {
        question: `A stone is dropped from rest from a bridge ${h} m above a river. Find the time it takes to reach the water and its speed when it hits. (Ignore air resistance.)`,
        answer: `t = ${fmt(t)} s; v = ${fmt(v)} m s⁻¹`,
        working: `s = ½gt² → t = √(2 × ${h} ÷ 9.81) = ${fmt(t)} s. v² = 2gs → v = √(2 × 9.81 × ${h}) = ${fmt(v)} m s⁻¹`,
      };
    },
    { h: 20 },
    rand => ({ h: rand(5, 80) })),

  numberCard('ap3-n5', 'medium', SYL('3(e)'),
    ({ u }) => {
      const H = (u * u) / (2 * G);
      const t = u / G;
      return {
        question: `A ball is thrown vertically upwards at ${u} m s⁻¹. Find the maximum height it reaches and the time it takes to get there. (Ignore air resistance.)`,
        answer: `${fmt(H)} m, after ${fmt(t)} s`,
        working: `At the top v = 0. v² = u² − 2gs → s = ${u}² ÷ (2 × 9.81) = ${fmt(H)} m. v = u − gt → t = ${u} ÷ 9.81 = ${fmt(t)} s`,
      };
    },
    { u: 15 },
    rand => ({ u: rand(5, 30) })),

  numberCard('ap3-n6', 'hard', SYL('3(e)'),
    ({ u, h }) => {
      const t = (u + Math.sqrt(u * u + 2 * G * h)) / G; // positive root of 4.905t² − ut − h = 0
      return {
        question: `A stone is thrown vertically upwards at ${u} m s⁻¹ from the edge of a cliff ${h} m above the sea. It misses the cliff on the way down. How long after being thrown does it hit the sea? (Ignore air resistance.)`,
        answer: `${fmt(t)} s`,
        working: `Take up as positive, s = −${h} m: −${h} = ${u}t − 4.905t² → 4.905t² − ${u}t − ${h} = 0 → t = [${u} + √(${u}² + 4 × 4.905 × ${h})] ÷ 9.81 = ${fmt(t)} s (take the positive root)`,
      };
    },
    { u: 10, h: 40 },
    rand => ({ u: rand(5, 20), h: rand(15, 60, 5) }),
    { seconds: 90 }),

  numberCard('ap3-n7', 'easy', SYL('3(e)'),
    ({ u, v, t }) => {
      const s = ((u + v) * t) / 2;
      const a = (v - u) / t;
      return {
        question: `A car accelerates uniformly from ${u} m s⁻¹ to ${v} m s⁻¹ in ${t} s. Find its acceleration and the distance it covers.`,
        answer: `a = ${fmt(a)} m s⁻²; s = ${fmt(s)} m`,
        working: `a = (v − u)/t = (${v} − ${u}) ÷ ${t} = ${fmt(a)} m s⁻². s = (u + v)t/2 = (${u} + ${v}) × ${t} ÷ 2 = ${fmt(s)} m`,
      };
    },
    { u: 10, v: 25, t: 6 },
    rand => {
      const u = rand(0, 15);
      return { u, v: u + rand(5, 20), t: rand(3, 12) };
    }),
]);

// =====================================================================
// Mass and linear momentum — LO 3(f)–(g)
// =====================================================================

const momentum = deck('Mass and linear momentum', [
  {
    id: 'ap3-c6', difficulty: 'easy', ref: SYL('3(f)'),
    question: 'What property of a body does its mass measure, in terms of motion?',
    answer: 'Its inertia — mass is the property of a body that resists a change in its motion.',
    alternates: [
      { question: 'Why is it harder to push-start a lorry than a car?', answer: 'The lorry has more mass, so more inertia — it resists a change in motion more, needing a bigger force for the same acceleration.' },
      { question: 'An astronaut in deep space has no weight there. Would it still be hard to throw a heavy box? Why?', answer: 'Yes. The box still has mass, so it still has inertia and resists being accelerated, even though it is weightless.' },
      { question: 'True or false: mass and weight are the same thing. Explain.', answer: 'False. Mass (kg) measures inertia and is the same everywhere. Weight (N) is the gravitational force on the mass, W = mg, and depends on g.' },
    ],
  },
  {
    id: 'ap3-c7', difficulty: 'easy', ref: SYL('3(g)'),
    question: 'Define linear momentum. Is it a scalar or a vector? What is its unit?',
    answer: 'Linear momentum = mass × velocity (p = mv).\nIt is a vector, in the direction of the velocity. Unit: kg m s⁻¹ (equivalent to N s).',
    alternates: [
      { question: 'Show that kg m s⁻¹ and N s are the same unit.', answer: 'N s = (kg m s⁻²) × s = kg m s⁻¹.' },
      { question: 'Two identical trolleys move at the same speed in opposite directions. What is their total momentum?', answer: 'Zero. Their momenta are equal in size but opposite in direction, and momentum is a vector.' },
      { question: 'A ball bounces back from a wall at the same speed. Has its momentum changed? Explain.', answer: 'Yes. Its direction reversed, so its momentum changed by 2mv, even though its speed is the same.' },
    ],
  },

  numberCard('ap3-n8', 'easy', SYL('3(g)'),
    ({ m, kmh }) => {
      const v = kmh / 3.6;
      const p = m * v;
      return {
        question: `Find the momentum of ${aOrAn(m)} ${m} kg car travelling at ${kmh} km h⁻¹.`,
        answer: `${fmt(p)} kg m s⁻¹`,
        working: `${kmh} km h⁻¹ = ${kmh} ÷ 3.6 = ${f4(v)} m s⁻¹. p = mv = ${m} × ${f4(v)} = ${fmt(p)} kg m s⁻¹`,
      };
    },
    { m: 1200, kmh: 72 },
    rand => ({ m: rand(800, 2000, 100), kmh: rand(18, 108, 9) })),

  numberCard('ap3-n9', 'medium', SYL('3(g)'),
    ({ m, u, v }) => {
      const dp = (m / 1000) * (u + v);
      return {
        question: `A ${m} g ball hits a wall at ${u} m s⁻¹ and rebounds along the same line at ${v} m s⁻¹. Find the magnitude and direction of its change in momentum.`,
        answer: `${fmt(dp)} kg m s⁻¹, away from the wall`,
        working: `Take "away from the wall" as positive: Δp = m(v − u) = ${f4(m / 1000)} × (${v} − (−${u})) = ${f4(m / 1000)} × ${u + v} = ${fmt(dp)} kg m s⁻¹. (The velocities ADD because the direction reverses.)`,
      };
    },
    { m: 60, u: 20, v: 15 },
    rand => {
      const u = rand(8, 30);
      return { m: rand(40, 450, 10), u, v: rand(4, u) };
    }),
]);

// =====================================================================
// Laws of motion — LO 3(h)–(i)
// =====================================================================

const laws = deck('Laws of motion', [
  {
    id: 'ap3-c8', difficulty: 'easy', ref: SYL('3(h)'),
    question: 'State Newton\'s first and second laws of motion.',
    answer: '1st: a body at rest will stay at rest, and a body in motion will continue to move at constant velocity, unless acted on by a resultant external force.\n2nd: the rate of change of momentum of a body is (directly) proportional to the resultant force acting on the body and is in the same direction as the resultant force.',
    alternates: [
      { question: 'Show how F = ma follows from Newton\'s second law for a body of constant mass.', answer: 'F = Δp/Δt = Δ(mv)/Δt. With m constant, F = m Δv/Δt = ma (in SI units the constant of proportionality is 1).' },
      { question: 'A bus brakes suddenly and the standing passengers lurch forward. Explain using Newton\'s first law.', answer: 'The passengers tend to keep moving at the bus\'s original velocity (inertia). No large enough force acts on them at first, so they move forward relative to the slowing bus.' },
      { question: 'A spacecraft far from any planet has its engines switched off. Describe its motion.', answer: 'It keeps moving at constant velocity (same speed, straight line) — there is no resultant force on it (Newton\'s first law).' },
    ],
  },
  {
    id: 'ap3-c9', difficulty: 'hard', ref: SYL('3(h)'),
    question: 'State Newton\'s third law. A book rests on a table: are its weight and the normal force from the table a third-law pair? Explain.',
    answer: 'The force exerted by one body on a second body is equal in magnitude and opposite in direction to the force simultaneously exerted by the second body on the first body.\nNo. Both forces act on the SAME body (the book), and they are different types. The pair of the book\'s weight is the book\'s gravitational pull on the Earth.',
    alternates: [
      { question: 'List three features that the two forces of a Newton\'s third-law pair always share.', answer: 'They act on different bodies, are of the same type (e.g. both gravitational or both contact), and are equal in size and opposite in direction, acting at the same time.' },
      { question: 'A horse pulls a cart. By Newton\'s third law the cart pulls back equally. Why can they still move forward?', answer: 'The two forces act on different bodies, so they do not cancel. The horse moves forward because the ground pushes it forward harder than the cart pulls it back.' },
      { question: 'What is the third-law partner of the normal force the floor exerts on your feet?', answer: 'The normal (contact) force your feet exert down on the floor.' },
    ],
  },

  numberCard('ap3-n10', 'easy', SYL('3(i)'),
    ({ m, D, R }) => {
      const a = (D - R) / m;
      return {
        question: `A ${m} kg car has a driving force of ${D} N and a total resistive force of ${R} N. Find its acceleration.`,
        answer: `${fmt(a)} m s⁻²`,
        working: `Resultant force = ${D} − ${R} = ${D - R} N. a = F/m = ${D - R} ÷ ${m} = ${fmt(a)} m s⁻²`,
      };
    },
    { m: 1000, D: 3500, R: 1100 },
    rand => {
      const R = rand(300, 1500, 50);
      return { m: rand(800, 2000, 100), D: R + rand(500, 4000, 100), R };
    }),

  numberCard('ap3-n11', 'medium', SYL('3(i)'),
    ({ m, a, up }) => {
      const N = m * (G + (up ? a : -a));
      return {
        question: `A ${m} kg student stands on bathroom scales in a lift that is accelerating ${up ? 'upwards' : 'downwards'} at ${a} m s⁻². What does the scale read, in newtons?`,
        answer: `${fmt(N)} N`,
        working: up
          ? `Taking up as positive: N − mg = ma → N = m(g + a) = ${m} × (9.81 + ${a}) = ${fmt(N)} N (more than her weight)`
          : `Taking down as positive: mg − N = ma → N = m(g − a) = ${m} × (9.81 − ${a}) = ${fmt(N)} N (less than her weight)`,
      };
    },
    { m: 60, a: 1.5, up: true },
    rand => ({ m: rand(40, 90), a: rand(5, 30) / 10, up: rand(0, 1) === 1 })),

  numberCard('ap3-n12', 'medium', SYL('3(i)'),
    ({ F, m1, m2 }) => {
      const a = F / (m1 + m2);
      const contact = m2 * a;
      return {
        question: `Two blocks, A (${m1} kg) and B (${m2} kg), sit side by side on a smooth floor. A horizontal force of ${F} N pushes A, which pushes B. Find the acceleration and the force A exerts on B.`,
        answer: `a = ${fmt(a)} m s⁻²; force on B = ${fmt(contact)} N`,
        working: `Whole system: a = F/(m_A + m_B) = ${F} ÷ ${m1 + m2} = ${fmt(a)} m s⁻². B alone: the only horizontal force on it is the push from A, so F_AB = m_B a = ${m2} × ${f4(a)} = ${fmt(contact)} N`,
      };
    },
    { F: 30, m1: 4, m2: 2 },
    rand => ({ F: rand(10, 60, 2), m1: rand(1, 10), m2: rand(1, 10) })),

  numberCard('ap3-n13', 'hard', SYL('3(h)'),
    ({ m, u, v, t }) => {
      const F = ((m / 1000) * (u + v)) / (t / 1000);
      return {
        question: `A ${m} g tennis ball reaches a racket at ${u} m s⁻¹ and leaves along the same line in the opposite direction at ${v} m s⁻¹. The contact lasts ${t} ms. Find the average force of the racket on the ball.`,
        answer: `${fmt(F)} N`,
        working: `Newton's 2nd law: F = Δp/Δt. Δp = ${f4(m / 1000)} × (${v} + ${u}) = ${f4((m / 1000) * (u + v))} kg m s⁻¹ (directions opposite, so the speeds add). F = ${f4((m / 1000) * (u + v))} ÷ ${f4(t / 1000)} = ${fmt(F)} N`,
      };
    },
    { m: 58, u: 30, v: 40, t: 5 },
    rand => ({ m: rand(55, 60), u: rand(15, 40), v: rand(20, 50), t: rand(3, 8) })),

  numberCard('ap3-n14', 'hard', SYL('3(i)'),
    ({ m1, m2 }) => {
      const a = (m2 * G) / (m1 + m2);
      const T = m1 * a;
      return {
        question: `A ${m1} kg trolley on a smooth horizontal table is joined by a light string over a smooth pulley to a ${m2} kg mass hanging over the edge. Find the acceleration of the system and the tension in the string.`,
        answer: `a = ${fmt(a)} m s⁻²; T = ${fmt(T)} N`,
        working: `Hanging mass: ${m2}g − T = ${m2}a. Trolley: T = ${m1}a. Add: ${m2} × 9.81 = ${m1 + m2}a → a = ${fmt(a)} m s⁻². T = ${m1} × ${f4(a)} = ${fmt(T)} N (less than the hanging weight ${f4(m2 * G)} N, because the mass accelerates)`,
      };
    },
    { m1: 3, m2: 1 },
    rand => ({ m1: rand(1, 8), m2: rand(1, 5) }),
    { seconds: 90 }),
]);

// #####################################################################
// TOPIC 4 ENERGY AND FIELDS
// Scope: official SEAB syllabus 9478 (first examined 2026), learning outcomes 4(a)–(n).
// Gravitational fields in detail (Newton's law of gravitation, potential) are Topic 8, and electric
// fields in detail are Topic 14, so this topic only uses field strength, field lines and uniform fields.
// All questions are original. g = 9.81 m s⁻², e = 1.60 × 10⁻¹⁹ C (syllabus data list).
// #####################################################################

const E_CHARGE = 1.6e-19; // elementary charge, C

// =====================================================================
// Energy stores and transfers — LO 4(a)–(b)
// =====================================================================

const stores = deck('Energy stores and transfers', [
  {
    id: 'ap4-c1', difficulty: 'easy', ref: SYL('4(a), 4(b)'),
    question: 'Give five energy stores and four ways energy can be transferred between stores.',
    answer: 'Stores: kinetic, gravitational potential, elastic potential, electric potential, thermal (internal), chemical, nuclear.\nTransfers: mechanical work (by forces), electrical work (by currents), heating, and waves (electromagnetic radiation such as light, and mechanical waves such as sound).',
    alternates: [
      { question: 'A battery lights a lamp. Describe the energy stores and transfers.', answer: 'Chemical store of the battery → electrical work by the current → thermal store of the lamp and surroundings, by heating and by radiation (light).' },
      { question: 'A ball is dropped and bounces lower each time. Where does the "lost" energy go?', answer: 'It is transferred to the thermal store of the ball, the floor and the air (and some away as sound). The total energy is conserved.' },
      { question: 'True or false: heating is an energy store. Explain.', answer: 'False. Heating is a way of transferring energy (because of a temperature difference). The store is the thermal (internal) store.' },
    ],
  },
  {
    id: 'ap4-c2', difficulty: 'easy', ref: SYL('4(b)'),
    question: 'State the principle of conservation of energy.',
    answer: 'Energy cannot be created or destroyed. It can only be transferred from one store to another, so the total energy of an isolated system stays constant.',
    alternates: [
      { question: 'A car brakes to a stop. Its kinetic energy is gone. Has energy been destroyed? Explain.', answer: 'No. Friction in the brakes transfers it to the thermal store of the brakes and surroundings. The total is unchanged.' },
      { question: 'Describe the energy changes of a bungee jumper from the moment she jumps to the lowest point.', answer: 'Gravitational PE → kinetic energy while she falls freely; then gravitational PE and kinetic energy → elastic PE of the cord as it stretches. At the lowest point her KE is zero. (Some is transferred to thermal energy by air resistance.)' },
      { question: 'Why can no machine have an efficiency greater than 100%?', answer: 'It would have to output more energy than it receives — creating energy, which breaks the principle of conservation of energy.' },
    ],
  },

  numberCard('ap4-n1', 'easy', SYL('4(b)'),
    ({ h }) => {
      const v = Math.sqrt(2 * G * (h / 100));
      return {
        question: `A pendulum bob is released from rest ${h} cm above its lowest point. Find its speed at the lowest point. (Ignore air resistance.)`,
        answer: `${fmt(v)} m s⁻¹`,
        working: `Loss of GPE = gain of KE: mgh = ½mv² → v = √(2gh) = √(2 × 9.81 × ${f4(h / 100)}) = ${fmt(v)} m s⁻¹ (mass cancels)`,
      };
    },
    { h: 20 },
    rand => ({ h: rand(5, 60) })),

  numberCard('ap4-n2', 'medium', SYL('4(b)'),
    ({ m, h, v }) => {
      const lost = m * G * h - 0.5 * m * v * v;
      return {
        question: `A ${m} kg child slides from rest down a slide ${h} m high and reaches the bottom at ${v} m s⁻¹. How much energy is transferred to thermal energy by friction?`,
        answer: `${fmt(lost)} J`,
        working: `GPE lost = mgh = ${m} × 9.81 × ${h} = ${f4(m * G * h)} J. KE gained = ½ × ${m} × ${v}² = ${f4(0.5 * m * v * v)} J. Thermal energy = ${f4(m * G * h)} − ${f4(0.5 * m * v * v)} = ${fmt(lost)} J`,
      };
    },
    { m: 25, h: 3.0, v: 6.0 },
    rand => {
      const h = rand(15, 50) / 10;
      const vMax = Math.sqrt(2 * G * h);
      // Speed at the bottom is 50–90% of the no-friction speed.
      return { m: rand(15, 50), h, v: Number((vMax * rand(50, 90) / 100).toFixed(1)) };
    }),
]);

// =====================================================================
// Work done by a force — LO 4(c)
// =====================================================================

const work = deck('Work done by a force', [
  {
    id: 'ap4-c3', difficulty: 'easy', ref: SYL('4(c)'),
    question: 'Define work done by a force. What kind of energy transfer is it?',
    answer: 'Work done = force × displacement in the direction of the force (W = Fs cos θ). It is a mechanical transfer of energy. Unit: joule (1 J = 1 N m).',
    alternates: [
      { question: 'A satellite moves in a circular orbit at constant speed. How much work does gravity do on it? Why?', answer: 'None. Gravity points towards the centre, perpendicular to the motion, so there is no displacement in the direction of the force.' },
      { question: 'You hold a heavy bag still for a minute. How much work do you do on the bag? Why?', answer: 'None on the bag — it has no displacement. (Your muscles still use energy internally.)' },
      { question: 'Friction acts on a sliding box. Is the work done by friction positive or negative? What does that mean?', answer: 'Negative — friction acts opposite to the displacement. It removes kinetic energy from the box, transferring it to thermal energy.' },
    ],
  },

  numberCard('ap4-n3', 'easy', SYL('4(c)'),
    ({ F, theta, s }) => {
      const W = F * s * Math.cos(rad(theta));
      return {
        question: `A sledge is pulled ${s} m along level snow by a rope at ${theta}° above the horizontal. The tension is ${F} N. Find the work done by the tension.`,
        answer: `${fmt(W)} J`,
        working: `W = Fs cos θ = ${F} × ${s} × cos ${theta}° = ${fmt(W)} J (only the horizontal component does work)`,
      };
    },
    { F: 60, theta: 30, s: 25 },
    rand => ({ F: rand(20, 150, 5), theta: rand(10, 60, 5), s: rand(5, 50, 5) })),

  numberCard('ap4-n4', 'medium', SYL('4(c)'),
    ({ m, h, d }) => {
      const W = m * G * h;
      return {
        question: `A worker lifts ${aOrAn(m)} ${m} kg box steadily through ${h} m, then carries it ${d} m along a level corridor at that height at constant speed. How much work does his upward supporting force do on the box altogether?`,
        answer: `${fmt(W)} J`,
        working: `Lifting: W = mgh = ${m} × 9.81 × ${h} = ${fmt(W)} J. Carrying: the upward force is perpendicular to the horizontal displacement, so it does 0 J. Total = ${fmt(W)} J`,
      };
    },
    { m: 12, h: 1.5, d: 8 },
    rand => ({ m: rand(5, 25), h: rand(5, 20) / 10, d: rand(3, 20) })),

  numberCard('ap4-n5', 'medium', SYL('4(c)'),
    ({ F, s }) => {
      const W = 0.5 * F * (s / 100);
      return {
        question: `The force on an archer's bowstring rises steadily from 0 to ${F} N as it is pulled back ${s} cm. Find the work done drawing the bow.`,
        answer: `${fmt(W)} J`,
        working: `Work = area under the force–displacement graph = ½ × ${F} × ${f4(s / 100)} = ${fmt(W)} J (a triangle, because the force increases from zero)`,
      };
    },
    { F: 180, s: 50 },
    rand => ({ F: rand(100, 300, 10), s: rand(30, 70) })),
]);

// =====================================================================
// Kinetic energy — LO 4(d)–(e)
// =====================================================================

const kinetic = deck('Kinetic energy', [
  {
    id: 'ap4-c4', difficulty: 'hard', ref: SYL('4(d)'),
    question: 'Derive Ek = ½mv² from the definition of work and the equations of uniformly accelerated motion.',
    answer: 'A constant resultant force F accelerates a mass m from rest through displacement s.\nWork done W = Fs = (ma)s.\nFrom v² = u² + 2as with u = 0: as = v²/2.\nSo W = m × v²/2 = ½mv². This work becomes the kinetic energy: Ek = ½mv².',
    alternates: [
      { question: 'In the derivation of Ek = ½mv², why is u set to zero?', answer: 'Kinetic energy is defined as the work needed to bring the body from rest to speed v, so it starts with u = 0.' },
      { question: 'A car\'s speed doubles. By what factor does its kinetic energy change? Why?', answer: 'Four times. Ek = ½mv² depends on v², and 2² = 4.' },
      { question: 'Show that Ek = p²/(2m), where p is momentum.', answer: 'p = mv, so v = p/m. Ek = ½m(p/m)² = p²/(2m).' },
    ],
  },

  numberCard('ap4-n6', 'easy', SYL('4(e)'),
    ({ m, kmh }) => {
      const v = kmh / 3.6;
      const Ek = 0.5 * m * v * v;
      return {
        question: `Find the kinetic energy of a ${m} kg motorcycle and rider travelling at ${kmh} km h⁻¹.`,
        answer: `${fmt(Ek)} J`,
        working: `${kmh} km h⁻¹ = ${kmh} ÷ 3.6 = ${f4(v)} m s⁻¹. Ek = ½mv² = ½ × ${m} × ${f4(v)}² = ${fmt(Ek)} J`,
      };
    },
    { m: 250, kmh: 54 },
    rand => ({ m: rand(150, 400, 10), kmh: rand(18, 108, 9) })),

  numberCard('ap4-n7', 'medium', SYL('4(e)'),
    ({ m, u, s }) => {
      const F = (0.5 * m * u * u) / s;
      return {
        question: `A ${m} kg car travelling at ${u} m s⁻¹ brakes to rest in ${s} m. Use energy to find the average braking force.`,
        answer: `${fmt(F)} N`,
        working: `Work done by brakes = loss of KE: F × ${s} = ½ × ${m} × ${u}² = ${f4(0.5 * m * u * u)} J → F = ${f4(0.5 * m * u * u)} ÷ ${s} = ${fmt(F)} N`,
      };
    },
    { m: 1200, u: 20, s: 40 },
    rand => {
      const u = rand(10, 30);
      return { m: rand(800, 2000, 100), u, s: rand(Math.ceil((u * u) / 16), Math.ceil((u * u) / 16) + 40) };
    }),

  numberCard('ap4-n8', 'medium', SYL('4(e)'),
    ({ m, p }) => {
      const Ek = (p * p) / (2 * m);
      return {
        question: `A ${m} kg trolley has momentum ${p} kg m s⁻¹. Find its kinetic energy without first finding its speed.`,
        answer: `${fmt(Ek)} J`,
        working: `Ek = p² / (2m) = ${p}² ÷ (2 × ${m}) = ${fmt(Ek)} J`,
      };
    },
    { m: 4, p: 12 },
    rand => {
      const m = rand(1, 10);
      return { m, p: m * rand(1, 5) }; // speed 1–5 m s⁻¹, realistic for a lab trolley
    }),
]);

// =====================================================================
// Concept of a field — LO 4(f)–(h)
// =====================================================================

const fields = deck('Concept of a field', [
  {
    id: 'ap4-c5', difficulty: 'easy', ref: SYL('4(f)'),
    question: 'What is a field, in physics?',
    answer: 'A region of space in which bodies may experience a force associated with the field — e.g. a mass in a gravitational field, or a charge in an electric field.',
    alternates: [
      { question: 'Which property of a body makes it experience a force in (i) a gravitational field, (ii) an electric field?', answer: '(i) Its mass. (ii) Its charge.' },
      { question: 'True or false: two bodies must touch for one to exert a force on the other. Explain.', answer: 'False. Field forces such as gravity and electric forces act at a distance, through a field, without contact.' },
      { question: 'An uncharged ball is placed in an electric field. Does it feel an electric force? Why?', answer: 'No (ignoring any induced charge) — an electric field only exerts a force on a charged body.' },
    ],
  },
  {
    id: 'ap4-c6', difficulty: 'medium', ref: SYL('4(g)'),
    question: 'Define gravitational field strength and electric field strength at a point.',
    answer: 'Gravitational field strength: the gravitational force per unit mass on a mass placed at that point (g = F/m, unit N kg⁻¹).\nElectric field strength: the electric force per unit charge on a positive charge placed at that point (E = F/q, unit N C⁻¹).',
    alternates: [
      { question: 'Why does the definition of electric field strength specify a POSITIVE charge?', answer: 'To fix the direction of the field: it points the way a positive charge would be pushed. A negative charge feels a force the opposite way.' },
      { question: 'Show that the unit N kg⁻¹ is the same as m s⁻².', answer: 'N kg⁻¹ = (kg m s⁻²) ÷ kg = m s⁻².' },
      { question: 'Gravitational field strength at the Earth\'s surface is 9.81 N kg⁻¹. What is the weight of a 5.0 kg mass there?', answer: 'W = mg = 5.0 × 9.81 = 49.1 N.' },
    ],
  },
  {
    id: 'ap4-c7', difficulty: 'hard', ref: SYL('4(h)'),
    question: 'How are equipotential surfaces related to field lines? Why?',
    answer: 'Equipotential surfaces are always perpendicular to the field lines.\nMoving along an equipotential, the potential energy does not change, so the field does no work. That is only possible if the force (along the field line) is perpendicular to the motion.',
    alternates: [
      { question: 'Describe the field lines and equipotentials between two parallel charged plates (away from the edges).', answer: 'Field lines: parallel, equally spaced straight lines from + to − (a uniform field). Equipotentials: equally spaced planes parallel to the plates.' },
      { question: 'Describe the field lines and equipotentials around an isolated point mass.', answer: 'Field lines: radial, pointing inwards towards the mass, getting further apart with distance. Equipotentials: concentric spheres (circles in 2D) around the mass.' },
      { question: 'What does it mean when field lines are drawn closer together?', answer: 'The field is stronger there.' },
    ],
  },

  numberCard('ap4-n9', 'medium', SYL('4(g)'),
    ({ E, particle }) => {
      const F = E * E_CHARGE;
      return {
        question: `${particle.name} is placed in a uniform electric field of strength ${fmt(E)} N C⁻¹ pointing to the right. Find the size and direction of the electric force on it. (e = 1.60 × 10⁻¹⁹ C)`,
        answer: `${fmt(F)} N to the ${particle.dir}`,
        working: `F = qE = (1.60 × 10⁻¹⁹) × ${fmt(E)} = ${fmt(F)} N. The charge is ${particle.sign}, so the force is ${particle.dir === 'right' ? 'along' : 'opposite to'} the field — to the ${particle.dir}.`,
      };
    },
    { E: 5000, particle: { name: 'An electron', sign: 'negative', dir: 'left' } },
    rand => ({
      E: rand(1, 50) * 1000,
      particle: pick(rand, [
        { name: 'An electron', sign: 'negative', dir: 'left' },
        { name: 'A proton', sign: 'positive', dir: 'right' },
      ]),
    })),

  numberCard('ap4-n10', 'easy', SYL('4(g)'),
    ({ m, W }) => {
      const gPlanet = W / m;
      return {
        question: `A ${m} kg probe weighs ${W} N on the surface of a planet. Find the gravitational field strength there.`,
        answer: `${fmt(gPlanet)} N kg⁻¹`,
        working: `g = F/m = ${W} ÷ ${m} = ${fmt(gPlanet)} N kg⁻¹`,
      };
    },
    { m: 50, W: 185 },
    rand => {
      const m = rand(10, 200, 10);
      return { m, W: Math.round(m * rand(10, 250) / 10) };
    }),
]);

// =====================================================================
// Potential energy — LO 4(i)–(k)
// =====================================================================

const potential = deck('Potential energy', [
  {
    id: 'ap4-c8', difficulty: 'hard', ref: SYL('4(i)'),
    question: 'How is the work done by a field on a mass (or charge) related to its change in potential energy?',
    answer: 'Work done by the field = −(change in potential energy).\nIf the field does positive work (e.g. a mass falls), the potential energy decreases. If an external force does work against the field (e.g. lifting the mass), the potential energy increases.',
    alternates: [
      { question: 'A ball falls 2 m. Gravity does +10 J of work on it. What is its change in gravitational potential energy?', answer: '−10 J — its GPE decreases by 10 J.' },
      { question: 'A proton is pushed against the direction of a uniform electric field. Does its electric potential energy increase or decrease? Why?', answer: 'Increase. The field pushes it the other way, so the field does negative work, and ΔU = −W is positive.' },
      { question: 'Along which direction does the force on a mass in a gravitational field act?', answer: 'Along the field lines, towards decreasing potential energy.' },
    ],
  },
  {
    id: 'ap4-c9', difficulty: 'medium', ref: SYL('4(j), 4(k)'),
    question: 'Distinguish between gravitational, electric and elastic potential energy. How is elastic PE found from a force–extension graph?',
    answer: 'Gravitational PE: energy of a mass due to its position in a gravitational field.\nElectric PE: energy of a charge due to its position in an electric field.\nElastic PE: energy stored in a deformed body due to its change of shape.\nElastic PE = area under the force–extension graph (= ½Fx = ½kx² when Hooke\'s law is obeyed).',
    alternates: [
      { question: 'A rubber band\'s force–extension graph is a curve. How do you find the energy stored in it?', answer: 'Find the area under the curve up to that extension (e.g. by counting squares). ½Fx only works for a straight line.' },
      { question: 'A spring is stretched to twice the extension (within the limit). By what factor does its elastic PE change?', answer: 'Four times, since Ep = ½kx².' },
      { question: 'Show that the elastic PE of a spring obeying Hooke\'s law is ½kx².', answer: 'Area under the F–x line from 0 to x is a triangle: ½ × x × F = ½ × x × kx = ½kx².' },
    ],
  },

  numberCard('ap4-n11', 'easy', SYL('4(i)'),
    ({ m, n, step }) => {
      const h = (n * step) / 100;
      const E = m * G * h;
      return {
        question: `${aOrAn(m) === 'an' ? 'An' : 'A'} ${m} kg student climbs ${n} steps, each ${step} cm high. Find her gain in gravitational potential energy.`,
        answer: `${fmt(E)} J`,
        working: `Height = ${n} × ${f4(step / 100)} = ${f4(h)} m. ΔGPE = mgh = ${m} × 9.81 × ${f4(h)} = ${fmt(E)} J`,
      };
    },
    { m: 55, n: 40, step: 18 },
    rand => ({ m: rand(40, 80), n: rand(10, 60), step: rand(14, 20) })),

  numberCard('ap4-n12', 'easy', SYL('4(k)'),
    ({ k, x }) => {
      const E = 0.5 * k * (x / 100) ** 2;
      return {
        question: `A spring of force constant ${k} N m⁻¹ is stretched by ${x} cm (within its limit of proportionality). Find the elastic potential energy stored.`,
        answer: `${fmt(E)} J`,
        working: `Ep = ½kx² = ½ × ${k} × ${f4(x / 100)}² = ${fmt(E)} J`,
      };
    },
    { k: 400, x: 5 },
    rand => ({ k: rand(50, 800, 50), x: rand(2, 15) })),

  numberCard('ap4-n13', 'medium', SYL('4(i)'),
    ({ Q, E, d }) => {
      const W = Q * 1e-6 * E * (d / 100);
      return {
        question: `A +${Q} μC charge moves ${d} cm in the direction of a uniform electric field of ${E} N C⁻¹. Find the work done by the field, and the change in the charge's electric potential energy.`,
        answer: `Work by field = ${fmt(W)} J; ΔU = −${fmt(W)} J (a decrease)`,
        working: `F = qE = ${Q} × 10⁻⁶ × ${E} = ${fmt(Q * 1e-6 * E)} N. W = Fd = ${fmt(Q * 1e-6 * E)} × ${f4(d / 100)} = ${fmt(W)} J. ΔU = −W = −${fmt(W)} J`,
      };
    },
    { Q: 2, E: 5000, d: 3 },
    rand => ({ Q: rand(1, 9), E: rand(1, 20) * 500, d: rand(1, 10) })),

  numberCard('ap4-n14', 'hard', SYL('4(b), 4(k)'),
    ({ k, x, m }) => {
      const Ep = 0.5 * k * (x / 100) ** 2;
      const h = Ep / ((m / 1000) * G);
      return {
        question: `A toy launcher has a spring of force constant ${k} N m⁻¹, compressed by ${x} cm. It fires a ${m} g ball straight up. Treat the spring as light and ignore air resistance. How high above its starting position (with the spring compressed) does the ball rise?`,
        answer: `${fmt(h)} m`,
        working: `Elastic PE = ½kx² = ½ × ${k} × ${f4(x / 100)}² = ${f4(Ep)} J. All of it becomes GPE at the top: mgh = ${f4(Ep)} → h = ${f4(Ep)} ÷ (${f4(m / 1000)} × 9.81) = ${fmt(h)} m`,
      };
    },
    { k: 200, x: 4, m: 20 },
    rand => ({ k: rand(100, 500, 20), x: rand(2, 6), m: rand(10, 50, 5) }),
    { seconds: 90 }),
]);

// =====================================================================
// Power and efficiency — LO 4(l)–(n)
// =====================================================================

const power = deck('Power and efficiency', [
  {
    id: 'ap4-c10', difficulty: 'easy', ref: SYL('4(l), 4(m)'),
    question: 'Define power. Show that the mechanical power of a force is P = Fv.',
    answer: 'Power is the rate of energy transfer (P = E/t, unit watt, 1 W = 1 J s⁻¹).\nP = W/t = F × s/t = Fv, where v is the velocity in the direction of the force.',
    alternates: [
      { question: 'A car travels at constant speed. Its engine is still producing power. Where does the energy go?', answer: 'It does work against air resistance and friction, transferring energy to the thermal store of the surroundings. The KE stays constant.' },
      { question: 'What is a kilowatt-hour (kWh) a unit of? Is it power or energy?', answer: 'Energy — 1 kW for 1 hour = 1000 × 3600 = 3.6 × 10⁶ J.' },
      { question: 'Two cranes lift identical loads to the same height, one in half the time. Compare their work and their power.', answer: 'Same work (mgh), but the faster crane has twice the power.' },
    ],
  },
  {
    id: 'ap4-c11', difficulty: 'medium', ref: SYL('4(n)'),
    question: 'Define efficiency. What are the implications of energy losses in practical devices?',
    answer: 'Efficiency = useful energy output ÷ total energy input (× 100%), or useful power out ÷ total power in.\nLosses (mostly to thermal energy, by friction and electrical resistance) mean devices waste fuel and money, need cooling, and can overheat. Efficiency is always less than 100%.',
    alternates: [
      { question: 'An LED lamp and a filament lamp give the same light. Why does the LED have a lower power rating?', answer: 'It is more efficient — far less of its input energy is wasted as thermal energy, so it needs less input power for the same useful light output.' },
      { question: 'Why do large motors and power-station generators need cooling systems?', answer: 'Wasted energy is transferred to their thermal store, raising their temperature. Without cooling they would overheat and be damaged.' },
      { question: 'A motor takes 500 J of electrical energy and lifts a load, gaining 350 J of GPE. Find its efficiency and the energy wasted.', answer: 'Efficiency = 350 ÷ 500 = 70%. Wasted = 150 J (mostly as thermal energy).' },
    ],
  },

  numberCard('ap4-n15', 'medium', SYL('4(l), 4(n)'),
    ({ m, h, t, Pin }) => {
      const useful = (m * G * h) / t;
      const eff = (useful / Pin) * 100;
      return {
        question: `An electric motor lifts ${aOrAn(m)} ${m} kg load ${h} m at constant speed in ${t} s. Its electrical input power is ${Pin} W. Find the useful output power and the efficiency.`,
        answer: `Output ${fmt(useful)} W; efficiency ${fmt(eff)} %`,
        working: `Useful power = mgh/t = ${m} × 9.81 × ${h} ÷ ${t} = ${f4(useful)} W. Efficiency = ${f4(useful)} ÷ ${Pin} × 100 = ${fmt(eff)} %`,
      };
    },
    { m: 50, h: 12, t: 20, Pin: 450 },
    rand => {
      const m = rand(20, 120, 5);
      const h = rand(4, 20);
      const t = rand(10, 40);
      const useful = (m * G * h) / t;
      // Input power gives an efficiency between about 40% and 90%.
      return { m, h, t, Pin: Math.round(useful / (rand(40, 90) / 100)) };
    }),

  numberCard('ap4-n16', 'easy', SYL('4(m)'),
    ({ R, kmh }) => {
      const v = kmh / 3.6;
      const P = R * v;
      return {
        question: `A car travels at a constant ${kmh} km h⁻¹ against a total resistive force of ${R} N. Find the useful power output of its engine.`,
        answer: `${fmt(P)} W`,
        working: `Constant speed, so driving force = resistive force = ${R} N. v = ${kmh} ÷ 3.6 = ${f4(v)} m s⁻¹. P = Fv = ${R} × ${f4(v)} = ${fmt(P)} W`,
      };
    },
    { R: 800, kmh: 90 },
    rand => ({ R: rand(300, 1500, 50), kmh: rand(36, 108, 9) })),

  numberCard('ap4-n17', 'hard', SYL('4(m)'),
    ({ m, P, R, v }) => {
      const vmax = P / R;
      const a = (P / v - R) / m;
      return {
        question: `A ${m} kg car's engine has a constant useful power of ${f4(P / 1000)} kW. Resistive forces total ${R} N (assume constant). Find (a) its maximum speed on a level road, (b) its acceleration when travelling at ${v} m s⁻¹.`,
        answer: `(a) ${fmt(vmax)} m s⁻¹  (b) ${fmt(a)} m s⁻²`,
        working: `(a) At top speed, driving force = resistance: P = Rv → v = ${P} ÷ ${R} = ${fmt(vmax)} m s⁻¹. (b) Driving force = P/v = ${P} ÷ ${v} = ${f4(P / v)} N. a = (${f4(P / v)} − ${R}) ÷ ${m} = ${fmt(a)} m s⁻²`,
      };
    },
    { m: 1000, P: 40000, R: 1000, v: 20 },
    rand => {
      const P = rand(20, 60, 5) * 1000;
      const R = rand(800, 1600, 100);
      // Speed below the maximum, so the car is still accelerating.
      // Between 40% and 80% of top speed, so the acceleration stays realistic (below about 4 m s⁻²).
      return { m: rand(800, 1800, 100), P, R, v: rand(Math.ceil(0.4 * P / R), Math.floor(0.8 * P / R)) };
    },
    { seconds: 90 }),
]);

// The keys below are used in data/syllabus.js (deck: 'a-phys-1-1', ...).
export const h2PhysicsDecks = {
  // Topic 1 Quantities and Measurement
  'a-phys-1-1': units,
  'a-phys-1-2': errors,
  'a-phys-1-3': vectors,
  // Topic 2 Forces and Moments
  'a-phys-2-1': forceTypes,
  'a-phys-2-2': moments,
  'a-phys-2-3': equilibrium,
  // Topic 3 Motion and Forces
  'a-phys-3-1': kinematics,
  'a-phys-3-2': suvat,
  'a-phys-3-3': momentum,
  'a-phys-3-4': laws,
  // Topic 4 Energy and Fields
  'a-phys-4-1': stores,
  'a-phys-4-2': work,
  'a-phys-4-3': kinetic,
  'a-phys-4-4': fields,
  'a-phys-4-5': potential,
  'a-phys-4-6': power,
};
