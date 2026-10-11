import { expect, test, type Page } from '@playwright/test';

const SCREENSHOT_DIR = 'test-results/screenshots';
const NOVEMBER_BATCH = 'batch_gst_class_11_november';

const uniqueEmail = (label: string) =>
  `${label}-${Date.now()}-${Math.floor(Math.random() * 1e6)}@example.com`;

const book = (page: Page) => page.locator('[aria-roledescription="book"]');

const bookBox = async (page: Page) => {
  const box = await book(page).boundingBox();
  expect(box).not.toBeNull();
  const scrollY = await page.evaluate(() => window.scrollY);
  // Document coordinates rounded to 0.1px, so ordinary scrolling and
  // sub-pixel measurement noise do not count as movement.
  const round = (value: number) => Math.round(value * 10) / 10;
  return {
    x: round(box!.x),
    y: round(box!.y + scrollY),
    width: round(box!.width),
    height: round(box!.height),
  };
};

const registerThroughDialog = async (page: Page, email: string) => {
  const dialog = page.getByRole('dialog', { name: /create your\s*account/i });
  await expect(dialog).toBeVisible();
  await dialog.getByLabel('Student name').fill('Asha Verma');
  await dialog.getByLabel('Date of birth').fill('2009-04-12');
  await dialog.getByLabel('Mobile number').fill('+91 98765 43210');
  await dialog.getByLabel('Email ID').fill(email);
  await dialog.getByLabel('Password', { exact: true }).fill('correct-horse-1');
  await dialog.getByLabel('Standard / Exam').selectOption('CLASS_11');
  await dialog.getByLabel('Stream').selectOption('COMMERCE');
  await dialog.getByRole('button', { name: /create account/i }).click();
};

test.describe('homepage', () => {
  test('renders every section without horizontal scrolling', async ({
    page,
  }, testInfo) => {
    await page.goto('/');
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: /big subjects\.\s*broken into\s*small victories/i,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', {
        level: 2,
        name: 'Big Subjects. Broken Into Small Victories.',
      }),
    ).toBeVisible();
    await expect(page.getByText('Breaking down the model')).toBeVisible();
    await expect(page.getByText('A broad')).toHaveCount(0);
    await expect(page.getByText('A clearer')).toHaveCount(0);
    await expect(
      page
        .getByText(
          'Learn topic by topic. Build confidence one concept at a time.',
        )
        .first(),
    ).toBeVisible();

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);

    await page.screenshot({
      path: `${SCREENSHOT_DIR}/${testInfo.project.name}-hero.png`,
    });

    // Reveal every section before the full-page capture.
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 400) {
        window.scrollTo({ top: y, behavior: 'instant' });
        await new Promise(resolve => setTimeout(resolve, 60));
      }
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
    await page.waitForTimeout(900);
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/${testInfo.project.name}-home-full.png`,
      fullPage: true,
    });
  });
});

test.describe('interactive book', () => {
  test('stays anchored under pointer movement, scrolling and rapid page turns', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(book(page)).toBeVisible();
    await expect(page.getByText(/spread 1 of/i)).toBeVisible();
    const initial = await bookBox(page);

    for (const [x, y] of [
      [10, 10],
      [700, 400],
      [1200, 800],
      [300, 650],
    ]) {
      await page.mouse.move(x, y, { steps: 5 });
    }
    await book(page).hover();
    expect(await bookBox(page)).toEqual(initial);

    await page.mouse.wheel(0, 500);
    await page.mouse.wheel(0, -500);
    await page.waitForTimeout(300);
    expect(await bookBox(page)).toEqual(initial);

    const next = page.getByRole('button', { name: 'Turn to the next page' });
    await next.click();
    await next.click({ force: true });
    await next.click({ force: true });
    // Only the first click is accepted while a page is turning.
    await expect(page.getByText(/spread 2 of/i)).toBeVisible();
    await page.waitForTimeout(1400);
    await expect(page.getByText(/spread 2 of/i)).toBeVisible();
    expect(await bookBox(page)).toEqual(initial);

    await page.getByRole('button', { name: 'Turn back one page' }).click();
    await expect(page.getByText(/spread 1 of/i)).toBeVisible();
    await page.waitForTimeout(1400);
    expect(await bookBox(page)).toEqual(initial);

    await page.keyboard.press('ArrowRight');
    await expect(page.getByText(/spread 2 of/i)).toBeVisible();
  });

  test('shows live batches and asks a visitor to register before selecting', async ({
    page,
  }, testInfo) => {
    await page.goto('/');
    await expect(
      book(page).getByText('Learn GST for Class 11').first(),
    ).toBeVisible();

    await page.getByRole('button', { name: 'Turn to the next page' }).click();
    const selectInBook = book(page).getByRole('button', {
      name: /select batch: learn gst for class 11, 1st & 2nd november/i,
    });
    await expect(selectInBook).toBeVisible();
    await page.waitForTimeout(1300);
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/${testInfo.project.name}-book-batches.png`,
    });

    await selectInBook.click();
    const dialog = page.getByRole('dialog', { name: /create your\s*account/i });
    await expect(dialog).toBeVisible();
    await expect(
      dialog.getByText('Learn GST for Class 11 — 1st & 2nd November'),
    ).toBeVisible();
    await expect(page).toHaveURL(new RegExp(`batch=${NOVEMBER_BATCH}`));
  });
});

