// Pretend past results per topic for ONE made-up demo student.
// There is NO real student data here.
//
// percent = how well the student did on that topic in past (pretend) quizzes.
// note    = a short, typical habit a teacher might notice.
// Maths and Science topic names match data/questions.js, so "Practice" can
// start a quiz on exactly that topic.
// Subjects not listed here show as "Not tried" until the student takes a quiz.

export const MOCK_TOPICS = {
  primary: {
    english: [
      { name: 'Grammar', percent: 72, note: 'Mostly accurate; sometimes mixes up past tenses' },
      { name: 'Vocabulary', percent: 66, note: 'Good range, but guesses meanings from one word' },
      { name: 'Comprehension', percent: 48, note: 'Misses clues in inference questions' },
      { name: 'Synthesis and transformation', percent: 55, note: 'Changes the meaning when joining sentences' },
    ],
    mt: [
      { name: 'Vocabulary', percent: 58, note: 'Knows common words, unsure of less common ones' },
      { name: 'Comprehension', percent: 50, note: 'Slow on longer passages' },
      { name: 'Grammar and usage', percent: 62, note: 'Usually correct word order' },
    ],
    math: [
      { name: 'Fractions', percent: 22, note: 'Often adds the denominators' },
      { name: 'Percentage', percent: 30, note: 'Divides by the new value instead of the original' },
      { name: 'Ratio', percent: 41, note: 'Slow on multi-step problems' },
      { name: 'Area and perimeter', percent: 58, note: 'Sometimes mixes up area and perimeter' },
    ],
    science: [
      { name: 'Electrical systems', percent: 40, note: 'Confuses series and parallel circuits' },
      { name: 'Heat', percent: 55, note: 'Thinks "cold" flows into objects' },
      { name: 'Plant systems', percent: 38, note: 'Mixes up food-carrying and water-carrying tubes' },
      { name: 'Water cycle', percent: 47, note: 'Mixes up evaporation and condensation' },
    ],
  },

  secondary: {
    english: [
      { name: 'Editing', percent: 68, note: 'Spots most errors; misses subject–verb agreement' },
      { name: 'Comprehension', percent: 52, note: 'Answers lift too much from the passage' },
      { name: 'Summary writing', percent: 50, note: 'Includes examples that should be left out' },
      { name: 'Vocabulary in context', percent: 70, note: 'Consistent' },
    ],
    mt: [
      { name: 'Vocabulary', percent: 55, note: 'Unsure of less common words' },
      { name: 'Comprehension', percent: 50, note: 'Slow on longer passages' },
      { name: 'Language usage', percent: 51, note: 'Mixes up similar-looking words' },
    ],
    math: [
      { name: 'Quadratic equations', percent: 22, note: 'Often picks the wrong sign when factorising' },
      { name: 'Trigonometry', percent: 30, note: 'Mixes up sin and cos ratios' },
      { name: 'Indices', percent: 41, note: 'Multiplies indices when it should add them' },
      { name: 'Coordinate geometry', percent: 58, note: 'Careless errors in the distance formula' },
      { name: 'Algebra basics', percent: 72, note: 'Consistent and fast' },
    ],
    science: [
      { name: 'Cells', percent: 50, note: 'Mixes up plant and animal cell parts' },
      { name: 'Forces', percent: 38, note: 'Forgets units in calculations' },
      { name: 'Particulate nature of matter', percent: 45, note: 'Unsure how particles move in each state' },
    ],
    combinedScience: [
      { name: 'Kinematics', percent: 45, note: 'Reads the wrong graph type' },
      { name: 'Energy', percent: 38, note: 'Forgets the ½ in kinetic energy' },
      { name: 'Atomic structure', percent: 30, note: 'Confuses ions and atoms' },
      { name: 'Acids and bases', percent: 52, note: 'Mixes up the products of different reactions' },
    ],
    physics: [
      { name: 'Kinematics', percent: 50, note: 'Mixes up speed and velocity' },
      { name: 'Dynamics', percent: 40, note: 'Unsure when forces are balanced' },
      { name: 'Electricity', percent: 45, note: 'Slow on circuit calculations' },
    ],
    chemistry: [
      { name: 'Atomic structure', percent: 30, note: 'Confuses ions and atoms' },
      { name: 'Chemical bonding', percent: 35, note: 'Mixes up ionic and covalent bonds' },
      { name: 'Mole concept', percent: 40, note: 'Skips the ratio step in calculations' },
    ],
    biology: [
      { name: 'Cell structure', percent: 82, note: 'Strong and confident' },
      { name: 'Nutrition in humans', percent: 75, note: 'Good recall of enzymes' },
      { name: 'Transport in plants', percent: 77, note: 'Clear on xylem and phloem' },
    ],
    geography: [
      { name: 'Weather and climate', percent: 70, note: 'Good use of data' },
      { name: 'Tourism', percent: 74, note: 'Clear explanations' },
    ],
    history: [
      { name: 'Source-based questions', percent: 60, note: 'Needs to explain the reliability of sources' },
      { name: 'Essay structure', percent: 72, note: 'Clear points with evidence' },
    ],
    combinedHumanities: [
      { name: 'Social Studies: source-based case study', percent: 58, note: 'Inferences sometimes unsupported' },
      { name: 'Social Studies: structured-response questions', percent: 65, note: 'Good points; needs balanced evaluation' },
    ],
  },
};
