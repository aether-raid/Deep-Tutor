// O Level Physics 6091 (Singapore-Cambridge GCE O Level, 2026) — all Physics decks.
// Lives at: src/features/flashcards/data/decks/o-level-physics.js
//
//   I Measurement (topic 1) · II Newtonian Mechanics (2–6) · III Thermal Physics (7–9)
//   IV Waves (10–12) · V Electricity and Magnetism (13–19) · VI Radioactivity (20)
//
// Deck keys match data/syllabus.js, which uses decked('o-phys-<topic>', [...]):
// topic 3's second sub-topic is 'o-phys-3-2'.
// Questions state g = 10 N/kg where it is needed, as O Level papers do.
// Cards with a formula have a "vary" recipe: make(rand) returns a new { question, answer, working },
// and the answer is worked out in code, so it is always right.

import { deck, pick, fmt } from './helpers.js';
import { num, sf3, sup } from './math-tools.js';

// ---------- Small helpers ----------

const G = 10; // N/kg, as given in O Level questions

// 3 significant figures; very big or small values in standard form (2.50 × 10⁻³)
function s3(x) {
  const abs = Math.abs(x);
  if (abs !== 0 && (abs >= 1e5 || abs < 1e-3)) return fmt(x);
  return sf3(x);
}

// An exact value without floating-point noise: 0.30000000000000004 → "0.3"
const exact = x => num(Number(Number(x).toFixed(6)));

// A random whole number from 1 to max, made negative half the time.
function nonZero(rand, max) {
  const n = rand(1, max);
  return rand(0, 1) ? n : -n;
}

// "a" or "an" before a number (an 8 kg mass, an 18 N force)
function aOrAn(n) {
  return /^(8|11(\D|$)|18(\D|$))/.test(String(n)) ? 'an' : 'a';
}

// Each deck in a topic gets the key o-phys-<topic>-<n>, in the same order as syllabus.js.
function topicDecks(topic, list) {
  return Object.fromEntries(list.map((d, i) => [`o-phys-${topic}-${i + 1}`, d]));
}

// #####################################################################
// THEME I — MEASUREMENT
// #####################################################################

// ---------- 1 Physical Quantities, Units and Measurement ----------

const PREFIXES = [['k', 3, 'kilo'], ['M', 6, 'mega'], ['G', 9, 'giga'], ['m', -3, 'milli'], ['μ', -6, 'micro'], ['n', -9, 'nano']];

const p1a = deck('Physical quantities and SI units', [
  {
    id: 'op-1-1-01', difficulty: 'easy',
    question: 'Name the SI base quantities and their units.',
    answer: 'Mass — kilogram (kg)\nLength — metre (m)\nTime — second (s)\nElectric current — ampere (A)\nTemperature — kelvin (K)\nAmount of substance — mole (mol)',
  },
  {
    id: 'op-1-1-02', difficulty: 'medium',
    question: 'Write 4.5 mA in amperes, in standard form.',
    answer: '4.5 × 10⁻³ A',
    working: 'milli (m) = 10⁻³',
    vary: {
      make: rand => {
        const [p, power, name] = pick(rand, PREFIXES);
        const [unitSymbol, unitName] = pick(rand, [['A', 'amperes'], ['m', 'metres'], ['W', 'watts'], ['V', 'volts'], ['g', 'grams'], ['Hz', 'hertz']]);
        const value = rand(11, 99) / 10;
        return {
          question: `Write ${value} ${p}${unitSymbol} in ${unitName}, in standard form.`,
          answer: `${value} × 10${sup(power)} ${unitSymbol}`,
          working: `${name} (${p}) = 10${sup(power)}`,
        };
      },
    },
  },
  {
    id: 'op-1-1-03', difficulty: 'medium',
    question: 'Convert 250 cm² to m².',
    answer: '0.025 m²',
    working: '1 m = 100 cm, so 1 m² = 100 × 100 = 10 000 cm² → 250 ÷ 10 000 = 0.025 m²',
    vary: {
      make: rand => {
        if (rand(0, 1) === 1) {
          const cm2 = 10 * rand(1, 99);
          return {
            question: `Convert ${cm2} cm² to m².`,
            answer: `${exact(cm2 / 10000)} m²`,
            working: `1 m = 100 cm, so 1 m² = 100 × 100 = 10 000 cm² → ${cm2} ÷ 10 000 = ${exact(cm2 / 10000)} m²`,
          };
        }
        const cm3 = 50 * rand(1, 40);
        return {
          question: `Convert ${cm3} cm³ to m³.`,
          answer: `${exact(cm3 / 1e6)} m³`,
          working: `1 m³ = 100 × 100 × 100 = 1 000 000 cm³ → ${cm3} ÷ 1 000 000 = ${exact(cm3 / 1e6)} m³`,
        };
      },
    },
  },
  {
    id: 'op-1-1-04', difficulty: 'medium',
    question: 'Express the newton in SI base units.',
    answer: 'kg m/s² (kg m s⁻²)',
    working: 'F = ma → kg × m/s²',
  },
  {
    id: 'op-1-1-05', difficulty: 'easy',
    question: 'What is the difference between a base quantity and a derived quantity? Give an example of each.',
    answer: 'A base quantity is one of the seven defined quantities that others are built from (e.g. length, mass, time). A derived quantity is formed from base quantities (e.g. speed = length ÷ time, density = mass ÷ volume).',
  },
]);

const p1b = deck('Measurement', [
  {
    id: 'op-1-2-01', difficulty: 'easy',
    question: 'State the smallest division (precision) of a metre rule, vernier calipers and a micrometer screw gauge.',
    answer: 'Metre rule: 0.1 cm (1 mm).\nVernier calipers: 0.01 cm (0.1 mm).\nMicrometer screw gauge: 0.01 mm.',
  },
  {
    id: 'op-1-2-02', difficulty: 'medium',
    question: 'A micrometer reads 5.36 mm, but it has a zero error of +0.02 mm. What is the correct reading?',
    answer: '5.34 mm',
    working: 'Correct reading = reading − zero error = 5.36 − (+0.02) = 5.34 mm',
    vary: {
      make: rand => {
        const tool = pick(rand, [['micrometer', 'mm', 100], ['pair of vernier calipers', 'cm', 100]]);
        const reading = rand(200, 900) / tool[2];
        const z = nonZero(rand, 5) / tool[2];
        return {
          question: `A ${tool[0]} reads ${reading.toFixed(2)} ${tool[1]}, but it has a zero error of ${z > 0 ? '+' : '−'}${Math.abs(z).toFixed(2)} ${tool[1]}. What is the correct reading?`,
          answer: `${(reading - z).toFixed(2)} ${tool[1]}`,
          working: `Correct reading = reading − zero error = ${reading.toFixed(2)} − (${z > 0 ? '+' : '−'}${Math.abs(z).toFixed(2)}) = ${(reading - z).toFixed(2)} ${tool[1]}`,
        };
      },
    },
  },
  {
    id: 'op-1-2-03', difficulty: 'medium',
    question: 'A micrometer shows 7.5 mm on the main scale and 23 divisions on the thimble (each 0.01 mm). What is the reading?',
    answer: '7.73 mm',
    working: '7.5 + 23 × 0.01 = 7.5 + 0.23 = 7.73 mm',
    vary: {
      make: rand => {
        const main = rand(2, 24) / 2;
        const thimble = rand(0, 49);
        const reading = main + thimble / 100;
        return {
          question: `A micrometer shows ${main.toFixed(1)} mm on the main scale and ${thimble} divisions on the thimble (each 0.01 mm). What is the reading?`,
          answer: `${reading.toFixed(2)} mm`,
          working: `${main.toFixed(1)} + ${thimble} × 0.01 = ${main.toFixed(1)} + ${(thimble / 100).toFixed(2)} = ${reading.toFixed(2)} mm`,
        };
      },
    },
  },
  {
    id: 'op-1-2-04', difficulty: 'medium',
    question: 'A pendulum makes 20 complete oscillations in 32.4 s. Find its period. Why time 20 oscillations instead of one?',
    answer: '1.62 s. Timing many oscillations reduces the effect of human reaction time on the result.',
    working: 'Period = 32.4 ÷ 20 = 1.62 s',
    vary: {
      make: rand => {
        const n = pick(rand, [10, 20, 25, 50]);
        const T = rand(80, 250) / 100;
        const t = Number((n * T).toFixed(1));
        return {
          question: `A pendulum makes ${n} complete oscillations in ${t} s. Find its period. Why time ${n} oscillations instead of one?`,
          answer: `${s3(t / n)} s. Timing many oscillations reduces the effect of human reaction time on the result.`,
          working: `Period = ${t} ÷ ${n} = ${s3(t / n)} s`,
        };
      },
    },
  },
  {
    id: 'op-1-2-05', difficulty: 'medium',
    question: 'What is the difference between a random error and a systematic error?',
    answer: 'Random error: readings scatter unpredictably above and below the true value (e.g. reaction time); reduced by repeating and averaging.\nSystematic error: every reading is off by the same amount in the same direction (e.g. zero error); not reduced by averaging — must be corrected.',
  },
  {
    id: 'op-1-2-06', difficulty: 'easy',
    question: 'What is the difference between accuracy and precision?',
    answer: 'Accuracy: how close a measurement is to the true value.\nPrecision: how close repeated measurements are to each other (and the smallest division an instrument can read).',
  },
]);

const p1c = deck('Scalars and vectors', [
  {
    id: 'op-1-3-01', difficulty: 'easy',
    question: 'What is the difference between a scalar and a vector? Give two examples of each.',
    answer: 'A scalar has magnitude only (e.g. mass, distance, speed, energy, time). A vector has magnitude and direction (e.g. force, displacement, velocity, acceleration).',
  },
  {
    id: 'op-1-3-02', difficulty: 'medium',
    question: 'Forces of 6 N east and 8 N north act on an object. Find the magnitude of the resultant force and its angle from east.',
    answer: '10 N at 53.1° north of east',
    working: '√(6² + 8²) = 10 N; tan θ = 8/6 → θ = 53.1°',
    vary: {
      make: rand => {
        const [a, b] = [rand(2, 15), rand(2, 15)];
        const R = Math.hypot(a, b);
        const angle = (Math.atan(b / a) * 180) / Math.PI;
        return {
          question: `Forces of ${a} N east and ${b} N north act on an object. Find the magnitude of the resultant force and its angle from east.`,
          answer: `${s3(R)} N at ${angle.toFixed(1)}° north of east`,
          working: `√(${a}² + ${b}²) = ${s3(R)} N; tan θ = ${b}/${a} → θ = ${angle.toFixed(1)}°`,
        };
      },
    },
  },
  {
    id: 'op-1-3-03', difficulty: 'easy',
    question: 'Forces of 12 N and 5 N act on an object along the same line. Find the resultant when they act in the same direction and when they act in opposite directions.',
    answer: 'Same direction: 17 N. Opposite directions: 7 N (in the direction of the 12 N force).',
    vary: {
      make: rand => {
        const a = rand(6, 30);
        const b = rand(1, a - 1);
        return {
          question: `Forces of ${a} N and ${b} N act on an object along the same line. Find the resultant when they act in the same direction and when they act in opposite directions.`,
          answer: `Same direction: ${a + b} N. Opposite directions: ${a - b} N (in the direction of the ${a} N force).`,
          working: `${a} + ${b} = ${a + b}; ${a} − ${b} = ${a - b}`,
        };
      },
    },
  },
  {
    id: 'op-1-3-04', difficulty: 'medium',
    question: 'How do you find the resultant of two forces at an angle using a scale drawing?',
    answer: 'Draw the forces to scale tip-to-tail (or as two sides of a parallelogram from the same point). The resultant goes from the start of the first to the end of the last (or along the diagonal). Measure its length and convert with the scale, and measure its angle with a protractor.',
  },
]);

// #####################################################################
// THEME II — NEWTONIAN MECHANICS
// #####################################################################

// ---------- 2 Kinematics ----------

const p2a = deck('Speed, velocity and acceleration', [
  {
    id: 'op-2-1-01', difficulty: 'easy',
    question: 'What is the difference between speed and velocity, and between distance and displacement?',
    answer: 'Speed and distance are scalars (magnitude only). Velocity and displacement are vectors: velocity is speed in a stated direction, and displacement is the straight-line distance from the start in a stated direction.',
  },
  {
    id: 'op-2-1-02', difficulty: 'easy',
    question: 'A car speeds up from 5 m/s to 25 m/s in 4 s. Find its acceleration.',
    answer: '5 m/s²',
    working: 'a = (v − u) ÷ t = (25 − 5) ÷ 4 = 5 m/s²',
    vary: {
      make: rand => {
        const u = rand(0, 20);
        const t = rand(2, 10);
        const a = nonZero(rand, 4);
        const v = u + a * t;
        if (v < 0) return { question: `A car speeds up from ${u} m/s to ${u + 3 * t} m/s in ${t} s. Find its acceleration.`, answer: '3 m/s²', working: `a = (v − u) ÷ t = (${u + 3 * t} − ${u}) ÷ ${t} = 3 m/s²` };
        return {
          question: `A car ${a > 0 ? 'speeds up' : 'slows down'} from ${u} m/s to ${v} m/s in ${t} s. Find its acceleration.`,
          answer: `${num(a)} m/s²${a < 0 ? ' (a deceleration of ' + -a + ' m/s²)' : ''}`,
          working: `a = (v − u) ÷ t = (${v} − ${u}) ÷ ${t} = ${num(a)} m/s²`,
        };
      },
    },
  },
  {
    id: 'op-2-1-03', difficulty: 'medium',
    question: 'A runner covers 400 m in 50 s and then 200 m in 40 s. Find the average speed.',
    answer: '6.67 m/s',
    working: 'Total distance ÷ total time = 600 ÷ 90 = 6.67 m/s',
    vary: {
      make: rand => {
        const [d1, t1, d2, t2] = [50 * rand(2, 12), rand(20, 90), 50 * rand(1, 8), rand(10, 80)];
        return {
          question: `A runner covers ${d1} m in ${t1} s and then ${d2} m in ${t2} s. Find the average speed.`,
          answer: `${s3((d1 + d2) / (t1 + t2))} m/s`,
          working: `Total distance ÷ total time = ${d1 + d2} ÷ ${t1 + t2} = ${s3((d1 + d2) / (t1 + t2))} m/s`,
        };
      },
    },
  },
  {
    id: 'op-2-1-04', difficulty: 'medium',
    question: 'A girl walks 30 m east then 40 m west in 50 s. Find her average speed and average velocity.',
    answer: 'Average speed 1.4 m/s; average velocity 0.2 m/s west',
    working: 'Distance = 70 m → 70 ÷ 50 = 1.4 m/s. Displacement = 10 m west → 10 ÷ 50 = 0.2 m/s west',
    vary: {
      make: rand => {
        let a, b;
        do { [a, b] = [10 * rand(1, 9), 10 * rand(1, 9)]; } while (a === b);
        const t = 10 * rand(2, 10);
        const disp = b - a;
        return {
          question: `A girl walks ${a} m east then ${b} m west in ${t} s. Find her average speed and average velocity.`,
          answer: `Average speed ${s3((a + b) / t)} m/s; average velocity ${s3(Math.abs(disp) / t)} m/s ${disp > 0 ? 'west' : 'east'}`,
          working: `Distance = ${a + b} m → ${a + b} ÷ ${t} = ${s3((a + b) / t)} m/s. Displacement = ${Math.abs(disp)} m ${disp > 0 ? 'west' : 'east'} → ${Math.abs(disp)} ÷ ${t} = ${s3(Math.abs(disp) / t)} m/s`,
        };
      },
    },
  },
]);

const p2b = deck('Graphical analysis of motion', [
  {
    id: 'op-2-2-01', difficulty: 'easy',
    question: 'What does the gradient of a distance–time graph show? What do the gradient and the area of a speed–time graph show?',
    answer: 'Distance–time gradient: speed.\nSpeed–time gradient: acceleration. Area under a speed–time graph: distance travelled.',
  },
  {
    id: 'op-2-2-02', difficulty: 'medium',
    question: 'A car accelerates uniformly from 4 m/s to 16 m/s in 6 s. Use the speed–time graph to find the distance travelled.',
    answer: '60 m',
    working: 'Area of trapezium = ½ × (4 + 16) × 6 = 60 m',
    vary: {
      make: rand => {
        const [u, v, t] = [rand(0, 10), rand(11, 30), rand(2, 12)];
        return {
          question: `A car accelerates uniformly from ${u} m/s to ${v} m/s in ${t} s. Use the speed–time graph to find the distance travelled.`,
          answer: `${exact(((u + v) * t) / 2)} m`,
          working: `Area of ${u === 0 ? 'triangle = ½' : 'trapezium = ½'} × (${u} + ${v}) × ${t} = ${exact(((u + v) * t) / 2)} m`,
        };
      },
    },
  },
  {
    id: 'op-2-2-03', difficulty: 'hard',
    question: 'A train starts from rest, accelerates uniformly to 20 m/s in 10 s, then travels at 20 m/s for 30 s. Find the total distance travelled.',
    answer: '700 m',
    working: 'Triangle ½ × 10 × 20 = 100 m, plus rectangle 30 × 20 = 600 m → 700 m',
    vary: {
      make: rand => {
        const [v, t1, t2] = [rand(5, 30), rand(2, 20), rand(5, 60)];
        const total = 0.5 * t1 * v + t2 * v;
        return {
          question: `A train starts from rest, accelerates uniformly to ${v} m/s in ${t1} s, then travels at ${v} m/s for ${t2} s. Find the total distance travelled.`,
          answer: `${exact(total)} m`,
          working: `Triangle ½ × ${t1} × ${v} = ${exact(0.5 * t1 * v)} m, plus rectangle ${t2} × ${v} = ${t2 * v} m → ${exact(total)} m`,
        };
      },
    },
  },
  {
    id: 'op-2-2-04', difficulty: 'medium',
    question: 'Describe the motion shown by: a horizontal line on a distance–time graph; a horizontal line on a speed–time graph; a straight line sloping upwards on a speed–time graph.',
    answer: 'Distance–time horizontal: at rest.\nSpeed–time horizontal: constant speed.\nSpeed–time straight line sloping up: constant (uniform) acceleration.',
  },
  {
    id: 'op-2-2-05', difficulty: 'medium',
    question: 'On a speed–time graph, the line goes from 18 m/s down to 0 in 6 s. Find the deceleration and the stopping distance.',
    answer: 'Deceleration 3 m/s²; stopping distance 54 m',
    working: 'Gradient = (0 − 18) ÷ 6 = −3 m/s². Area = ½ × 6 × 18 = 54 m',
    vary: {
      make: rand => {
        const [v, t] = [rand(6, 30), rand(2, 10)];
        return {
          question: `On a speed–time graph, the line goes from ${v} m/s down to 0 in ${t} s. Find the deceleration and the stopping distance.`,
          answer: `Deceleration ${s3(v / t)} m/s²; stopping distance ${exact((v * t) / 2)} m`,
          working: `Gradient = (0 − ${v}) ÷ ${t} = −${s3(v / t)} m/s². Area = ½ × ${t} × ${v} = ${exact((v * t) / 2)} m`,
        };
      },
    },
  },
]);

