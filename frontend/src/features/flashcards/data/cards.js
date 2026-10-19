// Mock flashcards for the Flashcards page (no real student data).
// Each card needs: a unique id, a question, an answer and a difficulty.

// How many seconds each difficulty gets on the timer.
export const TIME_LIMITS = {
  easy: 30,
  medium: 45,
  hard: 60,
};

export const cards = [
  { id: 'c1', question: 'What is 12 × 8?', answer: '96', difficulty: 'easy' },
  { id: 'c2', question: 'What is 25% of 80?', answer: '20', difficulty: 'easy' },
  {
    id: 'c3',
    question: 'At sea level, water boils at what temperature (°C)?',
    answer: '100 °C',
    difficulty: 'easy',
  },
  { id: 'c4', question: 'Solve for x: 3x + 5 = 20', answer: 'x = 5', difficulty: 'medium' },
  {
    id: 'c5',
    question: 'What is the area of a rectangle that is 7 cm long and 4 cm wide?',
    answer: '28 cm²',
    difficulty: 'medium',
  },
  { id: 'c6', question: 'Simplify the fraction 18/24', answer: '3/4', difficulty: 'medium' },
  {
    id: 'c7',
    question: 'A car travels 150 km in 3 hours. What is its average speed?',
    answer: '50 km/h',
    difficulty: 'hard',
  },
  {
    id: 'c8',
    question: 'A right-angled triangle has shorter sides of 6 and 8. How long is the hypotenuse?',
    answer: '10',
    difficulty: 'hard',
  },
];
