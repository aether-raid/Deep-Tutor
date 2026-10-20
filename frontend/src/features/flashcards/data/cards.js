// Flashcard decks for the Flashcards page (mock study content, no real student data).
// Lives at: src/features/flashcards/data/cards.js
//
// Each deck is linked to a syllabus sub-topic in data/syllabus.js through its key
// (for example deck: 'ib-cs-a1-1'). A sub-topic with a deck shows GREEN (ready);
// a sub-topic without one shows GREY (locked).
//
// Each card: id, question, answer, difficulty ('easy' | 'medium' | 'hard').
// Optional:
//   working – shown under the answer, explains how to get there
//   vary    – a recipe that makes NEW cards with different numbers when the card is answered wrong.
//             make(rand) must return { question, answer, working }.
//             rand(min, max, step) gives a random whole number. Answers come from code, so they are always right.

// Seconds allowed per card, by difficulty.
export const TIME_LIMITS = {
  easy: 20,
  medium: 40,
  hard: 60,
};

// ---------- Small helpers used by the "vary" recipes ----------

// 182 → "1011 0110"
function toBinary8(n) {
  return n.toString(2).padStart(8, '0').replace(/(\d{4})(\d{4})/, '$1 $2');
}

// 182 → "128 + 32 + 16 + 4 + 2"
function placeValueSum(n) {
  const parts = [];
  for (let value = 128; value >= 1; value /= 2) {
    if (n & value) parts.push(value);
  }
  return parts.join(' + ');
}

// 6220800 → "6,220,800"
function withCommas(n) {
  return n.toLocaleString('en-US');
}

// "a" or "an" for the word or number that follows: aOrAn('80 m') → "an", aOrAn('octagon') → "an"
function aOrAn(next) {
  return /^([aeiou]|8|11(\D|$)|18(\D|$))/i.test(String(next)) ? 'an' : 'a';
}

// Picks one item from a list using the random helper.
function pick(rand, list) {
  return list[rand(0, list.length - 1)];
}

// Adds the sub-topic name to every card so the page can show it as a label.
function deck(topic, list) {
  return list.map(card => ({ topic, ...card }));
}

// ---------- IB Computer Science HL — A1 Computer Fundamentals ----------

const a1_1 = deck('A1.1 Computer hardware and operation', [
  {
    id: 'a11-01', difficulty: 'easy',
    question: 'What does the ALU (arithmetic logic unit) do?',
    answer: 'It carries out arithmetic operations (such as add and subtract) and logical operations (such as AND, OR, NOT and comparisons) on data.',
  },
  {
    id: 'a11-02', difficulty: 'medium',
    question: 'What is the role of the control unit (CU)?',
    answer: 'It decodes instructions and sends control signals that coordinate the ALU, registers, memory and input/output, so each instruction is carried out in the right order.',
  },
  {
    id: 'a11-03', difficulty: 'easy',
    question: 'What does the program counter (PC) hold?',
    answer: 'The memory address of the next instruction to be fetched.',
  },
  {
    id: 'a11-04', difficulty: 'medium',
    question: 'What is the difference between the MAR and the MDR?',
    answer: 'MAR (memory address register) holds the ADDRESS of the memory location being read or written.\nMDR (memory data register) holds the DATA or instruction just read from, or about to be written to, that address.',
  },
  {
    id: 'a11-05', difficulty: 'medium',
    question: 'Why does a CPU use cache memory?',
    answer: 'Cache is small, very fast memory on or near the CPU that keeps frequently used instructions and data, so the CPU waits less for slower RAM.',
  },
  {
    id: 'a11-06', difficulty: 'easy',
    question: 'Compare RAM and ROM.',
    answer: 'RAM: volatile, read/write, holds the programs and data currently in use.\nROM: non-volatile, normally read-only, holds firmware such as the start-up (boot) instructions.',
  },
  {
    id: 'a11-07', difficulty: 'medium',
    question: 'Why is a GPU well suited to graphics and machine learning?',
    answer: 'It has thousands of simpler cores that perform the same operation on many pieces of data at once (massive parallelism), which suits the matrix and vector maths used in graphics and machine learning.',
  },
  {
    id: 'a11-08', difficulty: 'hard',
    question: 'HL: Compare the design of a CPU with a GPU.',
    answer: 'CPU: a few powerful cores, large caches and complex control logic — optimised for low-latency, general-purpose, sequential tasks with lots of branching.\nGPU: many simple cores — optimised for high throughput on tasks that can be split into many identical parallel operations.',
  },
  {
    id: 'a11-09', difficulty: 'hard',
    question: 'Describe the fetch–decode–execute cycle.',
    answer: 'Fetch: the address in the PC is copied to the MAR, the instruction at that address is loaded into the MDR and then the instruction register, and the PC is incremented.\nDecode: the control unit interprets the instruction.\nExecute: the instruction is carried out (for example the ALU calculates or data is moved) and the result is stored.',
  },
  {
    id: 'a11-10', difficulty: 'hard',
    question: 'HL: What is pipelining and how does it help in multi-core processors?',
    answer: 'Pipelining overlaps the stages of different instructions: while one instruction executes, the next is decoded and another is fetched. Each core can run its own pipeline, so more instructions finish per unit of time (higher throughput).',
  },
  {
    id: 'a11-11', difficulty: 'medium',
    question: 'Compare an SSD with an HDD as secondary storage.',
    answer: 'SSD: flash memory, no moving parts — faster access, more durable, uses less power, but costs more per GB.\nHDD: magnetic spinning platters — slower and more fragile, but cheaper per GB with large capacities.',
  },
  {
    id: 'a11-12', difficulty: 'medium',
    question: 'What is the difference between lossless and lossy compression?',
    answer: 'Lossless: the original data can be rebuilt exactly (e.g. run-length encoding, ZIP, PNG) — needed for text and program files.\nLossy: some less important data is permanently removed to make files much smaller (e.g. JPEG, MP3) — used for images, audio and video.',
  },
  {
    id: 'a11-13', difficulty: 'medium',
    question: 'Explain IaaS, PaaS and SaaS in cloud computing.',
    answer: 'IaaS: rent virtual machines, storage and networks and manage everything above them (e.g. AWS EC2).\nPaaS: a ready platform to build and deploy apps without managing servers (e.g. Google App Engine).\nSaaS: complete software used over the internet (e.g. Google Docs).',
  },
]);

const a1_2 = deck('A1.2 Data representation and computer logic', [
  {
    id: 'a12-01', difficulty: 'medium',
    question: 'Convert the binary number 1011 0110 to denary.',
    answer: '182',
    working: '128 + 32 + 16 + 4 + 2 = 182',
    vary: {
      make: rand => {
        const n = rand(1, 255);
        return { question: `Convert the binary number ${toBinary8(n)} to denary.`, answer: String(n), working: `${placeValueSum(n)} = ${n}` };
      },
    },
  },
  {
    id: 'a12-02', difficulty: 'medium',
    question: 'Convert the denary number 77 to 8-bit binary.',
    answer: '0100 1101',
    working: '77 = 64 + 8 + 4 + 1',
    vary: {
      make: rand => {
        const n = rand(1, 255);
        return { question: `Convert the denary number ${n} to 8-bit binary.`, answer: toBinary8(n), working: `${n} = ${placeValueSum(n)}` };
      },
    },
  },
  {
    id: 'a12-03', difficulty: 'medium',
    question: 'Convert the hexadecimal number 3F to denary.',
    answer: '63',
    working: '3 × 16 + 15 = 63',
    vary: {
      make: rand => {
        const n = rand(17, 255);
        const hex = n.toString(16).toUpperCase();
        return { question: `Convert the hexadecimal number ${hex} to denary.`, answer: String(n), working: `${Math.floor(n / 16)} × 16 + ${n % 16} = ${n}` };
      },
    },
  },
  {
    id: 'a12-04', difficulty: 'medium',
    question: 'Convert the denary number 200 to hexadecimal.',
    answer: 'C8',
    working: '200 ÷ 16 = 12 remainder 8 → 12 = C, so C8',
    vary: {
      make: rand => {
        const n = rand(17, 255);
        const high = Math.floor(n / 16);
        const low = n % 16;
        const hex = n.toString(16).toUpperCase();
        return {
          question: `Convert the denary number ${n} to hexadecimal.`,
          answer: hex,
          working: `${n} ÷ 16 = ${high} remainder ${low} → ${high.toString(16).toUpperCase()}${low.toString(16).toUpperCase()}`,
        };
      },
    },
  },
  {
    id: 'a12-05', difficulty: 'easy',
    question: 'Why do programmers often use hexadecimal instead of binary?',
    answer: 'Hex is shorter and easier to read and write without mistakes, and each hex digit is exactly 4 bits, so converting to binary is simple (e.g. colour codes, memory addresses, MAC addresses).',
  },
  {
    id: 'a12-06', difficulty: 'easy',
    question: 'How many different values can be represented with 6 bits?',
    answer: '64',
    working: '2⁶ = 64',
    vary: {
      make: rand => {
        const bits = rand(2, 12);
        return { question: `How many different values can be represented with ${bits} bits?`, answer: String(2 ** bits), working: `2^${bits} = ${2 ** bits}` };
      },
    },
  },
  {
    id: 'a12-07', difficulty: 'medium',
    question: 'How is text stored in binary?',
    answer: 'Each character is given a numeric code from a character set — ASCII (7/8 bits, English characters) or Unicode (e.g. UTF-8, up to 32 bits, covering all world scripts and emoji) — and that code is stored in binary.',
  },
  {
    id: 'a12-08', difficulty: 'hard',
    question: 'A bitmap image is 1920 × 1080 pixels with a 24-bit colour depth. What is its uncompressed file size in bytes?',
    answer: '6,220,800 bytes',
    working: '1920 × 1080 × 24 ÷ 8 = 6,220,800 bytes',
    vary: {
      make: rand => {
        const width = rand(100, 1000, 100);
        const height = rand(100, 800, 100);
        const depth = pick(rand, [8, 16, 24]);
        const bytes = (width * height * depth) / 8;
        return {
          question: `A bitmap image is ${width} × ${height} pixels with ${depth === 8 ? 'an' : 'a'} ${depth}-bit colour depth. What is its uncompressed file size in bytes?`,
          answer: `${withCommas(bytes)} bytes`,
          working: `${width} × ${height} × ${depth} ÷ 8 = ${withCommas(bytes)} bytes`,
        };
      },
    },
  },
  {
    id: 'a12-09', difficulty: 'hard',
    question: 'A mono sound is recorded at 44,100 Hz with a 16-bit sample size for 10 seconds. What is the file size in bytes?',
    answer: '882,000 bytes',
    working: '44,100 × 16 × 10 ÷ 8 = 882,000 bytes',
    vary: {
      make: rand => {
        const rate = pick(rand, [8000, 22050, 44100, 48000]);
        const depth = pick(rand, [8, 16, 24]);
        const seconds = rand(2, 30);
        const bytes = (rate * depth * seconds) / 8;
        return {
          question: `A mono sound is recorded at ${withCommas(rate)} Hz with ${depth === 8 ? 'an' : 'a'} ${depth}-bit sample size for ${seconds} seconds. What is the file size in bytes?`,
          answer: `${withCommas(bytes)} bytes`,
          working: `${withCommas(rate)} × ${depth} × ${seconds} ÷ 8 = ${withCommas(bytes)} bytes`,
        };
      },
    },
  },
  {
    id: 'a12-10', difficulty: 'easy',
    question: 'Which logic gate outputs 1 only when its two inputs are different?',
    answer: 'XOR (exclusive OR)',
  },
  {
    id: 'a12-11', difficulty: 'medium',
    question: 'If A = 1, B = 0 and C = 1, what is the output of (A AND B) OR C?',
    answer: '1',
    working: 'A AND B = 1 AND 0 = 0, then 0 OR 1 = 1',
    vary: {
      make: rand => {
        const a = rand(0, 1);
        const b = rand(0, 1);
        const c = rand(0, 1);
        const and = a & b;
        const out = and | c;
        return {
          question: `If A = ${a}, B = ${b} and C = ${c}, what is the output of (A AND B) OR C?`,
          answer: String(out),
          working: `A AND B = ${a} AND ${b} = ${and}, then ${and} OR ${c} = ${out}`,
        };
      },
    },
  },
  {
    id: 'a12-12', difficulty: 'hard',
    question: 'Complete the truth table for X = A AND (NOT B).',
    answer: 'A B | X\n0 0 | 0\n0 1 | 0\n1 0 | 1\n1 1 | 0',
    working: 'X is 1 only when A is 1 and B is 0.',
  },
  {
    id: 'a12-13', difficulty: 'medium',
    question: 'Inputs A and B go into an OR gate, and its output goes into a NOT gate. Write the Boolean expression. Which single gate is this?',
    answer: 'X = NOT (A OR B) — this is a NOR gate.',
  },
  {
    id: 'a12-14', difficulty: 'medium',
    question: 'Why are NAND and NOR called universal gates?',
    answer: 'Any other logic gate, and so any logic circuit, can be built using only NAND gates (or only NOR gates).',
  },
]);

const a1_3 = deck('A1.3 Operating systems and control systems', [
  {
    id: 'a13-01', difficulty: 'easy',
    question: 'What is the role of an operating system?',
    answer: 'It manages the hardware and software resources, provides a user interface, and acts as the go-between so applications can use the hardware without controlling it directly.',
  },
  {
    id: 'a13-02', difficulty: 'easy',
    question: 'Name four functions of an operating system.',
    answer: 'Any four: process (CPU) management/scheduling, memory management, file management, device (I/O) management using drivers, security and user accounts, providing a user interface.',
  },
  {
    id: 'a13-03', difficulty: 'medium',
    question: 'Describe first-come, first-served (FCFS) scheduling and one drawback.',
    answer: 'Processes run in the order they arrive, each until it finishes. It is simple and fair in order, but a long process makes all the short ones behind it wait (the convoy effect).',
  },
  {
    id: 'a13-04', difficulty: 'medium',
    question: 'Describe round robin scheduling.',
    answer: 'Each process gets a fixed time slice (quantum) in turn, then goes to the back of the queue. It is fair and responsive, but frequent context switches add overhead, and the quantum size matters.',
  },
  {
    id: 'a13-05', difficulty: 'hard',
    question: 'Give one advantage and one disadvantage of shortest job first (SJF) scheduling.',
    answer: 'Advantage: it gives the lowest average waiting time.\nDisadvantage: the OS must know or estimate each job\'s run time, and long jobs can starve (wait indefinitely).',
  },
  {
    id: 'a13-06', difficulty: 'medium',
    question: 'What is the main risk of priority scheduling, and how is it reduced?',
    answer: 'Low-priority processes may starve. Ageing reduces this by gradually raising the priority of processes that have waited a long time.',
  },
  {
    id: 'a13-07', difficulty: 'hard',
    question: 'Using FCFS, processes P1 (6 ms), P2 (3 ms) and P3 (2 ms) arrive at time 0 in that order. What is the average waiting time?',
    answer: '5 ms',
    working: 'Waits: P1 = 0, P2 = 6, P3 = 6 + 3 = 9 → (0 + 6 + 9) ÷ 3 = 5 ms',
    vary: {
      make: rand => {
        const b1 = rand(1, 9);
        const b2 = rand(1, 9);
        const b3 = rand(1, 9);
        const total = 0 + b1 + (b1 + b2);
        const average = Number((total / 3).toFixed(2));
        return {
          question: `Using FCFS, processes P1 (${b1} ms), P2 (${b2} ms) and P3 (${b3} ms) arrive at time 0 in that order. What is the average waiting time?`,
          answer: `${average} ms`,
          working: `Waits: P1 = 0, P2 = ${b1}, P3 = ${b1} + ${b2} = ${b1 + b2} → (0 + ${b1} + ${b1 + b2}) ÷ 3 = ${average} ms`,
        };
      },
    },
  },
  {
    id: 'a13-08', difficulty: 'hard',
    question: 'Evaluate polling compared with interrupt handling.',
    answer: 'Polling: the CPU repeatedly checks each device\'s status — simple and predictable, but wastes CPU time when nothing has happened.\nInterrupts: the device signals the CPU when it needs attention; the CPU saves its state, runs the interrupt service routine, then resumes — efficient and responsive, but more complex to manage.',
  },
  {
    id: 'a13-09', difficulty: 'hard',
    question: 'When can polling be the better choice than interrupts?',
    answer: 'When events happen very often or at regular, predictable times, or in simple embedded systems where fixed timing matters — e.g. reading a sensor at a fixed interval.',
  },
  {
    id: 'a13-10', difficulty: 'hard',
    question: 'HL: How does the operating system manage multitasking?',
    answer: 'The scheduler switches the CPU rapidly between processes. On each context switch it saves one process\'s state (registers, PC) and restores another\'s, giving the illusion that programs run at the same time. It also allocates memory and I/O to each process and prevents conflicts between them.',
  },
  {
    id: 'a13-11', difficulty: 'medium',
    question: 'HL: Name the main components of a control system and what each does.',
    answer: 'Sensor: measures the environment (input).\nController/processor: compares the reading with the set point and decides what to do.\nActuator: carries out the physical action (motor, heater, valve).\nFeedback: the result is measured again, closing the loop.',
  },
  {
    id: 'a13-12', difficulty: 'medium',
    question: 'HL: What is the difference between an open-loop and a closed-loop control system?',
    answer: 'Closed loop: uses feedback from sensors to adjust its output (e.g. a thermostat).\nOpen loop: no feedback — it runs a fixed action regardless of the result (e.g. a toaster on a timer).',
  },
  {
    id: 'a13-13', difficulty: 'hard',
    question: 'HL: Describe how an automatic central heating system works as a control system.',
    answer: 'A temperature sensor measures the room. The controller compares it with the set point: below it, the heater (actuator) is switched on; at or above it, it is switched off. The sensor keeps measuring, so feedback keeps the temperature near the target.',
  },
]);

const a1_4 = deck('A1.4 Translation (HL)', [
  {
    id: 'a14-01', difficulty: 'easy',
    question: 'What does a compiler do?',
    answer: 'It translates the whole source program into machine code (an executable) before the program is run.',
  },
  {
    id: 'a14-02', difficulty: 'easy',
    question: 'What does an interpreter do?',
    answer: 'It translates and runs the source code one statement at a time, every time the program is run, without producing a separate executable.',
  },
  {
    id: 'a14-03', difficulty: 'medium',
    question: 'How do compilers and interpreters differ in how they report errors?',
    answer: 'A compiler analyses the whole program and reports all the errors it finds before anything runs. An interpreter stops at the first error it reaches while running, so code after it is not checked until that error is fixed.',
  },
  {
    id: 'a14-04', difficulty: 'medium',
    question: 'Which usually runs faster: compiled or interpreted code? Why?',
    answer: 'Compiled code — it is already machine code, so there is no translation work while it runs, and the compiler can optimise it.',
  },
  {
    id: 'a14-05', difficulty: 'medium',
    question: 'Compare compiled and interpreted programs for portability.',
    answer: 'Interpreted source code runs on any machine that has the interpreter. A compiled executable only runs on the CPU/OS it was compiled for, so it must be recompiled for each platform.',
  },
  {
    id: 'a14-06', difficulty: 'medium',
    question: 'Why are interpreters useful during rapid development?',
    answer: 'There is no separate compile step, so code can be run and tested immediately, and errors are found line by line, which makes debugging quicker.',
  },
  {
    id: 'a14-07', difficulty: 'hard',
    question: 'A studio is building a performance-critical game engine. Should it use a compiler or an interpreter? Justify.',
    answer: 'A compiler: the engine needs maximum execution speed, and compiled, optimised machine code runs fastest with no translation overhead during play. Distributing an executable also keeps the source code private.',
  },
  {
    id: 'a14-08', difficulty: 'hard',
    question: 'What is just-in-time (JIT) compilation?',
    answer: 'A hybrid approach: code (often bytecode) is compiled into machine code while the program runs, just before it is needed, and frequently used parts are kept, giving near-compiled speed with interpreter-like portability (e.g. Java JVM, JavaScript engines).',
  },
  {
    id: 'a14-09', difficulty: 'hard',
    question: 'What is bytecode and why is it used?',
    answer: 'Bytecode is an intermediate, platform-independent code produced by compiling source code (e.g. Java .class files). A virtual machine on each platform interprets or JIT-compiles it, so the same bytecode runs anywhere.',
  },
  {
    id: 'a14-10', difficulty: 'medium',
    question: 'How does choosing a compiler help protect a company\'s source code?',
    answer: 'Only the compiled executable is distributed, so customers never receive the readable source code. An interpreted program usually has to ship its source code.',
  },
]);

// ---------- More helpers for the O Level maths recipes ----------

// Highest common factor: 12, 18 → 6
function gcd(a, b) {
  return b === 0 ? Math.abs(a) : gcd(b, a % b);
}

// Pairs of numbers with no common factor (used to build HCF / LCM questions).
const COPRIME_PAIRS = [[2, 3], [3, 4], [2, 5], [3, 5], [4, 5], [5, 6], [2, 7], [3, 7], [4, 7], [5, 7]];

// 10, -5 → "10⁻⁵"   2, 3 → "2³"
const SUPERSCRIPTS = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹', '-': '⁻' };
function power(base, exponent) {
  return base + String(exponent).split('').map(ch => SUPERSCRIPTS[ch]).join('');
}

// -7 → "−7" (a proper minus sign)
function signed(n) {
  return n < 0 ? `−${Math.abs(n)}` : String(n);
}

// 24, 36 → "2/3"   8, 4 → "2"
function fraction(top, bottom) {
  const g = gcd(top, bottom);
  return bottom / g === 1 ? String(top / g) : `${top / g}/${bottom / g}`;
}

// { 2: 3, 3: 2, 5: 1 } → "2³ × 3² × 5"
function primeIndexForm(exponents) {
  return Object.entries(exponents)
    .filter(([, e]) => e > 0)
    .map(([p, e]) => (e === 1 ? p : power(p, e)))
    .join(' × ');
}

// { 2: 3, 3: 2, 5: 1 } → "2 × 2 × 2 × 3 × 3 × 5"
function primeListForm(exponents) {
  return Object.entries(exponents)
    .flatMap(([p, e]) => Array(e).fill(p))
    .join(' × ');
}

// 540 minutes after midnight → "9:00 a.m."
function morningTime(minutes) {
  const h = Math.floor(minutes / 60);
  const m = String(minutes % 60).padStart(2, '0');
  return `${h}:${m} a.m.`;
}

// ---------- O Level Mathematics 4052 — N1 Numbers and their operations ----------

const oMathN1 = deck('N1 Numbers and their operations', [
  {
    id: 'n1-01', difficulty: 'easy',
    question: 'What is a prime number? Is 1 a prime number?',
    answer: 'A whole number greater than 1 that has exactly two factors: 1 and itself.\n1 is NOT prime, because it has only one factor.',
  },
  {
    id: 'n1-02', difficulty: 'medium',
    question: 'Express 360 as a product of its prime factors in index notation.',
    answer: '2³ × 3² × 5',
    working: '360 = 2 × 2 × 2 × 3 × 3 × 5',
    vary: {
      make: rand => {
        const exps = { 2: rand(1, 4), 3: rand(0, 2), 5: rand(1, 2), 7: rand(0, 1) };
        const n = Object.entries(exps).reduce((total, [p, e]) => total * Number(p) ** e, 1);
        return {
          question: `Express ${withCommas(n)} as a product of its prime factors in index notation.`,
          answer: primeIndexForm(exps),
          working: `${withCommas(n)} = ${primeListForm(exps)}`,
        };
      },
    },
  },
  {
    id: 'n1-03', difficulty: 'medium',
    question: 'Find the highest common factor (HCF) of 84 and 126.',
    answer: '42',
    working: '84 = 2² × 3 × 7 and 126 = 2 × 3² × 7 → HCF = 2 × 3 × 7 = 42',
    vary: {
      make: rand => {
        const h = rand(2, 12);
        const [m, n] = pick(rand, COPRIME_PAIRS);
        return {
          question: `Find the highest common factor (HCF) of ${h * m} and ${h * n}.`,
          answer: String(h),
          working: `${h * m} = ${h} × ${m} and ${h * n} = ${h} × ${n}; ${m} and ${n} have no common factor → HCF = ${h}`,
        };
      },
    },
  },
  {
    id: 'n1-04', difficulty: 'medium',
    question: 'Find the lowest common multiple (LCM) of 12 and 18.',
    answer: '36',
    working: '12 = 2² × 3 and 18 = 2 × 3² → LCM = 2² × 3² = 36',
    vary: {
      make: rand => {
        const h = rand(2, 9);
        const [m, n] = pick(rand, COPRIME_PAIRS);
        return {
          question: `Find the lowest common multiple (LCM) of ${h * m} and ${h * n}.`,
          answer: String(h * m * n),
          working: `${h * m} = ${h} × ${m} and ${h * n} = ${h} × ${n} → LCM = ${h} × ${m} × ${n} = ${h * m * n}`,
        };
      },
    },
  },
  {
    id: 'n1-05', difficulty: 'hard',
    question: 'Bus A leaves the interchange every 12 minutes and Bus B every 15 minutes. Both leave at 8:00 a.m. When do they next leave together?',
    answer: '9:00 a.m.',
    working: 'LCM of 12 and 15 = 60 minutes → 8:00 a.m. + 60 min = 9:00 a.m.',
    vary: {
      make: rand => {
        const options = [6, 8, 9, 10, 12, 15, 18, 20];
        const a = pick(rand, options);
        const b = pick(rand, options.filter(x => x !== a));
        const lcm = (a * b) / gcd(a, b);
        const time = morningTime(8 * 60 + lcm);
        return {
          question: `Bus A leaves the interchange every ${a} minutes and Bus B every ${b} minutes. Both leave at 8:00 a.m. When do they next leave together?`,
          answer: time,
          working: `LCM of ${a} and ${b} = ${lcm} minutes → 8:00 a.m. + ${lcm} min = ${time}`,
        };
      },
    },
  },
  {
    id: 'n1-06', difficulty: 'medium',
    question: 'Without a calculator, find √1764.',
    answer: '42',
    working: '1764 = 2² × 3² × 7² → √1764 = 2 × 3 × 7 = 42',
    vary: {
      make: rand => {
        const k = rand(12, 35);
        return { question: `Without a calculator, find √${k * k}.`, answer: String(k), working: `${k} × ${k} = ${k * k}` };
      },
    },
  },
  {
    id: 'n1-07', difficulty: 'medium',
    question: 'Without a calculator, find ∛2744.',
    answer: '14',
    working: '2744 = 2³ × 7³ → ∛2744 = 2 × 7 = 14',
    vary: {
      make: rand => {
        const k = rand(4, 15);
        return { question: `Without a calculator, find ∛${withCommas(k ** 3)}.`, answer: String(k), working: `${k} × ${k} × ${k} = ${withCommas(k ** 3)}` };
      },
    },
  },
  {
    id: 'n1-08', difficulty: 'easy',
    question: 'Evaluate −8 − (−15).',
    answer: '7',
    working: '−8 − (−15) = −8 + 15 = 7',
    vary: {
      make: rand => {
        const a = -rand(2, 20);
        const b = -rand(2, 20);
        return {
          question: `Evaluate ${signed(a)} − (${signed(b)}).`,
          answer: signed(a - b),
          working: `${signed(a)} − (${signed(b)}) = ${signed(a)} + ${-b} = ${signed(a - b)}`,
        };
      },
    },
  },
  {
    id: 'n1-09', difficulty: 'easy',
    question: 'Evaluate (−6) × (−4) ÷ (−3).',
    answer: '−8',
    working: '(−6) × (−4) = 24, then 24 ÷ (−3) = −8',
    vary: {
      make: rand => {
        const c = rand(2, 6);
        const a = -rand(2, 9);
        const b = -c * rand(1, 4);
        const product = a * b;
        return {
          question: `Evaluate (${signed(a)}) × (${signed(b)}) ÷ (${signed(-c)}).`,
          answer: signed(product / -c),
          working: `(${signed(a)}) × (${signed(b)}) = ${product}, then ${product} ÷ (${signed(-c)}) = ${signed(product / -c)}`,
        };
      },
    },
  },
  {
    id: 'n1-10', difficulty: 'medium',
    question: 'Evaluate 20 − 3 × (6 − 4)² ÷ 2.',
    answer: '14',
    working: 'Brackets: 6 − 4 = 2 → indices: 2² = 4 → 3 × 4 ÷ 2 = 6 → 20 − 6 = 14',
    vary: {
      make: rand => {
        const d = rand(2, 4);
        const q = rand(1, 6);
        const p = q + d;
        const m = rand(2, 5);
        const part = m * d; // m × d² ÷ d
        const x = rand(part + 1, part + 25);
        return {
          question: `Evaluate ${x} − ${m} × (${p} − ${q})² ÷ ${d}.`,
          answer: signed(x - part),
          working: `Brackets: ${p} − ${q} = ${d} → indices: ${d}² = ${d * d} → ${m} × ${d * d} ÷ ${d} = ${part} → ${x} − ${part} = ${x - part}`,
        };
      },
    },
  },
  {
    id: 'n1-11', difficulty: 'medium',
    question: 'Evaluate 3/4 ÷ 9/8, giving your answer in its simplest form.',
    answer: '2/3',
    working: '3/4 × 8/9 = 24/36 = 2/3',
    vary: {
      make: rand => {
        const b = rand(3, 9);
        const a = rand(1, b - 1);
        const d = rand(3, 9);
        const c = rand(1, d - 1);
        const raw = `${a * d}/${b * c}`;
        const simplest = fraction(a * d, b * c);
        return {
          question: `Evaluate ${a}/${b} ÷ ${c}/${d}, giving your answer in its simplest form.`,
          answer: simplest,
          working: `${a}/${b} × ${d}/${c} = ${raw}${raw === simplest ? '' : ` = ${simplest}`}`,
        };
      },
    },
  },
  {
    id: 'n1-12', difficulty: 'easy',
    question: 'Express 0.375 as a fraction in its simplest form.',
    answer: '3/8',
    working: '0.375 = 375/1000 = 3/8',
    vary: {
      make: rand => {
        const den = pick(rand, [4, 5, 8, 20, 25]);
        const num = rand(1, den - 1);
        const decimal = num / den;
        const thousandths = Math.round(decimal * 1000);
        return {
          question: `Express ${decimal} as a fraction in its simplest form.`,
          answer: fraction(num, den),
          working: `${decimal} = ${thousandths}/1000 = ${fraction(num, den)}`,
        };
      },
    },
  },
  {
    id: 'n1-13', difficulty: 'medium',
    question: 'Which of these are irrational? √16, √7, 0.25, π, 22/7',
    answer: '√7 and π',
    working: '√16 = 4, 0.25 = 1/4 and 22/7 can all be written as a fraction of two integers, so they are rational. √7 and π cannot.',
  },
  {
    id: 'n1-14', difficulty: 'medium',
    question: 'Round 0.0040386 to 3 significant figures.',
    answer: '0.00404',
    working: 'Start counting at the first non-zero digit. Keep 403; the next digit is 8 (≥ 5), so round up → 0.00404',
    vary: {
      make: rand => {
        let digits = rand(10000, 99899); // 5 significant digits (avoids 999.. carrying over)
        if (digits % 10 === 0) digits += 1; // no pointless trailing zero like 0.0075640
        const zeros = '0'.repeat(rand(1, 3));
        const kept = Math.floor(digits / 100);
        const next = Math.floor(digits / 10) % 10;
        const rounded = Math.floor((digits + 50) / 100);
        return {
          question: `Round 0.${zeros}${digits} to 3 significant figures.`,
          answer: `0.${zeros}${rounded}`,
          working: `Start counting at the first non-zero digit. Keep ${kept}; the next digit is ${next}${next >= 5 ? ' (≥ 5), so round up' : ' (< 5), so leave it'} → 0.${zeros}${rounded}`,
        };
      },
    },
  },
  {
    id: 'n1-15', difficulty: 'easy',
    question: 'Round 72,649 to 2 significant figures.',
    answer: '73,000',
    working: 'Keep 72; the next digit is 6 (≥ 5), so round up → 73,000 (zeros keep the place value)',
    vary: {
      make: rand => {
        const n = rand(10000, 98999);
        const kept = Math.floor(n / 1000);
        const next = Math.floor(n / 100) % 10;
        const rounded = Math.floor((n + 500) / 1000) * 1000;
        return {
          question: `Round ${withCommas(n)} to 2 significant figures.`,
          answer: withCommas(rounded),
          working: `Keep ${kept}; the next digit is ${next}${next >= 5 ? ' (≥ 5), so round up' : ' (< 5), so leave it'} → ${withCommas(rounded)} (zeros keep the place value)`,
        };
      },
    },
  },
  {
    id: 'n1-16', difficulty: 'hard',
    question: 'By rounding each number to 1 significant figure, estimate 49.8 × 3.02 ÷ 0.198.',
    answer: '750',
    working: '50 × 3 ÷ 0.2 = 150 ÷ 0.2 = 750',
    vary: {
      make: rand => {
        const a = pick(rand, [20, 30, 40, 50, 60, 80]);
        const b = pick(rand, [2, 3, 4, 5]);
        const cTenths = pick(rand, [2, 4, 5]); // 0.2, 0.4 or 0.5
        const result = (a * b * 10) / cTenths;
        const messyA = ((a * 10 - rand(1, 3)) / 10).toFixed(1);
        const messyB = ((b * 100 + rand(1, 4)) / 100).toFixed(2);
        const messyC = ((cTenths * 100 - rand(1, 4)) / 1000).toFixed(3);
        return {
          question: `By rounding each number to 1 significant figure, estimate ${messyA} × ${messyB} ÷ ${messyC}.`,
          answer: withCommas(result),
          working: `${a} × ${b} ÷ ${cTenths / 10} = ${a * b} ÷ ${cTenths / 10} = ${withCommas(result)}`,
        };
      },
    },
  },
  {
    id: 'n1-17', difficulty: 'medium',
    question: 'Write 0.0000567 in standard form.',
    answer: '5.67 × 10⁻⁵',
    working: 'Move the decimal point 5 places to the right to get 5.67, so the power of 10 is −5',
    vary: {
      make: rand => {
        let m = rand(101, 999);
        if (m % 10 === 0) m += 1; // avoid a trailing zero like 5.60
        const p = -rand(2, 7);
        const digits = String(m);
        const mantissa = `${digits[0]}.${digits.slice(1)}`;
        return {
          question: `Write 0.${'0'.repeat(-p - 1)}${digits} in standard form.`,
          answer: `${mantissa} × ${power(10, p)}`,
          working: `Move the decimal point ${-p} places to the right to get ${mantissa}, so the power of 10 is ${signed(p)}`,
        };
      },
    },
  },
  {
    id: 'n1-18', difficulty: 'hard',
    question: 'Evaluate (3 × 10⁴) × (5 × 10⁶), giving your answer in standard form.',
    answer: '1.5 × 10¹¹',
    working: '3 × 5 = 15 and 10⁴ × 10⁶ = 10¹⁰ → 15 × 10¹⁰ = 1.5 × 10¹¹',
    vary: {
      make: rand => {
        const a = rand(2, 9);
        const b = rand(2, 9);
        const x = rand(2, 8);
        const y = rand(2, 8);
        const product = a * b;
        const answer = product < 10
          ? `${product} × ${power(10, x + y)}`
          : `${product / 10} × ${power(10, x + y + 1)}`;
        return {
          question: `Evaluate (${a} × ${power(10, x)}) × (${b} × ${power(10, y)}), giving your answer in standard form.`,
          answer,
          working: `${a} × ${b} = ${product} and ${power(10, x)} × ${power(10, y)} = ${power(10, x + y)} → ${product} × ${power(10, x + y)}${product < 10 ? '' : ` = ${answer}`}`,
        };
      },
    },
  },
  {
    id: 'n1-19', difficulty: 'easy',
    question: 'What is 7⁰?',
    answer: '1',
    working: 'Any non-zero number to the power 0 is 1.',
    vary: {
      make: rand => {
        const base = rand(2, 99);
        return { question: `What is ${power(base, 0)}?`, answer: '1', working: 'Any non-zero number to the power 0 is 1.' };
      },
    },
  },
  {
    id: 'n1-20', difficulty: 'medium',
    question: 'Simplify 2⁵ × 2³ ÷ 2⁴ and evaluate.',
    answer: '2⁴ = 16',
    working: 'Add the powers when multiplying, subtract when dividing: 5 + 3 − 4 = 4 → 2⁴ = 16',
    vary: {
      make: rand => {
        const base = rand(2, 3);
        const a = rand(2, 7);
        const b = rand(2, 6);
        const c = rand(Math.max(2, a + b - 5), a + b - 1);
        const e = a + b - c;
        return {
          question: `Simplify ${power(base, a)} × ${power(base, b)} ÷ ${power(base, c)} and evaluate.`,
          answer: `${power(base, e)} = ${base ** e}`,
          working: `Add the powers when multiplying, subtract when dividing: ${a} + ${b} − ${c} = ${e} → ${power(base, e)} = ${base ** e}`,
        };
      },
    },
  },
  {
    id: 'n1-21', difficulty: 'medium',
    question: 'Evaluate 5⁻², giving your answer as a fraction.',
    answer: '1/25',
    working: '5⁻² = 1/5² = 1/25',
    vary: {
      make: rand => {
        const base = rand(2, 9);
        const e = base <= 4 ? rand(1, 3) : rand(1, 2);
        return {
          question: `Evaluate ${power(base, -e)}, giving your answer as a fraction.`,
          answer: `1/${base ** e}`,
          working: `${power(base, -e)} = 1/${power(base, e)} = 1/${base ** e}`,
        };
      },
    },
  },
  {
    id: 'n1-22', difficulty: 'hard',
    question: 'Evaluate 27^(2/3) without a calculator.',
    answer: '9',
    working: '27^(2/3) = (∛27)² = 3² = 9',
    vary: {
      make: rand => {
        const n = pick(rand, [2, 3]);
        const k = n === 2 ? rand(2, 9) : rand(2, 5);
        const m = pick(rand, n === 2 ? [1, 3] : [1, 2, 4]);
        const base = k ** n;
        const root = n === 2 ? '√' : '∛';
        return {
          question: `Evaluate ${base}^(${m}/${n}) without a calculator.`,
          answer: String(k ** m),
          working: `${base}^(${m}/${n}) = ${power(`(${root}${base})`, m)} = ${power(k, m)} = ${k ** m}`,
        };
      },
    },
  },
]);

