// IB Computer Science HL — A1 Computer fundamentals
// Lives at: src/features/flashcards/data/decks/ib-cs-a1.js
//
// Card fields: id, question, answer, difficulty ('easy' | 'medium' | 'hard')
// Optional:
//   working    – shown under the answer, explains how to get there
//   vary       – NUMBER cards: make(rand) returns { question, answer, working } with new numbers.
//                Answers are calculated by code, so they are always right.
//   alternates – CONCEPT cards: 2–3 pre-written questions on the same idea, asked a different way
//                (reverse, scenario, fill-the-gap, true/false). Used by "Focus on wrong".

import { deck, pick, withCommas } from './helpers.js';

// ---------- Helpers only this deck needs ----------

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

// Two-input Boolean expressions for the truth-table recipe.
const TWO_INPUT_EXPRESSIONS = [
  { text: 'A AND (NOT B)', fn: (a, b) => a & (1 - b) },
  { text: '(NOT A) AND B', fn: (a, b) => (1 - a) & b },
  { text: 'A OR (NOT B)', fn: (a, b) => a | (1 - b) },
  { text: 'NOT (A AND B)', fn: (a, b) => 1 - (a & b) },
  { text: 'NOT (A OR B)', fn: (a, b) => 1 - (a | b) },
  { text: 'A XOR B', fn: (a, b) => a ^ b },
  { text: 'NOT (A XOR B)', fn: (a, b) => 1 - (a ^ b) },
  { text: '(NOT A) OR (NOT B)', fn: (a, b) => (1 - a) | (1 - b) },
];

function truthTable(expression) {
  const rows = [[0, 0], [0, 1], [1, 0], [1, 1]].map(([a, b]) => `${a} ${b} | ${expression.fn(a, b)}`);
  return `A B | X\n${rows.join('\n')}`;
}

// ---------- A1.1 Computer hardware and operation ----------

