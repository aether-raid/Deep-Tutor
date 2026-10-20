// Syllabus data for the Flashcards page.
// Lives at: src/features/flashcards/data/syllabus.js
//
// Structure:  curriculum (level)  →  subjects  →  topics  →  sub-topics
// A sub-topic with   deck: '<key>'   is READY (green) when data/cards.js has a deck with that key.
// Every other sub-topic is LOCKED (grey) until a deck is added.
//
// To unlock a new sub-topic later:
//   1. add a deck to data/cards.js, e.g.  'ib-cs-a2-1': [ ...cards ]
//   2. add  deck: 'ib-cs-a2-1'  to that sub-topic below.
//
// Sources: official SEAB syllabus documents (2026/2027) and IB subject guides.

// ---------- Small helpers to keep the lists short ----------

// [['N1', 'Numbers and their operations'], ...]  →  [{ code: 'N1', name: '...' }, ...]
function subs(pairs) {
  return pairs.map(([code, name, extra]) => ({ code, name, ...extra }));
}

// ['Kinematics', 'Free-fall']  →  [{ code: '', name: 'Kinematics' }, ...]  (for syllabuses without sub-topic numbers)
function named(names) {
  return names.map(name => ({ code: '', name }));
}

// Like named(), but every sub-topic gets a flashcard deck: 'a-phys-1' → decks 'a-phys-1-1', 'a-phys-1-2', ...
function decked(prefix, names) {
  return names.map((name, i) => ({ code: '', name, deck: `${prefix}-${i + 1}` }));
}

// Builds the SL version of an IB subject by removing everything marked hlOnly.
function standardLevel(hlSubject, overrides) {
  return {
    ...hlSubject,
    ...overrides,
    topics: hlSubject.topics
      .filter(topic => !topic.hlOnly)
      .map(topic => ({
        ...topic,
        subtopics: topic.subtopics
          .filter(sub => !sub.hlOnly)
          // HL notes (e.g. "plus extra HL-only content") don't apply to SL, so "note" is left out on purpose.
          // Decks are kept: an SL sub-topic shares its deck with HL (HL-only sub-topics are already removed).
          .map(({ note, ...sub }) => ({ ...sub, ...(sub.slNote ? { note: sub.slNote } : {}) })),
      })),
  };
}

const HL_EXTRA = { note: 'Core content for all students, plus extra HL-only content.' };

// =====================================================================
// O LEVEL (Singapore-Cambridge GCE O Level, 2026 syllabuses)
// From 2027 these become SEC G3 papers (K310, K341, K323, K349) with the same topic headings.
// =====================================================================

const oMath = {
  id: 'o-math', name: 'Elementary Mathematics', short: 'EM', syllabus: 'O Level Mathematics 4052 (2026)',
  topics: [
    { code: 'N', name: 'Number and Algebra', subtopics: subs([
      ['N1', 'Numbers and their operations', { deck: 'o-math-n1' }], ['N2', 'Ratio and proportion', { deck: 'o-math-n2' }], ['N3', 'Percentage', { deck: 'o-math-n3' }],
      ['N4', 'Rate and speed', { deck: 'o-math-n4' }], ['N5', 'Algebraic expressions and formulae', { deck: 'o-math-n5' }],
      ['N6', 'Functions and graphs', { deck: 'o-math-n6' }], ['N7', 'Equations and inequalities', { deck: 'o-math-n7' }],
      ['N8', 'Set language and notation', { deck: 'o-math-n8' }], ['N9', 'Matrices', { deck: 'o-math-n9' }],
    ]) },
    { code: 'G', name: 'Geometry and Measurement', subtopics: subs([
      ['G1', 'Angles, triangles and polygons', { deck: 'o-math-g1' }],
      ['G2', 'Congruence and similarity', { deck: 'o-math-g2' }],
      ['G3', 'Properties of circles', { deck: 'o-math-g3' }],
      ['G4', "Pythagoras' theorem and trigonometry", { deck: 'o-math-g4' }],
      ['G5', 'Mensuration', { deck: 'o-math-g5' }],
      ['G6', 'Coordinate geometry', { deck: 'o-math-g6' }],
      ['G7', 'Vectors in two dimensions', { deck: 'o-math-g7' }],
    ]) },
    { code: 'S', name: 'Statistics and Probability', subtopics: subs([
      ['S1', 'Data handling and analysis', { deck: 'o-math-s1' }],
      ['S2', 'Probability', { deck: 'o-math-s2' }],
    ]) },
  ],
};