// ---------- O Level Mathematics 4052 — N2 Ratio and proportion ----------

// Lowest common multiple: 4, 6 → 12
function lcm(a, b) {
  return (a * b) / gcd(a, b);
}

// 1250 → "$12.50"   1081600 → "$10,816.00"
function dollars(cents) {
  return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// Picks a pair with no common factor, in a random order: e.g. [3, 5] or [5, 3].
function ratioPair(rand) {
  const [m, n] = pick(rand, COPRIME_PAIRS);
  return rand(0, 1) ? [m, n] : [n, m];
}

const oMathN2 = deck('N2 Ratio and proportion', [
  {
    id: 'n2-01', difficulty: 'easy',
    question: 'Write 45 : 60 in its simplest form.',
    answer: '3 : 4',
    working: 'HCF of 45 and 60 is 15 → 45 ÷ 15 : 60 ÷ 15 = 3 : 4',
    vary: {
      make: rand => {
        const h = rand(2, 15);
        const [m, n] = ratioPair(rand);
        return {
          question: `Write ${h * m} : ${h * n} in its simplest form.`,
          answer: `${m} : ${n}`,
          working: `HCF of ${h * m} and ${h * n} is ${h} → ${h * m} ÷ ${h} : ${h * n} ÷ ${h} = ${m} : ${n}`,
        };
      },
    },
  },
  {
    id: 'n2-02', difficulty: 'medium',
    question: 'Write 0.6 : 1.5 in its simplest form.',
    answer: '2 : 5',
    working: '× 10 → 6 : 15, then ÷ 3 → 2 : 5',
    vary: {
      make: rand => {
        const [m, n] = ratioPair(rand);
        let t = rand(1, 9);
        if ((m * t) % 10 === 0 && (n * t) % 10 === 0) t = 1; // keep at least one decimal
        const a = m * t;
        const b = n * t;
        return {
          question: `Write ${a / 10} : ${b / 10} in its simplest form.`,
          answer: `${m} : ${n}`,
          working: `× 10 → ${a} : ${b}${t === 1 ? '' : `, then ÷ ${t} → ${m} : ${n}`}`,
        };
      },
    },
  },
  {
    id: 'n2-03', difficulty: 'medium',
    question: 'Write 2/3 : 5/6 in its simplest form.',
    answer: '4 : 5',
    working: 'Multiply both by 6 (LCM of 3 and 6) → 4 : 5',
    vary: {
      make: rand => {
        const b = pick(rand, [2, 3, 4, 5, 6, 8]);
        const d = pick(rand, [2, 3, 4, 5, 6, 8].filter(x => x !== b));
        // Numerators that keep each fraction in its simplest form (e.g. no 4/6).
        const a = pick(rand, [1, 2, 3, 4, 5, 6, 7].filter(x => x < b && gcd(x, b) === 1));
        const c = pick(rand, [1, 2, 3, 4, 5, 6, 7].filter(x => x < d && gcd(x, d) === 1));
        const L = lcm(b, d);
        const x = (a * L) / b;
        const y = (c * L) / d;
        const g = gcd(x, y);
        return {
          question: `Write ${a}/${b} : ${c}/${d} in its simplest form.`,
          answer: `${x / g} : ${y / g}`,
          working: `Multiply both by ${L} (LCM of ${b} and ${d}) → ${x} : ${y}${g === 1 ? '' : `, then ÷ ${g} → ${x / g} : ${y / g}`}`,
        };
      },
    },
  },
  {
    id: 'n2-04', difficulty: 'easy',
    question: 'Divide $360 in the ratio 4 : 5.',
    answer: '$160 and $200',
    working: '4 + 5 = 9 parts → 1 part = $360 ÷ 9 = $40 → 4 × $40 = $160, 5 × $40 = $200',
    vary: {
      make: rand => {
        const m = rand(1, 9);
        const n = pick(rand, [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(x => x !== m && gcd(x, m) === 1));
        const unit = rand(5, 60);
        const total = unit * (m + n);
        return {
          question: `Divide $${withCommas(total)} in the ratio ${m} : ${n}.`,
          answer: `$${withCommas(m * unit)} and $${withCommas(n * unit)}`,
          working: `${m} + ${n} = ${m + n} parts → 1 part = $${withCommas(total)} ÷ ${m + n} = $${unit} → ${m} × $${unit} = $${withCommas(m * unit)}, ${n} × $${unit} = $${withCommas(n * unit)}`,
        };
      },
    },
  },
  {
    id: 'n2-05', difficulty: 'hard',
    question: 'The ratio of boys to girls in a hall is 3 : 5. There are 24 more girls than boys. How many students are there altogether?',
    answer: '96',
    working: 'Difference = 5 − 3 = 2 parts = 24 → 1 part = 12 → total = 8 parts = 96',
    vary: {
      make: rand => {
        const [m, n] = pick(rand, COPRIME_PAIRS); // m < n, so there are more girls
        const unit = rand(3, 15);
        const diff = (n - m) * unit;
        const total = (m + n) * unit;
        return {
          question: `The ratio of boys to girls in a hall is ${m} : ${n}. There are ${diff} more girls than boys. How many students are there altogether?`,
          answer: String(total),
          working: `Difference = ${n} − ${m} = ${n - m} part${n - m === 1 ? '' : 's'} = ${diff} → 1 part = ${unit} → total = ${m + n} parts = ${total}`,
        };
      },
    },
  },
  {
    id: 'n2-06', difficulty: 'hard',
    question: 'Given a : b = 2 : 3 and b : c = 4 : 5, find a : b : c.',
    answer: '8 : 12 : 15',
    working: 'Make b the same: LCM of 3 and 4 is 12 → a : b = 8 : 12 and b : c = 12 : 15 → 8 : 12 : 15',
    vary: {
      make: rand => {
        const [p, q] = ratioPair(rand);
        const [r, s] = ratioPair(rand);
        const L = lcm(q, r);
        let a = (p * L) / q;
        let b = L;
        let c = (s * L) / r;
        const g = gcd(gcd(a, b), c);
        a /= g; b /= g; c /= g;
        return {
          question: `Given a : b = ${p} : ${q} and b : c = ${r} : ${s}, find a : b : c.`,
          answer: `${a} : ${b} : ${c}`,
          working: `Make b the same: LCM of ${q} and ${r} is ${L} → a : b = ${(p * L) / q} : ${L} and b : c = ${L} : ${(s * L) / r}${g === 1 ? '' : `, then ÷ ${g}`} → ${a} : ${b} : ${c}`,
        };
      },
    },
  },
  {
    id: 'n2-07', difficulty: 'medium',
    question: 'Increase 48 in the ratio 5 : 3.',
    answer: '80',
    working: '48 ÷ 3 × 5 = 80',
    vary: {
      make: rand => {
        const [m, n] = ratioPair(rand);
        const unit = rand(3, 20);
        const verb = m > n ? 'Increase' : 'Decrease';
        return {
          question: `${verb} ${n * unit} in the ratio ${m} : ${n}.`,
          answer: String(m * unit),
          working: `${n * unit} ÷ ${n} × ${m} = ${m * unit}`,
        };
      },
    },
  },
  {
    id: 'n2-08', difficulty: 'easy',
    question: 'A map has a scale of 2 cm to 1 km. Write this scale in the form 1 : n.',
    answer: '1 : 50,000',
    working: '1 km = 100,000 cm → 2 cm : 100,000 cm = 1 : 50,000',
    vary: {
      make: rand => {
        const c = pick(rand, [2, 4, 5, 8]);
        const km = rand(1, 5);
        const n = (km * 100000) / c;
        return {
          question: `A map has a scale of ${c} cm to ${km} km. Write this scale in the form 1 : n.`,
          answer: `1 : ${withCommas(n)}`,
          working: `${km} km = ${withCommas(km * 100000)} cm → ${c} cm : ${withCommas(km * 100000)} cm = 1 : ${withCommas(n)}`,
        };
      },
    },
  },
  {
    id: 'n2-09', difficulty: 'medium',
    question: 'A map has a scale of 1 : 50,000. Two towns are 6.4 cm apart on the map. What is the actual distance in km?',
    answer: '3.2 km',
    working: '1 cm : 50,000 cm = 0.5 km → 6.4 × 0.5 = 3.2 km',
    vary: {
      make: rand => {
        const scale = pick(rand, [20000, 25000, 50000, 100000, 200000]);
        const tenths = rand(11, 99);
        const kmPerCm = scale / 100000;
        const km = Number(((tenths * scale) / 1000000).toFixed(4));
        return {
          question: `A map has a scale of 1 : ${withCommas(scale)}. Two towns are ${tenths / 10} cm apart on the map. What is the actual distance in km?`,
          answer: `${km} km`,
          working: `1 cm : ${withCommas(scale)} cm = ${kmPerCm} km → ${tenths / 10} × ${kmPerCm} = ${km} km`,
        };
      },
    },
  },
  {
    id: 'n2-10', difficulty: 'hard',
    question: 'A map has a scale of 1 : 20,000. A park has an area of 15 cm² on the map. Find its actual area in km².',
    answer: '0.6 km²',
    working: '1 cm : 0.2 km → 1 cm² : 0.2² = 0.04 km² → 15 × 0.04 = 0.6 km²',
    vary: {
      make: rand => {
        const scale = pick(rand, [10000, 20000, 25000, 50000, 100000]);
        const area = rand(2, 40);
        const kmPerCm = scale / 100000;
        const km2PerCm2 = Number((kmPerCm * kmPerCm).toFixed(6));
        const result = Number(((area * scale * scale) / 1e10).toFixed(6));
        return {
          question: `A map has a scale of 1 : ${withCommas(scale)}. A park has an area of ${area} cm² on the map. Find its actual area in km².`,
          answer: `${result} km²`,
          working: `1 cm : ${kmPerCm} km → 1 cm² : ${kmPerCm}² = ${km2PerCm2} km² → ${area} × ${km2PerCm2} = ${result} km²`,
        };
      },
    },
  },
  {
    id: 'n2-11', difficulty: 'easy',
    question: 'What does it mean for y to be directly proportional to x? What does its graph look like?',
    answer: 'y = kx for a constant k: when x is multiplied by a number, y is multiplied by the same number.\nThe graph of y against x is a straight line through the origin.',
  },
  {
    id: 'n2-12', difficulty: 'easy',
    question: 'What does it mean for y to be inversely proportional to x?',
    answer: 'y = k/x for a constant k, so x × y stays the same: when x is multiplied by a number, y is divided by that number.',
  },
  {
    id: 'n2-13', difficulty: 'easy',
    question: '5 pens cost $7.50. How much do 8 pens cost?',
    answer: '$12.00',
    working: '1 pen = $7.50 ÷ 5 = $1.50 → 8 × $1.50 = $12.00',
    vary: {
      make: rand => {
        const each = rand(50, 300, 5); // cents
        const n1 = rand(3, 9);
        const n2 = pick(rand, [2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15].filter(x => x !== n1));
        return {
          question: `${n1} pens cost ${dollars(each * n1)}. How much do ${n2} pens cost?`,
          answer: dollars(each * n2),
          working: `1 pen = ${dollars(each * n1)} ÷ ${n1} = ${dollars(each)} → ${n2} × ${dollars(each)} = ${dollars(each * n2)}`,
        };
      },
    },
  },
  {
    id: 'n2-14', difficulty: 'medium',
    question: 'y is directly proportional to x. When x = 4, y = 12. Find y when x = 7.',
    answer: '21',
    working: 'y = kx → 12 = 4k → k = 3 → y = 3 × 7 = 21',
    vary: {
      make: rand => {
        const k = rand(2, 9);
        const x1 = rand(2, 9);
        const x2 = pick(rand, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].filter(x => x !== x1));
        return {
          question: `y is directly proportional to x. When x = ${x1}, y = ${k * x1}. Find y when x = ${x2}.`,
          answer: String(k * x2),
          working: `y = kx → ${k * x1} = ${x1}k → k = ${k} → y = ${k} × ${x2} = ${k * x2}`,
        };
      },
    },
  },
  {
    id: 'n2-15', difficulty: 'hard',
    question: 'y is directly proportional to x². When x = 5, y = 50. Find y when x = 3.',
    answer: '18',
    working: 'y = kx² → 50 = 25k → k = 2 → y = 2 × 3² = 18',
    vary: {
      make: rand => {
        const k = rand(1, 6);
        const x1 = rand(2, 8);
        const x2 = pick(rand, [2, 3, 4, 5, 6, 7, 8, 9, 10].filter(x => x !== x1));
        return {
          question: `y is directly proportional to x². When x = ${x1}, y = ${k * x1 * x1}. Find y when x = ${x2}.`,
          answer: String(k * x2 * x2),
          working: `y = kx² → ${k * x1 * x1} = ${x1 * x1}k → k = ${k} → y = ${k} × ${x2}² = ${k * x2 * x2}`,
        };
      },
    },
  },
  {
    id: 'n2-16', difficulty: 'medium',
    question: '6 workers take 10 days to paint a building. How many days would 4 workers take, working at the same rate?',
    answer: '15 days',
    working: 'Total work = 6 × 10 = 60 worker-days → 60 ÷ 4 = 15 days',
    vary: {
      make: rand => {
        const w1 = rand(2, 9);
        const d1 = rand(2, 12);
        const work = w1 * d1;
        const choices = [];
        for (let w = 2; w <= 20; w++) if (w !== w1 && work % w === 0 && w !== work) choices.push(w);
        if (choices.length === 0) choices.push(1);
        const w2 = pick(rand, choices);
        const d2 = work / w2;
        return {
          question: `${w1} workers take ${d1} days to paint a building. How many days would ${w2} worker${w2 === 1 ? '' : 's'} take, working at the same rate?`,
          answer: `${d2} day${d2 === 1 ? '' : 's'}`,
          working: `Total work = ${w1} × ${d1} = ${work} worker-days → ${work} ÷ ${w2} = ${d2} day${d2 === 1 ? '' : 's'}`,
        };
      },
    },
  },
  {
    id: 'n2-17', difficulty: 'medium',
    question: 'y is inversely proportional to x. When x = 3, y = 8. Find y when x = 6.',
    answer: '4',
    working: 'y = k/x → k = 3 × 8 = 24 → y = 24 ÷ 6 = 4',
    vary: {
      make: rand => {
        const x1 = rand(2, 9);
        const y1 = rand(2, 12);
        const k = x1 * y1;
        const choices = [];
        for (let x = 2; x <= k; x++) if (x !== x1 && k % x === 0) choices.push(x);
        const x2 = choices.length ? pick(rand, choices) : 1;
        return {
          question: `y is inversely proportional to x. When x = ${x1}, y = ${y1}. Find y when x = ${x2}.`,
          answer: String(k / x2),
          working: `y = k/x → k = ${x1} × ${y1} = ${k} → y = ${k} ÷ ${x2} = ${k / x2}`,
        };
      },
    },
  },
  {
    id: 'n2-18', difficulty: 'hard',
    question: 'y is inversely proportional to x². When x = 2, y = 9. Find y when x = 3.',
    answer: '4',
    working: 'y = k/x² → k = 9 × 2² = 36 → y = 36 ÷ 3² = 4',
    vary: {
      make: rand => {
        const x1 = rand(2, 6);
        const x2 = pick(rand, [2, 3, 4, 5, 6].filter(x => x !== x1));
        const k = lcm(x1 * x1, x2 * x2) * rand(1, 3);
        const y1 = k / (x1 * x1);
        return {
          question: `y is inversely proportional to x². When x = ${x1}, y = ${y1}. Find y when x = ${x2}.`,
          answer: String(k / (x2 * x2)),
          working: `y = k/x² → k = ${y1} × ${x1}² = ${k} → y = ${k} ÷ ${x2}² = ${k / (x2 * x2)}`,
        };
      },
    },
  },
  {
    id: 'n2-19', difficulty: 'medium',
    question: 'y is inversely proportional to x. If x is doubled, what happens to y?',
    answer: 'y is halved (divided by 2).',
    working: 'y = k/x → y = k/(2x) = ½ × k/x',
    vary: {
      make: rand => {
        const factor = pick(rand, [2, 3, 4, 5]);
        const squared = rand(0, 1) === 1;
        const inverse = rand(0, 1) === 1;
        const change = squared ? factor * factor : factor;
        const xWord = { 2: 'doubled', 3: 'tripled', 4: 'multiplied by 4', 5: 'multiplied by 5' }[factor];
        const power = squared ? 'x²' : 'x';
        return {
          question: `y is ${inverse ? 'inversely' : 'directly'} proportional to ${power}. If x is ${xWord}, what happens to y?`,
          answer: inverse ? `y is divided by ${change}.` : `y is multiplied by ${change}.`,
          working: squared
            ? `x² becomes (${factor}x)² = ${change}x², so y is ${inverse ? 'divided' : 'multiplied'} by ${change}`
            : `x becomes ${factor}x, so y is ${inverse ? 'divided' : 'multiplied'} by ${factor}`,
        };
      },
    },
  },
]);

// ---------- O Level Mathematics 4052 — N3 Percentage ----------

// Percentages that are multiples of 5, e.g. [5, 10, ..., 50]
const FIVES = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50];

const oMathN3 = deck('N3 Percentage', [
  {
    id: 'n3-01', difficulty: 'easy',
    question: 'Write 3/8 as a percentage.',
    answer: '37.5%',
    working: '3/8 × 100% = 37.5%',
    vary: {
      make: rand => {
        const den = pick(rand, [4, 5, 8, 20, 25, 40]);
        const num = rand(1, den - 1);
        const percent = Number(((num * 100) / den).toFixed(2));
        return { question: `Write ${num}/${den} as a percentage.`, answer: `${percent}%`, working: `${num}/${den} × 100% = ${percent}%` };
      },
    },
  },
  {
    id: 'n3-02', difficulty: 'easy',
    question: 'Find 35% of 240.',
    answer: '84',
    working: '35/100 × 240 = 84',
    vary: {
      make: rand => {
        const p = pick(rand, [...FIVES, 60, 75, 80]);
        const x = 20 * rand(2, 30);
        return { question: `Find ${p}% of ${x}.`, answer: String((p * x) / 100), working: `${p}/100 × ${x} = ${(p * x) / 100}` };
      },
    },
  },
  {
    id: 'n3-03', difficulty: 'easy',
    question: 'Express 18 as a percentage of 72.',
    answer: '25%',
    working: '18/72 × 100% = 25%',
    vary: {
      make: rand => {
        const p = pick(rand, [5, 10, 12.5, 20, 25, 30, 40, 60, 75, 80]);
        const whole = 40 * rand(1, 10);
        const part = (whole * p) / 100;
        return { question: `Express ${part} as a percentage of ${whole}.`, answer: `${p}%`, working: `${part}/${whole} × 100% = ${p}%` };
      },
    },
  },
  {
    id: 'n3-04', difficulty: 'medium',
    question: 'Express 45 cents as a percentage of $3.',
    answer: '15%',
    working: 'Same units first: $3 = 300 cents → 45/300 × 100% = 15%',
    vary: {
      make: rand => {
        const d = rand(2, 9);
        const p = pick(rand, [5, 10, 15, 20, 25, 30, 40, 60]);
        const cents = d * p;
        return {
          question: `Express ${cents} cents as a percentage of $${d}.`,
          answer: `${p}%`,
          working: `Same units first: $${d} = ${d * 100} cents → ${cents}/${d * 100} × 100% = ${p}%`,
        };
      },
    },
  },
  {
    id: 'n3-05', difficulty: 'medium',
    question: 'A plant grew from 40 cm to 90 cm. Express its new height as a percentage of its original height.',
    answer: '225%',
    working: '90/40 × 100% = 225% (more than 100% because it is bigger than the original)',
    vary: {
      make: rand => {
        const original = 4 * rand(5, 25);
        const p = pick(rand, [125, 150, 175, 200, 225, 250, 300]);
        const now = (original * p) / 100;
        return {
          question: `A plant grew from ${original} cm to ${now} cm. Express its new height as a percentage of its original height.`,
          answer: `${p}%`,
          working: `${now}/${original} × 100% = ${p}% (more than 100% because it is bigger than the original)`,
        };
      },
    },
  },
  {
    id: 'n3-06', difficulty: 'medium',
    question: 'Class A: 18 out of 24 students passed. Class B: 21 out of 30 passed. Which class did better?',
    answer: 'Class A (75% vs 70%)',
    working: 'A: 18/24 × 100% = 75%, B: 21/30 × 100% = 70%',
    vary: {
      make: rand => {
        // Class sizes that give whole numbers of students for any multiple of 5%.
        const totalA = pick(rand, [20, 40, 60]);
        const totalB = pick(rand, [20, 40, 60].filter(t => t !== totalA));
        const pA = pick(rand, [50, 55, 60, 65, 70, 75, 80, 85, 90]);
        const pB = pick(rand, [50, 55, 60, 65, 70, 75, 80, 85, 90].filter(p => p !== pA));
        const passA = (totalA * pA) / 100;
        const passB = (totalB * pB) / 100;
        const winner = pA > pB ? 'Class A' : 'Class B';
        return {
          question: `Class A: ${passA} out of ${totalA} students passed. Class B: ${passB} out of ${totalB} passed. Which class did better?`,
          answer: `${winner} (${Math.max(pA, pB)}% vs ${Math.min(pA, pB)}%)`,
          working: `A: ${passA}/${totalA} × 100% = ${pA}%, B: ${passB}/${totalB} × 100% = ${pB}%`,
        };
      },
    },
  },
  {
    id: 'n3-07', difficulty: 'easy',
    question: 'Increase 80 by 15%.',
    answer: '92',
    working: '80 × 115/100 = 92',
    vary: {
      make: rand => {
        const p = pick(rand, [...FIVES, 60, 75]);
        const x = 20 * rand(2, 30);
        const result = (x * (100 + p)) / 100;
        return { question: `Increase ${x} by ${p}%.`, answer: String(result), working: `${x} × ${100 + p}/100 = ${result}` };
      },
    },
  },
  {
    id: 'n3-08', difficulty: 'easy',
    question: 'Decrease 250 by 12%.',
    answer: '220',
    working: '250 × 88/100 = 220',
    vary: {
      make: rand => {
        const p = pick(rand, [4, 8, 12, 16, 20, 24, 28, 32, 36, 40]);
        const x = 25 * rand(2, 40);
        const result = (x * (100 - p)) / 100;
        return { question: `Decrease ${x} by ${p}%.`, answer: String(result), working: `${x} × ${100 - p}/100 = ${result}` };
      },
    },
  },
  {
    id: 'n3-09', difficulty: 'medium',
    question: 'The price of a book went from $40 to $46. Find the percentage change.',
    answer: '15% increase',
    working: 'Change = $6 → 6/40 × 100% = 15% increase (always divide by the ORIGINAL value)',
    vary: {
      make: rand => {
        const original = 20 * rand(1, 15);
        const p = pick(rand, FIVES);
        const up = rand(0, 1) === 1;
        const now = (original * (up ? 100 + p : 100 - p)) / 100;
        const change = Math.abs(now - original);
        return {
          question: `The price of a book went from $${original} to $${now}. Find the percentage change.`,
          answer: `${p}% ${up ? 'increase' : 'decrease'}`,
          working: `Change = $${change} → ${change}/${original} × 100% = ${p}% ${up ? 'increase' : 'decrease'} (always divide by the ORIGINAL value)`,
        };
      },
    },
  },
  {
    id: 'n3-10', difficulty: 'medium',
    question: 'A shop buys a bag for $80 and sells it for $100. Find the profit as a percentage of the cost price.',
    answer: '25% profit',
    working: 'Profit = $20 → 20/80 × 100% = 25%',
    vary: {
      make: rand => {
        const cost = 20 * rand(2, 20);
        const p = pick(rand, FIVES);
        const profit = rand(0, 1) === 1;
        const sell = (cost * (profit ? 100 + p : 100 - p)) / 100;
        const diff = Math.abs(sell - cost);
        return {
          question: `A shop buys a bag for $${cost} and sells it for $${sell}. Find the ${profit ? 'profit' : 'loss'} as a percentage of the cost price.`,
          answer: `${p}% ${profit ? 'profit' : 'loss'}`,
          working: `${profit ? 'Profit' : 'Loss'} = $${diff} → ${diff}/${cost} × 100% = ${p}%`,
        };
      },
    },
  },
  {
    id: 'n3-11', difficulty: 'hard',
    question: 'After a 20% discount, a jacket costs $64. What was the original price?',
    answer: '$80',
    working: '$64 is 80% of the original → 64 ÷ 80 × 100 = $80',
    vary: {
      make: rand => {
        const p = pick(rand, [...FIVES, 60]);
        const original = 20 * rand(2, 25);
        const sale = (original * (100 - p)) / 100;
        return {
          question: `After a ${p}% discount, a jacket costs $${sale}. What was the original price?`,
          answer: `$${original}`,
          working: `$${sale} is ${100 - p}% of the original → ${sale} ÷ ${100 - p} × 100 = $${original}`,
        };
      },
    },
  },
  {
    id: 'n3-12', difficulty: 'easy',
    question: 'A phone costs $250 before GST. Find the price after 9% GST is added.',
    answer: '$272.50',
    working: '$250 × 109/100 = $272.50',
    vary: {
      make: rand => {
        const before = rand(20, 900);
        const after = before * 109; // in cents
        return {
          question: `A phone costs $${before} before GST. Find the price after 9% GST is added.`,
          answer: dollars(after),
          working: `$${before} × 109/100 = ${dollars(after)}`,
        };
      },
    },
  },
  {
    id: 'n3-13', difficulty: 'hard',
    question: 'A meal costs $32.70 including 9% GST. What was the price before GST?',
    answer: '$30.00',
    working: '$32.70 is 109% of the price → 32.70 ÷ 109 × 100 = $30.00',
    vary: {
      make: rand => {
        const before = rand(5, 200) * 100; // in cents
        const after = (before * 109) / 100;
        return {
          question: `A meal costs ${dollars(after)} including 9% GST. What was the price before GST?`,
          answer: dollars(before),
          working: `${dollars(after)} is 109% of the price → ${(after / 100).toFixed(2)} ÷ 109 × 100 = ${dollars(before)}`,
        };
      },
    },
  },
  {
    id: 'n3-14', difficulty: 'hard',
    question: 'A price is increased by 20% and then decreased by 20%. What is the overall percentage change?',
    answer: '4% decrease',
    working: '1.20 × 0.80 = 0.96 → 96% of the original, a 4% decrease',
    vary: {
      make: rand => {
        const a = pick(rand, [10, 20, 25, 30, 40, 50]);
        const b = pick(rand, [10, 20, 25, 30, 40, 50]);
        const upFirst = rand(0, 1) === 1;
        const finalPercent = ((100 + a) * (100 - b)) / 100; // same either order
        const change = Number((finalPercent - 100).toFixed(2));
        const steps = upFirst ? `increased by ${a}% and then decreased by ${b}%` : `decreased by ${b}% and then increased by ${a}%`;
        const factors = upFirst ? `${(100 + a) / 100} × ${(100 - b) / 100}` : `${(100 - b) / 100} × ${(100 + a) / 100}`;
        const answer = change === 0 ? 'No overall change' : `${Math.abs(change)}% ${change > 0 ? 'increase' : 'decrease'}`;
        return {
          question: `A price is ${steps}. What is the overall percentage change?`,
          answer,
          working: `${factors} = ${finalPercent / 100} → ${finalPercent}% of the original${change === 0 ? '' : `, ${aOrAn(answer)} ${answer}`}`,
        };
      },
    },
  },
  {
    id: 'n3-15', difficulty: 'medium',
    question: 'An interest rate rises from 2% to 3%. Is this a 1% increase?',
    answer: 'No. It is a rise of 1 percentage point, which is a 50% increase in the rate.',
    working: 'Percentage points: 3 − 2 = 1. Percentage increase: 1/2 × 100% = 50%',
    vary: {
      make: rand => {
        const r1 = pick(rand, [2, 4, 5, 10]);
        const d = rand(1, 3);
        const r2 = r1 + d;
        const increase = (d / r1) * 100;
        return {
          question: `An interest rate rises from ${r1}% to ${r2}%. Is this a ${d}% increase?`,
          answer: `No. It is a rise of ${d} percentage point${d === 1 ? '' : 's'}, which is a ${increase}% increase in the rate.`,
          working: `Percentage points: ${r2} − ${r1} = ${d}. Percentage increase: ${d}/${r1} × 100% = ${increase}%`,
        };
      },
    },
  },
  {
    id: 'n3-16', difficulty: 'medium',
    question: 'Find the simple interest on $2,000 invested at 3% per annum for 4 years.',
    answer: '$240',
    working: 'I = PRT/100 = 2000 × 3 × 4 ÷ 100 = $240',
    vary: {
      make: rand => {
        const P = 500 * rand(1, 20);
        const R = rand(1, 6);
        const T = rand(2, 8);
        const I = (P * R * T) / 100;
        return {
          question: `Find the simple interest on $${withCommas(P)} invested at ${R}% per annum for ${T} years.`,
          answer: `$${withCommas(I)}`,
          working: `I = PRT/100 = ${P} × ${R} × ${T} ÷ 100 = $${withCommas(I)}`,
        };
      },
    },
  },
  {
    id: 'n3-17', difficulty: 'hard',
    question: '$5,000 is invested at 4% per annum compounded yearly. Find the total amount after 2 years.',
    answer: '$5,408.00',
    working: 'A = P(1 + r/100)ⁿ = 5000 × 1.04² = $5,408.00',
    vary: {
      make: rand => {
        const k = rand(1, 20);
        const P = 1000 * k;
        const r = pick(rand, [2, 3, 4, 5, 6, 10]);
        const n = rand(2, 3);
        // Exact amount in cents, rounded half up using whole-number maths (no floating point slips).
        const top = P * 100 * (100 + r) ** n;
        const bottom = 100 ** n;
        const cents = Math.floor((2 * top + bottom) / (2 * bottom));
        return {
          question: `$${withCommas(P)} is invested at ${r}% per annum compounded yearly. Find the total amount after ${n} years.`,
          answer: dollars(cents),
          working: `A = P(1 + r/100)ⁿ = ${P} × ${(100 + r) / 100}${n === 2 ? '²' : '³'} = ${dollars(cents)}`,
        };
      },
    },
  },
]);

