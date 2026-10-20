// IB Physics (first assessment 2025) — Theme A: Space, time and motion
// Lives at: src/features/flashcards/data/decks/ib-physics-a.js
//
// What is in scope comes from the official IB Physics guide (first assessment 2025):
//   A.1–A.3 are taught at SL and HL. A.4 and A.5 are HL only.
// Definitions are quoted or closely based on the free, peer-reviewed OpenStax textbooks
// (University Physics Vol. 1 and Vol. 3, College Physics 2e). Each card's "ref" says which.
// Equations and symbols follow the IB guide. Constants follow the IB data booklet: g = 9.8 m s⁻².
//
// Card fields: id, question, answer, difficulty — plus optional working, ref, vary, alternates
// (see decks/ib-cs-a1.js for what each one does).

import { aOrAn, deck, fmt, pick } from './helpers.js';

// Shows a measured value with one decimal place, as IB data is written: 2 → "2.0".
const d1 = x => Number(x).toFixed(1);
// Intermediate values in the working are shown to 4 significant figures, so each step multiplies out.
const f4 = x => String(Number(Number(x).toPrecision(4))).replace(/^-/, '−');

const g = 9.8; // IB data booklet: acceleration of free fall at the Earth's surface
const rad = degrees => (degrees * Math.PI) / 180;
const capital = word => word[0].toUpperCase() + word.slice(1);

// Where each fact comes from (shown on the back of the card).
const GUIDE = section => `IB Physics guide (first assessment 2025), ${section}`;
const UP1 = chapter => `OpenStax University Physics Vol. 1, ch. ${chapter}`;
const UP3 = 'OpenStax University Physics Vol. 3, ch. 5';
const CP2 = chapter => `OpenStax College Physics 2e, ch. ${chapter}`;

// Builds a NUMBER card. The original card and every "Focus on wrong" variation come from the
// same build() function, so the printed answer can never disagree with the question.
function numberCard(id, difficulty, ref, build, defaults, makeValues) {
  return { id, difficulty, ref, ...build(defaults), vary: { make: rand => build(makeValues(rand)) } };
}

// =====================================================================
// A.1 Kinematics (SL and HL)
// =====================================================================

const a1 = deck('A.1 Kinematics', [
  {
    id: 'pa1-c1', difficulty: 'easy', ref: UP1(3),
    question: 'Define displacement and distance travelled. How do they differ?',
    answer: 'Displacement is "the change in position of an object" — a vector, with magnitude and direction.\nDistance travelled is "the total length of the path traveled between two positions" — a scalar.',
    alternates: [
      { question: 'A runner completes exactly one lap of a 400 m track. What are her distance travelled and her displacement?', answer: 'Distance = 400 m. Displacement = 0 m, because she finishes where she started.' },
      { question: 'True or false: an object\'s displacement can be larger than the distance it travels. Explain.', answer: 'False. Displacement is the straight-line change in position, so it can never be longer than the path. They are equal only for motion in one direction along a straight line.' },
      { question: 'Fill the gap: displacement is a ___ quantity, but distance travelled is a ___ quantity.', answer: 'Vector; scalar.' },
    ],
  },
  {
    id: 'pa1-c2', difficulty: 'medium', ref: UP1(3),
    question: 'Distinguish between average speed and average velocity.',
    answer: 'Average speed = total distance travelled ÷ elapsed time (a scalar).\nAverage velocity = displacement ÷ time taken (a vector, in the direction of the displacement).',
    alternates: [
      { question: 'A bus drives a closed loop and returns to its depot after 40 minutes. Which is zero: its average speed or its average velocity? Why?', answer: 'Its average velocity — its displacement is zero. Its average speed is not zero because it travelled a distance.' },
      { question: 'What is instantaneous speed?', answer: '"The absolute value of the instantaneous velocity" — the speed at one particular instant.' },
      { question: 'True or false: an object\'s average velocity can be zero even though its average speed is not. Explain.', answer: 'True. If it returns to its starting point, its displacement — and so its average velocity — is zero, but it has travelled a distance, so its average speed is not zero.' },
    ],
  },
  {
    id: 'pa1-c3', difficulty: 'medium', ref: GUIDE('A.1'),
    question: 'What does the gradient of a displacement–time graph give? What does the area under a velocity–time graph give?',
    answer: 'Gradient of a displacement–time graph = velocity.\nArea under a velocity–time graph = displacement (change in position).',
    alternates: [
      { question: 'What does the gradient of a velocity–time graph give?', answer: 'Acceleration (velocity is changing at that rate).' },
      { question: 'How do you find the instantaneous velocity at one moment from a curved displacement–time graph?', answer: 'Draw the tangent to the curve at that moment and find its gradient.' },
      { question: 'A velocity–time graph is a horizontal line above the time axis. Describe the motion.', answer: 'Constant velocity (zero acceleration). The area under the line gives the displacement.' },
    ],
  },
  {
    id: 'pa1-c4', difficulty: 'medium', ref: GUIDE('A.1'),
    question: 'When can the equations of motion (v = u + at, s = ut + ½at², v² = u² + 2as, s = (u + v)t/2) be used?',
    answer: 'Only when the acceleration is uniform (constant). For two-dimensional motion they are applied separately to each component, e.g. horizontal and vertical for a projectile.',
    alternates: [
      { question: 'Can s = ut + ½at² be used for a skydiver before she reaches terminal speed? Why?', answer: 'No. Air resistance increases with speed, so her acceleration is not constant.' },
      { question: 'Which equation of motion links u, v, a and s without needing the time?', answer: 'v² = u² + 2as.' },
      { question: 'True or false: the equations of motion can be used for a ball moving in a circle at constant speed. Explain.', answer: 'False. Its acceleration points towards the centre and keeps changing direction, so it is not uniform.' },
    ],
  },
  {
    id: 'pa1-c5', difficulty: 'hard', ref: `${UP1(4)}; ${GUIDE('A.1')}`,
    question: 'Without air resistance, why are a projectile\'s horizontal and vertical motions treated separately? Describe each.',
    answer: 'The two perpendicular components are independent. Projectile motion is "motion of an object subject only to the acceleration of gravity".\nHorizontal: no force, so constant velocity.\nVertical: only its weight acts, so constant downward acceleration g = 9.8 m s⁻².',
    alternates: [
      { question: 'One ball is fired horizontally and another is dropped from the same height at the same moment. Which lands first? (No air resistance.)', answer: 'They land at the same time. Both start with zero vertical velocity and have the same vertical acceleration g.' },
      { question: 'At the top of its path, what are a projectile\'s vertical velocity and its acceleration?', answer: 'Vertical velocity is zero. Its acceleration is still g = 9.8 m s⁻² downwards (only its horizontal velocity remains).' },
      { question: 'For a projectile with no air resistance, which component of its velocity stays constant during the flight?', answer: 'The horizontal component.' },
    ],
  },
  {
    id: 'pa1-c6', difficulty: 'hard', ref: `${GUIDE('A.1')}; ${UP1(6)}`,
    question: 'Describe the effects of air (fluid) resistance on a projectile compared with no air resistance.',
    answer: 'Lower maximum height and shorter range; shorter time of flight.\nThe path is no longer a symmetric parabola: the descent is steeper than the ascent because the horizontal velocity keeps decreasing.\nAcceleration is no longer constant: its vertical component is greater than g on the way up and less than g on the way down.\nIf it falls far enough it approaches terminal speed.',
    alternates: [
      { question: 'Define terminal velocity.', answer: '"Constant velocity achieved by a falling object, which occurs when the weight of the object is balanced by the upward drag force."' },
      { question: 'With air resistance, is a projectile\'s path steeper on the way up or on the way down? Why?', answer: 'On the way down — drag keeps reducing the horizontal velocity, so the path becomes steeper and is no longer symmetric.' },
      { question: 'On the way UP, is a projectile\'s acceleration with air resistance more or less than g? Why?', answer: 'More than g — drag acts against the motion, adding to the downward pull of its weight.' },
    ],
  },

  numberCard('pa1-n1', 'medium', GUIDE('A.1'),
    ({ u, s }) => {
      const a = -(u * u) / (2 * s);
      return {
        question: `A car travelling at ${u} m s⁻¹ brakes uniformly and stops in ${s} m. Calculate its acceleration.`,
        answer: `${fmt(a)} m s⁻² (a deceleration of ${fmt(-a)} m s⁻²)`,
        working: `v² = u² + 2as → 0 = ${u}² + 2a(${s}) → a = −${u}² ÷ (2 × ${s}) = ${fmt(a)} m s⁻²`,
      };
    },
    { u: 24, s: 48 },
    rand => {
      const u = rand(12, 34, 2);
      const sMin = Math.ceil((u * u) / 16 / 5) * 5; // keeps braking below about 8 m s⁻² (realistic for a car)
      return { u, s: rand(sMin, sMin + 40, 5) };
    }),

  numberCard('pa1-n2', 'hard', GUIDE('A.1'),
    ({ u, h }) => {
      const t = (u + Math.sqrt(u * u + 2 * g * h)) / g; // positive root of 4.9t² − ut − h = 0
      return {
        question: `A stone is thrown vertically upwards at ${u} m s⁻¹ from the edge of a cliff ${h} m high. It falls past the cliff to the sea below. How long after being thrown does it hit the sea? (Ignore air resistance.)`,
        answer: `${fmt(t)} s`,
        working: `Take up as positive: s = ut + ½at² → −${h} = ${u}t − 4.9t² → 4.9t² − ${u}t − ${h} = 0 → t = [${u} + √(${u}² + 4 × 4.9 × ${h})] ÷ 9.8 = ${fmt(t)} s`,
      };
    },
    { u: 12, h: 30 },
    rand => ({ u: rand(5, 20), h: rand(15, 60, 5) })),

  numberCard('pa1-n3', 'medium', GUIDE('A.1'),
    ({ v, h }) => {
      const t = Math.sqrt((2 * h) / g);
      const x = v * t;
      return {
        question: `A ball rolls off a horizontal table ${h} m high at ${v} m s⁻¹. How far from the foot of the table does it land? (Ignore air resistance.)`,
        answer: `${fmt(x)} m`,
        working: `Vertical: h = ½gt² → t = √(2 × ${h} ÷ 9.8) = ${fmt(t)} s. Horizontal: x = vt = ${v} × ${fmt(t)} = ${fmt(x)} m`,
      };
    },
    { v: 3.5, h: 1.2 },
    rand => ({ v: rand(15, 60) / 10, h: rand(8, 20) / 10 })),

  numberCard('pa1-n4', 'hard', GUIDE('A.1'),
    ({ u, angle }) => {
      const uy = u * Math.sin(rad(angle));
      const ux = u * Math.cos(rad(angle));
      const H = (uy * uy) / (2 * g);
      const T = (2 * uy) / g;
      const R = ux * T;
      return {
        question: `A ball is kicked from level ground at ${u} m s⁻¹, ${angle}° above the horizontal. Calculate (a) its maximum height and (b) its horizontal range. (Ignore air resistance.)`,
        answer: `(a) ${fmt(H)} m  (b) ${fmt(R)} m`,
        working: `uᵧ = ${u} sin ${angle}° = ${fmt(uy)} m s⁻¹, uₓ = ${u} cos ${angle}° = ${fmt(ux)} m s⁻¹. (a) H = uᵧ² ÷ 2g = ${fmt(H)} m. (b) Time of flight = 2uᵧ ÷ g = ${fmt(T)} s; range = uₓ × ${fmt(T)} = ${fmt(R)} m`,
      };
    },
    { u: 20, angle: 35 },
    rand => ({ u: rand(12, 30), angle: rand(20, 70, 5) })),

  numberCard('pa1-n5', 'medium', UP1(3),
    ({ east, north, minutes }) => {
      const distance = east + north;
      const displacement = Math.hypot(east, north);
      const t = minutes * 60;
      return {
        question: `A runner goes ${east} m due east, then ${north} m due north, taking ${minutes} minutes in total. Calculate (a) her average speed and (b) the magnitude of her average velocity.`,
        answer: `(a) ${fmt(distance / t)} m s⁻¹  (b) ${fmt(displacement / t)} m s⁻¹`,
        working: `Distance = ${east} + ${north} = ${distance} m → ${distance} ÷ ${t} s = ${fmt(distance / t)} m s⁻¹. Displacement = √(${east}² + ${north}²) = ${fmt(displacement)} m → ${fmt(displacement)} ÷ ${t} s = ${fmt(displacement / t)} m s⁻¹`,
      };
    },
    { east: 600, north: 800, minutes: 5 },
    rand => ({ east: rand(300, 1200, 100), north: rand(300, 1200, 100), minutes: rand(3, 10) })),
]);