const p2c = deck('Free-fall', [
  {
    id: 'op-2-3-01', difficulty: 'easy',
    question: 'What is the acceleration of free fall near the Earth\'s surface, and does it depend on mass?',
    answer: 'About 10 m/s². Without air resistance, all objects fall with the same acceleration, whatever their mass.',
  },
  {
    id: 'op-2-3-02', difficulty: 'easy',
    question: 'A stone is dropped from rest. Ignoring air resistance, what is its speed after 3 s? (g = 10 m/s²)',
    answer: '30 m/s',
    working: 'v = u + gt = 0 + 10 × 3 = 30 m/s',
    vary: {
      make: rand => {
        const t = rand(1, 8) / (rand(0, 1) ? 1 : 2);
        return {
          question: `A stone is dropped from rest. Ignoring air resistance, what is its speed after ${t} s? (g = 10 m/s²)`,
          answer: `${exact(G * t)} m/s`,
          working: `v = u + gt = 0 + 10 × ${t} = ${exact(G * t)} m/s`,
        };
      },
    },
  },
  {
    id: 'op-2-3-03', difficulty: 'medium',
    question: 'A ball is dropped from rest and falls freely for 2 s. Use the area under the speed–time graph to find how far it falls. (g = 10 m/s²)',
    answer: '20 m',
    working: 'Speed after 2 s = 20 m/s. Area = ½ × 2 × 20 = 20 m',
    vary: {
      make: rand => {
        const t = rand(1, 6);
        return {
          question: `A ball is dropped from rest and falls freely for ${t} s. Use the area under the speed–time graph to find how far it falls. (g = 10 m/s²)`,
          answer: `${0.5 * G * t * t} m`,
          working: `Speed after ${t} s = ${G * t} m/s. Area = ½ × ${t} × ${G * t} = ${0.5 * G * t * t} m`,
        };
      },
    },
  },
  {
    id: 'op-2-3-04', difficulty: 'hard',
    question: 'Explain why a skydiver reaches a terminal velocity.',
    answer: 'At first, weight is much bigger than air resistance, so the skydiver accelerates. As speed increases, air resistance increases, so the resultant force and acceleration decrease. When air resistance equals weight, the resultant force is zero and the skydiver falls at a constant (terminal) velocity.',
  },
]);

// ---------- 3 Dynamics ----------

const p3a = deck('Types of forces', [
  {
    id: 'op-3-1-01', difficulty: 'easy',
    question: 'Name four types of force and say whether each is a contact or non-contact force.',
    answer: 'Contact: friction, normal (reaction) force, tension, air resistance, upthrust.\nNon-contact: weight (gravitational), magnetic, electrostatic.',
  },
  {
    id: 'op-3-1-02', difficulty: 'medium',
    question: 'What is a free-body diagram?',
    answer: 'A diagram of one object showing every force acting ON it as an arrow from the object, labelled with its type and size, with the arrow length showing the size.',
  },
  {
    id: 'op-3-1-03', difficulty: 'easy',
    question: 'A box is pulled with a force of 40 N to the right while friction of 15 N acts to the left. Find the resultant force.',
    answer: '25 N to the right',
    working: '40 − 15 = 25 N, in the direction of the larger force',
    vary: {
      make: rand => {
        const pull = rand(10, 80);
        const friction = rand(1, pull - 1);
        return {
          question: `A box is pulled with a force of ${pull} N to the right while friction of ${friction} N acts to the left. Find the resultant force.`,
          answer: `${pull - friction} N to the right`,
          working: `${pull} − ${friction} = ${pull - friction} N, in the direction of the larger force`,
        };
      },
    },
  },
  {
    id: 'op-3-1-04', difficulty: 'medium',
    question: 'A book rests on a table. Name the two forces acting on the book and explain why it does not move.',
    answer: 'Its weight (downwards) and the normal (reaction) force from the table (upwards). They are equal in size and opposite in direction, so the resultant force is zero.',
  },
]);

const p3b = deck('Mass, weight and gravitational field', [
  {
    id: 'op-3-2-01', difficulty: 'easy',
    question: 'What is the difference between mass and weight?',
    answer: 'Mass is the amount of matter in an object, measured in kg; it is the same everywhere. Weight is the gravitational force on the object, measured in N; it depends on the gravitational field strength (W = mg).',
  },
  {
    id: 'op-3-2-02', difficulty: 'easy',
    question: 'An astronaut has a mass of 70 kg. Find the weight on Earth (g = 10 N/kg) and on the Moon (g = 1.6 N/kg).',
    answer: 'Earth: 700 N. Moon: 112 N.',
    working: 'W = mg: 70 × 10 = 700 N; 70 × 1.6 = 112 N. The mass stays 70 kg',
    vary: {
      make: rand => {
        const m = rand(40, 120);
        const place = pick(rand, [['the Moon', 1.6], ['Mars', 3.7], ['Jupiter', 25]]);
        return {
          question: `An astronaut has a mass of ${m} kg. Find the weight on Earth (g = 10 N/kg) and on ${place[0]} (g = ${place[1]} N/kg).`,
          answer: `Earth: ${m * G} N. ${place[0][0].toUpperCase() + place[0].slice(1)}: ${exact(m * place[1])} N.`,
          working: `W = mg: ${m} × 10 = ${m * G} N; ${m} × ${place[1]} = ${exact(m * place[1])} N. The mass stays ${m} kg`,
        };
      },
    },
  },
  {
    id: 'op-3-2-03', difficulty: 'medium',
    question: 'What is a gravitational field, and what is gravitational field strength?',
    answer: 'A gravitational field is a region where a mass experiences a force. Gravitational field strength is the gravitational force per unit mass (g = W/m), measured in N/kg.',
  },
  {
    id: 'op-3-2-04', difficulty: 'medium',
    question: 'What is inertia?',
    answer: 'The tendency of an object to resist a change in its state of rest or motion. The greater the mass, the greater the inertia.',
  },
  {
    id: 'op-3-2-05', difficulty: 'easy',
    question: 'A parcel weighs 45 N on Earth (g = 10 N/kg). Find its mass.',
    answer: '4.5 kg',
    working: 'm = W ÷ g = 45 ÷ 10 = 4.5 kg',
    vary: {
      make: rand => {
        const W = rand(5, 900);
        return {
          question: `A parcel weighs ${W} N on Earth (g = 10 N/kg). Find its mass.`,
          answer: `${exact(W / G)} kg`,
          working: `m = W ÷ g = ${W} ÷ 10 = ${exact(W / G)} kg`,
        };
      },
    },
  },
]);

const p3c = deck("Newton's laws of motion", [
  {
    id: 'op-3-3-01', difficulty: 'easy',
    question: "State Newton's three laws of motion.",
    answer: '1st: an object stays at rest or moves at constant velocity unless a resultant force acts on it.\n2nd: the resultant force equals mass × acceleration (F = ma).\n3rd: if A exerts a force on B, B exerts an equal and opposite force on A (of the same type).',
  },
  {
    id: 'op-3-3-02', difficulty: 'easy',
    question: 'A resultant force of 12 N acts on a 3 kg trolley. Find its acceleration.',
    answer: '4 m/s²',
    working: 'a = F ÷ m = 12 ÷ 3 = 4 m/s²',
    vary: {
      make: rand => {
        const kind = pick(rand, ['a', 'F', 'm']);
        const m = rand(1, 20);
        const a = rand(1, 10);
        const F = m * a;
        if (kind === 'a') return { question: `A resultant force of ${F} N acts on ${aOrAn(m)} ${m} kg trolley. Find its acceleration.`, answer: `${a} m/s²`, working: `a = F ÷ m = ${F} ÷ ${m} = ${a} m/s²` };
        if (kind === 'F') return { question: `${aOrAn(m) === 'an' ? 'An' : 'A'} ${m} kg trolley accelerates at ${a} m/s². Find the resultant force on it.`, answer: `${F} N`, working: `F = ma = ${m} × ${a} = ${F} N` };
        return { question: `A resultant force of ${F} N gives a trolley an acceleration of ${a} m/s². Find its mass.`, answer: `${m} kg`, working: `m = F ÷ a = ${F} ÷ ${a} = ${m} kg` };
      },
    },
  },
  {
    id: 'op-3-3-03', difficulty: 'hard',
    question: 'A 1200 kg car has a driving force of 3000 N and total resistive forces of 600 N. Find its acceleration.',
    answer: '2 m/s²',
    working: 'Resultant = 3000 − 600 = 2400 N → a = 2400 ÷ 1200 = 2 m/s²',
    vary: {
      make: rand => {
        const m = 100 * rand(5, 20);
        const a = rand(1, 4) / (rand(0, 1) ? 1 : 2);
        const resist = 100 * rand(1, 10);
        const drive = m * a + resist;
        return {
          question: `${aOrAn(m) === 'an' ? 'An' : 'A'} ${m} kg car has a driving force of ${drive} N and total resistive forces of ${resist} N. Find its acceleration.`,
          answer: `${exact(a)} m/s²`,
          working: `Resultant = ${drive} − ${resist} = ${drive - resist} N → a = ${drive - resist} ÷ ${m} = ${exact(a)} m/s²`,
        };
      },
    },
  },
  {
    id: 'op-3-3-04', difficulty: 'medium',
    question: 'A book rests on a table. Its weight is the Earth pulling the book down. What is the Newton\'s third law pair of this force?',
    answer: 'The book pulling the Earth upwards with an equal gravitational force. (The table\'s normal force is NOT the pair — it acts on the same object and is a different type of force.)',
  },
  {
    id: 'op-3-3-05', difficulty: 'medium',
    question: 'A rocket in deep space switches off its engines. Describe its motion and explain.',
    answer: 'It keeps moving in a straight line at constant speed. There is no resultant force, so by Newton\'s first law its velocity does not change.',
  },
]);

const p3d = deck('Effects of resistive forces on motion', [
  {
    id: 'op-3-4-01', difficulty: 'easy',
    question: 'Give two useful and two unwanted effects of friction.',
    answer: 'Useful: lets us walk without slipping; brakes stop vehicles; lets tyres grip the road.\nUnwanted: causes wear on moving parts; wastes energy as heat; slows vehicles, so more fuel is needed.',
  },
  {
    id: 'op-3-4-02', difficulty: 'medium',
    question: 'How does air resistance change as an object moves faster, and what effect does this have?',
    answer: 'Air resistance increases with speed. So the resultant force on an accelerating object decreases, and its acceleration decreases, until the forces balance at terminal velocity.',
  },
  {
    id: 'op-3-4-03', difficulty: 'medium',
    question: 'A car travels at constant speed on a level road. The driving force is 2500 N. What is the total resistive force? Explain.',
    answer: '2500 N. At constant speed the acceleration is zero, so the resultant force is zero: the resistive forces balance the driving force.',
    vary: {
      make: rand => {
        const F = 100 * rand(5, 60);
        return {
          question: `A car travels at constant speed on a level road. The driving force is ${F} N. What is the total resistive force? Explain.`,
          answer: `${F} N. At constant speed the acceleration is zero, so the resultant force is zero: the resistive forces balance the driving force.`,
          working: '',
        };
      },
    },
  },
  {
    id: 'op-3-4-04', difficulty: 'medium',
    question: 'Why do cyclists crouch low and wear smooth clothing in races?',
    answer: 'To reduce their frontal area and make their shape more streamlined, which reduces air resistance, so they can go faster for the same effort.',
  },
]);

// ---------- 4 Turning Effects of Forces ----------

const p4a = deck('Moments', [
  {
    id: 'op-4-1-01', difficulty: 'easy',
    question: 'Define the moment of a force and give its unit.',
    answer: 'Moment = force × perpendicular distance from the pivot to the line of action of the force. Unit: newton metre (N m).',
  },
  {
    id: 'op-4-1-02', difficulty: 'easy',
    question: 'A force of 30 N is applied at right angles to a spanner, 0.25 m from the bolt. Find the moment.',
    answer: '7.5 N m',
    working: 'Moment = F × d = 30 × 0.25 = 7.5 N m',
    vary: {
      make: rand => {
        const F = rand(5, 200);
        const d = rand(5, 80) / 100;
        return {
          question: `A force of ${F} N is applied at right angles to a spanner, ${d} m from the bolt. Find the moment.`,
          answer: `${exact(F * d)} N m`,
          working: `Moment = F × d = ${F} × ${d} = ${exact(F * d)} N m`,
        };
      },
    },
  },
  {
    id: 'op-4-1-03', difficulty: 'medium',
    question: 'Why is it easier to open a door by pushing near the handle than near the hinge?',
    answer: 'The handle is further from the pivot (hinge), so the same force gives a larger moment (moment = force × distance). A smaller force is needed for the same turning effect.',
  },
  {
    id: 'op-4-1-04', difficulty: 'medium',
    question: 'A moment of 12 N m is needed to loosen a nut. What force is needed with a 0.4 m spanner?',
    answer: '30 N',
    working: 'F = moment ÷ d = 12 ÷ 0.4 = 30 N',
    vary: {
      make: rand => {
        const d = pick(rand, [0.2, 0.25, 0.3, 0.4, 0.5, 0.6]);
        const F = rand(10, 120);
        const M = Number((F * d).toFixed(2));
        return {
          question: `A moment of ${M} N m is needed to loosen a nut. What force is needed with a ${d} m spanner?`,
          answer: `${s3(M / d)} N`,
          working: `F = moment ÷ d = ${M} ÷ ${d} = ${s3(M / d)} N`,
        };
      },
    },
  },
]);

const p4b = deck('Equilibrium', [
  {
    id: 'op-4-2-01', difficulty: 'easy',
    question: 'State the principle of moments.',
    answer: 'For an object in equilibrium, the sum of clockwise moments about any point equals the sum of anticlockwise moments about the same point.',
  },
  {
    id: 'op-4-2-02', difficulty: 'easy',
    question: 'What two conditions must be met for an object to be in equilibrium?',
    answer: 'The resultant force is zero, and the resultant moment about any point is zero (clockwise moments = anticlockwise moments).',
  },
  {
    id: 'op-4-2-03', difficulty: 'medium',
    question: 'A 400 N child sits 1.5 m from the pivot of a see-saw. How far from the pivot on the other side must a 600 N child sit to balance it?',
    answer: '1 m',
    working: 'Clockwise = anticlockwise: 400 × 1.5 = 600 × d → d = 600 ÷ 600 = 1 m',
    vary: {
      make: rand => {
        const [w1, w2] = [50 * rand(4, 14), 50 * rand(4, 14)];
        const d1 = rand(4, 30) / 10;
        const d2 = (w1 * d1) / w2;
        return {
          question: `A ${w1} N child sits ${d1} m from the pivot of a see-saw. How far from the pivot on the other side must a ${w2} N child sit to balance it?`,
          answer: `${s3(d2)} m`,
          working: `Clockwise = anticlockwise: ${w1} × ${d1} = ${w2} × d → d = ${exact(w1 * d1)} ÷ ${w2} = ${s3(d2)} m`,
        };
      },
    },
  },
  {
    id: 'op-4-2-04', difficulty: 'hard',
    question: 'A uniform 2 m plank weighing 100 N is pivoted at one end and held horizontal by an upward force at the other end. Find that force.',
    answer: '50 N',
    working: 'The weight acts at the centre (1 m from the pivot): F × 2 = 100 × 1 → F = 50 N',
    vary: {
      make: rand => {
        const L = pick(rand, [1, 2, 3, 4, 5]);
        const W = 20 * rand(2, 20);
        return {
          question: `A uniform ${L} m plank weighing ${W} N is pivoted at one end and held horizontal by an upward force at the other end. Find that force.`,
          answer: `${exact(W / 2)} N`,
          working: `The weight acts at the centre (${exact(L / 2)} m from the pivot): F × ${L} = ${W} × ${exact(L / 2)} → F = ${exact(W / 2)} N`,
        };
      },
    },
  },
]);