// ---------- O Level Mathematics 4052 — N4 Rate and speed ----------

// 135 → "2 h 15 min"   120 → "2 h"   45 → "45 min"
function hoursAndMinutes(totalMinutes) {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h === 0) return `${m} min`;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}

// Minutes after midnight → 12-hour clock: 585 → "9:45 a.m.", 735 → "12:15 p.m."
function clockTime(minutes) {
  const h24 = Math.floor(minutes / 60) % 24;
  const m = String(minutes % 60).padStart(2, '0');
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${m} ${h24 < 12 ? 'a.m.' : 'p.m.'}`;
}

// 1.5 → "1.5 h"  (hours as a decimal, for working lines)
function decimalHours(totalMinutes) {
  return `${Number((totalMinutes / 60).toFixed(4))} h`;
}

const oMathN4 = deck('N4 Rate and speed', [
  {
    id: 'n4-01', difficulty: 'easy',
    question: 'What is the formula for average speed? How is it different from constant speed?',
    answer: 'Average speed = total distance ÷ total time (include any time spent stopped).\nConstant speed means the speed never changes during the journey.',
  },
  {
    id: 'n4-02', difficulty: 'easy',
    question: 'A runner completes 400 m in 50 s. Find the runner\'s average speed in m/s.',
    answer: '8 m/s',
    working: 'Speed = distance ÷ time = 400 ÷ 50 = 8 m/s',
    vary: {
      make: rand => {
        const speed = rand(4, 10);
        const time = pick(rand, [10, 15, 20, 25, 30, 40, 50, 60, 75, 100]);
        return {
          question: `A runner completes ${speed * time} m in ${time} s. Find the runner's average speed in m/s.`,
          answer: `${speed} m/s`,
          working: `Speed = distance ÷ time = ${speed * time} ÷ ${time} = ${speed} m/s`,
        };
      },
    },
  },
  {
    id: 'n4-03', difficulty: 'easy',
    question: 'A car travels 180 km in 2.5 hours. Find its average speed.',
    answer: '72 km/h',
    working: 'Speed = 180 ÷ 2.5 = 72 km/h',
    vary: {
      make: rand => {
        const speed = 2 * rand(15, 60);
        const hours = pick(rand, [1.5, 2, 2.5, 3, 3.5, 4]);
        const distance = speed * hours;
        return {
          question: `A car travels ${distance} km in ${hours} hours. Find its average speed.`,
          answer: `${speed} km/h`,
          working: `Speed = ${distance} ÷ ${hours} = ${speed} km/h`,
        };
      },
    },
  },
  {
    id: 'n4-04', difficulty: 'medium',
    question: 'Mei walks at 4.5 km/h for 40 minutes. How far does she walk?',
    answer: '3 km',
    working: '40 min = 40/60 h → 4.5 × 40/60 = 3 km',
    vary: {
      make: rand => {
        const speed = pick(rand, [3, 4.5, 6, 7.5, 9, 12]);
        const minutes = 10 * rand(1, 9);
        const distance = Number(((speed * minutes) / 60).toFixed(2));
        return {
          question: `Mei walks at ${speed} km/h for ${minutes} minutes. How far does she walk?`,
          answer: `${distance} km`,
          working: `${minutes} min = ${minutes}/60 h → ${speed} × ${minutes}/60 = ${distance} km`,
        };
      },
    },
  },
  {
    id: 'n4-05', difficulty: 'medium',
    question: 'A lorry travels 255 km at 85 km/h. How long does the journey take?',
    answer: '3 h',
    working: 'Time = 255 ÷ 85 = 3 h',
    vary: {
      make: rand => {
        const speed = 4 * rand(10, 25);
        const minutes = 15 * rand(3, 16);
        const distance = (speed * minutes) / 60;
        return {
          question: `A lorry travels ${distance} km at ${speed} km/h. How long does the journey take?`,
          answer: hoursAndMinutes(minutes),
          working: `Time = ${distance} ÷ ${speed} = ${decimalHours(minutes)} = ${hoursAndMinutes(minutes)}`,
        };
      },
    },
  },
  {
    id: 'n4-06', difficulty: 'medium',
    question: 'Convert 72 km/h to m/s.',
    answer: '20 m/s',
    working: '72 × 1000 m ÷ 3600 s = 20 m/s (shortcut: ÷ 3.6)',
    vary: {
      make: rand => {
        const ms = rand(5, 40);
        const kmh = Number((ms * 3.6).toFixed(1));
        return {
          question: `Convert ${kmh} km/h to m/s.`,
          answer: `${ms} m/s`,
          working: `${kmh} × 1000 m ÷ 3600 s = ${ms} m/s (shortcut: ÷ 3.6)`,
        };
      },
    },
  },
  {
    id: 'n4-07', difficulty: 'medium',
    question: 'Convert 15 m/s to km/h.',
    answer: '54 km/h',
    working: '15 m/s = 15 × 3600 m per hour = 54,000 m/h = 54 km/h (shortcut: × 3.6)',
    vary: {
      make: rand => {
        const ms = rand(5, 40);
        const kmh = Number((ms * 3.6).toFixed(1));
        return {
          question: `Convert ${ms} m/s to km/h.`,
          answer: `${kmh} km/h`,
          working: `${ms} m/s = ${ms} × 3600 m per hour = ${withCommas(ms * 3600)} m/h = ${kmh} km/h (shortcut: × 3.6)`,
        };
      },
    },
  },
  {
    id: 'n4-08', difficulty: 'hard',
    question: 'A cyclist rides 60 km at 30 km/h, then another 60 km at 60 km/h. Find the average speed for the whole journey.',
    answer: '40 km/h',
    working: 'Times: 60 ÷ 30 = 2 h and 60 ÷ 60 = 1 h → 120 km ÷ 3 h = 40 km/h (NOT the average of 30 and 60)',
    vary: {
      make: rand => {
        // Speed pairs whose average speed over equal distances is a whole number.
        const speeds = [20, 30, 40, 60, 80, 90, 120];
        const pairs = [];
        for (const a of speeds) for (const b of speeds) if (a < b && (2 * a * b) % (a + b) === 0) pairs.push([a, b]);
        const [s1, s2] = pick(rand, pairs);
        const d = lcm(s1, s2) * rand(1, 2);
        const t1 = d / s1;
        const t2 = d / s2;
        const average = (2 * d) / (t1 + t2);
        return {
          question: `A cyclist rides ${d} km at ${s1} km/h, then another ${d} km at ${s2} km/h. Find the average speed for the whole journey.`,
          answer: `${average} km/h`,
          working: `Times: ${d} ÷ ${s1} = ${t1} h and ${d} ÷ ${s2} = ${t2} h → ${2 * d} km ÷ ${t1 + t2} h = ${average} km/h (NOT the average of ${s1} and ${s2})`,
        };
      },
    },
  },
  {
    id: 'n4-09', difficulty: 'hard',
    question: 'A train leaves at 9:45 a.m. and travels 210 km at 84 km/h. At what time does it arrive?',
    answer: '12:15 p.m.',
    working: 'Time = 210 ÷ 84 = 2.5 h = 2 h 30 min → 9:45 a.m. + 2 h 30 min = 12:15 p.m.',
    vary: {
      make: rand => {
        const speed = 4 * rand(15, 30);
        const minutes = 15 * rand(3, 16);
        const distance = (speed * minutes) / 60;
        const start = 6 * 60 + 15 * rand(0, 23); // between 6:00 a.m. and 11:45 a.m.
        return {
          question: `A train leaves at ${clockTime(start)} and travels ${distance} km at ${speed} km/h. At what time does it arrive?`,
          answer: clockTime(start + minutes),
          working: `Time = ${distance} ÷ ${speed} = ${decimalHours(minutes)} = ${hoursAndMinutes(minutes)} → ${clockTime(start)} + ${hoursAndMinutes(minutes)} = ${clockTime(start + minutes)}`,
        };
      },
    },
  },
  {
    id: 'n4-10', difficulty: 'easy',
    question: 'A tap fills 240 litres of water in 8 minutes. Find the rate of flow.',
    answer: '30 litres per minute',
    working: 'Rate = 240 ÷ 8 = 30 L/min',
    vary: {
      make: rand => {
        const rate = rand(5, 40);
        const minutes = rand(3, 15);
        return {
          question: `A tap fills ${rate * minutes} litres of water in ${minutes} minutes. Find the rate of flow.`,
          answer: `${rate} litres per minute`,
          working: `Rate = ${rate * minutes} ÷ ${minutes} = ${rate} L/min`,
        };
      },
    },
  },
  {
    id: 'n4-11', difficulty: 'medium',
    question: 'A pipe fills a 450-litre tank at 12 litres per minute. How long does it take to fill the tank?',
    answer: '37 min 30 s',
    working: 'Time = 450 ÷ 12 = 37.5 min = 37 min 30 s',
    vary: {
      make: rand => {
        const rate = pick(rand, [4, 6, 8, 10, 12, 15, 20, 24]);
        const halfMinutes = rand(20, 120); // time in half-minutes, so it may end in 30 s
        const litres = (rate * halfMinutes) / 2;
        const whole = Math.floor(halfMinutes / 2);
        const answer = halfMinutes % 2 === 0 ? `${whole} min` : `${whole} min 30 s`;
        return {
          question: `A pipe fills ${aOrAn(litres)} ${litres}-litre tank at ${rate} litres per minute. How long does it take to fill the tank?`,
          answer,
          working: `Time = ${litres} ÷ ${rate} = ${halfMinutes / 2} min${halfMinutes % 2 === 0 ? '' : ` = ${answer}`}`,
        };
      },
    },
  },
  {
    id: 'n4-12', difficulty: 'hard',
    question: 'Tap A can fill a tank in 6 hours. Tap B can fill it in 3 hours. How long do both taps take together?',
    answer: '2 h',
    working: 'Per hour: 1/6 + 1/3 = 1/2 of the tank → 2 h',
    vary: {
      make: rand => {
        // Pairs where the combined time is a whole number of minutes.
        const options = [2, 3, 4, 5, 6, 8, 10, 12];
        const pairs = [];
        for (const a of options) for (const b of options) if (a !== b && (60 * a * b) % (a + b) === 0) pairs.push([a, b]);
        const [a, b] = pick(rand, pairs);
        const minutes = (60 * a * b) / (a + b);
        const perHour = fraction(a + b, a * b);
        return {
          question: `Tap A can fill a tank in ${a} hours. Tap B can fill it in ${b} hours. How long do both taps take together?`,
          answer: hoursAndMinutes(minutes),
          working: `Per hour: 1/${a} + 1/${b} = ${perHour} of the tank → 1 ÷ ${perHour} = ${fraction(a * b, a + b)} h = ${hoursAndMinutes(minutes)}`,
        };
      },
    },
  },
  {
    id: 'n4-13', difficulty: 'medium',
    question: 'Ali types at 45 words per minute. How many words can he type in 1 hour 20 minutes?',
    answer: '3,600 words',
    working: '1 h 20 min = 80 min → 45 × 80 = 3,600 words',
    vary: {
      make: rand => {
        const rate = rand(25, 70);
        const minutes = 60 + 5 * rand(1, 11);
        return {
          question: `Ali types at ${rate} words per minute. How many words can he type in ${minutes >= 60 ? `1 hour ${minutes - 60} minutes` : `${minutes} minutes`}?`,
          answer: `${withCommas(rate * minutes)} words`,
          working: `1 h ${minutes - 60} min = ${minutes} min → ${rate} × ${minutes} = ${withCommas(rate * minutes)} words`,
        };
      },
    },
  },
  {
    id: 'n4-14', difficulty: 'medium',
    question: 'A car uses 8 litres of petrol per 100 km. How much petrol does it need for 350 km?',
    answer: '28 litres',
    working: '350 ÷ 100 × 8 = 28 litres',
    vary: {
      make: rand => {
        const per100 = rand(5, 12);
        const km = 50 * rand(2, 12);
        const litres = (per100 * km) / 100;
        return {
          question: `A car uses ${per100} litres of petrol per 100 km. How much petrol does it need for ${km} km?`,
          answer: `${litres} litres`,
          working: `${km} ÷ 100 × ${per100} = ${litres} litres`,
        };
      },
    },
  },
  {
    id: 'n4-15', difficulty: 'hard',
    question: 'Two cars are 300 km apart and drive towards each other at 70 km/h and 80 km/h. How long until they meet?',
    answer: '2 h',
    working: 'They close the gap at 70 + 80 = 150 km/h → 300 ÷ 150 = 2 h',
    vary: {
      make: rand => {
        const s1 = 5 * rand(8, 16);
        const s2 = 5 * rand(8, 18);
        const minutes = 30 * rand(2, 8);
        const distance = ((s1 + s2) * minutes) / 60;
        return {
          question: `Two cars are ${distance} km apart and drive towards each other at ${s1} km/h and ${s2} km/h. How long until they meet?`,
          answer: hoursAndMinutes(minutes),
          working: `They close the gap at ${s1} + ${s2} = ${s1 + s2} km/h → ${distance} ÷ ${s1 + s2} = ${decimalHours(minutes)} = ${hoursAndMinutes(minutes)}`,
        };
      },
    },
  },
]);

// ---------- Algebra helpers (used by N5 – N7) ----------

// Writes terms as tidy algebra. Each term is [coefficient, letters].
// [[2, 'x²'], [-5, 'x'], [-12, '']] → "2x² − 5x − 12"   (1x → x, zero terms are skipped)
function poly(terms) {
  let out = '';
  for (const [coef, letters] of terms) {
    if (coef === 0) continue;
    const size = Math.abs(coef);
    const body = letters && size === 1 ? letters : `${size}${letters}`;
    if (out === '') out = coef < 0 ? `−${body}` : body;
    else out += coef < 0 ? ` − ${body}` : ` + ${body}`;
  }
  return out || '0';
}

// A bracket like "(2x − 3)":  lin(2, -3) → "(2x − 3)"
function lin(a, b, letter = 'x') {
  return `(${poly([[a, letter], [b, '']])})`;
}

// A random whole number from 1 to max, made negative half the time.
function nonZero(rand, max) {
  const n = rand(1, max);
  return rand(0, 1) ? n : -n;
}

// " + 5" or " − 5" (for joining a number onto an expression)
function plusMinus(n) {
  return n < 0 ? ` − ${-n}` : ` + ${n}`;
}

// ---------- O Level Mathematics 4052 — N5 Algebraic expressions and formulae ----------