// =====================================================================
// A.2 Forces and momentum (SL and HL)
// =====================================================================

const a2 = deck('A.2 Forces and momentum', [
  {
    id: 'pa2-c1', difficulty: 'easy', ref: UP1(5),
    question: 'State Newton\'s first law of motion.',
    answer: 'A "body at rest remains at rest or, if in motion, remains in motion at constant velocity unless acted on by a net external force" — also known as the law of inertia.',
    alternates: [
      { question: 'What name is given to "the ability of an object to resist changes in its motion"?', answer: 'Inertia.' },
      { question: 'A puck slides across frictionless ice at constant velocity. What resultant force is needed to keep it moving?', answer: 'None — with zero resultant force it keeps moving at constant velocity (Newton\'s first law).' },
      { question: 'True or false: an object moving at constant velocity must have no forces acting on it. Explain.', answer: 'False. Forces may act, but they must balance — the RESULTANT force is zero.' },
    ],
  },
  {
    id: 'pa2-c2', difficulty: 'medium', ref: `${UP1(5)}; ${GUIDE('A.2')}`,
    question: 'State Newton\'s second law. Why is F = Δp/Δt more general than F = ma?',
    answer: 'The "acceleration of a system is directly proportional to and in the same direction as the net external force acting on the system and is inversely proportional to its mass."\nF = ma assumes the mass is constant; F = Δp/Δt also works when the mass changes (e.g. a rocket burning fuel).',
    alternates: [
      { question: 'The resultant force on an object doubles and its mass is halved. What happens to its acceleration?', answer: 'It becomes four times larger (a = F/m → 2F ÷ ½m = 4a).' },
      { question: 'Which form of Newton\'s second law should be used for a rocket losing mass as it burns fuel?', answer: 'F = Δp/Δt — the rate of change of momentum — because the mass is not constant.' },
      { question: 'A constant resultant force acts on a body of constant mass. Describe its acceleration.', answer: 'Constant acceleration, in the direction of the resultant force, of magnitude F/m.' },
    ],
  },
  {
    id: 'pa2-c3', difficulty: 'medium', ref: UP1(5),
    question: 'State Newton\'s third law. What is always true about a Newton\'s third law force pair?',
    answer: '"Whenever one body exerts a force on a second body, the first body experiences a force that is equal in magnitude and opposite in direction to the force that it exerts."\nThe two forces act on DIFFERENT bodies and are the same type of force.',
    alternates: [
      { question: 'A book rests on a table. Is the table\'s normal force on the book the third-law partner of the book\'s weight? Explain.', answer: 'No. Both act on the same body (the book) and are different types of force. The partner of the book\'s weight is the book\'s gravitational pull on the Earth.' },
      { question: 'A horse pulls a cart, and the cart pulls back on the horse with an equal force. Why don\'t these forces cancel?', answer: 'They act on different bodies, so they cannot cancel. Whether each body accelerates depends on the resultant force on that body alone.' },
      { question: 'You push on a wall with a force of 50 N. What force does the wall exert on you?', answer: '50 N on you, in the opposite direction (Newton\'s third law).' },
    ],
  },
  {
    id: 'pa2-c4', difficulty: 'medium', ref: `${GUIDE('A.2')}; ${UP1(6)}`,
    question: 'Define the normal force, and explain the difference between static and dynamic friction.',
    answer: 'Normal force F_N: the component of the contact force acting perpendicular to the surface.\nStatic friction acts when the surfaces are not sliding; it adjusts to the applied force up to a maximum: F_f ≤ μ_s F_N.\nDynamic friction acts when sliding: F_f = μ_d F_N. μ_d is usually less than μ_s (never greater).',
    alternates: [
      { question: 'Why is it harder to start a heavy box sliding than to keep it sliding?', answer: 'The maximum static friction (μ_s F_N) is usually larger than dynamic friction (μ_d F_N), because μ_s is usually greater than μ_d.' },
      { question: 'A box sits on a level floor and nobody pushes it. What is the friction force on it?', answer: 'Zero. Static friction only acts to oppose an applied force, up to its maximum value.' },
      { question: 'Fill the gap: for a sliding body the friction force is F_f = ___ F_N, using the coefficient of ___ friction.', answer: 'μ_d; dynamic.' },
    ],
  },
  {
    id: 'pa2-c5', difficulty: 'medium', ref: `${UP1(5)}; ${GUIDE('A.2')}`,
    question: 'State Hooke\'s law and the meaning of the spring constant k.',
    answer: 'A spring exerts "a restoring force proportional to and in the opposite direction of the imposed displacement": F_H = −kx.\nk is the force per unit extension (N m⁻¹) — a stiffer spring has a larger k.',
    alternates: [
      { question: 'What does the minus sign in F_H = −kx tell you?', answer: 'The restoring force acts in the opposite direction to the displacement (extension or compression).' },
      { question: 'Springs with k = 200 N m⁻¹ and k = 400 N m⁻¹ are pulled with the same force. Which stretches more, and by how much more?', answer: 'The 200 N m⁻¹ spring — it stretches twice as far.' },
      { question: 'A spring stretches 4.0 cm under a 2.0 N load. Assuming Hooke\'s law, how far does it stretch under a 6.0 N load?', answer: '12 cm — extension is proportional to force, so 3 times the force gives 3 times the extension.' },
    ],
  },
  {
    id: 'pa2-c6', difficulty: 'medium', ref: `${UP1(14)}; ${UP1(6)}; ${GUIDE('A.2')}`,
    question: 'State Archimedes\' principle and the IB equations for buoyancy and for viscous drag on a small sphere.',
    answer: 'The "buoyant force on an object equals the weight of the fluid it displaces": F_b = ρVg (ρ = fluid density, V = volume displaced).\nViscous drag on a small sphere (Stokes\' law): F_d = 6πηrv (η = viscosity, r = radius, v = speed).',
    alternates: [
      { question: 'A ship floats at rest. How does the buoyant force on it compare with its weight?', answer: 'They are equal — the forces are balanced, so it is in equilibrium.' },
      { question: 'In F_d = 6πηrv, what do η, r and v stand for?', answer: 'η = viscosity of the fluid, r = radius of the sphere, v = speed of the sphere through the fluid.' },
      { question: 'Fill the gap: the buoyant force on an object equals the ___ of the fluid it displaces.', answer: 'Weight.' },
    ],
  },
  {
    id: 'pa2-c7', difficulty: 'medium', ref: `${UP1(9)}; ${GUIDE('A.2')}`,
    question: 'Define momentum and impulse. How are they related?',
    answer: 'Momentum p = mv: "the product of mass and velocity; it is a vector quantity".\nImpulse J = FΔt (average resultant force × contact time).\nThe impulse applied equals the change in momentum: "change of momentum of a system is equal to the impulse applied to the system".',
    alternates: [
      { question: 'Why do car airbags reduce injuries?', answer: 'They increase the time over which the person\'s momentum changes. The same Δp over a longer Δt means a smaller average force (F = Δp/Δt).' },
      { question: 'Under what condition is the total momentum of a system conserved?', answer: 'When no resultant external force acts on it — "total momentum of a closed system cannot change".' },
      { question: 'What does the area under a force–time graph represent?', answer: 'The impulse, which equals the change in momentum.' },
    ],
  },
  {
    id: 'pa2-c8', difficulty: 'medium', ref: UP1(9),
    question: 'Compare elastic collisions, inelastic collisions and explosions in terms of momentum and kinetic energy.',
    answer: 'Momentum is conserved in all three (no external force).\nElastic: kinetic energy is also conserved.\nInelastic: kinetic energy is not conserved. In a perfectly inelastic collision the objects stick together and "the loss of kinetic energy is a maximum".\nExplosion: kinetic energy increases (it comes from stored energy); momentum is still conserved.',
    alternates: [
      { question: 'Two trolleys collide and stick together. Is momentum conserved, kinetic energy conserved, or both?', answer: 'Only momentum. Sticking together is a perfectly inelastic collision, so kinetic energy is lost (to thermal energy and sound).' },
      { question: 'In an explosion the total kinetic energy increases. Where does it come from?', answer: 'Stored energy, such as chemical energy or elastic potential energy, is converted into kinetic energy.' },
      { question: 'True or false: in an elastic collision, both momentum and kinetic energy are conserved.', answer: 'True — conserving kinetic energy is what makes it elastic. (Momentum is conserved in any collision with no resultant external force.)' },
    ],
  },
  {
    id: 'pa2-c9', difficulty: 'hard', ref: `${UP1(4)}; ${UP1(6)}; ${GUIDE('A.2')}`,
    question: 'Why does an object moving in a circle at constant speed accelerate? In which direction, and what causes it?',
    answer: 'Its direction, and so its velocity, is always changing. The acceleration is centripetal — "directed radially inward toward the center of the circle": a = v²/r = ω²r = 4π²r/T².\nIt is caused by a centripetal force (the resultant force) acting perpendicular to the velocity.',
    alternates: [
      { question: 'What provides the centripetal force for a car going round a flat bend?', answer: 'Friction between the tyres and the road.' },
      { question: 'Why does a centripetal force do no work on an object in uniform circular motion?', answer: 'It is perpendicular to the velocity, so W = Fs cos 90° = 0 and the speed does not change.' },
      { question: 'True or false: centripetal force is an extra force that appears in circular motion. Explain.', answer: 'False. "Centripetal force" is the name for the resultant force towards the centre. It is provided by real forces such as tension, friction, gravity or the normal force.' },
    ],
  },

  numberCard('pa2-n1', 'medium', GUIDE('A.2'),
    ({ m, F, mu }) => {
      const N = m * g;
      const f = mu * N;
      const a = (F - f) / m;
      return {
        question: `A ${m} kg crate is pushed along a horizontal floor by a horizontal force of ${F} N. The coefficient of dynamic friction is ${mu}. Calculate the crate's acceleration.`,
        answer: `${fmt(a)} m s⁻²`,
        working: `F_N = mg = ${m} × 9.8 = ${fmt(N)} N; F_f = μ_d F_N = ${mu} × ${fmt(N)} = ${fmt(f)} N; a = (F − F_f) ÷ m = (${F} − ${fmt(f)}) ÷ ${m} = ${fmt(a)} m s⁻²`,
      };
    },
    { m: 40, F: 200, mu: 0.35 },
    rand => {
      const m = rand(10, 60, 5);
      const mu = rand(15, 50, 5) / 100;
      const F = Math.ceil((m * g * mu * 1.4) / 10) * 10 + rand(0, 60, 10); // always more than friction
      return { m, F, mu };
    }),

  numberCard('pa2-n2', 'hard', UP1(9),
    ({ m1, v1, m2 }) => {
      const v = (m1 * v1) / (m1 + m2);
      const before = 0.5 * m1 * v1 * v1;
      const after = 0.5 * (m1 + m2) * v * v;
      return {
        question: `A ${d1(m1)} kg trolley moving at ${d1(v1)} m s⁻¹ collides with a stationary ${d1(m2)} kg trolley and they stick together. Calculate (a) their common velocity and (b) the kinetic energy lost.`,
        answer: `(a) ${fmt(v)} m s⁻¹  (b) ${fmt(before - after)} J`,
        working: `(a) Momentum conserved: ${m1} × ${v1} = (${m1} + ${m2})v → v = ${fmt(v)} m s⁻¹. (b) Eₖ before = ½ × ${m1} × ${v1}² = ${fmt(before)} J; after = ½ × ${fmt(m1 + m2)} × ${fmt(v)}² = ${fmt(after)} J; lost = ${fmt(before - after)} J`,
      };
    },
    { m1: 2.0, v1: 3.0, m2: 1.0 },
    rand => ({ m1: rand(10, 50, 5) / 10, v1: rand(10, 60, 5) / 10, m2: rand(5, 40, 5) / 10 })),

  numberCard('pa2-n3', 'hard', GUIDE('A.2'),
    ({ m, vin, vout, ms }) => {
      const dp = m * (vout + vin);
      const F = dp / (ms / 1000);
      return {
        question: `A ${m} kg ball hits a wall at ${vin} m s⁻¹ and rebounds along the same line at ${vout} m s⁻¹. It is in contact with the wall for ${ms} ms. Calculate the average force the wall exerts on the ball.`,
        answer: `${fmt(F)} N, directed away from the wall`,
        working: `Taking away from the wall as positive: Δp = m(v − u) = ${m} × (${vout} − (−${vin})) = ${fmt(dp)} kg m s⁻¹; F = Δp ÷ Δt = ${fmt(dp)} ÷ ${ms / 1000} = ${fmt(F)} N`,
      };
    },
    { m: 0.45, vin: 12, vout: 8, ms: 20 },
    rand => {
      const vin = rand(6, 20);
      // A wall can't give the ball energy, so it always rebounds slower than it arrived.
      return { m: rand(10, 60, 5) / 100, vin, vout: rand(Math.ceil(vin * 0.3), vin - 1), ms: rand(5, 40, 5) };
    }),

  numberCard('pa2-n4', 'medium', UP1(9),
    ({ M, m1, v1 }) => {
      const m2 = Number((M - m1).toFixed(2));
      const v2 = -(m1 * v1) / m2;
      return {
        question: `A stationary ${d1(M)} kg object explodes into two pieces. ${capital(aOrAn(m1))} ${d1(m1)} kg piece moves off at ${d1(v1)} m s⁻¹ to the right. Find the velocity of the other piece.`,
        answer: `${fmt(Math.abs(v2))} m s⁻¹ to the left`,
        working: `Total momentum before = 0, so ${m1} × ${v1} + ${m2} × v₂ = 0 → v₂ = −${fmt(m1 * v1)} ÷ ${m2} = ${fmt(v2)} m s⁻¹ (negative = to the left)`,
      };
    },
    { M: 5.0, m1: 2.0, v1: 9.0 },
    rand => {
      const M = rand(30, 100, 5) / 10;
      const m1 = rand(5, Math.round(M * 10) - 5, 5) / 10;
      return { M, m1, v1: rand(20, 150, 5) / 10 };
    }),

  numberCard('pa2-n5', 'hard', GUIDE('A.2'),
    ({ m, r, v }) => {
      const T = m * g + (m * v * v) / r;
      return {
        question: `A ${d1(m)} kg mass on a string ${d1(r)} m long is swung in a vertical circle. At the bottom of the circle its speed is ${d1(v)} m s⁻¹. Calculate the tension in the string at that point.`,
        answer: `${fmt(T)} N`,
        working: `At the bottom the resultant force points up, towards the centre: T − mg = mv² ÷ r → T = ${m} × 9.8 + ${m} × ${v}² ÷ ${r} = ${fmt(T)} N`,
      };
    },
    { m: 0.5, r: 0.8, v: 7.0 },
    rand => {
      const r = rand(5, 15) / 10;
      // To get round the top of the circle, the speed at the bottom must be at least √(5gr).
      const vMin = Math.ceil(Math.sqrt(5 * g * r) * 2) / 2;
      return { m: rand(2, 20) / 10, r, v: vMin + rand(0, 6) / 2 };
    }),

  numberCard('pa2-n6', 'hard', GUIDE('A.2'),
    ({ rmm, rhoS, rhoF, eta }) => {
      const r = rmm / 1000;
      const V = (4 / 3) * Math.PI * r ** 3;
      const W = rhoS * V * g;
      const B = rhoF * V * g;
      const v = (W - B) / (6 * Math.PI * eta * r);
      return {
        question: `A metal ball of radius ${d1(rmm)} mm and density ${rhoS} kg m⁻³ falls through oil of density ${rhoF} kg m⁻³ and viscosity ${eta} Pa s. Calculate its terminal speed.`,
        answer: `${fmt(v)} m s⁻¹`,
        working: `At terminal speed: weight = buoyancy + drag → ρ_ball Vg = ρ_oil Vg + 6πηrv, with V = 4/3 πr³ = ${fmt(V)} m³. Weight = ${fmt(W)} N, buoyancy = ${fmt(B)} N → v = (${fmt(W)} − ${fmt(B)}) ÷ (6π × ${eta} × ${r}) = ${fmt(v)} m s⁻¹`,
      };
    },
    { rmm: 2.0, rhoS: 7800, rhoF: 900, eta: 1.5 },
    rand => ({ rmm: rand(10, 30, 5) / 10, rhoS: pick(rand, [7800, 8500, 11300]), rhoF: rand(850, 950, 50), eta: rand(5, 30, 5) / 10 })),
]);

