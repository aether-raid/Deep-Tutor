// A Level H2 Physics 9478 — Topic 4 Energy and Fields
// Lives at: src/features/flashcards/data/decks/a-physics-4.js
//
// Scope: official SEAB syllabus 9478 (first examined 2026), learning outcomes 4(a)–(n).
// Gravitational fields in detail (Newton's law of gravitation, potential) are Topic 8, and electric
// fields in detail are Topic 14, so this topic only uses field strength, field lines and uniform fields.
// All questions are original. g = 9.81 m s⁻², e = 1.60 × 10⁻¹⁹ C (syllabus data list).

import { aOrAn, deck, fmt, numberCard, pick } from './helpers.js';
import { G, SYL, f4, rad } from './a-physics-tools.js';

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

// The keys below are used in data/syllabus.js (deck: 'a-phys-4-1', ...).
export const aPhysics4Decks = {
  'a-phys-4-1': stores,
  'a-phys-4-2': work,
  'a-phys-4-3': kinetic,
  'a-phys-4-4': fields,
  'a-phys-4-5': potential,
  'a-phys-4-6': power,
};