const oMathN5 = deck('N5 Algebraic expressions and formulae', [
  {
    id: 'n5-01', difficulty: 'easy',
    question: 'Find the value of 3x² − 2xy when x = −2 and y = 5.',
    answer: '32',
    working: '3 × (−2)² − 2 × (−2) × 5 = 12 + 20 = 32',
    vary: {
      make: rand => {
        const a = rand(1, 5);
        const b = nonZero(rand, 5);
        const x = nonZero(rand, 5);
        const y = nonZero(rand, 6);
        const part1 = a * x * x;
        const part2 = b * x * y;
        return {
          question: `Find the value of ${poly([[a, 'x²'], [b, 'xy']])} when x = ${signed(x)} and y = ${signed(y)}.`,
          answer: signed(part1 + part2),
          working: `${a} × (${signed(x)})² ${b < 0 ? '−' : '+'} ${Math.abs(b)} × (${signed(x)}) × (${signed(y)}) = ${signed(part1)}${plusMinus(part2)} = ${signed(part1 + part2)}`,
        };
      },
    },
  },
  {
    id: 'n5-02', difficulty: 'easy',
    question: 'Simplify 5a − 3b − 2a + 7b.',
    answer: '3a + 4b',
    working: 'a terms: 5a − 2a = 3a; b terms: −3b + 7b = 4b',
    vary: {
      make: rand => {
        const [p, q, r, s] = [nonZero(rand, 9), nonZero(rand, 9), nonZero(rand, 9), nonZero(rand, 9)];
        return {
          question: `Simplify ${poly([[p, 'a'], [q, 'b'], [r, 'a'], [s, 'b']])}.`,
          answer: poly([[p + r, 'a'], [q + s, 'b']]),
          working: `a terms: ${poly([[p, 'a'], [r, 'a']])} = ${poly([[p + r, 'a']])}; b terms: ${poly([[q, 'b'], [s, 'b']])} = ${poly([[q + s, 'b']])}`,
        };
      },
    },
  },
  {
    id: 'n5-03', difficulty: 'medium',
    question: 'Expand and simplify 3(2x − 5) − 2(x − 4).',
    answer: '4x − 7',
    working: '6x − 15 − 2x + 8 = 4x − 7',
    vary: {
      make: rand => {
        const k1 = rand(2, 5);
        const [a1, b1] = [rand(1, 5), nonZero(rand, 9)];
        const k2 = nonZero(rand, 5);
        const [a2, b2] = [rand(1, 5), nonZero(rand, 9)];
        return {
          question: `Expand and simplify ${k1}${lin(a1, b1)} ${k2 < 0 ? '−' : '+'} ${Math.abs(k2)}${lin(a2, b2)}.`,
          answer: poly([[k1 * a1 + k2 * a2, 'x'], [k1 * b1 + k2 * b2, '']]),
          working: `${poly([[k1 * a1, 'x'], [k1 * b1, ''], [k2 * a2, 'x'], [k2 * b2, '']])} = ${poly([[k1 * a1 + k2 * a2, 'x'], [k1 * b1 + k2 * b2, '']])}`,
        };
      },
    },
  },
  {
    id: 'n5-04', difficulty: 'medium',
    question: 'Expand (2x + 3)(x − 4).',
    answer: '2x² − 5x − 12',
    working: '2x² − 8x + 3x − 12 = 2x² − 5x − 12',
    vary: {
      make: rand => {
        const [a, b, c, d] = [rand(1, 4), nonZero(rand, 7), rand(1, 3), nonZero(rand, 7)];
        return {
          question: `Expand ${lin(a, b)}${lin(c, d)}.`,
          answer: poly([[a * c, 'x²'], [a * d + b * c, 'x'], [b * d, '']]),
          working: `${poly([[a * c, 'x²'], [a * d, 'x'], [b * c, 'x'], [b * d, '']])} = ${poly([[a * c, 'x²'], [a * d + b * c, 'x'], [b * d, '']])}`,
        };
      },
    },
  },
  {
    id: 'n5-05', difficulty: 'medium',
    question: 'Expand (3x − 2)².',
    answer: '9x² − 12x + 4',
    working: '(a − b)² = a² − 2ab + b² → (3x)² − 2(3x)(2) + 2² = 9x² − 12x + 4',
    vary: {
      make: rand => {
        const a = rand(1, 5);
        const b = nonZero(rand, 9);
        const ax = a === 1 ? 'x' : `${a}x`;
        return {
          question: `Expand ${lin(a, b)}².`,
          answer: poly([[a * a, 'x²'], [2 * a * b, 'x'], [b * b, '']]),
          working: `(a ${b < 0 ? '−' : '+'} b)² = a² ${b < 0 ? '−' : '+'} 2ab + b² → (${ax})² ${b < 0 ? '−' : '+'} 2(${ax})(${Math.abs(b)}) + ${Math.abs(b)}² = ${poly([[a * a, 'x²'], [2 * a * b, 'x'], [b * b, '']])}`,
        };
      },
    },
  },
  {
    id: 'n5-06', difficulty: 'easy',
    question: 'Factorise 6x² − 9xy completely.',
    answer: '3x(2x − 3y)',
    working: 'HCF of 6x² and 9xy is 3x → 3x(2x − 3y)',
    vary: {
      make: rand => {
        const k = rand(2, 6);
        const [m, n0] = pick(rand, COPRIME_PAIRS);
        const n = rand(0, 1) ? n0 : -n0;
        return {
          question: `Factorise ${poly([[k * m, 'x²'], [k * n, 'xy']])} completely.`,
          answer: `${k}x(${poly([[m, 'x'], [n, 'y']])})`,
          working: `HCF of ${k * m}x² and ${k * Math.abs(n)}xy is ${k}x → ${k}x(${poly([[m, 'x'], [n, 'y']])})`,
        };
      },
    },
  },
  {
    id: 'n5-07', difficulty: 'medium',
    question: 'Factorise x² + 5x − 14.',
    answer: '(x + 7)(x − 2)',
    working: 'Find two numbers that multiply to −14 and add to 5: 7 and −2',
    vary: {
      make: rand => {
        const p = nonZero(rand, 9);
        const q = pick(rand, [-9, -8, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(v => v !== p && v !== -p));
        const [big, small] = p > q ? [p, q] : [q, p];
        return {
          question: `Factorise ${poly([[1, 'x²'], [p + q, 'x'], [p * q, '']])}.`,
          answer: `${lin(1, big)}${lin(1, small)}`,
          working: `Find two numbers that multiply to ${signed(p * q)} and add to ${signed(p + q)}: ${signed(big)} and ${signed(small)}`,
        };
      },
    },
  },
  {
    id: 'n5-08', difficulty: 'hard',
    question: 'Factorise 2x² + 7x + 3.',
    answer: '(2x + 1)(x + 3)',
    working: 'Check: (2x + 1)(x + 3) = 2x² + 6x + x + 3 = 2x² + 7x + 3',
    vary: {
      make: rand => {
        const a = pick(rand, [2, 3, 5]);
        const b = pick(rand, [-7, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 7].filter(v => gcd(a, Math.abs(v)) === 1));
        const d = nonZero(rand, 7);
        const expanded = poly([[a, 'x²'], [a * d + b, 'x'], [b * d, '']]);
        return {
          question: `Factorise ${expanded}.`,
          answer: `${lin(a, b)}${lin(1, d)}`,
          working: `Check: ${lin(a, b)}${lin(1, d)} = ${poly([[a, 'x²'], [a * d, 'x'], [b, 'x'], [b * d, '']])} = ${expanded}`,
        };
      },
    },
  },
  {
    id: 'n5-09', difficulty: 'medium',
    question: 'Factorise 9x² − 25y².',
    answer: '(3x + 5y)(3x − 5y)',
    working: 'Difference of two squares: a² − b² = (a + b)(a − b) with a = 3x, b = 5y',
    vary: {
      make: rand => {
        const a = rand(1, 7);
        const b = pick(rand, [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(v => gcd(a, v) === 1));
        const ax = a === 1 ? 'x' : `${a}x`;
        const by = b === 1 ? 'y' : `${b}y`;
        return {
          question: `Factorise ${poly([[a * a, 'x²'], [-b * b, 'y²']])}.`,
          answer: `(${ax} + ${by})(${ax} − ${by})`,
          working: `Difference of two squares: a² − b² = (a + b)(a − b) with a = ${ax}, b = ${by}`,
        };
      },
    },
  },
  {
    id: 'n5-10', difficulty: 'hard',
    question: 'Factorise 2ax − 6ay + bx − 3by.',
    answer: '(2a + b)(x − 3y)',
    working: 'Group: 2a(x − 3y) + b(x − 3y) = (2a + b)(x − 3y)',
    vary: {
      make: rand => {
        const m = rand(1, 4);
        const n = nonZero(rand, 4);
        const k = nonZero(rand, 5);
        const inner = poly([[1, 'x'], [k, 'y']]);
        const ma = m === 1 ? 'a' : `${m}a`;
        const nb = Math.abs(n) === 1 ? 'b' : `${Math.abs(n)}b`;
        return {
          question: `Factorise ${poly([[m, 'ax'], [m * k, 'ay'], [n, 'bx'], [n * k, 'by']])}.`,
          answer: `(${poly([[m, 'a'], [n, 'b']])})(${inner})`,
          working: `Group: ${ma}(${inner}) ${n < 0 ? '−' : '+'} ${nb}(${inner}) = (${poly([[m, 'a'], [n, 'b']])})(${inner})`,
        };
      },
    },
  },
  {
    id: 'n5-11', difficulty: 'hard',
    question: 'Simplify (x² − 9)/(x² + x − 6).',
    answer: '(x − 3)/(x − 2)',
    working: '(x + 3)(x − 3) / ((x + 3)(x − 2)) → cancel (x + 3)',
    vary: {
      make: rand => {
        const p = rand(1, 9);
        const q = pick(rand, [-9, -8, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(v => v !== p && v !== -p));
        return {
          question: `Simplify (${poly([[1, 'x²'], [-p * p, '']])})/(${poly([[1, 'x²'], [p + q, 'x'], [p * q, '']])}).`,
          answer: `${lin(1, -p)}/${lin(1, q)}`,
          working: `${lin(1, p)}${lin(1, -p)} / (${lin(1, p)}${lin(1, q)}) → cancel ${lin(1, p)}`,
        };
      },
    },
  },
  {
    id: 'n5-12', difficulty: 'hard',
    question: 'Express 2/(x + 1) + 3/(x − 2) as a single fraction.',
    answer: '(5x − 1)/((x + 1)(x − 2))',
    working: '[2(x − 2) + 3(x + 1)] / ((x + 1)(x − 2)) = (2x − 4 + 3x + 3) / ((x + 1)(x − 2))',
    vary: {
      make: rand => {
        const a = rand(1, 6);
        const b = nonZero(rand, 6);
        const p = nonZero(rand, 6);
        const q = pick(rand, [-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6].filter(v => v !== p));
        const denominator = `(${lin(1, p)}${lin(1, q)})`;
        return {
          question: `Express ${a}/${lin(1, p)} ${b < 0 ? '−' : '+'} ${Math.abs(b)}/${lin(1, q)} as a single fraction.`,
          answer: `(${poly([[a + b, 'x'], [a * q + b * p, '']])})/${denominator}`,
          working: `[${a}${lin(1, q)} ${b < 0 ? '−' : '+'} ${Math.abs(b)}${lin(1, p)}] / ${denominator} = (${poly([[a, 'x'], [a * q, ''], [b, 'x'], [b * p, '']])}) / ${denominator}`,
        };
      },
    },
  },
  {
    id: 'n5-13', difficulty: 'medium',
    question: 'Make x the subject of the formula y = (3x − 5)/2.',
    answer: 'x = (2y + 5)/3',
    working: '2y = 3x − 5 → 3x = 2y + 5 → x = (2y + 5)/3',
    vary: {
      make: rand => {
        const a = rand(2, 7);
        const b = nonZero(rand, 9);
        const c = pick(rand, [2, 3, 4, 5].filter(v => v !== a));
        const rhs = poly([[c, 'y'], [-b, '']]);
        return {
          question: `Make x the subject of the formula y = ${lin(a, b)}/${c}.`,
          answer: `x = (${rhs})/${a}`,
          working: `${c}y = ${poly([[a, 'x'], [b, '']])} → ${a}x = ${rhs} → x = (${rhs})/${a}`,
        };
      },
    },
  },
  {
    id: 'n5-14', difficulty: 'easy',
    question: 'Make t the subject of the formula v = u + at.',
    answer: 't = (v − u)/a',
    working: 'v − u = at → t = (v − u)/a',
  },
  {
    id: 'n5-15', difficulty: 'hard',
    question: 'Make r the subject of the formula V = ⅓πr²h (r > 0).',
    answer: 'r = √(3V/(πh))',
    working: '3V = πr²h → r² = 3V/(πh) → r = √(3V/(πh))',
  },
  {
    id: 'n5-16', difficulty: 'medium',
    question: 'Given v² = u² + 2as, find v when u = 3, a = 2 and s = 4 (v > 0).',
    answer: '5',
    working: 'v² = 3² + 2 × 2 × 4 = 9 + 16 = 25 → v = √25 = 5',
    vary: {
      make: rand => {
        const u = rand(1, 9);
        const v = u + 2 * rand(1, 5); // same parity as u, so v² − u² is even
        const as = (v * v - u * u) / 2;
        const divisors = [];
        for (let d = 1; d <= 12; d++) if (as % d === 0) divisors.push(d);
        const a = pick(rand, divisors);
        const s = as / a;
        return {
          question: `Given v² = u² + 2as, find v when u = ${u}, a = ${a} and s = ${s} (v > 0).`,
          answer: String(v),
          working: `v² = ${u}² + 2 × ${a} × ${s} = ${u * u} + ${2 * as} = ${v * v} → v = √${v * v} = ${v}`,
        };
      },
    },
  },
]);

// ---------- O Level Mathematics 4052 — N6 Functions and graphs ----------

// (3, -2) → "(3, −2)"
function point(x, y) {
  return `(${signed(x)}, ${signed(y)})`;
}

const oMathN6 = deck('N6 Functions and graphs', [
  {
    id: 'n6-01', difficulty: 'medium',
    question: 'Find the gradient and the y-intercept of the line 2y = 6x − 8.',
    answer: 'Gradient = 3, y-intercept = −4',
    working: 'Divide by 2: y = 3x − 4, which is y = mx + c with m = 3, c = −4',
    vary: {
      make: rand => {
        const k = rand(2, 5);
        const m = nonZero(rand, 5);
        const c = nonZero(rand, 6);
        return {
          question: `Find the gradient and the y-intercept of the line ${k}y = ${poly([[k * m, 'x'], [k * c, '']])}.`,
          answer: `Gradient = ${signed(m)}, y-intercept = ${signed(c)}`,
          working: `Divide by ${k}: y = ${poly([[m, 'x'], [c, '']])}, which is y = mx + c with m = ${signed(m)}, c = ${signed(c)}`,
        };
      },
    },
  },
  {
    id: 'n6-02', difficulty: 'easy',
    question: 'Find the gradient of the line passing through (1, 3) and (4, 12).',
    answer: '3',
    working: 'Gradient = (12 − 3) ÷ (4 − 1) = 9 ÷ 3 = 3',
    vary: {
      make: rand => {
        const x1 = nonZero(rand, 6);
        const y1 = nonZero(rand, 9);
        const dx = rand(1, 6);
        const m = nonZero(rand, 4);
        const x2 = x1 + dx;
        const y2 = y1 + m * dx;
        return {
          question: `Find the gradient of the line passing through ${point(x1, y1)} and ${point(x2, y2)}.`,
          answer: signed(m),
          working: `Gradient = (${signed(y2)} − ${y1 < 0 ? `(${signed(y1)})` : y1}) ÷ (${signed(x2)} − ${x1 < 0 ? `(${signed(x1)})` : x1}) = ${signed(m * dx)} ÷ ${dx} = ${signed(m)}`,
        };
      },
    },
  },
  {
    id: 'n6-03', difficulty: 'medium',
    question: 'Find the equation of the line with gradient 2 that passes through (3, 1).',
    answer: 'y = 2x − 5',
    working: 'y = 2x + c → 1 = 2(3) + c → c = −5',
    vary: {
      make: rand => {
        const m = nonZero(rand, 5);
        const x1 = nonZero(rand, 5);
        const y1 = nonZero(rand, 9);
        const c = y1 - m * x1;
        return {
          question: `Find the equation of the line with gradient ${signed(m)} that passes through ${point(x1, y1)}.`,
          answer: `y = ${poly([[m, 'x'], [c, '']])}`,
          working: `y = ${poly([[m, 'x']])} + c → ${signed(y1)} = ${signed(m)}(${signed(x1)}) + c → c = ${signed(c)}`,
        };
      },
    },
  },
  {
    id: 'n6-04', difficulty: 'easy',
    question: 'Given f(x) = 3x − 7, find f(−2).',
    answer: '−13',
    working: 'f(−2) = 3(−2) − 7 = −6 − 7 = −13',
    vary: {
      make: rand => {
        const a = nonZero(rand, 6);
        const b = nonZero(rand, 9);
        const x = nonZero(rand, 6);
        return {
          question: `Given f(x) = ${poly([[a, 'x'], [b, '']])}, find f(${signed(x)}).`,
          answer: signed(a * x + b),
          working: `f(${signed(x)}) = ${signed(a)}(${signed(x)})${plusMinus(b)} = ${signed(a * x)}${plusMinus(b)} = ${signed(a * x + b)}`,
        };
      },
    },
  },
  {
    id: 'n6-05', difficulty: 'medium',
    question: 'Given f(x) = x² − 4x + 1, find f(−3).',
    answer: '22',
    working: 'f(−3) = (−3)² − 4(−3) + 1 = 9 + 12 + 1 = 22',
    vary: {
      make: rand => {
        const b = nonZero(rand, 6);
        const c = nonZero(rand, 9);
        const x = nonZero(rand, 5);
        return {
          question: `Given f(x) = ${poly([[1, 'x²'], [b, 'x'], [c, '']])}, find f(${signed(x)}).`,
          answer: signed(x * x + b * x + c),
          working: `f(${signed(x)}) = (${signed(x)})²${plusMinus(b)}(${signed(x)})${plusMinus(c)} = ${x * x}${plusMinus(b * x)}${plusMinus(c)} = ${signed(x * x + b * x + c)}`,
        };
      },
    },
  },
  {
    id: 'n6-06', difficulty: 'medium',
    question: 'State the coordinates of the turning point of y = (x − 3)² + 2. Is it a maximum or a minimum?',
    answer: '(3, 2), a minimum',
    working: 'y = (x − h)² + k has turning point (h, k). The x² is positive, so the curve is U-shaped → minimum',
    vary: {
      make: rand => {
        const h = nonZero(rand, 6);
        const k = nonZero(rand, 9);
        const flip = rand(0, 1) === 1;
        return {
          question: `State the coordinates of the turning point of y = ${flip ? '−' : ''}${lin(1, -h)}²${plusMinus(k)}. Is it a maximum or a minimum?`,
          answer: `${point(h, k)}, a ${flip ? 'maximum' : 'minimum'}`,
          working: flip
            ? 'y = −(x − h)² + k has turning point (h, k). The x² is negative, so the curve is ∩-shaped → maximum'
            : 'y = (x − h)² + k has turning point (h, k). The x² is positive, so the curve is U-shaped → minimum',
        };
      },
    },
  },
  {
    id: 'n6-07', difficulty: 'medium',
    question: 'Find the equation of the line of symmetry of y = (x − 2)(x − 8).',
    answer: 'x = 5',
    working: 'The curve cuts the x-axis at x = 2 and x = 8. The line of symmetry is halfway: (2 + 8) ÷ 2 = 5',
    vary: {
      make: rand => {
        const p = nonZero(rand, 9);
        const q = pick(rand, [-9, -7, -5, -3, -1, 1, 3, 5, 7, 9, -8, -6, -4, -2, 2, 4, 6, 8].filter(v => v !== p && (v - p) % 2 === 0));
        const mid = (p + q) / 2;
        return {
          question: `Find the equation of the line of symmetry of y = ${lin(1, -p)}${lin(1, -q)}.`,
          answer: `x = ${signed(mid)}`,
          working: `The curve cuts the x-axis at x = ${signed(p)} and x = ${signed(q)}. The line of symmetry is halfway: (${signed(p)}${plusMinus(q)}) ÷ 2 = ${signed(mid)}`,
        };
      },
    },
  },
  {
    id: 'n6-08', difficulty: 'medium',
    question: 'Where does the graph of y = (x + 1)(x − 5) cross the x-axis and the y-axis?',
    answer: 'x-axis at x = −1 and x = 5; y-axis at y = −5',
    working: 'x-axis: y = 0 → x + 1 = 0 or x − 5 = 0. y-axis: x = 0 → y = (1)(−5) = −5',
    vary: {
      make: rand => {
        const p = nonZero(rand, 8);
        const q = pick(rand, [-8, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8].filter(v => v !== p));
        const [small, big] = p < q ? [p, q] : [q, p];
        return {
          question: `Where does the graph of y = ${lin(1, -p)}${lin(1, -q)} cross the x-axis and the y-axis?`,
          answer: `x-axis at x = ${signed(small)} and x = ${signed(big)}; y-axis at y = ${signed(p * q)}`,
          working: `x-axis: y = 0 → ${poly([[1, 'x'], [-p, '']])} = 0 or ${poly([[1, 'x'], [-q, '']])} = 0. y-axis: x = 0 → y = (${signed(-p)})(${signed(-q)}) = ${signed(p * q)}`,
        };
      },
    },
  },
  {
    id: 'n6-09', difficulty: 'hard',
    question: 'Express x² − 6x + 11 in the form (x − h)² + k. Hence state the minimum point.',
    answer: '(x − 3)² + 2; minimum point (3, 2)',
    working: 'Half of −6 is −3: (x − 3)² = x² − 6x + 9, so x² − 6x + 11 = (x − 3)² + 2',
    vary: {
      make: rand => {
        const h = nonZero(rand, 6);
        const k = nonZero(rand, 9);
        const c = h * h + k;
        return {
          question: `Express ${poly([[1, 'x²'], [-2 * h, 'x'], [c, '']])} in the form (x − h)² + k. Hence state the minimum point.`,
          answer: `${lin(1, -h)}²${plusMinus(k)}; minimum point ${point(h, k)}`,
          working: `Half of ${signed(-2 * h)} is ${signed(-h)}: ${lin(1, -h)}² = ${poly([[1, 'x²'], [-2 * h, 'x'], [h * h, '']])}, so ${poly([[1, 'x²'], [-2 * h, 'x'], [c, '']])} = ${lin(1, -h)}²${plusMinus(k)}`,
        };
      },
    },
  },
  {
    id: 'n6-10', difficulty: 'easy',
    question: 'For the graph y = 3 × 2ˣ, find y when x = 4.',
    answer: '48',
    working: '3 × 2⁴ = 3 × 16 = 48',
    vary: {
      make: rand => {
        const k = rand(1, 5);
        const a = pick(rand, [2, 3]);
        const x = a === 2 ? rand(0, 6) : rand(0, 4);
        return {
          question: `For the graph y = ${k} × ${a}ˣ, find y when x = ${x}.`,
          answer: String(k * a ** x),
          working: `${k} × ${power(a, x)} = ${k} × ${a ** x} = ${k * a ** x}`,
        };
      },
    },
  },
  {
    id: 'n6-11', difficulty: 'medium',
    question: 'Find the point where the lines y = 2x + 1 and y = −x + 7 meet.',
    answer: '(2, 5)',
    working: '2x + 1 = −x + 7 → 3x = 6 → x = 2, y = 2(2) + 1 = 5',
    vary: {
      make: rand => {
        const X = nonZero(rand, 6);
        const Y = nonZero(rand, 9);
        const m1 = nonZero(rand, 4);
        const m2 = pick(rand, [-4, -3, -2, -1, 1, 2, 3, 4].filter(v => v !== m1));
        const c1 = Y - m1 * X;
        const c2 = Y - m2 * X;
        return {
          question: `Find the point where the lines y = ${poly([[m1, 'x'], [c1, '']])} and y = ${poly([[m2, 'x'], [c2, '']])} meet.`,
          answer: point(X, Y),
          working: `${poly([[m1, 'x'], [c1, '']])} = ${poly([[m2, 'x'], [c2, '']])} → ${poly([[m1 - m2, 'x']])} = ${signed(c2 - c1)} → x = ${signed(X)}, y = ${signed(Y)}`,
        };
      },
    },
  },
  {
    id: 'n6-12', difficulty: 'easy',
    question: 'Does the point (2, 5) lie on the line y = 3x − 1?',
    answer: 'Yes',
    working: 'Substitute x = 2: y = 3(2) − 1 = 5, which matches',
    vary: {
      make: rand => {
        const m = nonZero(rand, 5);
        const c = nonZero(rand, 9);
        const x = nonZero(rand, 5);
        const onLine = rand(0, 1) === 1;
        const yLine = m * x + c;
        const y = onLine ? yLine : yLine + nonZero(rand, 3);
        return {
          question: `Does the point ${point(x, y)} lie on the line y = ${poly([[m, 'x'], [c, '']])}?`,
          answer: onLine ? 'Yes' : 'No',
          working: `Substitute x = ${signed(x)}: y = ${signed(m)}(${signed(x)})${plusMinus(c)} = ${signed(yLine)}, which ${onLine ? 'matches' : `is not ${signed(y)}`}`,
        };
      },
    },
  },
  {
    id: 'n6-13', difficulty: 'easy',
    question: 'Describe the shape of y = ax² when a > 0 and when a < 0.',
    answer: 'a > 0: U-shaped curve with a minimum point.\na < 0: ∩-shaped curve with a maximum point.\nBoth are symmetrical about a vertical line through the turning point.',
  },
  {
    id: 'n6-14', difficulty: 'medium',
    question: 'Describe the graph of y = k/x where k > 0.',
    answer: 'A hyperbola with two separate branches, in the 1st and 3rd quadrants. It gets closer and closer to both axes but never touches them, and there is no point at x = 0.',
  },
  {
    id: 'n6-15', difficulty: 'medium',
    question: 'Describe the graph of y = aˣ where a > 1.',
    answer: 'It passes through (0, 1), is always above the x-axis, and increases more and more steeply. As x becomes very negative, it gets closer to the x-axis but never touches it.',
  },
  {
    id: 'n6-16', difficulty: 'hard',
    question: 'How do you estimate the gradient of a curve at a given point?',
    answer: 'Draw the tangent to the curve at that point (a straight line that just touches the curve). Pick two points far apart on the tangent and calculate rise ÷ run.',
  },
]);

// ---------- O Level Mathematics 4052 — N7 Equations and inequalities ----------

// -1, 2 → "−1/2"   6, 3 → "2"   (a fraction in simplest form with a proper minus sign)
function signedFraction(top, bottom) {
  const negative = top * bottom < 0;
  return (negative ? '−' : '') + fraction(Math.abs(top), Math.abs(bottom));
}

// -0.1875 → "−0.19"  (2 decimal places, proper minus sign)
function twoDp(n) {
  return signed(Number(n.toFixed(2))).replace(/^(−?\d+)$/, '$1.00').replace(/^(−?\d+\.\d)$/, '$10');
}

// Flips an inequality sign: '<' → '>', '≤' → '≥'
const FLIP = { '<': '>', '>': '<', '≤': '≥', '≥': '≤' };

const oMathN7 = deck('N7 Equations and inequalities', [
  {
    id: 'n7-01', difficulty: 'easy',
    question: 'Solve 5x − 7 = 2x + 8.',
    answer: 'x = 5',
    working: '5x − 2x = 8 + 7 → 3x = 15 → x = 5',
    vary: {
      make: rand => {
        const x = nonZero(rand, 9);
        const a = rand(2, 9);
        const c = pick(rand, [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8].filter(v => v !== a));
        const b = nonZero(rand, 12);
        const d = a * x + b - c * x;
        return {
          question: `Solve ${poly([[a, 'x'], [b, '']])} = ${poly([[c, 'x'], [d, '']])}.`,
          answer: `x = ${signed(x)}`,
          working: `${poly([[a, 'x'], [-c, 'x']])} = ${signed(d)}${plusMinus(-b)} → ${poly([[a - c, 'x']])} = ${signed(d - b)} → x = ${signed(x)}`,
        };
      },
    },
  },
  {
    id: 'n7-02', difficulty: 'medium',
    question: 'Solve (x + 1)/3 − (x − 2)/4 = 2.',
    answer: 'x = 14',
    working: 'Multiply by 12: 4(x + 1) − 3(x − 2) = 24 → x + 10 = 24 → x = 14',
    vary: {
      make: rand => {
        const [p, q] = ratioPair(rand);
        const x = nonZero(rand, 12);
        let k1 = nonZero(rand, 4);
        let k2 = nonZero(rand, 4);
        if (p * k1 - x === 0) k1 += 1;
        if (q * k2 - x === 0) k2 += 1;
        const a = p * k1 - x;
        const b = q * k2 - x;
        const r = k1 - k2;
        return {
          question: `Solve ${lin(1, a)}/${p} − ${lin(1, b)}/${q} = ${signed(r)}.`,
          answer: `x = ${signed(x)}`,
          working: `Multiply by ${p * q}: ${q}${lin(1, a)} − ${p}${lin(1, b)} = ${signed(p * q * r)} → ${poly([[q - p, 'x'], [q * a - p * b, '']])} = ${signed(p * q * r)} → x = ${signed(x)}`,
        };
      },
    },
  },
  {
    id: 'n7-03', difficulty: 'medium',
    question: 'Solve the simultaneous equations:\n2x + 3y = 12\nx − y = 1',
    answer: 'x = 3, y = 2',
    working: 'From x − y = 1: x = y + 1 → 2(y + 1) + 3y = 12 → 5y = 10 → y = 2, x = 3',
    vary: {
      make: rand => {
        const x = nonZero(rand, 6);
        const y = nonZero(rand, 6);
        let a1, b1, a2, b2;
        do {
          [a1, b1, a2, b2] = [rand(1, 5), nonZero(rand, 5), nonZero(rand, 5), nonZero(rand, 5)];
        } while (a1 * b2 - a2 * b1 === 0);
        const c1 = a1 * x + b1 * y;
        const c2 = a2 * x + b2 * y;
        return {
          question: `Solve the simultaneous equations:\n${poly([[a1, 'x'], [b1, 'y']])} = ${signed(c1)}\n${poly([[a2, 'x'], [b2, 'y']])} = ${signed(c2)}`,
          answer: `x = ${signed(x)}, y = ${signed(y)}`,
          working: `Eliminate one unknown, then check: ${a1}(${signed(x)})${plusMinus(b1)}(${signed(y)}) = ${signed(c1)} ✓ and ${signed(a2)}(${signed(x)})${plusMinus(b2)}(${signed(y)}) = ${signed(c2)} ✓`,
        };
      },
    },
  },
  {
    id: 'n7-04', difficulty: 'easy',
    question: 'Solve x² − x − 12 = 0.',
    answer: 'x = 4 or x = −3',
    working: '(x − 4)(x + 3) = 0 → x = 4 or x = −3',
    vary: {
      make: rand => {
        const p = nonZero(rand, 9);
        const q = pick(rand, [-9, -8, -7, -6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(v => v !== p));
        const [big, small] = p > q ? [p, q] : [q, p];
        return {
          question: `Solve ${poly([[1, 'x²'], [-(p + q), 'x'], [p * q, '']])} = 0.`,
          answer: `x = ${signed(big)} or x = ${signed(small)}`,
          working: `${lin(1, -big)}${lin(1, -small)} = 0 → x = ${signed(big)} or x = ${signed(small)}`,
        };
      },
    },
  },
  {
    id: 'n7-05', difficulty: 'medium',
    question: 'Solve 2x² − 7x + 3 = 0.',
    answer: 'x = 1/2 or x = 3',
    working: '(2x − 1)(x − 3) = 0 → x = 1/2 or x = 3',
    vary: {
      make: rand => {
        const a = pick(rand, [2, 3, 5]);
        const b = pick(rand, [-7, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 7].filter(v => gcd(a, Math.abs(v)) === 1));
        const d = nonZero(rand, 7);
        return {
          question: `Solve ${poly([[a, 'x²'], [a * d + b, 'x'], [b * d, '']])} = 0.`,
          answer: `x = ${signedFraction(-b, a)} or x = ${signed(-d)}`,
          working: `${lin(a, b)}${lin(1, d)} = 0 → x = ${signedFraction(-b, a)} or x = ${signed(-d)}`,
        };
      },
    },
  },
  {
    id: 'n7-06', difficulty: 'hard',
    question: 'Solve 2x² − 5x − 1 = 0, giving your answers to 2 decimal places.',
    answer: 'x = 2.69 or x = −0.19',
    working: 'x = (5 ± √(25 + 8)) / 4 = (5 ± √33) / 4',
    vary: {
      make: rand => {
        let a, b, c, disc, r1, r2;
        do {
          [a, b, c] = [rand(1, 4), nonZero(rand, 9), nonZero(rand, 9)];
          disc = b * b - 4 * a * c;
          r1 = (-b + Math.sqrt(disc)) / (2 * a);
          r2 = (-b - Math.sqrt(disc)) / (2 * a);
        } while (disc <= 0 || Number.isInteger(Math.sqrt(disc)) || Math.abs(r1) < 0.005 || Math.abs(r2) < 0.005);
        return {
          question: `Solve ${poly([[a, 'x²'], [b, 'x'], [c, '']])} = 0, giving your answers to 2 decimal places.`,
          answer: `x = ${twoDp(r1)} or x = ${twoDp(r2)}`,
          working: `x = (${signed(-b)} ± √(${b * b}${plusMinus(-4 * a * c)})) / ${2 * a} = (${signed(-b)} ± √${disc}) / ${2 * a}`,
        };
      },
    },
  },
  {
    id: 'n7-07', difficulty: 'hard',
    question: 'Solve x² + 6x − 2 = 0 by completing the square, giving your answers to 2 decimal places.',
    answer: 'x = 0.32 or x = −6.32',
    working: '(x + 3)² − 9 − 2 = 0 → (x + 3)² = 11 → x = −3 ± √11',
    vary: {
      make: rand => {
        let h, c, rhs;
        do {
          [h, c] = [nonZero(rand, 5), nonZero(rand, 9)];
          rhs = h * h - c;
        } while (rhs <= 0 || Number.isInteger(Math.sqrt(rhs)));
        const r1 = -h + Math.sqrt(rhs);
        const r2 = -h - Math.sqrt(rhs);
        return {
          question: `Solve ${poly([[1, 'x²'], [2 * h, 'x'], [c, '']])} = 0 by completing the square, giving your answers to 2 decimal places.`,
          answer: `x = ${twoDp(r1)} or x = ${twoDp(r2)}`,
          working: `${lin(1, h)}² − ${h * h}${plusMinus(c)} = 0 → ${lin(1, h)}² = ${rhs} → x = ${signed(-h)} ± √${rhs}`,
        };
      },
    },
  },
  {
    id: 'n7-08', difficulty: 'hard',
    question: 'Solve 6/x = x + 1.',
    answer: 'x = 2 or x = −3',
    working: 'Multiply by x: 6 = x² + x → x² + x − 6 = 0 → (x − 2)(x + 3) = 0',
    vary: {
      make: rand => {
        const p = nonZero(rand, 6);
        const q = pick(rand, [-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6].filter(v => v !== p));
        const [big, small] = p > q ? [p, q] : [q, p];
        const b = -(p + q);
        const C = -p * q;
        return {
          question: `Solve ${signed(C)}/x = ${poly([[1, 'x'], [b, '']])}.`,
          answer: `x = ${signed(big)} or x = ${signed(small)}`,
          working: `Multiply by x: ${signed(C)} = ${poly([[1, 'x²'], [b, 'x']])} → ${poly([[1, 'x²'], [b, 'x'], [-C, '']])} = 0 → ${lin(1, -big)}${lin(1, -small)} = 0`,
        };
      },
    },
  },
  {
    id: 'n7-09', difficulty: 'easy',
    question: 'Solve 3x − 5 < 7.',
    answer: 'x < 4',
    working: '3x < 12 → x < 4',
    vary: {
      make: rand => {
        const a = rand(2, 7);
        const x0 = nonZero(rand, 9);
        const b = nonZero(rand, 9);
        const sign = pick(rand, ['<', '≤', '>', '≥']);
        const c = a * x0 + b;
        return {
          question: `Solve ${poly([[a, 'x'], [b, '']])} ${sign} ${signed(c)}.`,
          answer: `x ${sign} ${signed(x0)}`,
          working: `${a}x ${sign} ${signed(c - b)} → x ${sign} ${signed(x0)}`,
        };
      },
    },
  },
  {
    id: 'n7-10', difficulty: 'medium',
    question: 'Solve −2x + 3 ≥ 11.',
    answer: 'x ≤ −4',
    working: '−2x ≥ 8 → divide by −2 and REVERSE the sign → x ≤ −4',
    vary: {
      make: rand => {
        const a = -rand(2, 6);
        const x0 = nonZero(rand, 9);
        const b = nonZero(rand, 9);
        const sign = pick(rand, ['<', '≤', '>', '≥']);
        const c = a * x0 + b;
        return {
          question: `Solve ${poly([[a, 'x'], [b, '']])} ${sign} ${signed(c)}.`,
          answer: `x ${FLIP[sign]} ${signed(x0)}`,
          working: `${poly([[a, 'x']])} ${sign} ${signed(c - b)} → divide by ${signed(a)} and REVERSE the sign → x ${FLIP[sign]} ${signed(x0)}`,
        };
      },
    },
  },
  {
    id: 'n7-11', difficulty: 'hard',
    question: 'Solve −3 < 2x + 1 ≤ 9 and list the integer values of x.',
    answer: '−2 < x ≤ 4; x = −1, 0, 1, 2, 3, 4',
    working: 'Subtract 1: −4 < 2x ≤ 8 → divide by 2: −2 < x ≤ 4',
    vary: {
      make: rand => {
        const a = rand(2, 4);
        const b = nonZero(rand, 6);
        const L = rand(-5, 2);
        const H = L + rand(2, 6);
        const ints = [];
        for (let v = L + 1; v <= H; v++) ints.push(signed(v));
        return {
          question: `Solve ${signed(a * L + b)} < ${poly([[a, 'x'], [b, '']])} ≤ ${signed(a * H + b)} and list the integer values of x.`,
          answer: `${signed(L)} < x ≤ ${signed(H)}; x = ${ints.join(', ')}`,
          working: `${b < 0 ? 'Add' : 'Subtract'} ${Math.abs(b)}: ${signed(a * L)} < ${a}x ≤ ${signed(a * H)} → divide by ${a}: ${signed(L)} < x ≤ ${signed(H)}`,
        };
      },
    },
  },
  {
    id: 'n7-12', difficulty: 'easy',
    question: 'The sum of two consecutive odd numbers is 56. Find the numbers.',
    answer: '27 and 29',
    working: 'n + (n + 2) = 56 → 2n = 54 → n = 27',
    vary: {
      make: rand => {
        const odd = rand(0, 1) === 1;
        const n = 2 * rand(5, 60) + (odd ? 1 : 0);
        const sum = 2 * n + 2;
        return {
          question: `The sum of two consecutive ${odd ? 'odd' : 'even'} numbers is ${sum}. Find the numbers.`,
          answer: `${n} and ${n + 2}`,
          working: `n + (n + 2) = ${sum} → 2n = ${sum - 2} → n = ${n}`,
        };
      },
    },
  },
  {
    id: 'n7-13', difficulty: 'hard',
    question: 'A father is 3 times as old as his son. In 12 years, he will be twice as old as his son. How old is the son now?',
    answer: '12 years old',
    working: 'Son = s, father = 3s → 3s + 12 = 2(s + 12) → s = 12',
    vary: {
      make: rand => {
        const m = rand(3, 5);
        const s = rand(4, 15);
        const n = s * (m - 2);
        return {
          question: `A father is ${m} times as old as his son. In ${n} years, he will be twice as old as his son. How old is the son now?`,
          answer: `${s} years old`,
          working: `Son = s, father = ${m}s → ${m}s + ${n} = 2(s + ${n}) → ${m - 2 === 1 ? 's' : `${m - 2}s`} = ${n} → s = ${s}`,
        };
      },
    },
  },
  {
    id: 'n7-14', difficulty: 'hard',
    question: '3 pens and 2 rulers cost $8.10. 1 pen and 4 rulers cost $6.20. Find the cost of one pen and one ruler.',
    answer: 'Pen $2.00, ruler $1.05',
    working: 'Let pen = p, ruler = r (in cents): 3p + 2r = 810 and p + 4r = 620 → p = 200, r = 105',
    vary: {
      make: rand => {
        const p = 10 * rand(8, 30);
        const r = 5 * rand(10, 40);
        let a1, b1, a2, b2;
        do {
          [a1, b1, a2, b2] = [rand(1, 5), rand(1, 5), rand(1, 5), rand(1, 5)];
        } while (a1 * b2 - a2 * b1 === 0);
        const item = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;
        return {
          question: `${item(a1, 'pen')} and ${item(b1, 'ruler')} cost ${dollars(a1 * p + b1 * r)}. ${item(a2, 'pen')} and ${item(b2, 'ruler')} cost ${dollars(a2 * p + b2 * r)}. Find the cost of one pen and one ruler.`,
          answer: `Pen ${dollars(p)}, ruler ${dollars(r)}`,
          working: `Let pen = p, ruler = r (in cents): ${poly([[a1, 'p'], [b1, 'r']])} = ${a1 * p + b1 * r} and ${poly([[a2, 'p'], [b2, 'r']])} = ${a2 * p + b2 * r} → p = ${p}, r = ${r}`,
        };
      },
    },
  },
  {
    id: 'n7-15', difficulty: 'easy',
    question: 'When solving an inequality, when must you reverse the inequality sign?',
    answer: 'When you multiply or divide both sides by a NEGATIVE number. (Adding or subtracting never changes the sign.)',
    working: 'Example: −x > 3 → x < −3',
  },
  {
    id: 'n7-16', difficulty: 'medium',
    question: 'Why is it wrong to solve x² = 3x by dividing both sides by x?',
    answer: 'Dividing by x loses the solution x = 0. Instead: x² − 3x = 0 → x(x − 3) = 0 → x = 0 or x = 3.',
  },
]);

// ---------- O Level Mathematics 4052 — N8 Set language and notation ----------

// [2, 4, 6] → "{2, 4, 6}"   [] → "∅"
function setText(list) {
  return list.length ? `{${list.map(signed).join(', ')}}` : '∅';
}

// Whole numbers from 1 to n: range(5) → [1, 2, 3, 4, 5]
function range(n) {
  return Array.from({ length: n }, (_, i) => i + 1);
}

function isPrime(n) {
  if (n < 2) return false;
  for (let d = 2; d * d <= n; d++) if (n % d === 0) return false;
  return true;
}

// Picks a universal set and two "multiples of" sets: ξ = {1, ..., n}, A = multiples of a, B = multiples of b.
function multiplesSets(rand) {
  const n = rand(12, 20);
  const a = pick(rand, [2, 3, 4, 5]);
  const b = pick(rand, [2, 3, 4, 5].filter(v => v !== a));
  const xi = range(n);
  return { n, a, b, A: xi.filter(v => v % a === 0), B: xi.filter(v => v % b === 0) };
}

const oMathN8 = deck('N8 Set language and notation', [
  {
    id: 'n8-01', difficulty: 'easy',
    question: 'What do A ∩ B, A ∪ B and A′ mean?',
    answer: 'A ∩ B (intersection): elements in BOTH A and B.\nA ∪ B (union): elements in A or B or both.\nA′ (complement): elements in ξ that are NOT in A.',
  },
  {
    id: 'n8-02', difficulty: 'easy',
    question: 'ξ = {1, 2, 3, ..., 12}, A = {multiples of 2}, B = {multiples of 3}. List A ∩ B.',
    answer: '{6, 12}',
    working: 'A = {2, 4, 6, 8, 10, 12}, B = {3, 6, 9, 12} → in both: {6, 12}',
    vary: {
      make: rand => {
        const { n, a, b, A, B } = multiplesSets(rand);
        return {
          question: `ξ = {1, 2, 3, ..., ${n}}, A = {multiples of ${a}}, B = {multiples of ${b}}. List A ∩ B.`,
          answer: setText(A.filter(v => B.includes(v))),
          working: `A = ${setText(A)}, B = ${setText(B)} → in both: ${setText(A.filter(v => B.includes(v)))}`,
        };
      },
    },
  },
  {
    id: 'n8-03', difficulty: 'medium',
    question: 'ξ = {1, 2, 3, ..., 12}, A = {multiples of 4}, B = {multiples of 5}. List A ∪ B.',
    answer: '{4, 5, 8, 10, 12}',
    working: 'A = {4, 8, 12}, B = {5, 10} → everything in either set: {4, 5, 8, 10, 12}',
    vary: {
      make: rand => {
        const { n, a, b, A, B } = multiplesSets(rand);
        const union = [...new Set([...A, ...B])].sort((x, y) => x - y);
        return {
          question: `ξ = {1, 2, 3, ..., ${n}}, A = {multiples of ${a}}, B = {multiples of ${b}}. List A ∪ B.`,
          answer: setText(union),
          working: `A = ${setText(A)}, B = ${setText(B)} → everything in either set: ${setText(union)}`,
        };
      },
    },
  },
  {
    id: 'n8-04', difficulty: 'medium',
    question: 'ξ = {1, 2, 3, ..., 12} and A = {factors of 12}. List A′.',
    answer: '{5, 7, 8, 9, 10, 11}',
    working: 'A = {1, 2, 3, 4, 6, 12} → A′ is everything in ξ not in A',
    vary: {
      make: rand => {
        const n = pick(rand, [10, 12, 15, 16, 18, 20]);
        const A = range(n).filter(v => n % v === 0);
        const complement = range(n).filter(v => n % v !== 0);
        return {
          question: `ξ = {1, 2, 3, ..., ${n}} and A = {factors of ${n}}. List A′.`,
          answer: setText(complement),
          working: `A = ${setText(A)} → A′ is everything in ξ not in A`,
        };
      },
    },
  },
  {
    id: 'n8-05', difficulty: 'hard',
    question: 'In a class of 40 students, 25 play football, 18 play badminton and 7 play neither. How many play both?',
    answer: '10',
    working: 'n(F ∪ B) = 40 − 7 = 33 → n(F ∩ B) = 25 + 18 − 33 = 10',
    vary: {
      make: rand => {
        const both = rand(2, 12);
        const onlyF = rand(5, 20);
        const onlyB = rand(5, 20);
        const neither = rand(1, 8);
        const total = both + onlyF + onlyB + neither;
        const F = onlyF + both;
        const B = onlyB + both;
        return {
          question: `In a class of ${total} students, ${F} play football, ${B} play badminton and ${neither} play neither. How many play both?`,
          answer: String(both),
          working: `n(F ∪ B) = ${total} − ${neither} = ${total - neither} → n(F ∩ B) = ${F} + ${B} − ${total - neither} = ${both}`,
        };
      },
    },
  },
  {
    id: 'n8-06', difficulty: 'medium',
    question: 'n(ξ) = 50, n(A) = 30, n(B) = 25 and n(A ∩ B) = 12. Find n((A ∪ B)′).',
    answer: '7',
    working: 'n(A ∪ B) = 30 + 25 − 12 = 43 → n((A ∪ B)′) = 50 − 43 = 7',
    vary: {
      make: rand => {
        const both = rand(3, 15);
        const A = both + rand(5, 20);
        const B = both + rand(5, 20);
        const union = A + B - both;
        const xi = union + rand(0, 15);
        return {
          question: `n(ξ) = ${xi}, n(A) = ${A}, n(B) = ${B} and n(A ∩ B) = ${both}. Find n((A ∪ B)′).`,
          answer: String(xi - union),
          working: `n(A ∪ B) = ${A} + ${B} − ${both} = ${union} → n((A ∪ B)′) = ${xi} − ${union} = ${xi - union}`,
        };
      },
    },
  },
  {
    id: 'n8-07', difficulty: 'medium',
    question: 'n(A) = 18, n(B) = 15 and n(A ∪ B) = 25. Find n(A ∩ B).',
    answer: '8',
    working: 'n(A ∪ B) = n(A) + n(B) − n(A ∩ B) → 25 = 18 + 15 − n(A ∩ B) → n(A ∩ B) = 8',
    vary: {
      make: rand => {
        const both = rand(1, 12);
        const A = both + rand(3, 20);
        const B = both + rand(3, 20);
        const union = A + B - both;
        return {
          question: `n(A) = ${A}, n(B) = ${B} and n(A ∪ B) = ${union}. Find n(A ∩ B).`,
          answer: String(both),
          working: `n(A ∪ B) = n(A) + n(B) − n(A ∩ B) → ${union} = ${A} + ${B} − n(A ∩ B) → n(A ∩ B) = ${both}`,
        };
      },
    },
  },
  {
    id: 'n8-08', difficulty: 'easy',
    question: 'List the elements of A = {x : x is an integer, −2 ≤ x < 3}.',
    answer: '{−2, −1, 0, 1, 2}',
    working: 'Start at −2 (included) and stop before 3 (not included)',
    vary: {
      make: rand => {
        const lo = rand(-6, 2);
        const hi = lo + rand(2, 6);
        const lowSign = pick(rand, ['<', '≤']);
        const highSign = pick(rand, ['<', '≤']);
        const list = [];
        for (let v = lo; v <= hi; v++) {
          if ((lowSign === '<' && v === lo) || (highSign === '<' && v === hi)) continue;
          list.push(v);
        }
        return {
          question: `List the elements of A = {x : x is an integer, ${signed(lo)} ${lowSign} x ${highSign} ${signed(hi)}}.`,
          answer: setText(list),
          working: `${signed(lo)} is ${lowSign === '≤' ? 'included' : 'NOT included'}; ${signed(hi)} is ${highSign === '≤' ? 'included' : 'NOT included'}`,
        };
      },
    },
  },
  {
    id: 'n8-09', difficulty: 'medium',
    question: 'A = {x : x is a prime number, x < 20}. Find n(A).',
    answer: '8',
    working: 'A = {2, 3, 5, 7, 11, 13, 17, 19} → 8 elements',
    vary: {
      make: rand => {
        const limit = pick(rand, [10, 15, 20, 25, 30, 40, 50]);
        const primes = range(limit - 1).filter(isPrime);
        return {
          question: `A = {x : x is a prime number, x < ${limit}}. Find n(A).`,
          answer: String(primes.length),
          working: `A = ${setText(primes)} → ${primes.length} elements`,
        };
      },
    },
  },
  {
    id: 'n8-10', difficulty: 'easy',
    question: 'P = {prime numbers} and S = {square numbers}. Is 9 ∈ P? Is 9 ∈ S?',
    answer: '9 ∉ P and 9 ∈ S',
    working: '9 = 3 × 3, so it is not prime, but it is a square number',
    vary: {
      make: rand => {
        const k = rand(2, 50);
        const prime = isPrime(k);
        const square = Number.isInteger(Math.sqrt(k));
        return {
          question: `P = {prime numbers} and S = {square numbers}. Is ${k} ∈ P? Is ${k} ∈ S?`,
          answer: `${k} ${prime ? '∈' : '∉'} P and ${k} ${square ? '∈' : '∉'} S`,
          working: `${k} is ${prime ? '' : 'not '}prime and ${square ? `is a square number (${Math.sqrt(k)}²)` : 'not a square number'}`,
        };
      },
    },
  },
  {
    id: 'n8-11', difficulty: 'medium',
    question: 'Is {2, 4} a proper subset of {1, 2, 3, 4}? Write it in set notation.',
    answer: 'Yes: {2, 4} ⊂ {1, 2, 3, 4}',
    working: 'Every element of {2, 4} is in the bigger set, and the sets are not equal',
    vary: {
      make: rand => {
        const big = range(rand(4, 7));
        const size = rand(1, big.length - 1);
        const small = [...big].sort(() => rand(0, 1) - 0.5).slice(0, size).sort((x, y) => x - y);
        const isSubset = rand(0, 1) === 1;
        if (!isSubset) small[small.length - 1] = big.length + rand(1, 3); // add an element not in the big set
        small.sort((x, y) => x - y);
        return {
          question: `Is ${setText(small)} a proper subset of ${setText(big)}? Write it in set notation.`,
          answer: isSubset ? `Yes: ${setText(small)} ⊂ ${setText(big)}` : `No: ${setText(small)} ⊄ ${setText(big)}`,
          working: isSubset
            ? 'Every element of the small set is in the bigger set, and the sets are not equal'
            : `${small[small.length - 1]} is not in ${setText(big)}`,
        };
      },
    },
  },
  {
    id: 'n8-12', difficulty: 'medium',
    question: 'Describe in words the elements in A ∩ B′.',
    answer: 'Elements that are in A but NOT in B.',
    vary: {
      make: rand => {
        const [notation, words] = pick(rand, [
          ['A ∩ B′', 'Elements that are in A but NOT in B.'],
          ['A′ ∩ B', 'Elements that are in B but NOT in A.'],
          ['(A ∪ B)′', 'Elements that are in NEITHER A nor B.'],
          ['(A ∩ B)′', 'Elements that are NOT in both A and B (everything except the overlap).'],
          ['A′ ∩ B′', 'Elements that are in NEITHER A nor B (the same as (A ∪ B)′).'],
          ['A ∪ B′', 'Elements that are in A, or not in B (everything except "B only").'],
        ]);
        return { question: `Describe in words the elements in ${notation}.`, answer: words, working: '' };
      },
    },
  },
  {
    id: 'n8-13', difficulty: 'easy',
    question: 'What is the difference between ∅ and ξ?',
    answer: '∅ is the empty set: it has no elements.\nξ is the universal set: it contains every element being considered.',
  },
  {
    id: 'n8-14', difficulty: 'hard',
    question: 'Given that A ⊂ B, simplify A ∩ B and A ∪ B.',
    answer: 'A ∩ B = A and A ∪ B = B',
    working: 'Every element of A is already in B: the overlap is all of A, and joining A adds nothing new to B',
  },
]);

// ---------- O Level Mathematics 4052 — N9 Matrices ----------

// [[2, -1], [0, 3]] → "( 2   −1 )\n( 0   3 )"  (one row per line)
function matrixText(m) {
  return m.map(row => `( ${row.map(signed).join('   ')} )`).join('\n');
}

// Multiplies two matrices (lists of rows).
function matMul(A, B) {
  return A.map(row => B[0].map((_, j) => row.reduce((sum, value, k) => sum + value * B[k][j], 0)));
}

// A matrix of the given size with small random whole numbers.
function randomMatrix(rand, rows, cols, max = 5) {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => rand(-max, max)));
}

// "Row 1 × column 1: 2(1) + 3(−2) = −4"  for each entry of A × B
function productWorking(A, B) {
  const parts = [];
  A.forEach((row, i) => B[0].forEach((_, j) => {
    // Negative numbers get brackets so it reads "(−2)(3)", not "+ −2(3)".
    const terms = row.map((value, k) => `${value < 0 ? `(${signed(value)})` : value}(${signed(B[k][j])})`).join(' + ');
    parts.push(`row ${i + 1} × column ${j + 1}: ${terms} = ${signed(row.reduce((s, v, k) => s + v * B[k][j], 0))}`);
  }));
  return parts.join('; ');
}

const oMathN9 = deck('N9 Matrices', [
  {
    id: 'n9-01', difficulty: 'easy',
    question: 'State the order of the matrix\n( 3   0   −1 )\n( 2   5   4 )',
    answer: '2 × 3',
    working: 'Order = rows × columns: 2 rows and 3 columns',
    vary: {
      make: rand => {
        const rows = rand(1, 3);
        const cols = rand(rows === 1 ? 2 : 1, 4);
        return {
          question: `State the order of the matrix\n${matrixText(randomMatrix(rand, rows, cols, 9))}`,
          answer: `${rows} × ${cols}`,
          working: `Order = rows × columns: ${rows} row${rows === 1 ? '' : 's'} and ${cols} column${cols === 1 ? '' : 's'}`,
        };
      },
    },
  },
  {
    id: 'n9-02', difficulty: 'easy',
    question: 'A =\n( 2   −1 )\n( 4   3 )\nB =\n( 1   5 )\n( −2   0 )\nFind A + B.',
    answer: '( 3   4 )\n( 2   3 )',
    working: 'Add the matching elements: 2 + 1, −1 + 5, 4 + (−2), 3 + 0',
    vary: {
      make: rand => {
        const A = randomMatrix(rand, 2, 2, 6);
        const B = randomMatrix(rand, 2, 2, 6);
        const sum = A.map((row, i) => row.map((v, j) => v + B[i][j]));
        return {
          question: `A =\n${matrixText(A)}\nB =\n${matrixText(B)}\nFind A + B.`,
          answer: matrixText(sum),
          working: `Add the matching elements: ${A.flat().map((v, k) => `${signed(v)} + ${B.flat()[k] < 0 ? `(${signed(B.flat()[k])})` : B.flat()[k]}`).join(', ')}`,
        };
      },
    },
  },
  {
    id: 'n9-03', difficulty: 'medium',
    question: 'A =\n( 3   1 )\n( 0   −2 )\nB =\n( 1   4 )\n( 2   −3 )\nFind 2A − B.',
    answer: '( 5   −2 )\n( −2   −1 )',
    working: '2A = (6 2 / 0 −4), then subtract each element of B',
    vary: {
      make: rand => {
        const k = rand(2, 4);
        const A = randomMatrix(rand, 2, 2, 5);
        const B = randomMatrix(rand, 2, 2, 6);
        const kA = A.map(row => row.map(v => k * v));
        const result = kA.map((row, i) => row.map((v, j) => v - B[i][j]));
        return {
          question: `A =\n${matrixText(A)}\nB =\n${matrixText(B)}\nFind ${k}A − B.`,
          answer: matrixText(result),
          working: `${k}A = (${kA.map(r => r.map(signed).join(' ')).join(' / ')}), then subtract each element of B`,
        };
      },
    },
  },
  {
    id: 'n9-04', difficulty: 'hard',
    question: 'A =\n( 2   3 )\n( 1   −1 )\nB =\n( 1   0 )\n( −2   4 )\nFind AB.',
    answer: '( −4   12 )\n( 3   −4 )',
    working: 'row 1 × column 1: 2(1) + 3(−2) = −4; row 1 × column 2: 2(0) + 3(4) = 12; row 2 × column 1: 1(1) + (−1)(−2) = 3; row 2 × column 2: 1(0) + (−1)(4) = −4',
    vary: {
      make: rand => {
        const A = randomMatrix(rand, 2, 2, 4);
        const B = randomMatrix(rand, 2, 2, 4);
        return {
          question: `A =\n${matrixText(A)}\nB =\n${matrixText(B)}\nFind AB.`,
          answer: matrixText(matMul(A, B)),
          working: productWorking(A, B),
        };
      },
    },
  },
  {
    id: 'n9-05', difficulty: 'medium',
    question: 'M =\n( 3   −1 )\n( 2   4 )\nFind M multiplied by the column matrix\n( 2 )\n( 5 )',
    answer: '( 1 )\n( 24 )',
    working: 'row 1: 3(2) + (−1)(5) = 1; row 2: 2(2) + 4(5) = 24',
    vary: {
      make: rand => {
        const M = randomMatrix(rand, 2, 2, 5);
        const v = randomMatrix(rand, 2, 1, 6);
        return {
          question: `M =\n${matrixText(M)}\nFind M multiplied by the column matrix\n${matrixText(v)}`,
          answer: matrixText(matMul(M, v)),
          working: productWorking(M, v),
        };
      },
    },
  },
  {
    id: 'n9-06', difficulty: 'medium',
    question: 'A is a 2 × 3 matrix and B is a 3 × 4 matrix. Is AB defined? If so, what is its order?',
    answer: 'Yes, AB is a 2 × 4 matrix',
    working: 'Columns of A (3) = rows of B (3), so AB exists. Its order is (rows of A) × (columns of B)',
    vary: {
      make: rand => {
        const [r1, c1, c2] = [rand(1, 4), rand(1, 4), rand(1, 4)];
        const defined = rand(0, 1) === 1;
        const r2 = defined ? c1 : pick(rand, [1, 2, 3, 4].filter(v => v !== c1));
        return {
          question: `A is a ${r1} × ${c1} matrix and B is a ${r2} × ${c2} matrix. Is AB defined? If so, what is its order?`,
          answer: defined ? `Yes, AB is a ${r1} × ${c2} matrix` : 'No, AB is not defined',
          working: defined
            ? `Columns of A (${c1}) = rows of B (${r2}), so AB exists. Its order is (rows of A) × (columns of B)`
            : `Columns of A (${c1}) ≠ rows of B (${r2}), so AB cannot be calculated`,
        };
      },
    },
  },
  {
    id: 'n9-07', difficulty: 'easy',
    question: 'For 2 × 2 matrices A and B, is AB always equal to BA?',
    answer: 'No. Matrix multiplication is generally not commutative, so AB and BA are usually different. The order matters.',
  },
  {
    id: 'n9-08', difficulty: 'easy',
    question: 'What is the 2 × 2 identity matrix I, and what is special about it?',
    answer: 'I =\n( 1   0 )\n( 0   1 )\nFor any 2 × 2 matrix A: AI = IA = A (like multiplying a number by 1).',
  },
  {
    id: 'n9-09', difficulty: 'medium',
    question: 'Q = ( 3   4 ) shows the numbers of pens and files bought. P =\n( 2 )\n( 5 )\nshows their prices in dollars. Find QP and say what it represents.',
    answer: 'QP = ( 26 ): the total cost is $26',
    working: '3 × 2 + 4 × 5 = 6 + 20 = 26',
    vary: {
      make: rand => {
        const [q1, q2] = [rand(1, 9), rand(1, 9)];
        const [p1, p2] = [rand(1, 6), rand(2, 12)];
        const total = q1 * p1 + q2 * p2;
        return {
          question: `Q = ( ${q1}   ${q2} ) shows the numbers of pens and files bought. P =\n( ${p1} )\n( ${p2} )\nshows their prices in dollars. Find QP and say what it represents.`,
          answer: `QP = ( ${total} ): the total cost is $${total}`,
          working: `${q1} × ${p1} + ${q2} × ${p2} = ${q1 * p1} + ${q2 * p2} = ${total}`,
        };
      },
    },
  },
  {
    id: 'n9-10', difficulty: 'medium',
    question: 'A =\n( x   2 )\n( 3   y )\nB =\n( 1   4 )\n( −2   5 )\nA + B =\n( 6   6 )\n( 1   9 )\nFind x and y.',
    answer: 'x = 5, y = 4',
    working: 'Top-left: x + 1 = 6 → x = 5. Bottom-right: y + 5 = 9 → y = 4',
    vary: {
      make: rand => {
        const [x, y] = [nonZero(rand, 9), nonZero(rand, 9)];
        const [b, c] = [rand(-5, 9), rand(-5, 9)];
        const B = randomMatrix(rand, 2, 2, 6);
        const S = [[x + B[0][0], b + B[0][1]], [c + B[1][0], y + B[1][1]]];
        return {
          question: `A =\n( x   ${signed(b)} )\n( ${signed(c)}   y )\nB =\n${matrixText(B)}\nA + B =\n${matrixText(S)}\nFind x and y.`,
          answer: `x = ${signed(x)}, y = ${signed(y)}`,
          working: `Top-left: x${plusMinus(B[0][0])} = ${signed(S[0][0])} → x = ${signed(x)}. Bottom-right: y${plusMinus(B[1][1])} = ${signed(S[1][1])} → y = ${signed(y)}`,
        };
      },
    },
  },
  {
    id: 'n9-11', difficulty: 'easy',
    question: 'Find k if\nk ×\n( 2   −1 )\n( 0   3 )\n=\n( 8   −4 )\n( 0   12 )',
    answer: 'k = 4',
    working: 'Compare any non-zero element: 2k = 8 → k = 4',
    vary: {
      make: rand => {
        const k = nonZero(rand, 6);
        let M;
        do { M = randomMatrix(rand, 2, 2, 5); } while (M[0][0] === 0);
        return {
          question: `Find k if\nk ×\n${matrixText(M)}\n=\n${matrixText(M.map(r => r.map(v => k * v)))}`,
          answer: `k = ${signed(k)}`,
          working: `Compare any non-zero element: ${poly([[M[0][0], 'k']])} = ${signed(k * M[0][0])} → k = ${signed(k)}`,
        };
      },
    },
  },
]);

// ---------- O Level Mathematics 4052 — G1 Angles, triangles and polygons ----------

// Numbers of sides whose exterior angle (360 ÷ n) is a whole number.
const REGULAR_SIDES = [5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36];

// An angle written as algebra, e.g. "(2x + 10)°"
function angleExpr(a, b) {
  return `(${poly([[a, 'x'], [b, '']])})°`;
}

const oMathG1 = deck('G1 Angles, triangles and polygons', [
  {
    id: 'g1-01', difficulty: 'easy',
    question: 'Two angles on a straight line are (2x + 10)° and (3x − 20)°. Find x.',
    answer: 'x = 38',
    working: 'Angles on a straight line add up to 180°: 5x − 10 = 180 → 5x = 190 → x = 38',
    vary: {
      make: rand => {
        let x, a, b, c, d;
        do {
          [x, a, c, b] = [rand(10, 40), rand(1, 4), rand(1, 4), rand(-20, 30)];
          d = 180 - (a + c) * x - b;
        } while (a * x + b < 10 || c * x + d < 10 || d === 0 || b === 0);
        return {
          question: `Two angles on a straight line are ${angleExpr(a, b)} and ${angleExpr(c, d)}. Find x.`,
          answer: `x = ${x}`,
          working: `Angles on a straight line add up to 180°: ${poly([[a + c, 'x'], [b + d, '']])} = 180 → ${poly([[a + c, 'x']])} = ${180 - b - d} → x = ${x}`,
        };
      },
    },
  },
  {
    id: 'g1-02', difficulty: 'easy',
    question: 'Four angles meet at a point: 110°, 95°, 70° and x°. Find x.',
    answer: 'x = 85',
    working: 'Angles at a point add up to 360°: 360 − 110 − 95 − 70 = 85',
    vary: {
      make: rand => {
        let p, q, r, x;
        do {
          [p, q, r] = [rand(40, 150), rand(40, 150), rand(30, 120)];
          x = 360 - p - q - r;
        } while (x < 20 || x > 170);
        return {
          question: `Four angles meet at a point: ${p}°, ${q}°, ${r}° and x°. Find x.`,
          answer: `x = ${x}`,
          working: `Angles at a point add up to 360°: 360 − ${p} − ${q} − ${r} = ${x}`,
        };
      },
    },
  },
  {
    id: 'g1-03', difficulty: 'medium',
    question: 'Two parallel lines are cut by a transversal. A pair of co-interior angles are 3x° and (2x + 30)°. Find x.',
    answer: 'x = 30',
    working: 'Co-interior angles add up to 180°: 5x + 30 = 180 → x = 30',
    vary: {
      make: rand => {
        const type = pick(rand, ['alternate', 'corresponding', 'co-interior']);
        let x, a, b, c, d;
        do {
          [x, a, c, b] = [rand(5, 40), rand(1, 5), rand(1, 5), rand(-30, 40)];
          d = type === 'co-interior' ? 180 - (a + c) * x - b : (a - c) * x + b;
        } while (a === c || a * x + b < 10 || c * x + d < 10 || a * x + b > 170 || c * x + d > 170);
        const rule = type === 'co-interior'
          ? `Co-interior angles add up to 180°: ${poly([[a + c, 'x'], [b + d, '']])} = 180`
          : `${type === 'alternate' ? 'Alternate' : 'Corresponding'} angles are equal: ${poly([[a, 'x'], [b, '']])} = ${poly([[c, 'x'], [d, '']])}`;
        return {
          question: `Two parallel lines are cut by a transversal. A pair of ${type} angles are ${angleExpr(a, b)} and ${angleExpr(c, d)}. Find x.`,
          answer: `x = ${x}`,
          working: `${rule} → x = ${x}`,
        };
      },
    },
  },
  {
    id: 'g1-04', difficulty: 'easy',
    question: 'Two angles of a triangle are 48° and 67°. Find the third angle.',
    answer: '65°',
    working: 'Angles in a triangle add up to 180°: 180 − 48 − 67 = 65°',
    vary: {
      make: rand => {
        const p = rand(20, 110);
        const q = rand(20, 160 - p);
        return {
          question: `Two angles of a triangle are ${p}° and ${q}°. Find the third angle.`,
          answer: `${180 - p - q}°`,
          working: `Angles in a triangle add up to 180°: 180 − ${p} − ${q} = ${180 - p - q}°`,
        };
      },
    },
  },
  {
    id: 'g1-05', difficulty: 'medium',
    question: 'An exterior angle of a triangle is 125°. One of the interior opposite angles is 70°. Find the other interior opposite angle.',
    answer: '55°',
    working: 'Exterior angle = sum of the two interior opposite angles → 125 − 70 = 55°',
    vary: {
      make: rand => {
        const p = rand(20, 90);
        const q = rand(20, 90);
        return {
          question: `An exterior angle of a triangle is ${p + q}°. One of the interior opposite angles is ${p}°. Find the other interior opposite angle.`,
          answer: `${q}°`,
          working: `Exterior angle = sum of the two interior opposite angles → ${p + q} − ${p} = ${q}°`,
        };
      },
    },
  },
  {
    id: 'g1-06', difficulty: 'easy',
    question: 'An isosceles triangle has an angle of 40° between its two equal sides. Find each of the other two angles.',
    answer: '70° each',
    working: 'The base angles are equal: (180 − 40) ÷ 2 = 70°',
    vary: {
      make: rand => {
        if (rand(0, 1) === 1) {
          const apex = 2 * rand(10, 70);
          return {
            question: `An isosceles triangle has an angle of ${apex}° between its two equal sides. Find each of the other two angles.`,
            answer: `${(180 - apex) / 2}° each`,
            working: `The base angles are equal: (180 − ${apex}) ÷ 2 = ${(180 - apex) / 2}°`,
          };
        }
        const base = rand(20, 85);
        return {
          question: `The two base angles of an isosceles triangle are each ${base}°. Find the third angle.`,
          answer: `${180 - 2 * base}°`,
          working: `180 − 2 × ${base} = ${180 - 2 * base}°`,
        };
      },
    },
  },
  {
    id: 'g1-07', difficulty: 'easy',
    question: 'Find the sum of the interior angles of a hexagon.',
    answer: '720°',
    working: '(n − 2) × 180° = (6 − 2) × 180° = 720°',
    vary: {
      make: rand => {
        const names = { 5: 'pentagon', 6: 'hexagon', 7: 'heptagon', 8: 'octagon', 9: 'nonagon', 10: 'decagon', 12: '12-sided polygon', 15: '15-sided polygon', 20: '20-sided polygon' };
        const n = pick(rand, [5, 6, 7, 8, 9, 10, 12, 15, 20]);
        return {
          question: `Find the sum of the interior angles of ${aOrAn(names[n])} ${names[n]}.`,
          answer: `${withCommas((n - 2) * 180)}°`,
          working: `(n − 2) × 180° = (${n} − 2) × 180° = ${withCommas((n - 2) * 180)}°`,
        };
      },
    },
  },
  {
    id: 'g1-08', difficulty: 'medium',
    question: 'Find the size of each interior angle of a regular 12-sided polygon.',
    answer: '150°',
    working: 'Each exterior angle = 360 ÷ 12 = 30° → interior = 180 − 30 = 150°',
    vary: {
      make: rand => {
        const n = pick(rand, REGULAR_SIDES);
        return {
          question: `Find the size of each interior angle of a regular ${n}-sided polygon.`,
          answer: `${180 - 360 / n}°`,
          working: `Each exterior angle = 360 ÷ ${n} = ${360 / n}° → interior = 180 − ${360 / n} = ${180 - 360 / n}°`,
        };
      },
    },
  },
  {
    id: 'g1-09', difficulty: 'medium',
    question: 'Each exterior angle of a regular polygon is 24°. How many sides does it have?',
    answer: '15',
    working: 'Exterior angles add up to 360°: 360 ÷ 24 = 15',
    vary: {
      make: rand => {
        const n = pick(rand, REGULAR_SIDES);
        return {
          question: `Each exterior angle of a regular polygon is ${360 / n}°. How many sides does it have?`,
          answer: String(n),
          working: `Exterior angles add up to 360°: 360 ÷ ${360 / n} = ${n}`,
        };
      },
    },
  },
  {
    id: 'g1-10', difficulty: 'hard',
    question: 'Each interior angle of a regular polygon is 156°. How many sides does it have?',
    answer: '15',
    working: 'Exterior angle = 180 − 156 = 24° → 360 ÷ 24 = 15',
    vary: {
      make: rand => {
        const n = pick(rand, REGULAR_SIDES);
        const interior = 180 - 360 / n;
        return {
          question: `Each interior angle of a regular polygon is ${interior}°. How many sides does it have?`,
          answer: String(n),
          working: `Exterior angle = 180 − ${interior} = ${360 / n}° → 360 ÷ ${360 / n} = ${n}`,
        };
      },
    },
  },
  {
    id: 'g1-11', difficulty: 'hard',
    question: 'The interior angles of a pentagon are 100°, 110°, 120°, x° and x°. Find x.',
    answer: 'x = 105',
    working: 'Sum = (5 − 2) × 180 = 540° → 2x = 540 − 330 = 210 → x = 105',
    vary: {
      make: rand => {
        const n = pick(rand, [5, 6]);
        const total = (n - 2) * 180;
        let known, x;
        do {
          x = rand(80, 160);
          known = Array.from({ length: n - 3 }, () => rand(70, 170));
          known.push(total - 2 * x - known.reduce((s, v) => s + v, 0));
        } while (known[known.length - 1] < 60 || known[known.length - 1] > 175);
        const knownSum = known.reduce((s, v) => s + v, 0);
        return {
          question: `The interior angles of a ${n === 5 ? 'pentagon' : 'hexagon'} are ${known.map(v => `${v}°`).join(', ')}, x° and x°. Find x.`,
          answer: `x = ${x}`,
          working: `Sum = (${n} − 2) × 180 = ${total}° → 2x = ${total} − ${knownSum} = ${2 * x} → x = ${x}`,
        };
      },
    },
  },
  {
    id: 'g1-12', difficulty: 'medium',
    question: 'Which quadrilateral has all four sides equal and diagonals that bisect each other at right angles, but its angles are not all 90°?',
    answer: 'A rhombus',
    vary: {
      make: rand => {
        const [clue, shape] = pick(rand, [
          ['all four sides equal and diagonals that bisect each other at right angles, but its angles are not all 90°', 'A rhombus'],
          ['two pairs of parallel sides, opposite sides equal, but its angles are not all 90° and its sides are not all equal', 'A parallelogram'],
          ['exactly one pair of parallel sides', 'A trapezium'],
          ['two pairs of equal adjacent sides and one line of symmetry, with diagonals that cross at right angles', 'A kite'],
          ['four right angles and diagonals that are equal in length, but its sides are not all equal', 'A rectangle'],
          ['four equal sides, four right angles and four lines of symmetry', 'A square'],
        ]);
        return { question: `Which quadrilateral has ${clue}?`, answer: shape, working: '' };
      },
    },
  },
  {
    id: 'g1-13', difficulty: 'easy',
    question: 'Two straight lines cross. One angle is (x + 20)° and the vertically opposite angle is (3x − 40)°. Find x.',
    answer: 'x = 30',
    working: 'Vertically opposite angles are equal: x + 20 = 3x − 40 → 2x = 60 → x = 30',
    vary: {
      make: rand => {
        let x, a, b, c, d;
        do {
          [x, a, c, b] = [rand(5, 40), rand(1, 5), rand(1, 5), rand(-30, 40)];
          d = (a - c) * x + b;
        } while (a === c || a * x + b < 10 || a * x + b > 170 || b === 0 || d === 0);
        return {
          question: `Two straight lines cross. One angle is ${angleExpr(a, b)} and the vertically opposite angle is ${angleExpr(c, d)}. Find x.`,
          answer: `x = ${x}`,
          working: `Vertically opposite angles are equal: ${poly([[a, 'x'], [b, '']])} = ${poly([[c, 'x'], [d, '']])} → x = ${x}`,
        };
      },
    },
  },
  {
    id: 'g1-14', difficulty: 'easy',
    question: 'With parallel lines cut by a transversal, which angle pairs are equal and which add up to 180°?',
    answer: 'Equal: corresponding angles ("F" shape) and alternate angles ("Z" shape).\nAdd up to 180°: co-interior angles ("C" or "U" shape).',
  },
]);

// ---------- O Level Mathematics 4052 — G2 Congruence and similarity ----------

const oMathG2 = deck('G2 Congruence and similarity', [
  {
    id: 'g2-01', difficulty: 'easy',
    question: 'State the four tests for congruent triangles.',
    answer: 'SSS: three pairs of equal sides.\nSAS: two sides and the angle between them.\nASA or AAS: two angles and one matching side.\nRHS: right angle, hypotenuse and one other side.',
  },
  {
    id: 'g2-02', difficulty: 'easy',
    question: 'What is the difference between congruent and similar figures?',
    answer: 'Congruent: exactly the same shape AND size.\nSimilar: the same shape (equal angles, sides in the same ratio) but possibly a different size.',
  },
  {
    id: 'g2-03', difficulty: 'medium',
    question: 'Two triangles are similar. Which conditions prove this?',
    answer: 'Any one of: two pairs of equal angles (AA); all three pairs of sides in the same ratio; two pairs of sides in the same ratio with the angles between them equal.',
  },
  {
    id: 'g2-04', difficulty: 'medium',
    question: 'Triangle ABC is similar to triangle DEF. AB = 6 cm, DE = 9 cm and BC = 8 cm. Find EF.',
    answer: '12 cm',
    working: 'Scale factor = 9 ÷ 6 = 1.5 → EF = 8 × 1.5 = 12 cm',
    vary: {
      make: rand => {
        const [p, q] = ratioPair(rand);
        const t = rand(1, 5);
        const s = rand(1, 5) + (rand(0, 1) ? 0 : 1);
        return {
          question: `Triangle ABC is similar to triangle DEF. AB = ${p * t} cm, DE = ${q * t} cm and BC = ${p * s} cm. Find EF.`,
          answer: `${q * s} cm`,
          working: `Scale factor = ${q * t} ÷ ${p * t} = ${q}/${p} → EF = ${p * s} × ${q}/${p} = ${q * s} cm`,
        };
      },
    },
  },
  {
    id: 'g2-05', difficulty: 'medium',
    question: 'A triangle has sides 4 cm, 6 cm and 7 cm. A similar triangle has its longest side 21 cm. Find its shortest side.',
    answer: '12 cm',
    working: 'Scale factor = 21 ÷ 7 = 3 → 4 × 3 = 12 cm',
    vary: {
      make: rand => {
        let sides;
        do { sides = [rand(3, 9), rand(3, 9), rand(3, 9)].sort((x, y) => x - y); } while (sides[0] + sides[1] <= sides[2] || sides[0] === sides[2]);
        const k = rand(2, 5);
        return {
          question: `A triangle has sides ${sides[0]} cm, ${sides[1]} cm and ${sides[2]} cm. A similar triangle has its longest side ${sides[2] * k} cm. Find its shortest side.`,
          answer: `${sides[0] * k} cm`,
          working: `Scale factor = ${sides[2] * k} ÷ ${sides[2]} = ${k} → ${sides[0]} × ${k} = ${sides[0] * k} cm`,
        };
      },
    },
  },
  {
    id: 'g2-06', difficulty: 'medium',
    question: 'Two similar triangles have corresponding sides in the ratio 3 : 5. The smaller triangle has an area of 18 cm². Find the area of the larger triangle.',
    answer: '50 cm²',
    working: 'Area ratio = 3² : 5² = 9 : 25 → 18 ÷ 9 × 25 = 50 cm²',
    vary: {
      make: rand => {
        const [p, q] = pick(rand, COPRIME_PAIRS);
        const m = rand(1, 6);
        return {
          question: `Two similar triangles have corresponding sides in the ratio ${p} : ${q}. The smaller triangle has an area of ${m * p * p} cm². Find the area of the larger triangle.`,
          answer: `${m * q * q} cm²`,
          working: `Area ratio = ${p}² : ${q}² = ${p * p} : ${q * q} → ${m * p * p} ÷ ${p * p} × ${q * q} = ${m * q * q} cm²`,
        };
      },
    },
  },
  {
    id: 'g2-07', difficulty: 'hard',
    question: 'Two similar cones have heights 4 cm and 6 cm. The smaller cone has a volume of 32 cm³. Find the volume of the larger cone.',
    answer: '108 cm³',
    working: 'Volume ratio = 4³ : 6³ = 64 : 216 → 32 ÷ 64 × 216 = 108 cm³',
    vary: {
      make: rand => {
        const [p, q] = pick(rand, COPRIME_PAIRS.filter(([, b]) => b <= 6));
        const t = rand(1, 2);
        const m = rand(1, 5);
        const shape = pick(rand, ['cones', 'cylinders', 'bottles', 'pyramids']);
        return {
          question: `Two similar ${shape} have heights ${p * t} cm and ${q * t} cm. The smaller one has a volume of ${m * p ** 3} cm³. Find the volume of the larger one.`,
          answer: `${withCommas(m * q ** 3)} cm³`,
          working: `Volume ratio = ${p}³ : ${q}³ = ${p ** 3} : ${q ** 3} → ${m * p ** 3} ÷ ${p ** 3} × ${q ** 3} = ${withCommas(m * q ** 3)} cm³`,
        };
      },
    },
  },
  {
    id: 'g2-08', difficulty: 'hard',
    question: 'Two similar solids have masses of 80 g and 270 g. The larger solid is 12 cm tall. How tall is the smaller solid?',
    answer: '8 cm',
    working: 'Mass ratio = volume ratio = 80 : 270 = 8 : 27 → length ratio = ∛8 : ∛27 = 2 : 3 → 12 × 2/3 = 8 cm',
    vary: {
      make: rand => {
        const [p, q] = pick(rand, COPRIME_PAIRS.filter(([, b]) => b <= 5));
        const m = rand(2, 10);
        const t = rand(2, 6);
        return {
          question: `Two similar solids have masses of ${m * p ** 3} g and ${m * q ** 3} g. The larger solid is ${q * t} cm tall. How tall is the smaller solid?`,
          answer: `${p * t} cm`,
          working: `Mass ratio = volume ratio = ${p ** 3} : ${q ** 3} → length ratio = ${p} : ${q} → ${q * t} × ${p}/${q} = ${p * t} cm`,
        };
      },
    },
  },
  {
    id: 'g2-09', difficulty: 'hard',
    question: 'Two similar solids have volumes 64 cm³ and 125 cm³. The surface area of the smaller one is 48 cm². Find the surface area of the larger one.',
    answer: '75 cm²',
    working: 'Length ratio = ∛64 : ∛125 = 4 : 5 → area ratio = 16 : 25 → 48 ÷ 16 × 25 = 75 cm²',
    vary: {
      make: rand => {
        const [p, q] = pick(rand, COPRIME_PAIRS.filter(([, b]) => b <= 6));
        const v = rand(1, 3);
        const s = rand(1, 6);
        return {
          question: `Two similar solids have volumes ${v * p ** 3} cm³ and ${v * q ** 3} cm³. The surface area of the smaller one is ${s * p * p} cm². Find the surface area of the larger one.`,
          answer: `${s * q * q} cm²`,
          working: `Length ratio = ${p} : ${q} (cube roots of the volume ratio ${p ** 3} : ${q ** 3}) → area ratio = ${p * p} : ${q * q} → ${s * p * p} ÷ ${p * p} × ${q * q} = ${s * q * q} cm²`,
        };
      },
    },
  },
  {
    id: 'g2-10', difficulty: 'medium',
    question: 'A 2 m pole casts a 3 m shadow. At the same time, a tree casts a 15 m shadow. How tall is the tree?',
    answer: '10 m',
    working: 'Similar triangles: height/shadow is the same → 2/3 × 15 = 10 m',
    vary: {
      make: rand => {
        const [p, q] = ratioPair(rand);
        const k = rand(2, 8);
        return {
          question: `A ${p} m pole casts ${aOrAn(q)} ${q} m shadow. At the same time, a tree casts ${aOrAn(q * k)} ${q * k} m shadow. How tall is the tree?`,
          answer: `${p * k} m`,
          working: `Similar triangles: height/shadow is the same → ${p}/${q} × ${q * k} = ${p * k} m`,
        };
      },
    },
  },
  {
    id: 'g2-11', difficulty: 'medium',
    question: 'A shape with area 5 cm² is enlarged with scale factor 3. Find the area of the image.',
    answer: '45 cm²',
    working: 'Area scale factor = 3² = 9 → 5 × 9 = 45 cm²',
    vary: {
      make: rand => {
        const k = rand(2, 5);
        const area = rand(2, 12);
        return {
          question: `A shape with area ${area} cm² is enlarged with scale factor ${k}. Find the area of the image.`,
          answer: `${area * k * k} cm²`,
          working: `Area scale factor = ${k}² = ${k * k} → ${area} × ${k * k} = ${area * k * k} cm²`,
        };
      },
    },
  },
  {
    id: 'g2-12', difficulty: 'medium',
    question: 'In triangles ABC and PQR, AB = PQ, BC = QR and angle ABC = angle PQR. Which congruence test proves they are congruent?',
    answer: 'SAS',
    working: 'Two sides and the angle between them (angle B is between AB and BC)',
    vary: {
      make: rand => {
        const [facts, test, why] = pick(rand, [
          ['AB = PQ, BC = QR and angle ABC = angle PQR', 'SAS', 'Two sides and the angle between them'],
          ['AB = PQ, BC = QR and AC = PR', 'SSS', 'All three pairs of sides are equal'],
          ['angle A = angle P, angle B = angle Q and AB = PQ', 'ASA', 'Two angles and the side between them'],
          ['angle A = angle P, angle B = angle Q and BC = QR', 'AAS', 'Two angles and a side that is not between them'],
          ['angle C = angle R = 90°, AB = PQ and AC = PR', 'RHS', 'Right angle, equal hypotenuses (AB, PQ) and one other pair of sides'],
        ]);
        return {
          question: `In triangles ABC and PQR, ${facts}. Which congruence test proves they are congruent?`,
          answer: test,
          working: why,
        };
      },
    },
  },
]);

// ---------- O Level Mathematics 4052 — G3 Properties of circles ----------

// Pythagorean triples (scaled ones are made with a multiplier).
const TRIPLES = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41]];