const p4c = deck('Centre of gravity and stability', [
  {
    id: 'op-4-3-01', difficulty: 'easy',
    question: 'What is the centre of gravity of an object?',
    answer: 'The point through which the whole weight of the object appears to act.',
  },
  {
    id: 'op-4-3-02', difficulty: 'medium',
    question: 'How can you find the centre of gravity of a flat, irregular card?',
    answer: 'Hang the card from a pin so it swings freely, hang a plumb line from the same pin and draw along it. Repeat from another point. The centre of gravity is where the lines cross.',
  },
  {
    id: 'op-4-3-03', difficulty: 'medium',
    question: 'Give two ways to make an object more stable.',
    answer: 'Lower its centre of gravity (e.g. put heavy parts at the bottom) and widen its base.',
  },
  {
    id: 'op-4-3-04', difficulty: 'hard',
    question: 'When does a tilted object topple over?',
    answer: 'When the vertical line through its centre of gravity falls outside its base. The weight then gives a moment that turns the object further over instead of back.',
  },
]);

// ---------- 5 Pressure ----------

const p5a = deck('Pressure', [
  {
    id: 'op-5-1-01', difficulty: 'easy',
    question: 'Define pressure and give its unit.',
    answer: 'Pressure = force ÷ area (p = F/A), the force acting per unit area. Unit: pascal (Pa), where 1 Pa = 1 N/m².',
  },
  {
    id: 'op-5-1-02', difficulty: 'medium',
    question: 'A box of weight 600 N rests on a base of area 0.2 m². Find the pressure on the floor.',
    answer: '3,000 Pa',
    working: 'p = F ÷ A = 600 ÷ 0.2 = 3,000 Pa',
    vary: {
      make: rand => {
        const F = 50 * rand(1, 40);
        const A = pick(rand, [0.02, 0.05, 0.1, 0.2, 0.25, 0.4, 0.5, 1.5, 2]);
        return {
          question: `A box of weight ${F} N rests on a base of area ${A} m². Find the pressure on the floor.`,
          answer: `${s3(F / A)} Pa`,
          working: `p = F ÷ A = ${F} ÷ ${A} = ${s3(F / A)} Pa`,
        };
      },
    },
  },
  {
    id: 'op-5-1-03', difficulty: 'hard',
    question: 'A 60 N force acts on an area of 15 cm². Find the pressure in Pa.',
    answer: '40,000 Pa',
    working: '15 cm² = 15 ÷ 10 000 = 0.0015 m² → p = 60 ÷ 0.0015 = 40,000 Pa',
    vary: {
      make: rand => {
        const F = rand(5, 120);
        const cm2 = pick(rand, [2, 4, 5, 8, 10, 15, 20, 25, 50]);
        const p = F / (cm2 / 10000);
        return {
          question: `${aOrAn(F) === 'an' ? 'An' : 'A'} ${F} N force acts on an area of ${cm2} cm². Find the pressure in Pa.`,
          answer: `${s3(p)} Pa`,
          working: `${cm2} cm² = ${cm2} ÷ 10 000 = ${exact(cm2 / 10000)} m² → p = ${F} ÷ ${exact(cm2 / 10000)} = ${s3(p)} Pa`,
        };
      },
    },
  },
  {
    id: 'op-5-1-04', difficulty: 'easy',
    question: 'Why does a sharp knife cut better than a blunt one, and why do tractors have wide tyres?',
    answer: 'A sharp knife has a tiny area, so the same force gives a large pressure. Wide tyres spread the weight over a large area, giving a low pressure so the tractor does not sink into soft ground.',
  },
]);

const p5b = deck('Density and fluid pressure', [
  {
    id: 'op-5-2-01', difficulty: 'easy',
    question: 'A block has mass 540 g and volume 200 cm³. Find its density.',
    answer: '2.7 g/cm³',
    working: 'ρ = m ÷ V = 540 ÷ 200 = 2.7 g/cm³',
    vary: {
      make: rand => {
        const V = 10 * rand(2, 50);
        const rho = pick(rand, [0.8, 1, 1.2, 2.7, 7.9, 8.9, 11.3, 19.3]);
        const m = Number((rho * V).toFixed(1));
        return {
          question: `A block has mass ${m} g and volume ${V} cm³. Find its density.`,
          answer: `${s3(m / V)} g/cm³`,
          working: `ρ = m ÷ V = ${m} ÷ ${V} = ${s3(m / V)} g/cm³`,
        };
      },
    },
  },
  {
    id: 'op-5-2-02', difficulty: 'medium',
    question: 'Find the pressure due to water at a depth of 5 m. (Density of water = 1000 kg/m³, g = 10 N/kg)',
    answer: '50,000 Pa',
    working: 'p = hρg = 5 × 1000 × 10 = 50,000 Pa',
    vary: {
      make: rand => {
        const [liquid, rho] = pick(rand, [['water', 1000], ['sea water', 1030], ['oil', 800], ['mercury', 13600]]);
        const h = rand(1, 40) / (liquid === 'mercury' ? 10 : 1);
        return {
          question: `Find the pressure due to ${liquid} at a depth of ${h} m. (Density of ${liquid} = ${rho} kg/m³, g = 10 N/kg)`,
          answer: `${s3(h * rho * G)} Pa`,
          working: `p = hρg = ${h} × ${rho} × 10 = ${s3(h * rho * G)} Pa`,
        };
      },
    },
  },
  {
    id: 'op-5-2-03', difficulty: 'medium',
    question: 'Why is a dam built thicker at the bottom than at the top?',
    answer: 'Liquid pressure increases with depth (p = hρg), so the water pushes hardest at the bottom.',
  },
  {
    id: 'op-5-2-04', difficulty: 'hard',
    question: 'In a hydraulic jack, a 50 N force acts on a piston of area 0.01 m². The large piston has area 0.5 m². What force does it exert?',
    answer: '2500 N',
    working: 'Pressure is transmitted equally: p = 50 ÷ 0.01 = 5000 Pa → F = 5000 × 0.5 = 2500 N',
    vary: {
      make: rand => {
        const F1 = rand(10, 200);
        const A1 = pick(rand, [0.002, 0.005, 0.01, 0.02]);
        const A2 = pick(rand, [0.1, 0.2, 0.25, 0.4, 0.5, 1]);
        const p = F1 / A1;
        return {
          question: `In a hydraulic jack, ${aOrAn(F1)} ${F1} N force acts on a piston of area ${A1} m². The large piston has area ${A2} m². What force does it exert?`,
          answer: `${s3(p * A2)} N`,
          working: `Pressure is transmitted equally: p = ${F1} ÷ ${A1} = ${s3(p)} Pa → F = ${s3(p)} × ${A2} = ${s3(p * A2)} N`,
        };
      },
    },
  },
  {
    id: 'op-5-2-05', difficulty: 'medium',
    question: 'How does a mercury barometer show atmospheric pressure?',
    answer: 'The atmosphere pushes on the mercury in the dish and holds up a column of mercury in the tube. Atmospheric pressure equals the pressure of that column (hρg) — about 760 mm of mercury at sea level.',
  },
]);

// ---------- 6 Energy ----------

const p6a = deck('Energy stores and transfers', [
  {
    id: 'op-6-1-01', difficulty: 'easy',
    question: 'Name four energy stores.',
    answer: 'Any four: kinetic, gravitational potential, elastic potential, chemical potential, thermal (internal), nuclear, electrostatic, magnetic.',
  },
  {
    id: 'op-6-1-02', difficulty: 'easy',
    question: 'State the principle of conservation of energy.',
    answer: 'Energy cannot be created or destroyed; it can only be transferred from one store to another. The total energy of a closed system stays the same.',
  },
  {
    id: 'op-6-1-03', difficulty: 'easy',
    question: 'Find the kinetic energy of a 2 kg ball moving at 6 m/s.',
    answer: '36 J',
    working: 'Eₖ = ½mv² = ½ × 2 × 6² = 36 J',
    vary: {
      make: rand => {
        const m = rand(1, 80) / (rand(0, 1) ? 1 : 10);
        const v = rand(1, 30);
        return {
          question: `Find the kinetic energy of ${aOrAn(m)} ${m} kg ball moving at ${v} m/s.`,
          answer: `${s3(0.5 * m * v * v)} J`,
          working: `Eₖ = ½mv² = ½ × ${m} × ${v}² = ${s3(0.5 * m * v * v)} J`,
        };
      },
    },
  },
  {
    id: 'op-6-1-04', difficulty: 'easy',
    question: 'A 5 kg box is lifted 3 m. Find its gain in gravitational potential energy. (g = 10 N/kg)',
    answer: '150 J',
    working: 'Eₚ = mgh = 5 × 10 × 3 = 150 J',
    vary: {
      make: rand => {
        const m = rand(1, 60);
        const h = rand(1, 40) / (rand(0, 1) ? 1 : 2);
        return {
          question: `${aOrAn(m) === 'an' ? 'An' : 'A'} ${m} kg box is lifted ${h} m. Find its gain in gravitational potential energy. (g = 10 N/kg)`,
          answer: `${exact(m * G * h)} J`,
          working: `Eₚ = mgh = ${m} × 10 × ${h} = ${exact(m * G * h)} J`,
        };
      },
    },
  },
  {
    id: 'op-6-1-05', difficulty: 'hard',
    question: 'A ball is dropped from a height of 5 m. Ignoring air resistance, find its speed just before it hits the ground. (g = 10 N/kg)',
    answer: '10 m/s',
    working: 'Eₚ lost = Eₖ gained: mgh = ½mv² → v = √(2gh) = √(2 × 10 × 5) = 10 m/s',
    vary: {
      make: rand => {
        const h = rand(1, 50);
        const v = Math.sqrt(2 * G * h);
        return {
          question: `A ball is dropped from a height of ${h} m. Ignoring air resistance, find its speed just before it hits the ground. (g = 10 N/kg)`,
          answer: `${s3(v)} m/s`,
          working: `Eₚ lost = Eₖ gained: mgh = ½mv² → v = √(2gh) = √(2 × 10 × ${h}) = ${s3(v)} m/s`,
        };
      },
    },
  },
  {
    id: 'op-6-1-06', difficulty: 'medium',
    question: 'Describe the energy transfers when a ball is thrown upwards and comes back down.',
    answer: 'Going up: kinetic energy → gravitational potential energy. At the top, Eₖ is smallest (zero if thrown straight up) and Eₚ is largest. Coming down: gravitational potential → kinetic. Some energy is transferred to thermal energy by air resistance.',
  },
]);

const p6b = deck('Work, power and efficiency', [
  {
    id: 'op-6-2-01', difficulty: 'easy',
    question: 'A force of 50 N pushes a box 4 m along the floor in the direction of the force. Find the work done.',
    answer: '200 J',
    working: 'W = F × d = 50 × 4 = 200 J',
    vary: {
      make: rand => {
        const F = rand(5, 300);
        const d = rand(1, 50) / (rand(0, 1) ? 1 : 2);
        return {
          question: `A force of ${F} N pushes a box ${d} m along the floor in the direction of the force. Find the work done.`,
          answer: `${exact(F * d)} J`,
          working: `W = F × d = ${F} × ${d} = ${exact(F * d)} J`,
        };
      },
    },
  },
  {
    id: 'op-6-2-02', difficulty: 'easy',
    question: 'A motor does 6000 J of work in 20 s. Find its power.',
    answer: '300 W',
    working: 'P = W ÷ t = 6000 ÷ 20 = 300 W',
    vary: {
      make: rand => {
        const P = 10 * rand(1, 200);
        const t = rand(2, 60);
        return {
          question: `A motor does ${P * t} J of work in ${t} s. Find its power.`,
          answer: `${P} W`,
          working: `P = W ÷ t = ${P * t} ÷ ${t} = ${P} W`,
        };
      },
    },
  },
  {
    id: 'op-6-2-03', difficulty: 'medium',
    question: 'A lamp uses 60 J of electrical energy every second and gives out 12 J of light. Find its efficiency.',
    answer: '20%',
    working: 'Efficiency = useful output ÷ total input × 100% = 12 ÷ 60 × 100% = 20%',
    vary: {
      make: rand => {
        const input = 10 * rand(2, 50);
        const eff = 5 * rand(2, 19);
        const useful = (input * eff) / 100;
        return {
          question: `A machine is supplied with ${input} J of energy and gives ${exact(useful)} J of useful output. Find its efficiency.`,
          answer: `${eff}%`,
          working: `Efficiency = useful output ÷ total input × 100% = ${exact(useful)} ÷ ${input} × 100% = ${eff}%`,
        };
      },
    },
  },
  {
    id: 'op-6-2-04', difficulty: 'hard',
    question: 'A 60 kg student runs up stairs 4 m high in 8 s. Find her useful power. (g = 10 N/kg)',
    answer: '300 W',
    working: 'Work against gravity = mgh = 60 × 10 × 4 = 2400 J → P = 2400 ÷ 8 = 300 W',
    vary: {
      make: rand => {
        const m = rand(40, 90);
        const h = rand(2, 12);
        const t = rand(3, 20);
        const W = m * G * h;
        return {
          question: `${aOrAn(m) === 'an' ? 'An' : 'A'} ${m} kg student runs up stairs ${h} m high in ${t} s. Find her useful power. (g = 10 N/kg)`,
          answer: `${s3(W / t)} W`,
          working: `Work against gravity = mgh = ${m} × 10 × ${h} = ${W} J → P = ${W} ÷ ${t} = ${s3(W / t)} W`,
        };
      },
    },
  },
  {
    id: 'op-6-2-05', difficulty: 'easy',
    question: 'Define work done and power.',
    answer: 'Work done = force × distance moved in the direction of the force (unit: joule).\nPower = work done (or energy transferred) per unit time (unit: watt, 1 W = 1 J/s).',
  },
]);

const p6c = deck('Energy resources', [
  {
    id: 'op-6-3-01', difficulty: 'easy',
    question: 'What is the difference between renewable and non-renewable energy resources? Give two examples of each.',
    answer: 'Renewable resources are replaced naturally and will not run out (solar, wind, hydroelectric, tidal, geothermal, biomass). Non-renewable resources will run out (coal, oil, natural gas, nuclear fuel).',
  },
  {
    id: 'op-6-3-02', difficulty: 'medium',
    question: 'Give one advantage and one disadvantage of solar power and of wind power.',
    answer: 'Solar: renewable, no pollution when running; but needs sunlight (not at night) and panels take up space.\nWind: renewable, no fuel cost; but depends on the wind, can be noisy and spoil the view.',
  },
  {
    id: 'op-6-3-03', difficulty: 'medium',
    question: 'Give one advantage and one disadvantage of using fossil fuels to generate electricity.',
    answer: 'Advantage: reliable, can produce a lot of power on demand, well-developed technology.\nDisadvantage: non-renewable; burning them releases carbon dioxide (global warming) and pollutants.',
  },
  {
    id: 'op-6-3-04', difficulty: 'medium',
    question: 'Give one advantage and one disadvantage of nuclear power.',
    answer: 'Advantage: no carbon dioxide produced while generating; a small mass of fuel releases huge amounts of energy.\nDisadvantage: radioactive waste that stays dangerous for a very long time; risk of serious accidents; expensive to build and decommission.',
  },
  {
    id: 'op-6-3-05', difficulty: 'medium',
    question: 'Describe the energy transfers in a hydroelectric power station.',
    answer: 'Water stored high up has gravitational potential energy → it flows down and gains kinetic energy → it turns turbines (kinetic) → generators produce electrical energy.',
  },
]);

// #####################################################################
// THEME III — THERMAL PHYSICS
// #####################################################################

// ---------- 7 Kinetic Particle Model of Matter ----------

const p7a = deck('States of matter', [
  {
    id: 'op-7-1-01', difficulty: 'easy',
    question: 'Describe the arrangement and motion of particles in a solid, a liquid and a gas.',
    answer: 'Solid: closely packed in a regular pattern; vibrate about fixed positions.\nLiquid: closely packed but irregular; move around and slide past each other.\nGas: far apart and random; move quickly in all directions.',
  },
  {
    id: 'op-7-1-02', difficulty: 'medium',
    question: 'Why can a gas be compressed easily but a liquid cannot?',
    answer: 'Gas particles are far apart with lots of empty space between them, so they can be pushed closer together. Liquid particles are already close together, so there is almost no space to compress.',
  },
  {
    id: 'op-7-1-03', difficulty: 'easy',
    question: 'Which states of matter have a fixed shape, and which have a fixed volume?',
    answer: 'Fixed shape: solid only.\nFixed volume: solid and liquid. A gas fills its whole container.',
  },
  {
    id: 'op-7-1-04', difficulty: 'medium',
    question: 'Why do liquids and gases flow but solids do not?',
    answer: 'In liquids and gases, the particles can move past one another. In a solid, strong forces hold the particles in fixed positions, so they can only vibrate.',
  },
]);