const a1_1 = deck('A1.1 Computer hardware and operation', [
  {
    id: 'a11-01', difficulty: 'easy',
    question: 'What does the ALU (arithmetic logic unit) do?',
    answer: 'It carries out arithmetic operations (such as add and subtract) and logical operations (such as AND, OR, NOT and comparisons) on data.',
    alternates: [
      { question: 'Which CPU component carries out arithmetic and logical operations?', answer: 'The ALU (arithmetic logic unit).' },
      { question: 'A program checks whether x > y. Which part of the CPU performs this comparison?', answer: 'The ALU — comparisons are logical operations.' },
      { question: 'Fill the gap: the ___ performs calculations such as addition and logical operations such as AND and OR.', answer: 'ALU (arithmetic logic unit).' },
    ],
  },
  {
    id: 'a11-02', difficulty: 'medium',
    question: 'What is the role of the control unit (CU)?',
    answer: 'It decodes instructions and sends control signals that coordinate the ALU, registers, memory and input/output, so each instruction is carried out in the right order.',
    alternates: [
      { question: 'Which CPU component decodes instructions and sends control signals to the other components?', answer: 'The control unit (CU).' },
      { question: 'True or false: the control unit performs the calculations in the CPU. Explain.', answer: 'False. The ALU performs calculations; the control unit decodes instructions and coordinates the other components with control signals.' },
      { question: 'Fill the gap: the ___ directs the flow of data between the CPU, memory and input/output devices.', answer: 'Control unit (CU).' },
    ],
  },
  {
    id: 'a11-03', difficulty: 'easy',
    question: 'What does the program counter (PC) hold?',
    answer: 'The memory address of the next instruction to be fetched.',
    alternates: [
      { question: 'Which register holds the memory address of the next instruction to be fetched?', answer: 'The program counter (PC).' },
      { question: 'During the fetch stage, what happens to the program counter after its value is copied to the MAR?', answer: 'It is incremented so it points to the next instruction.' },
      { question: 'True or false: the program counter holds the instruction currently being executed. Explain.', answer: 'False. It holds the memory ADDRESS of the NEXT instruction to fetch; the current instruction is held in the instruction register.' },
    ],
  },
  {
    id: 'a11-04', difficulty: 'medium',
    question: 'What is the difference between the MAR and the MDR?',
    answer: 'MAR (memory address register) holds the ADDRESS of the memory location being read or written.\nMDR (memory data register) holds the DATA or instruction just read from, or about to be written to, that address.',
    alternates: [
      { question: 'Which register holds the address of the memory location the CPU is about to read from or write to?', answer: 'The MAR (memory address register).' },
      { question: 'An instruction has just been read from memory. Which register is it placed in first?', answer: 'The MDR (memory data register).' },
      { question: 'Fill the gap: the address in the PC is copied to the ___, and the instruction fetched from that address arrives in the ___.', answer: 'MAR (memory address register); MDR (memory data register).' },
    ],
  },
  {
    id: 'a11-05', difficulty: 'medium',
    question: 'Why does a CPU use cache memory?',
    answer: 'Cache is small, very fast memory on or near the CPU that keeps frequently used instructions and data, so the CPU waits less for slower RAM.',
    alternates: [
      { question: 'What is the name of the small, very fast memory close to the CPU that stores frequently used data and instructions?', answer: 'Cache memory.' },
      { question: 'True or false: cache is larger but slower than RAM. Explain.', answer: 'False. Cache is much smaller than RAM but much faster, which is why it holds only the most frequently used data and instructions.' },
      { question: 'A program uses the same small set of data over and over. Why does cache make it run faster?', answer: 'The repeatedly used data stays in the fast cache close to the CPU, so the CPU does not have to wait for slower RAM each time.' },
    ],
  },
  {
    id: 'a11-06', difficulty: 'easy',
    question: 'Compare RAM and ROM.',
    answer: 'RAM: volatile, read/write, holds the programs and data currently in use.\nROM: non-volatile, normally read-only, holds firmware such as the start-up (boot) instructions.',
    alternates: [
      { question: 'Which type of primary memory keeps its contents when the power is turned off, and is used to store the boot instructions?', answer: 'ROM (read-only memory) — it is non-volatile.' },
      { question: 'What does "volatile" mean when describing RAM?', answer: 'Its contents are lost when the power is switched off.' },
      { question: 'While you edit a document, is it held in RAM or ROM? Why?', answer: 'RAM — it holds the programs and data currently in use and can be written to; ROM is read-only.' },
    ],
  },
  {
    id: 'a11-07', difficulty: 'medium',
    question: 'Why is a GPU well suited to graphics and machine learning?',
    answer: 'It has thousands of simpler cores that perform the same operation on many pieces of data at once (massive parallelism), which suits the matrix and vector maths used in graphics and machine learning.',
    alternates: [
      { question: 'Which processor, with thousands of simple cores, is designed to perform the same operation on many pieces of data in parallel?', answer: 'The GPU (graphics processing unit).' },
      { question: 'Give two tasks, other than drawing graphics, that are well suited to a GPU.', answer: 'Any two tasks with massive parallel calculations, e.g. training machine learning models, scientific simulations, video encoding, cryptocurrency mining.' },
      { question: 'True or false: a GPU is designed to run the same operation on many pieces of data at the same time. Explain.', answer: 'True. It has many cores working in parallel, which suits the maths used in graphics and machine learning.' },
    ],
  },
  {
    id: 'a11-08', difficulty: 'hard',
    question: 'HL: Compare the design of a CPU with a GPU.',
    answer: 'CPU: a few powerful cores, large caches and complex control logic — optimised for low-latency, general-purpose, sequential tasks with lots of branching.\nGPU: many simple cores — optimised for high throughput on tasks that can be split into many identical parallel operations.',
    alternates: [
      { question: 'HL: Why would running an operating system\'s many different, branching tasks be better on a CPU than on a GPU?', answer: 'CPU cores are powerful, with large caches and complex control logic for branching and low-latency sequential work; GPU cores are simple and only efficient when many identical operations run in parallel.' },
      { question: 'HL: Which processor is designed for high throughput, and which for low latency?', answer: 'GPU: high throughput (many parallel operations). CPU: low latency (finishing individual tasks quickly).' },
      { question: 'HL: Fill the gap: a CPU has a ___ number of powerful cores; a GPU has a ___ number of simpler cores.', answer: 'Small (a few); large (thousands).' },
    ],
  },
  {
    id: 'a11-09', difficulty: 'hard',
    question: 'Describe the fetch–decode–execute cycle.',
    answer: 'Fetch: the address in the PC is copied to the MAR, the instruction at that address is loaded into the MDR and then the instruction register, and the PC is incremented.\nDecode: the control unit interprets the instruction.\nExecute: the instruction is carried out (for example the ALU calculates or data is moved) and the result is stored.',
    alternates: [
      { question: 'In which stage of the fetch–decode–execute cycle does the control unit interpret the instruction?', answer: 'The decode stage.' },
      { question: 'Put these in order: (a) PC incremented, (b) address copied from PC to MAR, (c) instruction copied from MDR to the instruction register.', answer: 'b → c → a (the PC can also be incremented as soon as its value has been copied to the MAR).' },
      { question: 'In which stage of the fetch–decode–execute cycle would the ALU add two numbers?', answer: 'The execute stage.' },
    ],
  },
  {
    id: 'a11-10', difficulty: 'hard',
    question: 'HL: What is pipelining and how does it help in multi-core processors?',
    answer: 'Pipelining overlaps the stages of different instructions: while one instruction executes, the next is decoded and another is fetched. Each core can run its own pipeline, so more instructions finish per unit of time (higher throughput).',
    alternates: [
      { question: 'HL: What technique lets a CPU fetch one instruction while decoding a second and executing a third?', answer: 'Pipelining.' },
      { question: 'HL: Does pipelining make a single instruction finish faster? Explain.', answer: 'No. Each instruction still passes through every stage; pipelining raises throughput because several instructions are in different stages at the same time.' },
      { question: 'HL: Fill the gap: pipelining increases ___ — the number of instructions completed per unit of time.', answer: 'Throughput.' },
    ],
  },
  {
    id: 'a11-11', difficulty: 'medium',
    question: 'Compare an SSD with an HDD as secondary storage.',
    answer: 'SSD: flash memory, no moving parts — faster access, more durable, uses less power, but costs more per GB.\nHDD: magnetic spinning platters — slower and more fragile, but cheaper per GB with large capacities.',
    alternates: [
      { question: 'A school needs to archive 50 TB of old video as cheaply as possible. SSD or HDD? Why?', answer: 'HDD — it is much cheaper per GB for large capacities, and fast access is not needed for an archive.' },
      { question: 'Why is an SSD better than an HDD for a laptop that is carried around?', answer: 'It has no moving parts, so it is more resistant to knocks, and it is faster and uses less power (better battery life).' },
      { question: 'Which type of secondary storage uses spinning magnetic platters and a moving read/write head?', answer: 'A hard disk drive (HDD).' },
    ],
  },
  {
    id: 'a11-12', difficulty: 'medium',
    question: 'What is the difference between lossless and lossy compression?',
    answer: 'Lossless: the original data can be rebuilt exactly (e.g. run-length encoding, ZIP, PNG) — needed for text and program files.\nLossy: some less important data is permanently removed to make files much smaller (e.g. JPEG, MP3) — used for images, audio and video.',
    alternates: [
      { question: 'Why must a program file be compressed with lossless, not lossy, compression?', answer: 'Every bit must be restored exactly; losing any data would corrupt the program.' },
      { question: 'Which type of compression is JPEG, and why is it acceptable for photos?', answer: 'Lossy — the removed detail is hard for people to notice, and the file becomes much smaller.' },
      { question: 'Name the lossless method that stores "AAAAABBB" as "5A3B".', answer: 'Run-length encoding (RLE).' },
    ],
  },
  {
    id: 'a11-13', difficulty: 'medium',
    question: 'Explain IaaS, PaaS and SaaS in cloud computing.',
    answer: 'IaaS: rent virtual machines, storage and networks and manage everything above them (e.g. AWS EC2).\nPaaS: a ready platform to build and deploy apps without managing servers (e.g. Google App Engine).\nSaaS: complete software used over the internet (e.g. Google Docs).',
    alternates: [
      { question: 'A student writes essays in Google Docs. Which cloud service model is this?', answer: 'SaaS (software as a service).' },
      { question: 'A start-up rents virtual machines and installs its own operating system and software on them. Which cloud service model is this?', answer: 'IaaS (infrastructure as a service).' },
      { question: 'Developers upload their code to a platform that handles the servers, scaling and runtime for them. Which model is this?', answer: 'PaaS (platform as a service).' },
    ],
  },
]);

