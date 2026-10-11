// URL search params that carry auth and selection state, so the intended
// course and batch survive the sign-in dialog, a page refresh or a redirect.
export const AUTH_QUERY_PARAM = {
  view: 'auth',
  redirectTo: 'redirect_to',
  resetToken: 'token',
} as const;

export const AUTH_VIEW = {
  login: 'login',
  register: 'register',
  forgotPassword: 'forgot-password',
} as const;

export type AuthView = (typeof AUTH_VIEW)[keyof typeof AUTH_VIEW];

export const AUTH_VIEWS: readonly AuthView[] = Object.values(AUTH_VIEW);

export const AUTH_ERROR_CODE = {
  unauthenticated: 'UNAUTHENTICATED',
  sessionExpired: 'SESSION_EXPIRED',
  emailAlreadyRegistered: 'EMAIL_ALREADY_REGISTERED',
} as const;

export const PASSWORD_MIN_LENGTH = 8;

export const AUTH_TEXT = {
  loginEyebrow: 'Student / Login',
  loginTitle: 'Welcome',
  loginTitleEmphasis: 'back.',
  registerEyebrow: 'Student / Sign up',
  registerTitle: 'Create your',
  registerTitleEmphasis: 'account.',
  forgotEyebrow: 'Student / Password',
  forgotTitle: 'Reset your',
  forgotTitleEmphasis: 'password.',
  resetEyebrow: 'Student / New password',
  resetTitle: 'Choose a new',
  resetTitleEmphasis: 'password.',
  continueSelectionHint: 'Sign in or create an account to continue with',
  fullNameLabel: 'Student name',
  fullNamePlaceholder: 'Full name',
  dateOfBirthLabel: 'Date of birth',
  mobileLabel: 'Mobile number',
  mobilePlaceholder: '+91',
  emailLabel: 'Email ID',
  emailPlaceholder: 'you@example.com',
  standardLabel: 'Standard / Exam',
  standardPlaceholder: 'Select',
  streamLabel: 'Stream',
  streamPlaceholder: 'Select',
  addressLabel: 'Address',
  addressPlaceholder: 'City / address',
  passwordLabel: 'Password',
  passwordPlaceholder: '••••••••',
  newPasswordLabel: 'New password',
  confirmPasswordLabel: 'Confirm password',
  rememberMeLabel: 'Keep me signed in',
  hidePasswordLabel: 'Hide password',
  showPasswordLabel: 'Show password',
  registerSubmitLabel: 'Create account',
  loginSubmitLabel: 'Sign in',
  forgotSubmitLabel: 'Send reset link',
  resetSubmitLabel: 'Update password',
  forgotPasswordLink: 'Forgot password?',
  haveAccountPrompt: 'Already have an account?',
  noAccountPrompt: 'New to letaEd?',
  switchToLogin: 'Sign in',
  switchToRegister: 'Create an account',
  backToLogin: 'Back to sign in',
  registerFootnote: 'Your details are used only to manage your letaEd account',
  forgotSuccessMessage:
    "If an account exists for that email, you'll receive a reset link shortly",
  resetSuccessMessage: 'Password updated. Sign in with your new password',
  resetMissingToken:
    'This reset link is incomplete. Request a new link from the sign-in screen',
  registeredToast: 'Your student account has been created',
  loggedInToast: 'Signed in',
  loggedOutToast: 'Signed out',
  logoutErrorToast: 'We could not sign you out. Please try again',
  sessionExpiredToast: 'Your session has expired. Please sign in again',
  emailAlreadyRegisteredAction: 'Sign in instead',
  fullNameRequired: 'Enter your full name',
  emailInvalid: 'Enter a valid email address',
  passwordRequired: 'Enter your password',
  passwordMinLength: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
  passwordMismatch: "Passwords don't match",
  dateOfBirthRequired: 'Enter your date of birth',
  mobileInvalid: 'Enter a valid mobile number',
  standardRequired: 'Select your standard or exam',
} as const;