const p7b = deck('Kinetic particle model', [
  {
    id: 'op-7-2-01', difficulty: 'medium',
    question: 'Use the kinetic particle model to explain how a gas exerts pressure.',
    answer: 'Gas particles move randomly and collide with the walls of the container. Each collision exerts a force on the wall; the total force per unit area is the gas pressure.',
  },
  {
    id: 'op-7-2-02', difficulty: 'medium',
    question: 'Explain why the pressure of a gas in a sealed, rigid container increases when it is heated.',
    answer: 'The particles gain kinetic energy and move faster, so they hit the walls more often and with more force each time. The force per unit area — the pressure — increases.',
  },
  {
    id: 'op-7-2-03', difficulty: 'medium',
    question: 'Explain why the pressure of a gas increases when its volume is decreased at constant temperature.',
    answer: 'The same number of particles are in a smaller space, so they hit the walls more often (the average speed is unchanged). More collisions per second on each unit area means a higher pressure.',
  },
  {
    id: 'op-7-2-04', difficulty: 'hard',
    question: 'A fixed mass of gas at constant temperature has a pressure of 100 kPa and a volume of 300 cm³. It is compressed to 200 cm³. Find the new pressure.',
    answer: '150 kPa',
    working: 'pV is constant: p₁V₁ = p₂V₂ → 100 × 300 = p₂ × 200 → p₂ = 150 kPa',
    vary: {
      make: rand => {
        const p1 = 10 * rand(5, 30);
        const V1 = 50 * rand(2, 16);
        const V2 = pick(rand, [V1 / 2, V1 / 4, V1 * 2, (V1 * 2) / 3, (V1 * 3) / 2, (V1 * 4) / 5].filter(v => Number.isInteger(v) && v !== V1));
        const p2 = (p1 * V1) / V2;
        return {
          question: `A fixed mass of gas at constant temperature has a pressure of ${p1} kPa and a volume of ${V1} cm³. It is ${V2 < V1 ? 'compressed' : 'allowed to expand'} to ${V2} cm³. Find the new pressure.`,
          answer: `${s3(p2)} kPa`,
          working: `pV is constant: p₁V₁ = p₂V₂ → ${p1} × ${V1} = p₂ × ${V2} → p₂ = ${s3(p2)} kPa`,
        };
      },
    },
  },
  {
    id: 'op-7-2-05', difficulty: 'medium',
    question: 'What is Brownian motion, and what does it show?',
    answer: 'The random, jerky movement of tiny particles (e.g. smoke specks in air) seen under a microscope. It is caused by collisions with fast-moving, invisible air molecules, which shows that gas particles are in constant random motion.',
  },
]);

// ---------- 8 Thermal Processes ----------

const p8a = deck('Thermal equilibrium', [
  {
    id: 'op-8-1-01', difficulty: 'easy',
    question: 'In which direction does thermal energy flow between two objects at different temperatures?',
    answer: 'From the hotter object to the colder object.',
  },
  {
    id: 'op-8-1-02', difficulty: 'medium',
    question: 'What is thermal equilibrium?',
    answer: 'When two objects in thermal contact reach the same temperature, so there is no net flow of thermal energy between them.',
  },
  {
    id: 'op-8-1-03', difficulty: 'medium',
    question: 'A cup of hot tea is left in a room. What happens to its temperature, and why does it stop changing?',
    answer: 'It falls as thermal energy flows from the tea to the cooler surroundings. It stops changing when it reaches room temperature: thermal equilibrium, with no net energy flow.',
  },
]);

const p8b = deck('Conduction', [
  {
    id: 'op-8-2-01', difficulty: 'medium',
    question: 'How is thermal energy conducted in a non-metal?',
    answer: 'Particles at the hot end vibrate more. They pass the vibrations on to neighbouring particles, so energy is transferred along the solid. This is slow.',
  },
  {
    id: 'op-8-2-02', difficulty: 'medium',
    question: 'Why are metals much better conductors than non-metals?',
    answer: 'Metals contain free (delocalised) electrons. These gain kinetic energy at the hot end and move quickly through the metal, transferring energy much faster than vibrations between particles alone.',
  },
  {
    id: 'op-8-2-03', difficulty: 'easy',
    question: 'Give two good conductors and two good insulators of heat.',
    answer: 'Good conductors: metals such as copper, aluminium, iron.\nGood insulators: air, plastic, wood, wool, polystyrene.',
  },
  {
    id: 'op-8-2-04', difficulty: 'medium',
    question: 'Why does a metal spoon feel colder than a wooden spoon at the same room temperature?',
    answer: 'Metal is a good conductor, so it carries thermal energy away from your hand quickly. Wood is a poor conductor, so less energy leaves your hand. Both are actually at the same temperature.',
  },
]);

const p8c = deck('Convection', [
  {
    id: 'op-8-3-01', difficulty: 'medium',
    question: 'Explain how a convection current forms in a liquid heated from below.',
    answer: 'The liquid near the heat source warms, expands and becomes less dense, so it rises. Cooler, denser liquid sinks to take its place and is then heated. This circulation is a convection current.',
  },
  {
    id: 'op-8-3-02', difficulty: 'easy',
    question: 'Why can convection not happen in solids?',
    answer: 'Convection needs the particles themselves to move from place to place (flow). Particles in a solid can only vibrate about fixed positions.',
  },
  {
    id: 'op-8-3-03', difficulty: 'medium',
    question: 'Why is an air conditioner fitted high on a wall, but a heater placed near the floor?',
    answer: 'Cold air from the air conditioner is denser and sinks, cooling the whole room. Warm air from a heater is less dense and rises, warming the whole room. Both set up convection currents.',
  },
  {
    id: 'op-8-3-04', difficulty: 'hard',
    question: 'Explain why a sea breeze blows from the sea to the land during the day.',
    answer: 'Land heats up faster than the sea. Air above the land warms, becomes less dense and rises. Cooler, denser air from above the sea moves in to replace it, so the breeze blows from sea to land.',
  },
]);

const p8d = deck('Radiation', [
  {
    id: 'op-8-4-01', difficulty: 'easy',
    question: 'What is thermal radiation, and why can it travel through a vacuum?',
    answer: 'Energy transferred as infrared electromagnetic waves. Unlike conduction and convection, it does not need particles, so it can travel through a vacuum (e.g. from the Sun to the Earth).',
  },
  {
    id: 'op-8-4-02', difficulty: 'medium',
    question: 'Which surfaces are the best and worst emitters and absorbers of infrared radiation?',
    answer: 'Dull, black surfaces are the best emitters and absorbers. Shiny, silvery (white) surfaces are the worst emitters and absorbers — they are good reflectors.',
  },
  {
    id: 'op-8-4-03', difficulty: 'medium',
    question: 'Name three factors that affect the rate at which a surface emits or absorbs radiation.',
    answer: 'Surface colour and texture (dull black vs shiny), surface temperature (hotter emits faster), and surface area (larger transfers faster).',
  },
  {
    id: 'op-8-4-04', difficulty: 'hard',
    question: 'Explain how a vacuum flask reduces heat transfer.',
    answer: 'The vacuum between the double walls stops conduction and convection. The silvered walls reflect infrared radiation, reducing radiation. The stopper (a poor conductor) reduces conduction and convection at the top.',
  },
  {
    id: 'op-8-4-05', difficulty: 'medium',
    question: 'Why are the cooling fins on the back of a refrigerator painted black?',
    answer: 'Dull black surfaces are good emitters of infrared radiation, so the fins lose thermal energy to the surroundings faster.',
  },
]);

// ---------- 9 Thermal Properties of Matter ----------

const p9a = deck('Internal energy', [
  {
    id: 'op-9-1-01', difficulty: 'medium',
    question: 'What is the internal energy of a substance?',
    answer: 'The total kinetic energy (from the random motion) and potential energy (from the forces between them) of all its particles.',
  },
  {
    id: 'op-9-1-02', difficulty: 'medium',
    question: 'How is the temperature of a substance related to its particles?',
    answer: 'Temperature is related to the average kinetic energy of the particles: the hotter the substance, the faster its particles move on average.',
  },
  {
    id: 'op-9-1-03', difficulty: 'hard',
    question: 'When ice melts at 0 °C, its internal energy increases but its temperature stays the same. Explain.',
    answer: 'The energy supplied breaks the bonds between the particles, increasing their potential energy. Their average kinetic energy does not change, so the temperature stays at 0 °C.',
  },
]);

const p9b = deck('Specific heat capacity', [
  {
    id: 'op-9-2-01', difficulty: 'easy',
    question: 'Define specific heat capacity.',
    answer: 'The energy needed to raise the temperature of 1 kg of a substance by 1 °C (or 1 K). Unit: J/(kg °C). Equation: Q = mcΔθ.',
  },
  {
    id: 'op-9-2-02', difficulty: 'medium',
    question: 'How much energy is needed to heat 2 kg of water from 20 °C to 70 °C? (c = 4200 J/(kg °C))',
    answer: '420,000 J',
    working: 'Q = mcΔθ = 2 × 4200 × (70 − 20) = 420,000 J',
    vary: {
      make: rand => {
        const [name, c] = pick(rand, [['water', 4200], ['aluminium', 900], ['copper', 390], ['oil', 2000]]);
        const m = rand(1, 50) / 10;
        const t1 = rand(10, 30);
        const t2 = t1 + rand(10, 70);
        const Q = m * c * (t2 - t1);
        return {
          question: `How much energy is needed to heat ${m} kg of ${name} from ${t1} °C to ${t2} °C? (c = ${c} J/(kg °C))`,
          answer: `${s3(Q)} J`,
          working: `Q = mcΔθ = ${m} × ${c} × (${t2} − ${t1}) = ${s3(Q)} J`,
        };
      },
    },
  },
  {
    id: 'op-9-2-03', difficulty: 'medium',
    question: 'A 0.5 kg metal block absorbs 9000 J and its temperature rises by 40 °C. Find its specific heat capacity.',
    answer: '450 J/(kg °C)',
    working: 'c = Q ÷ (mΔθ) = 9000 ÷ (0.5 × 40) = 450 J/(kg °C)',
    vary: {
      make: rand => {
        const m = pick(rand, [0.2, 0.25, 0.5, 1, 1.5, 2]);
        const c = pick(rand, [390, 450, 500, 900, 2000, 4200]);
        const dT = rand(5, 60);
        const Q = m * c * dT;
        return {
          question: `${aOrAn(m) === 'an' ? 'An' : 'A'} ${m} kg block absorbs ${exact(Q)} J and its temperature rises by ${dT} °C. Find its specific heat capacity.`,
          answer: `${s3(c)} J/(kg °C)`,
          working: `c = Q ÷ (mΔθ) = ${exact(Q)} ÷ (${m} × ${dT}) = ${s3(c)} J/(kg °C)`,
        };
      },
    },
  },
  {
    id: 'op-9-2-04', difficulty: 'hard',
    question: 'A 2000 W heater heats 4 kg of water for 3 minutes. Assuming no energy is lost, find the temperature rise. (c = 4200 J/(kg °C))',
    answer: '21.4 °C',
    working: 'Q = Pt = 2000 × 180 = 360,000 J → Δθ = Q ÷ (mc) = 360,000 ÷ (4 × 4200) = 21.4 °C',
    vary: {
      make: rand => {
        const P = 500 * rand(1, 6);
        const m = rand(1, 10);
        const min = rand(1, 10);
        const Q = P * min * 60;
        const dT = Q / (m * 4200);
        return {
          question: `${aOrAn(P) === 'an' ? 'An' : 'A'} ${P} W heater heats ${m} kg of water for ${min} minute${min === 1 ? '' : 's'}. Assuming no energy is lost, find the temperature rise. (c = 4200 J/(kg °C))`,
          answer: `${s3(dT)} °C`,
          working: `Q = Pt = ${P} × ${min * 60} = ${s3(Q)} J → Δθ = Q ÷ (mc) = ${s3(Q)} ÷ (${m} × 4200) = ${s3(dT)} °C`,
        };
      },
    },
  },
  {
    id: 'op-9-2-05', difficulty: 'medium',
    question: 'What is the difference between heat capacity and specific heat capacity?',
    answer: 'Heat capacity is the energy needed to raise the temperature of the whole object by 1 °C (C = Q/Δθ, unit J/°C). Specific heat capacity is per kilogram (c = Q/(mΔθ), unit J/(kg °C)).',
  },
  {
    id: 'op-9-2-06', difficulty: 'medium',
    question: 'Why is water used as a coolant in car engines?',
    answer: 'Water has a high specific heat capacity, so it can absorb a lot of thermal energy with only a small rise in temperature.',
  },
]);

const p9c = deck('Melting, boiling and evaporation', [
  {
    id: 'op-9-3-01', difficulty: 'medium',
    question: 'Why does the temperature stay constant while a substance melts or boils?',
    answer: 'The energy supplied is used to break (or weaken) the bonds between the particles, increasing their potential energy, not their kinetic energy. So the temperature does not rise until the change of state is complete.',
  },
  {
    id: 'op-9-3-02', difficulty: 'medium',
    question: 'Give three differences between boiling and evaporation.',
    answer: 'Boiling happens at a fixed temperature (the boiling point); evaporation happens at any temperature.\nBoiling takes place throughout the liquid (bubbles form); evaporation only at the surface.\nBoiling is fast; evaporation is slow.',
  },
  {
    id: 'op-9-3-03', difficulty: 'medium',
    question: 'Name four factors that increase the rate of evaporation.',
    answer: 'Higher temperature, larger exposed surface area, wind (moving air over the surface), lower humidity of the surrounding air. (Also lower surrounding pressure.)',
  },
  {
    id: 'op-9-3-04', difficulty: 'hard',
    question: 'Explain why evaporation causes cooling.',
    answer: 'The faster-moving particles with the most kinetic energy escape from the surface. The particles left behind have a lower average kinetic energy, so the temperature of the liquid falls.',
  },
  {
    id: 'op-9-3-05', difficulty: 'easy',
    question: 'What are melting, freezing, boiling and condensation?',
    answer: 'Melting: solid → liquid. Freezing (solidification): liquid → solid. Boiling: liquid → gas at the boiling point. Condensation: gas → liquid.',
  },
]);

const p9d = deck('Specific latent heat', [
  {
    id: 'op-9-4-01', difficulty: 'easy',
    question: 'Define specific latent heat of fusion and of vaporisation.',
    answer: 'Fusion: the energy needed to change 1 kg of a solid into liquid at its melting point, without a change in temperature.\nVaporisation: the energy needed to change 1 kg of a liquid into gas at its boiling point, without a change in temperature. Equation: Q = ml.',
  },
  {
    id: 'op-9-4-02', difficulty: 'medium',
    question: 'How much energy is needed to melt 0.5 kg of ice at 0 °C? (Specific latent heat of fusion of ice = 334,000 J/kg)',
    answer: '167,000 J',
    working: 'Q = ml = 0.5 × 334,000 = 167,000 J',
    vary: {
      make: rand => {
        const fusion = rand(0, 1) === 1;
        const l = fusion ? 334000 : 2260000;
        const m = rand(1, 40) / 10;
        return {
          question: fusion
            ? `How much energy is needed to melt ${m} kg of ice at 0 °C? (Specific latent heat of fusion of ice = 334,000 J/kg)`
            : `How much energy is needed to boil away ${m} kg of water at 100 °C? (Specific latent heat of vaporisation of water = 2,260,000 J/kg)`,
          answer: `${s3(m * l)} J`,
          working: `Q = ml = ${m} × ${l.toLocaleString('en-US')} = ${s3(m * l)} J`,
        };
      },
    },
  },
  {
    id: 'op-9-4-03', difficulty: 'hard',
    question: 'A 500 W heater takes 4 minutes to melt 0.36 kg of a solid at its melting point. Find its specific latent heat of fusion.',
    answer: '333,000 J/kg',
    working: 'Q = Pt = 500 × 240 = 120,000 J → l = Q ÷ m = 120,000 ÷ 0.36 = 333,000 J/kg',
    vary: {
      make: rand => {
        const P = 100 * rand(2, 20);
        const min = rand(1, 10);
        const m = rand(10, 80) / 100;
        const Q = P * min * 60;
        return {
          question: `${aOrAn(P) === 'an' ? 'An' : 'A'} ${P} W heater takes ${min} minute${min === 1 ? '' : 's'} to melt ${m} kg of a solid at its melting point. Find its specific latent heat of fusion.`,
          answer: `${s3(Q / m)} J/kg`,
          working: `Q = Pt = ${P} × ${min * 60} = ${s3(Q)} J → l = Q ÷ m = ${s3(Q)} ÷ ${m} = ${s3(Q / m)} J/kg`,
        };
      },
    },
  },
  {
    id: 'op-9-4-04', difficulty: 'medium',
    question: 'On a heating curve, what is happening in the flat (horizontal) sections?',
    answer: 'A change of state (melting or boiling). Energy is still being supplied, but it is used to break bonds between particles (latent heat), so the temperature does not change.',
  },
  {
    id: 'op-9-4-05', difficulty: 'hard',
    question: 'Why does steam at 100 °C cause a worse burn than water at 100 °C?',
    answer: 'When steam condenses on the skin, it releases its large latent heat of vaporisation as well as the heat released as the water cools, so far more energy is transferred to the skin.',
  },
]);

// #####################################################################
// THEME IV — WAVES
// #####################################################################

// ---------- 10 General Properties of Waves ----------