const oMathG3 = deck('G3 Properties of circles', [
  {
    id: 'g3-01', difficulty: 'easy',
    question: 'State the main angle properties of circles.',
    answer: 'The angle in a semicircle is 90°.\nThe angle at the centre is twice the angle at the circumference (same arc).\nAngles in the same segment are equal.\nOpposite angles of a cyclic quadrilateral add up to 180°.',
  },
  {
    id: 'g3-02', difficulty: 'easy',
    question: 'State the main symmetry and tangent properties of circles.',
    answer: 'A tangent is perpendicular to the radius at the point of contact.\nTwo tangents from an outside point are equal in length.\nThe perpendicular from the centre to a chord bisects the chord.\nEqual chords are the same distance from the centre.',
  },
  {
    id: 'g3-03', difficulty: 'easy',
    question: 'A, B and C lie on a circle with centre O. Angle ACB = 35°. Find angle AOB.',
    answer: '70°',
    working: 'Angle at the centre = 2 × angle at the circumference → 2 × 35 = 70°',
    vary: {
      make: rand => {
        const c = rand(15, 85);
        if (rand(0, 1) === 1) {
          return {
            question: `A, B and C lie on a circle with centre O. Angle ACB = ${c}°. Find angle AOB.`,
            answer: `${2 * c}°`,
            working: `Angle at the centre = 2 × angle at the circumference → 2 × ${c} = ${2 * c}°`,
          };
        }
        return {
          question: `A, B and C lie on a circle with centre O. Angle AOB = ${2 * c}°. Find angle ACB.`,
          answer: `${c}°`,
          working: `Angle at the circumference = half the angle at the centre → ${2 * c} ÷ 2 = ${c}°`,
        };
      },
    },
  },
  {
    id: 'g3-04', difficulty: 'medium',
    question: 'AB is a diameter of a circle and C is a point on the circle. Angle CAB = 32°. Find angle ABC.',
    answer: '58°',
    working: 'Angle ACB = 90° (angle in a semicircle) → 180 − 90 − 32 = 58°',
    vary: {
      make: rand => {
        const a = rand(15, 75);
        return {
          question: `AB is a diameter of a circle and C is a point on the circle. Angle CAB = ${a}°. Find angle ABC.`,
          answer: `${90 - a}°`,
          working: `Angle ACB = 90° (angle in a semicircle) → 180 − 90 − ${a} = ${90 - a}°`,
        };
      },
    },
  },
  {
    id: 'g3-05', difficulty: 'easy',
    question: 'ABCD is a cyclic quadrilateral. Angle ABC = 104°. Find angle ADC.',
    answer: '76°',
    working: 'Opposite angles of a cyclic quadrilateral add up to 180° → 180 − 104 = 76°',
    vary: {
      make: rand => {
        const b = rand(50, 140);
        return {
          question: `ABCD is a cyclic quadrilateral. Angle ABC = ${b}°. Find angle ADC.`,
          answer: `${180 - b}°`,
          working: `Opposite angles of a cyclic quadrilateral add up to 180° → 180 − ${b} = ${180 - b}°`,
        };
      },
    },
  },
  {
    id: 'g3-06', difficulty: 'easy',
    question: 'A, B, C and D lie on a circle. Angle ACB = 40°. Find angle ADB (C and D are on the same side of AB).',
    answer: '40°',
    working: 'Angles in the same segment (standing on the same arc AB) are equal',
    vary: {
      make: rand => {
        const c = rand(20, 80);
        return {
          question: `A, B, C and D lie on a circle. Angle ACB = ${c}°. Find angle ADB (C and D are on the same side of AB).`,
          answer: `${c}°`,
          working: 'Angles in the same segment (standing on the same arc AB) are equal',
        };
      },
    },
  },
  {
    id: 'g3-07', difficulty: 'medium',
    question: 'A tangent from point P touches a circle, centre O, at T. OT = 5 cm and OP = 13 cm. Find PT.',
    answer: '12 cm',
    working: 'Angle OTP = 90° (tangent ⟂ radius) → PT = √(13² − 5²) = √144 = 12 cm',
    vary: {
      make: rand => {
        const [a, b, c] = pick(rand, TRIPLES.slice(0, 4));
        const k = rand(1, 3);
        const [r, t] = rand(0, 1) ? [a * k, b * k] : [b * k, a * k];
        return {
          question: `A tangent from point P touches a circle, centre O, at T. OT = ${r} cm and OP = ${c * k} cm. Find PT.`,
          answer: `${t} cm`,
          working: `Angle OTP = 90° (tangent ⟂ radius) → PT = √(${c * k}² − ${r}²) = √${t * t} = ${t} cm`,
        };
      },
    },
  },
  {
    id: 'g3-08', difficulty: 'hard',
    question: 'PA and PB are tangents to a circle with centre O. Angle APB = 50°. Find angle AOB.',
    answer: '130°',
    working: 'Angles OAP and OBP are 90° (tangent ⟂ radius). Angles in quadrilateral OAPB add up to 360° → 360 − 90 − 90 − 50 = 130°',
    vary: {
      make: rand => {
        const p = rand(20, 120);
        return {
          question: `PA and PB are tangents to a circle with centre O. Angle APB = ${p}°. Find angle AOB.`,
          answer: `${180 - p}°`,
          working: `Angles OAP and OBP are 90° (tangent ⟂ radius). Angles in quadrilateral OAPB add up to 360° → 360 − 90 − 90 − ${p} = ${180 - p}°`,
        };
      },
    },
  },
  {
    id: 'g3-09', difficulty: 'hard',
    question: 'A circle has radius 10 cm. A chord is 16 cm long. How far is the chord from the centre?',
    answer: '6 cm',
    working: 'The perpendicular from the centre bisects the chord: half-chord = 8 → √(10² − 8²) = √36 = 6 cm',
    vary: {
      make: rand => {
        const [a, b, c] = pick(rand, TRIPLES.slice(0, 4));
        const k = rand(1, 2);
        const [half, d] = rand(0, 1) ? [a * k, b * k] : [b * k, a * k];
        return {
          question: `A circle has radius ${c * k} cm. A chord is ${2 * half} cm long. How far is the chord from the centre?`,
          answer: `${d} cm`,
          working: `The perpendicular from the centre bisects the chord: half-chord = ${half} → √(${c * k}² − ${half}²) = √${d * d} = ${d} cm`,
        };
      },
    },
  },
  {
    id: 'g3-10', difficulty: 'medium',
    question: 'A and B lie on a circle with centre O. Angle OAB = 28°. Find angle AOB.',
    answer: '124°',
    working: 'OA = OB (radii), so triangle OAB is isosceles: angle OBA = 28° → 180 − 2 × 28 = 124°',
    vary: {
      make: rand => {
        const a = rand(15, 80);
        return {
          question: `A and B lie on a circle with centre O. Angle OAB = ${a}°. Find angle AOB.`,
          answer: `${180 - 2 * a}°`,
          working: `OA = OB (radii), so triangle OAB is isosceles: angle OBA = ${a}° → 180 − 2 × ${a} = ${180 - 2 * a}°`,
        };
      },
    },
  },
  {
    id: 'g3-11', difficulty: 'hard',
    question: 'A, B and C lie on a circle with centre O. Angle AOB = 110°. Find the angle ACB when C is on the major arc, and when C is on the minor arc.',
    answer: 'Major arc: 55°. Minor arc: 125°.',
    working: 'Major arc: 110 ÷ 2 = 55°. Minor arc: the reflex angle AOB is 360 − 110 = 250°, so ACB = 250 ÷ 2 = 125° (also 180 − 55, cyclic quadrilateral)',
    vary: {
      make: rand => {
        const o = 2 * rand(20, 80);
        return {
          question: `A, B and C lie on a circle with centre O. Angle AOB = ${o}°. Find the angle ACB when C is on the major arc, and when C is on the minor arc.`,
          answer: `Major arc: ${o / 2}°. Minor arc: ${180 - o / 2}°.`,
          working: `Major arc: ${o} ÷ 2 = ${o / 2}°. Minor arc: the reflex angle AOB is 360 − ${o} = ${360 - o}°, so ACB = ${360 - o} ÷ 2 = ${180 - o / 2}° (also 180 − ${o / 2}, cyclic quadrilateral)`,
        };
      },
    },
  },
]);