// ---------- A1.2 Data representation and computer logic ----------

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
    alternates: [
      { question: 'How many bits does one hexadecimal digit represent?', answer: '4 bits (one nibble).' },
      { question: 'Give two places where hexadecimal is commonly used.', answer: 'Any two: HTML/CSS colour codes, memory addresses, MAC addresses, error codes.' },
      { question: 'The hex colour value FF is written in binary as 1111 1111. Why do programmers prefer to write FF?', answer: 'It is 2 characters instead of 8, so it is shorter, easier to read and less error-prone — and each hex digit maps to exactly 4 bits.' },
    ],
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
    alternates: [
      { question: 'Why was Unicode needed when ASCII already existed?', answer: 'ASCII has only 128 (or 256 extended) codes — enough for English but not for other world scripts, symbols and emoji. Unicode covers them all.' },
      { question: 'What is a character set?', answer: 'A defined list of characters, each matched to a unique binary code, e.g. ASCII or Unicode.' },
      { question: 'True or false: the letter "A" has the same code in ASCII and in Unicode. Explain.', answer: 'True. Unicode\'s first 128 code points match ASCII, so "A" is 65 in both.' },
    ],
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
    alternates: [
      { question: 'Which logic gate outputs 1 only when both inputs are 1?', answer: 'AND.' },
      { question: 'Which logic gate outputs 0 only when both inputs are 1?', answer: 'NAND.' },
      { question: 'Which logic gate outputs 1 only when both inputs are 0?', answer: 'NOR.' },
    ],
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
    vary: {
      make: rand => {
        const expression = pick(rand, TWO_INPUT_EXPRESSIONS);
        return {
          question: `Complete the truth table for X = ${expression.text}.`,
          answer: truthTable(expression),
          working: 'Work out X for each of the four input combinations in turn.',
        };
      },
    },
  },
  {
    id: 'a12-13', difficulty: 'medium',
    question: 'Inputs A and B go into an OR gate, and its output goes into a NOT gate. Write the Boolean expression. Which single gate is this?',
    answer: 'X = NOT (A OR B) — this is a NOR gate.',
    alternates: [
      { question: 'Inputs A and B go into an AND gate, and its output goes into a NOT gate. Write the Boolean expression. Which single gate is this?', answer: 'X = NOT (A AND B) — this is a NAND gate.' },
      { question: 'Input A goes through a NOT gate, then into an AND gate with B. Write the Boolean expression.', answer: 'X = (NOT A) AND B.' },
      { question: 'Inputs A and B go into an XOR gate, and its output goes into a NOT gate. Write the Boolean expression. Which single gate is this?', answer: 'X = NOT (A XOR B) — this is an XNOR gate.' },
    ],
  },
  {
    id: 'a12-14', difficulty: 'medium',
    question: 'Why are NAND and NOR called universal gates?',
    answer: 'Any other logic gate, and so any logic circuit, can be built using only NAND gates (or only NOR gates).',
    alternates: [
      { question: 'How can a NOT gate be made from a single NAND gate?', answer: 'Connect the same input to both inputs of the NAND gate: NOT (A AND A) = NOT A.' },
      { question: 'True or false: every logic circuit can be built from AND gates only. Explain.', answer: 'False. AND gates alone cannot make NOT. Only the universal gates (NAND or NOR) can build every other gate on their own.' },
      { question: 'Which two logic gates are called universal gates?', answer: 'NAND and NOR.' },
    ],
  },
]);