const p10a = deck('Describing wave motion', [
  {
    id: 'op-10-1-01', difficulty: 'easy',
    question: 'What is the difference between a transverse and a longitudinal wave? Give an example of each.',
    answer: 'Transverse: the particles vibrate perpendicular to the direction the wave travels (light, water waves). Longitudinal: the particles vibrate parallel to the direction of travel, forming compressions and rarefactions (sound).',
  },
  {
    id: 'op-10-1-02', difficulty: 'easy',
    question: 'Define amplitude, wavelength, frequency and period.',
    answer: 'Amplitude: maximum displacement from the rest position.\nWavelength (λ): distance between two neighbouring points in phase (e.g. crest to crest).\nFrequency (f): number of complete waves produced per second (Hz).\nPeriod (T): time for one complete wave (T = 1/f).',
  },
  {
    id: 'op-10-1-03', difficulty: 'easy',
    question: 'A wave has a frequency of 50 Hz and a wavelength of 4 m. Find its speed.',
    answer: '200 m/s',
    working: 'v = fλ = 50 × 4 = 200 m/s',
    vary: {
      make: rand => {
        const kind = pick(rand, ['v', 'f', 'λ']);
        const f = rand(2, 500);
        const lambda = rand(1, 40) / (rand(0, 1) ? 1 : 10);
        const v = f * lambda;
        if (kind === 'v') return { question: `A wave has a frequency of ${f} Hz and a wavelength of ${lambda} m. Find its speed.`, answer: `${exact(v)} m/s`, working: `v = fλ = ${f} × ${lambda} = ${exact(v)} m/s` };
        if (kind === 'f') return { question: `A wave travels at ${exact(v)} m/s with a wavelength of ${lambda} m. Find its frequency.`, answer: `${f} Hz`, working: `f = v ÷ λ = ${exact(v)} ÷ ${lambda} = ${f} Hz` };
        return { question: `A wave travels at ${exact(v)} m/s with a frequency of ${f} Hz. Find its wavelength.`, answer: `${exact(lambda)} m`, working: `λ = v ÷ f = ${exact(v)} ÷ ${f} = ${exact(lambda)} m` };
      },
    },
  },
  {
    id: 'op-10-1-04', difficulty: 'easy',
    question: 'A wave has a period of 0.02 s. Find its frequency.',
    answer: '50 Hz',
    working: 'f = 1 ÷ T = 1 ÷ 0.02 = 50 Hz',
    vary: {
      make: rand => {
        const T = pick(rand, [0.001, 0.002, 0.004, 0.005, 0.01, 0.02, 0.025, 0.05, 0.1, 0.2, 0.25, 0.5, 2, 4]);
        return {
          question: `A wave has a period of ${T} s. Find its frequency.`,
          answer: `${s3(1 / T)} Hz`,
          working: `f = 1 ÷ T = 1 ÷ ${T} = ${s3(1 / T)} Hz`,
        };
      },
    },
  },
  {
    id: 'op-10-1-05', difficulty: 'medium',
    question: 'What is a wavefront?',
    answer: 'A line joining points on a wave that are in phase (e.g. along one crest). Wavefronts are one wavelength apart and perpendicular to the direction of travel.',
  },
]);

const p10b = deck('Wave properties', [
  {
    id: 'op-10-2-01', difficulty: 'medium',
    question: 'What happens to the speed, wavelength and frequency of water waves when they pass from deep to shallow water?',
    answer: 'Speed decreases and wavelength decreases. Frequency stays the same (it is set by the source).',
  },
  {
    id: 'op-10-2-02', difficulty: 'medium',
    question: 'What is refraction, and why does it happen?',
    answer: 'The change in direction of a wave when it passes at an angle into a medium where its speed changes. One side of the wavefront slows down (or speeds up) before the other, so the wave turns.',
  },
  {
    id: 'op-10-2-03', difficulty: 'easy',
    question: 'State the law of reflection for waves.',
    answer: 'The angle of incidence equals the angle of reflection, measured from the normal. The incident wave, the reflected wave and the normal all lie in the same plane.',
  },
  {
    id: 'op-10-2-04', difficulty: 'hard',
    question: 'Water waves of frequency 4 Hz travel at 20 cm/s in deep water. In shallow water their wavelength is 3 cm. Find their speed in the shallow water.',
    answer: '12 cm/s',
    working: 'The frequency stays 4 Hz: v = fλ = 4 × 3 = 12 cm/s (deep-water wavelength was 20 ÷ 4 = 5 cm)',
    vary: {
      make: rand => {
        const f = rand(2, 10);
        const deep = rand(4, 10);
        const shallow = rand(1, deep - 1);
        return {
          question: `Water waves of frequency ${f} Hz travel at ${f * deep} cm/s in deep water. In shallow water their wavelength is ${shallow} cm. Find their speed in the shallow water.`,
          answer: `${f * shallow} cm/s`,
          working: `The frequency stays ${f} Hz: v = fλ = ${f} × ${shallow} = ${f * shallow} cm/s (deep-water wavelength was ${f * deep} ÷ ${f} = ${deep} cm)`,
        };
      },
    },
  },
]);

const p10c = deck('Sound', [
  {
    id: 'op-10-3-01', difficulty: 'easy',
    question: 'Why is sound a longitudinal wave, and why can it not travel through a vacuum?',
    answer: 'Sound is produced by vibrations that push and pull the particles of a medium along the direction of travel, forming compressions and rarefactions. A vacuum has no particles to pass the vibrations on.',
  },
  {
    id: 'op-10-3-02', difficulty: 'medium',
    question: 'A ship sends a sound pulse to the sea bed and hears the echo 0.8 s later. The speed of sound in water is 1500 m/s. How deep is the sea?',
    answer: '600 m',
    working: 'The sound travels down and back: distance = vt ÷ 2 = 1500 × 0.8 ÷ 2 = 600 m',
    vary: {
      make: rand => {
        const [medium, v, target] = pick(rand, [['water', 1500, 'sea bed'], ['air', 340, 'cliff'], ['air', 330, 'building']]);
        const t = rand(2, 40) / 10;
        return {
          question: medium === 'water'
            ? `A ship sends a sound pulse to the sea bed and hears the echo ${t} s later. The speed of sound in water is ${v} m/s. How deep is the sea?`
            : `A girl shouts towards a ${target} and hears the echo ${t} s later. The speed of sound in air is ${v} m/s. How far away is the ${target}?`,
          answer: `${exact((v * t) / 2)} m`,
          working: `The sound travels there and back: distance = vt ÷ 2 = ${v} × ${t} ÷ 2 = ${exact((v * t) / 2)} m`,
        };
      },
    },
  },
  {
    id: 'op-10-3-03', difficulty: 'easy',
    question: 'What is the range of frequencies a healthy human can hear? What is ultrasound?',
    answer: 'About 20 Hz to 20,000 Hz (20 kHz). Ultrasound is sound with a frequency above 20 kHz.',
  },
  {
    id: 'op-10-3-04', difficulty: 'medium',
    question: 'How are pitch and loudness related to the properties of a sound wave?',
    answer: 'Pitch depends on frequency: higher frequency → higher pitch. Loudness depends on amplitude: larger amplitude → louder sound.',
  },
  {
    id: 'op-10-3-05', difficulty: 'medium',
    question: 'Give two uses of ultrasound.',
    answer: 'Prenatal scanning of a foetus, finding the depth of the sea (echo sounding / sonar), detecting cracks in metals, cleaning delicate objects.',
  },
  {
    id: 'op-10-3-06', difficulty: 'medium',
    question: 'Two students stand 170 m from a wall. One claps and the other times the echo as 1.0 s. Find the speed of sound.',
    answer: '340 m/s',
    working: 'The sound travels 2 × 170 = 340 m in 1.0 s → v = 340 ÷ 1.0 = 340 m/s',
    vary: {
      make: rand => {
        const d = 10 * rand(5, 30);
        const v = rand(320, 350);
        const t = Number(((2 * d) / v).toFixed(2));
        return {
          question: `Two students stand ${d} m from a wall. One claps and the other times the echo as ${t} s. Find the speed of sound.`,
          answer: `${s3((2 * d) / t)} m/s`,
          working: `The sound travels 2 × ${d} = ${2 * d} m in ${t} s → v = ${2 * d} ÷ ${t} = ${s3((2 * d) / t)} m/s`,
        };
      },
    },
  },
  {
    id: 'op-10-3-07', difficulty: 'easy',
    question: 'In which state of matter does sound travel fastest, and why?',
    answer: 'Fastest in solids, then liquids, slowest in gases. The particles are closer together in solids, so vibrations are passed on more quickly.',
  },
]);

// ---------- 11 Electromagnetic Spectrum ----------

const EM_ORDER = ['radio waves', 'microwaves', 'infrared', 'visible light', 'ultraviolet', 'X-rays', 'gamma rays'];

const p11a = deck('Properties of EM waves', [
  {
    id: 'op-11-1-01', difficulty: 'easy',
    question: 'List the parts of the electromagnetic spectrum in order of increasing frequency.',
    answer: 'Radio waves, microwaves, infrared, visible light, ultraviolet, X-rays, gamma rays.',
  },
  {
    id: 'op-11-1-02', difficulty: 'medium',
    question: 'State three properties shared by all electromagnetic waves.',
    answer: 'They are transverse waves; they travel at the same speed in a vacuum (3.0 × 10⁸ m/s); they can travel through a vacuum; they obey v = fλ; they transfer energy and can be reflected and refracted.',
  },
  {
    id: 'op-11-1-03', difficulty: 'medium',
    question: 'A radio station broadcasts at a frequency of 100 MHz. Find the wavelength. (Speed of light = 3.0 × 10⁸ m/s)',
    answer: '3 m',
    working: 'λ = c ÷ f = 3.0 × 10⁸ ÷ (100 × 10⁶) = 3 m',
    vary: {
      make: rand => {
        const [label, mult] = pick(rand, [['MHz', 1e6], ['kHz', 1e3], ['GHz', 1e9]]);
        const f = pick(rand, [1, 2, 3, 5, 6, 10, 15, 20, 30, 50, 60, 75, 100, 150, 200, 300, 600]);
        const lambda = 3e8 / (f * mult);
        return {
          question: `A transmitter sends waves at a frequency of ${f} ${label}. Find the wavelength. (Speed of light = 3.0 × 10⁸ m/s)`,
          answer: `${s3(lambda)} m`,
          working: `λ = c ÷ f = 3.0 × 10⁸ ÷ (${f} × 10${sup(Math.log10(mult))}) = ${s3(lambda)} m`,
        };
      },
    },
  },
  {
    id: 'op-11-1-04', difficulty: 'medium',
    question: 'Which has the longer wavelength: microwaves or X-rays? Which has the higher frequency?',
    answer: 'Microwaves have the longer wavelength; X-rays have the higher frequency.',
    vary: {
      make: rand => {
        const [i, j] = [rand(0, 6), rand(0, 6)];
        if (i === j) return { question: 'Which has the longer wavelength: radio waves or gamma rays? Which has the higher frequency?', answer: 'Radio waves have the longer wavelength; gamma rays have the higher frequency.', working: '' };
        const [low, high] = i < j ? [EM_ORDER[i], EM_ORDER[j]] : [EM_ORDER[j], EM_ORDER[i]];
        const cap = s => s[0].toUpperCase() + s.slice(1);
        return {
          question: `Which has the longer wavelength: ${EM_ORDER[i]} or ${EM_ORDER[j]}? Which has the higher frequency?`,
          answer: `${cap(low)} ${low.endsWith('light') || low === 'infrared' ? 'has' : 'have'} the longer wavelength; ${high} ${high.endsWith('light') || high === 'infrared' || high === 'ultraviolet' ? 'has' : 'have'} the higher frequency.`,
          working: 'Order of increasing frequency (decreasing wavelength): radio, microwave, infrared, visible, ultraviolet, X-ray, gamma',
        };
      },
    },
  },
]);

const p11b = deck('Applications of EM waves', [
  {
    id: 'op-11-2-01', difficulty: 'easy',
    question: 'Give a use of radio waves and of microwaves.',
    answer: 'Radio waves: radio and TV broadcasting, communication.\nMicrowaves: satellite communication, mobile phones, microwave ovens.',
  },
  {
    id: 'op-11-2-02', difficulty: 'easy',
    question: 'Give a use of infrared and of ultraviolet radiation.',
    answer: 'Infrared: remote controls, thermal imaging cameras, intruder alarms, cooking (grills).\nUltraviolet: sterilising water and equipment, detecting forged bank notes, sunbeds.',
  },
  {
    id: 'op-11-2-03', difficulty: 'easy',
    question: 'Give a use of X-rays and of gamma rays.',
    answer: 'X-rays: imaging bones and teeth, airport security scanners.\nGamma rays: treating cancer (radiotherapy), sterilising medical equipment and food.',
  },
  {
    id: 'op-11-2-04', difficulty: 'medium',
    question: 'Which part of the EM spectrum is used for each: TV remote control, cooking food quickly, checking for broken bones, killing cancer cells?',
    answer: 'Remote control: infrared. Cooking quickly: microwaves. Broken bones: X-rays. Killing cancer cells: gamma rays.',
  },
]);

const p11c = deck('Effects of EM waves on cells and tissues', [
  {
    id: 'op-11-3-01', difficulty: 'medium',
    question: 'What harm can ultraviolet radiation do to the body?',
    answer: 'It can damage skin cells, causing sunburn, premature ageing and skin cancer, and can damage the eyes.',
  },
  {
    id: 'op-11-3-02', difficulty: 'medium',
    question: 'Why are X-rays and gamma rays especially dangerous?',
    answer: 'They are ionising: they have enough energy to knock electrons off atoms, which can damage DNA in cells, causing mutations, cancer or cell death.',
  },
  {
    id: 'op-11-3-03', difficulty: 'medium',
    question: 'What effect can microwaves and infrared have on body tissue?',
    answer: 'They heat the tissue: microwaves can cause internal heating of body cells, and infrared can cause skin burns.',
  },
]);

// ---------- 12 Light ----------

const p12a = deck('Reflection of light', [
  {
    id: 'op-12-1-01', difficulty: 'easy',
    question: 'State the laws of reflection.',
    answer: '1. The angle of incidence equals the angle of reflection (both measured from the normal).\n2. The incident ray, the reflected ray and the normal all lie in the same plane.',
  },
  {
    id: 'op-12-1-02', difficulty: 'medium',
    question: 'A ray of light hits a plane mirror at an angle of 35° to the mirror surface. What is the angle of reflection?',
    answer: '55°',
    working: 'Angles are measured from the normal: angle of incidence = 90° − 35° = 55° = angle of reflection',
    vary: {
      make: rand => {
        const a = rand(10, 80);
        return {
          question: `A ray of light hits a plane mirror at an angle of ${a}° to the mirror surface. What is the angle of reflection?`,
          answer: `${90 - a}°`,
          working: `Angles are measured from the normal: angle of incidence = 90° − ${a}° = ${90 - a}° = angle of reflection`,
        };
      },
    },
  },
  {
    id: 'op-12-1-03', difficulty: 'easy',
    question: 'Describe the image formed by a plane mirror.',
    answer: 'Virtual, upright, the same size as the object, laterally inverted, and as far behind the mirror as the object is in front.',
  },
  {
    id: 'op-12-1-04', difficulty: 'medium',
    question: 'A girl stands 2 m in front of a plane mirror. How far is she from her image? If she walks 0.5 m towards the mirror, how far is she from her image then?',
    answer: '4 m, then 3 m',
    working: 'The image is as far behind the mirror as she is in front: 2 + 2 = 4 m; then 1.5 + 1.5 = 3 m',
    vary: {
      make: rand => {
        const d = rand(2, 10) / 2;
        const step = rand(1, (d * 2) - 1) / 2;
        return {
          question: `A girl stands ${d} m in front of a plane mirror. How far is she from her image? If she walks ${step} m towards the mirror, how far is she from her image then?`,
          answer: `${exact(2 * d)} m, then ${exact(2 * (d - step))} m`,
          working: `The image is as far behind the mirror as she is in front: ${d} + ${d} = ${exact(2 * d)} m; then ${exact(d - step)} + ${exact(d - step)} = ${exact(2 * (d - step))} m`,
        };
      },
    },
  },
]);

const p12b = deck('Refraction of light', [
  {
    id: 'op-12-2-01', difficulty: 'easy',
    question: 'Why does light bend towards the normal when it enters glass from air?',
    answer: 'Light slows down when it enters the denser medium (glass). If it enters at an angle, the change in speed makes it change direction, towards the normal.',
  },
  {
    id: 'op-12-2-02', difficulty: 'medium',
    question: 'A ray enters glass with an angle of incidence of 40° and an angle of refraction of 25°. Find the refractive index of the glass.',
    answer: '1.52',
    working: 'n = sin i ÷ sin r = sin 40° ÷ sin 25° = 0.643 ÷ 0.423 = 1.52',
    vary: {
      make: rand => {
        const i = rand(20, 75);
        const n = rand(120, 250) / 100;
        const r = Math.round((Math.asin(Math.sin((i * Math.PI) / 180) / n) * 180) / Math.PI);
        const nShown = Math.sin((i * Math.PI) / 180) / Math.sin((r * Math.PI) / 180);
        return {
          question: `A ray enters a transparent block with an angle of incidence of ${i}° and an angle of refraction of ${r}°. Find the refractive index of the block.`,
          answer: s3(nShown),
          working: `n = sin i ÷ sin r = sin ${i}° ÷ sin ${r}° = ${s3(Math.sin((i * Math.PI) / 180))} ÷ ${s3(Math.sin((r * Math.PI) / 180))} = ${s3(nShown)}`,
        };
      },
    },
  },
  {
    id: 'op-12-2-03', difficulty: 'medium',
    question: 'Light travels at 2.0 × 10⁸ m/s in a glass block. Find the refractive index of the glass. (Speed of light in air = 3.0 × 10⁸ m/s)',
    answer: '1.5',
    working: 'n = c ÷ v = 3.0 × 10⁸ ÷ 2.0 × 10⁸ = 1.5',
    vary: {
      make: rand => {
        const n = pick(rand, [1.25, 1.3, 1.33, 1.4, 1.5, 1.6, 2, 2.4]);
        if (rand(0, 1) === 1) {
          const v = 3e8 / n;
          return {
            question: `A material has a refractive index of ${n}. Find the speed of light in it. (Speed of light in air = 3.0 × 10⁸ m/s)`,
            answer: `${s3(v)} m/s`,
            working: `v = c ÷ n = 3.0 × 10⁸ ÷ ${n} = ${s3(v)} m/s`,
          };
        }
        const vMant = Number((3 / n).toFixed(2));
        return {
          question: `Light travels at ${vMant.toFixed(2)} × 10⁸ m/s in a transparent block. Find the refractive index of the block. (Speed of light in air = 3.0 × 10⁸ m/s)`,
          answer: s3(3 / vMant),
          working: `n = c ÷ v = 3.0 × 10⁸ ÷ ${vMant.toFixed(2)} × 10⁸ = ${s3(3 / vMant)}`,
        };
      },
    },
  },
  {
    id: 'op-12-2-04', difficulty: 'hard',
    question: 'Glass has a refractive index of 1.5. Find its critical angle.',
    answer: '41.8°',
    working: 'sin c = 1 ÷ n = 1 ÷ 1.5 → c = 41.8°',
    vary: {
      make: rand => {
        const n = rand(120, 250) / 100;
        const c = (Math.asin(1 / n) * 180) / Math.PI;
        return {
          question: `A material has a refractive index of ${n}. Find its critical angle.`,
          answer: `${c.toFixed(1)}°`,
          working: `sin c = 1 ÷ n = 1 ÷ ${n} → c = ${c.toFixed(1)}°`,
        };
      },
    },
  },
  {
    id: 'op-12-2-05', difficulty: 'medium',
    question: 'State the two conditions for total internal reflection.',
    answer: '1. Light travels from an optically denser medium towards a less dense one (e.g. glass to air).\n2. The angle of incidence is greater than the critical angle.',
  },
  {
    id: 'op-12-2-06', difficulty: 'medium',
    question: 'How does an optical fibre carry light, and give one use.',
    answer: 'Light enters at one end and hits the inner surface at angles greater than the critical angle, so it is totally internally reflected again and again along the fibre. Uses: telecommunications (internet, phone), endoscopes in medicine.',
  },
]);