const oAddMath = {
  id: 'o-amath', name: 'Additional Mathematics', short: 'AM', syllabus: 'O Level Additional Mathematics 4049 (2026)',
  topics: [
    { code: 'A', name: 'Algebra', subtopics: subs([
      ['A1', 'Quadratic functions', { deck: 'o-amath-a1' }],
      ['A2', 'Equations and inequalities', { deck: 'o-amath-a2' }],
      ['A3', 'Surds', { deck: 'o-amath-a3' }],
      ['A4', 'Polynomials and partial fractions', { deck: 'o-amath-a4' }],
      ['A5', 'Binomial expansions', { deck: 'o-amath-a5' }],
      ['A6', 'Exponential and logarithmic functions', { deck: 'o-amath-a6' }],
    ]) },
    { code: 'G', name: 'Geometry and Trigonometry', subtopics: subs([
      ['G1', 'Trigonometric functions, identities and equations', { deck: 'o-amath-g1' }],
      ['G2', 'Coordinate geometry in two dimensions', { deck: 'o-amath-g2' }],
      ['G3', 'Proofs in plane geometry', { deck: 'o-amath-g3' }],
    ]) },
    { code: 'C', name: 'Calculus', subtopics: subs([
      ['C1', 'Differentiation and integration', { deck: 'o-amath-c1' }],
    ]) },
  ],
};

const oPhysics = {
  id: 'o-physics', name: 'Physics', short: 'PHY', syllabus: 'O Level Physics 6091 (2026)',
  topics: [
    { theme: 'I — Measurement', code: '1', name: 'Physical Quantities, Units and Measurement',
      subtopics: decked('o-phys-1', ['Physical quantities and SI units', 'Measurement', 'Scalars and vectors']) },
    { theme: 'II — Newtonian Mechanics', code: '2', name: 'Kinematics',
      subtopics: decked('o-phys-2', ['Speed, velocity and acceleration', 'Graphical analysis of motion', 'Free-fall']) },
    { theme: 'II — Newtonian Mechanics', code: '3', name: 'Dynamics',
      subtopics: decked('o-phys-3', ['Types of forces', 'Mass, weight and gravitational field', "Newton's laws of motion", 'Effects of resistive forces on motion']) },
    { theme: 'II — Newtonian Mechanics', code: '4', name: 'Turning Effects of Forces',
      subtopics: decked('o-phys-4', ['Moments', 'Equilibrium', 'Centre of gravity and stability']) },
    { theme: 'II — Newtonian Mechanics', code: '5', name: 'Pressure',
      subtopics: decked('o-phys-5', ['Pressure', 'Density and fluid pressure']) },
    { theme: 'II — Newtonian Mechanics', code: '6', name: 'Energy',
      subtopics: decked('o-phys-6', ['Energy stores and transfers', 'Work, power and efficiency', 'Energy resources']) },
    { theme: 'III — Thermal Physics', code: '7', name: 'Kinetic Particle Model of Matter',
      subtopics: decked('o-phys-7', ['States of matter', 'Kinetic particle model']) },
    { theme: 'III — Thermal Physics', code: '8', name: 'Thermal Processes',
      subtopics: decked('o-phys-8', ['Thermal equilibrium', 'Conduction', 'Convection', 'Radiation']) },
    { theme: 'III — Thermal Physics', code: '9', name: 'Thermal Properties of Matter',
      subtopics: decked('o-phys-9', ['Internal energy', 'Specific heat capacity', 'Melting, boiling and evaporation', 'Specific latent heat']) },
    { theme: 'IV — Waves', code: '10', name: 'General Properties of Waves',
      subtopics: decked('o-phys-10', ['Describing wave motion', 'Wave properties', 'Sound']) },
    { theme: 'IV — Waves', code: '11', name: 'Electromagnetic Spectrum',
      subtopics: decked('o-phys-11', ['Properties of EM waves', 'Applications of EM waves', 'Effects of EM waves on cells and tissues']) },
    { theme: 'IV — Waves', code: '12', name: 'Light',
      subtopics: decked('o-phys-12', ['Reflection of light', 'Refraction of light', 'Thin converging lenses']) },
    { theme: 'V — Electricity and Magnetism', code: '13', name: 'Static Electricity',
      subtopics: decked('o-phys-13', ['Electric charge', 'Electric field', 'Dangers and applications of electrostatic charging']) },
    { theme: 'V — Electricity and Magnetism', code: '14', name: 'Current of Electricity',
      subtopics: decked('o-phys-14', ['Conventional current and electron flow', 'Electromotive force and potential difference', 'Resistance']) },
    { theme: 'V — Electricity and Magnetism', code: '15', name: 'D.C. Circuits',
      subtopics: decked('o-phys-15', ['Circuit diagrams', 'Series and parallel circuits', 'Action and use of circuit components']) },
    { theme: 'V — Electricity and Magnetism', code: '16', name: 'Practical Electricity',
      subtopics: decked('o-phys-16', ['Electrical working, power and energy', 'Dangers of electricity', 'Safe use of electricity in the home']) },
    { theme: 'V — Electricity and Magnetism', code: '17', name: 'Magnetism',
      subtopics: decked('o-phys-17', ['Laws of magnetism', 'Magnetic properties of matter', 'Magnetic field']) },
    { theme: 'V — Electricity and Magnetism', code: '18', name: 'Electromagnetism',
      subtopics: decked('o-phys-18', ['Magnetic effect of a current', 'Force on a current-carrying conductor', 'The d.c. motor']) },
    { theme: 'V — Electricity and Magnetism', code: '19', name: 'Electromagnetic Induction',
      subtopics: decked('o-phys-19', ['Principles of electromagnetic induction', 'The a.c. generator', 'The transformer']) },
    { theme: 'VI — Radioactivity', code: '20', name: 'Radioactivity',
      subtopics: decked('o-phys-20', ['The composition of the atom', 'Radioactive decay', 'Dangers and uses of radioactivity']) },
  ],
};

