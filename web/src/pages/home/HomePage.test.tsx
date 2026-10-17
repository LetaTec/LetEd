import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AxiosError, AxiosHeaders } from 'axios';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';

import { AuthProvider } from '@context/AuthContext';
import { ToastProvider } from '@context/ToastContext';
import { getCurrentSession, loginStudent } from '@services/auth/api';
import { getCatalogue } from '@services/catalogue/api';
import { createEnrolment } from '@services/enrolments/api';
import { catalogueFixture, openBatch } from '@/test/catalogueFixture';

import HomePage from './HomePage';

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

let currentSearch = '';

const LocationProbe = () => {
  currentSearch = useLocation().search;
  return null;
};

const renderHome = (initialEntry: string) =>
  render(
    <ToastProvider>
      <AuthProvider>
        <MemoryRouter initialEntries={[initialEntry]}>
          <LocationProbe />
          <Routes>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    </ToastProvider>,
  );

describe('HomePage course selection', () => {
  beforeEach(() => {
    vi.mocked(getCatalogue).mockResolvedValue(catalogueFixture);
    vi.mocked(getCurrentSession).mockRejectedValue(unauthenticated());
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

  it('keeps the selected batch through sign-in and reserves it for the signed-in student', async () => {
    const user = userEvent.setup();
    renderHome('/?subject=accounts');

    const courseDialog = await screen.findByRole('dialog', {
      name: /learn\s*accounts/i,
    });
    expect(
      within(courseDialog).getByText(/each batch covers only the lessons/i),
    ).toBeInTheDocument();

    const selectButtons = within(courseDialog).getAllByRole('button', {
      name: 'Select batch',
    });
    expect(selectButtons[1]).toBeDisabled();
    await user.click(selectButtons[0]);

    // Unauthenticated: registration opens and the selection is kept.
    const authDialog = await screen.findByRole('dialog', {
      name: /create your\s*account/i,
    });
    expect(
      within(authDialog).getByText(
        'Learn GST for Class 11 — 1st & 2nd November',
      ),
    ).toBeInTheDocument();
    expect(currentSearch).toContain(`batch=${openBatch.id}`);

    await user.click(
      within(authDialog).getByRole('button', { name: 'Sign in' }),
    );
    const loginDialog = await screen.findByRole('dialog', {
      name: /welcome\s*back/i,
    });
    await user.type(
      within(loginDialog).getByLabelText('Email ID'),
      'asha@example.com',
    );
    await user.type(
      within(loginDialog).getByLabelText('Password'),
      'correct-horse-1',
    );
    await user.click(
      within(loginDialog).getByRole('button', { name: /^sign in$/i }),
    );

    // Back on the intended batch, now as a signed-in student.
    const reviewDialog = await screen.findByRole('dialog', {
      name: /review your\s*selection/i,
    });
    await waitFor(() => expect(currentSearch).not.toContain('auth='));
    expect(currentSearch).toContain(`batch=${openBatch.id}`);

    await user.click(
      within(reviewDialog).getByRole('button', { name: /reserve seat/i }),
    );

    await waitFor(() =>
      expect(createEnrolment).toHaveBeenCalledWith({ batchId: openBatch.id }),
    );
    expect(
      await within(reviewDialog).findByText('Seat reserved — payment pending'),
    ).toBeInTheDocument();
  });

  it('explains when a subject has no published topics yet', async () => {
    renderHome('/?subject=neet');

    const dialog = await screen.findByRole('dialog', { name: /learn\s*neet/i });
    expect(within(dialog).getByText('Coming soon')).toBeInTheDocument();
    expect(
      within(dialog).queryByRole('button', { name: /counselling/i }),
    ).not.toBeInTheDocument();
  });
});