const p12c = deck('Thin converging lenses', [
  {
    id: 'op-12-3-01', difficulty: 'easy',
    question: 'Define the focal point and focal length of a converging lens.',
    answer: 'Focal point (F): the point on the principal axis where rays parallel to the axis converge after passing through the lens. Focal length: the distance from the optical centre of the lens to the focal point.',
  },
  {
    id: 'op-12-3-02', difficulty: 'medium',
    question: 'State the three rules for drawing ray diagrams for a converging lens.',
    answer: '1. A ray parallel to the principal axis is refracted through the focal point.\n2. A ray through the optical centre passes straight through.\n3. A ray through the focal point (on the object side) emerges parallel to the axis.',
  },
  {
    id: 'op-12-3-03', difficulty: 'hard',
    question: 'Describe the image formed by a converging lens when the object is: beyond 2F; between F and 2F; between F and the lens.',
    answer: 'Beyond 2F: real, inverted, diminished (e.g. camera, eye).\nBetween F and 2F: real, inverted, magnified (e.g. projector).\nBetween F and lens: virtual, upright, magnified (magnifying glass).',
  },
  {
    id: 'op-12-3-04', difficulty: 'medium',
    question: 'An object 2 cm tall forms an image 6 cm tall. Find the linear magnification.',
    answer: '3',
    working: 'Magnification = image height ÷ object height = 6 ÷ 2 = 3',
    vary: {
      make: rand => {
        const h = rand(1, 10);
        const m = pick(rand, [0.5, 1.5, 2, 2.5, 3, 4, 5]);
        return {
          question: `An object ${h} cm tall forms an image ${exact(h * m)} cm tall. Find the linear magnification.`,
          answer: exact(m),
          working: `Magnification = image height ÷ object height = ${exact(h * m)} ÷ ${h} = ${exact(m)}`,
        };
      },
    },
  },
  {
    id: 'op-12-3-05', difficulty: 'medium',
    question: 'What is the difference between a real and a virtual image?',
    answer: 'A real image is formed where light rays actually meet, so it can be shown on a screen. A virtual image is where rays only appear to come from, so it cannot be shown on a screen.',
  },
]);

// #####################################################################
// THEME V — ELECTRICITY AND MAGNETISM
// #####################################################################

// ---------- 13 Static Electricity ----------

const p13a = deck('Electric charge', [
  {
    id: 'op-13-1-01', difficulty: 'easy',
    question: 'What happens when two like charges, or two unlike charges, are brought close together?',
    answer: 'Like charges repel; unlike charges attract.',
  },
  {
    id: 'op-13-1-02', difficulty: 'medium',
    question: 'A polythene rod becomes negatively charged when rubbed with a cloth. Explain why.',
    answer: 'Friction transfers electrons from the cloth to the rod. The rod gains extra electrons, so it becomes negative; the cloth loses electrons and becomes positive. Only electrons move — positive charges do not.',
  },
  {
    id: 'op-13-1-03', difficulty: 'easy',
    question: 'What is the SI unit of charge?',
    answer: 'The coulomb (C).',
  },
  {
    id: 'op-13-1-04', difficulty: 'medium',
    question: 'Why can an insulator be charged by rubbing but a metal rod held in your hand cannot?',
    answer: 'In an insulator, the transferred electrons cannot move, so the charge stays where it is. In a metal, electrons flow freely through the metal and your body to earth, so the charge leaks away.',
  },
]);

const p13b = deck('Electric field', [
  {
    id: 'op-13-2-01', difficulty: 'easy',
    question: 'What is an electric field?',
    answer: 'A region in which an electric charge experiences an electric force.',
  },
  {
    id: 'op-13-2-02', difficulty: 'medium',
    question: 'Which way do electric field lines point, and what do they show?',
    answer: 'From positive charges towards negative charges: the direction of the force on a small positive charge. Lines closer together mean a stronger field.',
  },
  {
    id: 'op-13-2-03', difficulty: 'medium',
    question: 'Describe the electric field between two parallel plates with opposite charges.',
    answer: 'A uniform field: parallel, equally spaced field lines going straight from the positive plate to the negative plate (curving slightly at the edges).',
  },
]);

const p13c = deck('Dangers and applications of electrostatic charging', [
  {
    id: 'op-13-3-01', difficulty: 'medium',
    question: 'Why is a fuel tanker connected to the ground (earthed) before refuelling?',
    answer: 'Fuel flowing through pipes can build up static charge by friction. A spark could ignite the fuel vapour and cause an explosion. Earthing lets the charge flow safely to the ground.',
  },
  {
    id: 'op-13-3-02', difficulty: 'medium',
    question: 'How does a lightning conductor protect a tall building?',
    answer: 'It provides a low-resistance path for charge to flow safely to earth, so if lightning strikes, the current passes through the conductor instead of the building.',
  },
  {
    id: 'op-13-3-03', difficulty: 'medium',
    question: 'How does an electrostatic precipitator remove smoke particles from a chimney?',
    answer: 'The smoke particles are given a charge as they pass charged wires. They are then attracted to oppositely charged plates, where they stick and are later knocked off and collected.',
  },
  {
    id: 'op-13-3-04', difficulty: 'medium',
    question: 'How does electrostatic spray painting work, and why is it efficient?',
    answer: 'The paint droplets are all given the same charge, so they repel and spread out evenly. The object is given the opposite charge, so the droplets are attracted to it — even reaching the back — and less paint is wasted.',
  },
]);

// ---------- 14 Current of Electricity ----------

const p14a = deck('Conventional current and electron flow', [
  {
    id: 'op-14-1-01', difficulty: 'easy',
    question: 'What is the difference between conventional current and electron flow?',
    answer: 'Conventional current flows from the positive terminal to the negative terminal. Electrons actually flow the other way, from negative to positive.',
  },
  {
    id: 'op-14-1-02', difficulty: 'easy',
    question: 'A charge of 30 C flows through a lamp in 1 minute. Find the current.',
    answer: '0.5 A',
    working: 'I = Q ÷ t = 30 ÷ 60 = 0.5 A',
    vary: {
      make: rand => {
        if (rand(0, 1) === 1) {
          const t = rand(1, 10);
          const Q = 6 * rand(1, 40);
          return {
            question: `A charge of ${Q} C flows through a lamp in ${t} minute${t === 1 ? '' : 's'}. Find the current.`,
            answer: `${s3(Q / (t * 60))} A`,
            working: `I = Q ÷ t = ${Q} ÷ ${t * 60} = ${s3(Q / (t * 60))} A`,
          };
        }
        const I = rand(1, 50) / 10;
        const t = rand(5, 120);
        return {
          question: `A current of ${I} A flows for ${t} s. How much charge passes?`,
          answer: `${exact(I * t)} C`,
          working: `Q = It = ${I} × ${t} = ${exact(I * t)} C`,
        };
      },
    },
  },
  {
    id: 'op-14-1-03', difficulty: 'easy',
    question: 'How is an ammeter connected in a circuit, and why?',
    answer: 'In series with the component, so that the same current flows through the ammeter. An ammeter has a very low resistance so it does not change the current.',
  },
  {
    id: 'op-14-1-04', difficulty: 'easy',
    question: 'Define electric current.',
    answer: 'The rate of flow of electric charge: I = Q/t. Unit: ampere (A), where 1 A = 1 C/s.',
  },
]);

const p14b = deck('Electromotive force and potential difference', [
  {
    id: 'op-14-2-01', difficulty: 'medium',
    question: 'Define electromotive force (e.m.f.) and potential difference (p.d.).',
    answer: 'E.m.f.: the work done by a source in driving a unit charge around a complete circuit.\nP.d.: the work done (energy converted) per unit charge as charge passes through a component. Both are measured in volts (1 V = 1 J/C).',
  },
  {
    id: 'op-14-2-02', difficulty: 'easy',
    question: '24 J of energy is converted when 4 C of charge passes through a resistor. Find the potential difference across it.',
    answer: '6 V',
    working: 'V = W ÷ Q = 24 ÷ 4 = 6 V',
    vary: {
      make: rand => {
        const V = rand(1, 24);
        const Q = rand(1, 20);
        return {
          question: `${V * Q} J of energy is converted when ${Q} C of charge passes through a resistor. Find the potential difference across it.`,
          answer: `${V} V`,
          working: `V = W ÷ Q = ${V * Q} ÷ ${Q} = ${V} V`,
        };
      },
    },
  },
  {
    id: 'op-14-2-03', difficulty: 'easy',
    question: 'How is a voltmeter connected in a circuit, and why?',
    answer: 'In parallel across the component, to measure the potential difference between its two ends. A voltmeter has a very high resistance so very little current flows through it.',
  },
  {
    id: 'op-14-2-04', difficulty: 'medium',
    question: 'A 9 V battery drives 2 C of charge around a circuit. How much energy does it supply?',
    answer: '18 J',
    working: 'W = QV = 2 × 9 = 18 J',
    vary: {
      make: rand => {
        const V = pick(rand, [1.5, 3, 4.5, 6, 9, 12]);
        const Q = rand(1, 30);
        return {
          question: `${aOrAn(V) === 'an' ? 'An' : 'A'} ${V} V battery drives ${Q} C of charge around a circuit. How much energy does it supply?`,
          answer: `${exact(V * Q)} J`,
          working: `W = QV = ${Q} × ${V} = ${exact(V * Q)} J`,
        };
      },
    },
  },
]);

const p14c = deck('Resistance', [
  {
    id: 'op-14-3-01', difficulty: 'easy',
    question: 'The current through a resistor is 0.5 A when the p.d. across it is 6 V. Find its resistance.',
    answer: '12 Ω',
    working: 'R = V ÷ I = 6 ÷ 0.5 = 12 Ω',
    vary: {
      make: rand => {
        const kind = pick(rand, ['R', 'V', 'I']);
        const R = rand(2, 100);
        const I = rand(1, 40) / 10;
        const V = R * I;
        if (kind === 'R') return { question: `The current through a resistor is ${I} A when the p.d. across it is ${exact(V)} V. Find its resistance.`, answer: `${R} Ω`, working: `R = V ÷ I = ${exact(V)} ÷ ${I} = ${R} Ω` };
        if (kind === 'V') return { question: `A current of ${I} A flows through ${aOrAn(R)} ${R} Ω resistor. Find the p.d. across it.`, answer: `${exact(V)} V`, working: `V = IR = ${I} × ${R} = ${exact(V)} V` };
        return { question: `A p.d. of ${exact(V)} V is applied across ${aOrAn(R)} ${R} Ω resistor. Find the current.`, answer: `${I} A`, working: `I = V ÷ R = ${exact(V)} ÷ ${R} = ${I} A` };
      },
    },
  },
  {
    id: 'op-14-3-02', difficulty: 'medium',
    question: 'Describe the I–V graphs of an ohmic conductor, a filament lamp and a diode.',
    answer: 'Ohmic conductor: a straight line through the origin (constant resistance).\nFilament lamp: a curve that gets less steep — resistance increases as it gets hotter.\nDiode: almost no current in reverse; current flows easily in the forward direction above about 0.6 V.',
  },
  {
    id: 'op-14-3-03', difficulty: 'hard',
    question: 'A copper wire is 20 m long with a cross-sectional area of 0.5 mm². Find its resistance. (Resistivity of copper = 1.7 × 10⁻⁸ Ω m)',
    answer: '0.68 Ω',
    working: 'A = 0.5 mm² = 0.5 × 10⁻⁶ m² → R = ρL ÷ A = 1.7 × 10⁻⁸ × 20 ÷ (0.5 × 10⁻⁶) = 0.68 Ω',
    vary: {
      make: rand => {
        const [metal, rho, mant, exp] = pick(rand, [['copper', 1.7e-8, '1.7', -8], ['aluminium', 2.8e-8, '2.8', -8], ['nichrome', 1.1e-6, '1.1', -6]]);
        const L = rand(1, 50);
        const Amm = pick(rand, [0.1, 0.2, 0.25, 0.5, 1, 1.5, 2]);
        const R = (rho * L) / (Amm * 1e-6);
        return {
          question: `${aOrAn(metal) === 'an' ? 'An' : 'A'} ${metal} wire is ${L} m long with a cross-sectional area of ${Amm} mm². Find its resistance. (Resistivity of ${metal} = ${mant} × 10${sup(exp)} Ω m)`,
          answer: `${s3(R)} Ω`,
          working: `A = ${Amm} mm² = ${Amm} × 10⁻⁶ m² → R = ρL ÷ A = ${mant} × 10${sup(exp)} × ${L} ÷ (${Amm} × 10⁻⁶) = ${s3(R)} Ω`,
        };
      },
    },
  },
  {
    id: 'op-14-3-04', difficulty: 'medium',
    question: 'How does the resistance of a wire change if it is made twice as long, or twice as thick (double the cross-sectional area)?',
    answer: 'Twice as long: resistance doubles (R ∝ L).\nDouble the area: resistance halves (R ∝ 1/A).',
  },
  {
    id: 'op-14-3-05', difficulty: 'easy',
    question: 'Define resistance and give its unit.',
    answer: 'The ratio of the potential difference across a component to the current through it (R = V/I). Unit: ohm (Ω).',
  },
]);

// ---------- 15 D.C. Circuits ----------

const p15a = deck('Circuit diagrams', [
  {
    id: 'op-15-1-01', difficulty: 'easy',
    question: 'Describe the circuit symbols for a cell, a battery, a fixed resistor and a variable resistor.',
    answer: 'Cell: a long thin line (positive) and a short thick line (negative).\nBattery: two or more cells joined together.\nFixed resistor: a rectangle.\nVariable resistor: a rectangle with an arrow through it.',
  },
  {
    id: 'op-15-1-02', difficulty: 'medium',
    question: 'Describe the circuit symbols for a thermistor, an LDR, a diode and a fuse.',
    answer: 'Thermistor: a rectangle with a bent line through it (sometimes marked −t°).\nLDR: a rectangle in a circle with two arrows pointing in (light).\nDiode: a triangle pointing at a bar (current flows in the direction of the arrow).\nFuse: a rectangle with a line running through its length.',
  },
  {
    id: 'op-15-1-03', difficulty: 'easy',
    question: 'Where should an ammeter and a voltmeter be placed to measure the current through and p.d. across a lamp?',
    answer: 'The ammeter in series with the lamp; the voltmeter in parallel across the lamp.',
  },
]);

