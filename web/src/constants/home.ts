import { HOME_SECTION_ID } from './routes';

export const BRAND = {
  name: 'letaEd',
  wordmark: 'leta',
  wordmarkEmphasis: 'Ed',
  footerLead:
    'A focused education platform for topic-wise classes, assessment, examination preparation and AI model papers',
  copyright: '© 2026 letaEd Education',
  footerNote: 'Designed as an editorial learning experience',
} as const;

export const NAV_LINKS = [
  { label: 'Courses', sectionId: HOME_SECTION_ID.courses },
  { label: 'AI Test', sectionId: HOME_SECTION_ID.aiTest },
  { label: 'Model Paper', sectionId: HOME_SECTION_ID.modelPaper },
  { label: 'About', sectionId: HOME_SECTION_ID.about },
] as const;

export const HEADER_TEXT = {
  login: 'Login',
  signUp: 'Sign up',
  myLearning: 'My learning',
  logout: 'Log out',
  openMenu: 'Open menu',
  closeMenu: 'Close menu',
  primaryNavigation: 'Primary',
  homeLabel: 'letaEd home',
  skipToContent: 'Skip to content',
} as const;

export const HERO_TEXT = {
  kicker: 'Learning / 01',
  title: 'Big Subjects.',
  titleEmphasis: 'Broken Into',
  titleEnd: 'Small Victories',
  lead: 'A focused learning environment for students preparing for school, competitive examinations and professional pathways — taught topic by topic',
  primaryAction: 'Explore learning',
  secondaryAction: 'Create account',
  stats: [
    { value: '03', label: 'Learning paths' },
    { value: '15+', label: 'Subjects & exams' },
    { value: '100', label: 'Students / batch' },
  ],
} as const;

// Second section: the approved breakdown of the letaEd learning model.
export const LEARNING_MODEL_TEXT = {
  index: '01 /',
  title: 'Big Subjects. Broken Into',
  titleEmphasis: 'Small Victories.',
  lead: 'Breaking down the model',
  body: 'Learn topic by topic. Build confidence one concept at a time.',
  action: 'Browse topics',
  blocks: [
    {
      index: '01',
      title: 'Big Subjects',
      description:
        'Subjects like Mathematics, Accounts, Science, Economics and other subjects related to professional courses can feel overwhelming when students have to learn everything at once',
    },
    {
      index: '02',
      title: 'Broken Into',
      description:
        'Instead of teaching the entire subject as one big package, you divide it into individual chapters and topics',
    },
    {
      index: '03',
      title: 'Small Victories',
      description:
        'Every time a student understands a difficult concept, completes a chapter, or solves a problem independently, they achieve a small win',
    },
    {
      index: '04',
      title: 'Test Paper',
      description:
        'We develop online test papers for students so they can track their progress. This is done with the help of in-house AI tools.',
    },
  ],
} as const;

export const AI_TEST_TEXT = {
  eyebrow: '02 / AI Test Paper',
  title: 'Practice',
  titleEmphasis: 'without repetition.',
  description:
    'Test papers are generated from the subject material using our in-house tools, so each student receives a different paper for the topics they are studying, followed by marking and a percentile result',
  action: 'Start a sample test',
  sheet: {
    brand: 'letaEd / AI Assessment',
    count: '01 / 25',
    title: 'Test',
    titleEnd: 'Paper',
    questions: [
      { index: '01', prompt: 'What is the next concept?', answer: 'A' },
      { index: '02', prompt: 'Select the correct entry', answer: 'B' },
      { index: '03', prompt: 'Apply the principle', answer: 'C' },
      { index: '04', prompt: 'Interpret the result', answer: 'D' },
    ],
  },
} as const;

export const COURSES_TEXT = {
  title: 'Courses',
  titleEmphasis: 'to begin with.',
  description:
    'Each subject is taught through individual topics. Open a subject to see exactly which topics, lessons and batches are available.',
  loading: 'Loading courses',
  openSubjectLabel: (subject: string) =>
    `View topics and batches for ${subject}`,
} as const;

export const PROGRAMS_TEXT = {
  title: 'The',
  titleEmphasis: 'three paths.',
  description:
    'letaEd brings three services together: topic-wise online classes, AI test papers and AI model papers',
  items: [
    {
      tag: '01 / Classes',
      title: 'Online',
      titleEnd: 'Classes',
      description:
        'Topic-wise live classes delivered online, with up to 100 students per batch. Each batch lists the exact lessons it covers.',
      action: 'Browse classes',
    },
    {
      tag: '02 / Assessment',
      title: 'AI Test',
      titleEnd: 'Paper',
      description:
        'Students create a profile, take a generated paper and receive marking in percentile after completion',
      action: 'See test flow',
    },
    {
      tag: '03 / Prediction',
      title: 'AI Model',
      titleEnd: 'Paper',
      description:
        'Model papers prepared from the last five years of papers and the subject book, reviewed by teachers and planned for delivery seven days before the exam',
      action: 'Join waitlist',
    },
  ],
} as const;