// ---------- Rounding helpers (used by G4 – S2) ----------

// 3 significant figures: 21.0123 → "21.0"   1234.5 → "1,230"
function sf3(n) {
  const rounded = Number(n.toPrecision(3));
  return Math.abs(rounded) >= 1000 ? withCommas(rounded) : n.toPrecision(3).replace('-', '−');
}

// 1 decimal place: 36.869 → "36.9"
function dp1(n) {
  return n.toFixed(1).replace('-', '−');
}

const toRadians = degrees => (degrees * Math.PI) / 180;
const toDegrees = radians => (radians * 180) / Math.PI;

// ---------- O Level Mathematics 4052 — G4 Pythagoras' theorem and trigonometry ----------

const oMathG4 = deck("G4 Pythagoras' theorem and trigonometry", [
  {
    id: 'g4-01', difficulty: 'easy',
    question: 'A right-angled triangle has shorter sides 9 cm and 12 cm. Find the hypotenuse.',
    answer: '15 cm',
    working: '√(9² + 12²) = √225 = 15 cm',
    vary: {
      make: rand => {
        const [a, b, c] = pick(rand, TRIPLES);
        const k = c >= 25 ? 1 : rand(1, 3);
        return {
          question: `A right-angled triangle has shorter sides ${a * k} cm and ${b * k} cm. Find the hypotenuse.`,
          answer: `${c * k} cm`,
          working: `√(${a * k}² + ${b * k}²) = √${withCommas((c * k) ** 2)} = ${c * k} cm`,
        };
      },
    },
  },
  {
    id: 'g4-02', difficulty: 'easy',
    question: 'A right-angled triangle has hypotenuse 26 cm and one side 10 cm. Find the third side.',
    answer: '24 cm',
    working: '√(26² − 10²) = √576 = 24 cm',
    vary: {
      make: rand => {
        const [a, b, c] = pick(rand, TRIPLES);
        const k = c >= 25 ? 1 : rand(1, 3);
        const [known, missing] = rand(0, 1) ? [a * k, b * k] : [b * k, a * k];
        return {
          question: `A right-angled triangle has hypotenuse ${c * k} cm and one side ${known} cm. Find the third side.`,
          answer: `${missing} cm`,
          working: `√(${c * k}² − ${known}²) = √${withCommas(missing * missing)} = ${missing} cm`,
        };
      },
    },
  },
  {
    id: 'g4-03', difficulty: 'medium',
    question: 'A triangle has sides 7 cm, 24 cm and 25 cm. Is it right-angled?',
    answer: 'Yes',
    working: '7² + 24² = 49 + 576 = 625 = 25² → yes (converse of Pythagoras)',
    vary: {
      make: rand => {
        const [a, b, c0] = pick(rand, TRIPLES);
        const right = rand(0, 1) === 1;
        const c = right ? c0 : c0 + pick(rand, [-1, 1]);
        const lhs = a * a + b * b;
        return {
          question: `A triangle has sides ${a} cm, ${b} cm and ${c} cm. Is it right-angled?`,
          answer: right ? 'Yes' : 'No',
          working: `${a}² + ${b}² = ${a * a} + ${b * b} = ${lhs}${right ? ` = ${c}²` : `, but ${c}² = ${c * c}`} → ${right ? 'yes' : 'no'} (converse of Pythagoras)`,
        };
      },
    },
  },
  {
    id: 'g4-04', difficulty: 'easy',
    question: 'In a right-angled triangle, the hypotenuse is 12 cm and one angle is 35°. Find the side opposite the 35° angle, correct to 3 significant figures.',
    answer: '6.88 cm',
    working: 'sin 35° = opp/hyp → opp = 12 sin 35° = 6.88 cm',
    vary: {
      make: rand => {
        const hyp = rand(5, 25);
        const angle = rand(15, 75);
        const opp = hyp * Math.sin(toRadians(angle));
        return {
          question: `In a right-angled triangle, the hypotenuse is ${hyp} cm and one angle is ${angle}°. Find the side opposite the ${angle}° angle, correct to 3 significant figures.`,
          answer: `${sf3(opp)} cm`,
          working: `sin ${angle}° = opp/hyp → opp = ${hyp} sin ${angle}° = ${sf3(opp)} cm`,
        };
      },
    },
  },
  {
    id: 'g4-05', difficulty: 'easy',
    question: 'In a right-angled triangle, the hypotenuse is 15 cm and one angle is 40°. Find the side adjacent to the 40° angle, correct to 3 significant figures.',
    answer: '11.5 cm',
    working: 'cos 40° = adj/hyp → adj = 15 cos 40° = 11.5 cm',
    vary: {
      make: rand => {
        const hyp = rand(5, 25);
        const angle = rand(15, 75);
        const adj = hyp * Math.cos(toRadians(angle));
        return {
          question: `In a right-angled triangle, the hypotenuse is ${hyp} cm and one angle is ${angle}°. Find the side adjacent to the ${angle}° angle, correct to 3 significant figures.`,
          answer: `${sf3(adj)} cm`,
          working: `cos ${angle}° = adj/hyp → adj = ${hyp} cos ${angle}° = ${sf3(adj)} cm`,
        };
      },
    },
  },
  {
    id: 'g4-06', difficulty: 'medium',
    question: 'In a right-angled triangle, the sides next to the right angle are 5 cm and 8 cm. Find the angle opposite the 5 cm side, correct to 1 decimal place.',
    answer: '32.0°',
    working: 'tan θ = opp/adj = 5/8 → θ = tan⁻¹(5/8) = 32.0°',
    vary: {
      make: rand => {
        const opp = rand(2, 15);
        const adj = pick(rand, [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].filter(v => v !== opp));
        const angle = toDegrees(Math.atan(opp / adj));
        return {
          question: `In a right-angled triangle, the sides next to the right angle are ${opp} cm and ${adj} cm. Find the angle opposite the ${opp} cm side, correct to 1 decimal place.`,
          answer: `${dp1(angle)}°`,
          working: `tan θ = opp/adj = ${opp}/${adj} → θ = tan⁻¹(${opp}/${adj}) = ${dp1(angle)}°`,
        };
      },
    },
  },
  {
    id: 'g4-07', difficulty: 'medium',
    question: 'In triangle ABC, angle A = 50°, angle B = 65° and BC = 10 cm. Find AC, correct to 3 significant figures.',
    answer: '11.8 cm',
    working: 'Sine rule: AC/sin B = BC/sin A → AC = 10 sin 65° ÷ sin 50° = 11.8 cm',
    vary: {
      make: rand => {
        const A = rand(30, 80);
        const B = rand(30, 140 - A);
        const a = rand(5, 20);
        const b = (a * Math.sin(toRadians(B))) / Math.sin(toRadians(A));
        return {
          question: `In triangle ABC, angle A = ${A}°, angle B = ${B}° and BC = ${a} cm. Find AC, correct to 3 significant figures.`,
          answer: `${sf3(b)} cm`,
          working: `Sine rule: AC/sin B = BC/sin A → AC = ${a} sin ${B}° ÷ sin ${A}° = ${sf3(b)} cm`,
        };
      },
    },
  },
  {
    id: 'g4-08', difficulty: 'hard',
    question: 'In triangle ABC, AB = 7 cm, AC = 9 cm and angle BAC = 60°. Find BC, correct to 3 significant figures.',
    answer: '8.19 cm',
    working: 'Cosine rule: BC² = 7² + 9² − 2(7)(9) cos 60° = 67 → BC = √67 = 8.19 cm',
    vary: {
      make: rand => {
        const b = rand(4, 15);
        const c = rand(4, 15);
        const A = rand(25, 140);
        const a2 = b * b + c * c - 2 * b * c * Math.cos(toRadians(A));
        return {
          question: `In triangle ABC, AB = ${c} cm, AC = ${b} cm and angle BAC = ${A}°. Find BC, correct to 3 significant figures.`,
          answer: `${sf3(Math.sqrt(a2))} cm`,
          working: `Cosine rule: BC² = ${c}² + ${b}² − 2(${c})(${b}) cos ${A}° = ${sf3(a2)} → BC = ${sf3(Math.sqrt(a2))} cm`,
        };
      },
    },
  },
  {
    id: 'g4-09', difficulty: 'hard',
    question: 'A triangle has sides 5 cm, 7 cm and 9 cm. Find its largest angle, correct to 1 decimal place.',
    answer: '95.7°',
    working: 'The largest angle is opposite the longest side: cos θ = (5² + 7² − 9²) ÷ (2 × 5 × 7) = −0.1 → θ = 95.7°',
    vary: {
      make: rand => {
        let a, b, c;
        do { [a, b, c] = [rand(3, 15), rand(3, 15), rand(3, 15)].sort((x, y) => x - y); } while (a + b <= c || c === b);
        const cosine = (a * a + b * b - c * c) / (2 * a * b);
        const angle = toDegrees(Math.acos(cosine));
        return {
          question: `A triangle has sides ${a} cm, ${b} cm and ${c} cm. Find its largest angle, correct to 1 decimal place.`,
          answer: `${dp1(angle)}°`,
          working: `The largest angle is opposite the longest side: cos θ = (${a}² + ${b}² − ${c}²) ÷ (2 × ${a} × ${b}) = ${signed(Number(cosine.toFixed(4)))} → θ = ${dp1(angle)}°`,
        };
      },
    },
  },
  {
    id: 'g4-10', difficulty: 'medium',
    question: 'Find the area of triangle PQR where PQ = 8 cm, PR = 11 cm and angle QPR = 40°, correct to 3 significant figures.',
    answer: '28.3 cm²',
    working: 'Area = ½ab sin C = ½ × 8 × 11 × sin 40° = 28.3 cm²',
    vary: {
      make: rand => {
        const p = rand(4, 15);
        const r = rand(4, 15);
        const angle = rand(20, 150);
        const area = 0.5 * p * r * Math.sin(toRadians(angle));
        return {
          question: `Find the area of triangle PQR where PQ = ${p} cm, PR = ${r} cm and angle QPR = ${angle}°, correct to 3 significant figures.`,
          answer: `${sf3(area)} cm²`,
          working: `Area = ½ab sin C = ½ × ${p} × ${r} × sin ${angle}° = ${sf3(area)} cm²`,
        };
      },
    },
  },
  {
    id: 'g4-11', difficulty: 'medium',
    question: 'From a point 30 m from the foot of a building, the angle of elevation of the top is 35°. Find the height of the building, correct to 3 significant figures.',
    answer: '21.0 m',
    working: 'tan 35° = height/30 → height = 30 tan 35° = 21.0 m',
    vary: {
      make: rand => {
        const d = 5 * rand(2, 20);
        const angle = rand(15, 70);
        const h = d * Math.tan(toRadians(angle));
        return {
          question: `From a point ${d} m from the foot of a building, the angle of elevation of the top is ${angle}°. Find the height of the building, correct to 3 significant figures.`,
          answer: `${sf3(h)} m`,
          working: `tan ${angle}° = height/${d} → height = ${d} tan ${angle}° = ${sf3(h)} m`,
        };
      },
    },
  },
  {
    id: 'g4-12', difficulty: 'hard',
    question: 'From the top of a 50 m cliff, the angle of depression of a boat is 20°. How far is the boat from the foot of the cliff, correct to 3 significant figures?',
    answer: '137 m',
    working: 'Angle of depression = angle of elevation from the boat → tan 20° = 50/d → d = 50 ÷ tan 20° = 137 m',
    vary: {
      make: rand => {
        const h = 10 * rand(2, 12);
        const angle = rand(10, 60);
        const d = h / Math.tan(toRadians(angle));
        return {
          question: `From the top of ${aOrAn(h)} ${h} m cliff, the angle of depression of a boat is ${angle}°. How far is the boat from the foot of the cliff, correct to 3 significant figures?`,
          answer: `${sf3(d)} m`,
          working: `Angle of depression = angle of elevation from the boat → tan ${angle}° = ${h}/d → d = ${h} ÷ tan ${angle}° = ${sf3(d)} m`,
        };
      },
    },
  },
  {
    id: 'g4-13', difficulty: 'medium',
    question: 'The bearing of B from A is 065°. Find the bearing of A from B.',
    answer: '245°',
    working: 'Back bearing = bearing ± 180° → 065 + 180 = 245°',
    vary: {
      make: rand => {
        const bearing = rand(1, 359);
        const back = bearing < 180 ? bearing + 180 : bearing - 180;
        const three = n => String(n).padStart(3, '0');
        return {
          question: `The bearing of B from A is ${three(bearing)}°. Find the bearing of A from B.`,
          answer: `${three(back)}°`,
          working: `Back bearing = bearing ± 180° → ${three(bearing)} ${bearing < 180 ? '+' : '−'} 180 = ${three(back)}°`,
        };
      },
    },
  },
  {
    id: 'g4-14', difficulty: 'medium',
    question: 'Find the obtuse angle θ such that sin θ = sin 40°.',
    answer: '140°',
    working: 'sin θ = sin(180° − θ) → θ = 180 − 40 = 140°',
    vary: {
      make: rand => {
        const x = rand(5, 85);
        return {
          question: `Find the obtuse angle θ such that sin θ = sin ${x}°.`,
          answer: `${180 - x}°`,
          working: `sin θ = sin(180° − θ) → θ = 180 − ${x} = ${180 - x}°`,
        };
      },
    },
  },
  {
    id: 'g4-15', difficulty: 'easy',
    question: 'When should you use the sine rule, and when the cosine rule?',
    answer: 'Sine rule (a/sin A = b/sin B): when you know a side and its opposite angle, plus one more side or angle.\nCosine rule (a² = b² + c² − 2bc cos A): when you know two sides and the angle between them, or all three sides.',
  },
]);

