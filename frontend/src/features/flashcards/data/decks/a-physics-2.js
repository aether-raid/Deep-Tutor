// A Level H2 Physics 9478 — Topic 2 Forces and Moments
// Lives at: src/features/flashcards/data/decks/a-physics-2.js
//
// Scope: official SEAB syllabus 9478 (first examined 2026), learning outcomes 2(a)–(i).
// The syllabus says coefficients of friction and viscosity are NOT required, so no card uses them.
// All questions are original. g = 9.81 m s⁻² (syllabus data list).

import { deck, fmt, numberCard } from './helpers.js';
import { G, SYL, deg, f4, rad } from './a-physics-tools.js';

// =====================================================================
// Types of force — LO 2(a)–(c)
// =====================================================================

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

// The keys below are used in data/syllabus.js (deck: 'a-phys-2-1', ...).
export const aPhysics2Decks = {
  'a-phys-2-1': forceTypes,
  'a-phys-2-2': moments,
  'a-phys-2-3': equilibrium,
};