// =====================================================================
// A.3 Work, energy and power (SL and HL)
// =====================================================================

const a3 = deck('A.3 Work, energy and power', [
  {
    id: 'pa3-c1', difficulty: 'easy', ref: `${UP1(7)}; ${GUIDE('A.3')}`,
    question: 'Define work done by a constant force. What is it equivalent to?',
    answer: 'Work is "done when a force acts on something that undergoes a displacement". For a constant force: W = Fs cos θ, where θ is the angle between the force and the displacement.\nWork done is equivalent to energy transferred (unit: joule, J).',
    alternates: [
      { question: 'A waiter carries a tray horizontally at constant velocity. How much work does his upward supporting force do on the tray? Why?', answer: 'Zero — the force is vertical and the displacement is horizontal, so W = Fs cos 90° = 0.' },
      { question: 'Complete: one joule is the work done when…', answer: '…a force of 1 N moves its point of application 1 m in the direction of the force.' },
      { question: 'When is the work done by a force negative?', answer: 'When the force has a component opposite to the displacement (θ between 90° and 180°, so cos θ < 0) — e.g. friction on a sliding object.' },
    ],
  },
  {
    id: 'pa3-c2', difficulty: 'easy', ref: `${CP2(7)}; ${GUIDE('A.3')}`,
    question: 'State the principle of conservation of energy.',
    answer: '"Total energy is constant in any process; energy may change in form or be transferred from one system to another, but the total remains the same."',
    alternates: [
      { question: 'Is energy "used up" when a moving car brakes to a stop? Explain.', answer: 'No. The kinetic energy is transferred to thermal energy in the brakes and surroundings; the total energy stays the same.' },
      { question: 'What does a Sankey diagram show?', answer: 'Energy transfers in a system: the width of each arrow is proportional to the energy, split into useful output and wasted (dissipated) energy.' },
      { question: 'Fill the gap: energy cannot be created or ___; it can only be transferred or changed from one form to another.', answer: 'Destroyed.' },
    ],
  },
  {
    id: 'pa3-c3', difficulty: 'medium', ref: `${UP1(7)}; ${GUIDE('A.3')}`,
    question: 'State the work–energy theorem.',
    answer: 'The "net work done on a particle is equal to the change in its kinetic energy." (IB: the work done by the resultant force on a system equals the change in the energy of the system.)',
    alternates: [
      { question: 'The resultant force on a trolley does 50 J of work. What happens to its kinetic energy?', answer: 'It increases by 50 J.' },
      { question: 'A resultant force acts opposite to a cart\'s motion and does −30 J of work. What happens to the cart\'s kinetic energy?', answer: 'It decreases by 30 J.' },
      { question: 'True or false: if the resultant force on a moving object does no work, its speed stays the same. Explain.', answer: 'True. The work done by the resultant force equals the change in kinetic energy, so zero work means no change in kinetic energy, and so no change in speed.' },
    ],
  },
  {
    id: 'pa3-c4', difficulty: 'medium', ref: `${UP1(8)}; ${GUIDE('A.3')}`,
    question: 'What is mechanical energy, and when is it conserved?',
    answer: 'Mechanical energy = kinetic energy + gravitational potential energy + elastic potential energy.\nIt is conserved when no frictional or resistive (non-conservative) forces do work. Otherwise, the change in total mechanical energy equals the work done by those non-conservative forces.',
    alternates: [
      { question: 'Define a conservative force and give one example.', answer: 'A "force that does work independent of path" — e.g. gravity or the force of a spring.' },
      { question: 'A ball is dropped from rest. Ignoring air resistance, what happens to its mechanical energy as it falls?', answer: 'It stays constant: gravitational potential energy is transferred to kinetic energy.' },
      { question: 'Name the three forms of energy that make up mechanical energy in the IB course.', answer: 'Kinetic energy, gravitational potential energy and elastic potential energy.' },
    ],
  },
  {
    id: 'pa3-c5', difficulty: 'easy', ref: `${UP1(7)}; ${GUIDE('A.3')}`,
    question: 'Define power and show that P = Fv.',
    answer: 'Power is the "rate of doing work" (or rate of energy transfer): P = ΔW/Δt, unit watt (1 W = 1 J s⁻¹).\nFor a constant force F acting along the direction of motion of an object moving at speed v: P = Fs/t = F(s/t) = Fv.',
    alternates: [
      { question: 'Two students of equal weight climb the same stairs; one takes half the time. Compare the work done and the power developed.', answer: 'Same work done (same weight lifted through the same height); the faster student develops twice the power.' },
      { question: 'What is one watt?', answer: 'An energy transfer (or work done) of one joule per second.' },
      { question: 'Fill the gap: power is the rate of doing ___, and is measured in ___.', answer: 'Work (or transferring energy); watts (W).' },
    ],
  },
  {
    id: 'pa3-c6', difficulty: 'medium', ref: `${CP2(7)}; ${GUIDE('A.3')}`,
    question: 'Define efficiency. Why is it always less than 100% for real machines?',
    answer: 'Efficiency = useful work (or power) out ÷ total work (or power) in — "useful energy or work divided by the total input of energy".\nSome energy is always dissipated, mainly as thermal energy from friction and resistance (and as sound).',
    alternates: [
      { question: 'A motor takes in 500 J and does 350 J of useful work. What is its efficiency, and where did the rest go?', answer: '70%. The other 150 J is dissipated, mainly as thermal energy (and sound).' },
      { question: 'True or false: efficiency can be calculated using either energies or powers. Explain.', answer: 'True. η = useful work out ÷ total work in = useful power out ÷ total power in, because both are measured over the same time.' },
      { question: 'A lamp has an input power of 60 W and gives out 9.0 W of light. What is its efficiency?', answer: '15% (9.0 ÷ 60 = 0.15).' },
    ],
  },

  numberCard('pa3-n1', 'easy', GUIDE('A.3'),
    ({ F, angle, s }) => {
      const W = F * s * Math.cos(rad(angle));
      return {
        question: `A suitcase is pulled ${s} m along level ground by a force of ${F} N acting ${angle}° above the horizontal. How much work does the force do?`,
        answer: `${fmt(W)} J`,
        working: `W = Fs cos θ = ${F} × ${s} × cos ${angle}° = ${fmt(W)} J`,
      };
    },
    { F: 60, angle: 30, s: 25 },
    rand => ({ F: rand(20, 120, 5), angle: rand(10, 60, 5), s: rand(5, 50, 5) })),

  numberCard('pa3-n2', 'hard', GUIDE('A.3'),
    ({ m, h, Ff, d }) => {
      const Ep = m * g * h;
      const loss = Ff * d;
      const v = Math.sqrt((2 * (Ep - loss)) / m);
      return {
        question: `A ${m} kg sledge starts from rest and slides ${d} m down a slope, dropping a vertical height of ${h} m. A constant friction force of ${Ff} N acts on it. Calculate its speed at the bottom.`,
        answer: `${fmt(v)} m s⁻¹`,
        working: `ΔEₚ = mgh = ${m} × 9.8 × ${h} = ${fmt(Ep)} J; work against friction = F_f × d = ${Ff} × ${d} = ${fmt(loss)} J; Eₖ = ${fmt(Ep - loss)} J → v = √(2Eₖ ÷ m) = ${fmt(v)} m s⁻¹`,
      };
    },
    { m: 15, h: 8, Ff: 20, d: 25 },
    rand => {
      const m = rand(10, 40, 5);
      const h = rand(4, 15);
      const d = h * rand(2, 4);
      const Ff = Math.floor((m * g * h * rand(10, 50, 5)) / 100 / d); // friction removes 10–50% of the energy
      return { m, h, Ff, d };
    }),

  numberCard('pa3-n3', 'medium', GUIDE('A.3'),
    ({ F, kmh }) => {
      const v = kmh / 3.6;
      const P = F * v;
      return {
        question: `A car travels at a constant ${kmh} km h⁻¹ against a total resistive force of ${F} N. What power must the engine deliver to the wheels?`,
        answer: `${fmt(P / 1000)} kW`,
        working: `Constant speed, so the driving force = resistive force = ${F} N. v = ${kmh} ÷ 3.6 = ${fmt(v)} m s⁻¹. P = Fv = ${F} × ${f4(v)} = ${f4(P)} W = ${fmt(P / 1000)} kW`,
      };
    },
    { F: 650, kmh: 90 },
    rand => ({ F: rand(300, 1200, 50), kmh: rand(36, 126, 18) })),

  numberCard('pa3-n4', 'medium', GUIDE('A.3'),
    ({ m, h, t, P }) => {
      const useful = m * g * h;
      const input = P * t;
      return {
        question: `An electric motor with an input power of ${P} W lifts ${aOrAn(m)} ${m} kg load through ${h} m at constant speed in ${t} s. Calculate the efficiency of the motor.`,
        answer: `${fmt((100 * useful) / input)}%`,
        working: `Useful work = mgh = ${m} × 9.8 × ${h} = ${f4(useful)} J; total input = Pt = ${P} × ${t} = ${f4(input)} J; η = ${f4(useful)} ÷ ${f4(input)} = ${f4(useful / input)} = ${fmt((100 * useful) / input)}%`,
      };
    },
    { m: 50, h: 12, t: 20, P: 500 },
    rand => {
      const m = rand(20, 100, 10);
      const h = rand(5, 20);
      const t = rand(10, 40, 5);
      const P = Math.ceil((m * g * h) / t / (rand(40, 85, 5) / 100) / 10) * 10; // efficiency 40–85%
      return { m, h, t, P };
    }),

  numberCard('pa3-n5', 'medium', GUIDE('A.3'),
    ({ k, xcm, m }) => {
      const x = xcm / 100;
      const E = 0.5 * k * x * x;
      const v = Math.sqrt((2 * E) / m);
      return {
        question: `A spring of spring constant ${k} N m⁻¹ is compressed by ${xcm} cm and used to launch a ${m} kg ball horizontally. Assuming all the elastic potential energy becomes kinetic energy, find the launch speed.`,
        answer: `${fmt(v)} m s⁻¹`,
        working: `E_H = ½k(Δx)² = ½ × ${k} × ${x}² = ${fmt(E)} J = ½mv² → v = √(2 × ${fmt(E)} ÷ ${m}) = ${fmt(v)} m s⁻¹`,
      };
    },
    { k: 800, xcm: 5, m: 0.2 },
    rand => ({ k: rand(200, 1500, 100), xcm: rand(2, 12), m: rand(5, 50, 5) / 100 })),

  numberCard('pa3-n6', 'medium', GUIDE('A.3'),
    ({ m, p }) => {
      const Ek = (p * p) / (2 * m);
      return {
        question: `${capital(aOrAn(m))} ${m} kg object has a momentum of ${p} kg m s⁻¹. Calculate its kinetic energy without first finding its speed.`,
        answer: `${fmt(Ek)} J`,
        working: `Eₖ = p² ÷ 2m = ${p}² ÷ (2 × ${m}) = ${fmt(Ek)} J`,
      };
    },
    { m: 4, p: 24 },
    rand => ({ m: rand(1, 20), p: rand(5, 80, 5) })),
]);