// ---------- O Level Mathematics 4052 — G5 Mensuration ----------

// 120 → "2π/3"   180 → "π"   90 → "π/2"
function radiansOf(degrees) {
  const [top, bottom = '1'] = fraction(degrees, 180).split('/');
  const numerator = top === '1' ? 'π' : `${top}π`;
  return bottom === '1' ? numerator : `${numerator}/${bottom}`;
}

const oMathG5 = deck('G5 Mensuration', [
  {
    id: 'g5-01', difficulty: 'easy',
    question: 'A trapezium has parallel sides 8 cm and 12 cm, and height 5 cm. Find its area.',
    answer: '50 cm²',
    working: '½ × (8 + 12) × 5 = 50 cm²',
    vary: {
      make: rand => {
        const a = rand(3, 15);
        const b = pick(rand, [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 18, 20].filter(v => v !== a));
        const h = 2 * rand(1, 8);
        return {
          question: `A trapezium has parallel sides ${a} cm and ${b} cm, and height ${h} cm. Find its area.`,
          answer: `${((a + b) * h) / 2} cm²`,
          working: `½ × (${a} + ${b}) × ${h} = ${((a + b) * h) / 2} cm²`,
        };
      },
    },
  },
  {
    id: 'g5-02', difficulty: 'easy',
    question: 'Find the area of a circle with radius 7 cm, correct to 3 significant figures.',
    answer: '154 cm²',
    working: 'πr² = π × 7² = 153.9… = 154 cm²',
    vary: {
      make: rand => {
        const r = rand(2, 20);
        return {
          question: `Find the area of a circle with radius ${r} cm, correct to 3 significant figures.`,
          answer: `${sf3(Math.PI * r * r)} cm²`,
          working: `πr² = π × ${r}² = ${sf3(Math.PI * r * r)} cm²`,
        };
      },
    },
  },
  {
    id: 'g5-03', difficulty: 'easy',
    question: 'Find the circumference of a circle with diameter 10 cm, correct to 3 significant figures.',
    answer: '31.4 cm',
    working: 'πd = π × 10 = 31.4 cm',
    vary: {
      make: rand => {
        const d = rand(3, 40);
        return {
          question: `Find the circumference of a circle with diameter ${d} cm, correct to 3 significant figures.`,
          answer: `${sf3(Math.PI * d)} cm`,
          working: `πd = π × ${d} = ${sf3(Math.PI * d)} cm`,
        };
      },
    },
  },
  {
    id: 'g5-04', difficulty: 'medium',
    question: 'A sector has radius 9 cm and angle 80°. Find its arc length, correct to 3 significant figures.',
    answer: '12.6 cm',
    working: 'Arc = (80/360) × 2π × 9 = 12.6 cm',
    vary: {
      make: rand => {
        const r = rand(3, 20);
        const angle = 5 * rand(4, 60);
        const arc = (angle / 360) * 2 * Math.PI * r;
        return {
          question: `A sector has radius ${r} cm and angle ${angle}°. Find its arc length, correct to 3 significant figures.`,
          answer: `${sf3(arc)} cm`,
          working: `Arc = (${angle}/360) × 2π × ${r} = ${sf3(arc)} cm`,
        };
      },
    },
  },
  {
    id: 'g5-05', difficulty: 'medium',
    question: 'A sector has radius 6 cm and angle 150°. Find its area, correct to 3 significant figures.',
    answer: '47.1 cm²',
    working: 'Area = (150/360) × π × 6² = 47.1 cm²',
    vary: {
      make: rand => {
        const r = rand(3, 20);
        const angle = 5 * rand(4, 60);
        const area = (angle / 360) * Math.PI * r * r;
        return {
          question: `A sector has radius ${r} cm and angle ${angle}°. Find its area, correct to 3 significant figures.`,
          answer: `${sf3(area)} cm²`,
          working: `Area = (${angle}/360) × π × ${r}² = ${sf3(area)} cm²`,
        };
      },
    },
  },
  {
    id: 'g5-06', difficulty: 'easy',
    question: 'Convert 120° to radians, giving your answer in terms of π.',
    answer: '2π/3',
    working: '180° = π radians → 120 × π/180 = 2π/3',
    vary: {
      make: rand => {
        const degrees = pick(rand, [30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330]);
        return {
          question: `Convert ${degrees}° to radians, giving your answer in terms of π.`,
          answer: radiansOf(degrees),
          working: `180° = π radians → ${degrees} × π/180 = ${radiansOf(degrees)}`,
        };
      },
    },
  },
  {
    id: 'g5-07', difficulty: 'medium',
    question: 'A sector has radius 8 cm and angle 1.2 radians. Find its arc length and its area.',
    answer: 'Arc length 9.6 cm, area 38.4 cm²',
    working: 's = rθ = 8 × 1.2 = 9.6; A = ½r²θ = ½ × 64 × 1.2 = 38.4',
    vary: {
      make: rand => {
        const r = rand(2, 15);
        const tenths = rand(3, 30);
        const theta = tenths / 10;
        const arc = (r * tenths) / 10;
        const area = (r * r * tenths) / 20;
        return {
          question: `A sector has radius ${r} cm and angle ${theta} radians. Find its arc length and its area.`,
          answer: `Arc length ${arc} cm, area ${area} cm²`,
          working: `s = rθ = ${r} × ${theta} = ${arc}; A = ½r²θ = ½ × ${r * r} × ${theta} = ${area}`,
        };
      },
    },
  },
  {
    id: 'g5-08', difficulty: 'easy',
    question: 'Find the volume of a cylinder with radius 4 cm and height 10 cm, correct to 3 significant figures.',
    answer: '503 cm³',
    working: 'V = πr²h = π × 16 × 10 = 502.6… = 503 cm³',
    vary: {
      make: rand => {
        const r = rand(2, 12);
        const h = rand(3, 25);
        const v = Math.PI * r * r * h;
        return {
          question: `Find the volume of a cylinder with radius ${r} cm and height ${h} cm, correct to 3 significant figures.`,
          answer: `${sf3(v)} cm³`,
          working: `V = πr²h = π × ${r * r} × ${h} = ${sf3(v)} cm³`,
        };
      },
    },
  },
  {
    id: 'g5-09', difficulty: 'medium',
    question: 'Find the volume of a cone with radius 6 cm and height 8 cm, correct to 3 significant figures.',
    answer: '302 cm³',
    working: 'V = ⅓πr²h = ⅓ × π × 36 × 8 = 301.6… = 302 cm³',
    vary: {
      make: rand => {
        const r = rand(2, 12);
        const h = rand(3, 25);
        const v = (Math.PI * r * r * h) / 3;
        return {
          question: `Find the volume of a cone with radius ${r} cm and height ${h} cm, correct to 3 significant figures.`,
          answer: `${sf3(v)} cm³`,
          working: `V = ⅓πr²h = ⅓ × π × ${r * r} × ${h} = ${sf3(v)} cm³`,
        };
      },
    },
  },
  {
    id: 'g5-10', difficulty: 'medium',
    question: 'A sphere has radius 3 cm. Find its volume and its surface area, correct to 3 significant figures.',
    answer: 'Volume 113 cm³, surface area 113 cm²',
    working: 'V = 4/3 πr³ = 36π; A = 4πr² = 36π (the same number only when r = 3)',
    vary: {
      make: rand => {
        const r = pick(rand, [2, 4, 5, 6, 7, 8, 9, 10, 12]);
        const v = (4 / 3) * Math.PI * r ** 3;
        const a = 4 * Math.PI * r * r;
        return {
          question: `A sphere has radius ${r} cm. Find its volume and its surface area, correct to 3 significant figures.`,
          answer: `Volume ${sf3(v)} cm³, surface area ${sf3(a)} cm²`,
          working: `V = 4/3 πr³ = 4/3 × π × ${r ** 3}; A = 4πr² = 4 × π × ${r * r}`,
        };
      },
    },
  },
  {
    id: 'g5-11', difficulty: 'medium',
    question: 'A pyramid has a rectangular base 6 cm by 5 cm and a height of 9 cm. Find its volume.',
    answer: '90 cm³',
    working: 'V = ⅓ × base area × height = ⅓ × 30 × 9 = 90 cm³',
    vary: {
      make: rand => {
        const l = rand(2, 12);
        const w = rand(2, 12);
        const h = 3 * rand(1, 8);
        return {
          question: `A pyramid has a rectangular base ${l} cm by ${w} cm and a height of ${h} cm. Find its volume.`,
          answer: `${(l * w * h) / 3} cm³`,
          working: `V = ⅓ × base area × height = ⅓ × ${l * w} × ${h} = ${(l * w * h) / 3} cm³`,
        };
      },
    },
  },
  {
    id: 'g5-12', difficulty: 'medium',
    question: 'A prism is 20 cm long. Its cross-section is a triangle with base 6 cm and height 4 cm. Find its volume.',
    answer: '240 cm³',
    working: 'V = cross-section area × length = (½ × 6 × 4) × 20 = 240 cm³',
    vary: {
      make: rand => {
        const b = 2 * rand(1, 8);
        const h = rand(2, 12);
        const len = rand(5, 30);
        return {
          question: `A prism is ${len} cm long. Its cross-section is a triangle with base ${b} cm and height ${h} cm. Find its volume.`,
          answer: `${withCommas((b * h * len) / 2)} cm³`,
          working: `V = cross-section area × length = (½ × ${b} × ${h}) × ${len} = ${withCommas((b * h * len) / 2)} cm³`,
        };
      },
    },
  },
  {
    id: 'g5-13', difficulty: 'hard',
    question: 'A cone has radius 5 cm and height 12 cm. Find its curved surface area, correct to 3 significant figures.',
    answer: '204 cm²',
    working: 'Slant height l = √(5² + 12²) = 13 → curved area = πrl = π × 5 × 13 = 204 cm²',
    vary: {
      make: rand => {
        const [a, b, c] = pick(rand, TRIPLES.slice(0, 4));
        const k = rand(1, 2);
        const [r, h] = rand(0, 1) ? [a * k, b * k] : [b * k, a * k];
        const area = Math.PI * r * c * k;
        return {
          question: `A cone has radius ${r} cm and height ${h} cm. Find its curved surface area, correct to 3 significant figures.`,
          answer: `${sf3(area)} cm²`,
          working: `Slant height l = √(${r}² + ${h}²) = ${c * k} → curved area = πrl = π × ${r} × ${c * k} = ${sf3(area)} cm²`,
        };
      },
    },
  },
  {
    id: 'g5-14', difficulty: 'hard',
    question: 'A solid is made of a hemisphere on top of a cylinder, both with radius 3 cm. The cylinder is 10 cm tall. Find the total volume, correct to 3 significant figures.',
    answer: '339 cm³',
    working: 'Cylinder πr²h = 90π; hemisphere ⅔πr³ = 18π → total 108π = 339 cm³',
    vary: {
      make: rand => {
        const r = rand(2, 9);
        const h = rand(4, 20);
        const cyl = r * r * h;
        const hemi = (2 * r ** 3) / 3;
        const total = Math.PI * (cyl + hemi);
        return {
          question: `A solid is made of a hemisphere on top of a cylinder, both with radius ${r} cm. The cylinder is ${h} cm tall. Find the total volume, correct to 3 significant figures.`,
          answer: `${sf3(total)} cm³`,
          working: `Cylinder πr²h = ${cyl}π; hemisphere ⅔πr³ = ${Number(hemi.toFixed(2))}π → total ${Number((cyl + hemi).toFixed(2))}π = ${sf3(total)} cm³`,
        };
      },
    },
  },
  {
    id: 'g5-15', difficulty: 'hard',
    question: 'A cylinder has volume 500 cm³ and radius 5 cm. Find its height, correct to 3 significant figures.',
    answer: '6.37 cm',
    working: 'V = πr²h → h = 500 ÷ (π × 25) = 6.37 cm',
    vary: {
      make: rand => {
        const r = rand(2, 10);
        const v = 50 * rand(2, 40);
        const h = v / (Math.PI * r * r);
        return {
          question: `A cylinder has volume ${withCommas(v)} cm³ and radius ${r} cm. Find its height, correct to 3 significant figures.`,
          answer: `${sf3(h)} cm`,
          working: `V = πr²h → h = ${withCommas(v)} ÷ (π × ${r * r}) = ${sf3(h)} cm`,
        };
      },
    },
  },
]);

// ---------- O Level Mathematics 4052 — G6 Coordinate geometry ----------

// Two points whose difference is a scaled Pythagorean triple, so the distance is a whole number.
function tripleSegment(rand) {
  const [a, b, c] = pick(rand, TRIPLES.slice(0, 3));
  const k = rand(1, 2);
  const [dx0, dy0] = rand(0, 1) ? [a * k, b * k] : [b * k, a * k];
  const dx = rand(0, 1) ? dx0 : -dx0;
  const dy = rand(0, 1) ? dy0 : -dy0;
  const x1 = rand(-6, 6);
  const y1 = rand(-6, 6);
  return { x1, y1, x2: x1 + dx, y2: y1 + dy, dx, dy, length: c * k };
}

const oMathG6 = deck('G6 Coordinate geometry', [
  {
    id: 'g6-01', difficulty: 'easy',
    question: 'Find the length of the line segment joining A(1, 2) and B(7, 10).',
    answer: '10 units',
    working: '√((7 − 1)² + (10 − 2)²) = √(36 + 64) = √100 = 10',
    vary: {
      make: rand => {
        const { x1, y1, x2, y2, dx, dy, length } = tripleSegment(rand);
        return {
          question: `Find the length of the line segment joining A${point(x1, y1)} and B${point(x2, y2)}.`,
          answer: `${length} units`,
          working: `√((${signed(dx)})² + (${signed(dy)})²) = √(${dx * dx} + ${dy * dy}) = √${length * length} = ${length}`,
        };
      },
    },
  },
  {
    id: 'g6-02', difficulty: 'medium',
    question: 'Find the length of the line segment joining P(−2, 3) and Q(4, −1), correct to 3 significant figures.',
    answer: '7.21 units',
    working: '√(6² + (−4)²) = √52 = 7.21',
    vary: {
      make: rand => {
        let dx, dy;
        do { [dx, dy] = [nonZero(rand, 9), nonZero(rand, 9)]; } while (Number.isInteger(Math.sqrt(dx * dx + dy * dy)));
        const x1 = rand(-6, 6);
        const y1 = rand(-6, 6);
        const d2 = dx * dx + dy * dy;
        return {
          question: `Find the length of the line segment joining P${point(x1, y1)} and Q${point(x1 + dx, y1 + dy)}, correct to 3 significant figures.`,
          answer: `${sf3(Math.sqrt(d2))} units`,
          working: `√((${signed(dx)})² + (${signed(dy)})²) = √${d2} = ${sf3(Math.sqrt(d2))}`,
        };
      },
    },
  },
  {
    id: 'g6-03', difficulty: 'easy',
    question: 'Find the midpoint of A(2, −3) and B(8, 5).',
    answer: '(5, 1)',
    working: '((2 + 8) ÷ 2, (−3 + 5) ÷ 2) = (5, 1)',
    vary: {
      make: rand => {
        const [x1, y1, x2, y2] = [rand(-8, 8), rand(-8, 8), rand(-8, 8), rand(-8, 8)];
        return {
          question: `Find the midpoint of A${point(x1, y1)} and B${point(x2, y2)}.`,
          answer: point((x1 + x2) / 2, (y1 + y2) / 2),
          working: `((${signed(x1)}${plusMinus(x2)}) ÷ 2, (${signed(y1)}${plusMinus(y2)}) ÷ 2) = ${point((x1 + x2) / 2, (y1 + y2) / 2)}`,
        };
      },
    },
  },
  {
    id: 'g6-04', difficulty: 'medium',
    question: 'Find the gradient of the line through (1, 2) and (7, 6).',
    answer: '2/3',
    working: '(6 − 2) ÷ (7 − 1) = 4/6 = 2/3',
    vary: {
      make: rand => {
        const [x1, y1] = [rand(-6, 6), rand(-6, 6)];
        const dx = nonZero(rand, 8);
        const dy = nonZero(rand, 8);
        return {
          question: `Find the gradient of the line through ${point(x1, y1)} and ${point(x1 + dx, y1 + dy)}.`,
          answer: signedFraction(dy, dx),
          working: `(${signed(y1 + dy)} − ${y1 < 0 ? `(${signed(y1)})` : y1}) ÷ (${signed(x1 + dx)} − ${x1 < 0 ? `(${signed(x1)})` : x1}) = ${signedFraction(dy, dx)}`,
        };
      },
    },
  },
  {
    id: 'g6-05', difficulty: 'medium',
    question: 'Find the equation of the line passing through (1, 5) and (3, 11).',
    answer: 'y = 3x + 2',
    working: 'Gradient = (11 − 5) ÷ (3 − 1) = 3 → 5 = 3(1) + c → c = 2',
    vary: {
      make: rand => {
        const m = nonZero(rand, 5);
        const c = rand(-9, 9);
        const x1 = rand(-4, 4);
        const x2 = x1 + rand(1, 4);
        const [y1, y2] = [m * x1 + c, m * x2 + c];
        return {
          question: `Find the equation of the line passing through ${point(x1, y1)} and ${point(x2, y2)}.`,
          answer: `y = ${poly([[m, 'x'], [c, '']])}`,
          working: `Gradient = (${signed(y2)} − ${y1 < 0 ? `(${signed(y1)})` : y1}) ÷ (${signed(x2)} − ${x1 < 0 ? `(${signed(x1)})` : x1}) = ${signed(m)} → ${signed(y1)} = ${signed(m)}(${signed(x1)}) + c → c = ${signed(c)}`,
        };
      },
    },
  },
  {
    id: 'g6-06', difficulty: 'medium',
    question: 'Find the equation of the line parallel to y = 3x + 1 that passes through (2, 5).',
    answer: 'y = 3x − 1',
    working: 'Parallel lines have the same gradient (3) → 5 = 3(2) + c → c = −1',
    vary: {
      make: rand => {
        const m = nonZero(rand, 5);
        const c0 = nonZero(rand, 9);
        const [x1, y1] = [nonZero(rand, 5), nonZero(rand, 9)];
        const c = y1 - m * x1;
        return {
          question: `Find the equation of the line parallel to y = ${poly([[m, 'x'], [c0, '']])} that passes through ${point(x1, y1)}.`,
          answer: `y = ${poly([[m, 'x'], [c, '']])}`,
          working: `Parallel lines have the same gradient (${signed(m)}) → ${signed(y1)} = ${signed(m)}(${signed(x1)}) + c → c = ${signed(c)}`,
        };
      },
    },
  },
  {
    id: 'g6-07', difficulty: 'easy',
    question: 'The point (k, 7) lies on the line y = 2x − 3. Find k.',
    answer: 'k = 5',
    working: '7 = 2k − 3 → 2k = 10 → k = 5',
    vary: {
      make: rand => {
        const m = nonZero(rand, 5);
        const c = nonZero(rand, 9);
        const k = nonZero(rand, 8);
        const y = m * k + c;
        return {
          question: `The point (k, ${signed(y)}) lies on the line y = ${poly([[m, 'x'], [c, '']])}. Find k.`,
          answer: `k = ${signed(k)}`,
          working: `${signed(y)} = ${poly([[m, 'k'], [c, '']])} → ${poly([[m, 'k']])} = ${signed(y - c)} → k = ${signed(k)}`,
        };
      },
    },
  },
  {
    id: 'g6-08', difficulty: 'medium',
    question: 'Find where the line 3x + 4y = 12 crosses the x-axis and the y-axis.',
    answer: 'x-axis at (4, 0); y-axis at (0, 3)',
    working: 'x-axis: y = 0 → 3x = 12 → x = 4. y-axis: x = 0 → 4y = 12 → y = 3',
    vary: {
      make: rand => {
        const p = nonZero(rand, 8);
        const q = nonZero(rand, 8);
        const g = gcd(Math.abs(p), Math.abs(q));
        // The line through (p, 0) and (0, q): qx + py = pq, divided by their HCF.
        const [a, b, c] = [q / g, p / g, (p * q) / g];
        return {
          question: `Find where the line ${poly([[a, 'x'], [b, 'y']])} = ${signed(c)} crosses the x-axis and the y-axis.`,
          answer: `x-axis at ${point(p, 0)}; y-axis at ${point(0, q)}`,
          working: `x-axis: y = 0 → ${poly([[a, 'x']])} = ${signed(c)} → x = ${signed(p)}. y-axis: x = 0 → ${poly([[b, 'y']])} = ${signed(c)} → y = ${signed(q)}`,
        };
      },
    },
  },
  {
    id: 'g6-09', difficulty: 'medium',
    question: 'Find the gradient of the line 2x + 5y = 10.',
    answer: '−2/5',
    working: '5y = −2x + 10 → y = −2/5 x + 2',
    vary: {
      make: rand => {
        const a = nonZero(rand, 9);
        const b = pick(rand, [2, 3, 4, 5, 6, 7, 8, 9]);
        const c = nonZero(rand, 12);
        return {
          question: `Find the gradient of the line ${poly([[a, 'x'], [b, 'y']])} = ${signed(c)}.`,
          answer: signedFraction(-a, b),
          working: `${b}y = ${poly([[-a, 'x'], [c, '']])} → gradient = ${signed(-a)} ÷ ${b} = ${signedFraction(-a, b)}`,
        };
      },
    },
  },
  {
    id: 'g6-10', difficulty: 'medium',
    question: 'Are the lines y = 2x + 3 and 4y = 8x − 1 parallel?',
    answer: 'Yes',
    working: '4y = 8x − 1 → y = 2x − 1/4. Both gradients are 2, so they are parallel',
    vary: {
      make: rand => {
        const m = nonZero(rand, 4);
        const k = rand(2, 5);
        const parallel = rand(0, 1) === 1;
        const m2 = parallel ? m : pick(rand, [-4, -3, -2, -1, 1, 2, 3, 4].filter(v => v !== m));
        const c1 = nonZero(rand, 9);
        const d = nonZero(rand, 9);
        return {
          question: `Are the lines y = ${poly([[m, 'x'], [c1, '']])} and ${k}y = ${poly([[k * m2, 'x'], [d, '']])} parallel?`,
          answer: parallel ? 'Yes' : 'No',
          working: `${k}y = ${poly([[k * m2, 'x'], [d, '']])} → gradient ${signed(m2)}. The other gradient is ${signed(m)}, so they are ${parallel ? '' : 'NOT '}parallel`,
        };
      },
    },
  },
  {
    id: 'g6-11', difficulty: 'medium',
    question: 'Find the area of the triangle with vertices A(1, 1), B(7, 1) and C(4, 5).',
    answer: '12 square units',
    working: 'AB is horizontal: base = 7 − 1 = 6, height = 5 − 1 = 4 → ½ × 6 × 4 = 12',
    vary: {
      make: rand => {
        const [x1, y1] = [rand(-5, 3), rand(-5, 5)];
        const base = rand(2, 10);
        const height = nonZero(rand, 8);
        const cx = rand(x1 - 2, x1 + base + 2);
        const area = (base * Math.abs(height)) / 2;
        return {
          question: `Find the area of the triangle with vertices A${point(x1, y1)}, B${point(x1 + base, y1)} and C${point(cx, y1 + height)}.`,
          answer: `${area} square units`,
          working: `AB is horizontal: base = ${base}, height = ${Math.abs(height)} (vertical distance from C to AB) → ½ × ${base} × ${Math.abs(height)} = ${area}`,
        };
      },
    },
  },
  {
    id: 'g6-12', difficulty: 'easy',
    question: 'Write the equation of the line through (3, −2) that is parallel to the x-axis.',
    answer: 'y = −2',
    working: 'Lines parallel to the x-axis are horizontal: every point has the same y-coordinate',
    vary: {
      make: rand => {
        const [x, y] = [nonZero(rand, 9), nonZero(rand, 9)];
        const horizontal = rand(0, 1) === 1;
        return {
          question: `Write the equation of the line through ${point(x, y)} that is parallel to the ${horizontal ? 'x' : 'y'}-axis.`,
          answer: horizontal ? `y = ${signed(y)}` : `x = ${signed(x)}`,
          working: horizontal
            ? 'Lines parallel to the x-axis are horizontal: every point has the same y-coordinate'
            : 'Lines parallel to the y-axis are vertical: every point has the same x-coordinate',
        };
      },
    },
  },
]);

// ---------- O Level Mathematics 4052 — G7 Vectors in two dimensions ----------

// (3, -4) → "( 3 )\n( −4 )"  (a column vector, one number per line)
function column(x, y) {
  return `( ${signed(x)} )\n( ${signed(y)} )`;
}