const oComputing = {
  id: 'o-computing', name: 'Computing', short: 'CPT', syllabus: 'O Level Computing 7155 (2026)',
  topics: [
    { code: 'M1', name: 'Computing Fundamentals', subtopics: subs([
      ['1.1', 'Computer Architecture', { deck: 'o-cpt-1-1' }],
      ['1.2', 'Data Representation', { deck: 'o-cpt-1-2' }],
      ['1.3', 'Logic Gates', { deck: 'o-cpt-1-3' }],
    ]) },
    { code: 'M2', name: 'Algorithms and Programming', subtopics: subs([
      ['2.1', 'Problem Analysis', { deck: 'o-cpt-2-1' }],
      ['2.2', 'Constructs', { deck: 'o-cpt-2-2' }],
      ['2.3', 'Python Code', { deck: 'o-cpt-2-3' }],
      ['2.4', 'Testing and Debugging', { deck: 'o-cpt-2-4' }],
      ['2.5', 'Algorithm Design', { deck: 'o-cpt-2-5' }],
      ['2.6', 'Software Engineering', { deck: 'o-cpt-2-6' }],
    ]) },
    { code: 'M3', name: 'Spreadsheets', subtopics: subs([
      ['3.1', 'Program Features', { deck: 'o-cpt-3-1' }],
      ['3.2', 'Functions', { deck: 'o-cpt-3-2' }],
    ]) },
    { code: 'M4', name: 'Networking', subtopics: subs([
      ['4.1', 'Concepts', { deck: 'o-cpt-4-1' }],
      ['4.2', 'Home Networks and the Internet', { deck: 'o-cpt-4-2' }],
      ['4.3', 'Security and Privacy', { deck: 'o-cpt-4-3' }],
    ]) },
    { code: 'M5', name: 'Impact of Computing', subtopics: subs([
      ['5.1', 'General', { deck: 'o-cpt-5-1' }],
      ['5.2', 'Intellectual Property', { deck: 'o-cpt-5-2' }],
      ['5.3', 'Communication', { deck: 'o-cpt-5-3' }],
      ['5.4', 'Emerging Technologies', { deck: 'o-cpt-5-4' }],
    ]) },
  ],
};

// =====================================================================
// IB DIPLOMA
// =====================================================================

