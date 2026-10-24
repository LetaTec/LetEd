export const PAGE_TEXT = {
  loading: 'Loading',
  notFoundEyebrow: 'Error / 404',
  notFoundTitle: 'This page has',
  notFoundTitleEmphasis: 'turned.',
  notFoundMessage: 'The page you were looking for does not exist or has moved',
  backHome: 'Back to home',
  routeErrorTitle: 'Something went',
  routeErrorTitleEmphasis: 'wrong.',
  routeErrorMessage:
    'Please refresh the page. If the problem continues, try again later.',
  topicsEyebrow: 'Student / Topics',
  topicsTitle: 'Every topic,',
  topicsTitleEmphasis: 'one at a time.',
  topicsNote:
    'Search by topic or by your class, such as Class 11 or Class 12. Open a topic to see its lessons and batches',
  topicsOpenLabel: (topic: string) => `View batches for ${topic}`,
  batchesEyebrow: 'Student / Batches',
  batchesTitle: 'All',
  batchesTitleEmphasis: 'batches.',
  batchesEmptyTitle: 'No batches are open yet',
  batchesEmptyMessage:
    'New topic batches will appear here as soon as they are scheduled',
  myLearningEyebrow: 'Student / My learning',
  myLearningTitle: 'My',
  myLearningTitleEmphasis: 'learning.',
  myLearningGreeting: (name: string, role?: string) =>
    role ? `Signed in as ${name} · ${role}` : `Signed in as ${name}`,
  myLearningEmptyTitle: 'No topics selected yet',
  myLearningEmptyMessage:
    'Browse the topics and select a batch for the topic you want to learn first',
  myLearningBrowse: 'Browse topics',
  myLearningLoadError: 'Your enrolments could not be loaded',
  myLearningPaymentNote:
    'Online payment is not live yet. The SriDha Academy team will contact you to complete payment for reserved seats.',
} as const;
