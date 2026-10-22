import type { IconName } from './icons';

// Content for the sign-in landing page, below the sign-in form.

export type TopicPreview = {
  title: string;
  level: string;
  icon: IconName;
  // Catalogue topic this preview represents, when batches are published.
  catalogueTopicId?: string;
};

// The topics SriDha Academy teaches today, all Class 11 Accountancy. A topic
// shows as open once its catalogue topic has published batches.
export const TOPIC_PREVIEWS: readonly TopicPreview[] = [
  {
    title: 'GST',
    level: 'Class 11',
    icon: 'topicGst',
    catalogueTopicId: 'topic_accounts_gst_class_11',
  },
  {
    title: 'Rectification of errors',
    level: 'Class 11',
    icon: 'topicRectification',
  },
  {
    title: 'Trial balance',
    level: 'Class 11',
    icon: 'topicTrialBalance',
  },
  {
    title: 'Bank reconciliation statement',
    level: 'Class 11',
    icon: 'topicBank',
  },
];

// The sign-in animation: loose words from a whole subject go into the
// SriDha Academy machine and come out as ready topics (TOPIC_PREVIEWS).
export const TOPIC_MACHINE_TEXT = {
  label:
    'Animation: loose words from a whole subject, such as Ledger, Debit and Suspense account, pour into the SriDha Academy machine and come out as ready topics: GST, Rectification of errors, Trial balance and Bank reconciliation statement',
  inputWords: [
    'Accountancy',
    'Ledger',
    'Debit',
    'Credit',
    'Journal',
    'Vouchers',
    'Suspense A/c',
    'Cash book',
    'Passbook',
    'Errors',
    'Invoice',
    'Input credit',
    'Tax',
    'Balances',
    'Overdraft',
    'Chapter 9',
    'Syllabus',
    'Theory',
  ],
  cardLabel: (level: string) => `${level} · Topic`,
  cardStatus: 'Ready to learn',
} as const;

export const LANDING_TEXT = {
  illustrationLabel:
    'Illustration: four students learning online — on a laptop, a tablet, in a notebook and on a phone',
  topicsTitle: 'Pick a topic,',
  topicsTitleEmphasis: 'not a whole subject.',
  topicsDescription:
    'Every batch teaches one focused topic. Choose the exact topic you need and learn it in a single batch',
  searchLabel: 'Search topics',
  searchPlaceholder: 'Type the topic you want to learn, e.g. Trial balance',
  topicOpen: 'Batches open',
  topicSoon: 'Batches opening soon',
  topicAction: (topic: string) => `Join SriDha Academy to learn ${topic}`,
  noTopicsTitle: 'No topics match your search',
  noTopicsMessage: 'Try another topic name, such as GST or Trial balance',
  seeAllTopics: 'Join to see all topics',
  featuresEyebrow: 'In three chapters',
  featureChapter: (index: number) =>
    `Chapter ${String(index).padStart(2, '0')}`,
  featurePlate: (index: number) => `Plate ${String(index).padStart(2, '0')}`,
  featuresTitle: 'How',
  featuresTitleEmphasis: 'SriDha Academy works.',
  features: [
    {
      illustration: 'live',
      title: 'Topic-wise live classes',
      description:
        'Join a live batch for one topic. Ask questions and clear doubts while the class is on',
    },
    {
      illustration: 'test',
      title: 'AI test papers',
      description:
        'Practise with a different paper for every student, marked with a percentile when you finish',
    },
    {
      illustration: 'model',
      title: 'AI model papers',
      description:
        'Model papers built from the last five years of exams, planned for delivery seven days before your exam',
    },
  ],
} as const;

export const AUTH_FOOTER_TEXT = {
  lead: 'SriDha Academy teaches one topic at a time, so students learn a single concept well and build confidence along the way',
  columns: [
    {
      title: 'Topics',
      // The topics taught right now, from the same list as the topic cards.
      links: TOPIC_PREVIEWS.map(topic => topic.title),
    },
  ],
  accountTitle: 'Account',
  login: 'Log in',
  register: 'Join for free',
  forgotPassword: 'Forgot password',
  copyright: '© 2026 SriDha Academy',
  note: 'Topic-wise learning for school, competitive and professional exams',
} as const;