// ---------- A1.3 Operating systems and control systems ----------

const a1_3 = deck('A1.3 Operating systems and control systems', [
  {
    id: 'a13-01', difficulty: 'easy',
    question: 'What is the role of an operating system?',
    answer: 'It manages the hardware and software resources, provides a user interface, and acts as the go-between so applications can use the hardware without controlling it directly.',
    alternates: [
      { question: 'Why can an application save a file without knowing how the particular disk drive works?', answer: 'The operating system sits between applications and the hardware and handles the device details for them.' },
      { question: 'Which system software manages a computer\'s hardware and software resources and provides a user interface?', answer: 'The operating system.' },
      { question: 'True or false: an application such as a web browser controls the hardware directly, without the operating system. Explain.', answer: 'False. Applications request hardware access through the operating system, which manages the hardware for them.' },
    ],
  },
  {
    id: 'a13-02', difficulty: 'easy',
    question: 'Name four functions of an operating system.',
    answer: 'Any four: process (CPU) management/scheduling, memory management, file management, device (I/O) management using drivers, security and user accounts, providing a user interface.',
    alternates: [
      { question: 'Which OS function decides which process uses the CPU next?', answer: 'Process management (scheduling).' },
      { question: 'Which OS function uses device drivers to communicate with printers and keyboards?', answer: 'Device (input/output) management.' },
      { question: 'Which OS function keeps track of which parts of RAM each program is using?', answer: 'Memory management.' },
    ],
  },
  {
    id: 'a13-03', difficulty: 'medium',
    question: 'Describe first-come, first-served (FCFS) scheduling and one drawback.',
    answer: 'Processes run in the order they arrive, each until it finishes. It is simple, and processes are served in arrival order, but a long process makes all the short ones behind it wait (the convoy effect).',
    alternates: [
      { question: 'Which scheduling algorithm can suffer from the convoy effect, and what is it?', answer: 'FCFS. One long process at the front makes all the shorter processes behind it wait.' },
      { question: 'True or false: FCFS is a pre-emptive scheduling algorithm. Explain.', answer: 'False. Under FCFS each process runs until it finishes; it is never interrupted to let another run.' },
      { question: 'Which scheduling algorithm runs processes strictly in the order they arrive, each until it finishes?', answer: 'First-come, first-served (FCFS).' },
    ],
  },
  {
    id: 'a13-04', difficulty: 'medium',
    question: 'Describe round robin scheduling.',
    answer: 'Each process gets a fixed time slice (quantum) in turn, then goes to the back of the queue. It is fair and responsive, but frequent context switches add overhead, and the quantum size matters.',
    alternates: [
      { question: 'In round robin scheduling, what happens when a process uses up its time slice before finishing?', answer: 'It is pre-empted and moved to the back of the ready queue; the next process gets the CPU.' },
      { question: 'What is the drawback of making the round robin time quantum very small?', answer: 'Context switches happen very often, so much of the CPU time is wasted on switching overhead.' },
      { question: 'Which scheduling algorithm gives each process a fixed time slice in turn?', answer: 'Round robin.' },
    ],
  },
  {
    id: 'a13-05', difficulty: 'hard',
    question: 'Give one advantage and one disadvantage of shortest job first (SJF) scheduling.',
    answer: 'Advantage: it gives the lowest average waiting time.\nDisadvantage: the OS must know or estimate each job\'s run time, and long jobs can starve (wait indefinitely).',
    alternates: [
      { question: 'Which scheduling algorithm gives the lowest average waiting time, but can starve long jobs?', answer: 'Shortest job first (SJF).' },
      { question: 'Why is SJF hard to use in practice?', answer: 'The OS must know or accurately estimate how long each job will take before it runs.' },
      { question: 'Jobs needing 8 ms, 2 ms and 5 ms are all waiting. In what order does SJF run them?', answer: '2 ms, then 5 ms, then 8 ms — shortest first.' },
    ],
  },
  {
    id: 'a13-06', difficulty: 'medium',
    question: 'What is the main risk of priority scheduling, and how is it reduced?',
    answer: 'Low-priority processes may starve. Ageing reduces this by gradually raising the priority of processes that have waited a long time.',
    alternates: [
      { question: 'What is "ageing" in process scheduling?', answer: 'Gradually raising the priority of a process the longer it waits, so it eventually gets the CPU and does not starve.' },
      { question: 'What does it mean for a process to "starve"?', answer: 'It waits indefinitely because other (higher-priority or shorter) processes keep being chosen first.' },
      { question: 'In priority scheduling, which waiting process runs next?', answer: 'The one with the highest priority.' },
    ],
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
    alternates: [
      { question: 'What does the CPU do when it receives an interrupt?', answer: 'It finishes the current instruction, saves its current state, runs the interrupt service routine (ISR), then restores its state and resumes.' },
      { question: 'Why does polling waste CPU time when a device rarely needs attention?', answer: 'The CPU keeps checking the device even though, most of the time, nothing has happened.' },
      { question: 'Fill the gap: an ___ is a signal from a device that makes the CPU pause its current task and respond.', answer: 'Interrupt.' },
    ],
  },
  {
    id: 'a13-09', difficulty: 'hard',
    question: 'When can polling be the better choice than interrupts?',
    answer: 'When events happen very often or at regular, predictable times, or in simple embedded systems where fixed timing matters — e.g. reading a sensor at a fixed interval.',
    alternates: [
      { question: 'A thermostat reads its temperature sensor every 2 seconds. Is polling or interrupts more suitable? Why?', answer: 'Polling — the readings happen at a regular, predictable interval, so checking on a fixed schedule is simple and wastes little time.' },
      { question: 'A keyboard key is pressed only occasionally. Is polling or interrupts more suitable? Why?', answer: 'Interrupts — events are rare and unpredictable, so the CPU should not waste time repeatedly checking.' },
      { question: 'A printer occasionally runs out of paper. Should the CPU poll it or use an interrupt? Why?', answer: 'An interrupt — the event is rare and unpredictable, so constant polling would waste CPU time.' },
    ],
  },
  {
    id: 'a13-10', difficulty: 'hard',
    question: 'HL: How does the operating system manage multitasking?',
    answer: 'The scheduler switches the CPU rapidly between processes. On each context switch it saves one process\'s state (registers, PC) and restores another\'s, giving the illusion that programs run at the same time. It also allocates memory and I/O to each process and prevents conflicts between them.',
    alternates: [
      { question: 'HL: What is a context switch?', answer: 'Saving the state (registers, program counter) of the running process and loading the saved state of the next one, so the CPU can switch between them.' },
      { question: 'HL: On a single-core CPU, how can several programs appear to run at the same time?', answer: 'The OS switches the CPU between them so quickly (time slicing with context switches) that they appear to run simultaneously.' },
      { question: 'HL: What does the OS save during a context switch so that a process can later continue where it stopped?', answer: 'The process\'s state — the contents of the CPU registers, including the program counter.' },
    ],
  },
  {
    id: 'a13-11', difficulty: 'medium',
    question: 'HL: Name the main components of a control system and what each does.',
    answer: 'Sensor: measures the environment (input).\nController/processor: compares the reading with the set point and decides what to do.\nActuator: carries out the physical action (motor, heater, valve).\nFeedback: the result is measured again, closing the loop.',
    alternates: [
      { question: 'HL: In a control system, which component carries out the physical action, such as turning a motor or opening a valve?', answer: 'The actuator.' },
      { question: 'HL: In a greenhouse watering system, name the sensor, the controller and the actuator.', answer: 'Sensor: soil moisture sensor. Controller: microcontroller comparing moisture with the set point. Actuator: water pump or valve.' },
      { question: 'HL: In a control system, which component measures a physical quantity such as temperature or light level?', answer: 'The sensor.' },
    ],
  },
  {
    id: 'a13-12', difficulty: 'medium',
    question: 'HL: What is the difference between an open-loop and a closed-loop control system?',
    answer: 'Closed loop: uses feedback from sensors to adjust its output (e.g. a thermostat).\nOpen loop: no feedback — it runs a fixed action regardless of the result (e.g. a toaster on a timer).',
    alternates: [
      { question: 'HL: A washing machine runs a fixed 40-minute cycle whatever the state of the clothes. Open or closed loop? Why?', answer: 'Open loop — it does not measure the result or use feedback to adjust what it does.' },
      { question: 'HL: Cruise control keeps a car at a set speed, even up hills. Open or closed loop? Why?', answer: 'Closed loop — it measures the actual speed and uses that feedback to adjust the engine power.' },
      { question: 'HL: What is the key feature that makes a control system "closed loop"?', answer: 'Feedback — the result is measured by sensors and used to adjust what the system does.' },
    ],
  },
  {
    id: 'a13-13', difficulty: 'hard',
    question: 'HL: Describe how an automatic central heating system works as a control system.',
    answer: 'A temperature sensor measures the room. The controller compares it with the set point: below it, the heater (actuator) is switched on; at or above it, it is switched off. The sensor keeps measuring, so feedback keeps the temperature near the target.',
    alternates: [
      { question: 'HL: In an automatic heating system, what is the "set point"?', answer: 'The target temperature that the controller compares the sensor reading with.' },
      { question: 'HL: Describe how an automatic street light uses a control system.', answer: 'A light sensor measures brightness. The controller compares it with a threshold: below it (dark), the lamp (actuator) is switched on; above it, it is switched off. The sensor keeps measuring, so it responds as light levels change.' },
      { question: 'HL: In an automatic heating system, which component is the actuator?', answer: 'The heater (or the boiler or valve that the controller switches).' },
    ],
  },
]);

