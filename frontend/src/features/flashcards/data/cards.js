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

// ---------- All decks (the keys are used by data/syllabus.js) ----------
export const decks = {
  'ib-cs-a1-1': a1_1,
  'ib-cs-a1-2': a1_2,
  'ib-cs-a1-3': a1_3,
  'ib-cs-a1-4': a1_4,
};