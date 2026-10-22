import {
  ABOUT_SECTION_ID,
  APP_ROUTES,
  HOME_SECTION_ID,
  toPageSection,
} from './routes';

export const BRAND = {
  name: 'SriDha Academy',
  footerLead:
    'A focused education platform for topic-wise classes, assessment, examination preparation and AI model papers',
  copyright: '© 2026 SriDha Academy',
  footerNote: 'Designed as an editorial learning experience',
} as const;

// isSection: a jump to a section of a page, never shown as the current page.
export const NAV_LINKS = [
  {
    label: 'Topics',
    to: toPageSection(APP_ROUTES.HOME, HOME_SECTION_ID.topics),
    isSection: true,
  },
  { label: 'AI Test', to: APP_ROUTES.AI_TEST, isSection: false },
  { label: 'Model Paper', to: APP_ROUTES.MODEL_PAPER, isSection: false },
  { label: 'About', to: APP_ROUTES.ABOUT, isSection: false },
] as const;

export const HEADER_TEXT = {
  myLearning: 'My learning',
  logout: 'Log out',
  openMenu: 'Open menu',
  closeMenu: 'Close menu',
  primaryNavigation: 'Primary',
  homeLabel: 'SriDha Academy home',
  skipToContent: 'Skip to content',
} as const;

export const HERO_TEXT = {
  kicker: 'Learning / 01',
  title: 'Big Subjects.',
  titleEmphasis: 'Broken Into',
  titleEnd: 'Small Victories',
  lead: 'A focused learning environment for students preparing for school, competitive examinations and professional pathways — taught topic by topic',
  primaryAction: 'Explore learning',
  secondaryAction: 'My learning',
  // Topic search in the hero
  searchLabel: 'Find your topic',
  searchPlaceholder: 'Search a topic or subtopic, e.g. Suspense account',
  searchEmpty: 'No topic matches yet. Try GST or Trial balance',
  searchResultsLabel: 'Matching topics',
  searchOpen: 'Batches open',
  searchSoon: 'Batches opening soon',
  stats: [
    { value: '03', label: 'Learning paths' },
    { value: '04', label: 'Topics ready' },
    { value: '100', label: 'Students / batch' },
  ],
} as const;

// Animated explainer: a whole subject breaking into topics, then one topic.
export const TOPIC_BREAKDOWN_TEXT = {
  eyebrow: 'Topic-wise learning',
  title: 'Not the whole subject.',
  titleEmphasis: 'One topic at a time.',
  description:
    'A subject like Accounts has many chapters. At SriDha Academy you join a batch for one topic, learn its lessons and move on when you are ready',
  subjectLabel: 'Accounts · Class 11',
  subjectCaption: 'The whole subject',
  exampleNote: 'Illustration: chapters in Class 11 Accounts',
  tiles: [
    'Basics of accounting',
    'Journal entries',
    'Ledger',
    'Trial balance',
    'Depreciation',
    'GST',
  ],
  selectedTile: 'GST',
  steps: [
    {
      label: 'A whole subject',
      description: 'Everything at once feels overwhelming',
    },
    {
      label: 'Broken into topics',
      description: 'Each chapter becomes a focused topic',
    },
    {
      label: 'One topic, one batch',
      description: 'Join only the topic you need',
    },
  ],
  panelEyebrow: 'You join one topic',
  lessonsLabel: 'Lessons in this topic',
  victory: 'Topic complete — a small victory',
  pause: 'Pause animation',
  play: 'Play animation',
  stepLabel: (step: number, label: string) => `Step ${step}: ${label}`,
  figureLabel:
    'Animation: a whole subject, Accounts, splits into six topics, and one topic, GST, is chosen with its lessons ticked off one by one',
} as const;

export const AI_TEST_TEXT = {
  eyebrow: '02 / AI Test Paper',
  title: 'Practice',
  titleEmphasis: 'without repetition.',
  description:
    'Test papers are generated from the subject material using our in-house tools, so each student receives a different paper for the topics they are studying, followed by marking and a percentile result',
  action: 'Start a sample test',
} as const;

export const TOPICS_TEXT = {
  title: 'Topics',
  titleEmphasis: 'to begin with.',
  description:
    'Each topic is a focused batch with its own lessons. Open a topic to see its lessons and batches.',
  openTopicLabel: (topic: string) => `View batches for ${topic}`,
} as const;

export const PROGRAMS_TEXT = {
  title: 'The',
  titleEmphasis: 'three paths.',
  description:
    'SriDha Academy brings three services together: topic-wise online classes, AI test papers and AI model papers',
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
  eyebrow: 'SriDha Academy / About',
  title: 'Built around',
  titleEmphasis: 'learning.',
  paragraphs: [
    'SriDha Academy is designed around a simple proposition: make the path from choosing a topic to preparing for an examination feel coherent',
    'Instead of selling a whole subject at once, we break it into chapters and topics, teach them in focused batches and help students measure progress along the way',
  ],
  note: 'Topic-wise online classes · AI assessment · AI model paper',
  readMore: 'Read our story',
} as const;

export const TEAM_TEXT = {
  title: 'People behind',
  titleEmphasis: 'the page.',
  description:
    'Faculty profiles will be published here as each topic team is confirmed',
  meetTutors: 'Meet your tutors',
  members: [
    { initial: 'A', name: 'Accounts Faculty', role: 'Topic Faculty' },
    { initial: 'E', name: 'Economics Faculty', role: 'Topic Faculty' },
    { initial: 'M', name: 'Mathematics Faculty', role: 'Topic Faculty' },
    {
      initial: 'S',
      name: 'SriDha Academy Team',
      role: 'Education & Operations',
    },
  ],
} as const;

export const CTA_TEXT = {
  eyebrow: 'Start here / 01',
  title: 'Turn the next page',
  titleEmphasis: 'with us.',
  action: 'Browse topics',
} as const;

export const FOOTER_COLUMNS = [
  {
    title: 'Explore',
    links: [
      {
        label: 'Topics',
        to: toPageSection(APP_ROUTES.HOME, HOME_SECTION_ID.topics),
      },
      { label: 'AI Test', to: APP_ROUTES.AI_TEST },
      { label: 'Model Paper', to: APP_ROUTES.MODEL_PAPER },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: APP_ROUTES.ABOUT },
      {
        label: 'Meet the tutors',
        to: toPageSection(APP_ROUTES.ABOUT, ABOUT_SECTION_ID.tutors),
      },
    ],
  },
] as const;

export const FOOTER_STUDENT_TEXT = {
  title: 'Student',
  myLearning: 'My learning',
} as const;

// Static closing chapters of the interactive book. Topic and batch pages are
// generated from the live catalogue and inserted before these.
export const BOOK_TEXT = {
  ariaLabel: 'Interactive SriDha Academy book',
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
  topicLabel: (level: string | null) => (level ? `Topic / ${level}` : 'Topic'),
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