// =====================================================================
// A.4 Rigid body mechanics (HL only)
// =====================================================================

const a4 = deck('A.4 Rigid body mechanics (HL)', [
  {
    id: 'pa4-c1', difficulty: 'medium', ref: `${GUIDE('A.4')}; ${UP1(10)}; ${CP2(9)}`,
    question: 'HL: Define the torque of a force about an axis.',
    answer: 'Torque is the "turning or twisting effectiveness of a force": τ = Fr sin θ, where r is the distance from the axis to where the force acts and θ is the angle between the force and r. Unit: N m. Its sense is clockwise or anticlockwise.',
    alternates: [
      { question: 'HL: Why are door handles placed as far as possible from the hinges?', answer: 'A larger distance r from the axis gives a larger torque (τ = Fr sin θ) for the same force, so the door is easier to turn.' },
      { question: 'HL: When does a force produce zero torque about an axis?', answer: 'When its line of action passes through the axis (θ = 0° or 180°, so sin θ = 0).' },
      { question: 'HL: The same force acts at the same point on a spanner, first at 90° and then at 30° to the spanner. Which gives the larger torque?', answer: 'At 90° — τ = Fr sin θ is greatest when sin θ = 1.' },
    ],
  },
  {
    id: 'pa4-c2', difficulty: 'medium', ref: `${GUIDE('A.4')}; ${UP1('12')}`,
    question: 'HL: What is the condition for rotational equilibrium?',
    answer: 'The resultant torque is zero: "all torques due to external forces acting on the body balance out and their vector sum is zero". (Full equilibrium also needs the resultant force to be zero.)',
    alternates: [
      { question: 'HL: A seesaw is balanced and at rest. What is the resultant torque about the pivot?', answer: 'Zero — the clockwise torques equal the anticlockwise torques.' },
      { question: 'HL: Can a body be in rotational equilibrium while it is rotating? Explain.', answer: 'Yes — if it rotates at constant angular velocity. Zero resultant torque means zero angular acceleration, not zero rotation.' },
      { question: 'HL: Fill the gap: a body in rotational equilibrium has a resultant ___ of zero, so its angular acceleration is ___.', answer: 'Torque; zero.' },
    ],
  },
  {
    id: 'pa4-c3', difficulty: 'medium', ref: `${UP1(10)}; ${GUIDE('A.4')}`,
    question: 'HL: What is moment of inertia, and what does it depend on?',
    answer: 'The "rotational mass of rigid bodies that relates to how easy or hard it will be to change the angular velocity". It depends on the mass AND how that mass is distributed about the axis of rotation. For point masses: I = Σmr².',
    alternates: [
      { question: 'HL: Two wheels have the same mass and radius. One has most of its mass at the rim; the other is a uniform disc. Which is harder to spin up? Why?', answer: 'The rim-heavy wheel — its mass is further from the axis, so its moment of inertia is larger.' },
      { question: 'HL: Does an object have only one moment of inertia? Explain.', answer: 'No. It depends on the axis of rotation chosen, because the distances r of the mass from the axis change.' },
      { question: 'HL: A point mass is moved from 0.10 m to 0.20 m from the axis of rotation. By what factor does its moment of inertia change?', answer: 'It becomes 4 times larger — I = mr², so doubling r multiplies I by 4.' },
    ],
  },
  {
    id: 'pa4-c4', difficulty: 'medium', ref: `${UP1(10)}; ${UP1(11)}; ${GUIDE('A.4')}`,
    question: 'HL: State Newton\'s second law for rotation, and give the rotational equivalents of mass, force and linear momentum.',
    answer: 'The "sum of the torques on a rotating system equals its moment of inertia times its angular acceleration": τ = Iα.\nMass → moment of inertia I; force → torque τ; linear momentum p = mv → angular momentum L = Iω.',
    alternates: [
      { question: 'HL: What is the rotational version of kinetic energy ½mv²?', answer: 'Rotational kinetic energy Eₖ = ½Iω² = L²/2I.' },
      { question: 'HL: The same torque acts on two wheels; one has twice the moment of inertia. Compare their angular accelerations.', answer: 'The wheel with twice the moment of inertia has half the angular acceleration (α = τ/I).' },
      { question: 'HL: Fill the gap: τ = Iα is the rotational version of F = ___.', answer: 'ma.' },
    ],
  },
  {
    id: 'pa4-c5', difficulty: 'hard', ref: `${UP1(11)}; ${GUIDE('A.4')}`,
    question: 'HL: Define angular momentum. When is it conserved?',
    answer: 'Angular momentum L = Iω — the "rotational analog of linear momentum". It is conserved "when no external torque is applied to the system". A resultant torque gives an angular impulse ΔL = τΔt = Δ(Iω).',
    alternates: [
      { question: 'HL: Why does a diver spin faster when she tucks in her arms and legs?', answer: 'Her moment of inertia decreases. No external torque acts, so L = Iω is conserved and her angular speed ω increases.' },
      { question: 'HL: What is angular impulse?', answer: 'The product of the resultant torque and the time it acts, τΔt, which equals the change in angular momentum ΔL.' },
      { question: 'HL: True or false: a spinning skater can change her angular speed with no external torque. Explain.', answer: 'True. By moving her arms she changes her moment of inertia; L = Iω stays constant, so ω changes.' },
    ],
  },
  {
    id: 'pa4-c6', difficulty: 'hard', ref: `${UP1(11)}; ${GUIDE('A.4')}`,
    question: 'HL: For an object rolling without slipping, how are its linear and angular speeds related, and what is its total kinetic energy?',
    answer: 'v = ωr (the speed of the centre of mass equals the angular speed × radius).\nTotal kinetic energy = translational + rotational = ½mv² + ½Iω².',
    alternates: [
      { question: 'HL: A solid ball and a hoop of equal mass and radius roll from rest down the same slope. Which reaches the bottom first? Why?', answer: 'The solid ball. It has a smaller moment of inertia, so less of its energy goes into rotation and more into translational kinetic energy — it moves faster.' },
      { question: 'HL: Which kind of friction acts at the contact point of an object rolling without slipping?', answer: 'Static friction — the contact point is momentarily at rest relative to the surface.' },
      { question: 'HL: A wheel of radius 0.30 m rolls without slipping at 6.0 m s⁻¹. What is its angular speed?', answer: '20 rad s⁻¹ (ω = v/r = 6.0 ÷ 0.30).' },
    ],
  },

  numberCard('pa4-n1', 'easy', GUIDE('A.4'),
    ({ F, r, angle }) => {
      const tau = F * r * Math.sin(rad(angle));
      return {
        question: `HL: A force of ${F} N is applied to a spanner ${r} m from the bolt, at ${angle}° to the spanner. Calculate the torque about the bolt.`,
        answer: `${fmt(tau)} N m`,
        working: `τ = Fr sin θ = ${F} × ${r} × sin ${angle}° = ${fmt(tau)} N m`,
      };
    },
    { F: 80, r: 0.25, angle: 60 },
    rand => ({ F: rand(20, 150, 10), r: rand(10, 50, 5) / 100, angle: rand(30, 90, 10) })),

  numberCard('pa4-n2', 'medium', GUIDE('A.4'),
    ({ m1, r1, m2, r2 }) => {
      const I = m1 * r1 * r1 + m2 * r2 * r2;
      return {
        question: `HL: A light rod rotates about one end. A ${d1(m1)} kg mass is fixed ${d1(r1)} m from the axis and a ${d1(m2)} kg mass ${d1(r2)} m from the axis. Calculate the moment of inertia of the system.`,
        answer: `${fmt(I)} kg m²`,
        working: `I = Σmr² = ${m1} × ${r1}² + ${m2} × ${r2}² = ${fmt(I)} kg m²`,
      };
    },
    { m1: 2.0, r1: 0.3, m2: 1.5, r2: 0.6 },
    rand => ({ m1: rand(5, 40, 5) / 10, r1: rand(1, 4) / 10, m2: rand(5, 40, 5) / 10, r2: rand(5, 9) / 10 })),

  numberCard('pa4-n3', 'hard', GUIDE('A.4'),
    ({ tau, I, t }) => {
      const alpha = tau / I;
      const theta = 0.5 * alpha * t * t;
      const revs = theta / (2 * Math.PI);
      return {
        question: `HL: A constant resultant torque of ${tau} N m acts on a wheel of moment of inertia ${I} kg m², starting from rest. How many revolutions does it make in the first ${t} s?`,
        answer: `${fmt(revs)} revolutions`,
        working: `α = τ ÷ I = ${tau} ÷ ${I} = ${fmt(alpha)} rad s⁻²; Δθ = ½αt² = ½ × ${fmt(alpha)} × ${t}² = ${fmt(theta)} rad; revolutions = Δθ ÷ 2π = ${fmt(revs)}`,
      };
    },
    { tau: 6, I: 0.5, t: 4 },
    rand => ({ tau: rand(2, 20), I: rand(2, 20) / 10, t: rand(2, 8) })),

  numberCard('pa4-n4', 'hard', GUIDE('A.4'),
    ({ I1, w1, I2 }) => {
      const w2 = (I1 * w1) / I2;
      const E1 = 0.5 * I1 * w1 * w1;
      const E2 = 0.5 * I2 * w2 * w2;
      return {
        question: `HL: A skater spinning at ${d1(w1)} rad s⁻¹ with moment of inertia ${d1(I1)} kg m² pulls in her arms, reducing her moment of inertia to ${d1(I2)} kg m². Find (a) her new angular speed and (b) the change in her rotational kinetic energy.`,
        answer: `(a) ${fmt(w2)} rad s⁻¹  (b) an increase of ${fmt(E2 - E1)} J`,
        working: `(a) No external torque, so L is conserved: I₁ω₁ = I₂ω₂ → ω₂ = ${I1} × ${w1} ÷ ${I2} = ${fmt(w2)} rad s⁻¹. (b) Eₖ = ½Iω²: ${fmt(E1)} J → ${fmt(E2)} J, an increase of ${fmt(E2 - E1)} J (work done by her muscles pulling her arms in)`,
      };
    },
    { I1: 4.0, w1: 3.0, I2: 1.6 },
    rand => {
      const I1 = rand(25, 50, 5) / 10;
      return { I1, w1: rand(15, 50, 5) / 10, I2: rand(10, Math.round(I1 * 10) - 5, 5) / 10 };
    }),
]);