const oMathG7 = deck('G7 Vectors in two dimensions', [
  {
    id: 'g7-01', difficulty: 'easy',
    question: 'Find the magnitude of the vector\n( 6 )\n( −8 )',
    answer: '10',
    working: '√(6² + (−8)²) = √100 = 10',
    vary: {
      make: rand => {
        const { dx, dy, length } = tripleSegment(rand);
        return {
          question: `Find the magnitude of the vector\n${column(dx, dy)}`,
          answer: String(length),
          working: `√((${signed(dx)})² + (${signed(dy)})²) = √${length * length} = ${length}`,
        };
      },
    },
  },
  {
    id: 'g7-02', difficulty: 'medium',
    question: 'Find the magnitude of the vector\n( 3 )\n( 5 )\ncorrect to 3 significant figures.',
    answer: '5.83',
    working: '√(3² + 5²) = √34 = 5.83',
    vary: {
      make: rand => {
        let x, y;
        do { [x, y] = [nonZero(rand, 9), nonZero(rand, 9)]; } while (Number.isInteger(Math.sqrt(x * x + y * y)));
        return {
          question: `Find the magnitude of the vector\n${column(x, y)}\ncorrect to 3 significant figures.`,
          answer: sf3(Math.sqrt(x * x + y * y)),
          working: `√((${signed(x)})² + (${signed(y)})²) = √${x * x + y * y} = ${sf3(Math.sqrt(x * x + y * y))}`,
        };
      },
    },
  },
  {
    id: 'g7-03', difficulty: 'easy',
    question: 'a =\n( 2 )\n( −3 )\nb =\n( 4 )\n( 1 )\nFind a + b.',
    answer: '( 6 )\n( −2 )',
    working: 'Add the top numbers and the bottom numbers: 2 + 4 = 6, −3 + 1 = −2',
    vary: {
      make: rand => {
        const [a1, a2, b1, b2] = [rand(-8, 8), rand(-8, 8), rand(-8, 8), rand(-8, 8)];
        return {
          question: `a =\n${column(a1, a2)}\nb =\n${column(b1, b2)}\nFind a + b.`,
          answer: column(a1 + b1, a2 + b2),
          working: `Add the top numbers and the bottom numbers: ${signed(a1)}${plusMinus(b1)} = ${signed(a1 + b1)}, ${signed(a2)}${plusMinus(b2)} = ${signed(a2 + b2)}`,
        };
      },
    },
  },
  {
    id: 'g7-04', difficulty: 'medium',
    question: 'a =\n( 3 )\n( −1 )\nb =\n( 2 )\n( 4 )\nFind 2a − 3b.',
    answer: '( 0 )\n( −14 )',
    working: '2a = (6, −2) and 3b = (6, 12) → (6 − 6, −2 − 12) = (0, −14)',
    vary: {
      make: rand => {
        const [a1, a2, b1, b2] = [rand(-6, 6), rand(-6, 6), rand(-6, 6), rand(-6, 6)];
        const [p, q] = [rand(2, 4), rand(2, 4)];
        const [r1, r2] = [p * a1 - q * b1, p * a2 - q * b2];
        return {
          question: `a =\n${column(a1, a2)}\nb =\n${column(b1, b2)}\nFind ${p}a − ${q}b.`,
          answer: column(r1, r2),
          working: `${p}a = ${point(p * a1, p * a2)} and ${q}b = ${point(q * b1, q * b2)} → ${point(r1, r2)}`,
        };
      },
    },
  },
  {
    id: 'g7-05', difficulty: 'easy',
    question: 'A is the point (1, 4) and B is the point (6, −2). Find the column vector AB.',
    answer: '( 5 )\n( −6 )',
    working: 'AB = B − A = (6 − 1, −2 − 4) = (5, −6)',
    vary: {
      make: rand => {
        const [x1, y1, x2, y2] = [rand(-8, 8), rand(-8, 8), rand(-8, 8), rand(-8, 8)];
        return {
          question: `A is the point ${point(x1, y1)} and B is the point ${point(x2, y2)}. Find the column vector AB.`,
          answer: column(x2 - x1, y2 - y1),
          working: `AB = B − A = (${signed(x2)} − ${x1 < 0 ? `(${signed(x1)})` : x1}, ${signed(y2)} − ${y1 < 0 ? `(${signed(y1)})` : y1}) = ${point(x2 - x1, y2 - y1)}`,
        };
      },
    },
  },
  {
    id: 'g7-06', difficulty: 'medium',
    question: 'The vectors\n( k )\n( 6 )\nand\n( 2 )\n( 3 )\nare parallel. Find k.',
    answer: 'k = 4',
    working: 'Parallel → one is a multiple of the other: 6 = 2 × 3, so k = 2 × 2 = 4',
    vary: {
      make: rand => {
        const [p, q] = [nonZero(rand, 6), nonZero(rand, 6)];
        const m = pick(rand, [-3, -2, 2, 3, 4]);
        return {
          question: `The vectors\n( k )\n( ${signed(q * m)} )\nand\n${column(p, q)}\nare parallel. Find k.`,
          answer: `k = ${signed(p * m)}`,
          working: `Parallel → one is a multiple of the other: ${signed(q * m)} = ${signed(m)} × ${q < 0 ? `(${signed(q)})` : q}, so k = ${signed(m)} × ${p < 0 ? `(${signed(p)})` : p} = ${signed(p * m)}`,
        };
      },
    },
  },
  {
    id: 'g7-07', difficulty: 'medium',
    question: 'p =\n( 3 )\n( −2 )\nr =\n( 7 )\n( 1 )\nFind q such that p + q = r.',
    answer: '( 4 )\n( 3 )',
    working: 'q = r − p = (7 − 3, 1 − (−2)) = (4, 3)',
    vary: {
      make: rand => {
        const [p1, p2, q1, q2] = [rand(-8, 8), rand(-8, 8), rand(-8, 8), rand(-8, 8)];
        const [r1, r2] = [p1 + q1, p2 + q2];
        return {
          question: `p =\n${column(p1, p2)}\nr =\n${column(r1, r2)}\nFind q such that p + q = r.`,
          answer: column(q1, q2),
          working: `q = r − p = (${signed(r1)} − ${p1 < 0 ? `(${signed(p1)})` : p1}, ${signed(r2)} − ${p2 < 0 ? `(${signed(p2)})` : p2}) = ${point(q1, q2)}`,
        };
      },
    },
  },
  {
    id: 'g7-08', difficulty: 'medium',
    question: 'OA = a and OB = b. Express AB in terms of a and b.',
    answer: 'AB = b − a',
    working: 'AB = AO + OB = −a + b',
  },
  {
    id: 'g7-09', difficulty: 'hard',
    question: 'OA = a and OB = b. P lies on AB with AP : PB = 1 : 2. Express OP in terms of a and b.',
    answer: 'OP = 2/3 a + 1/3 b',
    working: 'OP = OA + AP = a + 1/3(b − a) = 2/3 a + 1/3 b',
    vary: {
      make: rand => {
        const [m, n] = ratioPair(rand);
        const total = m + n;
        const fa = fraction(n, total);
        const fb = fraction(m, total);
        return {
          question: `OA = a and OB = b. P lies on AB with AP : PB = ${m} : ${n}. Express OP in terms of a and b.`,
          answer: `OP = ${fa} a + ${fb} b`,
          working: `OP = OA + AP = a + ${fraction(m, total)}(b − a) = ${fa} a + ${fb} b`,
        };
      },
    },
  },
  {
    id: 'g7-10', difficulty: 'medium',
    question: 'What does it mean if AB = 3BC? What can you conclude about A, B and C?',
    answer: 'AB is parallel to BC and 3 times as long. Since they share the point B, A, B and C lie on a straight line (they are collinear).',
  },
  {
    id: 'g7-11', difficulty: 'easy',
    question: 'If b = −2a, how are vectors a and b related?',
    answer: 'b is parallel to a, twice as long, and points in the opposite direction.',
    vary: {
      make: rand => {
        const k = pick(rand, [-4, -3, -2, 2, 3, 4]);
        const size = { 2: 'twice', 3: 'three times', 4: 'four times' }[Math.abs(k)];
        return {
          question: `If b = ${signed(k)}a, how are vectors a and b related?`,
          answer: `b is parallel to a, ${size} as long, and points in the ${k < 0 ? 'opposite' : 'same'} direction.`,
          working: '',
        };
      },
    },
  },
]);

// ---------- O Level Mathematics 4052 — S1 Data handling and analysis ----------

// A shuffled copy of a list (uses the random helper so recipes stay testable).
function shuffle(rand, list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = rand(0, i);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const sum = list => list.reduce((total, v) => total + v, 0);

const oMathS1 = deck('S1 Data handling and analysis', [
  {
    id: 's1-01', difficulty: 'easy',
    question: 'Find the mean of 4, 8, 6, 5, 9, 4.',
    answer: '6',
    working: '(4 + 8 + 6 + 5 + 9 + 4) ÷ 6 = 36 ÷ 6 = 6',
    vary: {
      make: rand => {
        let n, mean, list;
        do {
          n = rand(5, 8);
          mean = rand(4, 20);
          list = Array.from({ length: n - 1 }, () => mean + rand(-4, 4));
          list.push(mean * n - sum(list)); // last value makes the mean a whole number
        } while (list[n - 1] < 1); // keep every value positive
        return {
          question: `Find the mean of ${list.join(', ')}.`,
          answer: String(mean),
          working: `(${list.join(' + ')}) ÷ ${n} = ${mean * n} ÷ ${n} = ${mean}`,
        };
      },
    },
  },
  {
    id: 's1-02', difficulty: 'easy',
    question: 'Find the median of 7, 3, 9, 4, 12, 5, 8, 10.',
    answer: '7.5',
    working: 'In order: 3, 4, 5, 7, 8, 9, 10, 12 → middle two are 7 and 8 → (7 + 8) ÷ 2 = 7.5',
    vary: {
      make: rand => {
        const n = rand(6, 9);
        const list = Array.from({ length: n }, () => rand(1, 30));
        const sorted = [...list].sort((x, y) => x - y);
        const mid = n % 2 === 1 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2;
        const how = n % 2 === 1
          ? `the middle value (${(n + 1) / 2}th) is ${mid}`
          : `middle two are ${sorted[n / 2 - 1]} and ${sorted[n / 2]} → (${sorted[n / 2 - 1]} + ${sorted[n / 2]}) ÷ 2 = ${mid}`;
        return {
          question: `Find the median of ${list.join(', ')}.`,
          answer: String(mid),
          working: `In order: ${sorted.join(', ')} → ${how}`,
        };
      },
    },
  },
  {
    id: 's1-03', difficulty: 'easy',
    question: 'Find the mode and the range of 5, 9, 2, 9, 7, 3, 9, 5.',
    answer: 'Mode 9, range 7',
    working: '9 appears most often (3 times). Range = 9 − 2 = 7',
    vary: {
      make: rand => {
        const mode = rand(2, 20);
        const others = shuffle(rand, range(25).filter(v => v !== mode)).slice(0, rand(4, 6));
        const repeat = rand(0, 1) ? others[0] : others[1]; // one other value appears twice
        const list = shuffle(rand, [mode, mode, mode, ...others, repeat]);
        const spread = Math.max(...list) - Math.min(...list);
        return {
          question: `Find the mode and the range of ${list.join(', ')}.`,
          answer: `Mode ${mode}, range ${spread}`,
          working: `${mode} appears most often (3 times). Range = ${Math.max(...list)} − ${Math.min(...list)} = ${spread}`,
        };
      },
    },
  },
  {
    id: 's1-04', difficulty: 'medium',
    question: 'The table shows the number of siblings of some students.\nSiblings: 0, 1, 2, 3, 4\nFrequency: 5, 8, 6, 3, 2\nFind the mean number of siblings, correct to 3 significant figures.',
    answer: '1.54',
    working: 'Σfx = 0 + 8 + 12 + 9 + 8 = 37, Σf = 24 → 37 ÷ 24 = 1.54',
    vary: {
      make: rand => {
        const freqs = [rand(1, 9), rand(2, 10), rand(2, 10), rand(1, 8), rand(1, 6)];
        const fx = freqs.map((f, x) => f * x);
        const mean = sum(fx) / sum(freqs);
        return {
          question: `The table shows the number of siblings of some students.\nSiblings: 0, 1, 2, 3, 4\nFrequency: ${freqs.join(', ')}\nFind the mean number of siblings, correct to 3 significant figures.`,
          answer: sf3(mean),
          working: `Σfx = ${fx.join(' + ')} = ${sum(fx)}, Σf = ${sum(freqs)} → ${sum(fx)} ÷ ${sum(freqs)} = ${sf3(mean)}`,
        };
      },
    },
  },
  {
    id: 's1-05', difficulty: 'hard',
    question: 'Marks (grouped): 0 < x ≤ 10: 4 students, 10 < x ≤ 20: 7, 20 < x ≤ 30: 9, 30 < x ≤ 40: 5. Estimate the mean mark, correct to 3 significant figures.',
    answer: '21.0',
    working: 'Use mid-values 5, 15, 25, 35: (5×4 + 15×7 + 25×9 + 35×5) ÷ 25 = 525 ÷ 25 = 21.0',
    vary: {
      make: rand => {
        const freqs = [rand(1, 9), rand(2, 12), rand(2, 12), rand(1, 9)];
        const mids = [5, 15, 25, 35];
        const total = sum(freqs.map((f, i) => f * mids[i]));
        const mean = total / sum(freqs);
        return {
          question: `Marks (grouped): 0 < x ≤ 10: ${freqs[0]} students, 10 < x ≤ 20: ${freqs[1]}, 20 < x ≤ 30: ${freqs[2]}, 30 < x ≤ 40: ${freqs[3]}. Estimate the mean mark, correct to 3 significant figures.`,
          answer: sf3(mean),
          working: `Use mid-values 5, 15, 25, 35: (${freqs.map((f, i) => `${mids[i]}×${f}`).join(' + ')}) ÷ ${sum(freqs)} = ${total} ÷ ${sum(freqs)} = ${sf3(mean)}`,
        };
      },
    },
  },
  {
    id: 's1-06', difficulty: 'medium',
    question: 'The mean of 5 numbers is 12. A sixth number, 18, is added. Find the new mean.',
    answer: '13',
    working: 'Old total = 5 × 12 = 60 → new total = 60 + 18 = 78 → 78 ÷ 6 = 13',
    vary: {
      make: rand => {
        let n, m, M, v;
        do {
          [n, m] = [rand(3, 9), rand(5, 30)];
          M = m + rand(-3, 3);
          v = M * (n + 1) - n * m;
        } while (v <= 0 || M === m);
        return {
          question: `The mean of ${n} numbers is ${m}. ${n === 3 ? 'A fourth' : `Another`} number, ${v}, is added. Find the new mean.`,
          answer: String(M),
          working: `Old total = ${n} × ${m} = ${n * m} → new total = ${n * m} + ${v} = ${n * m + v} → ${n * m + v} ÷ ${n + 1} = ${M}`,
        };
      },
    },
  },
  {
    id: 's1-07', difficulty: 'medium',
    question: 'The mean of five numbers is 10. Four of them are 7, 12, 9 and 15. Find the fifth number.',
    answer: '7',
    working: 'Total = 5 × 10 = 50 → 50 − (7 + 12 + 9 + 15) = 50 − 43 = 7',
    vary: {
      make: rand => {
        let m, known, missing;
        do {
          m = rand(6, 25);
          known = Array.from({ length: 4 }, () => m + rand(-6, 6));
          missing = 5 * m - sum(known);
        } while (missing <= 0);
        return {
          question: `The mean of five numbers is ${m}. Four of them are ${known.slice(0, 3).join(', ')} and ${known[3]}. Find the fifth number.`,
          answer: String(missing),
          working: `Total = 5 × ${m} = ${5 * m} → ${5 * m} − (${known.join(' + ')}) = ${5 * m} − ${sum(known)} = ${missing}`,
        };
      },
    },
  },
  {
    id: 's1-08', difficulty: 'hard',
    question: 'Find the lower quartile, upper quartile and interquartile range of: 3, 7, 8, 12, 15, 18, 20, 21, 25, 27, 30.',
    answer: 'Q1 = 8, Q3 = 25, IQR = 17',
    working: '11 values in order. Median = 6th (18). Q1 = middle of the lower 5 = 8. Q3 = middle of the upper 5 = 25 → IQR = 25 − 8 = 17',
    vary: {
      make: rand => {
        const n = pick(rand, [7, 11]);
        const list = shuffle(rand, range(40)).slice(0, n).sort((x, y) => x - y);
        const half = (n - 1) / 2;
        const q1 = list[(half - 1) / 2];
        const q3 = list[half + 1 + (half - 1) / 2];
        return {
          question: `Find the lower quartile, upper quartile and interquartile range of: ${list.join(', ')}.`,
          answer: `Q1 = ${q1}, Q3 = ${q3}, IQR = ${q3 - q1}`,
          working: `${n} values in order. Median = ${half + 1}th (${list[half]}). Q1 = middle of the lower ${half} = ${q1}. Q3 = middle of the upper ${half} = ${q3} → IQR = ${q3} − ${q1} = ${q3 - q1}`,
        };
      },
    },
  },
  {
    id: 's1-09', difficulty: 'hard',
    question: 'Find the standard deviation of 2, 4, 4, 5, 10, correct to 3 significant figures.',
    answer: '2.68',
    working: 'Mean = 25 ÷ 5 = 5. Σx² = 4 + 16 + 16 + 25 + 100 = 161 → √(161/5 − 5²) = √7.2 = 2.68',
    vary: {
      make: rand => {
        const list = Array.from({ length: 5 }, () => rand(1, 15)).sort((x, y) => x - y);
        const mean = sum(list) / 5;
        const sumSquares = sum(list.map(v => v * v));
        const variance = sumSquares / 5 - mean * mean;
        return {
          question: `Find the standard deviation of ${list.join(', ')}, correct to 3 significant figures.`,
          answer: variance === 0 ? '0' : sf3(Math.sqrt(variance)),
          working: `Mean = ${sum(list)} ÷ 5 = ${mean}. Σx² = ${sumSquares} → √(${sumSquares}/5 − ${mean}²) = √${Number(variance.toFixed(4))} = ${variance === 0 ? '0' : sf3(Math.sqrt(variance))}`,
        };
      },
    },
  },
  {
    id: 's1-10', difficulty: 'medium',
    question: 'A set of data has mean 20 and standard deviation 4. Every value is increased by 5. Find the new mean and standard deviation.',
    answer: 'Mean 25, standard deviation 4',
    working: 'Adding a constant shifts every value (and the mean) but does not change the spread',
    vary: {
      make: rand => {
        const mean = rand(10, 60);
        const sd = rand(2, 9);
        if (rand(0, 1) === 1) {
          const c = rand(2, 15);
          return {
            question: `A set of data has mean ${mean} and standard deviation ${sd}. Every value is increased by ${c}. Find the new mean and standard deviation.`,
            answer: `Mean ${mean + c}, standard deviation ${sd}`,
            working: 'Adding a constant shifts every value (and the mean) but does not change the spread',
          };
        }
        const k = rand(2, 5);
        return {
          question: `A set of data has mean ${mean} and standard deviation ${sd}. Every value is multiplied by ${k}. Find the new mean and standard deviation.`,
          answer: `Mean ${mean * k}, standard deviation ${sd * k}`,
          working: `Multiplying by ${k} multiplies the mean AND the spread by ${k}`,
        };
      },
    },
  },
  {
    id: 's1-11', difficulty: 'medium',
    question: 'Class A: mean 62, standard deviation 15. Class B: mean 68, standard deviation 6. Compare the two classes.',
    answer: 'Class B did better on average (higher mean). Class B was also more consistent (smaller standard deviation).',
    vary: {
      make: rand => {
        const [mA, mB] = shuffle(rand, range(40).map(v => v + 45)).slice(0, 2);
        const [sA, sB] = shuffle(rand, range(16).map(v => v + 3)).slice(0, 2);
        const better = mA > mB ? 'A' : 'B';
        const steadier = sA < sB ? 'A' : 'B';
        return {
          question: `Class A: mean ${mA}, standard deviation ${sA}. Class B: mean ${mB}, standard deviation ${sB}. Compare the two classes.`,
          answer: `Class ${better} did better on average (higher mean). Class ${steadier} was ${steadier === better ? 'also ' : ''}more consistent (smaller standard deviation).`,
          working: '',
        };
      },
    },
  },
  {
    id: 's1-12', difficulty: 'easy',
    question: 'When is the median a better average to use than the mean?',
    answer: 'When the data has extreme values (outliers), e.g. salaries or house prices. A few very large or small values pull the mean, but hardly change the median.',
  },
  {
    id: 's1-13', difficulty: 'medium',
    question: 'How do you find the median and interquartile range from a cumulative frequency curve with total frequency n?',
    answer: 'Read across from n/2 to the curve and down to get the median.\nRead from n/4 (lower quartile) and 3n/4 (upper quartile) in the same way.\nIQR = upper quartile − lower quartile.',
  },
  {
    id: 's1-14', difficulty: 'easy',
    question: 'Which five values are shown in a box-and-whisker plot?',
    answer: 'Minimum, lower quartile (Q1), median, upper quartile (Q3) and maximum.',
  },
]);

// ---------- O Level Mathematics 4052 — S2 Probability ----------

// A bag of coloured balls.
function bag(rand) {
  const red = rand(2, 8);
  const blue = rand(2, 8);
  const green = rand(1, 6);
  return { red, blue, green, total: red + blue + green };
}

function bagText({ red, blue, green }) {
  return `A bag has ${red} red, ${blue} blue and ${green} green balls.`;
}

// 0.18 → "0.18" (hundredths, no floating-point slips)
function hundredths(n) {
  return String(Number((n / 100).toFixed(2)));
}

const oMathS2 = deck('S2 Probability', [
  {
    id: 's2-01', difficulty: 'easy',
    question: 'A bag has 5 red, 3 blue and 2 green balls. One ball is taken at random. Find P(red).',
    answer: '1/2',
    working: '5 red out of 10 balls → 5/10 = 1/2',
    vary: {
      make: rand => {
        const b = bag(rand);
        const colour = pick(rand, ['red', 'blue', 'green']);
        return {
          question: `${bagText(b)} One ball is taken at random. Find P(${colour}).`,
          answer: fraction(b[colour], b.total),
          working: `${b[colour]} ${colour} out of ${b.total} balls → ${b[colour]}/${b.total}${fraction(b[colour], b.total) === `${b[colour]}/${b.total}` ? '' : ` = ${fraction(b[colour], b.total)}`}`,
        };
      },
    },
  },
  {
    id: 's2-02', difficulty: 'easy',
    question: 'The probability that it rains tomorrow is 0.35. Find the probability that it does not rain.',
    answer: '0.65',
    working: 'P(not A) = 1 − P(A) = 1 − 0.35 = 0.65',
    vary: {
      make: rand => {
        const p = rand(5, 95);
        return {
          question: `The probability that it rains tomorrow is ${hundredths(p)}. Find the probability that it does not rain.`,
          answer: hundredths(100 - p),
          working: `P(not A) = 1 − P(A) = 1 − ${hundredths(p)} = ${hundredths(100 - p)}`,
        };
      },
    },
  },
  {
    id: 's2-03', difficulty: 'medium',
    question: 'Two fair dice are rolled. Find the probability that the total is 8.',
    answer: '5/36',
    working: '(2,6), (3,5), (4,4), (5,3), (6,2) → 5 out of 36 outcomes',
    vary: {
      make: rand => {
        const target = rand(2, 12);
        const ways = [];
        for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) if (a + b === target) ways.push(`(${a},${b})`);
        return {
          question: `Two fair dice are rolled. Find the probability that the total is ${target}.`,
          answer: fraction(ways.length, 36),
          working: `${ways.join(', ')} → ${ways.length} out of 36 outcomes${fraction(ways.length, 36) === `${ways.length}/36` ? '' : ` = ${fraction(ways.length, 36)}`}`,
        };
      },
    },
  },
  {
    id: 's2-04', difficulty: 'medium',
    question: 'A bag has 4 red and 6 blue balls. A ball is taken, replaced, and a second ball is taken. Find P(both red).',
    answer: '4/25',
    working: '4/10 × 4/10 = 16/100 = 4/25 (with replacement, the second draw is the same)',
    vary: {
      make: rand => {
        const [r, b] = [rand(2, 9), rand(2, 9)];
        const n = r + b;
        return {
          question: `A bag has ${r} red and ${b} blue balls. A ball is taken, replaced, and a second ball is taken. Find P(both red).`,
          answer: fraction(r * r, n * n),
          working: `${r}/${n} × ${r}/${n} = ${r * r}/${n * n}${fraction(r * r, n * n) === `${r * r}/${n * n}` ? '' : ` = ${fraction(r * r, n * n)}`} (with replacement, the second draw is the same)`,
        };
      },
    },
  },
  {
    id: 's2-05', difficulty: 'hard',
    question: 'A bag has 4 red and 6 blue balls. Two balls are taken without replacement. Find P(both red).',
    answer: '2/15',
    working: '4/10 × 3/9 = 12/90 = 2/15 (one fewer red, and one fewer ball, for the second draw)',
    vary: {
      make: rand => {
        const [r, b] = [rand(2, 9), rand(2, 9)];
        const n = r + b;
        return {
          question: `A bag has ${r} red and ${b} blue balls. Two balls are taken without replacement. Find P(both red).`,
          answer: fraction(r * (r - 1), n * (n - 1)),
          working: `${r}/${n} × ${r - 1}/${n - 1} = ${r * (r - 1)}/${n * (n - 1)} = ${fraction(r * (r - 1), n * (n - 1))} (one fewer red, and one fewer ball, for the second draw)`,
        };
      },
    },
  },
  {
    id: 's2-06', difficulty: 'hard',
    question: 'A bag has 4 red and 6 blue balls. Two balls are taken without replacement. Find P(one of each colour).',
    answer: '8/15',
    working: 'P(RB) + P(BR) = 4/10 × 6/9 + 6/10 × 4/9 = 48/90 = 8/15',
    vary: {
      make: rand => {
        const [r, b] = [rand(2, 9), rand(2, 9)];
        const n = r + b;
        return {
          question: `A bag has ${r} red and ${b} blue balls. Two balls are taken without replacement. Find P(one of each colour).`,
          answer: fraction(2 * r * b, n * (n - 1)),
          working: `P(RB) + P(BR) = ${r}/${n} × ${b}/${n - 1} + ${b}/${n} × ${r}/${n - 1} = ${2 * r * b}/${n * (n - 1)} = ${fraction(2 * r * b, n * (n - 1))}`,
        };
      },
    },
  },
  {
    id: 's2-07', difficulty: 'hard',
    question: 'A fair die is rolled twice. Find the probability of getting at least one six.',
    answer: '11/36',
    working: 'P(at least one six) = 1 − P(no sixes) = 1 − (5/6)² = 1 − 25/36 = 11/36',
    vary: {
      make: rand => {
        const rolls = rand(2, 3);
        const none = 5 ** rolls;
        const all = 6 ** rolls;
        const word = rolls === 2 ? 'twice' : 'three times';
        return {
          question: `A fair die is rolled ${word}. Find the probability of getting at least one six.`,
          answer: fraction(all - none, all),
          working: `P(at least one six) = 1 − P(no sixes) = 1 − (5/6)${rolls === 2 ? '²' : '³'} = 1 − ${none}/${all} = ${fraction(all - none, all)}`,
        };
      },
    },
  },
  {
    id: 's2-08', difficulty: 'medium',
    question: 'A and B are independent events. P(A) = 0.3 and P(B) = 0.6. Find P(A and B) and P(neither A nor B).',
    answer: 'P(A and B) = 0.18, P(neither) = 0.28',
    working: 'Independent → multiply: 0.3 × 0.6 = 0.18; neither: 0.7 × 0.4 = 0.28',
    vary: {
      make: rand => {
        const [a, b] = [rand(1, 9), rand(1, 9)]; // in tenths
        return {
          question: `A and B are independent events. P(A) = ${a / 10} and P(B) = ${b / 10}. Find P(A and B) and P(neither A nor B).`,
          answer: `P(A and B) = ${hundredths(a * b)}, P(neither) = ${hundredths((10 - a) * (10 - b))}`,
          working: `Independent → multiply: ${a / 10} × ${b / 10} = ${hundredths(a * b)}; neither: ${(10 - a) / 10} × ${(10 - b) / 10} = ${hundredths((10 - a) * (10 - b))}`,
        };
      },
    },
  },
  {
    id: 's2-09', difficulty: 'easy',
    question: 'A and B are mutually exclusive. P(A) = 0.25 and P(B) = 0.4. Find P(A or B).',
    answer: '0.65',
    working: 'Mutually exclusive → add: 0.25 + 0.4 = 0.65',
    vary: {
      make: rand => {
        const a = rand(5, 60);
        const b = rand(5, 95 - a);
        return {
          question: `A and B are mutually exclusive. P(A) = ${hundredths(a)} and P(B) = ${hundredths(b)}. Find P(A or B).`,
          answer: hundredths(a + b),
          working: `Mutually exclusive → add: ${hundredths(a)} + ${hundredths(b)} = ${hundredths(a + b)}`,
        };
      },
    },
  },
  {
    id: 's2-10', difficulty: 'easy',
    question: 'The probability that a light bulb is faulty is 3/50. How many faulty bulbs would you expect in a box of 400?',
    answer: '24',
    working: 'Expected number = probability × number of trials = 3/50 × 400 = 24',
    vary: {
      make: rand => {
        const den = pick(rand, [20, 25, 40, 50, 100]);
        const top = rand(1, 9);
        const n = den * rand(2, 12);
        return {
          question: `The probability that a light bulb is faulty is ${fraction(top, den)}. How many faulty bulbs would you expect in a box of ${withCommas(n)}?`,
          answer: String((top * n) / den),
          working: `Expected number = probability × number of trials = ${fraction(top, den)} × ${withCommas(n)} = ${(top * n) / den}`,
        };
      },
    },
  },
  {
    id: 's2-11', difficulty: 'medium',
    question: 'Cards numbered 1 to 20 are shuffled and one is picked. Find the probability that it is a prime number.',
    answer: '2/5',
    working: 'Primes: 2, 3, 5, 7, 11, 13, 17, 19 → 8 out of 20 = 2/5',
    vary: {
      make: rand => {
        const n = pick(rand, [10, 12, 15, 20, 25, 30]);
        const [label, test] = pick(rand, [
          ['a prime number', isPrime],
          ['a multiple of 3', v => v % 3 === 0],
          ['a multiple of 4', v => v % 4 === 0],
          ['a square number', v => Number.isInteger(Math.sqrt(v))],
          ['an even number', v => v % 2 === 0],
        ]);
        const hits = range(n).filter(test);
        return {
          question: `Cards numbered 1 to ${n} are shuffled and one is picked. Find the probability that it is ${label}.`,
          answer: fraction(hits.length, n),
          working: `${hits.join(', ')} → ${hits.length} out of ${n}${fraction(hits.length, n) === `${hits.length}/${n}` ? '' : ` = ${fraction(hits.length, n)}`}`,
        };
      },
    },
  },
  {
    id: 's2-12', difficulty: 'medium',
    question: 'A card is drawn from a standard pack of 52. Find P(king or heart).',
    answer: '4/13',
    working: '13 hearts + 3 other kings = 16 cards (the king of hearts is counted once) → 16/52 = 4/13',
    vary: {
      make: rand => {
        const [event, count, why] = pick(rand, [
          ['king or heart', 16, '13 hearts + 3 other kings (the king of hearts is counted once)'],
          ['red card', 26, 'hearts and diamonds: 13 + 13'],
          ['picture card (J, Q or K)', 12, '3 picture cards in each of 4 suits'],
          ['red king', 2, 'king of hearts and king of diamonds'],
          ['ace or spade', 16, '13 spades + 3 other aces (the ace of spades is counted once)'],
          ['card that is not a heart', 39, '52 − 13 hearts'],
          ['number card from 2 to 10', 36, '9 number cards in each of 4 suits'],
        ]);
        return {
          question: `A card is drawn from a standard pack of 52. Find P(${event}).`,
          answer: fraction(count, 52),
          working: `${why} = ${count} cards → ${count}/52 = ${fraction(count, 52)}`,
        };
      },
    },
  },
  {
    id: 's2-13', difficulty: 'medium',
    question: 'A coin is flipped 200 times and lands on heads 112 times. Estimate the probability of heads.',
    answer: '0.56',
    working: 'Relative frequency = 112 ÷ 200 = 0.56',
    vary: {
      make: rand => {
        const n = pick(rand, [50, 100, 200, 250, 400, 500]);
        const heads = rand(Math.round(n * 0.35), Math.round(n * 0.65));
        const rf = Number((heads / n).toFixed(4));
        return {
          question: `A coin is flipped ${n} times and lands on heads ${heads} times. Estimate the probability of heads.`,
          answer: String(rf),
          working: `Relative frequency = ${heads} ÷ ${n} = ${rf}`,
        };
      },
    },
  },
  {
    id: 's2-14', difficulty: 'easy',
    question: 'What is the difference between mutually exclusive events and independent events?',
    answer: 'Mutually exclusive: they cannot both happen → P(A or B) = P(A) + P(B).\nIndependent: one happening does not change the chance of the other → P(A and B) = P(A) × P(B).',
  },
]);

// ---------- All decks (the keys are used by data/syllabus.js) ----------
export const decks = {
  'ib-cs-a1-1': a1_1,
  'ib-cs-a1-2': a1_2,
  'ib-cs-a1-3': a1_3,
  'ib-cs-a1-4': a1_4,
  'o-math-n1': oMathN1,
  'o-math-n2': oMathN2,
  'o-math-n3': oMathN3,
  'o-math-n4': oMathN4,
  'o-math-n5': oMathN5,
  'o-math-n6': oMathN6,
  'o-math-n7': oMathN7,
  'o-math-n8': oMathN8,
  'o-math-n9': oMathN9,
  'o-math-g1': oMathG1,
  'o-math-g2': oMathG2,
  'o-math-g3': oMathG3,
  'o-math-g4': oMathG4,
  'o-math-g5': oMathG5,
  'o-math-g6': oMathG6,
  'o-math-g7': oMathG7,
  'o-math-s1': oMathS1,
  'o-math-s2': oMathS2,
};