const p15b = deck('Series and parallel circuits', [
  {
    id: 'op-15-2-01', difficulty: 'easy',
    question: 'Resistors of 4 Ω, 6 Ω and 10 Ω are connected in series. Find the total resistance.',
    answer: '20 Ω',
    working: 'In series, resistances add: 4 + 6 + 10 = 20 Ω',
    vary: {
      make: rand => {
        const list = Array.from({ length: rand(2, 4) }, () => rand(1, 50));
        return {
          question: `Resistors of ${list.slice(0, -1).map(r => `${r} Ω`).join(', ')} and ${list[list.length - 1]} Ω are connected in series. Find the total resistance.`,
          answer: `${list.reduce((s, v) => s + v, 0)} Ω`,
          working: `In series, resistances add: ${list.join(' + ')} = ${list.reduce((s, v) => s + v, 0)} Ω`,
        };
      },
    },
  },
  {
    id: 'op-15-2-02', difficulty: 'medium',
    question: 'Resistors of 6 Ω and 3 Ω are connected in parallel. Find the combined resistance.',
    answer: '2 Ω',
    working: '1/R = 1/6 + 1/3 = 1/2 → R = 2 Ω (or product ÷ sum = 18 ÷ 9)',
    vary: {
      make: rand => {
        const [a, b] = [rand(2, 60), rand(2, 60)];
        const R = (a * b) / (a + b);
        return {
          question: `Resistors of ${a} Ω and ${b} Ω are connected in parallel. Find the combined resistance.`,
          answer: `${s3(R)} Ω`,
          working: `1/R = 1/${a} + 1/${b} → R = (${a} × ${b}) ÷ (${a} + ${b}) = ${a * b} ÷ ${a + b} = ${s3(R)} Ω`,
        };
      },
    },
  },
  {
    id: 'op-15-2-03', difficulty: 'medium',
    question: 'State how current and potential difference behave in series and in parallel circuits.',
    answer: 'Series: the current is the same everywhere; the p.d.s across the components add up to the supply e.m.f.\nParallel: the p.d. across each branch is the same; the branch currents add up to the total current.',
  },
  {
    id: 'op-15-2-04', difficulty: 'hard',
    question: 'A 12 V supply is connected across a 2 kΩ resistor and a 4 kΩ resistor in series (a potential divider). Find the p.d. across the 4 kΩ resistor.',
    answer: '8 V',
    working: 'V = 12 × 4 ÷ (2 + 4) = 8 V',
    vary: {
      make: rand => {
        const V = pick(rand, [3, 6, 9, 12, 24]);
        const [r1, r2] = [rand(1, 10), rand(1, 10)];
        const out = (V * r2) / (r1 + r2);
        return {
          question: `${aOrAn(V) === 'an' ? 'An' : 'A'} ${V} V supply is connected across ${aOrAn(r1)} ${r1} kΩ resistor and ${aOrAn(r2)} ${r2} kΩ resistor in series (a potential divider). Find the p.d. across the ${r2} kΩ resistor.`,
          answer: `${s3(out)} V`,
          working: `V = ${V} × ${r2} ÷ (${r1} + ${r2}) = ${s3(out)} V`,
        };
      },
    },
  },
  {
    id: 'op-15-2-05', difficulty: 'medium',
    question: 'A 6 V battery is connected to a 4 Ω and an 8 Ω resistor in series. Find the current and the p.d. across each resistor.',
    answer: 'Current 0.5 A; p.d.s 2 V and 4 V',
    working: 'Total R = 12 Ω → I = 6 ÷ 12 = 0.5 A → V = IR: 0.5 × 4 = 2 V, 0.5 × 8 = 4 V',
    vary: {
      make: rand => {
        const [r1, r2] = [rand(1, 20), rand(1, 20)];
        const V = pick(rand, [3, 6, 9, 12]);
        const I = V / (r1 + r2);
        return {
          question: `${aOrAn(V) === 'an' ? 'An' : 'A'} ${V} V battery is connected to ${aOrAn(r1)} ${r1} Ω and ${aOrAn(r2)} ${r2} Ω resistor in series. Find the current and the p.d. across each resistor.`,
          answer: `Current ${s3(I)} A; p.d.s ${s3(I * r1)} V and ${s3(I * r2)} V`,
          working: `Total R = ${r1 + r2} Ω → I = ${V} ÷ ${r1 + r2} = ${s3(I)} A → V = IR across each resistor`,
        };
      },
    },
  },
  {
    id: 'op-15-2-06', difficulty: 'medium',
    question: 'Why are the lights in a house connected in parallel?',
    answer: 'Each light gets the full mains voltage and can be switched on and off on its own; if one bulb fails, the others stay on.',
  },
]);

const p15c = deck('Action and use of circuit components', [
  {
    id: 'op-15-3-01', difficulty: 'easy',
    question: 'How does the resistance of a thermistor and of an LDR change?',
    answer: 'Thermistor (NTC): resistance decreases as temperature increases.\nLDR: resistance decreases as light intensity increases.',
  },
  {
    id: 'op-15-3-02', difficulty: 'medium',
    question: 'What does a diode do, and what is an LED?',
    answer: 'A diode lets current flow in one direction only (very high resistance in reverse). An LED (light-emitting diode) is a diode that gives out light when current flows forward through it.',
  },
  {
    id: 'op-15-3-03', difficulty: 'hard',
    question: 'A potential divider has a fixed resistor and an LDR. The output is taken across the fixed resistor. What happens to the output voltage when it gets dark? Explain.',
    answer: 'The output voltage decreases. In the dark the LDR\'s resistance rises, so it takes a larger share of the supply voltage, leaving a smaller p.d. across the fixed resistor.',
  },
  {
    id: 'op-15-3-04', difficulty: 'medium',
    question: 'Suggest a use for a thermistor and for an LDR in a circuit.',
    answer: 'Thermistor: a fire alarm or thermostat that switches on when the temperature changes.\nLDR: automatic street lights that switch on when it gets dark.',
  },
]);

// ---------- 16 Practical Electricity ----------

const p16a = deck('Electrical working, power and energy', [
  {
    id: 'op-16-1-01', difficulty: 'easy',
    question: 'A kettle draws 8 A from the 230 V mains. Find its power.',
    answer: '1840 W',
    working: 'P = VI = 230 × 8 = 1840 W',
    vary: {
      make: rand => {
        const I = rand(1, 13);
        const V = pick(rand, [12, 110, 230, 240]);
        return {
          question: `An appliance draws ${I} A from ${aOrAn(V)} ${V} V supply. Find its power.`,
          answer: `${V * I} W`,
          working: `P = VI = ${V} × ${I} = ${V * I} W`,
        };
      },
    },
  },
  {
    id: 'op-16-1-02', difficulty: 'medium',
    question: 'A current of 2 A flows through a 50 Ω resistor. Find the power it dissipates.',
    answer: '200 W',
    working: 'P = I²R = 2² × 50 = 200 W',
    vary: {
      make: rand => {
        const I = rand(1, 50) / 10;
        const R = rand(2, 100);
        return {
          question: `A current of ${I} A flows through ${aOrAn(R)} ${R} Ω resistor. Find the power it dissipates.`,
          answer: `${s3(I * I * R)} W`,
          working: `P = I²R = ${I}² × ${R} = ${s3(I * I * R)} W`,
        };
      },
    },
  },
  {
    id: 'op-16-1-03', difficulty: 'hard',
    question: 'A 2000 W heater is used for 3 hours a day for 30 days. Electricity costs 30 cents per kWh. Find the energy used in kWh and the cost.',
    answer: '180 kWh, costing $54.00',
    working: 'E = P × t = 2 kW × (3 × 30) h = 180 kWh → 180 × 30 cents = 5400 cents = $54.00',
    vary: {
      make: rand => {
        const P = pick(rand, [100, 200, 500, 800, 1000, 1200, 1500, 2000, 2500, 3000]);
        const h = rand(1, 8);
        const days = pick(rand, [7, 10, 14, 20, 30]);
        const cents = pick(rand, [25, 28, 30, 32]);
        const kWh = (P / 1000) * h * days;
        // Total cost in whole cents, rounding half a cent up (whole-number maths, no floating-point slips)
        const roundedCents = Math.floor((2 * P * h * days * cents + 1000) / 2000);
        const cost = (roundedCents / 100).toFixed(2);
        return {
          question: `${aOrAn(P) === 'an' ? 'An' : 'A'} ${P} W appliance is used for ${h} hour${h === 1 ? '' : 's'} a day for ${days} days. Electricity costs ${cents} cents per kWh. Find the energy used in kWh and the cost.`,
          answer: `${exact(kWh)} kWh, costing $${cost}`,
          working: `E = P × t = ${exact(P / 1000)} kW × (${h} × ${days}) h = ${exact(kWh)} kWh → ${exact(kWh)} × ${cents} cents = ${exact(kWh * cents)} cents ≈ $${cost}`,
        };
      },
    },
  },
  {
    id: 'op-16-1-04', difficulty: 'medium',
    question: 'How many joules are there in 1 kWh?',
    answer: '3,600,000 J (3.6 × 10⁶ J)',
    working: '1 kWh = 1000 W × 3600 s = 3,600,000 J',
  },
  {
    id: 'op-16-1-05', difficulty: 'medium',
    question: 'A 60 W lamp is switched on for 5 minutes. How much energy does it use in joules?',
    answer: '18,000 J',
    working: 'E = Pt = 60 × 300 = 18,000 J',
    vary: {
      make: rand => {
        const P = pick(rand, [5, 10, 40, 60, 100, 500, 1000]);
        const min = rand(1, 30);
        return {
          question: `${aOrAn(P) === 'an' ? 'An' : 'A'} ${P} W lamp is switched on for ${min} minute${min === 1 ? '' : 's'}. How much energy does it use in joules?`,
          answer: `${s3(P * min * 60)} J`,
          working: `E = Pt = ${P} × ${min * 60} = ${s3(P * min * 60)} J`,
        };
      },
    },
  },
]);

const p16b = deck('Dangers of electricity', [
  {
    id: 'op-16-2-01', difficulty: 'easy',
    question: 'Give three hazards of using electricity.',
    answer: 'Damaged insulation (exposed live wires can cause electric shock), overheating of cables from too much current (fire), and damp conditions (water conducts, increasing the risk of shock).',
  },
  {
    id: 'op-16-2-02', difficulty: 'medium',
    question: 'Why is it dangerous to plug too many appliances into one socket?',
    answer: 'The total current through the socket and cable becomes too large. The cable overheats, which can melt the insulation and start a fire.',
  },
  {
    id: 'op-16-2-03', difficulty: 'medium',
    question: 'Why should you never touch electrical switches with wet hands?',
    answer: 'Water conducts electricity and lowers the resistance of your skin, so a much larger current could flow through your body, causing a serious or fatal shock.',
  },
]);

const FUSES = [1, 3, 5, 10, 13];

const p16c = deck('Safe use of electricity in the home', [
  {
    id: 'op-16-3-01', difficulty: 'medium',
    question: 'A 1500 W kettle runs on the 230 V mains. Which fuse should be used: 3 A, 5 A, 10 A or 13 A?',
    answer: '10 A',
    working: 'I = P ÷ V = 1500 ÷ 230 = 6.52 A → choose the smallest fuse rating above this: 10 A',
    vary: {
      make: rand => {
        const P = pick(rand, [60, 100, 200, 400, 600, 800, 1000, 1200, 1500, 2000, 2200, 2800]);
        const I = P / 230;
        const fuse = FUSES.find(f => f > I);
        return {
          question: `${aOrAn(P) === 'an' ? 'An' : 'A'} ${P} W appliance runs on the 230 V mains. Which fuse should be used: 1 A, 3 A, 5 A, 10 A or 13 A?`,
          answer: `${fuse} A`,
          working: `I = P ÷ V = ${P} ÷ 230 = ${s3(I)} A → choose the smallest fuse rating above this: ${fuse} A`,
        };
      },
    },
  },
  {
    id: 'op-16-3-02', difficulty: 'medium',
    question: 'How does a fuse protect an appliance?',
    answer: 'It is a thin wire that melts and breaks the circuit if the current becomes larger than its rating, stopping the cable overheating and reducing the risk of fire.',
  },
  {
    id: 'op-16-3-03', difficulty: 'hard',
    question: 'Explain how the earth wire protects a person using an appliance with a metal case.',
    answer: 'If the live wire touches the metal case, a large current flows through the low-resistance earth wire to the ground. This blows the fuse (or trips the circuit breaker), cutting off the supply, so the case does not stay live.',
  },
  {
    id: 'op-16-3-04', difficulty: 'medium',
    question: 'Why must the switch and fuse be connected in the live wire?',
    answer: 'So that when the switch is off or the fuse has blown, the appliance is disconnected from the high voltage. If they were in the neutral wire, the appliance would still be live and could give a shock.',
  },
  {
    id: 'op-16-3-05', difficulty: 'medium',
    question: 'What is double insulation, and why do such appliances not need an earth wire?',
    answer: 'The live parts are surrounded by two layers of insulation, and the outer case is plastic (an insulator). The case can never become live, so no earth wire is needed.',
  },
  {
    id: 'op-16-3-06', difficulty: 'medium',
    question: 'Give one advantage of a circuit breaker over a fuse.',
    answer: 'It switches off faster, and it can simply be reset after the fault is fixed instead of being replaced.',
  },
]);

// ---------- 17 Magnetism ----------

const p17a = deck('Laws of magnetism', [
  {
    id: 'op-17-1-01', difficulty: 'easy',
    question: 'State the law of magnetic poles.',
    answer: 'Like poles repel; unlike poles attract.',
  },
  {
    id: 'op-17-1-02', difficulty: 'easy',
    question: 'Which materials are magnetic? Name two.',
    answer: 'Iron, steel, nickel and cobalt are magnetic. Most other metals (copper, aluminium, brass) are not.',
  },
  {
    id: 'op-17-1-03', difficulty: 'medium',
    question: 'What is the only sure test that an object is a magnet?',
    answer: 'Repulsion. Both magnets and unmagnetised magnetic materials are attracted to a magnet, but only a magnet can be repelled by another magnet.',
  },
]);

const p17b = deck('Magnetic properties of matter', [
  {
    id: 'op-17-2-01', difficulty: 'medium',
    question: 'Compare soft iron and steel as magnetic materials.',
    answer: 'Soft iron is easily magnetised and easily loses its magnetism — used for temporary magnets (electromagnet cores). Steel is harder to magnetise but keeps its magnetism — used for permanent magnets.',
  },
  {
    id: 'op-17-2-02', difficulty: 'medium',
    question: 'Describe how to magnetise a steel bar using electricity.',
    answer: 'Place the bar inside a solenoid (a coil of wire) and pass a large direct current (d.c.) through the coil for a short time, then switch it off.',
  },
  {
    id: 'op-17-2-03', difficulty: 'medium',
    question: 'Give two ways to demagnetise a magnet.',
    answer: 'Put it in a solenoid carrying alternating current (a.c.) and slowly pull it out far away; heat it strongly; or hammer it repeatedly while it points east–west.',
  },
  {
    id: 'op-17-2-04', difficulty: 'medium',
    question: 'What is induced magnetism?',
    answer: 'A magnetic material placed near a magnet temporarily becomes a magnet itself, with the opposite pole facing the magnet — which is why it is attracted.',
  },
]);

const p17c = deck('Magnetic field', [
  {
    id: 'op-17-3-01', difficulty: 'easy',
    question: 'What is a magnetic field, and which way do field lines point?',
    answer: 'A region where a magnetic material or a magnet experiences a force. Field lines point from the north pole to the south pole outside a magnet.',
  },
  {
    id: 'op-17-3-02', difficulty: 'medium',
    question: 'How can you plot the magnetic field around a bar magnet?',
    answer: 'Place a plotting compass near the north pole and mark where its needle points. Move the compass so its tail is at that mark, and repeat. Join the dots to form a field line, then repeat from other starting points (or sprinkle iron filings).',
  },
  {
    id: 'op-17-3-03', difficulty: 'medium',
    question: 'What does the spacing of magnetic field lines show?',
    answer: 'The strength of the field: lines close together mean a strong field (e.g. at the poles); lines far apart mean a weak field.',
  },
]);

// ---------- 18 Electromagnetism ----------

const p18a = deck('Magnetic effect of a current', [
  {
    id: 'op-18-1-01', difficulty: 'medium',
    question: 'Describe the magnetic field around a long straight wire carrying a current, and how to find its direction.',
    answer: 'Concentric circles around the wire, closer together near the wire. Right-hand grip rule: thumb points along the current, curled fingers show the field direction.',
  },
  {
    id: 'op-18-1-02', difficulty: 'medium',
    question: 'Give three ways to make an electromagnet stronger.',
    answer: 'Increase the current, increase the number of turns of the coil, and use a soft-iron core.',
  },
  {
    id: 'op-18-1-03', difficulty: 'medium',
    question: 'Describe the magnetic field of a solenoid carrying a current.',
    answer: 'Like a bar magnet outside, with a north and south pole at the ends; inside, the field is strong and uniform (parallel lines). Reversing the current reverses the poles.',
  },
  {
    id: 'op-18-1-04', difficulty: 'hard',
    question: 'How does a relay use an electromagnet?',
    answer: 'A small current in the relay coil magnetises its core, which attracts an iron armature and closes (or opens) contacts in a second circuit. A small, safe current can then switch a large current on or off.',
  },
]);

const p18b = deck('Force on a current-carrying conductor', [
  {
    id: 'op-18-2-01', difficulty: 'medium',
    question: "Describe Fleming's left-hand rule.",
    answer: 'Hold the thumb, first finger and second finger of the left hand at right angles: First finger = Field (N to S), seCond finger = Current, thuMb = Motion (force).',
  },
  {
    id: 'op-18-2-02', difficulty: 'medium',
    question: 'Give two ways to increase the force on a current-carrying wire in a magnetic field.',
    answer: 'Increase the current, or use a stronger magnetic field (also a longer length of wire in the field).',
  },
  {
    id: 'op-18-2-03', difficulty: 'medium',
    question: 'What happens to the force on a current-carrying wire if the current is reversed? If both the current and the field are reversed?',
    answer: 'Reversing the current reverses the force. Reversing both the current and the field leaves the force in the original direction.',
  },
  {
    id: 'op-18-2-04', difficulty: 'hard',
    question: 'When is there no force on a current-carrying wire in a magnetic field?',
    answer: 'When the wire (current) is parallel to the magnetic field lines.',
  },
]);