// =====================================================================
// A.5 Galilean and special relativity (HL only)
// =====================================================================

const a5 = deck('A.5 Galilean and special relativity (HL)', [
  {
    id: 'pa5-c1', difficulty: 'medium', ref: `${UP3}; ${GUIDE('A.5')}`,
    question: 'HL: What is an inertial reference frame, and what does Galilean relativity state?',
    answer: 'An inertial frame is a "reference frame in which a body at rest remains at rest and a body in motion moves at a constant speed in a straight line unless acted on by an outside force" — a non-accelerating frame.\nGalilean relativity: Newton\'s laws of motion are the same in all inertial frames, with x′ = x − vt, t′ = t and u′ = u − v.',
    alternates: [
      { question: 'HL: Is a car going round a bend at constant speed an inertial reference frame? Why?', answer: 'No — it is accelerating (its direction changes), so it is not an inertial frame.' },
      { question: 'HL: Using Galilean relativity, a ball is thrown forwards at 5 m s⁻¹ inside a train moving at 20 m s⁻¹. What is its speed relative to the ground?', answer: '25 m s⁻¹ — Galilean velocities simply add (u = u′ + v).' },
      { question: 'HL: In Galilean relativity, do two observers in different inertial frames agree on the time of an event?', answer: 'Yes — Galilean relativity assumes time is the same for all observers: t′ = t.' },
    ],
  },
  {
    id: 'pa5-c2', difficulty: 'easy', ref: UP3,
    question: 'HL: State the two postulates of special relativity.',
    answer: '1. The "laws of physics are the same in all inertial frames of reference."\n2. "Light travels in a vacuum with the same speed c in any direction in all inertial frames."',
    alternates: [
      { question: 'HL: Which postulate means that two observers moving relative to each other measure the same speed for the same light pulse?', answer: 'The second postulate — the speed of light in a vacuum is the same, c, in all inertial frames.' },
      { question: 'HL: Which Galilean idea does the second postulate show is wrong?', answer: 'That velocities simply add (u′ = u − v) for all speeds, and that time is the same (absolute) for all observers.' },
      { question: 'HL: True or false: an experiment inside a sealed spaceship moving at constant velocity can detect that it is moving. Explain.', answer: 'False. By the first postulate the laws of physics are the same in all inertial frames, so no such experiment can detect uniform motion.' },
    ],
  },
  {
    id: 'pa5-c3', difficulty: 'medium', ref: `${UP3}; ${GUIDE('A.5')}`,
    question: 'HL: Define proper time and describe time dilation.',
    answer: 'Proper time Δt₀ is "the time interval measured by an observer who sees the beginning and end of the process … occur at the same location".\nTime dilation: an observer moving relative to those events measures a longer interval, Δt = γΔt₀, where γ = 1/√(1 − v²/c²).',
    alternates: [
      { question: 'HL: A clock on a fast spaceship ticks. Who measures the proper time between its ticks?', answer: 'An observer on the spaceship, at rest relative to the clock — both ticks happen at the same place in that frame.' },
      { question: 'HL: True or false: time dilation happens because moving clocks are faulty. Explain.', answer: 'False. It is a property of space and time: every inertial observer measures the other\'s clocks running slow, however well made they are.' },
      { question: 'HL: What is the value of the Lorentz factor γ when v is very small compared with c, and what does that tell you?', answer: 'γ is almost exactly 1, so time dilation is negligible at everyday speeds.' },
    ],
  },
  {
    id: 'pa5-c4', difficulty: 'medium', ref: `${UP3}; ${GUIDE('A.5')}`,
    question: 'HL: Define proper length and describe length contraction.',
    answer: 'Proper length L₀ is "the distance between two points measured by an observer who is at rest relative to both of the points".\nLength contraction: an observer moving relative to the object measures a shorter length along the direction of motion, L = L₀/γ.',
    alternates: [
      { question: 'HL: Who measures the proper length of a moving spaceship?', answer: 'An observer at rest relative to the spaceship (e.g. its crew).' },
      { question: 'HL: Is an object contracted in the direction perpendicular to its motion?', answer: 'No — length contraction happens only along the direction of relative motion.' },
      { question: 'HL: A rod of proper length L₀ moves along its length at speed v. Write the length measured by a stationary observer.', answer: 'L = L₀/γ, where γ = 1/√(1 − v²/c²) — shorter than L₀.' },
    ],
  },
  {
    id: 'pa5-c5', difficulty: 'hard', ref: UP3,
    question: 'HL: What is meant by the relativity of simultaneity?',
    answer: '"Two events at locations a distance apart that are simultaneous for an observer at rest in one frame of reference are not necessarily simultaneous for an observer at rest in a different frame of reference."',
    alternates: [
      { question: 'HL: True or false: two events that are simultaneous in one inertial frame are simultaneous in every inertial frame. Explain.', answer: 'False. If the events happen at different places, observers moving relative to the first frame generally disagree about whether they are simultaneous.' },
      { question: 'HL: Two events happen at the SAME place and the same time in one frame. Are they simultaneous in all frames?', answer: 'Yes — events at the same place and time are simultaneous for every observer.' },
      { question: 'HL: Fill the gap: whether two events at different places are simultaneous depends on the observer\'s ___ of reference.', answer: 'Frame.' },
    ],
  },
  {
    id: 'pa5-c6', difficulty: 'hard', ref: `${GUIDE('A.5')}; ${UP3}`,
    question: 'HL: What is the space–time interval, and what does "invariant" mean here?',
    answer: '(Δs)² = (cΔt)² − (Δx)². It is invariant: every inertial observer calculates the same value for two given events, even though they disagree about Δt and Δx.',
    alternates: [
      { question: 'HL: On a space–time diagram (ct up, x across), what does a vertical world line represent?', answer: 'An object at rest in that frame — its position x does not change as time passes.' },
      { question: 'HL: What is the world line of a light pulse, and why?', answer: 'A straight line at 45° to the axes, because tan θ = v/c = 1 for light.' },
      { question: 'HL: Why can no particle\'s world line make an angle of 45° or more with the ct axis?', answer: 'tan θ = v/c, and a particle with mass always has v < c, so θ < 45°.' },
    ],
  },
  {
    id: 'pa5-c7', difficulty: 'hard', ref: `${UP3}; ${GUIDE('A.5')}`,
    question: 'HL: How do muon decay experiments provide evidence for time dilation and length contraction?',
    answer: 'Muons are created by cosmic rays in the upper atmosphere and move close to c. Their lifetime is so short that, without relativity, very few should reach the ground — but far more are detected.\nEarth frame: the muons\' lifetime is time-dilated, so they survive long enough.\nMuon frame: the muon\'s lifetime is normal, but the atmosphere\'s thickness is length-contracted, so there is less distance to travel.',
    alternates: [
      { question: 'HL: In the Earth\'s frame, which relativistic effect explains why so many muons reach the ground?', answer: 'Time dilation — their lifetime measured from Earth is longer than their proper lifetime.' },
      { question: 'HL: In the muon\'s own frame, its lifetime is normal. How does it still reach the ground?', answer: 'The atmosphere is moving relative to the muon, so its thickness is length-contracted.' },
      { question: 'HL: True or false: Earth observers and the muon agree that the muon reaches the ground. Explain.', answer: 'True. They disagree about the time taken and the distance travelled (time dilation vs. length contraction), but both predict the same outcome.' },
    ],
  },

  numberCard('pa5-n1', 'hard', GUIDE('A.5'),
    ({ beta, t0 }) => {
      const gamma = 1 / Math.sqrt(1 - beta * beta);
      const t = gamma * t0;
      return {
        question: `HL: Muons have a proper mean lifetime of ${t0} μs. A muon travels at ${beta}c relative to the Earth. Calculate (a) the Lorentz factor and (b) its mean lifetime measured in the Earth frame.`,
        answer: `(a) γ = ${fmt(gamma)}  (b) ${fmt(t)} μs`,
        working: `γ = 1 ÷ √(1 − ${beta}²) = ${f4(gamma)}; Δt = γΔt₀ = ${f4(gamma)} × ${t0} = ${fmt(t)} μs`,
      };
    },
    { beta: 0.98, t0: 2.2 },
    rand => ({ beta: rand(800, 995, 5) / 1000, t0: 2.2 })),

  numberCard('pa5-n2', 'medium', GUIDE('A.5'),
    ({ beta, L0 }) => {
      const gamma = 1 / Math.sqrt(1 - beta * beta);
      return {
        question: `HL: A spaceship has a proper length of ${L0} m. What length does an observer on Earth measure as it passes at ${beta}c?`,
        answer: `${fmt(L0 / gamma)} m`,
        working: `γ = 1 ÷ √(1 − ${beta}²) = ${f4(gamma)}; L = L₀ ÷ γ = ${L0} ÷ ${f4(gamma)} = ${fmt(L0 / gamma)} m`,
      };
    },
    { beta: 0.6, L0: 120 },
    rand => ({ beta: rand(30, 95, 5) / 100, L0: rand(50, 300, 10) })),

  numberCard('pa5-n3', 'hard', GUIDE('A.5'),
    ({ v, uPrime }) => {
      const u = (uPrime + v) / (1 + uPrime * v);
      return {
        question: `HL: A spaceship moves at ${v}c relative to the Earth. It fires a probe forwards at ${uPrime}c relative to the ship. What is the probe's speed relative to the Earth?`,
        answer: `${fmt(u)}c`,
        working: `Rearranging u′ = (u − v) ÷ (1 − uv/c²) for the Earth-frame speed u: u = (u′ + v) ÷ (1 + u′v/c²) = (${uPrime} + ${v}) ÷ (1 + ${uPrime} × ${v}) c = ${fmt(u)}c. (Galilean addition would wrongly give ${fmt(uPrime + v)}c.)`,
      };
    },
    { v: 0.6, uPrime: 0.7 },
    rand => ({ v: rand(30, 90, 5) / 100, uPrime: rand(30, 90, 5) / 100 })),

  numberCard('pa5-n4', 'hard', GUIDE('A.5'),
    ({ beta, years }) => {
      const distance = beta * years; // in light-years
      const s2 = years * years - distance * distance;
      const shipTime = Math.sqrt(s2);
      return {
        question: `HL: In the Earth frame, a spacecraft leaves Earth and reaches a station ${fmt(distance)} light-years away after ${years} years, at constant speed. Use the space–time interval to find the time that passes on the spacecraft's clock.`,
        answer: `${fmt(shipTime)} years`,
        working: `(Δs)² = (cΔt)² − (Δx)² = ${years}² − ${fmt(distance)}² = ${fmt(s2)} (light-years)². On the spacecraft both events happen at the same place (Δx′ = 0), so cΔt′ = Δs → Δt′ = √${fmt(s2)} = ${fmt(shipTime)} years`,
      };
    },
    { beta: 0.8, years: 10 },
    rand => ({ beta: rand(30, 90, 10) / 100, years: rand(5, 20) })),
]);

// The keys below are used in data/syllabus.js (deck: 'ib-phys-a1', ...).
// SL students see A.1–A.3; HL students also see A.4 and A.5.
export const physicsADecks = {
  'ib-phys-a1': a1,
  'ib-phys-a2': a2,
  'ib-phys-a3': a3,
  'ib-phys-a4': a4,
  'ib-phys-a5': a5,
};