// IB Mathematics: Analysis and Approaches (current guide, first assessed 2021).
// Sub-topic numbers and the SL/HL split are official; the short names are labels (the guide has no titles).
const ibMathHL = {
  id: 'ib-math-hl', name: 'Mathematics AA', tag: 'HL',
  syllabus: 'IB Mathematics: Analysis and Approaches (current guide; sub-topic names are short labels)',
  topics: [
    // ★ Topic 1 has flashcard decks (data/decks/ib-math-aa-1.js).
    { code: '1', name: 'Number and algebra', subtopics: subs([
      ['1.1', 'Standard form', { deck: 'ib-math-1-1' }], ['1.2', 'Arithmetic sequences and series', { deck: 'ib-math-1-2' }], ['1.3', 'Geometric sequences and series', { deck: 'ib-math-1-3' }],
      ['1.4', 'Financial applications', { deck: 'ib-math-1-4' }], ['1.5', 'Integer exponents and introduction to logarithms', { deck: 'ib-math-1-5' }],
      ['1.6', 'Simple deductive proof', { deck: 'ib-math-1-6' }], ['1.7', 'Rational exponents and laws of logarithms', { deck: 'ib-math-1-7' }],
      ['1.8', 'Sum of infinite geometric sequences', { deck: 'ib-math-1-8' }], ['1.9', 'Binomial theorem', { deck: 'ib-math-1-9' }],
      ['1.10', 'Counting principles, permutations and combinations', { hlOnly: true, deck: 'ib-math-1-10' }],
      ['1.11', 'Partial fractions', { hlOnly: true, deck: 'ib-math-1-11' }],
      ['1.12', 'Complex numbers: Cartesian form and Argand diagram', { hlOnly: true, deck: 'ib-math-1-12' }],
      ['1.13', 'Modulus–argument (polar) and Euler forms', { hlOnly: true, deck: 'ib-math-1-13' }],
      ['1.14', "Complex conjugate roots and De Moivre's theorem", { hlOnly: true, deck: 'ib-math-1-14' }],
      ['1.15', 'Proof by induction, contradiction and counterexample', { hlOnly: true, deck: 'ib-math-1-15' }],
      ['1.16', 'Systems of linear equations', { hlOnly: true, deck: 'ib-math-1-16' }],
    ]) },
    { code: '2', name: 'Functions', subtopics: subs([
      ['2.1', 'Equations of straight lines'], ['2.2', 'Functions: domain, range and graph'], ['2.3', 'Graph of a function'],
      ['2.4', 'Key features of graphs'], ['2.5', 'Composite and inverse functions'], ['2.6', 'Quadratic functions'],
      ['2.7', 'Quadratic equations and inequalities'], ['2.8', 'Reciprocal and rational functions'],
      ['2.9', 'Exponential and logarithmic functions'], ['2.10', 'Solving equations graphically and analytically'],
      ['2.11', 'Transformations of graphs'],
      ['2.12', 'Polynomial functions, factor and remainder theorems', { hlOnly: true }],
      ['2.13', 'Rational functions', { hlOnly: true }],
      ['2.14', 'Odd and even functions', { hlOnly: true }],
      ['2.15', 'Solving inequalities', { hlOnly: true }],
      ['2.16', 'Modulus graphs', { hlOnly: true }],
    ]) },
    { code: '3', name: 'Geometry and trigonometry', subtopics: subs([
      ['3.1', '3D distance, midpoint, volume and surface area'], ['3.2', 'Right-angled and non-right-angled triangle trigonometry'],
      ['3.3', 'Applications: elevation and bearings'], ['3.4', 'Radian measure, arcs and sectors'],
      ['3.5', 'Unit circle definitions'], ['3.6', 'Pythagorean and double angle identities'],
      ['3.7', 'Circular functions and their graphs'], ['3.8', 'Solving trigonometric equations'],
      ['3.9', 'Reciprocal and inverse trigonometric functions', { hlOnly: true }],
      ['3.10', 'Compound angle identities', { hlOnly: true }],
      ['3.11', 'Relationships and symmetry of trigonometric functions', { hlOnly: true }],
      ['3.12', 'Vector concepts', { hlOnly: true }],
      ['3.13', 'Scalar product', { hlOnly: true }],
      ['3.14', 'Vector equation of a line', { hlOnly: true }],
      ['3.15', 'Classification of lines', { hlOnly: true }],
      ['3.16', 'Vector product', { hlOnly: true }],
      ['3.17', 'Vector equations of a plane', { hlOnly: true }],
      ['3.18', 'Intersections of lines and planes', { hlOnly: true }],
    ]) },
    { code: '4', name: 'Statistics and probability', subtopics: subs([
      ['4.1', 'Population, sampling and data'], ['4.2', 'Presentation of data'],
      ['4.3', 'Measures of central tendency and dispersion'], ['4.4', 'Linear correlation and regression of y on x'],
      ['4.5', 'Probability concepts'], ['4.6', 'Venn and tree diagrams, combined events'],
      ['4.7', 'Discrete random variables'], ['4.8', 'Binomial distribution'], ['4.9', 'Normal distribution'],
      ['4.10', 'Regression of x on y'], ['4.11', 'Conditional probability and independence'],
      ['4.12', 'Standardisation and inverse normal'],
      ['4.13', "Bayes' theorem", { hlOnly: true }],
      ['4.14', 'Properties of discrete and continuous random variables', { hlOnly: true }],
    ]) },
    { code: '5', name: 'Calculus', subtopics: subs([
      ['5.1', 'Limits and the derivative'], ['5.2', 'Increasing and decreasing functions'], ['5.3', 'Derivative of axⁿ'],
      ['5.4', 'Tangents and normals'], ['5.5', 'Introduction to integration'],
      ['5.6', 'Standard derivatives; chain, product and quotient rules'], ['5.7', 'The second derivative'],
      ['5.8', 'Maxima, minima, optimisation and points of inflexion'], ['5.9', 'Kinematics'],
      ['5.10', 'Indefinite integration and substitution'], ['5.11', 'Definite integrals and areas'],
      ['5.12', 'First principles and higher derivatives', { hlOnly: true }],
      ['5.13', "Limits and L'Hôpital's rule", { hlOnly: true }],
      ['5.14', 'Implicit differentiation and related rates', { hlOnly: true }],
      ['5.15', 'Further derivatives and integrals', { hlOnly: true }],
      ['5.16', 'Integration by substitution and by parts', { hlOnly: true }],
      ['5.17', 'Areas with the y-axis and volumes of revolution', { hlOnly: true }],
      ['5.18', 'First-order differential equations', { hlOnly: true }],
      ['5.19', 'Maclaurin series', { hlOnly: true }],
    ]) },
  ],
};