const p18c = deck('The d.c. motor', [
  {
    id: 'op-18-3-01', difficulty: 'medium',
    question: 'Explain why the coil of a d.c. motor turns.',
    answer: 'The current flows in opposite directions on the two sides of the coil, so the magnetic field pushes one side up and the other side down (Fleming\'s left-hand rule). These forces produce a turning effect (moment) on the coil.',
  },
  {
    id: 'op-18-3-02', difficulty: 'hard',
    question: 'What is the job of the split-ring commutator in a d.c. motor?',
    answer: 'It reverses the direction of the current in the coil every half turn, so the forces always turn the coil in the same direction and it keeps rotating.',
  },
  {
    id: 'op-18-3-03', difficulty: 'medium',
    question: 'Give three ways to make a d.c. motor turn faster.',
    answer: 'Increase the current, use a stronger magnet, and increase the number of turns on the coil (also wind the coil on a soft-iron core).',
  },
]);

// ---------- 19 Electromagnetic Induction ----------

const p19a = deck('Principles of electromagnetic induction', [
  {
    id: 'op-19-1-01', difficulty: 'medium',
    question: "State Faraday's law of electromagnetic induction.",
    answer: 'The induced e.m.f. is directly proportional to the rate of change of magnetic flux linkage (how fast the conductor cuts the field lines).',
  },
  {
    id: 'op-19-1-02', difficulty: 'hard',
    question: "State Lenz's law, and apply it to a magnet pushed north pole first into a coil.",
    answer: 'The induced current flows in a direction that opposes the change that produced it. So the end of the coil facing the magnet becomes a north pole, repelling the approaching magnet.',
  },
  {
    id: 'op-19-1-03', difficulty: 'medium',
    question: 'Give three ways to increase the e.m.f. induced in a coil by a moving magnet.',
    answer: 'Move the magnet faster, use a stronger magnet, and use a coil with more turns.',
  },
  {
    id: 'op-19-1-04', difficulty: 'medium',
    question: 'A magnet is held still inside a coil connected to a galvanometer. Why is there no reading?',
    answer: 'There is no change in magnetic flux linking the coil, so no e.m.f. is induced. An e.m.f. is only induced while the magnet (or coil) moves.',
  },
]);

const p19b = deck('The a.c. generator', [
  {
    id: 'op-19-2-01', difficulty: 'medium',
    question: 'How does an a.c. generator produce an alternating current?',
    answer: 'A coil rotates in a magnetic field, so the flux through it keeps changing and an e.m.f. is induced. Each half turn, each side of the coil moves the opposite way through the field, so the induced current reverses direction.',
  },
  {
    id: 'op-19-2-02', difficulty: 'medium',
    question: 'What is the job of the slip rings in an a.c. generator?',
    answer: 'They rotate with the coil and keep each end of the coil connected (through brushes) to the same side of the external circuit, so the alternating current is passed out.',
  },
  {
    id: 'op-19-2-03', difficulty: 'hard',
    question: 'How does the output of an a.c. generator change if the coil turns twice as fast?',
    answer: 'The peak e.m.f. doubles (flux changes twice as fast) and the frequency doubles (twice as many cycles per second).',
  },
]);

const p19c = deck('The transformer', [
  {
    id: 'op-19-3-01', difficulty: 'medium',
    question: 'A transformer has 200 turns on the primary coil and 50 turns on the secondary. The input is 240 V. Find the output voltage.',
    answer: '60 V',
    working: 'Vs ÷ Vp = Ns ÷ Np → Vs = 240 × 50 ÷ 200 = 60 V',
    vary: {
      make: rand => {
        const Np = 50 * rand(2, 40);
        const ratio = pick(rand, [0.05, 0.1, 0.2, 0.25, 0.5, 2, 4, 5, 10]);
        const Ns = Math.round(Np * ratio);
        const Vp = pick(rand, [6, 12, 24, 120, 230, 240]);
        const Vs = (Vp * Ns) / Np;
        return {
          question: `A transformer has ${Np} turns on the primary coil and ${Ns} turns on the secondary. The input is ${Vp} V. Find the output voltage.`,
          answer: `${s3(Vs)} V`,
          working: `Vs ÷ Vp = Ns ÷ Np → Vs = ${Vp} × ${Ns} ÷ ${Np} = ${s3(Vs)} V`,
        };
      },
    },
  },
  {
    id: 'op-19-3-02', difficulty: 'hard',
    question: 'An ideal transformer steps 240 V down to 12 V. The secondary current is 4 A. Find the primary current.',
    answer: '0.2 A',
    working: 'Ideal: power in = power out → Vp Ip = Vs Is → Ip = 12 × 4 ÷ 240 = 0.2 A',
    vary: {
      make: rand => {
        const Vp = pick(rand, [120, 230, 240]);
        const Vs = pick(rand, [3, 6, 9, 12, 24]);
        const Is = rand(1, 20) / 2;
        const Ip = (Vs * Is) / Vp;
        return {
          question: `An ideal transformer steps ${Vp} V down to ${Vs} V. The secondary current is ${Is} A. Find the primary current.`,
          answer: `${s3(Ip)} A`,
          working: `Ideal: power in = power out → Vp Ip = Vs Is → Ip = ${Vs} × ${Is} ÷ ${Vp} = ${s3(Ip)} A`,
        };
      },
    },
  },
  {
    id: 'op-19-3-03', difficulty: 'medium',
    question: 'Why does a transformer only work with alternating current?',
    answer: 'A.c. in the primary coil produces a constantly changing magnetic field in the iron core, which induces an e.m.f. in the secondary. A steady d.c. gives a constant field, so no e.m.f. is induced.',
  },
  {
    id: 'op-19-3-04', difficulty: 'hard',
    question: 'Why is electricity transmitted over long distances at very high voltage?',
    answer: 'For the same power (P = VI), a higher voltage means a smaller current. Power lost as heat in the cables is I²R, so a smaller current greatly reduces the energy wasted.',
  },
  {
    id: 'op-19-3-05', difficulty: 'easy',
    question: 'What is the difference between a step-up and a step-down transformer?',
    answer: 'Step-up: more turns on the secondary than the primary, so the output voltage is higher. Step-down: fewer turns on the secondary, so the output voltage is lower.',
  },
]);

// #####################################################################
// THEME VI — RADIOACTIVITY
// #####################################################################

// ---------- 20 Radioactivity ----------

const SUP_DIGITS = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const SUB_DIGITS = '₀₁₂₃₄₅₆₇₈₉';
const tiny = (n, digits) => String(n).split('').map(d => digits[d]).join('');

// ²³⁸₉₂U
const nuclide = (A, Z, symbol) => `${tiny(A, SUP_DIGITS)}${tiny(Z, SUB_DIGITS)}${symbol}`;

// Real decays: [name, symbol, A, Z, mode, daughter name, daughter symbol]
const DECAYS = [
  ['uranium', 'U', 238, 92, 'alpha', 'thorium', 'Th'],
  ['radium', 'Ra', 226, 88, 'alpha', 'radon', 'Rn'],
  ['polonium', 'Po', 210, 84, 'alpha', 'lead', 'Pb'],
  ['americium', 'Am', 241, 95, 'alpha', 'neptunium', 'Np'],
  ['carbon', 'C', 14, 6, 'beta', 'nitrogen', 'N'],
  ['strontium', 'Sr', 90, 38, 'beta', 'yttrium', 'Y'],
  ['iodine', 'I', 131, 53, 'beta', 'xenon', 'Xe'],
  ['cobalt', 'Co', 60, 27, 'beta', 'nickel', 'Ni'],
  ['caesium', 'Cs', 137, 55, 'beta', 'barium', 'Ba'],
];

// Elements for the "count the particles" card: [name, symbol, Z, mass numbers]
const ELEMENTS = [
  ['carbon', 'C', 6, [12, 14]], ['oxygen', 'O', 8, [16, 18]], ['sodium', 'Na', 11, [23, 24]],
  ['chlorine', 'Cl', 17, [35, 37]], ['potassium', 'K', 19, [39, 40]], ['iron', 'Fe', 26, [56]],
  ['cobalt', 'Co', 27, [59, 60]], ['iodine', 'I', 53, [127, 131]], ['uranium', 'U', 92, [235, 238]],
];

const p20a = deck('The composition of the atom', [
  {
    id: 'op-20-1-01', difficulty: 'easy',
    question: 'State the charge and relative mass of a proton, a neutron and an electron, and where each is found.',
    answer: 'Proton: charge +1, mass 1, in the nucleus.\nNeutron: charge 0, mass 1, in the nucleus.\nElectron: charge −1, mass about 1/1840, orbiting the nucleus.',
  },
  {
    id: 'op-20-1-02', difficulty: 'easy',
    question: 'An atom of sodium is written ²³₁₁Na. How many protons, neutrons and electrons does it have?',
    answer: '11 protons, 12 neutrons, 11 electrons',
    working: 'Proton number Z = 11; neutrons = A − Z = 23 − 11 = 12; a neutral atom has as many electrons as protons',
    vary: {
      make: rand => {
        const [name, symbol, Z, masses] = pick(rand, ELEMENTS);
        const A = pick(rand, masses);
        return {
          question: `An atom of ${name} is written ${nuclide(A, Z, symbol)}. How many protons, neutrons and electrons does it have?`,
          answer: `${Z} protons, ${A - Z} neutrons, ${Z} electrons`,
          working: `Proton number Z = ${Z}; neutrons = A − Z = ${A} − ${Z} = ${A - Z}; a neutral atom has as many electrons as protons`,
        };
      },
    },
  },
  {
    id: 'op-20-1-03', difficulty: 'medium',
    question: 'What are isotopes? Give an example.',
    answer: 'Atoms of the same element (same number of protons) with different numbers of neutrons, so different nucleon numbers — e.g. carbon-12 and carbon-14.',
  },
  {
    id: 'op-20-1-04', difficulty: 'easy',
    question: 'What do the proton number (Z) and the nucleon number (A) of a nucleus tell you?',
    answer: 'Proton number Z: the number of protons (it identifies the element). Nucleon number A: the total number of protons and neutrons in the nucleus.',
  },
]);

const p20b = deck('Radioactive decay', [
  {
    id: 'op-20-2-01', difficulty: 'medium',
    question: 'Compare alpha, beta and gamma radiation: what each is, its ionising effect, and what stops it.',
    answer: 'Alpha (α): helium nucleus (2 protons + 2 neutrons); strongly ionising; stopped by paper or a few cm of air.\nBeta (β): fast electron from the nucleus; moderately ionising; stopped by a few mm of aluminium.\nGamma (γ): electromagnetic wave; weakly ionising; reduced by thick lead or concrete.',
  },
  {
    id: 'op-20-2-02', difficulty: 'hard',
    question: 'Uranium-238 (²³⁸₉₂U) decays by alpha emission. Write the nucleon and proton numbers of the new nucleus and name it.',
    answer: '²³⁴₉₀Th (thorium-234)',
    working: 'Alpha decay: A decreases by 4 and Z decreases by 2 → 238 − 4 = 234, 92 − 2 = 90',
    vary: {
      make: rand => {
        const [name, sym, A, Z, mode, dName, dSym] = pick(rand, DECAYS);
        const [dA, dZ] = mode === 'alpha' ? [A - 4, Z - 2] : [A, Z + 1];
        const cap = s => s[0].toUpperCase() + s.slice(1);
        return {
          question: `${cap(name)}-${A} (${nuclide(A, Z, sym)}) decays by ${mode} emission. Write the nucleon and proton numbers of the new nucleus and name it.`,
          answer: `${nuclide(dA, dZ, dSym)} (${dName}-${dA})`,
          working: mode === 'alpha'
            ? `Alpha decay: A decreases by 4 and Z decreases by 2 → ${A} − 4 = ${dA}, ${Z} − 2 = ${dZ}`
            : `Beta decay: a neutron becomes a proton, so A stays the same and Z increases by 1 → ${dA}, ${Z} + 1 = ${dZ}`,
        };
      },
    },
  },
  {
    id: 'op-20-2-03', difficulty: 'medium',
    question: 'A radioactive sample has a half-life of 6 hours and an initial activity of 800 counts/s. What is its activity after 18 hours?',
    answer: '100 counts/s',
    working: '18 ÷ 6 = 3 half-lives → 800 → 400 → 200 → 100 counts/s',
    vary: {
      make: rand => {
        const unit = pick(rand, ['hours', 'days', 'minutes', 'years']);
        const half = rand(2, 12);
        const n = rand(1, 5);
        const start = 25 * 2 ** rand(n, 7);
        const chain = [start];
        for (let i = 0; i < n; i++) chain.push(chain[chain.length - 1] / 2);
        return {
          question: `A radioactive sample has a half-life of ${half} ${unit} and an initial activity of ${start} counts/s. What is its activity after ${half * n} ${unit}?`,
          answer: `${exact(start / 2 ** n)} counts/s`,
          working: `${half * n} ÷ ${half} = ${n} half-li${n === 1 ? 'fe' : 'ves'} → ${chain.map(exact).join(' → ')} counts/s`,
        };
      },
    },
  },
  {
    id: 'op-20-2-04', difficulty: 'hard',
    question: 'The activity of a sample falls from 640 counts/s to 80 counts/s in 15 days. Find the half-life.',
    answer: '5 days',
    working: '640 → 320 → 160 → 80 is 3 half-lives in 15 days → half-life = 15 ÷ 3 = 5 days',
    vary: {
      make: rand => {
        const n = rand(2, 5);
        const half = rand(2, 20);
        const end = 5 * rand(2, 20);
        const start = end * 2 ** n;
        const chain = [start];
        for (let i = 0; i < n; i++) chain.push(chain[chain.length - 1] / 2);
        const unit = pick(rand, ['days', 'hours', 'minutes']);
        return {
          question: `The activity of a sample falls from ${start} counts/s to ${end} counts/s in ${half * n} ${unit}. Find the half-life.`,
          answer: `${half} ${unit}`,
          working: `${chain.join(' → ')} is ${n} half-lives in ${half * n} ${unit} → half-life = ${half * n} ÷ ${n} = ${half} ${unit}`,
        };
      },
    },
  },
  {
    id: 'op-20-2-05', difficulty: 'medium',
    question: 'What does it mean that radioactive decay is random and spontaneous?',
    answer: 'Random: it is impossible to predict which nucleus will decay next, or when. Spontaneous: decay is not affected by outside conditions such as temperature, pressure or chemical reactions.',
  },
  {
    id: 'op-20-2-06', difficulty: 'easy',
    question: 'Define half-life.',
    answer: 'The time taken for half of the radioactive nuclei in a sample to decay (or for the activity to fall to half its value).',
  },
]);

const p20c = deck('Dangers and uses of radioactivity', [
  {
    id: 'op-20-3-01', difficulty: 'easy',
    question: 'What is background radiation? Give two sources.',
    answer: 'Low-level radiation that is always present around us. Sources: radon gas from rocks, cosmic rays from space, food and drink, medical X-rays, building materials.',
  },
  {
    id: 'op-20-3-02', difficulty: 'medium',
    question: 'Give three safety precautions when handling radioactive sources.',
    answer: 'Handle them with long tongs, never with bare hands; keep them in lead-lined boxes when not in use; keep as far away as possible and minimise exposure time; wear protective clothing and a radiation badge (dosimeter).',
  },
  {
    id: 'op-20-3-03', difficulty: 'hard',
    question: 'Which type of radiation is used in each, and why: a smoke detector, a paper-thickness gauge, sterilising medical equipment?',
    answer: 'Smoke detector: alpha — strongly ionising but short range, and easily absorbed by smoke.\nThickness gauge: beta — partly absorbed by paper, so the reading changes with thickness.\nSterilising: gamma — highly penetrating, kills bacteria through the packaging.',
  },
  {
    id: 'op-20-3-04', difficulty: 'medium',
    question: 'Why is alpha radiation most dangerous inside the body but least dangerous outside it?',
    answer: 'Outside, alpha cannot get through the dead outer layer of skin. Inside (if swallowed or breathed in), it is strongly ionising and deposits all its energy in nearby cells, causing severe damage.',
  },
  {
    id: 'op-20-3-05', difficulty: 'medium',
    question: 'How is a radioactive tracer used in medicine, and what type of source should it be?',
    answer: 'A small amount is injected or swallowed and its radiation is detected outside the body to show how an organ is working. It should emit gamma (penetrates out of the body) and have a short half-life (hours), so it does not stay active in the body for long.',
  },
]);

// ---------- All O Level Physics decks (keys match data/syllabus.js) ----------
export const oLevelPhysicsDecks = {
  ...topicDecks(1, [p1a, p1b, p1c]),
  ...topicDecks(2, [p2a, p2b, p2c]),
  ...topicDecks(3, [p3a, p3b, p3c, p3d]),
  ...topicDecks(4, [p4a, p4b, p4c]),
  ...topicDecks(5, [p5a, p5b]),
  ...topicDecks(6, [p6a, p6b, p6c]),
  ...topicDecks(7, [p7a, p7b]),
  ...topicDecks(8, [p8a, p8b, p8c, p8d]),
  ...topicDecks(9, [p9a, p9b, p9c, p9d]),
  ...topicDecks(10, [p10a, p10b, p10c]),
  ...topicDecks(11, [p11a, p11b, p11c]),
  ...topicDecks(12, [p12a, p12b, p12c]),
  ...topicDecks(13, [p13a, p13b, p13c]),
  ...topicDecks(14, [p14a, p14b, p14c]),
  ...topicDecks(15, [p15a, p15b, p15c]),
  ...topicDecks(16, [p16a, p16b, p16c]),
  ...topicDecks(17, [p17a, p17b, p17c]),
  ...topicDecks(18, [p18a, p18b, p18c]),
  ...topicDecks(19, [p19a, p19b, p19c]),
  ...topicDecks(20, [p20a, p20b, p20c]),
};
