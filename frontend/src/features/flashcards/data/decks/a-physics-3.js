// A Level H2 Physics 9478 — Topic 3 Motion and Forces
// Lives at: src/features/flashcards/data/decks/a-physics-3.js
//
// Scope: official SEAB syllabus 9478 (first examined 2026), learning outcomes 3(a)–(i).
// Newton's laws are worded exactly as the syllabus states them. Projectiles and collisions are
// separate topics (5 and 6) in this syllabus, so they are left out here.
// All questions are original. g = 9.81 m s⁻² (syllabus data list).

import { aOrAn, deck, fmt, numberCard } from './helpers.js';
import { G, SYL, f4 } from './a-physics-tools.js';

// =====================================================================
// Kinematics — LO 3(a)–(c)
// =====================================================================

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

// The keys below are used in data/syllabus.js (deck: 'a-phys-3-1', ...).
export const aPhysics3Decks = {
  'a-phys-3-1': kinematics,
  'a-phys-3-2': suvat,
  'a-phys-3-3': momentum,
  'a-phys-3-4': laws,
};