// IB Physics (guide first assessed 2025).
const ibPhysicsHL = {
  id: 'ib-physics-hl', name: 'Physics', tag: 'HL', syllabus: 'IB Physics guide (first assessment 2025)',
  topics: [
    { code: 'A', name: 'Space, time and motion', subtopics: subs([
      // ★ Theme A has flashcard decks (data/decks/ib-physics-a.js).
      ['A.1', 'Kinematics', { deck: 'ib-phys-a1' }],
      ['A.2', 'Forces and momentum', { deck: 'ib-phys-a2' }],
      ['A.3', 'Work, energy and power', { deck: 'ib-phys-a3' }],
      ['A.4', 'Rigid body mechanics', { hlOnly: true, deck: 'ib-phys-a4' }],
      ['A.5', 'Galilean and special relativity', { hlOnly: true, deck: 'ib-phys-a5' }],
    ]) },
    { code: 'B', name: 'The particulate nature of matter', subtopics: subs([
      ['B.1', 'Thermal energy transfers'], ['B.2', 'Greenhouse effect'], ['B.3', 'Gas laws'],
      ['B.4', 'Thermodynamics', { hlOnly: true }], ['B.5', 'Current and circuits'],
    ]) },
    { code: 'C', name: 'Wave behaviour', subtopics: subs([
      ['C.1', 'Simple harmonic motion', HL_EXTRA], ['C.2', 'Wave model'], ['C.3', 'Wave phenomena', HL_EXTRA],
      ['C.4', 'Standing waves and resonance'], ['C.5', 'Doppler effect', HL_EXTRA],
    ]) },
    { code: 'D', name: 'Fields', subtopics: subs([
      ['D.1', 'Gravitational fields', HL_EXTRA], ['D.2', 'Electric and magnetic fields', HL_EXTRA],
      ['D.3', 'Motion in electromagnetic fields'], ['D.4', 'Induction', { hlOnly: true }],
    ]) },
    { code: 'E', name: 'Nuclear and quantum physics', subtopics: subs([
      ['E.1', 'Structure of the atom', HL_EXTRA], ['E.2', 'Quantum physics', { hlOnly: true }],
      ['E.3', 'Radioactive decay', HL_EXTRA], ['E.4', 'Fission'], ['E.5', 'Fusion and stars'],
    ]) },
  ],
};

