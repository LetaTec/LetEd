// A short sample test students can actually take: five simple questions
// across subjects, a five-minute timer and a score out of five.

export type SampleTestOption = {
  key: string;
  label: string;
};

export type SampleTestQuestion = {
  id: string;
  subject: string;
  prompt: string;
  options: readonly SampleTestOption[];
  answer: string;
};

export const SAMPLE_TEST_QUESTIONS: readonly SampleTestQuestion[] = [
  {
    id: 'gst-intra-state',
    subject: 'Accounts',
    prompt: 'Goods sold within the same state attract',
    options: [
      { key: 'a', label: 'IGST only' },
      { key: 'b', label: 'CGST and SGST' },
      { key: 'c', label: 'Customs duty' },
      { key: 'd', label: 'No GST' },
    ],
    answer: 'b',
  },
  {
    id: 'si-unit-force',
    subject: 'Physics',
    prompt: 'The SI unit of force is the',
    options: [
      { key: 'a', label: 'Joule' },
      { key: 'b', label: 'Watt' },
      { key: 'c', label: 'Newton' },
      { key: 'd', label: 'Pascal' },
    ],
    answer: 'c',
  },
  {
    id: 'percent-of-200',
    subject: 'Maths',
    prompt: 'What is 15% of 200?',
    options: [
      { key: 'a', label: '15' },
      { key: 'b', label: '20' },
      { key: 'c', label: '25' },
      { key: 'd', label: '30' },
    ],
    answer: 'd',
  },
  {
    id: 'symbol-sodium',
    subject: 'Chemistry',
    prompt: 'The chemical symbol for sodium is',
    options: [
      { key: 'a', label: 'Na' },
      { key: 'b', label: 'So' },
      { key: 'c', label: 'S' },
      { key: 'd', label: 'Sd' },
    ],
    answer: 'a',
  },
  {
    id: 'trial-balance-purpose',
    subject: 'Accounts',
    prompt: 'A trial balance checks the',
    options: [
      { key: 'a', label: 'Profit for the year' },
      { key: 'b', label: 'Arithmetical accuracy of the ledger' },
      { key: 'c', label: 'Cash in hand' },
      { key: 'd', label: 'Tax payable' },
    ],
    answer: 'b',
  },
];

export const SAMPLE_TEST_DURATION_SECONDS = 5 * 60;

export const SAMPLE_TEST_TEXT = {
  brand: 'SriDha Academy / AI Assessment',
  count: (total: number) => `Q 01–${String(total).padStart(2, '0')}`,
  title: 'Test',
  titleEnd: 'Paper',
  meta: (total: number) => [
    'Sample test',
    'Mixed subjects',
    `Max. marks ${total}`,
  ],
  instruction:
    'Choose the correct option. Each question carries 1 mark. The clock starts with your first answer',
  marksLabel: '1 mark',
  answered: (count: number, total: number) => `Answered ${count} of ${total}`,
  timeLeft: (time: string) => `Time left ${time}`,
  timeUp: "Time's up",
  submit: 'Submit answers',
  tryAgain: 'Try again',
  score: (score: number, total: number) => `Score ${score} / ${total}`,
  correct: 'Correct',
  correctAnswer: (key: string, label: string) =>
    `Correct answer: (${key}) ${label}`,
  notAnswered: 'Not answered',
  // Shown after marking, chosen by score
  resultFull: 'Full marks! Every answer is right. That is a small victory.',
  resultGood: 'Nearly there. One more topic and you have full marks.',
  resultStart: 'Every topic starts somewhere. Have another go.',
  celebrationTitle: 'Congratulations!',
  paperLabel: 'Sample test paper',
} as const;
