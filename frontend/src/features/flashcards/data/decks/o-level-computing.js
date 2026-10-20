// O Level Computing 7155 (Singapore-Cambridge GCE O Level, 2026) — all Computing decks.
// Lives at: src/features/flashcards/data/decks/o-level-computing.js
//
//   M1 Computing Fundamentals       1.1 – 1.3
//   M2 Algorithms and Programming   2.1 – 2.6
//   M3 Spreadsheets                 3.1 – 3.2
//   M4 Networking                   4.1 – 4.3
//   M5 Impact of Computing          5.1 – 5.4
//
// Cards with numbers or code have a "vary" recipe: make(rand) returns a new { question, answer, working },
// and the answer is worked out in code, so it is always right.

import { deck, pick, withCommas } from './helpers.js';

// ---------- Small helpers ----------

// A shuffled copy of a list (uses the random helper so recipes stay testable).
function shuffle(rand, list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = rand(0, i);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// n different whole numbers between lo and hi
function distinct(rand, n, lo, hi) {
  return shuffle(rand, Array.from({ length: hi - lo + 1 }, (_, i) => lo + i)).slice(0, n);
}

// 182 → "10110110" (8 bits)
const bin8 = n => n.toString(2).padStart(8, '0');

// "10110110" → "1011 0110" (easier to read)
const nibbles = bits => bits.replace(/(\d{4})(?=\d)/g, '$1 ');

// 182 → "128 + 32 + 16 + 4 + 2"
function placeValues(n) {
  const parts = [];
  for (let v = 128; v >= 1; v /= 2) if (n & v) parts.push(v);
  return parts.join(' + ');
}

const hex = n => n.toString(16).toUpperCase();

// Python list text: [3, 1, 4] → "[3, 1, 4]"
const pyList = list => `[${list.join(', ')}]`;

// =====================================================================
// M1 Computing Fundamentals
// =====================================================================

const cpt11 = deck('1.1 Computer Architecture', [
  {
    id: 'cpt-11-01', difficulty: 'easy',
    question: 'What does the processor (CPU) do?',
    answer: 'It fetches instructions from memory, decodes them and executes them, carrying out the calculations and logical decisions that run programs.',
  },
  {
    id: 'cpt-11-02', difficulty: 'easy',
    question: 'What is the difference between main memory and secondary storage?',
    answer: 'Main memory (RAM) holds the programs and data the processor is using right now; it is fast but volatile (cleared when the power is off).\nSecondary storage (e.g. hard disk, SSD, USB drive) keeps data permanently (non-volatile) and holds much more, but is slower.',
  },
  {
    id: 'cpt-11-03', difficulty: 'easy',
    question: 'Compare RAM and ROM.',
    answer: 'RAM: volatile, can be read and written, holds the programs and data currently in use.\nROM: non-volatile, normally read-only, holds instructions needed to start the computer (firmware).',
  },
  {
    id: 'cpt-11-04', difficulty: 'medium',
    question: 'Compare magnetic, solid-state and optical secondary storage.',
    answer: 'Magnetic (hard disk): large capacity, cheap per GB, but has moving parts so it is slower and more fragile.\nSolid-state (SSD, USB flash drive): no moving parts, fast, durable, uses less power, but costs more per GB.\nOptical (CD, DVD, Blu-ray): cheap and portable, but small capacity and slow.',
  },
  {
    id: 'cpt-11-05', difficulty: 'medium',
    question: 'What do the address bus and the data bus carry?',
    answer: 'Address bus: the memory address (location) the processor wants to read from or write to — one direction, from the processor.\nData bus: the actual data or instruction being transferred — both directions between the processor and memory.',
  },
  {
    id: 'cpt-11-06', difficulty: 'easy',
    question: 'Give two input devices and two output devices.',
    answer: 'Input: keyboard, mouse, touchscreen, microphone, scanner, camera, sensors.\nOutput: monitor, printer, speakers, projector, actuators such as motors.',
  },
  {
    id: 'cpt-11-07', difficulty: 'medium',
    question: 'How many bytes are in 3 MB, using 1 MB = 1,000,000 bytes? How many bits is that?',
    answer: '3,000,000 bytes = 24,000,000 bits',
    working: '3 × 1,000,000 = 3,000,000 bytes; × 8 bits per byte = 24,000,000 bits',
    vary: {
      make: rand => {
        const [unit, size] = pick(rand, [['kB', 1000], ['MB', 1000000], ['GB', 1000000000]]);
        const n = rand(2, 9);
        return {
          question: `How many bytes are in ${n} ${unit}, using 1 ${unit} = ${withCommas(size)} bytes? How many bits is that?`,
          answer: `${withCommas(n * size)} bytes = ${withCommas(n * size * 8)} bits`,
          working: `${n} × ${withCommas(size)} = ${withCommas(n * size)} bytes; × 8 bits per byte = ${withCommas(n * size * 8)} bits`,
        };
      },
    },
  },
  {
    id: 'cpt-11-08', difficulty: 'medium',
    question: 'A 2 GB memory card stores photos of 4 MB each (1 GB = 1000 MB). How many photos fit?',
    answer: '500',
    working: '2 GB = 2000 MB → 2000 ÷ 4 = 500 photos',
    vary: {
      make: rand => {
        const gb = pick(rand, [1, 2, 4, 8, 16, 32]);
        const mb = pick(rand, [2, 4, 5, 8, 10, 16, 20, 25]);
        const total = gb * 1000;
        return {
          question: `${aOrAnWord(gb)} ${gb} GB memory card stores photos of ${mb} MB each (1 GB = 1000 MB). How many photos fit?`,
          answer: withCommas(Math.floor(total / mb)),
          working: `${gb} GB = ${withCommas(total)} MB → ${withCommas(total)} ÷ ${mb} = ${withCommas(total / mb)}${Number.isInteger(total / mb) ? '' : ` → only whole photos fit, so ${withCommas(Math.floor(total / mb))}`}`,
        };
      },
    },
  },
  {
    id: 'cpt-11-09', difficulty: 'easy',
    question: 'Put these units in order of size, smallest first: kilobyte, bit, terabyte, byte, gigabyte, megabyte.',
    answer: 'bit, byte, kilobyte, megabyte, gigabyte, terabyte',
    working: '8 bits = 1 byte; each of kB → MB → GB → TB is 1000 times bigger than the one before',
  },
]);

// "A" or "An" at the start of a sentence, before a number (an 8 GB card)
function aOrAnWord(n) {
  return /^(8|11(\D|$)|18(\D|$))/.test(String(n)) ? 'An' : 'A';
}

const cpt12 = deck('1.2 Data Representation', [
  {
    id: 'cpt-12-01', difficulty: 'easy',
    question: 'Convert the binary number 1011 0110 to denary.',
    answer: '182',
    working: '128 + 32 + 16 + 4 + 2 = 182',
    vary: {
      make: rand => {
        const n = rand(1, 255);
        return { question: `Convert the binary number ${nibbles(bin8(n))} to denary.`, answer: String(n), working: `${placeValues(n)} = ${n}` };
      },
    },
  },
  {
    id: 'cpt-12-02', difficulty: 'easy',
    question: 'Convert the denary number 77 to 8-bit binary.',
    answer: '0100 1101',
    working: '77 = 64 + 8 + 4 + 1',
    vary: {
      make: rand => {
        const n = rand(1, 255);
        return { question: `Convert the denary number ${n} to 8-bit binary.`, answer: nibbles(bin8(n)), working: `${n} = ${placeValues(n)}` };
      },
    },
  },
  {
    id: 'cpt-12-03', difficulty: 'medium',
    question: 'Convert the hexadecimal number 3F to denary.',
    answer: '63',
    working: '3 × 16 + 15 = 63 (F = 15)',
    vary: {
      make: rand => {
        const n = rand(17, 255);
        const [hi, lo] = [Math.floor(n / 16), n % 16];
        return {
          question: `Convert the hexadecimal number ${hex(n)} to denary.`,
          answer: String(n),
          working: `${hi} × 16 + ${lo} = ${n}${lo >= 10 ? ` (${hex(lo)} = ${lo})` : ''}`,
        };
      },
    },
  },
  {
    id: 'cpt-12-04', difficulty: 'medium',
    question: 'Convert the denary number 200 to hexadecimal.',
    answer: 'C8',
    working: '200 ÷ 16 = 12 remainder 8 → 12 = C, so C8',
    vary: {
      make: rand => {
        const n = rand(17, 255);
        const [hi, lo] = [Math.floor(n / 16), n % 16];
        return {
          question: `Convert the denary number ${n} to hexadecimal.`,
          answer: hex(n),
          working: `${n} ÷ 16 = ${hi} remainder ${lo} → ${hex(hi)}${hex(lo)}`,
        };
      },
    },
  },
  {
    id: 'cpt-12-05', difficulty: 'medium',
    question: 'Convert the binary number 1110 0101 to hexadecimal.',
    answer: 'E5',
    working: 'Split into groups of 4 bits: 1110 = E (14), 0101 = 5',
    vary: {
      make: rand => {
        const n = rand(1, 255);
        const bits = bin8(n);
        const [a, b] = [bits.slice(0, 4), bits.slice(4)];
        return {
          question: `Convert the binary number ${nibbles(bits)} to hexadecimal.`,
          answer: hex(n).padStart(2, '0'),
          working: `Split into groups of 4 bits: ${a} = ${hex(parseInt(a, 2))} (${parseInt(a, 2)}), ${b} = ${hex(parseInt(b, 2))} (${parseInt(b, 2)})`,
        };
      },
    },
  },
  {
    id: 'cpt-12-06', difficulty: 'easy',
    question: 'Why is hexadecimal often used instead of binary?',
    answer: 'It is much shorter and easier for people to read and write without mistakes, and each hex digit stands for exactly 4 bits, so converting to binary is simple (e.g. colour codes, MAC addresses).',
  },
  {
    id: 'cpt-12-07', difficulty: 'easy',
    question: 'What is the largest denary number that can be stored in 6 bits, and how many different values can 6 bits store?',
    answer: 'Largest 63; 64 different values',
    working: '2⁶ = 64 values, from 0 to 2⁶ − 1 = 63',
    vary: {
      make: rand => {
        const n = rand(2, 12);
        return {
          question: `What is the largest denary number that can be stored in ${n} bits, and how many different values can ${n} bits store?`,
          answer: `Largest ${withCommas(2 ** n - 1)}; ${withCommas(2 ** n)} different values`,
          working: `2^${n} = ${withCommas(2 ** n)} values, from 0 to 2^${n} − 1 = ${withCommas(2 ** n - 1)}`,
        };
      },
    },
  },
  {
    id: 'cpt-12-08', difficulty: 'medium',
    question: 'In ASCII, "A" is 65. What is the ASCII code of "E", and which character has code 72?',
    answer: '"E" is 69; 72 is "H"',
    working: 'Capital letters are in order from A = 65: E is 4 after A → 69; 72 − 65 = 7 letters after A → H',
    vary: {
      make: rand => {
        const lower = rand(0, 1) === 1;
        const base = lower ? 97 : 65;
        const first = lower ? 'a' : 'A';
        const [i, j] = distinct(rand, 2, 1, 25);
        const ch = String.fromCharCode(base + i);
        const code = base + j;
        return {
          question: `In ASCII, "${first}" is ${base}. What is the ASCII code of "${ch}", and which character has code ${code}?`,
          answer: `"${ch}" is ${base + i}; ${code} is "${String.fromCharCode(code)}"`,
          working: `${lower ? 'Small' : 'Capital'} letters are in order from ${first} = ${base}: ${ch} is ${i} after ${first} → ${base + i}; ${code} − ${base} = ${j} letters after ${first} → ${String.fromCharCode(code)}`,
        };
      },
    },
  },
  {
    id: 'cpt-12-09', difficulty: 'hard',
    question: 'Add the 8-bit binary numbers 0110 1011 and 0011 0110. Give the result in binary.',
    answer: '1010 0001',
    working: '107 + 54 = 161 = 1010 0001 (no overflow, since 161 ≤ 255)',
    vary: {
      make: rand => {
        const a = rand(1, 200);
        const b = rand(1, 200);
        const total = a + b;
        const overflow = total > 255;
        return {
          question: `Add the 8-bit binary numbers ${nibbles(bin8(a))} and ${nibbles(bin8(b))}. Give the result in binary.`,
          answer: overflow ? `1 ${nibbles(bin8(total - 256))} — overflow: the 9th bit does not fit in 8 bits` : nibbles(bin8(total)),
          working: `${a} + ${b} = ${total}${overflow ? ' > 255, so the answer needs 9 bits (overflow)' : ` = ${nibbles(bin8(total))} (no overflow, since ${total} ≤ 255)`}`,
        };
      },
    },
  },
]);

// ---------- 1.3 Logic Gates ----------

const GATES = {
  AND: (a, b) => a & b,
  OR: (a, b) => a | b,
  NAND: (a, b) => 1 - (a & b),
  NOR: (a, b) => 1 - (a | b),
  XOR: (a, b) => a ^ b,
};

// Boolean expressions with a matching JavaScript rule, for random evaluation questions.
const EXPRESSIONS = [
  ['(A AND B) OR C', (A, B, C) => (A & B) | C],
  ['A AND (NOT B)', (A, B) => A & (1 - B)],
  ['NOT (A OR B)', (A, B) => 1 - (A | B)],
  ['(A OR B) AND (NOT C)', (A, B, C) => (A | B) & (1 - C)],
  ['(A XOR B) AND C', (A, B, C) => (A ^ B) & C],
  ['NOT A OR (B AND C)', (A, B, C) => (1 - A) | (B & C)],
  ['(A AND B) XOR C', (A, B, C) => (A & B) ^ C],
];

const cpt13 = deck('1.3 Logic Gates', [
  {
    id: 'cpt-13-01', difficulty: 'easy',
    question: 'What is the output of an AND gate and of an OR gate when the inputs are 1 and 0?',
    answer: 'AND: 0. OR: 1.',
    working: 'AND outputs 1 only if both inputs are 1; OR outputs 1 if at least one input is 1',
    vary: {
      make: rand => {
        const [g1, g2] = shuffle(rand, Object.keys(GATES)).slice(0, 2);
        const [a, b] = [rand(0, 1), rand(0, 1)];
        const rule = {
          AND: 'AND is 1 only if both inputs are 1',
          OR: 'OR is 1 if at least one input is 1',
          NAND: 'NAND is NOT AND: 0 only if both inputs are 1',
          NOR: 'NOR is NOT OR: 1 only if both inputs are 0',
          XOR: 'XOR is 1 only if the inputs are different',
        };
        return {
          question: `What is the output of ${aOrAnGate(g1)} ${g1} gate and of ${aOrAnGate(g2)} ${g2} gate when the inputs are ${a} and ${b}?`,
          answer: `${g1}: ${GATES[g1](a, b)}. ${g2}: ${GATES[g2](a, b)}.`,
          working: `${rule[g1]}; ${rule[g2]}`,
        };
      },
    },
  },
  {
    id: 'cpt-13-02', difficulty: 'medium',
    question: 'If A = 1, B = 0 and C = 1, what is the output of (A AND B) OR C?',
    answer: '1',
    working: 'A AND B = 1 AND 0 = 0, then 0 OR 1 = 1',
    vary: {
      make: rand => {
        const [text, fn] = pick(rand, EXPRESSIONS);
        const [A, B, C] = [rand(0, 1), rand(0, 1), rand(0, 1)];
        const uses = text.includes('C') ? `A = ${A}, B = ${B} and C = ${C}` : `A = ${A} and B = ${B}`;
        return {
          question: `If ${uses}, what is the output of ${text}?`,
          answer: String(fn(A, B, C)),
          working: `Substitute the values and work out the brackets first: ${text.replace(/\bA\b/g, A).replace(/\bB\b/g, B).replace(/\bC\b/g, C)} = ${fn(A, B, C)}`,
        };
      },
    },
  },
  {
    id: 'cpt-13-03', difficulty: 'easy',
    question: 'How many rows does a truth table need for a circuit with 3 inputs?',
    answer: '8',
    working: 'Each input can be 0 or 1: 2³ = 8 combinations',
    vary: {
      make: rand => {
        const n = rand(1, 5);
        return {
          question: `How many rows does a truth table need for a circuit with ${n} input${n === 1 ? '' : 's'}?`,
          answer: String(2 ** n),
          working: `Each input can be 0 or 1: 2^${n} = ${2 ** n} combinations`,
        };
      },
    },
  },
  {
    id: 'cpt-13-04', difficulty: 'medium',
    question: 'Complete the truth table for X = A AND (NOT B).',
    answer: 'A B | X\n0 0 | 0\n0 1 | 0\n1 0 | 1\n1 1 | 0',
    working: 'X is 1 only when A is 1 and B is 0',
    vary: {
      make: rand => {
        const [text, fn] = pick(rand, EXPRESSIONS.filter(([t]) => !t.includes('C')));
        const rows = [[0, 0], [0, 1], [1, 0], [1, 1]].map(([A, B]) => `${A} ${B} | ${fn(A, B)}`);
        return {
          question: `Complete the truth table for X = ${text}.`,
          answer: ['A B | X', ...rows].join('\n'),
          working: 'Work out X for each of the 4 combinations of A and B',
        };
      },
    },
  },
  {
    id: 'cpt-13-05', difficulty: 'medium',
    question: 'Inputs A and B go into an OR gate, and its output goes into a NOT gate. Write the Boolean expression. Which single gate does the same job?',
    answer: 'X = NOT (A OR B) — a NOR gate.',
  },
  {
    id: 'cpt-13-06', difficulty: 'hard',
    question: 'An alarm (X) sounds when the door is open (D = 1) and the system is armed (S = 1), or when the panic button is pressed (P = 1). Write the Boolean expression.',
    answer: 'X = (D AND S) OR P',
  },
  {
    id: 'cpt-13-07', difficulty: 'medium',
    question: 'Describe what each of the six logic gates outputs.',
    answer: 'NOT: the opposite of its single input.\nAND: 1 only if both inputs are 1.\nOR: 1 if at least one input is 1.\nNAND: 0 only if both inputs are 1.\nNOR: 1 only if both inputs are 0.\nXOR: 1 only if the inputs are different.',
  },
  {
    id: 'cpt-13-08', difficulty: 'medium',
    question: 'Why are NAND and NOR called universal gates?',
    answer: 'Any other logic gate — and so any logic circuit — can be built using only NAND gates (or only NOR gates).',
  },
]);

// "an AND gate", "a NOR gate"
function aOrAnGate(name) {
  return /^[AEIOU]/.test(name) ? 'an' : 'a';
}

// =====================================================================
// M2 Algorithms and Programming
// =====================================================================

const cpt21 = deck('2.1 Problem Analysis', [
  {
    id: 'cpt-21-01', difficulty: 'easy',
    question: 'What does "input–process–output" mean when analysing a problem?',
    answer: 'Identify the inputs (data the program receives), the processing (what it does with the data) and the outputs (results it produces). This makes the requirements clear before designing a solution.',
  },
  {
    id: 'cpt-21-02', difficulty: 'easy',
    question: 'What is decomposition?',
    answer: 'Breaking a large, complex problem into smaller sub-problems that are easier to understand and solve, possibly separately.',
  },
  {
    id: 'cpt-21-03', difficulty: 'easy',
    question: 'What is abstraction?',
    answer: 'Removing unnecessary details and keeping only the information that matters for solving the problem (e.g. a train map shows stations and lines, not real distances).',
  },
  {
    id: 'cpt-21-04', difficulty: 'medium',
    question: 'A program calculates the average of a student\'s test scores. Identify the inputs, processing and output.',
    answer: 'Input: the test scores (and how many there are).\nProcess: add the scores and divide by the number of scores.\nOutput: the average score.',
  },
  {
    id: 'cpt-21-05', difficulty: 'medium',
    question: 'Why should the requirements of a problem be clearly stated before writing code?',
    answer: 'So that the solution solves the right problem: everyone agrees what the program must do, what data it handles and how success will be tested, which avoids wasted work and costly changes later.',
  },
  {
    id: 'cpt-21-06', difficulty: 'medium',
    question: 'What is pattern recognition in computational thinking?',
    answer: 'Spotting similarities or repeated steps within or between problems, so the same solution (e.g. a loop or a function) can be reused.',
  },
]);

const cpt22 = deck('2.2 Constructs', [
  {
    id: 'cpt-22-01', difficulty: 'easy',
    question: 'Name the three basic programming constructs.',
    answer: 'Sequence (steps run one after another), selection (choosing a path with if/else) and iteration (repeating steps with loops).',
  },
  {
    id: 'cpt-22-02', difficulty: 'medium',
    question: 'What is the difference between a count-controlled loop and a condition-controlled loop?',
    answer: 'Count-controlled (for loop): repeats a fixed, known number of times.\nCondition-controlled (while loop): repeats as long as a condition is true, so the number of repetitions may not be known in advance.',
  },
  {
    id: 'cpt-22-03', difficulty: 'easy',
    question: 'What do the flowchart symbols mean: oval, parallelogram, rectangle, diamond?',
    answer: 'Oval: start / end.\nParallelogram: input / output.\nRectangle: process.\nDiamond: decision (yes/no).',
  },
  {
    id: 'cpt-22-04', difficulty: 'easy',
    question: 'Give the most suitable Python data type for: a person\'s age, a price, a name, whether a light is on.',
    answer: 'Age: int. Price: float. Name: str. Light on: bool.',
  },
  {
    id: 'cpt-22-05', difficulty: 'medium',
    question: 'What is the difference between a variable and a constant?',
    answer: 'A variable is a named storage location whose value can change while the program runs. A constant holds a value that should not change (e.g. GST_RATE = 0.09), which makes code easier to read and update.',
  },
  {
    id: 'cpt-22-06', difficulty: 'medium',
    question: 'What is nesting? Give an example.',
    answer: 'Placing one construct inside another, e.g. an if statement inside a loop, or a loop inside another loop (to go through rows and columns).',
  },
  {
    id: 'cpt-22-07', difficulty: 'medium',
    question: 'A loop runs for i in range(2, 11, 3). How many times does it repeat, and what values does i take?',
    answer: '3 times: 2, 5, 8',
    working: 'Start at 2, add 3 each time, stop before 11',
    vary: {
      make: rand => {
        const start = rand(0, 5);
        const step = rand(1, 4);
        const stop = start + rand(3, 14);
        const values = [];
        for (let i = start; i < stop; i += step) values.push(i);
        return {
          question: `A loop runs for i in range(${start}, ${stop}, ${step}). How many times does it repeat, and what values does i take?`,
          answer: `${values.length} time${values.length === 1 ? '' : 's'}: ${values.join(', ')}`,
          working: `Start at ${start}, add ${step} each time, stop before ${stop}`,
        };
      },
    },
  },
]);

// ---------- 2.3 Python Code (every recipe can be run in real Python to check it) ----------

const WORDS = ['COMPUTING', 'PYTHON', 'KEYBOARD', 'NETWORK', 'ALGORITHM', 'SPREADSHEET', 'BINARY', 'VARIABLE'];
const codeQuestion = lines => `What is printed by this code?\n${lines.join('\n')}`;

const cpt23 = deck('2.3 Python Code', [
  {
    id: 'cpt-23-01', difficulty: 'easy',
    question: codeQuestion(['total = 0', 'for i in range(1, 5):', '    total = total + i', 'print(total)']),
    answer: '10',
    working: 'i takes 1, 2, 3, 4 → 1 + 2 + 3 + 4 = 10',
    vary: {
      make: rand => {
        const a = rand(0, 5);
        const b = a + rand(3, 7);
        const step = pick(rand, [1, 1, 2]);
        const values = [];
        for (let i = a; i < b; i += step) values.push(i);
        const total = values.reduce((s, v) => s + v, 0);
        return {
          question: codeQuestion(['total = 0', `for i in range(${a}, ${b}${step === 1 ? '' : `, ${step}`}):`, '    total = total + i', 'print(total)']),
          answer: String(total),
          working: `i takes ${values.join(', ')} → ${values.join(' + ')} = ${total}`,
        };
      },
    },
  },
  {
    id: 'cpt-23-02', difficulty: 'medium',
    question: codeQuestion(['word = "COMPUTING"', 'print(word[2:5])', 'print(word[-1])']),
    answer: 'MPU\nG',
    working: 'Index from 0: C0 O1 M2 P3 U4 … [2:5] takes indexes 2, 3, 4. [-1] is the last character',
    vary: {
      make: rand => {
        const word = pick(rand, WORDS);
        const i = rand(0, word.length - 3);
        const j = rand(i + 1, word.length);
        const k = rand(1, word.length);
        return {
          question: codeQuestion([`word = "${word}"`, `print(word[${i}:${j}])`, `print(word[-${k}])`]),
          answer: `${word.slice(i, j)}\n${word[word.length - k]}`,
          working: `Index from 0. [${i}:${j}] takes indexes ${i} to ${j - 1}. [-${k}] counts ${k} from the end`,
        };
      },
    },
  },
  {
    id: 'cpt-23-03', difficulty: 'easy',
    question: codeQuestion(['a = 17', 'b = 5', 'print(a // b, a % b)']),
    answer: '3 2',
    working: '// is whole-number division: 17 ÷ 5 = 3 remainder 2; % gives the remainder',
    vary: {
      make: rand => {
        const b = rand(2, 9);
        const a = rand(b + 1, 60);
        return {
          question: codeQuestion([`a = ${a}`, `b = ${b}`, 'print(a // b, a % b)']),
          answer: `${Math.floor(a / b)} ${a % b}`,
          working: `// is whole-number division: ${a} ÷ ${b} = ${Math.floor(a / b)} remainder ${a % b}; % gives the remainder`,
        };
      },
    },
  },
  {
    id: 'cpt-23-04', difficulty: 'medium',
    question: codeQuestion(['n = 3', 'count = 0', 'while n < 50:', '    n = n * 2', '    count = count + 1', 'print(count, n)']),
    answer: '5 96',
    working: 'n: 3 → 6 → 12 → 24 → 48 → 96 (5 doublings; 96 is not < 50, so the loop stops)',
    vary: {
      make: rand => {
        const start = rand(1, 9);
        const factor = pick(rand, [2, 3]);
        const limit = pick(rand, [20, 30, 50, 100, 200]);
        let n = start;
        let count = 0;
        const trail = [n];
        while (n < limit) { n *= factor; count++; trail.push(n); }
        return {
          question: codeQuestion([`n = ${start}`, 'count = 0', `while n < ${limit}:`, `    n = n * ${factor}`, '    count = count + 1', 'print(count, n)']),
          answer: `${count} ${n}`,
          working: `n: ${trail.join(' → ')} (${count} time${count === 1 ? '' : 's'}; ${n} is not < ${limit}, so the loop stops)`,
        };
      },
    },
  },
  {
    id: 'cpt-23-05', difficulty: 'medium',
    question: codeQuestion(['nums = [4, 9, 2, 7]', 'nums.append(5)', 'print(len(nums), nums[1] + nums[-1])']),
    answer: '5 14',
    working: 'After append: [4, 9, 2, 7, 5] → length 5; nums[1] = 9 and nums[-1] = 5 → 14',
    vary: {
      make: rand => {
        const list = Array.from({ length: rand(3, 6) }, () => rand(1, 20));
        const extra = rand(1, 20);
        const after = [...list, extra];
        const i = rand(0, list.length - 1);
        return {
          question: codeQuestion([`nums = ${pyList(list)}`, `nums.append(${extra})`, `print(len(nums), nums[${i}] + nums[-1])`]),
          answer: `${after.length} ${after[i] + extra}`,
          working: `After append: ${pyList(after)} → length ${after.length}; nums[${i}] = ${after[i]} and nums[-1] = ${extra} → ${after[i] + extra}`,
        };
      },
    },
  },
  {
    id: 'cpt-23-06', difficulty: 'easy',
    question: codeQuestion(['score = 67', 'if score >= 70:', '    print("A")', 'elif score >= 50:', '    print("B")', 'else:', '    print("C")']),
    answer: 'B',
    working: '67 >= 70 is False; 67 >= 50 is True → prints B (the else is skipped)',
    vary: {
      make: rand => {
        const [hi, lo] = [pick(rand, [70, 75, 80]), pick(rand, [40, 50, 55])];
        const score = rand(20, 100);
        const out = score >= hi ? 'A' : score >= lo ? 'B' : 'C';
        return {
          question: codeQuestion([`score = ${score}`, `if score >= ${hi}:`, '    print("A")', `elif score >= ${lo}:`, '    print("B")', 'else:', '    print("C")']),
          answer: out,
          working: `${score} >= ${hi} is ${score >= hi ? 'True → A' : `False; ${score} >= ${lo} is ${score >= lo ? 'True → B' : 'False → else → C'}`}`,
        };
      },
    },
  },
  {
    id: 'cpt-23-07', difficulty: 'medium',
    question: codeQuestion(['def area(length, width):', '    return length * width', '', 'print(area(4, 3) + 2)']),
    answer: '14',
    working: 'area(4, 3) returns 12, then 12 + 2 = 14',
    vary: {
      make: rand => {
        const [l, w, c] = [rand(2, 12), rand(2, 12), rand(1, 20)];
        return {
          question: codeQuestion(['def area(length, width):', '    return length * width', '', `print(area(${l}, ${w}) + ${c})`]),
          answer: String(l * w + c),
          working: `area(${l}, ${w}) returns ${l * w}, then ${l * w} + ${c} = ${l * w + c}`,
        };
      },
    },
  },
  {
    id: 'cpt-23-08', difficulty: 'medium',
    question: codeQuestion(['count = 0', 'for i in range(3):', '    for j in range(4):', '        count = count + 1', 'print(count)']),
    answer: '12',
    working: 'The inner loop runs 4 times for each of the 3 outer passes: 3 × 4 = 12',
    vary: {
      make: rand => {
        const [a, b] = [rand(2, 6), rand(2, 6)];
        return {
          question: codeQuestion(['count = 0', `for i in range(${a}):`, `    for j in range(${b}):`, '        count = count + 1', 'print(count)']),
          answer: String(a * b),
          working: `The inner loop runs ${b} times for each of the ${a} outer passes: ${a} × ${b} = ${a * b}`,
        };
      },
    },
  },
  {
    id: 'cpt-23-09', difficulty: 'hard',
    question: 'The user types 5 when this code runs. What is printed?\nx = input("Number: ")\nprint(x * 2)\nprint(int(x) * 2)',
    answer: '55\n10',
    working: 'input() always returns a string: "5" * 2 repeats it → "55". int(x) converts it to the number 5 → 10',
    vary: {
      make: rand => {
        const d = rand(1, 9);
        const k = rand(2, 3);
        return {
          question: `The user types ${d} when this code runs. What is printed?\nx = input("Number: ")\nprint(x * ${k})\nprint(int(x) * ${k})`,
          answer: `${String(d).repeat(k)}\n${d * k}`,
          working: `input() always returns a string: "${d}" * ${k} repeats it → "${String(d).repeat(k)}". int(x) converts it to the number ${d} → ${d * k}`,
        };
      },
    },
  },
  {
    id: 'cpt-23-10', difficulty: 'medium',
    question: codeQuestion(['word = "Network"', 'print(word.upper(), len(word))']),
    answer: 'NETWORK 7',
    working: '.upper() makes every letter a capital; len() counts the characters',
    vary: {
      make: rand => {
        const raw = pick(rand, WORDS);
        const word = raw[0] + raw.slice(1).toLowerCase();
        const method = pick(rand, ['upper', 'lower']);
        return {
          question: codeQuestion([`word = "${word}"`, `print(word.${method}(), len(word))`]),
          answer: `${method === 'upper' ? word.toUpperCase() : word.toLowerCase()} ${word.length}`,
          working: `.${method}() makes every letter ${method === 'upper' ? 'a capital' : 'small'}; len() counts the characters`,
        };
      },
    },
  },
  {
    id: 'cpt-23-11', difficulty: 'easy',
    question: 'What is the purpose of indentation in Python?',
    answer: 'Indentation shows which statements belong to a block — the body of an if, loop or function. Wrong indentation causes an IndentationError or changes what the program does.',
  },
]);

// ---------- 2.4 Testing and Debugging ----------

const cpt24 = deck('2.4 Testing and Debugging', [
  {
    id: 'cpt-24-01', difficulty: 'easy',
    question: 'Explain the difference between a syntax error, a logic error and a run-time error.',
    answer: 'Syntax error: the code breaks the rules of the language, so it will not run (e.g. a missing colon).\nLogic error: the program runs but gives the wrong result (e.g. using + instead of −).\nRun-time error: the program crashes while running (e.g. dividing by zero).',
  },
  {
    id: 'cpt-24-02', difficulty: 'medium',
    question: 'A program accepts whole-number marks from 0 to 100. Classify the test value 100 as normal, boundary or erroneous data.',
    answer: 'Boundary',
    working: '100 is valid and sits exactly on the edge of the allowed range',
    vary: {
      make: rand => {
        const [lo, hi] = pick(rand, [[0, 100], [1, 10], [18, 65], [1, 31], [0, 50], [10, 99]]);
        const kind = pick(rand, ['normal', 'boundary', 'erroneous']);
        let value;
        if (kind === 'normal') value = rand(lo + 1, hi - 1);
        else if (kind === 'boundary') value = pick(rand, [lo, hi]);
        else value = pick(rand, [lo - rand(1, 5), hi + rand(1, 5), `"ten"`]);
        if (typeof value === 'number' && value < 0) value = `−${-value}`; // proper minus sign
        const reason = {
          normal: `${value} is well inside the range ${lo}–${hi}, so it should be accepted`,
          boundary: `${value} is valid and sits exactly on the edge of the allowed range`,
          erroneous: `${value} is outside the range or the wrong type, so it should be rejected`,
        }[kind];
        return {
          question: `A program accepts whole numbers from ${lo} to ${hi}. Classify the test value ${value} as normal, boundary or erroneous data.`,
          answer: kind[0].toUpperCase() + kind.slice(1),
          working: reason,
        };
      },
    },
  },
  {
    id: 'cpt-24-03', difficulty: 'medium',
    question: 'What is a trace table used for?',
    answer: 'To follow (dry-run) an algorithm step by step by recording the value of each variable after every line or loop pass. It helps find logic errors and check what the program outputs.',
  },
  {
    id: 'cpt-24-04', difficulty: 'medium',
    question: 'Name four types of validation check and what each does.',
    answer: 'Range check: the value is between limits.\nLength check: the input has an allowed number of characters.\nPresence check: the field is not left empty.\nFormat (type) check: the data has the right pattern or type (e.g. a date as DD/MM/YYYY).\n(Also: check digit, existence/lookup check.)',
  },
  {
    id: 'cpt-24-05', difficulty: 'medium',
    question: 'What is the difference between validation and verification?',
    answer: 'Validation checks that data is sensible and follows the rules (e.g. within range); it cannot tell whether the data is actually correct.\nVerification checks that data has been entered or copied accurately (e.g. typing a password twice, or proofreading).',
  },
  {
    id: 'cpt-24-06', difficulty: 'easy',
    question: 'Give two ways to find a logic error in a program.',
    answer: 'Use a trace table (dry run), add print statements to show the values of variables, use a debugger to step through line by line, or test with data whose correct output you already know.',
  },
  {
    id: 'cpt-24-07', difficulty: 'hard',
    question: 'This code should print the sum of 1 to 10, but prints 45. Find and fix the error.\ntotal = 0\nfor i in range(1, 10):\n    total = total + i\nprint(total)',
    answer: 'range(1, 10) stops before 10, so 10 is never added. Change it to range(1, 11).',
    working: 'This is a logic error (an "off-by-one" error): 1 + 2 + … + 9 = 45',
  },
]);

// ---------- 2.5 Algorithm Design ----------

// The values a binary search compares against, in order (0-based, mid = (low + high) // 2).
function binarySearchTrace(list, target) {
  const compared = [];
  let [low, high] = [0, list.length - 1];
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    compared.push(list[mid]);
    if (list[mid] === target) break;
    if (list[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return compared;
}

const cpt25 = deck('2.5 Algorithm Design', [
  {
    id: 'cpt-25-01', difficulty: 'easy',
    question: 'How does a linear search work?',
    answer: 'It checks each item in the list in order, from the first, until it finds the target or reaches the end. It works on unsorted lists but can be slow for long lists.',
  },
  {
    id: 'cpt-25-02', difficulty: 'medium',
    question: 'How does a binary search work, and what does it need?',
    answer: 'The list must be sorted. Compare the target with the middle item: if equal, stop; if the target is smaller, search the left half; if bigger, search the right half. Repeat until found or no items are left. Each step halves the search area.',
  },
  {
    id: 'cpt-25-03', difficulty: 'medium',
    question: 'A linear search looks for 23 in [8, 15, 4, 23, 42, 16]. How many comparisons does it make?',
    answer: '4',
    working: 'It checks 8, 15, 4, 23 — found on the 4th comparison',
    vary: {
      make: rand => {
        const list = distinct(rand, rand(5, 8), 1, 60);
        const found = rand(0, 3) > 0;
        const target = found ? pick(rand, list) : pick(rand, Array.from({ length: 60 }, (_, i) => i + 1).filter(v => !list.includes(v)));
        const position = list.indexOf(target);
        const checked = found ? list.slice(0, position + 1) : list;
        return {
          question: `A linear search looks for ${target} in ${pyList(list)}. How many comparisons does it make?`,
          answer: found ? String(position + 1) : `${list.length} (it is not in the list)`,
          working: found
            ? `It checks ${checked.join(', ')} — found on comparison ${position + 1}`
            : `It checks all ${list.length} items without finding ${target}`,
        };
      },
    },
  },
  {
    id: 'cpt-25-04', difficulty: 'hard',
    question: 'A binary search (middle = (low + high) // 2) looks for 42 in [3, 8, 15, 23, 42, 50, 61]. Which values are compared, in order?',
    answer: '23, 50, 42',
    working: 'Middle index 3 → 23 (too small, go right); then indexes 4–6, middle 5 → 50 (too big, go left); then index 4 → 42 (found)',
    vary: {
      make: rand => {
        const list = distinct(rand, pick(rand, [7, 9, 11, 15]), 1, 99).sort((a, b) => a - b);
        const target = pick(rand, list);
        const compared = binarySearchTrace(list, target);
        return {
          question: `A binary search (middle = (low + high) // 2) looks for ${target} in ${pyList(list)}. Which values are compared, in order?`,
          answer: compared.join(', '),
          working: `Compare with the middle item; go right if it is too small, left if too big — found after ${compared.length} comparison${compared.length === 1 ? '' : 's'}`,
        };
      },
    },
  },
  {
    id: 'cpt-25-05', difficulty: 'hard',
    question: 'Show the list [5, 1, 4, 2, 8] after the first pass of a bubble sort (ascending).',
    answer: '[1, 4, 2, 5, 8]',
    working: 'Compare neighbours and swap if in the wrong order: (5,1) swap, (5,4) swap, (5,2) swap, (5,8) no swap',
    vary: {
      make: rand => {
        const list = distinct(rand, rand(5, 6), 1, 30);
        const a = [...list];
        const steps = [];
        for (let i = 0; i < a.length - 1; i++) {
          const swap = a[i] > a[i + 1];
          steps.push(`(${a[i]},${a[i + 1]}) ${swap ? 'swap' : 'no swap'}`);
          if (swap) [a[i], a[i + 1]] = [a[i + 1], a[i]];
        }
        return {
          question: `Show the list ${pyList(list)} after the first pass of a bubble sort (ascending).`,
          answer: pyList(a),
          working: `Compare neighbours and swap if in the wrong order: ${steps.join(', ')}`,
        };
      },
    },
  },
  {
    id: 'cpt-25-06', difficulty: 'medium',
    question: 'Why is binary search usually faster than linear search on a long sorted list?',
    answer: 'Each comparison halves the number of items left to check, so even 1000 items need at most about 10 comparisons, while a linear search might need 1000.',
  },
  {
    id: 'cpt-25-07', difficulty: 'medium',
    question: 'Write an algorithm (in steps) to find the largest number in a list.',
    answer: 'Set largest to the first item. For each remaining item: if it is bigger than largest, set largest to that item. After the loop, output largest.',
  },
  {
    id: 'cpt-25-08', difficulty: 'easy',
    question: 'What is pseudocode, and why is it used?',
    answer: 'A way of writing an algorithm in structured, English-like steps that is not tied to any programming language. It lets you plan the logic before coding and is easy for others to read.',
  },
]);

// ---------- 2.6 Software Engineering ----------

const cpt26 = deck('2.6 Software Engineering', [
  {
    id: 'cpt-26-01', difficulty: 'easy',
    question: 'List the main stages in developing a program.',
    answer: 'Gather requirements / analyse the problem → design → develop (write the code) → test → deploy (release) → maintain (fix and improve). The stages are often repeated.',
  },
  {
    id: 'cpt-26-02', difficulty: 'medium',
    question: 'Give three benefits of splitting a program into modules (functions).',
    answer: 'Any three: easier to read and understand; each part can be tested separately; code can be reused; several people can work on different modules; easier to fix and update.',
  },
  {
    id: 'cpt-26-03', difficulty: 'easy',
    question: 'Give three ways to make code easier for others to maintain.',
    answer: 'Use meaningful variable and function names; add comments explaining what the code does; use consistent indentation and layout; use constants instead of "magic numbers"; split the code into functions.',
  },
  {
    id: 'cpt-26-04', difficulty: 'medium',
    question: 'What is the difference between an iterative approach and a waterfall approach to development?',
    answer: 'Waterfall: each stage is finished once, in order, before the next starts — simple but hard to change later.\nIterative: build, test and get feedback in short repeated cycles, improving the program each time — copes well with changing requirements.',
  },
  {
    id: 'cpt-26-05', difficulty: 'medium',
    question: 'Why is user feedback important when developing software?',
    answer: 'Users show whether the program actually meets their needs and is easy to use; feedback finds problems early, when they are cheaper to fix.',
  },
  {
    id: 'cpt-26-06', difficulty: 'medium',
    question: 'What does maintenance of software involve?',
    answer: 'Fixing bugs found after release, updating the program for new requirements or systems (e.g. new laws, devices or security issues), and improving performance.',
  },
]);

// =====================================================================
// M3 Spreadsheets
// =====================================================================

const COLS = 'ABCDEFGHIJ';

// Moves every cell reference in a formula as if it were copied by (dc columns, dr rows).
// A $ in front of the column or row keeps that part fixed: A2 → C4, $A$2 → $A$2, $A2 → $A4, A$2 → C$2
function shiftFormula(formula, dc, dr) {
  return formula.replace(/(\$?)([A-J])(\$?)(\d+)/g, (m, colAbs, col, rowAbs, row) => {
    const newCol = colAbs ? col : COLS[COLS.indexOf(col) + dc];
    const newRow = rowAbs ? Number(row) : Number(row) + dr;
    return `${colAbs}${newCol}${rowAbs}${newRow}`;
  });
}

// "A2:A7" holding a list of values, for function questions
const valuesText = (range, list) => `${range} contains ${list.join(', ')}`;

// Spreadsheet ROUND (halves round away from zero), using thousandths to avoid floating-point slips.
function roundThousandths(k, places) {
  const unit = 10 ** (3 - places);
  const sign = k < 0 ? -1 : 1;
  const rounded = sign * Math.floor((Math.abs(k) + unit / 2) / unit) * unit;
  return (rounded / 1000).toFixed(places);
}

const cpt31 = deck('3.1 Program Features', [
  {
    id: 'cpt-31-01', difficulty: 'easy',
    question: 'What is the difference between a cell reference and a range?',
    answer: 'A cell reference identifies one cell by column and row (e.g. B3). A range is a block of cells from one corner to the other (e.g. B3:D7).',
  },
  {
    id: 'cpt-31-02', difficulty: 'medium',
    question: 'Explain relative, absolute and mixed cell references.',
    answer: 'Relative (A1): changes when the formula is copied.\nAbsolute ($A$1): never changes when copied.\nMixed ($A1 or A$1): only the part with the $ stays fixed.',
  },
  {
    id: 'cpt-31-03', difficulty: 'hard',
    question: 'Cell C2 contains =A2*$B$1. It is copied to cell C5. What formula is in C5?',
    answer: '=A5*$B$1',
    working: 'Copying moves 3 rows down: relative A2 → A5; absolute $B$1 stays the same',
    vary: {
      make: rand => {
        const template = pick(rand, ['=A{r}*$B$1', '=B{r}+C{r}', '=$A{r}*B$1', '=SUM(A{r}:C{r})', '=A{r}/$E$2', '=A$1+$B{r}']);
        const [srcCol, srcRow] = [rand(3, 5), rand(2, 4)];
        const formula = template.replace(/\{r\}/g, srcRow);
        const [dc, dr] = [rand(0, 3), rand(0, 5)];
        const fromCell = `${COLS[srcCol]}${srcRow}`;
        const toCell = `${COLS[srcCol + dc]}${srcRow + dr}`;
        const moved = [dc && `${dc} column${dc === 1 ? '' : 's'} right`, dr && `${dr} row${dr === 1 ? '' : 's'} down`].filter(Boolean).join(' and ') || 'nowhere';
        return {
          question: `Cell ${fromCell} contains ${formula}. It is copied to cell ${toCell}. What formula is in ${toCell}?`,
          answer: shiftFormula(formula, dc, dr),
          working: `Copying moves ${moved}: relative parts move by the same amount; parts with a $ stay fixed`,
        };
      },
    },
  },
  {
    id: 'cpt-31-04', difficulty: 'easy',
    question: 'What is conditional formatting?',
    answer: 'Formatting (e.g. colour) that is applied to a cell automatically when its value meets a condition, such as marks below 50 turning red.',
  },
  {
    id: 'cpt-31-05', difficulty: 'medium',
    question: 'What is data validation in a spreadsheet, and why use it?',
    answer: 'A rule that limits what can be entered in a cell (e.g. a whole number from 0 to 100, or a choice from a drop-down list). It reduces data-entry errors.',
  },
  {
    id: 'cpt-31-06', difficulty: 'medium',
    question: 'What does goal seek do?',
    answer: 'It works backwards: you set the result you want for a formula cell, and it finds the input value needed to reach it (e.g. the exam mark needed for an average of 75).',
  },
  {
    id: 'cpt-31-07', difficulty: 'easy',
    question: 'What is the difference between sorting and filtering data?',
    answer: 'Sorting rearranges all the rows into an order (e.g. A–Z or highest first). Filtering temporarily hides the rows that do not meet a condition, without deleting them.',
  },
  {
    id: 'cpt-31-08', difficulty: 'medium',
    question: 'A1 = 4, B1 = 3 and C1 = 2. What does =A1+B1*C1^2 give?',
    answer: '16',
    working: 'Powers first: C1^2 = 4; then multiply: 3 × 4 = 12; then add: 4 + 12 = 16',
    vary: {
      make: rand => {
        const [a, b, c] = [rand(1, 9), rand(1, 9), rand(1, 5)];
        const form = pick(rand, ['plus', 'brackets']);
        if (form === 'plus') {
          return {
            question: `A1 = ${a}, B1 = ${b} and C1 = ${c}. What does =A1+B1*C1^2 give?`,
            answer: String(a + b * c * c),
            working: `Powers first: C1^2 = ${c * c}; then multiply: ${b} × ${c * c} = ${b * c * c}; then add: ${a} + ${b * c * c} = ${a + b * c * c}`,
          };
        }
        return {
          question: `A1 = ${a}, B1 = ${b} and C1 = ${c}. What does =(A1+B1)*C1 give?`,
          answer: String((a + b) * c),
          working: `Brackets first: ${a} + ${b} = ${a + b}; then × ${c} = ${(a + b) * c}`,
        };
      },
    },
  },
  {
    id: 'cpt-31-09', difficulty: 'easy',
    question: 'Which type of chart is best for showing how a value changes over time, and which for comparing parts of a whole?',
    answer: 'Change over time: line chart. Parts of a whole: pie chart. (Comparing separate categories: bar/column chart.)',
  },
]);

const cpt32 = deck('3.2 Functions', [
  {
    id: 'cpt-32-01', difficulty: 'easy',
    question: 'B2 contains 48. What does =IF(B2>=50,"Pass","Fail") show?',
    answer: 'Fail',
    working: '48 >= 50 is FALSE, so the second value is shown',
    vary: {
      make: rand => {
        const pass = rand(40, 60);
        const v = rand(pass - 15, pass + 15);
        return {
          question: `B2 contains ${v}. What does =IF(B2>=${pass},"Pass","Fail") show?`,
          answer: v >= pass ? 'Pass' : 'Fail',
          working: `${v} >= ${pass} is ${v >= pass ? 'TRUE, so the first value is shown' : 'FALSE, so the second value is shown'}`,
        };
      },
    },
  },
  {
    id: 'cpt-32-02', difficulty: 'medium',
    question: 'A2:A7 contains 45, 67, 50, 82, 39, 50. What does =COUNTIF(A2:A7,">=50") give?',
    answer: '4',
    working: 'Values that are 50 or more: 67, 50, 82, 50 → 4',
    vary: {
      make: rand => {
        const list = Array.from({ length: 6 }, () => rand(30, 95));
        const [op, limit] = [pick(rand, ['>=', '>', '<', '<=']), rand(45, 70)];
        const test = { '>=': v => v >= limit, '>': v => v > limit, '<': v => v < limit, '<=': v => v <= limit }[op];
        const hits = list.filter(test);
        return {
          question: `A2:A7 contains ${list.join(', ')}. What does =COUNTIF(A2:A7,"${op}${limit}") give?`,
          answer: String(hits.length),
          working: `Values that are ${op} ${limit}: ${hits.length ? hits.join(', ') : 'none'} → ${hits.length}`,
        };
      },
    },
  },
  {
    id: 'cpt-32-03', difficulty: 'medium',
    question: 'A2:A6 contains Apple, Pear, Apple, Kiwi, Apple and B2:B6 contains 3, 5, 2, 4, 6. What does =SUMIF(A2:A6,"Apple",B2:B6) give?',
    answer: '11',
    working: 'Add the B values on rows where A is Apple: 3 + 2 + 6 = 11',
    vary: {
      make: rand => {
        const fruits = ['Apple', 'Pear', 'Kiwi'];
        const names = Array.from({ length: 5 }, () => pick(rand, fruits));
        const nums = Array.from({ length: 5 }, () => rand(1, 12));
        const target = pick(rand, names);
        const picked = nums.filter((_, i) => names[i] === target);
        return {
          question: `A2:A6 contains ${names.join(', ')} and B2:B6 contains ${nums.join(', ')}. What does =SUMIF(A2:A6,"${target}",B2:B6) give?`,
          answer: String(picked.reduce((s, v) => s + v, 0)),
          working: `Add the B values on rows where A is ${target}: ${picked.join(' + ')} = ${picked.reduce((s, v) => s + v, 0)}`,
        };
      },
    },
  },
  {
    id: 'cpt-32-04', difficulty: 'easy',
    question: 'C2:C6 contains 12, 7, 15, 9, 7. What do =AVERAGE(C2:C6), =MAX(C2:C6) and =MIN(C2:C6) give?',
    answer: 'AVERAGE 10, MAX 15, MIN 7',
    working: '(12 + 7 + 15 + 9 + 7) ÷ 5 = 50 ÷ 5 = 10',
    vary: {
      make: rand => {
        let list;
        do { list = Array.from({ length: 5 }, () => rand(1, 30)); } while (list.reduce((s, v) => s + v, 0) % 5 !== 0);
        const total = list.reduce((s, v) => s + v, 0);
        return {
          question: `C2:C6 contains ${list.join(', ')}. What do =AVERAGE(C2:C6), =MAX(C2:C6) and =MIN(C2:C6) give?`,
          answer: `AVERAGE ${total / 5}, MAX ${Math.max(...list)}, MIN ${Math.min(...list)}`,
          working: `(${list.join(' + ')}) ÷ 5 = ${total} ÷ 5 = ${total / 5}`,
        };
      },
    },
  },
  {
    id: 'cpt-32-05', difficulty: 'medium',
    question: 'What does =ROUND(3.14159,2) give?',
    answer: '3.14',
    working: 'Keep 2 decimal places; the next digit is 1 (< 5), so round down',
    vary: {
      make: rand => {
        const k = rand(1001, 99999); // the number in thousandths
        const places = rand(0, 2);
        const value = (k / 1000).toFixed(3);
        return {
          question: `What does =ROUND(${value},${places}) give?`,
          answer: roundThousandths(k, places),
          working: `Keep ${places} decimal place${places === 1 ? '' : 's'}; look at the next digit — 5 or more rounds up`,
        };
      },
    },
  },
  {
    id: 'cpt-32-06', difficulty: 'medium',
    question: 'A1 contains "SINGAPORE". What do =LEFT(A1,3), =MID(A1,4,3) and =LEN(A1) give?',
    answer: 'SIN, GAP, 9',
    working: 'LEFT takes the first 3 characters; MID starts at character 4 and takes 3; LEN counts the characters',
    vary: {
      make: rand => {
        const word = pick(rand, ['SINGAPORE', 'COMPUTING', 'KEYBOARD', 'NETWORK', 'SPREADSHEET', 'PASSWORD', 'INTERNET']);
        const n = rand(2, 4);
        const start = rand(2, word.length - 2);
        const len = rand(2, Math.min(4, word.length - start + 1));
        const r = rand(2, 4);
        return {
          question: `A1 contains "${word}". What do =LEFT(A1,${n}), =MID(A1,${start},${len}), =RIGHT(A1,${r}) and =LEN(A1) give?`,
          answer: `${word.slice(0, n)}, ${word.slice(start - 1, start - 1 + len)}, ${word.slice(-r)}, ${word.length}`,
          working: `LEFT takes the first ${n}; MID starts at character ${start} and takes ${len}; RIGHT takes the last ${r}; LEN counts all ${word.length} characters`,
        };
      },
    },
  },
  {
    id: 'cpt-32-07', difficulty: 'hard',
    question: 'A2:C5 holds codes, items and prices:\nP1, Pen, 1.50\nP2, File, 3.20\nP3, Ruler, 0.80\nP4, Glue, 2.10\nWhat does =VLOOKUP("P3",A2:C5,3,FALSE) give?',
    answer: '0.80',
    working: 'Find "P3" in the first column (row 3 of the table), then return the value in column 3 of that row',
    vary: {
      make: rand => {
        const items = shuffle(rand, ['Pen', 'File', 'Ruler', 'Glue', 'Eraser', 'Tape', 'Stapler']).slice(0, 4);
        const prices = items.map(() => (rand(30, 990) / 100).toFixed(2));
        const k = rand(0, 3);
        const col = rand(2, 3);
        const rows = items.map((item, i) => `P${i + 1}, ${item}, ${prices[i]}`);
        return {
          question: `A2:C5 holds codes, items and prices:\n${rows.join('\n')}\nWhat does =VLOOKUP("P${k + 1}",A2:C5,${col},FALSE) give?`,
          answer: col === 2 ? items[k] : prices[k],
          working: `Find "P${k + 1}" in the first column (row ${k + 1} of the table), then return the value in column ${col} of that row`,
        };
      },
    },
  },
  {
    id: 'cpt-32-08', difficulty: 'hard',
    question: 'B2 = 55 and C2 = 42. What does =IF(AND(B2>=50,C2>=50),"Promoted","Retained") show?',
    answer: 'Retained',
    working: 'B2>=50 is TRUE but C2>=50 is FALSE; AND needs both TRUE → FALSE → second value',
    vary: {
      make: rand => {
        const fn = pick(rand, ['AND', 'OR']);
        const [b, c] = [rand(30, 80), rand(30, 80)];
        const [t1, t2] = [b >= 50, c >= 50];
        const result = fn === 'AND' ? t1 && t2 : t1 || t2;
        return {
          question: `B2 = ${b} and C2 = ${c}. What does =IF(${fn}(B2>=50,C2>=50),"Promoted","Retained") show?`,
          answer: result ? 'Promoted' : 'Retained',
          working: `B2>=50 is ${t1 ? 'TRUE' : 'FALSE'}, C2>=50 is ${t2 ? 'TRUE' : 'FALSE'}; ${fn} needs ${fn === 'AND' ? 'both' : 'at least one'} TRUE → ${result ? 'TRUE → first value' : 'FALSE → second value'}`,
        };
      },
    },
  },
  {
    id: 'cpt-32-09', difficulty: 'medium',
    question: 'What is the difference between COUNT and COUNTA?',
    answer: 'COUNT counts only the cells that contain numbers. COUNTA counts every cell that is not empty (numbers, text, etc.).',
  },
  {
    id: 'cpt-32-10', difficulty: 'medium',
    question: 'What do the errors #DIV/0! and #N/A mean?',
    answer: '#DIV/0!: the formula tried to divide by zero (or by an empty cell).\n#N/A: a value was not available — e.g. VLOOKUP could not find the search value.',
  },
]);

// =====================================================================
// M4 Networking
// =====================================================================

// Number of 1s in a bit string
const ones = bits => [...bits].filter(b => b === '1').length;

const cpt41 = deck('4.1 Concepts', [
  {
    id: 'cpt-41-01', difficulty: 'easy',
    question: 'What is the difference between a LAN and a WAN?',
    answer: 'LAN (local area network): covers a small area such as a home, school or office, usually owned by one organisation.\nWAN (wide area network): covers a large geographical area, linking LANs together (the internet is the largest WAN).',
  },
  {
    id: 'cpt-41-02', difficulty: 'medium',
    question: 'Compare a client–server network with a peer-to-peer network.',
    answer: 'Client–server: central servers provide services (files, email, logins) to clients; easier to manage, back up and secure, but the server is costly and a single point of failure.\nPeer-to-peer: every computer is equal and shares resources directly; cheap and simple, but harder to manage and secure.',
  },
  {
    id: 'cpt-41-03', difficulty: 'easy',
    question: 'What is a protocol? Give an example.',
    answer: 'A set of rules that devices follow to communicate, covering the format, timing and error handling of data. Examples: TCP/IP, HTTP, HTTPS, SMTP.',
  },
  {
    id: 'cpt-41-04', difficulty: 'medium',
    question: 'The 7 data bits 1011001 are sent using even parity. What parity bit is added?',
    answer: '0',
    working: 'The data has four 1s, which is already even, so the parity bit is 0',
    vary: {
      make: rand => {
        const bits = Array.from({ length: 7 }, () => rand(0, 1)).join('');
        const even = rand(0, 1) === 1;
        const count = ones(bits);
        const bit = even ? count % 2 : 1 - (count % 2);
        return {
          question: `The 7 data bits ${bits} are sent using ${even ? 'even' : 'odd'} parity. What parity bit is added?`,
          answer: String(bit),
          working: `The data has ${count} one${count === 1 ? '' : 's'}; the total number of 1s must be ${even ? 'even' : 'odd'}, so the parity bit is ${bit}`,
        };
      },
    },
  },
  {
    id: 'cpt-41-05', difficulty: 'medium',
    question: 'A system uses even parity. The byte 1101 0110 is received. Has an error been detected?',
    answer: 'Error detected',
    working: 'The byte has five 1s, which is odd, but even parity needs an even number of 1s',
    vary: {
      make: rand => {
        const bits = Array.from({ length: 8 }, () => rand(0, 1)).join('');
        const even = rand(0, 1) === 1;
        const count = ones(bits);
        const ok = even ? count % 2 === 0 : count % 2 === 1;
        return {
          question: `A system uses ${even ? 'even' : 'odd'} parity. The byte ${nibbles(bits)} is received. Has an error been detected?`,
          answer: ok ? 'No error detected' : 'Error detected',
          working: `The byte has ${count} one${count === 1 ? '' : 's'}, which is ${count % 2 === 0 ? 'even' : 'odd'}; ${even ? 'even' : 'odd'} parity ${ok ? 'is satisfied' : 'is broken'}`,
        };
      },
    },
  },
  {
    id: 'cpt-41-06', difficulty: 'medium',
    question: 'Why can a parity check miss some errors?',
    answer: 'If two bits (or any even number of bits) are flipped, the number of 1s stays even/odd, so the parity still looks correct. Parity also cannot tell which bit is wrong.',
  },
  {
    id: 'cpt-41-07', difficulty: 'medium',
    question: 'Describe a checksum and an echo check.',
    answer: 'Checksum: the sender calculates a value from the data and sends it too; the receiver recalculates it, and a mismatch means an error.\nEcho check: the receiver sends the data back to the sender, who compares it with the original.',
  },
  {
    id: 'cpt-41-08', difficulty: 'hard',
    question: 'How long does it take to send a 50 MB file over a 20 Mbps connection? (1 MB = 1,000,000 bytes, 1 Mbps = 1,000,000 bits per second)',
    answer: '20 seconds',
    working: '50 MB × 8 = 400 megabits → 400 ÷ 20 = 20 s',
    vary: {
      make: rand => {
        const speed = pick(rand, [5, 8, 10, 16, 20, 25, 40, 50, 100]);
        const seconds = rand(2, 60);
        const megabits = speed * seconds;
        if (megabits % 8 !== 0) {
          const mb = Math.ceil(megabits / 8);
          const time = (mb * 8) / speed;
          return {
            question: `How long does it take to send ${aOrAnNumber(mb)} ${mb} MB file over ${aOrAnNumber(speed)} ${speed} Mbps connection? (1 MB = 1,000,000 bytes, 1 Mbps = 1,000,000 bits per second)`,
            answer: `${Number(time.toFixed(2))} seconds`,
            working: `${mb} MB × 8 = ${mb * 8} megabits → ${mb * 8} ÷ ${speed} = ${Number(time.toFixed(2))} s`,
          };
        }
        const mb = megabits / 8;
        return {
          question: `How long does it take to send ${aOrAnNumber(mb)} ${mb} MB file over ${aOrAnNumber(speed)} ${speed} Mbps connection? (1 MB = 1,000,000 bytes, 1 Mbps = 1,000,000 bits per second)`,
          answer: `${seconds} seconds`,
          working: `${mb} MB × 8 = ${megabits} megabits → ${megabits} ÷ ${speed} = ${seconds} s`,
        };
      },
    },
  },
  {
    id: 'cpt-41-09', difficulty: 'medium',
    question: 'What is packet switching?',
    answer: 'Data is split into small packets, each with a header holding the destination address and sequence number. Packets may travel by different routes and are put back in order at the destination.',
  },
  {
    id: 'cpt-41-10', difficulty: 'easy',
    question: 'Give one advantage and one disadvantage of a wireless network compared with a wired one.',
    answer: 'Advantage: devices can move around and no cables are needed.\nDisadvantage: usually slower and less reliable (interference, range), and easier to intercept, so it needs encryption.',
  },
]);

// "a" or "an" before a number in the middle of a sentence (an 8 MB file)
function aOrAnNumber(n) {
  return /^(8|11(\D|$)|18(\D|$))/.test(String(n)) ? 'an' : 'a';
}

const cpt42 = deck('4.2 Home Networks and the Internet', [
  {
    id: 'cpt-42-01', difficulty: 'easy',
    question: 'What does a router do in a home network?',
    answer: 'It connects the home network (LAN) to the internet, forwards data packets to the right devices using IP addresses, and usually gives each device an IP address.',
  },
  {
    id: 'cpt-42-02', difficulty: 'medium',
    question: 'What do a switch, a modem, a wireless access point and a network interface card (NIC) do?',
    answer: 'Switch: connects wired devices in a LAN and sends data only to the device it is meant for.\nModem: converts signals between the home network and the ISP\'s line.\nWireless access point: lets devices join the network by Wi-Fi.\nNIC: the hardware in each device that connects it to a network (it has a MAC address).',
  },
  {
    id: 'cpt-42-03', difficulty: 'medium',
    question: 'What is the difference between an IP address and a MAC address?',
    answer: 'IP address: a logical address given to a device on a network; it can change when the device moves to another network.\nMAC address: a fixed physical address burned into the network card by the manufacturer.',
  },
  {
    id: 'cpt-42-04', difficulty: 'medium',
    question: 'Is 192.168.1.256 a valid IPv4 address? Explain.',
    answer: 'No — each of the four numbers must be from 0 to 255, and 256 is too big.',
    vary: {
      make: rand => {
        const parts = Array.from({ length: 4 }, () => rand(0, 255));
        const kind = pick(rand, ['valid', 'valid', 'big', 'count']);
        if (kind === 'big') parts[rand(0, 3)] = rand(256, 999);
        if (kind === 'count') parts.splice(rand(0, 3), 1);
        const address = parts.join('.');
        const answer = kind === 'valid'
          ? 'Yes — it has four numbers, each from 0 to 255.'
          : kind === 'big'
            ? `No — each of the four numbers must be from 0 to 255, and ${Math.max(...parts)} is too big.`
            : 'No — an IPv4 address must have exactly four numbers.';
        return { question: `Is ${address} a valid IPv4 address? Explain.`, answer, working: '' };
      },
    },
  },
  {
    id: 'cpt-42-05', difficulty: 'easy',
    question: 'What does DNS do?',
    answer: 'The Domain Name System translates a domain name (e.g. www.moe.gov.sg) into the IP address of the server, so the browser can connect to it.',
  },
  {
    id: 'cpt-42-06', difficulty: 'medium',
    question: 'In the URL https://www.example.com/news/today.html, identify the protocol, the domain name and the path.',
    answer: 'Protocol: https. Domain name: www.example.com. Path: /news/today.html',
    vary: {
      make: rand => {
        const protocol = pick(rand, ['https', 'http']);
        const domain = pick(rand, ['www.example.com', 'www.school.edu.sg', 'shop.example.org', 'www.library.gov.sg', 'news.example.net']);
        const path = pick(rand, ['/news/today.html', '/index.html', '/books/search', '/about/contact.html', '/sale/items.php']);
        return {
          question: `In the URL ${protocol}://${domain}${path}, identify the protocol, the domain name and the path.`,
          answer: `Protocol: ${protocol}. Domain name: ${domain}. Path: ${path}`,
          working: '',
        };
      },
    },
  },
  {
    id: 'cpt-42-07', difficulty: 'medium',
    question: 'What is the difference between HTTP and HTTPS?',
    answer: 'Both are protocols for transferring web pages. HTTPS encrypts the data sent between the browser and the server, so passwords and payment details cannot easily be read if intercepted.',
  },
  {
    id: 'cpt-42-08', difficulty: 'easy',
    question: 'What is the difference between the internet and the World Wide Web?',
    answer: 'The internet is the worldwide network of connected networks (the hardware and connections). The World Wide Web is a service that runs on the internet: web pages linked by hyperlinks and accessed with a browser.',
  },
  {
    id: 'cpt-42-09', difficulty: 'easy',
    question: 'What is an ISP?',
    answer: 'An Internet Service Provider: a company that gives homes and organisations access to the internet, usually for a monthly fee.',
  },
]);

const cpt43 = deck('4.3 Security and Privacy', [
  {
    id: 'cpt-43-01', difficulty: 'easy',
    question: 'What is malware? Name three types.',
    answer: 'Malicious software designed to damage, disrupt or gain unauthorised access to a computer. Types: virus, worm, trojan horse, spyware, ransomware, adware.',
  },
  {
    id: 'cpt-43-02', difficulty: 'medium',
    question: 'What is the difference between a virus, a worm and a trojan horse?',
    answer: 'Virus: attaches itself to files and spreads when they are run or shared.\nWorm: copies itself across networks on its own, without a host file.\nTrojan horse: pretends to be useful software but carries hidden malicious code.',
  },
  {
    id: 'cpt-43-03', difficulty: 'medium',
    question: 'What is the difference between phishing and pharming?',
    answer: 'Phishing: fake emails or messages trick people into clicking a link and giving personal details.\nPharming: malicious code or a tampered DNS redirects users to a fake website even when they type the correct address.',
  },
  {
    id: 'cpt-43-04', difficulty: 'easy',
    question: 'What does a firewall do?',
    answer: 'It monitors traffic going into and out of a network or computer and blocks connections that break its security rules, helping to stop unauthorised access.',
  },
  {
    id: 'cpt-43-05', difficulty: 'medium',
    question: 'What is encryption, and does it stop data from being intercepted?',
    answer: 'Encryption scrambles data using a key so that only someone with the right key can read it. It does NOT stop interception — it makes intercepted data unreadable.',
  },
  {
    id: 'cpt-43-06', difficulty: 'easy',
    question: 'Give three features of a strong password.',
    answer: 'Any three: long (at least 12 characters); a mix of upper and lower case letters, numbers and symbols; not a dictionary word or personal information; different for each account.',
  },
  {
    id: 'cpt-43-07', difficulty: 'medium',
    question: 'What is two-factor authentication (2FA), and why is it more secure?',
    answer: 'Logging in needs two different kinds of proof, e.g. a password plus a one-time code sent to your phone. A stolen password alone is not enough to get in.',
  },
  {
    id: 'cpt-43-08', difficulty: 'medium',
    question: 'What is social engineering? Give an example.',
    answer: 'Manipulating people, rather than hacking computers, into giving away confidential information or access — e.g. a caller pretending to be from IT support asking for your password.',
  },
  {
    id: 'cpt-43-09', difficulty: 'medium',
    question: 'Why is it important to back up data regularly?',
    answer: 'So that data can be restored after hardware failure, accidental deletion, theft or a ransomware attack. Backups should be kept separately (e.g. off-site or in the cloud).',
  },
  {
    id: 'cpt-43-10', difficulty: 'medium',
    question: 'What does Singapore\'s Personal Data Protection Act (PDPA) require of organisations?',
    answer: 'They must get consent before collecting, using or disclosing personal data, use it only for the stated purpose, keep it accurate and protected, and not keep it longer than needed.',
  },
]);

// =====================================================================
// M5 Impact of Computing
// =====================================================================

const cpt51 = deck('5.1 General', [
  {
    id: 'cpt-51-01', difficulty: 'easy',
    question: 'Give two positive and two negative impacts of computers on society.',
    answer: 'Positive: faster communication, access to information and online learning, automation of dull or dangerous jobs, better healthcare.\nNegative: some jobs replaced, privacy concerns, cybercrime, screen addiction, e-waste.',
  },
  {
    id: 'cpt-51-02', difficulty: 'medium',
    question: 'What is the digital divide?',
    answer: 'The gap between people who have good access to computers, the internet and digital skills and those who do not (e.g. because of cost, age or location). It can leave people behind in education, work and access to services.',
  },
  {
    id: 'cpt-51-03', difficulty: 'medium',
    question: 'What is e-waste, and why is it a problem?',
    answer: 'Discarded electronic devices. They contain toxic materials (e.g. lead, mercury) that can pollute land and water if dumped, as well as valuable metals that are wasted unless recycled.',
  },
  {
    id: 'cpt-51-04', difficulty: 'easy',
    question: 'Give two health problems from heavy computer use and how to reduce them.',
    answer: 'Eye strain (take regular breaks, adjust screen brightness), repetitive strain injury (good posture, ergonomic keyboard and mouse), back pain (adjustable chair, correct desk height).',
  },
  {
    id: 'cpt-51-05', difficulty: 'medium',
    question: 'How can automation affect jobs?',
    answer: 'Some routine jobs (e.g. cashiers, data entry) are replaced, while new jobs are created (e.g. programmers, technicians). Workers may need to retrain and learn new digital skills.',
  },
  {
    id: 'cpt-51-06', difficulty: 'medium',
    question: 'Why is it important to check the reliability of information found online?',
    answer: 'Anyone can publish online, so information may be wrong, out of date or biased. Check the author, the date and the source, and compare with other trusted sources.',
  },
]);

const cpt52 = deck('5.2 Intellectual Property', [
  {
    id: 'cpt-52-01', difficulty: 'easy',
    question: 'What is intellectual property, and how does copyright protect it?',
    answer: 'Creations of the mind such as software, music, writing and art. Copyright gives the creator the legal right to control who can copy, share or change the work.',
  },
  {
    id: 'cpt-52-02', difficulty: 'medium',
    question: 'Explain proprietary software, freeware, shareware and open-source software.',
    answer: 'Proprietary: paid for; the source code is secret and copying is restricted.\nFreeware: free to use, but the source code is closed and it cannot be changed.\nShareware: free to try for a limited time or with limited features, then you pay.\nOpen source: the source code is available and can be studied, changed and shared under its licence.',
  },
  {
    id: 'cpt-52-03', difficulty: 'easy',
    question: 'What is software piracy?',
    answer: 'Copying, sharing or using software without a valid licence (e.g. installing a paid program on more computers than allowed). It is illegal and takes income from developers.',
  },
  {
    id: 'cpt-52-04', difficulty: 'easy',
    question: 'What is plagiarism?',
    answer: 'Presenting someone else\'s work or ideas as your own without giving credit. Avoid it by citing your sources.',
  },
  {
    id: 'cpt-52-05', difficulty: 'medium',
    question: 'What is a Creative Commons licence?',
    answer: 'A licence that lets creators allow others to use their work for free under conditions they choose, e.g. credit the author (BY), no commercial use (NC), or share changes under the same licence (SA).',
  },
  {
    id: 'cpt-52-06', difficulty: 'medium',
    question: 'What is a software licence agreement?',
    answer: 'The legal terms you accept when installing software, saying how it may be used — e.g. on how many computers, whether it can be copied or changed, and for how long.',
  },
]);

const cpt53 = deck('5.3 Communication', [
  {
    id: 'cpt-53-01', difficulty: 'easy',
    question: 'What is the difference between synchronous and asynchronous communication? Give an example of each.',
    answer: 'Synchronous: people communicate at the same time (video call, live chat).\nAsynchronous: messages are read and answered later (email, forum posts).',
  },
  {
    id: 'cpt-53-02', difficulty: 'medium',
    question: 'What is misinformation, and how can you avoid spreading it?',
    answer: 'False or misleading information shared, sometimes without bad intent. Check the source and date, look for the same news from trusted outlets, and think before forwarding.',
  },
  {
    id: 'cpt-53-03', difficulty: 'easy',
    question: 'What is cyberbullying? Give one way to respond to it.',
    answer: 'Using digital communication to harass, threaten or embarrass someone. Respond by not replying, keeping evidence (screenshots), blocking and reporting the person, and telling a trusted adult.',
  },
  {
    id: 'cpt-53-04', difficulty: 'easy',
    question: 'What is netiquette? Give two examples.',
    answer: 'Good manners online, e.g. be polite and respectful, do not type in ALL CAPITALS (it looks like shouting), respect privacy, and do not spam.',
  },
  {
    id: 'cpt-53-05', difficulty: 'medium',
    question: 'What is a digital footprint, and why should you be careful about it?',
    answer: 'The trail of data you leave online (posts, photos, searches). It can be permanent and seen by schools or employers, and can be used to target you, so think before posting.',
  },
  {
    id: 'cpt-53-06', difficulty: 'medium',
    question: 'Give one advantage and one disadvantage of social media for communication.',
    answer: 'Advantage: fast, cheap way to keep in touch and share information with many people.\nDisadvantage: misinformation spreads quickly, privacy risks, cyberbullying, and it can be addictive.',
  },
]);

const cpt54 = deck('5.4 Emerging Technologies', [
  {
    id: 'cpt-54-01', difficulty: 'easy',
    question: 'What is artificial intelligence (AI)?',
    answer: 'Computer systems that perform tasks normally needing human intelligence, such as recognising speech or images, translating languages and making decisions.',
  },
  {
    id: 'cpt-54-02', difficulty: 'medium',
    question: 'What is machine learning, and why does the training data matter?',
    answer: 'A type of AI where the computer learns patterns from examples (training data) instead of being given explicit rules. If the data is incomplete or biased, the model\'s decisions will be inaccurate or unfair.',
  },
  {
    id: 'cpt-54-03', difficulty: 'medium',
    question: 'What is the difference between virtual reality (VR) and augmented reality (AR)?',
    answer: 'VR places the user in a completely computer-generated world (using a headset). AR overlays digital information on the real world (e.g. through a phone camera).',
  },
  {
    id: 'cpt-54-04', difficulty: 'medium',
    question: 'What is the Internet of Things (IoT)? Give an example and a risk.',
    answer: 'Everyday objects with sensors that connect to the internet to collect and share data, e.g. smart lights, fitness trackers, smart meters. Risk: poor security can let hackers access devices or personal data.',
  },
  {
    id: 'cpt-54-05', difficulty: 'easy',
    question: 'What is cloud computing? Give one advantage and one disadvantage.',
    answer: 'Using storage and software on remote servers over the internet. Advantage: access from anywhere and no need to buy powerful hardware. Disadvantage: needs an internet connection, and data is held by another company.',
  },
  {
    id: 'cpt-54-06', difficulty: 'hard',
    question: 'Give two ethical issues raised by self-driving cars.',
    answer: 'Who is responsible in an accident (the owner, the manufacturer or the programmer); how the car should choose between harms in an unavoidable crash; loss of driving jobs; collection of location data.',
  },
  {
    id: 'cpt-54-07', difficulty: 'medium',
    question: 'How can generative AI tools (such as chatbots) be used responsibly by students?',
    answer: 'Use them to explain ideas or check work, not to copy answers; check their output, since it can be wrong; acknowledge AI use where required; and avoid entering personal or confidential data.',
  },
]);

// ---------- All O Level Computing decks (the keys are used by data/syllabus.js) ----------
export const oLevelComputingDecks = {
  'o-cpt-1-1': cpt11,
  'o-cpt-1-2': cpt12,
  'o-cpt-1-3': cpt13,
  'o-cpt-2-1': cpt21,
  'o-cpt-2-2': cpt22,
  'o-cpt-2-3': cpt23,
  'o-cpt-2-4': cpt24,
  'o-cpt-2-5': cpt25,
  'o-cpt-2-6': cpt26,
  'o-cpt-3-1': cpt31,
  'o-cpt-3-2': cpt32,
  'o-cpt-4-1': cpt41,
  'o-cpt-4-2': cpt42,
  'o-cpt-4-3': cpt43,
  'o-cpt-5-1': cpt51,
  'o-cpt-5-2': cpt52,
  'o-cpt-5-3': cpt53,
  'o-cpt-5-4': cpt54,
};