// IB Computer Science HL (guide published Feb 2025, first assessment 2027).
// ★ A1 is the only topic with flashcard decks so far.
const A = 'Theme A — Concepts of computer science';
const B = 'Theme B — Computational thinking and problem-solving';
const ibComputerScienceHL = {
  id: 'ib-cs-hl', name: 'Computer Science', tag: 'HL',
  syllabus: 'IB Computer Science guide (Feb 2025, first assessment 2027)',
  topics: [
    { theme: A, code: 'A1', name: 'Computer fundamentals', subtopics: subs([
      ['A1.1', 'Computer hardware and operation', { deck: 'ib-cs-a1-1' }],
      ['A1.2', 'Data representation and computer logic', { deck: 'ib-cs-a1-2' }],
      ['A1.3', 'Operating systems and control systems', { deck: 'ib-cs-a1-3' }],
      ['A1.4', 'Translation', { hlOnly: true, deck: 'ib-cs-a1-4' }],
    ]) },
    { theme: A, code: 'A2', name: 'Networks', subtopics: subs([
      ['A2.1', 'Network fundamentals'], ['A2.2', 'Network architecture'],
      ['A2.3', 'Data transmissions'], ['A2.4', 'Network security'],
    ]) },
    { theme: A, code: 'A3', name: 'Databases', subtopics: subs([
      ['A3.1', 'Database fundamentals'], ['A3.2', 'Database design'], ['A3.3', 'Database programming'],
      ['A3.4', 'Alternative databases and data warehouses', { hlOnly: true }],
    ]) },
    { theme: A, code: 'A4', name: 'Machine learning', subtopics: subs([
      ['A4.1', 'Machine learning fundamentals'], ['A4.2', 'Data preprocessing', { hlOnly: true }],
      ['A4.3', 'Machine learning approaches', { hlOnly: true }], ['A4.4', 'Ethical considerations'],
    ]) },
    { theme: B, code: 'B1', name: 'Computational thinking', subtopics: subs([
      ['B1.1', 'Approaches to computational thinking',
        { note: 'Decomposition, abstraction, pattern recognition and algorithmic thinking.' }],
    ]) },
    { theme: B, code: 'B2', name: 'Programming', subtopics: subs([
      ['B2.1', 'Programming fundamentals'], ['B2.2', 'Data structures'], ['B2.3', 'Programming constructs'],
      ['B2.4', 'Programming algorithms'], ['B2.5', 'File processing'],
    ]) },
    { theme: B, code: 'B3', name: 'Object-oriented programming', subtopics: subs([
      ['B3.1', 'Fundamentals of OOP for a single class'],
      ['B3.2', 'Fundamentals of OOP for multiple classes',
        { hlOnly: true, note: 'Encapsulation, inheritance, polymorphism and interactions between classes.' }],
    ]) },
    { theme: B, code: 'B4', name: 'Abstract data types', hlOnly: true, subtopics: subs([
      ['B4.1', 'Fundamentals of abstract data types', { hlOnly: true,
        note: 'Linked lists (singly, doubly, circular), binary search trees, sets and set operations, hash tables, hashing and collision handling.' }],
    ]) },
  ],
};

// =====================================================================
// A LEVEL (Singapore-Cambridge GCE A Level, H2)
// =====================================================================

