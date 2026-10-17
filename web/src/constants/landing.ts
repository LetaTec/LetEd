import type { IconName } from './icons';

// Content for the sign-in landing page, below the sign-in form.

export type TopicPreview = {
  title: string;
  level: string;
  icon: IconName;
  // Catalogue topic this preview represents, when batches are published.
  catalogueTopicId?: string;
};

// SriDha Academy teaches topics, not subjects. Only previews linked to a
// catalogue topic with published batches show as open.
export const TOPIC_PREVIEWS: readonly TopicPreview[] = [
  {
    title: 'GST',
    level: 'Class 11',
    icon: 'topicGst',
    catalogueTopicId: 'topic_accounts_gst_class_11',
  },
  {
    title: 'Depreciation',
    level: 'Class 11',
    icon: 'topicDepreciation',
  },
  {
    title: 'Journal entries',
    level: 'Class 11',
    icon: 'topicJournal',
  },
  {
    title: 'Bank reconciliation',
    level: 'Class 11',
    icon: 'topicBank',
  },
  {
    title: 'Trial balance',
    level: 'Class 11',
    icon: 'topicTrialBalance',
  },
  {
    title: 'Demand and supply',
    level: 'Class 12',
    icon: 'topicDemandSupply',
  },
  {
    title: 'Matrices',
    level: 'Class 12',
    icon: 'topicMatrices',
  },
  {
    title: 'Probability',
    level: 'Class 12',
    icon: 'topicProbability',
  },
];

export const LANDING_TEXT = {
  illustrationLabel:
    'Illustration: four students learning online — on a laptop, a tablet, in a notebook and on a phone',
  topicsTitle: 'Pick a topic,',
  topicsTitleEmphasis: 'not a whole subject.',
  topicsDescription:
    'Every batch teaches one focused topic. Choose the exact topic you need and learn it in a single batch',
  searchLabel: 'Search topics',
  searchPlaceholder: 'Type the topic you want to learn, e.g. Depreciation',
  topicOpen: 'Batches open',
  topicSoon: 'Coming soon',
  topicAction: (topic: string) => `Join SriDha Academy to learn ${topic}`,
  noTopicsTitle: 'No topics match your search',
  noTopicsMessage: 'Try another topic name, such as GST or Depreciation',
  seeAllTopics: 'Join to see all topics',
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
      title: 'Popular topics',
      links: ['GST', 'Depreciation', 'Journal entries', 'Demand and supply'],
    },
    {
      title: 'More topics',
      links: [
        'Bank reconciliation',
        'Trial balance',
        'Matrices',
        'Probability',
      ],
    },
  ],
  accountTitle: 'Account',
  login: 'Log in',
  register: 'Join for free',
  forgotPassword: 'Forgot password',
  copyright: '© 2026 SriDha Academy',
  note: 'Topic-wise learning for school, competitive and professional exams',
} as const;