test.describe('student journey', () => {
  test('explore more batches is only for signed-in students', async ({
    page,
    request,
  }, testInfo) => {
    const email = uniqueEmail(`${testInfo.project.name}-batches`);
    await request.post('/api/auth/register', {
      data: {
        fullName: 'Meera Iyer',
        email,
        password: 'correct-horse-1',
        dateOfBirth: '2008-06-02',
        mobile: '9876543211',
        standard: 'CLASS_11',
        stream: 'COMMERCE',
        address: null,
      },
    });

    await page.goto('/');
    await page.getByRole('button', { name: 'Turn to the next page' }).click();
    await page.waitForTimeout(1300);
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/${testInfo.project.name}-book-batch-spread.png`,
    });

    await book(page)
      .getByRole('link', { name: /explore more batches/i })
      .click();
    await expect(page).toHaveURL(/auth=login/);
    await expect(page).toHaveURL(/redirect_to=%2Fbatches/);

    const dialog = page.getByRole('dialog', { name: /welcome\s*back/i });
    await dialog.getByLabel('Email ID').fill(email);
    await dialog
      .getByLabel('Password', { exact: true })
      .fill('correct-horse-1');
    await dialog.getByRole('button', { name: /^sign in$/i }).click();

    await expect(page).toHaveURL(/\/batches$/);
    await expect(
      page.getByRole('heading', { level: 1, name: /all\s*batches/i }),
    ).toBeVisible();
    await expect(page.getByText('1st & 2nd November')).toBeVisible();
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/${testInfo.project.name}-batches-page.png`,
      fullPage: true,
    });

    await page.getByRole('button', { name: 'Select batch' }).first().click();
    await expect(
      page.getByRole('dialog', { name: /review your\s*selection/i }),
    ).toBeVisible();
  });

  test('register from a batch, reserve the seat, restore the session and log out', async ({
    page,
  }, testInfo) => {
    const email = uniqueEmail(testInfo.project.name);

    await page.goto('/#courses');
    await page
      .getByRole('button', { name: 'View topics and batches for Accounts' })
      .click();
    const courseDialog = page.getByRole('dialog', {
      name: /learn\s*accounts/i,
    });
    await expect(courseDialog).toBeVisible();
    await expect(courseDialog.getByText('What is GST')).toBeVisible();
    await expect(courseDialog.getByText('Faculty').first()).toBeVisible();
    await expect(
      courseDialog.getByText('To be announced').first(),
    ).toBeVisible();
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/${testInfo.project.name}-course-dialog.png`,
    });

    await courseDialog
      .getByRole('button', { name: 'Select batch' })
      .first()
      .click();
    await registerThroughDialog(page, email);

    const review = page.getByRole('dialog', {
      name: /review your\s*selection/i,
    });
    await expect(review).toBeVisible();
    await expect(
      review.getByText('1st & 2nd November · November batch'),
    ).toBeVisible();
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/${testInfo.project.name}-review.png`,
    });

    await review.getByRole('button', { name: /reserve seat/i }).click();
    await expect(
      review.getByText('Seat reserved — payment pending'),
    ).toBeVisible();

    await review.getByRole('link', { name: /go to my learning/i }).click();
    await expect(page).toHaveURL(/\/my-learning$/);
    await expect(page.getByText('Signed in as Asha Verma')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'Learn GST for Class 11' }),
    ).toBeVisible();

    // Session restoration after a full page reload.
    await page.reload();
    await expect(page.getByText('Signed in as Asha Verma')).toBeVisible();
    await page.screenshot({
      path: `${SCREENSHOT_DIR}/${testInfo.project.name}-my-learning.png`,
      fullPage: true,
    });

    if (testInfo.project.name === 'mobile') {
      await page.getByRole('button', { name: 'Open menu' }).click();
    }
    await page.getByRole('button', { name: 'Log out' }).first().click();
    await expect(page).toHaveURL(/\/$/);

    const response = await page.request.get('/api/enrolments');
    expect(response.status()).toBe(401);
  });

  test('a protected page sends visitors to sign in and back again', async ({
    page,
    request,
  }, testInfo) => {
    const email = uniqueEmail(`${testInfo.project.name}-login`);
    await request.post('/api/auth/register', {
      data: {
        fullName: 'Ravi Shah',
        email,
        password: 'correct-horse-1',
        dateOfBirth: '2008-01-20',
        mobile: '9876543210',
        standard: 'CLASS_12',
        stream: 'COMMERCE',
        address: null,
      },
    });

    await page.goto('/my-learning');
    await expect(page).toHaveURL(/auth=login/);
    await expect(page).toHaveURL(/redirect_to=%2Fmy-learning/);

    const dialog = page.getByRole('dialog', { name: /welcome\s*back/i });
    await dialog.getByLabel('Email ID').fill(email);
    await dialog.getByLabel('Password', { exact: true }).fill('wrong-password');
    await dialog.getByRole('button', { name: /^sign in$/i }).click();
    await expect(
      dialog.getByText('The email or password is incorrect'),
    ).toBeVisible();

    await dialog
      .getByLabel('Password', { exact: true })
      .fill('correct-horse-1');
    await dialog.getByRole('button', { name: /^sign in$/i }).click();
    await expect(page).toHaveURL(/\/my-learning$/);
    await expect(page.getByText('No topics selected yet')).toBeVisible();
  });

  test('model paper waitlist sign-ups are stored', async ({ page }) => {
    await page.goto('/#model-paper');
    await expect(
      page.getByRole('heading', { name: /ai model\s*paper/i }),
    ).toBeVisible();
    await expect(page.getByText(/counselling/i)).toHaveCount(0);
    await expect(page.getByText(/guess paper/i)).toHaveCount(0);

    await page.getByRole('button', { name: 'Join waitlist' }).click();
    const dialog = page.getByRole('dialog', { name: /prepare\s*ahead/i });
    await dialog.getByLabel('Email').fill('asha@example.com');
    await dialog.getByLabel('Exam').selectOption('NEET');
    await dialog.getByRole('button', { name: /join waitlist/i }).click();
    await expect(
      page.getByText('You have been added to the model paper waitlist'),
    ).toBeVisible();
  });
});