const aMath = {
  id: 'a-math', name: 'Mathematics', tag: 'H2', syllabus: 'A Level H2 Mathematics 9758 (2026/2027)',
  topics: [
    // ★ Topics 1 and 2 have flashcard decks (data/decks/a-h2-math-1-2.js).
    { theme: 'Section A — Pure Mathematics', code: '1', name: 'Functions and graphs', subtopics: subs([
      ['1.1', 'Functions', { deck: 'a-h2m-1-1' }],
      ['1.2', 'Graphs and transformations', { deck: 'a-h2m-1-2' }],
      ['1.3', 'Equations and inequalities', { deck: 'a-h2m-1-3' }],
    ]) },
    { theme: 'Section A — Pure Mathematics', code: '2', name: 'Sequences and series', subtopics: subs([
      ['2.1', 'Sequences and series', { deck: 'a-h2m-2-1' }],
    ]) },
    { theme: 'Section A — Pure Mathematics', code: '3', name: 'Vectors', subtopics: subs([
      ['3.1', 'Basic properties of vectors in two and three dimensions'], ['3.2', 'Scalar and vector products in vectors'],
      ['3.3', 'Three-dimensional vector geometry'],
    ]) },
    { theme: 'Section A — Pure Mathematics', code: '4', name: 'Introduction to complex numbers', subtopics: subs([
      ['4.1', 'Complex numbers expressed in cartesian form and Argand diagrams'],
    ]) },
    { theme: 'Section A — Pure Mathematics', code: '5', name: 'Calculus', subtopics: subs([
      ['5.1', 'Differentiation'], ['5.2', 'Maclaurin series'], ['5.3', 'Integration techniques'],
      ['5.4', 'Definite integrals'], ['5.5', 'Differential equations'],
    ]) },
    { theme: 'Section B — Probability and Statistics', code: '6', name: 'Probability and statistics', subtopics: subs([
      ['6.1', 'Probability'], ['6.2', 'Discrete random variables'], ['6.3', 'Normal distribution'],
      ['6.4', 'Sampling'], ['6.5', 'Hypothesis testing'], ['6.6', 'Correlation and linear regression'],
    ]) },
  ],
};

// ★ Section I (Topics 1–4) has flashcard decks (data/decks/a-h2-physics.js).
const aPhysics = {
  id: 'a-physics', name: 'Physics', tag: 'H2', syllabus: 'A Level H2 Physics 9478 (revised; first examined 2026)',
  topics: [
    { theme: 'I — Foundations of Physics', code: '1', name: 'Quantities and Measurement',
      subtopics: decked('a-phys-1', ['Physical quantities and SI units', 'Errors and uncertainties', 'Scalars and vectors']) },
    { theme: 'I — Foundations of Physics', code: '2', name: 'Forces and Moments',
      subtopics: decked('a-phys-2', ['Types of force', 'Moment and torque', 'Translational and rotational equilibrium']) },
    { theme: 'I — Foundations of Physics', code: '3', name: 'Motion and Forces',
      subtopics: decked('a-phys-3', ['Kinematics', 'Uniformly accelerated linear motion', 'Mass and linear momentum', 'Laws of motion']) },
    { theme: 'I — Foundations of Physics', code: '4', name: 'Energy and Fields',
      subtopics: decked('a-phys-4', ['Energy stores and transfers', 'Work done by a force', 'Kinetic energy', 'Concept of a field', 'Potential energy', 'Power and efficiency']) },
    { theme: 'II — Mechanics', code: '5', name: 'Projectile Motion',
      subtopics: named(['Free fall', 'Gravitational potential energy in a uniform field', 'Effects of air resistance']) },
    { theme: 'II — Mechanics', code: '6', name: 'Collisions',
      subtopics: named(['Impulse', 'Conservation of momentum and energy']) },
    { theme: 'II — Mechanics', code: '7', name: 'Circular Motion',
      subtopics: named(['Kinematics of uniform circular motion', 'Centripetal acceleration']) },
    { theme: 'II — Mechanics', code: '8', name: 'Gravitational Fields',
      subtopics: named(["Newton's laws of gravitation", 'Gravitational field strength', 'Gravitational potential and energy', 'Escape velocity and circular orbits']) },
    { theme: 'II — Mechanics', code: '9', name: 'Oscillations',
      subtopics: named(['Simple harmonic motion', 'Energy in oscillations']) },
    { theme: 'III — Waves', code: '10', name: 'Wave Motion',
      subtopics: named(['Properties of waves', 'Energy transfer by progressive waves', 'Polarisation']) },
    { theme: 'III — Waves', code: '11', name: 'Superposition',
      subtopics: named(['Principle of superposition', 'Standing waves', 'Interference of two or more point sources', 'Diffraction through a finite-size gap']) },
    { theme: 'IV — Thermal Physics', code: '12', name: 'Temperature and Ideal Gases',
      subtopics: named(['Empirical gas laws', 'Kinetic theory of gases']) },
    { theme: 'IV — Thermal Physics', code: '13', name: 'Thermodynamic Systems',
      subtopics: named(['Internal energy', 'Heating and work done', 'Laws of thermodynamics', 'Specific heat capacity and specific latent heat']) },
    { theme: 'V — Electricity and Magnetism', code: '14', name: 'Electric Fields',
      subtopics: named(["Coulomb's law", 'Electric field strength', 'Electric potential and energy', 'Uniform electric fields', 'Capacitance']) },
    { theme: 'V — Electricity and Magnetism', code: '15', name: 'Currents',
      subtopics: named(['Current and drift velocity', 'Potential difference and power', 'Power supplies: d.c. and a.c.']) },
    { theme: 'V — Electricity and Magnetism', code: '16', name: 'Circuits',
      subtopics: named(['Circuit symbols and diagrams', 'Resistance, resistivity and internal resistance', 'Resistors in series and parallel', 'RC circuits with d.c. source']) },
    { theme: 'V — Electricity and Magnetism', code: '17', name: 'Electromagnetic Forces',
      subtopics: named(['Magnetic fields and magnetic flux density due to currents', 'Force on a current-carrying conductor', 'Force on a moving charge']) },
    { theme: 'V — Electricity and Magnetism', code: '18', name: 'Electromagnetic Induction',
      subtopics: named(['Magnetic flux', "Faraday's and Lenz's laws of electromagnetic induction", 'Power transformers']) },
    { theme: 'VI — Modern Physics', code: '19', name: 'Quantum Physics',
      subtopics: named(['The particulate nature of light', 'The wave nature of particles', 'Quantisation of energy in matter']) },
    { theme: 'VI — Modern Physics', code: '20', name: 'Nuclear Physics',
      subtopics: named(['The nuclear atom', 'Radioactive decay', 'Nuclear processes and conservation laws', 'Mass defect and nuclear binding energy']) },
  ],
};