// ---------- A1.4 Translation (HL only) ----------

const a1_4 = deck('A1.4 Translation (HL)', [
  {
    id: 'a14-01', difficulty: 'easy',
    question: 'What does a compiler do?',
    answer: 'It translates the whole source program into machine code (an executable) before the program is run.',
    alternates: [
      { question: 'Which translator converts the entire source program into an executable file before it runs?', answer: 'A compiler.' },
      { question: 'True or false: a compiler is needed every time a compiled program is run. Explain.', answer: 'False. The compiler translates the program once; the executable it produces can then be run many times without the compiler.' },
      { question: 'Fill the gap: a compiler translates the whole source program into an ___ file of machine code.', answer: 'Executable.' },
    ],
  },
  {
    id: 'a14-02', difficulty: 'easy',
    question: 'What does an interpreter do?',
    answer: 'It translates and runs the source code one statement at a time, every time the program is run, without producing a separate executable.',
    alternates: [
      { question: 'Which translator reads, translates and runs source code one statement at a time?', answer: 'An interpreter.' },
      { question: 'Does an interpreter produce an executable file? Explain.', answer: 'No. It translates and runs the code each time, so the source code and interpreter are needed every time the program runs.' },
      { question: 'True or false: an interpreted program must be translated again every time it is run. Explain.', answer: 'True. The interpreter translates and runs the source code each time; no translated executable is kept.' },
    ],
  },
  {
    id: 'a14-03', difficulty: 'medium',
    question: 'How do compilers and interpreters differ in how they report errors?',
    answer: 'A compiler analyses the whole program and reports all the errors it finds before anything runs. An interpreter typically reports an error only when it reaches the faulty statement, and stops there, so later errors are not found until that one is fixed.',
    alternates: [
      { question: 'A program has errors on lines 3 and 40. With an interpreter, which error does the programmer see first, and when?', answer: 'Line 3 — the interpreter stops there while the program is running; the error on line 40 is not found until line 3 is fixed and execution reaches line 40.' },
      { question: 'Which translator reports a list of all the errors it finds before the program can run?', answer: 'A compiler.' },
      { question: 'True or false: a compiled program can start running while it still contains syntax errors. Explain.', answer: 'False. The compiler reports the errors and does not produce an executable until they are fixed.' },
    ],
  },
  {
    id: 'a14-04', difficulty: 'medium',
    question: 'Which usually runs faster: compiled or interpreted code? Why?',
    answer: 'Compiled code — it is already machine code, so there is no translation work while it runs, and the compiler can optimise it.',
    alternates: [
      { question: 'Why does interpreted code usually run more slowly than compiled code?', answer: 'Each statement has to be translated while the program runs, every time it runs, adding overhead.' },
      { question: 'A compiled and an interpreted version of the same program do the same job. Which usually finishes first, and why?', answer: 'The compiled version — it runs ready-made machine code, while the interpreter must translate each statement as the program runs.' },
      { question: 'Fill the gap: compiled code usually runs ___ than interpreted code because it is already ___.', answer: 'Faster; machine code.' },
    ],
  },
  {
    id: 'a14-05', difficulty: 'medium',
    question: 'Compare compiled and interpreted programs for portability.',
    answer: 'Interpreted source code runs on any machine that has the interpreter. A compiled executable only runs on the CPU/OS it was compiled for, so it must be recompiled for each platform.',
    alternates: [
      { question: 'A program compiled for Windows on an x86 processor is copied to a Mac with an ARM processor. Will it run? Why?', answer: 'Not directly — the executable contains machine code for a different processor and operating system, so it must be recompiled for the Mac.' },
      { question: 'What does a computer need in order to run an interpreted program?', answer: 'The source code and an interpreter for that language installed on the machine.' },
      { question: 'Why is interpreted source code often called more portable than a compiled executable?', answer: 'The same source code runs on any platform that has the interpreter, while an executable only runs on the processor and OS it was compiled for.' },
    ],
  },
  {
    id: 'a14-06', difficulty: 'medium',
    question: 'Why are interpreters useful during rapid development?',
    answer: 'There is no separate compile step, so code can be run and tested immediately, and errors are found line by line, which makes debugging quicker.',
    alternates: [
      { question: 'A student is testing small changes to a program every few seconds. Why would an interpreter suit this?', answer: 'Each change can be run immediately with no compile step, and the interpreter stops at the exact line where an error occurs.' },
      { question: 'Give one benefit of an interpreter when debugging.', answer: 'It stops at the line where an error happens, so the problem is easy to locate, and the code can be changed and re-run immediately.' },
      { question: 'True or false: interpreters suit development because code can be tested without a separate compile step. Explain.', answer: 'True. Changes can be run immediately, and the interpreter stops at the line where an error occurs.' },
    ],
  },
  {
    id: 'a14-07', difficulty: 'hard',
    question: 'A studio is building a performance-critical game engine. Should it use a compiler or an interpreter? Justify.',
    answer: 'A compiler: the engine needs maximum execution speed, and compiled, optimised machine code runs fastest with no translation overhead during play. Distributing an executable also keeps the source code private.',
    alternates: [
      { question: 'A teacher wants students to experiment with short code examples in class. Compiler or interpreter? Justify.', answer: 'An interpreter — code runs immediately without a compile step, and errors are reported at the line where they happen, which suits quick experimenting.' },
      { question: 'Software for a car\'s braking system must respond in microseconds. Compiler or interpreter? Justify.', answer: 'A compiler — compiled, optimised machine code runs fastest and most predictably, with no translation overhead while the system runs.' },
      { question: 'An app must run on Windows, macOS and Linux from one copy of the code. Compiler or interpreter? Justify.', answer: 'An interpreter (or a bytecode virtual machine) — the same code runs on any platform that has the interpreter, instead of being recompiled for each platform.' },
    ],
  },
  {
    id: 'a14-08', difficulty: 'hard',
    question: 'What is just-in-time (JIT) compilation?',
    answer: 'A hybrid approach: code (often bytecode) is compiled into machine code while the program runs, just before it is needed, and frequently used parts are kept, giving near-compiled speed with interpreter-like portability (e.g. Java JVM, JavaScript engines).',
    alternates: [
      { question: 'Which translation approach compiles code to machine code during execution, just before it is needed?', answer: 'Just-in-time (JIT) compilation.' },
      { question: 'Why can a JIT-compiled program become faster the longer it runs?', answer: 'Frequently used ("hot") code is compiled to machine code and kept, so later runs of that code skip translation.' },
      { question: 'True or false: JIT compilation combines advantages of compilers and interpreters. Explain.', answer: 'True. Code is compiled to machine code while it runs, giving near-compiled speed, while keeping the portability of interpreted or bytecode programs.' },
    ],
  },
  {
    id: 'a14-09', difficulty: 'hard',
    question: 'What is bytecode and why is it used?',
    answer: 'Bytecode is an intermediate, platform-independent code produced by compiling source code (e.g. Java .class files). A virtual machine on each platform interprets or JIT-compiles it, so the same bytecode runs anywhere.',
    alternates: [
      { question: 'Why can the same Java .class file run on Windows, macOS and Linux?', answer: 'It contains platform-independent bytecode; each platform has its own Java Virtual Machine that interprets or JIT-compiles it.' },
      { question: 'What runs bytecode on a particular computer?', answer: 'A virtual machine (e.g. the JVM), which interprets or JIT-compiles it for that platform.' },
      { question: 'Fill the gap: Java source code is compiled into ___, which is then run by the ___.', answer: 'Bytecode; Java Virtual Machine (JVM).' },
    ],
  },
  {
    id: 'a14-10', difficulty: 'medium',
    question: 'How does choosing a compiler help protect a company\'s source code?',
    answer: 'Only the compiled executable is distributed, so customers never receive the readable source code. An interpreted program usually has to ship its source code.',
    alternates: [
      { question: 'Why might a company selling software avoid distributing it as interpreted source code?', answer: 'Customers would receive the readable source code, so they could copy, change or reuse it; a compiled executable hides it.' },
      { question: 'True or false: users of a compiled program need its source code to run it. Explain.', answer: 'False. They only need the executable, which contains machine code; the source code stays with the developer.' },
      { question: 'Which translation approach lets a company sell software without giving customers the readable source code?', answer: 'Compiling it and distributing only the executable.' },
    ],
  },
]);

// The keys below are used in data/syllabus.js (deck: 'ib-cs-a1-1', ...).
export const csA1Decks = {
  'ib-cs-a1-1': a1_1,
  'ib-cs-a1-2': a1_2,
  'ib-cs-a1-3': a1_3,
  'ib-cs-a1-4': a1_4,
};