export const APP_ROUTES = {
  HOME: '/',
  MY_LEARNING: '/my-learning',
  BATCHES: '/batches',
  ABOUT: '/about',
  AI_TEST: '/ai-test',
  MODEL_PAPER: '/model-paper',
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

// Anchors on the About page.
export const ABOUT_SECTION_ID = {
  tutors: 'tutors',
} as const;

export const toSectionHref = (sectionId: string) => `#${sectionId}`;

// A link to a section on another page, for router links ("/about#tutors").
export const toPageSection = (pathname: string, sectionId: string) =>
  `${pathname}${toSectionHref(sectionId)}`;