export const ABOUT_TEXT = {
  eyebrow: 'letaEd / About',
  title: 'Built around',
  titleEmphasis: 'learning.',
  paragraphs: [
    'letaEd is designed around a simple proposition: make the path from choosing a topic to preparing for an examination feel coherent',
    'Instead of selling a whole subject at once, we break it into chapters and topics, teach them in focused batches and help students measure progress along the way',
  ],
  note: 'Topic-wise online classes · AI assessment · AI model paper',
} as const;

export const TEAM_TEXT = {
  title: 'People behind',
  titleEmphasis: 'the page.',
  description:
    'Faculty profiles will be published here as each subject team is confirmed',
  members: [
    { initial: 'A', name: 'Accounts Faculty', role: 'Subject Faculty' },
    { initial: 'E', name: 'Economics Faculty', role: 'Subject Faculty' },
    { initial: 'M', name: 'Mathematics Faculty', role: 'Subject Faculty' },
    { initial: 'L', name: 'letaEd Team', role: 'Education & Operations' },
  ],
} as const;

export const CTA_TEXT = {
  eyebrow: 'Start here / 01',
  title: 'Turn the next page',
  titleEmphasis: 'with us.',
  action: 'Create your student account',
} as const;

export const FOOTER_COLUMNS = [
  {
    title: 'Explore',
    links: [
      { label: 'Courses', sectionId: HOME_SECTION_ID.courses },
      { label: 'AI Test', sectionId: HOME_SECTION_ID.aiTest },
      { label: 'Model Paper', sectionId: HOME_SECTION_ID.modelPaper },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', sectionId: HOME_SECTION_ID.about },
      { label: 'Our Team', sectionId: HOME_SECTION_ID.team },
    ],
  },
] as const;

export const FOOTER_STUDENT_TEXT = {
  title: 'Student',
  login: 'Login',
  signUp: 'Sign up',
  myLearning: 'My learning',
} as const;

// Static closing chapters of the interactive book. Topic and batch pages are
// generated from the live catalogue and inserted before these.
export const BOOK_TEXT = {
  ariaLabel: 'Interactive letaEd book',
  instruction: 'Click a page to turn it',
  previousPage: 'Turn back one page',
  nextPage: 'Turn to the next page',
  pagePosition: (current: number, total: number) =>
    `Spread ${current} of ${total}`,
  introPage: {
    label: 'Chapter / 01',
    title: 'Find your',
    titleEmphasis: 'class.',
    description:
      'Every subject is broken into topics. Turn the page to see the topics, lessons and batches open right now.',
    items: [
      '01 — Topic-wise classes',
      '02 — Practice & tests',
      '03 — Model papers',
    ],
  },
  topicLabel: (subject: string, level: string | null) =>
    level ? `${subject} / ${level}` : subject,
  lessonsHeading: 'Lessons in this topic',
  batchListLabel: (part: number) =>
    `Batches / ${String(part).padStart(2, '0')}`,
  moreBatchesSoon: 'More batches will be listed here as they open',
  exploreMoreBatches: 'Explore more batches',
  loadingTitle: 'Loading',
  loadingTitleEmphasis: 'topics.',
  errorTitle: 'Topics',
  errorTitleEmphasis: 'unavailable.',
  closingPages: [
    {
      label: 'Chapter / 02',
      title: 'Test your',
      titleEmphasis: 'progress.',
      description:
        'Build a profile and receive a different test generated from your learning material',
      items: [
        'AI Test Paper',
        'Daily paper generation',
        'Performance percentile',
      ],
    },
    {
      label: 'Chapter / 03',
      title: 'Prepare for',
      titleEmphasis: "what's next.",
      description:
        'AI model papers are planned for delivery before examinations, with teacher review',
      items: ["Last 5 years' papers", 'Subject material', 'Exam preparation'],
    },
    {
      label: 'Chapter / 04',
      title: 'Begin your',
      titleEmphasis: 'chapter.',
      description:
        'Choose your first topic and start building a stronger study routine',
      items: ['Classes', 'Assessment', 'Model papers'],
    },
  ],
} as const;
