import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AxiosError, AxiosHeaders } from 'axios';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';

import { AuthProvider } from '@context/AuthContext';
import { ToastProvider } from '@context/ToastContext';
import { getCurrentSession, loginStudent } from '@services/auth/api';
import { getCatalogue } from '@services/catalogue/api';
import { createEnrolment } from '@services/enrolments/api';
import { catalogueFixture, openBatch } from '@/test/catalogueFixture';

import { routes } from './router';

vi.mock('@services/catalogue/api', () => ({ getCatalogue: vi.fn() }));
vi.mock('@services/auth/api', () => ({
  getCurrentSession: vi.fn(),
  loginStudent: vi.fn(),
  registerStudent: vi.fn(),
  logoutStudent: vi.fn(),
  requestPasswordReset: vi.fn(),
  confirmPasswordReset: vi.fn(),
}));
vi.mock('@services/enrolments/api', () => ({
  createEnrolment: vi.fn(),
  listEnrolments: vi.fn(),
}));

const student = {
  id: '6f0a3c1e-0000-4000-8000-000000000001',
  email: 'asha@example.com',
  student: {
    id: '6f0a3c1e-0000-4000-8000-000000000002',
    fullName: 'Asha Verma',
    standard: 'CLASS_11' as const,
    stream: 'COMMERCE' as const,
    streamOther: null,
  },
};

const unauthenticated = () =>
  new AxiosError('Unauthorized', 'ERR_BAD_REQUEST', undefined, undefined, {
    status: 401,
    statusText: 'Unauthorized',
    headers: {},
    config: { headers: new AxiosHeaders() },
    data: {
      message: 'Please sign in to continue',
      code: 'UNAUTHENTICATED',
      details: null,
    },
  });

// Pages are lazy-loaded route chunks; the first load in a test run can take
// longer than Testing Library's default wait.
const LAZY_PAGE_TIMEOUT_MS = 5000;
const GST_TOPIC_ID = 'topic_accounts_gst_class_11';

const renderApp = (initialEntry: string) => {
  const router = createMemoryRouter(routes, { initialEntries: [initialEntry] });

  render(
    <ToastProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ToastProvider>,
  );

  return router;
};

describe('app routing', () => {
  beforeEach(() => {
    vi.mocked(getCatalogue).mockResolvedValue(catalogueFixture);
    vi.mocked(loginStudent).mockResolvedValue(student);
    vi.mocked(createEnrolment).mockResolvedValue({
      id: 'enrolment-1',
      status: 'PENDING_PAYMENT',
      createdAt: '2026-10-10T09:00:00Z',
      subject: { id: 'subject_accounts', slug: 'accounts', name: 'Accounts' },
      topic: { ...catalogueFixture[0].chapters[0].topics[0] },
      batch: { ...openBatch, seatsRemaining: 99 },
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('shows only the sign-in page to visitors and returns them to their batch after signing in', async () => {
    vi.mocked(getCurrentSession).mockRejectedValue(unauthenticated());
    const user = userEvent.setup();
    const router = renderApp(`/?topic=${GST_TOPIC_ID}&batch=${openBatch.id}`);

    // The homepage is not rendered; the visitor lands on the sign-in page.
    await screen.findByRole('heading', { name: 'Welcome back' });
    expect(router.state.location.pathname).toBe('/login');
    const redirectTo = new URLSearchParams(router.state.location.search).get(
      'redirect_to',
    );
    expect(redirectTo).toBe(`/?topic=${GST_TOPIC_ID}&batch=${openBatch.id}`);
    expect(
      screen.queryByRole('group', { name: 'Interactive SriDha Academy book' }),
    ).not.toBeInTheDocument();

    // Switching to registration keeps the redirect.
    await user.click(screen.getAllByRole('link', { name: 'Join for free' })[0]);
    await screen.findByRole('heading', { name: 'Create your student account' });
    expect(router.state.location.pathname).toBe('/register');
    expect(router.state.location.search).toContain('redirect_to=');

    await user.click(screen.getAllByRole('link', { name: 'Log in' })[0]);
    await screen.findByRole('heading', { name: 'Welcome back' });
    await user.type(screen.getByLabelText('Email ID'), 'asha@example.com');
    await user.type(screen.getByLabelText('Password'), 'correct-horse-1');
    await user.click(screen.getByRole('button', { name: /^sign in$/i }));

    // Signed in: back on the homepage with the chosen batch ready to review.
    const review = await screen.findByRole(
      'dialog',
      { name: /review your\s*selection/i },
      { timeout: LAZY_PAGE_TIMEOUT_MS },
    );
    expect(router.state.location.pathname).toBe('/');
    expect(router.state.location.search).toContain(`batch=${openBatch.id}`);

    await user.click(
      within(review).getByRole('button', { name: /reserve seat/i }),
    );
    await waitFor(() =>
      expect(createEnrolment).toHaveBeenCalledWith({ batchId: openBatch.id }),
    );
    expect(
      await within(review).findByText('Seat reserved — payment pending'),
    ).toBeInTheDocument();
  });

  it('sends a signed-in student past the sign-in page', async () => {
    vi.mocked(getCurrentSession).mockResolvedValue(student);
    const router = renderApp('/login');

    await screen.findByRole(
      'group',
      { name: 'Interactive SriDha Academy book' },
      { timeout: LAZY_PAGE_TIMEOUT_MS },
    );
    expect(router.state.location.pathname).toBe('/');
  });

  it('opens a topic from the topic cards and keeps coming-soon topics disabled', async () => {
    vi.mocked(getCurrentSession).mockResolvedValue(student);
    const user = userEvent.setup();
    const router = renderApp('/');

    const gst = await screen.findByRole(
      'button',
      { name: 'View batches for GST' },
      { timeout: LAZY_PAGE_TIMEOUT_MS },
    );
    expect(
      screen.getByRole('button', { name: 'View batches for Depreciation' }),
    ).toBeDisabled();

    await user.click(gst);
    const dialog = await screen.findByRole('dialog', {
      name: /learn gst for class 11/i,
    });
    expect(router.state.location.search).toContain(`topic=${GST_TOPIC_ID}`);
    expect(
      within(dialog).getAllByRole('button', { name: 'Select batch' }),
    ).toHaveLength(2);
  });
});
