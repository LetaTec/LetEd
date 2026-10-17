export const APP_ROUTES = {
  HOME: '/',
  MY_LEARNING: '/my-learning',
  BATCHES: '/batches',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
} as const;

// In-page anchors on the homepage, shared by the header, footer and CTAs.
export const HOME_SECTION_ID = {
  home: 'home',
  learningModel: 'learning-model',
  aiTest: 'ai-test',
  topics: 'topics',
  programs: 'programs',
  modelPaper: 'model-paper',
  about: 'about',
  team: 'team',
} as const;

export const toSectionHref = (sectionId: string) => `#${sectionId}`;