const aComputing = {
  id: 'a-computing', name: 'Computing', tag: 'H2', syllabus: 'A Level H2 Computing 9569 (revised, from 2027)',
  topics: [
    // ★ Module 1 has flashcard decks (data/decks/a-h2-computing-1.js).
    { code: 'M1', name: 'Programming Fundamentals', subtopics: subs([
      ['1.1', 'Algorithmic Fundamentals', { deck: 'a-h2c-1-1' }],
      ['1.2', 'Programming Constructs', { deck: 'a-h2c-1-2' }],
      ['1.3', 'Coding Standards', { deck: 'a-h2c-1-3' }],
      ['1.4', 'Recursion', { deck: 'a-h2c-1-4' }],
      ['1.5', 'Data Validation and Program Testing', { deck: 'a-h2c-1-5' }],
    ]) },
    { code: 'M2', name: 'Data Structures and Algorithms', subtopics: subs([
      ['2.1', 'Data Structures'], ['2.2', 'Searching and Sorting Algorithms'], ['2.3', 'Object-Oriented Programming'],
    ]) },
    { code: 'M3', name: 'Data and Information', subtopics: subs([
      ['3.1', 'Data Representation'], ['3.2', 'Character Encoding'], ['3.3', 'Databases'],
    ]) },
    { code: 'M4', name: 'Computer Networks', subtopics: subs([
      ['4.1', 'Computer Network Fundamentals'], ['4.2', 'Web Applications'],
    ]) },
    { code: 'M5', name: 'Social, Ethical and Security Impact of Computing', subtopics: subs([
      ['5.1', 'Issues and Impact of Computing'], ['5.2', 'Information Security'], ['5.3', 'Cybersecurity'],
    ]) },
    { code: 'M6', name: 'Emerging Technologies', subtopics: subs([
      ['6.1', 'Artificial Intelligence'],
    ]) },
  ],
};

// =====================================================================
// Everything the page shows, in order
// =====================================================================

export const levels = [
  {
    id: 'o-level', short: 'O', name: 'O Level',
    subtitle: 'Singapore-Cambridge GCE O Level (2026 syllabuses)',
    subjects: [oMath, oAddMath, oPhysics, oComputing],
  },
  {
    id: 'ib', short: 'IB', name: 'IB Diploma',
    subtitle: 'International Baccalaureate Diploma Programme',
    subjects: [
      standardLevel(ibMathHL, { id: 'ib-math-sl', tag: 'SL' }),
      ibMathHL,
      standardLevel(ibPhysicsHL, { id: 'ib-physics-sl', tag: 'SL' }),
      ibPhysicsHL,
      ibComputerScienceHL,
    ],
  },
  {
    id: 'a-level', short: 'A', name: 'A Level',
    subtitle: 'Singapore-Cambridge GCE A Level (H2)',
    subjects: [aMath, aPhysics, aComputing],
  },
];
